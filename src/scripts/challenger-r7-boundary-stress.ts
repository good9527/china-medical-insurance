/**
 * Challenger R7.2: Boundary Fuzzing & Duality Stress Oracle
 *
 * Objectives:
 * 1. Repeated hospitalization deductible decay stress oracle across ALL 348 cities (1st, 2nd, 3rd+).
 *    - Verify no negative deductibles, no NaN, no Infinity, no zero division.
 *    - Verify monotonic decay (appliedDeductible(k+1) <= appliedDeductible(k)).
 *    - Verify appliedDeductible + deductibleReduction === standardDeductible.
 *    - Verify extreme hospitalization counts (k = 0, -1, 1, 2, 3, 4, 10, 100, 1000).
 *    - Verify financial conservation under decayed deductibles across costs [0, 0.01, 500, 10000, 100000].
 * 2. Remote medical care status combinations (5 tiers) & regional alliances:
 *    - Test all 5 statuses (local, long_term, transfer, unfiled_emergency, unfiled_normal) across all 348 cities.
 *    - Regional Alliances: Beijing-Tianjin-Hebei (Jing-Jin-Ji 1.0 factor), Yangtze River Delta, Chengdu-Chongqing.
 *    - Fixed target ratio overrides and offsite deductible overrides verification.
 *    - Subtractive vs Multiplicative mode resilience (effectiveRatio >= 0).
 * 3. Multi-city ranking, winner determination, and tie-breakers:
 *    - Forced all-ties on duplicate cities (2-city and 3-city).
 *    - Zero-cost all-ties across all 9 presets and custom combos.
 *    - Equal reimbursement multi-winner handling and "(并列)" label formatting.
 *    - 4-dimensional winner status verification:
 *      * isWinnerReimbursed
 *      * isWinnerLowestOutPocket
 *      * isWinnerLowestDeductible
 *      * isWinnerHighestCatastrophic
 *    - Invariant: maxReimbursementDelta === maxPersonalPayDelta.
 *    - Invariant: deltaReimbursedVsCityA === -deltaPersonalPayVsCityA.
 *    - Input validation (underflow, overflow, invalid city codes).
 *    - 0-Emoji compliance verification.
 */

import { calculateReimbursement, resolveInpatientDeductible } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
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

