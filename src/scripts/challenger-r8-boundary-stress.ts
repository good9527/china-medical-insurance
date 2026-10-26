/**
 * Challenger R8.2: Boundary, Stress & Ergonomics Fuzzing Oracle
 *
 * Verification Scope:
 * 1. Extreme cost boundaries: 0, 0.001, sub-deductible, exact deductible, catastrophic thresholds, 100M RMB mega-costs.
 * 2. Repeated hospitalizations: 1st, 2nd, 3rd+ admissions with diminishing deductibles across multiple cities (Jinan, Xi'an, Chengdu, etc.).
 * 3. Out-of-province / remote filing rules and deductions across 5 tiers and regional alliances.
 * 4. UI touch target ergonomics: static audit of CSS/styles in index.vue, ranking/index.vue, and MultiCitySimulator.vue (>= 44px).
 * 5. Multi-city simulation delta antisymmetry, preset validity, and financial conservation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { calculateReimbursement, resolveInpatientDeductible } from '../engine/calculator';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';
import { allCities, getCityDataByCode } from '../data';
import type { HospitalTier, RemoteStatus, CalculateRequest, InsuranceType, TreatmentType } from '../data/types';

interface AuditStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  surfacedBugs: { category: string; description: string; detail: string }[];
}

const stats: AuditStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  surfacedBugs: []
};

function recordAssert(suite: string, condition: boolean, message: string): void {
  stats.totalChecks++;
  if (!condition) {
    stats.failedChecks++;
    console.error(`  [FAIL][${suite}] ${message}`);
  } else {
    stats.passedChecks++;
  }
}

function assertClose(suite: string, val1: number, val2: number, tolerance: number, message: string): void {
  const diff = Math.abs(val1 - val2);
  recordAssert(suite, diff <= tolerance, `${message} (val1=${val1}, val2=${val2}, diff=${diff}, tol=${tolerance})`);
}

export function runEmpiricalStressSuite() {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R8.2] Empirical Stress, Boundary & Touch Ergonomics Oracle <<<');
  console.log('================================================================================\n');

  const hospitalTiers: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];
  const remoteStatuses: RemoteStatus[] = ['local', 'long_term', 'transfer', 'unfiled_emergency', 'unfiled_normal'];
  const insuranceTypes: InsuranceType[] = ['employee', 'resident'];

  // ============================================================================
  // SUITE 1: Extreme Cost Boundaries & Floating Point Precision
  // ============================================================================
  console.log('>>> Suite 1: Extreme Cost Boundaries (0, 0.001, Sub-Deductible, Exact Deductible, Catastrophic, 100M RMB)...');
  const suite1 = 'Suite 1 - Extreme Cost Boundaries';

  const benchmarkCityCodes = [
    '110100', // Beijing
    '310100', // Shanghai (resident catastrophic deductible = 0)
    '440100', // Guangzhou
    '440300', // Shenzhen
    '610100', // Xi'an (tiered progressive inpatient)
    '370100', // Jinan (repeated hospitalization half_second_zero_third)
    '510100', // Chengdu (regional hub)
    '420100', // Wuhan (0 deductible outpatient)
    '330100', // Hangzhou (dynamic limits)
    '340100'  // Hefei
  ];

  for (const cityCode of benchmarkCityCodes) {
    const city = getCityDataByCode(cityCode);
    if (!city) continue;

    for (const insType of insuranceTypes) {
      for (const tier of hospitalTiers) {
        const pkg = insType === 'employee' ? city.employee : city.resident;
        const inpatientTier = pkg.inpatient.tierBenefits[tier];
        const standardDed = inpatientTier?.deductible ?? 500;
        const catDed = pkg.catastrophic?.deductible ?? 15000;

        // Boundary test points
        const costPoints = [
          0,                             // Zero cost
          0.001,                         // Sub-cent micro-cost
          0.01,                          // 1 cent
          0.50,                          // 50 cents
          standardDed * 0.1,             // 10% of deductible
          standardDed * 0.5,             // 50% of deductible
          Math.max(0, standardDed - 1),  // Deductible - 1
          Math.max(0, standardDed - 0.01),// Deductible - 0.01
          standardDed,                   // Exact deductible threshold
          standardDed + 0.01,            // Deductible + 0.01
          standardDed + 100,             // Slightly above deductible
          catDed * 0.5,                  // Sub-catastrophic
          catDed - 0.01,                 // Exact sub-catastrophic boundary
          catDed,                        // Exact catastrophic deductible
          catDed + 0.01,                 // Exact catastrophic trigger
          50000,                         // Medium hospitalization
          pkg.inpatient.annualCap,       // Exact annual cap
          pkg.inpatient.annualCap + 10000,// Trigger excess / catastrophic
          1000000,                       // 1 Million RMB
          10000000,                      // 10 Million RMB
          100000000                      // 100 Million RMB Mega-cost
        ];

        for (const cost of costPoints) {
          // Inpatient calculation
          const resIn = calculateReimbursement({
            cityCode,
            insuranceType: insType,
            treatmentType: 'inpatient',
            hospitalTier: tier,
            totalCost: cost,
            isRetiree: false
          });

          // Invariant 1: Financial Conservation totalReimbursed + personalPayTotal === totalCost (rounded)
          const expectedCost = Math.round(cost * 100) / 100;
          assertClose(
            suite1,
            resIn.breakdown.totalReimbursed + resIn.breakdown.personalPayTotal,
            expectedCost,
            0.015,
            `${city.cityName} ${insType} ${tier} cost=${cost}: Inpatient Fund Conservation Leak`
          );

          // Invariant 2: Non-negativity
          recordAssert(suite1, resIn.breakdown.totalReimbursed >= 0, `${city.cityName} totalReimbursed < 0`);
          recordAssert(suite1, resIn.breakdown.personalPayTotal >= 0, `${city.cityName} personalPayTotal < 0`);
          recordAssert(suite1, resIn.breakdown.deductibleDeducted >= 0, `${city.cityName} deductibleDeducted < 0`);
          recordAssert(suite1, resIn.breakdown.catastrophicReimbursed >= 0, `${city.cityName} catastrophicReimbursed < 0`);

          // Invariant 3: Zero cost exactness
          if (cost === 0) {
            recordAssert(suite1, resIn.breakdown.totalReimbursed === 0, `${city.cityName} zero-cost totalReimbursed != 0`);
            recordAssert(suite1, resIn.breakdown.personalPayTotal === 0, `${city.cityName} zero-cost personalPayTotal != 0`);
            recordAssert(suite1, resIn.breakdown.effectiveRatio === 0, `${city.cityName} zero-cost effectiveRatio != 0`);
          }

          // Invariant 4: Sub-deductible zero basic reimbursement
          if (cost <= standardDed && cost > 0) {
            recordAssert(
              suite1,
              resIn.breakdown.baseReimbursed === 0,
              `${city.cityName} sub-deductible cost=${cost} baseReimbursed should be 0, got ${resIn.breakdown.baseReimbursed}`
            );
          }

          // Invariant 5: No NaN or Infinity
          recordAssert(suite1, !isNaN(resIn.breakdown.totalReimbursed), `${city.cityName} totalReimbursed is NaN`);
          recordAssert(suite1, !isNaN(resIn.breakdown.personalPayTotal), `${city.cityName} personalPayTotal is NaN`);
          recordAssert(suite1, isFinite(resIn.breakdown.totalReimbursed), `${city.cityName} totalReimbursed is Infinite`);

          // Outpatient test
          if (cost <= 100 || cost === 100000000) {
            const resOut = calculateReimbursement({
              cityCode,
              insuranceType: insType,
              treatmentType: 'outpatient',
              hospitalTier: tier,
              totalCost: cost,
              isRetiree: false
            });

            assertClose(
              suite1,
              resOut.breakdown.totalReimbursed + resOut.breakdown.personalPayTotal,
              expectedCost,
              0.015,
              `${city.cityName} ${insType} ${tier} cost=${cost}: Outpatient Fund Conservation Leak`
            );
            recordAssert(suite1, resOut.breakdown.totalReimbursed >= 0, `${city.cityName} outpatient reimb < 0`);
            recordAssert(suite1, resOut.breakdown.personalPayTotal >= 0, `${city.cityName} outpatient personalPay < 0`);
          }
        }
      }
    }
  }

  // Nationwide 348 cities extreme check
  console.log('  Nationwide 348 cities extreme check (0, 0.001, 100,000,000 RMB)...');
  for (const city of allCities) {
    for (const cost of [0, 0.001, 100000000]) {
      const exp = Math.round(cost * 100) / 100;
      const res = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: cost
      });
      assertClose(
        suite1,
        res.breakdown.totalReimbursed + res.breakdown.personalPayTotal,
        exp,
        0.015,
        `Nationwide check ${city.cityName} cost=${cost} non-conservation`
      );
    }
  }

  console.log(`✓ Suite 1 Completed: Extreme cost boundaries evaluated.\n`);

  // ============================================================================
  // SUITE 2: Repeated Hospitalizations with Diminishing Deductibles
  // ============================================================================
  console.log('>>> Suite 2: Repeated Hospitalizations & Diminishing Deductibles Probing...');
  const suite2 = 'Suite 2 - Repeated Hospitalizations';

  const frequencies = [-1, 0, 1, 2, 3, 4, 5, 10, 50, 1000];

  const repeatedFocusCities = [
    { code: '370100', name: '济南市' },
    { code: '610100', name: '西安市' },
    { code: '510100', name: '成都市' },
    { code: '420100', name: '武汉市' },
    { code: '110100', name: '北京市' },
    { code: '320100', name: '南京市' },
    { code: '340200', name: '芜湖市' },
    { code: '610900', name: '安康市' }
  ];

  for (const item of repeatedFocusCities) {
    const city = getCityDataByCode(item.code);
    if (!city) continue;

    for (const insType of insuranceTypes) {
      for (const tier of hospitalTiers) {
        const pkg = insType === 'employee' ? city.employee : city.resident;
        const stdDed = pkg.inpatient.tierBenefits[tier]?.deductible ?? 500;

        let prevApplied = Infinity;

        for (const freq of frequencies) {
          const res = resolveInpatientDeductible({
            cityCode: item.code,
            insuranceType: insType,
            hospitalTier: tier,
            standardDeductible: stdDed,
            hospitalizationCount: freq,
            policy: pkg.inpatient.repeatedDeductiblePolicy,
            ruleText: pkg.inpatient.repeatedDeductibleRule
          });

          // Non-negativity invariant
          recordAssert(suite2, res.appliedDeductible >= 0, `${item.name} freq=${freq} appliedDeductible < 0: ${res.appliedDeductible}`);
          recordAssert(suite2, res.deductibleReduction >= 0, `${item.name} freq=${freq} deductibleReduction < 0: ${res.deductibleReduction}`);

          // Exact sum conservation: applied + reduction === standard
          assertClose(
            suite2,
            res.appliedDeductible + res.deductibleReduction,
            stdDed,
            0.01,
            `${item.name} freq=${freq} applied + reduction != standardDed`
          );

          // Monotonicity invariant for positive frequencies
          if (freq >= 1) {
            recordAssert(
              suite2,
              res.appliedDeductible <= prevApplied,
              `${item.name} freq=${freq} non-monotonic: curr=${res.appliedDeductible} > prev=${prevApplied}`
            );
            prevApplied = res.appliedDeductible;
          }

          // Edge frequency <= 1 sanity
          if (freq <= 1) {
            recordAssert(
              suite2,
              res.appliedDeductible === stdDed,
              `${item.name} freq=${freq} expected standardDed=${stdDed}, got ${res.appliedDeductible}`
            );
          }

          // End-to-end calculation under this frequency
          const calcRes = calculateReimbursement({
            cityCode: item.code,
            insuranceType: insType,
            treatmentType: 'inpatient',
            hospitalTier: tier,
            totalCost: 15000,
            hospitalizationCount: freq
          });

          assertClose(
            suite2,
            calcRes.breakdown.totalReimbursed + calcRes.breakdown.personalPayTotal,
            15000,
            0.015,
            `${item.name} freq=${freq} end-to-end fund conservation leak`
          );
        }

        // Verify outpatient immunity: outpatient must completely ignore hospitalizationCount
        const outRes1 = calculateReimbursement({
          cityCode: item.code,
          insuranceType: insType,
          treatmentType: 'outpatient',
          hospitalTier: tier,
          totalCost: 3000,
          hospitalizationCount: 1
        });
        const outRes3 = calculateReimbursement({
          cityCode: item.code,
          insuranceType: insType,
          treatmentType: 'outpatient',
          hospitalTier: tier,
          totalCost: 3000,
          hospitalizationCount: 5
        });

        recordAssert(
          suite2,
          outRes1.breakdown.totalReimbursed === outRes3.breakdown.totalReimbursed,
          `${item.name} Outpatient affected by hospitalizationCount!`
        );
      }
    }
  }

  // Specific rule checks: Jinan & Xi'an
  const jinan3 = resolveInpatientDeductible({
    cityCode: '370100',
    insuranceType: 'employee',
    hospitalTier: 'tier3',
    standardDeductible: 1000,
    hospitalizationCount: 3,
    policy: { type: 'half_second_zero_third' }
  });
  recordAssert(suite2, jinan3.appliedDeductible === 0, 'Jinan 3rd admission deductible must be 0');
  recordAssert(suite2, jinan3.deductibleReduction === 1000, 'Jinan 3rd admission reduction must be 1000');

  const xian1 = resolveInpatientDeductible({ cityCode: '610100', insuranceType: 'employee', hospitalTier: 'tier3_top', standardDeductible: 850, hospitalizationCount: 1 });
  const xian2 = resolveInpatientDeductible({ cityCode: '610100', insuranceType: 'employee', hospitalTier: 'tier3_top', standardDeductible: 850, hospitalizationCount: 2 });
  const xian3 = resolveInpatientDeductible({ cityCode: '610100', insuranceType: 'employee', hospitalTier: 'tier3_top', standardDeductible: 850, hospitalizationCount: 3 });
  const xian4 = resolveInpatientDeductible({ cityCode: '610100', insuranceType: 'employee', hospitalTier: 'tier3_top', standardDeductible: 850, hospitalizationCount: 4 });

  recordAssert(suite2, xian1.appliedDeductible === 850, 'Xi\'an employee tier3_top 1st admission must be 850');
  recordAssert(suite2, xian2.appliedDeductible === 800, 'Xi\'an employee tier3_top 2nd admission must be 800');
  recordAssert(suite2, xian3.appliedDeductible === 550, 'Xi\'an employee tier3_top 3rd admission must be 550');
  recordAssert(suite2, xian4.appliedDeductible === 0, 'Xi\'an employee tier3_top 4th admission must be 0');

  console.log(`✓ Suite 2 Completed: Repeated hospitalization diminishing rules verified.\n`);

  // ============================================================================
  // SUITE 3: Out-of-Province / Remote Filing Rules & Deductions
  // ============================================================================
  console.log('>>> Suite 3: Out-of-Province / Remote Filing Rules & Deductions Probing...');
  const suite3 = 'Suite 3 - Remote Rules & Deductions';

  for (const city of allCities) {
    for (const insType of insuranceTypes) {
      const resLocal = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: 50000,
        remoteStatus: 'local'
      });

      const resLongTerm = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: 50000,
        remoteStatus: 'long_term'
      });

      const resTransfer = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: 50000,
        remoteStatus: 'transfer'
      });

      const resUnfiledEmerg = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: 50000,
        remoteStatus: 'unfiled_emergency'
      });

      const resUnfiledNorm = calculateReimbursement({
        cityCode: city.cityCode,
        insuranceType: insType,
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: 50000,
        remoteStatus: 'unfiled_normal'
      });

      // Conservation across all 5 remote tiers
      for (const res of [resLocal, resLongTerm, resTransfer, resUnfiledEmerg, resUnfiledNorm]) {
        assertClose(
          suite3,
          res.breakdown.totalReimbursed + res.breakdown.personalPayTotal,
          50000,
          0.015,
          `${city.cityName} ${insType} remoteStatus=${res.input.remoteStatus} non-conservation`
        );
        recordAssert(suite3, res.breakdown.totalReimbursed >= 0, `${city.cityName} remote reimb < 0`);
        recordAssert(suite3, res.breakdown.personalPayTotal >= 0, `${city.cityName} remote personalPay < 0`);
      }

      // Hierarchy invariant: local >= unfiled_normal
      recordAssert(
        suite3,
        resLocal.breakdown.totalReimbursed >= resUnfiledNorm.breakdown.totalReimbursed,
        `${city.cityName} ${insType} local reimb < unfiled_normal reimb`
      );

      // Long term filing should be equal or very close to local
      assertClose(
        suite3,
        resLocal.breakdown.totalReimbursed,
        resLongTerm.breakdown.totalReimbursed,
        1.0,
        `${city.cityName} ${insType} long_term should equal local`
      );

      // Transfer should provide better or equal reimbursement than unauthorized unfiled
      recordAssert(
        suite3,
        resTransfer.breakdown.totalReimbursed >= resUnfiledNorm.breakdown.totalReimbursed,
        `${city.cityName} ${insType} transfer reimb < unfiled_normal reimb`
      );
    }
  }

  // Regional Alliances Check (Jing-Jin-Ji)
  const bj = getCityDataByCode('110100');
  recordAssert(suite3, bj?.employee.remoteMedical.longTermFiledRatio === 1.0, 'Beijing longTermFiledRatio must be 1.0');

  console.log(`✓ Suite 3 Completed: All 348 cities 5 remote tiers and alliances verified.\n`);

  // ============================================================================
  // SUITE 4: UI Touch Target Ergonomics Static CSS/Style Audit (>= 44px)
  // ============================================================================
  console.log('>>> Suite 4: UI Touch Target Ergonomics Static CSS/Style Audit (>= 44px)...');
  const suite4 = 'Suite 4 - Touch Ergonomics Audit';

  interface TargetAudit {
    file: string;
    selector: string;
    minHeightExpected: number;
    minWidthExpected?: number;
    description: string;
  }

  const criticalTargets: TargetAudit[] = [
    // index.vue
    { file: 'src/pages/index/index.vue', selector: '.freq-btn', minHeightExpected: 44, description: '住院频次阶梯按钮' },
    { file: 'src/pages/index/index.vue', selector: '.sds-btn', minHeightExpected: 44, description: '极简公文条操作按钮' },
    { file: 'src/pages/index/index.vue', selector: '.cyber-dropdown-trigger', minHeightExpected: 44, description: '参保地下拉触发器' },
    { file: 'src/pages/index/index.vue', selector: '.funnel-card-header', minHeightExpected: 44, description: '资金流向漏斗折叠头部' },

    // ranking/index.vue
    { file: 'src/pages/ranking/index.vue', selector: '.brc-act-btn', minHeightExpected: 44, minWidthExpected: 44, description: '政策卡片操作按钮' },
    { file: 'src/pages/ranking/index.vue', selector: '.mini-pk-btn', minHeightExpected: 44, minWidthExpected: 44, description: '全维宽表对决按钮' },
    { file: 'src/pages/ranking/index.vue', selector: '.size-pill', minHeightExpected: 44, minWidthExpected: 44, description: '分页每页条数胶囊' },
    { file: 'src/pages/ranking/index.vue', selector: '.page-nav-btn', minHeightExpected: 44, minWidthExpected: 44, description: '分页上一页/下一页按钮' },
    { file: 'src/pages/ranking/index.vue', selector: '.layout-btn', minHeightExpected: 44, minWidthExpected: 44, description: '卡片/宽表视图切换按钮' },
    { file: 'src/pages/ranking/index.vue', selector: '.search-input-box', minHeightExpected: 44, description: '统筹区搜索框外壳' },
    { file: 'src/pages/ranking/index.vue', selector: '.search-input', minHeightExpected: 44, description: '统筹区搜索输入框' },
    { file: 'src/pages/ranking/index.vue', selector: '.dropdown-trigger', minHeightExpected: 44, description: '省份/排序下拉触发器' },

    // MultiCitySimulator.vue
    { file: 'src/components/MultiCitySimulator.vue', selector: '.cost-chip', minHeightExpected: 44, minWidthExpected: 44, description: '快捷花费选择芯片' },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.remove-slot-btn', minHeightExpected: 44, minWidthExpected: 44, description: '移除第3城卡槽按钮' },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.rh-copy-btn', minHeightExpected: 44, minWidthExpected: 44, description: '红头公文复制文号按钮' },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.rh-act-btn', minHeightExpected: 44, minWidthExpected: 44, description: '公文查阅/官网/热线动作按钮' }
  ];

  for (const target of criticalTargets) {
    const fullPath = path.resolve(process.cwd(), target.file);
    const content = fs.readFileSync(fullPath, 'utf8');

    const cleanSelector = target.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanSelector}[^{]*)\\{([^}]+)\\}`, 'g');
    let match;
    let foundRules: { selectorMatch: string; ruleBody: string }[] = [];

    while ((match = regex.exec(content)) !== null) {
      foundRules.push({
        selectorMatch: match[1].trim(),
        ruleBody: match[2].trim()
      });
    }

    recordAssert(
      suite4,
      foundRules.length > 0,
      `[Selector Missing] ${target.file}: Target selector ${target.selector} not found in styles`
    );

    let hasSatisfyingMinHeight = false;
    let sub44MobileOverrides: string[] = [];

    for (const rule of foundRules) {
      const body = rule.ruleBody;
      const minHeightMatch = /min-height\s*:\s*(\d+)px/i.exec(body);
      const heightMatch = /(?:^|[\s;])height\s*:\s*(\d+)px/i.exec(body);
      const lineHeightMatch = /line-height\s*:\s*(\d+)px/i.exec(body);

      const minH = minHeightMatch ? parseInt(minHeightMatch[1], 10) : 0;
      const h = heightMatch ? parseInt(heightMatch[1], 10) : 0;
      const lineH = lineHeightMatch ? parseInt(lineHeightMatch[1], 10) : 0;

      if (minH >= target.minHeightExpected || h >= target.minHeightExpected || lineH >= target.minHeightExpected) {
        hasSatisfyingMinHeight = true;
      }

      // Check if this rule is an element-level height rule that specifies < 44px (excluding child icons)
      if (h > 0 && h < 44 && !rule.selectorMatch.includes('svg') && !rule.selectorMatch.includes('crest')) {
        sub44MobileOverrides.push(`Rule "${rule.selectorMatch}" specifies height: ${h}px (< 44px)`);
      }
    }

    recordAssert(
      suite4,
      hasSatisfyingMinHeight,
      `[Touch Target Under 44px] ${target.file} -> ${target.selector} (${target.description}): No base rule satisfying >= ${target.minHeightExpected}px found!`
    );

    if (sub44MobileOverrides.length > 0) {
      const bugDesc = `Mobile media query (< 768px) overrides ${target.selector} (${target.description}) to < 44px`;
      stats.surfacedBugs.push({
        category: 'UI Touch Ergonomics',
        description: bugDesc,
        detail: sub44MobileOverrides.join('; ')
      });
      console.warn(`  [SURFACED FINDING][Mobile CSS Override] ${target.file} -> ${target.selector}:\n    ${sub44MobileOverrides.join('\n    ')}`);
    }
  }

  console.log(`✓ Suite 4 Completed: UI touch targets statically audited.\n`);

  // ============================================================================
  // SUITE 5: Multi-City Simulation Antisymmetry, Presets & Conservation
  // ============================================================================
  console.log('>>> Suite 5: Multi-City Simulation Antisymmetry, Presets & Conservation...');
  const suite5 = 'Suite 5 - Multi-City Simulator';

  // 1. Audit all 9 popularMultiCityPresets in simulator.ts
  console.log('  Testing popularMultiCityPresets validity...');
  for (const preset of popularMultiCityPresets) {
    let thrownError: string | null = null;
    try {
      const out = runMultiCitySimulation(preset.cities, {
        insuranceType: 'employee',
        treatmentType: 'inpatient',
        hospitalTier: 'tier3',
        totalCost: 50000,
        remoteStatus: 'local'
      });
      recordAssert(suite5, out.cities.length === preset.cities.length, `Preset ${preset.id} length mismatch`);
    } catch (e: any) {
      thrownError = e.message;
    }

    if (thrownError) {
      const bugDesc = `Preset "${preset.name}" (${preset.id}) throws error during simulation`;
      stats.surfacedBugs.push({
        category: 'MultiCity Preset Inconsistency',
        description: bugDesc,
        detail: `Preset cities [${preset.cities.join(', ')}] error: ${thrownError}`
      });
      console.error(`  [SURFACED BUG][Preset Error] ${preset.name} (${preset.id}): ${thrownError}`);
      // Record assertion failure for this preset
      recordAssert(suite5, false, `Preset ${preset.id} (${preset.name}) threw: ${thrownError}`);
    } else {
      recordAssert(suite5, true, `Preset ${preset.id} execution`);
    }
  }

  // 2. Multi-city scenarios with valid codes (testing 500100 for Chongqing)
  const validScenarios = [
    { name: '京津冀对比', cities: ['110100', '120100', '130100'], cost: 100000 },
    { name: '长三角对比', cities: ['310100', '320100', '330100'], cost: 80000 },
    { name: '成渝陕对比 (修正码)', cities: ['610100', '510100', '500100'], cost: 50000 },
    { name: '大湾区对比', cities: ['440100', '440300'], cost: 30000 }
  ];

  for (const sc of validScenarios) {
    const outcome = runMultiCitySimulation(sc.cities, {
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3',
      totalCost: sc.cost,
      remoteStatus: 'local'
    });

    recordAssert(suite5, outcome.cities.length === sc.cities.length, `${sc.name}: outcome length mismatch`);

    for (let i = 0; i < outcome.cities.length; i++) {
      const cityOut = outcome.cities[i];
      // Fund conservation
      assertClose(
        suite5,
        cityOut.totalReimbursed + cityOut.personalPayTotal,
        sc.cost,
        0.015,
        `${sc.name} - ${cityOut.cityName}: Multi-City Fund Conservation Leak`
      );

      // Delta Antisymmetry: deltaR + deltaP === 0
      const sumDelta = cityOut.deltaReimbursedVsCityA + cityOut.deltaPersonalPayVsCityA;
      assertClose(
        suite5,
        sumDelta,
        0,
        0.02,
        `${sc.name} - ${cityOut.cityName}: Delta Antisymmetry Violation (deltaR=${cityOut.deltaReimbursedVsCityA}, deltaP=${cityOut.deltaPersonalPayVsCityA})`
      );

      if (i === 0) {
        recordAssert(suite5, cityOut.deltaReimbursedVsCityA === 0, `${cityOut.cityName} baseline deltaR != 0`);
        recordAssert(suite5, cityOut.deltaPersonalPayVsCityA === 0, `${cityOut.cityName} baseline deltaP != 0`);
      }
    }
  }

  console.log(`✓ Suite 5 Completed: Multi-city simulation antisymmetry verified.\n`);

  // ============================================================================
  // SUMMARY REPORT
  // ============================================================================
  console.log('================================================================================');
  console.log('>>> [EMPIRICAL CHALLENGER R8.2 VALIDATION SUMMARY] <<<');
  console.log(`  Total Checks Executed:  ${stats.totalChecks.toLocaleString()}`);
  console.log(`  Passed Checks:          ${stats.passedChecks.toLocaleString()}`);
  console.log(`  Failed Checks:          ${stats.failedChecks.toLocaleString()}`);
  console.log(`  Success Rate:           ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(4)}%`);
  console.log(`  Surfaced Findings/Bugs: ${stats.surfacedBugs.length}`);
  console.log('================================================================================\n');

  if (stats.surfacedBugs.length > 0) {
    console.log('SURFACED DEFECTS & FINDINGS:');
    stats.surfacedBugs.forEach((b, idx) => {
      console.log(`  ${idx + 1}. [${b.category}] ${b.description}`);
      console.log(`     Details: ${b.detail}`);
    });
  }

  return stats;
}

runEmpiricalStressSuite();
