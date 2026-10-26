/**
 * Challenger Generation 9: Rigorous Mathematical Invariants & Empirical Stress Oracle
 *
 * Verification Mandate:
 * 1. Physical Fund Conservation Law:
 *    totalReimbursed + personalPayTotal === totalCost (tolerance <= 0.01 RMB)
 *    across the full cost spectrum [0 ~ 100,000,000 RMB] across all 348 administrative health
 *    insurance divisions in China, covering active/retired employees and residents, outpatient
 *    and inpatient modes, 5 hospital tiers, 5 remote statuses, and multiple boundary conditions.
 * 2. Multi-City Simulation Opposite-Number Dual Symmetry:
 *    Delta R_i + Delta P_i === 0 <===> Delta R_i === -Delta P_i (tolerance <= 0.01 RMB)
 *    across diverse multi-city simulation permutations, presets, and random dyads/triads.
 * 3. Hundreds of thousands of random and boundary evaluations executed empirically.
 * 4. 0-Emoji compliance verification across all generated outputs, insights, and policy notes.
 */

import { calculateReimbursement, resolveInpatientDeductible } from '../engine/calculator';
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
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  suiteStats: Record<string, { total: number; passed: number; failed: number; elapsedMs: number }>;
  failures: string[];
}

const stats: ChallengerStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  suiteStats: {},
  failures: []
};

let currentSuiteName = '';

function startSuite(suiteName: string): void {
  currentSuiteName = suiteName;
  stats.suiteStats[suiteName] = {
    total: 0,
    passed: 0,
    failed: 0,
    elapsedMs: Date.now()
  };
  console.log(`\n================================================================================`);
  console.log(`>>> Starting: ${suiteName} <<<`);
  console.log(`================================================================================`);
}

function finishSuite(): void {
  if (!currentSuiteName || !stats.suiteStats[currentSuiteName]) return;
  const s = stats.suiteStats[currentSuiteName];
  s.elapsedMs = Date.now() - s.elapsedMs;
  console.log(`--- [COMPLETED] ${currentSuiteName} ---`);
  console.log(`    Total: ${s.total.toLocaleString()} | Passed: ${s.passed.toLocaleString()} | Failed: ${s.failed} | Elapsed: ${s.elapsedMs}ms\n`);
}

function recordAssert(condition: boolean, message: string): void {
  stats.totalChecks++;
  const s = stats.suiteStats[currentSuiteName];
  if (s) s.total++;

  if (!condition) {
    stats.failedChecks++;
    if (s) s.failed++;
    if (stats.failures.length < 50) {
      const fullMsg = `[FAIL][${currentSuiteName}] ${message}`;
      stats.failures.push(fullMsg);
      console.error(`  ${fullMsg}`);
    }
  } else {
    stats.passedChecks++;
    if (s) s.passed++;
  }
}

function assertClose(val1: number, val2: number, tolerance = 0.01, message = ''): void {
  const diff = Math.abs(val1 - val2);
  recordAssert(diff <= tolerance, `${message} (val1=${val1}, val2=${val2}, diff=${diff.toFixed(6)}, tol=${tolerance})`);
}

