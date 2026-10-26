/**
 * 跨城就医待遇实测对比模拟器精算引擎 (Multi-City Actuarial Simulator Engine)
 * 遵循全国严肃政务标准，严格 0 Emoji 规范，资金物理守恒率 100%
 */

import { calculateReimbursement } from './calculator';
import { getCityDataByCode as getRawCityData } from '../data';
import type {
  ComparisonScenarioInput,
  CitySimulationOutcome,
  MultiCitySimulationResult,
  CalculateRequest
} from '../data/types';

/**
 * 统筹区编码别名解析映射 (直辖市省级编码到统筹区编码容错映射)
 */
const CITY_CODE_ALIASES: Record<string, string> = {
  '500000': '500100', // 重庆市省级代码 -> 重庆市统筹区代码
  '110000': '110100', // 北京市省级代码 -> 北京市统筹区代码
  '120000': '120100', // 天津市省级代码 -> 天津市统筹区代码
  '310000': '310100', // 上海市省级代码 -> 上海市统筹区代码
};

/**
 * 规范化解析统筹区编码 (支持直辖市省级代码自动映射至统筹区代码)
 */
export function resolveCityCode(code: string): string {
  return CITY_CODE_ALIASES[code] || code;
}

/**
 * 统筹区数据安全检索 (自动支持省级代码如 500000 别名容错解析)
 */
export function getCityDataByCode(cityCode: string) {
  return getRawCityData(resolveCityCode(cityCode));
}

/**
 * 经典跨城/多城就医待遇对比预设组合
 */
export interface MultiCityPreset {
  id: string;
  name: string;
  cities: string[];
  label: string;
}

export const popularMultiCityPresets: MultiCityPreset[] = [
  { id: 'bj-xa-sz', name: '京陕深三城', cities: ['110100', '610100', '440300'], label: '北京 VS 西安 VS 深圳' },
  { id: 'sh-cd', name: '沪蓉争锋', cities: ['310100', '510100'], label: '上海 VS 成都' },
  { id: 'nj-xa-dg', name: '宁陕莞三地', cities: ['320100', '610100', '441900'], label: '南京 VS 西安 VS 东莞' },
  { id: 'gz-xy-jn', name: '穗咸济三城', cities: ['440100', '610400', '370100'], label: '广州 VS 咸阳 VS 济南' },
  { id: 'tc-ya', name: '陕北陕中双城', cities: ['610200', '610600'], label: '铜川 VS 延安' },
  { id: 'bj-sh-gz', name: '北上广一线', cities: ['110100', '310100', '440100'], label: '北京 VS 上海 VS 广州' },
  { id: 'xa-cd-cq', name: '成渝陕西部', cities: ['610100', '510100', '500100'], label: '西安 VS 成都 VS 重庆' },
  { id: 'hz-nj-sh', name: '长三角三强', cities: ['330100', '320100', '310100'], label: '杭州 VS 南京 VS 上海' },
  { id: 'gz-sz-zh', name: '大湾区三核', cities: ['440100', '440300', '440400'], label: '广州 VS 深圳 VS 珠海' }
];

/**
 * 格式化胜出城市名称 (兼顾单城独占与多城并列)
 */
function formatWinnerCityNames(winners: CitySimulationOutcome[]): string {
  if (winners.length === 0) {
    return '无';
  }
  if (winners.length === 1) {
    return winners[0].cityName;
  }
  return `${winners.map(w => w.cityName).join(' / ')} (并列)`;
}

/**
 * 运行跨城就医待遇实测对比模拟测算
 *
 * @param cityCodes 比对的 2~3 个统筹区编码列表
 * @param scenario 统一控制变量的就医场景输入参数
 * @returns 包含各城实测产出、胜出维度、差额指标、守恒审计与精算洞察的完整报告
 */
