import type {
  CalculateRequest,
  CalculateResult,
  CityInsuranceData,
  OfficialPolicyDoc
} from '../data/types';
import { getCityDataByCode } from '../data';

/**
 * 医保报销精确计算引擎
 * 严格遵照国家及地市医保算法：
 * 统筹基金支付 = (总费用 - 目录外自费 - 乙类先行自付 - 起付线) * 综合报销比例
 */
export function calculateReimbursement(request: CalculateRequest): CalculateResult {
  const city = getCityDataByCode(request.cityCode);
  if (!city) {
    throw new Error(`未找到城市编码 [${request.cityCode}] 的医保政策数据`);
  }

  const pkg = request.insuranceType === 'employee' ? city.employee : city.resident;
  const isRetiree = request.insuranceType === 'employee' && !!request.isRetiree;

  // 1. 基础花费分解
  const totalCost = Math.max(0, Number(request.totalCost) || 0);
  const nonInsuranceCost = Math.max(0, Number(request.nonInsuranceCost) || 0);
  const classBCost = Math.max(0, Number(request.classBCost) || 0);
  const classBRatio = request.classBSelfPayRatio ?? 0.05;
  const classBPriorPay = Math.round(classBCost * classBRatio * 100) / 100;

  // 符合医保政策范围内的费用 (进入医保统筹池的基数)
  const eligibleCost = Math.max(0, totalCost - nonInsuranceCost - classBPriorPay);

  // 2. 区分门诊 vs 住院规则
  let deductible = 0;
  let baseRatio = 0;
  let annualCap = 0;
  let sourceDocId = '';
  let tierName = '';
  const policyNotes: string[] = [];

  if (request.treatmentType === 'outpatient') {
    const outRule = pkg.outpatient;
    sourceDocId = outRule.sourceDocId;
    const tierBenefit = outRule.tierBenefits[request.hospitalTier];
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
  } else {
    // 住院
    const inRule = pkg.inpatient;
    sourceDocId = inRule.sourceDocId;
    const tierBenefit = inRule.tierBenefits[request.hospitalTier];
    tierName = tierBenefit?.tierName || '住院定点医疗机构';

    deductible = tierBenefit?.deductible ?? 500;
    baseRatio = tierBenefit?.reimbursementRatio ?? 0.70;
    if (isRetiree && baseRatio > 0 && tierBenefit?.retireeRatioBonus) {
      baseRatio += tierBenefit.retireeRatioBonus;
    }

    annualCap = inRule.annualCap;
    if (inRule.repeatedDeductibleRule) {
      policyNotes.push(`起付标准说明: ${inRule.repeatedDeductibleRule}`);
    }
  }

  // 3. 异地就医比例调节
  const remoteRule = pkg.remoteMedical;
  let remoteFactor = 1.0;
  if (request.remoteStatus === 'transfer') {
    remoteFactor = remoteRule.transferFiledRatio;
    policyNotes.push(`异地转诊已备案：统筹报销比例按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'unfiled_emergency') {
    remoteFactor = remoteRule.unfiledEmergencyRatio;
    policyNotes.push(`异地急诊抢救（未事前备案）：报销比例按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'unfiled_normal') {
    remoteFactor = remoteRule.unfiledNormalRatio;
    policyNotes.push(`未备案自行异地就医：报销比例下浮，按 ${Math.round(remoteFactor * 100)}% 结算`);
  } else if (request.remoteStatus === 'long_term') {
    remoteFactor = remoteRule.longTermFiledRatio;
    policyNotes.push('异地长期居留已备案：享受与参保地同等报销比例');
  }

  const effectiveRatio = Math.round(baseRatio * remoteFactor * 1000) / 1000;

  // 4. 起付线扣除与统筹基金报销计算
  const deductibleDeducted = Math.min(eligibleCost, deductible);
  const reimbursableBase = Math.max(0, eligibleCost - deductibleDeducted);

  let baseReimbursed = Math.round(reimbursableBase * effectiveRatio * 100) / 100;
  if (baseReimbursed > annualCap) {
    policyNotes.push(`已达到医保统筹基金年度封顶线 ¥${annualCap.toLocaleString()}`);
    baseReimbursed = annualCap;
  }

  // 5. 大病保险 / 大额医疗补助计算
  let catastrophicReimbursed = 0;
  const catRule = pkg.catastrophic;
  if (request.treatmentType === 'inpatient' && catRule) {
    if (request.insuranceType === 'employee') {
      // 职工大额医疗补助：当基本统筹达到40万封顶线后，超出符合政策部分由大额互助按90%报销
      if (reimbursableBase * effectiveRatio > annualCap) {
        const excessCost = reimbursableBase - (annualCap / effectiveRatio);
        if (excessCost > 0) {
          const catRatio = catRule.tiers[0]?.ratio ?? 0.90;
          catastrophicReimbursed = Math.round(excessCost * catRatio * 100) / 100;
          if (catRule.annualCap) {
            catastrophicReimbursed = Math.min(catastrophicReimbursed, catRule.annualCap);
          }
          policyNotes.push(`超出基本统筹封顶线部分，触发【${catRule.name}】报销 ¥${catastrophicReimbursed.toFixed(2)}`);
        }
      }
    } else {
      // 城乡居民大病保险：个人合规自负部分超过大病起付线（约10000元）后，按梯次报销
      const outOfPocketEligible = eligibleCost - baseReimbursed;
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

  // 6. 汇总结果
  const totalReimbursed = Math.round((baseReimbursed + catastrophicReimbursed) * 100) / 100;
  const personalPayTotal = Math.round(Math.max(0, totalCost - totalReimbursed) * 100) / 100;
  const totalEffectiveRatio = totalCost > 0 ? Math.round((totalReimbursed / totalCost) * 1000) / 10 : 0;

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
      eligibleCost,
      deductibleDeducted,
      baseReimbursed,
      catastrophicReimbursed,
      totalReimbursed,
      effectiveRatio: totalEffectiveRatio,
      personalPayTotal
    }
  };
}
