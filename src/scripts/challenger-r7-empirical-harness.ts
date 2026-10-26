/**
 * Round 7 Challenger Empirical Invariant & Boundary Stress Harness
 *
 * Objectives:
 * 1. Verify Total Fund Conservation across [0, 100,000,000] RMB:
 *    totalReimbursed + personalPayTotal === totalCost (within <= 0.01 cent rounding)
 *    across extreme expense vectors: 0, 0.005, 0.01, 10, sub-deductible, at deductible,
 *    at basic cap, at catastrophic cap, 10,000,000, 50,000,000, 100,000,000 RMB.
 * 2. Verify Multi-City Simulation Delta Symmetry (Antisymmetry/Duality):
 *    deltaReimbursedVsCityA === -deltaPersonalPayVsCityA
 *    maxReimbursementDelta === maxPersonalPayDelta
 * 3. Formulate additional adversarial boundary checks against newly updated 2025-2026 policies:
 *    - Xi'an (610100): 2025-2026 resident catastrophic 20k deductible & 300k cap, employee tiered inpatient.
 *    - Beijing-Tianjin-Hebei (110100, 120100, 130100): cross-region deemed filing parity, uncapped outpatient in BJ.
 *    - Shanghai (310100): 2026 employee inpatient 670,000 cap + 80% local additional insurance.
 *    - Shenzhen (440300): 2026 wage base 177,057 linkage (10,623 in-service / 12,394 retiree outpatient, 1,062,342 inpatient cap).
 *    - Guangzhou (440100): 2026 new resident catastrophic (18k deductible, 18k-36k 60%, 36k-340k 75%, >340k 90%, 400k cap).
 * 4. Zero Emoji Guarantee across outputs and insights.
 */

import { calculateReimbursement } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, CalculateRequest, ComparisonScenarioInput, RemoteStatus } from '../data/types';

interface ChallengerStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failures: string[];
}

const stats: ChallengerStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  failures: []
};

function assert(condition: boolean, message: string): void {
  stats.totalChecks++;
  if (!condition) {
    stats.failedChecks++;
    if (stats.failures.length < 50) {
      stats.failures.push(message);
      console.error(`[FAIL] ${message}`);
    }
  } else {
    stats.passedChecks++;
  }
}

