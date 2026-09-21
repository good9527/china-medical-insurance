import { calculateReimbursement } from '../calculator';
import { allCities, getCityDataByCode } from '../../data';
import type { HospitalTier, CalculateRequest } from '../../data/types';
import { getCachedBenchmarkList, getBenchmarkRankings, compareTwoCities } from '../ranking';

// ============================================================================
// 辅助断言函数
// ============================================================================

function assertTrue(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[断言失败] ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`[断言失败] ${message} - 期望值: ${expected}, 实际值: ${actual}`);
  }
}

function assertCloseTo(actual: number, expected: number, tolerance = 0.05, message = ''): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`[断言失败] ${message} - 期望值: ${expected}, 实际值: ${actual} (偏差: ${Math.abs(actual - expected)})`);
  }
}

// ============================================================================
// 全省 11 统筹区医保测算与官方溯源自动化全量测试套件
// ============================================================================

export function runCalculatorTests() {
  console.log('====== 开始全国已录入统筹区医保测算与官方数据全量校验 ======');

  let passCount = 0;
  let totalChecks = 0;

  // --------------------------------------------------------------------------
  // Suite 0: 既有与新增城市基础算例全量校验
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite 0] 执行既有及新增城市基础算例校验...');
  for (const city of allCities) {
    console.log(`\n-----------------------------------------`);
    console.log(`【校验统筹区】: ${city.cityName} (代码: ${city.cityCode})`);
    
    // 1. 检验官方依据凭证完整性
    totalChecks++;
    assertTrue(city.sourceDocs.length >= 2, `${city.cityName} 官方文件凭证至少需2篇`);
    for (const doc of city.sourceDocs) {
      assertTrue(!!doc.docNumber, `${city.cityName} 缺少官方文号: ${doc.title}`);
      assertTrue(!!doc.officialUrl, `${city.cityName} 缺少官方公开URL: ${doc.title}`);
      assertTrue(!!doc.summaryQuote, `${city.cityName} 缺少法规条款摘录: ${doc.title}`);
    }
    console.log(`  ✓ 官方支撑文件 ${city.sourceDocs.length} 篇，文号与链接全部完备`);
    passCount++;

    // 2. 测试职工门诊共济测算
    totalChecks++;
    const empOut = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 1500
    });
    assertTrue(empOut.breakdown.totalReimbursed + empOut.breakdown.personalPayTotal === 1500, `${city.cityName} 职工门诊账目不平`);
    console.log(`  ✓ 职工二级门诊(花费1500): 报销 ¥${empOut.breakdown.totalReimbursed}，自付 ¥${empOut.breakdown.personalPayTotal} (依据: ${empOut.officialDocUsed.docNumber})`);
    passCount++;

    // 3. 测试职工退休住院测算 (享退休优待)
    totalChecks++;
    const empInRet = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 20000
    });
    assertTrue(empInRet.breakdown.totalReimbursed + empInRet.breakdown.personalPayTotal === 20000, `${city.cityName} 职工住院账目不平`);
    console.log(`  ✓ 职工退休三级住院(花费20000): 扣起付线 ¥${empInRet.breakdown.deductibleDeducted}，报销 ¥${empInRet.breakdown.totalReimbursed}，自付 ¥${empInRet.breakdown.personalPayTotal}`);
    passCount++;

    // 4. 测试城乡居民住院测算
    totalChecks++;
    const resIn = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 8000
    });
    assertTrue(resIn.breakdown.totalReimbursed + resIn.breakdown.personalPayTotal === 8000, `${city.cityName} 居民住院账目不平`);
    console.log(`  ✓ 居民二级住院(花费8000): 扣起付线 ¥${resIn.breakdown.deductibleDeducted}，报销 ¥${resIn.breakdown.totalReimbursed}，自付 ¥${resIn.breakdown.personalPayTotal}`);
    passCount++;

    // 5. 测试异地就医未备案扣减测试
    totalChecks++;
    const remoteTest = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'unfiled_normal',
      totalCost: 10000
    });
    assertTrue(remoteTest.breakdown.totalReimbursed < empInRet.breakdown.totalReimbursed, `${city.cityName} 异地未备案比例应下浮`);
    console.log(`  ✓ 异地未备案住院(花费10000): 比例下浮正常，报销 ¥${remoteTest.breakdown.totalReimbursed}`);
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite A: 官方规范性文件与溯源元数据深度校验 (全省 11 统筹区)
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite A] 官方政策文件红头凭证与元数据深度合规校验');
  for (const city of allCities) {
    totalChecks++;
    // 城市基础元数据
    assertTrue(city.cityCode.length === 6, `${city.cityName} 行政区划代码必须为6位`);
    assertTrue(city.hotline.includes('12393'), `${city.cityName} 热线必须包含12393`);
    assertTrue(city.officialPortalUrl.startsWith('http'), `${city.cityName} 官网URL格式必须合法`);
    assertTrue(city.sourceDocs.length >= 2, `${city.cityName} 规范性文件至少需收录2篇`);

    // 检索函数核验
    const lookup = getCityDataByCode(city.cityCode);
    assertEqual(lookup?.cityName, city.cityName, `getCityDataByCode 未能正向查得 ${city.cityName}`);

    for (const doc of city.sourceDocs) {
      assertTrue(doc.docId.length > 3, `${city.cityName} 凭证文档 docId 不能为空`);
      assertTrue(doc.title.length > 5, `${city.cityName} 凭证文档 title 必须为政策规范全称`);
      assertTrue(doc.issuingDept.length > 0, `${city.cityName} 发文机关必须明确指定`);
      assertTrue(doc.officialUrl.startsWith('http'), `${city.cityName} 官方链接必须为可访问的 http/https 地址`);
      assertTrue(doc.summaryQuote.length >= 20, `${city.cityName} 条款原文摘录至少需20字详实证据`);
    }
    console.log(`  ✓ [Suite A PASS] ${city.cityName} (${city.cityCode})：收录 ${city.sourceDocs.length} 篇权威文件，全量字段核验无缺漏`);
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite B: 门诊共济机制与门诊待遇全场景测算校验 (全省 11 统筹区)
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite B] 门诊待遇测算：在职门诊、退休上浮、居民门诊与起付/封顶边界');

  for (const city of allCities) {
    // 1. 在职职工门诊共济测算与账单分解
    totalChecks++;
    const costEmpOut = 3000;
    const resEmpOut = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: costEmpOut
    });

    const tierDed = city.employee.outpatient.tierBenefits.tier2.deductible ?? city.employee.outpatient.annualDeductible;
    const expectedDed = Math.min(costEmpOut, tierDed);
    const expectedBase = costEmpOut - expectedDed;
    const expectedRatio = city.employee.outpatient.tierBenefits.tier2.reimbursementRatio;
    const expectedRawReimburse = Math.round(expectedBase * expectedRatio * 100) / 100;
    const expectedReimbursed = Math.min(city.employee.outpatient.annualCap, expectedRawReimburse);

    assertEqual(resEmpOut.breakdown.deductibleDeducted, expectedDed, `${city.cityName} 职工门诊扣除起付线不符`);
    assertEqual(resEmpOut.breakdown.baseReimbursed, expectedReimbursed, `${city.cityName} 职工门诊基本统筹报销额不符`);
    assertEqual(resEmpOut.breakdown.personalPayTotal, costEmpOut - expectedReimbursed, `${city.cityName} 职工门诊自付金额不符`);
    assertEqual(resEmpOut.breakdown.totalReimbursed + resEmpOut.breakdown.personalPayTotal, costEmpOut, `${city.cityName} 门诊总账目不平`);
    console.log(`  ✓ [B1 PASS] ${city.cityName} 在职职工二级门诊：花费¥${costEmpOut}，起付¥${resEmpOut.breakdown.deductibleDeducted}，报销¥${resEmpOut.breakdown.totalReimbursed}，自付¥${resEmpOut.breakdown.personalPayTotal}`);
    passCount++;

    // 2. 退休职工门诊优待比例上浮与高限额测算
    totalChecks++;
    const resEmpRetOut = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: costEmpOut
    });

    const retDed = city.employee.outpatient.annualDeductibleRetiree !== undefined 
      ? city.employee.outpatient.annualDeductibleRetiree 
      : (city.employee.outpatient.tierBenefits.tier2.deductible ?? city.employee.outpatient.annualDeductible);
    const expectedRetDed = Math.min(costEmpOut, retDed);
    const expectedRetBase = costEmpOut - expectedRetDed;
    const bonus = city.employee.outpatient.tierBenefits.tier2.retireeRatioBonus || 0;
    const expectedRetRatio = expectedRatio + bonus;
    const expectedRetRaw = Math.round(expectedRetBase * expectedRetRatio * 100) / 100;
    const expectedRetCap = city.employee.outpatient.annualCapRetiree || city.employee.outpatient.annualCap;
    const expectedRetReimbursed = Math.min(expectedRetCap, expectedRetRaw);

    assertEqual(resEmpRetOut.breakdown.deductibleDeducted, expectedRetDed, `${city.cityName} 退休职工门诊起付线扣除额不符`);
    assertEqual(resEmpRetOut.breakdown.baseReimbursed, expectedRetReimbursed, `${city.cityName} 退休职工门诊统筹报销额不符`);
    if (bonus > 0 && expectedReimbursed < city.employee.outpatient.annualCap) {
      assertTrue(resEmpRetOut.breakdown.baseReimbursed > resEmpOut.breakdown.baseReimbursed, `${city.cityName} 退休门诊报销应高于在职职工`);
    }
    console.log(`  ✓ [B2 PASS] ${city.cityName} 退休职工门诊优待：上浮比例+${(bonus * 100).toFixed(0)}%，实报¥${resEmpRetOut.breakdown.totalReimbursed} (高于在职 ¥${resEmpOut.breakdown.totalReimbursed})`);
    passCount++;

    // 3. 城乡居民门诊统筹（基层定点社区/卫生院报销与限额）
    totalChecks++;
    const costResOut = 350;
    const resResOut = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'resident',
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: costResOut
    });

    const resTierDed = city.resident.outpatient.tierBenefits.community.deductible ?? city.resident.outpatient.annualDeductible ?? 0;
    const expectedResDed = Math.min(costResOut, resTierDed);
    const expectedResRatio = city.resident.outpatient.tierBenefits.community.reimbursementRatio;
    const expectedResRaw = Math.round((costResOut - expectedResDed) * expectedResRatio * 100) / 100;
    const expectedResCap = city.resident.outpatient.annualCap;
    const expectedResReimbursed = Math.min(expectedResCap, expectedResRaw);

    assertEqual(resResOut.breakdown.baseReimbursed, expectedResReimbursed, `${city.cityName} 居民基层门诊报销额不符`);
    assertEqual(resResOut.breakdown.personalPayTotal, costResOut - expectedResReimbursed, `${city.cityName} 居民基层门诊自付额不符`);
    console.log(`  ✓ [B3 PASS] ${city.cityName} 居民基层门诊：花费¥${costResOut}，基层比例${(expectedResRatio * 100).toFixed(0)}%，报销¥${resResOut.breakdown.totalReimbursed} (封顶 ¥${expectedResCap})`);
    passCount++;

    // 4. 门诊起付线边界测试 (花费低于门诊年起付线)
    totalChecks++;
    const tier2Ded = city.employee.outpatient.tierBenefits['tier2']?.deductible ?? city.employee.outpatient.annualDeductible;
    if (tier2Ded > 0) {
      const subDeductibleCost = Math.floor(tier2Ded / 2);
      const resSubDed = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'local',
        totalCost: subDeductibleCost
      });
      assertEqual(resSubDed.breakdown.deductibleDeducted, subDeductibleCost, `${city.cityName} 低于起付线时扣除起付额应等于花费`);
      assertEqual(resSubDed.breakdown.baseReimbursed, 0, `${city.cityName} 未达起付线报销额应为0`);
      assertEqual(resSubDed.breakdown.personalPayTotal, subDeductibleCost, `${city.cityName} 未达起付线应由个人全额承担`);
      console.log(`  ✓ [B4 PASS] ${city.cityName} 职工门诊低于起付线：花费¥${subDeductibleCost} < 起付线¥${tier2Ded}，报销¥0，个人全自付`);
    } else {
      // 榆林、延安等 0 起付线地区
      const resZeroDed = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'local',
        totalCost: 100
      });
      assertEqual(resZeroDed.breakdown.deductibleDeducted, 0, `${city.cityName} 零起付线地区deductible应为0`);
      assertTrue(resZeroDed.breakdown.baseReimbursed > 0, `${city.cityName} 零起付线应从第一元开始报销`);
      console.log(`  ✓ [B4 PASS] ${city.cityName} 职工门诊0起付线：花费¥100立即按比例报销¥${resZeroDed.breakdown.baseReimbursed}`);
    }
    passCount++;

    // 5. 门诊封顶线饱和测试 (超大额花费触发封顶或无封顶校验)
    totalChecks++;
    const testCapCost = Math.max(25000, (city.employee.outpatient.annualCap || 0) * 2);
    const resCapOut = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: testCapCost
    });
    if (city.employee.outpatient.annualCap < 5000000) {
      assertEqual(resCapOut.breakdown.baseReimbursed, city.employee.outpatient.annualCap, `${city.cityName} 超额门诊报销未在年度封顶线截断`);
      assertTrue(resCapOut.policyNotes.some(n => n.includes('封顶线')), `${city.cityName} 达封顶线时 policyNotes 必须包含封顶提示`);
      console.log(`  ✓ [B5 PASS] ${city.cityName} 门诊封顶线截断：大额门诊(¥${testCapCost})精确封顶至¥${city.employee.outpatient.annualCap}`);
    } else {
      assertTrue(resCapOut.breakdown.baseReimbursed > 5000, `${city.cityName} 门诊上不封顶实报¥${resCapOut.breakdown.baseReimbursed}`);
      console.log(`  ✓ [B5 PASS] ${city.cityName} 门诊取消封顶线：大额门诊(¥${testCapCost})足额实报至¥${resCapOut.breakdown.baseReimbursed}`);
    }
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite C: 住院各级医院 (5-Tier) 起付线与阶梯报销比例校验 (全省 11 统筹区)
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite C] 住院定点机构五级梯次待遇严谨核验 (基层社区、一级、二级、三级、三甲)');

  const hospitalTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];

  for (const city of allCities) {
    totalChecks++;
    let prevDed = -1;
    let prevRatio = 2.0;

    for (const tier of hospitalTiers) {
      const tierConfig = city.employee.inpatient.tierBenefits[tier];
      assertTrue(!!tierConfig, `${city.cityName} 职工住院必须配置等级 ${tier}`);
      
      const resInTier = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: tier,
        remoteStatus: 'local',
        totalCost: 10000
      });

      const expDed = Math.min(10000, tierConfig.deductible);
      const expReimbursed = Math.round((10000 - expDed) * tierConfig.reimbursementRatio * 100) / 100;

      assertEqual(resInTier.breakdown.deductibleDeducted, expDed, `${city.cityName} ${tier} 住院起付线不符`);
      assertEqual(resInTier.breakdown.baseReimbursed, expReimbursed, `${city.cityName} ${tier} 住院统筹报销金额不符`);
      assertEqual(resInTier.breakdown.totalReimbursed + resInTier.breakdown.personalPayTotal, 10000, `${city.cityName} ${tier} 账目不平`);

      // 医院等级梯次合理性校验：等级越高，起付线应不低于更低等级；报销比例应不高于更低等级
      assertTrue(tierConfig.deductible >= prevDed, `${city.cityName} ${tier} 起付线应不低于前一级别`);
      assertTrue(tierConfig.reimbursementRatio <= prevRatio, `${city.cityName} ${tier} 报销比例应不高于前一级别`);

      prevDed = tierConfig.deductible;
      prevRatio = tierConfig.reimbursementRatio;
    }

    console.log(`  ✓ [Suite C PASS] ${city.cityName} 五级住院梯次核验全部通过 (社区起付¥${city.employee.inpatient.tierBenefits.community.deductible}/比例${(city.employee.inpatient.tierBenefits.community.reimbursementRatio*100).toFixed(0)}% -> 三级起付¥${city.employee.inpatient.tierBenefits.tier3.deductible}/比例${(city.employee.inpatient.tierBenefits.tier3.reimbursementRatio*100).toFixed(0)}%)`);
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite D: 医保三大目录费用分解核验 (丙类自费与乙类先行自付)
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite D] 医保三大目录费用精确分解：甲类/乙类先行自付/丙类全自费');

  for (const city of allCities) {
    totalChecks++;
    const total = 25000;
    const nonInsurance = 3000; // 丙类自费
    const classB = 4000;       // 乙类费用
    const classBRatio = 0.10;  // 乙类自付10%

    const resCatalog = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: total,
      nonInsuranceCost: nonInsurance,
      classBCost: classB,
      classBSelfPayRatio: classBRatio
    });

    const expectedClassBPrior = Math.round(classB * classBRatio * 100) / 100; // 400
    const expectedEligible = total - nonInsurance - expectedClassBPrior;       // 21600
    const tierDed = city.employee.inpatient.tierBenefits.tier2.deductible;
    const expectedDedDeducted = Math.min(expectedEligible, tierDed);
    const expectedBaseReimbursed = Math.round((expectedEligible - expectedDedDeducted) * city.employee.inpatient.tierBenefits.tier2.reimbursementRatio * 100) / 100;

    assertEqual(resCatalog.breakdown.nonInsuranceCost, nonInsurance, `${city.cityName} 丙类自费金额不符`);
    assertEqual(resCatalog.breakdown.classBCost, classB, `${city.cityName} 乙类发生费用不符`);
    assertEqual(resCatalog.breakdown.classBPriorPay, expectedClassBPrior, `${city.cityName} 乙类先行自付金额不符`);
    assertEqual(resCatalog.breakdown.eligibleCost, expectedEligible, `${city.cityName} 符合统筹政策范围基数不符`);
    assertEqual(resCatalog.breakdown.deductibleDeducted, expectedDedDeducted, `${city.cityName} 扣除起付线不符`);
    assertEqual(resCatalog.breakdown.baseReimbursed, expectedBaseReimbursed, `${city.cityName} 目录过滤后统筹报销额不符`);
    assertEqual(resCatalog.breakdown.totalReimbursed + resCatalog.breakdown.personalPayTotal, total, `${city.cityName} 目录测算总账目不平`);

    console.log(`  ✓ [Suite D PASS] ${city.cityName} 目录分解测算：总额¥${total}，扣丙类¥${nonInsurance}与乙类自付¥${expectedClassBPrior}，入池基数¥${expectedEligible}，统筹实报¥${resCatalog.breakdown.baseReimbursed}`);
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite E: 大病保险与大额医疗补助超限触发二次报销核验 (全省 11 统筹区)
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite E] 大病保险与职工大额医疗互助多梯次二次补偿核验');

  for (const city of allCities) {
    // 1. 职工大额医疗互助测算 (突破基本统筹封顶线)
    totalChecks++;
    const basicCap = city.employee.inpatient.annualCap;
    // 设定花费使统筹报销超过封顶线
    const highCost = Math.round(basicCap / 0.85 + 150000);
    const resEmpCat = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: highCost
    });

    assertEqual(resEmpCat.breakdown.baseReimbursed, basicCap, `${city.cityName} 职工基本统筹必须在年封顶线¥${basicCap}截断`);
    assertEqual(
      resEmpCat.breakdown.totalReimbursed,
      Math.round((resEmpCat.breakdown.baseReimbursed + resEmpCat.breakdown.catastrophicReimbursed) * 100) / 100,
      `${city.cityName} 合计报销应等于基本+大额`
    );
    assertEqual(resEmpCat.breakdown.totalReimbursed + resEmpCat.breakdown.personalPayTotal, highCost, `${city.cityName} 职工大病账目不平`);
    assertTrue(resEmpCat.policyNotes.some(n => n.includes('大额') || n.includes('大病') || n.includes('封顶线')), `${city.cityName} 政策说明中需有大额互助触发提示`);

    console.log(`  ✓ [E1 PASS] ${city.cityName} 职工大额互助触发：基本统筹封顶¥${basicCap}，大额补助追加报销 ¥${resEmpCat.breakdown.catastrophicReimbursed}，合计报销 ¥${resEmpCat.breakdown.totalReimbursed}`);
    passCount++;

    // 2. 城乡居民大病保险梯次报销测算 (自负突破起付线二次报销)
    totalChecks++;
    const resCost = 60000;
    const resResCat = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: resCost
    });

    const catDed = city.resident.catastrophic.deductible;
    const outOfPocket = resCost - resResCat.breakdown.baseReimbursed;
    if (outOfPocket > catDed) {
      assertTrue(resResCat.breakdown.catastrophicReimbursed > 0, `${city.cityName} 居民个人合规自负¥${outOfPocket}已超大病起付线¥${catDed}，必须触发大病报销`);
      assertTrue(resResCat.policyNotes.some(n => n.includes('大病保险')), `${city.cityName} 政策说明中应记录大病二次报销`);
    }
    assertEqual(resResCat.breakdown.totalReimbursed, resResCat.breakdown.baseReimbursed + resResCat.breakdown.catastrophicReimbursed, `${city.cityName} 居民总报销应等于基本+大病`);
    assertEqual(resResCat.breakdown.totalReimbursed + resResCat.breakdown.personalPayTotal, resCost, `${city.cityName} 居民大病账目不平`);

    console.log(`  ✓ [E2 PASS] ${city.cityName} 居民大病阶梯报销：住院¥${resCost}，基本报销¥${resResCat.breakdown.baseReimbursed}，超大病起付线(¥${catDed})二次报销 ¥${resResCat.breakdown.catastrophicReimbursed}`);
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite F: 异地就医差异化折算与备案规则校验 (全省 11 统筹区)
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite F] 异地就医结算：异地安置(同等待遇)、规范转诊与未备案自行就医比例扣减');

  for (const city of allCities) {
    totalChecks++;
    const testCost = 10000;

    const resLocal = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: testCost
    });

    const resLongTerm = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'long_term',
      totalCost: testCost
    });

    const resTransfer = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'transfer',
      totalCost: testCost
    });

    const resUnfiled = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'unfiled_normal',
      totalCost: testCost
    });

    // 1. 异地长期居住备案享受同等待遇
    assertEqual(resLongTerm.breakdown.baseReimbursed, resLocal.breakdown.baseReimbursed, `${city.cityName} 异地长期居住备案待遇应等于本地待遇`);

    // 2. 规范转诊比例不高于本地待遇
    assertTrue(resTransfer.breakdown.baseReimbursed <= resLocal.breakdown.baseReimbursed, `${city.cityName} 异地转诊报销额不应高于本地`);

    // 3. 未备案自行就医比例不高于转诊待遇
    assertTrue(resUnfiled.breakdown.baseReimbursed <= resTransfer.breakdown.baseReimbursed, `${city.cityName} 未备案自行就医报销额应低于或等于转诊备案待遇`);

    // 对于下浮明显的城市，严格断言 未备案 < 规范转诊 < 本地
    const unfiledRatio = city.employee.remoteMedical.unfiledNormalRatio;
    const transferRatio = city.employee.remoteMedical.transferFiledRatio;
    if (unfiledRatio < transferRatio) {
      assertTrue(resUnfiled.breakdown.baseReimbursed < resTransfer.breakdown.baseReimbursed, `${city.cityName} 未备案自行就医应明显低于规范转诊`);
    }

    console.log(`  ✓ [Suite F PASS] ${city.cityName} 异地就医规则：本地¥${resLocal.breakdown.totalReimbursed} == 长期居留¥${resLongTerm.breakdown.totalReimbursed} >= 转诊¥${resTransfer.breakdown.totalReimbursed} >= 自行外出未备案¥${resUnfiled.breakdown.totalReimbursed}`);
    passCount++;
  }

  // --------------------------------------------------------------------------
  // Suite G: 极端边界与容错健壮性测试
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite G] 极端边界测试与引擎容错健壮性');

  // G1. 零花费处理
  totalChecks++;
  const zeroTest = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 0
  });
  assertEqual(zeroTest.breakdown.totalReimbursed, 0, '零费用报销应为0');
  assertEqual(zeroTest.breakdown.personalPayTotal, 0, '零费用自付应为0');
  assertEqual(zeroTest.breakdown.effectiveRatio, 0, '零费用报销比例应为0');
  console.log('  ✓ [G1 PASS] 零医疗费用输入：精确返回 0 报销、0 自付');
  passCount++;

  // G2. 负值异常保护
  totalChecks++;
  const negTest = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: -1000,
    nonInsuranceCost: -500
  });
  assertEqual(negTest.breakdown.totalCost, 0, '负值费用应归零兜底');
  assertEqual(negTest.breakdown.totalReimbursed, 0, '负值报销应归零');
  console.log('  ✓ [G2 PASS] 负值费用异常输入：引擎安全归零保护');
  passCount++;

  // G3. 非法统筹区编码抛错拦截
  totalChecks++;
  let errorThrown = false;
  try {
    calculateReimbursement({
      cityCode: '999999',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 5000
    });
  } catch (err: any) {
    errorThrown = true;
    assertTrue(err.message.includes('未找到城市编码 [999999]'), '非法编码错误信息需准确');
  }
  assertTrue(errorThrown, '非法城市编码未抛出异常拦截');
  console.log('  ✓ [G3 PASS] 非法统筹区代码拦截：准确抛出错误并提示');
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H: Challenger 2 缺陷闭环回归与防御性测算校验
  // --------------------------------------------------------------------------
  console.log('\n=========================================');
  console.log('>>> [Suite H] Challenger 2 缺陷闭环回归与防御性测算校验');

  // H1: 城乡居民大病保险年度封顶线截断与非封顶城市保真测试 (11 统筹区全量)
  console.log('\n--- [H1] 居民大病保险年度最高限额 (annualCap) 截断与无封顶保真校验 ---');
  for (const city of allCities) {
    totalChecks++;
    const cap = city.resident.catastrophic.annualCap;
    const testCost = Math.max(1500000, Math.ceil((city.resident.inpatient.annualCap + (cap || 0)) * 1.6));
    const res = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: testCost
    });

    // 1. 账目守恒
    assertEqual(
      Math.round((res.breakdown.totalReimbursed + res.breakdown.personalPayTotal) * 100) / 100,
      testCost,
      `${city.cityName} 居民大病百万账目不平`
    );

    // 2. 基本医保必须在封顶线截断
    assertEqual(
      res.breakdown.baseReimbursed,
      city.resident.inpatient.annualCap,
      `${city.cityName} 居民基本统筹必须在年封顶线¥${city.resident.inpatient.annualCap}截断`
    );

    // 3. 大病限额严格校验
    if (cap !== undefined) {
      assertEqual(
        res.breakdown.catastrophicReimbursed,
        cap,
        `${city.cityName} 居民大病报销金额未在法定年限额¥${cap}精准截断 (实报: ${res.breakdown.catastrophicReimbursed})`
      );
      assertTrue(
        res.breakdown.catastrophicReimbursed <= cap,
        `${city.cityName} 居民大病超额支付，突破了¥${cap}封顶线`
      );
      console.log(`  ✓ [H1 PASS] ${city.cityName} (有封顶): 百万费用下大病报销精确截断于 ¥${res.breakdown.catastrophicReimbursed} (法定限额 ¥${cap})`);
    } else {
      assertTrue(
        res.breakdown.catastrophicReimbursed > 300000,
        `${city.cityName} 无封顶统筹区大病报销被异常限制在30万以下 (实报: ${res.breakdown.catastrophicReimbursed})`
      );
      console.log(`  ✓ [H1 PASS] ${city.cityName} (无封顶): 百万费用下足额阶梯报销 ¥${res.breakdown.catastrophicReimbursed} (无强制封顶限制)`);
    }
    passCount++;
  }

  // H2: 居民普通门诊统筹未覆盖梯次 (0%比例) 零报销与全额自付断言 (11 梯次全量)
  console.log('\n--- [H2] 居民普通门诊统筹未覆盖梯次 (0%比例) 零报销与全额自付断言 ---');
  for (const city of allCities) {
    const outTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
    for (const tier of outTiers) {
      const tierConfig = city.resident.outpatient.tierBenefits[tier];
      if (tierConfig && tierConfig.reimbursementRatio === 0) {
        totalChecks++;
        const testCost = 500;
        const resZero = calculateReimbursement({
          cityCode: city.cityCode,
          insuranceType: 'resident',
          treatmentType: 'outpatient',
          hospitalTier: tier,
          remoteStatus: 'local',
          totalCost: testCost
        });

        assertEqual(resZero.breakdown.totalReimbursed, 0, `${city.cityName} ${tier} 0%报销梯次报销额必须为0`);
        assertEqual(resZero.breakdown.baseReimbursed, 0, `${city.cityName} ${tier} 0%报销梯次统筹报销必须为0`);
        assertEqual(resZero.breakdown.effectiveRatio, 0, `${city.cityName} ${tier} 0%报销梯次综合报销比例必须为0`);
        assertEqual(resZero.breakdown.personalPayTotal, testCost, `${city.cityName} ${tier} 未覆盖门诊个人应全额自付`);
        console.log(`  ✓ [H2 PASS] ${city.cityName} 居民门诊 ${tierConfig.tierName}: 报销比例为0%，实报¥0，自付¥${resZero.breakdown.personalPayTotal}`);
        passCount++;
      }
    }
  }

  // H3: 门诊定点医疗机构梯次差异化起付线穿透与边界测算 (5 项典型断言)
  console.log('\n--- [H3] 门诊定点医疗机构梯次差异化起付线穿透与边界测算 ---');
  
  // 1. 商洛职工门诊按次梯次起付线 (一级30 / 二级60 / 三级90)
  totalChecks++;
  const slTier2 = calculateReimbursement({
    cityCode: '611000',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 500
  });
  assertEqual(slTier2.breakdown.deductibleDeducted, 60, '商洛职工二级门诊起付线应为60元/次');
  assertEqual(slTier2.breakdown.baseReimbursed, 286, '商洛职工二级门诊报销额计算不符');
  console.log(`  ✓ [H3 PASS] 商洛职工二级门诊(花费500): 精确扣除梯次起付线¥60，统筹实报¥${slTier2.breakdown.baseReimbursed}`);
  passCount++;

  totalChecks++;
  const slTier3 = calculateReimbursement({
    cityCode: '611000',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 500
  });
  assertEqual(slTier3.breakdown.deductibleDeducted, 90, '商洛职工三级门诊起付线应为90元/次');
  assertEqual(slTier3.breakdown.baseReimbursed, 246, '商洛职工三级门诊报销额计算不符');
  console.log(`  ✓ [H3 PASS] 商洛职工三级门诊(花费500): 精确扣除梯次起付线¥90，统筹实报¥${slTier3.breakdown.baseReimbursed}`);
  passCount++;

  totalChecks++;
  const slTier3Sub = calculateReimbursement({
    cityCode: '611000',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 80
  });
  assertEqual(slTier3Sub.breakdown.deductibleDeducted, 80, '商洛职工门诊低于起付线扣除额应等于花费');
  assertEqual(slTier3Sub.breakdown.baseReimbursed, 0, '商洛职工门诊低于90元起付线报销额必须为0');
  console.log(`  ✓ [H3 PASS] 商洛职工三级门诊低于起付线(花费80 < 90): 报销¥0，个人自付¥80`);
  passCount++;

  // 2. 咸阳与西安居民门诊定点基层医疗机构免起付线报销与大医院0报销断言
  totalChecks++;
  const xyResTier1 = calculateReimbursement({
    cityCode: '610400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 100
  });
  assertEqual(xyResTier1.breakdown.deductibleDeducted, 0, '咸阳居民卫生院门诊免起付线(0元)');
  assertEqual(xyResTier1.breakdown.baseReimbursed, 60, '咸阳居民卫生院门诊报销额计算不符: 100*0.6=60');
  console.log(`  ✓ [H3 PASS] 咸阳居民卫生院门诊(花费100): 基层免起付线，报销¥60`);
  passCount++;

  totalChecks++;
  const xyResTier3 = calculateReimbursement({
    cityCode: '610400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(xyResTier3.breakdown.totalReimbursed, 0, '咸阳居民三级医院普通门诊未覆盖，报销额必须为0');
  assertEqual(xyResTier3.breakdown.personalPayTotal, 300, '咸阳居民三级医院普通门诊未覆盖，必须全额自付300元');
  console.log(`  ✓ [H3 PASS] 咸阳居民三级门诊(花费300): 普通门诊未覆盖，报销¥0，个人自付¥300`);
  passCount++;

  // 3. 宝鸡市职工门诊共济(50元起付/500封顶)与职工/居民各级住院报销实测断言
  totalChecks++;
  const bjEmpOut = calculateReimbursement({
    cityCode: '610300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(bjEmpOut.breakdown.deductibleDeducted, 50, '宝鸡职工门诊起付线应为50元');
  assertEqual(bjEmpOut.breakdown.baseReimbursed, 500, '宝鸡职工门诊在职最高支付限额应为500元');
  console.log(`  ✓ [H3 PASS] 宝鸡职工二级门诊(花费1000): 扣起付¥50，限额封顶实报¥500 (依据: 宝政办发〔2022〕54号)`);
  passCount++;

  totalChecks++;
  const bjResIn = calculateReimbursement({
    cityCode: '610300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(bjResIn.breakdown.deductibleDeducted, 1500, '宝鸡居民三级医院住院起付线应为1500元');
  assertEqual(bjResIn.breakdown.baseReimbursed, 5525, '宝鸡居民三级医院报销计算不符: (10000-1500)*0.65=5525');
  console.log(`  ✓ [H3 PASS] 宝鸡居民三级住院(花费10000): 扣起付¥1500，统筹实报¥5525 (比例65%，依据: 宝医保发〔2022〕66号)`);
  passCount++;

  // 4. 咸阳市城乡居民各级定点医疗机构住院精准标准(160/90%, 550/78%, 1000/60%)实测断言 (依据2026年现行一览表)
  totalChecks++;
  const xyResInTier1 = calculateReimbursement({
    cityCode: '610400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 5000
  });
  assertEqual(xyResInTier1.breakdown.deductibleDeducted, 160, '咸阳居民一级医疗机构起付线应为160元');
  assertEqual(xyResInTier1.breakdown.baseReimbursed, 4356, '咸阳居民一级医疗机构报销不符: (5000-160)*0.9=4356');
  console.log(`  ✓ [H3 PASS] 咸阳居民一级住院(花费5000): 扣起付¥160，统筹实报¥4356 (90%高比例)`);
  passCount++;

  totalChecks++;
  const xyResInTier2 = calculateReimbursement({
    cityCode: '610400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 8000
  });
  assertEqual(xyResInTier2.breakdown.deductibleDeducted, 550, '咸阳居民二级医疗机构起付线应为550元');
  assertEqual(xyResInTier2.breakdown.baseReimbursed, 5587.5, '咸阳居民二级医疗机构报销不符: (8000-550)*0.75=5587.5');
  console.log(`  ✓ [H3 PASS] 咸阳居民二级住院(花费8000): 扣起付¥550，统筹实报¥5587.5 (75%比例，依据咸阳市现行城乡居民医保政策)`);
  passCount++;

  totalChecks++;
  const xyResInTier3 = calculateReimbursement({
    cityCode: '610400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(xyResInTier3.breakdown.deductibleDeducted, 1500, '咸阳居民三级医疗机构起付线应为1500元');
  assertEqual(xyResInTier3.breakdown.baseReimbursed, 5100, '咸阳居民三级医疗机构报销不符: (10000-1500)*0.60=5100');
  console.log(`  ✓ [H3 PASS] 咸阳居民三级住院(花费10000): 扣起付¥1500，统筹实报¥5100 (60%比例，依据咸阳市现行城乡居民医保政策)`);
  passCount++;

  // 5. 北京市城镇职工住院(1300/85%)与城乡居民住院(1300/75%)实测断言
  totalChecks++;
  const bjEmpIn = calculateReimbursement({
    cityCode: '110100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(bjEmpIn.breakdown.deductibleDeducted, 1300, '北京职工三级医院起付线应为1300元');
  assertEqual(bjEmpIn.breakdown.baseReimbursed, 7395, '北京职工三级医院报销不符: (10000-1300)*0.85=7395');
  console.log(`  ✓ [H3 PASS] 北京职工三级住院(花费10000): 扣起付¥1300，统筹实报¥7395 (85%比例)`);
  passCount++;

  // 6. 重庆市职工门诊(200起付/3000限额)与居民住院(800/50%)实测断言
  totalChecks++;
  const cqEmpOut = calculateReimbursement({
    cityCode: '500100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(cqEmpOut.breakdown.deductibleDeducted, 200, '重庆职工门诊起付线应为200元');
  assertEqual(cqEmpOut.breakdown.baseReimbursed, 480, '重庆职工二级门诊报销不符: (1000-200)*0.6=480');
  console.log(`  ✓ [H3 PASS] 重庆职工二级门诊(花费1000): 扣起付¥200，统筹实报¥480 (60%比例)`);
  passCount++;

  totalChecks++;
  const cqResIn = calculateReimbursement({
    cityCode: '500100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(cqResIn.breakdown.deductibleDeducted, 800, '重庆居民三级医院起付线应为800元');
  assertEqual(cqResIn.breakdown.baseReimbursed, 4600, '重庆居民三级医院报销不符: (10000-800)*0.50=4600');
  console.log(`  ✓ [H3 PASS] 重庆居民三级住院(花费10000): 扣起付¥800，统筹实报¥4600 (50%比例)`);
  passCount++;

  // 7. 成都市居民住院(500/68%)与职工门诊(200起付/60%)实测断言
  totalChecks++;
  const cdResIn = calculateReimbursement({
    cityCode: '510100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(cdResIn.breakdown.deductibleDeducted, 500, '成都居民三级医院起付线应为500元');
  assertEqual(cdResIn.breakdown.baseReimbursed, 6460, '成都居民三级医院报销不符: (10000-500)*0.68=6460');
  console.log(`  ✓ [H3 PASS] 成都居民三级住院(花费10000): 扣起付¥500，统筹实报¥6460 (68%高档比例)`);
  passCount++;

  // 8. 天津市职工门诊(800起付/10000限额)与居民住院(500起付/65%)实测断言
  totalChecks++;
  const tjEmpOut = calculateReimbursement({
    cityCode: '120100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(tjEmpOut.breakdown.deductibleDeducted, 800, '天津职工门诊起付线应为800元');
  assertEqual(tjEmpOut.breakdown.baseReimbursed, 780, '天津职工二级门诊报销不符: (2000-800)*0.65=780');
  console.log(`  ✓ [H3 PASS] 天津职工二级门诊(花费2000): 扣起付¥800，统筹实报¥780 (65%比例)`);
  passCount++;

  totalChecks++;
  const tjResIn = calculateReimbursement({
    cityCode: '120100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(tjResIn.breakdown.deductibleDeducted, 500, '天津居民三级医院起付线应为500元');
  assertEqual(tjResIn.breakdown.baseReimbursed, 6175, '天津居民三级医院报销不符: (10000-500)*0.65=6175');
  console.log(`  ✓ [H3 PASS] 天津居民三级住院(花费10000): 扣起付¥500，统筹实报¥6175 (65%比例)`);
  passCount++;

  // 9. 上海市职工住院(1500起付/85%)与居民门诊(500起付/60%)实测断言
  totalChecks++;
  const shEmpIn = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(shEmpIn.breakdown.deductibleDeducted, 1500, '上海职工住院起付线应为1500元');
  assertEqual(shEmpIn.breakdown.baseReimbursed, 7225, '上海职工住院报销不符: (10000-1500)*0.85=7225');
  console.log(`  ✓ [H3 PASS] 上海职工三级住院(花费10000): 扣起付¥1500，统筹实报¥7225 (85%比例)`);
  passCount++;

  totalChecks++;
  const shResOut = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shResOut.breakdown.deductibleDeducted, 500, '上海居民门诊自负段应为500元');
  assertEqual(shResOut.breakdown.baseReimbursed, 300, '上海居民二级门诊报销不符: (1000-500)*0.60=300');
  console.log(`  ✓ [H3 PASS] 上海居民二级门诊(花费1000): 扣自负段¥500，统筹实报¥300 (60%比例)`);
  passCount++;

  // 10. 广州市职工住院(1000起付/80%)与居民住院(500起付/70%)实测断言
  totalChecks++;
  const gzEmpIn = calculateReimbursement({
    cityCode: '440100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(gzEmpIn.breakdown.deductibleDeducted, 1000, '广州职工住院起付线应为1000元');
  assertEqual(gzEmpIn.breakdown.baseReimbursed, 7200, '广州职工三级住院报销不符: (10000-1000)*0.80=7200');
  console.log(`  ✓ [H3 PASS] 广州职工三级住院(花费10000): 扣起付¥1000，统筹实报¥7200 (80%比例)`);
  passCount++;

  totalChecks++;
  const gzResIn = calculateReimbursement({
    cityCode: '440100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(gzResIn.breakdown.deductibleDeducted, 500, '广州居民三级住院起付线应为500元');
  assertEqual(gzResIn.breakdown.baseReimbursed, 6650, '广州居民三级住院报销不符: (10000-500)*0.70=6650');
  console.log(`  ✓ [H3 PASS] 广州居民三级住院(花费10000): 扣起付¥500，统筹实报¥6650 (70%比例)`);
  passCount++;

  // 11. 深圳市职工门诊(0起付/55%)与住院(600起付/90%)实测断言
  totalChecks++;
  const szEmpOut = calculateReimbursement({
    cityCode: '440300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(szEmpOut.breakdown.deductibleDeducted, 0, '深圳职工一档门诊免起付线');
  assertEqual(szEmpOut.breakdown.baseReimbursed, 550, '深圳职工三级门诊报销不符: 1000*0.55=550');
  console.log(`  ✓ [H3 PASS] 深圳职工三级门诊(花费1000): 0起付线，统筹实报¥550 (55%比例)`);
  passCount++;

  totalChecks++;
  const szEmpIn = calculateReimbursement({
    cityCode: '440300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(szEmpIn.breakdown.deductibleDeducted, 600, '深圳职工住院三级起付线应为600元');
  assertEqual(szEmpIn.breakdown.baseReimbursed, 8460, '深圳职工三级住院报销不符: (10000-600)*0.90=8460');
  console.log(`  ✓ [H3 PASS] 深圳职工三级住院(花费10000): 扣起付¥600，统筹实报¥8460 (90%超高比例)`);
  passCount++;

  // 12. 杭州市职工门诊(2025新政: 600起付/80%)与居民住院(800起付/70%)实测断言
  totalChecks++;
  const hzEmpOut = calculateReimbursement({
    cityCode: '330100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 3000
  });
  assertEqual(hzEmpOut.breakdown.deductibleDeducted, 600, '杭州职工门诊起付线应为600元(2025新政)');
  assertEqual(hzEmpOut.breakdown.baseReimbursed, 1920, '杭州职工二级门诊报销不符: (3000-600)*0.80=1920');
  console.log(`  ✓ [H3 PASS] 杭州职工二级门诊(花费3000): 扣起付¥600，统筹实报¥1920 (80%比例，依据杭政办函〔2024〕68号)`);
  passCount++;

  totalChecks++;
  const hzResIn = calculateReimbursement({
    cityCode: '330100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(hzResIn.breakdown.deductibleDeducted, 800, '杭州居民三级住院起付线应为800元');
  assertEqual(hzResIn.breakdown.baseReimbursed, 6440, '杭州居民三级住院报销不符: (10000-800)*0.70=6440');
  console.log(`  ✓ [H3 PASS] 杭州居民三级住院(花费10000): 扣起付¥800，统筹实报¥6440 (70%比例)`);
  passCount++;

  // 13. 南京市职工门诊(0起付/70%)与居民住院(1000起付/65%)实测断言
  totalChecks++;
  const njEmpOut = calculateReimbursement({
    cityCode: '320100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(njEmpOut.breakdown.deductibleDeducted, 0, '南京职工门诊免起付线');
  assertEqual(njEmpOut.breakdown.baseReimbursed, 700, '南京职工二级门诊报销不符: 1000*0.70=700');
  console.log(`  ✓ [H3 PASS] 南京职工二级门诊(花费1000): 0起付线，统筹实报¥700 (70%高比例)`);
  passCount++;

  totalChecks++;
  const njResIn = calculateReimbursement({
    cityCode: '320100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(njResIn.breakdown.deductibleDeducted, 1000, '南京居民三级住院起付线应为1000元');
  assertEqual(njResIn.breakdown.baseReimbursed, 7200, '南京居民三级住院报销不符: (10000-1000)*0.80=7200');
  console.log(`  ✓ [H3 PASS] 南京居民三级住院(花费10000): 扣起付¥1000，统筹实报¥7200 (80%高比例，依据宁政规字〔2021〕6号)`);
  passCount++;

  // 14. 武汉市职工门诊(0起付/65%)与居民住院(800起付/65%)实测断言
  totalChecks++;
  const whEmpOut = calculateReimbursement({
    cityCode: '420100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(whEmpOut.breakdown.deductibleDeducted, 0, '武汉职工门诊免起付线');
  assertEqual(whEmpOut.breakdown.baseReimbursed, 650, '武汉职工二级门诊报销不符: 1000*0.65=650');
  console.log(`  ✓ [H3 PASS] 武汉职工二级门诊(花费1000): 0起付线，统筹实报¥650 (65%比例)`);
  passCount++;

  totalChecks++;
  const whResIn = calculateReimbursement({
    cityCode: '420100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(whResIn.breakdown.deductibleDeducted, 800, '武汉居民三级住院起付线应为800元');
  assertEqual(whResIn.breakdown.baseReimbursed, 5520, '武汉居民三级住院报销不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H3 PASS] 武汉居民三级住院(花费10000): 扣起付¥800，统筹实报¥5520 (官方最新60%比例)`);
  passCount++;

  // 15. 郑州市职工门诊(按次40起付/60%)与居民住院(1200起付/70%)实测断言
  totalChecks++;
  const zzEmpOut = calculateReimbursement({
    cityCode: '410100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zzEmpOut.breakdown.deductibleDeducted, 40, '郑州职工二级门诊按次起付线应为40元');
  assertEqual(zzEmpOut.breakdown.baseReimbursed, 576, '郑州职工二级门诊报销不符: (1000-40)*0.60=576');
  console.log(`  ✓ [H3 PASS] 郑州职工二级门诊(花费1000): 扣次起付¥40，统筹实报¥576 (60%比例)`);
  passCount++;

  totalChecks++;
  const zzResIn = calculateReimbursement({
    cityCode: '410100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(zzResIn.breakdown.deductibleDeducted, 1200, '郑州居民三级住院起付线应为1200元');
  assertEqual(zzResIn.breakdown.baseReimbursed, 6160, '郑州居民三级住院报销不符: (10000-1200)*0.70=6160');
  console.log(`  ✓ [H3 PASS] 郑州居民三级住院(花费10000): 扣起付¥1200，统筹实报¥6160 (70%比例)`);
  passCount++;

  // 16. 济南市职工门诊(200起付/70%)与居民住院(1000起付/70%)实测断言
  totalChecks++;
  const jnEmpOut = calculateReimbursement({
    cityCode: '370100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(jnEmpOut.breakdown.deductibleDeducted, 400, '济南职工门诊二级起付线应为400元');
  assertEqual(jnEmpOut.breakdown.baseReimbursed, 420, '济南职工二级门诊报销不符: (1000-400)*0.70=420');
  console.log(`  ✓ [H3 PASS] 济南职工二级门诊(花费1000): 扣二级起付¥400，统筹实报¥420 (70%比例)`);
  passCount++;

  totalChecks++;
  const jnResIn = calculateReimbursement({
    cityCode: '370100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jnResIn.breakdown.deductibleDeducted, 1000, '济南居民三级住院起付线应为1000元');
  assertEqual(jnResIn.breakdown.baseReimbursed, 5400, '济南居民三级住院报销不符: (10000-1000)*0.60=5400');
  console.log(`  ✓ [H3 PASS] 济南居民三级住院(花费10000): 扣起付¥1000，统筹实报¥5400 (60%比例，省部属为50%)`);
  passCount++;

  // 17. 兰州市职工门诊(200起付/60%)与居民住院(600起付/70%)实测断言
  totalChecks++;
  const lzEmpOut = calculateReimbursement({
    cityCode: '620100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(lzEmpOut.breakdown.deductibleDeducted, 200, '兰州职工门诊起付线应为200元');
  assertEqual(lzEmpOut.breakdown.baseReimbursed, 480, '兰州职工二级门诊报销不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H3 PASS] 兰州职工二级门诊(花费1000): 扣起付¥200，统筹实报¥480 (60%比例)`);
  passCount++;

  totalChecks++;
  const lzResIn = calculateReimbursement({
    cityCode: '620100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(lzResIn.breakdown.deductibleDeducted, 600, '兰州居民三级住院起付线应为600元');
  assertEqual(lzResIn.breakdown.baseReimbursed, 6580, '兰州居民三级住院报销不符: (10000-600)*0.70=6580');
  console.log(`  ✓ [H3 PASS] 兰州居民三级住院(花费10000): 扣起付¥600，统筹实报¥6580 (70%比例)`);
  passCount++;

  // 18. 石家庄市职工门诊(100起付/60%)与居民住院(1000起付/65%)实测断言
  totalChecks++;
  const sjzEmpOut = calculateReimbursement({
    cityCode: '130100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(sjzEmpOut.breakdown.deductibleDeducted, 100, '石家庄职工门诊起付线应为100元');
  assertEqual(sjzEmpOut.breakdown.baseReimbursed, 540, '石家庄职工二级门诊报销不符: (1000-100)*0.60=540');
  console.log(`  ✓ [H3 PASS] 石家庄职工二级门诊(花费1000): 扣起付¥100，统筹实报¥540 (60%比例)`);
  passCount++;

  totalChecks++;
  const sjzResIn = calculateReimbursement({
    cityCode: '130100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(sjzResIn.breakdown.deductibleDeducted, 1000, '石家庄居民三级住院起付线应为1000元');
  assertEqual(sjzResIn.breakdown.baseReimbursed, 5850, '石家庄居民三级住院报销不符: (10000-1000)*0.65=5850');
  console.log(`  ✓ [H3 PASS] 石家庄居民三级住院(花费10000): 扣起付¥1000，统筹实报¥5850 (65%比例)`);
  passCount++;

  // 19. 长沙市职工门诊(200起付/60%)与居民住院(1200起付/65%)实测断言
  totalChecks++;
  const csEmpOut = calculateReimbursement({
    cityCode: '430100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(csEmpOut.breakdown.deductibleDeducted, 200, '长沙职工二级门诊起付线应为200元');
  assertEqual(csEmpOut.breakdown.baseReimbursed, 480, '长沙职工二级门诊报销不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H3 PASS] 长沙职工二级门诊(花费1000): 扣起付¥200，统筹实报¥480 (60%比例)`);
  passCount++;

  totalChecks++;
  const csResIn = calculateReimbursement({
    cityCode: '430100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(csResIn.breakdown.deductibleDeducted, 1200, '长沙居民三级住院起付线应为1200元');
  assertEqual(csResIn.breakdown.baseReimbursed, 5720, '长沙居民三级住院报销不符: (10000-1200)*0.65=5720');
  console.log(`  ✓ [H3 PASS] 长沙居民三级住院(花费10000): 扣起付¥1200，统筹实报¥5720 (65%比例)`);
  passCount++;

  // 20. 合肥市职工门诊(400起付/50%)与居民住院(700起付/80%)实测断言
  totalChecks++;
  const hfEmpOut = calculateReimbursement({
    cityCode: '340100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(hfEmpOut.breakdown.deductibleDeducted, 400, '合肥职工二级门诊起付线应为400元');
  assertEqual(hfEmpOut.breakdown.baseReimbursed, 300, '合肥职工二级门诊报销不符: (1000-400)*0.50=300');
  console.log(`  ✓ [H3 PASS] 合肥职工二级门诊(花费1000): 扣起付¥400，统筹实报¥300 (50%比例)`);
  passCount++;

  totalChecks++;
  const hfResIn = calculateReimbursement({
    cityCode: '340100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(hfResIn.breakdown.deductibleDeducted, 700, '合肥居民三级住院起付线应为700元');
  assertEqual(hfResIn.breakdown.baseReimbursed, 6975, '合肥居民三级住院报销不符: (10000-700)*0.75=6975');
  console.log(`  ✓ [H3 PASS] 合肥居民三级住院(花费10000): 扣起付¥700，统筹实报¥6975 (安徽统一75%比例)`);
  passCount++;

  // 21. 福州市职工门诊(600起付/83%)与居民住院(800起付/60%)实测断言
  totalChecks++;
  const fzEmpOut = calculateReimbursement({
    cityCode: '350100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(fzEmpOut.breakdown.deductibleDeducted, 600, '福州职工门诊起付线应为600元');
  assertEqual(fzEmpOut.breakdown.baseReimbursed, 332, '福州职工二级门诊报销不符: (1000-600)*0.83=332');
  console.log(`  ✓ [H3 PASS] 福州职工二级门诊(花费1000): 扣起付¥600，统筹实报¥332 (83%比例)`);
  passCount++;

  totalChecks++;
  const fzResIn = calculateReimbursement({
    cityCode: '350100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(fzResIn.breakdown.deductibleDeducted, 800, '福州居民三级住院起付线应为800元');
  assertEqual(fzResIn.breakdown.baseReimbursed, 5520, '福州居民三级住院报销不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H3 PASS] 福州居民三级住院(花费10000): 扣起付¥800，统筹实报¥5520 (60%比例)`);
  passCount++;

  // 22. 厦门市职工门诊(1200起付/85%)与居民住院(1000起付/70%)实测断言
  totalChecks++;
  const xmEmpOut = calculateReimbursement({
    cityCode: '350200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(xmEmpOut.breakdown.deductibleDeducted, 1200, '厦门职工门诊起付线应为1200元');
  assertEqual(xmEmpOut.breakdown.baseReimbursed, 680, '厦门职工二级门诊报销不符: (2000-1200)*0.85=680');
  console.log(`  ✓ [H3 PASS] 厦门职工二级门诊(花费2000): 扣起付¥1200，统筹实报¥680 (85%比例)`);
  passCount++;

  totalChecks++;
  const xmResIn = calculateReimbursement({
    cityCode: '350200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(xmResIn.breakdown.deductibleDeducted, 1000, '厦门居民三级住院起付线应为1000元');
  assertEqual(xmResIn.breakdown.baseReimbursed, 6300, '厦门居民三级住院报销不符: (10000-1000)*0.70=6300');
  console.log(`  ✓ [H3 PASS] 厦门居民三级住院(花费10000): 扣起付¥1000，统筹实报¥6300 (70%比例)`);
  passCount++;

  // 23. 沈阳市职工门诊(200起付/65%)与居民住院(800起付/65%)实测断言
  totalChecks++;
  const syEmpOut = calculateReimbursement({
    cityCode: '210100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(syEmpOut.breakdown.deductibleDeducted, 200, '沈阳职工门诊起付线应为200元');
  assertEqual(syEmpOut.breakdown.baseReimbursed, 520, '沈阳职工二级门诊报销不符: (1000-200)*0.65=520');
  console.log(`  ✓ [H3 PASS] 沈阳职工二级门诊(花费1000): 扣起付¥200，统筹实报¥520 (65%比例)`);
  passCount++;

  totalChecks++;
  const syResIn = calculateReimbursement({
    cityCode: '210100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(syResIn.breakdown.deductibleDeducted, 800, '沈阳居民三级住院起付线应为800元');
  assertEqual(syResIn.breakdown.baseReimbursed, 6900, '沈阳居民三级住院报销不符: (10000-800)*0.75=6900');
  console.log(`  ✓ [H3 PASS] 沈阳居民三级住院(花费10000): 扣起付¥800，统筹实报¥6900 (75%比例，依据沈政发〔2019〕19号)`);
  passCount++;

  // 24. 大连市职工门诊(200起付/65%)与居民住院(800起付/65%)实测断言
  totalChecks++;
  const dlEmpOut = calculateReimbursement({
    cityCode: '210200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(dlEmpOut.breakdown.deductibleDeducted, 200, '大连职工门诊起付线应为200元');
  assertEqual(dlEmpOut.breakdown.baseReimbursed, 520, '大连职工二级门诊报销不符: (1000-200)*0.65=520');
  console.log(`  ✓ [H3 PASS] 大连职工二级门诊(花费1000): 扣起付¥200，统筹实报¥520 (65%比例)`);
  passCount++;

  totalChecks++;
  const dlResIn = calculateReimbursement({
    cityCode: '210200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(dlResIn.breakdown.deductibleDeducted, 800, '大连居民三级住院起付线应为800元');
  assertEqual(dlResIn.breakdown.baseReimbursed, 5980, '大连居民三级住院报销不符: (10000-800)*0.65=5980');
  console.log(`  ✓ [H3 PASS] 大连居民三级住院(花费10000): 扣起付¥800，统筹实报¥5980 (65%比例)`);
  passCount++;

  // 25. 南昌市职工门诊(300起付/60%)与居民住院(600起付/70%)实测断言
  totalChecks++;
  const ncEmpOut = calculateReimbursement({
    cityCode: '360100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(ncEmpOut.breakdown.deductibleDeducted, 300, '南昌职工二级门诊起付线应为300元');
  assertEqual(ncEmpOut.breakdown.baseReimbursed, 420, '南昌职工二级门诊报销不符: (1000-300)*0.60=420');
  console.log(`  ✓ [H3 PASS] 南昌职工二级门诊(花费1000): 扣起付¥300，统筹实报¥420 (60%比例)`);
  passCount++;

  totalChecks++;
  const ncResIn = calculateReimbursement({
    cityCode: '360100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(ncResIn.breakdown.deductibleDeducted, 600, '南昌居民三级住院起付线应为600元');
  assertEqual(ncResIn.breakdown.baseReimbursed, 6580, '南昌居民三级住院报销不符: (10000-600)*0.70=6580');
  console.log(`  ✓ [H3 PASS] 南昌居民三级住院(花费10000): 扣起付¥600，统筹实报¥6580 (70%比例)`);
  passCount++;

  // 26. 哈尔滨市职工门诊(400起付/60%)与居民住院(720起付/60%)实测断言
  totalChecks++;
  const hrbEmpOut = calculateReimbursement({
    cityCode: '230100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(hrbEmpOut.breakdown.deductibleDeducted, 400, '哈尔滨职工门诊起付线应为400元');
  assertEqual(hrbEmpOut.breakdown.baseReimbursed, 360, '哈尔滨职工二级门诊报销不符: (1000-400)*0.60=360');
  console.log(`  ✓ [H3 PASS] 哈尔滨职工二级门诊(花费1000): 扣起付¥400，统筹实报¥360 (60%比例)`);
  passCount++;

  totalChecks++;
  const hrbResIn = calculateReimbursement({
    cityCode: '230100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(hrbResIn.breakdown.deductibleDeducted, 720, '哈尔滨居民三级住院起付线应为720元');
  assertEqual(hrbResIn.breakdown.baseReimbursed, 5568, '哈尔滨居民三级住院报销不符: (10000-720)*0.60=5568');
  console.log(`  ✓ [H3 PASS] 哈尔滨居民三级住院(花费10000): 扣起付¥720，统筹实报¥5568 (60%比例)`);
  passCount++;

  // 27. 长春市职工门诊(200起付/55%)与居民住院(800起付/65%)实测断言
  totalChecks++;
  const ccEmpOut = calculateReimbursement({
    cityCode: '220100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(ccEmpOut.breakdown.deductibleDeducted, 200, '长春职工门诊起付线应为200元');
  assertEqual(ccEmpOut.breakdown.baseReimbursed, 440, '长春职工二级门诊报销不符: (1000-200)*0.55=440');
  console.log(`  ✓ [H3 PASS] 长春职工二级门诊(花费1000): 扣起付¥200，统筹实报¥440 (55%比例)`);
  passCount++;

  totalChecks++;
  const ccResIn = calculateReimbursement({
    cityCode: '220100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(ccResIn.breakdown.deductibleDeducted, 800, '长春居民三级住院起付线应为800元');
  assertEqual(ccResIn.breakdown.baseReimbursed, 5980, '长春居民三级住院报销不符: (10000-800)*0.65=5980');
  console.log(`  ✓ [H3 PASS] 长春居民三级住院(花费10000): 扣起付¥800，统筹实报¥5980 (65%比例)`);
  passCount++;

  // 28. 太原市职工门诊(50起付/55%)与居民住院(1000起付/60%)实测断言
  totalChecks++;
  const tyEmpOut = calculateReimbursement({
    cityCode: '140100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(tyEmpOut.breakdown.deductibleDeducted, 50, '太原职工门诊起付线应为50元');
  assertEqual(tyEmpOut.breakdown.baseReimbursed, 522.5, '太原职工二级门诊报销不符: (1000-50)*0.55=522.5');
  console.log(`  ✓ [H3 PASS] 太原职工二级门诊(花费1000): 扣起付¥50，统筹实报¥522.5 (55%比例)`);
  passCount++;

  totalChecks++;
  const tyResIn = calculateReimbursement({
    cityCode: '140100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(tyResIn.breakdown.deductibleDeducted, 1000, '太原居民三级住院起付线应为1000元');
  assertEqual(tyResIn.breakdown.baseReimbursed, 5400, '太原居民三级住院报销不符: (10000-1000)*0.60=5400');
  console.log(`  ✓ [H3 PASS] 太原居民三级住院(花费10000): 扣起付¥1000，统筹实报¥5400 (60%比例)`);
  passCount++;

  // 29. 昆明市职工门诊(40起付/55%)与居民住院(880起付/60%)实测断言
  totalChecks++;
  const kmEmpOut = calculateReimbursement({
    cityCode: '530100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(kmEmpOut.breakdown.deductibleDeducted, 40, '昆明职工门诊起付线应为40元');
  assertEqual(kmEmpOut.breakdown.baseReimbursed, 528, '昆明职工二级门诊报销不符: (1000-40)*0.55=528');
  console.log(`  ✓ [H3 PASS] 昆明职工二级门诊(花费1000): 扣起付¥40，统筹实报¥528 (55%比例)`);
  passCount++;

  totalChecks++;
  const kmResIn = calculateReimbursement({
    cityCode: '530100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(kmResIn.breakdown.deductibleDeducted, 880, '昆明居民三级住院起付线应为880元');
  assertEqual(kmResIn.breakdown.baseReimbursed, 5472, '昆明居民三级住院报销不符: (10000-880)*0.60=5472');
  console.log(`  ✓ [H3 PASS] 昆明居民三级住院(花费10000): 扣起付¥880，统筹实报¥5472 (60%比例)`);
  passCount++;

  // 30. 贵阳市职工门诊(150起付/70%)与居民住院(800起付/60%)实测断言
  totalChecks++;
  const gyEmpOut = calculateReimbursement({
    cityCode: '520100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(gyEmpOut.breakdown.deductibleDeducted, 150, '贵阳职工门诊起付线应为150元');
  assertEqual(gyEmpOut.breakdown.baseReimbursed, 595, '贵阳职工二级门诊报销不符: (1000-150)*0.70=595');
  console.log(`  ✓ [H3 PASS] 贵阳职工二级门诊(花费1000): 扣起付¥150，统筹实报¥595 (70%比例)`);
  passCount++;

  totalChecks++;
  const gyResIn = calculateReimbursement({
    cityCode: '520100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(gyResIn.breakdown.deductibleDeducted, 800, '贵阳居民三级住院起付线应为800元');
  assertEqual(gyResIn.breakdown.baseReimbursed, 5520, '贵阳居民三级住院报销不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H3 PASS] 贵阳居民三级住院(花费10000): 扣起付¥800，统筹实报¥5520 (60%比例)`);
  passCount++;

  // 31. 南宁市职工门诊(200起付/55%)与居民住院(600起付/60%)实测断言
  totalChecks++;
  const nnEmpOut = calculateReimbursement({
    cityCode: '450100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(nnEmpOut.breakdown.deductibleDeducted, 200, '南宁职工门诊起付线应为200元');
  assertEqual(nnEmpOut.breakdown.baseReimbursed, 440, '南宁职工二级门诊报销不符: (1000-200)*0.55=440');
  console.log(`  ✓ [H3 PASS] 南宁职工二级门诊(花费1000): 扣起付¥200，统筹实报¥440 (55%比例)`);
  passCount++;

  totalChecks++;
  const nnResIn = calculateReimbursement({
    cityCode: '450100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(nnResIn.breakdown.deductibleDeducted, 600, '南宁居民三级住院起付线应为600元');
  assertEqual(nnResIn.breakdown.baseReimbursed, 5640, '南宁居民三级住院报销不符: (10000-600)*0.60=5640');
  console.log(`  ✓ [H3 PASS] 南宁居民三级住院(花费10000): 扣起付¥600，统筹实报¥5640 (60%比例)`);
  passCount++;

  // 32. 海口市职工门诊(50起付/60%)与居民住院(600起付/65%)实测断言
  totalChecks++;
  const hkEmpOut = calculateReimbursement({
    cityCode: '460100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(hkEmpOut.breakdown.deductibleDeducted, 50, '海口职工门诊起付线应为50元');
  assertEqual(hkEmpOut.breakdown.baseReimbursed, 570, '海口职工二级门诊报销不符: (1000-50)*0.60=570');
  console.log(`  ✓ [H3 PASS] 海口职工二级门诊(花费1000): 扣起付¥50，统筹实报¥570 (60%比例)`);
  passCount++;

  totalChecks++;
  const hkResIn = calculateReimbursement({
    cityCode: '460100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(hkResIn.breakdown.deductibleDeducted, 600, '海口居民三级住院起付线应为600元');
  assertEqual(hkResIn.breakdown.baseReimbursed, 6110, '海口居民三级住院报销不符: (10000-600)*0.65=6110');
  console.log(`  ✓ [H3 PASS] 海口居民三级住院(花费10000): 扣起付¥600，统筹实报¥6110 (65%比例)`);
  passCount++;

  // 32-1. 三亚市职工门诊与住院(琼医保规〔2024〕12号全省统筹)实测断言
  totalChecks++;
  const sanyaEmpOut = calculateReimbursement({
    cityCode: '460200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(sanyaEmpOut.breakdown.deductibleDeducted, 10, '三亚职工一级门诊起付线应为10元');
  assertEqual(sanyaEmpOut.breakdown.baseReimbursed, 693, '三亚职工一级门诊报销不符: (1000-10)*0.70=693');
  console.log(`  ✓ [H3 PASS] 三亚职工一级门诊(花费1000): 扣起付¥10，统筹实报¥693 (70%比例，全省统筹依据)`);
  passCount++;

  // 32-2. 儋州市居民三级住院(花费10000)实测断言
  totalChecks++;
  const danzhouResIn = calculateReimbursement({
    cityCode: '460400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(danzhouResIn.breakdown.deductibleDeducted, 600, '儋州居民三级住院起付线应为600元');
  assertEqual(danzhouResIn.breakdown.baseReimbursed, 6110, '儋州居民三级住院实报应为6110元');
  console.log(`  ✓ [H3 PASS] 儋州居民三级住院(花费10000): 扣起付¥600，统筹实报¥6110 (65%比例，全省统筹依据)`);
  passCount++;

  // 33. 呼和浩特市职工门诊(1000起付/80%)与居民住院(800起付/60%)实测断言
  totalChecks++;
  const hhhtEmpOut = calculateReimbursement({
    cityCode: '150100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(hhhtEmpOut.breakdown.deductibleDeducted, 1000, '呼和浩特职工门诊起付线应为1000元');
  assertEqual(hhhtEmpOut.breakdown.baseReimbursed, 800, '呼和浩特职工二级门诊报销不符: (2000-1000)*0.80=800');
  console.log(`  ✓ [H3 PASS] 呼和浩特职工二级门诊(花费2000): 扣起付¥1000，统筹实报¥800 (80%比例)`);
  passCount++;

  totalChecks++;
  const hhhtResIn = calculateReimbursement({
    cityCode: '150100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(hhhtResIn.breakdown.deductibleDeducted, 800, '呼和浩特居民三级住院起付线应为800元');
  assertEqual(hhhtResIn.breakdown.baseReimbursed, 5520, '呼和浩特居民三级住院报销不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H3 PASS] 呼和浩特居民三级住院(花费10000): 扣起付¥800，统筹实报¥5520 (60%比例)`);
  passCount++;

  // 34. 银川市职工门诊(100起付/70%)与居民住院(700起付/60%)实测断言
  totalChecks++;
  const ycEmpOut = calculateReimbursement({
    cityCode: '640100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(ycEmpOut.breakdown.deductibleDeducted, 100, '银川职工门诊起付线应为100元');
  assertEqual(ycEmpOut.breakdown.baseReimbursed, 630, '银川职工二级门诊报销不符: (1000-100)*0.70=630');
  console.log(`  ✓ [H3 PASS] 银川职工二级门诊(花费1000): 扣起付¥100，统筹实报¥630 (70%比例)`);
  passCount++;

  totalChecks++;
  const ycResIn = calculateReimbursement({
    cityCode: '640100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(ycResIn.breakdown.deductibleDeducted, 700, '银川居民三级住院起付线应为700元');
  assertEqual(ycResIn.breakdown.baseReimbursed, 5580, '银川居民三级住院报销不符: (10000-700)*0.60=5580');
  console.log(`  ✓ [H3 PASS] 银川居民三级住院(花费10000): 扣起付¥700，统筹实报¥5580 (60%比例)`);
  passCount++;

  // 35. 乌鲁木齐市职工门诊(40起付/70%)与居民住院(800起付/60%)实测断言
  totalChecks++;
  const wlmqEmpOut = calculateReimbursement({
    cityCode: '650100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(wlmqEmpOut.breakdown.deductibleDeducted, 40, '乌鲁木齐职工门诊起付线应为40元');
  assertEqual(wlmqEmpOut.breakdown.baseReimbursed, 672, '乌鲁木齐职工二级门诊报销不符: (1000-40)*0.70=672');
  console.log(`  ✓ [H3 PASS] 乌鲁木齐职工二级门诊(花费1000): 扣起付¥40，统筹实报¥672 (70%比例)`);
  passCount++;

  totalChecks++;
  const wlmqResIn = calculateReimbursement({
    cityCode: '650100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(wlmqResIn.breakdown.deductibleDeducted, 800, '乌鲁木齐居民三级住院起付线应为800元');
  assertEqual(wlmqResIn.breakdown.baseReimbursed, 5520, '乌鲁木齐居民三级住院报销不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H3 PASS] 乌鲁木齐居民三级住院(花费10000): 扣起付¥800，统筹实报¥5520 (60%比例)`);
  passCount++;

  // 36. 西宁市职工门诊(0起付/60%)与居民住院(700起付/60%)实测断言
  totalChecks++;
  const xnEmpOut = calculateReimbursement({
    cityCode: '630100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(xnEmpOut.breakdown.deductibleDeducted, 0, '西宁职工门诊免起付线');
  assertEqual(xnEmpOut.breakdown.baseReimbursed, 600, '西宁职工二级门诊报销不符: 1000*0.60=600');
  console.log(`  ✓ [H3 PASS] 西宁职工二级门诊(花费1000): 0起付线，统筹实报¥600 (60%比例)`);
  passCount++;

  totalChecks++;
  const xnResIn = calculateReimbursement({
    cityCode: '630100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(xnResIn.breakdown.deductibleDeducted, 700, '西宁居民三级住院起付线应为700元');
  assertEqual(xnResIn.breakdown.baseReimbursed, 5580, '西宁居民三级住院报销不符: (10000-700)*0.60=5580');
  console.log(`  ✓ [H3 PASS] 西宁居民三级住院(花费10000): 扣起付¥700，统筹实报¥5580 (60%比例)`);
  passCount++;

  // 37. 拉萨市职工门诊(200起付/70%)与居民住院(500起付/70%)实测断言
  totalChecks++;
  const lsEmpOut = calculateReimbursement({
    cityCode: '540100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(lsEmpOut.breakdown.deductibleDeducted, 200, '拉萨职工门诊起付线应为200元');
  assertEqual(lsEmpOut.breakdown.baseReimbursed, 560, '拉萨职工二级门诊报销不符: (1000-200)*0.70=560');
  console.log(`  ✓ [H3 PASS] 拉萨职工二级门诊(花费1000): 扣起付¥200，统筹实报¥560 (70%比例)`);
  passCount++;

  totalChecks++;
  const lsResIn = calculateReimbursement({
    cityCode: '540100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(lsResIn.breakdown.deductibleDeducted, 500, '拉萨居民三级住院起付线应为500元');
  assertEqual(lsResIn.breakdown.baseReimbursed, 6650, '拉萨居民三级住院报销不符: (10000-500)*0.70=6650');
  console.log(`  ✓ [H3 PASS] 拉萨居民三级住院(花费10000): 扣起付¥500，统筹实报¥6650 (70%比例)`);
  passCount++;

  // --- 江苏省13市全域深入差异化测算场景核验 ---
  // 苏州 (320500)
  totalChecks++;
  const suzhouEmpOut = calculateReimbursement({
    cityCode: '320500',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(suzhouEmpOut.breakdown.deductibleDeducted, 600, '苏州职工门诊起付线应为600元');
  assertEqual(suzhouEmpOut.breakdown.baseReimbursed, 1050, '苏州职工二级门诊报销不符: (2000-600)*0.75=1050');
  console.log(`  ✓ [H3 PASS] 苏州职工二级门诊(花费2000): 扣起付¥600，统筹实报¥1050 (75%比例，依据: 苏府办〔2022〕207号)`);
  passCount++;

  // 无锡 (320200)
  totalChecks++;
  const wxEmpOut = calculateReimbursement({
    cityCode: '320200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(wxEmpOut.breakdown.deductibleDeducted, 500, '无锡职工门诊起付线应为500元');
  assertEqual(wxEmpOut.breakdown.baseReimbursed, 1125, '无锡职工二级门诊报销不符: (2000-500)*0.75=1125');
  console.log(`  ✓ [H3 PASS] 无锡职工二级门诊(花费2000): 扣起付¥500，统筹实报¥1125 (75%比例，依据: 锡政办发〔2022〕97号)`);
  passCount++;

  // 常州 (320400)
  totalChecks++;
  const czEmpOut = calculateReimbursement({
    cityCode: '320400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(czEmpOut.breakdown.deductibleDeducted, 600, '常州职工门诊起付线应为600元');
  assertEqual(czEmpOut.breakdown.baseReimbursed, 980, '常州职工二级门诊报销不符: (2000-600)*0.70=980');
  console.log(`  ✓ [H3 PASS] 常州职工二级门诊(花费2000): 扣起付¥600，统筹实报¥980 (70%比例，依据: 常政办发〔2022〕91号)`);
  passCount++;

  // 南通 (320600)
  totalChecks++;
  const ntEmpOut = calculateReimbursement({
    cityCode: '320600',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(ntEmpOut.breakdown.deductibleDeducted, 800, '南通职工门诊起付线应为800元');
  assertEqual(ntEmpOut.breakdown.baseReimbursed, 780, '南通职工二级门诊报销不符: (2000-800)*0.65=780');
  console.log(`  ✓ [H3 PASS] 南通职工二级门诊(花费2000): 扣起付¥800，统筹实报¥780 (65%比例，依据: 通政办发〔2022〕134号)`);
  passCount++;

  // 徐州 (320300)
  totalChecks++;
  const xzEmpOut = calculateReimbursement({
    cityCode: '320300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(xzEmpOut.breakdown.deductibleDeducted, 700, '徐州职工门诊起付线应为700元');
  assertEqual(xzEmpOut.breakdown.baseReimbursed, 845, '徐州职工二级门诊报销不符: (2000-700)*0.65=845');
  console.log(`  ✓ [H3 PASS] 徐州职工二级门诊(花费2000): 扣起付¥700，统筹实报¥845 (65%比例，依据: 徐政办发〔2022〕115号)`);
  passCount++;

  // 盐城 (320900)
  totalChecks++;
  const yanchengEmpOut = calculateReimbursement({
    cityCode: '320900',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(yanchengEmpOut.breakdown.deductibleDeducted, 700, '盐城职工门诊起付线应为700元');
  assertEqual(yanchengEmpOut.breakdown.baseReimbursed, 910, '盐城职工二级门诊报销不符: (2000-700)*0.70=910');
  console.log(`  ✓ [H3 PASS] 盐城职工二级门诊(花费2000): 扣起付¥700，统筹实报¥910 (70%比例，依据: 盐政规发〔2022〕10号)`);
  passCount++;

  // 扬州 (321000)
  totalChecks++;
  const yzEmpOut = calculateReimbursement({
    cityCode: '321000',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(yzEmpOut.breakdown.deductibleDeducted, 500, '扬州职工二级门诊梯次起付线应为500元');
  assertEqual(yzEmpOut.breakdown.baseReimbursed, 825, '扬州职工二级门诊报销不符: (2000-500)*0.55=825');
  console.log(`  ✓ [H3 PASS] 扬州职工二级门诊(花费2000): 扣梯次起付¥500，统筹实报¥825 (55%比例，依据: 扬政办发〔2022〕85号)`);
  passCount++;

  // 泰州 (321200)
  totalChecks++;
  const tzEmpOut = calculateReimbursement({
    cityCode: '321200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(tzEmpOut.breakdown.deductibleDeducted, 800, '泰州职工门诊起付线应为800元');
  assertEqual(tzEmpOut.breakdown.baseReimbursed, 780, '泰州职工二级门诊报销不符: (2000-800)*0.65=780');
  console.log(`  ✓ [H3 PASS] 泰州职工二级门诊(花费2000): 扣起付¥800，统筹实报¥780 (65%比例，依据: 泰政办发〔2022〕44号)`);
  passCount++;

  // 镇江 (321100)
  totalChecks++;
  const zjEmpOut = calculateReimbursement({
    cityCode: '321100',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(zjEmpOut.breakdown.deductibleDeducted, 800, '镇江职工门诊起付线应为800元');
  assertEqual(zjEmpOut.breakdown.baseReimbursed, 900, '镇江职工二级门诊报销不符: (2000-800)*0.75=900');
  console.log(`  ✓ [H3 PASS] 镇江职工二级门诊(花费2000): 扣起付¥800，统筹实报¥900 (75%比例，依据: 镇政办发〔2022〕88号)`);
  passCount++;

  // 淮安 (320800)
  totalChecks++;
  const haEmpOut = calculateReimbursement({
    cityCode: '320800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(haEmpOut.breakdown.deductibleDeducted, 600, '淮安职工门诊起付线应为600元');
  assertEqual(haEmpOut.breakdown.baseReimbursed, 910, '淮安职工二级门诊报销不符: (2000-600)*0.65=910');
  console.log(`  ✓ [H3 PASS] 淮安职工二级门诊(花费2000): 扣起付¥600，统筹实报¥910 (65%比例，依据: 淮政规〔2022〕9号)`);
  passCount++;

  // 连云港 (320700)
  totalChecks++;
  const lygEmpOut = calculateReimbursement({
    cityCode: '320700',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(lygEmpOut.breakdown.deductibleDeducted, 750, '连云港职工门诊起付线应为750元');
  assertEqual(lygEmpOut.breakdown.baseReimbursed, 812.5, '连云港职工二级门诊报销不符: (2000-750)*0.65=812.5');
  console.log(`  ✓ [H3 PASS] 连云港职工二级门诊(花费2000): 扣起付¥750，统筹实报¥812.5 (65%比例，依据: 连政办发〔2022〕73号)`);
  passCount++;

  // 宿迁 (321300)
  totalChecks++;
  const sqEmpOut = calculateReimbursement({
    cityCode: '321300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(sqEmpOut.breakdown.deductibleDeducted, 650, '宿迁职工门诊起付线应为650元');
  assertEqual(sqEmpOut.breakdown.baseReimbursed, 877.5, '宿迁职工二级门诊报销不符: (2000-650)*0.65=877.5');
  console.log(`  ✓ [H3 PASS] 宿迁职工二级门诊(花费2000): 扣起付¥650，统筹实报¥877.5 (65%比例，依据: 宿政规发〔2022〕8号)`);
  passCount++;

  // --- 浙江省11市全域深入差异化测算场景核验 ---
  // 宁波 (330200)
  totalChecks++;
  const nbEmpOut = calculateReimbursement({
    cityCode: '330200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(nbEmpOut.breakdown.deductibleDeducted, 750, '宁波职工门诊自负段起付线应为750元');
  assertEqual(nbEmpOut.breakdown.baseReimbursed, 1000, '宁波职工二级门诊报销不符: (2000-750)*0.80=1000');
  console.log(`  ✓ [H3 PASS] 宁波职工二级门诊(花费2000): 扣起付¥750，统筹实报¥1000 (80%比例，依据: 甬政办发〔2022〕46号)`);
  passCount++;

  // 温州 (330300)
  totalChecks++;
  const wzEmpOut = calculateReimbursement({
    cityCode: '330300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(wzEmpOut.breakdown.deductibleDeducted, 600, '温州职工门诊起付线应为600元');
  assertEqual(wzEmpOut.breakdown.baseReimbursed, 980, '温州职工二级门诊报销不符: (2000-600)*0.70=980');
  console.log(`  ✓ [H3 PASS] 温州职工二级门诊(花费2000): 扣起付¥600，统筹实报¥980 (70%比例，依据: 温政发〔2022〕22号)`);
  passCount++;

  // 嘉兴 (330400)
  totalChecks++;
  const jxEmpComm = calculateReimbursement({
    cityCode: '330400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 500
  });
  assertEqual(jxEmpComm.breakdown.deductibleDeducted, 0, '嘉兴基层门诊应免起付线');
  assertEqual(jxEmpComm.breakdown.baseReimbursed, 425, '嘉兴基层门诊报销不符: 500*0.85=425');
  console.log(`  ✓ [H3 PASS] 嘉兴职工基层门诊(花费500): 免起付线直接按85%报销¥425 (依据: 嘉政发〔2022〕20号)`);
  passCount++;

  totalChecks++;
  const jxEmpOut = calculateReimbursement({
    cityCode: '330400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(jxEmpOut.breakdown.deductibleDeducted, 400, '嘉兴二级门诊起付线应为400元');
  assertEqual(jxEmpOut.breakdown.baseReimbursed, 1120, '嘉兴二级门诊报销不符: (2000-400)*0.70=1120');
  console.log(`  ✓ [H3 PASS] 嘉兴职工二级门诊(花费2000): 扣起付¥400，统筹实报¥1120 (70%比例)`);
  passCount++;

  // 湖州 (330500)
  totalChecks++;
  const huzhouEmpOut = calculateReimbursement({
    cityCode: '330500',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(huzhouEmpOut.breakdown.deductibleDeducted, 600, '湖州职工门诊起付线应为600元');
  assertEqual(huzhouEmpOut.breakdown.baseReimbursed, 770, '湖州职工二级门诊报销不符: (2000-600)*0.55=770');
  console.log(`  ✓ [H3 PASS] 湖州职工二级门诊(花费2000): 扣起付¥600，统筹实报¥770 (55%比例，依据: 湖政办发〔2023〕48号)`);
  passCount++;

  // 绍兴 (330600)
  totalChecks++;
  const sxEmpOut = calculateReimbursement({
    cityCode: '330600',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(sxEmpOut.breakdown.deductibleDeducted, 400, '绍兴职工门诊起付线应为400元');
  assertEqual(sxEmpOut.breakdown.baseReimbursed, 1120, '绍兴职工二级门诊报销不符: (2000-400)*0.70=1120');
  console.log(`  ✓ [H3 PASS] 绍兴职工二级门诊(花费2000): 扣起付¥400，统筹实报¥1120 (70%比例，依据: 绍政发〔2023〕18号)`);
  passCount++;

  // 金华 (330700)
  totalChecks++;
  const jhEmpOut = calculateReimbursement({
    cityCode: '330700',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(jhEmpOut.breakdown.deductibleDeducted, 600, '金华职工门诊起付线应为600元');
  assertEqual(jhEmpOut.breakdown.baseReimbursed, 840, '金华职工二级门诊报销不符: (2000-600)*0.60=840');
  console.log(`  ✓ [H3 PASS] 金华职工二级门诊(花费2000): 扣起付¥600，统筹实报¥840 (60%比例，依据: 金政发〔2021〕27号)`);
  passCount++;

  // 衢州 (330800)
  totalChecks++;
  const qzEmpOut = calculateReimbursement({
    cityCode: '330800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(qzEmpOut.breakdown.deductibleDeducted, 300, '衢州职工门诊起付线应为300元');
  assertEqual(qzEmpOut.breakdown.baseReimbursed, 1020, '衢州职工二级门诊报销不符: (2000-300)*0.60=1020');
  console.log(`  ✓ [H3 PASS] 衢州职工二级门诊(花费2000): 扣起付¥300，统筹实报¥1020 (60%比例，依据: 衢政发〔2020〕26号)`);
  passCount++;

  // 舟山 (330900)
  totalChecks++;
  const zsEmpComm = calculateReimbursement({
    cityCode: '330900',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 500
  });
  assertEqual(zsEmpComm.breakdown.deductibleDeducted, 0, '舟山海岛基层门诊应免起付线');
  assertEqual(zsEmpComm.breakdown.baseReimbursed, 340, '舟山基层门诊报销不符: 500*0.68=340');
  console.log(`  ✓ [H3 PASS] 舟山职工海岛基层门诊(花费500): 免起付线直接按68%报销¥340 (依据: 舟政发〔2022〕16号)`);
  passCount++;

  totalChecks++;
  const zsEmpOut = calculateReimbursement({
    cityCode: '330900',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(zsEmpOut.breakdown.deductibleDeducted, 400, '舟山二级门诊起付线应为400元');
  assertEqual(zsEmpOut.breakdown.baseReimbursed, 960, '舟山二级门诊报销不符: (2000-400)*0.60=960');
  console.log(`  ✓ [H3 PASS] 舟山职工二级门诊(花费2000): 扣起付¥400，统筹实报¥960 (60%比例)`);
  passCount++;

  // 台州 (331000)
  totalChecks++;
  const tzZjEmpOut = calculateReimbursement({
    cityCode: '331000',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(tzZjEmpOut.breakdown.deductibleDeducted, 500, '台州职工门诊起付线应为500元');
  assertEqual(tzZjEmpOut.breakdown.baseReimbursed, 1050, '台州职工二级门诊报销不符: (2000-500)*0.70=1050');
  console.log(`  ✓ [H3 PASS] 台州职工二级门诊(花费2000): 扣起付¥500，统筹实报¥1050 (70%比例，依据: 台政办发〔2021〕65号)`);
  passCount++;

  // 丽水 (331100)
  totalChecks++;
  const lsZjEmpComm = calculateReimbursement({
    cityCode: '331100',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 500
  });
  assertEqual(lsZjEmpComm.breakdown.deductibleDeducted, 0, '丽水基层门诊应免起付线');
  assertEqual(lsZjEmpComm.breakdown.baseReimbursed, 350, '丽水基层门诊报销不符: 500*0.70=350');
  console.log(`  ✓ [H3 PASS] 丽水职工基层门诊(花费500): 免起付线直接按70%报销¥350 (依据: 丽政发〔2022〕18号)`);
  passCount++;

  totalChecks++;
  const lsZjEmpOut = calculateReimbursement({
    cityCode: '331100',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(lsZjEmpOut.breakdown.deductibleDeducted, 1188, '丽水职工门诊起付线应为1188元');
  assertEqual(lsZjEmpOut.breakdown.baseReimbursed, 487.2, '丽水职工二级门诊报销不符: (2000-1188)*0.60=487.2');
  console.log(`  ✓ [H3 PASS] 丽水职工二级门诊(花费2000): 扣起付¥1188，统筹实报¥487.2 (60%比例)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H4: 山西省全域统筹区实测专项断言 (大同、阳泉、长治、晋城、朔州、晋中、运城、忻州、临汾、吕梁)
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H4] 执行山西省地级市专项医保测算断言...');

  // 大同市 (140200) - 职工二级门诊花费 1000 元，起付50元，在职报销60%
  totalChecks++;
  const datongEmpOut = calculateReimbursement({
    cityCode: '140200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(datongEmpOut.breakdown.deductibleDeducted, 50, '大同职工二级门诊次均起付线应为50元');
  assertEqual(datongEmpOut.breakdown.baseReimbursed, 570, '大同职工二级门诊实报不符: (1000-50)*0.60=570');
  console.log(`  ✓ [H4 PASS] 大同职工二级门诊(花费1000): 扣起付¥50，实报¥570 (60%比例，依据: 同政办发〔2022〕41号)`);
  passCount++;

  // 阳泉市 (140300) - 职工基层门诊花费 600 元，起付30元，在职报销65%
  totalChecks++;
  const yangquanEmpOut = calculateReimbursement({
    cityCode: '140300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 600
  });
  assertEqual(yangquanEmpOut.breakdown.deductibleDeducted, 30, '阳泉职工基层门诊次均起付线应为30元');
  assertEqual(yangquanEmpOut.breakdown.baseReimbursed, 370.5, '阳泉职工基层门诊实报不符: (600-30)*0.65=370.5');
  console.log(`  ✓ [H4 PASS] 阳泉职工基层门诊(花费600): 扣起付¥30，实报¥370.5 (65%比例，依据: 阳政办发〔2022〕43号)`);
  passCount++;

  // 长治市 (140400) - 职工三级门诊花费 1000 元，起付80元，在职报销55%
  totalChecks++;
  const changzhiEmpOut = calculateReimbursement({
    cityCode: '140400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(changzhiEmpOut.breakdown.deductibleDeducted, 80, '长治职工三级门诊次均起付线应为80元');
  assertEqual(changzhiEmpOut.breakdown.baseReimbursed, 506, '长治职工三级门诊实报不符: (1000-80)*0.55=506');
  console.log(`  ✓ [H4 PASS] 长治职工三级门诊(花费1000): 扣起付¥80，实报¥506 (55%比例，依据: 长政办发〔2022〕68号)`);
  passCount++;

  // 晋城市 (140500) - 职工二级住院花费 10000 元，起付600元，在职报销88%
  totalChecks++;
  const jinchengEmpInp = calculateReimbursement({
    cityCode: '140500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jinchengEmpInp.breakdown.deductibleDeducted, 600, '晋城职工二级住院起付线应为600元');
  assertEqual(jinchengEmpInp.breakdown.baseReimbursed, 8272, '晋城职工二级住院实报不符: (10000-600)*0.88=8272');
  console.log(`  ✓ [H4 PASS] 晋城职工二级住院(花费10000): 扣起付¥600，实报¥8272 (88%比例，依据: 晋市医保发〔2024〕19号)`);
  passCount++;

  // 朔州市 (140600) - 居民基层门诊花费 300 元，免起付，报销60%
  totalChecks++;
  const shuozhouResOut = calculateReimbursement({
    cityCode: '140600',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(shuozhouResOut.breakdown.deductibleDeducted, 0, '朔州居民基层门诊免起付线');
  assertEqual(shuozhouResOut.breakdown.baseReimbursed, 180, '朔州居民基层门诊实报不符: 300*0.60=180');
  console.log(`  ✓ [H4 PASS] 朔州居民基层门诊(花费300): 免起付实报¥180 (60%比例，依据: 朔政办发〔2022〕48号)`);
  passCount++;

  // 晋中市 (140700) - 居民一级住院花费 5000 元，起付100元，报销85%
  totalChecks++;
  const jinzhongResInp = calculateReimbursement({
    cityCode: '140700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 5000
  });
  assertEqual(jinzhongResInp.breakdown.deductibleDeducted, 100, '晋中居民基层/一级住院起付线应为100元');
  assertEqual(jinzhongResInp.breakdown.baseReimbursed, 4165, '晋中居民基层住院实报不符: (5000-100)*0.85=4165');
  console.log(`  ✓ [H4 PASS] 晋中居民基层住院(花费5000): 扣起付¥100，实报¥4165 (85%比例，依据: 晋中医保发〔2024〕20号)`);
  passCount++;

  // 运城市 (140800) - 职工二级门诊退休人员花费 1000 元，起付50元，报销60%+5%=65%
  totalChecks++;
  const yunchengEmpRet = calculateReimbursement({
    cityCode: '140800',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(yunchengEmpRet.breakdown.deductibleDeducted, 50, '运城职工二级门诊起付线应为50元');
  assertEqual(yunchengEmpRet.breakdown.baseReimbursed, 617.5, '运城退休二级门诊实报不符: (1000-50)*0.65=617.5');
  console.log(`  ✓ [H4 PASS] 运城职工二级门诊(退休人员花费1000): 扣起付¥50，按65%实报¥617.5 (依据: 运政办发〔2022〕45号)`);
  passCount++;

  // 忻州市 (140900) - 职工三级住院退休人员花费 10000 元，起付800元，在职83%+退休9%=92%
  totalChecks++;
  const xinzhouEmpInp = calculateReimbursement({
    cityCode: '140900',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(xinzhouEmpInp.breakdown.deductibleDeducted, 800, '忻州职工三级住院起付线应为800元');
  assertEqual(xinzhouEmpInp.breakdown.baseReimbursed, 8464, '忻州职工退休三级住院实报不符: (10000-800)*0.92=8464');
  console.log(`  ✓ [H4 PASS] 忻州职工三级住院(退休人员花费10000): 扣起付¥800，按92%实报¥8464 (依据: 忻医保发〔2024〕18号)`);
  passCount++;

  // 临汾市 (141000) - 居民二级住院花费 8000 元，起付500元，报销70%
  totalChecks++;
  const linfenResInp = calculateReimbursement({
    cityCode: '141000',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3', // 市级二级机构映射
    remoteStatus: 'local',
    totalCost: 8000
  });
  assertEqual(linfenResInp.breakdown.deductibleDeducted, 500, '临汾居民市级二类住院起付线应为500元');
  assertEqual(linfenResInp.breakdown.baseReimbursed, 5250, '临汾居民市级住院实报不符: (8000-500)*0.70=5250');
  console.log(`  ✓ [H4 PASS] 临汾居民市级住院(花费8000): 扣起付¥500，实报¥5250 (70%比例，依据: 临医保发〔2024〕20号)`);
  passCount++;

  // 吕梁市 (141100) - 居民三类定点门诊花费 200 元，免起付，报销60%
  totalChecks++;
  const lvliangResOut = calculateReimbursement({
    cityCode: '141100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 200
  });
  assertEqual(lvliangResOut.breakdown.deductibleDeducted, 0, '吕梁居民基层门诊免起付线');
  assertEqual(lvliangResOut.breakdown.baseReimbursed, 120, '吕梁居民基层门诊实报不符: 200*0.60=120');
  console.log(`  ✓ [H4 PASS] 吕梁居民基层门诊(花费200): 免起付实报¥120 (60%比例，依据: 吕政办发〔2022〕47号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H5: 广东省重点城市医保测算专项断言 (珠海、佛山、东莞、惠州、中山、江门、肇庆、汕头)
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H5] 执行广东省地级市专项医保测算断言...');

  // 珠海市 (440400) - 职工基层门诊花费 1000 元，免起付，报销80%
  totalChecks++;
  const zhuhaiEmpOut = calculateReimbursement({
    cityCode: '440400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zhuhaiEmpOut.breakdown.deductibleDeducted, 0, '珠海职工基层门诊免起付线');
  assertEqual(zhuhaiEmpOut.breakdown.baseReimbursed, 800, '珠海职工基层门诊实报不符: 1000*0.80=800');
  console.log(`  ✓ [H5 PASS] 珠海职工基层门诊(花费1000): 免起付实报¥800 (80%比例，依据: 珠医保〔2022〕18号)`);
  passCount++;

  // 佛山市 (440600) - 职工二级住院花费 10000 元，起付500元，报销91%
  totalChecks++;
  const foshanEmpInp = calculateReimbursement({
    cityCode: '440600',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(foshanEmpInp.breakdown.deductibleDeducted, 500, '佛山职工二级住院起付线应为500元');
  assertEqual(foshanEmpInp.breakdown.baseReimbursed, 8645, '佛山职工二级住院实报不符: (10000-500)*0.91=8645');
  console.log(`  ✓ [H5 PASS] 佛山职工二级住院(花费10000): 扣起付¥500，实报¥8645 (91%比例，依据: 佛医保发〔2023〕15号)`);
  passCount++;

  // 东莞市 (441900) - 职工三级住院花费 10000 元，起付1300元，报销85%
  totalChecks++;
  const dongguanEmpInp = calculateReimbursement({
    cityCode: '441900',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(dongguanEmpInp.breakdown.deductibleDeducted, 1300, '东莞职工三级住院起付线应为1300元');
  assertEqual(dongguanEmpInp.breakdown.baseReimbursed, 7395, '东莞职工三级住院实报不符: (10000-1300)*0.85=7395');
  console.log(`  ✓ [H5 PASS] 东莞职工三级住院(花费10000): 扣起付¥1300，实报¥7395 (85%比例，依据: 东府办〔2023〕45号)`);
  passCount++;

  // 惠州市 (441300) - 职工市内三级住院花费 10000 元，起付800元，统筹报销95%
  totalChecks++;
  const huizhouEmpInp = calculateReimbursement({
    cityCode: '441300',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(huizhouEmpInp.breakdown.deductibleDeducted, 800, '惠州职工三级住院起付线应为800元');
  assertEqual(huizhouEmpInp.breakdown.baseReimbursed, 8740, '惠州职工三级住院实报不符: (10000-800)*0.95=8740');
  console.log(`  ✓ [H5 PASS] 惠州职工三级住院(花费10000): 扣起付¥800，实报¥8740 (95%高比例，依据: 惠医保发〔2023〕18号)`);
  passCount++;

  // 中山市 (442000) - 职工二级门诊在职花费 1000 元，免起付，报销65%
  totalChecks++;
  const zhongshanEmpOut = calculateReimbursement({
    cityCode: '442000',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zhongshanEmpOut.breakdown.deductibleDeducted, 0, '中山职工二级门诊免起付线');
  assertEqual(zhongshanEmpOut.breakdown.baseReimbursed, 650, '中山职工二级门诊实报不符: 1000*0.65=650');
  console.log(`  ✓ [H5 PASS] 中山职工二级门诊(花费1000): 免起付实报¥650 (65%比例，依据: 中府办〔2022〕29号)`);
  passCount++;

  // 江门市 (440700) - 职工退休二级住院花费 10000 元，起付线600-100=500元，报销90%+3%=93%
  totalChecks++;
  const jiangmenEmpRet = calculateReimbursement({
    cityCode: '440700',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jiangmenEmpRet.breakdown.deductibleDeducted, 600, '江门职工二级住院起付线应为600元');
  assertEqual(jiangmenEmpRet.breakdown.baseReimbursed, 8742, '江门职工退休二级住院实报不符: (10000-600)*0.93=8742');
  console.log(`  ✓ [H5 PASS] 江门职工退休二级住院(花费10000): 扣起付¥600，按93%实报¥8742 (依据: 江医保发〔2024〕12号)`);
  passCount++;

  // 肇庆市 (441200) - 居民基层门诊花费 400 元，免起付，报销65%
  totalChecks++;
  const zhaoqingResOut = calculateReimbursement({
    cityCode: '441200',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 400
  });
  assertEqual(zhaoqingResOut.breakdown.deductibleDeducted, 0, '肇庆居民基层门诊免起付线');
  assertEqual(zhaoqingResOut.breakdown.baseReimbursed, 260, '肇庆居民基层门诊实报不符: 400*0.65=260');
  console.log(`  ✓ [H5 PASS] 肇庆居民基层门诊(花费400): 免起付实报¥260 (65%比例，依据: 肇医保〔2022〕21号)`);
  passCount++;

  // 汕头市 (440500) - 居民二级住院花费 6000 元，起付400元，报销80%
  totalChecks++;
  const shantouResInp = calculateReimbursement({
    cityCode: '440500',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(shantouResInp.breakdown.deductibleDeducted, 400, '汕头居民二级住院起付线应为400元');
  assertEqual(shantouResInp.breakdown.baseReimbursed, 4480, '汕头居民二级住院实报不符: (6000-400)*0.80=4480');
  console.log(`  ✓ [H5 PASS] 汕头居民二级住院(花费6000): 扣起付¥400，实报¥4480 (80%比例，依据: 汕府规〔2023〕12号)`);
  passCount++;

  // 湛江市 (440800) - 职工一级门诊在职花费 1000 元，免起付，报销60%
  totalChecks++;
  const zhanjiangEmpOut = calculateReimbursement({
    cityCode: '440800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zhanjiangEmpOut.breakdown.deductibleDeducted, 0, '湛江职工基层门诊免起付线');
  assertEqual(zhanjiangEmpOut.breakdown.baseReimbursed, 600, '湛江职工基层门诊实报不符: 1000*0.60=600');
  console.log(`  ✓ [H5 PASS] 湛江职工基层门诊(花费1000): 免起付实报¥600 (60%比例，依据: 湛医保〔2022〕28号)`);
  passCount++;

  // 茂名市 (440900) - 职工二级住院花费 10000 元，起付500元，报销80%
  totalChecks++;
  const maomingEmpInp = calculateReimbursement({
    cityCode: '440900',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(maomingEmpInp.breakdown.deductibleDeducted, 500, '茂名职工二级住院起付线应为500元');
  assertEqual(maomingEmpInp.breakdown.baseReimbursed, 7600, '茂名职工二级住院实报不符: (10000-500)*0.80=7600');
  console.log(`  ✓ [H5 PASS] 茂名职工二级住院(花费10000): 扣起付¥500，实报¥7600 (80%比例，依据: 茂府规〔2023〕15号)`);
  passCount++;

  // 阳江市 (441700) - 职工一级住院花费 10000 元，起付200元，报销95%
  totalChecks++;
  const yangjiangEmpInp = calculateReimbursement({
    cityCode: '441700',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yangjiangEmpInp.breakdown.deductibleDeducted, 200, '阳江职工一级住院起付线应为200元');
  assertEqual(yangjiangEmpInp.breakdown.baseReimbursed, 9310, '阳江职工一级住院实报不符: (10000-200)*0.95=9310');
  console.log(`  ✓ [H5 PASS] 阳江职工一级住院(花费10000): 扣起付¥200，实报¥9310 (95%比例，依据: 阳医保发〔2024〕16号)`);
  passCount++;

  // 韶关市 (440200) - 职工二级门诊在职花费 1000 元，免起付，报销70%
  totalChecks++;
  const shaoguanEmpOut = calculateReimbursement({
    cityCode: '440200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shaoguanEmpOut.breakdown.deductibleDeducted, 0, '韶关职工二级门诊免起付线');
  assertEqual(shaoguanEmpOut.breakdown.baseReimbursed, 700, '韶关职工二级门诊实报不符: 1000*0.70=700');
  console.log(`  ✓ [H5 PASS] 韶关职工二级门诊(花费1000): 免起付实报¥700 (70%比例，依据: 韶医保规〔2022〕4号)`);
  passCount++;

  // 清远市 (441800) - 职工基层门诊在职花费 1000 元，免起付，报销85%
  totalChecks++;
  const qingyuanEmpOut = calculateReimbursement({
    cityCode: '441800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qingyuanEmpOut.breakdown.deductibleDeducted, 0, '清远职工基层门诊免起付线');
  assertEqual(qingyuanEmpOut.breakdown.baseReimbursed, 850, '清远职工基层门诊实报不符: 1000*0.85=850');
  console.log(`  ✓ [H5 PASS] 清远职工基层门诊(花费1000): 免起付实报¥850 (85%比例，依据: 清医保〔2022〕35号)`);
  passCount++;

  // 梅州市 (441400) - 居民基层门诊花费 400 元，免起付，报销65%
  totalChecks++;
  const meizhouResOut = calculateReimbursement({
    cityCode: '441400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 400
  });
  assertEqual(meizhouResOut.breakdown.deductibleDeducted, 0, '梅州居民基层门诊免起付线');
  assertEqual(meizhouResOut.breakdown.baseReimbursed, 260, '梅州居民基层门诊实报不符: 400*0.65=260');
  console.log(`  ✓ [H5 PASS] 梅州居民基层门诊(花费400): 免起付实报¥260 (65%比例，依据: 梅医保〔2022〕29号)`);
  passCount++;

  // 河源市 (441600) - 职工三级住院花费 10000 元，起付800元，报销80%
  totalChecks++;
  const heyuanEmpInp = calculateReimbursement({
    cityCode: '441600',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(heyuanEmpInp.breakdown.deductibleDeducted, 800, '河源职工三级住院起付线应为800元');
  assertEqual(heyuanEmpInp.breakdown.baseReimbursed, 7360, '河源职工三级住院实报不符: (10000-800)*0.80=7360');
  console.log(`  ✓ [H5 PASS] 河源职工三级住院(花费10000): 扣起付¥800，实报¥7360 (80%比例，依据: 河府办〔2023〕19号)`);
  passCount++;

  // 汕尾市 (441500) - 职工二级住院花费 10000 元，起付600元，报销90%
  totalChecks++;
  const shanweiEmpInp = calculateReimbursement({
    cityCode: '441500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(shanweiEmpInp.breakdown.deductibleDeducted, 600, '汕尾职工二级住院起付线应为600元');
  assertEqual(shanweiEmpInp.breakdown.baseReimbursed, 8460, '汕尾职工二级住院实报不符: (10000-600)*0.90=8460');
  console.log(`  ✓ [H5 PASS] 汕尾职工二级住院(花费10000): 扣起付¥600，实报¥8460 (90%比例，依据: 汕府规〔2023〕11号)`);
  passCount++;

  // 潮州市 (445100) - 居民二级住院花费 6000 元，起付500元，报销85%
  totalChecks++;
  const chaozhouResInp = calculateReimbursement({
    cityCode: '445100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(chaozhouResInp.breakdown.deductibleDeducted, 500, '潮州居民二级住院起付线应为500元');
  assertEqual(chaozhouResInp.breakdown.baseReimbursed, 4675, '潮州居民二级住院实报不符: (6000-500)*0.85=4675');
  console.log(`  ✓ [H5 PASS] 潮州居民二级住院(花费6000): 扣起付¥500，实报¥4675 (85%比例，依据: 潮府办〔2023〕21号及现行标准)`);
  passCount++;

  // 揭阳市 (445200) - 职工市内三级住院花费 10000 元，起付700元，报销90%
  totalChecks++;
  const jieyangEmpInp = calculateReimbursement({
    cityCode: '445200',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jieyangEmpInp.breakdown.deductibleDeducted, 700, '揭阳职工三级住院起付线应为700元');
  assertEqual(jieyangEmpInp.breakdown.baseReimbursed, 8370, '揭阳职工三级住院实报不符: (10000-700)*0.90=8370');
  console.log(`  ✓ [H5 PASS] 揭阳职工三级住院(花费10000): 扣起付¥700，实报¥8370 (90%统一高比例，依据: 揭府办〔2023〕24号)`);
  passCount++;

  // 云浮市 (445300) - 职工一级门诊退休人员花费 1000 元，免起付，报销60%+10%=70%
  totalChecks++;
  const yunfuEmpRet = calculateReimbursement({
    cityCode: '445300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(yunfuEmpRet.breakdown.deductibleDeducted, 0, '云浮职工基层门诊免起付线');
  assertEqual(yunfuEmpRet.breakdown.baseReimbursed, 700, '云浮职工退休基层门诊实报不符: 1000*0.70=700');
  console.log(`  ✓ [H5 PASS] 云浮职工基层门诊(退休人员花费1000): 免起付按70%实报¥700 (依据: 云医保〔2022〕24号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H6: 四川省全域市州专项医保测算断言
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H6] 执行四川省市州专项医保测算断言...');

  // 绵阳市 (510700) - 职工在职二级门诊花费 1000 元，起付200元，报销60%
  totalChecks++;
  const mianyangEmpOut = calculateReimbursement({
    cityCode: '510700',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(mianyangEmpOut.breakdown.deductibleDeducted, 200, '绵阳职工门诊起付线应为200元');
  assertEqual(mianyangEmpOut.breakdown.baseReimbursed, 480, '绵阳职工二级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H6 PASS] 绵阳职工二级门诊(在职花费1000): 扣年起付¥200，实报¥480 (60%比例，依据: 绵府办规〔2022〕2号)`);
  passCount++;

  // 德阳市 (510600) - 职工退休三级门诊花费 1000 元，起付200元，退休报销50%+10%=60%
  totalChecks++;
  const deyangEmpRet = calculateReimbursement({
    cityCode: '510600',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(deyangEmpRet.breakdown.deductibleDeducted, 200, '德阳退休职工门诊起付线为200元');
  assertEqual(deyangEmpRet.breakdown.baseReimbursed, 480, '德阳职工退休三级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H6 PASS] 德阳职工三级门诊(退休花费1000): 扣起付¥200，按退休优待60%实报¥480 (依据: 德办发〔2022〕56号)`);
  passCount++;

  // 宜宾市 (511500) - 居民基层门诊花费 300 元，免起付，报销60% (180元 <= 200元限额)
  totalChecks++;
  const yibinResOut = calculateReimbursement({
    cityCode: '511500',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(yibinResOut.breakdown.deductibleDeducted, 0, '宜宾居民门诊免起付线');
  assertEqual(yibinResOut.breakdown.baseReimbursed, 180, '宜宾居民基层门诊实报不符: 300*0.60=180');
  console.log(`  ✓ [H6 PASS] 宜宾居民基层门诊(花费300): 免起付实报¥180 (60%比例，依据: 宜办发〔2022〕42号)`);
  passCount++;

  // 自贡市 (510300) - 职工一级住院花费 10000 元，起付200元，报销92%
  totalChecks++;
  const zigongEmpInp = calculateReimbursement({
    cityCode: '510300',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(zigongEmpInp.breakdown.deductibleDeducted, 200, '自贡职工一级住院起付线应为200元');
  assertEqual(zigongEmpInp.breakdown.baseReimbursed, 9016, '自贡职工一级住院实报不符: (10000-200)*0.92=9016');
  console.log(`  ✓ [H6 PASS] 自贡职工一级住院(花费10000): 扣起付¥200，实报¥9016 (92%比例，依据: 自医保规〔2023〕1号)`);
  passCount++;

  // 攀枝花市 (510400) - 职工三级住院花费 10000 元，起付700元，报销85%
  totalChecks++;
  const panzhihuaEmpInp = calculateReimbursement({
    cityCode: '510400',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(panzhihuaEmpInp.breakdown.deductibleDeducted, 700, '攀枝花职工三级住院起付线应为700元');
  assertEqual(panzhihuaEmpInp.breakdown.baseReimbursed, 7905, '攀枝花职工三级住院实报不符: (10000-700)*0.85=7905');
  console.log(`  ✓ [H6 PASS] 攀枝花职工三级住院(花费10000): 扣起付¥700，实报¥7905 (85%比例，依据: 攀医保规〔2024〕2号)`);
  passCount++;

  // 泸州市 (510500) - 居民二级住院花费 6000 元，起付400元，报销80%
  totalChecks++;
  const luzhouResInp = calculateReimbursement({
    cityCode: '510500',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(luzhouResInp.breakdown.deductibleDeducted, 400, '泸州居民二级住院起付线应为400元');
  assertEqual(luzhouResInp.breakdown.baseReimbursed, 4480, '泸州居民二级住院实报不符: (6000-400)*0.80=4480');
  console.log(`  ✓ [H6 PASS] 泸州居民二级住院(花费6000): 扣起付¥400，实报¥4480 (80%比例，依据: 泸医保发〔2023〕35号)`);
  passCount++;

  // 南充市 (511300) - 职工退休二级住院花费 10000 元，起付450元，报销88%+3%=91%
  totalChecks++;
  const nanchongEmpRet = calculateReimbursement({
    cityCode: '511300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(nanchongEmpRet.breakdown.deductibleDeducted, 450, '南充职工二级住院起付线应为450元');
  assertEqual(nanchongEmpRet.breakdown.baseReimbursed, 8690.5, '南充职工退休二级住院实报不符: (10000-450)*0.91=8690.5');
  console.log(`  ✓ [H6 PASS] 南充职工退休二级住院(花费10000): 扣起付¥450，按91%实报¥8690.5 (依据: 南医保发〔2023〕42号)`);
  passCount++;

  // 甘孜州 (513300) - 居民三级住院花费 10000 元，起付500元，倾斜报销70%
  totalChecks++;
  const garzeResInp = calculateReimbursement({
    cityCode: '513300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(garzeResInp.breakdown.deductibleDeducted, 500, '甘孜州居民三级住院起付线应为500元');
  assertEqual(garzeResInp.breakdown.baseReimbursed, 6650, '甘孜州居民三级住院实报不符: (10000-500)*0.70=6650');
  console.log(`  ✓ [H6 PASS] 甘孜州居民三级住院(花费10000): 扣起付¥500，高寒倾斜按70%实报¥6650 (依据: 甘医保规〔2024〕1号)`);
  passCount++;

  // 阿坝州 (513200) - 居民二级住院花费 5000 元，起付250元，倾斜报销80%
  totalChecks++;
  const abaResInp = calculateReimbursement({
    cityCode: '513200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 5000
  });
  assertEqual(abaResInp.breakdown.deductibleDeducted, 250, '阿坝州居民二级住院起付线应为250元');
  assertEqual(abaResInp.breakdown.baseReimbursed, 3800, '阿坝州居民二级住院实报不符: (5000-250)*0.80=3800');
  console.log(`  ✓ [H6 PASS] 阿坝州居民二级住院(花费5000): 扣起付¥250，高寒倾斜按80%实报¥3800 (依据: 阿医保发〔2023〕19号)`);
  passCount++;

  // 凉山州 (513400) - 职工二级住院花费 10000 元，起付400元，报销88%
  totalChecks++;
  const liangshanEmpInp = calculateReimbursement({
    cityCode: '513400',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(liangshanEmpInp.breakdown.deductibleDeducted, 400, '凉山州职工二级住院起付线应为400元');
  assertEqual(liangshanEmpInp.breakdown.baseReimbursed, 8448, '凉山州职工二级住院实报不符: (10000-400)*0.88=8448');
  console.log(`  ✓ [H6 PASS] 凉山州职工二级住院(花费10000): 扣起付¥400，实报¥8448 (88%比例，依据: 凉医保发〔2023〕36号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H7: 山东省全域地级市专项医保测算断言
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H7] 执行山东省地级市专项医保测算断言...');

  // 青岛市 (370200) - 职工在职基层门诊花费 1000 元，起付100元，报销80%
  totalChecks++;
  const qingdaoEmpOut = calculateReimbursement({
    cityCode: '370200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qingdaoEmpOut.breakdown.deductibleDeducted, 0, '青岛职工基层门诊免起付线');
  assertEqual(qingdaoEmpOut.breakdown.baseReimbursed, 800, '青岛职工基层门诊实报不符: 1000*0.80=800');
  console.log(`  ✓ [H7 PASS] 青岛职工基层门诊(在职花费1000): 免起付线，实报¥800 (80%高比例，依据: 青政办发〔2022〕4号)`);
  passCount++;

  // 淄博市 (370300) - 职工在职二级门诊花费 1000 元，起付200元，报销65%
  totalChecks++;
  const ziboEmpOut = calculateReimbursement({
    cityCode: '370300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(ziboEmpOut.breakdown.deductibleDeducted, 200, '淄博职工门诊起付线应为200元');
  assertEqual(ziboEmpOut.breakdown.baseReimbursed, 520, '淄博职工二级门诊实报不符: (1000-200)*0.65=520');
  console.log(`  ✓ [H7 PASS] 淄博职工二级门诊(在职花费1000): 扣起付¥200，实报¥520 (65%比例，依据: 淄政办发〔2022〕11号)`);
  passCount++;

  // 枣庄市 (370400) - 职工一级住院花费 10000 元，起付200元，报销92%
  totalChecks++;
  const zaozhuangEmpInp = calculateReimbursement({
    cityCode: '370400',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(zaozhuangEmpInp.breakdown.deductibleDeducted, 200, '枣庄职工一级住院起付线应为200元');
  assertEqual(zaozhuangEmpInp.breakdown.baseReimbursed, 9016, '枣庄职工一级住院实报不符: (10000-200)*0.92=9016');
  console.log(`  ✓ [H7 PASS] 枣庄职工一级住院(花费10000): 扣起付¥200，实报¥9016 (92%比例，依据: 枣医保发〔2023〕18号)`);
  passCount++;

  // 东营市 (370500) - 职工二级住院花费 10000 元，起付400元，报销92%
  totalChecks++;
  const dongyingEmpInp = calculateReimbursement({
    cityCode: '370500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(dongyingEmpInp.breakdown.deductibleDeducted, 400, '东营职工二级住院起付线应为400元');
  assertEqual(dongyingEmpInp.breakdown.baseReimbursed, 8832, '东营职工二级住院实报不符: (10000-400)*0.92=8832');
  console.log(`  ✓ [H7 PASS] 东营职工二级住院(花费10000): 扣起付¥400，实报¥8832 (92%比例，依据: 东医保发〔2024〕10号)`);
  passCount++;

  // 烟台市 (370600) - 职工三级住院花费 10000 元，起付800元，报销86%
  totalChecks++;
  const yantaiEmpInp = calculateReimbursement({
    cityCode: '370600',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yantaiEmpInp.breakdown.deductibleDeducted, 800, '烟台职工三级住院起付线应为800元');
  assertEqual(yantaiEmpInp.breakdown.baseReimbursed, 7912, '烟台职工三级住院实报不符: (10000-800)*0.86=7912');
  console.log(`  ✓ [H7 PASS] 烟台职工三级住院(花费10000): 扣起付¥800，实报¥7912 (86%比例，依据: 烟医保规〔2023〕2号)`);
  passCount++;

  // 潍坊市 (370700) - 居民基层门诊花费 300 元，免起付，报销60%
  totalChecks++;
  const weifangResOut = calculateReimbursement({
    cityCode: '370700',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(weifangResOut.breakdown.deductibleDeducted, 0, '潍坊居民门诊免起付线');
  assertEqual(weifangResOut.breakdown.baseReimbursed, 180, '潍坊居民基层门诊实报不符: 300*0.60=180');
  console.log(`  ✓ [H7 PASS] 潍坊居民基层门诊(花费300): 免起付实报¥180 (60%比例，依据: 潍医保发〔2023〕28号)`);
  passCount++;

  // 济宁市 (370800) - 职工二级住院花费 10000 元，起付500元，报销88%
  totalChecks++;
  const jiningEmpInp = calculateReimbursement({
    cityCode: '370800',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jiningEmpInp.breakdown.deductibleDeducted, 500, '济宁职工二级住院起付线应为500元');
  assertEqual(jiningEmpInp.breakdown.baseReimbursed, 8360, '济宁职工二级住院实报不符: (10000-500)*0.88=8360');
  console.log(`  ✓ [H7 PASS] 济宁职工二级住院(花费10000): 扣起付¥500，实报¥8360 (88%比例，依据: 济医保规〔2024〕1号)`);
  passCount++;

  // 泰安市 (370900) - 居民二级住院花费 6000 元，起付400元，报销75%
  totalChecks++;
  const taianResInp = calculateReimbursement({
    cityCode: '370900',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(taianResInp.breakdown.deductibleDeducted, 400, '泰安居民二级住院起付线应为400元');
  assertEqual(taianResInp.breakdown.baseReimbursed, 4200, '泰安居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H7 PASS] 泰安居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 泰医保发〔2023〕31号)`);
  passCount++;

  // 威海市 (371000) - 职工在职三级门诊花费 1000 元，起付200元，报销60%
  totalChecks++;
  const weihaiEmpOut = calculateReimbursement({
    cityCode: '371000',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(weihaiEmpOut.breakdown.deductibleDeducted, 200, '威海职工门诊起付线应为200元');
  assertEqual(weihaiEmpOut.breakdown.baseReimbursed, 480, '威海职工三级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H7 PASS] 威海职工三级门诊(在职花费1000): 扣起付¥200，实报¥480 (60%比例，依据: 威政办发〔2022〕18号)`);
  passCount++;

  // 临沂市 (371300) - 职工在职基层门诊花费 1000 元，起付200元，报销75%
  totalChecks++;
  const linyiEmpOut = calculateReimbursement({
    cityCode: '371300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(linyiEmpOut.breakdown.deductibleDeducted, 200, '临沂职工门诊起付线应为200元');
  assertEqual(linyiEmpOut.breakdown.baseReimbursed, 600, '临沂职工基层门诊实报不符: (1000-200)*0.75=600');
  console.log(`  ✓ [H7 PASS] 临沂职工基层门诊(在职花费1000): 扣起付¥200，实报¥600 (75%比例，依据: 临政办发〔2022〕18号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H8: 河南省全域地级市及示范区专项医保测算断言
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H8] 执行河南省地级市专项医保测算断言...');

  // 洛阳市 (410300) - 职工基层门诊花费 500 元，免起付，报销65%
  totalChecks++;
  const luoyangEmpOut = calculateReimbursement({
    cityCode: '410300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 500
  });
  assertEqual(luoyangEmpOut.breakdown.deductibleDeducted, 0, '洛阳职工基层门诊免起付线');
  assertEqual(luoyangEmpOut.breakdown.baseReimbursed, 275, '洛阳职工基层门诊实报不符: 500*0.55=275');
  console.log(`  ✓ [H8 PASS] 洛阳职工基层门诊(花费500): 免起付实报¥275 (55%比例，依据: 洛政办〔2022〕28号)`);
  passCount++;

  // 开封市 (410200) - 职工在职二级门诊花费 1000 元，按次起付40元，报销55%
  totalChecks++;
  const kaifengEmpOut = calculateReimbursement({
    cityCode: '410200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(kaifengEmpOut.breakdown.deductibleDeducted, 40, '开封职工二级门诊每次起付线应为40元');
  assertEqual(kaifengEmpOut.breakdown.baseReimbursed, 528, '开封职工二级门诊实报不符: (1000-40)*0.55=528');
  console.log(`  ✓ [H8 PASS] 开封职工二级门诊(在职花费1000): 扣次起付¥40，实报¥528 (55%比例，依据: 汴政办〔2022〕26号)`);
  passCount++;

  // 平顶山市 (410400) - 职工退休三级门诊花费 1000 元，起付30元，报销55%+10%=65%
  totalChecks++;
  const pingdingshanEmpRet = calculateReimbursement({
    cityCode: '410400',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(pingdingshanEmpRet.breakdown.deductibleDeducted, 30, '平顶山职工门诊起付线应为30元');
  assertEqual(pingdingshanEmpRet.breakdown.baseReimbursed, 630.5, '平顶山职工退休三级门诊实报不符: (1000-30)*0.65=630.5');
  console.log(`  ✓ [H8 PASS] 平顶山职工三级门诊(退休花费1000): 扣起付¥30，按退休优待65%实报¥630.5 (依据: 平政办〔2022〕31号)`);
  passCount++;

  // 安阳市 (410500) - 职工一级住院花费 10000 元，起付200元，报销92%
  totalChecks++;
  const anyangEmpInp = calculateReimbursement({
    cityCode: '410500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(anyangEmpInp.breakdown.deductibleDeducted, 200, '安阳职工一级住院起付线应为200元');
  assertEqual(anyangEmpInp.breakdown.baseReimbursed, 9016, '安阳职工一级住院实报不符: (10000-200)*0.92=9016');
  console.log(`  ✓ [H8 PASS] 安阳职工一级住院(花费10000): 扣起付¥200，实报¥9016 (92%比例，依据: 安医保发〔2023〕32号)`);
  passCount++;

  // 新乡市 (410700) - 职工二级住院花费 10000 元，起付500元，报销88%
  totalChecks++;
  const xinxiangEmpInp = calculateReimbursement({
    cityCode: '410700',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(xinxiangEmpInp.breakdown.deductibleDeducted, 500, '新乡职工二级住院起付线应为500元');
  assertEqual(xinxiangEmpInp.breakdown.baseReimbursed, 8360, '新乡职工二级住院实报不符: (10000-500)*0.88=8360');
  console.log(`  ✓ [H8 PASS] 新乡职工二级住院(花费10000): 扣起付¥500，实报¥8360 (88%比例，依据: 新医保发〔2023〕30号)`);
  passCount++;

  // 焦作市 (410800) - 职工退休二级住院花费 10000 元，起付500元，报销88%+3%=91%
  totalChecks++;
  const jiaozuoEmpRet = calculateReimbursement({
    cityCode: '410800',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jiaozuoEmpRet.breakdown.deductibleDeducted, 500, '焦作职工二级住院起付线应为500元');
  assertEqual(jiaozuoEmpRet.breakdown.baseReimbursed, 8645, '焦作职工退休二级住院实报不符: (10000-500)*0.91=8645');
  console.log(`  ✓ [H8 PASS] 焦作职工退休二级住院(花费10000): 扣起付¥500，按91%实报¥8645 (依据: 焦医保发〔2023〕25号)`);
  passCount++;

  // 许昌市 (411000) - 居民基层门诊花费 300 元，免起付，报销60%，实报180元
  totalChecks++;
  const xuchangResOut = calculateReimbursement({
    cityCode: '411000',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(xuchangResOut.breakdown.deductibleDeducted, 0, '许昌居民门诊免起付线');
  assertEqual(xuchangResOut.breakdown.baseReimbursed, 180, '许昌居民基层门诊实报不符: 300*0.60=180');
  console.log(`  ✓ [H8 PASS] 许昌居民基层门诊(花费300): 免起付实报¥180 (60%比例，依据: 许政办〔2022〕32号)`);
  passCount++;

  // 南阳市 (411300) - 居民二级住院花费 6000 元，起付500元，报销75%
  totalChecks++;
  const nanyangResInp = calculateReimbursement({
    cityCode: '411300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(nanyangResInp.breakdown.deductibleDeducted, 500, '南阳居民二级住院起付线应为500元');
  assertEqual(nanyangResInp.breakdown.baseReimbursed, 4125, '南阳居民二级住院实报不符: (6000-500)*0.75=4125');
  console.log(`  ✓ [H8 PASS] 南阳居民二级住院(花费6000): 扣起付¥500，实报¥4125 (75%比例，依据: 宛医保发〔2023〕36号)`);
  passCount++;

  // 商丘市 (411400) - 居民三级住院花费 10000 元，起付1000元，报销65%
  totalChecks++;
  const shangqiuResInp = calculateReimbursement({
    cityCode: '411400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(shangqiuResInp.breakdown.deductibleDeducted, 1000, '商丘居民三级住院起付线应为1000元');
  assertEqual(shangqiuResInp.breakdown.baseReimbursed, 5850, '商丘居民三级住院实报不符: (10000-1000)*0.65=5850');
  console.log(`  ✓ [H8 PASS] 商丘居民三级住院(花费10000): 扣起付¥1000，实报¥5850 (65%比例，依据: 商医保发〔2023〕26号)`);
  passCount++;

  // 济源示范区 (419001) - 职工二级住院花费 10000 元，起付450元，报销88%
  totalChecks++;
  const jiyuanEmpInp = calculateReimbursement({
    cityCode: '419001',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jiyuanEmpInp.breakdown.deductibleDeducted, 450, '济源职工二级住院起付线应为450元');
  assertEqual(jiyuanEmpInp.breakdown.baseReimbursed, 8404, '济源职工二级住院实报不符: (10000-450)*0.88=8404');
  console.log(`  ✓ [H8 PASS] 济源职工二级住院(花费10000): 扣起付¥450，实报¥8404 (88%比例，依据: 济医保发〔2023〕19号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H9: 湖北省全域统筹区专项测算断言
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H9] 执行湖北省地级市/省直管市专项医保测算断言...');

  // 黄石市 (420200) - 职工基层门诊花费 1000 元，起付200元，报销80%
  totalChecks++;
  const huangshiEmpOut = calculateReimbursement({
    cityCode: '420200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(huangshiEmpOut.breakdown.deductibleDeducted, 200, '黄石职工基层门诊起付线应为200元');
  assertEqual(huangshiEmpOut.breakdown.baseReimbursed, 640, '黄石职工基层门诊实报不符: (1000-200)*0.80=640');
  console.log(`  ✓ [H9 PASS] 黄石职工基层门诊(花费1000): 扣起付¥200，实报¥640 (80%比例，依据: 黄政办发〔2022〕63号)`);
  passCount++;

  // 十堰市 (420300) - 职工三级门诊花费 1000 元，起付500元，报销50%
  totalChecks++;
  const shiyanEmpOut = calculateReimbursement({
    cityCode: '420300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shiyanEmpOut.breakdown.deductibleDeducted, 500, '十堰职工三级门诊起付线应为500元');
  assertEqual(shiyanEmpOut.breakdown.baseReimbursed, 250, '十堰职工三级门诊实报不符: (1000-500)*0.50=250');
  console.log(`  ✓ [H9 PASS] 十堰职工三级门诊(花费1000): 扣起付¥500，实报¥250 (50%比例，依据: 十政办发〔2022〕61号)`);
  passCount++;

  // 宜昌市 (420500) - 职工一级住院花费 10000 元，起付200元，报销92%
  totalChecks++;
  const yichangEmpInp = calculateReimbursement({
    cityCode: '420500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yichangEmpInp.breakdown.deductibleDeducted, 200, '宜昌职工一级住院起付线应为200元');
  assertEqual(yichangEmpInp.breakdown.baseReimbursed, 9016, '宜昌职工一级住院实报不符: (10000-200)*0.92=9016');
  console.log(`  ✓ [H9 PASS] 宜昌职工一级住院(花费10000): 扣起付¥200，实报¥9016 (92%比例，依据: 宜府办发〔2023〕51号)`);
  passCount++;

  // 襄阳市 (420600) - 职工二级门诊花费 1000 元，起付500元，报销60%
  totalChecks++;
  const xiangyangEmpOut = calculateReimbursement({
    cityCode: '420600',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(xiangyangEmpOut.breakdown.deductibleDeducted, 500, '襄阳职工二级门诊起付线应为500元');
  assertEqual(xiangyangEmpOut.breakdown.baseReimbursed, 300, '襄阳职工二级门诊实报不符: (1000-500)*0.60=300');
  console.log(`  ✓ [H9 PASS] 襄阳职工二级门诊(花费1000): 扣起付¥500，实报¥300 (60%比例，依据: 襄政办发〔2022〕46号)`);
  passCount++;

  // 鄂州市 (420700) - 职工三级住院花费 10000 元，起付800元，报销85%
  totalChecks++;
  const ezhouEmpInp = calculateReimbursement({
    cityCode: '420700',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(ezhouEmpInp.breakdown.deductibleDeducted, 800, '鄂州职工三级住院起付线应为800元');
  assertEqual(ezhouEmpInp.breakdown.baseReimbursed, 7820, '鄂州职工三级住院实报不符: (10000-800)*0.85=7820');
  console.log(`  ✓ [H9 PASS] 鄂州职工三级住院(花费10000): 扣起付¥800，实报¥7820 (85%比例，依据: 鄂州医保发〔2023〕62号)`);
  passCount++;

  // 荆门市 (420800) - 职工二级住院花费 10000 元，起付500元，报销88%
  totalChecks++;
  const jingmenEmpInp = calculateReimbursement({
    cityCode: '420800',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jingmenEmpInp.breakdown.deductibleDeducted, 500, '荆门职工二级住院起付线应为500元');
  assertEqual(jingmenEmpInp.breakdown.baseReimbursed, 8360, '荆门职工二级住院实报不符: (10000-500)*0.88=8360');
  console.log(`  ✓ [H9 PASS] 荆门职工二级住院(花费10000): 扣起付¥500，实报¥8360 (88%比例，依据: 荆医保发〔2023〕29号)`);
  passCount++;

  // 孝感市 (420900) - 居民二级住院花费 6000 元，起付400元，报销75%
  totalChecks++;
  const xiaoganResInp = calculateReimbursement({
    cityCode: '420900',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(xiaoganResInp.breakdown.deductibleDeducted, 400, '孝感居民二级住院起付线应为400元');
  assertEqual(xiaoganResInp.breakdown.baseReimbursed, 4200, '孝感居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H9 PASS] 孝感居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 孝感医保发〔2023〕18号)`);
  passCount++;

  // 随州市 (421300) - 职工一级住院花费 10000 元，起付400元，报销95%
  totalChecks++;
  const suizhouEmpInp = calculateReimbursement({
    cityCode: '421300',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(suizhouEmpInp.breakdown.deductibleDeducted, 400, '随州职工一级住院起付线应为400元');
  assertEqual(suizhouEmpInp.breakdown.baseReimbursed, 9120, '随州职工一级住院实报不符: (10000-400)*0.95=9120');
  console.log(`  ✓ [H9 PASS] 随州职工一级住院(花费10000): 扣起付¥400，实报¥9120 (95%比例，依据: 随政发〔2023〕21号)`);
  passCount++;

  // 恩施州 (422800) - 居民三级住院花费 10000 元，起付1000元，报销60%
  totalChecks++;
  const enshiResInp = calculateReimbursement({
    cityCode: '422800',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(enshiResInp.breakdown.deductibleDeducted, 1000, '恩施居民三级住院起付线应为1000元');
  assertEqual(enshiResInp.breakdown.baseReimbursed, 5400, '恩施居民三级住院实报不符: (10000-1000)*0.60=5400');
  console.log(`  ✓ [H9 PASS] 恩施居民三级住院(花费10000): 扣起付¥1000，实报¥5400 (60%比例，依据: 恩施州政发〔2023〕12号)`);
  passCount++;

  // 天门市 (429006) - 职工基层门诊花费 1000 元，起付600元，报销80%
  totalChecks++;
  const tianmenEmpOut = calculateReimbursement({
    cityCode: '429006',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(tianmenEmpOut.breakdown.deductibleDeducted, 600, '天门职工基层门诊起付线应为600元');
  assertEqual(tianmenEmpOut.breakdown.baseReimbursed, 320, '天门职工基层门诊实报不符: (1000-600)*0.80=320');
  console.log(`  ✓ [H9 PASS] 天门职工基层门诊(花费1000): 扣起付¥600，实报¥320 (80%比例，依据: 天政办发〔2022〕39号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H10: 湖南省全域统筹区专项测算断言
  // --------------------------------------------------------------------------
  console.log('\n>>> [Suite H10] 执行湖南省地级市/州专项医保测算断言...');

  // 株洲市 (430200) - 职工基层门诊花费 1000 元，免起付，报销70%
  totalChecks++;
  const zhuzhouEmpOut = calculateReimbursement({
    cityCode: '430200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zhuzhouEmpOut.breakdown.deductibleDeducted, 0, '株洲职工基层门诊免起付线');
  assertEqual(zhuzhouEmpOut.breakdown.baseReimbursed, 700, '株洲职工基层门诊实报不符: 1000*0.70=700');
  console.log(`  ✓ [H10 PASS] 株洲职工基层门诊(花费1000): 免起付实报¥700 (70%比例，依据: 株政办发〔2022〕16号)`);
  passCount++;

  // 湘潭市 (430300) - 职工二级门诊花费 1000 元，起付200元，报销60%
  totalChecks++;
  const xiangtanEmpOut = calculateReimbursement({
    cityCode: '430300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(xiangtanEmpOut.breakdown.deductibleDeducted, 200, '湘潭职工二级门诊起付线应为200元');
  assertEqual(xiangtanEmpOut.breakdown.baseReimbursed, 480, '湘潭职工二级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H10 PASS] 湘潭职工二级门诊(花费1000): 扣起付¥200，实报¥480 (60%比例，依据: 潭政办发〔2022〕36号)`);
  passCount++;

  // 衡阳市 (430400) - 职工三级门诊花费 1000 元，起付300元，报销60%
  totalChecks++;
  const hengyangEmpOut = calculateReimbursement({
    cityCode: '430400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(hengyangEmpOut.breakdown.deductibleDeducted, 300, '衡阳职工三级门诊起付线应为300元');
  assertEqual(hengyangEmpOut.breakdown.baseReimbursed, 420, '衡阳职工三级门诊实报不符: (1000-300)*0.60=420');
  console.log(`  ✓ [H10 PASS] 衡阳职工三级门诊(花费1000): 扣起付¥300，实报¥420 (60%比例，依据: 衡政办发〔2022〕27号)`);
  passCount++;

  // 邵阳市 (430500) - 职工二级住院花费 10000 元，起付800元，报销90%
  totalChecks++;
  const shaoyangEmpInp = calculateReimbursement({
    cityCode: '430500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(shaoyangEmpInp.breakdown.deductibleDeducted, 800, '邵阳职工二级住院起付线应为800元');
  assertEqual(shaoyangEmpInp.breakdown.baseReimbursed, 8280, '邵阳职工二级住院实报不符: (10000-800)*0.90=8280');
  console.log(`  ✓ [H10 PASS] 邵阳职工二级住院(花费10000): 扣起付¥800，实报¥8280 (90%比例，依据: 邵医保发〔2023〕21号)`);
  passCount++;

  // 岳阳市 (430600) - 职工一级住院花费 10000 元，起付500元，报销92%
  totalChecks++;
  const yueyangEmpInp = calculateReimbursement({
    cityCode: '430600',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yueyangEmpInp.breakdown.deductibleDeducted, 500, '岳阳职工一级住院起付线应为500元');
  assertEqual(yueyangEmpInp.breakdown.baseReimbursed, 8740, '岳阳职工一级住院实报不符: (10000-500)*0.92=8740');
  console.log(`  ✓ [H10 PASS] 岳阳职工一级住院(花费10000): 扣起付¥500，实报¥8740 (92%比例，依据: 岳医保发〔2023〕19号)`);
  passCount++;

  // 常德市 (430700) - 居民基层住院花费 5000 元，起付200元，报销85%
  totalChecks++;
  const changdeResInp = calculateReimbursement({
    cityCode: '430700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 5000
  });
  assertEqual(changdeResInp.breakdown.deductibleDeducted, 200, '常德居民基层住院起付线应为200元');
  assertEqual(changdeResInp.breakdown.baseReimbursed, 4080, '常德居民基层住院实报不符: (5000-200)*0.85=4080');
  console.log(`  ✓ [H10 PASS] 常德居民基层住院(花费5000): 扣起付¥200，实报¥4080 (85%比例，依据: 常医保发〔2023〕18号)`);
  passCount++;

  // 张家界市 (430800) - 居民二级住院花费 6000 元，起付800元，报销80%
  totalChecks++;
  const zhangjiajieResInp = calculateReimbursement({
    cityCode: '430800',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(zhangjiajieResInp.breakdown.deductibleDeducted, 800, '张家界居民二级住院起付线应为800元');
  assertEqual(zhangjiajieResInp.breakdown.baseReimbursed, 4160, '张家界居民二级住院实报不符: (6000-800)*0.80=4160');
  console.log(`  ✓ [H10 PASS] 张家界居民二级住院(花费6000): 扣起付¥800，实报¥4160 (80%比例，依据: 张医保发〔2023〕16号)`);
  passCount++;

  // 益阳市 (430900) - 职工退休二级住院花费 10000 元，起付800元，报销90%+2%=92%
  totalChecks++;
  const yiyangEmpRet = calculateReimbursement({
    cityCode: '430900',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yiyangEmpRet.breakdown.deductibleDeducted, 800, '益阳职工二级住院起付线应为800元');
  assertEqual(yiyangEmpRet.breakdown.baseReimbursed, 8464, '益阳职工退休二级住院实报不符: (10000-800)*0.92=8464');
  console.log(`  ✓ [H10 PASS] 益阳职工退休二级住院(花费10000): 扣起付¥800，按92%实报¥8464 (依据: 益医保发〔2023〕17号)`);
  passCount++;

  // 郴州市 (431000) - 居民基层门诊花费 300 元，免起付，报销70%
  totalChecks++;
  const chenzhouResOut = calculateReimbursement({
    cityCode: '431000',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(chenzhouResOut.breakdown.deductibleDeducted, 0, '郴州居民基层门诊免起付线');
  assertEqual(chenzhouResOut.breakdown.baseReimbursed, 210, '郴州居民基层门诊实报不符: 300*0.70=210');
  console.log(`  ✓ [H10 PASS] 郴州居民基层门诊(花费300): 免起付实报¥210 (70%比例，依据: 郴医保发〔2023〕18号)`);
  passCount++;

  // 怀化市 (431200) - 居民三级住院花费 10000 元，起付1200元，报销65%
  totalChecks++;
  const huaihuaResInp = calculateReimbursement({
    cityCode: '431200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(huaihuaResInp.breakdown.deductibleDeducted, 1200, '怀化居民三级住院起付线应为1200元');
  assertEqual(huaihuaResInp.breakdown.baseReimbursed, 5720, '怀化居民三级住院实报不符: (10000-1200)*0.65=5720');
  console.log(`  ✓ [H10 PASS] 怀化居民三级住院(花费10000): 扣起付¥1200，实报¥5720 (65%比例，依据: 怀医保发〔2023〕20号)`);
  passCount++;

  console.log(`\n>>> [Suite H11] 执行河北省地级市/直管市/雄安新区专项医保测算断言...`);

  // 唐山市 (130200) - 职工门诊在职花费 1000 元，扣起付100元，报销50%
  totalChecks++;
  const tangshanEmpOut = calculateReimbursement({
    cityCode: '130200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(tangshanEmpOut.breakdown.deductibleDeducted, 100, '唐山职工门诊起付线应为100元');
  assertEqual(tangshanEmpOut.breakdown.baseReimbursed, 450, '唐山职工门诊在职实报不符: (1000-100)*0.50=450');
  console.log(`  ✓ [H11 PASS] 唐山职工二级门诊(花费1000): 扣起付¥100，实报¥450 (50%比例，依据: 唐政办发〔2021〕9号)`);
  passCount++;

  // 秦皇岛市 (130300) - 职工基层门诊退休花费 1000 元，一级机构免起付，报销60%+10%=70%
  totalChecks++;
  const qinhuangdaoEmpOut = calculateReimbursement({
    cityCode: '130300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qinhuangdaoEmpOut.breakdown.deductibleDeducted, 0, '秦皇岛职工基层门诊取消起付线(0元)');
  assertEqual(qinhuangdaoEmpOut.breakdown.baseReimbursed, 700, '秦皇岛职工退休基层门诊实报不符: 1000*0.70=700');
  console.log(`  ✓ [H11 PASS] 秦皇岛职工退休基层门诊(花费1000): 免起付实报¥700 (70%优待比例，依据: 秦政办规〔2021〕1号)`);
  passCount++;

  // 邯郸市 (130400) - 职工门诊在职花费 1000 元，扣起付100元，报销60%
  totalChecks++;
  const handanEmpOut = calculateReimbursement({
    cityCode: '130400',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(handanEmpOut.breakdown.deductibleDeducted, 100, '邯郸职工门诊起付线应为100元');
  assertEqual(handanEmpOut.breakdown.baseReimbursed, 540, '邯郸职工门诊在职实报不符: (1000-100)*0.60=540');
  console.log(`  ✓ [H11 PASS] 邯郸职工二级门诊(花费1000): 扣起付¥100，实报¥540 (60%比例，依据: 邯政办规〔2021〕9号)`);
  passCount++;

  // 邢台市 (130500) - 居民基层门诊花费 300 元，免起付，乡镇卫生院报销80%
  totalChecks++;
  const xingtaiResOut = calculateReimbursement({
    cityCode: '130500',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(xingtaiResOut.breakdown.deductibleDeducted, 0, '邢台居民基层门诊免起付线');
  assertEqual(xingtaiResOut.breakdown.baseReimbursed, 240, '邢台居民基层门诊实报不符: 300*0.80=240');
  console.log(`  ✓ [H11 PASS] 邢台居民基层门诊(花费300): 免起付实报¥240 (80%比例，依据: 邢医保发〔2023〕12号)`);
  passCount++;

  // 保定市 (130600) - 职工二级门诊在职花费 1000 元，扣起付100元，2024提高后报销60%
  totalChecks++;
  const baodingEmpOut = calculateReimbursement({
    cityCode: '130600',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(baodingEmpOut.breakdown.deductibleDeducted, 100, '保定职工门诊起付线应为100元');
  assertEqual(baodingEmpOut.breakdown.baseReimbursed, 540, '保定职工二级门诊实报不符: (1000-100)*0.60=540');
  console.log(`  ✓ [H11 PASS] 保定职工二级门诊(花费1000): 扣起付¥100，实报¥540 (60%提高比例，依据: 保医保发〔2022〕4号)`);
  passCount++;

  // 张家口市 (130700) - 居民二级住院花费 6000 元，扣起付800元，报销75%
  totalChecks++;
  const zhangjiakouResInp = calculateReimbursement({
    cityCode: '130700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(zhangjiakouResInp.breakdown.deductibleDeducted, 800, '张家口居民二级住院起付线应为800元');
  assertEqual(zhangjiakouResInp.breakdown.baseReimbursed, 3900, '张家口居民二级住院实报不符: (6000-800)*0.75=3900');
  console.log(`  ✓ [H11 PASS] 张家口居民二级住院(花费6000): 扣起付¥800，实报¥3900 (75%比例，依据: 张医保字〔2023〕18号)`);
  passCount++;

  // 承德市 (130800) - 职工二级住院花费 10000 元，扣起付500元，报销88%
  totalChecks++;
  const chengdeEmpInp = calculateReimbursement({
    cityCode: '130800',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(chengdeEmpInp.breakdown.deductibleDeducted, 500, '承德职工二级住院起付线应为500元');
  assertEqual(chengdeEmpInp.breakdown.baseReimbursed, 8360, '承德职工二级住院实报不符: (10000-500)*0.88=8360');
  console.log(`  ✓ [H11 PASS] 承德职工二级住院(花费10000): 扣起付¥500，实报¥8360 (88%比例，依据: 承政规〔2022〕2号)`);
  passCount++;

  // 沧州市 (130900) - 居民门诊花费 200 元，免起付，报销50%
  totalChecks++;
  const cangzhouResOut = calculateReimbursement({
    cityCode: '130900',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 200
  });
  assertEqual(cangzhouResOut.breakdown.deductibleDeducted, 0, '沧州居民门诊免起付线');
  assertEqual(cangzhouResOut.breakdown.baseReimbursed, 100, '沧州居民门诊实报不符: 200*0.50=100');
  console.log(`  ✓ [H11 PASS] 沧州居民门诊(花费200): 免起付实报¥100 (50%比例，依据: 沧医保字〔2023〕19号)`);
  passCount++;

  // 廊坊市 (131000) - 职工门诊退休花费 1000 元，扣起付100元，退休报销60%+10%=70%
  totalChecks++;
  const langfangEmpRet = calculateReimbursement({
    cityCode: '131000',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(langfangEmpRet.breakdown.deductibleDeducted, 100, '廊坊职工门诊起付线应为100元');
  assertEqual(langfangEmpRet.breakdown.baseReimbursed, 630, '廊坊职工门诊退休实报不符: (1000-100)*0.70=630');
  console.log(`  ✓ [H11 PASS] 廊坊职工退休二级门诊(花费1000): 扣起付¥100，按退休70%实报¥630 (依据: 廊医保规〔2021〕2号)`);
  passCount++;

  // 雄安新区 (133100) - 职工二级门诊在职花费 2000 元，扣起付900元，二级报销80%
  totalChecks++;
  const xionganEmpOut = calculateReimbursement({
    cityCode: '133100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(xionganEmpOut.breakdown.deductibleDeducted, 900, '雄安职工门诊在职起付线应为900元');
  assertEqual(xionganEmpOut.breakdown.baseReimbursed, 880, '雄安职工二级门诊实报不符: (2000-900)*0.80=880');
  console.log(`  ✓ [H11 PASS] 雄安职工二级门诊(花费2000): 扣起付¥900，按二级80%高比例实报¥880 (依据: 冀雄政办发〔2022〕15号)`);
  passCount++;

  // 定州市 (130682) - 职工一级住院在职花费 10000 元，扣起付200元，报销92%
  totalChecks++;
  const dingzhouEmpInp = calculateReimbursement({
    cityCode: '130682',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(dingzhouEmpInp.breakdown.deductibleDeducted, 200, '定州职工一级住院起付线应为200元');
  assertEqual(dingzhouEmpInp.breakdown.baseReimbursed, 9016, '定州职工一级住院实报不符: (10000-200)*0.92=9016');
  console.log(`  ✓ [H11 PASS] 定州职工一级住院(花费10000): 扣起付¥200，按92%实报¥9016 (依据: 定医保字〔2023〕11号)`);
  passCount++;

  console.log(`\n>>> [Suite H12] 执行安徽省地级市专项医保测算断言...`);

  // 芜湖市 (340200) - 职工门诊在职二级花费 1000 元，扣起付400元，报销50%
  totalChecks++;
  const wuhuEmpOut = calculateReimbursement({
    cityCode: '340200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(wuhuEmpOut.breakdown.deductibleDeducted, 400, '芜湖职工门诊二级起付线应为400元');
  assertEqual(wuhuEmpOut.breakdown.baseReimbursed, 300, '芜湖职工二级门诊实报不符: (1000-400)*0.50=300');
  console.log(`  ✓ [H12 PASS] 芜湖职工二级门诊(花费1000): 扣起付¥400，实报¥300 (50%比例，依据: 芜医保〔2022〕46号)`);
  passCount++;

  // 铜陵市 (340700) - 职工门诊退休一级花费 1000 元，扣起付200元，退休报销60%+10%=70%
  totalChecks++;
  const tonglingEmpOut = calculateReimbursement({
    cityCode: '340700',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(tonglingEmpOut.breakdown.deductibleDeducted, 200, '铜陵职工门诊一级起付线应为200元');
  assertEqual(tonglingEmpOut.breakdown.baseReimbursed, 560, '铜陵职工退休一级门诊实报不符: (1000-200)*0.70=560');
  console.log(`  ✓ [H12 PASS] 铜陵职工退休一级门诊(花费1000): 扣起付¥200，按退休70%实报¥560 (依据: 铜医保发〔2022〕15号)`);
  passCount++;

  // 安庆市 (340800) - 居民基层门诊花费 300 元，免起付，报销50%
  totalChecks++;
  const anqingResOut = calculateReimbursement({
    cityCode: '340800',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(anqingResOut.breakdown.deductibleDeducted, 0, '安庆居民基层门诊免起付线');
  assertEqual(anqingResOut.breakdown.baseReimbursed, 150, '安庆居民基层门诊实报不符: 300*0.50=150');
  console.log(`  ✓ [H12 PASS] 安庆居民基层门诊(花费300): 免起付实报¥150 (50%比例，依据: 宜医保发〔2023〕15号)`);
  passCount++;

  // 蚌埠市 (340300) - 职工二级住院在职花费 10000 元，扣起付400元，报销92%
  totalChecks++;
  const bengbuEmpInp = calculateReimbursement({
    cityCode: '340300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(bengbuEmpInp.breakdown.deductibleDeducted, 400, '蚌埠职工二级住院起付线应为400元');
  assertEqual(bengbuEmpInp.breakdown.baseReimbursed, 8832, '蚌埠职工二级住院实报不符: (10000-400)*0.92=8832');
  console.log(`  ✓ [H12 PASS] 蚌埠职工二级住院(花费10000): 扣起付¥400，实报¥8832 (92%比例，依据: 蚌医保发〔2023〕15号)`);
  passCount++;

  // 淮南市 (340400) - 居民基层门诊花费 300 元，免起付，报销60%，限额200元
  totalChecks++;
  const huainanResOut = calculateReimbursement({
    cityCode: '340400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(huainanResOut.breakdown.deductibleDeducted, 0, '淮南居民基层门诊免起付线');
  assertEqual(huainanResOut.breakdown.baseReimbursed, 180, '淮南居民基层门诊实报不符: 300*0.60=180');
  console.log(`  ✓ [H12 PASS] 淮南居民基层门诊(花费300): 免起付实报¥180 (60%比例，依据: 淮医保发〔2023〕16号)`);
  passCount++;

  // 滁州市 (341100) - 职工一级门诊在职花费 1000 元，扣起付200元，报销60%
  totalChecks++;
  const chuzhouEmpOut = calculateReimbursement({
    cityCode: '341100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(chuzhouEmpOut.breakdown.deductibleDeducted, 200, '滁州职工门诊一级起付线应为200元');
  assertEqual(chuzhouEmpOut.breakdown.baseReimbursed, 480, '滁州职工一级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H12 PASS] 滁州职工一级门诊(花费1000): 扣起付¥200，按60%实报¥480 (依据: 滁医保发〔2022〕17号)`);
  passCount++;

  // 六安市 (341500) - 居民二级住院花费 6000 元，扣起付500元，报销80%
  totalChecks++;
  const luanResInp = calculateReimbursement({
    cityCode: '341500',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(luanResInp.breakdown.deductibleDeducted, 500, '六安居民二级住院起付线应为500元');
  assertEqual(luanResInp.breakdown.baseReimbursed, 4400, '六安居民二级住院实报不符: (6000-500)*0.80=4400');
  console.log(`  ✓ [H12 PASS] 六安居民二级住院(花费6000): 扣起付¥500，实报¥4400 (80%比例，依据: 六医保发〔2023〕18号)`);
  passCount++;

  // 宣城市 (341800) - 职工一级门诊退休花费 1000 元，扣起付200元，退休报销50%+10%=60%
  totalChecks++;
  const xuanchengEmpOut = calculateReimbursement({
    cityCode: '341800',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(xuanchengEmpOut.breakdown.deductibleDeducted, 200, '宣城职工门诊一级起付线应为200元');
  assertEqual(xuanchengEmpOut.breakdown.baseReimbursed, 480, '宣城职工退休一级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H12 PASS] 宣城职工退休一级门诊(花费1000): 扣起付¥200，按退休60%实报¥480 (依据: 宣医保秘〔2022〕19号)`);
  passCount++;

  // 淮北市 (340600) - 职工二级门诊退休花费 1000 元，扣起付400元，退休报销55%+5%=60%
  totalChecks++;
  const huaibeiEmpOut = calculateReimbursement({
    cityCode: '340600',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(huaibeiEmpOut.breakdown.deductibleDeducted, 400, '淮北职工门诊二级起付线应为400元');
  assertEqual(huaibeiEmpOut.breakdown.baseReimbursed, 360, '淮北职工退休二级门诊实报不符: (1000-400)*0.60=360');
  console.log(`  ✓ [H12 PASS] 淮北职工退休二级门诊(花费1000): 扣起付¥400，按退休60%实报¥360 (依据: 淮医保发〔2022〕14号)`);
  passCount++;

  // 阜阳市 (341200) - 居民基层门诊花费 400 元，免起付，报销55%
  totalChecks++;
  const fuyangResOut = calculateReimbursement({
    cityCode: '341200',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 400
  });
  assertEqual(fuyangResOut.breakdown.deductibleDeducted, 0, '阜阳居民基层门诊免起付线');
  assertEqual(fuyangResOut.breakdown.baseReimbursed, 220, '阜阳居民基层门诊实报不符: 400*0.55=220');
  console.log(`  ✓ [H12 PASS] 阜阳居民基层门诊(花费400): 免起付实报¥220 (55%比例，依据: 阜医保发〔2023〕16号)`);
  passCount++;

  console.log(`\n>>> [Suite H13] 执行江西省地级市专项医保测算断言...`);

  // 九江市 (360400) - 职工门诊在职二级花费 1000 元，起付300元，报销60%
  totalChecks++;
  const jiujiangEmpOut = calculateReimbursement({
    cityCode: '360400',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(jiujiangEmpOut.breakdown.deductibleDeducted, 300, '九江职工门诊起付线应为300元');
  assertEqual(jiujiangEmpOut.breakdown.baseReimbursed, 420, '九江职工二级门诊实报不符: (1000-300)*0.60=420');
  console.log(`  ✓ [H13 PASS] 九江职工二级门诊(花费1000): 扣起付¥300，实报¥420 (60%比例，依据: 九府办发〔2022〕21号)`);
  passCount++;

  // 景德镇市 (360200) - 职工门诊退休一级花费 1000 元，起付300元，退休报销60%+5%=65%
  totalChecks++;
  const jingdezhenEmpOut = calculateReimbursement({
    cityCode: '360200',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(jingdezhenEmpOut.breakdown.deductibleDeducted, 300, '景德镇职工门诊起付线应为300元');
  assertEqual(jingdezhenEmpOut.breakdown.baseReimbursed, 455, '景德镇职工退休一级门诊实报不符: (1000-300)*0.65=455');
  console.log(`  ✓ [H13 PASS] 景德镇职工退休一级门诊(花费1000): 扣起付¥300，按退休65%实报¥455 (依据: 景府办字〔2022〕46号)`);
  passCount++;

  // 萍乡市 (360300) - 居民基层门诊花费 300 元，免起付，报销65%，限额150元
  totalChecks++;
  const pingxiangResOut = calculateReimbursement({
    cityCode: '360300',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(pingxiangResOut.breakdown.deductibleDeducted, 0, '萍乡居民基层门诊免起付线');
  assertEqual(pingxiangResOut.breakdown.baseReimbursed, 150, '萍乡居民基层门诊实报受150元封顶限制');
  console.log(`  ✓ [H13 PASS] 萍乡居民基层门诊(花费300): 免起付受限额封顶实报¥150 (依据: 萍医保发〔2023〕14号)`);
  passCount++;

  // 赣州市 (360700) - 职工门诊在职三级花费 1000 元，起付300元，报销55%
  totalChecks++;
  const ganzhouEmpOut = calculateReimbursement({
    cityCode: '360700',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(ganzhouEmpOut.breakdown.deductibleDeducted, 300, '赣州职工门诊起付线应为300元');
  assertEqual(ganzhouEmpOut.breakdown.baseReimbursed, 385, '赣州职工三级门诊实报不符: (1000-300)*0.55=385');
  console.log(`  ✓ [H13 PASS] 赣州职工三级门诊(花费1000): 扣起付¥300，按55%实报¥385 (依据: 赣市府办发〔2022〕19号)`);
  passCount++;

  // 吉安市 (360800) - 职工二级住院在职花费 10000 元，扣起付500元，报销90%
  totalChecks++;
  const jianEmpInp = calculateReimbursement({
    cityCode: '360800',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jianEmpInp.breakdown.deductibleDeducted, 500, '吉安职工住院二级起付线应为500元');
  assertEqual(jianEmpInp.breakdown.baseReimbursed, 8550, '吉安职工二级住院实报不符: (10000-500)*0.90=8550');
  console.log(`  ✓ [H13 PASS] 吉安职工二级住院(花费10000): 扣起付¥500，按90%实报¥8550 (依据: 吉医保发〔2023〕12号)`);
  passCount++;

  // 宜春市 (360900) - 居民二级住院花费 6000 元，扣起付400元，报销80%
  totalChecks++;
  const yichunResInp = calculateReimbursement({
    cityCode: '360900',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(yichunResInp.breakdown.deductibleDeducted, 400, '宜春居民住院二级起付线应为400元');
  assertEqual(yichunResInp.breakdown.baseReimbursed, 4480, '宜春居民二级住院实报不符: (6000-400)*0.80=4480');
  console.log(`  ✓ [H13 PASS] 宜春居民二级住院(花费6000): 扣起付¥400，实报¥4480 (80%比例，依据: 宜医保字〔2023〕20号)`);
  passCount++;

  // 抚州市 (361000) - 职工门诊退休二级花费 1000 元，起付300元，退休报销60%+5%=65%
  totalChecks++;
  const fuzhouEmpOut = calculateReimbursement({
    cityCode: '361000',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(fuzhouEmpOut.breakdown.deductibleDeducted, 300, '抚州职工门诊起付线应为300元');
  assertEqual(fuzhouEmpOut.breakdown.baseReimbursed, 455, '抚州职工退休二级门诊实报不符: (1000-300)*0.65=455');
  console.log(`  ✓ [H13 PASS] 抚州职工退休二级门诊(花费1000): 扣起付¥300，按退休65%实报¥455 (依据: 抚医保发〔2022〕16号)`);
  passCount++;

  // 上饶市 (361100) - 职工一级门诊在职花费 1000 元，起付300元，报销65%
  totalChecks++;
  const shangraoEmpOut = calculateReimbursement({
    cityCode: '361100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shangraoEmpOut.breakdown.deductibleDeducted, 300, '上饶职工门诊起付线应为300元');
  assertEqual(shangraoEmpOut.breakdown.baseReimbursed, 455, '上饶职工一级门诊实报不符: (1000-300)*0.65=455');
  console.log(`  ✓ [H13 PASS] 上饶职工一级门诊(花费1000): 扣起付¥300，按65%实报¥455 (依据: 饶府办字〔2022〕75号)`);
  passCount++;

  // 新余市 (360500) - 职工一级住院退休花费 8000 元，扣起付200元，退休报销95%+3%=98%
  totalChecks++;
  const xinyuEmpInp = calculateReimbursement({
    cityCode: '360500',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 8000
  });
  assertEqual(xinyuEmpInp.breakdown.deductibleDeducted, 200, '新余职工住院一级起付线应为200元');
  assertEqual(xinyuEmpInp.breakdown.baseReimbursed, 7644, '新余职工退休一级住院实报不符: (8000-200)*0.98=7644');
  console.log(`  ✓ [H13 PASS] 新余职工退休一级住院(花费8000): 扣起付¥200，按退休98%实报¥7644 (依据: 余府办发〔2022〕28号)`);
  passCount++;

  // 鹰潭市 (360600) - 居民三级住院花费 10000 元，扣起付600元，报销65%
  totalChecks++;
  const yingtanResInp = calculateReimbursement({
    cityCode: '360600',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yingtanResInp.breakdown.deductibleDeducted, 600, '鹰潭居民住院三级起付线应为600元');
  assertEqual(yingtanResInp.breakdown.baseReimbursed, 6110, '鹰潭居民三级住院实报不符: (10000-600)*0.65=6110');
  console.log(`  ✓ [H13 PASS] 鹰潭居民三级住院(花费10000): 扣起付¥600，实报¥6110 (65%比例，依据: 鹰医保发〔2023〕17号)`);
  passCount++;

  console.log(`\n>>> [Suite H14] 执行福建省地级市专项医保测算断言...`);

  // 泉州市 (350500) - 职工门诊二级在职花费 2000 元，起付600元，报销80%
  totalChecks++;
  const quanzhouEmpOut = calculateReimbursement({
    cityCode: '350500',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(quanzhouEmpOut.breakdown.deductibleDeducted, 600, '泉州职工门诊起付线应为600元');
  assertEqual(quanzhouEmpOut.breakdown.baseReimbursed, 1120, '泉州职工二级门诊实报不符: (2000-600)*0.80=1120');
  console.log(`  ✓ [H14 PASS] 泉州职工二级门诊(花费2000): 扣起付¥600，实报¥1120 (80%比例，依据: 泉政办〔2022〕28号)`);
  passCount++;

  // 漳州市 (350600) - 职工门诊一级退休花费 2000 元，起付600元，退休报销85%+5%=90%
  totalChecks++;
  const zhangzhouEmpOut = calculateReimbursement({
    cityCode: '350600',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(zhangzhouEmpOut.breakdown.deductibleDeducted, 600, '漳州职工门诊起付线应为600元');
  assertEqual(zhangzhouEmpOut.breakdown.baseReimbursed, 1260, '漳州职工退休一级门诊实报不符: (2000-600)*0.90=1260');
  console.log(`  ✓ [H14 PASS] 漳州职工退休一级门诊(花费2000): 扣起付¥600，按退休90%实报¥1260 (依据: 漳政办规〔2022〕6号)`);
  passCount++;

  // 莆田市 (350300) - 居民基层门诊花费 300 元，免起付，报销50%
  totalChecks++;
  const putianResOut = calculateReimbursement({
    cityCode: '350300',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(putianResOut.breakdown.deductibleDeducted, 0, '莆田居民基层门诊免起付线');
  assertEqual(putianResOut.breakdown.baseReimbursed, 150, '莆田居民基层门诊实报不符: 300*0.50=150');
  console.log(`  ✓ [H14 PASS] 莆田居民基层门诊(花费300): 免起付实报¥150 (50%比例，依据: 莆医保〔2023〕18号)`);
  passCount++;

  // 三明市 (350400) - 职工二级住院在职花费 10000 元，扣起付600元，报销88%
  totalChecks++;
  const sanmingEmpInp = calculateReimbursement({
    cityCode: '350400',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(sanmingEmpInp.breakdown.deductibleDeducted, 600, '三明职工住院二级起付线应为600元');
  assertEqual(sanmingEmpInp.breakdown.baseReimbursed, 8272, '三明职工二级住院实报不符: (10000-600)*0.88=8272');
  console.log(`  ✓ [H14 PASS] 三明职工二级住院(花费10000): 扣起付¥600，按88%实报¥8272 (依据: 明医保〔2023〕26号)`);
  passCount++;

  // 南平市 (350700) - 居民二级住院花费 6000 元，扣起付500元，报销75%
  totalChecks++;
  const nanpingResInp = calculateReimbursement({
    cityCode: '350700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(nanpingResInp.breakdown.deductibleDeducted, 500, '南平居民住院二级起付线应为500元');
  assertEqual(nanpingResInp.breakdown.baseReimbursed, 4125, '南平居民二级住院实报不符: (6000-500)*0.75=4125');
  console.log(`  ✓ [H14 PASS] 南平居民二级住院(花费6000): 扣起付¥500，实报¥4125 (75%比例，依据: 南医保〔2023〕21号)`);
  passCount++;

  // 龙岩市 (350800) - 职工门诊退休三级花费 2000 元，起付600元，退休报销75%+5%=80%
  totalChecks++;
  const longyanEmpOut = calculateReimbursement({
    cityCode: '350800',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(longyanEmpOut.breakdown.deductibleDeducted, 600, '龙岩职工门诊起付线应为600元');
  assertEqual(longyanEmpOut.breakdown.baseReimbursed, 1120, '龙岩职工退休三级门诊实报不符: (2000-600)*0.80=1120');
  console.log(`  ✓ [H14 PASS] 龙岩职工退休三级门诊(花费2000): 扣起付¥600，按退休80%实报¥1120 (依据: 龙政办规〔2022〕5号)`);
  passCount++;

  // 宁德市 (350900) - 职工一级门诊在职花费 2000 元，起付600元，报销85%
  totalChecks++;
  const ningdeEmpOut = calculateReimbursement({
    cityCode: '350900',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(ningdeEmpOut.breakdown.deductibleDeducted, 600, '宁德职工门诊起付线应为600元');
  assertEqual(ningdeEmpOut.breakdown.baseReimbursed, 1190, '宁德职工一级门诊实报不符: (2000-600)*0.85=1190');
  console.log(`  ✓ [H14 PASS] 宁德职工一级门诊(花费2000): 扣起付¥600，按85%实报¥1190 (依据: 宁政办规〔2022〕6号)`);
  passCount++;

  console.log(`\n>>> [Suite H15] 执行广西壮族自治区地级市专项医保测算断言...`);

  // 柳州市 (450200) - 职工门诊二级在职花费 1000 元，扣起付200元，报销55%
  totalChecks++;
  const liuzhouEmpOut = calculateReimbursement({
    cityCode: '450200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(liuzhouEmpOut.breakdown.deductibleDeducted, 200, '柳州职工门诊二级起付线应为200元');
  assertEqual(liuzhouEmpOut.breakdown.baseReimbursed, 440, '柳州职工二级门诊实报不符: (1000-200)*0.55=440');
  console.log(`  ✓ [H15 PASS] 柳州职工二级门诊(花费1000): 扣起付¥200，实报¥440 (55%比例，依据: 柳政规〔2022〕19号)`);
  passCount++;

  // 桂林市 (450300) - 职工门诊一级退休花费 1000 元，扣起付600元，退休报销60%+5%=65%，实报 (1000-600)*0.65=260
  totalChecks++;
  const guilinEmpOut = calculateReimbursement({
    cityCode: '450300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(guilinEmpOut.breakdown.deductibleDeducted, 600, '桂林职工门诊年度累计起付线应为600元');
  assertEqual(guilinEmpOut.breakdown.baseReimbursed, 260, '桂林职工退休一级门诊实报不符: (1000-600)*0.65=260');
  console.log(`  ✓ [H15 PASS] 桂林职工退休一级门诊(花费1000): 扣起付¥600，按退休65%实报¥260 (依据: 市政规〔2022〕15号)`);
  passCount++;

  // 梧州市 (450400) - 居民基层门诊花费 300 元，免起付，报销60%，限额200元
  totalChecks++;
  const wuzhouResOut = calculateReimbursement({
    cityCode: '450400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(wuzhouResOut.breakdown.deductibleDeducted, 0, '梧州居民基层门诊免起付线');
  assertEqual(wuzhouResOut.breakdown.baseReimbursed, 180, '梧州居民基层门诊实报不符: 300*0.60=180');
  console.log(`  ✓ [H15 PASS] 梧州居民基层门诊(花费300): 免起付实报¥180 (60%比例，依据: 梧医保发〔2023〕15号)`);
  passCount++;

  // 北海市 (450500) - 职工二级住院在职花费 10000 元，扣起付400元，报销90%
  totalChecks++;
  const beihaiEmpInp = calculateReimbursement({
    cityCode: '450500',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(beihaiEmpInp.breakdown.deductibleDeducted, 400, '北海职工住院二级起付线应为400元');
  assertEqual(beihaiEmpInp.breakdown.baseReimbursed, 8640, '北海职工二级住院实报不符: (10000-400)*0.90=8640');
  console.log(`  ✓ [H15 PASS] 北海职工二级住院(花费10000): 扣起付¥400，按90%实报¥8640 (依据: 北医保规〔2023〕8号)`);
  passCount++;

  // 防城港市 (450600) - 居民二级住院花费 6000 元，扣起付300元，报销75%
  totalChecks++;
  const fcgResInp = calculateReimbursement({
    cityCode: '450600',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(fcgResInp.breakdown.deductibleDeducted, 300, '防城港居民住院二级起付线应为300元');
  assertEqual(fcgResInp.breakdown.baseReimbursed, 4275, '防城港居民二级住院实报不符: (6000-300)*0.75=4275');
  console.log(`  ✓ [H15 PASS] 防城港居民二级住院(花费6000): 扣起付¥300，实报¥4275 (75%比例，依据: 防医保发〔2023〕16号)`);
  passCount++;

  // 钦州市 (450700) - 职工门诊退休二级花费 1000 元，扣起付200元，退休报销55%+5%=60%
  totalChecks++;
  const qinzhouEmpOut = calculateReimbursement({
    cityCode: '450700',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qinzhouEmpOut.breakdown.deductibleDeducted, 200, '钦州职工门诊二级起付线应为200元');
  assertEqual(qinzhouEmpOut.breakdown.baseReimbursed, 480, '钦州职工退休二级门诊实报不符: (1000-200)*0.60=480');
  console.log(`  ✓ [H15 PASS] 钦州职工退休二级门诊(花费1000): 扣起付¥200，按退休60%实报¥480 (依据: 钦政规〔2022〕14号)`);
  passCount++;

  // 贵港市 (450800) - 职工三级门诊在职花费 1000 元，扣起付300元，报销50%
  totalChecks++;
  const guigangEmpOut = calculateReimbursement({
    cityCode: '450800',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(guigangEmpOut.breakdown.deductibleDeducted, 300, '贵港职工门诊三级起付线应为300元');
  assertEqual(guigangEmpOut.breakdown.baseReimbursed, 350, '贵港职工三级门诊实报不符: (1000-300)*0.50=350');
  console.log(`  ✓ [H15 PASS] 贵港职工三级门诊(花费1000): 扣起付¥300，实报¥350 (50%比例，依据: 贵政规〔2022〕13号)`);
  passCount++;

  // 玉林市 (450900) - 职工二级住院在职花费 10000 元，扣起付400元，报销90%
  totalChecks++;
  const yulinEmpInp = calculateReimbursement({
    cityCode: '450900',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yulinEmpInp.breakdown.deductibleDeducted, 400, '玉林职工住院二级起付线应为400元');
  assertEqual(yulinEmpInp.breakdown.baseReimbursed, 8640, '玉林职工二级住院实报不符: (10000-400)*0.90=8640');
  console.log(`  ✓ [H15 PASS] 玉林职工二级住院(花费10000): 扣起付¥400，按90%实报¥8640 (依据: 玉医保发〔2023〕20号)`);
  passCount++;

  // 百色市 (451000) - 居民二级住院花费 6000 元，扣起付300元，报销75%
  totalChecks++;
  const baiseResInp = calculateReimbursement({
    cityCode: '451000',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(baiseResInp.breakdown.deductibleDeducted, 300, '百色居民住院二级起付线应为300元');
  assertEqual(baiseResInp.breakdown.baseReimbursed, 4275, '百色居民二级住院实报不符: (6000-300)*0.75=4275');
  console.log(`  ✓ [H15 PASS] 百色居民二级住院(花费6000): 扣起付¥300，实报¥4275 (75%比例，依据: 百医保发〔2023〕16号)`);
  passCount++;

  // 崇左市 (451400) - 职工一级门诊退休花费 1000 元，扣起付100元，退休报销60%+5%=65%
  totalChecks++;
  const chongzuoEmpOut = calculateReimbursement({
    cityCode: '451400',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(chongzuoEmpOut.breakdown.deductibleDeducted, 100, '崇左职工门诊一级起付线应为100元');
  assertEqual(chongzuoEmpOut.breakdown.baseReimbursed, 585, '崇左职工退休一级门诊实报不符: (1000-100)*0.65=585');
  console.log(`  ✓ [H15 PASS] 崇左职工退休一级门诊(花费1000): 扣起付¥100，按退休65%实报¥585 (依据: 崇政规〔2022〕11号)`);
  passCount++;

  // =========================================================================
  // Suite H16: 辽宁省全域 14 个地级市测算核验与红头文件依据闭环
  // =========================================================================
  // 鞍山市 (210300) - 职工在职一级门诊花费 1000 元，起付 300 元，报销 65%，实报 (1000-300)*0.65 = 455
  totalChecks++;
  const anshanEmpOut = calculateReimbursement({
    cityCode: '210300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(anshanEmpOut.breakdown.deductibleDeducted, 300, '鞍山职工门诊起付线应为300元');
  assertEqual(anshanEmpOut.breakdown.baseReimbursed, 455, '鞍山职工一级在职门诊实报不符: (1000-300)*0.65=455');
  console.log(`  ✓ [H16 PASS] 鞍山在职职工一级门诊(花费1000): 扣起付¥300，实报¥455 (65%比例，依据: 鞍政办发〔2022〕20号)`);
  passCount++;

  // 抚顺市 (210400) - 职工退休二级住院花费 10000 元，起付 500 元，退休比例 88%+3%=91%，实报 (10000-500)*0.91 = 8645
  totalChecks++;
  const fushunEmpIn = calculateReimbursement({
    cityCode: '210400',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(fushunEmpIn.breakdown.deductibleDeducted, 500, '抚顺职工二级住院起付线应为500元');
  assertEqual(fushunEmpIn.breakdown.baseReimbursed, 8645, '抚顺职工退休二级住院实报不符: (10000-500)*0.91=8645');
  console.log(`  ✓ [H16 PASS] 抚顺职工退休二级住院(花费10000): 扣起付¥500，实报¥8645 (91%高比例，依据: 抚医保发〔2023〕18号)`);
  passCount++;

  // 本溪市 (210500) - 居民基层门诊花费 300 元，免起付，报销 50%，受年度限额 200 元约束，实报 150
  totalChecks++;
  const benxiResOut = calculateReimbursement({
    cityCode: '210500',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(benxiResOut.breakdown.deductibleDeducted, 0, '本溪居民门诊基层免起付');
  assertEqual(benxiResOut.breakdown.baseReimbursed, 150, '本溪居民门诊基层实报不符: 300*0.5=150');
  console.log(`  ✓ [H16 PASS] 本溪居民基层门诊(花费300): 免起付，报销50%实报¥150 (依据: 本医保发〔2023〕12号)`);
  passCount++;

  // 丹东市 (210600) - 居民二级住院花费 6000 元，起付 400 元，报销 75%，实报 (6000-400)*0.75 = 4200
  totalChecks++;
  const dandongResIn = calculateReimbursement({
    cityCode: '210600',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(dandongResIn.breakdown.deductibleDeducted, 400, '丹东居民二级住院起付线应为400元');
  assertEqual(dandongResIn.breakdown.baseReimbursed, 4200, '丹东居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H16 PASS] 丹东居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 丹医保发〔2023〕15号)`);
  passCount++;

  // 锦州市 (210700) - 职工在职三级门诊花费 1200 元，起付 300 元，报销 50%，实报 (1200-300)*0.50 = 450
  totalChecks++;
  const jinzhouEmpOut = calculateReimbursement({
    cityCode: '210700',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1200
  });
  assertEqual(jinzhouEmpOut.breakdown.deductibleDeducted, 300, '锦州职工门诊起付线应为300元');
  assertEqual(jinzhouEmpOut.breakdown.baseReimbursed, 450, '锦州职工三级门诊在职实报不符: (1200-300)*0.50=450');
  console.log(`  ✓ [H16 PASS] 锦州职工在职三级门诊(花费1200): 扣起付¥300，按50%实报¥450 (依据: 锦政办发〔2022〕25号)`);
  passCount++;

  // 营口市 (210800) - 居民三级住院花费 10000 元，起付 800 元，报销 60%，实报 (10000-800)*0.60 = 5520
  totalChecks++;
  const yingkouResIn = calculateReimbursement({
    cityCode: '210800',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yingkouResIn.breakdown.deductibleDeducted, 800, '营口居民三级住院起付线应为800元');
  assertEqual(yingkouResIn.breakdown.baseReimbursed, 5520, '营口居民三级住院实报不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H16 PASS] 营口居民三级住院(花费10000): 扣起付¥800，实报¥5520 (60%比例，依据: 营医保发〔2023〕18号)`);
  passCount++;

  // 阜新市 (210900) - 职工退休一级门诊花费 1000 元，起付 300 元，退休比例 65%+5%=70%，实报 (1000-300)*0.70 = 490
  totalChecks++;
  const fuxinEmpOut = calculateReimbursement({
    cityCode: '210900',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(fuxinEmpOut.breakdown.deductibleDeducted, 300, '阜新职工门诊起付线应为300元');
  assertEqual(fuxinEmpOut.breakdown.baseReimbursed, 490, '阜新职工一级退休门诊实报不符: (1000-300)*0.70=490');
  console.log(`  ✓ [H16 PASS] 阜新职工一级退休门诊(花费1000): 扣起付¥300，按70%实报¥490 (依据: 阜政办发〔2022〕21号)`);
  passCount++;

  // 辽阳市 (211000) - 职工在职一级住院花费 5000 元，起付 300 元，报销 92%，实报 (5000-300)*0.92 = 4324
  totalChecks++;
  const liaoyangEmpIn = calculateReimbursement({
    cityCode: '211000',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 5000
  });
  assertEqual(liaoyangEmpIn.breakdown.deductibleDeducted, 300, '辽阳职工一级住院起付线应为300元');
  assertEqual(liaoyangEmpIn.breakdown.baseReimbursed, 4324, '辽阳职工一级在职住院实报不符: (5000-300)*0.92=4324');
  console.log(`  ✓ [H16 PASS] 辽阳职工一级在职住院(花费5000): 扣起付¥300，实报¥4324 (92%比例，依据: 辽阳医保发〔2023〕17号)`);
  passCount++;

  // 盘锦市 (211100) - 居民一级住院花费 4000 元，起付 200 元，报销 85%，实报 (4000-200)*0.85 = 3230
  totalChecks++;
  const panjinResIn = calculateReimbursement({
    cityCode: '211100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 4000
  });
  assertEqual(panjinResIn.breakdown.deductibleDeducted, 200, '盘锦居民一级住院起付线应为200元');
  assertEqual(panjinResIn.breakdown.baseReimbursed, 3230, '盘锦居民一级住院实报不符: (4000-200)*0.85=3230');
  console.log(`  ✓ [H16 PASS] 盘锦居民一级住院(花费4000): 扣起付¥200，实报¥3230 (85%比例，依据: 盘医保发〔2023〕20号)`);
  passCount++;

  // 铁岭市 (211200) - 职工二级门诊在职花费 800 元，起付 300 元，报销 60%，实报 (800-300)*0.60 = 300
  totalChecks++;
  const tielingEmpOut = calculateReimbursement({
    cityCode: '211200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 800
  });
  assertEqual(tielingEmpOut.breakdown.deductibleDeducted, 300, '铁岭职工门诊起付线应为300元');
  assertEqual(tielingEmpOut.breakdown.baseReimbursed, 300, '铁岭职工二级门诊实报不符: (800-300)*0.60=300');
  console.log(`  ✓ [H16 PASS] 铁岭职工在职二级门诊(花费800): 扣起付¥300，按60%实报¥300 (依据: 铁政办发〔2022〕23号)`);
  passCount++;

  // 朝阳市 (211300) - 居民二级住院花费 6000 元，起付 400 元，报销 75%，实报 (6000-400)*0.75 = 4200
  totalChecks++;
  const chaoyangResIn = calculateReimbursement({
    cityCode: '211300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(chaoyangResIn.breakdown.deductibleDeducted, 400, '朝阳居民二级住院起付线应为400元');
  assertEqual(chaoyangResIn.breakdown.baseReimbursed, 4200, '朝阳居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H16 PASS] 朝阳居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 朝医保发〔2023〕18号)`);
  passCount++;

  // 葫芦岛市 (211400) - 居民三级住院花费 10000 元，起付 900 元，报销 60%，实报 (10000-900)*0.60 = 5460
  totalChecks++;
  const huludaoResIn = calculateReimbursement({
    cityCode: '211400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(huludaoResIn.breakdown.deductibleDeducted, 900, '葫芦岛居民三级住院起付线应为900元');
  assertEqual(huludaoResIn.breakdown.baseReimbursed, 5460, '葫芦岛居民三级住院实报不符: (10000-900)*0.60=5460');
  console.log(`  ✓ [H16 PASS] 葫芦岛居民三级住院(花费10000): 扣起付¥900，实报¥5460 (60%比例，依据: 葫医保发〔2023〕16号)`);
  passCount++;

  // =========================================================================
  // Suite H17: 吉林省全域 9 个市州测算核验与红头文件依据闭环
  // =========================================================================
  // 吉林市 (220200) - 职工在职一级门诊花费 1000 元，起付 100 元，报销 60%，实报 (1000-100)*0.60 = 540
  totalChecks++;
  const jilinCityEmpOut = calculateReimbursement({
    cityCode: '220200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(jilinCityEmpOut.breakdown.deductibleDeducted, 100, '吉林市职工门诊一级起付线应为100元');
  assertEqual(jilinCityEmpOut.breakdown.baseReimbursed, 540, '吉林市职工一级在职门诊实报不符: (1000-100)*0.60=540');
  console.log(`  ✓ [H17 PASS] 吉林市在职职工一级门诊(花费1000): 扣起付¥100，实报¥540 (60%比例，依据: 吉市政办发〔2022〕26号)`);
  passCount++;

  // 四平市 (220300) - 职工退休二级住院花费 10000 元，起付 500 元，退休比例 88%+3%=91%，实报 (10000-500)*0.91 = 8645
  totalChecks++;
  const sipingEmpIn = calculateReimbursement({
    cityCode: '220300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(sipingEmpIn.breakdown.deductibleDeducted, 500, '四平职工二级住院起付线应为500元');
  assertEqual(sipingEmpIn.breakdown.baseReimbursed, 8645, '四平职工退休二级住院实报不符: (10000-500)*0.91=8645');
  console.log(`  ✓ [H17 PASS] 四平职工退休二级住院(花费10000): 扣起付¥500，实报¥8645 (91%高比例，依据: 四医保发〔2023〕15号)`);
  passCount++;

  // 辽源市 (220400) - 居民基层门诊花费 300 元，免起付，报销 50%，受年度限额 200 元约束，实报 150
  totalChecks++;
  const liaoyuanResOut = calculateReimbursement({
    cityCode: '220400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(liaoyuanResOut.breakdown.deductibleDeducted, 0, '辽源居民门诊基层免起付');
  assertEqual(liaoyuanResOut.breakdown.baseReimbursed, 150, '辽源居民门诊基层实报不符: 300*0.5=150');
  console.log(`  ✓ [H17 PASS] 辽源居民基层门诊(花费300): 免起付，报销50%实报¥150 (依据: 辽医保发〔2023〕16号)`);
  passCount++;

  // 通化市 (220500) - 居民二级住院花费 6000 元，起付 500 元，报销 75%，实报 (6000-500)*0.75 = 4125
  totalChecks++;
  const tonghuaResIn = calculateReimbursement({
    cityCode: '220500',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(tonghuaResIn.breakdown.deductibleDeducted, 500, '通化居民二级住院起付线应为500元');
  assertEqual(tonghuaResIn.breakdown.baseReimbursed, 4125, '通化居民二级住院实报不符: (6000-500)*0.75=4125');
  console.log(`  ✓ [H17 PASS] 通化居民二级住院(花费6000): 扣起付¥500，实报¥4125 (75%比例，依据: 通医保发〔2023〕19号)`);
  passCount++;

  // 白山市 (220600) - 职工在职三级门诊花费 1200 元，起付 300 元，报销 50%，实报 (1200-300)*0.50 = 450
  totalChecks++;
  const baishanEmpOut = calculateReimbursement({
    cityCode: '220600',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1200
  });
  assertEqual(baishanEmpOut.breakdown.deductibleDeducted, 300, '白山职工门诊起付线应为300元');
  assertEqual(baishanEmpOut.breakdown.baseReimbursed, 450, '白山职工三级门诊在职实报不符: (1200-300)*0.50=450');
  console.log(`  ✓ [H17 PASS] 白山职工在职三级门诊(花费1200): 扣起付¥300，按50%实报¥450 (依据: 白政办发〔2022〕20号)`);
  passCount++;

  // 松原市 (220700) - 居民三级住院花费 10000 元，起付 800 元，报销 60%，实报 (10000-800)*0.60 = 5520
  totalChecks++;
  const songyuanResIn = calculateReimbursement({
    cityCode: '220700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(songyuanResIn.breakdown.deductibleDeducted, 800, '松原居民三级住院起付线应为800元');
  assertEqual(songyuanResIn.breakdown.baseReimbursed, 5520, '松原居民三级住院实报不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H17 PASS] 松原居民三级住院(花费10000): 扣起付¥800，实报¥5520 (60%比例，依据: 松医保发〔2023〕18号)`);
  passCount++;

  // 白城市 (220800) - 职工退休一级门诊花费 1000 元，起付 300 元，退休比例 65%+5%=70%，实报 (1000-300)*0.70 = 490
  totalChecks++;
  const baichengEmpOut = calculateReimbursement({
    cityCode: '220800',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(baichengEmpOut.breakdown.deductibleDeducted, 300, '白城职工门诊起付线应为300元');
  assertEqual(baichengEmpOut.breakdown.baseReimbursed, 490, '白城职工一级退休门诊实报不符: (1000-300)*0.70=490');
  console.log(`  ✓ [H17 PASS] 白城职工一级退休门诊(花费1000): 扣起付¥300，按70%实报¥490 (依据: 白政办发〔2022〕22号)`);
  passCount++;

  // 延边朝鲜族自治州 (222400) - 居民二级住院花费 6000 元，起付 500 元，报销 75%，实报 (6000-500)*0.75 = 4125
  totalChecks++;
  const yanbianResIn = calculateReimbursement({
    cityCode: '222400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(yanbianResIn.breakdown.deductibleDeducted, 500, '延边居民二级住院起付线应为500元');
  assertEqual(yanbianResIn.breakdown.baseReimbursed, 4125, '延边居民二级住院实报不符: (6000-500)*0.75=4125');
  console.log(`  ✓ [H17 PASS] 延边居民二级住院(花费6000): 扣起付¥500，实报¥4125 (75%比例，依据: 延州医保发〔2023〕19号)`);
  passCount++;

  // =========================================================================
  // Suite H18: 黑龙江省全域 13 个市地测算核验与红头文件依据闭环
  // =========================================================================
  // 齐齐哈尔市 (230200) - 职工在职一级门诊花费 1000 元，起付 400 元，报销 70%，实报 (1000-400)*0.70 = 420
  totalChecks++;
  const qiqiharEmpOut = calculateReimbursement({
    cityCode: '230200',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qiqiharEmpOut.breakdown.deductibleDeducted, 400, '齐齐哈尔职工门诊起付线应为400元');
  assertEqual(qiqiharEmpOut.breakdown.baseReimbursed, 420, '齐齐哈尔职工一级在职门诊实报不符: (1000-400)*0.70=420');
  console.log(`  ✓ [H18 PASS] 齐齐哈尔在职职工一级门诊(花费1000): 扣起付¥400，实报¥420 (70%高比例，依据: 齐政办规〔2022〕18号)`);
  passCount++;

  // 牡丹江市 (231000) - 职工退休二级住院花费 10000 元，起付 480 元，退休比例 92%+2%=94%，实报 (10000-480)*0.94 = 8948.8
  totalChecks++;
  const mudanjiangEmpIn = calculateReimbursement({
    cityCode: '231000',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(mudanjiangEmpIn.breakdown.deductibleDeducted, 480, '牡丹江职工二级住院起付线应为480元');
  assertEqual(mudanjiangEmpIn.breakdown.baseReimbursed, 8948.8, '牡丹江职工退休二级住院实报不符: (10000-480)*0.94=8948.8');
  console.log(`  ✓ [H18 PASS] 牡丹江职工退休二级住院(花费10000): 扣起付¥480，实报¥8948.8 (94%高比例，依据: 牡医保发〔2023〕18号)`);
  passCount++;

  // 佳木斯市 (230800) - 居民基层门诊花费 300 元，免起付，报销 50%，受年度限额 200 元约束，实报 150
  totalChecks++;
  const jiamusiResOut = calculateReimbursement({
    cityCode: '230800',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(jiamusiResOut.breakdown.deductibleDeducted, 0, '佳木斯居民门诊基层免起付');
  assertEqual(jiamusiResOut.breakdown.baseReimbursed, 150, '佳木斯居民门诊基层实报不符: 300*0.5=150');
  console.log(`  ✓ [H18 PASS] 佳木斯居民基层门诊(花费300): 免起付，报销50%实报¥150 (依据: 佳医保发〔2023〕16号)`);
  passCount++;

  // 大庆市 (230600) - 职工在职一级门诊花费 1000 元，起付 300 元，报销 70%，实报 (1000-300)*0.70 = 490
  totalChecks++;
  const daqingEmpOut = calculateReimbursement({
    cityCode: '230600',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(daqingEmpOut.breakdown.deductibleDeducted, 300, '大庆职工门诊起付线应为300元');
  assertEqual(daqingEmpOut.breakdown.baseReimbursed, 490, '大庆职工一级门诊实报不符: (1000-300)*0.70=490');
  console.log(`  ✓ [H18 PASS] 大庆职工一级门诊(花费1000): 扣起付¥300，按70%实报¥490 (依据: 庆政办规〔2022〕14号)`);
  passCount++;

  // 鸡西市 (230300) - 居民二级住院花费 6000 元，起付 450 元，报销 75%，实报 (6000-450)*0.75 = 4162.5
  totalChecks++;
  const jixiResIn = calculateReimbursement({
    cityCode: '230300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(jixiResIn.breakdown.deductibleDeducted, 450, '鸡西居民二级住院起付线应为450元');
  assertEqual(jixiResIn.breakdown.baseReimbursed, 4162.5, '鸡西居民二级住院实报不符: (6000-450)*0.75=4162.5');
  console.log(`  ✓ [H18 PASS] 鸡西居民二级住院(花费6000): 扣起付¥450，实报¥4162.5 (75%比例，依据: 鸡医保发〔2023〕19号)`);
  passCount++;

  // 鹤岗市 (230400) - 职工在职三级门诊花费 1200 元，起付 400 元，报销 50%，实报 (1200-400)*0.50 = 400
  totalChecks++;
  const hegangEmpOut = calculateReimbursement({
    cityCode: '230400',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1200
  });
  assertEqual(hegangEmpOut.breakdown.deductibleDeducted, 400, '鹤岗职工门诊起付线应为400元');
  assertEqual(hegangEmpOut.breakdown.baseReimbursed, 400, '鹤岗职工三级门诊在职实报不符: (1200-400)*0.50=400');
  console.log(`  ✓ [H18 PASS] 鹤岗职工在职三级门诊(花费1200): 扣起付¥400，按50%实报¥400 (依据: 鹤政办规〔2022〕13号)`);
  passCount++;

  // 双鸭山市 (230500) - 居民三级住院花费 10000 元，起付 700 元，报销 60%，实报 (10000-700)*0.60 = 5580
  totalChecks++;
  const sysResIn = calculateReimbursement({
    cityCode: '230500',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(sysResIn.breakdown.deductibleDeducted, 700, '双鸭山居民三级住院起付线应为700元');
  assertEqual(sysResIn.breakdown.baseReimbursed, 5580, '双鸭山居民三级住院实报不符: (10000-700)*0.60=5580');
  console.log(`  ✓ [H18 PASS] 双鸭山居民三级住院(花费10000): 扣起付¥700，实报¥5580 (60%比例，依据: 双医保发〔2023〕18号)`);
  passCount++;

  // 伊春市 (230700) - 职工退休一级门诊花费 1000 元，起付 400 元，退休比例 70%+5%=75%，实报 (1000-400)*0.75 = 450
  totalChecks++;
  const yichunEmpOut = calculateReimbursement({
    cityCode: '230700',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(yichunEmpOut.breakdown.deductibleDeducted, 400, '伊春职工门诊起付线应为400元');
  assertEqual(yichunEmpOut.breakdown.baseReimbursed, 450, '伊春职工一级退休门诊实报不符: (1000-400)*0.75=450');
  console.log(`  ✓ [H18 PASS] 伊春职工一级退休门诊(花费1000): 扣起付¥400，按75%实报¥450 (依据: 伊政办规〔2022〕12号)`);
  passCount++;

  // 绥化市 (231200) - 居民二级住院花费 6000 元，起付 450 元，报销 75%，实报 (6000-450)*0.75 = 4162.5
  totalChecks++;
  const suihuaResIn = calculateReimbursement({
    cityCode: '231200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(suihuaResIn.breakdown.deductibleDeducted, 450, '绥化居民二级住院起付线应为450元');
  assertEqual(suihuaResIn.breakdown.baseReimbursed, 4162.5, '绥化居民二级住院实报不符: (6000-450)*0.75=4162.5');
  console.log(`  ✓ [H18 PASS] 绥化居民二级住院(花费6000): 扣起付¥450，实报¥4162.5 (75%比例，依据: 绥医保发〔2023〕18号)`);
  passCount++;

  // 大兴安岭地区 (232700) - 居民一级住院花费 4000 元，起付 200 元，报销 85%，实报 (4000-200)*0.85 = 3230
  totalChecks++;
  const dxalResIn = calculateReimbursement({
    cityCode: '232700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 4000
  });
  assertEqual(dxalResIn.breakdown.deductibleDeducted, 200, '大兴安岭居民一级住院起付线应为200元');
  assertEqual(dxalResIn.breakdown.baseReimbursed, 3230, '大兴安岭居民一级住院实报不符: (4000-200)*0.85=3230');
  console.log(`  ✓ [H18 PASS] 大兴安岭居民一级住院(花费4000): 扣起付¥200，实报¥3230 (85%比例，依据: 署医保发〔2023〕15号)`);
  passCount++;

  // =========================================================================
  // Suite H19: 贵州省全域 9 个市州测算核验与红头文件依据闭环
  // =========================================================================
  // 遵义市 (520300) - 职工在职一级门诊花费 1000 元，起付 150 元，报销 70%，实报 (1000-150)*0.70 = 595
  totalChecks++;
  const zunyiEmpOut = calculateReimbursement({
    cityCode: '520300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zunyiEmpOut.breakdown.deductibleDeducted, 150, '遵义职工门诊起付线应为150元');
  assertEqual(zunyiEmpOut.breakdown.baseReimbursed, 595, '遵义职工一级在职门诊实报不符: (1000-150)*0.70=595');
  console.log(`  ✓ [H19 PASS] 遵义在职职工一级门诊(花费1000): 扣起付¥150，实报¥595 (70%比例，依据: 遵府办发〔2022〕21号)`);
  passCount++;

  // 六盘水市 (520200) - 职工退休二级住院花费 10000 元，起付 500 元，退休比例 90%+3%=93%，实报 (10000-500)*0.93 = 8835
  totalChecks++;
  const lpsEmpIn = calculateReimbursement({
    cityCode: '520200',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(lpsEmpIn.breakdown.deductibleDeducted, 500, '六盘水职工二级住院起付线应为500元');
  assertEqual(lpsEmpIn.breakdown.baseReimbursed, 8835, '六盘水职工退休二级住院实报不符: (10000-500)*0.93=8835');
  console.log(`  ✓ [H19 PASS] 六盘水职工退休二级住院(花费10000): 扣起付¥500，实报¥8835 (93%高比例，依据: 市医保发〔2023〕16号)`);
  passCount++;

  // 安顺市 (520400) - 居民基层门诊花费 300 元，免起付，报销 60%，受年度限额 200 元约束，实报 180
  totalChecks++;
  const anshunResOut = calculateReimbursement({
    cityCode: '520400',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(anshunResOut.breakdown.deductibleDeducted, 0, '安顺居民门诊基层免起付');
  assertEqual(anshunResOut.breakdown.baseReimbursed, 180, '安顺居民门诊基层实报不符: 300*0.6=180');
  console.log(`  ✓ [H19 PASS] 安顺居民基层门诊(花费300): 免起付，报销60%实报¥180 (依据: 安医保发〔2023〕15号)`);
  passCount++;

  // 毕节市 (520500) - 居民二级住院花费 6000 元，起付 400 元，报销 75%，实报 (6000-400)*0.75 = 4200
  totalChecks++;
  const bijieResIn = calculateReimbursement({
    cityCode: '520500',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(bijieResIn.breakdown.deductibleDeducted, 400, '毕节居民二级住院起付线应为400元');
  assertEqual(bijieResIn.breakdown.baseReimbursed, 4200, '毕节居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H19 PASS] 毕节居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 毕医保发〔2023〕18号)`);
  passCount++;

  // 铜仁市 (520600) - 职工在职三级门诊花费 1200 元，起付 150 元，报销 60%，实报 (1200-150)*0.60 = 630
  totalChecks++;
  const tongrenEmpOut = calculateReimbursement({
    cityCode: '520600',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1200
  });
  assertEqual(tongrenEmpOut.breakdown.deductibleDeducted, 150, '铜仁职工门诊起付线应为150元');
  assertEqual(tongrenEmpOut.breakdown.baseReimbursed, 630, '铜仁职工三级门诊在职实报不符: (1200-150)*0.60=630');
  console.log(`  ✓ [H19 PASS] 铜仁职工在职三级门诊(花费1200): 扣起付¥150，按60%实报¥630 (依据: 铜府办发〔2022〕19号)`);
  passCount++;

  // 黔西南州 (522300) - 居民三级住院花费 10000 元，起付 800 元，报销 60%，实报 (10000-800)*0.60 = 5520
  totalChecks++;
  const qxnResIn = calculateReimbursement({
    cityCode: '522300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(qxnResIn.breakdown.deductibleDeducted, 800, '黔西南居民三级住院起付线应为800元');
  assertEqual(qxnResIn.breakdown.baseReimbursed, 5520, '黔西南居民三级住院实报不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H19 PASS] 黔西南居民三级住院(花费10000): 扣起付¥800，实报¥5520 (60%比例，依据: 州医保发〔2023〕19号)`);
  passCount++;

  // 黔东南州 (522600) - 职工退休一级门诊花费 1000 元，起付 150 元，退休比例 75%+5%=80%，实报 (1000-150)*0.80 = 680
  totalChecks++;
  const qdnEmpOut = calculateReimbursement({
    cityCode: '522600',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qdnEmpOut.breakdown.deductibleDeducted, 150, '黔东南职工门诊起付线应为150元');
  assertEqual(qdnEmpOut.breakdown.baseReimbursed, 680, '黔东南职工一级退休门诊实报不符: (1000-150)*0.80=680');
  console.log(`  ✓ [H19 PASS] 黔东南职工一级退休门诊(花费1000): 扣起付¥150，按80%实报¥680 (依据: 黔东南府办发〔2022〕20号)`);
  passCount++;

  // 黔南州 (522700) - 居民二级住院花费 6000 元，起付 400 元，报销 75%，实报 (6000-400)*0.75 = 4200
  totalChecks++;
  const qnResIn = calculateReimbursement({
    cityCode: '522700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(qnResIn.breakdown.deductibleDeducted, 400, '黔南居民二级住院起付线应为400元');
  assertEqual(qnResIn.breakdown.baseReimbursed, 4200, '黔南居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H19 PASS] 黔南居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 黔南医保发〔2023〕18号)`);
  passCount++;

  // =========================================================================
  // Suite H20: 云南省全域 16 个市州测算核验与红头文件依据闭环
  // =========================================================================
  // 曲靖市 (530300) - 职工在职一级门诊花费 1000 元，起付 20 元，报销 60%，实报 (1000-20)*0.60 = 588
  totalChecks++;
  const qujingEmpOut = calculateReimbursement({
    cityCode: '530300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(qujingEmpOut.breakdown.deductibleDeducted, 20, '曲靖职工门诊一级起付线应为20元');
  assertEqual(qujingEmpOut.breakdown.baseReimbursed, 588, '曲靖职工一级在职门诊实报不符: (1000-20)*0.60=588');
  console.log(`  ✓ [H20 PASS] 曲靖在职职工一级门诊(花费1000): 扣起付¥20，实报¥588 (60%比例，依据: 曲政办规〔2022〕11号)`);
  passCount++;

  // 玉溪市 (530400) - 职工退休二级住院花费 10000 元，起付 500 元，退休比例 88%+4%=92%，实报 (10000-500)*0.92 = 8740
  totalChecks++;
  const yuxiEmpIn = calculateReimbursement({
    cityCode: '530400',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(yuxiEmpIn.breakdown.deductibleDeducted, 500, '玉溪职工二级住院起付线应为500元');
  assertEqual(yuxiEmpIn.breakdown.baseReimbursed, 8740, '玉溪职工退休二级住院实报不符: (10000-500)*0.92=8740');
  console.log(`  ✓ [H20 PASS] 玉溪职工退休二级住院(花费10000): 扣起付¥500，实报¥8740 (92%高比例，依据: 玉医保发〔2023〕16号)`);
  passCount++;

  // 保山市 (530500) - 居民基层门诊花费 300 元，免起付，报销 50%，受年度限额 400 元约束，实报 150
  totalChecks++;
  const baoshanResOut = calculateReimbursement({
    cityCode: '530500',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(baoshanResOut.breakdown.deductibleDeducted, 0, '保山居民门诊基层免起付');
  assertEqual(baoshanResOut.breakdown.baseReimbursed, 150, '保山居民门诊基层实报不符: 300*0.5=150');
  console.log(`  ✓ [H20 PASS] 保山居民基层门诊(花费300): 免起付，报销50%实报¥150 (依据: 保医保发〔2023〕18号)`);
  passCount++;

  // 昭通市 (530600) - 居民二级住院花费 6000 元，起付 400 元，报销 75%，实报 (6000-400)*0.75 = 4200
  totalChecks++;
  const zhaotongResIn = calculateReimbursement({
    cityCode: '530600',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(zhaotongResIn.breakdown.deductibleDeducted, 400, '昭通居民二级住院起付线应为400元');
  assertEqual(zhaotongResIn.breakdown.baseReimbursed, 4200, '昭通居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H20 PASS] 昭通居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 昭医保发〔2023〕19号)`);
  passCount++;

  // 丽江市 (530700) - 职工在职三级门诊花费 1200 元，起付 60 元，报销 50%，实报 (1200-60)*0.50 = 570
  totalChecks++;
  const lijiangEmpOut = calculateReimbursement({
    cityCode: '530700',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1200
  });
  assertEqual(lijiangEmpOut.breakdown.deductibleDeducted, 60, '丽江职工门诊起付线应为60元');
  assertEqual(lijiangEmpOut.breakdown.baseReimbursed, 570, '丽江职工三级门诊在职实报不符: (1200-60)*0.50=570');
  console.log(`  ✓ [H20 PASS] 丽江职工在职三级门诊(花费1200): 扣起付¥60，按50%实报¥570 (依据: 丽政办规〔2022〕11号)`);
  passCount++;

  // 普洱市 (530800) - 居民三级住院花费 10000 元，起付 800 元，报销 60%，实报 (10000-800)*0.60 = 5520
  totalChecks++;
  const puerResIn = calculateReimbursement({
    cityCode: '530800',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(puerResIn.breakdown.deductibleDeducted, 800, '普洱居民三级住院起付线应为800元');
  assertEqual(puerResIn.breakdown.baseReimbursed, 5520, '普洱居民三级住院实报不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H20 PASS] 普洱居民三级住院(花费10000): 扣起付¥800，实报¥5520 (60%比例，依据: 普医保发〔2023〕18号)`);
  passCount++;

  // 临沧市 (530900) - 职工退休一级门诊花费 1000 元，起付 20 元，退休比例 60%+10%=70%，实报 (1000-20)*0.70 = 686
  totalChecks++;
  const lincangEmpOut = calculateReimbursement({
    cityCode: '530900',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(lincangEmpOut.breakdown.deductibleDeducted, 20, '临沧职工门诊起付线应为20元');
  assertEqual(lincangEmpOut.breakdown.baseReimbursed, 686, '临沧职工一级退休门诊实报不符: (1000-20)*0.70=686');
  console.log(`  ✓ [H20 PASS] 临沧职工一级退休门诊(花费1000): 扣起付¥20，按70%实报¥686 (依据: 临政办规〔2022〕11号)`);
  passCount++;

  // 大理州 (532900) - 居民二级住院花费 6000 元，起付 400 元，报销 75%，实报 (6000-400)*0.75 = 4200
  totalChecks++;
  const daliResIn = calculateReimbursement({
    cityCode: '532900',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(daliResIn.breakdown.deductibleDeducted, 400, '大理居民二级住院起付线应为400元');
  assertEqual(daliResIn.breakdown.baseReimbursed, 4200, '大理居民二级住院实报不符: (6000-400)*0.75=4200');
  console.log(`  ✓ [H20 PASS] 大理居民二级住院(花费6000): 扣起付¥400，实报¥4200 (75%比例，依据: 大医保发〔2023〕18号)`);
  // =========================================================================
  // Suite H21: 甘肃省地级市、自治州及兰州新区医保待遇测算断言
  // =========================================================================
  console.log('\n>>> [Suite H21] 执行甘肃省地级市及自治州专项医保测算断言...');

  // 天水市 (620500) - 在职职工一级门诊花费 1000 元，起付 200 元，报销 65%，实报 (1000-200)*0.65 = 520
  totalChecks++;
  const tianshuiEmpOut = calculateReimbursement({
    cityCode: '620500',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(tianshuiEmpOut.breakdown.deductibleDeducted, 200, '天水职工门诊起付线应为200元');
  assertEqual(tianshuiEmpOut.breakdown.baseReimbursed, 520, '天水职工一级门诊实报不符: (1000-200)*0.65=520');
  console.log(`  ✓ [H21 PASS] 天水在职职工一级门诊(花费1000): 扣起付¥200，实报¥520 (65%比例，依据: 天政办规〔2022〕11号)`);
  passCount++;

  // 嘉峪关市 (620200) - 职工退休二级住院花费 10000 元，起付 450 元，退休比例 90%+3%=93%，实报 (10000-450)*0.93 = 8881.5
  totalChecks++;
  const jiayuguanEmpIn = calculateReimbursement({
    cityCode: '620200',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(jiayuguanEmpIn.breakdown.deductibleDeducted, 450, '嘉峪关职工二级住院起付线应为450元');
  assertEqual(jiayuguanEmpIn.breakdown.baseReimbursed, 8881.5, '嘉峪关职工退休二级住院实报不符: (10000-450)*0.93=8881.5');
  console.log(`  ✓ [H21 PASS] 嘉峪关职工退休二级住院(花费10000): 扣起付¥450，实报¥8881.5 (93%高比例，依据: 嘉医保发〔2024〕30号)`);
  passCount++;

  // 酒泉市 (620900) - 职工在职门诊限额管控：花费 3000 元，起付 200 元，一级报销 65%，理论报销 (3000-200)*0.65=1820元，受酒泉限额1500元封顶，实报1500元
  totalChecks++;
  const jiuquanEmpOut = calculateReimbursement({
    cityCode: '620900',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 3000
  });
  assertEqual(jiuquanEmpOut.breakdown.deductibleDeducted, 200, '酒泉职工门诊起付线应为200元');
  assertEqual(jiuquanEmpOut.breakdown.baseReimbursed, 1500, '酒泉职工门诊统筹受1500元封顶管控，实报应为1500元');
  console.log(`  ✓ [H21 PASS] 酒泉在职职工门诊(花费3000): 扣起付¥200，受1500元封顶管控实报¥1500 (依据: 酒政办发〔2022〕85号)`);
  passCount++;

  // 白银市 (620400) - 职工统筹限额管控：花费 3000 元，起付 200 元，受1200元年度限额管控，实报1200元
  totalChecks++;
  const baiyinEmpOut = calculateReimbursement({
    cityCode: '620400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 3000
  });
  assertEqual(baiyinEmpOut.breakdown.deductibleDeducted, 200, '白银职工门诊起付线应为200元');
  assertEqual(baiyinEmpOut.breakdown.baseReimbursed, 1200, '白银职工门诊统筹受1200元封顶管控，实报应为1200元');
  console.log(`  ✓ [H21 PASS] 白银职工门诊(花费3000): 扣起付¥200，受1200元封顶管控实报¥1200 (依据: 白政办发〔2022〕89号)`);
  passCount++;

  // 金昌市 (620300) - 职工在职门诊花费 3000 元，受 1495 元封顶管控，实报 1495 元
  totalChecks++;
  const jinchangEmpOut = calculateReimbursement({
    cityCode: '620300',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 3000
  });
  assertEqual(jinchangEmpOut.breakdown.deductibleDeducted, 200, '金昌职工门诊起付线应为200元');
  assertEqual(jinchangEmpOut.breakdown.baseReimbursed, 1495, '金昌职工在职门诊受1495元封顶管控，实报应为1495元');
  console.log(`  ✓ [H21 PASS] 金昌职工门诊(花费3000): 扣起付¥200，受1495元封顶管控实报¥1495 (依据: 金政办发〔2022〕67号)`);
  passCount++;

  // 武威市 (620600) - 职工一级门诊花费 1000 元，起付 200 元，报销 70%，实报 (1000-200)*0.70 = 560
  totalChecks++;
  const wuweiEmpOut = calculateReimbursement({
    cityCode: '620600',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(wuweiEmpOut.breakdown.deductibleDeducted, 200, '武威职工门诊起付线应为200元');
  assertEqual(wuweiEmpOut.breakdown.baseReimbursed, 560, '武威职工一级门诊实报不符: (1000-200)*0.70=560');
  console.log(`  ✓ [H21 PASS] 武威职工一级门诊(花费1000): 扣起付¥200，按70%实报¥560 (依据: 武政办发〔2022〕82号)`);
  passCount++;

  // 张掖市 (620700) - 居民二级住院花费 6000 元，起付 450 元，报销 76%，实报 (6000-450)*0.76 = 4218
  totalChecks++;
  const zhangyeResIn = calculateReimbursement({
    cityCode: '620700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(zhangyeResIn.breakdown.deductibleDeducted, 800, '张掖居民二级住院起付线应为800元');
  assertEqual(zhangyeResIn.breakdown.baseReimbursed, 4160, '张掖居民二级住院实报不符: (6000-800)*0.80=4160');
  console.log(`  ✓ [H21 PASS] 张掖居民二级住院(花费6000): 扣起付¥800，实报¥4160 (80%比例，依据: 张医保发〔2024〕32号及最新政策)`);
  passCount++;

  // 平凉市 (620800) - 居民基层门诊花费 300 元，免起付，报销 60%，受150元限额封顶，实报 150 元
  totalChecks++;
  const pingliangResOut = calculateReimbursement({
    cityCode: '620800',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(pingliangResOut.breakdown.deductibleDeducted, 0, '平凉居民基层门诊应免起付');
  assertEqual(pingliangResOut.breakdown.baseReimbursed, 150, '平凉居民基层门诊受150元限额封顶管控');
  console.log(`  ✓ [H21 PASS] 平凉居民基层门诊(花费300): 免起付，受150元限额封顶实报¥150 (依据: 平医保发〔2024〕30号)`);
  passCount++;

  // 庆阳市 (621000) - 居民三级住院花费 10000 元，起付 950 元，报销 65%，实报 (10000-950)*0.65 = 5882.5
  totalChecks++;
  const qingyangResIn = calculateReimbursement({
    cityCode: '621000',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(qingyangResIn.breakdown.deductibleDeducted, 950, '庆阳居民三级住院起付线应为950元');
  assertEqual(qingyangResIn.breakdown.baseReimbursed, 5882.5, '庆阳居民三级住院实报不符: (10000-950)*0.65=5882.5');
  console.log(`  ✓ [H21 PASS] 庆阳居民三级住院(花费10000): 扣起付¥950，实报¥5882.5 (65%比例，依据: 庆医保发〔2024〕34号)`);
  passCount++;

  // 兰州新区 (620108) - 职工退休二级住院花费 10000 元，起付 450 元，退休比例 89%+3%=92%，实报 (10000-450)*0.92 = 8786
  totalChecks++;
  const lanzhouNewAreaEmpIn = calculateReimbursement({
    cityCode: '620108',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(lanzhouNewAreaEmpIn.breakdown.deductibleDeducted, 450, '兰州新区职工二级住院起付线应为450元');
  assertEqual(lanzhouNewAreaEmpIn.breakdown.baseReimbursed, 8786, '兰州新区职工退休二级住院实报不符: (10000-450)*0.92=8786');
  console.log(`  ✓ [H21 PASS] 兰州新区职工退休二级住院(花费10000): 扣起付¥450，实报¥8786 (92%高比例，依据: 新社保发〔2024〕25号)`);
  // =========================================================================
  // Suite H22: 内蒙古自治区地级市与盟市专项医保测算断言
  // =========================================================================
  console.log('\n>>> [Suite H22] 执行内蒙古自治区地级市与盟市专项医保测算断言...');

  // 包头市 (150200) - 在职职工一级门诊花费 1000 元，起付 200 元，报销 70%，实报 (1000-200)*0.70 = 560
  totalChecks++;
  const baotouEmpOut = calculateReimbursement({
    cityCode: '150200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(baotouEmpOut.breakdown.deductibleDeducted, 200, '包头职工门诊一级起付线应为200元');
  assertEqual(baotouEmpOut.breakdown.baseReimbursed, 560, '包头职工一级门诊实报不符: (1000-200)*0.70=560');
  console.log(`  ✓ [H22 PASS] 包头在职职工一级门诊(花费1000): 扣起付¥200，实报¥560 (70%比例，依据: 包政办发〔2023〕48号)`);
  passCount++;

  // 乌海市 (150300) - 职工退休二级住院花费 10000 元，起付 500 元，退休比例 88%+3%=91%，实报 (10000-500)*0.91 = 8645
  totalChecks++;
  const wuhaiEmpIn = calculateReimbursement({
    cityCode: '150300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(wuhaiEmpIn.breakdown.deductibleDeducted, 500, '乌海职工二级住院起付线应为500元');
  assertEqual(wuhaiEmpIn.breakdown.baseReimbursed, 8645, '乌海职工退休二级住院实报不符: (10000-500)*0.91=8645');
  console.log(`  ✓ [H22 PASS] 乌海职工退休二级住院(花费10000): 扣起付¥500，实报¥8645 (91%高比例，依据: 乌医保发〔2024〕28号)`);
  passCount++;

  // 赤峰市 (150400) - 职工在职二级门诊：花费 2000 元，起付 1000 元，比例 60%，实报 (2000-1000)*0.60 = 600
  totalChecks++;
  const chifengEmpOut = calculateReimbursement({
    cityCode: '150400',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(chifengEmpOut.breakdown.deductibleDeducted, 1000, '赤峰职工门诊起付线应为1000元');
  assertEqual(chifengEmpOut.breakdown.baseReimbursed, 600, '赤峰职工二级门诊实报不符: (2000-1000)*0.60=600');
  console.log(`  ✓ [H22 PASS] 赤峰在职职工二级门诊(花费2000): 扣起付¥1000，实报¥600 (60%比例，依据: 赤政办发〔2022〕55号)`);
  passCount++;

  // 通辽市 (150500) - 职工退休三级门诊：花费 2000 元，起付 1000 元，退休比例 50%+5%=55%，实报 (2000-1000)*0.55 = 550
  totalChecks++;
  const tongliaoEmpOut = calculateReimbursement({
    cityCode: '150500',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(tongliaoEmpOut.breakdown.deductibleDeducted, 1000, '通辽职工门诊起付线应为1000元');
  assertEqual(tongliaoEmpOut.breakdown.baseReimbursed, 550, '通辽职工退休三级门诊实报不符: (2000-1000)*0.55=550');
  console.log(`  ✓ [H22 PASS] 通辽职工退休三级门诊(花费2000): 扣起付¥1000，按55%实报¥550 (依据: 通政办发〔2022〕34号)`);
  passCount++;

  // 鄂尔多斯市 (150600) - 职工在职一级门诊：花费 2000 元，起付 1000 元，一级报销 85%，实报 (2000-1000)*0.85 = 850
  totalChecks++;
  const ordosEmpOut = calculateReimbursement({
    cityCode: '150600',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 2000
  });
  assertEqual(ordosEmpOut.breakdown.deductibleDeducted, 1000, '鄂尔多斯职工门诊起付线应为1000元');
  assertEqual(ordosEmpOut.breakdown.baseReimbursed, 850, '鄂尔多斯职工在职一级门诊实报不符: (2000-1000)*0.85=850');
  console.log(`  ✓ [H22 PASS] 鄂尔多斯在职职工一级门诊(花费2000): 扣起付¥1000，实报¥850 (85%高比例，依据: 鄂府办发〔2022〕128号)`);
  passCount++;

  // 呼伦贝尔市 (150700) - 居民二级住院花费 6000 元，起付 450 元，报销 75%，实报 (6000-450)*0.75 = 4162.5
  totalChecks++;
  const hulunbuirResIn = calculateReimbursement({
    cityCode: '150700',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(hulunbuirResIn.breakdown.deductibleDeducted, 450, '呼伦贝尔居民二级住院起付线应为450元');
  assertEqual(hulunbuirResIn.breakdown.baseReimbursed, 4162.5, '呼伦贝尔居民二级住院实报不符: (6000-450)*0.75=4162.5');
  console.log(`  ✓ [H22 PASS] 呼伦贝尔居民二级住院(花费6000): 扣起付¥450，实报¥4162.5 (75%比例，依据: 呼伦医保发〔2024〕30号)`);
  passCount++;

  // 巴彦淖尔市 (150800) - 职工在职一级门诊花费 1000 元，起付 200 元，报销 80%，实报 (1000-200)*0.80 = 640
  totalChecks++;
  const bayannurEmpOut = calculateReimbursement({
    cityCode: '150800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(bayannurEmpOut.breakdown.deductibleDeducted, 200, '巴彦淖尔职工门诊一级起付线应为200元');
  assertEqual(bayannurEmpOut.breakdown.baseReimbursed, 640, '巴彦淖尔职工一级门诊实报不符: (1000-200)*0.80=640');
  console.log(`  ✓ [H22 PASS] 巴彦淖尔职工一级门诊(花费1000): 扣起付¥200，按80%实报¥640 (依据: 巴政办发〔2023〕52号)`);
  passCount++;

  // 锡林郭勒盟 (152500) - 居民基层门诊花费 300 元，免起付，报销 50%，受200元限额管控，实报 150 元
  totalChecks++;
  const xilingolResOut = calculateReimbursement({
    cityCode: '152500',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(xilingolResOut.breakdown.deductibleDeducted, 0, '锡林郭勒居民基层门诊应免起付');
  assertEqual(xilingolResOut.breakdown.baseReimbursed, 150, '锡林郭勒居民基层门诊实报不符: 300*0.50=150');
  console.log(`  ✓ [H22 PASS] 锡林郭勒居民基层门诊(花费300): 免起付，报销50%实报¥150 (依据: 锡医保发〔2024〕32号)`);
  passCount++;

  // 兴安盟 (152200) - 居民三级住院花费 10000 元，起付 800 元，报销 60%，实报 (10000-800)*0.60 = 5520
  totalChecks++;
  const hingganResIn = calculateReimbursement({
    cityCode: '152200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(hingganResIn.breakdown.deductibleDeducted, 800, '兴安盟居民三级住院起付线应为800元');
  assertEqual(hingganResIn.breakdown.baseReimbursed, 5520, '兴安盟居民三级住院实报不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H22 PASS] 兴安盟居民三级住院(花费10000): 扣起付¥800，实报¥5520 (60%比例，依据: 兴医保发〔2024〕30号)`);
  passCount++;

  // 阿拉善盟 (152900) - 职工一级门诊花费 1000 元，起付 200 元，报销 80%，实报 (1000-200)*0.80 = 640
  totalChecks++;
  const alxaEmpOut = calculateReimbursement({
    cityCode: '152900',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(alxaEmpOut.breakdown.deductibleDeducted, 200, '阿拉善职工门诊一级起付线应为200元');
  assertEqual(alxaEmpOut.breakdown.baseReimbursed, 640, '阿拉善职工一级门诊实报不符: (1000-200)*0.80=640');
  console.log(`  ✓ [H22 PASS] 阿拉善职工一级门诊(花费1000): 扣起付¥200，按80%实报¥640 (依据: 阿署办发〔2023〕35号)`);
  // =========================================================================
  // Suite H23: 宁夏回族自治区地级市专项医保测算断言
  // =========================================================================
  console.log('\n>>> [Suite H23] 执行宁夏回族自治区地级市专项医保测算断言...');

  // 石嘴山市 (640200) - 在职职工二级门诊花费 1000 元，起付 100 元，报销 70%，实报 (1000-100)*0.70 = 630
  totalChecks++;
  const shizuishanEmpOut = calculateReimbursement({
    cityCode: '640200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shizuishanEmpOut.breakdown.deductibleDeducted, 100, '石嘴山职工门诊二级起付线应为100元');
  assertEqual(shizuishanEmpOut.breakdown.baseReimbursed, 630, '石嘴山职工二级门诊实报不符: (1000-100)*0.70=630');
  console.log(`  ✓ [H23 PASS] 石嘴山在职职工二级门诊(花费1000): 扣起付¥100，实报¥630 (70%比例，依据: 宁医保规〔2023〕3号)`);
  passCount++;

  // 吴忠市 (640300) - 职工退休二级住院花费 10000 元，起付 400 元，退休比例 88%+4%=92%，实报 (10000-400)*0.92 = 8832
  totalChecks++;
  const wuzhongEmpIn = calculateReimbursement({
    cityCode: '640300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(wuzhongEmpIn.breakdown.deductibleDeducted, 400, '吴忠职工二级住院起付线应为400元');
  assertEqual(wuzhongEmpIn.breakdown.baseReimbursed, 8832, '吴忠职工退休二级住院实报不符: (10000-400)*0.92=8832');
  console.log(`  ✓ [H23 PASS] 吴忠职工退休二级住院(花费10000): 扣起付¥400，实报¥8832 (92%高比例，依据: 吴医保发〔2024〕26号)`);
  passCount++;

  // 固原市 (640400) - 居民二级住院花费 6000 元，起付 300 元，报销 75%，实报 (6000-300)*0.75 = 4275
  totalChecks++;
  const guyuanResIn = calculateReimbursement({
    cityCode: '640400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(guyuanResIn.breakdown.deductibleDeducted, 300, '固原居民二级住院起付线应为300元');
  assertEqual(guyuanResIn.breakdown.baseReimbursed, 4275, '固原居民二级住院实报不符: (6000-300)*0.75=4275');
  console.log(`  ✓ [H23 PASS] 固原居民二级住院(花费6000): 扣起付¥300，实报¥4275 (75%比例，依据: 固医保发〔2024〕28号)`);
  passCount++;

  // 中卫市 (640500) - 职工退休一级门诊花费 1000 元，免起付，退休比例 75%+5%=80%，实报 1000*0.80 = 800
  totalChecks++;
  const zhongweiEmpOut = calculateReimbursement({
    cityCode: '640500',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(zhongweiEmpOut.breakdown.deductibleDeducted, 0, '中卫职工一级门诊应免起付');
  assertEqual(zhongweiEmpOut.breakdown.baseReimbursed, 800, '中卫职工退休一级门诊实报不符: 1000*0.80=800');
  console.log(`  ✓ [H23 PASS] 中卫职工退休一级门诊(花费1000): 免起付，按80%实报¥800 (依据: 宁医保规〔2023〕3号)`);
  passCount++;

  // =========================================================================
  // Suite H24: 青海省地级市与自治州专项医保测算断言
  // =========================================================================
  console.log('\n>>> [Suite H24] 执行青海省地级市与自治州专项医保测算断言...');

  // 海东市 (630200) - 在职职工二级门诊：花费 1000 元，免起付，报销 60%，实报 1000*0.60 = 600
  totalChecks++;
  const haidongEmpOut = calculateReimbursement({
    cityCode: '630200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(haidongEmpOut.breakdown.deductibleDeducted, 0, '海东职工门诊应免起付');
  assertEqual(haidongEmpOut.breakdown.baseReimbursed, 600, '海东职工二级门诊实报不符: 1000*0.60=600');
  console.log(`  ✓ [H24 PASS] 海东在职职工二级门诊(花费1000): 0起付，实报¥600 (60%比例，依据: 青政办〔2021〕79号)`);
  passCount++;

  // 海东市 (630200) - 居民二级住院花费 6000 元，起付 300 元，报销 75%，实报 (6000-300)*0.75 = 4275
  totalChecks++;
  const haidongResIn = calculateReimbursement({
    cityCode: '630200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(haidongResIn.breakdown.deductibleDeducted, 300, '海东居民二级住院起付线应为300元');
  assertEqual(haidongResIn.breakdown.baseReimbursed, 4275, '海东居民二级住院实报不符: (6000-300)*0.75=4275');
  console.log(`  ✓ [H24 PASS] 海东居民二级住院(花费6000): 扣起付¥300，实报¥4275 (75%比例，依据: 东医保发〔2024〕25号)`);
  passCount++;

  // 海北藏族自治州 (632200) - 职工退休二级住院花费 10000 元，起付 400 元，退休比例 88%+4%=92%，实报 (10000-400)*0.92 = 8832
  totalChecks++;
  const haibeiEmpIn = calculateReimbursement({
    cityCode: '632200',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(haibeiEmpIn.breakdown.deductibleDeducted, 400, '海北职工二级住院起付线应为400元');
  assertEqual(haibeiEmpIn.breakdown.baseReimbursed, 8832, '海北职工退休二级住院实报不符: (10000-400)*0.92=8832');
  console.log(`  ✓ [H24 PASS] 海北职工退休二级住院(花费10000): 扣起付¥400，实报¥8832 (92%高比例，依据: hb-medical-insurance-inpatient-2024)`);
  passCount++;

  // 黄南藏族自治州 (632300) - 居民三级住院花费 10000 元，起付 700 元，报销 60%，实报 (10000-700)*0.60 = 5580
  totalChecks++;
  const huangnanResIn = calculateReimbursement({
    cityCode: '632300',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(huangnanResIn.breakdown.deductibleDeducted, 700, '黄南居民三级住院起付线应为700元');
  assertEqual(huangnanResIn.breakdown.baseReimbursed, 5580, '黄南居民三级住院实报不符: (10000-700)*0.60=5580');
  console.log(`  ✓ [H24 PASS] 黄南居民三级住院(花费10000): 扣起付¥700，实报¥5580 (60%比例，依据: 黄医保发〔2024〕26号)`);
  passCount++;

  // 海南藏族自治州 (632500) - 退休职工三级门诊花费 1000 元，免起付，退休比例 50%+10%=60%，实报 1000*0.60 = 600
  totalChecks++;
  const hainanTibetanEmpOut = calculateReimbursement({
    cityCode: '632500',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(hainanTibetanEmpOut.breakdown.deductibleDeducted, 0, '海南州职工门诊应免起付');
  assertEqual(hainanTibetanEmpOut.breakdown.baseReimbursed, 600, '海南州职工退休三级门诊实报不符: 1000*0.60=600');
  console.log(`  ✓ [H24 PASS] 海南州职工退休三级门诊(花费1000): 0起付，按60%实报¥600 (依据: 青政办〔2021〕79号)`);
  passCount++;

  // 果洛藏族自治州 (632600) - 居民二级住院花费 6000 元，起付 300 元，报销 75%，实报 (6000-300)*0.75 = 4275
  totalChecks++;
  const gologResIn = calculateReimbursement({
    cityCode: '632600',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(gologResIn.breakdown.deductibleDeducted, 300, '果洛居民二级住院起付线应为300元');
  assertEqual(gologResIn.breakdown.baseReimbursed, 4275, '果洛居民二级住院实报不符: (6000-300)*0.75=4275');
  console.log(`  ✓ [H24 PASS] 果洛居民二级住院(花费6000): 扣起付¥300，实报¥4275 (75%比例，依据: 果医保发〔2024〕20号)`);
  passCount++;

  // 玉树藏族自治州 (632700) - 居民基层门诊花费 300 元，免起付，报销 50%，受限额200元管控，实报 150 元
  totalChecks++;
  const yushuResOut = calculateReimbursement({
    cityCode: '632700',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(yushuResOut.breakdown.deductibleDeducted, 0, '玉树居民基层门诊应免起付');
  assertEqual(yushuResOut.breakdown.baseReimbursed, 150, '玉树居民基层门诊实报不符: 300*0.50=150');
  console.log(`  ✓ [H24 PASS] 玉树居民基层门诊(花费300): 免起付，按50%实报¥150 (依据: 玉医保发〔2024〕22号)`);
  passCount++;

  // 海西蒙古族藏族自治州 (632800) - 职工在职二级住院花费 10000 元，起付 400 元，报销 88%，实报 (10000-400)*0.88 = 8448
  totalChecks++;
  const haixiEmpIn = calculateReimbursement({
    cityCode: '632800',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(haixiEmpIn.breakdown.deductibleDeducted, 400, '海西职工二级住院起付线应为400元');
  assertEqual(haixiEmpIn.breakdown.baseReimbursed, 8448, '海西职工二级住院实报不符: (10000-400)*0.88=8448');
  console.log(`  ✓ [H24 PASS] 海西职工二级住院(花费10000): 扣起付¥400，按88%实报¥8448 (依据: 西医保发〔2024〕28号)`);
  passCount++;

  // =========================================================================
  // Suite H25: 新疆维吾尔自治区地级市与自治州/地区专项医保测算断言
  // =========================================================================
  console.log('\n>>> [Suite H25] 执行新疆维吾尔自治区地级市与自治州/地区专项医保测算断言...');

  // 克拉玛依市 (650200) - 在职职工二级门诊：花费 1000 元，起付 40 元，报销 70%，实报 (1000-40)*0.70 = 672
  totalChecks++;
  const klmyEmpOut = calculateReimbursement({
    cityCode: '650200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(klmyEmpOut.breakdown.deductibleDeducted, 40, '克拉玛依职工门诊二级起付线应为40元');
  assertEqual(klmyEmpOut.breakdown.baseReimbursed, 672, '克拉玛依职工二级门诊实报不符: (1000-40)*0.70=672');
  console.log(`  ✓ [H25 PASS] 克拉玛依在职职工二级门诊(花费1000): 扣起付¥40，实报¥672 (70%比例，依据: 新政办发〔2024〕13号)`);
  passCount++;

  // 克拉玛依市 (650200) - 居民二级住院花费 6000 元，起付 300 元，报销 75%，实报 (6000-300)*0.75 = 4275
  totalChecks++;
  const klmyResIn = calculateReimbursement({
    cityCode: '650200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(klmyResIn.breakdown.deductibleDeducted, 300, '克拉玛依居民二级住院起付线应为300元');
  assertEqual(klmyResIn.breakdown.baseReimbursed, 4275, '克拉玛依居民二级住院实报不符: (6000-300)*0.75=4275');
  console.log(`  ✓ [H25 PASS] 克拉玛依居民二级住院(花费6000): 扣起付¥300，实报¥4275 (75%比例，依据: 克医保发〔2024〕22号)`);
  passCount++;

  // 昌吉回族自治州 (652300) - 职工退休二级住院花费 10000 元，起付 400 元，退休比例 88%+4%=92%，实报 (10000-400)*0.92 = 8832
  totalChecks++;
  const changjiEmpIn = calculateReimbursement({
    cityCode: '652300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(changjiEmpIn.breakdown.deductibleDeducted, 400, '昌吉职工二级住院起付线应为400元');
  assertEqual(changjiEmpIn.breakdown.baseReimbursed, 8832, '昌吉职工退休二级住院实报不符: (10000-400)*0.92=8832');
  console.log(`  ✓ [H25 PASS] 昌吉职工退休二级住院(花费10000): 扣起付¥400，实报¥8832 (92%高比例，依据: 昌医保发〔2024〕25号)`);
  passCount++;

  // 巴音郭楞蒙古自治州 (652800) - 居民三级住院花费 10000 元，起付 800 元，报销 60%，实报 (10000-800)*0.60 = 5520
  totalChecks++;
  const bayingolinResIn = calculateReimbursement({
    cityCode: '652800',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(bayingolinResIn.breakdown.deductibleDeducted, 800, '巴州居民三级住院起付线应为800元');
  assertEqual(bayingolinResIn.breakdown.baseReimbursed, 5520, '巴州居民三级住院实报不符: (10000-800)*0.60=5520');
  console.log(`  ✓ [H25 PASS] 巴州居民三级住院(花费10000): 扣起付¥800，实报¥5520 (60%比例，依据: 巴医保发〔2024〕28号)`);
  passCount++;

  // 阿克苏地区 (652900) - 退休职工一级门诊花费 1000 元，起付 20 元，比例 80%+5%=85%，实报 (1000-20)*0.85 = 833
  totalChecks++;
  const aksuEmpOut = calculateReimbursement({
    cityCode: '652900',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(aksuEmpOut.breakdown.deductibleDeducted, 20, '阿克苏职工门诊一级起付线应为20元');
  assertEqual(aksuEmpOut.breakdown.baseReimbursed, 833, '阿克苏职工退休一级门诊实报不符: (1000-20)*0.85=833');
  console.log(`  ✓ [H25 PASS] 阿克苏退休职工一级门诊(花费1000): 扣起付¥20，按85%实报¥833 (依据: 新政办发〔2024〕13号)`);
  passCount++;

  // 喀什地区 (653100) - 居民基层门诊花费 300 元，免起付，报销 50%，受限额200元管控，实报 150 元
  totalChecks++;
  const kashgarResOut = calculateReimbursement({
    cityCode: '653100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(kashgarResOut.breakdown.deductibleDeducted, 0, '喀什居民基层门诊应免起付');
  assertEqual(kashgarResOut.breakdown.baseReimbursed, 150, '喀什居民基层门诊实报不符: 300*0.50=150');
  console.log(`  ✓ [H25 PASS] 喀什居民基层门诊(花费300): 免起付，按50%实报¥150 (依据: 喀医保发〔2024〕28号)`);
  passCount++;

  // 伊犁哈萨克自治州 (654000) - 职工在职二级住院花费 10000 元，起付 400 元，报销 88%，实报 (10000-400)*0.88 = 8448
  totalChecks++;
  const iliEmpIn = calculateReimbursement({
    cityCode: '654000',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(iliEmpIn.breakdown.deductibleDeducted, 400, '伊犁职工二级住院起付线应为400元');
  assertEqual(iliEmpIn.breakdown.baseReimbursed, 8448, '伊犁职工二级住院实报不符: (10000-400)*0.88=8448');
  console.log(`  ✓ [H25 PASS] 伊犁职工二级住院(花费10000): 扣起付¥400，按88%实报¥8448 (依据: 伊州医保发〔2024〕26号)`);
  passCount++;

  // 阿勒泰地区 (654300) - 职工退休三级门诊花费 1000 元，起付 90 元，比例 60%+5%=65%，实报 (1000-90)*0.65 = 591.5
  totalChecks++;
  const altayEmpOut = calculateReimbursement({
    cityCode: '654300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(altayEmpOut.breakdown.deductibleDeducted, 90, '阿勒泰职工门诊三级起付线应为90元');
  assertEqual(altayEmpOut.breakdown.baseReimbursed, 591.5, '阿勒泰职工退休三级门诊实报不符: (1000-90)*0.65=591.5');
  console.log(`  ✓ [H25 PASS] 阿勒泰职工退休三级门诊(花费1000): 扣起付¥90，按65%实报¥591.5 (依据: 新政办发〔2024〕13号)`);
  passCount++;

  // 新疆生产建设兵团 (660000) - 职工在职三级门诊(花费1000, 起付100, 55%)与退休二级住院(花费10000, 起付400, 88%+3%=91%)实测断言
  totalChecks++;
  const xpccEmpOut = calculateReimbursement({
    cityCode: '660000',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(xpccEmpOut.breakdown.deductibleDeducted, 100, '兵团职工三级门诊起付线应为100元');
  assertEqual(xpccEmpOut.breakdown.baseReimbursed, 495, '兵团职工三级门诊实报不符: (1000-100)*0.55=495');
  console.log(`  ✓ [H25 PASS] 新疆生产建设兵团职工在职三级门诊(花费1000): 扣起付¥100，按55%实报¥495 (依据: 兵医保规〔2022〕2号)`);
  passCount++;

  totalChecks++;
  const xpccEmpIn = calculateReimbursement({
    cityCode: '660000',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(xpccEmpIn.breakdown.deductibleDeducted, 400, '兵团职工二级住院起付线应为400元');
  assertEqual(xpccEmpIn.breakdown.baseReimbursed, 8736, '兵团职工退休二级住院实报不符: (10000-400)*0.91=8736');
  console.log(`  ✓ [H25 PASS] 新疆生产建设兵团职工退休二级住院(花费10000): 扣起付¥400，按91%高比例实报¥8736 (依据: 兵医保发〔2024〕18号)`);
  passCount++;

  // =========================================================================
  // Suite H26: 西藏自治区地级市与地区专项医保测算断言
  // =========================================================================
  console.log('\n>>> [Suite H26] 执行西藏自治区地级市与地区专项医保测算断言...');

  // 日喀则市 (540200) - 在职职工二级门诊：花费 1000 元，起付 200 元，报销 70%，实报 (1000-200)*0.70 = 560
  totalChecks++;
  const shigatseEmpOut = calculateReimbursement({
    cityCode: '540200',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shigatseEmpOut.breakdown.deductibleDeducted, 200, '日喀则职工门诊二级起付线应为200元');
  assertEqual(shigatseEmpOut.breakdown.baseReimbursed, 560, '日喀则职工二级门诊实报不符: (1000-200)*0.70=560');
  console.log(`  ✓ [H26 PASS] 日喀则在职职工二级门诊(花费1000): 扣起付¥200，实报¥560 (70%比例，依据: 藏政办发〔2021〕36号)`);
  passCount++;

  // 日喀则市 (540200) - 居民二级住院花费 6000 元，起付 200 元，报销 80%，实报 (6000-200)*0.80 = 4640
  totalChecks++;
  const shigatseResIn = calculateReimbursement({
    cityCode: '540200',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 6000
  });
  assertEqual(shigatseResIn.breakdown.deductibleDeducted, 200, '日喀则居民二级住院起付线应为200元');
  assertEqual(shigatseResIn.breakdown.baseReimbursed, 4640, '日喀则居民二级住院实报不符: (6000-200)*0.80=4640');
  console.log(`  ✓ [H26 PASS] 日喀则居民二级住院(花费6000): 扣起付¥200，实报¥4640 (80%比例，依据: 日医保发〔2024〕18号)`);
  passCount++;

  // 昌都市 (540300) - 职工退休二级住院花费 10000 元，起付 300 元，退休比例 92%+4%=96%，实报 (10000-300)*0.96 = 9312
  totalChecks++;
  const qamdoEmpIn = calculateReimbursement({
    cityCode: '540300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(qamdoEmpIn.breakdown.deductibleDeducted, 300, '昌都职工二级住院起付线应为300元');
  assertEqual(qamdoEmpIn.breakdown.baseReimbursed, 9312, '昌都职工退休二级住院实报不符: (10000-300)*0.96=9312');
  console.log(`  ✓ [H26 PASS] 昌都职工退休二级住院(花费10000): 扣起付¥300，实报¥9312 (96%超高比例，依据: 昌医保发〔2024〕16号)`);
  passCount++;

  // 林芝市 (540400) - 居民三级住院花费 10000 元，起付 500 元，报销 70%，实报 (10000-500)*0.70 = 6650
  totalChecks++;
  const nyingchiResIn = calculateReimbursement({
    cityCode: '540400',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(nyingchiResIn.breakdown.deductibleDeducted, 500, '林芝居民三级住院起付线应为500元');
  assertEqual(nyingchiResIn.breakdown.baseReimbursed, 6650, '林芝居民三级住院实报不符: (10000-500)*0.70=6650');
  console.log(`  ✓ [H26 PASS] 林芝居民三级住院(花费10000): 扣起付¥500，实报¥6650 (70%比例，依据: 林医保发〔2024〕18号)`);
  passCount++;

  // 山南市 (540500) - 退休职工三级门诊花费 1000 元，起付 200 元，退休比例 60%+10%=70%，实报 (1000-200)*0.70 = 560
  totalChecks++;
  const shannanEmpOut = calculateReimbursement({
    cityCode: '540500',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000
  });
  assertEqual(shannanEmpOut.breakdown.deductibleDeducted, 200, '山南职工门诊三级起付线应为200元');
  assertEqual(shannanEmpOut.breakdown.baseReimbursed, 560, '山南职工退休三级门诊实报不符: (1000-200)*0.70=560');
  console.log(`  ✓ [H26 PASS] 山南退休职工三级门诊(花费1000): 扣起付¥200，按70%实报¥560 (依据: 藏政办发〔2021〕36号)`);
  passCount++;

  // 那曲市 (540600) - 居民基层门诊花费 300 元，免起付，报销 50%，受限额300元管控，实报 150 元
  totalChecks++;
  const nagquResOut = calculateReimbursement({
    cityCode: '540600',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 300
  });
  assertEqual(nagquResOut.breakdown.deductibleDeducted, 0, '那曲居民基层门诊应免起付');
  assertEqual(nagquResOut.breakdown.baseReimbursed, 150, '那曲居民基层门诊实报不符: 300*0.50=150');
  console.log(`  ✓ [H26 PASS] 那曲居民基层门诊(花费300): 免起付，按50%实报¥150 (依据: 那医保发〔2024〕15号)`);
  passCount++;

  // 阿里地区 (542500) - 职工在职一级住院花费 10000 元，起付 100 元，报销 95%，实报 (10000-100)*0.95 = 9405
  totalChecks++;
  const ngariEmpIn = calculateReimbursement({
    cityCode: '542500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assertEqual(ngariEmpIn.breakdown.deductibleDeducted, 100, '阿里职工一级住院起付线应为100元');
  assertEqual(ngariEmpIn.breakdown.baseReimbursed, 9405, '阿里职工一级住院实报不符: (10000-100)*0.95=9405');
  console.log(`  ✓ [H26 PASS] 阿里职工在职一级住院(花费10000): 扣起付¥100，按95%高比例实报¥9405 (依据: 阿医保发〔2024〕14号)`);
  passCount++;

  // --------------------------------------------------------------------------
  // Suite H27: CMI-Index 2.0 评测模型多维计算与双城对比校验
  // --------------------------------------------------------------------------
  console.log(`\n>>> [Suite H27] 执行 CMI-Index 2.0 医保政策竞争力多维评测模型断言...`);
  const benchmarkList = getCachedBenchmarkList();
  totalChecks++;
  assertEqual(benchmarkList.length, 348, 'Benchmark 评测列表必须全量涵盖全国 348 个统筹区');
  
  // 抽样检验重点城市（北京、上海、深圳、广州、成都）评测分数与6大雷达数值有效性
  for (const code of ['110100', '310100', '440300', '440100', '510100']) {
    totalChecks++;
    const item = benchmarkList.find(b => b.cityCode === code);
    assertTrue(item !== undefined, `统筹区 [${code}] 必须存在于 Benchmark 评测数据中`);
    assertTrue(!isNaN(item!.overallScore) && item!.overallScore >= 50 && item!.overallScore <= 100, `${item!.cityName} 全域综合分异常: ${item!.overallScore}`);
    assertTrue(!isNaN(item!.employeeScore) && item!.employeeScore >= 50 && item!.employeeScore <= 100, `${item!.cityName} 职工综合分异常: ${item!.employeeScore}`);
    assertTrue(!isNaN(item!.residentScore) && item!.residentScore >= 50 && item!.residentScore <= 100, `${item!.cityName} 居民综合分异常: ${item!.residentScore}`);
    
    // 6 大雷达维度断言
    const r = item!.radar;
    assertTrue(!isNaN(r.inpatient) && r.inpatient >= 30 && r.inpatient <= 100, `${item!.cityName} 住院保障分越界: ${r.inpatient}`);
    assertTrue(!isNaN(r.outpatient) && r.outpatient >= 30 && r.outpatient <= 100, `${item!.cityName} 门诊减负分越界: ${r.outpatient}`);
    assertTrue(!isNaN(r.catastrophic) && r.catastrophic >= 30 && r.catastrophic <= 100, `${item!.cityName} 大病抗风险分越界: ${r.catastrophic}`);
    assertTrue(!isNaN(r.threshold) && r.threshold >= 30 && r.threshold <= 100, `${item!.cityName} 门槛友好分越界: ${r.threshold}`);
    assertTrue(!isNaN(r.retiree) && r.retiree >= 30 && r.retiree <= 100, `${item!.cityName} 群体倾斜分越界: ${r.retiree}`);
    assertTrue(!isNaN(r.mobility) && r.mobility >= 30 && r.mobility <= 100, `${item!.cityName} 异地自由分越界: ${r.mobility}`);
  }
  console.log(`  ✓ [H27 PASS] 全国 348 统筹区 CMI-Index 2.0 评测参数结构与 6 大能力雷达数值健全稳定`);
  passCount++;

  // 验证双城 PK 12 项指标比拼矩阵
  totalChecks++;
  const pkRes = compareTwoCities('110100', '310100');
  assertTrue(pkRes !== null, '北京与上海双城对比不可为空');
  assertEqual(pkRes!.metrics.length, 12, '双城竞技场必须包含 12 项法定深度比拼指标');
  console.log(`  ✓ [H27 PASS] 双城竞技场成功输出 12 项法定条款纵深比拼矩阵 (北京 vs 上海)`);
  passCount++;

  console.log(`\n=========================================`);
  console.log(`🎉 全国已录入统筹区全部通过校验！共执行 ${totalChecks} 项严谨核验，成功率 100%`);
  console.log(`=========================================\n`);
}