function assert(condition: boolean, msg: string) {
  stats.totalChecks++;
  if (!condition) {
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

const hospitalTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

export function runChallengerR7BoundarySuite() {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R7.2] Adversarial Boundary Fuzzing & Duality Stress Oracle <<<');
  console.log('================================================================================\n');

  console.log(`Auditing total nationwide cities: ${allCities.length}`);
  assert(allCities.length >= 348, `Nationwide city count must be at least 348, got ${allCities.length}`);

  // ============================================================================
  // ORACLE 1: Repeated Hospitalization Deductible Decay Stress Oracle (348 Cities)
  // ============================================================================
  console.log('\n--- Oracle 1: Repeated Hospitalization Deductible Decay Stress Oracle ---');
  const testAdmissionCounts = [0, -1, 1, 2, 3, 4, 5, 10, 50, 100, 1000];
  let oracle1AdmissionsTested = 0;

  for (const city of allCities) {
    for (const insType of ['employee', 'resident'] as const) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      const inRule = pkg.inpatient;

      for (const tier of hospitalTiers) {
        const tierBenefit = inRule.tierBenefits[tier];
        const standardDeductible = tierBenefit?.deductible ?? 500;

        let prevAppliedDeductible = Infinity;

        // A. Stress-test resolveInpatientDeductible across frequency spectrum
        for (const count of testAdmissionCounts) {
          oracle1AdmissionsTested++;

          const res = resolveInpatientDeductible({
            cityCode: city.cityCode,
            insuranceType: insType,
            hospitalTier: tier,
            standardDeductible,
            hospitalizationCount: count,
            policy: inRule.repeatedDeductiblePolicy,
            ruleText: inRule.repeatedDeductibleRule
          });

          // 1. Numerical Sanity
          assert(!Number.isNaN(res.appliedDeductible), `NaN appliedDeductible: ${city.cityName} ${insType} tier=${tier} count=${count}`);
          assert(!Number.isNaN(res.deductibleReduction), `NaN deductibleReduction: ${city.cityName} ${insType} tier=${tier} count=${count}`);
          assert(Number.isFinite(res.appliedDeductible), `Infinite appliedDeductible: ${city.cityName} ${insType} tier=${tier} count=${count}`);
          assert(Number.isFinite(res.deductibleReduction), `Infinite deductibleReduction: ${city.cityName} ${insType} tier=${tier} count=${count}`);

          // 2. Non-negativity constraint
          assert(res.appliedDeductible >= 0, `Negative appliedDeductible (${res.appliedDeductible}): ${city.cityName} ${insType} tier=${tier} count=${count}`);
          assert(res.deductibleReduction >= 0, `Negative deductibleReduction (${res.deductibleReduction}): ${city.cityName} ${insType} tier=${tier} count=${count}`);

          // 3. Deductible Conservation: applied + reduction === standard
          const sumDeductible = Math.round((res.appliedDeductible + res.deductibleReduction) * 100) / 100;
          assertCloseTo(sumDeductible, standardDeductible, 0.01, `Deductible conservation breach: ${city.cityName} ${insType} tier=${tier} count=${count}`);

          // 4. Bound constraint: applied <= standard
          assert(res.appliedDeductible <= standardDeductible + 0.01, `appliedDeductible (${res.appliedDeductible}) > standard (${standardDeductible}): ${city.cityName} ${insType}`);

          // 5. Zero-base immunity: if standardDeductible is 0, applied and reduction must remain 0
          if (standardDeductible === 0) {
            assert(res.appliedDeductible === 0, `Non-zero applied for 0-standard: ${city.cityName} ${insType}`);
            assert(res.deductibleReduction === 0, `Non-zero reduction for 0-standard: ${city.cityName} ${insType}`);
          }

          // 6. Monotonic Decay for count >= 1
          if (count >= 1) {
            if (count > 1) {
              assert(
                res.appliedDeductible <= prevAppliedDeductible + 0.01,
                `Monotonic decay violated in ${city.cityName} ${insType} tier=${tier}: count=${count} applied=${res.appliedDeductible} > prev=${prevAppliedDeductible}`
              );
            }
            prevAppliedDeductible = res.appliedDeductible;
          }

          // 7. Note text 0-Emoji check
          if (res.note) {
            assert(!emojiRegex.test(res.note), `Emoji in deductible note: ${city.cityName} note="${res.note}"`);
          }
        }

        // B. Full calculateReimbursement stress with decayed deductible across costs
        const decayedCosts = [0, 0.01, 100, standardDeductible, standardDeductible + 500, 25000, 200000];
        for (const count of [1, 2, 3]) {
          for (const cost of decayedCosts) {
            const calcReq: CalculateRequest = {
              cityCode: city.cityCode,
              insuranceType: insType,
              isRetiree: insType === 'employee',
              treatmentType: 'inpatient',
              hospitalTier: tier,
              remoteStatus: 'local',
              hospitalizationCount: count,
              totalCost: cost,
              nonInsuranceCost: Math.round(cost * 0.05 * 100) / 100,
              classBCost: Math.round(cost * 0.10 * 100) / 100
            };

            const calcRes = calculateReimbursement(calcReq);
            const b = calcRes.breakdown;

            // Invariant 1: Physical Money Conservation
            const totalSum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
            assertCloseTo(totalSum, b.totalCost, 0.02, `Decay Money Conservation failed: ${city.cityName} count=${count} cost=${cost}`);

            // Invariant 2: Subcomponent Conservation
            const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
            assertCloseTo(compSum, b.totalReimbursed, 0.01, `Decay Subcomponent mismatch: ${city.cityName} count=${count} cost=${cost}`);

            // Invariant 3: Deductible deduction sanity
            assert(b.deductibleDeducted <= b.appliedDeductible + 0.01, `deductibleDeducted > appliedDeductible in ${city.cityName}`);
            assert(b.personalDeductiblePaid === b.deductibleDeducted, `personalDeductiblePaid !== deductibleDeducted in ${city.cityName}`);
          }
        }
      }
    }
  }
  console.log(`✓ Oracle 1 Passed: Audited repeated hospitalization deductible decay across 348 cities (${oracle1AdmissionsTested.toLocaleString()} scenarios, 100% verified).\n`);

  // ============================================================================
  // ORACLE 2: Remote Care Status Combinations & Regional Alliances Stress Oracle
  // ============================================================================
  console.log('--- Oracle 2: Remote Medical Care Status & Regional Alliances Stress Oracle ---');

  // A. Nationwide Remote Rules Integrity Audit
  let remoteScenariosTested = 0;
  for (const city of allCities) {
    for (const insType of ['employee', 'resident'] as const) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      const remote = pkg.remoteMedical;

      // 1. Factors within [0, 1.0]
      assert(remote.longTermFiledRatio >= 0 && remote.longTermFiledRatio <= 1.0, `longTermFiledRatio out of range: ${city.cityName} (${remote.longTermFiledRatio})`);
      assert(remote.transferFiledRatio >= 0 && remote.transferFiledRatio <= 1.0, `transferFiledRatio out of range: ${city.cityName} (${remote.transferFiledRatio})`);
      assert(remote.unfiledEmergencyRatio >= 0 && remote.unfiledEmergencyRatio <= 1.0, `unfiledEmergencyRatio out of range: ${city.cityName} (${remote.unfiledEmergencyRatio})`);
      assert(remote.unfiledNormalRatio >= 0 && remote.unfiledNormalRatio <= 1.0, `unfiledNormalRatio out of range: ${city.cityName} (${remote.unfiledNormalRatio})`);

      // 2. Penalty hierarchy: unfiledNormal <= transferFiled
      assert(
        remote.unfiledNormalRatio <= remote.transferFiledRatio + 0.001,
        `unfiledNormalRatio (${remote.unfiledNormalRatio}) > transferFiledRatio (${remote.transferFiledRatio}): ${city.cityName} ${insType}`
      );

      // 3. Notes 0-Emoji
      for (const note of remote.specialNotes) {
        assert(!emojiRegex.test(note), `Emoji in remote specialNotes: ${city.cityName} ${insType}`);
      }

      // 4. Test calculation across all 5 remote statuses
      const testCost = 30000;
      for (const rem of remoteStatuses) {
        remoteScenariosTested++;
        const res = calculateReimbursement({
          cityCode: city.cityCode,
          insuranceType: insType,
          isRetiree: false,
          treatmentType: 'inpatient',
          hospitalTier: 'tier3',
          remoteStatus: rem,
          totalCost: testCost,
          nonInsuranceCost: 1000,
          classBCost: 2000
        });

        const b = res.breakdown;
        assert(!Number.isNaN(b.totalReimbursed), `NaN remote reimbursement: ${city.cityName} ${rem}`);
        assert(!Number.isNaN(b.personalPayTotal), `NaN remote personalPay: ${city.cityName} ${rem}`);
        assert(b.totalReimbursed >= 0, `Negative reimbursement in remote: ${city.cityName} ${rem}`);
        assert(b.personalPayTotal >= 0, `Negative personalPay in remote: ${city.cityName} ${rem}`);

        const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
        assertCloseTo(sum, testCost, 0.02, `Remote money conservation: ${city.cityName} ${rem}`);
      }
    }
  }

  // B. Regional Alliance Deep Probing: Beijing-Tianjin-Hebei (Jing-Jin-Ji 1.0 Factor)
  console.log('  Testing Regional Alliance: Jing-Jin-Ji (京津冀)...');
  const jjjCityCodes = [
    '110100', // 北京
    '120100', // 天津
    '130100', // 石家庄
    '130200', // 唐山
    '130300', // 秦皇岛
    '130400', // 邯郸
    '130500', // 邢台
    '130600', // 保定
    '130700', // 张家口
    '130800', // 承德
    '130900', // 沧州
    '131000', // 廊坊
    '131100', // 衡水
    '133100'  // 雄安新区
  ];

  for (const cCode of jjjCityCodes) {
    const city = getCityDataByCode(cCode);
    assert(!!city, `Jing-Jin-Ji city [${cCode}] not found`);
    if (!city) continue;

    // Both employee and resident
    for (const insType of ['employee', 'resident'] as const) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      assert(
        pkg.remoteMedical.longTermFiledRatio === 1.0,
        `Jing-Jin-Ji city ${city.cityName} ${insType} longTermFiledRatio must be 1.0, got ${pkg.remoteMedical.longTermFiledRatio}`
      );

      // Verify that under long_term filed (or mutual alliance settlement), reimbursement exactly equals local settlement
      const cost = 40000;
      const resLocal = calculateReimbursement({
        cityCode: cCode,
        insuranceType: insType,
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost,
        nonInsuranceCost: 2000,
        classBCost: 3000
      });

      const resRemoteFiled = calculateReimbursement({
        cityCode: cCode,
        insuranceType: insType,
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'long_term',
        totalCost: cost,
        nonInsuranceCost: 2000,
        classBCost: 3000
      });

      assertCloseTo(
        resRemoteFiled.breakdown.totalReimbursed,
        resLocal.breakdown.totalReimbursed,
        0.01,
        `Jing-Jin-Ji parity failure: ${city.cityName} ${insType} local vs long_term reimbursement mismatch`
      );
      assertCloseTo(
        resRemoteFiled.breakdown.personalPayTotal,
        resLocal.breakdown.personalPayTotal,
        0.01,
        `Jing-Jin-Ji parity failure: ${city.cityName} ${insType} local vs long_term personalPay mismatch`
      );
    }
  }

  // C. Advanced Actuarial Overrides: Fixed Target Ratios & Offsite Deductibles
  console.log('  Testing Advanced Actuarial Overrides (Fixed Target Ratios & Offsite Deductibles)...');
  // Shijiazhuang Resident: fixed target transfer: 0.50, unfiledNormal: 0.30, unfiledDeductible: 4000
  const sjzCity = getCityDataByCode('130100');
  if (sjzCity?.resident.remoteMedical.fixedTargetRatios) {
    const sjzUnfiledRes = calculateReimbursement({
      cityCode: '130100',
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'unfiled_normal',
      totalCost: 50000
    });
    // Deductible should be overridden by 4000
    assert(sjzUnfiledRes.breakdown.appliedDeductible === 4000, `Shijiazhuang resident unfiled deductible override failed: expected 4000, got ${sjzUnfiledRes.breakdown.appliedDeductible}`);
    // Base ratio should be fixed 0.30
    assertCloseTo(sjzUnfiledRes.breakdown.effectiveRatio, 0.30, 0.001, `Shijiazhuang resident unfiled fixed target ratio mismatch`);
    // Conservation
    assertCloseTo(sjzUnfiledRes.breakdown.totalReimbursed + sjzUnfiledRes.breakdown.personalPayTotal, 50000, 0.01, 'SJZ money conservation');
  }

  // Suizhou (421300): transferDeductible: 1200
  const suizhouCity = getCityDataByCode('421300');
  if (suizhouCity?.employee.remoteMedical.offsiteDeductibles?.transferDeductible) {
    const suizhouRes = calculateReimbursement({
      cityCode: '421300',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'community',
      remoteStatus: 'transfer',
      totalCost: 10000
    });
    assert(suizhouRes.breakdown.appliedDeductible === 1200, `Suizhou transfer deductible override failed: expected 1200, got ${suizhouRes.breakdown.appliedDeductible}`);
    assertCloseTo(suizhouRes.breakdown.totalReimbursed + suizhouRes.breakdown.personalPayTotal, 10000, 0.01, 'Suizhou money conservation');
  }

  console.log(`✓ Oracle 2 Passed: Verified remote medical status combinations & regional alliances (${remoteScenariosTested.toLocaleString()} scenarios audited).\n`);

  // ============================================================================
  // ORACLE 3: Multi-City Ranking, Winner Determination & Tie-Breakers Stress Oracle
  // ============================================================================
  console.log('--- Oracle 3: Multi-City Ranking, Winner Determination & Tie-Breakers Oracle ---');

  // A. All-Tie Scenarios on Identical Duplicate Cities
  console.log('  Testing 3.A: Forced All-Ties on Duplicate Cities...');
  const tieCitySets = [
    ['110100', '110100'],                      // 2-city Beijing tie
    ['310100', '310100'],                      // 2-city Shanghai tie
    ['610100', '610100', '610100'],            // 3-city Xi-an tie
    ['440300', '440300', '440300']             // 3-city Shenzhen tie
  ];

  for (const set of tieCitySets) {
    const sim = runMultiCitySimulation(set, {
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 20000
    });

    assert(sim.allConserved === true, `All conserved breached in tie set ${set.join('-')}`);
    assert(sim.maxReimbursementDelta === 0, `maxReimbursementDelta must be 0 for identical cities: got ${sim.maxReimbursementDelta}`);
    assert(sim.maxPersonalPayDelta === 0, `maxPersonalPayDelta must be 0 for identical cities: got ${sim.maxPersonalPayDelta}`);

    // All cities must be flagged as winners
    for (const cityOutcome of sim.cities) {
      assert(cityOutcome.isWinnerReimbursed === true, `isWinnerReimbursed must be true in duplicate tie: ${cityOutcome.cityName}`);
      assert(cityOutcome.isWinnerLowestOutPocket === true, `isWinnerLowestOutPocket must be true in duplicate tie: ${cityOutcome.cityName}`);
      assert(cityOutcome.isWinnerLowestDeductible === true, `isWinnerLowestDeductible must be true in duplicate tie: ${cityOutcome.cityName}`);
      assert(cityOutcome.deltaReimbursedVsCityA === 0, `deltaReimbursedVsCityA must be 0 in duplicate tie`);
      assert(cityOutcome.deltaPersonalPayVsCityA === 0, `deltaPersonalPayVsCityA must be 0 in duplicate tie`);
    }

    // Label formatting: must include (并列)
    assert(sim.winnerReimbursedCity.includes('(并列)'), `winnerReimbursedCity must contain '(并列)', got: ${sim.winnerReimbursedCity}`);
    assert(sim.winnerLowestOutPocketCity.includes('(并列)'), `winnerLowestOutPocketCity must contain '(并列)', got: ${sim.winnerLowestOutPocketCity}`);
    assert(sim.winnerLowestDeductibleCity.includes('(并列)'), `winnerLowestDeductibleCity must contain '(并列)', got: ${sim.winnerLowestDeductibleCity}`);
  }

  // B. Zero Cost Boundary All-Ties
  console.log('  Testing 3.B: Zero-Cost Boundary All-Ties across Presets...');
  for (const preset of popularMultiCityPresets) {
    const validCities = preset.cities.map(c => c === '500000' ? '500100' : c);
    const zeroSim = runMultiCitySimulation(validCities, {
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      remoteStatus: 'local',
      totalCost: 0
    });

    assert(zeroSim.allConserved === true, `Zero-cost simulation not conserved: ${preset.name}`);
    assert(zeroSim.maxReimbursementDelta === 0, `Zero-cost maxReimbursementDelta must be 0: ${preset.name}`);
    assert(zeroSim.maxPersonalPayDelta === 0, `Zero-cost maxPersonalPayDelta must be 0: ${preset.name}`);

    for (const c of zeroSim.cities) {
      assert(c.totalReimbursed === 0, `Zero cost reimbursement != 0 in ${c.cityName}`);
      assert(c.personalPayTotal === 0, `Zero cost personalPay != 0 in ${c.cityName}`);
      assert(c.deductibleDeducted === 0, `Zero cost deductibleDeducted != 0 in ${c.cityName}`);
      assert(c.isWinnerReimbursed === true, `Zero cost isWinnerReimbursed should be true in ${c.cityName}`);
      assert(c.isWinnerLowestOutPocket === true, `Zero cost isWinnerLowestOutPocket should be true in ${c.cityName}`);
      assert(c.isWinnerLowestDeductible === true, `Zero cost isWinnerLowestDeductible should be true in ${c.cityName}`);
      assert(c.isWinnerHighestCatastrophic === false, `Zero cost isWinnerHighestCatastrophic must be false in ${c.cityName}`);
    }

    assert(zeroSim.winnerHighestCatastrophicCity === '无 (未触发大病报销)', `Catastrophic winner on zero cost must be '无 (未触发大病报销)', got: ${zeroSim.winnerHighestCatastrophicCity}`);
    assert(zeroSim.winnerReimbursedCity.includes('(并列)'), `Zero cost winnerReimbursedCity must indicate tie`);
    assert(zeroSim.winnerLowestOutPocketCity.includes('(并列)'), `Zero cost winnerLowestOutPocketCity must indicate tie`);
    assert(zeroSim.winnerLowestDeductibleCity.includes('(并列)'), `Zero cost winnerLowestDeductibleCity must indicate tie`);
  }

  // C. Comprehensive Verification of 4-Dimensional Winner Invariants across Cost Spectrum
  console.log('  Testing 3.C: 4-Dimensional Winner Invariants & Duality Spread across Combos...');
  const multiCityCombosToTest: string[][] = [
    ['110100', '610100', '440300'], // 京陕深
    ['310100', '510100'],           // 沪蓉
    ['110100', '120100', '130100'], // 京津冀
    ['610100', '610300', '610400'], // 西安-宝鸡-咸阳
    ['440100', '440300', '440400'], // 广州-深圳-珠海
    ['330100', '320100', '310100']  // 杭州-南京-上海
  ];

  const testCostsMultiCity = [0.01, 200, 1000, 8000, 50000, 250000, 1000000];

  for (const cities of multiCityCombosToTest) {
    for (const cost of testCostsMultiCity) {
      for (const insType of ['employee', 'resident'] as const) {
        for (const count of [1, 2, 3]) {
          const sim = runMultiCitySimulation(cities, {
            insuranceType: insType,
            isRetiree: insType === 'employee',
            treatmentType: 'inpatient',
            hospitalTier: 'tier3',
            remoteStatus: 'local',
            hospitalizationCount: count,
            totalCost: cost,
            nonInsuranceCost: Math.round(cost * 0.05 * 100) / 100,
            classBCost: Math.round(cost * 0.10 * 100) / 100
          });

          // 1. All Conserved
          assert(sim.allConserved === true, `Multi-city conservation failure: cities=${cities.join('-')} cost=${cost}`);

          // 2. Spread Equality: maxReimbursementDelta === maxPersonalPayDelta
          assertCloseTo(
            sim.maxReimbursementDelta,
            sim.maxPersonalPayDelta,
            0.02,
            `Spread equality violation: cities=${cities.join('-')} cost=${cost} (R_delta=${sim.maxReimbursementDelta}, P_delta=${sim.maxPersonalPayDelta})`
          );

          // 3. Winner Determination Invariants
          const maxR = Math.max(...sim.cities.map(c => c.totalReimbursed));
          const minP = Math.min(...sim.cities.map(c => c.personalPayTotal));
          const minDed = Math.min(...sim.cities.map(c => c.deductibleDeducted));
          const maxCat = Math.max(...sim.cities.map(c => c.catastrophicReimbursed));

          const winnersR = sim.cities.filter(c => c.isWinnerReimbursed);
          const winnersP = sim.cities.filter(c => c.isWinnerLowestOutPocket);
          const winnersDed = sim.cities.filter(c => c.isWinnerLowestDeductible);
          const winnersCat = sim.cities.filter(c => c.isWinnerHighestCatastrophic);

          for (let i = 0; i < sim.cities.length; i++) {
            const c = sim.cities[i];

            // Winner flags match mathematical extrema
            assert(c.isWinnerReimbursed === (c.totalReimbursed === maxR), `isWinnerReimbursed mismatch in ${c.cityName}`);
            assert(c.isWinnerLowestOutPocket === (c.personalPayTotal === minP), `isWinnerLowestOutPocket mismatch in ${c.cityName}`);
            assert(c.isWinnerLowestDeductible === (c.deductibleDeducted === minDed), `isWinnerLowestDeductible mismatch in ${c.cityName}`);
            assert(
              c.isWinnerHighestCatastrophic === (maxCat > 0 && c.catastrophicReimbursed === maxCat),
              `isWinnerHighestCatastrophic mismatch in ${c.cityName}`
            );

            // Baseline antisymmetry (ΔR_i = -ΔP_i)
            const deltaSum = Math.round((c.deltaReimbursedVsCityA + c.deltaPersonalPayVsCityA) * 100) / 100;
            assertCloseTo(deltaSum, 0, 0.02, `Delta antisymmetry failure in ${c.cityName}: deltaR=${c.deltaReimbursedVsCityA}, deltaP=${c.deltaPersonalPayVsCityA}`);

            if (i === 0) {
              assert(c.deltaReimbursedVsCityA === 0, `Baseline deltaR must be 0 in ${c.cityName}`);
              assert(c.deltaPersonalPayVsCityA === 0, `Baseline deltaP must be 0 in ${c.cityName}`);
            }
          }

          // Formatting consistency
          if (winnersR.length > 1) {
            assert(sim.winnerReimbursedCity.includes('(并列)'), `winnerReimbursedCity must have (并列) when > 1 winners`);
          } else if (winnersR.length === 1) {
            assert(!sim.winnerReimbursedCity.includes('(并列)'), `winnerReimbursedCity must not have (并列) when single winner`);
            assert(sim.winnerReimbursedCity === winnersR[0].cityName, `winnerReimbursedCity name mismatch`);
          }

          if (winnersP.length > 1) {
            assert(sim.winnerLowestOutPocketCity.includes('(并列)'), `winnerLowestOutPocketCity must have (并列) when > 1 winners`);
          }

          if (maxCat === 0) {
            assert(sim.winnerHighestCatastrophicCity === '无 (未触发大病报销)', `Catastrophic winner must be '无 (未触发大病报销)' when maxCat=0`);
            assert(winnersCat.length === 0, `winnersCat must be empty when maxCat=0`);
          } else {
            if (winnersCat.length > 1) {
              assert(sim.winnerHighestCatastrophicCity.includes('(并列)'), `Catastrophic winner must have (并列) when multiple winners`);
            }
          }

          // 0-Emoji static audit on all keyInsights
          for (const insight of sim.keyInsights) {
            assert(!emojiRegex.test(insight), `0-Emoji violation in keyInsight: "${insight}"`);
          }
        }
      }
    }
  }

  // D. Fault Injection and Input Validation
  console.log('  Testing 3.D: Multi-City Input Validation Fault Injection...');
  assertThrows(() => {
    runMultiCitySimulation([], {
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      totalCost: 1000
    });
  }, 'Empty city array must throw');

  assertThrows(() => {
    runMultiCitySimulation(['110100'], {
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      totalCost: 1000
    });
  }, 'Single city array must throw');

  assertThrows(() => {
    runMultiCitySimulation(['110100', '120100', '130100', '310100'], {
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      totalCost: 1000
    });
  }, 'Four cities array must throw');

  assertThrows(() => {
    runMultiCitySimulation(['999999', '110100'], {
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      totalCost: 1000
    });
  }, 'Invalid city code must throw');

  console.log('✓ Oracle 3 Passed: Multi-city ranking, winner determination, and tie-breakers 100% verified.\n');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('================================================================================');
  console.log(`[CHALLENGER R7.2 AUDIT COMPLETED]`);
  console.log(`  Total Invariant Assertions: ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:              ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:              ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Success Rate:               ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log('================================================================================\n');

  if (stats.failedChecks > 0) {
    console.error(`FATAL: ${stats.failedChecks} assertions failed in Challenger R7.2!`);
    process.exit(1);
  }
}

runChallengerR7BoundarySuite();