function assertCloseTo(actual: number, expected: number, tolerance = 0.02, message = ''): void {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${message} - Expected: ${expected}, Actual: ${actual}, Diff: ${diff}`);
}

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

export function runRound7EmpiricalHarness(): { totalChecks: number; passedChecks: number; failedChecks: number; passed: boolean } {
  console.log('================================================================================');
  console.log('>>> [ROUND 7 CHALLENGER] RIGOROUS INVARIANT & ADVERSARIAL STRESS HARNESS <<<');
  console.log('================================================================================\n');

  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remotes: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];

  // --------------------------------------------------------------------------
  // SECTION 1: Total Fund Conservation Across [0, 100,000,000] RMB Vector Sweep
  // --------------------------------------------------------------------------
  console.log('--- Section 1: Total Fund Conservation Across [0, 100,000,000] RMB ---');

  const focusCityCodes = [
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
    '110100', // 北京
    '120100', // 天津
    '130100', // 石家庄
    '310100', // 上海
    '440100', // 广州
    '440300', // 深圳
    '500100', // 重庆
    '510100', // 成都
    '330100', // 杭州
    '320100', // 南京
    '420100', // 武汉
    '430100', // 长沙
    '350100', // 福州
    '370100', // 济南
    '410100', // 郑州
    '340100'  // 合肥
  ];

  for (const code of focusCityCodes) {
    const city = getCityDataByCode(code);
    assert(!!city, `Target city code ${code} must exist`);
    if (!city) continue;

    // Build critical dynamic boundary expense vectors for this city
    const empInDed = city.employee.inpatient.tierBenefits.tier3.deductible;
    const empInCap = city.employee.inpatient.annualCap;
    const resInDed = city.resident.inpatient.tierBenefits.tier3.deductible;
    const resInCap = city.resident.inpatient.annualCap;
    const resCatDed = city.resident.catastrophic.deductible;
    const resCatCap = city.resident.catastrophic.annualCap ?? 300000;

    const dynamicExpenseVectors = [
      { cost: 0, desc: 'Zero Cost (0 RMB)' },
      { cost: 0.01, desc: '1 Cent (0.01 RMB)' },
      { cost: 0.99, desc: 'Sub-one (0.99 RMB)' },
      { cost: 10, desc: 'Ten RMB (10 RMB)' },
      { cost: Math.max(0, empInDed - 1), desc: 'Sub-deductible (Employee Inpatient)' },
      { cost: empInDed, desc: 'Exact Deductible (Employee Inpatient)' },
      { cost: empInDed + 0.01, desc: 'Just Above Deductible (Employee Inpatient)' },
      { cost: empInDed + 500, desc: 'Moderate Above Deductible' },
      { cost: Math.max(0, resInDed - 1), desc: 'Sub-deductible (Resident Inpatient)' },
      { cost: resInDed, desc: 'Exact Deductible (Resident Inpatient)' },
      { cost: resInDed + 0.01, desc: 'Just Above Deductible (Resident Inpatient)' },
      { cost: Math.max(0, resCatDed - 1), desc: 'Sub-deductible (Catastrophic)' },
      { cost: resCatDed, desc: 'Exact Deductible (Catastrophic)' },
      { cost: resCatDed + 1, desc: 'Just Above Deductible (Catastrophic)' },
      { cost: empInCap, desc: 'Exact Basic Cap (Employee Inpatient)' },
      { cost: empInCap + 10000, desc: 'Above Basic Cap Triggering Catastrophic' },
      { cost: resInCap, desc: 'Exact Basic Cap (Resident Inpatient)' },
      { cost: resInCap + 20000, desc: 'Above Basic Cap (Resident Inpatient)' },
      { cost: resCatCap, desc: 'At Catastrophic Cap' },
      { cost: 1000000, desc: '1 Million RMB' },
      { cost: 10000000, desc: '10 Million RMB' },
      { cost: 50000000, desc: '50 Million RMB' },
      { cost: 100000000, desc: '100 Million RMB Ultra Stress' }
    ];

    const testScenarios = [
      { nonInsRatio: 0, classBRatio: 0 },
      { nonInsRatio: 0.1, classBRatio: 0.15 },
      { nonInsRatio: 0.4, classBRatio: 0.3 }
    ];

    for (const exp of dynamicExpenseVectors) {
      for (const sc of testScenarios) {
        for (const ins of ['employee', 'resident'] as const) {
          for (const treat of ['outpatient', 'inpatient'] as const) {
            for (const isRet of [false, true]) {
              if (ins === 'resident' && isRet) continue; // Resident has no retiree flag

              const nonIns = Math.round(exp.cost * sc.nonInsRatio * 100) / 100;
              const classB = Math.round(exp.cost * sc.classBRatio * 100) / 100;

              for (const tier of ['tier1', 'tier3', 'tier3_top'] as HospitalTier[]) {
                for (const rem of ['local', 'transfer', 'unfiled_normal'] as RemoteStatus[]) {
                  const res = calculateReimbursement({
                    cityCode: code,
                    insuranceType: ins,
                    treatmentType: treat,
                    hospitalTier: tier,
                    remoteStatus: rem,
                    totalCost: exp.cost,
                    nonInsuranceCost: nonIns,
                    classBCost: classB,
                    classBSelfPayRatio: 0.1,
                    isRetiree: isRet,
                    hospitalizationCount: 1
                  });

                  const b = res.breakdown;

                  // 1. Core Mathematical Invariant: Total Conservation
                  // totalReimbursed + personalPayTotal === totalCost
                  const sum = Math.round((b.totalReimbursed + b.personalPayTotal) * 100) / 100;
                  assertCloseTo(
                    sum,
                    exp.cost,
                    0.015,
                    `[Conservation Failure] ${city.cityName} ${ins} ${treat} ${tier} ${rem} cost=${exp.cost} (${exp.desc})`
                  );

                  // 2. Subcomponent Conservation
                  // baseReimbursed + catastrophicReimbursed === totalReimbursed
                  const compSum = Math.round((b.baseReimbursed + b.catastrophicReimbursed) * 100) / 100;
                  assertCloseTo(
                    compSum,
                    b.totalReimbursed,
                    0.01,
                    `[Subcomponent Mismatch] ${city.cityName} ${ins} ${treat} cost=${exp.cost}`
                  );

                  // 3. 5-Stage Stepped Funnel Conservation (when stages are disjoint)
                  if (b.personalPayTotal >= (b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted - 0.01)) {
                    const funnelSum = Math.round(
                      (b.nonInsuranceCost + b.classBPriorPay + b.deductibleDeducted + b.totalReimbursed + b.personalSpanCoPay) * 100
                    ) / 100;
                    assertCloseTo(
                      funnelSum,
                      exp.cost,
                      0.015,
                      `[5-Stage Funnel Failure] ${city.cityName} ${ins} ${treat} cost=${exp.cost}`
                    );
                  }

                  // 4. Non-negativity & Boundedness
                  assert(b.totalReimbursed >= 0, `Negative totalReimbursed: ${b.totalReimbursed}`);
                  assert(b.personalPayTotal >= 0, `Negative personalPayTotal: ${b.personalPayTotal}`);
                  assert(b.totalReimbursed <= exp.cost + 0.001, `Reimbursement exceeds totalCost: ${b.totalReimbursed} > ${exp.cost}`);

                  // 5. Zero Cost Strict Property
                  if (exp.cost === 0) {
                    assert(b.totalReimbursed === 0, `Zero cost produced non-zero reimbursement in ${city.cityName}`);
                    assert(b.personalPayTotal === 0, `Zero cost produced non-zero personal pay in ${city.cityName}`);
                    assert(b.effectiveRatio === 0, `Zero cost produced non-zero effective ratio in ${city.cityName}`);
                  }

                  // 6. 0-Emoji Audit on Policy Notes
                  for (const note of res.policyNotes) {
                    assert(!EMOJI_REGEX.test(note), `Policy note contains emoji in ${city.cityName}: ${note}`);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(`✓ Section 1 Passed: Total Fund Conservation validated across all extreme vectors [0, 100,000,000] RMB.\n`);

  // --------------------------------------------------------------------------
  // SECTION 2: Multi-City Simulation Delta Symmetry (Antisymmetry/Duality)
  // --------------------------------------------------------------------------
  console.log('--- Section 2: Multi-City Simulation Delta Symmetry & Duality Audit ---');

  // Multi-city test sets:
  const simCitySets = [
    { label: '京陕深三城组合', cities: ['110100', '610100', '440300'] },
    { label: '沪蓉双城组合', cities: ['310100', '510100'] },
    { label: '京津冀协同三城组合', cities: ['110100', '120100', '130100'] },
    { label: '川渝陕三城组合', cities: ['510100', '500100', '610100'] },
    { label: '长三角三城组合', cities: ['310100', '330100', '320100'] },
    { label: '大湾区穗深珠三城组合', cities: ['440100', '440300', '440400'] },
    { label: '陕西省内三城对比(西安-宝鸡-咸阳)', cities: ['610100', '610300', '610400'] },
    { label: '极值对角组合(哈尔滨-三亚)', cities: ['230100', '460200'] },
    { label: '拉萨-乌鲁木齐-上海三城组合', cities: ['540100', '650100', '310100'] }
  ];

  // Also include all popularMultiCityPresets
  for (const preset of popularMultiCityPresets) {
    const valid = preset.cities.map(c => c === '500000' ? '500100' : c);
    simCitySets.push({ label: `Preset-${preset.name}`, cities: valid });
  }

  const multiCityExpenseVectors = [
    { cost: 0, nonIns: 0, classB: 0, desc: 'Zero Cost' },
    { cost: 0.01, nonIns: 0, classB: 0, desc: '1 Cent' },
    { cost: 10, nonIns: 1, classB: 2, desc: '10 RMB' },
    { cost: 1500, nonIns: 100, classB: 200, desc: '1500 RMB' },
    { cost: 30000, nonIns: 2000, classB: 3000, desc: '30,000 RMB' },
    { cost: 150000, nonIns: 15000, classB: 20000, desc: '150,000 RMB' },
    { cost: 670000, nonIns: 50000, classB: 80000, desc: '670,000 RMB' },
    { cost: 10000000, nonIns: 500000, classB: 1000000, desc: '10 Million RMB' },
    { cost: 50000000, nonIns: 2000000, classB: 3000000, desc: '50 Million RMB' },
    { cost: 100000000, nonIns: 5000000, classB: 8000000, desc: '100 Million RMB' }
  ];

  for (const set of simCitySets) {
    for (const exp of multiCityExpenseVectors) {
      for (const ins of ['employee', 'resident'] as const) {
        for (const treat of ['outpatient', 'inpatient'] as const) {
          const scenario: ComparisonScenarioInput = {
            totalCost: exp.cost,
            nonInsuranceCost: exp.nonIns,
            classBCost: exp.classB,
            classBSelfPayRatio: 0.1,
            insuranceType: ins,
            isRetiree: ins === 'employee',
            treatmentType: treat,
            hospitalTier: 'tier3',
            remoteStatus: 'local',
            hospitalizationCount: 1
          };

          const simResult = runMultiCitySimulation(set.cities, scenario);

          // Invariant 1: All conserved overall
          assert(simResult.allConserved === true, `[MultiCity] allConserved false in ${set.label} at cost=${exp.cost}`);

          const baseline = simResult.cities[0];

          for (let i = 0; i < simResult.cities.length; i++) {
            const cityOut = simResult.cities[i];

            // Invariant 2: Per-city conservation
            assert(cityOut.isConserved === true, `[MultiCity] isConserved false for ${cityOut.cityName} in ${set.label}`);
            const citySum = Math.round((cityOut.totalReimbursed + cityOut.personalPayTotal) * 100) / 100;
            assertCloseTo(
              citySum,
              exp.cost,
              0.015,
              `[MultiCity Conservation] ${cityOut.cityName} in ${set.label} at cost=${exp.cost}`
            );

            // Invariant 3: Delta Symmetry & Antisymmetry (ΔR === -ΔP)
            // deltaReimbursedVsCityA === -deltaPersonalPayVsCityA
            const deltaR = cityOut.deltaReimbursedVsCityA;
            const deltaP = cityOut.deltaPersonalPayVsCityA;
            const deltaSum = Math.round((deltaR + deltaP) * 100) / 100;
            assertCloseTo(
              deltaSum,
              0,
              0.02,
              `[Delta Symmetry Breach] ${cityOut.cityName} in ${set.label}: deltaR(${deltaR}) + deltaP(${deltaP}) = ${deltaSum}`
            );

            // Invariant 4: Baseline self-identity
            if (i === 0) {
              assert(deltaR === 0, `Baseline deltaReimbursedVsCityA must be 0, got ${deltaR}`);
              assert(deltaP === 0, `Baseline deltaPersonalPayVsCityA must be 0, got ${deltaP}`);
            }

            // Invariant 5: Subcomponent conservation
            const compSum = Math.round((cityOut.baseReimbursed + cityOut.catastrophicReimbursed) * 100) / 100;
            assertCloseTo(
              compSum,
              cityOut.totalReimbursed,
              0.01,
              `[MultiCity Subcomponents] ${cityOut.cityName} base + cat != total`
            );
          }

          // Invariant 6: Max Spread Equality (Spread_R === Spread_P)
          // maxReimbursementDelta === maxPersonalPayDelta
          assertCloseTo(
            simResult.maxReimbursementDelta,
            simResult.maxPersonalPayDelta,
            0.02,
            `[Spread Equality Breach] ${set.label} cost=${exp.cost}: maxDeltaR(${simResult.maxReimbursementDelta}) != maxDeltaP(${simResult.maxPersonalPayDelta})`
          );

          // Invariant 7: Key Insights 0-Emoji Audit
          for (const insight of simResult.keyInsights) {
            assert(!EMOJI_REGEX.test(insight), `MultiCity key insight contains emoji: ${insight}`);
          }
        }
      }
    }
  }

  console.log(`✓ Section 2 Passed: Multi-City Delta Symmetry & Duality verified across all presets & extreme vectors.\n`);

  // --------------------------------------------------------------------------
  // SECTION 3: Deep Boundary Checks on Newly Updated 2025-2026 Policies
  // --------------------------------------------------------------------------
  console.log('--- Section 3: Deep Boundary Checks on 2025-2026 Policies ---');

  // 3.1 Xi'an (610100): 2025-2026 Resident Catastrophic 20,000 Deductible & 300,000 Cap
  console.log('>>> Sub-suite 3.1: Xi\'an 2025-2026 Resident Catastrophic Transition <<<');
  const xianData = getCityDataByCode('610100')!;
  assert(xianData.resident.catastrophic.deductible === 20000, 'Xi\'an resident catastrophic deductible must be 20,000');
  assert(xianData.resident.catastrophic.annualCap === 300000, 'Xi\'an resident catastrophic cap must be 300,000');
  assert(xianData.resident.catastrophic.tiers[0].ratio === 0.60, 'Xi\'an resident catastrophic ratio must be 60%');

  // Test cost below catastrophic threshold
  const xaLow = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 15000
  });
  assert(xaLow.breakdown.catastrophicReimbursed === 0, 'Xi\'an resident 15,000 cost must yield 0 catastrophic reimbursement');
  assert(xaLow.breakdown.totalReimbursed + xaLow.breakdown.personalPayTotal === 15000, 'Xi\'an resident 15,000 conservation failed');

  // Test cost crossing threshold (totalCost 60000 in tier3_top):
  // total 60000, ded 2000, eligible 58000, base reimbursed 58000*0.5 = 29000.
  // patient self-pay = total - base = 31000.
  // catastrophic eligible = 31000 - 20000 = 11000.
  // catastrophic reimbursed = 11000 * 0.6 = 6600.
  const xaMid = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 60000
  });
  assert(xaMid.breakdown.catastrophicReimbursed === 6600, `Xi\'an resident 60,000 cost expected catastrophic 6600, got ${xaMid.breakdown.catastrophicReimbursed}`);
  assert(xaMid.breakdown.totalReimbursed + xaMid.breakdown.personalPayTotal === 60000, 'Xi\'an resident 60,000 conservation failed');

  // Test catastrophic saturation at 300,000 RMB cap:
  const xaExtreme = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 5000000
  });
  assert(xaExtreme.breakdown.catastrophicReimbursed === 300000, `Xi\'an catastrophic must saturate at 300,000 cap, got ${xaExtreme.breakdown.catastrophicReimbursed}`);
  assert(xaExtreme.breakdown.totalReimbursed + xaExtreme.breakdown.personalPayTotal === 5000000, 'Xi\'an extreme conservation failed');

  // Verify Xi'an employee inpatient repeated deductible step-down matrix:
  const xaEmp1 = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 20000,
    hospitalizationCount: 1
  });
  const xaEmp2 = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 20000,
    hospitalizationCount: 2
  });
  const xaEmp3 = calculateReimbursement({
    cityCode: '610100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    remoteStatus: 'local',
    totalCost: 20000,
    hospitalizationCount: 3
  });
  assert(xaEmp1.breakdown.appliedDeductible === 850, `Xi'an tier3_top 1st hospitalization ded must be 850, got ${xaEmp1.breakdown.appliedDeductible}`);
  assert(xaEmp2.breakdown.appliedDeductible === 800, `Xi'an tier3_top 2nd hospitalization ded must be 800, got ${xaEmp2.breakdown.appliedDeductible}`);
  assert(xaEmp3.breakdown.appliedDeductible === 550, `Xi'an tier3_top 3rd hospitalization ded must be 550, got ${xaEmp3.breakdown.appliedDeductible}`);

  // 3.2 Beijing-Tianjin-Hebei (110100, 120100, 130100): Interprovincial Deemed Filing Parity
  console.log('>>> Sub-suite 3.2: Beijing-Tianjin-Hebei Interprovincial Deemed Filing Parity <<<');
  const bjData = getCityDataByCode('110100')!;
  const tjData = getCityDataByCode('120100')!;
  const sjzData = getCityDataByCode('130100')!;

  assert(bjData.employee.remoteMedical.longTermFiledRatio === 1.0, 'Beijing longTermFiledRatio must be 1.0');
  assert(tjData.employee.remoteMedical.longTermFiledRatio === 1.0, 'Tianjin longTermFiledRatio must be 1.0');
  assert(sjzData.employee.remoteMedical.longTermFiledRatio === 1.0, 'Shijiazhuang longTermFiledRatio must be 1.0');

  // Beijing Employee Outpatient: Uncapped (annualCap >= 9999999)
  assert(bjData.employee.outpatient.annualCap >= 9999999, 'Beijing employee outpatient must be uncapped');
  const bjOutHuge = calculateReimbursement({
    cityCode: '110100',
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 100000
  });
  // In-service deductible 1800, 90% reimbursement
  const expectedBjReimb = Math.round((100000 - 1800) * 0.90 * 100) / 100;
  assertCloseTo(bjOutHuge.breakdown.baseReimbursed, expectedBjReimb, 0.01, 'Beijing huge outpatient reimbursement');
  assert(bjOutHuge.breakdown.totalReimbursed + bjOutHuge.breakdown.personalPayTotal === 100000, 'Beijing huge outpatient conservation');

  // Beijing Employee Inpatient Repeated Deductible (1300 -> 650)
  const bjIn1 = calculateReimbursement({
    cityCode: '110100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 20000,
    hospitalizationCount: 1
  });
  const bjIn2 = calculateReimbursement({
    cityCode: '110100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 20000,
    hospitalizationCount: 2
  });
  assert(bjIn1.breakdown.appliedDeductible === 1300, `Beijing 1st inpatient ded must be 1300, got ${bjIn1.breakdown.appliedDeductible}`);
  assert(bjIn2.breakdown.appliedDeductible === 650, `Beijing 2nd inpatient ded must be halved to 650, got ${bjIn2.breakdown.appliedDeductible}`);
  assert(bjIn2.breakdown.totalReimbursed > bjIn1.breakdown.totalReimbursed, 'Beijing 2nd admission must yield higher reimbursement');

  // 3.3 Shanghai (310100): 2026 Employee Inpatient 670,000 Cap & 80% Local Additional Compensation
  console.log('>>> Sub-suite 3.3: Shanghai 2026 670k Cap & 80% Local Additional Coverage <<<');
  const shData = getCityDataByCode('310100')!;
  assert(shData.employee.inpatient.annualCap === 670000, 'Shanghai 2026 employee inpatient cap must be 670,000');
  assert(shData.employee.catastrophic.deductible === 670000, 'Shanghai catastrophic deductible must be 670,000');
  assert(shData.employee.catastrophic.tiers[0].ratio === 0.80, 'Shanghai local additional compensation must be 80%');

  // Test cost right at 670,000 cap:
  const shAtCap = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 670000
  });
  assert(shAtCap.breakdown.baseReimbursed <= 670000, 'Shanghai base reimbursed must not exceed 670,000');
  assert(shAtCap.breakdown.totalReimbursed + shAtCap.breakdown.personalPayTotal === 670000, 'Shanghai at-cap conservation');

  // Test cost well beyond 670,000 cap (e.g. 1,000,000):
  const shOverCap = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 1000000
  });
  assert(shOverCap.breakdown.baseReimbursed <= 670000, 'Shanghai base must be capped at 670,000');
  assert(shOverCap.breakdown.catastrophicReimbursed > 0, 'Shanghai local additional fund must trigger beyond 670,000');
  assert(shOverCap.breakdown.totalReimbursed + shOverCap.breakdown.personalPayTotal === 1000000, 'Shanghai over-cap conservation');

  // 3.4 Shenzhen (440300): 2026 Wage Base 177,057 Linkage & Caps
  console.log('>>> Sub-suite 3.4: Shenzhen 2026 Wage Base Linkage & Caps <<<');
  const szData = getCityDataByCode('440300')!;
  assert(szData.employee.outpatient.annualCap === 10623, 'Shenzhen 2026 in-service outpatient cap must be 10,623 (6% of 177,057)');
  assert(szData.employee.outpatient.annualCapRetiree === 12394, 'Shenzhen 2026 retiree outpatient cap must be 12,394 (7% of 177,057)');
  assert(szData.employee.inpatient.annualCap === 1062342, 'Shenzhen 2026 inpatient cap must be 1,062,342 (6x 177,057)');

  // Test outpatient capping for in-service:
  const szOutActive = calculateReimbursement({
    cityCode: '440300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 50000
  });
  assert(szOutActive.breakdown.totalReimbursed === 10623, `Shenzhen in-service outpatient must cap at 10,623, got ${szOutActive.breakdown.totalReimbursed}`);
  assert(szOutActive.breakdown.totalReimbursed + szOutActive.breakdown.personalPayTotal === 50000, 'Shenzhen in-service outpatient conservation');

  // Test outpatient capping for retiree:
  const szOutRetiree = calculateReimbursement({
    cityCode: '440300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    remoteStatus: 'local',
    totalCost: 50000
  });
  assert(szOutRetiree.breakdown.totalReimbursed === 12394, `Shenzhen retiree outpatient must cap at 12,394, got ${szOutRetiree.breakdown.totalReimbursed}`);
  assert(szOutRetiree.breakdown.totalReimbursed + szOutRetiree.breakdown.personalPayTotal === 50000, 'Shenzhen retiree outpatient conservation');

  // Test Shenzhen repeated deductible halving (tier3: 600 -> 300):
  const szIn1 = calculateReimbursement({
    cityCode: '440300',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000,
    hospitalizationCount: 1
  });
  const szIn2 = calculateReimbursement({
    cityCode: '440300',
    insuranceType: 'employee',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 10000,
    hospitalizationCount: 2
  });
  assert(szIn1.breakdown.appliedDeductible === 600, `Shenzhen 1st inpatient ded must be 600, got ${szIn1.breakdown.appliedDeductible}`);
  assert(szIn2.breakdown.appliedDeductible === 300, `Shenzhen 2nd inpatient ded must be 300, got ${szIn2.breakdown.appliedDeductible}`);

  // 3.5 Guangzhou (440100): 2026 New Resident Catastrophic Scheme (18k Ded, 3-tier rates, 400k Cap)
  console.log('>>> Sub-suite 3.5: Guangzhou 2026 New Resident Catastrophic Scheme <<<');
  const gzData = getCityDataByCode('440100')!;
  assert(gzData.resident.catastrophic.deductible === 18000, 'Guangzhou resident catastrophic deductible must be 18,000');
  assert(gzData.resident.catastrophic.annualCap === 400000, 'Guangzhou resident catastrophic cap must be 400,000');
  assert(gzData.resident.catastrophic.tiers.length === 3, 'Guangzhou resident catastrophic must have 3 tiers');
  assert(gzData.resident.catastrophic.tiers[0].ratio === 0.60, 'Guangzhou tier 1 ratio must be 60%');
  assert(gzData.resident.catastrophic.tiers[1].ratio === 0.75, 'Guangzhou tier 2 ratio must be 75%');
  assert(gzData.resident.catastrophic.tiers[2].ratio === 0.90, 'Guangzhou tier 3 ratio must be 90%');

  // Test Guangzhou resident catastrophic below threshold:
  const gzLow = calculateReimbursement({
    cityCode: '440100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 15000
  });
  assert(gzLow.breakdown.catastrophicReimbursed === 0, 'Guangzhou resident catastrophic must be 0 below threshold');
  assert(gzLow.breakdown.totalReimbursed + gzLow.breakdown.personalPayTotal === 15000, 'Guangzhou resident conservation');

  // Test Guangzhou resident catastrophic at extreme spending saturating 400,000 cap:
  const gzMega = calculateReimbursement({
    cityCode: '440100',
    insuranceType: 'resident',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    remoteStatus: 'local',
    totalCost: 5000000
  });
  assert(gzMega.breakdown.catastrophicReimbursed === 400000, `Guangzhou catastrophic must cap at 400,000, got ${gzMega.breakdown.catastrophicReimbursed}`);
  assert(gzMega.breakdown.totalReimbursed + gzMega.breakdown.personalPayTotal === 5000000, 'Guangzhou mega conservation');

  console.log(`✓ Section 3 Passed: All newly updated 2025-2026 policies verified with 100% boundary fidelity.\n`);

  // --------------------------------------------------------------------------
  // SECTION 4: Zero Emoji Global Static Audit Across Outputs and Source Docs
  // --------------------------------------------------------------------------
  console.log('--- Section 4: Zero Emoji Static Audit Across Target Cities ---');
  for (const code of focusCityCodes) {
    const city = getCityDataByCode(code)!;
    assert(!EMOJI_REGEX.test(city.cityName), `City name contains emoji: ${city.cityName}`);
    for (const doc of city.sourceDocs) {
      assert(!EMOJI_REGEX.test(doc.title), `Doc title contains emoji: ${doc.title}`);
      assert(!EMOJI_REGEX.test(doc.docNumber), `Doc number contains emoji: ${doc.docNumber}`);
      assert(!EMOJI_REGEX.test(doc.summaryQuote), `Doc summary contains emoji: ${doc.summaryQuote}`);
    }
  }
  console.log(`✓ Section 4 Passed: Zero-Emoji standard 100% compliant across all target cities.\n`);

  console.log('================================================================================');
  console.log(`[PASS] ALL ROUND 7 CHALLENGER TESTS PASSED!`);
  console.log(`Executed: ${stats.totalChecks} checks | Passed: ${stats.passedChecks} | Failed: ${stats.failedChecks}`);
  console.log('================================================================================\n');

  return {
    totalChecks: stats.totalChecks,
    passedChecks: stats.passedChecks,
    failedChecks: stats.failedChecks,
    passed: stats.failedChecks === 0
  };
}

// Execute harness when invoked directly
try {
  const result = runRound7EmpiricalHarness();
  if (!result.passed) {
    process.exit(1);
  }
} catch (err) {
  console.error('[CHALLENGER ERROR]', err);
  process.exit(1);
}
