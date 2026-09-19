import { allCities } from '../data';
import type { CityInsuranceData } from '../data/types';

export type RankingDimension = 
  | 'composite'         // 综合保障指数
  | 'resident_inpatient' // 居民住院保障
  | 'employee_outpatient'// 职工门诊待遇
  | 'annual_cap'        // 最高支付限额
  | 'retiree_preference';// 退休倾斜优待

export interface CityRankItem {
  rank: number;
  cityCode: string;
  cityName: string;
  provinceName: string;
  score: number;
  highlightValue: string;
  secondaryText: string;
  rawCity: CityInsuranceData;
}

export interface CityComparisonMetric {
  name: string;
  category: '门诊待遇' | '住院待遇' | '基金限额' | '退休倾斜';
  city1Val: string;
  city2Val: string;
  advantage: 'city1' | 'city2' | 'equal' | 'neutral';
  explanation?: string;
}

/**
 * 计算单个统筹区的综合医保保障力指数 (0 - 100 分)
 */
export function calculateCityCompositeScore(city: CityInsuranceData): number {
  let score = 50; // 基准分

  const resIn = city.resident.inpatient;
  const resOut = city.resident.outpatient;
  const empIn = city.employee.inpatient;
  const empOut = city.employee.outpatient;

  // 1. 居民三级定点住院报销比例 (0.50 ~ 0.90 -> 贡献 0 ~ 20 分)
  const tier3Ratio = resIn.tierBenefits.tier3?.reimbursementRatio || 0.60;
  score += (tier3Ratio - 0.50) * 50; 

  // 2. 居民二级定点住院报销比例 (0.65 ~ 0.90 -> 贡献 0 ~ 10 分)
  const tier2Ratio = resIn.tierBenefits.tier2?.reimbursementRatio || 0.70;
  score += (tier2Ratio - 0.65) * 40;

  // 3. 基本医保住院封顶线 (10w ~ 50w+ -> 贡献 0 ~ 12 分)
  const annualCap = resIn.annualCap || 150000;
  score += Math.min(12, (annualCap / 500000) * 12);

  // 4. 职工门诊封顶线 (1000 ~ 9999999+ -> 贡献 0 ~ 10 分)
  if (empOut.annualCap >= 9999999) {
    score += 10;
  } else {
    score += Math.min(8, (empOut.annualCap / 6000) * 8);
  }

  // 5. 职工门诊起付门槛 (0 ~ 1000 -> 越低分越高，贡献 0 ~ 5 分)
  const empOutDed = empOut.annualDeductible || 0;
  if (empOutDed === 0) {
    score += 5;
  } else {
    score += Math.max(0, 5 - (empOutDed / 200));
  }

  // 6. 退休人员优待幅度 (+5% ~ +10% -> 贡献 0 ~ 5 分)
  const retireeBonus = empIn.tierBenefits.tier3?.retireeRatioBonus || 0.05;
  score += Math.min(5, retireeBonus * 50);

  return Math.max(30, Math.min(99.5, Math.round(score * 10) / 10));
}

/**
 * 获取指定维度的排行榜
 */
