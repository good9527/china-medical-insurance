import * as fs from 'fs';
import * as path from 'path';
import { allCities } from '../data';
import type { CityInsuranceData } from '../data/types';

interface AuditResult {
  remoteMedicalInversions: any[];
  deductibleInversions: any[];
  ratioInversions: any[];
  outpatientAnomalies: any[];
  catastrophicAnomalies: any[];
  sourceDocIssues: any[];
  danglingDocReferences: any[];
  unreferencedDocs: any[];
  freshnessBreakdown: Record<string, { count: number; cities: string[] }>;
  emojiFindings: any[];
  policy2025_2026Features: {
    outpatientAdjustments: any[];
    catastrophicAdjustments: any[];
    residentLongTermIncentiveNotes: any[];
  };
}

const result: AuditResult = {
  remoteMedicalInversions: [],
  deductibleInversions: [],
  ratioInversions: [],
  outpatientAnomalies: [],
  catastrophicAnomalies: [],
  sourceDocIssues: [],
  danglingDocReferences: [],
  unreferencedDocs: [],
  freshnessBreakdown: {
    '2026': { count: 0, cities: [] },
    '2025': { count: 0, cities: [] },
    '2024': { count: 0, cities: [] },
    'pre-2024': { count: 0, cities: [] }
  },
  emojiFindings: [],
  policy2025_2026Features: {
    outpatientAdjustments: [],
    catastrophicAdjustments: [],
    residentLongTermIncentiveNotes: []
  }
};

