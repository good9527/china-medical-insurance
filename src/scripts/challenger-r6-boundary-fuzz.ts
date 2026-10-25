/**
 * Challenger R6.2: Empirical Boundary Stress & Fuzzing Oracle
 * 
 * Verifies:
 * 1. Shaanxi 11 cities comprehensive boundary and extreme cost fuzzing:
 *    - 0 yuan, 1 cent (0.01 yuan), 10,000,000 extreme cost, sub-cent dust, negative inputs
 *    - Employee (active/retiree) and Resident across all 5 hospital tiers
 *    - Inpatient repeated admissions (1, 2, 3) and 5 remote medical tiers
 *    - Invariants: Physical money conservation, subcomponent conservation, 5-stage funnel conservation
 * 2. Multi-city simulator fuzzing and 4-dimensional winner determination:
 *    - All-tie scenarios (duplicate cities, zero cost, identical benefits)
 *    - Strict verification of 4 winner dimensions:
 *      * isWinnerReimbursed (with tie "(并列)" formatting)
 *      * isWinnerLowestOutPocket (with tie "(并列)" formatting)
 *      * isWinnerLowestDeductible (with tie "(并列)" formatting)
 *      * isWinnerHighestCatastrophic (false and '无 (未触发大病报销)' when 0, "(并列)" on ties when > 0)
 *    - Max delta spread equality (maxReimbursementDelta === maxPersonalPayDelta)
 *    - Baseline delta antisymmetry (deltaR === -deltaP)
 *    - Strict 0-Emoji compliance
 *    - Input validation & fault injection
 */

import { calculateReimbursement } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { shaanxiCities } from '../data/shaanxi';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, RemoteStatus, CalculateRequest, ComparisonScenarioInput, CitySimulationOutcome } from '../data/types';

interface FuzzStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failures: string[];
}

const stats: FuzzStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  failures: []
};

function assert(cond: boolean, msg: string) {
  stats.totalChecks++;
  if (!cond) {
    stats.failedChecks++;
    stats.failures.push(msg);
    if (stats.failures.length <= 25) {
      console.error(`[FAIL] ${msg}`);
    }
  } else {
    stats.passedChecks++;
  }
}

function assertCloseTo(val1: number, val2: number, delta: number, msg: string) {
  assert(Math.abs(val1 - val2) <= delta, `${msg} (expected ${val1} ~ ${val2}, diff=${Math.abs(val1 - val2)})`);
}

function assertThrows(fn: () => void, msg: string) {
  stats.totalChecks++;
  try {
    fn();
    stats.failedChecks++;
    stats.failures.push(`Expected exception not thrown: ${msg}`);
  } catch {
    stats.passedChecks++;
  }
}

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

function assertNoEmoji(text: string, context: string) {
  assert(!EMOJI_REGEX.test(text), `Emoji detected in [${context}]: "${text}"`);
}

