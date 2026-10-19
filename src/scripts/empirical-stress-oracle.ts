import { calculateReimbursement } from '../engine/calculator';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, CalculateRequest, CityInsuranceData } from '../data/types';

interface Stats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failures: string[];
}

const stats: Stats = {
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
    if (stats.failures.length <= 20) {
      console.error(`[FAIL] ${msg}`);
    }
  } else {
    stats.passedChecks++;
  }
}

function assertCloseTo(val1: number, val2: number, delta: number, msg: string) {
  assert(Math.abs(val1 - val2) <= delta, `${msg} (expected ${val1} ~ ${val2}, diff=${Math.abs(val1 - val2)})`);
}

export function runFullStressSuite() {
  console.log('================================================================================');
  console.log('>>> [EMPIRICAL CHALLENGER] Nationwide Stress & Oracle Verification Suite <<<');
  console.log('================================================================================\n');

  const tiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'] as const;

  // --------------------------------------------------------------------------
  // TEST MATRIX 1: Real Nationwide 348 Cities Invariant Probing
  // --------------------------------------------------------------------------
  console.log('--- Test Matrix 1: Nationwide 348 Cities Property-Based Invariant Audit ---');
  let cityCount = 0;
  for (const city of allCities) {
    cityCount++;
      // Probe community, tier2, tier3 across employee (active & retiree) and resident
      const testTypes: Array<{ ins: 'employee' | 'resident'; isRet: boolean }> = [
        { ins: 'employee', isRet: false },
        { ins: 'employee', isRet: true },
        { ins: 'resident', isRet: false }
      ];

      for (const tType of ['outpatient', 'inpatient'] as const) {
        for (const tier of tiers) {
          for (const tt of testTypes) {
            const testCosts = [0, 0.01, 100, 1500, 50000, 1000000];
            for (const cost of testCosts) {
              const res = calculateReimbursement({
                cityCode: city.cityCode,
                insuranceType: tt.ins,
                isRetiree: tt.isRet,
                treatmentType: tType,
                hospitalTier: tier,
                remoteStatus: 'local',
                totalCost: cost,
                nonInsuranceCost: Math.round(cost * 0.1 * 100) / 100,
                classBCost: Math.round(cost * 0.15 * 100) / 100
              });

              const {
                totalCost,
                totalReimbursed,
                personalPayTotal,
                baseReimbursed,
                catastrophicReimbursed
              } = res.breakdown;

              // 1. No NaN, no negative numbers, no Infinity
              assert(!Number.isNaN(totalReimbursed), `NaN totalReimbursed: ${city.cityName}`);
              assert(!Number.isNaN(personalPayTotal), `NaN personalPayTotal: ${city.cityName}`);
              assert(!Number.isNaN(baseReimbursed), `NaN baseReimbursed: ${city.cityName}`);
              assert(!Number.isNaN(catastrophicReimbursed), `NaN catastrophicReimbursed: ${city.cityName}`);
              assert(Number.isFinite(totalReimbursed), `Infinity in totalReimbursed: ${city.cityName}`);

              assert(totalReimbursed >= 0, `Negative totalReimbursed: ${totalReimbursed} (${city.cityName})`);
              assert(personalPayTotal >= 0, `Negative personalPayTotal: ${personalPayTotal} (${city.cityName})`);
              assert(baseReimbursed >= 0, `Negative baseReimbursed: ${baseReimbursed} (${city.cityName})`);
              assert(catastrophicReimbursed >= 0, `Negative catastrophicReimbursed: ${catastrophicReimbursed} (${city.cityName})`);

              // 2. Bound constraints
              assert(totalReimbursed <= totalCost + 0.01, `totalReimbursed > totalCost: ${totalReimbursed} > ${totalCost}`);

              // 3. Money conservation: totalReimbursed + personalPayTotal === totalCost
              const totalSum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
              assertCloseTo(totalSum, totalCost, 0.02, `Money conservation failed in ${city.cityName} cost=${cost}`);

              // 4. Component conservation: baseReimbursed + catastrophicReimbursed === totalReimbursed
              const compSum = Math.round((baseReimbursed + catastrophicReimbursed) * 100) / 100;
              assertCloseTo(compSum, totalReimbursed, 0.01, `Component mismatch in ${city.cityName}`);
            }
          }
        }
      }
    }
  console.log(`✓ Test Matrix 1 Passed: Evaluated all ${cityCount} cities across hospital tiers, insurance types, and costs.\n`);

  // --------------------------------------------------------------------------
  // TEST MATRIX 2: Inpatient Retiree Cap (annualCapRetiree) Boundary Stress
  // --------------------------------------------------------------------------
  console.log('--- Test Matrix 2: Inpatient annualCapRetiree Synthetic Stress Harness ---');
  const baseCity = getCityDataByCode('610100')!;

  const capScenarios: Array<{
    name: string;
    annualCap: number;
    annualCapRetiree?: number;
    deductible: number;
    ratio: number;
    retireeBonus: number;
    hasCatastrophic: boolean;
    hasCostRanges: boolean;
  }> = [
    {
      name: 'Standard Advantage (200k vs 300k)',
      annualCap: 200000,
      annualCapRetiree: 300000,
      deductible: 1000,
      ratio: 0.85,
      retireeBonus: 0.05,
      hasCatastrophic: true,
      hasCostRanges: false
    },
    {
      name: 'Undefined annualCapRetiree (fallback)',
      annualCap: 250000,
      annualCapRetiree: undefined,
      deductible: 800,
      ratio: 0.80,
      retireeBonus: 0.04,
      hasCatastrophic: true,
      hasCostRanges: false
    },
    {
      name: 'Zero annualCapRetiree (falsy fallback)',
      annualCap: 180000,
      annualCapRetiree: 0,
      deductible: 600,
      ratio: 0.82,
      retireeBonus: 0.03,
      hasCatastrophic: true,
      hasCostRanges: false
    },
    {
      name: 'Equal Caps (300k vs 300k)',
      annualCap: 300000,
      annualCapRetiree: 300000,
      deductible: 1200,
      ratio: 0.75,
      retireeBonus: 0.05,
      hasCatastrophic: true,
      hasCostRanges: false
    },
    {
      name: 'Inverted Caps (300k active vs 200k retiree)',
      annualCap: 300000,
      annualCapRetiree: 200000,
      deductible: 1000,
      ratio: 0.85,
      retireeBonus: 0.05,
      hasCatastrophic: true,
      hasCostRanges: false
    },
    {
      name: 'Tiny Cap (active 500, retiree 1000)',
      annualCap: 500,
      annualCapRetiree: 1000,
      deductible: 200,
      ratio: 0.90,
      retireeBonus: 0.05,
      hasCatastrophic: false,
      hasCostRanges: false
    },
    {
      name: 'Ultra High Cap (10M vs 20M)',
      annualCap: 10000000,
      annualCapRetiree: 20000000,
      deductible: 2000,
      ratio: 0.90,
      retireeBonus: 0.05,
      hasCatastrophic: true,
      hasCostRanges: false
    },
    {
      name: 'Segmented Cost Ranges + Retiree Cap (Xi-an Style)',
      annualCap: 200000,
      annualCapRetiree: 350000,
      deductible: 650,
      ratio: 0.88,
      retireeBonus: 0.03,
      hasCatastrophic: true,
      hasCostRanges: true
    }
  ];

  for (const sc of capScenarios) {
    const mockCity: CityInsuranceData = JSON.parse(JSON.stringify(baseCity));
    mockCity.cityCode = '999888';
    mockCity.cityName = `Test-${sc.name}`;
    mockCity.employee.inpatient.annualCap = sc.annualCap;
    mockCity.employee.inpatient.annualCapRetiree = sc.annualCapRetiree;

    for (const t of tiers) {
      mockCity.employee.inpatient.tierBenefits[t] = {
        tierName: `${t} hospital`,
        deductible: sc.deductible,
        reimbursementRatio: sc.ratio,
        retireeRatioBonus: sc.retireeBonus
      };
      if (sc.hasCostRanges) {
        mockCity.employee.inpatient.tierBenefits[t].costRanges = [
          { minAmount: 0, maxAmount: 10000, ratio: 0.85, retireeRatioBonus: 0.03 },
          { minAmount: 10000, maxAmount: 50000, ratio: 0.88, retireeRatioBonus: 0.03 },
          { minAmount: 50000, ratio: 0.92, retireeRatioBonus: 0.03 }
        ];
      }
    }

    if (!sc.hasCatastrophic) {
      // @ts-ignore
      mockCity.employee.catastrophic = undefined;
    } else {
      mockCity.employee.catastrophic = {
        name: '职工大额互助',
        deductible: 0,
        tiers: [{ minAmount: 0, ratio: 0.95 }],
        annualCap: 500000
      };
    }

    // Determine effective caps
    const expectedActiveCap = sc.annualCap;
    const expectedRetireeCap = (sc.annualCapRetiree && sc.annualCapRetiree > 0) ? sc.annualCapRetiree : sc.annualCap;

    const effectiveActiveRatio = sc.ratio;
    const effectiveRetireeRatio = Math.min(1.0, sc.ratio + sc.retireeBonus);

    // Exact threshold costs where base reimbursement reaches cap
    const activeThreshold = Math.round((sc.deductible + expectedActiveCap / effectiveActiveRatio) * 100) / 100;
    const retireeThreshold = Math.round((sc.deductible + expectedRetireeCap / effectiveRetireeRatio) * 100) / 100;

    const probeCosts = Array.from(new Set([
      0,
      sc.deductible * 0.5,
      sc.deductible,
      sc.deductible + 1,
      activeThreshold - 10,
      activeThreshold - 0.01,
      activeThreshold,
      activeThreshold + 0.01,
      activeThreshold + 100,
      retireeThreshold - 10,
      retireeThreshold - 0.01,
      retireeThreshold,
      retireeThreshold + 0.01,
      retireeThreshold + 100,
      Math.max(activeThreshold, retireeThreshold) * 2,
      10000000
    ])).filter(c => c >= 0).sort((a, b) => a - b);

    let prevActiveReimbursed = 0;
    let prevRetireeReimbursed = 0;

    for (const cost of probeCosts) {
      if (cost < 0) continue;

      // Active
      const resActive = calculateReimbursement({
        cityCode: '999888',
        insuranceType: 'employee',
        isRetiree: false,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost
      }, mockCity);

      // Retiree
      const resRetiree = calculateReimbursement({
        cityCode: '999888',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: cost
      }, mockCity);

      // Verify no NaN or negative
      assert(!Number.isNaN(resActive.breakdown.totalReimbursed), `NaN active: ${sc.name} cost=${cost}`);
      assert(!Number.isNaN(resRetiree.breakdown.totalReimbursed), `NaN retiree: ${sc.name} cost=${cost}`);
      assert(resActive.breakdown.totalReimbursed >= 0, `Negative active: ${sc.name} cost=${cost}`);
      assert(resRetiree.breakdown.totalReimbursed >= 0, `Negative retiree: ${sc.name} cost=${cost}`);

      // Base reimbursement cannot exceed its respective cap
      assert(
        resActive.breakdown.baseReimbursed <= expectedActiveCap + 0.01,
        `Active baseReimbursed (${resActive.breakdown.baseReimbursed}) exceeded active cap (${expectedActiveCap}) in ${sc.name}`
      );
      assert(
        resRetiree.breakdown.baseReimbursed <= expectedRetireeCap + 0.01,
        `Retiree baseReimbursed (${resRetiree.breakdown.baseReimbursed}) exceeded retiree cap (${expectedRetireeCap}) in ${sc.name}`
      );

      // If at or above threshold without costRanges, verify cap clamping
      if (!sc.hasCostRanges) {
        if (cost >= activeThreshold) {
          assertCloseTo(
            resActive.breakdown.baseReimbursed,
            expectedActiveCap,
            0.02,
            `Active should hit cap in ${sc.name} at cost ${cost}`
          );
          assert(
            resActive.policyNotes.some(n => n.includes('封顶线')),
            `Active policyNotes should indicate cap reached at cost ${cost} in ${sc.name}`
          );
        }
        if (cost >= retireeThreshold) {
          assertCloseTo(
            resRetiree.breakdown.baseReimbursed,
            expectedRetireeCap,
            0.02,
            `Retiree should hit cap in ${sc.name} at cost ${cost}`
          );
          assert(
            resRetiree.policyNotes.some(n => n.includes('封顶线')),
            `Retiree policyNotes should indicate cap reached at cost ${cost} in ${sc.name}`
          );
        }
      }

      // Money Conservation
      const activeSum = Math.round((resActive.breakdown.totalReimbursed + resActive.breakdown.personalPayTotal) * 100) / 100;
      assertCloseTo(activeSum, cost, 0.02, `Active money conservation in ${sc.name} cost=${cost}`);

      const retSum = Math.round((resRetiree.breakdown.totalReimbursed + resRetiree.breakdown.personalPayTotal) * 100) / 100;
      assertCloseTo(retSum, cost, 0.02, `Retiree money conservation in ${sc.name} cost=${cost}`);

      // Component Conservation
      const activeComp = Math.round((resActive.breakdown.baseReimbursed + resActive.breakdown.catastrophicReimbursed) * 100) / 100;
      assertCloseTo(activeComp, resActive.breakdown.totalReimbursed, 0.01, `Active component conservation in ${sc.name}`);

      const retComp = Math.round((resRetiree.breakdown.baseReimbursed + resRetiree.breakdown.catastrophicReimbursed) * 100) / 100;
      assertCloseTo(retComp, resRetiree.breakdown.totalReimbursed, 0.01, `Retiree component conservation in ${sc.name}`);

      // Monotonicity oracle (as cost increases, reimbursement should not decrease)
      assert(
        resActive.breakdown.totalReimbursed >= prevActiveReimbursed - 0.01,
        `Active reimbursement non-monotonic in ${sc.name}: ${resActive.breakdown.totalReimbursed} < ${prevActiveReimbursed}`
      );
      assert(
        resRetiree.breakdown.totalReimbursed >= prevRetireeReimbursed - 0.01,
        `Retiree reimbursement non-monotonic in ${sc.name}: ${resRetiree.breakdown.totalReimbursed} < ${prevRetireeReimbursed}`
      );

      prevActiveReimbursed = resActive.breakdown.totalReimbursed;
      prevRetireeReimbursed = resRetiree.breakdown.totalReimbursed;

      // Retiree Superiority Invariant (when expectedRetireeCap >= expectedActiveCap and bonus >= 0)
      if (expectedRetireeCap >= expectedActiveCap && sc.retireeBonus >= 0) {
        assert(
          resRetiree.breakdown.totalReimbursed >= resActive.breakdown.totalReimbursed - 0.01,
          `Retiree reimbursement (${resRetiree.breakdown.totalReimbursed}) < active (${resActive.breakdown.totalReimbursed}) in ${sc.name} at cost ${cost}`
        );
      }
    }
  }
  console.log(`✓ Test Matrix 2 Passed: All ${capScenarios.length} synthetic retiree cap scenarios verified with exact boundary behavior.\n`);

  // --------------------------------------------------------------------------
  // TEST MATRIX 3: Extreme Adversarial Fault Injection & Floating Point Stress
  // --------------------------------------------------------------------------
  console.log('--- Test Matrix 3: Extreme Adversarial Fault Injection ---');
  const faultCity = JSON.parse(JSON.stringify(baseCity));
  faultCity.cityCode = '999777';

  const adversarialRequests: Array<{ label: string; req: CalculateRequest }> = [
    {
      label: 'Zero Cost',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'community',
        remoteStatus: 'local',
        totalCost: 0
      }
    },
    {
      label: 'Negative Total Cost',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'community',
        remoteStatus: 'local',
        totalCost: -9999
      }
    },
    {
      label: 'Non-Insurance Cost > Total Cost',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 1000,
        nonInsuranceCost: 2000
      }
    },
    {
      label: 'Class B Cost > Total Cost',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 1000,
        classBCost: 5000,
        classBSelfPayRatio: 0.1
      }
    },
    {
      label: 'Negative Non-Insurance and Negative Class B',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 5000,
        nonInsuranceCost: -100,
        classBCost: -200
      }
    },
    {
      label: 'Floating Point Precision 0.1 + 0.2 Cents',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 0.3,
        nonInsuranceCost: 0.1,
        classBCost: 0.2
      }
    },
    {
      label: 'Astronomical Cost (1 Billion RMB)',
      req: {
        cityCode: '999777',
        insuranceType: 'employee',
        isRetiree: true,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        remoteStatus: 'local',
        totalCost: 1000000000
      }
    },
    {
      label: 'Sub-cent Fractional Dust',
      req: {
        cityCode: '999777',
        insuranceType: 'resident',
        treatmentType: 'inpatient',
        hospitalTier: 'tier2',
        remoteStatus: 'local',
        totalCost: 1234.56789,
        nonInsuranceCost: 12.3456,
        classBCost: 78.9012
      }
    }
  ];

  for (const { label, req } of adversarialRequests) {
    const res = calculateReimbursement(req, faultCity);
    const { totalCost, totalReimbursed, personalPayTotal, baseReimbursed, catastrophicReimbursed } = res.breakdown;

    assert(!Number.isNaN(totalReimbursed), `NaN in ${label}`);
    assert(!Number.isNaN(personalPayTotal), `NaN in ${label}`);
    assert(!Number.isNaN(baseReimbursed), `NaN in ${label}`);
    assert(!Number.isNaN(catastrophicReimbursed), `NaN in ${label}`);
    assert(totalReimbursed >= 0, `Negative totalReimbursed in ${label}`);
    assert(personalPayTotal >= 0, `Negative personalPayTotal in ${label}`);

    const effTotal = Math.max(0, Number(req.totalCost) || 0);
    assert(totalReimbursed <= effTotal + 0.01, `Over-reimbursement in ${label}`);

    const sum = Math.round((totalReimbursed + personalPayTotal) * 100) / 100;
    assertCloseTo(sum, effTotal, 0.02, `Conservation in ${label}`);
  }
  console.log(`✓ Test Matrix 3 Passed: All ${adversarialRequests.length} adversarial fault scenarios survived safely.\n`);

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('================================================================================');
  console.log(`[STRESS AUDIT COMPLETED]`);
  console.log(`  Total Invariant Assertions: ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:              ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:              ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Success Rate:               ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log('================================================================================\n');

  if (stats.failedChecks > 0) {
    console.error(`FATAL: ${stats.failedChecks} assertions failed!`);
    process.exit(1);
  }
}

runFullStressSuite();