export function runMultiCitySimulation(
  cityCodes: string[],
  scenario: ComparisonScenarioInput
): MultiCitySimulationResult {
  // 1. 统筹区数量校验 (支持 2~3 个地级市)
  if (!cityCodes || cityCodes.length < 2 || cityCodes.length > 3) {
    throw new Error(`跨城待遇实测对比模拟器仅支持 2~3 个统筹区，当前传入 ${cityCodes?.length ?? 0} 个`);
  }

  // 2. 并行执行各统筹区真实精算推导
  const outcomes: CitySimulationOutcome[] = [];

  for (let i = 0; i < cityCodes.length; i++) {
    const rawCityCode = cityCodes[i];
    const city = getCityDataByCode(rawCityCode);
    if (!city) {
      throw new Error(`未找到统筹区编码 [${rawCityCode}] 的政策数据`);
    }
    const cityCode = city.cityCode;

    // 若政策文本明确载明二次减半、三次及以上免收但未配置结构化 policy，则自动赋能精算策略
    let cityDataToUse = city;
    for (const insKey of ['employee', 'resident'] as const) {
      const inp = city[insKey].inpatient;
      if (
        !inp.repeatedDeductiblePolicy &&
        inp.repeatedDeductibleRule &&
        inp.repeatedDeductibleRule.includes('第二次') &&
        inp.repeatedDeductibleRule.includes('减半') &&
        inp.repeatedDeductibleRule.includes('第三次') &&
        (inp.repeatedDeductibleRule.includes('免') || inp.repeatedDeductibleRule.includes('0'))
      ) {
        cityDataToUse = {
          ...cityDataToUse,
          [insKey]: {
            ...cityDataToUse[insKey],
            inpatient: {
              ...cityDataToUse[insKey].inpatient,
              repeatedDeductiblePolicy: { type: 'half_second_zero_third' }
            }
          }
        };
      }
    }

    const calcRequest: CalculateRequest = {
      cityCode,
      insuranceType: scenario.insuranceType,
      isRetiree: scenario.isRetiree,
      treatmentType: scenario.treatmentType,
      hospitalTier: scenario.hospitalTier,
      remoteStatus: scenario.remoteStatus,
      totalCost: scenario.totalCost,
      nonInsuranceCost: scenario.nonInsuranceCost ?? 0,
      classBCost: scenario.classBCost ?? 0,
      classBSelfPayRatio: scenario.classBSelfPayRatio ?? 0.05,
      hospitalizationCount: scenario.hospitalizationCount
    };

    const calcResult = calculateReimbursement(calcRequest, cityDataToUse);
    const b = calcResult.breakdown;

    // 物理资金守恒验证: R + P === C_total
    const isConserved = Math.abs(Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100 - scenario.totalCost) < 0.01;
    const nonInsuranceAndPriorPay = Math.round(((b.nonInsuranceCost || 0) + (b.classBPriorPay || b.classBSelfPay || 0)) * 100) / 100;

    outcomes.push({
      cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      totalCost: b.totalCost,
      totalReimbursed: b.totalReimbursed,
      personalPayTotal: b.personalPayTotal,
      reimbursementRatio: b.effectiveRatio,
      deductibleDeducted: b.deductibleDeducted,
      deductibleReduction: b.deductibleReduction,
      baseReimbursed: b.baseReimbursed,
      catastrophicReimbursed: b.catastrophicReimbursed,
      personalSpanCoPay: b.personalSpanCoPay,
      nonInsuranceAndPriorPay,
      isConserved,
      isWinnerReimbursed: false,
      isWinnerLowestOutPocket: false,
      isWinnerLowestDeductible: false,
      isWinnerHighestCatastrophic: false,
      deltaReimbursedVsCityA: 0,
      deltaPersonalPayVsCityA: 0,
      officialDocUsed: calcResult.officialDocUsed,
      specialNotes: calcResult.policyNotes,
      calcResult,
      hotline: city.hotline,
      portalUrl: city.officialPortalUrl
    });
  }

  // 3. 计算相对 City A (基准城 outcomes[0]) 的差额 (恒满足 ΔR = -ΔP)
  const baselineCity = outcomes[0];
  for (let i = 0; i < outcomes.length; i++) {
    const outcome = outcomes[i];
    outcome.deltaReimbursedVsCityA = Math.round((outcome.totalReimbursed - baselineCity.totalReimbursed) * 100) / 100;
    outcome.deltaPersonalPayVsCityA = Math.round((outcome.personalPayTotal - baselineCity.personalPayTotal) * 100) / 100;
  }

  // 4. 四大维度胜出判定 (4-Dimension Winners with Tie Resilience)
  const maxReimbursed = Math.max(...outcomes.map(o => o.totalReimbursed));
  const minPersonalPay = Math.min(...outcomes.map(o => o.personalPayTotal));
  const minDeductible = Math.min(...outcomes.map(o => o.deductibleDeducted));
  const maxCatastrophic = Math.max(...outcomes.map(o => o.catastrophicReimbursed));

  for (let i = 0; i < outcomes.length; i++) {
    const o = outcomes[i];
    o.isWinnerReimbursed = (o.totalReimbursed === maxReimbursed);
    o.isWinnerLowestOutPocket = (o.personalPayTotal === minPersonalPay);
    o.isWinnerLowestDeductible = (o.deductibleDeducted === minDeductible);
    o.isWinnerHighestCatastrophic = (maxCatastrophic > 0 && o.catastrophicReimbursed === maxCatastrophic);
  }

  const reimbursedWinners = outcomes.filter(o => o.isWinnerReimbursed);
  const lowestOutPocketWinners = outcomes.filter(o => o.isWinnerLowestOutPocket);
  const lowestDeductibleWinners = outcomes.filter(o => o.isWinnerLowestDeductible);
  const highestCatastrophicWinners = outcomes.filter(o => o.isWinnerHighestCatastrophic);

  const winnerReimbursedCity = formatWinnerCityNames(reimbursedWinners);
  const winnerLowestOutPocketCity = formatWinnerCityNames(lowestOutPocketWinners);
  const winnerLowestDeductibleCity = formatWinnerCityNames(lowestDeductibleWinners);
  const winnerHighestCatastrophicCity = maxCatastrophic > 0
    ? formatWinnerCityNames(highestCatastrophicWinners)
    : '无 (未触发大病报销)';

  // 5. 最大极差跨度 (Max Delta Spread)
  const maxReimbursementDelta = Math.round((maxReimbursed - Math.min(...outcomes.map(o => o.totalReimbursed))) * 100) / 100;
  const maxPersonalPayDelta = Math.round((Math.max(...outcomes.map(o => o.personalPayTotal)) - minPersonalPay) * 100) / 100;

  // 6. 全城全场景资金物理守恒核验
  const allConserved = outcomes.every(o => o.isConserved);

  // 7. 自动化精算洞察 (Textual Key Insights, 严格 0-Emoji 规范)
  const keyInsights: string[] = [];

  const treatmentLabel = scenario.treatmentType === 'inpatient' ? '住院' : '门诊';
  const personLabel = scenario.insuranceType === 'employee'
    ? (scenario.isRetiree ? '职工医保 (退休)' : '职工医保 (在职)')
    : '居民医保';

  const bestCity = reimbursedWinners[0];
  const lowestCity = outcomes.find(o => o.totalReimbursed === Math.min(...outcomes.map(x => x.totalReimbursed))) || outcomes[0];

  // 洞察 1: 报销与自付差距
  if (maxReimbursementDelta > 0) {
    keyInsights.push(
      `在【${personLabel} · ${treatmentLabel} · 花费 ¥${scenario.totalCost.toLocaleString()}】设定下，${winnerReimbursedCity}报销力度最强，实际报销 ¥${bestCity.totalReimbursed.toFixed(2)}（实报比例 ${bestCity.reimbursementRatio}%），相比${lowestCity.cityName}多报销 ¥${maxReimbursementDelta.toFixed(2)}，个人减负效果显著。`
    );
  } else {
    keyInsights.push(
      `在【${personLabel} · ${treatmentLabel} · 花费 ¥${scenario.totalCost.toLocaleString()}】设定下，所选${outcomes.length}个统筹区报销总额一致（均为 ¥${bestCity.totalReimbursed.toFixed(2)}，实报比例 ${bestCity.reimbursementRatio}%）。`
    );
  }

  // 洞察 2: 起付线与多次递减
  if (scenario.treatmentType === 'inpatient' && (scenario.hospitalizationCount ?? 1) > 1) {
    const count = scenario.hospitalizationCount;
    const reducedCities = outcomes.filter(o => o.deductibleReduction > 0);
    if (reducedCities.length > 0) {
      const detailStr = reducedCities.map(c => `${c.cityName}减免¥${c.deductibleReduction}（实收¥${c.deductibleDeducted}）`).join('、');
      keyInsights.push(
        `年内第${count}次住院起付线阶梯递减：${detailStr}，有效减轻年内多次住院重症患者的就医门槛负担。`
      );
    } else {
      keyInsights.push(
        `年内第${count}次住院起付门槛：所选统筹区本次均按各自现行法定起付标准执行扣除。`
      );
    }
  } else {
    const lowestDedCities = outcomes.filter(o => o.deductibleDeducted === minDeductible);
    if (outcomes.length > 1) {
      keyInsights.push(
        `起付门槛分析：${lowestDedCities.map(c => c.cityName).join('、')}起付门槛最低（¥${minDeductible.toFixed(2)}），政策范围内费用越早迈过门槛进入统筹报销段。`
      );
    }
  }

  // 洞察 3: 大病保险/大额互助二次救助
  if (maxCatastrophic > 0) {
    const catWinners = outcomes.filter(o => o.catastrophicReimbursed > 0);
    const catDetail = catWinners.map(c => `${c.cityName}二次救助¥${c.catastrophicReimbursed.toFixed(2)}`).join('、');
    keyInsights.push(
      `大病重症二次救助：本次就医触发大病保险或大额医疗互助兜底保障（${catDetail}），有效防范因病致贫、因病返贫。`
    );
  }

  // 洞察 4: 异地就医备案与折算
  if (scenario.remoteStatus && scenario.remoteStatus !== 'local') {
    const statusMap: Record<string, string> = {
      long_term: '异地长期居住备案 (待遇对齐参保地本地)',
      transfer: '规范异地转诊备案 (执行规定下浮比例直接结算)',
      unfiled_emergency: '异地急诊抢救 (按国家医保直接结算规范保障)',
      unfiled_normal: '跨省临时自行就医未备案 (执行惩罚性降比自付)'
    };
    keyInsights.push(
      `异地就医政策衔接：就医地状态为【${statusMap[scenario.remoteStatus] || scenario.remoteStatus}】，各统筹区严格按属地红头公文折算统筹基金支付比例。`
    );
  }

  // 洞察 5: 资金物理守恒闭环
  if (allConserved) {
    keyInsights.push(
      `资金物理守恒核验：所选${outcomes.length}个统筹区测算结果 100% 满足「医保报销总额 + 个人自付总额 ≡ 医疗总费用」，精算逻辑自洽无偏差。`
    );
  }

  return {
    scenario,
    cities: outcomes,
    winnerReimbursedCity,
    winnerLowestOutPocketCity,
    winnerLowestDeductibleCity,
    winnerHighestCatastrophicCity,
    maxReimbursementDelta,
    maxPersonalPayDelta,
    keyInsights,
    allConserved
  };
}
