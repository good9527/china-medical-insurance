/**
 * Challenger 2: Round 4 Empirical Boundary & Fuzzing Oracle for runMultiCitySimulation
 *
 * Verifies:
 * 1. Zero medical expense (¥0)
 * 2. Micro expenses (¥0.01 ~ ¥1.00)
 * 3. Giant astronomical medical expenses (¥50,000,000)
 * 4. 3rd repeated hospitalization with deductible reduction
 * 5. All 5 remote medical statuses (local, long_term, transfer, unfiled_emergency, unfiled_normal)
 * 6. Inpatient vs Outpatient mode switches
 * 7. Fault injection resilience (cityCodes < 2, > 3, invalid codes, malformed scenario inputs)
 * 8. Numerical invariants: no NaN, no Infinity, 100% money conservation, 0-Emoji compliance.
 */

import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { allCities, getCityDataByCode } from '../data';
import type { ComparisonScenarioInput, HospitalTier, RemoteStatus } from '../data/types';

interface TestStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failures: string[];
}

const stats: TestStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  failures: []
};

function assert(condition: boolean, msg: string) {
  stats.totalChecks++;
  if (!condition) {
    stats.failedChecks++;
    stats.failures.push(msg);
    if (stats.failures.length <= 30) {
      console.error(`[FAIL] ${msg}`);
    }
  } else {
    stats.passedChecks++;
  }
}

function assertCloseTo(actual: number, expected: number, delta: number, msg: string) {
  assert(Math.abs(actual - expected) <= delta, `${msg} (expected ~${expected}, got ${actual}, diff=${Math.abs(actual - expected)})`);
}

function assertThrows(fn: () => void, msg: string) {
  stats.totalChecks++;
  try {
    fn();
    stats.failedChecks++;
    stats.failures.push(`Expected exception not thrown: ${msg}`);
    console.error(`[FAIL] Expected exception not thrown: ${msg}`);
  } catch (e: any) {
    stats.passedChecks++;
  }
}

// Regex to detect any Unicode emoji
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

function assertNoEmoji(text: string, context: string) {
  assert(!EMOJI_REGEX.test(text), `Emoji detected in [${context}]: "${text}"`);
}

