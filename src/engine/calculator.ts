/**
 * 医保报销精确精算引擎 (Actuarial Calculation Engine)
 * 严格遵照国家及各统筹区官方医保政策、待遇梯次标准及损失补偿物理公理
 *
 * 核心增强 (Generation 26 Intelligence Enhancements):
 * 1. 皖境等统筹区多次住院起付线保底倒挂防御机制 (防 100 倒挂反增至 200 元)
 * 2. 全域起付线闭包守恒规整器 (finalizeDeductibleResolution):
 *    - 严格满足 0 <= appliedDeductible <= standardDeductible
 *    - 严格满足 appliedDeductible + deductibleReduction === standardDeductible
 * 3. 医疗机构等级政务别名正则归一化 (normalizeHospitalTier) 与多阶梯就近自适应推导 (resolveTierBenefit)
 * 4. 跨等级转诊连续住院起付线差额结算 (referralPreviousDeductiblePaid) 与急诊绿色通道 (isEmergency)
 * 5. 极端混沌入参自愈规整与损失补偿公理 (totalReimbursed <= totalCost, personalPayTotal >= 0)
 */

import type {
  CalculateRequest,
  CalculateResult,
  CityInsuranceData,
  OfficialPolicyDoc,
  HospitalTier,
  HospitalTierBenefit,
  RepeatedDeductiblePolicy,
  LtcDisabilityGrade,
  LtcCareMode,
  LtcBenefitResult,
  HuiminbaoBenefitResult
} from '../data/types';
import { getCityDataByCode } from '../data';
import { getLtcPolicy, getHuiminbaoPolicy } from '../data/multitierPolicies';

/**
 * 扩展测算请求参数 (支持转诊差额结算与急诊通道，支持自然语言输入与参数弹性自愈，支持多层次保障扩展)
 */
export type EnhancedCalculateRequest = Omit<CalculateRequest, 'remoteStatus' | 'hospitalizationCount' | 'hospitalTier'> & {
  hospitalTier: HospitalTier | string;
  remoteStatus?: CalculateRequest['remoteStatus'];
  hospitalizationCount?: number;
  referralPreviousDeductiblePaid?: number; // 跨等级转诊连续住院在转出医疗机构已承担的起付线金额 (差额补收)
  isEmergency?: boolean;                   // 是否突发急危重症直接就医 (触发绿色通道待遇)
  isChronicDisease?: boolean;              // 是否为门诊慢特病 (享受比照住院待遇与专属统筹报销)
  isAssistanceTarget?: boolean;            // 是否为特困人员/低保对象/医疗救助对象 (国办发〔2021〕42号大病起付线降50%，比例+5%，取消封顶线)
  pregnancyCare?: boolean;                 // 是否为生育医疗待遇/住院分娩 (享受零起付线与全额生育支持保障)
};

/**
 * 长期护理保险测算入参
 */
export interface LtcCalculateInput {
  cityCode: string;
  disabilityGrade?: LtcDisabilityGrade | string;
  careMode?: LtcCareMode | string;
  careCost: number;
  caregiverTrained?: boolean;
  isEmployee?: boolean;
}

/**
 * 城市普惠型商业健康保险测算入参
 */
export interface HuiminbaoCalculateInput {
  cityCode: string;
  productId?: string;
  inCatalogSelfPay: number;
  outCatalogCost: number;
  specialDrugCost?: number;
  isContinuous?: boolean;
  hasPreExistingCondition?: boolean;
}

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
 * 医疗机构等级输入智能消解与正则归一化
 * 支持政务中文名称、缩略词、英文别名与非标准字符串
 */
export function normalizeHospitalTier(inputTier: unknown): HospitalTier {
  if (typeof inputTier !== 'string') {
    return 'tier2'; // 缺省中位基准（二级医院）
  }
  const clean = inputTier.trim().toLowerCase();

  // 1. 三级特等 / 三甲 / 省部属重点
  if (
    clean === 'tier3_top' || clean === '3_top' || clean === 'top3' ||
    clean.includes('特等') || clean.includes('三甲') || clean.includes('三级甲等') ||
    clean.includes('省属') || clean.includes('国属') || clean.includes('部属')
  ) {
    return 'tier3_top';
  }

  // 2. 普通三级 / 市级三级 / 三乙
  if (
    clean === 'tier3' || clean === '3' || clean.includes('三级') ||
    clean.includes('三乙') || clean.includes('三级乙等') || clean.includes('市属三级')
  ) {
    return 'tier3';
  }

  // 3. 二级医疗机构 / 县级医院 / 二甲 / 二乙
  if (
    clean === 'tier2' || clean === '2' || clean.includes('二级') ||
    clean.includes('二甲') || clean.includes('二级甲等') || clean.includes('二乙') ||
    clean.includes('县级') || clean.includes('区属二级')
  ) {
    return 'tier2';
  }

  // 4. 一级医疗机构 / 乡镇卫生院 / 一甲
  if (
    clean === 'tier1' || clean === '1' || clean.includes('一级') ||
    clean.includes('一甲') || clean.includes('一级甲等') || clean.includes('乡镇') ||
    clean.includes('街道卫生院')
  ) {
    return 'tier1';
  }

  // 5. 基层社区卫生服务机构 / 村卫生室 / 门诊部
  if (
    clean === 'community' || clean === '0' || clean.includes('社区') ||
    clean.includes('基层') || clean.includes('村卫生') || clean.includes('门诊部') ||
    clean.includes('卫生所') || clean.includes('卫生服务站')
  ) {
    return 'community';
  }

  return 'tier2';
}

/**
 * 医疗机构等级待遇多阶梯就近自适应推导
 * 若统筹区未单独配置某一等级，按就医梯次层级自动匹配最近档次，杜绝未定义奔溃或无序漂移
 */