// 1. Scan 348 Cities Data
for (const city of allCities) {
  const { cityCode, cityName, provinceName } = city;

  // --- A. RemoteMedical Monotonicity & Inversions ---
  for (const kind of ['employee', 'resident'] as const) {
    const pkg = city[kind];
    if (!pkg) continue;
    const rm = pkg.remoteMedical;
    if (rm) {
      const {
        longTermFiledRatio = 1.0,
        transferFiledRatio = 1.0,
        unfiledEmergencyRatio = 1.0,
        unfiledNormalRatio = 1.0
      } = rm;

      if (transferFiledRatio > longTermFiledRatio + 0.0001) {
        result.remoteMedicalInversions.push({
          cityCode, cityName, provinceName, kind,
          type: 'TRANSFER_GT_LONGTERM',
          detail: `transferFiledRatio (${transferFiledRatio}) > longTermFiledRatio (${longTermFiledRatio})`
        });
      }
      if (unfiledEmergencyRatio > transferFiledRatio + 0.0001) {
        result.remoteMedicalInversions.push({
          cityCode, cityName, provinceName, kind,
          type: 'UNFILED_EMERGENCY_GT_TRANSFER',
          detail: `unfiledEmergencyRatio (${unfiledEmergencyRatio}) > transferFiledRatio (${transferFiledRatio})`
        });
      }
      if (unfiledNormalRatio > unfiledEmergencyRatio + 0.0001) {
        result.remoteMedicalInversions.push({
          cityCode, cityName, provinceName, kind,
          type: 'UNFILED_NORMAL_GT_EMERGENCY',
          detail: `unfiledNormalRatio (${unfiledNormalRatio}) > unfiledEmergencyRatio (${unfiledEmergencyRatio})`
        });
      }
      if (unfiledNormalRatio > transferFiledRatio + 0.0001) {
        result.remoteMedicalInversions.push({
          cityCode, cityName, provinceName, kind,
          type: 'UNFILED_NORMAL_GT_TRANSFER',
          detail: `unfiledNormalRatio (${unfiledNormalRatio}) > transferFiledRatio (${transferFiledRatio})`
        });
      }
    }
  }

  // --- B. Hospital Tier Deductible & Ratio Monotonicity ---
  for (const kind of ['employee', 'resident'] as const) {
    const pkg = city[kind];
    if (!pkg?.inpatient?.tierBenefits) continue;
    const tb = pkg.inpatient.tierBenefits;

    const d_comm = tb.community?.deductible ?? 0;
    const d_1 = tb.tier1?.deductible ?? d_comm;
    const d_2 = tb.tier2?.deductible ?? 0;
    const d_3 = tb.tier3?.deductible ?? 0;
    const d_top = tb.tier3_top?.deductible ?? d_3;

    if (d_comm > d_1 || d_1 > d_2 || d_2 > d_3 || d_3 > d_top) {
      result.deductibleInversions.push({
        cityCode, cityName, provinceName, kind,
        deductibles: { d_comm, d_1, d_2, d_3, d_top },
        detail: `Deductibles not monotonic: comm=${d_comm}, tier1=${d_1}, tier2=${d_2}, tier3=${d_3}, tier3_top=${d_top}`
      });
    }

    const r_comm = tb.community?.reimbursementRatio ?? 0;
    const r_1 = tb.tier1?.reimbursementRatio ?? r_comm;
    const r_2 = tb.tier2?.reimbursementRatio ?? 0;
    const r_3 = tb.tier3?.reimbursementRatio ?? 0;
    const r_top = tb.tier3_top?.reimbursementRatio ?? r_3;

    if ((r_comm < r_1 && r_comm > 0) || (r_1 < r_2 && r_2 > 0) || (r_2 < r_3 && r_3 > 0) || (r_3 < r_top && r_top > 0)) {
      result.ratioInversions.push({
        cityCode, cityName, provinceName, kind,
        ratios: { r_comm, r_1, r_2, r_3, r_top },
        detail: `Ratios not monotonic: comm=${r_comm}, tier1=${r_1}, tier2=${r_2}, tier3=${r_3}, tier3_top=${r_top}`
      });
    }
  }

  // --- C. Outpatient Anomalies ---
  for (const kind of ['employee', 'resident'] as const) {
    const pkg = city[kind];
    if (!pkg?.outpatient) continue;
    const op = pkg.outpatient;
    const cap = op.annualCap ?? 0;
    const ded = op.annualDeductible ?? 0;

    if (cap > 0 && cap < 999999 && ded > 0 && cap <= ded) {
      result.outpatientAnomalies.push({
        cityCode, cityName, provinceName, kind,
        type: 'CAP_LE_DEDUCTIBLE',
        detail: `annualCap (${cap}) <= annualDeductible (${ded})`
      });
    }

    if (kind === 'employee' && op.annualCapRetiree && cap > 0 && op.annualCapRetiree < cap) {
      result.outpatientAnomalies.push({
        cityCode, cityName, provinceName, kind,
        type: 'RETIREE_CAP_LT_INSERVICE',
        detail: `annualCapRetiree (${op.annualCapRetiree}) < annualCap (${cap})`
      });
    }
  }

  // --- D. Catastrophic Anomalies ---
  for (const kind of ['employee', 'resident'] as const) {
    const pkg = city[kind];
    if (!pkg?.catastrophic) continue;
    const cat = pkg.catastrophic;
    if (cat.deductible < 0) {
      result.catastrophicAnomalies.push({
        cityCode, cityName, provinceName, kind,
        type: 'NEGATIVE_DEDUCTIBLE',
        detail: `deductible (${cat.deductible}) < 0`
      });
    }
    const tiers = cat.tiers || [];
    for (let i = 0; i < tiers.length - 1; i++) {
      if (tiers[i].ratio > tiers[i+1].ratio) {
        result.catastrophicAnomalies.push({
          cityCode, cityName, provinceName, kind,
          type: 'RATIO_INVERSION',
          detail: `tier ${i} ratio (${tiers[i].ratio}) > tier ${i+1} ratio (${tiers[i+1].ratio})`
        });
      }
    }
  }

  // --- E. Document Citations & Foreign Key References ---
  const validDocIds = new Set<string>();
  const referencedDocIds = new Set<string>();

  for (const doc of (city.sourceDocs || [])) {
    validDocIds.add(doc.docId);

    const docNum = doc.docNumber || '';
    if (!docNum || docNum.trim() === '') {
      result.sourceDocIssues.push({
        cityCode, cityName, provinceName, docId: doc.docId,
        type: 'EMPTY_DOC_NUMBER',
        detail: `文件 [${doc.title}] 缺少文号`
      });
    }
    if (docNum.includes('一览表') || docNum.includes('参考') || docNum.includes('待核准') || docNum.includes('等现行')) {
      result.sourceDocIssues.push({
        cityCode, cityName, provinceName, docId: doc.docId,
        type: 'INFORMAL_DOC_NUMBER',
        detail: `文号 "${docNum}" 含有非正式标记`
      });
    }
    if (!docNum.includes('〔') && !docNum.includes('(') && !docNum.includes('【') && !docNum.includes('号') && !docNum.includes('第') && !docNum.includes('令')) {
      result.sourceDocIssues.push({
        cityCode, cityName, provinceName, docId: doc.docId,
        type: 'UNCONVENTIONAL_DOC_NUMBER',
        detail: `文号 "${docNum}" 缺少正式发文字样或括号`
      });
    }
    if (!doc.officialUrl || !doc.officialUrl.startsWith('http')) {
      result.sourceDocIssues.push({
        cityCode, cityName, provinceName, docId: doc.docId,
        type: 'INVALID_URL',
        detail: `文件 [${doc.title}] officialUrl 缺失或不以 http 开头: "${doc.officialUrl}"`
      });
    }
    const depts = (doc as any).issuingDept;
    if (!depts || (Array.isArray(depts) && depts.length === 0) || (typeof depts === 'string' && depts.trim() === '')) {
      result.sourceDocIssues.push({
        cityCode, cityName, provinceName, docId: doc.docId,
        type: 'MISSING_ISSUING_DEPT',
        detail: `文件 [${doc.title}] 缺少发文部门 (issuingDept)`
      });
    }
    if (!doc.summaryQuote || doc.summaryQuote.trim().length < 10) {
      result.sourceDocIssues.push({
        cityCode, cityName, provinceName, docId: doc.docId,
        type: 'INSUFFICIENT_QUOTE',
        detail: `文件 [${doc.title}] 摘要摘录过短 (${doc.summaryQuote?.length || 0} 字)`
      });
    }
  }

  // Check foreign key references
  const checkFk = (docId: string | undefined, benefitType: string) => {
    if (docId) {
      referencedDocIds.add(docId);
      if (!validDocIds.has(docId)) {
        result.danglingDocReferences.push({
          cityCode, cityName, provinceName, benefitType, docId,
          detail: `险种 [${benefitType}] 引用了不存在的 docId: "${docId}"`
        });
      }
    }
  };

  if (city.employee) {
    checkFk(city.employee.outpatient?.sourceDocId, 'employee.outpatient');
    checkFk(city.employee.inpatient?.sourceDocId, 'employee.inpatient');
    checkFk(city.employee.catastrophic?.sourceDocId, 'employee.catastrophic');
    checkFk(city.employee.remoteMedical?.sourceDocId, 'employee.remoteMedical');
  }
  if (city.resident) {
    checkFk(city.resident.outpatient?.sourceDocId, 'resident.outpatient');
    checkFk(city.resident.inpatient?.sourceDocId, 'resident.inpatient');
    checkFk(city.resident.catastrophic?.sourceDocId, 'resident.catastrophic');
    checkFk(city.resident.remoteMedical?.sourceDocId, 'resident.remoteMedical');
  }

  for (const doc of (city.sourceDocs || [])) {
    if (!referencedDocIds.has(doc.docId)) {
      result.unreferencedDocs.push({
        cityCode, cityName, provinceName, docId: doc.docId, title: doc.title
      });
    }
  }

  // --- F. Policy Timeliness & Freshness ---
  let maxYear = 2000;
  for (const doc of (city.sourceDocs || [])) {
    const pYear = parseInt((doc.publishDate || '').slice(0, 4), 10) || 0;
    const eYear = parseInt((doc.effectiveDate || '').slice(0, 4), 10) || 0;
    const year = Math.max(pYear, eYear);
    if (year > maxYear) maxYear = year;

    // Check quotes or titles for 2025/2026 keywords
    const text = (doc.title + ' ' + (doc.summaryQuote || '') + ' ' + (doc.notes || ''));
    if (text.includes('门诊共济') || text.includes('限额') || text.includes('门诊统筹')) {
      if (year >= 2025 || text.includes('2025') || text.includes('2026')) {
        result.policy2025_2026Features.outpatientAdjustments.push({
          cityCode, cityName, provinceName, docNumber: doc.docNumber, title: doc.title, year
        });
      }
    }
    if (text.includes('大病') && (text.includes('起付线') || text.includes('动态调整') || text.includes('居民人均可支配收入'))) {
      result.policy2025_2026Features.catastrophicAdjustments.push({
        cityCode, cityName, provinceName, docNumber: doc.docNumber, title: doc.title, year
      });
    }
    if (text.includes('长效激励') || text.includes('连续参保') || text.includes('零报销') || text.includes('38号')) {
      result.policy2025_2026Features.residentLongTermIncentiveNotes.push({
        cityCode, cityName, provinceName, docNumber: doc.docNumber, title: doc.title, year
      });
    }
  }

  if (maxYear >= 2026) {
    result.freshnessBreakdown['2026'].count++;
    result.freshnessBreakdown['2026'].cities.push(cityName);
  } else if (maxYear === 2025) {
    result.freshnessBreakdown['2025'].count++;
    result.freshnessBreakdown['2025'].cities.push(cityName);
  } else if (maxYear === 2024) {
    result.freshnessBreakdown['2024'].count++;
    result.freshnessBreakdown['2024'].cities.push(cityName);
  } else {
    result.freshnessBreakdown['pre-2024'].count++;
    result.freshnessBreakdown['pre-2024'].cities.push(cityName);
  }
}

