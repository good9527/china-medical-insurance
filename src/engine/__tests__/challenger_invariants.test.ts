import { calculateReimbursement } from '../calculator';
import { allCities } from '../../data';
import type { CityInsuranceData, CalculateRequest, HospitalTier } from '../../data/types';

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
  // TEST SUITE 2: Nationwide 348 Cities Deep Financial Invariant Conservation
  // --------------------------------------------------------------------------
  console.log(`--- Suite 2: Nationwide 348 Cities Invariant Sweep (${allCities.length} cities loaded) ---`);
  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses: RemoteStatus[] = ['local', 'transfer', 'unfiled_normal'];
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

                // 3. Non-negativity & Bounds
                assert(b.totalReimbursed >= 0, `Negative totalReimbursed: ${b.totalReimbursed}`);
                assert(b.personalPayTotal >= 0, `Negative personalPayTotal: ${b.personalPayTotal}`);
                assert(b.totalReimbursed <= exp.total + 0.001, `Reimbursement exceeds cost in ${city.cityName}`);

                // 4. Zero cost check
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
  console.log(`✓ Suite 2 Passed: Verified all 348 cities across all tiers, statuses, costs, and insurance types.\n`);

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
      isRetiree: true
    });
    const b = res.breakdown;
    const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
    assert(Math.abs(sum - c) <= 0.01, `Extreme cost conservation failed at ${c}`);
    assert(b.totalReimbursed <= c, `Extreme cost reimbursement exceeded total`);
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
    isRetiree: false
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
    isRetiree: false
  });
  assert(corruptClassB.breakdown.eligibleCost >= 0, 'Eligible cost must be non-negative');
  const sumCorrupt = Math.round((corruptClassB.breakdown.totalReimbursed + corruptClassB.breakdown.personalPayTotal) * 100) / 100;
  assert(Math.abs(sumCorrupt - 1000) <= 0.01, 'Conservation must hold under corrupt class B');

  console.log('✓ Suite 3 Passed: Extreme value probing and fault injection handled with 100% stability.\n');

  console.log('================================================================================');
  console.log(`[PASS] ALL CHALLENGER INVARIANT TESTS PASSED! (${checks} total checks executed)`);
  console.log('================================================================================\n');

  return { totalChecks: checks, passed: true };
}
