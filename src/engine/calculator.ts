import type {
  CalculateRequest,
  CalculateResult,
  CityInsuranceData,
  OfficialPolicyDoc,
  HospitalTier,
  HospitalTierBenefit,
  RepeatedDeductiblePolicy
} from '../data/types';
import { getCityDataByCode } from '../data';

/**
 * 年内多次住院起付线阶梯递减解析结果
 */
export interface InpatientDeductibleResolution {
  standardDeductible: number;      // 基准起付线（首次住院标准）
  appliedDeductible: number;       // 本次实际适用起付线（梯次衰减后）
  deductibleReduction: number;     // 减免金额 (standardDeductible - appliedDeductible)
  note?: string;                   // 政策说明
}

/**
 * 解析并计算自然年度内多次住院实际适用的起付线
 */
export function resolveInpatientDeductible(params: {
  cityCode: string;
  insuranceType: 'employee' | 'resident';
  hospitalTier: HospitalTier;
  standardDeductible: number;
  hospitalizationCount?: number;
  policy?: RepeatedDeductiblePolicy;
  ruleText?: string;
}): InpatientDeductibleResolution {
  const {
    standardDeductible,
    hospitalizationCount = 1,
    policy,
    ruleText,
    cityCode,
    insuranceType,
    hospitalTier
  } = params;

  // 1. 首次住院或未指定频次，全额适用标准起付线
  if (hospitalizationCount <= 1) {
    return {
      standardDeductible,
      appliedDeductible: standardDeductible,
      deductibleReduction: 0
    };
  }

  // 2. 结构化策略优先匹配 (若配置)
  if (policy) {
    if (policy.excludeTiers && policy.excludeTiers.includes(hospitalTier)) {
      return {
        standardDeductible,
        appliedDeductible: standardDeductible,
        deductibleReduction: 0,
        note: `${hospitalTier}机构多次住院不执行起付线减免，执行基准起付线 ¥${standardDeductible}`
      };
    }

    switch (policy.type) {
      case 'none':
        return {
          standardDeductible,
          appliedDeductible: standardDeductible,
          deductibleReduction: 0,
          note: `当年多次住院不递减起付线，本次执行基准起付线 ¥${standardDeductible}`
        };
      case 'half_from_second': {
        const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
        const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
        return {
          standardDeductible,
          appliedDeductible: applied,
          deductibleReduction: reduction,
          note: `年度第 ${hospitalizationCount} 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
        };
      }
      case 'half_second_zero_third': {
        if (hospitalizationCount === 2) {
          const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
          const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
          return {
            standardDeductible,
            appliedDeductible: applied,
            deductibleReduction: reduction,
            note: `年度第 2 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
          };
        } else {
          return {
            standardDeductible,
            appliedDeductible: 0,
            deductibleReduction: standardDeductible,
            note: `年度第 ${hospitalizationCount} 次及以上住院免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
          };
        }
      }
      case 'step_down': {
        const step = policy.stepAmount ?? 100;
        const floor = policy.minFloor ?? 100;
        const applied = Math.max(floor, Math.round((standardDeductible - (hospitalizationCount - 1) * step) * 100) / 100);
        const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
        return {
          standardDeductible,
          appliedDeductible: applied,
          deductibleReduction: reduction,
          note: `多次住院起付线递减至 ¥${applied}（保底不低于 ¥${floor}，减免 ¥${reduction}）`
        };
      }
      case 'highest_tier_once':
        return {
          standardDeductible,
          appliedDeductible: 0,
          deductibleReduction: standardDeductible,
          note: `年度内多次住院按最高级别机构计算一次，本次免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
        };
      case 'custom_matrix': {
        if (policy.tierMatrix && policy.tierMatrix[hospitalTier]) {
          const seq = policy.tierMatrix[hospitalTier]!;
          const idx = Math.min(hospitalizationCount - 1, seq.length - 1);
          const applied = seq[idx];
          const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
          return {
            standardDeductible,
            appliedDeductible: applied,
            deductibleReduction: reduction,
            note: `第 ${hospitalizationCount} 次住院执行阶梯起付线 ¥${applied}（减免 ¥${reduction}）`
          };
        }
        break;
      }
    }
  }

  // 3. 西安市城镇职工医保专属特等矩阵 (权威公文市政发〔1999〕145号、市医保发〔2022〕75号)
  if (cityCode === '610100' && insuranceType === 'employee') {
    const xianMatrix: Record<HospitalTier, number[]> = {
      community: [200, 150, 100, 0],
      tier1: [200, 150, 100, 0],
      tier2: [400, 300, 150, 0],
      tier3: [650, 550, 350, 0],
      tier3_top: [850, 800, 550, 0]
    };
    const seq = xianMatrix[hospitalTier] || [standardDeductible, standardDeductible, standardDeductible, 0];
    const idx = Math.min(hospitalizationCount - 1, seq.length - 1);
    const applied = seq[idx];
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `西安职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    };
  }

  // 4. 安康市职工医保特等矩阵 (安康职工现行公文)
  if (cityCode === '610900' && insuranceType === 'employee') {
    const ankangMatrix: Record<HospitalTier, number[]> = {
      community: [200, 100, 0],
      tier1: [200, 100, 0],
      tier2: [400, 200, 0],
      tier3: [800, 400, 0],
      tier3_top: [800, 400, 0]
    };
    const seq = ankangMatrix[hospitalTier] || [standardDeductible, 0, 0];
    const idx = Math.min(hospitalizationCount - 1, seq.length - 1);
    const applied = seq[idx];
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `安康职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    };
  }

  // 5. 杨凌示范区职工医保特等矩阵
  if (cityCode === '610403' && insuranceType === 'employee') {
    const yanglingMatrix: Record<HospitalTier, number[]> = {
      community: [200, 150, 100, 0],
      tier1: [200, 150, 100, 0],
      tier2: [400, 300, 150, 0],
      tier3: [850, 650, 400, 0],
      tier3_top: [850, 650, 400, 0]
    };
    const seq = yanglingMatrix[hospitalTier] || [standardDeductible, standardDeductible, standardDeductible, 0];
    const idx = Math.min(hospitalizationCount - 1, seq.length - 1);
    const applied = seq[idx];
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `杨凌示范区职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    };
  }

  // 6. 商洛市职工医保特等矩阵
  if (cityCode === '611000' && insuranceType === 'employee') {
    const shangluoMatrix: Record<HospitalTier, number[]> = {
      community: [300, 220, 180],
      tier1: [300, 220, 180],
      tier2: [400, 300, 200],
      tier3: [600, 460, 320],
      tier3_top: [600, 460, 320]
    };
    const seq = shangluoMatrix[hospitalTier] || [standardDeductible, standardDeductible, standardDeductible];
    const idx = Math.min(hospitalizationCount - 1, seq.length - 1);
    const applied = seq[idx];
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `商洛职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    };
  }

  // 7. 智能公文语义状态机解析
  const text = ruleText || '';

  // 7.1 不递减判断
  if (
    text.includes('不递减') ||
    text.includes('不执行多次住院减免') ||
    text.includes('每次住院支付一次') ||
    text.includes('分别执行') ||
    text.includes('分别计算') ||
    text.includes('每次均按') ||
    text.includes('不实行年度阶梯递减')
  ) {
    return {
      standardDeductible,
      appliedDeductible: standardDeductible,
      deductibleReduction: 0,
      note: `当年多次住院不递减起付线，本次执行基准起付线 ¥${standardDeductible}`
    };
  }

  // 7.2 二次减半，三次及以上免除 (如浙江嘉兴、湖州等)
  if (
    text.includes('第三次及以上免') ||
    text.includes('第三次及以后0元') ||
    text.includes('第三次及以上免除') ||
    text.includes('第三次及以上免收') ||
    text.includes('第三次及以后住院免收') ||
    text.includes('第三次及以后免收') ||
    text.includes('第三次及以上为0') ||
    text.includes('第三次及以后0') ||
    text.includes('第三次及以上免缴')
  ) {
    if (hospitalizationCount === 2) {
      const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
      const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
      return {
        standardDeductible,
        appliedDeductible: applied,
        deductibleReduction: reduction,
        note: `同年度第 2 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
      };
    } else {
      return {
        standardDeductible,
        appliedDeductible: 0,
        deductibleReduction: standardDeductible,
        note: `同年度第 ${hospitalizationCount} 次及以上住院免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
      };
    }
  }

  // 7.3 二次及以上减半 (如北京、深圳、武汉、四川各市等)
  if (
    text.includes('减半') ||
    text.includes('降低50%') ||
    text.includes('递减50%') ||
    text.includes('降为50%') ||
    text.includes('按50%')
  ) {
    if (text.includes('除外') && (hospitalTier === 'community' || hospitalTier === 'tier1')) {
      return {
        standardDeductible,
        appliedDeductible: standardDeductible,
        deductibleReduction: 0,
        note: `基层医疗卫生机构多次住院不执行起付线减半，执行基准起付线 ¥${standardDeductible}`
      };
    }
    const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `同年度第 ${hospitalizationCount} 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
    };
  }

  // 7.4 定额递减并设保底 (如重庆: "从第二次起起付线依次递减100元，最低不低于100元"; 西安居民: "每次递减50元，但最低不得低于100元")
  const matchStep = text.match(/每次递减(\d+)元.*?最低(?:降至|不得低于|不低于)(\d+)元/) ||
                    text.match(/依次递减(\d+)元.*?最低(?:降至|不得低于|不低于)(\d+)元/) ||
                    text.match(/递减(\d+)元.*?最低(?:降至|不得低于|不低于)(\d+)元/);
  if (matchStep) {
    const step = parseInt(matchStep[1], 10);
    const floor = parseInt(matchStep[2], 10);
    const applied = Math.max(floor, Math.round((standardDeductible - (hospitalizationCount - 1) * step) * 100) / 100);
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `多次住院起付线每次递减 ¥${step}，本次执行 ¥${applied}（保底 ¥${floor}${reduction > 0 ? `，减免 ¥${reduction}` : ''}）`
    };
  }

  // 7.5 定额递减无显式保底 (如: "从第二次住院起，起付标准降低100元" / "起付标准递减100元")
  const matchSimpleStep = text.match(/(?:每次)?(?:递减|降低)(\d+)元/);
  if (matchSimpleStep) {
    const step = parseInt(matchSimpleStep[1], 10);
    const floor = Math.min(100, standardDeductible);
    const applied = Math.max(floor, Math.round((standardDeductible - (hospitalizationCount - 1) * step) * 100) / 100);
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `多次住院起付线递减 ¥${(hospitalizationCount - 1) * step}，本次执行 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    };
  }

  // 7.6 百分比递减 (如商洛居民: "依次降低20%，最高降低40%"; 延安职工: "第二次住院起付标准降低20%，第三次及以上住院起付标准降低30%")
  if (text.includes('依次降低20%') || text.includes('降低20%')) {
    const discountRate = hospitalizationCount === 2 ? 0.20 : 0.30;
    const applied = Math.round(standardDeductible * (1 - discountRate) * 100) / 100;
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return {
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `多次住院起付标准降低 ${Math.round(discountRate * 100)}%（降为 ¥${applied}，减免 ¥${reduction}）`
    };
  }

  // 7.7 最高级别机构计算一次 (如杭州、宁波)
  if (text.includes('最高级别') && text.includes('一次')) {
    return {
      standardDeductible,
      appliedDeductible: 0,
      deductibleReduction: standardDeductible,
      note: `年度内多次住院按最高级别机构计算一次，本次免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
    };
  }

  // 7.8 兜底：未匹配到特定递减语义时保持基准起付线
  return {
    standardDeductible,
    appliedDeductible: standardDeductible,
    deductibleReduction: 0
  };
}

/**
 * 医保报销精确计算引擎
 * 严格遵照国家及地市医保算法：
 * 统筹基金支付 = (总费用 - 目录外自费 - 乙类先行自付 - 起付线) * 综合报销比例
 */
export function calculateReimbursement(
  request: CalculateRequest,
  customCityData?: CityInsuranceData
): CalculateResult {
  const city = customCityData || getCityDataByCode(request.cityCode);
  if (!city) {
    throw new Error(`未找到城市编码 [${request.cityCode}] 的医保政策数据`);
  }

  const pkg = request.insuranceType === 'employee' ? city.employee : city.resident;
  const isRetiree = request.insuranceType === 'employee' && !!request.isRetiree;

  // 1. 基础花费分解 (强制入参分级规整，杜绝亚分漂移)
  const totalCost = Math.round(Math.max(0, Number(request.totalCost) || 0) * 100) / 100;
  const nonInsuranceCost = Math.round(Math.max(0, Number(request.nonInsuranceCost) || 0) * 100) / 100;
  const classBCost = Math.round(Math.max(0, Number(request.classBCost) || 0) * 100) / 100;
  const classBRatio = request.classBSelfPayRatio ?? 0.05;
  const classBPriorPay = Math.round(classBCost * classBRatio * 100) / 100;

  // 符合医保政策范围内的费用 (进入医保统筹池的基数)
  const eligibleCost = Math.round(Math.max(0, totalCost - nonInsuranceCost - classBPriorPay) * 100) / 100;

  // 2. 区分门诊 vs 住院规则
  let deductible = 0;
  let standardDeductible = 0;
  let appliedDeductible = 0;
  let deductibleReduction = 0;
  let baseRatio = 0;
  let annualCap = 0;
  let sourceDocId = '';
  let tierName = '';
  let currentTierBenefit: HospitalTierBenefit | undefined;
  const policyNotes: string[] = [];

  if (request.treatmentType === 'outpatient') {
    const outRule = pkg.outpatient;
    sourceDocId = outRule.sourceDocId;
    const tierBenefit = outRule.tierBenefits[request.hospitalTier];
    currentTierBenefit = tierBenefit;
    tierName = tierBenefit?.tierName || '门诊定点医疗机构';

    // 优先采用该级别医疗机构设定的具体起付线；若未单独设定则采用统筹区统一门诊起付线
    if (tierBenefit && typeof tierBenefit.deductible === 'number') {
      deductible = tierBenefit.deductible;
    } else {
      deductible = outRule.annualDeductible ?? 0;
    }

    if (isRetiree && outRule.annualDeductibleRetiree !== undefined && deductible > 0) {
      deductible = Math.min(deductible, outRule.annualDeductibleRetiree);
    }
    baseRatio = tierBenefit?.reimbursementRatio ?? 0.50;
    if (isRetiree && baseRatio > 0 && tierBenefit?.retireeRatioBonus) {
      baseRatio += tierBenefit.retireeRatioBonus;
    }

    annualCap = (isRetiree && outRule.annualCapRetiree) ? outRule.annualCapRetiree : outRule.annualCap;
    if (outRule.deductibleType === 'per_visit') {
      policyNotes.push(`门诊起付标准按就医诊次执行，本次起付线 ¥${deductible}`);
    } else if (deductible > 0) {
      policyNotes.push(`门诊统筹年度累计起付标准 ¥${deductible}`);
    }
    if (outRule.note) {
      policyNotes.push(outRule.note);
    }

    standardDeductible = deductible;
    appliedDeductible = deductible;
    deductibleReduction = 0;
  } else {
    // 住院
    const inRule = pkg.inpatient;
    sourceDocId = inRule.sourceDocId;
    const tierBenefit = inRule.tierBenefits[request.hospitalTier];
    currentTierBenefit = tierBenefit;
    tierName = tierBenefit?.tierName || '住院定点医疗机构';

    standardDeductible = tierBenefit?.deductible ?? 500;
    baseRatio = tierBenefit?.reimbursementRatio ?? 0.70;
    if (isRetiree && baseRatio > 0 && tierBenefit?.retireeRatioBonus) {
      baseRatio += tierBenefit.retireeRatioBonus;
    }

    annualCap = (isRetiree && inRule.annualCapRetiree) ? inRule.annualCapRetiree : inRule.annualCap;

    const hospitalizationCount = request.hospitalizationCount
      ? Math.max(1, Math.floor(request.hospitalizationCount))
      : 1;

    const decayRes = resolveInpatientDeductible({
      cityCode: city.cityCode,
      insuranceType: request.insuranceType,
      hospitalTier: request.hospitalTier,
      standardDeductible,
      hospitalizationCount,
      policy: inRule.repeatedDeductiblePolicy,
      ruleText: inRule.repeatedDeductibleRule
    });

    deductible = decayRes.appliedDeductible;
    appliedDeductible = decayRes.appliedDeductible;
    deductibleReduction = decayRes.deductibleReduction;

    if (decayRes.note) {
      policyNotes.push(decayRes.note);
    } else if (inRule.repeatedDeductibleRule) {
      policyNotes.push(`起付标准说明: ${inRule.repeatedDeductibleRule}`);
    }
  }

  // 3. 异地就医比例调节与高级精算标定
  const remoteRule = pkg.remoteMedical;
  let remoteFactor = 1.0;
  let fixedRatioOverride: number | undefined;
  let offsiteDeductibleOverride: number | undefined;

  if (request.remoteStatus === 'transfer') {
    remoteFactor = remoteRule.transferFiledRatio;
    fixedRatioOverride = remoteRule.fixedTargetRatios?.transfer;
    offsiteDeductibleOverride = remoteRule.offsiteDeductibles?.transferDeductible;
    policyNotes.push(`异地转诊已备案：统筹报销比例按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'unfiled_emergency') {
    remoteFactor = remoteRule.unfiledEmergencyRatio;
    policyNotes.push(`异地急诊抢救（未事前备案）：报销比例按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'unfiled_normal') {
    remoteFactor = remoteRule.unfiledNormalRatio;
    fixedRatioOverride = remoteRule.fixedTargetRatios?.unfiledNormal;
    offsiteDeductibleOverride = remoteRule.offsiteDeductibles?.unfiledDeductible;
    policyNotes.push(`未备案自行异地就医：报销比例下浮，按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'long_term') {
    remoteFactor = remoteRule.longTermFiledRatio;
    policyNotes.push('异地长期居留已备案：享受与参保地同等报销比例');
  }

  // 若存在法定异地指定起付线且高于原起付线，则优先使用
  if (typeof offsiteDeductibleOverride === 'number' && offsiteDeductibleOverride > deductible) {
    deductible = offsiteDeductibleOverride;
    appliedDeductible = deductible;
    policyNotes.push(`异地就医起付线按规范调整为 ¥${deductible}`);
  }

  let effectiveRatio: number;
  if (typeof fixedRatioOverride === 'number') {
    effectiveRatio = fixedRatioOverride;
  } else if (remoteRule.adjustmentMode === 'subtractive') {
    const reduction = Math.max(0, 1.0 - remoteFactor);
    effectiveRatio = Math.max(0, Math.round((baseRatio - reduction) * 1000) / 1000);
  } else {
    effectiveRatio = Math.round(baseRatio * remoteFactor * 1000) / 1000;
  }

  // 4. 起付线扣除与统筹基金报销计算
  const deductibleDeducted = Math.min(eligibleCost, deductible);
  const costInReimbursementSpan = Math.max(0, eligibleCost - deductibleDeducted);
  const reimbursableBase = costInReimbursementSpan;

  let baseReimbursed = 0;
  let baselineReimbursedWithoutPenalty = 0;

  if (request.treatmentType === 'inpatient' && currentTierBenefit?.costRanges && currentTierBenefit.costRanges.length > 0) {
    // 存在分段累进报销阶梯（如西安市城镇职工住院等现行公文规程）
    for (const range of currentTierBenefit.costRanges) {
      if (eligibleCost <= range.minAmount) continue;
      const rangeCap = range.maxAmount ?? Infinity;
      const lower = Math.max(range.minAmount, deductible);
      if (eligibleCost <= lower) continue;
      const upper = Math.min(eligibleCost, rangeCap);
      const spanCost = upper - lower;
      if (spanCost <= 0) continue;

      let rRatio = range.ratio;
      if (isRetiree) {
        if (typeof range.retireeRatio === 'number') {
          rRatio = range.retireeRatio;
        } else if (range.retireeRatioBonus) {
          rRatio += range.retireeRatioBonus;
        }
      }
      const segmentEffectiveRatio = Math.round(rRatio * remoteFactor * 1000) / 1000;
      baseReimbursed += spanCost * segmentEffectiveRatio;
      baselineReimbursedWithoutPenalty += spanCost * rRatio;
    }
    baseReimbursed = Math.round(baseReimbursed * 100) / 100;
    baselineReimbursedWithoutPenalty = Math.min(annualCap, Math.round(baselineReimbursedWithoutPenalty * 100) / 100);
  } else {
    baseReimbursed = Math.round(reimbursableBase * effectiveRatio * 100) / 100;
    baselineReimbursedWithoutPenalty = Math.min(annualCap, Math.round(reimbursableBase * baseRatio * 100) / 100);
  }

  const reachedCap = baseReimbursed >= annualCap;
  if (reachedCap) {
    policyNotes.push(`已达到医保统筹基金年度封顶线 ¥${annualCap.toLocaleString()}`);
    baseReimbursed = annualCap;
  }

  // 5. 大病保险 / 大额医疗补助计算 (与异地惩罚解耦)
  let catastrophicReimbursed = 0;
  const catRule = pkg.catastrophic;
  if (request.treatmentType === 'inpatient' && catRule) {
    if (request.insuranceType === 'employee') {
      // 职工大额医疗补助：当基本统筹达到40万封顶线后，超出符合政策部分由大额互助按规定比例报销
      if (reachedCap) {
        const catRatio = catRule.tiers[0]?.ratio ?? 0.95;
        const standardEffectiveRatio = effectiveRatio > 0 ? effectiveRatio : 0.90;
        const costToHitCap = standardEffectiveRatio > 0 ? (annualCap / standardEffectiveRatio) : annualCap;
        const excessCost = Math.max(0, reimbursableBase - costToHitCap);
        if (excessCost > 0) {
          catastrophicReimbursed = Math.round(excessCost * catRatio * 100) / 100;
          if (catRule.annualCap) {
            catastrophicReimbursed = Math.min(catastrophicReimbursed, catRule.annualCap);
          }
          policyNotes.push(`超出基本统筹封顶线部分，触发【${catRule.name}】报销 ¥${catastrophicReimbursed.toFixed(2)}`);
        }
      }
    } else {
      // 城乡居民大病保险：个人合规自负部分超过大病起付线（约10000元）后，按梯次报销
      // 剔除异地就医降比例罚扣部分，防止大病保险变相兜底违规自费
      const deductiblePenalty = Math.max(0, Math.round((baselineReimbursedWithoutPenalty - baseReimbursed) * 100) / 100);
      const shouldExcludePenalty = remoteRule.excludePenaltyFromCatastrophic !== false;
      const outOfPocketEligible = shouldExcludePenalty
        ? Math.max(0, Math.round((eligibleCost - baseReimbursed - deductiblePenalty) * 100) / 100)
        : Math.max(0, Math.round((eligibleCost - baseReimbursed) * 100) / 100);

      const catDeductible = catRule.deductible ?? 0;
      if (outOfPocketEligible > catDeductible) {
        let remainingToReimburse = outOfPocketEligible - catDeductible;
        for (const tier of catRule.tiers) {
          if (remainingToReimburse <= 0) break;
          const tierRange = (tier.maxAmount ? tier.maxAmount : Infinity) - tier.minAmount;
          const portion = Math.min(remainingToReimburse, tierRange);
          catastrophicReimbursed += portion * tier.ratio;
          remainingToReimburse -= portion;
        }
        catastrophicReimbursed = Math.round(catastrophicReimbursed * 100) / 100;
        if (catRule.annualCap && catastrophicReimbursed >= catRule.annualCap) {
          policyNotes.push(`已达到【${catRule.name}】年度最高支付限额 ¥${catRule.annualCap.toLocaleString()}`);
          catastrophicReimbursed = catRule.annualCap;
        }
        if (catastrophicReimbursed > 0) {
          policyNotes.push(`合规自负超大病起付线，触发【${catRule.name}】二次报销 ¥${catastrophicReimbursed.toFixed(2)}`);
        }
      }
    }
  }

  // 6. 汇总结果与严格资金物理守恒
  const totalReimbursed = Math.round((baseReimbursed + catastrophicReimbursed) * 100) / 100;
  const personalPayTotal = Math.round(Math.max(0, totalCost - totalReimbursed) * 100) / 100;
  const totalEffectiveRatio = totalCost > 0 ? Math.round((totalReimbursed / totalCost) * 1000) / 10 : 0;

  // 个人自付分项精算拆解
  const personalDeductiblePaid = deductibleDeducted;
  const personalSpanCoPay = Math.round(
    Math.max(0, personalPayTotal - nonInsuranceCost - classBPriorPay - personalDeductiblePaid) * 100
  ) / 100;

  // 关联的官方支撑文件
  const officialDocUsed = city.sourceDocs.find(d => d.docId === sourceDocId) || city.sourceDocs[0];

  return {
    cityData: city,
    officialDocUsed,
    input: request,
    tierName,
    policyNotes,
    breakdown: {
      totalCost,
      nonInsuranceCost,
      classBCost,
      classBPriorPay,
      classBSelfPay: classBPriorPay,
      eligibleCost,
      standardDeductible,
      appliedDeductible,
      deductibleReduction,
      deductibleDeducted,
      costInReimbursementSpan,
      baseReimbursed,
      catastrophicReimbursed,
      totalReimbursed,
      effectiveRatio: totalEffectiveRatio,
      personalPayTotal,
      personalDeductiblePaid,
      personalSpanCoPay
    }
  };
}
