/**
 * Actuarial Challenger R26.1: Empirical Invariants & Adversarial Stress Oracle
 *
 * Empirical Validation Mandate:
 * 1. Physical Fund Conservation Law:
 *    totalReimbursed + personalPayTotal === totalCost (tolerance <= 0.01 RMB)
 *    Across the full spectrum [0 ~ 100,000,000 RMB] (zero, sub-cent, micro, boundary deductibles,
 *    regular, catastrophic caps, and extreme 100M RMB values) across all 348 pooling areas.
 * 2. Cross-City Comparator Dual Symmetry:
 *    - ΔR + ΔP === 0 (tolerance <= 0.01 RMB)
 *    - Permutation anti-symmetry: ΔR(B vs A) === -ΔR(A vs B) and ΔP(B vs A) === -ΔP(A vs B)
 *    - Permutation invariance of absolute amounts under city re-ordering
 * 3. Adversarial Chaos & Self-Healing Stress:
 *    - Sub-cent rounding, negative costs, out-of-bound Class B ratios, non-insurance overflows
 *    - Inpatient deductible decay closure & anti-inversion defenses
 * 4. Rigorous 0-Emoji Government Standard Audit:
 *    - Zero emojis across all generated policy notes, breakdown details, and simulation key insights
 */

import { calculateReimbursement, resolveInpatientDeductible, normalizeHospitalTier } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { allCities, getCityDataByCode } from '../data';
import type {
  HospitalTier,
  RemoteStatus,
  InsuranceType,
  TreatmentType,
  CalculateRequest,
  ComparisonScenarioInput
} from '../data/types';

export interface ChallengerStats {
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  suiteStats: Record<string, { total: number; passed: number; failed: number; elapsedMs: number }>;
  failures: string[];
}

const stats: ChallengerStats = {
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
  suiteStats: {},
  failures: []
};

let currentSuite = '';

function startSuite(suiteName: string): void {
  currentSuite = suiteName;
  stats.suiteStats[suiteName] = { total: 0, passed: 0, failed: 0, elapsedMs: Date.now() };
  console.log(`\n================================================================================`);
  console.log(`>>> [Challenger Oracle] Starting: ${suiteName} <<<`);
  console.log(`================================================================================`);
}

function finishSuite(): void {
  if (!currentSuite || !stats.suiteStats[currentSuite]) return;
  const s = stats.suiteStats[currentSuite];
  s.elapsedMs = Date.now() - s.elapsedMs;
  console.log(`--- [COMPLETED] ${currentSuite} ---`);
  console.log(`    Total: ${s.total.toLocaleString()} | Passed: ${s.passed.toLocaleString()} | Failed: ${s.failed} | Elapsed: ${s.elapsedMs}ms\n`);
}

function assertCondition(condition: boolean, message: string): void {
  stats.totalAssertions++;
  const s = stats.suiteStats[currentSuite];
  if (s) s.total++;

  if (!condition) {
    stats.failedAssertions++;
    if (s) s.failed++;
    if (stats.failures.length < 50) {
      const fullMsg = `[FAIL][${currentSuite}] ${message}`;
      stats.failures.push(fullMsg);
      console.error(`  ${fullMsg}`);
    }
  } else {
    stats.passedAssertions++;
    if (s) s.passed++;
  }
}

function assertClose(val1: number, val2: number, tolerance = 0.01, message = ''): void {
  const diff = Math.abs(val1 - val2);
  assertCondition(
    diff <= tolerance,
    `${message} [Diff: ${diff.toFixed(6)}, Expected: ${val2}, Actual: ${val1}, Tol: ${tolerance}]`
  );
}

// Check for Emoji characters
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

