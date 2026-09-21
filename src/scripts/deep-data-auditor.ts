import { allCities } from '../data';
import * as fs from 'fs';

console.log('--- Deep Data Quality & Logic Audit ---');

const issues: string[] = [];

for (const city of allCities) {
  const { cityCode, cityName, provinceName } = city;
  const prefix = `[${provinceName} - ${cityName} (${cityCode})]`;

  // 1. Text placeholders
  const jsonStr = JSON.stringify(city);
  if (/(?:TODO|待定|待核准|一览表|汇总|暂定|未定(?!级))/i.test(jsonStr)) {
    issues.push(`${prefix} Contains placeholder text`);
  }

  // 2. Dates
  if (!city.lastUpdated || !city.lastUpdated.startsWith('202')) {
    issues.push(`${prefix} Invalid lastUpdated: ${city.lastUpdated}`);
  }

  // 3. Source docs
  const docIds = new Set<string>();
  for (const d of city.sourceDocs || []) {
    if (docIds.has(d.docId)) {
      issues.push(`${prefix} Duplicate docId: ${d.docId}`);
    }
    docIds.add(d.docId);
    if (!d.docNumber || d.docNumber.length < 4) {
      issues.push(`${prefix} Suspicious docNumber: "${d.docNumber}" in doc ${d.docId}`);
    }
    if (!d.summaryQuote || d.summaryQuote.length < 20) {
      issues.push(`${prefix} Short summaryQuote: "${d.summaryQuote}" in doc ${d.docId}`);
    }
    if (!d.officialUrl || !d.officialUrl.startsWith('http')) {
      issues.push(`${prefix} Invalid URL: "${d.officialUrl}" in doc ${d.docId}`);
    }
  }

  // 4. Inpatient monotonic check (Employee)
  const ei = city.employee?.inpatient?.tierBenefits;
  if (ei) {
    const d1 = ei.tier1?.deductible ?? 0;
    const d2 = ei.tier2?.deductible ?? 0;
    const d3 = ei.tier3?.deductible ?? 0;
    const dtop = ei.tier3_top?.deductible ?? d3;
    if (d1 > d2 || d2 > d3 || d3 > dtop) {
      issues.push(`${prefix} Employee inpatient deductible inverted: 1=${d1}, 2=${d2}, 3=${d3}, top=${dtop}`);
    }
    const r1 = ei.tier1?.reimbursementRatio ?? 0;
    const r2 = ei.tier2?.reimbursementRatio ?? 0;
    const r3 = ei.tier3?.reimbursementRatio ?? 0;
    const rtop = ei.tier3_top?.reimbursementRatio ?? r3;
    if (r1 < r2 || r2 < r3 || r3 < rtop) {
      issues.push(`${prefix} Employee inpatient ratio inverted: 1=${r1}, 2=${r2}, 3=${r3}, top=${rtop}`);
    }
  }

  // 5. Inpatient monotonic check (Resident)
  const ri = city.resident?.inpatient?.tierBenefits;
  if (ri) {
    const d1 = ri.tier1?.deductible ?? 0;
    const d2 = ri.tier2?.deductible ?? 0;
    const d3 = ri.tier3?.deductible ?? 0;
    const dtop = ri.tier3_top?.deductible ?? d3;
    if (d1 > d2 || d2 > d3 || d3 > dtop) {
      issues.push(`${prefix} Resident inpatient deductible inverted: 1=${d1}, 2=${d2}, 3=${d3}, top=${dtop}`);
    }
    const r1 = ri.tier1?.reimbursementRatio ?? 0;
    const r2 = ri.tier2?.reimbursementRatio ?? 0;
    const r3 = ri.tier3?.reimbursementRatio ?? 0;
    const rtop = ri.tier3_top?.reimbursementRatio ?? r3;
    if (r1 < r2 || r2 < r3 || r3 < rtop) {
      issues.push(`${prefix} Resident inpatient ratio inverted: 1=${r1}, 2=${r2}, 3=${r3}, top=${rtop}`);
    }
  }

  // 6. Outpatient caps
  const eo = city.employee?.outpatient;
  if (eo && eo.annualCap && eo.annualCapRetiree && eo.annualCapRetiree < eo.annualCap) {
    issues.push(`${prefix} Employee outpatient retiree cap < active cap: ${eo.annualCapRetiree} < ${eo.annualCap}`);
  }

  // 7. Catastrophic tiers
  const cat = city.resident?.catastrophic;
  if (cat && cat.tiers) {
    for (let i = 0; i < cat.tiers.length - 1; i++) {
      if (cat.tiers[i].ratio > cat.tiers[i+1].ratio) {
        issues.push(`${prefix} Catastrophic tiers ratio inverted: tier ${i} (${cat.tiers[i].ratio}) > tier ${i+1} (${cat.tiers[i+1].ratio})`);
      }
    }
  }
}

console.log(`Total deep logic issues found: ${issues.length}`);
for (const iss of issues) {
  console.log(iss);
}
