import { allCities } from '../data';
import type { CityInsuranceData } from '../data/types';

export type BenchmarkCategory = 'overall' | 'employee' | 'resident';

export type SortColumn = 
  | 'composite'           // 综合竞争力指数 (按当前选中分类的得分)
  | 'overall_score'       // 全域综合得分
  | 'employee_score'      // 职工专属得分
  | 'resident_score'      // 居民专属得分
  | 'inpatient_score'     // 🏥 住院全层级保障力得分
  | 'outpatient_score'    // 💊 门诊共济与减负力得分
  | 'catastrophic_score'  // 🛡️ 大病重疾抗风险力得分
  | 'threshold_score'     // 🚪 门槛起付友好度得分
  | 'retiree_score'       // 👴 群体倾斜与关怀力得分
  | 'mobility_score'      // 🌐 异地就医流动自由度得分
  | 'emp_inpatient'       // 职工三级住院比例
  | 'res_inpatient'       // 居民三级住院比例
  | 'emp_outpatient_cap'  // 职工门诊封顶线
  | 'res_outpatient_cap'  // 居民门诊封顶线
  | 'annual_cap'          // 年度最高支付限额
  | 'retiree_bonus';      // 退休优待上浮

export interface BenchmarkCityMetrics {
  rank: number;
  cityCode: string;
  cityName: string;
  provinceName: string;
  
  // 三大核心综合指数 (0 - 100 分)
  overallScore: number;       // 全域整体综合得分 (CMI-Overall)
  employeeScore: number;      // 城镇职工医保专属综合得分 (CMI-Employee)
  residentScore: number;      // 城乡居民医保专属综合得分 (CMI-Resident)

  // 职工专属核心指标
  empInpatientRatio: number;      // 职工三级住院比例 (0~1)
  empInpatientTier2Ratio: number; // 职工二级住院比例 (0~1)
  empInpatientTier1Ratio: number; // 职工一级/基层住院比例 (0~1)
  empOutpatientCap: number;       // 职工门诊年度限额 (元)
  empOutpatientDed: number;       // 职工门诊起付线 (元)
  retireeBonusRatio: number;      // 退休上浮比例 (0~1)
  
  // 居民专属核心指标
  resInpatientRatio: number;      // 居民三级住院比例 (0~1)
  resInpatientTier2Ratio: number; // 居民二级住院比例 (0~1)
  resInpatientTier1Ratio: number; // 居民一级/基层住院比例 (0~1)
  resOutpatientCap: number;       // 居民门诊年度限额 (元)
  annualMaxCap: number;           // 医保年度总支付限额 (元)
  isCatastrophicUncapped: boolean;// 大病保险是否不设封顶

  // 异地就医核心指标
  remoteTransferRatio: number;    // 规范异地转诊报销保持率 (如 0.90)
  remoteUnfiledRatio: number;     // 未备案自行就医保持率 (如 0.70)

  // 6大能力雷达维度 (0 - 100 分，CMI-Index 2.0 标准)
  radar: {
    inpatient: number;     // 🏥 住院全层级保障力
    outpatient: number;    // 💊 门诊共济与减负力
    catastrophic: number;  // 🛡️ 大病重疾抗风险力
    threshold: number;     // 🚪 门槛起付友好度 (起付越低分越高)
    retiree: number;       // 👴 群体倾斜与关怀力 (退休/高龄优待)
    mobility: number;      // 🌐 异地就医流动自由度
  };
  rawCity: CityInsuranceData;
}

export interface CityComparisonMetric {
  name: string;
  category: '门诊共济' | '住院保障' | '大病兜底' | '群体倾斜' | '异地流动';
  city1Val: string;
  city2Val: string;
  advantage: 'city1' | 'city2' | 'equal' | 'neutral';
  diffText?: string;
  explanation?: string;
}

/**
 * 经典热门对决预设 (类似 AI 评测中的双雄争霸)
 */
export const popularBattles = [
  { id: 'bj-sh', name: '超一线对决', city1: '110100', city2: '310100', label: '北京 VS 上海' },
  { id: 'gz-sz', name: '大湾区双雄', city1: '440100', city2: '440300', label: '广州 VS 深圳' },
  { id: 'xa-cd', name: '西部中心城', city1: '610100', city2: '510100', label: '西安 VS 成都' },
  { id: 'hz-nj', name: '长三角先锋', city1: '330100', city2: '320100', label: '杭州 VS 南京' },
  { id: 'jn-qd', name: '齐鲁双子星', city1: '370100', city2: '370200', label: '济南 VS 青岛' }
];