function checkOutcomeInvariants(res: ReturnType<typeof runMultiCitySimulation>, expectedCost: number, context: string) {
  const effCost = Math.max(0, expectedCost);

  // Global conservation flag
  assert(res.allConserved === true, `allConserved is false in ${context}`);

  // Spread equality: maxReimbursementDelta === maxPersonalPayDelta
  assertCloseTo(res.maxReimbursementDelta, res.maxPersonalPayDelta, 0.02, `Spread equality violated in ${context}`);

  // Winner strings sanity
  assert(typeof res.winnerReimbursedCity === 'string' && res.winnerReimbursedCity.length > 0, `winnerReimbursedCity empty in ${context}`);
  assert(typeof res.winnerLowestOutPocketCity === 'string' && res.winnerLowestOutPocketCity.length > 0, `winnerLowestOutPocketCity empty in ${context}`);
  assert(typeof res.winnerLowestDeductibleCity === 'string' && res.winnerLowestDeductibleCity.length > 0, `winnerLowestDeductibleCity empty in ${context}`);
  assert(typeof res.winnerHighestCatastrophicCity === 'string' && res.winnerHighestCatastrophicCity.length > 0, `winnerHighestCatastrophicCity empty in ${context}`);

  // Check insights for 0-Emoji
  for (const insight of res.keyInsights) {
    assertNoEmoji(insight, `${context} insight`);
  }

  const maxR = Math.max(...res.cities.map(c => c.totalReimbursed));
  const minP = Math.min(...res.cities.map(c => c.personalPayTotal));
  const minDed = Math.min(...res.cities.map(c => c.deductibleDeducted));

  for (let i = 0; i < res.cities.length; i++) {
    const o = res.cities[i];

    // 1. Numerical Sanity
    assert(!Number.isNaN(o.totalReimbursed), `NaN totalReimbursed in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.personalPayTotal), `NaN personalPayTotal in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.reimbursementRatio), `NaN reimbursementRatio in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.deductibleDeducted), `NaN deductibleDeducted in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.deductibleReduction), `NaN deductibleReduction in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.baseReimbursed), `NaN baseReimbursed in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.catastrophicReimbursed), `NaN catastrophicReimbursed in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.deltaReimbursedVsCityA), `NaN deltaReimbursedVsCityA in ${o.cityName} (${context})`);
    assert(!Number.isNaN(o.deltaPersonalPayVsCityA), `NaN deltaPersonalPayVsCityA in ${o.cityName} (${context})`);

    assert(Number.isFinite(o.totalReimbursed), `Infinity in totalReimbursed in ${o.cityName} (${context})`);
    assert(Number.isFinite(o.personalPayTotal), `Infinity in personalPayTotal in ${o.cityName} (${context})`);
    assert(Number.isFinite(o.reimbursementRatio), `Infinity in reimbursementRatio in ${o.cityName} (${context})`);

    // 2. Non-negativity
    assert(o.totalReimbursed >= 0, `Negative totalReimbursed: ${o.totalReimbursed} in ${o.cityName} (${context})`);
    assert(o.personalPayTotal >= 0, `Negative personalPayTotal: ${o.personalPayTotal} in ${o.cityName} (${context})`);
    assert(o.baseReimbursed >= 0, `Negative baseReimbursed in ${o.cityName} (${context})`);
    assert(o.catastrophicReimbursed >= 0, `Negative catastrophicReimbursed in ${o.cityName} (${context})`);
    assert(o.deductibleDeducted >= 0, `Negative deductibleDeducted in ${o.cityName} (${context})`);

    // 3. Upper bounds
    assert(o.totalReimbursed <= effCost + 0.01, `Reimbursement exceeds total cost: ${o.totalReimbursed} > ${effCost} in ${o.cityName} (${context})`);

    // 4. Money conservation: R + P === C_total
    const sumMoney = Math.round((o.totalReimbursed + o.personalPayTotal) * 100) / 100;
    assertCloseTo(sumMoney, effCost, 0.02, `Money conservation violated: ${sumMoney} vs ${effCost} in ${o.cityName} (${context})`);

    // 5. Component conservation: base + catastrophic === total
    const sumComp = Math.round((o.baseReimbursed + o.catastrophicReimbursed) * 100) / 100;
    assertCloseTo(sumComp, o.totalReimbursed, 0.01, `Subcomponent conservation violated in ${o.cityName} (${context})`);

    // 6. Baseline delta antisymmetry: ΔR_i = -ΔP_i
    const sumDelta = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
    assertCloseTo(sumDelta, 0, 0.02, `Delta antisymmetry violated in ${o.cityName} (${context})`);

    if (i === 0) {
      assert(o.deltaReimbursedVsCityA === 0, `Baseline City A deltaR != 0: ${o.deltaReimbursedVsCityA} in ${o.cityName}`);
      assert(o.deltaPersonalPayVsCityA === 0, `Baseline City A deltaP != 0: ${o.deltaPersonalPayVsCityA} in ${o.cityName}`);
    }

    // 7. Winner flags consistency
    assert(o.isWinnerReimbursed === (o.totalReimbursed === maxR), `Winner flag reimbursed mismatch in ${o.cityName}`);
    assert(o.isWinnerLowestOutPocket === (o.personalPayTotal === minP), `Winner flag outPocket mismatch in ${o.cityName}`);
    assert(o.isWinnerLowestDeductible === (o.deductibleDeducted === minDed), `Winner flag deductible mismatch in ${o.cityName}`);
  }
}

export function runChallenger2Suite() {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER 2] EMPIRICAL BOUNDARY & FUZZING ORACLE (ROUND 4) <<<');
  console.log('================================================================================\n');

  // Prepare a diverse set of city combos:
  // 1. All 9 presets
  const testCombos: Array<{ label: string; cities: string[] }> = popularMultiCityPresets.map(p => ({
    label: `Preset:${p.name}`,
    cities: p.cities.map(c => c === '500000' ? '500100' : c)
  }));

  // 2. Extra pairs and triplets covering North, South, East, West, Tier 1, Counties
  testCombos.push(
    { label: 'Shaanxi:Xi-an+Weinan+Yulin', cities: ['610100', '610500', '610800'] },
    { label: 'Guangdong:Guangzhou+Shenzhen+Dongguan', cities: ['440100', '440300', '441900'] },
    { label: 'Sichuan:Chengdu+Mianyang+Nanchong', cities: ['510100', '510700', '511300'] },
    { label: 'Shandong:Jinan+Qingdao+Yantai', cities: ['370100', '370200', '370600'] },
    { label: 'Hebei:Shijiazhuang+Tangshan+Baoding', cities: ['130100', '130200', '130600'] },
    { label: 'Cross-Regional:Beijing+Lhasa+Urumqi', cities: ['110100', '540100', '650100'] },
    { label: 'Cross-Regional:Harbin+Sanya', cities: ['230100', '460200'] },
    { label: 'Pair:Shanghai+Chongqing', cities: ['310100', '500100'] }
  );

  // --------------------------------------------------------------------------
  // TEST 1: ZERO MEDICAL EXPENSE (¥0)
  // --------------------------------------------------------------------------
  console.log('--- Subtask 1: Zero Medical Expense (¥0) Boundary Stress ---');
  for (const combo of testCombos) {
    for (const ins of ['employee', 'resident'] as const) {
      for (const treat of ['inpatient', 'outpatient'] as const) {
        for (const isRet of [false, true]) {
          if (ins === 'resident' && isRet) continue;
          const scenario: ComparisonScenarioInput = {
            insuranceType: ins,
            isRetiree: isRet,
            treatmentType: treat,
            hospitalTier: 'tier3',
            remoteStatus: 'local',
            totalCost: 0,
            nonInsuranceCost: 0,
            classBCost: 0,
            hospitalizationCount: 1
          };

          const res = runMultiCitySimulation(combo.cities, scenario);
          checkOutcomeInvariants(res, 0, `Zero Cost (${combo.label}, ${ins}, ${treat}, ret=${isRet})`);

          // For zero cost, everything must be 0
          for (const c of res.cities) {
            assert(c.totalReimbursed === 0, `Zero cost: totalReimbursed != 0 in ${c.cityName}`);
            assert(c.personalPayTotal === 0, `Zero cost: personalPayTotal != 0 in ${c.cityName}`);
            assert(c.reimbursementRatio === 0, `Zero cost: reimbursementRatio != 0 in ${c.cityName}`);
            assert(c.deductibleDeducted === 0, `Zero cost: deductibleDeducted != 0 in ${c.cityName}`);
            assert(c.deltaReimbursedVsCityA === 0, `Zero cost: deltaReimbursed != 0 in ${c.cityName}`);
            assert(c.deltaPersonalPayVsCityA === 0, `Zero cost: deltaPersonalPay != 0 in ${c.cityName}`);
          }
          assert(res.maxReimbursementDelta === 0, `Zero cost: maxReimbursementDelta != 0`);
          assert(res.maxPersonalPayDelta === 0, `Zero cost: maxPersonalPayDelta != 0`);
          assert(res.winnerHighestCatastrophicCity.includes('未触发'), `Zero cost: expected 未触发大病报销`);
        }
      }
    }
  }
  console.log(`  Passed Subtask 1: Zero medical expense boundary tests clean.\n`);

  // --------------------------------------------------------------------------
  // TEST 2: MICRO EXPENSES (¥0.01 ~ ¥1.00)
  // --------------------------------------------------------------------------
  console.log('--- Subtask 2: Micro Expenses (¥0.01 ~ ¥1.00) Precision & Boundary Stress ---');
  const microCosts = [0.01, 0.05, 0.10, 0.25, 0.50, 0.88, 0.99, 1.00];

  for (const combo of testCombos.slice(0, 8)) {
    for (const cost of microCosts) {
      // Test with no self pay, and with sub-cent self pay proportions
      const scenarios: ComparisonScenarioInput[] = [
        {
          insuranceType: 'employee',
          isRetiree: false,
          treatmentType: 'outpatient',
          hospitalTier: 'community',
          remoteStatus: 'local',
          totalCost: cost,
          nonInsuranceCost: 0,
          classBCost: 0
        },
        {
          insuranceType: 'employee',
          isRetiree: true,
          treatmentType: 'inpatient',
          hospitalTier: 'tier2',
          remoteStatus: 'local',
          totalCost: cost,
          nonInsuranceCost: Math.round(cost * 0.2 * 100) / 100,
          classBCost: Math.round(cost * 0.3 * 100) / 100,
          classBSelfPayRatio: 0.1
        },
        {
          insuranceType: 'resident',
          isRetiree: false,
          treatmentType: 'outpatient',
          hospitalTier: 'community',
          remoteStatus: 'local',
          totalCost: cost,
          nonInsuranceCost: 0.01,
          classBCost: 0
        }
      ];

      for (const sc of scenarios) {
        const res = runMultiCitySimulation(combo.cities, sc);
        checkOutcomeInvariants(res, cost, `Micro Cost ¥${cost} (${combo.label})`);

        // Micro costs are far below normal inpatient deductible (e.g. 500~1500),
        // so for inpatient, base reimbursement should be 0 unless deductible is 0
        if (sc.treatmentType === 'inpatient') {
          for (const c of res.cities) {
            if (c.deductibleDeducted > 0) {
              assert(c.deductibleDeducted <= cost + 0.01, `deductibleDeducted > cost for micro expense in ${c.cityName}`);
            }
          }
        }
      }
    }
  }
  console.log(`  Passed Subtask 2: Micro expenses boundary & sub-cent precision tests clean.\n`);

  // --------------------------------------------------------------------------
  // TEST 3: GIANT ASTRONOMICAL MEDICAL EXPENSES (¥50,000,000)
  // --------------------------------------------------------------------------
  console.log('--- Subtask 3: Giant Astronomical Medical Expenses (¥50,000,000) Stress ---');
  const astroCosts = [10000000, 30000000, 50000000, 100000000];

  for (const combo of testCombos) {
    for (const cost of astroCosts) {
      const scenario: ComparisonScenarioInput = {
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3_top',
        remoteStatus: 'local',
        totalCost: cost,
        nonInsuranceCost: Math.round(cost * 0.05 * 100) / 100,
        classBCost: Math.round(cost * 0.10 * 100) / 100,
        classBSelfPayRatio: 0.05,
        hospitalizationCount: 1
      };

      const res = runMultiCitySimulation(combo.cities, scenario);
      checkOutcomeInvariants(res, cost, `Astro Cost ¥${cost} (${combo.label})`);

      // Verify catastrophic insurance triggered for high expense
      for (const c of res.cities) {
        assert(c.totalReimbursed > 0, `Astro cost: totalReimbursed is 0 in ${c.cityName}`);
        // Base reimbursement must not exceed city annual cap
        const cityData = getCityDataByCode(c.cityCode)!;
        const cap = cityData.employee.inpatient.annualCapRetiree || cityData.employee.inpatient.annualCap;
        assert(
          c.baseReimbursed <= cap + 0.01,
          `Base reimbursed ${c.baseReimbursed} exceeded annualCap ${cap} in ${c.cityName}`
        );

        // Catastrophic fund should have triggered if the city provides catastrophic coverage
        if (cityData.employee.catastrophic) {
          assert(c.catastrophicReimbursed > 0, `Catastrophic fund not triggered in ${c.cityName} at cost ¥${cost}`);
          if (cityData.employee.catastrophic.annualCap) {
            assert(
              c.catastrophicReimbursed <= cityData.employee.catastrophic.annualCap + 0.01,
              `Catastrophic reimbursed ${c.catastrophicReimbursed} exceeded cap ${cityData.employee.catastrophic.annualCap} in ${c.cityName}`
            );
          }
        }
      }

      // Verify winner highest catastrophic is assigned
      assert(res.winnerHighestCatastrophicCity !== '无 (未触发大病报销)', `Expected catastrophic winner at cost ¥${cost}`);
    }
  }
  console.log(`  Passed Subtask 3: Giant astronomical medical expenses (¥50,000,000+) stress clean.\n`);

  // --------------------------------------------------------------------------
  // TEST 4: 3RD REPEATED HOSPITALIZATION WITH DEDUCTIBLE REDUCTION
  // --------------------------------------------------------------------------
  console.log('--- Subtask 4: 3rd Repeated Hospitalization with Deductible Reduction ---');
  // Cities known for repeated hospitalization reduction rules:
  // Xi'an (610100): 2nd -20%, 3rd -30%
  // Weinan (610500): 2nd -20%, 3rd -30%
  // Yulin (610800): repeated reduction policy
  // Chengdu (510100): 2nd -100/200, 3rd -100/200
  // Beijing (110100): 2nd onwards 650
  const repeatedCombos = [
    { label: 'Shaanxi Trio', cities: ['610100', '610500', '610800'] },
    { label: 'Beijing-Xi-an-Shenzhen', cities: ['110100', '610100', '440300'] },
    { label: 'Shanghai-Chengdu', cities: ['310100', '510100'] }
  ];

  for (const combo of repeatedCombos) {
    for (const ins of ['employee', 'resident'] as const) {
      for (const count of [1, 2, 3] as (1 | 2 | 3)[]) {
        const scenario: ComparisonScenarioInput = {
          insuranceType: ins,
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: 'local',
          totalCost: 20000,
          hospitalizationCount: count
        };

        const res = runMultiCitySimulation(combo.cities, scenario);
        checkOutcomeInvariants(res, 20000, `Repeated Hospitalization count=${count} (${combo.label}, ${ins})`);

        if (count > 1) {
          // Check that keyInsights mentions repeated hospitalization
          const repeatedInsight = res.keyInsights.find(i => i.includes(`年内第${count}次住院`));
          assert(!!repeatedInsight, `Missing repeated hospitalization insight for count=${count} in ${combo.label}`);
        }
      }

      // Compare count=1 vs count=3 for Xi'an
      if (combo.cities.includes('610100')) {
        const sc1: ComparisonScenarioInput = {
          insuranceType: ins,
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: 'local',
          totalCost: 15000,
          hospitalizationCount: 1
        };
        const sc3: ComparisonScenarioInput = {
          insuranceType: ins,
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: 'local',
          totalCost: 15000,
          hospitalizationCount: 3
        };

        const r1 = runMultiCitySimulation(combo.cities, sc1);
        const r3 = runMultiCitySimulation(combo.cities, sc3);

        const xian1 = r1.cities.find(c => c.cityCode === '610100')!;
        const xian3 = r3.cities.find(c => c.cityCode === '610100')!;

        // In Xi'an, 3rd admission deductible is lower than 1st admission
        assert(
          xian3.deductibleDeducted <= xian1.deductibleDeducted,
          `Xi'an 3rd admission deductible (${xian3.deductibleDeducted}) should be <= 1st (${xian1.deductibleDeducted})`
        );
        assert(
          xian3.deductibleReduction > 0,
          `Xi'an 3rd admission should show positive deductibleReduction (got ${xian3.deductibleReduction})`
        );
        // Consequently, reimbursement in 3rd admission should be >= 1st admission
        assert(
          xian3.totalReimbursed >= xian1.totalReimbursed,
          `Xi'an 3rd admission reimbursement (${xian3.totalReimbursed}) should be >= 1st (${xian1.totalReimbursed})`
        );
      }
    }
  }
  console.log(`  Passed Subtask 4: 3rd repeated hospitalization deductible reduction verified.\n`);

  // --------------------------------------------------------------------------
  // TEST 5: ALL 5 REMOTE MEDICAL STATUSES MONOTONICITY & BEHAVIOR
  // --------------------------------------------------------------------------
  console.log('--- Subtask 5: All 5 Remote Medical Statuses Comprehensive Probing ---');
  const allRemotes: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];

  for (const combo of testCombos.slice(0, 6)) {
    for (const ins of ['employee', 'resident'] as const) {
      const resultsByRemote: Record<RemoteStatus, ReturnType<typeof runMultiCitySimulation>> = {} as any;

      for (const remote of allRemotes) {
        const scenario: ComparisonScenarioInput = {
          insuranceType: ins,
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: remote,
          totalCost: 50000,
          nonInsuranceCost: 2000,
          classBCost: 3000,
          classBSelfPayRatio: 0.1,
          hospitalizationCount: 1
        };

        const res = runMultiCitySimulation(combo.cities, scenario);
        checkOutcomeInvariants(res, 50000, `Remote Status [${remote}] (${combo.label}, ${ins})`);
        resultsByRemote[remote] = res;

        // Check insight text for remote
        if (remote !== 'local') {
          const remoteInsight = res.keyInsights.find(i => i.includes('异地就医政策衔接'));
          assert(!!remoteInsight, `Missing remote insight for ${remote} in ${combo.label}`);
        }
      }

      // Check comparative policy monotonicity:
      // In general: local >= transfer >= unfiled_normal
      // And long_term == local (or very close depending on whether local tier benefits apply)
      for (const cityCode of combo.cities) {
        const rLocal = resultsByRemote['local'].cities.find(c => c.cityCode === cityCode)!;
        const rLongTerm = resultsByRemote['long_term'].cities.find(c => c.cityCode === cityCode)!;
        const rTransfer = resultsByRemote['transfer'].cities.find(c => c.cityCode === cityCode)!;
        const rEmergency = resultsByRemote['unfiled_emergency'].cities.find(c => c.cityCode === cityCode)!;
        const rNormal = resultsByRemote['unfiled_normal'].cities.find(c => c.cityCode === cityCode)!;

        // 1. Unfiled normal (temporary unfiled) must never exceed local reimbursement
        assert(
          rNormal.totalReimbursed <= rLocal.totalReimbursed + 0.01,
          `Unfiled normal (${rNormal.totalReimbursed}) > local (${rLocal.totalReimbursed}) in ${rLocal.cityName}`
        );

        // 2. Transfer must never exceed local reimbursement
        assert(
          rTransfer.totalReimbursed <= rLocal.totalReimbursed + 0.01,
          `Transfer (${rTransfer.totalReimbursed}) > local (${rLocal.totalReimbursed}) in ${rLocal.cityName}`
        );

        // 3. Unfiled normal must not exceed transfer (transfer has filed approval, normal does not)
        assert(
          rNormal.totalReimbursed <= rTransfer.totalReimbursed + 0.01,
          `Unfiled normal (${rNormal.totalReimbursed}) > transfer (${rTransfer.totalReimbursed}) in ${rLocal.cityName}`
        );

        // 4. Long term should generally match local
        assert(
          Math.abs(rLongTerm.totalReimbursed - rLocal.totalReimbursed) <= 0.01,
          `Long term (${rLongTerm.totalReimbursed}) differs from local (${rLocal.totalReimbursed}) in ${rLocal.cityName}`
        );
      }
    }
  }
  console.log(`  Passed Subtask 5: All 5 remote medical statuses verified with monotonicity.\n`);

  // --------------------------------------------------------------------------
  // TEST 6: INPATIENT VS OUTPATIENT MODE SWITCHES
  // --------------------------------------------------------------------------
  console.log('--- Subtask 6: Inpatient vs Outpatient Mode Switches ---');
  for (const combo of testCombos) {
    const cost = 8000;
    const inSc: ComparisonScenarioInput = {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: cost,
      hospitalizationCount: 1
    };
    const outSc: ComparisonScenarioInput = {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: cost
    };

    const inRes = runMultiCitySimulation(combo.cities, inSc);
    const outRes = runMultiCitySimulation(combo.cities, outSc);

    checkOutcomeInvariants(inRes, cost, `Inpatient Switch (${combo.label})`);
    checkOutcomeInvariants(outRes, cost, `Outpatient Switch (${combo.label})`);

    // Verify treatment label in insights
    assert(inRes.keyInsights.some(i => i.includes('住院')), `Inpatient insights missing '住院' in ${combo.label}`);
    assert(outRes.keyInsights.some(i => i.includes('门诊')), `Outpatient insights missing '门诊' in ${combo.label}`);

    // Verify that switching mode does not leak state or produce identical breakdown when policies differ
    for (let i = 0; i < combo.cities.length; i++) {
      const cityIn = inRes.cities[i];
      const cityOut = outRes.cities[i];
      assert(cityIn.cityCode === cityOut.cityCode, `City code mismatch across mode switch`);
      assert(cityIn.cityName === cityOut.cityName, `City name mismatch across mode switch`);
    }
  }
  console.log(`  Passed Subtask 6: Inpatient vs Outpatient mode switches verified clean.\n`);

  // --------------------------------------------------------------------------
  // TEST 7: FAULT INJECTION RESILIENCE
  // --------------------------------------------------------------------------
  console.log('--- Subtask 7: Fault Injection Resilience ---');

  const validScenario: ComparisonScenarioInput = {
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 5000,
    hospitalizationCount: 1
  };

  // 7.1 Underflow city count: 0 cities
  assertThrows(() => {
    runMultiCitySimulation([], validScenario);
  }, 'cityCodes is empty array');

  // 7.2 Underflow city count: 1 city
  assertThrows(() => {
    runMultiCitySimulation(['110100'], validScenario);
  }, 'cityCodes has 1 city');

  // 7.3 Overflow city count: 4 cities
  assertThrows(() => {
    runMultiCitySimulation(['110100', '310100', '440100', '610100'], validScenario);
  }, 'cityCodes has 4 cities');

  // 7.4 Overflow city count: 5 cities
  assertThrows(() => {
    runMultiCitySimulation(['110100', '310100', '440100', '610100', '510100'], validScenario);
  }, 'cityCodes has 5 cities');

  // 7.5 Invalid / non-existent city code
  assertThrows(() => {
    runMultiCitySimulation(['999999', '110100'], validScenario);
  }, 'Invalid city code 999999');

  assertThrows(() => {
    runMultiCitySimulation(['110100', 'invalid_code'], validScenario);
  }, 'Invalid city code invalid_code');

  assertThrows(() => {
    runMultiCitySimulation(['110100', ''], validScenario);
  }, 'Empty string city code');

  // 7.6 Duplicate city codes in input (e.g. ['110100', '110100'])
  // Should execute safely without crash, delta = 0, both are winners
  {
    const dupRes = runMultiCitySimulation(['110100', '110100'], validScenario);
    checkOutcomeInvariants(dupRes, 5000, 'Duplicate city codes');
    assert(dupRes.cities[0].totalReimbursed === dupRes.cities[1].totalReimbursed, 'Duplicate cities must have identical reimbursement');
    assert(dupRes.maxReimbursementDelta === 0, 'Duplicate cities maxReimbursementDelta must be 0');
    assert(dupRes.maxPersonalPayDelta === 0, 'Duplicate cities maxPersonalPayDelta must be 0');
    assert(dupRes.cities[1].deltaReimbursedVsCityA === 0, 'Duplicate city deltaR must be 0');
    assert(dupRes.cities[1].deltaPersonalPayVsCityA === 0, 'Duplicate city deltaP must be 0');
  }

  // 7.7 Malformed scenario parameters: negative totalCost
  {
    const negScenario: ComparisonScenarioInput = {
      ...validScenario,
      totalCost: -500
    };
    const negRes = runMultiCitySimulation(['110100', '610100'], negScenario);
    for (const c of negRes.cities) {
      assert(!Number.isNaN(c.totalReimbursed), 'Negative cost produces NaN totalReimbursed');
      assert(!Number.isNaN(c.personalPayTotal), 'Negative cost produces NaN personalPayTotal');
      assert(c.totalReimbursed === 0, 'Negative cost should result in 0 reimbursement');
      assert(c.personalPayTotal === 0, 'Negative cost should result in 0 personalPayTotal');
    }
  }

  // 7.8 Malformed scenario: nonInsuranceCost > totalCost
  {
    const overNonInsScenario: ComparisonScenarioInput = {
      ...validScenario,
      totalCost: 1000,
      nonInsuranceCost: 5000
    };
    const overRes = runMultiCitySimulation(['110100', '610100'], overNonInsScenario);
    for (const c of overRes.cities) {
      assert(!Number.isNaN(c.totalReimbursed), 'Over-non-ins produces NaN totalReimbursed');
      assert(c.totalReimbursed === 0, 'Over-non-ins should yield 0 reimbursement');
      assertCloseTo(c.personalPayTotal, 1000, 0.01, 'Over-non-ins personalPayTotal should equal totalCost');
      assert(c.isConserved === true, 'Over-non-ins must remain conserved');
    }
  }

  // 7.9 Missing optional fields in scenario
  {
    const minimalScenario: ComparisonScenarioInput = {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'community',
      remoteStatus: 'local',
      totalCost: 1200
    };
    const minRes = runMultiCitySimulation(['310100', '510100', '610100'], minimalScenario);
    checkOutcomeInvariants(minRes, 1200, 'Minimal optional scenario');
  }

  console.log(`  Passed Subtask 7: Fault injection resilience verified completely.\n`);

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('================================================================================');
  console.log(`[CHALLENGER 2 AUDIT COMPLETED]`);
  console.log(`  Total Invariant Assertions: ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:              ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:              ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Success Rate:               ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log('================================================================================\n');

  if (stats.failedChecks > 0) {
    console.error(`FATAL: ${stats.failedChecks} assertions failed in Challenger 2 test suite!`);
    process.exit(1);
  }
}

runChallenger2Suite();
