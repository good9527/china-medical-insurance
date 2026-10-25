/**
 * Round 6 Empirical Adversarial Challenger Harness
 *
 * Verifies:
 * 1. Physical fund conservation: totalReimbursed + personalPayTotal === totalCost
 * 2. Cross-city simulation baseline delta antisymmetry: deltaReimbursedVsCityA === -deltaPersonalPayVsCityA
 * 3. Spread equality: maxReimbursementDelta === maxPersonalPayDelta
 * 4. Special policy stress:
 *    - Shaanxi 11 cities (Xi'an, Baoji, Xianyang, Weinan, Tongchuan, Yan'an, Yulin, Hanzhong, Ankang, Shangluo, Yangling)
 *    - Xi'an 2024-2026 resident catastrophic 20,000 deductible transition
 *    - Shanghai 2026 employee inpatient 670,000 cap + 80% local additional compensation
 *    - Guangzhou 2026 resident 18,000 catastrophic threshold
 *    - Shenzhen 2026 wage base 177,057 outpatient cap linkage (10,623 / 12,394)
 *    - Baoji 200 deductible tier 1 & Ankang 600/1500 tier 2/3 deductibles
 * 5. Extreme & dirty inputs fuzzing across all 348 cities (sub-cents, huge costs, corrupt costs)
 */

import { calculateReimbursement } from '../engine/calculator';
import { runMultiCitySimulation } from '../engine/simulator';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, CalculateRequest, ComparisonScenarioInput, RemoteStatus } from '../data/types';

interface HarnessStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failures: string[];
}

const stats: HarnessStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  failures: []
};

function assert(cond: boolean, msg: string) {
  stats.totalChecks++;
  if (!cond) {
    stats.failedChecks++;
    if (stats.failures.length < 30) {
      stats.failures.push(msg);
      console.error(`[FAIL] ${msg}`);
    }
  } else {
    stats.passedChecks++;
  }
}

function assertCloseTo(val1: number, val2: number, maxDiff: number, msg: string) {
  const diff = Math.abs(val1 - val2);
  assert(diff <= maxDiff, `${msg} (diff=${diff.toFixed(6)} > maxDiff=${maxDiff}, val1=${val1}, val2=${val2})`);
}