// 2. Scan All Data Files for Emoji (0-Emoji Compliance)
const dataDir = path.resolve(process.cwd(), 'src/data');
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1FA00}-\u{1FAFF}]/u;

function scanDirForEmoji(dir: string, targetArray: any[]) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      scanDirForEmoji(fullPath, targetArray);
    } else if (f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.json') || f.name.endsWith('.vue'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (emojiRegex.test(line)) {
          targetArray.push({
            file: path.relative(process.cwd(), fullPath),
            line: idx + 1,
            snippet: line.trim()
          });
        }
      });
    }
  }
}

const dataEmojiFindings: any[] = [];
scanDirForEmoji(dataDir, dataEmojiFindings);
result.emojiFindings = dataEmojiFindings;

console.log('=== AUDIT SUMMARY ===');
console.log('1. Remote Medical Inversions:', result.remoteMedicalInversions.length);
if (result.remoteMedicalInversions.length > 0) {
  console.log(JSON.stringify(result.remoteMedicalInversions, null, 2));
}

console.log('\n2. Deductible Inversions:', result.deductibleInversions.length);
if (result.deductibleInversions.length > 0) {
  console.log(JSON.stringify(result.deductibleInversions, null, 2));
}

console.log('\n3. Ratio Inversions:', result.ratioInversions.length);
if (result.ratioInversions.length > 0) {
  console.log(JSON.stringify(result.ratioInversions, null, 2));
}

