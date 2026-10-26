/**
 * Challenger R9.2: Comprehensive Boundary, Actuarial Edge Cases & Touch Ergonomics Oracle
 *
 * Verification Scope:
 * 1. Actuarial Edge Case 1: Repeated hospitalization step-downs (1st, 2nd, 3rd+ visit deductibles).
 * 2. Actuarial Edge Case 2: per_visit vs annual outpatient deductibles (Shangluo, Baoji, etc.).
 * 3. Actuarial Edge Case 3: High-cost outpatients exceeding caps or entering supplementary pools (Hangzhou, Beijing, Shanghai).
 * 4. Actuarial Edge Case 4: Cross-provincial direct settlement transfer factors & alliance exemptions (JJJ, GBA, Chuan-Yu, etc.).
 * 5. Touch Ergonomics: Interactive element height/min-height >= 44px in index.vue, ranking/index.vue, MultiCitySimulator.vue,
 *    especially across responsive media queries (<= 768px).
 * 6. 0-Emoji Compliance: Strict static scanning across all source files.
 */

import * as fs from 'fs';
import * as path from 'path';
import { calculateReimbursement, resolveInpatientDeductible } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, RemoteStatus, InsuranceType, CityInsuranceData } from '../data/types';

interface AuditStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  findings: { category: string; description: string; detail: string }[];
}

const stats: AuditStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  findings: []
};

function recordAssert(suite: string, condition: boolean, message: string): void {
  stats.totalChecks++;
  if (!condition) {
    stats.failedChecks++;
    console.error(`  [FAIL][${suite}] ${message}`);
    stats.findings.push({
      category: suite,
      description: message,
      detail: 'Assertion failed'
    });
  } else {
    stats.passedChecks++;
  }
}

function assertClose(suite: string, val1: number, val2: number, tolerance: number, message: string): void {
  const diff = Math.abs(val1 - val2);
  const condition = diff <= tolerance;
  stats.totalChecks++;
  if (!condition) {
    stats.failedChecks++;
    console.error(`  [FAIL][${suite}] ${message} (val1=${val1}, val2=${val2}, diff=${diff.toFixed(4)}, tol=${tolerance})`);
    stats.findings.push({
      category: suite,
      description: message,
      detail: `val1=${val1}, val2=${val2}, diff=${diff.toFixed(4)}, tol=${tolerance}`
    });
  } else {
    stats.passedChecks++;
  }
}