export function getCityRankings(
  dimension: RankingDimension, 
  provinceFilter?: string, 
  searchQuery?: string
): CityRankItem[] {
  let list = [...allCities];

  if (provinceFilter && provinceFilter !== 'all') {
    list = list.filter(c => c.provinceName === provinceFilter);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(c => c.cityName.toLowerCase().includes(q) || c.provinceName.toLowerCase().includes(q));
  }

  const scoredList = list.map(city => {
    const resIn = city.resident.inpatient;
    const resOut = city.resident.outpatient;
    const empIn = city.employee.inpatient;
    const empOut = city.employee.outpatient;

    let score = 0;
    let highlightValue = '';
    let secondaryText = '';

    switch (dimension) {
      case 'composite': {
        score = calculateCityCompositeScore(city);
        highlightValue = `${score} 分`;
        secondaryText = `三级报销 ${Math.round((resIn.tierBenefits.tier3?.reimbursementRatio || 0.65) * 100)}% · 封顶 ¥${Math.round(resIn.annualCap / 10000)}万`;
        break;
      }
      case 'resident_inpatient': {
        const t3 = resIn.tierBenefits.tier3?.reimbursementRatio || 0.65;
        const t2 = resIn.tierBenefits.tier2?.reimbursementRatio || 0.75;
        score = Math.round((t3 * 0.6 + t2 * 0.4) * 1000) / 10;
        highlightValue = `三级 ${Math.round(t3 * 100)}%`;
        secondaryText = `二级 ${Math.round(t2 * 100)}% · 一级 ${Math.round((resIn.tierBenefits.tier1?.reimbursementRatio || 0.85) * 100)}%`;
        break;
      }
      case 'employee_outpatient': {
        const isUncapped = empOut.annualCap >= 9999999;
        score = isUncapped ? 100000 : empOut.annualCap;
        highlightValue = isUncapped ? '上不封顶' : `¥${empOut.annualCap}/年`;
        const dedText = empOut.annualDeductible === 0 ? '0元起付' : `起付 ¥${empOut.annualDeductible}`;
        secondaryText = `${dedText} · 基层报销 ${Math.round((empOut.tierBenefits.community?.reimbursementRatio || 0.80) * 100)}%`;
        break;
      }
      case 'annual_cap': {
        const cap = resIn.comprehensiveCap || resIn.annualCap;
        score = cap;
        highlightValue = `¥${Math.round(cap / 10000)} 万元`;
        secondaryText = `基本险限额 ¥${Math.round(resIn.annualCap / 10000)}万`;
        break;
      }
      case 'retiree_preference': {
        const bonus = empIn.tierBenefits.tier3?.retireeRatioBonus || 0.05;
        const retireeCap = empOut.annualCapRetiree || empOut.annualCap;
        score = Math.round(bonus * 100);
        highlightValue = `比例上浮 +${score}%`;
        const capTip = retireeCap > empOut.annualCap ? `门诊封顶 ¥${retireeCap}` : '门诊与在职同额';
        secondaryText = `${capTip} · 三级实报 ${Math.round(((empIn.tierBenefits.tier3?.reimbursementRatio || 0.80) + bonus) * 100)}%`;
        break;
      }
    }

    return {
      rank: 0,
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      score,
      highlightValue,
      secondaryText,
      rawCity: city
    };
  });

  // 按得分从高到低排序
  scoredList.sort((a, b) => b.score - a.score);

  // 赋排名序号
  return scoredList.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * 双城横向 PK 对比逻辑 (Side-by-Side City Battle)
 */
export function compareTwoCities(cityCode1: string, cityCode2: string): {
  city1: CityInsuranceData;
  city2: CityInsuranceData;
  city1Composite: number;
  city2Composite: number;
  metrics: CityComparisonMetric[];
  city1WinCount: number;
  city2WinCount: number;
} | null {
  const city1 = allCities.find(c => c.cityCode === cityCode1);
  const city2 = allCities.find(c => c.cityCode === cityCode2);

  if (!city1 || !city2) return null;

  const score1 = calculateCityCompositeScore(city1);
  const score2 = calculateCityCompositeScore(city2);

  const metrics: CityComparisonMetric[] = [];
  let win1 = 0;
  let win2 = 0;

  // 1. 职工门诊年起付线 (越低越好)
  const empDed1 = city1.employee.outpatient.annualDeductible;
  const empDed2 = city2.employee.outpatient.annualDeductible;
  let advDed: 'city1' | 'city2' | 'equal' = 'equal';
  if (empDed1 < empDed2) { advDed = 'city1'; win1++; }
  else if (empDed2 < empDed1) { advDed = 'city2'; win2++; }
  metrics.push({
    name: '职工门诊年起付线',
    category: '门诊待遇',
    city1Val: empDed1 === 0 ? '0 元 (免门槛)' : `¥${empDed1}`,
    city2Val: empDed2 === 0 ? '0 元 (免门槛)' : `¥${empDed2}`,
    advantage: advDed,
    explanation: '门诊自付累计超过起付线后方可按比例报销，门槛越低参保人获益越早'
  });

  // 2. 职工门诊年度封顶线 (越高越好)
  const empCap1 = city1.employee.outpatient.annualCap;
  const empCap2 = city2.employee.outpatient.annualCap;
  let advCap: 'city1' | 'city2' | 'equal' = 'equal';
  if (empCap1 > empCap2) { advCap = 'city1'; win1++; }
  else if (empCap2 > empCap1) { advCap = 'city2'; win2++; }
  metrics.push({
    name: '职工门诊年度最高限额',
    category: '门诊待遇',
    city1Val: empCap1 >= 9999999 ? '上不封顶' : `¥${empCap1}`,
    city2Val: empCap2 >= 9999999 ? '上不封顶' : `¥${empCap2}`,
    advantage: advCap
  });

  // 3. 居民二级医院住院报销比例 (越高越好)
  const resTier2_1 = city1.resident.inpatient.tierBenefits.tier2?.reimbursementRatio || 0.70;
  const resTier2_2 = city2.resident.inpatient.tierBenefits.tier2?.reimbursementRatio || 0.70;
  let advT2: 'city1' | 'city2' | 'equal' = 'equal';
  if (resTier2_1 > resTier2_2) { advT2 = 'city1'; win1++; }
  else if (resTier2_2 > resTier2_1) { advT2 = 'city2'; win2++; }
  metrics.push({
    name: '居民二级医院住院报销',
    category: '住院待遇',
    city1Val: `${Math.round(resTier2_1 * 100)}%`,
    city2Val: `${Math.round(resTier2_2 * 100)}%`,
    advantage: advT2
  });

  // 4. 居民三级医院住院报销比例 (越高越好)
  const resTier3_1 = city1.resident.inpatient.tierBenefits.tier3?.reimbursementRatio || 0.60;
  const resTier3_2 = city2.resident.inpatient.tierBenefits.tier3?.reimbursementRatio || 0.60;
  let advT3: 'city1' | 'city2' | 'equal' = 'equal';
  if (resTier3_1 > resTier3_2) { advT3 = 'city1'; win1++; }
  else if (resTier3_2 > resTier3_1) { advT3 = 'city2'; win2++; }
  metrics.push({
    name: '居民三级医院住院报销',
    category: '住院待遇',
    city1Val: `${Math.round(resTier3_1 * 100)}%`,
    city2Val: `${Math.round(resTier3_2 * 100)}%`,
    advantage: advT3
  });

  // 5. 职工在职三级医院住院报销比例
  const empTier3_1 = city1.employee.inpatient.tierBenefits.tier3?.reimbursementRatio || 0.80;
  const empTier3_2 = city2.employee.inpatient.tierBenefits.tier3?.reimbursementRatio || 0.80;
  let advET3: 'city1' | 'city2' | 'equal' = 'equal';
  if (empTier3_1 > empTier3_2) { advET3 = 'city1'; win1++; }
  else if (empTier3_2 > empTier3_1) { advET3 = 'city2'; win2++; }
  metrics.push({
    name: '职工三级医院住院报销',
    category: '住院待遇',
    city1Val: `${Math.round(empTier3_1 * 100)}%`,
    city2Val: `${Math.round(empTier3_2 * 100)}%`,
    advantage: advET3
  });

  // 6. 基本医保统筹基金年度封顶限额 (越高越好)
  const cap1 = city1.resident.inpatient.annualCap;
  const cap2 = city2.resident.inpatient.annualCap;
  let advInCap: 'city1' | 'city2' | 'equal' = 'equal';
  if (cap1 > cap2) { advInCap = 'city1'; win1++; }
  else if (cap2 > cap1) { advInCap = 'city2'; win2++; }
  metrics.push({
    name: '居民住院基本医保封顶线',
    category: '基金限额',
    city1Val: `¥${Math.round(cap1 / 10000)} 万元`,
    city2Val: `¥${Math.round(cap2 / 10000)} 万元`,
    advantage: advInCap
  });

  // 7. 退休人员比例优待上浮幅度
  const retBonus1 = city1.employee.inpatient.tierBenefits.tier3?.retireeRatioBonus || 0.05;
  const retBonus2 = city2.employee.inpatient.tierBenefits.tier3?.retireeRatioBonus || 0.05;
  let advBonus: 'city1' | 'city2' | 'equal' = 'equal';
  if (retBonus1 > retBonus2) { advBonus = 'city1'; win1++; }
  else if (retBonus2 > retBonus1) { advBonus = 'city2'; win2++; }
  metrics.push({
    name: '退休职工报销上浮倾斜',
    category: '退休倾斜',
    city1Val: `+${Math.round(retBonus1 * 100)}%`,
    city2Val: `+${Math.round(retBonus2 * 100)}%`,
    advantage: advBonus
  });

  return {
    city1,
    city2,
    city1Composite: score1,
    city2Composite: score2,
    metrics,
    city1WinCount: win1,
    city2WinCount: win2
  };
}
