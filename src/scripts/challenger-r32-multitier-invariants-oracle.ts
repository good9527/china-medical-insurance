/**
 * Actuarial Challenger R32: Multi-Tier Medical Security Invariants & Adversarial Stress Oracle
 *
 * Gen 32 Empirical Challenger Mandate:
 * 1. Full Cost Domain: [0, 0.01, 1, 100, 1300, 5000, 20000, 50000, 100000, 1000000, 10000000, 100000000 RMB]
 * 2. Multi-Tier Security Combinations:
 *    - Basic Medical Insurance (Employee & Resident, Inpatient & Outpatient, all Hospital Tiers)
 *    - Catastrophic Medical Insurance / Large Medical Aid
 *    - Medical Assistance (国办发〔2021〕42号)
 *    - Long-Term Care Insurance (all 15 pilot cities, all disability tiers, home vs institution)
 *    - City Huiminbao (all 15 representative products, in-catalog, out-of-catalog, specialty drugs, continuous enrollment, pre-existing)
 * 3. Rigorous Invariant Verification:
 *    - Physical Fund Conservation Axiom: |totalReimbursed + personalPayTotal - totalCost| <= 0.01 (100.0000%)
 *    - Non-negativity: totalReimbursed >= 0 && personalPayTotal >= 0
 *    - Indemnity Cap: totalReimbursed <= totalCost
 *    - Monotonicity: Medical expense increases never decrease total reimbursement
 * 4. Rigorous 0-Emoji Government Standard Dynamic Audit across all policyNotes
 */

import {
  calculateReimbursement,
  calculateLtcBenefit,
  calculateHuiminbaoBenefit,
  EnhancedCalculateRequest
} from '../engine/calculator';
import {
  allCities,
  getCityDataByCode
} from '../data';
import {
  LTC_POLICIES,
  HUIMINBAO_POLICIES,
  getLtcPolicy,
  getHuiminbaoPolicy,
  DEFAULT_LTC_POLICY,
  DEFAULT_HUIMINBAO_POLICY
} from '../data/multitierPolicies';
import type {
  HospitalTier,
  RemoteStatus,
  InsuranceType,
  TreatmentType,
  LtcDisabilityGrade,
  LtcCareMode,
  CalculateRequest
} from '../data/types';

export interface ChallengerR32Stats {
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  suiteStats: Record<string, { total: number; passed: number; failed: number; elapsedMs: number }>;
  failures: string[];
}

const stats: ChallengerR32Stats = {
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
  suiteStats: {},
  failures: []
};

let currentSuite = '';

function startSuite(suiteName: string): void {
  currentSuite = suiteName;
  stats.suiteStats[suiteName] = { total: 0, passed: 0, failed: 0, elapsedMs: Date.now() };
  console.log(`\n================================================================================`);
  console.log(`>>> [Challenger R32 Oracle] Starting: ${suiteName} <<<`);
  console.log(`================================================================================`);
}

function finishSuite(): void {
  if (!currentSuite || !stats.suiteStats[currentSuite]) return;
  const s = stats.suiteStats[currentSuite];
  s.elapsedMs = Date.now() - s.elapsedMs;
  console.log(`--- [COMPLETED] ${currentSuite} ---`);
  console.log(`    Total: ${s.total.toLocaleString()} | Passed: ${s.passed.toLocaleString()} | Failed: ${s.failed} | Elapsed: ${s.elapsedMs}ms\n`);
}

function assertCondition(condition: boolean, message: string): void {
  stats.totalAssertions++;
  const s = stats.suiteStats[currentSuite];
  if (s) s.total++;

  if (!condition) {
    stats.failedAssertions++;
    if (s) s.failed++;
    if (stats.failures.length < 50) {
      const fullMsg = `[FAIL][${currentSuite}] ${message}`;
      stats.failures.push(fullMsg);
      console.error(`  ${fullMsg}`);
    }
  } else {
    stats.passedAssertions++;
    if (s) s.passed++;
  }
}

function assertClose(val1: number, val2: number, tolerance = 0.01, message = ''): void {
  const diff = Math.abs(val1 - val2);
  assertCondition(
    diff <= tolerance,
    `${message} [Diff: ${diff.toFixed(6)}, Expected: ${val2}, Actual: ${val1}, Tol: ${tolerance}]`
  );
}

// Check for Emoji characters (0-Emoji policy)
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

// Authoritative full cost domain
const FULL_COST_DOMAIN = [
  0,
  0.01,
  1,
  100,
  1300,
  5000,
  20000,
  50000,
  100000,
  1000000,
  10000000,
  100000000
];

// All hospital tiers
const ALL_HOSPITAL_TIERS: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];

// All 15 LTC Pilot Cities
const LTC_15_CITIES = [
  '310100', // 上海市
  '440100', // 广州市
  '510100', // 成都市
  '370200', // 青岛市
  '320500', // 苏州市
  '320600', // 南通市
  '420800', // 荆门市
  '330200', // 宁波市
  '361100', // 上饶市
  '660100', // 石河子市
  '110100', // 北京市
  '120100', // 天津市
  '500100', // 重庆市
  '220100', // 长春市
  '370100'  // 济南市
];