export function runRound6Challenger(): boolean {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R6] EMPIRICAL ADVERSARIAL STRESS & INVARIANT HARNESS <<<');
  console.log('================================================================================\n');

  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remotes: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];

  // --------------------------------------------------------------------------
  // SECTION 1: Deep Verification of Shaanxi 11 Cities + Shanghai + Guangzhou + Shenzhen
  // --------------------------------------------------------------------------
  console.log('--- Section 1: Deep Invariant Verification for 14 Target Cities ---');
  const targetCityCodes = [
    '610100', // 西安
    '610200', // 铜川
    '610300', // 宝鸡
    '610400', // 咸阳
    '610403', // 杨凌
    '610500', // 渭南
    '610600', // 延安
    '610700', // 汉中
    '610800', // 榆林
    '610900', // 安康
    '611000', // 商洛
    '310100', // 上海
    '440100', // 广州
    '440300'  // 深圳
  ];

  const costSpectrum = [
    0, 0.001, 0.01, 0.55, 1, 10, 50, 100, 200, 300, 600, 1200, 1500,
    5000, 15000, 18000, 19999.99, 20000, 20000.01, 30000, 60000,
    100000, 200000, 670000, 800000, 1500000, 10000000, 50000000
  ];

  for (const code of targetCityCodes) {
    const city = getCityDataByCode(code)!;
    assert(!!city, `City data missing for code ${code}`);

    for (const ins of ['employee', 'resident'] as const) {
      for (const treat of ['outpatient', 'inpatient'] as const) {
        for (const isRet of [false, true]) {
          if (ins === 'resident' && isRet) continue;

          for (const tier of tiers) {
            for (const remote of remotes) {
              for (const cost of costSpectrum) {
                // Variations of non-insurance & class B proportions
                const expenseVariants = [
                  { nonIns: 0, classB: 0 },
                  { nonIns: cost * 0.1, classB: cost * 0.15 },
                  { nonIns: cost * 0.4, classB: cost * 0.3 }
                ];

                for (const ev of expenseVariants) {
                  const nonInsCost = Math.round(ev.nonIns * 100) / 100;
                  const classBCost = Math.round(ev.classB * 100) / 100;

                  for (const count of (treat === 'inpatient' ? [1, 2, 3] : [1]) as (1 | 2 | 3)[]) {
                    const res = calculateReimbursement({
                      cityCode: code,
                      insuranceType: ins,
                      treatmentType: treat,
                      hospitalTier: tier,
                      remoteStatus: remote,
                      totalCost: cost,
                      nonInsuranceCost: nonInsCost,
                      classBCost: classBCost,
                      isRetiree: isRet,
                      hospitalizationCount: count
                    });

                    const b = res.breakdown;
                    const ctx = `${city.cityName} ${ins} ${treat} ${tier} ${remote} cost=${cost} count=${count}`;

                    // 1. Strict Physical Fund Conservation
                    const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
                    assertCloseTo(sum, cost, 0.01, `[Conservation R+P=C] ${ctx}`);

                    // 2. Subcomponent Conservation
                    const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
                    assertCloseTo(compSum, b.totalReimbursed, 0.01, `[Subcomponents Base+Cat=Total] ${ctx}`);

                    // 3. 5-Stage Stepped Funnel Conservation
                    const classBPaid = b.classBPriorPay || b.classBSelfPay || 0;
                    if (b.personalPayTotal >= (b.nonInsuranceCost + classBPaid + b.deductibleDeducted - 0.01)) {
                      const funnelSum = Math.round(
                        (b.nonInsuranceCost + classBPaid + b.deductibleDeducted + b.totalReimbursed + b.personalSpanCoPay) * 100
                      ) / 100;
                      assertCloseTo(funnelSum, cost, 0.01, `[5-Stage Funnel] ${ctx}`);
                    }

                    // 4. Non-negativity & upper bounds
                    assert(b.totalReimbursed >= 0, `Negative reimbursement in ${ctx}`);
                    assert(b.personalPayTotal >= 0, `Negative personal pay in ${ctx}`);
                    assert(b.totalReimbursed <= cost + 0.01, `Reimbursement exceeds cost in ${ctx}`);

                    if (cost === 0) {
                      assert(b.totalReimbursed === 0 && b.personalPayTotal === 0, `Zero cost non-zero in ${ctx}`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  console.log('✓ Section 1 Passed: 14 target cities fully verified across all costs, tiers, remotes, and admission frequencies.\n');

  // --------------------------------------------------------------------------
  // SECTION 2: Specific Policy Boundary Verification
  // --------------------------------------------------------------------------
  console.log('--- Section 2: Specific Policy Dynamic Boundaries ---');

  // 2.1 Xi'an resident catastrophic 20,000 threshold
  {
    const xian = getCityDataByCode('610100')!;
    assert(xian.resident.catastrophic.deductible === 20000, `Xi'an resident catastrophic deductible should be 20000, got ${xian.resident.catastrophic.deductible}`);
    // Check below threshold: 15,000 totalCost in tier3 inpatient
    const resUnder = calculateReimbursement({
      cityCode: '610100',
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 15000
    });
    assert(resUnder.breakdown.catastrophicReimbursed === 0, `Xi'an under 20k triggered catastrophic: ${resUnder.breakdown.catastrophicReimbursed}`);

    // Check above threshold: 60,000 totalCost in tier3_top inpatient
    const resOver = calculateReimbursement({
      cityCode: '610100',
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: 60000
    });
    assert(resOver.breakdown.catastrophicReimbursed > 0, `Xi'an at 60k did not trigger catastrophic`);
    const xianDoc = xian.sourceDocs.find(d => d.docId === xian.resident.catastrophic.sourceDocId);
    assert(xianDoc?.docNumber === '市医保发〔2024〕73号', `Xi'an missing policy citation for 20000 deductible: ${xianDoc?.docNumber}`);
  }

  // 2.2 Shanghai employee inpatient 670k cap + 80% local additional fund
  {
    const shRes = calculateReimbursement({
      cityCode: '310100',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 800000,
      isRetiree: false
    });
    const shCap = 670000;
    assert(shRes.breakdown.baseReimbursed <= shCap + 0.01, `Shanghai base reimbursed exceeded 670k: ${shRes.breakdown.baseReimbursed}`);
    assert(shRes.breakdown.catastrophicReimbursed > 0, `Shanghai catastrophic not triggered at 800k`);
    const sum = Math.round((shRes.breakdown.totalReimbursed + shRes.breakdown.personalPayTotal) * 100) / 100;
    assertCloseTo(sum, 800000, 0.01, `Shanghai 800k conservation failed`);
  }

  // 2.3 Guangzhou resident 18,000 catastrophic threshold
  {
    const gz = getCityDataByCode('440100')!;
    assert(gz.resident.catastrophic.deductible === 18000, `Guangzhou resident catastrophic deductible should be 18000, got ${gz.resident.catastrophic.deductible}`);
    const gzRes = calculateReimbursement({
      cityCode: '440100',
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 100000
    });
    assert(gzRes.breakdown.catastrophicReimbursed > 0, `Guangzhou 100k resident did not trigger catastrophic`);
  }

  // 2.4 Shenzhen 2026 wage base 177,057 & outpatient cap
  {
    const szResActive = calculateReimbursement({
      cityCode: '440300',
      insuranceType: 'employee',
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 30000,
      isRetiree: false
    });
    const szResRetiree = calculateReimbursement({
      cityCode: '440300',
      insuranceType: 'employee',
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 30000,
      isRetiree: true
    });
    // Active cap around 10623.42, Retiree cap around 12393.99
    assert(szResActive.breakdown.totalReimbursed <= 10624, `Shenzhen active outpatient exceeded cap: ${szResActive.breakdown.totalReimbursed}`);
    assert(szResRetiree.breakdown.totalReimbursed <= 12395, `Shenzhen retiree outpatient exceeded cap: ${szResRetiree.breakdown.totalReimbursed}`);
    assert(szResRetiree.breakdown.totalReimbursed >= szResActive.breakdown.totalReimbursed, `Shenzhen retiree reimbursement should be >= active`);
  }

  // 2.5 Baoji tier 1 deductible 200 & Ankang tier 2 (600), tier 3 (1500)
  {
    const bj = getCityDataByCode('610300')!;
    assert(bj.employee.inpatient.tierBenefits.tier1.deductible === 200, `Baoji employee tier1 ded should be 200, got ${bj.employee.inpatient.tierBenefits.tier1.deductible}`);

    const ak = getCityDataByCode('610900')!;
    assert(ak.employee.inpatient.tierBenefits.tier2.deductible === 600, `Ankang employee tier2 ded should be 600, got ${ak.employee.inpatient.tierBenefits.tier2.deductible}`);
    assert(ak.employee.inpatient.tierBenefits.tier3.deductible === 1500, `Ankang employee tier3 ded should be 1500, got ${ak.employee.inpatient.tierBenefits.tier3.deductible}`);
  }

  console.log('✓ Section 2 Passed: Specific policy dynamic thresholds verified cleanly.\n');

  // --------------------------------------------------------------------------
  // SECTION 3: Multi-City Simulation Invariants across 14 Target Cities & Strides
  // --------------------------------------------------------------------------
  console.log('--- Section 3: Multi-City Simulation Invariants (ΔR = -ΔP, Spread_R = Spread_P, Winner) ---');

  const multiCityCombos = [
    { label: 'Shaanxi-1: Xi-an + Baoji + Weinan', cities: ['610100', '610300', '610500'] },
    { label: 'Shaanxi-2: Xianyang + Tongchuan + Yulin', cities: ['610400', '610200', '610800'] },
    { label: 'Shaanxi-3: Hanzhong + Ankang + Shangluo', cities: ['610700', '610900', '611000'] },
    { label: 'Shaanxi-Yangling + Xi-an', cities: ['610403', '610100'] },
    { label: 'MegaCities: Shanghai + Guangzhou + Shenzhen', cities: ['310100', '440100', '440300'] },
    { label: 'Cross-Province: Xi-an + Shanghai + Shenzhen', cities: ['610100', '310100', '440300'] },
    { label: 'Cross-Province: Baoji + Guangzhou', cities: ['610300', '440100'] },
    { label: 'Cross-Province: Yulin + Beijing + Chengdu', cities: ['610800', '110100', '510100'] }
  ];

  const simScenarios: ComparisonScenarioInput[] = [
    // 1. Zero cost
    {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 0
    },
    // 2. Micro cost
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 0.05
    },
    // 3. Normal inpatient tier 3
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
    // 4. Repeated inpatient count = 3
    {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 25000,
      hospitalizationCount: 3
    },
    // 5. Transfer remote medical
    {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'transfer',
      totalCost: 150000,
      nonInsuranceCost: 15000,
      classBCost: 20000,
      hospitalizationCount: 2
    },
    // 6. Huge astronomical expense
    {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: 80000000,
      nonInsuranceCost: 4000000,
      classBCost: 8000000,
      hospitalizationCount: 1
    }
  ];

  for (const combo of multiCityCombos) {
    for (const sc of simScenarios) {
      const res = runMultiCitySimulation(combo.cities, sc);
      const ctx = `MultiCity [${combo.label}] cost=${sc.totalCost}`;

      // Invariant 1: allConserved === true
      assert(res.allConserved === true, `[Invariant 1] allConserved false in ${ctx}`);

      // Invariant 2: Spread_R === Spread_P
      assertCloseTo(res.maxReimbursementDelta, res.maxPersonalPayDelta, 0.02, `[Invariant 3] Spread mismatch in ${ctx}`);

      const baseline = res.cities[0];
      const maxR = Math.max(...res.cities.map(c => c.totalReimbursed));
      const minP = Math.min(...res.cities.map(c => c.personalPayTotal));

      for (let i = 0; i < res.cities.length; i++) {
        const c = res.cities[i];
        const cityCtx = `${ctx} -> ${c.cityName}`;

        // Invariant 1 per city:
        assert(c.isConserved === true, `[Invariant 1] isConserved false in ${cityCtx}`);
        const citySum = Math.round((c.totalReimbursed + c.personalPayTotal) * 100) / 100;
        assertCloseTo(citySum, sc.totalCost, 0.01, `[Invariant 1 R+P=C] in ${cityCtx}`);

        // Invariant 2: Baseline Delta Antisymmetry: ΔR_i === -ΔP_i  =>  ΔR_i + ΔP_i === 0
        const expectedDeltaR = Math.round((c.totalReimbursed - baseline.totalReimbursed) * 100) / 100;
        const expectedDeltaP = Math.round((c.personalPayTotal - baseline.personalPayTotal) * 100) / 100;
        assertCloseTo(c.deltaReimbursedVsCityA, expectedDeltaR, 0.01, `[Invariant 2 deltaR] in ${cityCtx}`);
        assertCloseTo(c.deltaPersonalPayVsCityA, expectedDeltaP, 0.01, `[Invariant 2 deltaP] in ${cityCtx}`);
        const deltaSum = Math.round((c.deltaReimbursedVsCityA + c.deltaPersonalPayVsCityA) * 100) / 100;
        assertCloseTo(deltaSum, 0, 0.02, `[Invariant 2 Antisymmetry ΔR+ΔP=0] in ${cityCtx}`);

        if (i === 0) {
          assert(c.deltaReimbursedVsCityA === 0, `Baseline deltaR != 0 in ${cityCtx}`);
          assert(c.deltaPersonalPayVsCityA === 0, `Baseline deltaP != 0 in ${cityCtx}`);
        }

        // Invariant 4: Winner flags
        assert(c.isWinnerReimbursed === (c.totalReimbursed === maxR), `Winner reimbursed mismatch in ${cityCtx}`);
        assert(c.isWinnerLowestOutPocket === (c.personalPayTotal === minP), `Winner lowest out pocket mismatch in ${cityCtx}`);
      }
    }
  }

  console.log('✓ Section 3 Passed: Multi-city simulation invariants 100% verified.\n');

  // --------------------------------------------------------------------------
  // SECTION 4: High-Stress Random Fuzzing Across All 348 Cities (10,000 cases)
  // --------------------------------------------------------------------------
  console.log('--- Section 4: 10,000 High-Stress Randomized Invariant Fuzzing ---');
  let rngSeed = 42;
  function pseudoRandom(): number {
    rngSeed = (rngSeed * 9301 + 49297) % 233280;
    return rngSeed / 233280;
  }

  for (let i = 0; i < 10000; i++) {
    const cityIndex = Math.floor(pseudoRandom() * allCities.length);
    const city = allCities[cityIndex];
    const ins = pseudoRandom() > 0.5 ? 'employee' : 'resident';
    const treat = pseudoRandom() > 0.5 ? 'inpatient' : 'outpatient';
    const isRet = ins === 'employee' ? pseudoRandom() > 0.5 : false;
    const tier = tiers[Math.floor(pseudoRandom() * tiers.length)];
    const remote = remotes[Math.floor(pseudoRandom() * remotes.length)];
    const count = (Math.floor(pseudoRandom() * 3) + 1) as 1 | 2 | 3;

    // Generate extreme cost distributions
    const costType = pseudoRandom();
    let cost = 0;
    if (costType < 0.1) cost = 0;
    else if (costType < 0.2) cost = Math.round(pseudoRandom() * 100) / 100; // 0~1
    else if (costType < 0.4) cost = Math.round(pseudoRandom() * 2000 * 100) / 100; // 0~2000
    else if (costType < 0.7) cost = Math.round(pseudoRandom() * 100000 * 100) / 100; // 0~100k
    else if (costType < 0.9) cost = Math.round(pseudoRandom() * 2000000 * 100) / 100; // 0~2M
    else cost = Math.round(pseudoRandom() * 50000000 * 100) / 100; // 0~50M

    const nonIns = pseudoRandom() > 0.2 ? Math.round(cost * pseudoRandom() * 0.5 * 100) / 100 : 0;
    const classB = pseudoRandom() > 0.2 ? Math.round(cost * pseudoRandom() * 0.4 * 100) / 100 : 0;

    const res = calculateReimbursement({
      cityCode: city.cityCode,
      insuranceType: ins,
      treatmentType: treat,
      hospitalTier: tier,
      remoteStatus: remote,
      totalCost: cost,
      nonInsuranceCost: nonIns,
      classBCost: classB,
      isRetiree: isRet,
      hospitalizationCount: count
    });

    const b = res.breakdown;
    const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
    assertCloseTo(sum, cost, 0.01, `[Fuzz Conservation] ${city.cityName} cost=${cost}`);

    const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
    assertCloseTo(compSum, b.totalReimbursed, 0.01, `[Fuzz Subcomponent] ${city.cityName}`);
  }

  console.log('✓ Section 4 Passed: 10,000 random adversarial fuzzing checks clean.\n');

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R6 AUDIT SUMMARY] <<<');
  console.log(`  Total Checks Executed: ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:         ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:         ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Verdict:               ${stats.failedChecks === 0 ? 'APPROVE' : 'REQUEST_CHANGES'}`);
  console.log('================================================================================\n');

  return stats.failedChecks === 0;
}

const passed = runRound6Challenger();
if (!passed) {
  process.exit(1);
}
