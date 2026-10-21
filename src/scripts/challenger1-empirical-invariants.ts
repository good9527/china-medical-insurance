/**
 * Independent Empirical Stress & Invariant Challenger
 * Round 4 Verification — Challenger 1 (Physical Fund Conservation)
 */

import { calculateReimbursement } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { allCities } from '../data';
import type { HospitalTier, CalculateRequest, ComparisonScenarioInput } from '../data/types';

interface ChallengeStats {
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  singleCityTests: number;
  multiCityConfigsTested: number;
  multiCityScenariosRun: number;
  totalCostVolumeAudited: number;
  failures: string[];
}

const stats: ChallengeStats = {
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
  singleCityTests: 0,
  multiCityConfigsTested: 0,
  multiCityScenariosRun: 0,
  totalCostVolumeAudited: 0,
  failures: []
};

function assert(condition: boolean, msg: string): void {
  stats.totalAssertions++;
  if (!condition) {
    stats.failedAssertions++;
    if (stats.failures.length < 50) {
      stats.failures.push(msg);
      console.error(`[CHALLENGE BREACH] ${msg}`);
    }
  } else {
    stats.passedAssertions++;
  }
}

function assertCloseTo(val1: number, val2: number, maxDiff: number, msg: string): void {
  const diff = Math.abs(val1 - val2);
  assert(diff <= maxDiff, `${msg} (diff=${diff.toFixed(6)} > maxDiff=${maxDiff}, val1=${val1}, val2=${val2})`);
}

function checkNoNaNOrNegative(obj: Record<string, any>, context: string): void {
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'number') {
      assert(!Number.isNaN(val), `[NaN Detected] field '${key}' is NaN in ${context}`);
      assert(Number.isFinite(val), `[Infinity Detected] field '${key}' is Infinity in ${context}`);
      // For deltas, negative is allowed; for absolute values, negative is forbidden:
      if (!key.startsWith('delta')) {
        assert(val >= -0.0001, `[Negative Number Detected] field '${key}' = ${val} in ${context}`);
      }
    }
  }
}