export function runR6ChallengerFuzzSuite() {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R6.2] Shaanxi 11 Cities & Multi-City Fuzzing Stress Oracle <<<');
  console.log('================================================================================\n');

  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remotes: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const shaanxiCodes = shaanxiCities.map(c => c.cityCode);

  console.log(`Loaded ${shaanxiCities.length} Shaanxi cities: ${shaanxiCities.map(c => c.cityName).join(', ')}\n`);

  // ---------------------------------------------------------------------------
  // SECTION 1: SHAANXI 11 CITIES EXTREME BOUNDARY & FUZZING ORACLE
  // ---------------------------------------------------------------------------
  console.log('--- Section 1: Shaanxi 11 Cities Exhaustive Extreme Boundary & Fuzzing Oracle ---');

  const boundaryCosts = [
    0,                  // Zero cost
    0.001,              // Sub-cent dust
    0.005,              // Mid sub-cent
    0.01,               // 1 Cent
    0.10,               // 10 Cents
    0.50,               // 50 Cents
    0.99,               // 99 Cents
    1.00,               // 1 Yuan
    50,                 // Low cost
    100,                // 100 Yuan
    199.99,             // Just below common deductible
    200,                // Exact outpatient deductible
    200.01,             // Just above common deductible
    500,                // Common deductible
    650,                // Xi-an tier3 deductible
    850,                // Xi-an tier3_top deductible
    1200,               // Xianyang deductible
    10000,              // Cost range tier
    20000,              // 2025-2026 Catastrophic deductible threshold
    50000,              // High cost range
    100000,             // 100k
    200000,             // 200k
    399999.99,          // Just below Xi-an 400k cap
    400000,             // Exact 400k cap
    400000.01,          // Just above 400k cap
    1000000,            // 1 Million
    5000000,            // 5 Million
    10000000,           // 10 Million Extreme
    50000000            // 50 Million Ultra Extreme
  ];

  let s1Scenarios = 0;

  for (const city of shaanxiCities) {
    const testTypes: Array<{ ins: 'employee' | 'resident'; isRet: boolean }> = [
      { ins: 'employee', isRet: false },
      { ins: 'employee', isRet: true },
      { ins: 'resident', isRet: false }
    ];

    for (const tType of ['outpatient', 'inpatient'] as const) {
      for (const tier of tiers) {
        for (const rem of remotes) {
          const countOptions: (1 | 2 | 3)[] = tType === 'inpatient' ? [1, 2, 3] : [1];

          for (const count of countOptions) {
            for (const cost of boundaryCosts) {
              for (const tt of testTypes) {
                s1Scenarios++;

                // Test with various non-insurance and class B ratios
                const nonInsRatios = [0, 0.1, 0.3];
                const nonInsRatio = nonInsRatios[s1Scenarios % nonInsRatios.length];
                const nonInsuranceCost = Math.round(cost * nonInsRatio * 100) / 100;

                const classBCost = Math.round(cost * 0.15 * 100) / 100;

                const req: CalculateRequest = {
                  cityCode: city.cityCode,
                  insuranceType: tt.ins,
                  isRetiree: tt.isRet,
                  treatmentType: tType,
                  hospitalTier: tier,
                  remoteStatus: rem,
                  hospitalizationCount: count,
                  totalCost: cost,
                  nonInsuranceCost,
                  classBCost,
                  classBSelfPayRatio: 0.05
                };

                const res = calculateReimbursement(req, city);
                const b = res.breakdown;

                // 1. Sanity
                assert(!Number.isNaN(b.totalReimbursed), `NaN totalReimbursed: ${city.cityName} cost=${cost}`);
                assert(!Number.isNaN(b.personalPayTotal), `NaN personalPayTotal: ${city.cityName} cost=${cost}`);
                assert(!Number.isNaN(b.baseReimbursed), `NaN baseReimbursed: ${city.cityName} cost=${cost}`);
                assert(!Number.isNaN(b.catastrophicReimbursed), `NaN catastrophicReimbursed: ${city.cityName} cost=${cost}`);
                assert(!Number.isNaN(b.effectiveRatio), `NaN effectiveRatio: ${city.cityName} cost=${cost}`);
                assert(Number.isFinite(b.totalReimbursed), `Infinite totalReimbursed: ${city.cityName} cost=${cost}`);
                assert(Number.isFinite(b.personalPayTotal), `Infinite personalPayTotal: ${city.cityName} cost=${cost}`);

                // 2. Non-negativity
                assert(b.totalReimbursed >= 0, `Negative totalReimbursed: ${b.totalReimbursed} in ${city.cityName}`);
                assert(b.personalPayTotal >= 0, `Negative personalPayTotal: ${b.personalPayTotal} in ${city.cityName}`);
                assert(b.baseReimbursed >= 0, `Negative baseReimbursed: ${b.baseReimbursed} in ${city.cityName}`);
                assert(b.catastrophicReimbursed >= 0, `Negative catastrophicReimbursed: ${b.catastrophicReimbursed} in ${city.cityName}`);
                assert(b.deductibleDeducted >= 0, `Negative deductibleDeducted: ${b.deductibleDeducted} in ${city.cityName}`);

                // 3. Upper bound
                const effCost = Math.round(Math.max(0, cost) * 100) / 100;
                assert(b.totalReimbursed <= effCost + 0.01, `totalReimbursed (${b.totalReimbursed}) > totalCost (${effCost}) in ${city.cityName}`);

                // 4. Zero cost boundary
                if (effCost === 0) {
                  assert(b.totalReimbursed === 0, `Zero cost had non-zero reimbursement in ${city.cityName}`);
                  assert(b.personalPayTotal === 0, `Zero cost had non-zero personalPayTotal in ${city.cityName}`);
                  assert(b.effectiveRatio === 0, `Zero cost had non-zero effectiveRatio in ${city.cityName}`);
                }

                // 5. Physical Money Conservation: R + P === C_total
                const sumMoney = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
                assertCloseTo(sumMoney, effCost, 0.02, `Money conservation violated in ${city.cityName} cost=${cost}`);

                // 6. Subcomponent Conservation: base + catastrophic === total
                const sumSub = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
                assertCloseTo(sumSub, b.totalReimbursed, 0.01, `Subcomponent conservation violated in ${city.cityName} cost=${cost}`);

                // 7. Funnel ladder consistency
                if (b.personalPayTotal >= (b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted - 0.01)) {
                  const funnelSum = Math.round((b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted + b.totalReimbursed + b.personalSpanCoPay) * 100) / 100;
                  assertCloseTo(funnelSum, b.totalCost, 0.02, `Funnel ladder mismatch in ${city.cityName} cost=${cost}`);
                }

                // 8. 0-Emoji Compliance in notes
                for (const note of res.policyNotes) {
                  assertNoEmoji(note, `${city.cityName} policyNote`);
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(`✓ Section 1 Passed: ${s1Scenarios.toLocaleString()} boundary scenarios tested across all 11 Shaanxi cities.\n`);

  // ---------------------------------------------------------------------------
  // SECTION 2: ADVERSARIAL FAULT INJECTION ON SHAANXI CITIES
  // ---------------------------------------------------------------------------
  console.log('--- Section 2: Adversarial Fault Injection on Shaanxi Cities ---');

  const adversarialRequests: Array<{ label: string; req: CalculateRequest }> = [
    {
      label: 'Negative Total Cost (-500)',
      req: {
        cityCode: '610100',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: -500
      }
    },
    {
      label: 'Negative Non-Insurance & Class B',
      req: {
        cityCode: '610100',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 10000,
        nonInsuranceCost: -500,
        classBCost: -1000
      }
    },
    {
      label: 'Non-Insurance Cost exceeds Total Cost',
      req: {
        cityCode: '610200',
        insuranceType: 'resident',
        treatmentType: 'inpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'local',
        totalCost: 2000,
        nonInsuranceCost: 5000
      }
    },
    {
      label: 'Class B Cost exceeds Total Cost',
      req: {
        cityCode: '610300',
        insuranceType: 'employee',
        treatmentType: 'outpatient',
        hospitalTier: 'tier1',
        remoteStatus: 'local',
        totalCost: 1000,
        classBCost: 3000
      }
    },
    {
      label: 'Sub-cent fractional precision dust',
      req: {
        cityCode: '610403',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 1234.56789,
        nonInsuranceCost: 12.3456,
        classBCost: 78.9012
      }
    },
    {
      label: 'Astronomical Cost (100 Million RMB)',
      req: {
        cityCode: '610100',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 100000000
      }
    }
  ];

  for (const { label, req } of adversarialRequests) {
    const res = calculateReimbursement(req);
    const b = res.breakdown;
    const effCost = Math.max(0, Number(req.totalCost) || 0);

    assert(!Number.isNaN(b.totalReimbursed), `NaN in ${label}`);
    assert(!Number.isNaN(b.personalPayTotal), `NaN in ${label}`);
    assert(b.totalReimbursed >= 0, `Negative reimbursement in ${label}`);
    assert(b.personalPayTotal >= 0, `Negative personalPayTotal in ${label}`);
    assert(b.totalReimbursed <= effCost + 0.01, `Reimbursement over-cap in ${label}`);

    const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
    assertCloseTo(sum, effCost, 0.02, `Money conservation in ${label}`);
  }

  console.log(`✓ Section 2 Passed: All ${adversarialRequests.length} adversarial fault scenarios handled robustly.\n`);

  // ---------------------------------------------------------------------------
  // SECTION 3: MULTI-CITY SIMULATOR ALL-TIES & FOUR-DIMENSIONAL WINNER ORACLE
  // ---------------------------------------------------------------------------
  console.log('--- Section 3: Multi-City Simulator All-Ties & Four-Dimensional Winner Verification ---');

  // Test 3.1: Identical City Pairs (Forced 100% Tie)
  console.log('  Testing 3.1: Forced 100% Tie on Duplicate Cities...');
  for (const code of shaanxiCodes) {
    const testCosts = [0, 0.01, 500, 20000, 1000000];

    for (const cost of testCosts) {
      const scenario: ComparisonScenarioInput = {
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost
      };

      const res = runMultiCitySimulation([code, code], scenario);

      // In a duplicate city scenario:
      assert(res.allConserved === true, `Duplicate cities allConserved failed: ${code} cost=${cost}`);
      assert(res.maxReimbursementDelta === 0, `Duplicate cities maxReimbursementDelta != 0: ${code} cost=${cost}`);
      assert(res.maxPersonalPayDelta === 0, `Duplicate cities maxPersonalPayDelta != 0: ${code} cost=${cost}`);

      // All cities must tie in reimbursement, out-of-pocket, deductible
      for (const o of res.cities) {
        assert(o.isWinnerReimbursed === true, `Tie winner reimbursed not true: ${code}`);
        assert(o.isWinnerLowestOutPocket === true, `Tie winner lowest outpocket not true: ${code}`);
        assert(o.isWinnerLowestDeductible === true, `Tie winner lowest deductible not true: ${code}`);
      }

      // Check format of tie winner strings
      assert(
        res.winnerReimbursedCity.includes('(并列)'),
        `winnerReimbursedCity does not include (并列) on tie: ${res.winnerReimbursedCity}`
      );
      assert(
        res.winnerLowestOutPocketCity.includes('(并列)'),
        `winnerLowestOutPocketCity does not include (并列) on tie: ${res.winnerLowestOutPocketCity}`
      );
      assert(
        res.winnerLowestDeductibleCity.includes('(并列)'),
        `winnerLowestDeductibleCity does not include (并列) on tie: ${res.winnerLowestDeductibleCity}`
      );

      // Check catastrophic winner
      const maxCat = Math.max(...res.cities.map(c => c.catastrophicReimbursed));
      if (maxCat === 0) {
        assert(
          res.winnerHighestCatastrophicCity === '无 (未触发大病报销)',
          `Expected '无 (未触发大病报销)' when maxCat=0, got '${res.winnerHighestCatastrophicCity}'`
        );
        for (const o of res.cities) {
          assert(o.isWinnerHighestCatastrophic === false, `isWinnerHighestCatastrophic should be false when 0`);
        }
      } else {
        assert(
          res.winnerHighestCatastrophicCity.includes('(并列)'),
          `winnerHighestCatastrophicCity should include (并列) when maxCat > 0: ${res.winnerHighestCatastrophicCity}`
        );
        for (const o of res.cities) {
          assert(o.isWinnerHighestCatastrophic === true, `isWinnerHighestCatastrophic should be true on tie > 0`);
        }
      }

      // 0-Emoji
      assertNoEmoji(res.winnerReimbursedCity, 'winnerReimbursedCity');
      assertNoEmoji(res.winnerLowestOutPocketCity, 'winnerLowestOutPocketCity');
      assertNoEmoji(res.winnerLowestDeductibleCity, 'winnerLowestDeductibleCity');
      assertNoEmoji(res.winnerHighestCatastrophicCity, 'winnerHighestCatastrophicCity');
      for (const insight of res.keyInsights) {
        assertNoEmoji(insight, 'keyInsight');
      }
    }
  }
  console.log('  ✓ 3.1 Duplicate Cities 100% Tie Verified.\n');

  // Test 3.2: Zero-Cost All-Ties across Multi-City Combinations
  console.log('  Testing 3.2: Zero-Cost All-Ties across Multi-City Combinations...');
  const zeroPairs = [
    ['610100', '610400'],                      // Xi-an vs Xianyang
    ['610100', '610300'],                      // Xi-an vs Baoji
    ['610200', '610600'],                      // Tongchuan vs Yan-an
    ['610700', '610900', '611000'],            // Hanzhong vs Ankang vs Shangluo
    ['610800', '610500', '610403']             // Yulin vs Weinan vs Yangling
  ];

  for (const pair of zeroPairs) {
    const scZero: ComparisonScenarioInput = {
      insuranceType: 'resident',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 0
    };

    const res = runMultiCitySimulation(pair, scZero);
    assert(res.allConserved === true, `Zero cost allConserved failed: ${pair.join(',')}`);
    assert(res.maxReimbursementDelta === 0, `Zero cost maxReimbursementDelta != 0: ${pair.join(',')}`);
    assert(res.maxPersonalPayDelta === 0, `Zero cost maxPersonalPayDelta != 0: ${pair.join(',')}`);

    // All must tie at 0
    assert(res.winnerReimbursedCity.includes('(并列)'), `Zero cost winnerReimbursedCity should tie`);
    assert(res.winnerLowestOutPocketCity.includes('(并列)'), `Zero cost winnerLowestOutPocketCity should tie`);
    assert(res.winnerLowestDeductibleCity.includes('(并列)'), `Zero cost winnerLowestDeductibleCity should tie`);
    assert(res.winnerHighestCatastrophicCity === '无 (未触发大病报销)', `Zero cost catastrophic should be '无 (未触发大病报销)'`);

    for (const o of res.cities) {
      assert(o.totalReimbursed === 0, `Zero cost totalReimbursed != 0 in ${o.cityName}`);
      assert(o.personalPayTotal === 0, `Zero cost personalPayTotal != 0 in ${o.cityName}`);
      assert(o.deductibleDeducted === 0, `Zero cost deductibleDeducted != 0 in ${o.cityName}`);
      assert(o.catastrophicReimbursed === 0, `Zero cost catastrophicReimbursed != 0 in ${o.cityName}`);
      assert(o.isWinnerReimbursed === true, `Zero cost isWinnerReimbursed should be true`);
      assert(o.isWinnerLowestOutPocket === true, `Zero cost isWinnerLowestOutPocket should be true`);
      assert(o.isWinnerLowestDeductible === true, `Zero cost isWinnerLowestDeductible should be true`);
      assert(o.isWinnerHighestCatastrophic === false, `Zero cost isWinnerHighestCatastrophic should be false`);
      assert(o.deltaReimbursedVsCityA === 0, `Zero cost deltaReimbursedVsCityA != 0`);
      assert(o.deltaPersonalPayVsCityA === 0, `Zero cost deltaPersonalPayVsCityA != 0`);
    }

    for (const insight of res.keyInsights) {
      assertNoEmoji(insight, 'zero cost keyInsight');
    }
  }
  console.log('  ✓ 3.2 Zero-Cost All-Ties Verified.\n');

  // Test 3.3: 1 Cent (0.01 Yuan) Micro-Cost Boundary Fuzzing
  console.log('  Testing 3.3: 1 Cent (0.01 Yuan) Micro-Cost Boundary across Shaanxi & Nationwide...');
  const microCombos = [
    ['610100', '610400', '610300'],
    ['610500', '610800'],
    ['110100', '610100', '440300'],
    ['310100', '510100'],
    ['440100', '610400', '370100']
  ];

  for (const combo of microCombos) {
    for (const tType of ['inpatient', 'outpatient'] as const) {
      const scMicro: ComparisonScenarioInput = {
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: tType,
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 0.01
      };

      const res = runMultiCitySimulation(combo, scMicro);
      assert(res.allConserved === true, `Micro cost allConserved failed: ${combo.join(',')}`);
      assertCloseTo(res.maxReimbursementDelta, res.maxPersonalPayDelta, 0.01, `Micro cost spread equality`);

      for (const o of res.cities) {
        // At 0.01, if city has deductible >= 0.01, reimbursement is 0; if deductible is 0 (like Yulin, Shenzhen, Guangzhou), reimbursement can be 0.01
        const sum = Math.round((o.totalReimbursed + o.personalPayTotal) * 100) / 100;
        assertCloseTo(sum, 0.01, 0.001, `0.01 cost conservation in ${o.cityName}`);
        assert(o.totalReimbursed <= 0.01 + 0.001, `0.01 cost reimbursement over cost in ${o.cityName}`);
        assert(o.personalPayTotal <= 0.01 + 0.001, `0.01 cost personalPayTotal over cost in ${o.cityName}`);

        if (o.deductibleDeducted >= 0.01) {
          assert(o.totalReimbursed === 0, `0.01 cost with deductible >= 0.01 should have 0 reimbursement in ${o.cityName}`);
          assert(o.personalPayTotal === 0.01, `0.01 cost with deductible >= 0.01 should have 0.01 personalPayTotal in ${o.cityName}`);
        }
      }
    }
  }
  console.log('  ✓ 3.3 Micro-Cost (0.01 Yuan) Boundary Verified.\n');

  // Test 3.4: 10,000,000 Yuan Astronomical Extreme Cost Fuzzing
  console.log('  Testing 3.4: 10,000,000 Yuan Astronomical Cost across Shaanxi Combinations...');
  const shaanxiPairs: string[][] = [];
  for (let i = 0; i < shaanxiCodes.length; i++) {
    for (let j = i + 1; j < shaanxiCodes.length; j++) {
      shaanxiPairs.push([shaanxiCodes[i], shaanxiCodes[j]]);
    }
  }

  for (const pair of shaanxiPairs) {
    const sc10M: ComparisonScenarioInput = {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 10000000,
      nonInsuranceCost: 500000,
      classBCost: 1000000
    };

    const res = runMultiCitySimulation(pair, sc10M);
    assert(res.allConserved === true, `10M allConserved failed: ${pair.join(',')}`);
    assertCloseTo(res.maxReimbursementDelta, res.maxPersonalPayDelta, 0.02, `10M spread equality failed: ${pair.join(',')}`);

    const maxR = Math.max(...res.cities.map(c => c.totalReimbursed));
    const minP = Math.min(...res.cities.map(c => c.personalPayTotal));
    const minDed = Math.min(...res.cities.map(c => c.deductibleDeducted));
    const maxCat = Math.max(...res.cities.map(c => c.catastrophicReimbursed));

    for (let i = 0; i < res.cities.length; i++) {
      const o = res.cities[i];
      assert(!Number.isNaN(o.totalReimbursed), `10M NaN totalReimbursed: ${o.cityName}`);
      assert(!Number.isNaN(o.personalPayTotal), `10M NaN personalPayTotal: ${o.cityName}`);
      assert(o.totalReimbursed > 0, `10M zero reimbursement: ${o.cityName}`);
      assert(o.catastrophicReimbursed > 0, `10M zero catastrophic in employee: ${o.cityName}`);

      // Conservation
      const sum = Math.round((o.totalReimbursed + o.personalPayTotal) * 100) / 100;
      assertCloseTo(sum, 10000000, 0.02, `10M conservation failed: ${o.cityName}`);

      // Delta antisymmetry
      const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
      assertCloseTo(deltaSum, 0, 0.02, `10M delta antisymmetry failed: ${o.cityName}`);

      // Winner flags
      assert(o.isWinnerReimbursed === (o.totalReimbursed === maxR), `10M winner reimbursed mismatch`);
      assert(o.isWinnerLowestOutPocket === (o.personalPayTotal === minP), `10M winner lowest outpocket mismatch`);
      assert(o.isWinnerLowestDeductible === (o.deductibleDeducted === minDed), `10M winner lowest deductible mismatch`);
      assert(o.isWinnerHighestCatastrophic === (o.catastrophicReimbursed === maxCat), `10M winner highest catastrophic mismatch`);
    }

    // Check winner strings
    assert(res.winnerReimbursedCity.length > 0, `10M winnerReimbursedCity empty`);
    assert(res.winnerLowestOutPocketCity.length > 0, `10M winnerLowestOutPocketCity empty`);
    assert(res.winnerLowestDeductibleCity.length > 0, `10M winnerLowestDeductibleCity empty`);
    assert(res.winnerHighestCatastrophicCity.length > 0, `10M winnerHighestCatastrophicCity empty`);

    // 0-Emoji
    for (const insight of res.keyInsights) {
      assertNoEmoji(insight, `10M insight for ${pair.join(',')}`);
    }
  }
  console.log(`  ✓ 3.4 Astronomical 10,000,000 Yuan Cost Verified across all ${shaanxiPairs.length} Shaanxi city pairs.\n`);

  // ---------------------------------------------------------------------------
  // SECTION 4: MULTI-CITY FAULT INJECTION & CONTRACT VALIDATION
  // ---------------------------------------------------------------------------
  console.log('--- Section 4: Multi-City Fault Injection & Contract Invariant Validation ---');

  const validScenario: ComparisonScenarioInput = {
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 5000
  };

  // 1. Underflow city count (< 2)
  assertThrows(() => {
    runMultiCitySimulation([], validScenario);
  }, 'Empty city array should throw error');

  assertThrows(() => {
    runMultiCitySimulation(['610100'], validScenario);
  }, 'Single city should throw error');

  // 2. Overflow city count (> 3)
  assertThrows(() => {
    runMultiCitySimulation(['610100', '610400', '610300', '610500'], validScenario);
  }, '4 cities should throw error');

  // 3. Non-existent city code
  assertThrows(() => {
    runMultiCitySimulation(['999999', '610100'], validScenario);
  }, 'Invalid city code 999999 should throw error');

  assertThrows(() => {
    runMultiCitySimulation(['610100', 'INVALID'], validScenario);
  }, 'Invalid city code string should throw error');

  // ---------------------------------------------------------------------------
  // SECTION 5: RANDOMIZED MONTE CARLO FUZZING ORACLE (10,000 ITERATIONS)
  // ---------------------------------------------------------------------------
  console.log('--- Section 5: Randomized Monte Carlo Fuzzing Oracle (10,000 Scenarios) ---');

  for (let iter = 0; iter < 10000; iter++) {
    // Pick 2 or 3 random cities
    const cityCount = (iter % 2 === 0) ? 2 : 3;
    const shuffled = [...shaanxiCodes].sort(() => Math.random() - 0.5);
    const chosenCities = shuffled.slice(0, cityCount);

    // Random totalCost across 6 orders of magnitude: [0.01, 10,000,000]
    const exponent = Math.random() * 7; // 10^0 to 10^7
    const rawCost = Math.pow(10, exponent) * Math.random();
    const totalCost = Math.round(rawCost * 100) / 100;

    const nonInsuranceCost = Math.round(totalCost * Math.random() * 0.3 * 100) / 100;
    const classBCost = Math.round(totalCost * Math.random() * 0.3 * 100) / 100;
    const classBSelfPayRatio = [0.03, 0.05, 0.08, 0.10, 0.15][iter % 5];

    const insuranceType = (iter % 3 === 0) ? 'resident' : 'employee';
    const isRetiree = insuranceType === 'employee' ? (iter % 2 === 0) : false;
    const treatmentType = (iter % 2 === 0) ? 'inpatient' : 'outpatient';
    const hospitalTier = tiers[iter % tiers.length];
    const remoteStatus = remotes[iter % remotes.length];
    const hospitalizationCount = ((iter % 3) + 1) as 1 | 2 | 3;

    const scenario: ComparisonScenarioInput = {
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

    const res = runMultiCitySimulation(chosenCities, scenario);

    // Invariants
    assert(res.allConserved === true, `Random iter ${iter} allConserved failed`);
    assertCloseTo(res.maxReimbursementDelta, res.maxPersonalPayDelta, 0.02, `Random iter ${iter} spread equality`);

    const maxR = Math.max(...res.cities.map(c => c.totalReimbursed));
    const minP = Math.min(...res.cities.map(c => c.personalPayTotal));
    const minDed = Math.min(...res.cities.map(c => c.deductibleDeducted));
    const maxCat = Math.max(...res.cities.map(c => c.catastrophicReimbursed));

    for (const o of res.cities) {
      assert(!Number.isNaN(o.totalReimbursed), `Random iter ${iter} NaN totalReimbursed`);
      assert(!Number.isNaN(o.personalPayTotal), `Random iter ${iter} NaN personalPayTotal`);
      assert(o.totalReimbursed >= 0, `Random iter ${iter} negative reimbursement`);
      assert(o.personalPayTotal >= 0, `Random iter ${iter} negative personalPayTotal`);
      assert(o.totalReimbursed <= totalCost + 0.01, `Random iter ${iter} reimbursement > totalCost`);

      // Money Conservation
      const sum = Math.round((o.totalReimbursed + o.personalPayTotal) * 100) / 100;
      assertCloseTo(sum, totalCost, 0.02, `Random iter ${iter} conservation violated in ${o.cityName}`);

      // Component Conservation
      const compSum = Math.round((o.baseReimbursed + o.catastrophicReimbursed) * 100) / 100;
      assertCloseTo(compSum, o.totalReimbursed, 0.01, `Random iter ${iter} subcomponent mismatch in ${o.cityName}`);

      // Delta Antisymmetry
      const deltaSum = Math.round((o.deltaReimbursedVsCityA + o.deltaPersonalPayVsCityA) * 100) / 100;
      assertCloseTo(deltaSum, 0, 0.02, `Random iter ${iter} delta antisymmetry violated in ${o.cityName}`);

      // Winner determination consistency
      assert(o.isWinnerReimbursed === (o.totalReimbursed === maxR), `Random iter ${iter} winner reimbursed mismatch`);
      assert(o.isWinnerLowestOutPocket === (o.personalPayTotal === minP), `Random iter ${iter} winner lowest outpocket mismatch`);
      assert(o.isWinnerLowestDeductible === (o.deductibleDeducted === minDed), `Random iter ${iter} winner lowest deductible mismatch`);
      assert(o.isWinnerHighestCatastrophic === (maxCat > 0 && o.catastrophicReimbursed === maxCat), `Random iter ${iter} winner highest catastrophic mismatch`);
    }

    // Winner string checks
    if (res.cities.filter(c => c.isWinnerReimbursed).length > 1) {
      assert(res.winnerReimbursedCity.includes('(并列)'), `Random iter ${iter} winnerReimbursedCity tie missing (并列)`);
    }
    if (res.cities.filter(c => c.isWinnerLowestOutPocket).length > 1) {
      assert(res.winnerLowestOutPocketCity.includes('(并列)'), `Random iter ${iter} winnerLowestOutPocketCity tie missing (并列)`);
    }
    if (res.cities.filter(c => c.isWinnerLowestDeductible).length > 1) {
      assert(res.winnerLowestDeductibleCity.includes('(并列)'), `Random iter ${iter} winnerLowestDeductibleCity tie missing (并列)`);
    }
    if (maxCat === 0) {
      assert(res.winnerHighestCatastrophicCity === '无 (未触发大病报销)', `Random iter ${iter} winnerHighestCatastrophicCity expected '无'`);
    } else if (res.cities.filter(c => c.isWinnerHighestCatastrophic).length > 1) {
      assert(res.winnerHighestCatastrophicCity.includes('(并列)'), `Random iter ${iter} winnerHighestCatastrophicCity tie missing (并列)`);
    }

    // 0-Emoji checks
    for (const insight of res.keyInsights) {
      assertNoEmoji(insight, `Random iter ${iter} keyInsight`);
    }
  }

  console.log('✓ Section 5 Passed: 10,000 Randomized Monte Carlo Fuzzing Scenarios 100% verified.\n');

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('================================================================================');
  console.log(`[R6.2 CHALLENGER FUZZING AUDIT COMPLETED]`);
  console.log(`  Total Invariant Assertions: ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:              ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:              ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Success Rate:               ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log('================================================================================\n');

  if (stats.failedChecks > 0) {
    console.error(`FATAL: ${stats.failedChecks} assertions failed in R6.2 Challenger Suite!`);
    process.exit(1);
  }
}

runR6ChallengerFuzzSuite();