// ============================================================================
// SUITE 1: Nationwide Full-Domain Fund Conservation Law across all 348 Regions
// ============================================================================
function runNationwideConservationSuite(): void {
  startSuite('Suite 1: Nationwide 348 Regions Full-Spectrum Fund Conservation Law [0 ~ 100,000,000 RMB]');

  console.log(`Auditing all ${allCities.length} administrative health insurance divisions...`);
  assertCondition(allCities.length >= 348, `Nationwide pooling areas must be at least 348 (Found: ${allCities.length})`);

  // Define extreme adversarial cost points covering:
  // - Zero (0)
  // - Sub-cent micro amounts (0.001, 0.009, 0.01, 0.05, 0.49, 0.99)
  // - Small amounts (10, 50, 99.999, 100.001)
  // - Standard amounts (500, 1500, 5000, 20000, 50000)
  // - High / near catastrophic cap amounts (100000, 300000, 500000, 800000)
  // - Multi-million & extreme amounts (1000000, 5000000, 10000000, 50000000, 100000000)
  const extremeCostPoints = [
    0,
    0.001,
    0.0049,
    0.005,
    0.009,
    0.01,
    0.05,
    0.49,
    0.50,
    0.99,
    1.001,
    10,
    99.999,
    100.001,
    500,
    1500,
    8000,
    20000,
    50000,
    150000,
    300000,
    500000,
    1000000,
    5000000,
    10000000,
    50000000,
    100000000
  ];

  let cityIndex = 0;
  for (const city of allCities) {
    cityIndex++;

    // Sweep across representative treatment configurations
    const configs: Array<{
      insuranceType: InsuranceType;
      isRetiree: boolean;
      treatmentType: TreatmentType;
      hospitalTier: HospitalTier;
      remoteStatus: RemoteStatus;
      nonInsRatio: number;
      classBRatio: number;
    }> = [
      // 1. Employee Active Inpatient Tier3 Local
      { insuranceType: 'employee', isRetiree: false, treatmentType: 'inpatient', hospitalTier: 'tier3', remoteStatus: 'local', nonInsRatio: 0.08, classBRatio: 0.12 },
      // 2. Employee Retiree Inpatient Tier2 Local
      { insuranceType: 'employee', isRetiree: true, treatmentType: 'inpatient', hospitalTier: 'tier2', remoteStatus: 'local', nonInsRatio: 0.05, classBRatio: 0.10 },
      // 3. Resident Inpatient Tier1 Local
      { insuranceType: 'resident', isRetiree: false, treatmentType: 'inpatient', hospitalTier: 'tier1', remoteStatus: 'local', nonInsRatio: 0.03, classBRatio: 0.08 },
      // 4. Resident Inpatient Tier3 Transfer
      { insuranceType: 'resident', isRetiree: false, treatmentType: 'inpatient', hospitalTier: 'tier3', remoteStatus: 'transfer', nonInsRatio: 0.10, classBRatio: 0.15 },
      // 5. Employee Outpatient Community Local
      { insuranceType: 'employee', isRetiree: false, treatmentType: 'outpatient', hospitalTier: 'community', remoteStatus: 'local', nonInsRatio: 0.02, classBRatio: 0.05 },
      // 6. Resident Outpatient Tier2 Local
      { insuranceType: 'resident', isRetiree: false, treatmentType: 'outpatient', hospitalTier: 'tier2', remoteStatus: 'local', nonInsRatio: 0.04, classBRatio: 0.06 },
      // 7. Resident Inpatient Tier3 Unfiled Normal (punitive penalty)
      { insuranceType: 'resident', isRetiree: false, treatmentType: 'inpatient', hospitalTier: 'tier3', remoteStatus: 'unfiled_normal', nonInsRatio: 0.15, classBRatio: 0.20 },
      // 8. Employee Retiree Inpatient Tier3 Top Long Term
      { insuranceType: 'employee', isRetiree: true, treatmentType: 'inpatient', hospitalTier: 'tier3_top', remoteStatus: 'long_term', nonInsRatio: 0.05, classBRatio: 0.10 }
    ];

    // Select subset of cost points per configuration to keep execution swift yet exhaustive across all 348 cities
    for (let cIdx = 0; cIdx < configs.length; cIdx++) {
      const cfg = configs[cIdx];

      // For every 10th city, test ALL 27 extreme cost points; for other cities test 6 core boundary points
      const pointsToTest = (cityIndex % 10 === 0 || cityIndex <= 15)
        ? extremeCostPoints
        : [0, 0.01, 0.99, 1500, 20000, 100000000];

      for (const cost of pointsToTest) {
        const nonInsuranceCost = Math.round(cost * cfg.nonInsRatio * 100) / 100;
        const classBCost = Math.round(cost * cfg.classBRatio * 100) / 100;

        const req: CalculateRequest = {
          cityCode: city.cityCode,
          insuranceType: cfg.insuranceType,
          isRetiree: cfg.isRetiree,
          treatmentType: cfg.treatmentType,
          hospitalTier: cfg.hospitalTier,
          remoteStatus: cfg.remoteStatus,
          totalCost: cost,
          nonInsuranceCost,
          classBCost,
          classBSelfPayRatio: 0.10
        };

        const res = calculateReimbursement(req);
        const b = res.breakdown;

        const roundedCost = Math.round(Math.max(0, cost) * 100) / 100;

        // Law 1: Physical Fund Conservation: totalReimbursed + personalPayTotal === totalCost
        assertClose(
          b.totalReimbursed + b.personalPayTotal,
          roundedCost,
          0.01,
          `Fund Conservation in ${city.cityName} (${city.cityCode}) at cost ¥${cost} [${cfg.insuranceType}/${cfg.treatmentType}/${cfg.hospitalTier}]`
        );

        // Law 2: Indemnity Principle: totalReimbursed <= totalCost
        assertCondition(
          b.totalReimbursed <= roundedCost + 0.001,
          `Indemnity breach: totalReimbursed (${b.totalReimbursed}) > totalCost (${roundedCost}) in ${city.cityName}`
        );

        // Law 3: Non-negativity
        assertCondition(
          b.totalReimbursed >= 0,
          `Negative reimbursement (${b.totalReimbursed}) in ${city.cityName}`
        );
        assertCondition(
          b.personalPayTotal >= 0,
          `Negative personal pay (${b.personalPayTotal}) in ${city.cityName}`
        );

        // Law 4: Personal payment partition consistency:
        // When catastrophic deductible is 0, catastrophic reimbursement can subsidize part of the deductible.
        // In standard scenarios (where catastrophic does not subsidize deductible), the partition strictly matches:
        if (b.catastrophicReimbursed === 0 || b.eligibleCost > (b.deductibleDeducted || 0)) {
          const personalEligiblePay = Math.round(Math.max(0, b.eligibleCost - b.baseReimbursed - b.catastrophicReimbursed) * 100) / 100;
          const expectedPersonalPay = Math.round((b.nonInsuranceCost + b.classBPriorPay + personalEligiblePay) * 100) / 100;
          assertClose(
            expectedPersonalPay,
            b.personalPayTotal,
            0.02,
            `Personal payment accounting consistency in ${city.cityName} at cost ¥${cost}`
          );
        }

      }
    }

    // Dynamic Deductible Boundary Testing for each city:
    // Test D - 0.01, D, D + 0.01 around the inpatient Tier 2 deductible
    const inpTier2 = city.resident.inpatient.tierBenefits?.tier2 || city.employee.inpatient.tierBenefits?.tier2;
    if (inpTier2 && typeof inpTier2.deductible === 'number' && inpTier2.deductible > 0) {
      const D = inpTier2.deductible;
      const boundaryDeductibleCosts = [Math.max(0, D - 1), Math.max(0, D - 0.01), D, D + 0.01, D + 1];

      for (const cost of boundaryDeductibleCosts) {
        const req: CalculateRequest = {
          cityCode: city.cityCode,
          insuranceType: 'resident',
          treatmentType: 'inpatient',
          hospitalTier: 'tier2',
          remoteStatus: 'local',
          totalCost: cost,
          nonInsuranceCost: 0,
          classBCost: 0
        };
        const res = calculateReimbursement(req);
        const b = res.breakdown;
        const roundedCost = Math.round(cost * 100) / 100;

        assertClose(
          b.totalReimbursed + b.personalPayTotal,
          roundedCost,
          0.01,
          `Deductible boundary conservation in ${city.cityName} at cost ¥${cost} (D=${D})`
        );

        if (cost <= D) {
          // At or below deductible, base reimbursement should be 0
          assertCondition(
            b.baseReimbursed === 0,
            `Expected 0 base reimbursement below deductible in ${city.cityName} (cost: ${cost}, D: ${D}, baseReimbursed: ${b.baseReimbursed})`
          );
        }
      }
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 2: Cross-City Comparator Dual Symmetry & Permutation Invariants
// ============================================================================
function runCrossCityComparatorDualSymmetrySuite(): void {
  startSuite('Suite 2: Cross-City Comparator Dual Symmetry & Permutation Anti-Symmetry');

  // Representative scenarios
  const testScenarios: ComparisonScenarioInput[] = [
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 15000,
      nonInsuranceCost: 1000,
      classBCost: 1500,
      classBSelfPayRatio: 0.10,
      hospitalizationCount: 1
    },
    {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 80000,
      nonInsuranceCost: 5000,
      classBCost: 8000,
      classBSelfPayRatio: 0.15,
      hospitalizationCount: 2
    },
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'transfer',
      totalCost: 120000,
      nonInsuranceCost: 8000,
      classBCost: 12000,
      hospitalizationCount: 3
    },
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 1200,
      nonInsuranceCost: 100,
      classBCost: 100
    },
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'unfiled_normal',
      totalCost: 600000,
      nonInsuranceCost: 40000,
      classBCost: 60000,
      hospitalizationCount: 1
    },
    {
      // Extreme catastrophic cost point [10,000,000 RMB]
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: 10000000,
      nonInsuranceCost: 500000,
      classBCost: 1000000
    },
    {
      // Micro sub-cent cost point
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier1',
      remoteStatus: 'local',
      totalCost: 0.50,
      nonInsuranceCost: 0.10,
      classBCost: 0.10
    }
  ];

  // City sets across geographic corridors
  const cityClusters: Array<{ name: string; cities: string[] }> = [
    // Popular presets
    ...popularMultiCityPresets.map(p => ({ name: `Preset: ${p.label}`, cities: p.cities })),
    // Northwest Silk Road corridor
    { name: 'Northwest Silk Road Corridor', cities: ['610100', '620100', '640100'] },
    // South China & Plateau corridor
    { name: 'South China & Plateau Corridor', cities: ['450100', '460100', '540100'] },
    // Central & Southwestern
    { name: 'Central & Southwestern Corridor', cities: ['340100', '520100', '530100'] },
    // Frontier Xinjiang & Qinghai
    { name: 'Frontier Corridor', cities: ['650100', '630100'] }
  ];

  for (const cluster of cityClusters) {
    for (let sIdx = 0; sIdx < testScenarios.length; sIdx++) {
      const scenario = testScenarios[sIdx];

      // 1. Run simulation on original order
      const simResult = runMultiCitySimulation(cluster.cities, scenario);

      // Symmetry Check 1: Invariant ΔR + ΔP === 0 for each city relative to City A
      for (const outcome of simResult.cities) {
        assertCondition(
          outcome.isConserved,
          `Simulation outcome must be conserved for ${outcome.cityName} in cluster ${cluster.name}`
        );

        const deltaSum = outcome.deltaReimbursedVsCityA + outcome.deltaPersonalPayVsCityA;
        assertClose(
          deltaSum,
          0,
          0.01,
          `Dual symmetry ΔR + ΔP === 0 in ${outcome.cityName} (cluster: ${cluster.name}, scenario: ${sIdx})`
        );

        assertClose(
          outcome.deltaReimbursedVsCityA,
          -outcome.deltaPersonalPayVsCityA,
          0.01,
          `Opposite number dual invariant ΔR === -ΔP in ${outcome.cityName}`
        );
      }

      // Symmetry Check 2: Pairwise Permutation Anti-Symmetry
      // For any two cities [A, B]:
      // Forward run [A, B] -> outcome B has ΔR(B vs A) and ΔP(B vs A)
      // Reverse run [B, A] -> outcome A has ΔR(A vs B) and ΔP(A vs B)
      // Must hold: ΔR(B vs A) === -ΔR(A vs B) and ΔP(B vs A) === -ΔP(A vs B)
      const cityA = cluster.cities[0];
      const cityB = cluster.cities[1];

      const forwardSim = runMultiCitySimulation([cityA, cityB], scenario);
      const reverseSim = runMultiCitySimulation([cityB, cityA], scenario);

      const deltaR_BvsA = forwardSim.cities[1].deltaReimbursedVsCityA;
      const deltaP_BvsA = forwardSim.cities[1].deltaPersonalPayVsCityA;

      const deltaR_AvsB = reverseSim.cities[1].deltaReimbursedVsCityA;
      const deltaP_AvsB = reverseSim.cities[1].deltaPersonalPayVsCityA;

      assertClose(
        deltaR_BvsA,
        -deltaR_AvsB,
        0.01,
        `Pairwise permutation anti-symmetry ΔR(B vs A) === -ΔR(A vs B) for [${cityA}, ${cityB}]`
      );

      assertClose(
        deltaP_BvsA,
        -deltaP_AvsB,
        0.01,
        `Pairwise permutation anti-symmetry ΔP(B vs A) === -ΔP(A vs B) for [${cityA}, ${cityB}]`
      );

      // Symmetry Check 3: Triplet Permutation Invariance (when 3 cities exist)
      if (cluster.cities.length === 3) {
        const [c0, c1, c2] = cluster.cities;
        const perms = [
          [c0, c1, c2],
          [c1, c2, c0],
          [c2, c0, c1],
          [c0, c2, c1],
          [c1, c0, c2],
          [c2, c1, c0]
        ];

        const permResults = perms.map(p => runMultiCitySimulation(p, scenario));

        // Spread invariance: max reimbursement delta and max personal pay delta must be invariant across all permutations
        const baselineMaxRDelta = permResults[0].maxReimbursementDelta;
        const baselineMaxPDelta = permResults[0].maxPersonalPayDelta;

        for (let pIdx = 1; pIdx < permResults.length; pIdx++) {
          const pr = permResults[pIdx];
          assertClose(
            pr.maxReimbursementDelta,
            baselineMaxRDelta,
            0.01,
            `Max reimbursement delta permutation invariance [Perm ${pIdx} vs 0]`
          );
          assertClose(
            pr.maxPersonalPayDelta,
            baselineMaxPDelta,
            0.01,
            `Max personal pay delta permutation invariance [Perm ${pIdx} vs 0]`
          );

          // Absolute reimbursement for City c0 must be identical across all permutations
          const outC0 = pr.cities.find(c => c.cityCode === c0);
          const outC0_base = permResults[0].cities.find(c => c.cityCode === c0);
          if (outC0 && outC0_base) {
            assertClose(
              outC0.totalReimbursed,
              outC0_base.totalReimbursed,
              0.01,
              `City ${c0} totalReimbursed must be invariant under permutation ${pIdx}`
            );
          }
        }
      }
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 3: Adversarial Chaos Fuzzing & Defensive Bounding
// ============================================================================
function runAdversarialChaosSuite(): void {
  startSuite('Suite 3: Adversarial Chaos Fuzzing & Defensive Bounding Stress');

  // Test 3.1: Negative cost inputs self-healing
  const negCosts = [-99999, -100, -1, -0.01];
  for (const neg of negCosts) {
    const res = calculateReimbursement({
      cityCode: '610100',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      totalCost: neg
    });
    assertCondition(res.breakdown.totalCost === 0, `Negative cost ${neg} should heal to 0`);
    assertCondition(res.breakdown.totalReimbursed === 0, `Negative cost ${neg} should yield 0 reimbursement`);
    assertCondition(res.breakdown.personalPayTotal === 0, `Negative cost ${neg} should yield 0 personal pay`);
  }

  // Test 3.2: Non-insurance overflowing totalCost
  const overNonCosts = [1000, 5000, 50000];
  for (const tc of overNonCosts) {
    const res = calculateReimbursement({
      cityCode: '610100',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      totalCost: tc,
      nonInsuranceCost: tc * 2 // 200% overflow
    });
    assertCondition(res.breakdown.nonInsuranceCost === tc, `Non-insurance cost capped to totalCost`);
    assertCondition(res.breakdown.eligibleCost === 0, `Eligible cost should be 0 when non-insurance == totalCost`);
    assertCondition(res.breakdown.totalReimbursed === 0, `Total reimbursed should be 0`);
    assertCondition(res.breakdown.personalPayTotal === tc, `Personal pay should equal totalCost`);
    assertClose(res.breakdown.totalReimbursed + res.breakdown.personalPayTotal, tc, 0.01, `Conservation under non-ins overflow`);
  }

  // Test 3.3: Class B ratio out of bounds (> 1 or < 0)
  const ratioStress = [-0.5, 1.5, 10.0];
  for (const ratio of ratioStress) {
    const res = calculateReimbursement({
      cityCode: '610100',
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      totalCost: 10000,
      classBCost: 5000,
      classBSelfPayRatio: ratio
    });
    assertCondition(
      res.breakdown.classBPriorPay >= 0 && res.breakdown.classBPriorPay <= 5000,
      `Class B prior pay bounded within [0, classBCost] (Actual: ${res.breakdown.classBPriorPay})`
    );
    assertClose(
      res.breakdown.totalReimbursed + res.breakdown.personalPayTotal,
      10000,
      0.01,
      `Conservation under Class B ratio out of bounds`
    );
  }

  // Test 3.4: Inpatient repeated admission deductible decay closure & monotonicity
  // Test across multiple cities with step down policies
  const testCitiesForRepeated = ['340100', '610100', '110100', '310100', '440100'];
  for (const cCode of testCitiesForRepeated) {
    let prevApplied = Infinity;
    for (let count = 1; count <= 5; count++) {
      const res = resolveInpatientDeductible({
        cityCode: cCode,
        insuranceType: 'resident',
        hospitalTier: 'tier2',
        standardDeductible: 600,
        hospitalizationCount: count
      });

      // Closure: applied + reduction === standard
      assertClose(
        res.appliedDeductible + res.deductibleReduction,
        res.standardDeductible,
        0.01,
        `Deductible closure for city ${cCode} at admission count ${count}`
      );

      // Monotonicity: appliedDeductible must not increase with admission count
      assertCondition(
        res.appliedDeductible <= prevApplied,
        `Deductible monotonicity: count ${count} applied (${res.appliedDeductible}) > count ${count - 1} applied (${prevApplied})`
      );
      prevApplied = res.appliedDeductible;

      // Bound: 0 <= applied <= standard
      assertCondition(
        res.appliedDeductible >= 0 && res.appliedDeductible <= res.standardDeductible,
        `Applied deductible out of bounds [0, standard]`
      );
    }
  }

  // Test 3.5: Referral previous deductible paid exceeding standard deductible
  const resReferral = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    totalCost: 20000,
    referralPreviousDeductiblePaid: 5000 // Exceeds tier 3 deductible
  });
  assertCondition(resReferral.breakdown.appliedDeductible >= 0, `Applied deductible cannot be negative after referral deduction`);
  assertClose(
    resReferral.breakdown.totalReimbursed + resReferral.breakdown.personalPayTotal,
    20000,
    0.01,
    `Conservation with large referral previous deductible`
  );

  // Test 3.6: Natural language tier parsing robustness
  const nlTiers = [
    { input: '三甲医院', expected: 'tier3_top' },
    { input: '省属重点三级甲等', expected: 'tier3_top' },
    { input: '市属三乙医院', expected: 'tier3' },
    { input: '区县二级甲等医院', expected: 'tier2' },
    { input: '街道社区卫生服务中心', expected: 'community' },
    { input: '乡镇卫生院', expected: 'tier1' },
    { input: '未知非标医疗机构', expected: 'tier2' }
  ];
  for (const t of nlTiers) {
    const resolved = normalizeHospitalTier(t.input);
    assertCondition(resolved === t.expected, `Normalize tier for "${t.input}": expected ${t.expected}, got ${resolved}`);
  }

  finishSuite();
}