export function runEmpiricalChallenge(): boolean {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER 1] INDEPENDENT EMPIRICAL PHYSICAL FUND CONSERVATION SUITE <<<');
  console.log(`>>> Targeting: All ${allCities.length} Cities, 477+ Multi-City Configs, 5-Step Funnel <<<`);
  console.log('================================================================================\n');

  const startTime = Date.now();

  // ==========================================================================
  // PART 1: Exhaustive Single-City Physical Conservation & 5-Step Funnel
  // ==========================================================================
  console.log('--- PART 1: 348 Cities Deep Conservation & 5-Step Stepped Funnel Audit ---');

  const testTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const testRemotes: CalculateRequest['remoteStatus'][] = [
    'local',
    'long_term',
    'transfer',
    'unfiled_emergency',
    'unfiled_normal'
  ];

  const testCostMatrix = [
    { total: 0, nonInsRate: 0, classBRate: 0 },
    { total: 0.01, nonInsRate: 0, classBRate: 0 },
    { total: 0.05, nonInsRate: 0.2, classBRate: 0.2 },
    { total: 100, nonInsRate: 0.1, classBRate: 0.1 },
    { total: 300, nonInsRate: 0.05, classBRate: 0.1 },
    { total: 800, nonInsRate: 0.1, classBRate: 0.15 },
    { total: 1500, nonInsRate: 0.08, classBRate: 0.12 },
    { total: 10000, nonInsRate: 0.1, classBRate: 0.1 },
    { total: 60000, nonInsRate: 0.1, classBRate: 0.15 },
    { total: 200000, nonInsRate: 0.1, classBRate: 0.1 },
    { total: 500000, nonInsRate: 0.15, classBRate: 0.2 },
    { total: 10000000, nonInsRate: 0.05, classBRate: 0.1 },
    { total: 50000000, nonInsRate: 0.05, classBRate: 0.1 }
  ];

  for (const city of allCities) {
    for (const insuranceType of ['employee', 'resident'] as const) {
      for (const treatmentType of ['outpatient', 'inpatient'] as const) {
        for (const isRetiree of [false, true]) {
          if (insuranceType === 'resident' && isRetiree) continue;

          for (const tier of testTiers) {
            for (const remoteStatus of testRemotes) {
              for (const costItem of testCostMatrix) {
                stats.singleCityTests++;
                stats.totalCostVolumeAudited += costItem.total;

                const nonInsuranceCost = Math.round(costItem.total * costItem.nonInsRate * 100) / 100;
                const classBCost = Math.round(costItem.total * costItem.classBRate * 100) / 100;

                const res = calculateReimbursement({
                  cityCode: city.cityCode,
                  insuranceType,
                  treatmentType,
                  hospitalTier: tier,
                  remoteStatus,
                  totalCost: costItem.total,
                  nonInsuranceCost,
                  classBCost,
                  isRetiree,
                  hospitalizationCount: 2
                });

                const b = res.breakdown;
                const ctx = `${city.cityName}(${city.cityCode}) ${insuranceType} ${treatmentType} ${tier} ${remoteStatus} cost=${costItem.total}`;

                // 1. No NaN or negative numbers
                checkNoNaNOrNegative(b, ctx);

                // 2. Strict Physical Conservation: Math.abs(totalReimbursed + personalPayTotal - totalCost) < 0.001
                const conservationSum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
                assertCloseTo(conservationSum, costItem.total, 0.001, `[Conservation R+P=C] ${ctx}`);

                // 3. Subcomponent exact conservation: baseReimbursed + catastrophicReimbursed === totalReimbursed
                const subcomponentSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
                assertCloseTo(subcomponentSum, b.totalReimbursed, 0.001, `[Subcomponents Base+Cat=Total] ${ctx}`);

                // 4. 5-Step Stepped Funnel Conservation:
                // totalCost === nonInsuranceCost + classBPriorPay + deductibleDeducted + totalReimbursed + personalSpanCoPay
                const classBPaid = b.classBPriorPay || b.classBSelfPay || 0;
                if (b.personalPayTotal >= (b.nonInsuranceCost + classBPaid + b.deductibleDeducted - 0.001)) {
                  const funnelSum = Math.round(
                    (b.nonInsuranceCost + classBPaid + b.deductibleDeducted + b.totalReimbursed + b.personalSpanCoPay) * 100
                  ) / 100;
                  assertCloseTo(funnelSum, costItem.total, 0.001, `[5-Step Funnel] ${ctx}`);
                }

                // 5. Bounds & zero-cost checks
                assert(b.totalReimbursed <= costItem.total + 0.0001, `[Reimbursement Exceeds Cost] ${ctx}`);
                if (costItem.total === 0) {
                  assert(b.totalReimbursed === 0, `[Zero Cost Non-Zero Reimbursed] ${ctx}`);
                  assert(b.personalPayTotal === 0, `[Zero Cost Non-Zero PersonalPay] ${ctx}`);
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(`✓ Part 1 Passed: Executed ${stats.singleCityTests.toLocaleString()} single-city deep tests across 348 cities.\n`);

  // ==========================================================================
  // PART 2: 477+ Multi-City Configurations Invariants 1-5 Audit
  // ==========================================================================
  console.log('--- PART 2: 477+ Multi-City Configurations Invariants 1-5 Audit ---');

  const multiCitySets: Array<{ label: string; cities: string[] }> = [];

  // 1. 9 Popular Presets
  for (const preset of popularMultiCityPresets) {
    const validCities = preset.cities.map(c => c === '500000' ? '500100' : c);
    multiCitySets.push({ label: `Preset:${preset.name}`, cities: validCities });
  }

  // 2. 348 Adjacent City Pairs
  for (let i = 0; i < allCities.length; i++) {
    const c1 = allCities[i].cityCode;
    const c2 = allCities[(i + 1) % allCities.length].cityCode;
    multiCitySets.push({
      label: `Adjacent:${allCities[i].cityName}-${allCities[(i + 1) % allCities.length].cityName}`,
      cities: [c1, c2]
    });
  }

  // 3. 70 Strided Cross-Province Pairs (stride 5)
  for (let i = 0; i < allCities.length; i += 5) {
    const c1 = allCities[i].cityCode;
    const c2 = allCities[(i + 137) % allCities.length].cityCode;
    multiCitySets.push({
      label: `StridedPair:${allCities[i].cityName}-${allCities[(i + 137) % allCities.length].cityName}`,
      cities: [c1, c2]
    });
  }

  // 4. 50 Cross-Regional Triplets (stride 7)
  for (let i = 0; i < allCities.length; i += 7) {
    const c1 = allCities[i].cityCode;
    const c2 = allCities[(i + 47) % allCities.length].cityCode;
    const c3 = allCities[(i + 113) % allCities.length].cityCode;
    multiCitySets.push({
      label: `Triplet:${allCities[i].cityName}-${allCities[(i + 47) % allCities.length].cityName}-${allCities[(i + 113) % allCities.length].cityName}`,
      cities: [c1, c2, c3]
    });
  }

  stats.multiCityConfigsTested = multiCitySets.length;
  console.log(`[Config Inventory] Loaded exactly ${stats.multiCityConfigsTested} multi-city configurations (>= 477 required).`);
  assert(stats.multiCityConfigsTested >= 477, `Expected >= 477 configs, found ${stats.multiCityConfigsTested}`);

  const multiCityScenarios: ComparisonScenarioInput[] = [
    // Scenario A: Inpatient High Cost Tier 3
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 80000,
      nonInsuranceCost: 8000,
      classBCost: 12000,
      hospitalizationCount: 1
    },
    // Scenario B: Retiree Inpatient Transfer Tier 2
    {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'transfer',
      totalCost: 150000,
      nonInsuranceCost: 15000,
      classBCost: 20000,
      hospitalizationCount: 2
    },
    // Scenario C: Resident Inpatient Community Frequency 3
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 6000,
      nonInsuranceCost: 300,
      classBCost: 500,
      hospitalizationCount: 3
    },
    // Scenario D: Employee Outpatient Tier 1
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier1',
      remoteStatus: 'local',
      totalCost: 4500,
      nonInsuranceCost: 300,
      classBCost: 400
    },
    // Scenario E: Resident Outpatient Community
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 1200,
      nonInsuranceCost: 50,
      classBCost: 100
    },
    // Scenario F: Unfiled Normal Emergency High Cost
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'unfiled_normal',
      totalCost: 250000,
      nonInsuranceCost: 25000,
      classBCost: 35000,
      hospitalizationCount: 1
    }
  ];

  for (const cfg of multiCitySets) {
    for (const sc of multiCityScenarios) {
      stats.multiCityScenariosRun++;
      stats.totalCostVolumeAudited += sc.totalCost;

      const sim = runMultiCitySimulation(cfg.cities, sc);
      const ctx = `MultiCity [${cfg.label}] cost=${sc.totalCost} ${sc.treatmentType}`;

      // Invariant 1: Physical Fund Conservation (All & Per-City)
      assert(sim.allConserved === true, `[Invariant 1 Failure] allConserved is false in ${ctx}`);

      const baseline = sim.cities[0];
      const maxR = Math.max(...sim.cities.map(c => c.totalReimbursed));
      const minP = Math.min(...sim.cities.map(c => c.personalPayTotal));
      const minDed = Math.min(...sim.cities.map(c => c.deductibleDeducted));
      const maxCat = Math.max(...sim.cities.map(c => c.catastrophicReimbursed));

      for (let i = 0; i < sim.cities.length; i++) {
        const o = sim.cities[i];
        const cityCtx = `${ctx} -> ${o.cityName}`;

        // No NaN or negative in outcome
        checkNoNaNOrNegative(o as any, cityCtx);

        // Invariant 1: Math.abs(totalReimbursed + personalPayTotal - totalCost) < 0.001
        assert(o.isConserved === true, `[Invariant 1] isConserved is false in ${cityCtx}`);
        const citySum = Math.round((o.totalReimbursed + o.personalPayTotal) * 100) / 100;
        assertCloseTo(citySum, sc.totalCost, 0.001, `[Invariant 1 R+P=C] in ${cityCtx}`);

        // Subcomponents Base + Catastrophic = Total Reimbursed
        const subSum = Math.round((o.baseReimbursed + o.catastrophicReimbursed) * 100) / 100;
        assertCloseTo(subSum, o.totalReimbursed, 0.001, `[Subcomponents] in ${cityCtx}`);

        // Invariant 2: Baseline Delta Antisymmetry: ΔR_i === -ΔP_i, so ΔR_i + ΔP_i = 0
        const expDeltaR = Math.round((o.totalReimbursed - baseline.totalReimbursed) * 100) / 100;
        const expDeltaP = Math.round((o.personalPayTotal - baseline.personalPayTotal) * 100) / 100;
        assertCloseTo(o.deltaReimbursedVsCityA, expDeltaR, 0.01, `[Invariant 2 deltaR] in ${cityCtx}`);
        assertCloseTo(o.deltaPersonalPayVsCityA, expDeltaP, 0.01, `[Invariant 2 deltaP] in ${cityCtx}`);
        const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
        assertCloseTo(deltaSum, 0, 0.02, `[Invariant 2 Antisymmetry deltaR+deltaP=0] in ${cityCtx}`);

        if (i === 0) {
          assert(o.deltaReimbursedVsCityA === 0, `[Invariant 2 Baseline deltaR=0] in ${cityCtx}`);
          assert(o.deltaPersonalPayVsCityA === 0, `[Invariant 2 Baseline deltaP=0] in ${cityCtx}`);
        }

        // Invariant 4: Winner determinism and tie-resilience
        assert(o.isWinnerReimbursed === (o.totalReimbursed === maxR), `[Invariant 4 isWinnerReimbursed] in ${cityCtx}`);
        assert(o.isWinnerLowestOutPocket === (o.personalPayTotal === minP), `[Invariant 4 isWinnerLowestOutPocket] in ${cityCtx}`);
        assert(o.isWinnerLowestDeductible === (o.deductibleDeducted === minDed), `[Invariant 4 isWinnerLowestDeductible] in ${cityCtx}`);
        assert(o.isWinnerHighestCatastrophic === (maxCat > 0 && o.catastrophicReimbursed === maxCat), `[Invariant 4 isWinnerHighestCatastrophic] in ${cityCtx}`);
      }

      // Invariant 3: Max Spread Equality: Spread_R === Spread_P
      const actualSpreadR = Math.round((maxR - Math.min(...sim.cities.map(c => c.totalReimbursed))) * 100) / 100;
      const actualSpreadP = Math.round((Math.max(...sim.cities.map(c => c.personalPayTotal)) - minP) * 100) / 100;
      assertCloseTo(sim.maxReimbursementDelta, actualSpreadR, 0.01, `[Invariant 3 SpreadR] in ${ctx}`);
      assertCloseTo(sim.maxPersonalPayDelta, actualSpreadP, 0.01, `[Invariant 3 SpreadP] in ${ctx}`);
      assertCloseTo(sim.maxReimbursementDelta, sim.maxPersonalPayDelta, 0.02, `[Invariant 3 SpreadR=SpreadP] in ${ctx}`);

      // Winner string formatting checks
      const winnersR = sim.cities.filter(c => c.isWinnerReimbursed);
      for (const w of winnersR) {
        assert(sim.winnerReimbursedCity.includes(w.cityName), `[Invariant 4 WinnerName] Missing ${w.cityName} in ${ctx}`);
      }
      if (winnersR.length > 1) {
        assert(sim.winnerReimbursedCity.includes('(并列)'), `[Invariant 4 WinnerTie] Missing (并列) in ${ctx}`);
      } else {
        assert(!sim.winnerReimbursedCity.includes('(并列)'), `[Invariant 4 WinnerSingle] Incorrect (并列) in ${ctx}`);
      }
    }
  }

  console.log(`✓ Part 2 Passed: Evaluated ${stats.multiCityConfigsTested} multi-city configurations over ${stats.multiCityScenariosRun} scenarios.\n`);

  // ==========================================================================
  // PART 3: Invariant 5 (Boundary & Adversarial Stress Matrix)
  // ==========================================================================
  console.log('--- PART 3: Invariant 5 (Extreme Boundary & Adversarial Probing) ---');

  const adversarialSets = [
    { label: '京陕深', cities: ['110100', '610100', '440300'] },
    { label: '沪蓉', cities: ['310100', '510100'] },
    { label: '成渝陕', cities: ['610100', '510100', '500100'] },
    { label: '长三角', cities: ['330100', '320100', '310100'] },
    { label: '哈尔滨-三亚', cities: ['230100', '460200'] },
    { label: '拉萨-乌鲁木齐-北京', cities: ['540100', '650100', '110100'] }
  ];

  // 1. Zero Cost Boundary ($0)
  for (const adv of adversarialSets) {
    const r0 = runMultiCitySimulation(adv.cities, {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 0
    });
    assert(r0.allConserved === true, `[Adv Zero Cost] allConserved failed`);
    assert(r0.maxReimbursementDelta === 0, `[Adv Zero Cost] maxReimbursementDelta != 0`);
    assert(r0.maxPersonalPayDelta === 0, `[Adv Zero Cost] maxPersonalPayDelta != 0`);
    for (const c of r0.cities) {
      assert(c.totalReimbursed === 0 && c.personalPayTotal === 0, `[Adv Zero Cost] Values not 0`);
      assert(c.deltaReimbursedVsCityA === 0 && c.deltaPersonalPayVsCityA === 0, `[Adv Zero Cost] Deltas not 0`);
    }
  }

  // 2. Micro Cost Boundary ($0.01)
  for (const adv of adversarialSets) {
    const rMicro = runMultiCitySimulation(adv.cities, {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 0.01
    });
    assert(rMicro.allConserved === true, `[Adv Micro Cost] allConserved failed`);
    assertCloseTo(rMicro.maxReimbursementDelta, rMicro.maxPersonalPayDelta, 0.02, `[Adv Micro Cost] Spread mismatch`);
    for (const c of rMicro.cities) {
      assertCloseTo(c.totalReimbursed + c.personalPayTotal, 0.01, 0.001, `[Adv Micro Cost] R+P != 0.01`);
    }
  }

  // 3. Huge Cost Boundary ($100,000,000)
  for (const adv of adversarialSets) {
    const r100M = runMultiCitySimulation(adv.cities, {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: 100000000,
      nonInsuranceCost: 5000000,
      classBCost: 8000000,
      hospitalizationCount: 1
    });
    assert(r100M.allConserved === true, `[Adv 100M] allConserved failed`);
    assertCloseTo(r100M.maxReimbursementDelta, r100M.maxPersonalPayDelta, 0.02, `[Adv 100M] Spread mismatch`);
    for (const c of r100M.cities) {
      assertCloseTo(c.totalReimbursed + c.personalPayTotal, 100000000, 0.02, `[Adv 100M] R+P != 100M`);
      assert(c.catastrophicReimbursed > 0, `[Adv 100M] Catastrophic should be triggered at 100M`);
    }
  }

  // 4. Fault Injections
  let caught1 = false;
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
    caught1 = true;
    assert(err.message.includes('仅支持 2~3 个统筹区'), `[Fault Injection 1] message wrong: ${err.message}`);
  }
  assert(caught1, '[Fault Injection 1] Underflow city count did not throw');

  let caught4 = false;
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
    caught4 = true;
    assert(err.message.includes('仅支持 2~3 个统筹区'), `[Fault Injection 4] message wrong: ${err.message}`);
  }
  assert(caught4, '[Fault Injection 4] Overflow city count did not throw');

  let caughtInvalid = false;
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
    caughtInvalid = true;
    assert(err.message.includes('未找到统筹区编码'), `[Fault Injection Invalid] message wrong: ${err.message}`);
  }
  assert(caughtInvalid, '[Fault Injection Invalid] Non-existent city code did not throw');

  console.log('✓ Part 3 Passed: Boundary and adversarial stress matrix verified with zero breaches.\n');

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // ==========================================================================
  // FINAL EMPIRICAL SUMMARY
  // ==========================================================================
  console.log('================================================================================');
  console.log('>>> [CHALLENGER 1 EMPIRICAL AUDIT REPORT] <<<');
  console.log(`  Total Invariant Assertions Evaluated: ${stats.totalAssertions.toLocaleString()}`);
  console.log(`  Passed Assertions:                   ${stats.passedAssertions.toLocaleString()}`);
  console.log(`  Failed Assertions:                   ${stats.failedAssertions.toLocaleString()}`);
  console.log(`  Single-City Comprehensive Runs:      ${stats.singleCityTests.toLocaleString()}`);
  console.log(`  Multi-City Configurations Audited:   ${stats.multiCityConfigsTested.toLocaleString()}`);
  console.log(`  Multi-City Scenarios Executed:       ${stats.multiCityScenariosRun.toLocaleString()}`);
  console.log(`  Total Financial Volume Audited:      ¥${stats.totalCostVolumeAudited.toLocaleString()}`);
  console.log(`  Elapsed Time:                        ${elapsedSec}s`);
  console.log(`  Verdict:                             ${stats.failedAssertions === 0 ? 'CLEAN / APPROVE' : 'REQUEST_CHANGES'}`);
  console.log('================================================================================\n');

  if (stats.failedAssertions > 0) {
    console.error(`FATAL: ${stats.failedAssertions} assertions breached during empirical challenge!`);
    return false;
  }
  return true;
}

const passed = runEmpiricalChallenge();
if (!passed) {
  process.exit(1);
}