/**
 * 计算统筹区的全域综合、职工专属与居民专属多维指数 (CMI-Index 2.0 算法模型)
 */
export function extractCityBenchmarkMetrics(city: CityInsuranceData): BenchmarkCityMetrics {
  const empIn = city.employee.inpatient;
  const empOut = city.employee.outpatient;
  const resIn = city.resident.inpatient;
  const resOut = city.resident.outpatient;
  const empRemote = city.employee.remoteMedical;
  const resCata = city.resident.catastrophic;

  // 1. 提取核心参数 - 职工
  const empInTier3 = empIn.tierBenefits.tier3?.reimbursementRatio || 0.85;
  const empInTier2 = empIn.tierBenefits.tier2?.reimbursementRatio || 0.88;
  const empInTier1 = empIn.tierBenefits.tier1?.reimbursementRatio || 0.90;
  const empDedInTier3 = empIn.tierBenefits.tier3?.deductible || 800;
  const empCap = empOut.annualCap || 3000;
  const empDed = empOut.annualDeductible ?? 200;
  const retBonus = empIn.tierBenefits.tier3?.retireeRatioBonus || 0.03;
  const hasRetireeOutpatientAdvantage = (empOut.annualCapRetiree && empOut.annualCapRetiree > empCap) || false;

  // 2. 提取核心参数 - 居民
  const resInTier3 = resIn.tierBenefits.tier3?.reimbursementRatio || 0.65;
  const resInTier2 = resIn.tierBenefits.tier2?.reimbursementRatio || 0.75;
  const resInTier1 = resIn.tierBenefits.tier1?.reimbursementRatio || 0.85;
  const resDedInTier3 = resIn.tierBenefits.tier3?.deductible || 1000;
  const resCap = resOut.annualCap || 300;
  const resOutRatio = resOut.tierBenefits.community?.reimbursementRatio || 0.60;
  const maxCap = resIn.comprehensiveCap || resIn.annualCap || 200000;
  const isCatastrophicUncapped = resCata.annualCap === undefined;

  // 3. 提取核心参数 - 异地就医
  const remoteTransferRatio = empRemote?.transferFiledRatio || 0.90;
  const remoteUnfiledRatio = empRemote?.unfiledNormalRatio || 0.65;

  // ==================== 6 大能力维度量化评分 (0 - 100 分) ====================

  // [维度 1] 🏥 住院全层级保障力 (inpatient)
  const empInpatientWeighted = empInTier3 * 0.50 + empInTier2 * 0.30 + empInTier1 * 0.20;
  const resInpatientWeighted = resInTier3 * 0.50 + resInTier2 * 0.30 + resInTier1 * 0.20;
  const combinedInpatientRatio = empInpatientWeighted * 0.55 + resInpatientWeighted * 0.45;
  const inRatioScore = Math.min(100, Math.max(30, Math.round(((combinedInpatientRatio - 0.60) / 0.33) * 70 + 30)));
  const inDeductibleScore = Math.max(40, Math.min(100, Math.round(100 - (empDedInTier3 / 1500) * 35)));
  const inpatientScore = Math.round(inRatioScore * 0.85 + inDeductibleScore * 0.15);

  // [维度 2] 💊 门诊共济与减负力 (outpatient)
  const isEmpCapUncapped = empCap >= 9999999;
  const empCapScore = isEmpCapUncapped ? 100 : Math.min(98, Math.round((Math.min(empCap, 12000) / 12000) * 65 + 33));
  const empDedScore = empDed === 0 ? 100 : Math.max(30, Math.round(95 - (empDed / 1000) * 55));
  const resOutScore = Math.min(96, Math.max(35, Math.round((Math.min(resCap, 2500) / 2500) * 55 + resOutRatio * 45)));
  const outpatientScore = Math.round(empCapScore * 0.40 + empDedScore * 0.30 + resOutScore * 0.30);

  // [维度 3] 🛡️ 大病重疾抗风险力 (catastrophic)
  const maxCapScore = Math.min(100, Math.round(Math.min(maxCap, 1050000) / 1050000 * 75 + 25));
  const cataSafetyScore = isCatastrophicUncapped ? 99 : Math.min(90, Math.max(40, Math.round((resCata.annualCap || 300000) / 600000 * 50 + 40)));
  const cataMaxRatio = resCata.tiers?.length ? Math.max(...resCata.tiers.map(t => t.ratio)) : 0.70;
  const cataRatioScore = Math.min(100, Math.round((cataMaxRatio / 0.85) * 80 + 20));
  const catastrophicScore = Math.round(maxCapScore * 0.40 + cataSafetyScore * 0.35 + cataRatioScore * 0.25);

  // [维度 4] 🚪 门槛起付友好度 (threshold)
  const outpatientThresholdScore = empDed === 0 ? 100 : Math.max(30, Math.round(96 - (empDed / 800) * 55));
  const inpatientThresholdScore = Math.max(35, Math.min(100, Math.round(95 - (empDedInTier3 / 1600) * 50)));
  const thresholdScore = Math.round(outpatientThresholdScore * 0.55 + inpatientThresholdScore * 0.45);

  // [维度 5] 👴 群体倾斜与关怀力 (retiree)
  const retBonusScore = Math.min(100, Math.max(40, Math.round((retBonus / 0.06) * 60 + 40)));
  const retAdvScore = hasRetireeOutpatientAdvantage ? 96 : 80;
  const retireeScore = Math.round(retBonusScore * 0.70 + retAdvScore * 0.30);

  // [维度 6] 🌐 异地就医流动自由度 (mobility)
  const transferScore = Math.min(100, Math.max(40, Math.round(((remoteTransferRatio - 0.75) / 0.25) * 60 + 40)));
  const unfiledScore = Math.min(100, Math.max(30, Math.round(((remoteUnfiledRatio - 0.50) / 0.30) * 65 + 35)));
  const mobilityScore = Math.round(transferScore * 0.60 + unfiledScore * 0.40);

  // ==================== 三大人群分类得分科学综合加权 ====================

  // 1. 城镇职工医保专属综合得分 (CMI-Employee)
  const employeeScore = Math.round((
    (empInTier3 * 0.6 + empInTier2 * 0.4) * 100 * 0.30 +
    empCapScore * 0.25 +
    empDedScore * 0.15 +
    retireeScore * 0.15 +
    mobilityScore * 0.15
  ) * 10) / 10;

  // 2. 城乡居民医保专属综合得分 (CMI-Resident)
  const residentScore = Math.round((
    (resInTier3 * 0.6 + resInTier2 * 0.4) * 100 * 0.35 +
    catastrophicScore * 0.25 +
    resOutScore * 0.15 +
    inpatientThresholdScore * 0.15 +
    mobilityScore * 0.10
  ) * 10) / 10;

  // 3. 全域整体综合得分 (CMI-Overall: 统筹 6 大能力维度与普惠均衡)
  const overallScore = Math.round((
    inpatientScore * 0.25 +
    outpatientScore * 0.20 +
    catastrophicScore * 0.20 +
    retireeScore * 0.15 +
    mobilityScore * 0.10 +
    thresholdScore * 0.10
  ) * 10) / 10;

  return {
    rank: 0,
    cityCode: city.cityCode,
    cityName: city.cityName,
    provinceName: city.provinceName,
    overallScore,
    employeeScore,
    residentScore,
    empInpatientRatio: empInTier3,
    empInpatientTier2Ratio: empInTier2,
    empInpatientTier1Ratio: empInTier1,
    empOutpatientCap: empCap,
    empOutpatientDed: empDed,
    retireeBonusRatio: retBonus,
    resInpatientRatio: resInTier3,
    resInpatientTier2Ratio: resInTier2,
    resInpatientTier1Ratio: resInTier1,
    resOutpatientCap: resCap,
    annualMaxCap: maxCap,
    isCatastrophicUncapped,
    remoteTransferRatio,
    remoteUnfiledRatio,
    radar: {
      inpatient: Math.max(30, Math.min(100, inpatientScore)),
      outpatient: Math.max(30, Math.min(100, outpatientScore)),
      catastrophic: Math.max(30, Math.min(100, catastrophicScore)),
      threshold: Math.max(30, Math.min(100, thresholdScore)),
      retiree: Math.max(30, Math.min(100, retireeScore)),
      mobility: Math.max(30, Math.min(100, mobilityScore))
    },
    rawCity: city
  };
}

