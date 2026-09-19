import { allCities } from '../data';
import type { CityInsuranceData } from '../data/types';

export type BenchmarkCategory = 'overall' | 'employee' | 'resident';

export type SortColumn = 
  | 'composite'           // 综合竞争力指数 (按当前选中分类的得分)
  | 'overall_score'       // 全域总得分
  | 'employee_score'      // 职工专属得分
  | 'resident_score'      // 居民专属得分
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
  overallScore: number;       // 全域整体综合得分
  employeeScore: number;      // 城镇职工医保专属综合得分
  residentScore: number;      // 城乡居民医保专属综合得分

  // 职工专属核心指标
  empInpatientRatio: number;      // 职工三级住院比例 (0~1)
  empInpatientTier2Ratio: number; // 职工二级住院比例 (0~1)
  empOutpatientCap: number;       // 职工门诊年度限额 (元)
  empOutpatientDed: number;       // 职工门诊起付线 (元)
  retireeBonusRatio: number;      // 退休上浮比例 (0~1)
  
  // 居民专属核心指标
  resInpatientRatio: number;      // 居民三级住院比例 (0~1)
  resInpatientTier2Ratio: number; // 居民二级住院比例 (0~1)
  resOutpatientCap: number;       // 居民门诊年度限额 (元)
  annualMaxCap: number;           // 医保年度总支付限额 (元)

  // 5大能力雷达维度 (0 - 100 分)
  radar: {
    inpatient: number;     // 住院保障力
    outpatient: number;    // 门诊减负度
    catastrophic: number;  // 大病抗风险
    threshold: number;     // 门槛友好度 (起付越低越高)
    retiree: number;       // 退休关怀度
  };
  rawCity: CityInsuranceData;
}

export interface CityComparisonMetric {
  name: string;
  category: '门诊待遇' | '住院待遇' | '基金限额' | '退休倾斜';
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
  { id: 'bj-sh', name: '超一线对决', city1: '110000', city2: '310000', label: '北京 VS 上海' },
  { id: 'gz-sz', name: '大湾区双雄', city1: '440100', city2: '440300', label: '广州 VS 深圳' },
  { id: 'xa-cd', name: '西部中心城', city1: '610100', city2: '510100', label: '西安 VS 成都' },
  { id: 'hz-nj', name: '长三角先锋', city1: '330100', city2: '320100', label: '杭州 VS 南京' },
  { id: 'jn-qd', name: '齐鲁双子星', city1: '370100', city2: '370200', label: '济南 VS 青岛' }
];

/**
 * 计算统筹区的全域综合、职工专属与居民专属多维指数
 */
export function extractCityBenchmarkMetrics(city: CityInsuranceData): BenchmarkCityMetrics {
  const empIn = city.employee.inpatient;
  const empOut = city.employee.outpatient;
  const resIn = city.resident.inpatient;
  const resOut = city.resident.outpatient;

  // 1. 提取核心参数
  const empInTier3 = empIn.tierBenefits.tier3?.reimbursementRatio || 0.85;
  const empInTier2 = empIn.tierBenefits.tier2?.reimbursementRatio || 0.88;
  const empCap = empOut.annualCap || 3000;
  const empDed = empOut.annualDeductible ?? 200;
  const retBonus = empIn.tierBenefits.tier3?.retireeRatioBonus || 0.03;

  const resInTier3 = resIn.tierBenefits.tier3?.reimbursementRatio || 0.65;
  const resInTier2 = resIn.tierBenefits.tier2?.reimbursementRatio || 0.75;
  const resCap = resOut.annualCap || 300;
  const maxCap = resIn.comprehensiveCap || resIn.annualCap || 200000;

  // 2. 职工专属综合得分 (0 - 100 分)
  // 权重：三级住院 30% + 二级住院 15% + 门诊封顶 25% + 门诊起付 15% + 退休优待 15%
  const empT3Score = Math.min(100, Math.max(30, Math.round(((empInTier3 - 0.75) / 0.20) * 80 + 20)));
  const empT2Score = Math.min(100, Math.max(30, Math.round(((empInTier2 - 0.80) / 0.15) * 80 + 20)));
  const isEmpCapUncapped = empCap >= 9999999;
  const empCapScore = isEmpCapUncapped ? 98 : Math.min(96, Math.round((Math.min(empCap, 8000) / 8000) * 75 + 22));
  const empDedScore = empDed === 0 ? 98 : Math.max(30, Math.round(95 - (empDed / 1000) * 55));
  const empRetScore = Math.min(98, Math.round((retBonus / 0.08) * 60 + 35));

  const employeeScore = Math.round((
    empT3Score * 0.30 +
    empT2Score * 0.15 +
    empCapScore * 0.25 +
    empDedScore * 0.15 +
    empRetScore * 0.15
  ) * 10) / 10;

  // 3. 居民专属综合得分 (0 - 100 分)
  // 权重：三级住院 35% + 二级住院 25% + 基层门诊 20% + 大病抗风险 20%
  const resT3Score = Math.min(100, Math.max(30, Math.round(((resInTier3 - 0.50) / 0.35) * 85 + 15)));
  const resT2Score = Math.min(100, Math.max(30, Math.round(((resInTier2 - 0.60) / 0.30) * 85 + 15)));
  const resCapScore = Math.min(96, Math.max(35, Math.round((Math.min(resCap, 1500) / 1500) * 65 + 30)));
  const catastrophicScore = Math.min(99, Math.round(Math.min(maxCap, 800000) / 800000 * 85 + 15));

  const residentScore = Math.round((
    resT3Score * 0.35 +
    resT2Score * 0.25 +
    resCapScore * 0.20 +
    catastrophicScore * 0.20
  ) * 10) / 10;

  // 4. 全域整体综合得分 (均衡统筹全人群)
  const overallScore = Math.round((employeeScore * 0.5 + residentScore * 0.5) * 10) / 10;

  // 5. 五大雷达维度评分
  const inpatientScore = Math.min(100, Math.round(((empInTier3 * 0.55 + resInTier3 * 0.45) - 0.50) / 0.45 * 100));
  const outpatientScore = Math.round(empCapScore * 0.6 + resCapScore * 0.4);

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
    empOutpatientCap: empCap,
    empOutpatientDed: empDed,
    retireeBonusRatio: retBonus,
    resInpatientRatio: resInTier3,
    resInpatientTier2Ratio: resInTier2,
    resOutpatientCap: resCap,
    annualMaxCap: maxCap,
    radar: {
      inpatient: Math.max(30, Math.min(100, inpatientScore)),
      outpatient: Math.max(30, Math.min(100, outpatientScore)),
      catastrophic: Math.max(30, Math.min(100, catastrophicScore)),
      threshold: Math.max(30, Math.min(100, empDedScore)),
      retiree: Math.max(30, Math.min(100, empRetScore)),
    },
    rawCity: city
  };
}

