import { calculateReimbursement } from '../calculator';
import { shaanxiCities, getCityDataByCode } from '../../data/shaanxi';
import type { HospitalTier, CalculateRequest, CalculateResult } from '../../data/types';

type InsuranceType = CalculateRequest['insuranceType'];
type TreatmentType = CalculateRequest['treatmentType'];
type RemoteStatus = CalculateRequest['remoteStatus'];

function assert(condition: boolean, msg: string): void {
  if (!condition) {
    throw new Error(`[EMPIRICAL CHALLENGER ASSERTION FAILED] ${msg}`);
  }
}

export function runEmpiricalChallengerTests(): { totalChecks: number; passed: boolean } {
  console.log('========================================================================');
  console.log('>>> [EMPIRICAL CHALLENGER] Rigorous Invariant & Boundary Test Suite <<<');
  console.log('========================================================================\n');

  let checks = 0;
  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];

  // --------------------------------------------------------------------------
  // SECTION 1: Policy Metadata & Tier Monotonicity Audit across 11 Cities
  // --------------------------------------------------------------------------
  console.log('--- Section 1: Tier Deductible & Ratio Monotonicity Audit ---');
  for (const city of shaanxiCities) {
    checks++;
    // Inpatient Deductible Monotonicity
    for (const type of ['employee', 'resident'] as const) {
      const pkg = type === 'employee' ? city.employee : city.resident;
      const b = pkg.inpatient.tierBenefits;
      assert(b.community.deductible <= b.tier1.deductible, `${city.cityName} ${type} inpatient: community ded > tier1 ded`);
      assert(b.tier1.deductible <= b.tier2.deductible, `${city.cityName} ${type} inpatient: tier1 ded > tier2 ded`);
      assert(b.tier2.deductible <= b.tier3.deductible, `${city.cityName} ${type} inpatient: tier2 ded > tier3 ded`);
      assert(b.tier3.deductible <= b.tier3_top.deductible, `${city.cityName} ${type} inpatient: tier3 ded > tier3_top ded`);

      // Inpatient Ratio Monotonicity
      assert(b.community.reimbursementRatio >= b.tier1.reimbursementRatio, `${city.cityName} ${type} inpatient: community ratio < tier1 ratio`);
      assert(b.tier1.reimbursementRatio >= b.tier2.reimbursementRatio, `${city.cityName} ${type} inpatient: tier1 ratio < tier2 ratio`);
      assert(b.tier2.reimbursementRatio >= b.tier3.reimbursementRatio, `${city.cityName} ${type} inpatient: tier2 ratio < tier3 ratio`);
      assert(b.tier3.reimbursementRatio >= b.tier3_top.reimbursementRatio, `${city.cityName} ${type} inpatient: tier3 ratio < tier3_top ratio`);
    }

    // Outpatient Ratio Monotonicity
    for (const type of ['employee', 'resident'] as const) {
      const pkg = type === 'employee' ? city.employee : city.resident;
      const ob = pkg.outpatient.tierBenefits;
      assert(ob.community.reimbursementRatio >= ob.tier1.reimbursementRatio, `${city.cityName} ${type} outpatient: community ratio < tier1 ratio`);
      assert(ob.tier1.reimbursementRatio >= ob.tier2.reimbursementRatio, `${city.cityName} ${type} outpatient: tier1 ratio < tier2 ratio`);
      assert(ob.tier2.reimbursementRatio >= ob.tier3.reimbursementRatio, `${city.cityName} ${type} outpatient: tier2 ratio < tier3 ratio`);
      assert(ob.tier3.reimbursementRatio >= ob.tier3_top.reimbursementRatio, `${city.cityName} ${type} outpatient: tier3 ratio < tier3_top ratio`);

      // Outpatient Deductible Monotonicity (where defined)
      const dedComm = ob.community.deductible ?? pkg.outpatient.annualDeductible ?? 0;
      const dedT1 = ob.tier1.deductible ?? pkg.outpatient.annualDeductible ?? 0;
      const dedT2 = ob.tier2.deductible ?? pkg.outpatient.annualDeductible ?? 0;
      const dedT3 = ob.tier3.deductible ?? pkg.outpatient.annualDeductible ?? 0;
      const dedT3Top = ob.tier3_top.deductible ?? pkg.outpatient.annualDeductible ?? 0;
      assert(dedComm <= dedT1, `${city.cityName} ${type} outpatient: community ded (${dedComm}) > tier1 ded (${dedT1})`);
      assert(dedT1 <= dedT2, `${city.cityName} ${type} outpatient: tier1 ded (${dedT1}) > tier2 ded (${dedT2})`);
      assert(dedT2 <= dedT3, `${city.cityName} ${type} outpatient: tier2 ded (${dedT2}) > tier3 ded (${dedT3})`);
      assert(dedT3 <= dedT3Top, `${city.cityName} ${type} outpatient: tier3 ded (${dedT3}) > tier3_top ded (${dedT3Top})`);
    }
  }
  console.log('✓ Section 1 Passed: Tier deductibles and ratios are monotonically sound across all 11 cities.\n');

  // --------------------------------------------------------------------------
  // SECTION 2: Exhaustive Money Conservation Invariant (99,000 test points)
  // --------------------------------------------------------------------------
  console.log('--- Section 2: Exhaustive Money Conservation Matrix (99,000 cases) ---');
  const testCosts = [0, 0.01, 0.99, 10, 50, 100, 300, 500, 1500, 10000, 50000, 150000, 500000, 1000000, 10000000];
  const expenseScenarios = [
    { name: 'pure_eligible', nonInsFactor: 0, classBFactor: 0, classBRatio: 0.05 },
    { name: 'mixed', nonInsFactor: 0.15, classBFactor: 0.25, classBRatio: 0.1 },
    { name: 'high_selfpay', nonInsFactor: 0.60, classBFactor: 0.30, classBRatio: 0.2 }
  ];

  for (const city of shaanxiCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      for (const isRetiree of [false, true]) {
        for (const treatmentType of ['outpatient', 'inpatient'] as const) {
          for (const tier of tiers) {
            for (const remoteStatus of remoteStatuses) {
              for (const cost of testCosts) {
                for (const sc of expenseScenarios) {
                  checks++;
                  const nonInsuranceCost = Math.round(cost * sc.nonInsFactor * 100) / 100;
                  const classBCost = Math.round(cost * sc.classBFactor * 100) / 100;
                  const res = calculateReimbursement({
                    cityCode: city.cityCode,
                    insuranceType,
                    isRetiree,
                    treatmentType,
                    hospitalTier: tier,
                    remoteStatus,
                    totalCost: cost,
                    nonInsuranceCost,
                    classBCost,
                    classBSelfPayRatio: sc.classBRatio
                  });

                  const b = res.breakdown;
                  // Invariants
                  assert(!isNaN(b.totalReimbursed), `NaN totalReimbursed at ${city.cityName} cost=${cost}`);
                  assert(!isNaN(b.personalPayTotal), `NaN personalPayTotal at ${city.cityName} cost=${cost}`);
                  assert(b.totalReimbursed >= 0, `Negative totalReimbursed: ${b.totalReimbursed}`);
                  assert(b.personalPayTotal >= 0, `Negative personalPayTotal: ${b.personalPayTotal}`);
                  assert(b.totalReimbursed <= cost + 0.001, `totalReimbursed (${b.totalReimbursed}) > totalCost (${cost})`);

                  // Money conservation: reimbursed + personal pay == totalCost
                  const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
                  const diff = Math.abs(sum - cost);
                  assert(diff <= 0.015, `Conservation fail: ${city.cityName} cost=${cost} sum=${sum} diff=${diff}`);

                  // Component sum: base + catastrophic == total
                  const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
                  assert(Math.abs(compSum - b.totalReimbursed) <= 0.01, `Component mismatch: base(${b.baseReimbursed}) + cat(${b.catastrophicReimbursed}) != total(${b.totalReimbursed})`);

                  // Effective ratio bound: 0% to 100%
                  assert(b.effectiveRatio >= 0 && b.effectiveRatio <= 100, `effectiveRatio out of range: ${b.effectiveRatio}`);
                }
              }
            }
          }
        }
      }
    }
  }
  console.log('✓ Section 2 Passed: 99,000 combinations fully verified with 100% money conservation.\n');

  // --------------------------------------------------------------------------
  // SECTION 3: Resident Catastrophic Cap Saturation & Saturation Invariants
  // --------------------------------------------------------------------------
  console.log('--- Section 3: Resident Catastrophic Cap Clamping & Notes Audit ---');
  const cappedCities = ['610500', '610800', '610600', '610700', '610900', '611000']; // 渭南, 榆林, 延安, 汉中, 安康, 商洛
  const uncappedCities = ['610100', '610400', '610300', '610200', '610403']; // 西安, 咸阳, 宝鸡, 铜川, 杨凌

  // Capped cities checks
  for (const cityCode of cappedCities) {
    const city = getCityDataByCode(cityCode)!;
    const statutoryCap = city.resident.catastrophic.annualCap!;
    assert(statutoryCap === 300000, `${city.cityName} statutory cap should be 300,000, got ${statutoryCap}`);

    let prevCat = 0;
    const stressCosts = [50000, 100000, 200000, 350000, 500000, 1000000, 5000000, 20000000];
    for (const cost of stressCosts) {
      checks++;
      const res = calculateReimbursement({
        cityCode,
        insuranceType: 'resident',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost
      });

      const catReimb = res.breakdown.catastrophicReimbursed;
      assert(catReimb >= prevCat, `${city.cityName} resident catastrophic decreased with cost: ${prevCat} -> ${catReimb}`);
      assert(catReimb <= statutoryCap, `${city.cityName} resident catastrophic breached cap: ${catReimb} > ${statutoryCap}`);

      if (cost >= 1000000) {
        assert(catReimb === statutoryCap, `${city.cityName} resident catastrophic should saturate at 300,000, got ${catReimb}`);
        const hasCapNote = res.policyNotes.some(n => n.includes('年度最高支付限额') && n.includes('300,000'));
        assert(hasCapNote, `${city.cityName} missing cap notification note when saturated`);
      }
      prevCat = catReimb;
    }
  }

  // Uncapped cities checks
  for (const cityCode of uncappedCities) {
    const city = getCityDataByCode(cityCode)!;
    assert(city.resident.catastrophic.annualCap === undefined, `${city.cityName} should have no resident catastrophic cap`);

    checks++;
    const resHigh = calculateReimbursement({
      cityCode,
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 10000000
    });

    assert(resHigh.breakdown.catastrophicReimbursed > 300000, `${city.cityName} uncapped resident catastrophic falsely clamped to <= 300k: ${resHigh.breakdown.catastrophicReimbursed}`);
  }
  console.log('✓ Section 3 Passed: Resident catastrophic caps correctly clamped at ¥300,000 for 6 cities and unbounded for 5 cities.\n');

  // --------------------------------------------------------------------------
  // SECTION 4: Zero-Ratio Tiers & Retiree Bonus Safety Audit
  // --------------------------------------------------------------------------
  console.log('--- Section 4: Zero-Ratio Tiers & Retiree Bonus Invariance Audit ---');
  for (const city of shaanxiCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      const pkg = insuranceType === 'employee' ? city.employee : city.resident;
      for (const tier of tiers) {
        const tb = pkg.outpatient.tierBenefits[tier];
        if (tb && tb.reimbursementRatio === 0) {
          checks += 2;
          // In-service
          const resNormal = calculateReimbursement({
            cityCode: city.cityCode,
            insuranceType,
            isRetiree: false,
            treatmentType: 'outpatient',
            hospitalTier: tier,
            remoteStatus: 'local',
            totalCost: 1000
          });
          assert(resNormal.breakdown.totalReimbursed === 0, `${city.cityName} ${insuranceType} ${tier} ratio=0 but reimbursed=${resNormal.breakdown.totalReimbursed}`);
          assert(resNormal.breakdown.personalPayTotal === 1000, `${city.cityName} personal pay != 1000`);

          // Retiree test: ensure retiree bonus does not activate on 0% tier
          const resRetiree = calculateReimbursement({
            cityCode: city.cityCode,
            insuranceType,
            isRetiree: true,
            treatmentType: 'outpatient',
            hospitalTier: tier,
            remoteStatus: 'local',
            totalCost: 1000
          });
          assert(resRetiree.breakdown.totalReimbursed === 0, `${city.cityName} ${insuranceType} retiree on 0% tier got reimbursed=${resRetiree.breakdown.totalReimbursed}`);
          assert(resRetiree.breakdown.personalPayTotal === 1000, `${city.cityName} retiree personal pay != 1000`);
        }
      }
    }
  }
  console.log('✓ Section 4 Passed: Zero-ratio tiers strictly yield 0 reimbursement and prevent retiree bonus resurrection.\n');

  // --------------------------------------------------------------------------
  // SECTION 5: Tier-Specific Outpatient Deductible Adherence
  // --------------------------------------------------------------------------
  console.log('--- Section 5: Outpatient Tier-Specific Deductible Penetration ---');
  // Shangluo employee outpatient: Tier 1 (30), Tier 2 (60), Tier 3 (90), Tier 3 Top (90)
  const slTierDeds: Record<HospitalTier, number> = {
    community: 30,
    tier1: 30,
    tier2: 60,
    tier3: 90,
    tier3_top: 90
  };

  for (const tier of tiers) {
    checks += 2;
    const expectedDed = slTierDeds[tier];
    // Case 1: cost below deductible
    const resBelow = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      treatmentType: 'outpatient',
      hospitalTier: tier,
      remoteStatus: 'local',
      totalCost: expectedDed - 5
    });
    assert(resBelow.breakdown.deductibleDeducted === expectedDed - 5, `Shangluo ${tier} ded deducted under cost failed`);
    assert(resBelow.breakdown.totalReimbursed === 0, `Shangluo ${tier} reimbursed under deductible > 0`);

    // Case 2: cost above deductible
    const resAbove = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      treatmentType: 'outpatient',
      hospitalTier: tier,
      remoteStatus: 'local',
      totalCost: expectedDed + 200
    });
    assert(resAbove.breakdown.deductibleDeducted === expectedDed, `Shangluo ${tier} expected deductible ${expectedDed}, got ${resAbove.breakdown.deductibleDeducted}`);
    assert(resAbove.breakdown.totalReimbursed > 0, `Shangluo ${tier} reimbursed should be > 0`);
  }

  // Xi'an resident outpatient: Tier 2 (50), Tier 3 (100)
  const xaT2 = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 150
  });
  checks++;
  assert(xaT2.breakdown.deductibleDeducted === 50, `Xi'an resident tier2 outpatient ded deducted should be 50, got ${xaT2.breakdown.deductibleDeducted}`);
  assert(xaT2.breakdown.baseReimbursed === 50, `Xi'an resident tier2 outpatient reimbursed should be (150-50)*0.5 = 50, got ${xaT2.breakdown.baseReimbursed}`);

  const xaT3 = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 250
  });
  checks++;
  assert(xaT3.breakdown.deductibleDeducted === 100, `Xi'an resident tier3 outpatient ded deducted should be 100, got ${xaT3.breakdown.deductibleDeducted}`);
  assert(xaT3.breakdown.baseReimbursed === 60, `Xi'an resident tier3 outpatient reimbursed should be (250-100)*0.4 = 60, got ${xaT3.breakdown.baseReimbursed}`);

  console.log('✓ Section 5 Passed: Tier-specific deductibles accurately penetrate and override package defaults.\n');

  // --------------------------------------------------------------------------
  // SECTION 6: Continuous Monotonicity Oracle Check (Fine-Grained Steps)
  // --------------------------------------------------------------------------
  console.log('--- Section 6: Continuous Monotonicity Fine-Grained Oracle Check ---');
  for (const city of shaanxiCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      let prevReimb = -1;
      // Step through cost spectrum from 0 to 1,000,000
      const fineCosts = [
        0, 10, 50, 100, 200, 300, 400, 500, 550, 600, 700, 800, 900, 1000,
        1500, 2000, 3000, 5000, 8000, 10000, 12000, 15000, 20000, 30000,
        50000, 80000, 100000, 120000, 150000, 200000, 300000, 400000,
        500000, 600000, 800000, 1000000, 2000000
      ];

      for (const cost of fineCosts) {
        checks++;
        const res = calculateReimbursement({
          cityCode: city.cityCode,
          insuranceType,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: 'local',
          totalCost: cost
        });

        assert(
          res.breakdown.totalReimbursed >= prevReimb,
          `Monotonicity violation in ${city.cityName} ${insuranceType} at cost ${cost}: previous ${prevReimb} > current ${res.breakdown.totalReimbursed}`
        );
        prevReimb = res.breakdown.totalReimbursed;
      }
    }
  }
  console.log('✓ Section 6 Passed: Reimbursed amount strictly non-decreasing across continuous cost intervals.\n');

  // --------------------------------------------------------------------------
  // SECTION 7: Extreme Edge Cases & Malformed Inputs
  // --------------------------------------------------------------------------
  console.log('--- Section 7: Extreme Adversarial Fault Injection & Boundary Stress ---');
  // 1. Total cost 0 with high non-insurance and class B
  checks++;
  const zeroWithNonIns = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 0,
    nonInsuranceCost: 1000,
    classBCost: 1000
  });
  assert(zeroWithNonIns.breakdown.totalReimbursed === 0, 'Zero cost with nonInsurance reimbursed > 0');
  assert(zeroWithNonIns.breakdown.personalPayTotal === 0, 'Zero cost with nonInsurance personalPay > 0');

  // 2. classBCost > totalCost
  checks++;
  const excessClassB = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    remoteStatus: 'local',
    totalCost: 1000,
    classBCost: 999999,
    classBSelfPayRatio: 0.1
  });
  assert(excessClassB.breakdown.eligibleCost === 0, 'Excess classB did not clamp eligibleCost to 0');
  assert(excessClassB.breakdown.totalReimbursed === 0, 'Excess classB reimbursed > 0');
  assert(excessClassB.breakdown.personalPayTotal === 1000, 'Excess classB personalPay != totalCost');

  // 3. Max safe integer stress
  checks++;
  const maxSafeRes = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1e8
  });
  assert(!isNaN(maxSafeRes.breakdown.totalReimbursed), '1e8 cost resulted in NaN');
  assert(maxSafeRes.breakdown.totalReimbursed <= 1e8, '1e8 cost reimbursed > total');

  // 4. Fractional precision stress: 100.005
  checks++;
  const fracRes = calculateReimbursement({
    cityCode: '610800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 100.005,
    classBCost: 33.333333
  });
  assert(!isNaN(fracRes.breakdown.totalReimbursed), 'Fractional resulted in NaN');
  const fracSum = Math.round((fracRes.breakdown.totalReimbursed + fracRes.breakdown.personalPayTotal) * 100) / 100;
  assert(Math.abs(fracSum - 100.005) < 0.02, `Fractional precision conservation failed: ${fracSum} vs 100.005`);

  console.log('✓ Section 7 Passed: Extreme boundary conditions and malformed inputs handled robustly.\n');

  console.log('========================================================================');
  console.log(`🎉 EMPIRICAL CHALLENGER PASSED: ${checks} rigorous checks 100% SUCCESSFUL!`);
  console.log('========================================================================\n');

  return { totalChecks: checks, passed: true };
}

runEmpiricalChallengerTests();