// 性能优化：单例预计算缓存，避免对全国 344 个统筹区深层对象进行任何重复提取
let cachedBenchmarkList: BenchmarkCityMetrics[] | null = null;

export function getCachedBenchmarkList(): BenchmarkCityMetrics[] {
  if (!cachedBenchmarkList) {
    cachedBenchmarkList = allCities.map(extractCityBenchmarkMetrics);
  }
  return cachedBenchmarkList;
}

/**
 * 获取支持多维度群体分类与多列重排的全国医保 Benchmark 排行榜 (亚毫秒级纯内存操作)
 */
export function getBenchmarkRankings(
  category: BenchmarkCategory = 'overall',
  sortCol: SortColumn = 'composite',
  sortAsc: boolean = false,
  provinceFilter?: string,
  searchQuery?: string
): BenchmarkCityMetrics[] {
  let list = [...getCachedBenchmarkList()];

  if (provinceFilter && provinceFilter !== 'all') {
    list = list.filter(c => c.provinceName === provinceFilter);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(c => c.cityName.toLowerCase().includes(q) || c.provinceName.toLowerCase().includes(q));
  }

  list.sort((a, b) => {
    let diff = 0;
    switch (sortCol) {
      case 'composite':
        if (category === 'employee') {
          diff = b.employeeScore - a.employeeScore;
        } else if (category === 'resident') {
          diff = b.residentScore - a.residentScore;
        } else {
          diff = b.overallScore - a.overallScore;
        }
        break;
      case 'overall_score':
        diff = b.overallScore - a.overallScore;
        break;
      case 'employee_score':
        diff = b.employeeScore - a.employeeScore;
        break;
      case 'resident_score':
        diff = b.residentScore - a.residentScore;
        break;
      case 'inpatient_score':
        diff = b.radar.inpatient - a.radar.inpatient;
        break;
      case 'outpatient_score':
        diff = b.radar.outpatient - a.radar.outpatient;
        break;
      case 'catastrophic_score':
        diff = b.radar.catastrophic - a.radar.catastrophic;
        break;
      case 'threshold_score':
        diff = b.radar.threshold - a.radar.threshold;
        break;
      case 'retiree_score':
        diff = b.radar.retiree - a.radar.retiree;
        break;
      case 'mobility_score':
        diff = b.radar.mobility - a.radar.mobility;
        break;
      case 'emp_inpatient':
        diff = b.empInpatientRatio - a.empInpatientRatio;
        break;
      case 'res_inpatient':
        diff = b.resInpatientRatio - a.resInpatientRatio;
        break;
      case 'emp_outpatient_cap':
        diff = b.empOutpatientCap - a.empOutpatientCap;
        break;
      case 'res_outpatient_cap':
        diff = b.resOutpatientCap - a.resOutpatientCap;
        break;
      case 'annual_cap':
        diff = b.annualMaxCap - a.annualMaxCap;
        break;
      case 'retiree_bonus':
        diff = b.retireeBonusRatio - a.retireeBonusRatio;
        break;
      default:
        diff = b.overallScore - a.overallScore;
    }
    return sortAsc ? -diff : diff;
  });

  return list.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * 双城横向 PK 对比逻辑 (升级为 12 项深度指标对照)
 */
export function compareTwoCities(cityCode1: string, cityCode2: string): {
  city1: BenchmarkCityMetrics;
  city2: BenchmarkCityMetrics;
  metrics: CityComparisonMetric[];
  city1WinCount: number;
  city2WinCount: number;
  equalCount: number;
} | null {
  const raw1 = allCities.find(c => c.cityCode === cityCode1);
  const raw2 = allCities.find(c => c.cityCode === cityCode2);

  if (!raw1 || !raw2) return null;

  const city1 = extractCityBenchmarkMetrics(raw1);
  const city2 = extractCityBenchmarkMetrics(raw2);

  const metrics: CityComparisonMetric[] = [];
  let win1 = 0;
  let win2 = 0;
  let equal = 0;

  function pushMetric(
    name: string,
    category: CityComparisonMetric['category'],
    val1Str: string,
    val2Str: string,
    v1: number,
    v2: number,
    higherIsBetter: boolean,
    unit: string,
    explanation: string
  ) {
    let advantage: 'city1' | 'city2' | 'equal' = 'equal';
    let diffText = '双方指标持平';
    if (v1 !== v2) {
      const isCity1Better = higherIsBetter ? v1 > v2 : v1 < v2;
      const betterCity = isCity1Better ? city1 : city2;
      advantage = isCity1Better ? 'city1' : 'city2';
      if (isCity1Better) {
        win1++;
      } else {
        win2++;
      }

      if (v1 >= 9999999 || v2 >= 9999999) {
        diffText = `${betterCity.cityName} 更优 (上不封顶/无限制)`;
      } else if (unit === '%') {
        // v1 and v2 are decimals between 0 and 1, convert to percentage points
        const pctDiff = Math.abs(Math.round((v1 - v2) * 1000) / 10);
        const diffStr = pctDiff % 1 === 0 ? pctDiff.toFixed(0) : pctDiff.toFixed(1);
        diffText = `${betterCity.cityName} 更优 (+${diffStr}%)`;
      } else if (unit === '元') {
        const rawDiff = Math.abs(v1 - v2);
        let diffStr = '';
        if (rawDiff >= 10000 && rawDiff % 10000 === 0) {
          diffStr = `${rawDiff / 10000}万元`;
        } else if (rawDiff >= 10000) {
          diffStr = `${(rawDiff / 10000).toFixed(1)}万元`;
        } else {
          diffStr = `¥${rawDiff}`;
        }
        if (!higherIsBetter) {
          diffText = `${betterCity.cityName} 更优 (起付低 ${diffStr})`;
        } else {
          diffText = `${betterCity.cityName} 更优 (+${diffStr})`;
        }
      } else {
        const rawDiff = Math.abs(Math.round((v1 - v2) * 100) / 100);
        diffText = `${betterCity.cityName} 更优 (+${rawDiff}${unit})`;
      }
    } else {
      equal++;
    }

    metrics.push({
      name,
      category,
      city1Val: val1Str,
      city2Val: val2Str,
      advantage,
      diffText,
      explanation
    });
  }

function formatMoney(amount: number): string {
  if (amount >= 9999999) return '上不封顶';
  if (amount >= 10000) {
    if (amount % 10000 === 0) return `¥${amount / 10000}万`;
    return `¥${(amount / 10000).toFixed(1).replace(/\.0$/, '')}万`;
  }
  return `¥${amount}`;
}

  // 1. 职工门诊起付线 (越低越好)
  pushMetric(
    '职工门诊年起付线',
    '门诊共济',
    city1.empOutpatientDed === 0 ? '0 元 (免起付)' : `¥${city1.empOutpatientDed}`,
    city2.empOutpatientDed === 0 ? '0 元 (免起付)' : `¥${city2.empOutpatientDed}`,
    city1.empOutpatientDed,
    city2.empOutpatientDed,
    false,
    '元',
    '自然年度内累计自付超过此起付线后即时按比例报销，0元免起付最友好。'
  );

  // 2. 职工门诊年度封顶线 (越高越好)
  pushMetric(
    '职工门诊年度封顶',
    '门诊共济',
    city1.empOutpatientCap >= 9999999 ? '上不封顶' : formatMoney(city1.empOutpatientCap),
    city2.empOutpatientCap >= 9999999 ? '上不封顶' : formatMoney(city2.empOutpatientCap),
    city1.empOutpatientCap,
    city2.empOutpatientCap,
    true,
    '元',
    '职工门诊统筹自然年度内最高报销额度，额度越高门诊减负越充裕。'
  );

  // 3. 居民基层门诊限额
  pushMetric(
    '居民基层门诊年限额',
    '门诊共济',
    formatMoney(city1.resOutpatientCap),
    formatMoney(city2.resOutpatientCap),
    city1.resOutpatientCap,
    city2.resOutpatientCap,
    true,
    '元',
    '城乡居民在定点社区卫生服务中心及村卫生室看门诊的年度统筹支付限额。'
  );

  // 4. 职工三级在职住院比例
  pushMetric(
    '职工三级在职住院比例',
    '住院保障',
    `${Math.round(city1.empInpatientRatio * 100)}%`,
    `${Math.round(city2.empInpatientRatio * 100)}%`,
    city1.empInpatientRatio,
    city2.empInpatientRatio,
    true,
    '%',
    '三级重点医院住院政策范围内统筹基金报销比例，代表重症救治待遇。'
  );

  // 5. 职工二级住院报销比例
  pushMetric(
    '职工二级定点住院比例',
    '住院保障',
    `${Math.round(city1.empInpatientTier2Ratio * 100)}%`,
    `${Math.round(city2.empInpatientTier2Ratio * 100)}%`,
    city1.empInpatientTier2Ratio,
    city2.empInpatientTier2Ratio,
    true,
    '%',
    '二级公立医院在职职工住院报销比例，代表常见病住院保障水平。'
  );

  // 6. 居民三级医院住院比例
  pushMetric(
    '居民三级住院报销比例',
    '住院保障',
    `${Math.round(city1.resInpatientRatio * 100)}%`,
    `${Math.round(city2.resInpatientRatio * 100)}%`,
    city1.resInpatientRatio,
    city2.resInpatientRatio,
    true,
    '%',
    '城乡居民在三级医疗机构住院政策范围内统筹报销比例。'
  );

  // 7. 居民二级定点住院比例
  pushMetric(
    '居民二级住院报销比例',
    '住院保障',
    `${Math.round(city1.resInpatientTier2Ratio * 100)}%`,
    `${Math.round(city2.resInpatientTier2Ratio * 100)}%`,
    city1.resInpatientTier2Ratio,
    city2.resInpatientTier2Ratio,
    true,
    '%',
    '城乡居民在二级定点医院住院政策范围内统筹基金支付比例。'
  );

  // 8. 基本医保年统筹最高限额
  pushMetric(
    '基本医保年度封顶线',
    '大病兜底',
    formatMoney(city1.annualMaxCap),
    formatMoney(city2.annualMaxCap),
    city1.annualMaxCap,
    city2.annualMaxCap,
    true,
    '元',
    '参保人年度内享受基本医保统筹基金支付的最大上限，超限进入大病保险。'
  );

  // 9. 大病保险年封顶机制
  const cataCapVal1 = city1.isCatastrophicUncapped ? '不设封顶' : `¥${Math.round((city1.rawCity.resident.catastrophic.annualCap || 300000) / 10000)}万`;
  const cataCapVal2 = city2.isCatastrophicUncapped ? '不设封顶' : `¥${Math.round((city2.rawCity.resident.catastrophic.annualCap || 300000) / 10000)}万`;
  const cataScore1 = city1.isCatastrophicUncapped ? 9999999 : (city1.rawCity.resident.catastrophic.annualCap || 300000);
  const cataScore2 = city2.isCatastrophicUncapped ? 9999999 : (city2.rawCity.resident.catastrophic.annualCap || 300000);
  pushMetric(
    '大病保险年限额机制',
    '大病兜底',
    cataCapVal1,
    cataCapVal2,
    cataScore1,
    cataScore2,
    true,
    '元',
    '大病保险（二次报销）是否设有年度最高支付限额，不设封顶提供终极安全垫。'
  );

  // 10. 退休人员比例优待上浮
  pushMetric(
    '退休人员报销倾斜幅度',
    '群体倾斜',
    `+${Math.round(city1.retireeBonusRatio * 100)}%`,
    `+${Math.round(city2.retireeBonusRatio * 100)}%`,
    city1.retireeBonusRatio,
    city2.retireeBonusRatio,
    true,
    '%',
    '退休职工相比在职人员获得的额外统筹报销倾斜优待幅度。'
  );

  // 11. 异地规范转诊待遇保留率
  pushMetric(
    '异地转诊待遇保持率',
    '异地流动',
    `${Math.round(city1.remoteTransferRatio * 100)}%`,
    `${Math.round(city2.remoteTransferRatio * 100)}%`,
    city1.remoteTransferRatio,
    city2.remoteTransferRatio,
    true,
    '%',
    '规范办理转诊转院备案后，在省外或市外医疗机构享受的待遇折损比例（100%为完全不打折）。'
  );

  // 12. 未备案自行外出就医宽容度
  pushMetric(
    '自行外出就医报销保持率',
    '异地流动',
    `${Math.round(city1.remoteUnfiledRatio * 100)}%`,
    `${Math.round(city2.remoteUnfiledRatio * 100)}%`,
    city1.remoteUnfiledRatio,
    city2.remoteUnfiledRatio,
    true,
    '%',
    '参保人未办备案或转诊自行前往外地大医院就医时，统筹基金支付的最低宽容保底比例。'
  );

  return {
    city1,
    city2,
    metrics,
    city1WinCount: win1,
    city2WinCount: win2,
    equalCount: equal
  };
}