console.log('\n4. Outpatient Anomalies:', result.outpatientAnomalies.length);
if (result.outpatientAnomalies.length > 0) {
  console.log(JSON.stringify(result.outpatientAnomalies, null, 2));
}

console.log('\n5. Catastrophic Anomalies:', result.catastrophicAnomalies.length);

console.log('\n6. Source Doc Issues (format, url, etc.):', result.sourceDocIssues.length);
if (result.sourceDocIssues.length > 0) {
  console.log(JSON.stringify(result.sourceDocIssues, null, 2));
}

console.log('\n7. Dangling Doc References (docId not in sourceDocs):', result.danglingDocReferences.length);
if (result.danglingDocReferences.length > 0) {
  console.log(JSON.stringify(result.danglingDocReferences, null, 2));
}

console.log('\n8. Unreferenced Docs (sourceDoc not referenced by any benefit tier):', result.unreferencedDocs.length);

console.log('\n9. Freshness Breakdown:');
for (const [yr, data] of Object.entries(result.freshnessBreakdown)) {
  console.log(`  ${yr}: ${data.count} cities`);
}

console.log('\n10. 0-Emoji Audit:');
console.log('  Emoji findings count in src/data & src/engine:', result.emojiFindings.length);
if (result.emojiFindings.length > 0) {
  console.log(JSON.stringify(result.emojiFindings.slice(0, 20), null, 2));
}

// Analysis of URL domains and Unreferenced Docs
const urlDomainStats: Record<string, number> = {};
const nonGovUrls: any[] = [];

for (const city of allCities) {
  for (const doc of (city.sourceDocs || [])) {
    try {
      const u = new URL(doc.officialUrl);
      const host = u.hostname;
      const topDomain = host.split('.').slice(-2).join('.');
      urlDomainStats[topDomain] = (urlDomainStats[topDomain] || 0) + 1;
      if (!host.endsWith('.gov.cn') && !host.endsWith('.gov.cn/') && !host.includes('12393')) {
        nonGovUrls.push({
          cityCode: city.cityCode,
          cityName: city.cityName,
          docId: doc.docId,
          url: doc.officialUrl,
          host
        });
      }
    } catch (e) {
      nonGovUrls.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        docId: doc.docId,
        url: doc.officialUrl,
        error: 'Invalid URL format'
      });
    }
  }
}

console.log('\n=== URL DOMAIN ANALYSIS ===');
console.log('Top Domains:', urlDomainStats);
console.log('Non-gov.cn URLs count:', nonGovUrls.length);
if (nonGovUrls.length > 0) {
  console.log('Sample non-gov URLs:', JSON.stringify(nonGovUrls.slice(0, 10), null, 2));
}

