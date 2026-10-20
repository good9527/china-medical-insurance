import { calculateReimbursement } from '../engine/calculator';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, RemoteStatus } from '../data/types';

interface ChallengeStats {
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  failures: string[];
}

const stats: ChallengeStats = {
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
  failures: []
};

function assert(condition: boolean, msg: string) {
  stats.totalAssertions++;
  if (!condition) {
    stats.failedAssertions++;
    stats.failures.push(msg);
    if (stats.failures.length <= 25) {
      console.error(`[FAIL] ${msg}`);
    }
  } else {
    stats.passedAssertions++;
  }
}

function assertCloseTo(actual: number, expected: number, delta: number, msg: string) {
  assert(Math.abs(actual - expected) <= delta, `${msg} (expected ${expected}, got ${actual}, diff=${Math.abs(actual - expected)})`);
}

export function runAdversarialChallenge() {
  console.log('================================================================================');
  console.log('>>> [EMPIRICAL CHALLENGER] Rigorous Adversarial Stress & Edge Verification <<<');
  console.log('================================================================================\n');

  // ==========================================================================
  // SECTION 1: Shangluo (611000) Outpatient Per-Visit Deductible Stress
  // ==========================================================================
  console.log('--- Section 1: Shangluo (611000) Per-Visit Deductible Deep Probe ---');
  const shangluo = getCityDataByCode('611000');
  assert(!!shangluo, 'Shangluo (611000) data must exist');
  if (shangluo) {
    const outRule = shangluo.employee.outpatient;
    assert(outRule.deductibleType === 'per_visit', 'Shangluo employee outpatient deductibleType must be per_visit');
    assert(outRule.annualCap === 1500, 'Shangluo active annualCap must be 1500');
    assert(outRule.annualCapRetiree === 2000, 'Shangluo retiree annualCap must be 2000');

    // Test tier-specific deductibles and ratios
    const shangluoTiers: Array<{ tier: HospitalTier; expectedDed: number; activeRatio: number; retireeRatio: number }> = [
      { tier: 'community', expectedDed: 30, activeRatio: 0.70, retireeRatio: 0.75 },
      { tier: 'tier1', expectedDed: 30, activeRatio: 0.70, retireeRatio: 0.75 },
      { tier: 'tier2', expectedDed: 60, activeRatio: 0.65, retireeRatio: 0.70 },
      { tier: 'tier3', expectedDed: 90, activeRatio: 0.60, retireeRatio: 0.65 },
      { tier: 'tier3_top', expectedDed: 90, activeRatio: 0.60, retireeRatio: 0.65 }
    ];

    for (const t of shangluoTiers) {
      // 1. Cost = 0
      const res0 = calculateReimbursement({
        cityCode: '611000',
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: 0
      });
      assert(res0.breakdown.totalReimbursed === 0, `Shangluo ${t.tier} cost=0 reimb should be 0`);
      assert(res0.breakdown.personalPayTotal === 0, `Shangluo ${t.tier} cost=0 pay should be 0`);
      assert(res0.breakdown.deductibleDeducted === 0, `Shangluo ${t.tier} cost=0 deductible deducted should be 0`);

      // 2. Cost strictly below deductible
      const costBelow = t.expectedDed - 5;
      if (costBelow > 0) {
        const resBelow = calculateReimbursement({
          cityCode: '611000',
          insuranceType: 'employee',
          treatmentType: 'outpatient',
          hospitalTier: t.tier,
          remoteStatus: 'local',
          totalCost: costBelow
        });
        assert(resBelow.breakdown.totalReimbursed === 0, `Shangluo ${t.tier} cost=${costBelow} (<${t.expectedDed}) should not reimburse`);
        assert(resBelow.breakdown.deductibleDeducted === costBelow, `Shangluo ${t.tier} cost=${costBelow} deductible deducted should be ${costBelow}`);
        assert(resBelow.breakdown.personalPayTotal === costBelow, `Shangluo ${t.tier} cost=${costBelow} personal pay should equal totalCost`);
        assert(resBelow.policyNotes.some(n => n.includes(`按就医诊次执行，本次起付线 ¥${t.expectedDed}`)), `Shangluo ${t.tier} policyNotes must state per_visit deductible`);
        assert(!resBelow.policyNotes.some(n => n.includes('年度累计起付标准')), `Shangluo ${t.tier} must NOT claim annual cumulative deductible`);
      }

      // 3. Cost exactly at deductible
      const resAt = calculateReimbursement({
        cityCode: '611000',
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: t.expectedDed
      });
      assert(resAt.breakdown.totalReimbursed === 0, `Shangluo ${t.tier} at deductible ${t.expectedDed} reimb should be 0`);
      assert(resAt.breakdown.deductibleDeducted === t.expectedDed, `Shangluo ${t.tier} at deductible deducted should be ${t.expectedDed}`);
      assert(resAt.breakdown.personalPayTotal === t.expectedDed, `Shangluo ${t.tier} at deductible pay should equal deductible`);

      // 4. Cost above deductible (active)
      const costAbove = t.expectedDed + 100;
      const resActive = calculateReimbursement({
        cityCode: '611000',
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: costAbove
      });
      const expectedActiveReimb = Math.round(100 * t.activeRatio * 100) / 100;
      assertCloseTo(resActive.breakdown.totalReimbursed, expectedActiveReimb, 0.01, `Shangluo ${t.tier} active reimb mismatch`);
      assertCloseTo(resActive.breakdown.personalPayTotal + resActive.breakdown.totalReimbursed, costAbove, 0.01, `Shangluo ${t.tier} active conservation`);

      // 5. Cost above deductible (retiree bonus)
      const resRetiree = calculateReimbursement({
        cityCode: '611000',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: costAbove
      });
      const expectedRetireeReimb = Math.round(100 * t.retireeRatio * 100) / 100;
      assertCloseTo(resRetiree.breakdown.totalReimbursed, expectedRetireeReimb, 0.01, `Shangluo ${t.tier} retiree reimb mismatch`);
      assertCloseTo(resRetiree.breakdown.personalPayTotal + resRetiree.breakdown.totalReimbursed, costAbove, 0.01, `Shangluo ${t.tier} retiree conservation`);
      assert(resRetiree.breakdown.totalReimbursed >= resActive.breakdown.totalReimbursed, `Shangluo ${t.tier} retiree should get >= active`);

      // 6. Annual Cap Clamping test
      const bigCost = 6000;
      const resActiveCap = calculateReimbursement({
        cityCode: '611000',
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: bigCost
      });
      assert(resActiveCap.breakdown.totalReimbursed === 1500, `Shangluo active outpatient should be capped at 1500 (got ${resActiveCap.breakdown.totalReimbursed})`);
      assert(resActiveCap.breakdown.personalPayTotal === bigCost - 1500, `Shangluo active personal pay should be cost - 1500`);
      assert(resActiveCap.policyNotes.some(n => n.includes('封顶线 ¥1,500')), `Shangluo active notes should mention 1,500 cap`);

      const resRetireeCap = calculateReimbursement({
        cityCode: '611000',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: bigCost
      });
      assert(resRetireeCap.breakdown.totalReimbursed === 2000, `Shangluo retiree outpatient should be capped at 2000 (got ${resRetireeCap.breakdown.totalReimbursed})`);
      assert(resRetireeCap.breakdown.personalPayTotal === bigCost - 2000, `Shangluo retiree personal pay should be cost - 2000`);
      assert(resRetireeCap.policyNotes.some(n => n.includes('封顶线 ¥2,000')), `Shangluo retiree notes should mention 2,000 cap`);
    }
  }
  console.log('✓ Section 1 Passed: Shangluo per-visit deductible, tier ratios, retiree bonuses, and caps verified.\n');

  // ==========================================================================
  // SECTION 2: Baoji (610300) Outpatient Per-Visit Deductible Stress
  // ==========================================================================
  console.log('--- Section 2: Baoji (610300) Per-Visit Deductible Deep Probe ---');
  const baoji = getCityDataByCode('610300');
  assert(!!baoji, 'Baoji (610300) data must exist');
  if (baoji) {
    const outRule = baoji.employee.outpatient;
    assert(outRule.deductibleType === 'per_visit', 'Baoji employee outpatient deductibleType must be per_visit');
    assert(outRule.annualCap === 500, 'Baoji active annualCap must be 500');
    assert(outRule.annualCapRetiree === 900, 'Baoji retiree annualCap must be 900');

    const baojiTiers: Array<{ tier: HospitalTier; expectedDed: number; activeRatio: number; retireeRatio: number }> = [
      { tier: 'community', expectedDed: 50, activeRatio: 0.60, retireeRatio: 0.65 },
      { tier: 'tier1', expectedDed: 50, activeRatio: 0.60, retireeRatio: 0.65 },
      { tier: 'tier2', expectedDed: 50, activeRatio: 0.55, retireeRatio: 0.60 },
      { tier: 'tier3', expectedDed: 50, activeRatio: 0.50, retireeRatio: 0.55 },
      { tier: 'tier3_top', expectedDed: 50, activeRatio: 0.50, retireeRatio: 0.55 }
    ];

    for (const t of baojiTiers) {
      // 1. Cost strictly below deductible
      const resBelow = calculateReimbursement({
        cityCode: '610300',
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: 49.99
      });
      assert(resBelow.breakdown.totalReimbursed === 0, `Baoji ${t.tier} cost=49.99 should not reimburse`);
      assert(resBelow.breakdown.deductibleDeducted === 49.99, `Baoji ${t.tier} deductible deducted should be 49.99`);
      assert(resBelow.breakdown.personalPayTotal === 49.99, `Baoji ${t.tier} personal pay should be 49.99`);
      assert(resBelow.policyNotes.some(n => n.includes('按就医诊次执行，本次起付线 ¥50')), `Baoji ${t.tier} policyNotes must state per_visit ¥50`);

      // 2. Cost exactly at deductible
      const resAt = calculateReimbursement({
        cityCode: '610300',
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: 50
      });
      assert(resAt.breakdown.totalReimbursed === 0, `Baoji ${t.tier} cost=50 reimb should be 0`);
      assert(resAt.breakdown.deductibleDeducted === 50, `Baoji ${t.tier} deductible deducted should be 50`);
      assert(resAt.breakdown.personalPayTotal === 50, `Baoji ${t.tier} personal pay should be 50`);

      // 3. Cost above deductible (active)
      const resActive = calculateReimbursement({
        cityCode: '610300',
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: 150
      });
      const expectedActive = Math.round((150 - 50) * t.activeRatio * 100) / 100;
      assertCloseTo(resActive.breakdown.totalReimbursed, expectedActive, 0.01, `Baoji ${t.tier} active reimb mismatch`);
      assertCloseTo(resActive.breakdown.personalPayTotal + resActive.breakdown.totalReimbursed, 150, 0.01, `Baoji ${t.tier} active conservation`);

      // 4. Cost above deductible (retiree)
      const resRetiree = calculateReimbursement({
        cityCode: '610300',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: 150
      });
      const expectedRetiree = Math.round((150 - 50) * t.retireeRatio * 100) / 100;
      assertCloseTo(resRetiree.breakdown.totalReimbursed, expectedRetiree, 0.01, `Baoji ${t.tier} retiree reimb mismatch`);
      assertCloseTo(resRetiree.breakdown.personalPayTotal + resRetiree.breakdown.totalReimbursed, 150, 0.01, `Baoji ${t.tier} retiree conservation`);

      // 5. Cap Clamping test
      const highCost = 3000;
      const resActiveCap = calculateReimbursement({
        cityCode: '610300',
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: highCost
      });
      assert(resActiveCap.breakdown.totalReimbursed === 500, `Baoji active outpatient cap should be 500`);
      assert(resActiveCap.breakdown.personalPayTotal === highCost - 500, `Baoji active pay should be cost - 500`);

      const resRetireeCap = calculateReimbursement({
        cityCode: '610300',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'outpatient',
        hospitalTier: t.tier,
        remoteStatus: 'local',
        totalCost: highCost
      });
      assert(resRetireeCap.breakdown.totalReimbursed === 900, `Baoji retiree outpatient cap should be 900`);
      assert(resRetireeCap.breakdown.personalPayTotal === highCost - 900, `Baoji retiree pay should be cost - 900`);
    }
  }
  console.log('✓ Section 2 Passed: Baoji per-visit deductible, tier ratios, retiree bonuses, and caps verified.\n');

  // ==========================================================================
  // SECTION 3: Physical Conservation Law Stress Testing
  // ==========================================================================
  console.log('--- Section 3: Physical Conservation Law (totalReimbursed + personalPayTotal === totalCost) ---');

  // 3.1 Sub-cent floating point inputs across all 348 cities
  console.log('  [3.1] Testing sub-cent floating point precision across all 348 cities...');
  const subCentInputs = [
    { cost: 0.001, non: 0, cls: 0 },
    { cost: 0.004, non: 0, cls: 0 },
    { cost: 0.005, non: 0, cls: 0 },
    { cost: 0.009, non: 0, cls: 0 },
    { cost: 0.014, non: 0, cls: 0 },
    { cost: 0.015, non: 0, cls: 0 },
    { cost: 0.026, non: 0.01, cls: 0 },
    { cost: 100.004, non: 10.002, cls: 5.001 },
    { cost: 100.005, non: 10.002, cls: 5.001 },
    { cost: 1234.5678, non: 12.3456, cls: 78.9012 },
    { cost: 9999.999, non: 99.999, cls: 199.999 }
  ];

  for (const city of allCities) {
    for (const sc of subCentInputs) {
      for (const ins of ['employee', 'resident'] as const) {
        for (const treat of ['outpatient', 'inpatient'] as const) {
          const res = calculateReimbursement({
            cityCode: city.cityCode,
            insuranceType: ins,
            treatmentType: treat,
            hospitalTier: 'tier2',
            remoteStatus: 'local',
            totalCost: sc.cost,
            nonInsuranceCost: sc.non,
            classBCost: sc.cls
          });

          const { totalCost, totalReimbursed, personalPayTotal, baseReimbursed, catastrophicReimbursed } = res.breakdown;
          const sum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
          assert(
            sum === totalCost,
            `Sub-cent conservation failed in ${city.cityName}: ${totalReimbursed} + ${personalPayTotal} = ${sum} !== ${totalCost} (input cost=${sc.cost})`
          );
          assert(totalReimbursed >= 0, `Negative reimbursed in ${city.cityName}`);
          assert(personalPayTotal >= 0, `Negative personal pay in ${city.cityName}`);
          assert(totalReimbursed <= totalCost, `Reimbursed > totalCost in ${city.cityName}`);

          // Component conservation
          const compSum = Math.round((baseReimbursed + catastrophicReimbursed) * 100) / 100;
          assert(compSum === totalReimbursed, `Component conservation failed in ${city.cityName}: ${baseReimbursed} + ${catastrophicReimbursed} !== ${totalReimbursed}`);
        }
      }
    }
  }
  console.log(`  ✓ Sub-cent floating point tests passed across all 348 cities.\n`);

  // 3.2 Zero, Negative, and Faulty Costs
  console.log('  [3.2] Testing zero cost, negative cost, and cost parameter inversion...');
  const faultCases = [
    { label: 'Zero Cost', cost: 0, non: 0, cls: 0 },
    { label: 'Negative Tiny Cost', cost: -0.001, non: 0, cls: 0 },
    { label: 'Negative Small Cost', cost: -10, non: 0, cls: 0 },
    { label: 'Negative Large Cost', cost: -500000, non: 0, cls: 0 },
    { label: 'Non-Insurance > Total Cost', cost: 1000, non: 5000, cls: 0 },
    { label: 'Class B > Total Cost', cost: 1000, non: 0, cls: 5000 },
    { label: 'Both Non-Insurance & Class B > Total Cost', cost: 1000, non: 2000, cls: 3000 },
    { label: 'Negative Non-Insurance Cost', cost: 1000, non: -500, cls: 0 },
    { label: 'Negative Class B Cost', cost: 1000, non: 0, cls: -500 },
    { label: 'All Negative', cost: -1000, non: -200, cls: -300 }
  ];

  for (const city of allCities.slice(0, 50)) { // Sample 50 diverse cities
    for (const fc of faultCases) {
      for (const treat of ['outpatient', 'inpatient'] as const) {
        const res = calculateReimbursement({
          cityCode: city.cityCode,
          insuranceType: 'employee',
          treatmentType: treat,
          hospitalTier: 'tier3',
          remoteStatus: 'local',
          totalCost: fc.cost,
          nonInsuranceCost: fc.non,
          classBCost: fc.cls
        });

        const { totalCost, totalReimbursed, personalPayTotal } = res.breakdown;
        assert(!Number.isNaN(totalCost), `NaN totalCost in ${city.cityName} ${fc.label}`);
        assert(!Number.isNaN(totalReimbursed), `NaN totalReimbursed in ${city.cityName} ${fc.label}`);
        assert(!Number.isNaN(personalPayTotal), `NaN personalPayTotal in ${city.cityName} ${fc.label}`);
        assert(totalCost >= 0, `Negative normalized totalCost in ${city.cityName} ${fc.label}`);
        assert(totalReimbursed >= 0, `Negative totalReimbursed in ${city.cityName} ${fc.label}`);
        assert(personalPayTotal >= 0, `Negative personalPayTotal in ${city.cityName} ${fc.label}`);
        assert(totalReimbursed <= totalCost, `totalReimbursed > totalCost in ${city.cityName} ${fc.label}`);

        const sum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
        assert(sum === totalCost, `Conservation violated in ${city.cityName} ${fc.label}: ${totalReimbursed} + ${personalPayTotal} = ${sum} !== ${totalCost}`);
      }
    }
  }
  console.log(`  ✓ Zero, negative, and faulty cost injection tests passed.\n`);

  // 3.3 Extreme Astronomical Costs
  console.log('  [3.3] Testing extreme astronomical costs (up to 1 Trillion RMB)...');
  const astroCosts = [
    500000,
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000,
    1000000000000 // 1 Trillion
  ];

  for (const city of allCities) {
    for (const ac of astroCosts) {
      for (const ins of ['employee', 'resident'] as const) {
        const res = calculateReimbursement({
          cityCode: city.cityCode,
          insuranceType: ins,
          isRetiree: true,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3_top',
          remoteStatus: 'local',
          totalCost: ac
        });

        const { totalCost, totalReimbursed, personalPayTotal, baseReimbursed, catastrophicReimbursed } = res.breakdown;
        assert(!Number.isNaN(totalReimbursed), `NaN in astro cost for ${city.cityName}`);
        assert(!Number.isNaN(personalPayTotal), `NaN in astro pay for ${city.cityName}`);
        assert(Number.isFinite(totalReimbursed), `Infinite reimb in ${city.cityName}`);
        assert(Number.isFinite(personalPayTotal), `Infinite pay in ${city.cityName}`);

        // Caps must not be breached
        const pkg = ins === 'employee' ? city.employee : city.resident;
        const expectedBaseCap = (ins === 'employee' && pkg.inpatient.annualCapRetiree) ? pkg.inpatient.annualCapRetiree : pkg.inpatient.annualCap;
        assert(
          baseReimbursed <= expectedBaseCap + 0.01,
          `baseReimbursed (${baseReimbursed}) exceeded base cap (${expectedBaseCap}) in ${city.cityName} at cost ${ac}`
        );

        if (pkg.catastrophic?.annualCap) {
          assert(
            catastrophicReimbursed <= pkg.catastrophic.annualCap + 0.01,
            `catastrophicReimbursed (${catastrophicReimbursed}) exceeded catastrophic cap (${pkg.catastrophic.annualCap}) in ${city.cityName}`
          );
        }

        // Conservation
        const sum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
        assertCloseTo(sum, totalCost, 0.02, `Astro cost conservation failed in ${city.cityName} cost=${ac}`);
      }
    }
  }
  console.log(`  ✓ Extreme astronomical costs passed across all 348 cities.\n`);

  // 3.4 Off-site Transfer Permutations across all 348 cities
  console.log('  [3.4] Testing off-site transfer status permutations across all 348 cities...');
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const testAmounts = [1500, 20000, 150000];

  for (const city of allCities) {
    for (const amt of testAmounts) {
      for (const ins of ['employee', 'resident'] as const) {
        for (const tType of ['outpatient', 'inpatient'] as const) {
          const results: Record<RemoteStatus, number> = {} as any;

          for (const rs of remoteStatuses) {
            const res = calculateReimbursement({
              cityCode: city.cityCode,
              insuranceType: ins,
              treatmentType: tType,
              hospitalTier: 'tier3',
              remoteStatus: rs,
              totalCost: amt
            });

            const { totalCost, totalReimbursed, personalPayTotal, baseReimbursed, catastrophicReimbursed } = res.breakdown;
            // 1. Conservation
            const sum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
            assert(
              sum === totalCost,
              `Remote conservation failed in ${city.cityName} status=${rs}: ${totalReimbursed} + ${personalPayTotal} = ${sum} !== ${totalCost}`
            );

            // 2. Component conservation
            const compSum = Math.round((baseReimbursed + catastrophicReimbursed) * 100) / 100;
            assert(compSum === totalReimbursed, `Remote component conservation failed in ${city.cityName} status=${rs}`);

            results[rs] = totalReimbursed;
          }

          // 3. Off-site penalty logic check
          // Generally, unfiled_normal <= transfer <= local
          assert(
            results.unfiled_normal <= results.transfer + 0.01,
            `Unfiled normal (${results.unfiled_normal}) should be <= transfer (${results.transfer}) in ${city.cityName} ${ins} ${tType} amt=${amt}`
          );
          assert(
            results.transfer <= results.local + 0.01,
            `Transfer (${results.transfer}) should be <= local (${results.local}) in ${city.cityName} ${ins} ${tType} amt=${amt}`
          );
          assert(
            results.long_term <= results.local + 0.01,
            `Long term (${results.long_term}) should be <= local (${results.local}) in ${city.cityName} ${ins} ${tType} amt=${amt}`
          );
        }
      }
    }
  }
  console.log(`  ✓ All off-site transfer status permutations verified across 348 cities.\n`);

  // ==========================================================================
  // FINAL VERDICT AND SUMMARY
  // ==========================================================================
  console.log('================================================================================');
  console.log('[CHALLENGER ADVERSARIAL STRESS TEST SUMMARY]');
  console.log(`  Total Invariant Assertions Executed: ${stats.totalAssertions.toLocaleString()}`);
  console.log(`  Passed Assertions:                  ${stats.passedAssertions.toLocaleString()}`);
  console.log(`  Failed Assertions:                  ${stats.failedAssertions.toLocaleString()}`);
  console.log(`  Assertion Success Rate:             ${((stats.passedAssertions / stats.totalAssertions) * 100).toFixed(4)}%`);
  console.log('================================================================================\n');

  if (stats.failedAssertions > 0) {
    console.error(`FATAL: Adversarial stress test uncovered ${stats.failedAssertions} bugs!`);
    process.exit(1);
  } else {
    console.log('[VERDICT] ALL ADVERSARIAL CHALLENGES EMPIRICALLY CONFIRMED AND PASSED!');
  }
}

runAdversarialChallenge();