export function resolveTierBenefit(
  tierBenefits: Record<string, HospitalTierBenefit> | undefined,
  requestedTier: HospitalTier
): { benefit: HospitalTierBenefit; resolvedTier: HospitalTier; isFallback: boolean } {
  if (!tierBenefits || Object.keys(tierBenefits).length === 0) {
    return {
      benefit: {
        tierName: '定点医疗机构（智能兜底）',
        deductible: 500,
        reimbursementRatio: 0.70
      },
      resolvedTier: requestedTier,
      isFallback: true
    };
  }

  if (tierBenefits[requestedTier]) {
    return {
      benefit: tierBenefits[requestedTier],
      resolvedTier: requestedTier,
      isFallback: false
    };
  }

  // 梯次就近回退链 (Hierarchical Fallback Chains)
  const fallbackChains: Record<HospitalTier, HospitalTier[]> = {
    tier3_top: ['tier3_top', 'tier3', 'tier2', 'tier1', 'community'],
    tier3: ['tier3', 'tier3_top', 'tier2', 'tier1', 'community'],
    tier2: ['tier2', 'tier3', 'tier1', 'tier3_top', 'community'],
    tier1: ['tier1', 'community', 'tier2', 'tier3', 'tier3_top'],
    community: ['community', 'tier1', 'tier2', 'tier3', 'tier3_top']
  };

  const chain = fallbackChains[requestedTier] || ['tier2', 'tier3', 'tier1', 'community', 'tier3_top'];
  for (const candidate of chain) {
    if (tierBenefits[candidate]) {
      return {
        benefit: tierBenefits[candidate],
        resolvedTier: candidate,
        isFallback: true
      };
    }
  }

  const firstKey = Object.keys(tierBenefits)[0] as HospitalTier;
  return {
    benefit: tierBenefits[firstKey],
    resolvedTier: firstKey,
    isFallback: true
  };
}

/**
 * 严格防倒挂与闭包约束起付线最终规整
 * 确保永远满足:
 * 1. 0 <= appliedDeductible <= standardDeductible
 * 2. appliedDeductible + deductibleReduction === standardDeductible
 * 3. deductibleReduction >= 0
 */