// All 15 Huiminbao Representative Products
const HUIMINBAO_15_PRODUCTS = [
  { cityCode: '110100', productId: 'beijing_puhui', name: '北京普惠健康保' },
  { cityCode: '310100', productId: 'shanghai_huhuibao', name: '上海沪惠保' },
  { cityCode: '440100', productId: 'guangzhou_suisukang', name: '广州穗岁康' },
  { cityCode: '440300', productId: 'shenzhen_huiminbao', name: '深圳惠民保' },
  { cityCode: '330100', productId: 'hangzhou_xihuyilianbao', name: '杭州西湖益联保' },
  { cityCode: '510100', productId: 'chengdu_huirongbao', name: '成都惠蓉保' },
  { cityCode: '500100', productId: 'chongqing_yukaibao', name: '重庆渝快保' },
  { cityCode: '420100', productId: 'wuhan_jiangchenganxin', name: '武汉江城安心保' },
  { cityCode: '320100', productId: 'nanjing_ninghuibao', name: '南京宁惠保' },
  { cityCode: '370100', productId: 'jinan_qilubao', name: '济南齐鲁保' },
  { cityCode: '430100', productId: 'changsha_xinghuibao', name: '长沙星惠保' },
  { cityCode: '410100', productId: 'zhengzhou_yihuibao', name: '郑州医惠保' },
  { cityCode: '610100', productId: 'xian_changanyikang', name: '西安长安益康保' },
  { cityCode: '210100', productId: 'shenyang_shengjingbao', name: '沈阳盛京保' },
  { cityCode: '230100', productId: 'harbin_longjianghuimin', name: '哈尔滨龙江惠民保' }
];

// Disability tiers for LTC
const ALL_LTC_DISABILITY_GRADES: LtcDisabilityGrade[] = [
  'none',
  'mild',
  'moderate',
  'severe1',
  'severe2',
  'severe3',
  'dementia'
];

// Care modes for LTC
const ALL_LTC_CARE_MODES: LtcCareMode[] = [
  'home',
  'home_service',
  'home_cash_allowance',
  'institution',
  'institution_pension',
  'institution_medical'
];

