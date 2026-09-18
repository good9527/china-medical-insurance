import { calculateReimbursement } from '../calculator';
import { shaanxiCities, getCityDataByCode } from '../../data/shaanxi';
import type { HospitalTier, CalculateRequest, CalculateResult } from '../../data/types';

// ============================================================================
// Empirical Challenger: Stress Test & Adversarial Verification Suite
// ============================================================================

function assert(condition: boolean, msg: string): void {
  if (!condition) {
    throw new Error(`[CHALLENGE FAILED] ${msg}`);
  }
}

const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
const remoteStatuses = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'] as const;

export function runAdversarialTests(): { totalRuns: number; passed: boolean } {
  console.log('================================================================');
  console.log('>>> STARTING EMPIRICAL ADVERSARIAL STRESS TEST SUITE <<<');
  console.log('================================================================\n');

  let checks = 0;

  // --------------------------------------------------------------------------
  // 1. INVARIANT 1: Total Money Conservation & Non-Negative Guarantees
  // --------------------------------------------------------------------------
  console.log('--- Invariant 1: Total Money Conservation & Precision ---');
  for (const city of shaanxiCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      for (const treatmentType of ['outpatient', 'inpatient'] as const) {
        for (const tier of tiers) {
          const testCosts = [0.01, 1, 99.99, 100, 500.55, 1000, 8888.88, 50000, 200000, 1000000];
          for (const cost of testCosts) {
            checks++;
            const res = calculateReimbursement({
              cityCode: city.cityCode,
              insuranceType,
              treatmentType,
              hospitalTier: tier,
              remoteStatus: 'local',
              totalCost: cost,
              nonInsuranceCost: cost * 0.1,
              classBCost: cost * 0.2
            });

            const { totalCost, totalReimbursed, personalPayTotal, baseReimbursed, catastrophicReimbursed } = res.breakdown;

            assert(!isNaN(totalReimbursed), `NaN in totalReimbursed for ${city.cityName}`);
            assert(!isNaN(personalPayTotal), `NaN in personalPayTotal for ${city.cityName}`);
            assert(totalReimbursed >= 0, `totalReimbursed < 0: ${totalReimbursed}`);
            assert(personalPayTotal >= 0, `personalPayTotal < 0: ${personalPayTotal}`);
            assert(totalReimbursed <= totalCost + 0.001, `totalReimbursed (${totalReimbursed}) > totalCost (${totalCost})`);

            // Total conservation: reimbursed + personal pay === totalCost (up to cent rounding)
            const sum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
            const diff = Math.abs(sum - totalCost);
            assert(diff < 0.02, `Money conservation violated: ${city.cityName} cost=${cost}, sum=${sum}, diff=${diff}`);

            // Components conservation: base + catastrophic === totalReimbursed
            const compDiff = Math.abs(Math.round((baseReimbursed + catastrophicReimbursed) * 100) / 100 - totalReimbursed);
            assert(compDiff < 0.01, `Component mismatch: base(${baseReimbursed}) + cat(${catastrophicReimbursed}) !== total(${totalReimbursed})`);
          }
        }
      }
    }
  }
  console.log(`✓ Invariant 1 Verified: All 11 cities conserve money across all tiers and cost ranges.`);

  // --------------------------------------------------------------------------
  // 2. INVARIANT 2: Hospital Tier Deductible Monotonicity
  // --------------------------------------------------------------------------
  console.log('\n--- Invariant 2: Deductible Monotonicity across Hospital Tiers ---');
  for (const city of shaanxiCities) {
    checks++;
    // Inpatient Employee
    const empIn = city.employee.inpatient.tierBenefits;
    assert(empIn.community.deductible <= empIn.tier1.deductible, `${city.cityName} emp inpatient: community ded > tier1 ded`);
    assert(empIn.tier1.deductible <= empIn.tier2.deductible, `${city.cityName} emp inpatient: tier1 ded > tier2 ded`);
    assert(empIn.tier2.deductible <= empIn.tier3.deductible, `${city.cityName} emp inpatient: tier2 ded > tier3 ded`);
    assert(empIn.tier3.deductible <= empIn.tier3_top.deductible, `${city.cityName} emp inpatient: tier3 ded > tier3_top ded`);

    // Inpatient Resident
    const resIn = city.resident.inpatient.tierBenefits;
    assert(resIn.community.deductible <= resIn.tier1.deductible, `${city.cityName} res inpatient: community ded > tier1 ded`);
    assert(resIn.tier1.deductible <= resIn.tier2.deductible, `${city.cityName} res inpatient: tier1 ded > tier2 ded`);
    assert(resIn.tier2.deductible <= resIn.tier3.deductible, `${city.cityName} res inpatient: tier2 ded > tier3 ded`);
    assert(resIn.tier3.deductible <= resIn.tier3_top.deductible, `${city.cityName} res inpatient: tier3 ded > tier3_top ded`);
  }
  console.log(`✓ Invariant 2 Verified: Hospital tier deductibles monotonically non-decrease across all 11 cities.`);

  // --------------------------------------------------------------------------
  // 3. INVARIANT 3: Hospital Tier Reimbursement Ratio Monotonicity
  // --------------------------------------------------------------------------
  console.log('\n--- Invariant 3: Reimbursement Ratio Monotonicity across Hospital Tiers ---');
  for (const city of shaanxiCities) {
    checks++;
    // Employee Inpatient
    const empIn = city.employee.inpatient.tierBenefits;
    assert(empIn.community.reimbursementRatio >= empIn.tier1.reimbursementRatio, `${city.cityName} emp inpatient: community ratio < tier1 ratio`);
    assert(empIn.tier1.reimbursementRatio >= empIn.tier2.reimbursementRatio, `${city.cityName} emp inpatient: tier1 ratio < tier2 ratio`);
    assert(empIn.tier2.reimbursementRatio >= empIn.tier3.reimbursementRatio, `${city.cityName} emp inpatient: tier2 ratio < tier3 ratio`);
    assert(empIn.tier3.reimbursementRatio >= empIn.tier3_top.reimbursementRatio, `${city.cityName} emp inpatient: tier3 ratio < tier3_top ratio`);

    // Resident Inpatient
    const resIn = city.resident.inpatient.tierBenefits;
    assert(resIn.community.reimbursementRatio >= resIn.tier1.reimbursementRatio, `${city.cityName} res inpatient: community ratio < tier1 ratio`);
    assert(resIn.tier1.reimbursementRatio >= resIn.tier2.reimbursementRatio, `${city.cityName} res inpatient: tier1 ratio < tier2 ratio`);
    assert(resIn.tier2.reimbursementRatio >= resIn.tier3.reimbursementRatio, `${city.cityName} res inpatient: tier2 ratio < tier3 ratio`);
    assert(resIn.tier3.reimbursementRatio >= resIn.tier3_top.reimbursementRatio, `${city.cityName} res inpatient: tier3 ratio < tier3_top ratio`);

    // Employee Outpatient
    const empOut = city.employee.outpatient.tierBenefits;
    assert(empOut.community.reimbursementRatio >= empOut.tier1.reimbursementRatio, `${city.cityName} emp outpatient: community ratio < tier1 ratio`);
    assert(empOut.tier1.reimbursementRatio >= empOut.tier2.reimbursementRatio, `${city.cityName} emp outpatient: tier1 ratio < tier2 ratio`);
    assert(empOut.tier2.reimbursementRatio >= empOut.tier3.reimbursementRatio, `${city.cityName} emp outpatient: tier2 ratio < tier3 ratio`);
    assert(empOut.tier3.reimbursementRatio >= empOut.tier3_top.reimbursementRatio, `${city.cityName} emp outpatient: tier3 ratio < tier3_top ratio`);

    // Resident Outpatient
    const resOut = city.resident.outpatient.tierBenefits;
    assert(resOut.community.reimbursementRatio >= resOut.tier1.reimbursementRatio, `${city.cityName} res outpatient: community ratio < tier1 ratio`);
    assert(resOut.tier1.reimbursementRatio >= resOut.tier2.reimbursementRatio, `${city.cityName} res outpatient: tier1 ratio < tier2 ratio`);
    assert(resOut.tier2.reimbursementRatio >= resOut.tier3.reimbursementRatio, `${city.cityName} res outpatient: tier2 ratio < tier3 ratio`);
    assert(resOut.tier3.reimbursementRatio >= resOut.tier3_top.reimbursementRatio, `${city.cityName} res outpatient: tier3 ratio < tier3_top ratio`);
  }
  console.log(`✓ Invariant 3 Verified: Reimbursement ratios monotonically non-increase as hospital tier rises.`);

  // --------------------------------------------------------------------------
  // 4. INVARIANT 4: In-service vs Retiree Ratio and Benefit Guarantees
  // --------------------------------------------------------------------------
  console.log('\n--- Invariant 4: Retiree Ratio and Benefit Guarantees ---');
  for (const city of shaanxiCities) {
    checks++;
    // Inpatient
    for (const tier of tiers) {
      const tierConfig = city.employee.inpatient.tierBenefits[tier];
      const bonus = tierConfig.retireeRatioBonus || 0;
      assert(bonus >= 0, `${city.cityName} inpatient ${tier}: retireeRatioBonus is negative (${bonus})`);

      const resInService = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: tier,
        remoteStatus: 'local',
        totalCost: 15000
      });

      const resRetiree = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'inpatient',
        hospitalTier: tier,
        remoteStatus: 'local',
        totalCost: 15000
      });

      assert(resRetiree.breakdown.totalReimbursed >= resInService.breakdown.totalReimbursed,
        `${city.cityName} inpatient ${tier}: retiree reimbursed (${resRetiree.breakdown.totalReimbursed}) < in-service (${resInService.breakdown.totalReimbursed})`);
    }

    // Outpatient
    for (const tier of tiers) {
      const tierConfig = city.employee.outpatient.tierBenefits[tier];
      const bonus = tierConfig.retireeRatioBonus || 0;
      assert(bonus >= 0, `${city.cityName} outpatient ${tier}: retireeRatioBonus is negative (${bonus})`);

      const resInService = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'outpatient',
        hospitalTier: tier,
        remoteStatus: 'local',
        totalCost: 2000
      });

      const resRetiree = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'outpatient',
        hospitalTier: tier,
        remoteStatus: 'local',
        totalCost: 2000
      });

      assert(resRetiree.breakdown.totalReimbursed >= resInService.breakdown.totalReimbursed,
        `${city.cityName} outpatient ${tier}: retiree reimbursed (${resRetiree.breakdown.totalReimbursed}) < in-service (${resInService.breakdown.totalReimbursed})`);
    }

    // Outpatient Caps: Retiree Cap >= In-service Cap
    const capInService = city.employee.outpatient.annualCap;
    const capRetiree = city.employee.outpatient.annualCapRetiree ?? capInService;
    assert(capRetiree >= capInService, `${city.cityName}: retiree outpatient cap (${capRetiree}) < in-service (${capInService})`);
  }
  console.log(`✓ Invariant 4 Verified: Retiree ratios and caps consistently superior or equal to in-service employees.`);

  // --------------------------------------------------------------------------
  // 5. INVARIANT 5: Monotonicity with Respect to Total Cost (Oracle Check)
  // --------------------------------------------------------------------------
  console.log('\n--- Invariant 5: Monotonicity with Respect to Total Cost ---');
  for (const city of shaanxiCities) {
    checks++;
    let prevReimbursed = -1;
    const sampleCosts = [
      50, 100, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000, 3000, 5000,
      10000, 20000, 50000, 100000, 200000, 300000, 400000, 500000, 800000,
      1000000, 2000000, 5000000
    ];

    for (const cost of sampleCosts) {
      const res = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost
      });

      assert(res.breakdown.totalReimbursed >= prevReimbursed,
        `${city.cityName}: cost increased to ${cost} but reimbursed decreased from ${prevReimbursed} to ${res.breakdown.totalReimbursed}`);
      prevReimbursed = res.breakdown.totalReimbursed;
    }
  }
  console.log(`✓ Invariant 5 Verified: Reimbursed amount monotonically non-decreases as expense escalates from 50 to 5,000,000.`);

  // --------------------------------------------------------------------------
  // 6. INVARIANT 6: Remote Medical Non-Superiority
  // --------------------------------------------------------------------------
  console.log('\n--- Invariant 6: Remote Medical Non-Superiority Rules ---');
  for (const city of shaanxiCities) {
    checks++;
    for (const insuranceType of ['employee', 'resident'] as const) {
      const cost = 20000;
      const resLocal = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'local',
        totalCost: cost
      });

      const resLongTerm = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'long_term',
        totalCost: cost
      });

      const resTransfer = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'transfer',
        totalCost: cost
      });

      const resUnfiled = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'unfiled_normal',
        totalCost: cost
      });

      assert(resLongTerm.breakdown.totalReimbursed === resLocal.breakdown.totalReimbursed,
        `${city.cityName} ${insuranceType}: long_term (${resLongTerm.breakdown.totalReimbursed}) !== local (${resLocal.breakdown.totalReimbursed})`);
      assert(resTransfer.breakdown.totalReimbursed <= resLocal.breakdown.totalReimbursed,
        `${city.cityName} ${insuranceType}: transfer (${resTransfer.breakdown.totalReimbursed}) > local (${resLocal.breakdown.totalReimbursed})`);
      assert(resUnfiled.breakdown.totalReimbursed <= resTransfer.breakdown.totalReimbursed,
        `${city.cityName} ${insuranceType}: unfiled (${resUnfiled.breakdown.totalReimbursed}) > transfer (${resTransfer.breakdown.totalReimbursed})`);
    }
  }
  console.log(`✓ Invariant 6 Verified: Remote medical factors strictly adhere to hierarchy (local == long_term >= transfer >= unfiled).`);

  // --------------------------------------------------------------------------
  // 7. ADVERSARIAL EDGE CASES & FAULT INJECTION
  // --------------------------------------------------------------------------
  console.log('\n--- Adversarial Edge Cases & Fault Injection ---');

  // E1: Zero Cost
  checks++;
  const zeroRes = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier1',
    remoteStatus: 'local',
    totalCost: 0
  });
  assert(zeroRes.breakdown.totalReimbursed === 0, 'Zero cost must give 0 reimbursed');
  assert(zeroRes.breakdown.personalPayTotal === 0, 'Zero cost must give 0 personal pay');
  assert(zeroRes.breakdown.effectiveRatio === 0, 'Zero cost must give 0 ratio');

  // E2: Micro-cost (1 cent)
  checks++;
  const centRes = calculateReimbursement({
    cityCode: '610800', // Yulin (0 deductible in outpatient)
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 0.01
  });
  assert(centRes.breakdown.totalReimbursed + centRes.breakdown.personalPayTotal === 0.01, '1 cent conservation failed');

  // E3: Sub-cent precision (fractional cents: 0.005)
  checks++;
  const subCentRes = calculateReimbursement({
    cityCode: '610800',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 0.005
  });
  assert(!isNaN(subCentRes.breakdown.totalReimbursed), 'Sub-cent resulted in NaN');

  // E4: Ultra-high Cost (10,000,000 RMB)
  checks++;
  const extremeRes = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 10000000
  });
  assert(extremeRes.breakdown.baseReimbursed === extremeRes.cityData.employee.inpatient.annualCap, 'Extreme cost basic cap breached');
  assert(extremeRes.breakdown.catastrophicReimbursed > 0, 'Extreme cost did not trigger catastrophic');
  assert(extremeRes.breakdown.totalReimbursed + extremeRes.breakdown.personalPayTotal === 10000000, 'Extreme cost conservation failed');
  console.log(`  ✓ 10,000,000 RMB extreme test: Reimbursed ¥${extremeRes.breakdown.totalReimbursed}, Personal Pay ¥${extremeRes.breakdown.personalPayTotal}`);

  // E5: Mega-high Cost (100,000,000 RMB)
  checks++;
  const megaRes = calculateReimbursement({
    cityCode: '610500',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 100000000
  });
  assert(megaRes.breakdown.totalReimbursed <= 100000000, 'Mega cost reimbursed exceeded total cost');
  assert(megaRes.breakdown.totalReimbursed + megaRes.breakdown.personalPayTotal === 100000000, 'Mega cost conservation failed');

  // E6: Non-Insurance Cost Exceeds Total Cost
  checks++;
  const excessNonIns = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000,
    nonInsuranceCost: 1500
  });
  assert(excessNonIns.breakdown.eligibleCost === 0, 'Eligible cost must be clamped to 0 when nonInsurance > total');
  assert(excessNonIns.breakdown.totalReimbursed === 0, 'Reimbursed must be 0 when nonInsurance > total');
  assert(excessNonIns.breakdown.personalPayTotal === 1000, 'Personal pay must equal total cost when nonInsurance > total');

  // E7: Class B Cost Exceeds Total Cost
  checks++;
  const excessClassB = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000,
    classBCost: 50000,
    classBSelfPayRatio: 0.1
  });
  assert(excessClassB.breakdown.eligibleCost === 0, 'Eligible cost must be clamped to 0 when classB prior pay > total');
  assert(excessClassB.breakdown.totalReimbursed === 0, 'Reimbursed must be 0 when eligible cost is 0');

  // E8: Negative Input Values (Total & NonInsurance)
  checks++;
  const negInput = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: -999,
    nonInsuranceCost: -500,
    classBCost: -200
  });
  assert(negInput.breakdown.totalCost === 0, 'Negative totalCost must clamp to 0');
  assert(negInput.breakdown.totalReimbursed === 0, 'Negative cost reimbursed must be 0');
  assert(negInput.breakdown.personalPayTotal === 0, 'Negative cost personal pay must be 0');

  // E9: Invalid City Code Rejection
  checks++;
  let caughtCityError = false;
  try {
    calculateReimbursement({
      cityCode: '000000',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 5000
    });
  } catch (e: any) {
    caughtCityError = true;
    assert(e.message.includes('未找到城市编码 [000000]'), 'Error message mismatch for invalid city code');
  }
  assert(caughtCityError, 'Invalid city code did not throw error');

  // E10: Resident Insurance with isRetiree: true (Should not receive retiree bonus)
  checks++;
  const resWithRetireeFlag = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    isRetiree: true,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  const resWithoutRetireeFlag = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000
  });
  assert(resWithRetireeFlag.breakdown.totalReimbursed === resWithoutRetireeFlag.breakdown.totalReimbursed,
    'Resident insurance should completely ignore isRetiree flag');

  // E11: Exact Deductible Boundary Tests
  for (const city of shaanxiCities) {
    const ded = city.employee.inpatient.tierBenefits.tier2.deductible;
    checks += 3;

    // Just below deductible
    const resBelow = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: Math.max(0, ded - 1)
    });
    assert(resBelow.breakdown.baseReimbursed === 0, `${city.cityName} cost below ded reimbursed > 0`);

    // Exactly at deductible
    const resAt = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: ded
    });
    assert(resAt.breakdown.baseReimbursed === 0, `${city.cityName} cost at ded reimbursed > 0`);

    // Just above deductible
    const resAbove = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: ded + 100
    });
    assert(resAbove.breakdown.baseReimbursed > 0, `${city.cityName} cost above ded reimbursed == 0`);
  }

  // E12: Resident Catastrophic Cap Ultra-High Cost Stress (10,000,000 RMB)
  for (const city of shaanxiCities) {
    if (city.resident.catastrophic.annualCap) {
      checks++;
      const resCatCap = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'resident',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 10000000
      });
      assert(
        resCatCap.breakdown.catastrophicReimbursed <= city.resident.catastrophic.annualCap,
        `${city.cityName} resident catastrophic reimbursed (${resCatCap.breakdown.catastrophicReimbursed}) breached annualCap (${city.resident.catastrophic.annualCap})`
      );
      assert(
        resCatCap.breakdown.catastrophicReimbursed === city.resident.catastrophic.annualCap,
        `${city.cityName} resident catastrophic reimbursed did not saturate annualCap`
      );
    }
  }

  // E13: Zero Reimbursement Ratio Guarantee (All Packages, Tiers & Cities)
  for (const city of shaanxiCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      const pkg = insuranceType === 'employee' ? city.employee : city.resident;
      for (const tier of tiers) {
        const outTier = pkg.outpatient.tierBenefits[tier];
        if (outTier && outTier.reimbursementRatio === 0) {
          checks++;
          const resZeroRatio = calculateReimbursement({
            cityCode: city.cityCode,
            insuranceType,
            treatmentType: 'outpatient',
            hospitalTier: tier,
            remoteStatus: 'local',
            totalCost: 1000
          });
          assert(resZeroRatio.breakdown.totalReimbursed === 0, `${city.cityName} ${insuranceType} ${tier} ratio is 0 but reimbursed > 0`);
          assert(resZeroRatio.breakdown.personalPayTotal === 1000, `${city.cityName} ${insuranceType} ${tier} personal pay != 1000`);
        }
      }
    }
  }
  console.log(`✓ Adversarial Edge Cases & Fault Injection: 13 categories passed with 0 crashes.`);

  // --------------------------------------------------------------------------
  // 8. REFERENTIAL INTEGRITY & POLICY METADATA DEEP AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- Referential Integrity & Policy Metadata Deep Audit ---');
  const expectedCities: Record<string, string> = {
    '610100': '西安市',
    '610200': '铜川市',
    '610300': '宝鸡市',
    '610400': '咸阳市',
    '610403': '杨凌示范区',
    '610500': '渭南市',
    '610600': '延安市',
    '610700': '汉中市',
    '610800': '榆林市',
    '610900': '安康市',
    '611000': '商洛市'
  };

  assert(shaanxiCities.length === 11, `Expected 11 cities, got ${shaanxiCities.length}`);
  for (const [code, name] of Object.entries(expectedCities)) {
    checks++;
    const found = shaanxiCities.find(c => c.cityCode === code);
    assert(!!found, `Missing expected city: ${name} (${code})`);
    assert(found!.cityName === name, `City name mismatch for ${code}: expected ${name}, got ${found!.cityName}`);
  }

  for (const city of shaanxiCities) {
    checks++;
    const docMap = new Map(city.sourceDocs.map(d => [d.docId, d]));
    assert(city.sourceDocs.length >= 2, `${city.cityName}: sourceDocs must have at least 2 entries`);

    // Verify all sourceDocIds point to existing docs
    const packages = [
      { pkg: city.employee, name: 'employee' },
      { pkg: city.resident, name: 'resident' }
    ];

    for (const { pkg, name } of packages) {
      assert(docMap.has(pkg.outpatient.sourceDocId), `${city.cityName} ${name}.outpatient.sourceDocId [${pkg.outpatient.sourceDocId}] not in sourceDocs`);
      assert(docMap.has(pkg.inpatient.sourceDocId), `${city.cityName} ${name}.inpatient.sourceDocId [${pkg.inpatient.sourceDocId}] not in sourceDocs`);
      assert(docMap.has(pkg.catastrophic.sourceDocId), `${city.cityName} ${name}.catastrophic.sourceDocId [${pkg.catastrophic.sourceDocId}] not in sourceDocs`);
      assert(docMap.has(pkg.remoteMedical.sourceDocId), `${city.cityName} ${name}.remoteMedical.sourceDocId [${pkg.remoteMedical.sourceDocId}] not in sourceDocs`);

      // Caps sanity
      assert(pkg.outpatient.annualCap >= 100 && pkg.outpatient.annualCap <= 10000,
        `${city.cityName} ${name} outpatient annualCap out of bounds: ${pkg.outpatient.annualCap}`);
      assert(pkg.inpatient.annualCap >= 50000 && pkg.inpatient.annualCap <= 1000000,
        `${city.cityName} ${name} inpatient annualCap out of bounds: ${pkg.inpatient.annualCap}`);

      // Remote factor sanity
      const rm = pkg.remoteMedical;
      assert(rm.longTermFiledRatio === 1.0, `${city.cityName} ${name} longTermFiledRatio must be 1.0`);
      assert(rm.transferFiledRatio >= 0.7 && rm.transferFiledRatio <= 1.0, `${city.cityName} ${name} transferFiledRatio out of bounds: ${rm.transferFiledRatio}`);
      assert(rm.unfiledNormalRatio >= 0.5 && rm.unfiledNormalRatio <= 1.0, `${city.cityName} ${name} unfiledNormalRatio out of bounds: ${rm.unfiledNormalRatio}`);
    }

    // Document metadata audit
    for (const doc of city.sourceDocs) {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(doc.publishDate), `${city.cityName} doc ${doc.docId} invalid publishDate: ${doc.publishDate}`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(doc.effectiveDate), `${city.cityName} doc ${doc.docId} invalid effectiveDate: ${doc.effectiveDate}`);
      assert(doc.officialUrl.startsWith('http'), `${city.cityName} doc ${doc.docId} invalid URL: ${doc.officialUrl}`);
      assert(doc.summaryQuote.length >= 20, `${city.cityName} doc ${doc.docId} quote too short (< 20 chars)`);
    }
  }
  console.log(`✓ Referential Integrity & Policy Metadata: All 11 cities have 100% valid doc linkages and sane bounds.`);

  // --------------------------------------------------------------------------
  // 9. FUZZING GENERATOR: 5,000 Pseudorandom Scenarios
  // --------------------------------------------------------------------------
  console.log('\n--- Fuzzing Generator: 5,000 Pseudorandom Scenarios ---');
  const cityCodes = shaanxiCities.map(c => c.cityCode);
  const insuranceTypes = ['employee', 'resident'] as const;
  const treatmentTypes = ['outpatient', 'inpatient'] as const;

  let seed = 123456789;
  function pseudoRandom(): number {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  }

  for (let i = 0; i < 5000; i++) {
    checks++;
    const cityCode = cityCodes[Math.floor(pseudoRandom() * cityCodes.length)];
    const insuranceType = insuranceTypes[Math.floor(pseudoRandom() * insuranceTypes.length)];
    const treatmentType = treatmentTypes[Math.floor(pseudoRandom() * treatmentTypes.length)];
    const isRetiree = pseudoRandom() > 0.5;
    const hospitalTier = tiers[Math.floor(pseudoRandom() * tiers.length)];
    const remoteStatus = remoteStatuses[Math.floor(pseudoRandom() * remoteStatuses.length)];
    const totalCost = Math.round(pseudoRandom() * 1000000 * 100) / 100;
    const nonInsuranceCost = Math.round(pseudoRandom() * (totalCost * 0.5) * 100) / 100;
    const classBCost = Math.round(pseudoRandom() * (totalCost * 0.5) * 100) / 100;
    const classBSelfPayRatio = Math.round(pseudoRandom() * 0.3 * 100) / 100;

    const res = calculateReimbursement({
      cityCode,
      insuranceType,
      treatmentType,
      isRetiree,
      hospitalTier,
      remoteStatus,
      totalCost,
      nonInsuranceCost,
      classBCost,
      classBSelfPayRatio
    });

    const b = res.breakdown;
    assert(!isNaN(b.totalReimbursed), `Fuzz iteration ${i}: totalReimbursed is NaN`);
    assert(!isNaN(b.personalPayTotal), `Fuzz iteration ${i}: personalPayTotal is NaN`);
    assert(b.totalReimbursed >= 0, `Fuzz iteration ${i}: totalReimbursed < 0`);
    assert(b.personalPayTotal >= 0, `Fuzz iteration ${i}: personalPayTotal < 0`);
    assert(b.totalReimbursed <= b.totalCost + 0.01, `Fuzz iteration ${i}: reimbursed (${b.totalReimbursed}) > cost (${b.totalCost})`);

    const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
    const diff = Math.abs(sum - b.totalCost);
    assert(diff <= 0.01, `Fuzz iteration ${i}: money conservation violated (diff=${diff})`);
    assert(b.effectiveRatio >= 0 && b.effectiveRatio <= 100, `Fuzz iteration ${i}: effectiveRatio out of range (${b.effectiveRatio})`);
  }
  console.log(`✓ Fuzzing Generator: 5,000 pseudorandom scenarios completed with 0 errors.`);

  console.log('\n================================================================');
  console.log(`🎉 ALL ADVERSARIAL STRESS TESTS PASSED! (${checks} total checks executed)`);
  console.log('================================================================\n');

  return { totalRuns: checks, passed: true };
}

runAdversarialTests();