/**
 * 获取支持多维度群体分类与多列重排的全国医保 Benchmark 排行榜
 */
export function getBenchmarkRankings(
  category: BenchmarkCategory = 'overall',
  sortCol: SortColumn = 'composite',
  sortAsc: boolean = false,
  provinceFilter?: string,
  searchQuery?: string
): BenchmarkCityMetrics[] {
  let list = allCities.map(extractCityBenchmarkMetrics);

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
 * 双城横向 PK 对比逻辑
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

  // 1. 职工门诊年起付线 (越低越好)
  const empDed1 = city1.empOutpatientDed;
  const empDed2 = city2.empOutpatientDed;
  let advDed: 'city1' | 'city2' | 'equal' = 'equal';
  let diffDed = '';
  if (empDed1 < empDed2) { 
    advDed = 'city1'; win1++; 
    diffDed = `${city1.cityName} 门槛低 ¥${empDed2 - empDed1}`;
  } else if (empDed2 < empDed1) { 
    advDed = 'city2'; win2++; 
    diffDed = `${city2.cityName} 门槛低 ¥${empDed1 - empDed2}`;
  } else {
    equal++;
    diffDed = '双方门槛一致';
  }
  metrics.push({
    name: '职工门诊年起付线',
    category: '门诊待遇',
    city1Val: empDed1 === 0 ? '0 元 (免起付)' : `¥${empDed1}`,
    city2Val: empDed2 === 0 ? '0 元 (免起付)' : `¥${empDed2}`,
    advantage: advDed,
    diffText: diffDed,
    explanation: '自然年度内累计自付超过此起付线后即时按比例报销，门槛越低参保人获益越早。'
  });

  // 2. 职工门诊年度封顶线 (越高越好)
  const empCap1 = city1.empOutpatientCap;
  const empCap2 = city2.empOutpatientCap;
  let advCap: 'city1' | 'city2' | 'equal' = 'equal';
  let diffCap = '';
  if (empCap1 > empCap2) { 
    advCap = 'city1'; win1++; 
    diffCap = empCap1 >= 9999999 ? `${city1.cityName} 无限额限制` : `${city1.cityName} 额度高 ¥${empCap1 - empCap2}`;
  } else if (empCap2 > empCap1) { 
    advCap = 'city2'; win2++; 
    diffCap = empCap2 >= 9999999 ? `${city2.cityName} 无限额限制` : `${city2.cityName} 额度高 ¥${empCap2 - empCap1}`;
  } else {
    equal++;
    diffCap = '双方封顶限额一致';
  }
  metrics.push({
    name: '职工门诊年度封顶线',
    category: '门诊待遇',
    city1Val: empCap1 >= 9999999 ? '上不封顶' : `¥${empCap1}`,
    city2Val: empCap2 >= 9999999 ? '上不封顶' : `¥${empCap2}`,
    advantage: advCap,
    diffText: diffCap,
    explanation: '职工门诊统筹基金自然年度内最高报销额度，额度越高门诊抗压能力越强。'
  });

  // 3. 职工三级住院报销比例 (越高越好)
  const empT3_1 = city1.empInpatientRatio;
  const empT3_2 = city2.empInpatientRatio;
  let advET3: 'city1' | 'city2' | 'equal' = 'equal';
  let diffET3 = '';
  if (empT3_1 > empT3_2) { 
    advET3 = 'city1'; win1++; 
    diffET3 = `${city1.cityName} 比例高 +${Math.round((empT3_1 - empT3_2) * 100)}%`;
  } else if (empT3_2 > empT3_1) { 
    advET3 = 'city2'; win2++; 
    diffET3 = `${city2.cityName} 比例高 +${Math.round((empT3_2 - empT3_1) * 100)}%`;
  } else {
    equal++;
    diffET3 = '三级住院报销比例持平';
  }
  metrics.push({
    name: '职工三级住院报销',
    category: '住院待遇',
    city1Val: `${Math.round(empT3_1 * 100)}%`,
    city2Val: `${Math.round(empT3_2 * 100)}%`,
    advantage: advET3,
    diffText: diffET3,
    explanation: '三级公立医院住院在职职工政策范围内报销比例，直接决定大病住院统筹支付力度。'
  });

  // 4. 居民三级住院报销比例 (越高越好)
  const resT3_1 = city1.resInpatientRatio;
  const resT3_2 = city2.resInpatientRatio;
  let advRT3: 'city1' | 'city2' | 'equal' = 'equal';
  let diffRT3 = '';
  if (resT3_1 > resT3_2) { 
    advRT3 = 'city1'; win1++; 
    diffRT3 = `${city1.cityName} 比例高 +${Math.round((resT3_1 - resT3_2) * 100)}%`;
  } else if (resT3_2 > resT3_1) { 
    advRT3 = 'city2'; win2++; 
    diffRT3 = `${city2.cityName} 比例高 +${Math.round((resT3_2 - resT3_1) * 100)}%`;
  } else {
    equal++;
    diffRT3 = '居民报销比例持平';
  }
  metrics.push({
    name: '居民三级住院报销',
    category: '住院待遇',
    city1Val: `${Math.round(resT3_1 * 100)}%`,
    city2Val: `${Math.round(resT3_2 * 100)}%`,
    advantage: advRT3,
    diffText: diffRT3,
    explanation: '城乡居民在三级医疗机构住院政策范围内统筹报销比例。'
  });

  // 5. 居民基本住院封顶限额 (越高越好)
  const cap1 = city1.annualMaxCap;
  const cap2 = city2.annualMaxCap;
  let advInCap: 'city1' | 'city2' | 'equal' = 'equal';
  let diffInCap = '';
  if (cap1 > cap2) { 
    advInCap = 'city1'; win1++; 
    diffInCap = `${city1.cityName} 封顶高 ¥${Math.round((cap1 - cap2) / 10000)}万`;
  } else if (cap2 > cap1) { 
    advInCap = 'city2'; win2++; 
    diffInCap = `${city2.cityName} 封顶高 ¥${Math.round((cap2 - cap1) / 10000)}万`;
  } else {
    equal++;
    diffInCap = '封顶线额度持平';
  }
  metrics.push({
    name: '住院年度封顶限额',
    category: '基金限额',
    city1Val: `¥${Math.round(cap1 / 10000)} 万元`,
    city2Val: `¥${Math.round(cap2 / 10000)} 万元`,
    advantage: advInCap,
    diffText: diffInCap,
    explanation: '参保人年度内享受统筹基金报销的最大极限值。'
  });

  // 6. 退休人员比例优待上浮幅度
  const retBonus1 = city1.retireeBonusRatio;
  const retBonus2 = city2.retireeBonusRatio;
  let advBonus: 'city1' | 'city2' | 'equal' = 'equal';
  let diffBonus = '';
  if (retBonus1 > retBonus2) { 
    advBonus = 'city1'; win1++; 
    diffBonus = `${city1.cityName} 退休倾斜多 +${Math.round((retBonus1 - retBonus2) * 100)}%`;
  } else if (retBonus2 > retBonus1) { 
    advBonus = 'city2'; win2++; 
    diffBonus = `${city2.cityName} 退休倾斜多 +${Math.round((retBonus2 - retBonus1) * 100)}%`;
  } else {
    equal++;
    diffBonus = '退休上浮比例一致';
  }
  metrics.push({
    name: '退休人员上浮倾斜',
    category: '退休倾斜',
    city1Val: `+${Math.round(retBonus1 * 100)}%`,
    city2Val: `+${Math.round(retBonus2 * 100)}%`,
    advantage: advBonus,
    diffText: diffBonus,
    explanation: '退休职工在住院与门诊报销时相比在职人员获得的额外比例优待。'
  });

  return {
    city1,
    city2,
    metrics,
    city1WinCount: win1,
    city2WinCount: win2,
    equalCount: equal
  };
}