// Pseudo-Random Number Generator (Mulberry32) for reproducible chaos testing
class SeededRNG {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0;
  }
  next(): number {
    this.s |= 0;
    this.s = (this.s + 0x6d2b79f5) | 0;
    let t = Math.imul(this.s ^ (this.s >>> 15), 1 | this.s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  choice<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
}

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

export function runR9EmpiricalChallenger(): ChallengerStats {
  const startTime = Date.now();
  console.log('================================================================================');
  console.log('>>> [CHALLENGER GEN 9] NATIONWIDE INVARIANTS & ADVERSARIAL STRESS HARNESS <<<');
  console.log('================================================================================');
  console.log(`Loaded ${allCities.length} administrative health insurance divisions across China.`);
  recordAssert(allCities.length === 348, `Expected exactly 348 cities, found ${allCities.length}`);

  const hospitalTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const insuranceTypes: InsuranceType[] = ['employee', 'resident'];

  // ============================================================================
  // SUITE 1: Nationwide 348 Pooling Areas Full Boundary Combinatorial Grid
  // ============================================================================
  startSuite('Suite 1: Nationwide 348 Divisions Boundary & Conservation Matrix');

  const boundaryCostMultipliers = [
    0,            // Zero cost
    0.001,        // Sub-cent micro-cost
    0.01,         // Exact 1 cent
    0.50,         // 50 cents
    0.5,          // 50% of deductible
    0.99,         // 99% of deductible
    1.0,          // Exact deductible threshold
    1.01,         // Threshold + 1%
    2.0,          // 2x deductible
    50000,        // Fixed 50,000 RMB
    1000000,      // 1,000,000 RMB (1M)
    50000000,     // 50,000,000 RMB (50M)
    100000000     // 100,000,000 RMB (100M extreme maximum)
  ];

  for (const city of allCities) {
    const cityCode = city.cityCode;

    for (const insType of insuranceTypes) {
      const isRetireeOptions = insType === 'employee' ? [false, true] : [false];

      for (const isRetiree of isRetireeOptions) {
        // Outpatient sweep
        for (const tier of hospitalTiers) {
          const pkg = insType === 'employee' ? city.employee : city.resident;
          const outRule = pkg.outpatient;
          const tierBenefit = outRule.tierBenefits[tier];
          const standardDed = tierBenefit?.deductible ?? (outRule.annualDeductible ?? 0);

          for (const mult of boundaryCostMultipliers) {
            const cost = mult < 10 ? mult * Math.max(10, standardDed) : mult;
            const res = calculateReimbursement({
              cityCode,
              insuranceType: insType,
              isRetiree,
              treatmentType: 'outpatient',
              hospitalTier: tier,
              totalCost: cost
            }, city);

            const b = res.breakdown;
            const actualTotal = b.totalCost;
            const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
            assertClose(sum, actualTotal, 0.01, `Outpatient conservation in ${city.cityName} (${cityCode})`);
            recordAssert(b.totalReimbursed >= 0 && b.totalReimbursed <= actualTotal, `Outpatient totalReimbursed bounded in ${cityCode}`);
            recordAssert(b.personalPayTotal >= 0 && b.personalPayTotal <= actualTotal, `Outpatient personalPayTotal bounded in ${cityCode}`);
          }
        }

        // Inpatient sweep
        for (const tier of hospitalTiers) {
          const pkg = insType === 'employee' ? city.employee : city.resident;
          const inRule = pkg.inpatient;
          const tierBenefit = inRule.tierBenefits[tier];
          const standardDed = tierBenefit?.deductible ?? 500;
          const cap = (isRetiree && inRule.annualCapRetiree) ? inRule.annualCapRetiree : inRule.annualCap;

          const inpatientCosts = [
            0,
            0.001,
            0.01,
            Math.max(0, standardDed * 0.5),
            standardDed,
            standardDed + 0.01,
            cap * 0.5,
            cap,
            cap + 10000,
            1000000,
            100000000
          ];

          for (const cost of inpatientCosts) {
            const res = calculateReimbursement({
              cityCode,
              insuranceType: insType,
              isRetiree,
              treatmentType: 'inpatient',
              hospitalTier: tier,
              totalCost: cost
            }, city);

            const b = res.breakdown;
            const actualTotal = b.totalCost;
            const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
            assertClose(sum, actualTotal, 0.01, `Inpatient conservation in ${city.cityName} (${cityCode})`);
            recordAssert(b.totalReimbursed >= 0 && b.totalReimbursed <= actualTotal, `Inpatient totalReimbursed bounded in ${cityCode}`);
            recordAssert(b.personalPayTotal >= 0 && b.personalPayTotal <= actualTotal, `Inpatient personalPayTotal bounded in ${cityCode}`);

            // Decomposition check:
            // When catastrophic insurance deductible is 0 (e.g., Shanghai resident), catastrophic insurance
            // reimburses part of the out-of-pocket eligible cost, reducing actual personal payment below nominal deductible.
            if (b.personalPayTotal >= b.personalDeductiblePaid + b.nonInsuranceCost + b.classBPriorPay) {
              const decompSum = Math.round((b.personalDeductiblePaid + b.personalSpanCoPay + b.nonInsuranceCost + b.classBPriorPay) * 100) / 100;
              assertClose(decompSum, b.personalPayTotal, 0.01, `Inpatient personal pay decomposition in ${cityCode}`);
            } else {
              // When catastrophic insurance absorbs part of the deductible: personalSpanCoPay is 0, and personalPayTotal < personalDeductiblePaid
              recordAssert(b.personalSpanCoPay === 0, `personalSpanCoPay must be 0 when catastrophic covers deductible in ${cityCode}`);
              recordAssert(b.catastrophicReimbursed > 0, `catastrophicReimbursed must be positive when personalPayTotal < personalDeductiblePaid in ${cityCode}`);
            }
          }
        }
      }
    }
  }
  finishSuite();

  // ============================================================================
  // SUITE 2: Massive Monte-Carlo Pseudo-Random Chaos Fuzzing (200,000 Evaluations)
  // ============================================================================
  startSuite('Suite 2: Adversarial Monte-Carlo Pseudo-Random Chaos Fuzzing (200,000 Probes)');

  const rng = new SeededRNG(20261026);
  const totalMonteCarloProbes = 200000;

  for (let i = 0; i < totalMonteCarloProbes; i++) {
    const city = rng.choice(allCities);
    const insuranceType = rng.choice(insuranceTypes);
    const isRetiree = insuranceType === 'employee' ? rng.next() > 0.5 : false;
    const treatmentType: TreatmentType = rng.next() > 0.5 ? 'inpatient' : 'outpatient';
    const hospitalTier = rng.choice(hospitalTiers);
    const remoteStatus = rng.choice(remoteStatuses);
    const hospitalizationCount = rng.int(1, 10);

    // Multi-modal cost distribution across log scale [0, 100,000,000]
    const bucket = rng.int(1, 5);
    let totalCost: number;
    switch (bucket) {
      case 1: totalCost = rng.range(0, 10); break;
      case 2: totalCost = rng.range(10, 1000); break;
      case 3: totalCost = rng.range(1000, 50000); break;
      case 4: totalCost = rng.range(50000, 1000000); break;
      case 5:
      default: totalCost = rng.range(1000000, 100000000); break;
    }
    totalCost = Math.round(totalCost * 100) / 100;

    // Optional nonInsuranceCost and classBCost
    let nonInsuranceCost = 0;
    let classBCost = 0;
    let classBSelfPayRatio = 0.05;
    if (rng.next() > 0.4 && totalCost > 0) {
      nonInsuranceCost = Math.round(rng.range(0, totalCost * 0.4) * 100) / 100;
      const rem = totalCost - nonInsuranceCost;
      if (rem > 0 && rng.next() > 0.5) {
        classBCost = Math.round(rng.range(0, rem * 0.5) * 100) / 100;
        classBSelfPayRatio = Math.round(rng.range(0.01, 0.30) * 100) / 100;
      }
    }

    const req: CalculateRequest = {
      cityCode: city.cityCode,
      insuranceType,
      isRetiree,
      treatmentType,
      hospitalTier,
      remoteStatus,
      hospitalizationCount,
      totalCost,
      nonInsuranceCost,
      classBCost,
      classBSelfPayRatio
    };

    const res = calculateReimbursement(req, city);
    const b = res.breakdown;
    const actualCost = b.totalCost;

    // Mathematical invariant assertions
    const fundSum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
    assertClose(fundSum, actualCost, 0.01, `Monte-Carlo probe ${i} fund conservation`);
    recordAssert(b.totalReimbursed >= 0 && b.totalReimbursed <= actualCost, `Monte-Carlo probe ${i} reimbursed bounds`);
    recordAssert(b.personalPayTotal >= 0 && b.personalPayTotal <= actualCost, `Monte-Carlo probe ${i} personal pay bounds`);
    recordAssert(Number.isFinite(b.totalReimbursed) && Number.isFinite(b.personalPayTotal), `Monte-Carlo probe ${i} finite numbers`);
  }
  finishSuite();

  // ============================================================================
  // SUITE 3: Multi-City Simulation Opposite-Number Dual Symmetry (Delta R = -Delta P)
  // ============================================================================
  startSuite('Suite 3: Multi-City Simulation Opposite-Number Dual Symmetry (Delta R = -Delta P)');

  // 3.1 Verify popularMultiCityPresets
  console.log('  -> Testing popular presets across diverse cost and status permutations...');
  const presetCosts = [500, 3000, 15000, 80000, 500000, 10000000];

  for (const preset of popularMultiCityPresets) {
    for (const cost of presetCosts) {
      for (const insType of insuranceTypes) {
        const scenario: ComparisonScenarioInput = {
          insuranceType: insType,
          isRetiree: insType === 'employee',
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: 'local',
          totalCost: cost
        };

        const simRes = runMultiCitySimulation(preset.cities, scenario);
        recordAssert(simRes.allConserved, `Preset ${preset.id} allConserved at cost ${cost}`);

        const baseline = simRes.cities[0];
        for (let i = 0; i < simRes.cities.length; i++) {
          const o = simRes.cities[i];
          recordAssert(o.isConserved, `Preset ${preset.id} city ${i} conserved`);

          // Verify Delta symmetry: Delta R + Delta P === 0 <=> Delta R === -Delta P
          const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
          assertClose(deltaSum, 0, 0.01, `Preset ${preset.id} city ${i} dual symmetry: Delta R + Delta P === 0`);

          const expectedDeltaR = Math.round((o.totalReimbursed - baseline.totalReimbursed) * 100) / 100;
          const expectedDeltaP = Math.round((o.personalPayTotal - baseline.personalPayTotal) * 100) / 100;
          assertClose(o.deltaReimbursedVsCityA, expectedDeltaR, 0.01, `Preset ${preset.id} city ${i} deltaReimbursed exact match`);
          assertClose(o.deltaPersonalPayVsCityA, expectedDeltaP, 0.01, `Preset ${preset.id} city ${i} deltaPersonalPay exact match`);
          assertClose(o.deltaReimbursedVsCityA, -o.deltaPersonalPayVsCityA, 0.01, `Preset ${preset.id} city ${i} deltaR === -deltaP`);

          // 0-Emoji audit on specialNotes
          for (const note of o.specialNotes) {
            recordAssert(!EMOJI_REGEX.test(note), `0-Emoji compliance in specialNotes for ${o.cityCode}`);
          }
        }

        // Verify Max Delta Spread consistency: maxReimbursementDelta === maxPersonalPayDelta
        assertClose(
          simRes.maxReimbursementDelta,
          simRes.maxPersonalPayDelta,
          0.01,
          `Preset ${preset.id} max spread consistency: maxReimbursementDelta === maxPersonalPayDelta`
        );

        // Verify 0-Emoji in keyInsights
        for (const insight of simRes.keyInsights) {
          recordAssert(!EMOJI_REGEX.test(insight), `0-Emoji compliance in keyInsights for preset ${preset.id}`);
        }
      }
    }
  }

  // 3.2 Dynamic Inter-Provincial Permutations & Dyads/Triads Probing (10,000 simulations)
  console.log('  -> Executing 10,000 randomized and permutation multi-city simulations...');
  const simRng = new SeededRNG(20261027);
  const totalSimulations = 10000;

  for (let s = 0; s < totalSimulations; s++) {
    const cityCount = simRng.next() > 0.5 ? 3 : 2;
    const chosenCities: string[] = [];
    while (chosenCities.length < cityCount) {
      const c = simRng.choice(allCities).cityCode;
      if (!chosenCities.includes(c)) chosenCities.push(c);
    }

    const insType = simRng.choice(insuranceTypes);
    const isRetiree = insType === 'employee' ? simRng.next() > 0.5 : false;
    const treatmentType: TreatmentType = simRng.next() > 0.5 ? 'inpatient' : 'outpatient';
    const hospitalTier = simRng.choice(hospitalTiers);
    const remoteStatus = simRng.choice(remoteStatuses);
    const totalCost = Math.round(simRng.range(50, 5000000) * 100) / 100;
    const hospitalizationCount = simRng.int(1, 4);

    const scenario: ComparisonScenarioInput = {
      insuranceType: insType,
      isRetiree,
      treatmentType,
      hospitalTier,
      remoteStatus,
      totalCost,
      hospitalizationCount
    };

    const simRes = runMultiCitySimulation(chosenCities, scenario);
    recordAssert(simRes.allConserved, `Sim ${s} allConserved`);

    const baseline = simRes.cities[0];
    for (let i = 0; i < simRes.cities.length; i++) {
      const o = simRes.cities[i];
      recordAssert(o.isConserved, `Sim ${s} city ${i} isConserved`);

      // Strict Delta Symmetry: Delta R_i + Delta P_i === 0
      const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
      assertClose(deltaSum, 0, 0.01, `Sim ${s} city ${i} Delta R + Delta P === 0`);
      assertClose(o.deltaReimbursedVsCityA, -o.deltaPersonalPayVsCityA, 0.01, `Sim ${s} city ${i} Delta R === -Delta P`);
    }

    // Spread invariant
    assertClose(simRes.maxReimbursementDelta, simRes.maxPersonalPayDelta, 0.01, `Sim ${s} spread invariant`);
  }
  finishSuite();

  // ============================================================================
  // SUITE 4: Repeated Hospitalization Diminishing Deductible Deep Stress Probing
  // ============================================================================
  startSuite('Suite 4: Repeated Hospitalization Diminishing Deductible Probing');

  const benchmarkRepeatCities = [
    '370100', // Jinan (half_second_zero_third)
    '610100', // Xi'an
    '510100', // Chengdu
    '420100', // Wuhan
    '340100', // Hefei
    '500100', // Chongqing
    '110100', // Beijing
    '310100', // Shanghai
    '610900', // Ankang
    '611000'  // Shangluo
  ];

  const admissions = [1, 2, 3, 4, 5, 10, 20, 50, 100];

  for (const cityCode of benchmarkRepeatCities) {
    const city = getCityDataByCode(cityCode);
    if (!city) continue;

    for (const insType of insuranceTypes) {
      for (const tier of hospitalTiers) {
        let prevAppliedDeductible = Infinity;

        for (const count of admissions) {
          const res = calculateReimbursement({
            cityCode,
            insuranceType: insType,
            treatmentType: 'inpatient',
            hospitalTier: tier,
            totalCost: 20000,
            hospitalizationCount: count
          }, city);

          const b = res.breakdown;

          // 1. Monotonic non-increasing applied deductible
          recordAssert(
            b.appliedDeductible <= prevAppliedDeductible + 0.001,
            `Monotonic non-increasing applied deductible for ${cityCode} tier ${tier} count ${count} (prev=${prevAppliedDeductible}, curr=${b.appliedDeductible})`
          );
          prevAppliedDeductible = b.appliedDeductible;

          // 2. Exact reduction partition: appliedDeductible + deductibleReduction === standardDeductible
          const dedSum = Math.round((b.appliedDeductible + b.deductibleReduction) * 100) / 100;
          assertClose(dedSum, b.standardDeductible, 0.01, `Deductible partition in ${cityCode} tier ${tier} count ${count}`);

          // 3. Fund conservation invariant
          const fundSum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
          assertClose(fundSum, b.totalCost, 0.01, `Repeated admission fund conservation in ${cityCode} count ${count}`);
        }
      }
    }
  }
  finishSuite();

  // ============================================================================
  // SUITE 5: Outpatient Per-Visit vs Annual Deductible Invariant Probing
  // ============================================================================
  startSuite('Suite 5: Outpatient Per-Visit vs Annual Deductible Probing');

  const perVisitCities = ['611000', '610300']; // Shangluo, Baoji
  const annualCities = ['110100', '610100', '310100']; // Beijing, Xi'an, Shanghai

  const testCities = [...perVisitCities, ...annualCities];
  const outpatientCosts = [0, 5, 50, 100, 200, 500, 800, 1500, 3000, 5000, 10000];

  for (const cityCode of testCities) {
    const city = getCityDataByCode(cityCode);
    if (!city) continue;

    for (const insType of insuranceTypes) {
      for (const tier of hospitalTiers) {
        for (const cost of outpatientCosts) {
          const res = calculateReimbursement({
            cityCode,
            insuranceType: insType,
            treatmentType: 'outpatient',
            hospitalTier: tier,
            totalCost: cost
          }, city);

          const b = res.breakdown;
          const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
          assertClose(sum, b.totalCost, 0.01, `Outpatient deductible probe in ${cityCode} at cost ${cost}`);
        }
      }
    }
  }
  finishSuite();

  // ============================================================================
  // SUITE 6: Extreme Floating-Point & Precision Stress Suite
  // ============================================================================
  startSuite('Suite 6: Extreme Floating-Point & Precision Stress Suite');

  const precisionCosts = [
    0.0000001,
    0.0001,
    0.001,
    0.0049,
    0.005,
    0.009999,
    0.01,
    0.0100001,
    0.0149,
    0.015,
    0.999999,
    9999999.99,
    10000000.00,
    99999999.99,
    100000000.00
  ];

  const floatingRatios = [0.033333333, 0.05, 0.07142857, 0.10, 0.15555555, 0.20, 0.33333333];

  for (const city of [allCities[0], allCities[50], allCities[150], allCities[300]]) {
    for (const pCost of precisionCosts) {
      for (const fRatio of floatingRatios) {
        const res = calculateReimbursement({
          cityCode: city.cityCode,
          insuranceType: 'employee',
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          totalCost: pCost,
          classBCost: pCost * 0.3,
          classBSelfPayRatio: fRatio
        }, city);

        const b = res.breakdown;
        const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
        assertClose(sum, b.totalCost, 0.01, `Precision test in ${city.cityCode} cost=${pCost} ratio=${fRatio}`);

        // Check for NaN or -0
        recordAssert(!Number.isNaN(b.totalReimbursed), `totalReimbursed is not NaN`);
        recordAssert(!Number.isNaN(b.personalPayTotal), `personalPayTotal is not NaN`);
        recordAssert(Object.is(b.totalReimbursed, -0) === false, `totalReimbursed is not negative zero`);
        recordAssert(Object.is(b.personalPayTotal, -0) === false, `personalPayTotal is not negative zero`);
      }
    }
  }
  finishSuite();

  // ============================================================================
  // SUITE 7: 0-Emoji Static Scanner across Output & Insights
  // ============================================================================
  startSuite('Suite 7: 0-Emoji Static Scanner across Output & Insights');

  for (const city of allCities) {
    recordAssert(!EMOJI_REGEX.test(city.cityName), `City name 0-Emoji: ${city.cityName}`);
    recordAssert(!EMOJI_REGEX.test(city.provinceName), `Province name 0-Emoji: ${city.provinceName}`);
    for (const doc of city.sourceDocs) {
      recordAssert(!EMOJI_REGEX.test(doc.title), `Doc title 0-Emoji: ${doc.title}`);
      recordAssert(!EMOJI_REGEX.test(doc.summaryQuote), `Doc summaryQuote 0-Emoji: ${doc.summaryQuote}`);
    }
  }
  finishSuite();

  const totalElapsed = Date.now() - startTime;

  console.log('================================================================================');
  console.log('>>> [EMPIRICAL CHALLENGER GEN 9 FINAL SUMMARY REPORT] <<<');
  console.log('================================================================================');
  console.log(`  Total Checks Executed:  ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:          ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:          ${stats.failedChecks}`);
  console.log(`  Overall Success Rate:   ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log(`  Total Execution Time:   ${totalElapsed}ms`);
  console.log('================================================================================\n');

  return stats;
}

// Standalone execution entry point
if (require.main === module || process.argv.includes('--run')) {
  try {
    const res = runR9EmpiricalChallenger();
    if (res.failedChecks > 0) {
      console.error(`[FATAL] Challenger stress harness encountered ${res.failedChecks} failures.`);
      process.exit(1);
    } else {
      console.log('[SUCCESS] All mathematical invariants and adversarial challenges 100% APPROVED.');
      process.exit(0);
    }
  } catch (err) {
    console.error('[UNHANDLED EXCEPTION in Challenger Harness]:', err);
    process.exit(1);
  }
}