export function finalizeDeductibleResolution(res: InpatientDeductibleResolution): InpatientDeductibleResolution {
  const standardDeductible = Math.max(0, res.standardDeductible);
  const appliedDeductible = Math.min(standardDeductible, Math.max(0, res.appliedDeductible));
  const deductibleReduction = Math.max(0, Math.round((standardDeductible - appliedDeductible) * 100) / 100);
  return {
    standardDeductible,
    appliedDeductible,
    deductibleReduction,
    note: res.note
  };
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
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: standardDeductible,
      deductibleReduction: 0
    });
  }

  // 2. 结构化策略优先匹配 (若配置)
  if (policy) {
    if (policy.excludeTiers && policy.excludeTiers.includes(hospitalTier)) {
      return finalizeDeductibleResolution({
        standardDeductible,
        appliedDeductible: standardDeductible,
        deductibleReduction: 0,
        note: `${hospitalTier}机构多次住院不执行起付线减免，执行基准起付线 ¥${standardDeductible}`
      });
    }

    switch (policy.type) {
      case 'none':
        return finalizeDeductibleResolution({
          standardDeductible,
          appliedDeductible: standardDeductible,
          deductibleReduction: 0,
          note: `当年多次住院不递减起付线，本次执行基准起付线 ¥${standardDeductible}`
        });
      case 'half_from_second': {
        const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
        const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
        return finalizeDeductibleResolution({
          standardDeductible,
          appliedDeductible: applied,
          deductibleReduction: reduction,
          note: `年度第 ${hospitalizationCount} 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
        });
      }
      case 'half_second_zero_third': {
        if (hospitalizationCount === 2) {
          const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
          const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
          return finalizeDeductibleResolution({
            standardDeductible,
            appliedDeductible: applied,
            deductibleReduction: reduction,
            note: `年度第 2 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
          });
        } else {
          return finalizeDeductibleResolution({
            standardDeductible,
            appliedDeductible: 0,
            deductibleReduction: standardDeductible,
            note: `年度第 ${hospitalizationCount} 次及以上住院免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
          });
        }
      }
      case 'step_down': {
        const step = policy.stepAmount ?? 100;
        const rawFloor = policy.minFloor ?? 100;
        // 防御保底倒挂：有效保底线不得高于基准起付线
        const floor = Math.min(rawFloor, standardDeductible);
        const rawApplied = Math.round((standardDeductible - (hospitalizationCount - 1) * step) * 100) / 100;
        const applied = Math.min(standardDeductible, Math.max(floor, rawApplied));
        const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
        return finalizeDeductibleResolution({
          standardDeductible,
          appliedDeductible: applied,
          deductibleReduction: reduction,
          note: reduction > 0
            ? `多次住院起付线递减至 ¥${applied}（保底不低于 ¥${floor}，减免 ¥${reduction}）`
            : `多次住院执行基准起付线 ¥${applied}（基准起付线已达保底标准 ¥${floor}）`
        });
      }
      case 'highest_tier_once':
        return finalizeDeductibleResolution({
          standardDeductible,
          appliedDeductible: 0,
          deductibleReduction: standardDeductible,
          note: `年度内多次住院按最高级别机构计算一次，本次免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
        });
      case 'custom_matrix': {
        if (policy.tierMatrix && policy.tierMatrix[hospitalTier]) {
          const seq = policy.tierMatrix[hospitalTier]!;
          const idx = Math.min(hospitalizationCount - 1, seq.length - 1);
          const rawApplied = seq[idx];
          const applied = Math.min(standardDeductible, Math.max(0, rawApplied));
          const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
          return finalizeDeductibleResolution({
            standardDeductible,
            appliedDeductible: applied,
            deductibleReduction: reduction,
            note: `第 ${hospitalizationCount} 次住院执行阶梯起付线 ¥${applied}（减免 ¥${reduction}）`
          });
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
    const applied = Math.min(standardDeductible, Math.max(0, seq[idx]));
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `西安职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    });
  }

  // 4. 安康市职工医保特等矩阵 (安政办发〔2022〕25号)
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
    const applied = Math.min(standardDeductible, Math.max(0, seq[idx]));
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `安康职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    });
  }

  // 5. 杨凌示范区职工医保特等矩阵 (杨管办发〔2022〕34号)
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
    const applied = Math.min(standardDeductible, Math.max(0, seq[idx]));
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `杨凌示范区职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    });
  }

  // 6. 商洛市职工医保特等矩阵 (商政办发〔2022〕27号)
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
    const applied = Math.min(standardDeductible, Math.max(0, seq[idx]));
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `商洛职工医保多次住院阶梯起付线：第 ${hospitalizationCount} 次住院起付线为 ¥${applied}${reduction > 0 ? `（减免 ¥${reduction}）` : ''}`
    });
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
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: standardDeductible,
      deductibleReduction: 0,
      note: `当年多次住院不递减起付线，本次执行基准起付线 ¥${standardDeductible}`
    });
  }

  // 7.2 二次减半，三次及以上免除
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
      return finalizeDeductibleResolution({
        standardDeductible,
        appliedDeductible: applied,
        deductibleReduction: reduction,
        note: `同年度第 2 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
      });
    } else {
      return finalizeDeductibleResolution({
        standardDeductible,
        appliedDeductible: 0,
        deductibleReduction: standardDeductible,
        note: `同年度第 ${hospitalizationCount} 次及以上住院免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
      });
    }
  }

  // 7.3 二次及以上减半
  if (
    text.includes('减半') ||
    text.includes('降低50%') ||
    text.includes('递减50%') ||
    text.includes('降为50%') ||
    text.includes('按50%')
  ) {
    if (text.includes('除外') && (hospitalTier === 'community' || hospitalTier === 'tier1')) {
      return finalizeDeductibleResolution({
        standardDeductible,
        appliedDeductible: standardDeductible,
        deductibleReduction: 0,
        note: `基层医疗卫生机构多次住院不执行起付线减半，执行基准起付线 ¥${standardDeductible}`
      });
    }
    const applied = Math.round(standardDeductible * 0.5 * 100) / 100;
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `同年度第 ${hospitalizationCount} 次住院起付标准减半（降为 ¥${applied}，减免 ¥${reduction}）`
    });
  }

  // 7.4 定额递减并设保底 (含安徽等基准起付线小于保底线防御)
  const matchStep = text.match(/每次递减(\d+)元.*?最低(?:降至|不得低于|不低于)(\d+)元/) ||
                    text.match(/依次递减(\d+)元.*?最低(?:降至|不得低于|不低于)(\d+)元/) ||
                    text.match(/递减(\d+)元.*?最低(?:降至|不得低于|不低于)(\d+)元/);
  if (matchStep) {
    const step = parseInt(matchStep[1], 10);
    const rawFloor = parseInt(matchStep[2], 10);
    // 防御保底倒挂：有效保底线不得高于基准起付线
    const floor = Math.min(rawFloor, standardDeductible);
    const rawApplied = Math.round((standardDeductible - (hospitalizationCount - 1) * step) * 100) / 100;
    const applied = Math.min(standardDeductible, Math.max(floor, rawApplied));
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: reduction > 0
        ? `多次住院起付线每次递减 ¥${step}，本次执行 ¥${applied}（保底 ¥${floor}，减免 ¥${reduction}）`
        : `多次住院执行基准起付线 ¥${applied}（基准起付线已达保底标准 ¥${floor}）`
    });
  }

  // 7.5 定额递减无显式保底
  const matchSimpleStep = text.match(/(?:每次)?(?:递减|降低)(\d+)元/);
  if (matchSimpleStep) {
    const step = parseInt(matchSimpleStep[1], 10);
    const floor = Math.min(100, standardDeductible);
    const rawApplied = Math.round((standardDeductible - (hospitalizationCount - 1) * step) * 100) / 100;
    const applied = Math.min(standardDeductible, Math.max(floor, rawApplied));
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: reduction > 0
        ? `多次住院起付线递减 ¥${(hospitalizationCount - 1) * step}，本次执行 ¥${applied}（减免 ¥${reduction}）`
        : `多次住院执行基准起付线 ¥${applied}`
    });
  }

  // 7.6 百分比递减
  if (text.includes('依次降低20%') || text.includes('降低20%')) {
    const discountRate = hospitalizationCount === 2 ? 0.20 : 0.30;
    const applied = Math.round(standardDeductible * (1 - discountRate) * 100) / 100;
    const reduction = Math.max(0, Math.round((standardDeductible - applied) * 100) / 100);
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: applied,
      deductibleReduction: reduction,
      note: `多次住院起付标准降低 ${Math.round(discountRate * 100)}%（降为 ¥${applied}，减免 ¥${reduction}）`
    });
  }

  // 7.7 最高级别机构计算一次
  if (text.includes('最高级别') && text.includes('一次')) {
    return finalizeDeductibleResolution({
      standardDeductible,
      appliedDeductible: 0,
      deductibleReduction: standardDeductible,
      note: `年度内多次住院按最高级别机构计算一次，本次免收起付线（起付线 ¥0，减免 ¥${standardDeductible}）`
    });
  }

  // 7.8 兜底：未匹配到特定递减语义时保持基准起付线
  return finalizeDeductibleResolution({
    standardDeductible,
    appliedDeductible: standardDeductible,
    deductibleReduction: 0
  });
}

/**
 * 医保报销精确计算引擎
 * 严格遵照国家及地市医保算法与损失补偿物理公理
 */
export function calculateReimbursement(
  request: EnhancedCalculateRequest,
  customCityData?: CityInsuranceData
): CalculateResult {
  const city = customCityData || getCityDataByCode(request.cityCode);
  if (!city) {
    throw new Error(`未找到城市编码 [${request.cityCode}] 的医保政策数据`);
  }

  const pkg = request.insuranceType === 'employee' ? city.employee : city.resident;
  const isRetiree = request.insuranceType === 'employee' && !!request.isRetiree;

  // 1. 基础花费分解与自愈约束 (强制入参分级规整，杜绝亚分漂移与负值/倒挂注入)
  const rawTotalCost = Number.isFinite(Number(request.totalCost)) ? Number(request.totalCost) : 0;
  const totalCost = Math.round(Math.max(0, rawTotalCost) * 100) / 100;

  const rawNonIns = Number.isFinite(Number(request.nonInsuranceCost)) ? Number(request.nonInsuranceCost) : 0;
  const nonInsuranceCost = Math.round(Math.min(totalCost, Math.max(0, rawNonIns)) * 100) / 100;

  const maxAllowedClassB = Math.max(0, totalCost - nonInsuranceCost);
  const rawClassB = Number.isFinite(Number(request.classBCost)) ? Number(request.classBCost) : 0;
  const classBCost = Math.round(Math.min(maxAllowedClassB, Math.max(0, rawClassB)) * 100) / 100;

  const rawClassBRatio = Number.isFinite(Number(request.classBSelfPayRatio)) ? Number(request.classBSelfPayRatio) : 0.05;
  const classBRatio = Math.min(1, Math.max(0, rawClassBRatio));
  const classBPriorPay = Math.round(classBCost * classBRatio * 100) / 100;

  // 符合医保政策范围内的费用 (进入医保统筹池的基数，恒满足 eligibleCost <= totalCost)
  const eligibleCost = Math.round(Math.max(0, totalCost - nonInsuranceCost - classBPriorPay) * 100) / 100;

  // 医疗机构等级归一化消解
  const normalizedTier = normalizeHospitalTier(request.hospitalTier);

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
    sourceDocId = outRule?.sourceDocId || city.sourceDocs[0]?.docId || '';
    const resolvedTier = resolveTierBenefit(outRule?.tierBenefits, normalizedTier);
    const tierBenefit = resolvedTier.benefit;
    currentTierBenefit = tierBenefit;
    tierName = tierBenefit?.tierName || '门诊定点医疗机构';
    if (resolvedTier.isFallback && request.hospitalTier && request.hospitalTier !== normalizedTier) {
      policyNotes.push(`门诊就医机构等级[${request.hospitalTier}]自适应匹配至[${resolvedTier.resolvedTier}]标准执行`);
    }

    if (tierBenefit && typeof tierBenefit.deductible === 'number') {
      deductible = tierBenefit.deductible;
    } else {
      deductible = outRule?.annualDeductible ?? 0;
    }

    if (isRetiree && outRule?.annualDeductibleRetiree !== undefined && deductible > 0) {
      deductible = Math.min(deductible, outRule.annualDeductibleRetiree);
    }
    baseRatio = tierBenefit?.reimbursementRatio ?? 0.50;
    if (isRetiree && baseRatio > 0 && tierBenefit?.retireeRatioBonus) {
      baseRatio += tierBenefit.retireeRatioBonus;
    }

    annualCap = (isRetiree && outRule?.annualCapRetiree) ? outRule.annualCapRetiree : (outRule?.annualCap ?? 4000);
    if (outRule?.deductibleType === 'per_visit') {
      policyNotes.push(`门诊起付标准按就医诊次执行，本次起付线 ¥${deductible}`);
    } else if (deductible > 0) {
      policyNotes.push(`门诊统筹年度累计起付标准 ¥${deductible}`);
    }
    if (outRule?.note) {
      policyNotes.push(outRule.note);
    }

    standardDeductible = deductible;
    appliedDeductible = deductible;
    deductibleReduction = 0;

    // 门诊慢特病待遇智能适配 (Chronic Disease Outpatient Support)
    if (request.isChronicDisease) {
      const inRule = pkg.inpatient;
      const inTier = resolveTierBenefit(inRule?.tierBenefits, normalizedTier).benefit;
      const chronicRatio = inTier?.reimbursementRatio ?? Math.min(0.90, baseRatio + 0.15);
      baseRatio = Math.max(baseRatio, chronicRatio);
      if (isRetiree && inTier?.retireeRatioBonus) {
        baseRatio += inTier.retireeRatioBonus;
      }
      baseRatio = Math.min(0.95, baseRatio);
      if (inTier?.deductible !== undefined) {
        deductible = Math.min(deductible, inTier.deductible);
        standardDeductible = deductible;
        appliedDeductible = deductible;
      }
      annualCap = Math.max(annualCap, inRule?.annualCap ?? 150000);
      policyNotes.push('已自动匹配【门诊慢特病/特殊病】待遇政策：报销比例比照住院待遇执行，起付线按年度单次核定，并调高统筹基金支付限额');
    }

    // 门诊生育产检待遇支持 (Pregnancy Care Outpatient Support)
    if (request.pregnancyCare) {
      deductibleReduction = standardDeductible;
      appliedDeductible = 0;
      deductible = 0;
      baseRatio = Math.min(1.0, Math.max(baseRatio, 0.85));
      policyNotes.push('依据国家生育支持政策：门诊产前检查享受零起付线与全额生育医疗费用保障');
    }
  } else {
    // 住院
    const inRule = pkg.inpatient;
    sourceDocId = inRule?.sourceDocId || city.sourceDocs[0]?.docId || '';
    const resolvedTier = resolveTierBenefit(inRule?.tierBenefits, normalizedTier);
    const tierBenefit = resolvedTier.benefit;
    currentTierBenefit = tierBenefit;
    tierName = tierBenefit?.tierName || '住院定点医疗机构';
    if (resolvedTier.isFallback && request.hospitalTier && request.hospitalTier !== normalizedTier) {
      policyNotes.push(`住院就医机构等级[${request.hospitalTier}]自适应匹配至[${resolvedTier.resolvedTier}]标准执行`);
    }

    standardDeductible = tierBenefit?.deductible ?? 500;
    baseRatio = tierBenefit?.reimbursementRatio ?? 0.70;
    if (isRetiree && baseRatio > 0 && tierBenefit?.retireeRatioBonus) {
      baseRatio += tierBenefit.retireeRatioBonus;
    }

    annualCap = (isRetiree && inRule?.annualCapRetiree) ? inRule.annualCapRetiree : (inRule?.annualCap ?? 300000);

    const hospitalizationCount = Number.isFinite(request.hospitalizationCount)
      ? Math.max(1, Math.floor(request.hospitalizationCount!))
      : 1;

    const decayRes = resolveInpatientDeductible({
      cityCode: city.cityCode,
      insuranceType: request.insuranceType,
      hospitalTier: normalizedTier,
      standardDeductible,
      hospitalizationCount,
      policy: inRule?.repeatedDeductiblePolicy,
      ruleText: inRule?.repeatedDeductibleRule
    });

    deductible = decayRes.appliedDeductible;
    appliedDeductible = decayRes.appliedDeductible;
    deductibleReduction = decayRes.deductibleReduction;

    // 跨等级连续转诊起付线差额结算 (Referral Deductible Differential)
    if (request.referralPreviousDeductiblePaid && request.referralPreviousDeductiblePaid > 0) {
      const prevPaid = Math.max(0, Math.round(request.referralPreviousDeductiblePaid * 100) / 100);
      const originalDeductible = appliedDeductible;
      appliedDeductible = Math.max(0, Math.round((appliedDeductible - prevPaid) * 100) / 100);
      deductible = appliedDeductible;
      deductibleReduction = Math.max(0, Math.round((standardDeductible - appliedDeductible) * 100) / 100);
      policyNotes.push(`跨等级转诊连续住院起付线差额结算：扣除转出机构已付 ¥${prevPaid}，本次实收起付线 ¥${appliedDeductible}（减免 ¥${Math.min(originalDeductible, prevPaid)}）`);
    }

    // 住院分娩生育支持待遇 (Pregnancy Care Inpatient Support)
    if (request.pregnancyCare) {
      deductibleReduction = standardDeductible;
      appliedDeductible = 0;
      deductible = 0;
      baseRatio = Math.min(1.0, Math.max(baseRatio, 0.85));
      policyNotes.push('依据国家生育支持政策：住院分娩享受零起付线与全额生育医疗费用保障');
    }

    if (decayRes.note) {
      policyNotes.push(decayRes.note);
    } else if (inRule?.repeatedDeductibleRule) {
      policyNotes.push(`起付标准说明: ${inRule.repeatedDeductibleRule}`);
    }
  }

  // 3. 异地就医比例调节与高级精算标定
  const remoteRule = pkg.remoteMedical || {
    sourceDocId: '',
    filingChannels: ['国家医保服务平台APP'],
    longTermFiledRatio: 1.0,
    transferFiledRatio: 0.90,
    unfiledEmergencyRatio: 0.90,
    unfiledNormalRatio: 0.70,
    specialNotes: []
  };

  let remoteFactor = 1.0;
  let fixedRatioOverride: number | undefined;
  let offsiteDeductibleOverride: number | undefined;

  // 突发急危重症直接送医绿色通道保护
  if (request.isEmergency && (request.remoteStatus === 'unfiled_normal' || !request.remoteStatus)) {
    remoteFactor = remoteRule.unfiledEmergencyRatio ?? 0.90;
    policyNotes.push('突发急危重症直接送医绿色通道：智能触发急诊抢救待遇标准结算，免除自行就医降比例罚扣');
  } else if (request.remoteStatus === 'transfer') {
    remoteFactor = remoteRule.transferFiledRatio ?? 0.90;
    fixedRatioOverride = remoteRule.fixedTargetRatios?.transfer;
    offsiteDeductibleOverride = remoteRule.offsiteDeductibles?.transferDeductible;
    policyNotes.push(`异地转诊已备案：统筹报销比例按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'unfiled_emergency') {
    remoteFactor = remoteRule.unfiledEmergencyRatio ?? 0.90;
    policyNotes.push(`异地急诊抢救（未事前备案）：报销比例按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'unfiled_normal') {
    remoteFactor = remoteRule.unfiledNormalRatio ?? 0.70;
    fixedRatioOverride = remoteRule.fixedTargetRatios?.unfiledNormal;
    offsiteDeductibleOverride = remoteRule.offsiteDeductibles?.unfiledDeductible;
    policyNotes.push(`未备案自行异地就医：报销比例下浮，按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'long_term') {
    remoteFactor = remoteRule.longTermFiledRatio ?? 1.0;
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
    // 存在分段累进报销阶梯
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

  // 5. 大病保险 / 大额医疗补助计算
  let catastrophicReimbursed = 0;
  const catRule = pkg.catastrophic;
  if (request.treatmentType === 'inpatient' && catRule) {
    if (request.insuranceType === 'employee') {
      if (reachedCap) {
        let catRatio = catRule.tiers[0]?.ratio ?? 0.95;
        if (request.isAssistanceTarget) {
          catRatio = Math.min(1.0, catRatio + 0.05);
        }
        const standardEffectiveRatio = effectiveRatio > 0 ? effectiveRatio : 0.90;
        const costToHitCap = standardEffectiveRatio > 0 ? (annualCap / standardEffectiveRatio) : annualCap;
        const excessCost = Math.max(0, reimbursableBase - costToHitCap);
        if (excessCost > 0) {
          catastrophicReimbursed = Math.round(excessCost * catRatio * 100) / 100;
          if (catRule.annualCap && !request.isAssistanceTarget) {
            catastrophicReimbursed = Math.min(catastrophicReimbursed, catRule.annualCap);
          }
          policyNotes.push(`超出基本统筹封顶线部分，触发【${catRule.name}】报销 ¥${catastrophicReimbursed.toFixed(2)}${request.isAssistanceTarget ? '（特困低保救助对象：比例提高5个百分点，取消封顶线）' : ''}`);
        }
      }
    } else {
      const deductiblePenalty = Math.max(0, Math.round((baselineReimbursedWithoutPenalty - baseReimbursed) * 100) / 100);
      const shouldExcludePenalty = remoteRule.excludePenaltyFromCatastrophic !== false;
      const outOfPocketEligible = shouldExcludePenalty
        ? Math.max(0, Math.round((eligibleCost - baseReimbursed - deductiblePenalty) * 100) / 100)
        : Math.max(0, Math.round((eligibleCost - baseReimbursed) * 100) / 100);

      let catDeductible = catRule.deductible ?? 0;
      if (request.isAssistanceTarget) {
        catDeductible = Math.round(catDeductible * 0.5 * 100) / 100;
      }

      if (outOfPocketEligible > catDeductible) {
        let remainingToReimburse = outOfPocketEligible - catDeductible;
        for (const tier of catRule.tiers) {
          if (remainingToReimburse <= 0) break;
          const tierRange = (tier.maxAmount ? tier.maxAmount : Infinity) - tier.minAmount;
          const portion = Math.min(remainingToReimburse, tierRange);
          const tierRatio = request.isAssistanceTarget ? Math.min(1.0, tier.ratio + 0.05) : tier.ratio;
          catastrophicReimbursed += portion * tierRatio;
          remainingToReimburse -= portion;
        }
        catastrophicReimbursed = Math.round(catastrophicReimbursed * 100) / 100;
        if (!request.isAssistanceTarget && catRule.annualCap && catastrophicReimbursed >= catRule.annualCap) {
          policyNotes.push(`已达到【${catRule.name}】年度最高支付限额 ¥${catRule.annualCap.toLocaleString()}`);
          catastrophicReimbursed = catRule.annualCap;
        }
        if (catastrophicReimbursed > 0) {
          if (request.isAssistanceTarget) {
            policyNotes.push(`依据国办发〔2021〕42号倾斜救助政策：大病保险起付线降低50%(降至¥${catDeductible})，各分段支付比例提高5个百分点，取消大病封顶线，触发【${catRule.name}】二次报销 ¥${catastrophicReimbursed.toFixed(2)}`);
          } else {
            policyNotes.push(`合规自负超大病起付线，触发【${catRule.name}】二次报销 ¥${catastrophicReimbursed.toFixed(2)}`);
          }
        }
      }
    }
  }

  // 5.1 医疗救助 (Medical Assistance)
  let medicalAssistance = 0;
  if (request.medicalAssistanceAmount && request.medicalAssistanceAmount > 0) {
    const maxEligibleAssistance = Math.max(0, totalCost - baseReimbursed - catastrophicReimbursed);
    medicalAssistance = Math.round(Math.min(maxEligibleAssistance, request.medicalAssistanceAmount) * 100) / 100;
    policyNotes.push(`触发医疗救助专项金直拨给付 ¥${medicalAssistance.toFixed(2)}`);
  }

  // 5.2 城市普惠型商业健康保险 (惠民保) 二次协同赔付
  let huiminbaoBenefit = 0;
  let huiminbaoInCatalogBenefit = 0;
  let huiminbaoOutCatalogBenefit = 0;
  let huiminbaoSpecialDrugBenefit = 0;

  if (request.hasHuiminbao) {
    const inCatalogSelfPay = Math.max(0, Math.round((eligibleCost - baseReimbursed - catastrophicReimbursed) * 100) / 100);
    const specialDrug = Math.min(nonInsuranceCost, Math.max(0, request.specialDrugCost ?? 0));
    const outCatalogCost = Math.max(0, Math.round((nonInsuranceCost - specialDrug + classBPriorPay) * 100) / 100);

    const hmRes = calculateHuiminbaoBenefit({
      cityCode: city.cityCode,
      productId: request.huiminbaoProductId,
      inCatalogSelfPay,
      outCatalogCost,
      specialDrugCost: specialDrug,
      isContinuous: request.huiminbaoIsContinuous,
      hasPreExistingCondition: request.huiminbaoHasPreExistingCondition
    });

    huiminbaoInCatalogBenefit = hmRes.inCatalogBenefit;
    huiminbaoOutCatalogBenefit = hmRes.outCatalogBenefit;
    huiminbaoSpecialDrugBenefit = hmRes.specialDrugBenefit;

    const remainingBeforeHm = Math.max(0, Math.round((totalCost - baseReimbursed - catastrophicReimbursed - medicalAssistance) * 100) / 100);
    huiminbaoBenefit = Math.min(remainingBeforeHm, hmRes.totalHuiminbaoBenefit);

    if (huiminbaoBenefit > 0) {
      policyNotes.push(
        `触发【${hmRes.productName}】协同给付 ¥${huiminbaoBenefit.toFixed(2)}（医保内自付补偿 ¥${huiminbaoInCatalogBenefit.toFixed(2)}，医保外住院自费补偿 ¥${huiminbaoOutCatalogBenefit.toFixed(2)}${huiminbaoSpecialDrugBenefit > 0 ? `，特药创新药补偿 ¥${huiminbaoSpecialDrugBenefit.toFixed(2)}` : ''}）`
      );
    }
  }

  // 5.3 长期护理保险 (长护险 / 医保第六险) 待遇给付
  let ltcBenefit = 0;
  if (request.hasLtc) {
    const remainingBeforeLtc = Math.max(
      0,
      Math.round((totalCost - baseReimbursed - catastrophicReimbursed - medicalAssistance - huiminbaoBenefit) * 100) / 100
    );
    const careCost = request.ltcCareCost !== undefined
      ? Math.max(0, Number(request.ltcCareCost))
      : remainingBeforeLtc;

    const ltcRes = calculateLtcBenefit({
      cityCode: city.cityCode,
      disabilityGrade: request.ltcDisabilityGrade,
      careMode: request.ltcCareMode,
      careCost,
      isEmployee: request.insuranceType === 'employee'
    });

    ltcBenefit = Math.min(remainingBeforeLtc, ltcRes.ltcBenefit);
    if (ltcBenefit > 0) {
      policyNotes.push(
        `触发长期护理保险（长护险）待遇给付 ¥${ltcBenefit.toFixed(2)}（评定等级: ${ltcRes.disabilityGrade}，照护模式: ${ltcRes.careMode}，基金分担: ${Math.round(ltcRes.fundPayRatio * 100)}%）`
      );
    }
  }

  // 6. 汇总结果与严格资金物理守恒 (Indemnity Principle)
  const rawTotalReimbursed = Math.round(
    (baseReimbursed + catastrophicReimbursed + medicalAssistance + huiminbaoBenefit + ltcBenefit) * 100
  ) / 100;
  // 损失补偿公理：医保基金总给付额不得超过总花费及政策合规总额，杜绝超赔套利
  const totalReimbursed = Math.min(totalCost, Math.max(0, rawTotalReimbursed));
  let personalPayTotal = Math.round(Math.max(0, totalCost - totalReimbursed) * 100) / 100;

  // 资金物理守恒闭包严密核验 (浮点绝对误差 <= 0.01 元)
  if (Math.abs(totalReimbursed + personalPayTotal - totalCost) > 0.001) {
    personalPayTotal = Math.round(Math.max(0, totalCost - totalReimbursed) * 100) / 100;
  }
  const totalEffectiveRatio = totalCost > 0 ? Math.round((totalReimbursed / totalCost) * 1000) / 10 : 0;

  // 个人自付分项精算拆解
  const personalDeductiblePaid = Math.min(deductibleDeducted, personalPayTotal);
  const personalSpanCoPay = Math.round(
    Math.max(0, personalPayTotal - nonInsuranceCost - classBPriorPay - personalDeductiblePaid) * 100
  ) / 100;

  // 关联的官方支撑文件
  const officialDocUsed = city.sourceDocs.find(d => d.docId === sourceDocId) || city.sourceDocs[0];

  return {
    cityData: city,
    officialDocUsed,
    input: request as unknown as CalculateRequest,
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
      medicalAssistance,
      huiminbaoBenefit,
      huiminbaoInCatalogBenefit,
      huiminbaoOutCatalogBenefit,
      huiminbaoSpecialDrugBenefit,
      ltcBenefit,
      totalReimbursed,
      effectiveRatio: totalEffectiveRatio,
      personalPayTotal,
      personalDeductiblePaid,
      personalSpanCoPay
    }
  };
}

/**
 * 长期护理保险（长护险 / 医保第六险）待遇精算
 * 依据国家医保发〔2020〕37号及各试点城市长护险红头政策规程
 */
export function calculateLtcBenefit(input: LtcCalculateInput): LtcBenefitResult {
  const rawCost = Number.isFinite(Number(input.careCost)) ? Number(input.careCost) : 0;
  const careCost = Math.round(Math.max(0, rawCost) * 100) / 100;
  const policy = getLtcPolicy(input.cityCode);
  const notes: string[] = [];

  // 失能等级评定归一化
  const rawGrade = String(input.disabilityGrade || 'severe1').trim().toLowerCase();
  let grade: LtcDisabilityGrade = 'severe1';
  let gradeName = '重度失能I级';

  if (rawGrade === 'severe3' || rawGrade === 'severe_3' || rawGrade === '5' || rawGrade === '6' || rawGrade.includes('三级') || rawGrade.includes('3级')) {
    grade = 'severe3';
    gradeName = '重度失能III级';
  } else if (rawGrade === 'severe2' || rawGrade === 'severe_2' || rawGrade === '4' || rawGrade.includes('二级') || rawGrade.includes('2级')) {
    grade = 'severe2';
    gradeName = '重度失能II级';
  } else if (rawGrade === 'severe1' || rawGrade === 'severe_1' || rawGrade === '3' || rawGrade.includes('一级') || rawGrade.includes('1级')) {
    grade = 'severe1';
    gradeName = '重度失能I级';
  } else if (rawGrade === 'moderate' || rawGrade.includes('中度') || rawGrade === '2') {
    grade = 'moderate';
    gradeName = '中度失能';
  } else if (rawGrade === 'dementia' || rawGrade.includes('失智') || rawGrade.includes('认知')) {
    grade = 'dementia';
    gradeName = '重度失智';
  } else if (rawGrade === 'mild' || rawGrade.includes('轻度') || rawGrade === '1') {
    grade = 'mild';
    gradeName = '轻度失能';
  } else if (rawGrade === 'none' || rawGrade === '0' || rawGrade.includes('未达标') || rawGrade.includes('正常')) {
    grade = 'none';
    gradeName = '未达失能门槛';
  }

  // 照护模式归一化
  const rawMode = String(input.careMode || 'home').trim().toLowerCase();
  let isInstitution = false;
  let careModeName = '居家上门照护';

  if (
    rawMode.includes('institution') ||
    rawMode.includes('机构') ||
    rawMode.includes('养老') ||
    rawMode.includes('院护') ||
    rawMode.includes('老护')
  ) {
    isInstitution = true;
    careModeName = '养老/医疗定点机构住养照料';
  } else if (rawMode.includes('cash') || rawMode.includes('亲情') || rawMode.includes('津贴')) {
    careModeName = '居家基础照料亲情补助';
  } else {
    careModeName = '居家专业机构上门照料';
  }

  // 门槛核准 (0元费用或未达标不享受待遇)
  const isEligible = grade !== 'none' && grade !== 'mild' && careCost > 0;
  if (!isEligible) {
    if (grade === 'none' || grade === 'mild') {
      notes.push(`失能评定为【${gradeName}】，未达到长护险最低保障准入门槛`);
    }
    return {
      isEligible: false,
      cityCode: policy.cityCode,
      cityName: policy.cityName,
      disabilityGrade: gradeName,
      careMode: careModeName,
      careCost,
      ltcBenefit: 0,
      ltcPersonalPay: careCost,
      fundPayRatio: 0,
      monthlyCap: 0,
      notes
    };
  }

  // 待遇核定
  const fundPayRatio = isInstitution
    ? (policy.institutionalCare?.fundPayRatio ?? policy.defaultInstitutionRatio ?? 0.75)
    : (policy.homeService?.fundPayRatio ?? policy.defaultHomeRatio ?? 0.85);

  const monthlyCap = isInstitution
    ? (policy.institutionalCare?.monthlyFixedCapByGrade?.[grade] ?? policy.institutionalCare?.monthlyMaxCap ?? policy.defaultMonthlyCap ?? 2200)
    : (policy.homeService?.monthlyMaxCapByGrade?.[grade] ?? policy.homeService?.monthlyMaxCap ?? policy.defaultMonthlyCap ?? 2000);

  let benefit = 0;

  // 成都市定额包干模式与标准比例模式区分
  if (policy.cityCode === '510100') {
    const quota = isInstitution
      ? (policy.institutionalCare?.monthlyFixedCapByGrade?.[grade] ?? 1837)
      : (policy.homeService?.monthlyMaxCapByGrade?.[grade] ?? 1437);
    benefit = Math.min(careCost, quota);
    notes.push(`成都市长护险定额包干待遇：核定包干限额 ¥${quota}/月`);
  } else {
    benefit = Math.min(careCost * fundPayRatio, monthlyCap);
    notes.push(`长护险【${careModeName}】：基金分担比例 ${Math.round(fundPayRatio * 100)}%，月度支付限额 ¥${monthlyCap}`);
  }

  // 损失补偿与守恒约束
  const ltcBenefit = Math.round(Math.min(careCost, Math.max(0, benefit)) * 100) / 100;
  const ltcPersonalPay = Math.round(Math.max(0, careCost - ltcBenefit) * 100) / 100;

  return {
    isEligible: true,
    cityCode: policy.cityCode,
    cityName: policy.cityName,
    disabilityGrade: gradeName,
    careMode: careModeName,
    careCost,
    ltcBenefit,
    ltcPersonalPay,
    fundPayRatio,
    monthlyCap,
    notes
  };
}

/**
 * 城市普惠型商业健康保险（城市惠民保）待遇精算
 * 支持医保内自付、医保外自费、特定高额特药三层阶梯保障及连续参保优待
 */
export function calculateHuiminbaoBenefit(input: HuiminbaoCalculateInput): HuiminbaoBenefitResult {
  const policy = getHuiminbaoPolicy(input.cityCode, input.productId);
  const notes: string[] = [];

  const rawInSelfPay = Number.isFinite(Number(input.inCatalogSelfPay)) ? Number(input.inCatalogSelfPay) : 0;
  const inCatalogSelfPay = Math.round(Math.max(0, rawInSelfPay) * 100) / 100;

  const rawOutCost = Number.isFinite(Number(input.outCatalogCost)) ? Number(input.outCatalogCost) : 0;
  const outCatalogCost = Math.round(Math.max(0, rawOutCost) * 100) / 100;

  const rawSpecialDrug = Number.isFinite(Number(input.specialDrugCost)) ? Number(input.specialDrugCost) : 0;
  const specialDrugCost = Math.round(Math.max(0, rawSpecialDrug) * 100) / 100;

  const isContinuous = !!input.isContinuous;
  const isPreExisting = !!input.hasPreExistingCondition;

  if (isContinuous) {
    notes.push('已激活连续参保优待：享受更低免赔额与更优保障待遇');
  }
  if (isPreExisting) {
    notes.push('已匹配既往症差异化报销规则');
  }

  // 1. 责任一：医保内合规自付
  let inCatalogBenefit = 0;
  let inDeductible = 0;
  if (policy.inCatalogCoverage && inCatalogSelfPay > 0) {
    inDeductible = isContinuous && policy.inCatalogCoverage.deductibleConsecutive !== undefined
      ? policy.inCatalogCoverage.deductibleConsecutive
      : policy.inCatalogCoverage.deductibleStandard;
    const inRatio = isPreExisting
      ? policy.inCatalogCoverage.reimbursementRatioPreExisting
      : policy.inCatalogCoverage.reimbursementRatioHealthy;
    const excessIn = Math.max(0, inCatalogSelfPay - inDeductible);
    if (excessIn > 0) {
      const calcBenefit = Math.min(excessIn * inRatio, policy.inCatalogCoverage.annualCap);
      inCatalogBenefit = Math.round(Math.min(inCatalogSelfPay, calcBenefit) * 100) / 100;
      notes.push(`责任一（医保内自付）：扣除免赔额 ¥${inDeductible}，按 ${Math.round(inRatio * 100)}% 报销 ¥${inCatalogBenefit.toFixed(2)}`);
    } else {
      notes.push(`责任一（医保内自付）：自付金额 ¥${inCatalogSelfPay} 未达到免赔额 ¥${inDeductible}`);
    }
  }

  // 2. 责任二：医保外住院自费
  let outCatalogBenefit = 0;
  let outDeductible = 0;
  if (policy.outCatalogCoverage && outCatalogCost > 0) {
    outDeductible = isContinuous && policy.outCatalogCoverage.deductibleConsecutive !== undefined
      ? policy.outCatalogCoverage.deductibleConsecutive
      : policy.outCatalogCoverage.deductibleStandard;
    const outRatio = isPreExisting
      ? policy.outCatalogCoverage.reimbursementRatioPreExisting
      : policy.outCatalogCoverage.reimbursementRatioHealthy;
    const excessOut = Math.max(0, outCatalogCost - outDeductible);
    if (excessOut > 0) {
      const calcBenefit = Math.min(excessOut * outRatio, policy.outCatalogCoverage.annualCap);
      outCatalogBenefit = Math.round(Math.min(outCatalogCost, calcBenefit) * 100) / 100;
      notes.push(`责任二（医保外自费）：扣除免赔额 ¥${outDeductible}，按 ${Math.round(outRatio * 100)}% 报销 ¥${outCatalogBenefit.toFixed(2)}`);
    } else {
      notes.push(`责任二（医保外自费）：自费金额 ¥${outCatalogCost} 未达到免赔额 ¥${outDeductible}`);
    }
  }

  // 3. 责任三：特定高额特药/创新药
  let specialDrugBenefit = 0;
  let specialDrugDeductible = 0;
  if (policy.specialDrugCoverage && specialDrugCost > 0) {
    specialDrugDeductible = isContinuous && policy.specialDrugCoverage.deductibleConsecutive !== undefined
      ? policy.specialDrugCoverage.deductibleConsecutive
      : policy.specialDrugCoverage.deductibleStandard;
    const specRatio = isPreExisting
      ? policy.specialDrugCoverage.reimbursementRatioPreExisting
      : policy.specialDrugCoverage.reimbursementRatioHealthy;
    const excessSpec = Math.max(0, specialDrugCost - specialDrugDeductible);
    if (excessSpec > 0) {
      const calcBenefit = Math.min(excessSpec * specRatio, policy.specialDrugCoverage.annualCap);
      specialDrugBenefit = Math.round(Math.min(specialDrugCost, calcBenefit) * 100) / 100;
      notes.push(`责任三（高额特药/创新药）：按 ${Math.round(specRatio * 100)}% 报销 ¥${specialDrugBenefit.toFixed(2)}`);
    }
  }

  // 4. 汇总与年度综合保额封顶
  const rawTotal = inCatalogBenefit + outCatalogBenefit + specialDrugBenefit;
  const maxCap = policy.comprehensiveAnnualCap ?? 3000000;
  const totalExpense = inCatalogSelfPay + outCatalogCost + specialDrugCost;
  const totalHuiminbaoBenefit = Math.round(Math.min(totalExpense, Math.min(maxCap, rawTotal)) * 100) / 100;

  return {
    productCode: policy.productCode,
    productName: policy.productName,
    inCatalogBenefit,
    outCatalogBenefit,
    specialDrugBenefit,
    totalHuiminbaoBenefit,
    appliedDeductibles: {
      inCatalogDeductible: inDeductible,
      outCatalogDeductible: outDeductible,
      specialDrugDeductible
    },
    notes
  };
}