console.log('\n=== UNREFERENCED DOCS SAMPLE ===');
console.log('Count:', result.unreferencedDocs.length);
console.log('Sample:', JSON.stringify(result.unreferencedDocs.slice(0, 5), null, 2));

// Analysis of 2025-2026 Policy features
console.log('\n=== 2025-2026 POLICY SAMPLES ===');
console.log('Outpatient 2025-2026 adjustments count:', result.policy2025_2026Features.outpatientAdjustments.length);
console.log('Sample Outpatient 2025-2026:', JSON.stringify(result.policy2025_2026Features.outpatientAdjustments.slice(0, 5), null, 2));

console.log('Catastrophic dynamic adjustments count:', result.policy2025_2026Features.catastrophicAdjustments.length);
console.log('Sample Catastrophic dynamic adjustments:', JSON.stringify(result.policy2025_2026Features.catastrophicAdjustments.slice(0, 5), null, 2));

// Deep Analysis of Outpatient Caps and Catastrophic Deductibles
const empOutpatientCaps: { city: string; cap: number; retireeCap?: number }[] = [];
let unlimitedCapCount = 0;
let capUnder2000 = 0;
let cap2000to3000 = 0;
let cap3000to5000 = 0;
let capAbove5000 = 0;

for (const city of allCities) {
  const eo = city.employee?.outpatient;
  if (eo) {
    const cap = eo.annualCap;
    empOutpatientCaps.push({ city: city.cityName, cap, retireeCap: eo.annualCapRetiree });
    if (cap >= 999999) unlimitedCapCount++;
    else if (cap < 2000) capUnder2000++;
    else if (cap <= 3000) cap2000to3000++;
    else if (cap <= 5000) cap3000to5000++;
    else capAbove5000++;
  }
}

console.log('\n=== EMPLOYEE OUTPATIENT ANNUAL CAP DISTRIBUTION ===');
console.log(`Total: ${empOutpatientCaps.length}`);
console.log(`Unlimited (>=999999): ${unlimitedCapCount}`);
console.log(`Cap < 2000: ${capUnder2000}`);
console.log(`Cap 2000 - 3000: ${cap2000to3000}`);
console.log(`Cap 3001 - 5000: ${cap3000to5000}`);
console.log(`Cap > 5000: ${capAbove5000}`);

const resCatastrophicDeductibles: { city: string; ded: number; cap?: number }[] = [];
const dedRanges: Record<string, number> = {
  '< 10000': 0,
  '10000 - 14000': 0,
  '14001 - 18000': 0,
  '18001 - 25000': 0,
  '> 25000': 0
};

for (const city of allCities) {
  const rc = city.resident?.catastrophic;
  if (rc) {
    const d = rc.deductible;
    resCatastrophicDeductibles.push({ city: city.cityName, ded: d, cap: rc.annualCap });
    if (d < 10000) dedRanges['< 10000']++;
    else if (d <= 14000) dedRanges['10000 - 14000']++;
    else if (d <= 18000) dedRanges['14001 - 18000']++;
    else if (d <= 25000) dedRanges['18001 - 25000']++;
    else dedRanges['> 25000']++;
  }
}

console.log('\n=== RESIDENT CATASTROPHIC DEDUCTIBLE DISTRIBUTION ===');
console.log(dedRanges);

// Check mentions of 38号文 and long term incentives in sourceDocs or specialNotes
const incentiveCities: { city: string; docNumber: string; title: string; quote: string }[] = [];
for (const city of allCities) {
  for (const doc of (city.sourceDocs || [])) {
    const t = (doc.title + ' ' + (doc.summaryQuote || '') + ' ' + (doc.notes || '') + ' ' + doc.docNumber);
    if (t.includes('38号') || t.includes('长效机制') || t.includes('长效激励') || t.includes('连续参保') || t.includes('零报销')) {
      incentiveCities.push({
        city: city.cityName,
        docNumber: doc.docNumber,
        title: doc.title,
        quote: (doc.summaryQuote || '').slice(0, 100)
      });
    }
  }
}

console.log(`\n=== LONG TERM INCENTIVE (38号文/参保激励) IDENTIFIED: ${incentiveCities.length} references ===`);
incentiveCities.forEach((c, idx) => {
  console.log(`[${idx+1}] ${c.city} | ${c.docNumber} | ${c.title}`);
});


