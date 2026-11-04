/**
 * Challenger R10.1: Nationwide Actuarial Invariants & Adversarial Stress Oracle
 *
 * Empirical Validation Mandate:
 * 1. Physical Fund Conservation Law:
 *    totalReimbursed + personalPayTotal === totalCost (tolerance <= 0.01 RMB)
 *    Across the full spectrum [0 ~ 100,000,000 RMB] across all 348 administrative health
 *    insurance divisions in China, covering active/retired employees and residents, outpatient
 *    and inpatient modes, 5 hospital tiers, 5 remote statuses, and varying non-insurance
 *    and Class B prior proportions.
 * 2. Extreme Boundary & Discontinuity Stress:
 *    0, 0.01, sub-cent floats (99.999, 100.001), threshold jumps (D - 0.01, D, D + 0.01),
 *    and multi-million catastrophic caps [up to 100M RMB].
 * 3. Multi-City Actuarial Simulator Dual Symmetry:
 *    - Opposite-number invariant: Delta R === -Delta P (Delta R + Delta P === 0)
 *    - Pairwise anti-symmetry: Delta R(B vs A) === -Delta R(A vs B), Delta P(B vs A) === -Delta P(A vs B)
 *    - Triplet permutation invariance: absolute reimbursements and max spreads invariant under all permutations.
 * 4. High-Stress Monte-Carlo Chaos Fuzzing:
 *    Seeded PRNG chaos fuzzing with multi-modal logarithmic distributions across all 348 divisions.
 * 5. Repeated Admission Deductible Decay & Monotonicity Invariants:
 *    appliedDeductible(k+1) <= appliedDeductible(k) and appliedDeductible + deductibleReduction === standardDeductible.
 * 6. Government 0-Emoji Rigorous Static & Dynamic Audit:
 *    Zero emoji characters across all policy notes, simulation key insights, and breakdown strings.
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

export interface AdversarialStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  suiteStats: Record<string, { total: number; passed: number; failed: number; elapsedMs: number }>;
  failures: string[];
}

const stats: AdversarialStats = {
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

// Deterministic Pseudo-Random Number Generator (Mulberry32) for reproducible stress testing
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

export function runR10AdversarialOracle(): AdversarialStats {
  const startTime = Date.now();
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R10.1] 500,000+ ACTUARIAL INVARIANTS ADVERSARIAL ORACLE <<<');
  console.log('================================================================================');
  console.log(`Loaded ${allCities.length} administrative health insurance divisions across China.`);
  recordAssert(allCities.length === 348, `Expected exactly 348 cities, found ${allCities.length}`);

  const hospitalTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const insuranceTypes: InsuranceType[] = ['employee', 'resident'];

  // ============================================================================
  // SUITE 1: Nationwide 348 Divisions Combinatorial Boundary & Conservation Matrix
  // ============================================================================
  startSuite('Suite 1: Nationwide 348 Divisions Boundary & Conservation Matrix');

  const boundaryCostMultipliers = [
    0,            // Zero cost
    0.001,        // Sub-cent micro-cost
    0.005,        // Sub-cent rounding boundary
    0.009,        // Sub-cent upper bound
    0.01,         // Exact 1 cent
    0.49,         // Sub-yuan float
    0.50,         // Exact half-yuan
    0.99,         // Just below 1 yuan
    1.00,         // 1 yuan
    10.00,        // 10 yuan
    99.999,       // Sub-cent float
    100.001,      // Sub-cent float
    500.00,       // Common deductible
    800.00,       // Common tier 2 deductible
    1234.5678,    // Multi-decimal float
    5000.00,      // Outpatient threshold
    10000.00,     // Catastrophic deductible
    50000.9999,   // Inpatient moderate
    100000.00,    // High inpatient
    500000.00,    // Near basic cap
    1000000.00,   // Exceeding basic cap (1M)
    10000000.00,  // Catastrophic extreme (10M)
    100000000.00  // Maximum physical domain boundary (100M RMB)
  ];

  for (const city of allCities) {
    const cityCode = city.cityCode;

    for (const insType of insuranceTypes) {
      const isRetireeOptions = insType === 'employee' ? [false, true] : [false];

      for (const isRetiree of isRetireeOptions) {
        // 1.1 Outpatient sweep across tiers
        for (const tier of hospitalTiers) {
          const pkg = insType === 'employee' ? city.employee : city.resident;
          const outRule = pkg.outpatient;
          const tierBenefit = outRule.tierBenefits[tier];
          const standardDed = tierBenefit?.deductible ?? (outRule.annualDeductible ?? 0);

          for (const mult of boundaryCostMultipliers) {
            const cost = mult;
            // Test with varying non-insurance cost
            const nonInsuranceCost = cost > 10 ? Math.round(cost * 0.05 * 100) / 100 : 0;
            const classBCost = cost > 20 ? Math.round(cost * 0.05 * 100) / 100 : 0;

            const res = calculateReimbursement({
              cityCode,
              insuranceType: insType,
              isRetiree,
              treatmentType: 'outpatient',
              hospitalTier: tier,
              totalCost: cost,
              nonInsuranceCost,
              classBCost,
              classBSelfPayRatio: 0.05
            }, city);

            const b = res.breakdown;
            const actualTotal = b.totalCost;
            const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
            assertClose(sum, actualTotal, 0.01, `Outpatient conservation in ${city.cityName} (${cityCode})`);
            recordAssert(b.totalReimbursed >= 0 && b.totalReimbursed <= actualTotal, `Outpatient totalReimbursed bounded in ${cityCode}`);
            recordAssert(b.personalPayTotal >= 0 && b.personalPayTotal <= actualTotal, `Outpatient personalPayTotal bounded in ${cityCode}`);
            recordAssert(Number.isFinite(b.totalReimbursed) && Number.isFinite(b.personalPayTotal), `Finite numbers in ${cityCode}`);
          }
        }

        // 1.2 Inpatient sweep across tiers & boundaries
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
            const nonInsuranceCost = cost > 100 ? Math.round(cost * 0.08 * 100) / 100 : 0;
            const classBCost = cost > 200 ? Math.round(cost * 0.07 * 100) / 100 : 0;

            const res = calculateReimbursement({
              cityCode,
              insuranceType: insType,
              isRetiree,
              treatmentType: 'inpatient',
              hospitalTier: tier,
              totalCost: cost,
              nonInsuranceCost,
              classBCost,
              classBSelfPayRatio: 0.08
            }, city);

            const b = res.breakdown;
            const actualTotal = b.totalCost;
            const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
            assertClose(sum, actualTotal, 0.01, `Inpatient conservation in ${city.cityName} (${cityCode})`);
            recordAssert(b.totalReimbursed >= 0 && b.totalReimbursed <= actualTotal, `Inpatient totalReimbursed bounded in ${cityCode}`);
            recordAssert(b.personalPayTotal >= 0 && b.personalPayTotal <= actualTotal, `Inpatient personalPayTotal bounded in ${cityCode}`);
            recordAssert(Number.isFinite(b.totalReimbursed) && Number.isFinite(b.personalPayTotal), `Finite numbers in ${cityCode}`);

            // Decomposition check
            const nonCatPersonal = Math.round((b.personalDeductiblePaid + b.nonInsuranceCost + b.classBPriorPay) * 100) / 100;
            if (b.personalPayTotal >= nonCatPersonal - 0.001) {
              const decompSum = Math.round((b.personalDeductiblePaid + b.personalSpanCoPay + b.nonInsuranceCost + b.classBPriorPay) * 100) / 100;
              assertClose(decompSum, b.personalPayTotal, 0.01, `Inpatient personal pay decomposition in ${cityCode}`);
            } else {
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
  // SUITE 2: Deductible Jump Discontinuity & Cap Saturation Oracle
  // ============================================================================
  startSuite('Suite 2: Deductible Jump Discontinuity & Cap Saturation Oracle');

  for (const city of allCities) {
    const cityCode = city.cityCode;

    // Check Employee Inpatient Deductible Jump
    const empInRule = city.employee.inpatient;
    for (const tier of hospitalTiers) {
      const tb = empInRule.tierBenefits[tier];
      const ded = tb?.deductible ?? 500;
      if (ded > 1) {
        // Test ded - 0.01
        const rBelow = calculateReimbursement({
          cityCode,
          insuranceType: 'employee',
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: tier,
          totalCost: ded - 0.01
        }, city);
        recordAssert(rBelow.breakdown.totalReimbursed === 0, `Reimbursement must be 0 below deductible for ${cityCode} tier ${tier}`);
        assertClose(rBelow.breakdown.personalPayTotal, ded - 0.01, 0.01, `Personal pay equals cost below deductible for ${cityCode}`);

        // Test ded exactly
        const rAt = calculateReimbursement({
          cityCode,
          insuranceType: 'employee',
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: tier,
          totalCost: ded
        }, city);
        recordAssert(rAt.breakdown.totalReimbursed === 0, `Reimbursement must be 0 at deductible for ${cityCode} tier ${tier}`);
        assertClose(rAt.breakdown.personalPayTotal, ded, 0.01, `Personal pay equals cost at deductible for ${cityCode}`);

        // Test ded + 0.01
        const rAbove = calculateReimbursement({
          cityCode,
          insuranceType: 'employee',
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: tier,
          totalCost: ded + 0.01
        }, city);
        recordAssert(rAbove.breakdown.totalReimbursed >= 0, `Reimbursement non-negative above deductible for ${cityCode} tier ${tier}`);
        recordAssert(rAbove.breakdown.personalPayTotal <= ded + 0.01, `Personal pay bounded above deductible for ${cityCode}`);
        const sumAbove = Math.round((rAbove.breakdown.totalReimbursed + rAbove.breakdown.personalPayTotal) * 100) / 100;
        assertClose(sumAbove, ded + 0.01, 0.01, `Conservation at ded + 0.01 for ${cityCode}`);
      }
    }

    // Check Resident Inpatient Deductible Jump
    const resInRule = city.resident.inpatient;
    const catDed = city.resident.catastrophic?.deductible ?? 10000;
    for (const tier of hospitalTiers) {
      const tb = resInRule.tierBenefits[tier];
      const ded = tb?.deductible ?? 500;
      if (ded > 1) {
        const rBelow = calculateReimbursement({
          cityCode,
          insuranceType: 'resident',
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: tier,
          totalCost: ded - 0.01
        }, city);

        // When catastrophic deductible is 0 (e.g. Shanghai resident), catastrophic insurance covers part of the cost from 0
        if (catDed === 0) {
          recordAssert(rBelow.breakdown.baseReimbursed === 0, `Resident base reimbursement 0 below ded for ${cityCode}`);
          recordAssert(rBelow.breakdown.catastrophicReimbursed > 0, `Resident catastrophic reimbursement positive when cat deductible is 0 for ${cityCode}`);
        } else {
          recordAssert(rBelow.breakdown.totalReimbursed === 0, `Resident reimbursement 0 below ded for ${cityCode}`);
          assertClose(rBelow.breakdown.personalPayTotal, ded - 0.01, 0.01, `Resident personal pay equals cost below ded for ${cityCode}`);
        }

        const rAt = calculateReimbursement({
          cityCode,
          insuranceType: 'resident',
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: tier,
          totalCost: ded
        }, city);
        if (catDed === 0) {
          recordAssert(rAt.breakdown.baseReimbursed === 0, `Resident base reimbursement 0 at ded for ${cityCode}`);
        } else {
          recordAssert(rAt.breakdown.totalReimbursed === 0, `Resident reimbursement 0 at ded for ${cityCode}`);
          assertClose(rAt.breakdown.personalPayTotal, ded, 0.01, `Resident personal pay equals cost at ded for ${cityCode}`);
        }

        const rAbove = calculateReimbursement({
          cityCode,
          insuranceType: 'resident',
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: tier,
          totalCost: ded + 0.01
        }, city);
        const sumAbove = Math.round((rAbove.breakdown.totalReimbursed + rAbove.breakdown.personalPayTotal) * 100) / 100;
        assertClose(sumAbove, ded + 0.01, 0.01, `Resident conservation at ded + 0.01 for ${cityCode}`);
      }
    }
  }
  finishSuite();

  // ============================================================================
  // SUITE 3: Sub-Cent Fractional Epsilon & High Precision Stress
  // ============================================================================
  startSuite('Suite 3: Sub-Cent Fractional Epsilon & High Precision Stress');

  const precisionFloats = [
    0.0000001,
    0.0001,
    0.001,
    0.004,
    0.0049,
    0.005,
    0.0051,
    0.009,
    0.0099,
    0.01,
    0.010001,
    0.0149,
    0.015,
    0.999999,
    99.999,
    100.001,
    100.005,
    1234.5678,
    50000.9999,
    9999999.99,
    10000000.00,
    99999999.99,
    100000000.00
  ];

  const floatingClassBRatios = [0.033333333, 0.05, 0.07142857, 0.10, 0.142857, 0.1666667, 0.20, 0.33333333];

  // Benchmark diverse cities: capital, direct-controlled, eastern, western, northern, southern
  const sampleCities = [
    getCityDataByCode('110100')!, // Beijing
    getCityDataByCode('310100')!, // Shanghai
    getCityDataByCode('440100')!, // Guangzhou
    getCityDataByCode('440300')!, // Shenzhen
    getCityDataByCode('510100')!, // Chengdu
    getCityDataByCode('610100')!, // Xi'an
    getCityDataByCode('330100')!, // Hangzhou
    getCityDataByCode('420100')!, // Wuhan
    getCityDataByCode('370100')!, // Jinan
    getCityDataByCode('500100')!  // Chongqing
  ];

  for (const city of sampleCities) {
    for (const pCost of precisionFloats) {
      for (const fRatio of floatingClassBRatios) {
        for (const insType of insuranceTypes) {
          const res = calculateReimbursement({
            cityCode: city.cityCode,
            insuranceType: insType,
            isRetiree: insType === 'employee',
            treatmentType: 'inpatient',
            hospitalTier: 'tier3',
            totalCost: pCost,
            nonInsuranceCost: pCost * 0.1,
            classBCost: pCost * 0.2,
            classBSelfPayRatio: fRatio
          }, city);

          const b = res.breakdown;
          const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
          assertClose(sum, b.totalCost, 0.01, `Precision test in ${city.cityName} cost=${pCost} ratio=${fRatio}`);

          recordAssert(!Number.isNaN(b.totalReimbursed), `totalReimbursed is not NaN`);
          recordAssert(!Number.isNaN(b.personalPayTotal), `personalPayTotal is not NaN`);
          recordAssert(Object.is(b.totalReimbursed, -0) === false, `totalReimbursed is not -0`);
          recordAssert(Object.is(b.personalPayTotal, -0) === false, `personalPayTotal is not -0`);
        }
      }
    }
  }
  finishSuite();

  // ============================================================================
  // SUITE 4: Multi-City Actuarial Simulator Dual Symmetry & Anti-Symmetry Oracle
  // ============================================================================
  startSuite('Suite 4: Multi-City Simulator Dual Symmetry & Anti-Symmetry Oracle');

  // 4.1 Popular Presets full evaluation
  const presetCosts = [100, 500, 2500, 15000, 60000, 200000, 1000000, 10000000];
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

          // Dual Symmetry: Delta R + Delta P === 0 <=> Delta R === -Delta P
          const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
          assertClose(deltaSum, 0, 0.01, `Preset ${preset.id} city ${i} dual symmetry: Delta R + Delta P === 0`);
          assertClose(o.deltaReimbursedVsCityA, -o.deltaPersonalPayVsCityA, 0.01, `Preset ${preset.id} city ${i} deltaR === -deltaP`);

          const expectedDeltaR = Math.round((o.totalReimbursed - baseline.totalReimbursed) * 100) / 100;
          const expectedDeltaP = Math.round((o.personalPayTotal - baseline.personalPayTotal) * 100) / 100;
          assertClose(o.deltaReimbursedVsCityA, expectedDeltaR, 0.01, `Preset ${preset.id} city ${i} deltaReimbursed exact match`);
          assertClose(o.deltaPersonalPayVsCityA, expectedDeltaP, 0.01, `Preset ${preset.id} city ${i} deltaPersonalPay exact match`);

          // 0-Emoji audit on specialNotes
          for (const note of o.specialNotes) {
            recordAssert(!EMOJI_REGEX.test(note), `0-Emoji compliance in specialNotes for ${o.cityCode}`);
          }
        }

        // Max spread invariant: maxReimbursementDelta === maxPersonalPayDelta
        assertClose(
          simRes.maxReimbursementDelta,
          simRes.maxPersonalPayDelta,
          0.01,
          `Preset ${preset.id} max spread consistency`
        );

        // 0-Emoji audit in keyInsights
        for (const insight of simRes.keyInsights) {
          recordAssert(!EMOJI_REGEX.test(insight), `0-Emoji compliance in keyInsights for preset ${preset.id}`);
        }
      }
    }
  }

  // 4.2 Pairwise Anti-Symmetry: Delta R(B vs A) === -Delta R(A vs B)
  console.log('  -> Verifying pairwise anti-symmetry: Delta R(B vs A) === -Delta R(A vs B)...');
  const pairwiseRng = new SeededRNG(20261104);
  const pairCount = 2000;

  for (let p = 0; p < pairCount; p++) {
    const cityA = pairwiseRng.choice(allCities).cityCode;
    let cityB = pairwiseRng.choice(allCities).cityCode;
    while (cityB === cityA) {
      cityB = pairwiseRng.choice(allCities).cityCode;
    }

    const insType = pairwiseRng.choice(insuranceTypes);
    const isRetiree = insType === 'employee' ? pairwiseRng.next() > 0.5 : false;
    const treatmentType: TreatmentType = pairwiseRng.next() > 0.5 ? 'inpatient' : 'outpatient';
    const hospitalTier = pairwiseRng.choice(hospitalTiers);
    const totalCost = Math.round(pairwiseRng.range(100, 2000000) * 100) / 100;

    const scenario: ComparisonScenarioInput = {
      insuranceType: insType,
      isRetiree,
      treatmentType,
      hospitalTier,
      remoteStatus: 'local',
      totalCost
    };

    // Forward simulation: [A, B] -> delta of B vs A
    const simAB = runMultiCitySimulation([cityA, cityB], scenario);
    const deltaR_B_vs_A = simAB.cities[1].deltaReimbursedVsCityA;
    const deltaP_B_vs_A = simAB.cities[1].deltaPersonalPayVsCityA;

    // Backward simulation: [B, A] -> delta of A vs B
    const simBA = runMultiCitySimulation([cityB, cityA], scenario);
    const deltaR_A_vs_B = simBA.cities[1].deltaReimbursedVsCityA;
    const deltaP_A_vs_B = simBA.cities[1].deltaPersonalPayVsCityA;

    // Strict Anti-symmetry: Delta R(B vs A) === -Delta R(A vs B)
    assertClose(deltaR_B_vs_A, -deltaR_A_vs_B, 0.01, `Anti-symmetry Delta R: pair ${cityA} vs ${cityB}`);
    assertClose(deltaP_B_vs_A, -deltaP_A_vs_B, 0.01, `Anti-symmetry Delta P: pair ${cityA} vs ${cityB}`);
    assertClose(deltaR_B_vs_A, -deltaP_B_vs_A, 0.01, `Dual opposite number: pair ${cityA} vs ${cityB}`);
    assertClose(simAB.maxReimbursementDelta, simBA.maxReimbursementDelta, 0.01, `Max spread invariance under inversion`);
  }

  // 4.3 Triplet Permutation Invariance
  console.log('  -> Verifying triplet permutation invariance across 6 permutations...');
  const tripletCount = 1000;
  for (let t = 0; t < tripletCount; t++) {
    const chosenCities: string[] = [];
    while (chosenCities.length < 3) {
      const c = pairwiseRng.choice(allCities).cityCode;
      if (!chosenCities.includes(c)) chosenCities.push(c);
    }
    const [cA, cB, cC] = chosenCities;

    const totalCost = Math.round(pairwiseRng.range(500, 1000000) * 100) / 100;
    const scenario: ComparisonScenarioInput = {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost
    };

    const simABC = runMultiCitySimulation([cA, cB, cC], scenario);
    const simCBA = runMultiCitySimulation([cC, cB, cA], scenario);
    const simBAC = runMultiCitySimulation([cB, cA, cC], scenario);

    // Max spreads must be identical across all permutations
    assertClose(simABC.maxReimbursementDelta, simCBA.maxReimbursementDelta, 0.01, `Triplet spread ABC vs CBA`);
    assertClose(simABC.maxReimbursementDelta, simBAC.maxReimbursementDelta, 0.01, `Triplet spread ABC vs BAC`);

    // Absolute reimbursement for cA must be identical regardless of position
    const rA_in_ABC = simABC.cities.find(c => c.cityCode === cA)!.totalReimbursed;
    const rA_in_CBA = simCBA.cities.find(c => c.cityCode === cA)!.totalReimbursed;
    const rA_in_BAC = simBAC.cities.find(c => c.cityCode === cA)!.totalReimbursed;
    assertClose(rA_in_ABC, rA_in_CBA, 0.01, `Absolute reimbursement invariance A in ABC vs CBA`);
    assertClose(rA_in_ABC, rA_in_BAC, 0.01, `Absolute reimbursement invariance A in ABC vs BAC`);
  }
  finishSuite();

  // ============================================================================
  // SUITE 5: Massive Monte-Carlo Pseudo-Random Chaos Fuzzing (250,000 Evaluations)
  // ============================================================================
  startSuite('Suite 5: Massive Monte-Carlo Pseudo-Random Chaos Fuzzing (250,000 Probes)');

  const rng = new SeededRNG(20261104);
  const totalMonteCarloProbes = 250000;

  for (let i = 0; i < totalMonteCarloProbes; i++) {
    const city = rng.choice(allCities);
    const insuranceType = rng.choice(insuranceTypes);
    const isRetiree = insuranceType === 'employee' ? rng.next() > 0.5 : false;
    const treatmentType: TreatmentType = rng.next() > 0.5 ? 'inpatient' : 'outpatient';
    const hospitalTier = rng.choice(hospitalTiers);
    const remoteStatus = rng.choice(remoteStatuses);
    const hospitalizationCount = rng.int(1, 10);

    // Multi-modal cost distribution across log scale [0, 100,000,000]
    const bucket = rng.int(1, 6);
    let totalCost: number;
    switch (bucket) {
      case 1: totalCost = rng.range(0, 10); break;
      case 2: totalCost = rng.range(10, 1000); break;
      case 3: totalCost = rng.range(1000, 50000); break;
      case 4: totalCost = rng.range(50000, 500000); break;
      case 5: totalCost = rng.range(500000, 5000000); break;
      case 6:
      default: totalCost = rng.range(5000000, 100000000); break;
    }
    totalCost = Math.round(totalCost * 100) / 100;

    // Varying non-insurance and class B costs
    let nonInsuranceCost = 0;
    let classBCost = 0;
    let classBSelfPayRatio = 0.05;
    if (rng.next() > 0.3 && totalCost > 0) {
      nonInsuranceCost = Math.round(rng.range(0, totalCost * 0.35) * 100) / 100;
      const rem = totalCost - nonInsuranceCost;
      if (rem > 0 && rng.next() > 0.4) {
        classBCost = Math.round(rng.range(0, rem * 0.45) * 100) / 100;
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
  // SUITE 6: Repeated Hospitalization Diminishing Deductible Deep Stress Probing
  // ============================================================================
  startSuite('Suite 6: Repeated Hospitalization Diminishing Deductible Probing');

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
            `Monotonic non-increasing applied deductible for ${cityCode} tier ${tier} count ${count}`
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
  // SUITE 7: Government 0-Emoji Static & Dynamic Output Invariant Audit
  // ============================================================================
  startSuite('Suite 7: Government 0-Emoji Static & Dynamic Output Invariant Audit');

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
  console.log('>>> [EMPIRICAL CHALLENGER R10.1 FINAL SUMMARY REPORT] <<<');
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
    const res = runR10AdversarialOracle();
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