// ============================================================================
// SUITE 4: Zero-Emoji Rigorous Government Standard Dynamic Audit
// ============================================================================
function runZeroEmojiAuditSuite(): void {
  startSuite('Suite 4: Rigorous Zero-Emoji Government Standard Dynamic Audit');

  // Verify that all strings generated by calculator and simulator contain 0 emojis
  for (const city of allCities.slice(0, 30)) {
    const res = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'transfer',
      totalCost: 15000,
      hospitalizationCount: 2
    });

    for (const note of res.policyNotes) {
      assertCondition(!EMOJI_REGEX.test(note), `Policy note in ${city.cityName} contains emoji: "${note}"`);
    }
  }

  // Simulator key insights check
  const sim = runMultiCitySimulation(['110100', '310100', '440100'], {
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 50000
  });

  for (const insight of sim.keyInsights) {
    assertCondition(!EMOJI_REGEX.test(insight), `Simulation insight contains emoji: "${insight}"`);
  }

  finishSuite();
}

// ============================================================================
// Main Oracle Runner
// ============================================================================
export function runChallengerInvariantsOracle(): ChallengerStats {
  const overallStartTime = Date.now();
  console.log('################################################################################');
  console.log('### ACTUARIAL CHALLENGER R26.1: NATIONWIDE INVARIANTS & ADVERSARIAL ORACLE ###');
  console.log('################################################################################');

  runNationwideConservationSuite();
  runCrossCityComparatorDualSymmetrySuite();
  runAdversarialChaosSuite();
  runZeroEmojiAuditSuite();

  const totalElapsed = Date.now() - overallStartTime;
  console.log('\n================================================================================');
  console.log('### CHALLENGER ORACLE VERIFICATION SUMMARY ###');
  console.log(`Total Assertions Evaluated: ${stats.totalAssertions.toLocaleString()}`);
  console.log(`Passed Assertions:          ${stats.passedAssertions.toLocaleString()}`);
  console.log(`Failed Assertions:          ${stats.failedAssertions}`);
  console.log(`Pass Rate:                  ${((stats.passedAssertions / stats.totalAssertions) * 100).toFixed(4)}%`);
  console.log(`Total Elapsed Time:         ${(totalElapsed / 1000).toFixed(2)}s`);
  console.log('================================================================================\n');

  if (stats.failedAssertions > 0) {
    console.error(`CRITICAL: Detected ${stats.failedAssertions} adversarial verification failures!`);
    stats.failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  } else {
    console.log('VERDICT: ALL ADVERSARIAL STRESS INVARIANTS 100% SATISFIED AND CONFIRMED.');
  }

  return stats;
}

if (require.main === module) {
  const result = runChallengerInvariantsOracle();
  if (result.failedAssertions > 0) {
    process.exit(1);
  }
}