// ============================================================================
// SUITE 1: Basic Medical + Catastrophic + Medical Assistance Full Domain Stress
// ============================================================================
function runBasicCatastrophicAssistanceSuite(): void {
  startSuite('Suite 1: Basic Medical + Catastrophic + Medical Assistance (国办发〔2021〕42号)');

  const testCities = ['110100', '310100', '440100', '440300', '510100', '420100', '330100', '610100'];

  for (const cityCode of testCities) {
    const city = getCityDataByCode(cityCode);
    if (!city) continue;

    for (const insuranceType of ['employee', 'resident'] as InsuranceType[]) {
      for (const treatmentType of ['inpatient', 'outpatient'] as TreatmentType[]) {
        for (const hospitalTier of ALL_HOSPITAL_TIERS) {
          for (const isAssistanceTarget of [false, true]) {
            let previousReimbursement = -1;

            for (const cost of FULL_COST_DOMAIN) {
              const nonIns = Math.round(cost * 0.10 * 100) / 100;
              const classB = Math.round(cost * 0.15 * 100) / 100;
              const assistanceAmount = isAssistanceTarget ? Math.min(20000, Math.round(cost * 0.20 * 100) / 100) : 0;

              const req: CalculateRequest = {
                cityCode,
                insuranceType,
                isRetiree: insuranceType === 'employee',
                treatmentType,
                hospitalTier,
                remoteStatus: 'local',
                totalCost: cost,
                nonInsuranceCost: nonIns,
                classBCost: classB,
                isAssistanceTarget,
                medicalAssistanceAmount: assistanceAmount
              };

              const res = calculateReimbursement(req);
              const b = res.breakdown;
              const roundedCost = Math.round(Math.max(0, cost) * 100) / 100;

              // Invariant 1: Physical Fund Conservation Axiom
              assertClose(
                b.totalReimbursed + b.personalPayTotal,
                roundedCost,
                0.01,
                `Fund Conservation [${city.cityName} ${insuranceType} ${treatmentType} ${hospitalTier} assist=${isAssistanceTarget}] at cost ¥${cost}`
              );

              // Invariant 2: Non-negativity
              assertCondition(b.totalReimbursed >= 0, `Non-negative reimbursement ¥${b.totalReimbursed} in ${city.cityName}`);
              assertCondition(b.personalPayTotal >= 0, `Non-negative personal pay ¥${b.personalPayTotal} in ${city.cityName}`);

              // Invariant 3: Indemnity Cap
              assertCondition(
                b.totalReimbursed <= roundedCost + 0.001,
                `Indemnity breach: totalReimbursed ¥${b.totalReimbursed} > totalCost ¥${roundedCost} in ${city.cityName}`
              );

              // Invariant 4: Monotonicity
              if (previousReimbursement >= 0) {
                assertCondition(
                  b.totalReimbursed >= previousReimbursement - 0.01,
                  `Monotonicity breach: cost ¥${cost} gave ¥${b.totalReimbursed} < previous ¥${previousReimbursement}`
                );
              }
              previousReimbursement = b.totalReimbursed;

              // Check 0-Emoji in policyNotes
              for (const note of res.policyNotes) {
                assertCondition(!EMOJI_REGEX.test(note), `0-Emoji violated in policy note: ${note}`);
              }
            }
          }
        }
      }
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 2: Long-Term Care Insurance (LTC) 15 Pilot Cities Full Invariant Oracle
// ============================================================================
function runLtc15PilotCitiesSuite(): void {
  startSuite('Suite 2: Long-Term Care Insurance (LTC) 15 Pilot Cities Full Invariant Oracle');

  console.log(`Auditing all ${LTC_15_CITIES.length} national LTC pilot cities across all disability grades & care modes...`);

  for (const cityCode of LTC_15_CITIES) {
    const policy = getLtcPolicy(cityCode);
    assertCondition(policy !== undefined, `LTC Policy must exist for pilot city code: ${cityCode}`);
    assertCondition(policy.cityCode === cityCode, `LTC cityCode mismatch: ${policy.cityCode} vs ${cityCode}`);

    for (const grade of ALL_LTC_DISABILITY_GRADES) {
      for (const careMode of ALL_LTC_CARE_MODES) {
        let prevLtcBenefit = -1;

        for (const careCost of FULL_COST_DOMAIN) {
          // 1. Standalone calculateLtcBenefit
          const ltcStandalone = calculateLtcBenefit({
            cityCode,
            disabilityGrade: grade,
            careMode,
            careCost,
            isEmployee: true
          });

          const roundedCareCost = Math.round(Math.max(0, careCost) * 100) / 100;

          // Invariant 1: Conservation in LTC
          assertClose(
            ltcStandalone.ltcBenefit + ltcStandalone.ltcPersonalPay,
            roundedCareCost,
            0.01,
            `LTC Conservation in ${policy.cityName} [grade=${grade}, mode=${careMode}] at careCost ¥${careCost}`
          );

          // Invariant 2: Non-negativity
          assertCondition(ltcStandalone.ltcBenefit >= 0, `LTC benefit non-negative: ¥${ltcStandalone.ltcBenefit}`);
          assertCondition(ltcStandalone.ltcPersonalPay >= 0, `LTC personal pay non-negative: ¥${ltcStandalone.ltcPersonalPay}`);

          // Invariant 3: Indemnity Cap
          assertCondition(
            ltcStandalone.ltcBenefit <= roundedCareCost + 0.001,
            `LTC Indemnity breach: benefit ¥${ltcStandalone.ltcBenefit} > cost ¥${roundedCareCost}`
          );

          // Invariant 4: Eligibility gating
          if (grade === 'none' || grade === 'mild' || careCost === 0) {
            assertCondition(
              ltcStandalone.ltcBenefit === 0,
              `Ineligible grade (${grade}) or zero cost must yield 0 LTC benefit, got: ¥${ltcStandalone.ltcBenefit}`
            );
          }

          // Invariant 5: Monotonicity
          if (prevLtcBenefit >= 0) {
            assertCondition(
              ltcStandalone.ltcBenefit >= prevLtcBenefit - 0.01,
              `LTC Monotonicity breach in ${policy.cityName}: careCost ¥${careCost} benefit ¥${ltcStandalone.ltcBenefit} < prev ¥${prevLtcBenefit}`
            );
          }
          prevLtcBenefit = ltcStandalone.ltcBenefit;

          // Check 0-Emoji
          for (const note of ltcStandalone.notes) {
            assertCondition(!EMOJI_REGEX.test(note), `LTC 0-Emoji violated in note: ${note}`);
          }

          // 2. Integrated calculateReimbursement with hasLtc: true
          const customCity = cityCode === '660100' ? getCityDataByCode('660000') : undefined;
          const req: CalculateRequest = {
            cityCode,
            insuranceType: 'employee',
            treatmentType: 'inpatient',
            hospitalTier: 'tier2',
            remoteStatus: 'local',
            totalCost: careCost,
            hasLtc: true,
            ltcDisabilityGrade: grade,
            ltcCareMode: careMode,
            ltcCareCost: careCost
          };

          const fullRes = calculateReimbursement(req, customCity);
          const b = fullRes.breakdown;

          // Overall conservation
          assertClose(
            b.totalReimbursed + b.personalPayTotal,
            roundedCareCost,
            0.01,
            `Integrated LTC Fund Conservation in ${policy.cityName} at cost ¥${careCost}`
          );

          assertCondition(
            b.totalReimbursed <= roundedCareCost + 0.001,
            `Integrated LTC Indemnity breach: totalReimbursed ¥${b.totalReimbursed} > totalCost ¥${roundedCareCost}`
          );
        }
      }
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 3: City Huiminbao 15 Representative Products Full Invariant Oracle
// ============================================================================
function runHuiminbao15ProductsSuite(): void {
  startSuite('Suite 3: City Huiminbao 15 Representative Products Invariant Oracle');

  console.log(`Auditing all ${HUIMINBAO_15_PRODUCTS.length} municipal Huiminbao products across in-catalog, out-of-catalog & specialty drugs...`);

  for (const prod of HUIMINBAO_15_PRODUCTS) {
    const policy = getHuiminbaoPolicy(prod.cityCode, prod.productId);
    assertCondition(policy !== undefined, `Huiminbao policy must exist for product: ${prod.name} (${prod.productId})`);
    assertCondition(policy.productCode === prod.productId, `Huiminbao productCode mismatch: ${policy.productCode} vs ${prod.productId}`);

    for (const isContinuous of [false, true]) {
      for (const hasPreExistingCondition of [false, true]) {
        let prevHmBenefit = -1;

        for (const totalExpense of FULL_COST_DOMAIN) {
          // Partition expenses into in-catalog self pay, out-of-catalog cost, and special drugs
          const inSelfPay = Math.round(totalExpense * 0.50 * 100) / 100;
          const outCost = Math.round(totalExpense * 0.35 * 100) / 100;
          const specCost = Math.round(totalExpense * 0.15 * 100) / 100;

          // 1. Standalone calculateHuiminbaoBenefit
          const hmStandalone = calculateHuiminbaoBenefit({
            cityCode: prod.cityCode,
            productId: prod.productId,
            inCatalogSelfPay: inSelfPay,
            outCatalogCost: outCost,
            specialDrugCost: specCost,
            isContinuous,
            hasPreExistingCondition
          });

          const totalDirectExpense = inSelfPay + outCost + specCost;

          // Invariant 1: Total Huiminbao benefit non-negative
          assertCondition(hmStandalone.totalHuiminbaoBenefit >= 0, `Huiminbao benefit non-negative: ¥${hmStandalone.totalHuiminbaoBenefit}`);

          // Invariant 2: Total Huiminbao benefit <= total direct expense
          assertCondition(
            hmStandalone.totalHuiminbaoBenefit <= totalDirectExpense + 0.01,
            `Huiminbao Indemnity breach in ${prod.name}: benefit ¥${hmStandalone.totalHuiminbaoBenefit} > expense ¥${totalDirectExpense}`
          );

          // Invariant 3: Comprehensive Annual Cap enforcement
          const maxCap = policy.comprehensiveAnnualCap ?? 3000000;
          assertCondition(
            hmStandalone.totalHuiminbaoBenefit <= maxCap + 0.01,
            `Huiminbao Cap breach in ${prod.name}: benefit ¥${hmStandalone.totalHuiminbaoBenefit} > cap ¥${maxCap}`
          );

          // Invariant 4: Continuous enrollment lower or equal deductible invariant
          if (policy.inCatalogCoverage && policy.inCatalogCoverage.deductibleConsecutive !== undefined) {
            assertCondition(
              policy.inCatalogCoverage.deductibleConsecutive <= policy.inCatalogCoverage.deductibleStandard,
              `In-catalog deductibleConsecutive (${policy.inCatalogCoverage.deductibleConsecutive}) must be <= standard (${policy.inCatalogCoverage.deductibleStandard})`
            );
          }
          if (policy.outCatalogCoverage && policy.outCatalogCoverage.deductibleConsecutive !== undefined) {
            assertCondition(
              policy.outCatalogCoverage.deductibleConsecutive <= policy.outCatalogCoverage.deductibleStandard,
              `Out-catalog deductibleConsecutive (${policy.outCatalogCoverage.deductibleConsecutive}) must be <= standard (${policy.outCatalogCoverage.deductibleStandard})`
            );
          }

          // Invariant 5: Monotonicity
          if (prevHmBenefit >= 0) {
            assertCondition(
              hmStandalone.totalHuiminbaoBenefit >= prevHmBenefit - 0.01,
              `Huiminbao Monotonicity breach in ${prod.name}: expense ¥${totalExpense} benefit ¥${hmStandalone.totalHuiminbaoBenefit} < prev ¥${prevHmBenefit}`
            );
          }
          prevHmBenefit = hmStandalone.totalHuiminbaoBenefit;

          // Check 0-Emoji
          for (const note of hmStandalone.notes) {
            assertCondition(!EMOJI_REGEX.test(note), `Huiminbao 0-Emoji violated in note: ${note}`);
          }

          // 2. Integrated calculateReimbursement with hasHuiminbao: true
          const req: CalculateRequest = {
            cityCode: prod.cityCode,
            insuranceType: 'resident',
            treatmentType: 'inpatient',
            hospitalTier: 'tier3',
            remoteStatus: 'local',
            totalCost: totalExpense,
            nonInsuranceCost: outCost + specCost,
            specialDrugCost: specCost,
            hasHuiminbao: true,
            huiminbaoProductId: prod.productId,
            huiminbaoIsContinuous: isContinuous,
            huiminbaoHasPreExistingCondition: hasPreExistingCondition
          };

          const fullRes = calculateReimbursement(req);
          const b = fullRes.breakdown;
          const roundedCost = Math.round(Math.max(0, totalExpense) * 100) / 100;

          // Conservation with Huiminbao
          assertClose(
            b.totalReimbursed + b.personalPayTotal,
            roundedCost,
            0.01,
            `Integrated Huiminbao Conservation in ${prod.name} at cost ¥${totalExpense}`
          );

          assertCondition(
            b.totalReimbursed <= roundedCost + 0.001,
            `Integrated Huiminbao Indemnity breach in ${prod.name}: totalReimbursed ¥${b.totalReimbursed} > totalCost ¥${roundedCost}`
          );
        }
      }
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 4: Full Multi-Tier Coordinated Convergence Oracle (All 5 Tiers Simultaneous)
// ============================================================================
function runFullMultiTierCoordinatedConvergenceSuite(): void {
  startSuite('Suite 4: Full Multi-Tier Coordinated Convergence (Basic + Catastrophic + Aid + LTC + Huiminbao)');

  // Joint cities having both LTC and Huiminbao
  const jointCities = ['110100', '310100', '440100', '510100', '370100', '500100'];

  for (const cityCode of jointCities) {
    const city = getCityDataByCode(cityCode);
    if (!city) continue;

    for (const insuranceType of ['employee', 'resident'] as InsuranceType[]) {
      for (const treatmentType of ['inpatient', 'outpatient'] as TreatmentType[]) {
        for (const hospitalTier of ['tier2', 'tier3'] as HospitalTier[]) {
          let prevTotalReimbursed = -1;

          for (const totalCost of FULL_COST_DOMAIN) {
            const nonIns = Math.round(totalCost * 0.15 * 100) / 100;
            const classB = Math.round(totalCost * 0.10 * 100) / 100;
            const specDrug = Math.round(nonIns * 0.40 * 100) / 100;
            const aidAmount = Math.round(totalCost * 0.10 * 100) / 100;

            const req: CalculateRequest = {
              cityCode,
              insuranceType,
              isRetiree: false,
              treatmentType,
              hospitalTier,
              remoteStatus: 'local',
              totalCost,
              nonInsuranceCost: nonIns,
              classBCost: classB,
              specialDrugCost: specDrug,
              isAssistanceTarget: true,
              medicalAssistanceAmount: aidAmount,
              hasHuiminbao: true,
              huiminbaoIsContinuous: true,
              huiminbaoHasPreExistingCondition: false,
              hasLtc: true,
              ltcDisabilityGrade: 'severe2',
              ltcCareMode: 'institution',
              ltcCareCost: Math.min(3000, totalCost)
            };

            const res = calculateReimbursement(req);
            const b = res.breakdown;
            const roundedCost = Math.round(Math.max(0, totalCost) * 100) / 100;

            // Invariant 1: Physical Fund Conservation Axiom across 5 tiers
            assertClose(
              b.totalReimbursed + b.personalPayTotal,
              roundedCost,
              0.01,
              `5-Tier Coordinated Fund Conservation in ${city.cityName} at cost ¥${totalCost}`
            );

            // Invariant 2: Non-negativity
            assertCondition(b.totalReimbursed >= 0, `5-Tier Non-negative reimbursement ¥${b.totalReimbursed}`);
            assertCondition(b.personalPayTotal >= 0, `5-Tier Non-negative personal pay ¥${b.personalPayTotal}`);

            // Invariant 3: Indemnity Principle
            assertCondition(
              b.totalReimbursed <= roundedCost + 0.001,
              `5-Tier Indemnity breach in ${city.cityName}: totalReimbursed ¥${b.totalReimbursed} > totalCost ¥${roundedCost}`
            );

            // Invariant 4: Multi-tier addition integrity:
            // totalReimbursed must exactly equal min(totalCost, base + catastrophic + assistance + huiminbao + ltc)
            const expectedSum = Math.min(
              roundedCost,
              Math.round(
                (b.baseReimbursed +
                  b.catastrophicReimbursed +
                  (b.medicalAssistance || 0) +
                  (b.huiminbaoBenefit || 0) +
                  (b.ltcBenefit || 0)) * 100
              ) / 100
            );
            assertClose(
              b.totalReimbursed,
              expectedSum,
              0.01,
              `5-Tier Tiered Sum Integrity in ${city.cityName} at cost ¥${totalCost}`
            );

            // Invariant 5: Monotonicity
            if (prevTotalReimbursed >= 0) {
              assertCondition(
                b.totalReimbursed >= prevTotalReimbursed - 0.01,
                `5-Tier Monotonicity breach in ${city.cityName}: cost ¥${totalCost} gave ¥${b.totalReimbursed} < prev ¥${prevTotalReimbursed}`
              );
            }
            prevTotalReimbursed = b.totalReimbursed;

            // Check 0-Emoji in policyNotes
            for (const note of res.policyNotes) {
              assertCondition(!EMOJI_REGEX.test(note), `5-Tier 0-Emoji violated in policy note: ${note}`);
            }
          }
        }
      }
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 5: Adversarial Chaos Fuzzing & Defensive Bounding Stress
// ============================================================================
function runAdversarialChaosSuite(): void {
  startSuite('Suite 5: Adversarial Chaos Fuzzing & Defensive Boundary Stress');

  const chaosPoints = [
    -1000,
    -0.01,
    0,
    0.0001,
    0.0049,
    0.005,
    0.009,
    0.01,
    0.05,
    0.49,
    0.50,
    0.99,
    1.001,
    99999999.99,
    100000000,
    500000000
  ];

  for (const cost of chaosPoints) {
    const req: CalculateRequest = {
      cityCode: '310100', // 上海
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: cost,
      nonInsuranceCost: Math.max(0, cost * 0.20),
      classBCost: Math.max(0, cost * 0.15),
      hasHuiminbao: true,
      hasLtc: true,
      ltcDisabilityGrade: 'severe3',
      ltcCareMode: 'institution'
    };

    const res = calculateReimbursement(req);
    const b = res.breakdown;
    const sanitizedCost = Math.round(Math.max(0, cost) * 100) / 100;

    assertClose(
      b.totalReimbursed + b.personalPayTotal,
      sanitizedCost,
      0.01,
      `Chaos Fund Conservation at cost ¥${cost}`
    );

    assertCondition(b.totalReimbursed >= 0, `Chaos non-negative reimbursement at cost ¥${cost}`);
    assertCondition(b.personalPayTotal >= 0, `Chaos non-negative personal pay at cost ¥${cost}`);
    assertCondition(
      b.totalReimbursed <= sanitizedCost + 0.001,
      `Chaos indemnity cap satisfied at cost ¥${cost}`
    );
  }

  finishSuite();
}

// ============================================================================
// SUITE 6: Pre-Existing Condition vs Healthy Parity Invariant
// ============================================================================
function runPreExistingConditionParitySuite(): void {
  startSuite('Suite 6: Pre-Existing Condition vs Healthy Parity Invariant (Benefit_pre <= Benefit_healthy)');

  for (const prod of HUIMINBAO_15_PRODUCTS) {
    for (const cost of [20000, 50000, 100000, 300000, 1000000]) {
      const inSelfPay = Math.round(cost * 0.60 * 100) / 100;
      const outCost = Math.round(cost * 0.40 * 100) / 100;

      const resHealthy = calculateHuiminbaoBenefit({
        cityCode: prod.cityCode,
        productId: prod.productId,
        inCatalogSelfPay: inSelfPay,
        outCatalogCost: outCost,
        isContinuous: false,
        hasPreExistingCondition: false
      });

      const resPreExisting = calculateHuiminbaoBenefit({
        cityCode: prod.cityCode,
        productId: prod.productId,
        inCatalogSelfPay: inSelfPay,
        outCatalogCost: outCost,
        isContinuous: false,
        hasPreExistingCondition: true
      });

      // Parity invariant: Healthy benefit must always be >= Pre-existing benefit
      assertCondition(
        resHealthy.totalHuiminbaoBenefit >= resPreExisting.totalHuiminbaoBenefit - 0.01,
        `Parity breach in ${prod.name}: pre-existing benefit ¥${resPreExisting.totalHuiminbaoBenefit} > healthy ¥${resHealthy.totalHuiminbaoBenefit}`
      );
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 7: Continuous Enrollment Incentive Monotonicity Invariant
// ============================================================================
function runContinuousEnrollmentIncentiveSuite(): void {
  startSuite('Suite 7: Continuous Enrollment Incentive Monotonicity (Benefit_continuous >= Benefit_standard)');

  for (const prod of HUIMINBAO_15_PRODUCTS) {
    for (const cost of [20000, 50000, 100000, 300000, 1000000]) {
      const inSelfPay = Math.round(cost * 0.50 * 100) / 100;
      const outCost = Math.round(cost * 0.35 * 100) / 100;
      const specCost = Math.round(cost * 0.15 * 100) / 100;

      const resStandard = calculateHuiminbaoBenefit({
        cityCode: prod.cityCode,
        productId: prod.productId,
        inCatalogSelfPay: inSelfPay,
        outCatalogCost: outCost,
        specialDrugCost: specCost,
        isContinuous: false,
        hasPreExistingCondition: false
      });

      const resContinuous = calculateHuiminbaoBenefit({
        cityCode: prod.cityCode,
        productId: prod.productId,
        inCatalogSelfPay: inSelfPay,
        outCatalogCost: outCost,
        specialDrugCost: specCost,
        isContinuous: true,
        hasPreExistingCondition: false
      });

      // Monotonicity invariant: Continuous enrollment must always yield >= standard benefit
      assertCondition(
        resContinuous.totalHuiminbaoBenefit >= resStandard.totalHuiminbaoBenefit - 0.01,
        `Incentive breach in ${prod.name}: continuous benefit ¥${resContinuous.totalHuiminbaoBenefit} < standard ¥${resStandard.totalHuiminbaoBenefit}`
      );
    }
  }

  finishSuite();
}

// ============================================================================
// SUITE 8: Micro-Deductible & Macro-Cap Boundary Discontinuity Precision Stress
// ============================================================================
function runBoundaryDiscontinuityPrecisionSuite(): void {
  startSuite('Suite 8: Micro-Deductible & Macro-Cap Boundary Discontinuity Precision Stress');

  for (const prod of HUIMINBAO_15_PRODUCTS) {
    const policy = getHuiminbaoPolicy(prod.cityCode, prod.productId);
    if (!policy.inCatalogCoverage) continue;

    const D = policy.inCatalogCoverage.deductibleStandard;
    const boundaryPoints = [
      Math.max(0, D - 1),
      Math.max(0, D - 0.01),
      D,
      D + 0.01,
      D + 1
    ];

    for (const cost of boundaryPoints) {
      const res = calculateHuiminbaoBenefit({
        cityCode: prod.cityCode,
        productId: prod.productId,
        inCatalogSelfPay: cost,
        outCatalogCost: 0,
        specialDrugCost: 0,
        isContinuous: false,
        hasPreExistingCondition: false
      });

      if (cost <= D) {
        assertCondition(
          res.inCatalogBenefit === 0,
          `At or below deductible ¥${D}, benefit must be 0 in ${prod.name}, got ¥${res.inCatalogBenefit}`
        );
      } else {
        assertCondition(
          res.inCatalogBenefit > 0,
          `Above deductible ¥${D}, benefit must be > 0 in ${prod.name}, got ¥${res.inCatalogBenefit}`
        );
      }
    }

    // Macro-Cap Boundary
    const cap = policy.inCatalogCoverage.annualCap;
    const extremeCost = cap * 3;
    const resCap = calculateHuiminbaoBenefit({
      cityCode: prod.cityCode,
      productId: prod.productId,
      inCatalogSelfPay: extremeCost,
      outCatalogCost: 0,
      specialDrugCost: 0,
      isContinuous: false,
      hasPreExistingCondition: false
    });

    assertCondition(
      resCap.inCatalogBenefit <= cap + 0.01,
      `Annual Cap breach in ${prod.name}: benefit ¥${resCap.inCatalogBenefit} > cap ¥${cap}`
    );
  }

  finishSuite();
}

// ============================================================================
// SUITE 9: High-Cost CAR-T / Rare Disease Specialty Drug 1.2M RMB Stress
// ============================================================================
function runHighCostSpecialtyDrugSuite(): void {
  startSuite('Suite 9: High-Cost CAR-T / Rare Disease Specialty Drug ¥1,200,000 Stress');

  const cartCost = 1200000; // Typical 1.2M RMB CAR-T cell therapy

  for (const prod of HUIMINBAO_15_PRODUCTS) {
    const policy = getHuiminbaoPolicy(prod.cityCode, prod.productId);

    const hmRes = calculateHuiminbaoBenefit({
      cityCode: prod.cityCode,
      productId: prod.productId,
      inCatalogSelfPay: 0,
      outCatalogCost: 0,
      specialDrugCost: cartCost,
      isContinuous: true,
      hasPreExistingCondition: false
    });

    assertCondition(
      hmRes.specialDrugBenefit > 0,
      `CAR-T specialty drug benefit must activate in ${prod.name}, got ¥${hmRes.specialDrugBenefit}`
    );

    const specCap = policy.specialDrugCoverage?.annualCap ?? 1000000;
    assertCondition(
      hmRes.specialDrugBenefit <= specCap + 0.01,
      `CAR-T specialty drug benefit ¥${hmRes.specialDrugBenefit} must respect cap ¥${specCap} in ${prod.name}`
    );

    // Integrated calculateReimbursement with CAR-T
    const customCity = prod.cityCode === '660100' ? getCityDataByCode('660000') : undefined;
    const req: CalculateRequest = {
      cityCode: prod.cityCode,
      insuranceType: 'resident',
      treatmentType: 'inpatient',
      hospitalTier: 'tier3_top',
      remoteStatus: 'local',
      totalCost: cartCost,
      nonInsuranceCost: cartCost,
      specialDrugCost: cartCost,
      hasHuiminbao: true,
      huiminbaoProductId: prod.productId,
      huiminbaoIsContinuous: true
    };

    const fullRes = calculateReimbursement(req, customCity);
    const b = fullRes.breakdown;

    assertClose(
      b.totalReimbursed + b.personalPayTotal,
      cartCost,
      0.01,
      `CAR-T Fund Conservation in ${prod.name} at ¥1.2M`
    );

    assertCondition(
      b.totalReimbursed <= cartCost,
      `CAR-T Indemnity cap preserved in ${prod.name}`
    );

    assertCondition(
      b.huiminbaoSpecialDrugBenefit !== undefined && b.huiminbaoSpecialDrugBenefit > 0,
      `CAR-T breakdown.huiminbaoSpecialDrugBenefit should be recorded in ${prod.name}`
    );
  }

  finishSuite();
}

// ============================================================================
// SUITE 10: Administrative Division Code Alias & Integration Fault Isolation
// ============================================================================
function runAdminCodeAliasFaultIsolationSuite(): void {
  startSuite('Suite 10: Administrative Division Code Alias & Integration Fault Isolation (660100 vs 660000)');

  // 1. Standalone calculateLtcBenefit works for 660100
  const ltcRes = calculateLtcBenefit({
    cityCode: '660100',
    disabilityGrade: 'severe2',
    careMode: 'home',
    careCost: 2000
  });
  assertCondition(ltcRes.isEligible, 'Shihezi (660100) LTC policy standalone must be eligible');
  assertCondition(ltcRes.cityName === '石河子市', `Shihezi cityName must match: ${ltcRes.cityName}`);
  assertClose(ltcRes.ltcBenefit + ltcRes.ltcPersonalPay, 2000, 0.01, 'Shihezi LTC conservation');

  // 2. Empirical proof: calculateReimbursement without customCityData fails because 660100 is not in allCities
  let threwMissingCityError = false;
  try {
    calculateReimbursement({
      cityCode: '660100',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 5000,
      hasLtc: true
    });
  } catch (err: any) {
    threwMissingCityError = err.message.includes('660100');
  }
  assertCondition(
    threwMissingCityError,
    'EMPIRICAL BUG CONFIRMATION: calculateReimbursement throws unhandled Error for 660100 when customCityData is omitted'
  );

  // 3. calculateReimbursement with customCityData from 660000 succeeds and satisfies conservation
  const xpccCity = getCityDataByCode('660000');
  assertCondition(xpccCity !== undefined, 'XPCC (660000) data must exist in allCities');

  const resWithCustom = calculateReimbursement(
    {
      cityCode: '660100',
      insuranceType: 'employee',
      treatmentType: 'inpatient',
      hospitalTier: 'tier2',
      remoteStatus: 'local',
      totalCost: 5000,
      hasLtc: true,
      ltcDisabilityGrade: 'severe2',
      ltcCareMode: 'institution',
      ltcCareCost: 2000
    },
    xpccCity
  );
  assertClose(
    resWithCustom.breakdown.totalReimbursed + resWithCustom.breakdown.personalPayTotal,
    5000,
    0.01,
    'Shihezi with XPCC customCityData must satisfy fund conservation'
  );

  // 4. Empirical proof: getLtcPolicy(660000) returns fallback DEFAULT_LTC_POLICY rather than Shihezi
  const ltc660000 = getLtcPolicy('660000');
  assertCondition(
    ltc660000.cityCode === 'default',
    'EMPIRICAL FINDING: getLtcPolicy("660000") falls back to default because 660000 is not aliased in LTC_POLICIES'
  );

  finishSuite();
}

// ============================================================================
// Master Challenger Runner
// ============================================================================
export function runChallengerR32MultiTierOracle(): ChallengerR32Stats {
  const overallStartTime = Date.now();
  console.log('################################################################################');
  console.log('### ACTUARIAL CHALLENGER R32: MULTI-TIER MEDICAL SECURITY INVARIANTS ORACLE ###');
  console.log('################################################################################');

  runBasicCatastrophicAssistanceSuite();
  runLtc15PilotCitiesSuite();
  runHuiminbao15ProductsSuite();
  runFullMultiTierCoordinatedConvergenceSuite();
  runAdversarialChaosSuite();
  runPreExistingConditionParitySuite();
  runContinuousEnrollmentIncentiveSuite();
  runBoundaryDiscontinuityPrecisionSuite();
  runHighCostSpecialtyDrugSuite();
  runAdminCodeAliasFaultIsolationSuite();

  const totalElapsed = Date.now() - overallStartTime;
  console.log('\n================================================================================');
  console.log('### CHALLENGER R32 ORACLE VERIFICATION SUMMARY ###');
  console.log(`Total Assertions Evaluated: ${stats.totalAssertions.toLocaleString()}`);
  console.log(`Passed Assertions:          ${stats.passedAssertions.toLocaleString()}`);
  console.log(`Failed Assertions:          ${stats.failedAssertions}`);
  console.log(`Pass Rate:                  ${((stats.passedAssertions / stats.totalAssertions) * 100).toFixed(4)}%`);
  console.log(`Total Elapsed Time:         ${(totalElapsed / 1000).toFixed(2)}s`);
  console.log('================================================================================\n');

  if (stats.failedAssertions > 0) {
    console.error(`CRITICAL: Detected ${stats.failedAssertions} adversarial verification failures!`);
    stats.failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  } else {
    console.log('VERDICT: ALL R32 MULTI-TIER ADVERSARIAL STRESS INVARIANTS 100.0000% SATISFIED AND CONFIRMED.');
  }

  return stats;
}

if (require.main === module) {
  const result = runChallengerR32MultiTierOracle();
  if (result.failedAssertions > 0) {
    process.exit(1);
  }
}
