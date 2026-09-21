import { allCities } from '../data';
import * as fs from 'fs';
import * as path from 'path';

export interface DiscrepancyItem {
  cityCode: string;
  cityName: string;
  provinceName: string;
  sourceType: 'QUOTE' | 'NOTE';
  targetField: string;
  expectedValue: any;
  actualValue: any;
  contextText: string;
}

const items: DiscrepancyItem[] = [];

for (const city of allCities) {
  const { cityCode, cityName, provinceName } = city;

  // Combine quotes
  const quotes = (city.sourceDocs || []).map(d => d.summaryQuote || '').join('\n');

  // --- 1. Employee Inpatient ---
  // A. Deductibles: 职工住院起付[线标准]*[：:\s]*一级\s*(\d+)\s*元[、,，\s]*二级\s*(\d+)\s*元[、,，\s]*三级\s*(\d+)\s*元
  const mEmpInpDed = quotes.match(/职工住院.*?起付[线标准]*[：:\s]*一级\s*(\d+)\s*元[、,，\s]*二级\s*(\d+)\s*元[、,，\s]*三级\s*(\d+)\s*元/);
  if (mEmpInpDed) {
    const d1 = parseInt(mEmpInpDed[1], 10);
    const d2 = parseInt(mEmpInpDed[2], 10);
    const d3 = parseInt(mEmpInpDed[3], 10);
    const tb = city.employee?.inpatient?.tierBenefits;
    if (tb) {
      if (tb.tier1 && tb.tier1.deductible !== d1) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.inpatient.tier1.deductible', expectedValue: d1, actualValue: tb.tier1.deductible, contextText: mEmpInpDed[0] });
      }
      if (tb.tier2 && tb.tier2.deductible !== d2) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.inpatient.tier2.deductible', expectedValue: d2, actualValue: tb.tier2.deductible, contextText: mEmpInpDed[0] });
      }
      if (tb.tier3 && tb.tier3.deductible !== d3) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.inpatient.tier3.deductible', expectedValue: d3, actualValue: tb.tier3.deductible, contextText: mEmpInpDed[0] });
      }
    }
  }

  // B. Ratios: 职工住院.*?在职.*?支付比例.*?一级\s*(\d+)%[、,，\s]*二级\s*(\d+)%[、,，\s]*三级\s*(\d+)%
  const mEmpInpRatio = quotes.match(/职工住院.*?(?:在职|统筹基金)?(?:支付|报销)比例[：:\s]*一级\s*(\d+)%[、,，\s]*二级\s*(\d+)%[、,，\s]*三级\s*(\d+)%/);
  if (mEmpInpRatio && !mEmpInpRatio[0].includes('居民') && !mEmpInpRatio[0].includes('门诊')) {
    const r1 = parseInt(mEmpInpRatio[1], 10) / 100;
    const r2 = parseInt(mEmpInpRatio[2], 10) / 100;
    const r3 = parseInt(mEmpInpRatio[3], 10) / 100;
    const tb = city.employee?.inpatient?.tierBenefits;
    if (tb) {
      if (tb.tier1 && Math.abs(tb.tier1.reimbursementRatio - r1) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.inpatient.tier1.reimbursementRatio', expectedValue: r1, actualValue: tb.tier1.reimbursementRatio, contextText: mEmpInpRatio[0] });
      }
      if (tb.tier2 && Math.abs(tb.tier2.reimbursementRatio - r2) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.inpatient.tier2.reimbursementRatio', expectedValue: r2, actualValue: tb.tier2.reimbursementRatio, contextText: mEmpInpRatio[0] });
      }
      if (tb.tier3 && Math.abs(tb.tier3.reimbursementRatio - r3) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.inpatient.tier3.reimbursementRatio', expectedValue: r3, actualValue: tb.tier3.reimbursementRatio, contextText: mEmpInpRatio[0] });
      }
    }
  }

  // --- 2. Employee Outpatient ---
  // A. Cap: 在职职工.*?(\d+)元.*?退休.*?(\d+)元
  const mEmpOpCap = quotes.match(/(?:年度统筹|年度|普通门诊).*?(?:最高支付限额|限额|封顶).*?在职(?:职工)?\s*(\d+)\s*元[、,，\s]*退休(?:人员)?\s*(\d+)\s*元/) ||
                    quotes.match(/在职(?:职工)?\s*(\d+)\s*元[、,，\s]*退休(?:人员)?\s*(\d+)\s*元/);
  if (mEmpOpCap && quotes.includes('门诊')) {
    // Only check if it clearly refers to 门诊限额
    const capMatch = quotes.match(/门诊.*?(?:限额|封顶|最高支付限额).*?在职(?:职工)?\s*(\d+)\s*元[、,，\s]*退休(?:人员)?\s*(\d+)\s*元/);
    if (capMatch) {
      const cap = parseInt(capMatch[1], 10);
      const capRet = parseInt(capMatch[2], 10);
      const eo = city.employee?.outpatient;
      if (eo) {
        if (eo.annualCap && eo.annualCap !== cap) {
          items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.outpatient.annualCap', expectedValue: cap, actualValue: eo.annualCap, contextText: capMatch[0] });
        }
        if (eo.annualCapRetiree && eo.annualCapRetiree !== capRet) {
          items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'employee.outpatient.annualCapRetiree', expectedValue: capRet, actualValue: eo.annualCapRetiree, contextText: capMatch[0] });
        }
      }
    }
  }

  // B. Employee Outpatient Ratios from note or quote
  // Pattern: 基层(\d+)%.*?二级(\d+)%.*?三级(\d+)%
  const eoNote = city.employee?.outpatient?.note || '';
  const mOpNoteRatio = eoNote.match(/基层(?:报销)?\s*(\d+)%.*?二级(?:报销)?\s*(\d+)%.*?三级(?:报销)?\s*(\d+)%/);
  if (mOpNoteRatio) {
    const rComm = parseInt(mOpNoteRatio[1], 10) / 100;
    const r2 = parseInt(mOpNoteRatio[2], 10) / 100;
    const r3 = parseInt(mOpNoteRatio[3], 10) / 100;
    const tb = city.employee?.outpatient?.tierBenefits;
    if (tb) {
      if (tb.community && Math.abs(tb.community.reimbursementRatio - rComm) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'NOTE', targetField: 'employee.outpatient.community.reimbursementRatio', expectedValue: rComm, actualValue: tb.community.reimbursementRatio, contextText: mOpNoteRatio[0] });
      }
      if (tb.tier2 && Math.abs(tb.tier2.reimbursementRatio - r2) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'NOTE', targetField: 'employee.outpatient.tier2.reimbursementRatio', expectedValue: r2, actualValue: tb.tier2.reimbursementRatio, contextText: mOpNoteRatio[0] });
      }
      if (tb.tier3 && Math.abs(tb.tier3.reimbursementRatio - r3) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'NOTE', targetField: 'employee.outpatient.tier3.reimbursementRatio', expectedValue: r3, actualValue: tb.tier3.reimbursementRatio, contextText: mOpNoteRatio[0] });
      }
    }
  }

  // --- 3. Catastrophic Deductible ---
  const mCatDed = quotes.match(/大病保险起付[线标准]*[：:\s]*(\d+)\s*元/);
  if (mCatDed) {
    const catDed = parseInt(mCatDed[1], 10);
    const actualDed = city.resident?.catastrophic?.deductible;
    if (actualDed !== undefined && actualDed !== catDed) {
      items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.catastrophic.deductible', expectedValue: catDed, actualValue: actualDed, contextText: mCatDed[0] });
    }
  }

  // --- 4. Resident Inpatient Deductibles ---
  const mResInpDed = quotes.match(/居民住院起付[线标准]*[：:\s]*一级\s*(\d+)\s*元[、,，\s]*二级\s*(\d+)\s*元[、,，\s]*三级\s*(\d+)\s*元/);
  if (mResInpDed) {
    const d1 = parseInt(mResInpDed[1], 10);
    const d2 = parseInt(mResInpDed[2], 10);
    const d3 = parseInt(mResInpDed[3], 10);
    const tb = city.resident?.inpatient?.tierBenefits;
    if (tb) {
      if (tb.tier1 && tb.tier1.deductible !== d1) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.inpatient.tier1.deductible', expectedValue: d1, actualValue: tb.tier1.deductible, contextText: mResInpDed[0] });
      }
      if (tb.tier2 && tb.tier2.deductible !== d2) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.inpatient.tier2.deductible', expectedValue: d2, actualValue: tb.tier2.deductible, contextText: mResInpDed[0] });
      }
      if (tb.tier3 && tb.tier3.deductible !== d3) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.inpatient.tier3.deductible', expectedValue: d3, actualValue: tb.tier3.deductible, contextText: mResInpDed[0] });
      }
    }
  }

  // --- 5. Resident Inpatient Ratios ---
  const mResInpRatio = quotes.match(/居民.*?(?:支付|报销)比例[：:\s]*一级\s*(\d+)%[、,，\s]*二级\s*(\d+)%[、,，\s]*三级\s*(\d+)%/);
  if (mResInpRatio) {
    const r1 = parseInt(mResInpRatio[1], 10) / 100;
    const r2 = parseInt(mResInpRatio[2], 10) / 100;
    const r3 = parseInt(mResInpRatio[3], 10) / 100;
    const tb = city.resident?.inpatient?.tierBenefits;
    if (tb) {
      if (tb.tier1 && Math.abs(tb.tier1.reimbursementRatio - r1) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.inpatient.tier1.reimbursementRatio', expectedValue: r1, actualValue: tb.tier1.reimbursementRatio, contextText: mResInpRatio[0] });
      }
      if (tb.tier2 && Math.abs(tb.tier2.reimbursementRatio - r2) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.inpatient.tier2.reimbursementRatio', expectedValue: r2, actualValue: tb.tier2.reimbursementRatio, contextText: mResInpRatio[0] });
      }
      if (tb.tier3 && Math.abs(tb.tier3.reimbursementRatio - r3) > 0.001) {
        items.push({ cityCode, cityName, provinceName, sourceType: 'QUOTE', targetField: 'resident.inpatient.tier3.reimbursementRatio', expectedValue: r3, actualValue: tb.tier3.reimbursementRatio, contextText: mResInpRatio[0] });
      }
    }
  }
}

console.log(`\n======================================================`);
console.log(`🎯 全面公文条款、备注与代码配置核验报告`);
console.log(`总计比对统筹区: ${allCities.length} 个`);
console.log(`检出不一致项: ${items.length} 项`);
console.log(`======================================================\n`);

const outJson = path.resolve(process.cwd(), 'docs/comprehensive-checker-findings.json');
fs.writeFileSync(outJson, JSON.stringify(items, null, 2), 'utf-8');
console.log(`已写入: ${outJson}\n`);

for (const it of items) {
  console.log(`- [${it.provinceName} - ${it.cityName} (${it.cityCode})] [${it.sourceType}] ${it.targetField}`);
  console.log(`  公文/备注预期: ${it.expectedValue} vs 当前配置: ${it.actualValue}`);
  console.log(`  来源依据文本: "${it.contextText}"\n`);
}