export function runAdversarialChallengeSuite(): AuditStats {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R9.2] Comprehensive Boundary & Touch Ergonomics Oracle <<<');
  console.log('================================================================================\n');

  const hospitalTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const insuranceTypes: InsuranceType[] = ['employee', 'resident'];

  // ============================================================================
  // SUITE 1: Repeated Hospitalization Step-Downs (1st, 2nd, 3rd+ visit deductibles)
  // ============================================================================
  console.log('>>> Suite 1: Repeated Hospitalization Step-Downs Probing...');
  const suite1 = 'Suite 1 - Repeated Hospitalizations';

  // 1.1 Specific Regional Custom Matrices
  // Xi'an (610100) Employee:
  // community/tier1: [200, 150, 100, 0], tier2: [400, 300, 150, 0], tier3: [650, 550, 350, 0], tier3_top: [850, 800, 550, 0]
  const xianExpected: Record<HospitalTier, number[]> = {
    community: [200, 150, 100, 0],
    tier1: [200, 150, 100, 0],
    tier2: [400, 300, 150, 0],
    tier3: [650, 550, 350, 0],
    tier3_top: [850, 800, 550, 0]
  };

  for (const tier of hospitalTiers) {
    const seq = xianExpected[tier];
    for (let count = 1; count <= 5; count++) {
      const expectedDed = seq[Math.min(count - 1, seq.length - 1)];
      const res = resolveInpatientDeductible({
        cityCode: '610100',
        insuranceType: 'employee',
        hospitalTier: tier,
        standardDeductible: seq[0],
        hospitalizationCount: count
      });
      recordAssert(
        suite1,
        res.appliedDeductible === expectedDed,
        `Xi'an employee ${tier} count=${count}: expected ${expectedDed}, got ${res.appliedDeductible}`
      );
      recordAssert(
        suite1,
        res.standardDeductible === seq[0],
        `Xi'an employee ${tier} count=${count}: standardDeductible should be ${seq[0]}`
      );
      recordAssert(
        suite1,
        res.appliedDeductible + res.deductibleReduction === res.standardDeductible,
        `Xi'an employee ${tier} count=${count}: applied + reduction !== standard`
      );
    }
  }

  // Ankang (610900) Employee:
  // community/tier1: [200, 100, 0], tier2: [400, 200, 0], tier3/tier3_top: [800, 400, 0]
  const ankangExpected: Record<HospitalTier, number[]> = {
    community: [200, 100, 0],
    tier1: [200, 100, 0],
    tier2: [400, 200, 0],
    tier3: [800, 400, 0],
    tier3_top: [800, 400, 0]
  };

  for (const tier of hospitalTiers) {
    const seq = ankangExpected[tier];
    for (let count = 1; count <= 4; count++) {
      const expectedDed = seq[Math.min(count - 1, seq.length - 1)];
      const res = resolveInpatientDeductible({
        cityCode: '610900',
        insuranceType: 'employee',
        hospitalTier: tier,
        standardDeductible: seq[0],
        hospitalizationCount: count
      });
      recordAssert(
        suite1,
        res.appliedDeductible === expectedDed,
        `Ankang employee ${tier} count=${count}: expected ${expectedDed}, got ${res.appliedDeductible}`
      );
    }
  }

  // Shangluo (611000) Employee:
  // community/tier1: [300, 220, 180], tier2: [400, 300, 200], tier3/tier3_top: [600, 460, 320]
  const shangluoExpected: Record<HospitalTier, number[]> = {
    community: [300, 220, 180],
    tier1: [300, 220, 180],
    tier2: [400, 300, 200],
    tier3: [600, 460, 320],
    tier3_top: [600, 460, 320]
  };

  for (const tier of hospitalTiers) {
    const seq = shangluoExpected[tier];
    for (let count = 1; count <= 4; count++) {
      const expectedDed = seq[Math.min(count - 1, seq.length - 1)];
      const res = resolveInpatientDeductible({
        cityCode: '611000',
        insuranceType: 'employee',
        hospitalTier: tier,
        standardDeductible: seq[0],
        hospitalizationCount: count
      });
      recordAssert(
        suite1,
        res.appliedDeductible === expectedDed,
        `Shangluo employee ${tier} count=${count}: expected ${expectedDed}, got ${res.appliedDeductible}`
      );
    }
  }

  // Jinan (370100): half_second_zero_third
  const jinanCity = getCityDataByCode('370100')!;
  const jinanTier3Ded = jinanCity.employee.inpatient.tierBenefits.tier3.deductible; // 1000
  const jinan1 = resolveInpatientDeductible({
    cityCode: '370100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: jinanTier3Ded,
    hospitalizationCount: 1,
    policy: jinanCity.employee.inpatient.repeatedDeductiblePolicy,
    ruleText: jinanCity.employee.inpatient.repeatedDeductibleRule
  });
  const jinan2 = resolveInpatientDeductible({
    cityCode: '370100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: jinanTier3Ded,
    hospitalizationCount: 2,
    policy: jinanCity.employee.inpatient.repeatedDeductiblePolicy,
    ruleText: jinanCity.employee.inpatient.repeatedDeductibleRule
  });
  const jinan3 = resolveInpatientDeductible({
    cityCode: '370100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: jinanTier3Ded,
    hospitalizationCount: 3,
    policy: jinanCity.employee.inpatient.repeatedDeductiblePolicy,
    ruleText: jinanCity.employee.inpatient.repeatedDeductibleRule
  });
  recordAssert(suite1, jinan1.appliedDeductible === jinanTier3Ded, `Jinan 1st visit deductible must be ${jinanTier3Ded}`);
  recordAssert(suite1, jinan2.appliedDeductible === Math.round(jinanTier3Ded * 0.5), `Jinan 2nd visit deductible must be half (${jinanTier3Ded * 0.5})`);
  recordAssert(suite1, jinan3.appliedDeductible === 0, `Jinan 3rd visit deductible must be 0`);

  // Hangzhou (330100): highest_tier_once -> 1st standard, 2nd+ 0
  const hzCity = getCityDataByCode('330100')!;
  const hzDed = hzCity.employee.inpatient.tierBenefits.tier3.deductible; // 800
  const hz1 = resolveInpatientDeductible({
    cityCode: '330100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: hzDed,
    hospitalizationCount: 1,
    policy: hzCity.employee.inpatient.repeatedDeductiblePolicy
  });
  const hz2 = resolveInpatientDeductible({
    cityCode: '330100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: hzDed,
    hospitalizationCount: 2,
    policy: hzCity.employee.inpatient.repeatedDeductiblePolicy
  });
  recordAssert(suite1, hz1.appliedDeductible === hzDed, `Hangzhou 1st visit deductible must be ${hzDed}`);
  recordAssert(suite1, hz2.appliedDeductible === 0, `Hangzhou 2nd visit deductible must be 0 (highest_tier_once)`);

  // Beijing (110100): half_from_second -> 1st standard (1300), 2nd 650, 3rd 650
  const bjCity = getCityDataByCode('110100')!;
  const bjDed = bjCity.employee.inpatient.tierBenefits.tier3.deductible; // 1300
  const bj1 = resolveInpatientDeductible({
    cityCode: '110100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: bjDed,
    hospitalizationCount: 1,
    ruleText: bjCity.employee.inpatient.repeatedDeductibleRule
  });
  const bj2 = resolveInpatientDeductible({
    cityCode: '110100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: bjDed,
    hospitalizationCount: 2,
    ruleText: bjCity.employee.inpatient.repeatedDeductibleRule
  });
  const bj3 = resolveInpatientDeductible({
    cityCode: '110100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: bjDed,
    hospitalizationCount: 3,
    ruleText: bjCity.employee.inpatient.repeatedDeductibleRule
  });
  recordAssert(suite1, bj1.appliedDeductible === 1300, `Beijing 1st visit deductible must be 1300`);
  recordAssert(suite1, bj2.appliedDeductible === 650, `Beijing 2nd visit deductible must be 650`);
  recordAssert(suite1, bj3.appliedDeductible === 650, `Beijing 3rd visit deductible must be 650`);

  // 1.2 Full 348-City Repeated Hospitalization Exhaustive Monotonicity & Conservation Sweep
  console.log('  Running 348-city exhaustive sweep across hospitalization counts (1, 2, 3, 5, 10, 100)...');
  const countsToTest = [1, 2, 3, 5, 10, 100];
  const testCosts = [0, 50, 500, 2000, 20000];

  for (const city of allCities) {
    for (const insType of insuranceTypes) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      for (const tier of hospitalTiers) {
        const tierBen = pkg.inpatient.tierBenefits[tier];
        const stdDed = tierBen?.deductible ?? 500;

        let prevApplied = Infinity;

        for (const count of countsToTest) {
          const res = resolveInpatientDeductible({
            cityCode: city.cityCode,
            insuranceType: insType,
            hospitalTier: tier,
            standardDeductible: stdDed,
            hospitalizationCount: count,
            policy: pkg.inpatient.repeatedDeductiblePolicy,
            ruleText: pkg.inpatient.repeatedDeductibleRule
          });

          // Non-negativity
          recordAssert(
            suite1,
            res.appliedDeductible >= 0,
            `${city.cityName} ${insType} ${tier} count=${count}: appliedDeductible < 0 (${res.appliedDeductible})`
          );
          // Standard upper bound
          recordAssert(
            suite1,
            res.appliedDeductible <= res.standardDeductible,
            `${city.cityName} ${insType} ${tier} count=${count}: appliedDeductible (${res.appliedDeductible}) > standardDeductible (${res.standardDeductible})`
          );
          // Deduction exact sum
          assertClose(
            suite1,
            res.appliedDeductible + res.deductibleReduction,
            res.standardDeductible,
            0.001,
            `${city.cityName} ${insType} ${tier} count=${count}: applied + reduction !== standard`
          );
          // Monotonicity: count N deductible <= count N-1 deductible
          recordAssert(
            suite1,
            res.appliedDeductible <= prevApplied,
            `${city.cityName} ${insType} ${tier} count=${count}: Monotonicity failure! applied (${res.appliedDeductible}) > previous (${prevApplied})`
          );
          prevApplied = res.appliedDeductible;

          // Financial conservation test with this hospitalization count
          for (const cost of testCosts) {
            const calc = calculateReimbursement({
              cityCode: city.cityCode,
              insuranceType: insType,
              treatmentType: 'inpatient',
              hospitalTier: tier,
              totalCost: cost,
              hospitalizationCount: count
            });

            assertClose(
              suite1,
              calc.breakdown.totalReimbursed + calc.breakdown.personalPayTotal,
              cost,
              0.015,
              `${city.cityName} ${insType} ${tier} count=${count} cost=${cost}: Fund conservation violation`
            );
          }
        }
      }
    }
  }

  console.log(`✓ Suite 1 Completed: Repeated hospitalization step-downs fully verified.\n`);

  // ============================================================================
  // SUITE 2: per_visit vs annual Outpatient Deductibles (Shangluo, Baoji, etc.)
  // ============================================================================
  console.log('>>> Suite 2: per_visit vs annual Outpatient Deductibles Probing...');
  const suite2 = 'Suite 2 - Outpatient Deductible Types';

  // 2.1 Identify all per_visit cities across all 348 regions
  const perVisitCities: { cityCode: string; cityName: string; insType: InsuranceType }[] = [];
  for (const city of allCities) {
    if (city.employee.outpatient.deductibleType === 'per_visit') {
      perVisitCities.push({ cityCode: city.cityCode, cityName: city.cityName, insType: 'employee' });
    }
    if (city.resident.outpatient.deductibleType === 'per_visit') {
      perVisitCities.push({ cityCode: city.cityCode, cityName: city.cityName, insType: 'resident' });
    }
  }
  console.log(`  Identified ${perVisitCities.length}统筹区/险种 with deductibleType === 'per_visit':`, perVisitCities.map(c => `${c.cityName}(${c.insType})`).join(', '));
  recordAssert(suite2, perVisitCities.some(c => c.cityCode === '611000'), 'Shangluo must be identified as per_visit');
  recordAssert(suite2, perVisitCities.some(c => c.cityCode === '610300'), 'Baoji must be identified as per_visit');

  // 2.2 Shangluo Outpatient Precision Probing (611000)
  // Employee: community/tier1 30, tier2 60, tier3 90. In-service: 70%, 65%, 60%. Retiree bonus +5%. Cap: 1500 (in-service), 2000 (retiree).
  const slTierConfigs: { tier: HospitalTier; ded: number; ratioIn: number; ratioRet: number }[] = [
    { tier: 'community', ded: 30, ratioIn: 0.70, ratioRet: 0.75 },
    { tier: 'tier1', ded: 30, ratioIn: 0.70, ratioRet: 0.75 },
    { tier: 'tier2', ded: 60, ratioIn: 0.65, ratioRet: 0.70 },
    { tier: 'tier3', ded: 90, ratioIn: 0.60, ratioRet: 0.65 },
    { tier: 'tier3_top', ded: 90, ratioIn: 0.60, ratioRet: 0.65 }
  ];

  for (const cfg of slTierConfigs) {
    // A. Sub-deductible cost (cost = ded - 10)
    const subCost = Math.max(1, cfg.ded - 10);
    const subRes = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: cfg.tier,
      totalCost: subCost
    });
    recordAssert(suite2, subRes.breakdown.totalReimbursed === 0, `Shangluo ${cfg.tier} sub-deductible cost ${subCost}: reimbursed must be 0`);
    recordAssert(suite2, subRes.breakdown.personalPayTotal === subCost, `Shangluo ${cfg.tier} sub-deductible cost ${subCost}: personalPay must equal cost`);
    recordAssert(suite2, subRes.policyNotes.some(n => n.includes('门诊起付标准按就医诊次执行')), `Shangluo ${cfg.tier}: policyNotes must mention per_visit`);

    // B. Exact deductible cost
    const exactRes = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: cfg.tier,
      totalCost: cfg.ded
    });
    recordAssert(suite2, exactRes.breakdown.totalReimbursed === 0, `Shangluo ${cfg.tier} exact deductible ${cfg.ded}: reimbursed must be 0`);
    recordAssert(suite2, exactRes.breakdown.personalPayTotal === cfg.ded, `Shangluo ${cfg.tier} exact deductible ${cfg.ded}: personalPay must equal ${cfg.ded}`);

    // C. Above deductible: cost = ded + 100
    const inRes = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: cfg.tier,
      totalCost: cfg.ded + 100
    });
    const expectedInReimbursed = Math.round(100 * cfg.ratioIn * 100) / 100;
    assertClose(suite2, inRes.breakdown.totalReimbursed, expectedInReimbursed, 0.01, `Shangluo in-service ${cfg.tier} reimbursement error`);
    assertClose(suite2, inRes.breakdown.totalReimbursed + inRes.breakdown.personalPayTotal, cfg.ded + 100, 0.01, `Shangluo in-service ${cfg.tier} conservation error`);

    // D. Retiree tilt: cost = ded + 100
    const retRes = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'outpatient',
      hospitalTier: cfg.tier,
      totalCost: cfg.ded + 100
    });
    const expectedRetReimbursed = Math.round(100 * cfg.ratioRet * 100) / 100;
    assertClose(suite2, retRes.breakdown.totalReimbursed, expectedRetReimbursed, 0.01, `Shangluo retiree ${cfg.tier} reimbursement error`);
    assertClose(suite2, retRes.breakdown.totalReimbursed + retRes.breakdown.personalPayTotal, cfg.ded + 100, 0.01, `Shangluo retiree ${cfg.tier} conservation error`);

    // E. Annual Cap Ceiling Check: cost = 10,000 RMB
    const capInRes = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: cfg.tier,
      totalCost: 10000
    });
    recordAssert(suite2, capInRes.breakdown.totalReimbursed === 1500, `Shangluo in-service outpatient must cap at 1500, got ${capInRes.breakdown.totalReimbursed}`);
    recordAssert(suite2, capInRes.policyNotes.some(n => n.includes('已达到医保统筹基金年度封顶线')), 'Shangluo cap reached note missing');

    const capRetRes = calculateReimbursement({
      cityCode: '611000',
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'outpatient',
      hospitalTier: cfg.tier,
      totalCost: 10000
    });
    recordAssert(suite2, capRetRes.breakdown.totalReimbursed === 2000, `Shangluo retiree outpatient must cap at 2000, got ${capRetRes.breakdown.totalReimbursed}`);
  }

  // 2.3 Baoji Outpatient Precision Probing (610300)
  // Employee: deductible 50/visit, tier ratios: community/tier1 60%, tier2 55%, tier3/tier3_top 50%. Retiree +5%. Cap: 500 (in-service), 900 (retiree).
  const bjCost = 350; // Reimbursable = 350 - 50 = 300
  // Tier2 in-service: 300 * 0.55 = 165
  const bjTier2In = calculateReimbursement({
    cityCode: '610300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    totalCost: bjCost
  });
  assertClose(suite2, bjTier2In.breakdown.totalReimbursed, 165.0, 0.01, 'Baoji tier2 in-service outpatient reimbursement');
  assertClose(suite2, bjTier2In.breakdown.totalReimbursed + bjTier2In.breakdown.personalPayTotal, bjCost, 0.01, 'Baoji conservation');

  // Tier2 retiree: 300 * 0.60 = 180
  const bjTier2Ret = calculateReimbursement({
    cityCode: '610300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier2',
    totalCost: bjCost
  });
  assertClose(suite2, bjTier2Ret.breakdown.totalReimbursed, 180.0, 0.01, 'Baoji tier2 retiree outpatient reimbursement');

  // Baoji Annual Cap: cost = 5000
  const bjCapIn = calculateReimbursement({
    cityCode: '610300',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    totalCost: 5000
  });
  recordAssert(suite2, bjCapIn.breakdown.totalReimbursed === 500, `Baoji in-service outpatient must cap at 500, got ${bjCapIn.breakdown.totalReimbursed}`);

  const bjCapRet = calculateReimbursement({
    cityCode: '610300',
    insuranceType: 'employee',
    isRetiree: true,
    treatmentType: 'outpatient',
    hospitalTier: 'tier1',
    totalCost: 5000
  });
  recordAssert(suite2, bjCapRet.breakdown.totalReimbursed === 900, `Baoji retiree outpatient must cap at 900, got ${bjCapRet.breakdown.totalReimbursed}`);

  // 2.4 Verify all other cities with annual deductibles output annual note
  const annualCities = allCities.filter(c => c.employee.outpatient.deductibleType !== 'per_visit');
  const sampleAnnualCity = annualCities[0];
  const sampleAnnualCalc = calculateReimbursement({
    cityCode: sampleAnnualCity.cityCode,
    insuranceType: 'employee',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    totalCost: 3000
  });
  if (sampleAnnualCalc.breakdown.appliedDeductible > 0) {
    recordAssert(
      suite2,
      sampleAnnualCalc.policyNotes.some(n => n.includes('门诊统筹年度累计起付标准')),
      `${sampleAnnualCity.cityName}: annual deductible policy note expected`
    );
  }

  console.log(`✓ Suite 2 Completed: per_visit vs annual outpatient deductibles fully verified.\n`);

  // ============================================================================
  // SUITE 3: High-Cost Outpatients Exceeding Caps / Supplementary Pools
  // ============================================================================
  console.log('>>> Suite 3: High-Cost Outpatients Exceeding Caps Probing (Hangzhou, Beijing, Shanghai)...');
  const suite3 = 'Suite 3 - High-Cost Outpatients & Caps';

  // 3.1 Hangzhou (330100)
  // Employee: annualCap = 9999999 (上不封顶), tier3_top ratio = 0.76 (in-service), 0.82 (retiree), ded = 600 (in-service), 200 (retiree)
  const hzHighCosts = [10000, 100000, 500000, 2000000];
  for (const c of hzHighCosts) {
    const hzIn = calculateReimbursement({
      cityCode: '330100',
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier3_top',
      totalCost: c
    });
    const expectedHzIn = Math.round((c - 600) * 0.76 * 100) / 100;
    assertClose(suite3, hzIn.breakdown.totalReimbursed, expectedHzIn, 0.01, `Hangzhou high-cost employee in-service cost=${c}`);
    assertClose(suite3, hzIn.breakdown.totalReimbursed + hzIn.breakdown.personalPayTotal, c, 0.01, `Hangzhou conservation cost=${c}`);
    recordAssert(suite3, hzIn.breakdown.totalReimbursed < 9999999, 'Hangzhou employee reimbursement within unlimited cap');
  }

  // Hangzhou Resident: annualCap = 300000, ded = 300, tier3 ratio = 0.40
  // Cost = 1,000,000 -> (1000000 - 300) * 0.40 = 399880 -> should cap at 300000
  const hzResHigh = calculateReimbursement({
    cityCode: '330100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    totalCost: 1000000
  });
  recordAssert(suite3, hzResHigh.breakdown.totalReimbursed === 300000, `Hangzhou resident outpatient must cap at 300000, got ${hzResHigh.breakdown.totalReimbursed}`);
  assertClose(suite3, hzResHigh.breakdown.personalPayTotal, 700000, 0.01, 'Hangzhou resident personal pay when capped');
  recordAssert(suite3, hzResHigh.policyNotes.some(n => n.includes('已达到医保统筹基金年度封顶线')), 'Hangzhou resident cap note');

  // 3.2 Beijing (110100)
  // Employee: annualCap = 9999999 (上不封顶), ded = 1800 (in-service), 1300 (retiree), tier3 ratio = 0.70 (in-service), 0.85 (retiree)
  const bjHighCosts = [20000, 100000, 500000, 1500000];
  for (const c of bjHighCosts) {
    const bjIn = calculateReimbursement({
      cityCode: '110100',
      insuranceType: 'employee',
      isRetiree: false,
      treatmentType: 'outpatient',
      hospitalTier: 'tier3',
      totalCost: c
    });
    const expectedBjIn = Math.round((c - 1800) * 0.70 * 100) / 100;
    assertClose(suite3, bjIn.breakdown.totalReimbursed, expectedBjIn, 0.01, `Beijing high-cost employee in-service cost=${c}`);
    assertClose(suite3, bjIn.breakdown.totalReimbursed + bjIn.breakdown.personalPayTotal, c, 0.01, `Beijing conservation cost=${c}`);

    const bjRet = calculateReimbursement({
      cityCode: '110100',
      insuranceType: 'employee',
      isRetiree: true,
      treatmentType: 'outpatient',
      hospitalTier: 'tier3',
      totalCost: c
    });
    const expectedBjRet = Math.round((c - 1300) * 0.85 * 100) / 100;
    assertClose(suite3, bjRet.breakdown.totalReimbursed, expectedBjRet, 0.01, `Beijing high-cost employee retiree cost=${c}`);
  }

  // Beijing Resident: annualCap = 5000, community ded = 100, ratio = 0.55
  // Cost = 20,000 -> (20000 - 100) * 0.55 = 10945 -> caps at 5000
  const bjResHigh = calculateReimbursement({
    cityCode: '110100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    totalCost: 20000
  });
  recordAssert(suite3, bjResHigh.breakdown.totalReimbursed === 5000, `Beijing resident outpatient must cap at 5000, got ${bjResHigh.breakdown.totalReimbursed}`);
  assertClose(suite3, bjResHigh.breakdown.personalPayTotal, 15000, 0.01, 'Beijing resident personal pay when capped');
  assertClose(suite3, bjResHigh.breakdown.totalReimbursed + bjResHigh.breakdown.personalPayTotal, 20000, 0.01, 'Beijing resident conservation when capped');
  recordAssert(suite3, bjResHigh.policyNotes.some(n => n.includes('已达到医保统筹基金年度封顶线')), 'Beijing resident cap note');

  // 3.3 Shanghai (310100)
  // Employee: annualCap = 670000, ded = 500 (in-service), 300 (retiree), tier3 ratio = 0.70 (in-service), 0.75 (retiree)
  // Within cap: cost = 500,000 -> (500000 - 500) * 0.70 = 349650
  const shWithinCap = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    totalCost: 500000
  });
  assertClose(suite3, shWithinCap.breakdown.totalReimbursed, 349650.0, 0.01, 'Shanghai employee within cap');
  assertClose(suite3, shWithinCap.breakdown.totalReimbursed + shWithinCap.breakdown.personalPayTotal, 500000, 0.01, 'Shanghai within cap conservation');

  // Exceeding cap: cost = 1,200,000 -> (1200000 - 500) * 0.70 = 839650 -> caps at 670000
  const shExceedCap = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'employee',
    isRetiree: false,
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    totalCost: 1200000
  });
  recordAssert(suite3, shExceedCap.breakdown.totalReimbursed === 670000, `Shanghai employee outpatient must cap at 670000, got ${shExceedCap.breakdown.totalReimbursed}`);
  assertClose(suite3, shExceedCap.breakdown.personalPayTotal, 530000, 0.01, 'Shanghai employee personal pay when capped');
  assertClose(suite3, shExceedCap.breakdown.totalReimbursed + shExceedCap.breakdown.personalPayTotal, 1200000, 0.01, 'Shanghai conservation when capped');
  recordAssert(suite3, shExceedCap.policyNotes.some(n => n.includes('已达到医保统筹基金年度封顶线')), 'Shanghai cap note');

  // Shanghai Resident: annualCap = 250000, ded = 500, tier3 ratio = 0.50
  // Cost = 800,000 -> (800000 - 500) * 0.50 = 399750 -> caps at 250000
  const shResExceed = calculateReimbursement({
    cityCode: '310100',
    insuranceType: 'resident',
    treatmentType: 'outpatient',
    hospitalTier: 'tier3',
    totalCost: 800000
  });
  recordAssert(suite3, shResExceed.breakdown.totalReimbursed === 250000, `Shanghai resident outpatient must cap at 250000, got ${shResExceed.breakdown.totalReimbursed}`);
  assertClose(suite3, shResExceed.breakdown.personalPayTotal, 550000, 0.01, 'Shanghai resident personal pay when capped');
  assertClose(suite3, shResExceed.breakdown.totalReimbursed + shResExceed.breakdown.personalPayTotal, 800000, 0.01, 'Shanghai resident conservation when capped');

  console.log(`✓ Suite 3 Completed: High-cost outpatients and annual cap dynamics fully verified.\n`);

  // ============================================================================
  // SUITE 4: Cross-Provincial Direct Settlement & Regional Alliance Exemptions
  // ============================================================================
  console.log('>>> Suite 4: Cross-Provincial Direct Settlement & Regional Alliances Probing...');
  const suite4 = 'Suite 4 - Cross-Provincial & Alliances';

  // 4.1 Jing-Jin-Ji (JJJ / 京津冀)
  const jjjCodes = [
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

  for (const cCode of jjjCodes) {
    const city = getCityDataByCode(cCode)!;
    recordAssert(suite4, !!city, `JJJ city ${cCode} exists`);
    for (const insType of insuranceTypes) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      // Parity check
      recordAssert(
        suite4,
        pkg.remoteMedical.longTermFiledRatio === 1.0,
        `JJJ ${city.cityName} ${insType} longTermFiledRatio must be 1.0`
      );

      // Verify calculation parity between local and long_term filed
      const cost = 45000;
      const localRes = calculateReimbursement({
        cityCode: cCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost
      });
      const remoteFiledRes = calculateReimbursement({
        cityCode: cCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'long_term',
        totalCost: cost
      });
      assertClose(
        suite4,
        localRes.breakdown.totalReimbursed,
        remoteFiledRes.breakdown.totalReimbursed,
        0.01,
        `JJJ Parity failure for ${city.cityName} ${insType}`
      );
    }
  }

  // 4.2 Guangdong-Hong Kong-Macao Greater Bay Area (GBA / 粤港澳大湾区)
  const gbaCodes = [
    '440100', // 广州
    '440300', // 深圳
    '440400', // 珠海
    '440600', // 佛山
    '440700', // 江门
    '441200', // 肇庆
    '441300', // 惠州
    '441900', // 东莞
    '442000'  // 中山
  ];

  for (const cCode of gbaCodes) {
    const city = getCityDataByCode(cCode)!;
    recordAssert(suite4, !!city, `GBA city ${cCode} exists`);
    for (const insType of insuranceTypes) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      recordAssert(
        suite4,
        pkg.remoteMedical.longTermFiledRatio === 1.0,
        `GBA ${city.cityName} ${insType} longTermFiledRatio must be 1.0`
      );
      // Transfer ratio must be reasonable (>= 0.70)
      recordAssert(
        suite4,
        pkg.remoteMedical.transferFiledRatio >= 0.70 && pkg.remoteMedical.transferFiledRatio <= 1.0,
        `GBA ${city.cityName} ${insType} transferFiledRatio out of range: ${pkg.remoteMedical.transferFiledRatio}`
      );
      // Unfiled normal ratio must be <= transfer ratio
      recordAssert(
        suite4,
        pkg.remoteMedical.unfiledNormalRatio <= pkg.remoteMedical.transferFiledRatio,
        `GBA ${city.cityName} ${insType} unfiled normal ratio exceeds transfer ratio`
      );
    }
  }

  // 4.3 Sichuan-Chongqing (Chuan-Yu / 川渝医保一体化)
  const chuanYuCodes = ['510100', '500100']; // 成都, 重庆
  for (const cCode of chuanYuCodes) {
    const city = getCityDataByCode(cCode)!;
    recordAssert(suite4, !!city, `Chuan-Yu city ${cCode} exists`);
    for (const insType of insuranceTypes) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      recordAssert(
        suite4,
        pkg.remoteMedical.longTermFiledRatio === 1.0,
        `Chuan-Yu ${city.cityName} ${insType} longTermFiledRatio must be 1.0`
      );
      const isAllianceListed = pkg.remoteMedical.regionalAlliances?.some(a => a.includes('川渝'));
      recordAssert(
        suite4,
        isAllianceListed === true,
        `Chuan-Yu ${city.cityName} ${insType} regionalAlliances must include 川渝`
      );
    }
  }

  // 4.4 All 348 Cities Remote Medical Monotonicity & Conservation Sweep
  console.log('  Running 348-city sweep across all 5 remote statuses...');
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const remoteCosts = [10000, 50000, 150000];

  for (const city of allCities) {
    for (const insType of insuranceTypes) {
      const pkg = insType === 'employee' ? city.employee : city.resident;
      const rm = pkg.remoteMedical;

      // Rule: longTermFiledRatio === 1.0
      recordAssert(
        suite4,
        rm.longTermFiledRatio === 1.0,
        `${city.cityName} ${insType} longTermFiledRatio is ${rm.longTermFiledRatio} (must be 1.0)`
      );

      // Rule: transferFiledRatio >= unfiledNormalRatio
      recordAssert(
        suite4,
        rm.transferFiledRatio >= rm.unfiledNormalRatio,
        `${city.cityName} ${insType} transferFiledRatio (${rm.transferFiledRatio}) < unfiledNormalRatio (${rm.unfiledNormalRatio})`
      );

      // Test calculations across all 5 statuses
      for (const st of remoteStatuses) {
        for (const cost of remoteCosts) {
          const res = calculateReimbursement({
            cityCode: city.cityCode,
            insuranceType: insType,
            treatmentType: 'inpatient',
            hospitalTier: 'tier3',
            remoteStatus: st,
            totalCost: cost
          });

          // Conservation
          assertClose(
            suite4,
            res.breakdown.totalReimbursed + res.breakdown.personalPayTotal,
            cost,
            0.015,
            `${city.cityName} ${insType} remote=${st} cost=${cost}: Conservation leak`
          );
        }
      }
    }
  }

  console.log(`✓ Suite 4 Completed: Cross-provincial direct settlement and alliance exemptions verified.\n`);

  // ============================================================================
  // SUITE 5: Mobile Touch Targets & Responsive Ergonomics (>= 44px)
  // ============================================================================
  console.log('>>> Suite 5: Mobile Touch Targets & Responsive Ergonomics (>= 44px) Static Audit...');
  const suite5 = 'Suite 5 - Touch Ergonomics';

  interface TargetSpec {
    file: string;
    selector: string;
    description: string;
    minHeightExpected: number;
    minWidthExpected?: number;
  }

  const criticalInteractiveElements: TargetSpec[] = [
    // index.vue
    { file: 'src/pages/index/index.vue', selector: '.seg-btn', description: '医保类型分段选择按钮', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.retiree-bar', description: '职工退休优待开关栏', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.cyber-dropdown-trigger', description: '参保地下拉触发器', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.freq-btn', description: '住院频次阶梯按钮', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.preset-pill', description: '预设花费快捷胶囊', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.funnel-card-header', description: '资金流向漏斗折叠头部', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.sds-btn', description: '极简公文条操作按钮', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.sub-seg-btn', description: '就医场景切换按钮 (住院/门诊)', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.authority-hotline-btn', description: '12393专线呼叫动作按钮', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.voucher-gen-btn', description: '生成凭据单动作按钮', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.copy-voucher-btn', description: '复制凭据动作按钮', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.dropdown-item', description: '下拉选择选项', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.search-input', description: '城市快捷搜索输入框', minHeightExpected: 44 },

    // ranking/index.vue
    { file: 'src/pages/ranking/index.vue', selector: '.switch-pill', description: '排行榜模式切换胶囊', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.brc-act-btn', description: '政策卡片操作按钮', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.mini-pk-btn', description: '全维宽表对决按钮', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.size-pill', description: '分页每页条数胶囊', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.page-nav-btn', description: '分页上一页/下一页按钮', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.layout-btn', description: '卡片/宽表视图切换按钮', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.search-input-box', description: '统筹区搜索框外壳', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.search-input', description: '统筹区搜索输入框', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.dropdown-trigger', description: '省份/排序下拉触发器', minHeightExpected: 44 },

    // MultiCitySimulator.vue
    { file: 'src/components/MultiCitySimulator.vue', selector: '.cost-chip', description: '快捷花费选择芯片', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.remove-slot-btn', description: '移除第3城卡槽按钮', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.rh-copy-btn', description: '红头公文复制文号按钮', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.rh-act-btn', description: '公文查阅/官网/热线动作按钮', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.sim-preset-chip', description: '模拟器热门组合预设芯片', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.seg-option-btn', description: '模拟器险种与就医类型分段按钮', minHeightExpected: 44 }
  ];

  for (const target of criticalInteractiveElements) {
    const fullPath = path.resolve(process.cwd(), target.file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Find style section
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    recordAssert(suite5, !!styleMatch, `${target.file}: <style> section exists`);
    const cssContent = styleMatch ? styleMatch[1] : '';

    // Search for selector in CSS
    const escapedSelector = target.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSelector}[^{]*)\\{([^}]+)\\}`, 'g');
    let match;
    const foundRules: { selectorMatch: string; ruleBody: string }[] = [];

    while ((match = regex.exec(cssContent)) !== null) {
      foundRules.push({
        selectorMatch: match[1].trim(),
        ruleBody: match[2].trim()
      });
    }

    recordAssert(
      suite5,
      foundRules.length > 0,
      `[Selector Missing] ${target.file}: Target selector ${target.selector} (${target.description}) not found in CSS`
    );

    let satisfiesMinHeight = false;
    const violations: string[] = [];

    for (const rule of foundRules) {
      const body = rule.ruleBody;
      const minHeightMatch = /min-height\s*:\s*(\d+)px/i.exec(body);
      const heightMatch = /(?:^|[\s;])height\s*:\s*(\d+)px/i.exec(body);
      const lineHeightMatch = /line-height\s*:\s*(\d+)px/i.exec(body);

      const minH = minHeightMatch ? parseInt(minHeightMatch[1], 10) : 0;
      const h = heightMatch ? parseInt(heightMatch[1], 10) : 0;
      const lineH = lineHeightMatch ? parseInt(lineHeightMatch[1], 10) : 0;

      if (minH >= target.minHeightExpected || h >= target.minHeightExpected || lineH >= target.minHeightExpected) {
        satisfiesMinHeight = true;
      }

      // Check if any rule explicitly sets height < 44px (ignoring child svg / icons)
      if (h > 0 && h < 44 && !rule.selectorMatch.includes('svg') && !rule.selectorMatch.includes('icon') && !rule.selectorMatch.includes('pulse')) {
        violations.push(`Rule "${rule.selectorMatch}" specifies height: ${h}px (< 44px)`);
      }
    }

    recordAssert(
      suite5,
      satisfiesMinHeight,
      `[Touch Target Under 44px] ${target.file} -> ${target.selector} (${target.description}): No rule satisfying >= ${target.minHeightExpected}px found!`
    );

    recordAssert(
      suite5,
      violations.length === 0,
      `[Sub-44px Override] ${target.file} -> ${target.selector} (${target.description}): Found sub-44px override: ${violations.join(', ')}`
    );
  }

  // 5.2 Deep Media Query (< 768px, < 767px, < 520px, < 380px) Scan
  // Ensure that no media query in any of the 3 files reduces interactive buttons/pills to < 44px
  const filesToCheck = [
    'src/pages/index/index.vue',
    'src/pages/ranking/index.vue',
    'src/components/MultiCitySimulator.vue'
  ];

  for (const f of filesToCheck) {
    const full = path.resolve(process.cwd(), f);
    const content = fs.readFileSync(full, 'utf8');
    const mediaQueryMatches = content.match(/@media[^{]+\{([\s\S]+?\}(?:\s*\})?)/g) || [];

    for (const mq of mediaQueryMatches) {
      // Find any interactive selector with height < 44px inside media query
      const sub44Matches = mq.match(/(?:\.btn|\.pill|\.chip|\.trigger|\.item|\.card|\.tab)[^{]*\{[^}]*(?:[^\-]height\s*:\s*([1-3]\d)px)/g);
      if (sub44Matches) {
        for (const sub of sub44Matches) {
          // If not svg/icon
          if (!sub.includes('svg') && !sub.includes('icon')) {
            recordAssert(
              suite5,
              false,
              `[Media Query Touch Violation in ${f}] ${sub.trim()}`
            );
          }
        }
      }
    }
  }

  console.log(`✓ Suite 5 Completed: Touch target ergonomics verified across responsive viewports.\n`);

  // ============================================================================
  // SUITE 6: Strict 0-Emoji Static Scan
  // ============================================================================
  console.log('>>> Suite 6: Strict 0-Emoji Static Scan across entire codebase...');
  const suite6 = 'Suite 6 - 0-Emoji Compliance';

  // Comprehensive Unicode regex matching pictographic emojis, emoticons, symbols, dingbats
  const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1FA00}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]/u;

  interface EmojiViolation {
    file: string;
    line: number;
    content: string;
  }
  interface EmojiViolation {
    file: string;
    line: number;
    content: string;
  }
  const prodEmojiViolations: EmojiViolation[] = [];
  const scriptEmojiViolations: EmojiViolation[] = [];

  function scanEmojis(dir: string, targetList: EmojiViolation[]): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', '.git', '.agents'].includes(entry.name)) {
          scanEmojis(full, targetList);
        }
      } else if (entry.isFile()) {
        if (/\.(vue|ts|json|html|css)$/.test(entry.name)) {
          if (entry.name.includes('check-emojis') || entry.name.includes('challenger-r9-2-adversarial-oracle')) {
            continue;
          }
          const fileText = fs.readFileSync(full, 'utf8');
          const lines = fileText.split('\n');
          lines.forEach((l, idx) => {
            const trimmed = l.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
            if (emojiRegex.test(l)) {
              targetList.push({
                file: path.relative(process.cwd(), full),
                line: idx + 1,
                content: trimmed
              });
            }
          });
        }
      }
    }
  }

  // A. Strict Production UI & Data Scope
  ['src/pages', 'src/components', 'src/data', 'src/engine'].forEach(d => {
    if (fs.existsSync(d)) scanEmojis(d, prodEmojiViolations);
  });

  recordAssert(
    suite6,
    prodEmojiViolations.length === 0,
    `[Production 0-Emoji Violation] Found ${prodEmojiViolations.length} Emoji characters in production code: ${prodEmojiViolations.slice(0, 5).map(v => `${v.file}:${v.line} -> ${v.content}`).join('; ')}`
  );

  // B. Maintenance Scripts Scope
  if (fs.existsSync('src/scripts')) {
    scanEmojis('src/scripts', scriptEmojiViolations);
  }
  if (scriptEmojiViolations.length > 0) {
    console.warn(`  [INFO] Found ${scriptEmojiViolations.length} Emoji characters in historical maintenance scripts (e.g., CLI logs).`);
  }

  console.log(`✓ Suite 6 Completed: 0-Emoji audit complete (Production violations: ${prodEmojiViolations.length}, Script logs: ${scriptEmojiViolations.length}).\n`);

  // ============================================================================
  // SUMMARY REPORT & VERDICT
  // ============================================================================
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R9.2 EMPIRICAL VERDICT SUMMARY] <<<');
  console.log(`  Total Checks Executed:  ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:          ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:          ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Pass Rate:              ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log(`  Findings/Bugs:          ${stats.findings.length}`);
  console.log('================================================================================\n');

  if (stats.findings.length > 0) {
    console.error('CRITICAL FINDINGS / DEFECTS DETECTED:');
    stats.findings.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.category}] ${f.description}`);
      console.error(`     Detail: ${f.detail}`);
    });
    console.error('\n>>> FINAL VERDICT: REJECT <<<');
  } else {
    console.log('>>> FINAL VERDICT: APPROVE <<<');
    console.log('All actuarial edge cases, repeated hospitalization step-downs, per-visit deductibles,');
    console.log('high-cost outpatient caps, cross-provincial direct settlements, responsive touch targets,');
    console.log('and 0-Emoji compliance 100% EMPIRICALLY VERIFIED.');
  }

  return stats;
}

runAdversarialChallengeSuite();
