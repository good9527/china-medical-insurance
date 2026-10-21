import { calculateReimbursement } from '../calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../simulator';
import { allCities } from '../../data';
import type { CityInsuranceData, CalculateRequest, HospitalTier, ComparisonScenarioInput } from '../../data/types';

type RemoteStatus = CalculateRequest['remoteStatus'];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[CHALLENGER FAILURE] ${message}`);
  }
}

export function runChallengerInvariantTests(): { totalChecks: number; passed: boolean } {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER INVARIANT & STRESS HARNESS] Starting Empirical Validation <<<');
  console.log('================================================================================\n');

  let checks = 0;

  // --------------------------------------------------------------------------
  // TEST SUITE 1: Deep Boundary & retiree annualCap Matrix (Defined vs Undefined vs Mock)
  // --------------------------------------------------------------------------
  console.log('--- Suite 1: Inpatient Retiree Annual Cap & Boundary Analysis ---');

  // Create a controlled mock city to test all permutations of annualCapRetiree
  const baseMockCity: CityInsuranceData = {
    cityCode: '888001',
    cityName: '测算特区市',
    provinceCode: '880000',
    provinceName: '测试省',
    hotline: '12393',
    officialPortalUrl: 'http://ybj.test.gov.cn',
    sourceDocs: [
      {
        docId: 'mock-doc-001',
        title: '关于印发测算特区市基本医疗保险办法的通知',
        docNumber: '测医保发〔2026〕1号',
        issuingDept: ['测算特区市医疗保障局'],
        publishDate: '2026-01-01',
        effectiveDate: '2026-01-01',
        status: 'active',
        officialUrl: 'http://ybj.test.gov.cn/doc1',
        summaryQuote: '职工住院在职封顶20万，退休人员封顶30万'
      }
    ],
    employee: {
      outpatient: {
        annualDeductible: 500,
        annualDeductibleRetiree: 300,
        annualCap: 5000,
        annualCapRetiree: 7000,
        deductibleType: 'annual',
        sourceDocId: 'mock-doc-001',
        tierBenefits: {
          community: { tierName: '社区卫生服务中心', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
          tier1: { tierName: '一级医院', deductible: 300, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
          tier2: { tierName: '二级医院', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
          tier3: { tierName: '三级医院', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
          tier3_top: { tierName: '三甲医院', deductible: 1000, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
        }
      },
      inpatient: {
        annualCap: 200000,
        annualCapRetiree: 300000,
        sourceDocId: 'mock-doc-001',
        tierBenefits: {
          community: { tierName: '基层社区卫生服务中心', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
          tier1: { tierName: '一级定点医院', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
          tier2: { tierName: '二级定点医院', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
          tier3: { tierName: '三级定点医院', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
          tier3_top: { tierName: '三甲顶尖医院', deductible: 1500, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
        }
      },
      catastrophic: {
        name: '职工大额医疗互助',
        deductible: 0,
        tiers: [{ minAmount: 0, ratio: 0.95 }]
      },
      remoteMedical: {
        sourceDocId: 'mock-doc-001',
        filingChannels: ['国家医保服务平台'],
        longTermFiledRatio: 1.0,
        transferFiledRatio: 0.9,
        unfiledEmergencyRatio: 0.8,
        unfiledNormalRatio: 0.7,
        specialNotes: ['无']
      }
    },
    resident: {
      outpatient: {
        annualDeductible: 0,
        annualCap: 500,
        deductibleType: 'annual',
        sourceDocId: 'mock-doc-001',
        tierBenefits: {
          community: { tierName: '基层卫生机构', deductible: 0, reimbursementRatio: 0.60 },
          tier1: { tierName: '一级医院', deductible: 0, reimbursementRatio: 0.50 },
          tier2: { tierName: '二级医院', deductible: 0, reimbursementRatio: 0 },
          tier3: { tierName: '三级医院', deductible: 0, reimbursementRatio: 0 },
          tier3_top: { tierName: '三甲医院', deductible: 0, reimbursementRatio: 0 }
        }
      },
      inpatient: {
        annualCap: 150000,
        sourceDocId: 'mock-doc-001',
        tierBenefits: {
          community: { tierName: '基层卫生院', deductible: 200, reimbursementRatio: 0.85 },
          tier1: { tierName: '一级医院', deductible: 400, reimbursementRatio: 0.80 },
          tier2: { tierName: '二级医院', deductible: 700, reimbursementRatio: 0.70 },
          tier3: { tierName: '三级医院', deductible: 1200, reimbursementRatio: 0.60 },
          tier3_top: { tierName: '三甲医院', deductible: 1500, reimbursementRatio: 0.55 }
        }
      },
      catastrophic: {
        name: '城乡居民大病保险',
        deductible: 10000,
        annualCap: 300000,
        tiers: [
          { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
          { minAmount: 100000, maxAmount: 200000, ratio: 0.70 },
          { minAmount: 200000, ratio: 0.80 }
        ]
      },
      remoteMedical: {
        sourceDocId: 'mock-doc-001',
        filingChannels: ['国家医保服务平台'],
        longTermFiledRatio: 1.0,
        transferFiledRatio: 0.85,
        unfiledEmergencyRatio: 0.75,
        unfiledNormalRatio: 0.60,
        specialNotes: ['无']
      }
    }
  };

  // 1.1 Test Defined annualCapRetiree
  const testPoints = [
    { cost: 0, desc: 'Zero Cost' },
    { cost: 0.01, desc: 'Sub-cent Cost' },
    { cost: 500, desc: 'Below Deductible (1200)' },
    { cost: 1200, desc: 'Exact Deductible' },
    { cost: 1200.01, desc: 'Just Above Deductible' },
    { cost: 50000, desc: 'Mid Tier Cost' },
    { cost: 236470.59, desc: 'Around Active Hit Cap ((200000/0.85)+1200)' },
    { cost: 280000, desc: 'Between Active Cap (200k) and Retiree Cap (300k)' },
    { cost: 354117.65, desc: 'Around Retiree Hit Cap ((300000/0.88)+1200)' },
    { cost: 500000, desc: 'Both Capped' },
    { cost: 10000000, desc: 'Extreme 10 Million RMB' }
  ];

  for (const tp of testPoints) {
    for (const isRet of [false, true]) {
      checks++;
      const res = calculateReimbursement({
        cityCode: '888001',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: tp.cost,
        isRetiree: isRet
      }, baseMockCity);

      const b = res.breakdown;
      // Invariant: Conservation
      const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
      assert(Math.abs(sum - tp.cost) <= 0.01, `Suite 1 Conservation fail: cost=${tp.cost}, sum=${sum}`);

      // Invariant: Subcomponents
      const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
      assert(Math.abs(compSum - b.totalReimbursed) <= 0.01, `Suite 1 Subcomponent mismatch: ${compSum} != ${b.totalReimbursed}`);

      // Specific Cap checks:
      if (!isRet) {
        assert(b.baseReimbursed <= 200000, `Active baseReimbursed ${b.baseReimbursed} exceeded annualCap 200000`);
      } else {
        assert(b.baseReimbursed <= 300000, `Retiree baseReimbursed ${b.baseReimbursed} exceeded annualCapRetiree 300000`);
      }

      if (tp.cost === 0) {
        assert(b.totalReimbursed === 0 && b.personalPayTotal === 0, `Zero cost did not yield zero reimbursement: ${b.totalReimbursed}`);
      }

      if (tp.cost <= 1200) {
        assert(b.baseReimbursed === 0, `Cost <= deductible did not yield zero base reimbursement: ${b.baseReimbursed}`);
      }
    }
  }

  // 1.2 Undefined annualCapRetiree Fallback verification
  const undefinedRetCity: CityInsuranceData = JSON.parse(JSON.stringify(baseMockCity));
  delete undefinedRetCity.employee.inpatient.annualCapRetiree;

  for (const tp of testPoints) {
    checks++;
    const resActive = calculateReimbursement({
      cityCode: '888001',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: tp.cost,
      isRetiree: false
    }, undefinedRetCity);

    const resRetiree = calculateReimbursement({
      cityCode: '888001',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: tp.cost,
      isRetiree: true
    }, undefinedRetCity);

    // Both should be capped at 200,000 max base
    assert(resActive.breakdown.baseReimbursed <= 200000, `Fallback active exceeded 200k`);
    assert(resRetiree.breakdown.baseReimbursed <= 200000, `Fallback retiree exceeded 200k`);

    // Invariant conservation
    const sumActive = Math.round((resActive.breakdown.totalReimbursed + resActive.breakdown.personalPayTotal) * 100) / 100;
    const sumRetiree = Math.round((resRetiree.breakdown.totalReimbursed + resRetiree.breakdown.personalPayTotal) * 100) / 100;
    assert(Math.abs(sumActive - tp.cost) <= 0.01, `Active fallback conservation failed`);
    assert(Math.abs(sumRetiree - tp.cost) <= 0.01, `Retiree fallback conservation failed`);
  }
  console.log('✓ Suite 1 Passed: Inpatient retiree annual cap and fallback verified 100%.\n');

  // --------------------------------------------------------------------------
  // TEST SUITE 2: Nationwide 348 Cities Deep Financial Invariant Conservation & 5-Stage Funnel
  // --------------------------------------------------------------------------
  console.log(`--- Suite 2: Nationwide 348 Cities Invariant Sweep (${allCities.length} cities loaded) ---`);
  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const testExpenses = [
    { total: 0, nonIns: 0, classB: 0 },
    { total: 0.01, nonIns: 0, classB: 0 },
    { total: 100, nonIns: 10, classB: 10 },
    { total: 500, nonIns: 50, classB: 100 },
    { total: 1200, nonIns: 100, classB: 200 },
    { total: 20000, nonIns: 2000, classB: 3000 },
    { total: 150000, nonIns: 15000, classB: 20000 },
    { total: 500000, nonIns: 50000, classB: 80000 },
    { total: 10000000, nonIns: 500000, classB: 1000000 }
  ];

  for (const city of allCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      for (const treatmentType of ['outpatient', 'inpatient'] as const) {
        for (const isRetiree of [false, true]) {
          // Skip resident retiree (retiree only applies to employee)
          if (insuranceType === 'resident' && isRetiree) continue;

          for (const tier of tiers) {
            for (const remoteStatus of remoteStatuses) {
              for (const exp of testExpenses) {
                checks++;
                const res = calculateReimbursement({
                  cityCode: city.cityCode,
                  insuranceType,
                  treatmentType,
                  hospitalTier: tier,
                  remoteStatus,
                  totalCost: exp.total,
                  nonInsuranceCost: exp.nonIns,
                  classBCost: exp.classB,
                  isRetiree
                });

                const b = res.breakdown;

                // 1. Total conservation: reimbursed + personalPay === totalCost
                const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
                assert(Math.abs(sum - exp.total) <= 0.01, `Conservation breach in ${city.cityName}: total=${exp.total}, sum=${sum}`);

                // 2. Subcomponent sum: base + catastrophic === totalReimbursed
                const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
                assert(Math.abs(compSum - b.totalReimbursed) <= 0.01, `Subcomponent breach in ${city.cityName}: compSum=${compSum}, total=${b.totalReimbursed}`);

                // 3. 5-Stage Stepped Funnel Physical Conservation:
                // totalCost === nonInsuranceCost + classBSelfPay + deductibleDeducted + totalReimbursed + personalSpanCoPay
                if (b.personalPayTotal >= (b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted - 0.01)) {
                  const funnelSum = Math.round((b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted + b.totalReimbursed + b.personalSpanCoPay) * 100) / 100;
                  assert(Math.abs(funnelSum - exp.total) <= 0.01, `Funnel ladder breach in ${city.cityName}: total=${exp.total}, funnelSum=${funnelSum}`);
                }

                // 4. Non-negativity & Bounds
                assert(b.totalReimbursed >= 0, `Negative totalReimbursed: ${b.totalReimbursed}`);
                assert(b.personalPayTotal >= 0, `Negative personalPayTotal: ${b.personalPayTotal}`);
                assert(b.totalReimbursed <= exp.total + 0.001, `Reimbursement exceeds cost in ${city.cityName}`);

                // 5. Zero cost check
                if (exp.total === 0) {
                  assert(b.totalReimbursed === 0, `Non-zero reimbursement on zero cost in ${city.cityName}`);
                  assert(b.personalPayTotal === 0, `Non-zero personal pay on zero cost in ${city.cityName}`);
                }
              }
            }
          }
        }
      }
    }
  }
  console.log(`✓ Suite 2 Passed: Verified all 348 cities across all tiers, 5 remote statuses, 5-stage funnel, and costs.\n`);

  // --------------------------------------------------------------------------
  // TEST SUITE 3: Adversarial Extreme Value & Fault Injection Probing
  // --------------------------------------------------------------------------
  console.log('--- Suite 3: Adversarial Extreme Value & Fault Injection Probing ---');

  // Test 3.1: Huge Cost 50 Million & 100 Million
  const extremeCosts = [50000000, 100000000];
  for (const c of extremeCosts) {
    checks++;
    const res = calculateReimbursement({
      cityCode: '610100', // 西安市
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: c,
      isRetiree: true,
      hospitalizationCount: 2
    });
    const b = res.breakdown;
    const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
    assert(Math.abs(sum - c) <= 0.01, `Extreme cost conservation failed at ${c}`);
    assert(b.totalReimbursed <= c, `Extreme cost reimbursement exceeded total`);
    const funnelSum = Math.round((b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted + b.totalReimbursed + b.personalSpanCoPay) * 100) / 100;
    assert(Math.abs(funnelSum - c) <= 0.01, `Extreme cost funnel conservation failed at ${c}`);
  }

  // Test 3.2: Non-Insurance Cost exceeding Total Cost (Malicious / Corrupt input)
  checks++;
  const corruptRes = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000,
    nonInsuranceCost: 2000, // exceeds totalCost
    isRetiree: false,
    hospitalizationCount: 3
  });
  assert(corruptRes.breakdown.eligibleCost === 0, 'Eligible cost must floor at 0');
  assert(corruptRes.breakdown.totalReimbursed === 0, 'Reimbursement must be 0 when eligible cost is 0');
  assert(corruptRes.breakdown.personalPayTotal === 1000, 'Personal pay must equal totalCost 1000');

  // Test 3.3: Class B cost exceeding Total Cost
  checks++;
  const corruptClassB = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000,
    classBCost: 5000,
    classBSelfPayRatio: 0.1,
    isRetiree: false,
    hospitalizationCount: 2
  });
  assert(corruptClassB.breakdown.eligibleCost >= 0, 'Eligible cost must be non-negative');
  const sumCorrupt = Math.round((corruptClassB.breakdown.totalReimbursed + corruptClassB.breakdown.personalPayTotal) * 100) / 100;
  assert(Math.abs(sumCorrupt - 1000) <= 0.01, 'Conservation must hold under corrupt class B');

  console.log('✓ Suite 3 Passed: Extreme value probing and fault injection handled with 100% stability.\n');

  // --------------------------------------------------------------------------
  // TEST SUITE 4: Admission Frequency (1, 2, 3), 5-Stage Funnel & Monotonic Deductible Invariants
  // --------------------------------------------------------------------------
  console.log('--- Suite 4: Inpatient Frequency (1, 2, 3) & Monotonic Deductible Ordering Invariants ---');

  const checkTiers: HospitalTier[] = ['community', 'tier2', 'tier3'];
  const checkCosts = [5000, 50000];

  for (const city of allCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      for (const tier of checkTiers) {
        for (const remoteStatus of remoteStatuses) {
          for (const cost of checkCosts) {
            // Run hospitalizationCount 1, 2, 3
            checks++;
            const r1 = calculateReimbursement({
              cityCode: city.cityCode,
              insuranceType,
              treatmentType: 'inpatient',
              hospitalTier: tier,
              remoteStatus,
              totalCost: cost,
              nonInsuranceCost: Math.round(cost * 0.05 * 100) / 100,
              classBCost: Math.round(cost * 0.10 * 100) / 100,
              hospitalizationCount: 1
            });

            const r2 = calculateReimbursement({
              cityCode: city.cityCode,
              insuranceType,
              treatmentType: 'inpatient',
              hospitalTier: tier,
              remoteStatus,
              totalCost: cost,
              nonInsuranceCost: Math.round(cost * 0.05 * 100) / 100,
              classBCost: Math.round(cost * 0.10 * 100) / 100,
              hospitalizationCount: 2
            });

            const r3 = calculateReimbursement({
              cityCode: city.cityCode,
              insuranceType,
              treatmentType: 'inpatient',
              hospitalTier: tier,
              remoteStatus,
              totalCost: cost,
              nonInsuranceCost: Math.round(cost * 0.05 * 100) / 100,
              classBCost: Math.round(cost * 0.10 * 100) / 100,
              hospitalizationCount: 3
            });

            const b1 = r1.breakdown;
            const b2 = r2.breakdown;
            const b3 = r3.breakdown;

            // Invariant 1: Physical Conservation across all admission counts
            const sum1 = Math.round((b1.totalReimbursed + b1.personalPayTotal) * 100) / 100;
            const sum2 = Math.round((b2.totalReimbursed + b2.personalPayTotal) * 100) / 100;
            const sum3 = Math.round((b3.totalReimbursed + b3.personalPayTotal) * 100) / 100;
            assert(Math.abs(sum1 - cost) <= 0.01, `Suite 4 Conservation 1 failed in ${city.cityName}`);
            assert(Math.abs(sum2 - cost) <= 0.01, `Suite 4 Conservation 2 failed in ${city.cityName}`);
            assert(Math.abs(sum3 - cost) <= 0.01, `Suite 4 Conservation 3 failed in ${city.cityName}`);

            // Invariant 2: 5-Stage Stepped Funnel Conservation across all counts
            const f1 = Math.round((b1.nonInsuranceCost + b1.classBPriorPay + b1.deductibleDeducted + b1.totalReimbursed + b1.personalSpanCoPay) * 100) / 100;
            const f2 = Math.round((b2.nonInsuranceCost + b2.classBPriorPay + b2.deductibleDeducted + b2.totalReimbursed + b2.personalSpanCoPay) * 100) / 100;
            const f3 = Math.round((b3.nonInsuranceCost + b3.classBPriorPay + b3.deductibleDeducted + b3.totalReimbursed + b3.personalSpanCoPay) * 100) / 100;
            assert(Math.abs(f1 - cost) <= 0.01, `Suite 4 Funnel 1 failed in ${city.cityName}`);
            assert(Math.abs(f2 - cost) <= 0.01, `Suite 4 Funnel 2 failed in ${city.cityName}`);
            assert(Math.abs(f3 - cost) <= 0.01, `Suite 4 Funnel 3 failed in ${city.cityName}`);

            // Invariant 3: Monotonic Deductible Ordering
            // When deductible decays: appliedDeductible(1) >= appliedDeductible(2) >= appliedDeductible(3)
            assert(b1.appliedDeductible >= b2.appliedDeductible, `Deductible ordering breach (1 vs 2) in ${city.cityName}`);
            assert(b2.appliedDeductible >= b3.appliedDeductible, `Deductible ordering breach (2 vs 3) in ${city.cityName}`);
            assert(b1.deductibleReduction <= b2.deductibleReduction, `Reduction ordering breach (1 vs 2) in ${city.cityName}`);
            assert(b2.deductibleReduction <= b3.deductibleReduction, `Reduction ordering breach (2 vs 3) in ${city.cityName}`);

            // Base fund reimbursement must be monotonically non-decreasing as deductible decays:
            assert(b1.baseReimbursed <= b2.baseReimbursed + 0.01, `Base reimbursement monotonicity breach (1 vs 2) in ${city.cityName}`);
            assert(b2.baseReimbursed <= b3.baseReimbursed + 0.01, `Base reimbursement monotonicity breach (2 vs 3) in ${city.cityName}`);

            // Under local medical care, patient personal pay must be monotonically non-increasing:
            // personalPayTotal(1) >= personalPayTotal(2) >= personalPayTotal(3)
            if (remoteStatus === 'local' || remoteStatus === 'long_term') {
              assert(b1.personalPayTotal >= b2.personalPayTotal - 0.01, `Personal pay monotonicity breach (1 vs 2) in ${city.cityName}: ${b1.personalPayTotal} < ${b2.personalPayTotal}`);
              assert(b2.personalPayTotal >= b3.personalPayTotal - 0.01, `Personal pay monotonicity breach (2 vs 3) in ${city.cityName}: ${b2.personalPayTotal} < ${b3.personalPayTotal}`);
              assert(b1.totalReimbursed <= b2.totalReimbursed + 0.01, `Total reimbursement monotonicity breach (1 vs 2) in ${city.cityName}`);
              assert(b2.totalReimbursed <= b3.totalReimbursed + 0.01, `Total reimbursement monotonicity breach (2 vs 3) in ${city.cityName}`);
            }
          }
        }
      }
    }
  }
  console.log('✓ Suite 4 Passed: 348 cities verified across hospitalization counts (1, 2, 3), 5-stage funnel, and monotonic ordering.\n');

  // --------------------------------------------------------------------------
  // TEST SUITE 5: 跨城待遇实测对比模拟器对抗不变量检验 (Multi-City Actuarial Simulation Invariants)
  // --------------------------------------------------------------------------
  console.log('--- Suite 5: 跨城待遇实测对比模拟器对抗不变量检验 ---');

  // 1. 跨城对比样本集构建 (Sample hundreds of multi-city pairs and triplets across 348 regions)
  const sampledCitySets: Array<{ label: string; cities: string[] }> = [];

  // 1.1 加入全部 9 组经典预设组合 (2~3 城)
  for (const preset of popularMultiCityPresets) {
    // 兼容重庆直辖市编码 500000 -> 500100 映射
    const validCities = preset.cities.map(c => c === '500000' ? '500100' : c);
    sampledCitySets.push({ label: `Preset-${preset.name}`, cities: validCities });
  }

  // 1.2 全量 348 统筹区相邻滑动窗口配对 (Adjacent pairs across all 348 cities: exactly 348 pairs)
  for (let i = 0; i < allCities.length; i++) {
    const c1 = allCities[i].cityCode;
    const c2 = allCities[(i + 1) % allCities.length].cityCode;
    sampledCitySets.push({
      label: `AdjacentPair-${allCities[i].cityName}-${allCities[(i + 1) % allCities.length].cityName}`,
      cities: [c1, c2]
    });
  }

  // 1.3 跨省跨地理大区跨度配对 (Strided cross-province pairs: ~70 pairs)
  for (let i = 0; i < allCities.length; i += 5) {
    const c1 = allCities[i].cityCode;
    const c2 = allCities[(i + 137) % allCities.length].cityCode;
    sampledCitySets.push({
      label: `StridePair-${allCities[i].cityName}-${allCities[(i + 137) % allCities.length].cityName}`,
      cities: [c1, c2]
    });
  }

  // 1.4 跨三大经济带三城组合 (Triplets across Eastern, Central, and Western regions: ~50 triplets)
  for (let i = 0; i < allCities.length; i += 7) {
    const c1 = allCities[i].cityCode;
    const c2 = allCities[(i + 47) % allCities.length].cityCode;
    const c3 = allCities[(i + 113) % allCities.length].cityCode;
    sampledCitySets.push({
      label: `Triplet-${allCities[i].cityName}-${allCities[(i + 47) % allCities.length].cityName}-${allCities[(i + 113) % allCities.length].cityName}`,
      cities: [c1, c2, c3]
    });
  }

  console.log(`[Suite 5.1] Total multi-city sets sampled across 348 regions: ${sampledCitySets.length}`);

  // 5.1 全样本全量检验 (Standard Scenarios across hundreds of multi-city sets)
  const standardScenarios: ComparisonScenarioInput[] = [
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 60000,
      nonInsuranceCost: 6000,
      classBCost: 9000,
      hospitalizationCount: 1
    },
    {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'transfer',
      totalCost: 120000,
      nonInsuranceCost: 15000,
      classBCost: 20000,
      hospitalizationCount: 2
    },
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 8000,
      nonInsuranceCost: 500,
      classBCost: 800,
      hospitalizationCount: 1
    },
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier1',
      remoteStatus: 'local',
      totalCost: 3500,
      nonInsuranceCost: 200,
      classBCost: 300
    }
  ];

  for (const set of sampledCitySets) {
    for (const sc of standardScenarios) {
      checks++;
      const result = runMultiCitySimulation(set.cities, sc);

      // Invariant 1: Physical Fund Conservation: R_i + P_i === C_total (allConserved === true)
      assert(result.allConserved === true, `[Suite 5 Invariant 1] allConserved is false for ${set.label}`);

      const maxR = Math.max(...result.cities.map(c => c.totalReimbursed));
      const minP = Math.min(...result.cities.map(c => c.personalPayTotal));
      const minDed = Math.min(...result.cities.map(c => c.deductibleDeducted));
      const maxCat = Math.max(...result.cities.map(c => c.catastrophicReimbursed));

      const baseline = result.cities[0];

      for (let idx = 0; idx < result.cities.length; idx++) {
        const o = result.cities[idx];

        // Invariant 1 (per-city):
        assert(o.isConserved === true, `[Suite 5 Invariant 1] City ${o.cityName} isConserved false in ${set.label}`);
        const citySum = Math.round((o.totalReimbursed + o.personalPayTotal) * 100) / 100;
        assert(Math.abs(citySum - sc.totalCost) <= 0.01, `[Suite 5 Invariant 1] R + P != C in ${o.cityName}: ${citySum} != ${sc.totalCost}`);
        assert(o.totalReimbursed >= 0, `[Suite 5 Invariant 1] Negative totalReimbursed in ${o.cityName}`);
        assert(o.personalPayTotal >= 0, `[Suite 5 Invariant 1] Negative personalPayTotal in ${o.cityName}`);
        assert(o.totalReimbursed <= sc.totalCost + 0.01, `[Suite 5 Invariant 1] Reimbursed exceeds cost in ${o.cityName}`);

        // Subcomponents conservation: base + catastrophic === totalReimbursed
        const subSum = Math.round((o.baseReimbursed + o.catastrophicReimbursed) * 100) / 100;
        assert(Math.abs(subSum - o.totalReimbursed) <= 0.01, `[Suite 5 Subcomponent] Base + Cat != Total in ${o.cityName}`);

        // Invariant 2: Baseline Delta Antisymmetry: deltaR_i === -deltaP_i (deltaR_i + deltaP_i = 0)
        const expectedDeltaR = Math.round((o.totalReimbursed - baseline.totalReimbursed) * 100) / 100;
        const expectedDeltaP = Math.round((o.personalPayTotal - baseline.personalPayTotal) * 100) / 100;
        assert(Math.abs(o.deltaReimbursedVsCityA - expectedDeltaR) <= 0.01, `[Suite 5 Invariant 2] deltaReimbursed mismatch in ${o.cityName}`);
        assert(Math.abs(o.deltaPersonalPayVsCityA - expectedDeltaP) <= 0.01, `[Suite 5 Invariant 2] deltaPersonalPay mismatch in ${o.cityName}`);
        const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
        assert(Math.abs(deltaSum) <= 0.02, `[Suite 5 Invariant 2] Delta antisymmetry failed: deltaR + deltaP != 0 in ${o.cityName} (${o.deltaReimbursedVsCityA} + ${o.deltaPersonalPayVsCityA} = ${deltaSum})`);

        if (idx === 0) {
          assert(o.deltaReimbursedVsCityA === 0, `[Suite 5 Invariant 2] Baseline deltaR != 0`);
          assert(o.deltaPersonalPayVsCityA === 0, `[Suite 5 Invariant 2] Baseline deltaP != 0`);
        }

        // Invariant 4: Winner determinism and tie-resilience
        assert(o.isWinnerReimbursed === (o.totalReimbursed === maxR), `[Suite 5 Invariant 4] Winner reimbursed flag mismatch in ${o.cityName}`);
        assert(o.isWinnerLowestOutPocket === (o.personalPayTotal === minP), `[Suite 5 Invariant 4] Winner lowest out pocket mismatch in ${o.cityName}`);
        assert(o.isWinnerLowestDeductible === (o.deductibleDeducted === minDed), `[Suite 5 Invariant 4] Winner lowest deductible mismatch in ${o.cityName}`);
        assert(o.isWinnerHighestCatastrophic === (maxCat > 0 && o.catastrophicReimbursed === maxCat), `[Suite 5 Invariant 4] Winner catastrophic mismatch in ${o.cityName}`);
      }

      // Invariant 3: Max Spread Equality: Spread_R === Spread_P
      const actualSpreadR = Math.round((maxR - Math.min(...result.cities.map(c => c.totalReimbursed))) * 100) / 100;
      const actualSpreadP = Math.round((Math.max(...result.cities.map(c => c.personalPayTotal)) - minP) * 100) / 100;
      assert(Math.abs(result.maxReimbursementDelta - actualSpreadR) <= 0.01, `[Suite 5 Invariant 3] maxReimbursementDelta mismatch`);
      assert(Math.abs(result.maxPersonalPayDelta - actualSpreadP) <= 0.01, `[Suite 5 Invariant 3] maxPersonalPayDelta mismatch`);
      assert(Math.abs(result.maxReimbursementDelta - result.maxPersonalPayDelta) <= 0.02, `[Suite 5 Invariant 3] Spread_R != Spread_P: ${result.maxReimbursementDelta} != ${result.maxPersonalPayDelta}`);

      // Winner string formatting checks
      const winnersR = result.cities.filter(c => c.isWinnerReimbursed);
      for (const w of winnersR) {
        assert(result.winnerReimbursedCity.includes(w.cityName), `[Suite 5 Invariant 4] winnerReimbursedCity missing ${w.cityName}`);
      }
      if (winnersR.length > 1) {
        assert(result.winnerReimbursedCity.includes('(并列)'), `[Suite 5 Invariant 4] Tie winner missing '(并列)'`);
      } else {
        assert(!result.winnerReimbursedCity.includes('(并列)'), `[Suite 5 Invariant 4] Single winner tagged '(并列)'`);
      }

      // Key Insights check
      assert(result.keyInsights.length >= 2, `[Suite 5 Insights] Key insights too short: ${result.keyInsights.length}`);
    }
  }

  // 5.2 对抗极限边界压力检验 (Invariant 5: Boundary Stress)
  console.log('--- Suite 5.2: 对抗极限边界压力与极端场景检验 ---');

  const boundarySets = [
    { label: 'Presets-京陕深', cities: ['110100', '610100', '440300'] },
    { label: 'Presets-沪蓉', cities: ['310100', '510100'] },
    { label: 'Presets-陕北陕中', cities: ['610200', '610600'] },
    { label: 'Presets-成渝陕', cities: ['610100', '510100', '500100'] },
    { label: 'Presets-长三角', cities: ['330100', '320100', '310100'] },
    { label: 'Presets-大湾区', cities: ['440100', '440300', '440400'] },
    { label: 'Cross-哈尔滨三亚', cities: ['230100', '460200'] },
    { label: 'Cross-上海乌鲁木齐拉萨', cities: ['310100', '650100', '540100'] }
  ];

  // 5.2.1 Boundary: Zero Cost (¥0)
  for (const bSet of boundarySets) {
    checks++;
    const res0 = runMultiCitySimulation(bSet.cities, {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 0
    });
    assert(res0.allConserved === true, `[Suite 5 Boundary 0] allConserved failed`);
    assert(res0.maxReimbursementDelta === 0, `[Suite 5 Boundary 0] maxReimbursementDelta != 0`);
    assert(res0.maxPersonalPayDelta === 0, `[Suite 5 Boundary 0] maxPersonalPayDelta != 0`);
    assert(res0.winnerHighestCatastrophicCity.includes('未触发大病报销'), `[Suite 5 Boundary 0] Catastrophic winner expected none`);
    for (const c of res0.cities) {
      assert(c.totalReimbursed === 0, `[Suite 5 Boundary 0] totalReimbursed != 0`);
      assert(c.personalPayTotal === 0, `[Suite 5 Boundary 0] personalPayTotal != 0`);
      assert(c.isWinnerReimbursed === true, `[Suite 5 Boundary 0] isWinnerReimbursed should be true in tie`);
      assert(c.isWinnerLowestOutPocket === true, `[Suite 5 Boundary 0] isWinnerLowestOutPocket should be true in tie`);
      assert(c.deltaReimbursedVsCityA === 0, `[Suite 5 Boundary 0] deltaReimbursedVsCityA != 0`);
      assert(c.deltaPersonalPayVsCityA === 0, `[Suite 5 Boundary 0] deltaPersonalPayVsCityA != 0`);
    }
  }

  // 5.2.2 Boundary: Micro Cost (¥0.01)
  for (const bSet of boundarySets) {
    checks++;
    const resMicro = runMultiCitySimulation(bSet.cities, {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 0.01
    });
    assert(resMicro.allConserved === true, `[Suite 5 Boundary 0.01] allConserved failed`);
    assert(Math.abs(resMicro.maxReimbursementDelta - resMicro.maxPersonalPayDelta) <= 0.02, `[Suite 5 Boundary 0.01] Spread mismatch`);
    for (const c of resMicro.cities) {
      const sum = Math.round((c.totalReimbursed + c.personalPayTotal) * 100) / 100;
      assert(Math.abs(sum - 0.01) <= 0.001, `[Suite 5 Boundary 0.01] Sum != 0.01: ${sum}`);
      assert(Math.abs(c.deltaReimbursedVsCityA + c.deltaPersonalPayVsCityA) <= 0.02, `[Suite 5 Boundary 0.01] Delta antisymmetry failed`);
    }
  }

  // 5.2.3 Boundary: Extreme Cost (¥50,000,000)
  for (const bSet of boundarySets) {
    checks++;
    const res50M = runMultiCitySimulation(bSet.cities, {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: 50000000,
      nonInsuranceCost: 2000000,
      classBCost: 3000000,
      hospitalizationCount: 1
    });
    assert(res50M.allConserved === true, `[Suite 5 Boundary 50M] allConserved failed in ${bSet.label}`);
    assert(Math.abs(res50M.maxReimbursementDelta - res50M.maxPersonalPayDelta) <= 0.02, `[Suite 5 Boundary 50M] Spread_R != Spread_P`);
    assert(res50M.winnerHighestCatastrophicCity !== '无 (未触发大病报销)', `[Suite 5 Boundary 50M] Expected catastrophic reimbursement at 50M`);
    for (const c of res50M.cities) {
      const sum = Math.round((c.totalReimbursed + c.personalPayTotal) * 100) / 100;
      assert(Math.abs(sum - 50000000) <= 0.02, `[Suite 5 Boundary 50M] Conservation failed in ${c.cityName}`);
      assert(c.catastrophicReimbursed > 0, `[Suite 5 Boundary 50M] Catastrophic should be > 0 at 50M in ${c.cityName}`);
      assert(Math.abs(c.deltaReimbursedVsCityA + c.deltaPersonalPayVsCityA) <= 0.02, `[Suite 5 Boundary 50M] Delta antisymmetry failed in ${c.cityName}`);
    }
  }

  // 5.2.4 Boundary: Admission Frequency (1, 2, 3 Hospitalizations)
  for (const bSet of boundarySets) {
    checks++;
    const rCount1 = runMultiCitySimulation(bSet.cities, {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 30000,
      hospitalizationCount: 1
    });
    const rCount2 = runMultiCitySimulation(bSet.cities, {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 30000,
      hospitalizationCount: 2
    });
    const rCount3 = runMultiCitySimulation(bSet.cities, {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 30000,
      hospitalizationCount: 3
    });

    assert(rCount1.allConserved && rCount2.allConserved && rCount3.allConserved, `[Suite 5 Hospitalization Count] Conservation failed`);
    assert(Math.abs(rCount3.maxReimbursementDelta - rCount3.maxPersonalPayDelta) <= 0.02, `[Suite 5 Count 3] Spread mismatch`);

    for (let i = 0; i < bSet.cities.length; i++) {
      const c1 = rCount1.cities[i];
      const c2 = rCount2.cities[i];
      const c3 = rCount3.cities[i];

      // Repeated deductible reduction ordering
      assert(c1.deductibleReduction <= c2.deductibleReduction + 0.01, `[Suite 5 Count Monotonicity] dedReduction 1 vs 2 breach in ${c1.cityName}`);
      assert(c2.deductibleReduction <= c3.deductibleReduction + 0.01, `[Suite 5 Count Monotonicity] dedReduction 2 vs 3 breach in ${c1.cityName}`);
      assert(c1.deductibleDeducted >= c2.deductibleDeducted - 0.01, `[Suite 5 Count Monotonicity] dedDeducted 1 vs 2 breach in ${c1.cityName}`);
      assert(c2.deductibleDeducted >= c3.deductibleDeducted - 0.01, `[Suite 5 Count Monotonicity] dedDeducted 2 vs 3 breach in ${c1.cityName}`);
      assert(c1.totalReimbursed <= c2.totalReimbursed + 0.01, `[Suite 5 Count Monotonicity] Reimbursement 1 vs 2 breach in ${c1.cityName}`);
      assert(c2.totalReimbursed <= c3.totalReimbursed + 0.01, `[Suite 5 Count Monotonicity] Reimbursement 2 vs 3 breach in ${c1.cityName}`);
    }
  }

  // 5.2.5 Boundary: All 5 Remote Statuses
  for (const bSet of boundarySets) {
    for (const rem of remoteStatuses) {
      checks++;
      const resRem = runMultiCitySimulation(bSet.cities, {
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: rem,
        totalCost: 45000,
        nonInsuranceCost: 4000,
        classBCost: 5000
      });

      assert(resRem.allConserved === true, `[Suite 5 Remote ${rem}] Conservation failed in ${bSet.label}`);
      assert(Math.abs(resRem.maxReimbursementDelta - resRem.maxPersonalPayDelta) <= 0.02, `[Suite 5 Remote ${rem}] Spread mismatch`);
      for (const c of resRem.cities) {
        const sum = Math.round((c.totalReimbursed + c.personalPayTotal) * 100) / 100;
        assert(Math.abs(sum - 45000) <= 0.01, `[Suite 5 Remote ${rem}] R + P != C in ${c.cityName}`);
        assert(Math.abs(c.deltaReimbursedVsCityA + c.deltaPersonalPayVsCityA) <= 0.02, `[Suite 5 Remote ${rem}] Delta antisymmetry failed in ${c.cityName}`);
      }
    }
  }

  // 5.2.6 Fault Injection & Invalid City Count Testing
  checks++;
  let threwTooFew = false;
  try {
    runMultiCitySimulation(['110100'], {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 1000
    });
  } catch (err: any) {
    threwTooFew = true;
    assert(err.message.includes('仅支持 2~3 个统筹区'), `Unexpected error message for < 2 cities: ${err.message}`);
  }
  assert(threwTooFew, 'Did not throw for 1 city');

  checks++;
  let threwTooMany = false;
  try {
    runMultiCitySimulation(['110100', '310100', '440100', '510100'], {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 1000
    });
  } catch (err: any) {
    threwTooMany = true;
    assert(err.message.includes('仅支持 2~3 个统筹区'), `Unexpected error message for > 3 cities: ${err.message}`);
  }
  assert(threwTooMany, 'Did not throw for 4 cities');

  checks++;
  let threwInvalidCode = false;
  try {
    runMultiCitySimulation(['999999', '110100'], {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 1000
    });
  } catch (err: any) {
    threwInvalidCode = true;
    assert(err.message.includes('未找到统筹区编码'), `Unexpected error message for invalid code: ${err.message}`);
  }
  assert(threwInvalidCode, 'Did not throw for invalid city code');

  console.log('✓ Suite 5 Passed: 跨城待遇实测对比模拟器对抗不变量检验 100% 通过 (全量守恒、差额反对称、极差相等、胜者判定与极端边界).\n');

  console.log('================================================================================');
  console.log(`[PASS] ALL CHALLENGER INVARIANT TESTS PASSED! (${checks} total checks executed)`);
  console.log('================================================================================\n');

  return { totalChecks: checks, passed: true };
}
