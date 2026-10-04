import { allCities } from '../data';

interface Mismatch {
  cityCode: string;
  cityName: string;
  provinceName: string;
  category: string;
  docTitle: string;
  quoteSnippet: string;
  quoteValue: string;
  codeValue: string;
}

const mismatches: Mismatch[] = [];

for (const city of allCities) {
  const { cityName, provinceName, cityCode, sourceDocs = [] } = city;

  for (const doc of sourceDocs) {
    const q = doc.summaryQuote || '';
    if (!q) continue;

    // 1. Check Resident Inpatient Deductible
    // Pattern: 居民.*?(?:起付标准|起付线).*?(?:基层|一级|二级|三级)
    const resInQuotes = q.match(/(?:居民|城乡居民).*?(?:住院|统筹).*?(?:起付标准|起付线)[：:为]?([^。；\n]+)/);
    if (resInQuotes) {
      const text = resInQuotes[1];
      const m3 = text.match(/三级(?:医疗机构|医院)?(?:为)?(\d+)元/);
      const m2 = text.match(/二级(?:医疗机构|医院)?(?:为)?(\d+)元/);
      const m1 = text.match(/一级(?:医疗机构|医院)?(?:为)?(\d+)元/);
      const mComm = text.match(/(?:基层|社区|乡镇)(?:医疗机构|医院|卫生院)?(?:为)?(\d+)元/);

      const tb = city.resident?.inpatient?.tierBenefits;
      if (tb) {
        if (m3 && tb.tier3?.deductible !== parseInt(m3[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '居民住院-三级起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: m3[1] + '元',
            codeValue: tb.tier3?.deductible + '元'
          });
        }
        if (m2 && tb.tier2?.deductible !== parseInt(m2[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '居民住院-二级起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: m2[1] + '元',
            codeValue: tb.tier2?.deductible + '元'
          });
        }
        if (m1 && tb.tier1?.deductible !== parseInt(m1[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '居民住院-一级起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: m1[1] + '元',
            codeValue: tb.tier1?.deductible + '元'
          });
        }
        if (mComm && tb.community?.deductible !== parseInt(mComm[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '居民住院-基层起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: mComm[1] + '元',
            codeValue: tb.community?.deductible + '元'
          });
        }
      }
    }

    // 2. Check Employee Inpatient Deductible
    const empInQuotes = q.match(/(?:职工|城镇职工).*?(?:住院|统筹).*?(?:起付标准|起付线)[：:为]?([^。；\n]+)/);
    if (empInQuotes) {
      const text = empInQuotes[1];
      const m3 = text.match(/三级(?:医疗机构|医院)?(?:为)?(\d+)元/);
      const m2 = text.match(/二级(?:医疗机构|医院)?(?:为)?(\d+)元/);
      const m1 = text.match(/一级(?:医疗机构|医院)?(?:为)?(\d+)元/);
      const mComm = text.match(/(?:基层|社区|乡镇)(?:医疗机构|医院|卫生院)?(?:为)?(\d+)元/);

      const tb = city.employee?.inpatient?.tierBenefits;
      if (tb) {
        if (m3 && tb.tier3?.deductible !== parseInt(m3[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '职工住院-三级起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: m3[1] + '元',
            codeValue: tb.tier3?.deductible + '元'
          });
        }
        if (m2 && tb.tier2?.deductible !== parseInt(m2[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '职工住院-二级起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: m2[1] + '元',
            codeValue: tb.tier2?.deductible + '元'
          });
        }
        if (m1 && tb.tier1?.deductible !== parseInt(m1[1], 10)) {
          mismatches.push({
            cityCode, cityName, provinceName,
            category: '职工住院-一级起付线',
            docTitle: doc.title,
            quoteSnippet: text,
            quoteValue: m1[1] + '元',
            codeValue: tb.tier1?.deductible + '元'
          });
        }
      }
    }

    // 3. Check Employee Outpatient Cap
    const empCapQuotes = q.match(/(?:职工|普通门诊).*?(?:最高支付限额|年最高支付|年度统筹基金最高支付限额|门诊年度统筹最高支付限额|年限额|封顶线).*?(?:在职(?:职工)?)?(\d+)元/);
    if (empCapQuotes) {
      const qCap = parseInt(empCapQuotes[1], 10);
      const cCap = city.employee?.outpatient?.annualCap;
      if (cCap && cCap !== qCap && qCap >= 1000 && qCap <= 20000) {
        mismatches.push({
          cityCode, cityName, provinceName,
          category: '职工门诊-年封顶线',
          docTitle: doc.title,
          quoteSnippet: empCapQuotes[0],
          quoteValue: qCap + '元',
          codeValue: cCap + '元'
        });
      }
    }

    // 4. Check Employee Outpatient Deductible
    const empDedQuotes = q.match(/(?:职工).*?门诊.*?起付(?:标准|线).*?(\d+)元/);
    if (empDedQuotes) {
      const qDed = parseInt(empDedQuotes[1], 10);
      const cDed = city.employee?.outpatient?.annualDeductible;
      if (cDed !== undefined && cDed !== qDed) {
        mismatches.push({
          cityCode, cityName, provinceName,
          category: '职工门诊-起付线',
          docTitle: doc.title,
          quoteSnippet: empDedQuotes[0],
          quoteValue: qDed + '元',
          codeValue: cDed + '元'
        });
      }
    }

    // 5. Check Resident Outpatient Cap
    const resCapQuotes = q.match(/(?:居民|城乡居民).*?(?:门诊统筹|普通门诊).*?(?:最高支付限额|年最高支付|年限额|封顶).*?(\d+)元/);
    if (resCapQuotes) {
      const qCap = parseInt(resCapQuotes[1], 10);
      const cCap = city.resident?.outpatient?.annualCap;
      if (cCap && cCap !== qCap && qCap >= 50 && qCap <= 5000) {
        mismatches.push({
          cityCode, cityName, provinceName,
          category: '居民门诊-年封顶线',
          docTitle: doc.title,
          quoteSnippet: resCapQuotes[0],
          quoteValue: qCap + '元',
          codeValue: cCap + '元'
        });
      }
    }

    // 6. Check Resident Inpatient Ratios
    const resRatioMatch = q.match(/(?:居民|城乡居民).*?(?:住院|统筹).*?(?:报销比例|支付比例)[^。；\n]*/);
    if (resRatioMatch) {
      const text = resRatioMatch[0];
      const r3 = text.match(/三级(?:医疗机构|医院)?(?:约为|为)?(\d{2})%/);
      const r2 = text.match(/二级(?:医疗机构|医院)?(?:约为|为)?(\d{2})%/);
      const r1 = text.match(/一级(?:医疗机构|医院)?(?:约为|为)?(\d{2})%/);

      const tb = city.resident?.inpatient?.tierBenefits;
      if (tb) {
        if (r3 && tb.tier3?.reimbursementRatio) {
          const expected = parseInt(r3[1], 10) / 100;
          if (Math.abs(tb.tier3.reimbursementRatio - expected) > 0.02) {
            mismatches.push({
              cityCode, cityName, provinceName,
              category: '居民住院-三级报销比例',
              docTitle: doc.title,
              quoteSnippet: text,
              quoteValue: r3[1] + '%',
              codeValue: Math.round(tb.tier3.reimbursementRatio * 100) + '%'
            });
          }
        }
        if (r2 && tb.tier2?.reimbursementRatio) {
          const expected = parseInt(r2[1], 10) / 100;
          if (Math.abs(tb.tier2.reimbursementRatio - expected) > 0.02) {
            mismatches.push({
              cityCode, cityName, provinceName,
              category: '居民住院-二级报销比例',
              docTitle: doc.title,
              quoteSnippet: text,
              quoteValue: r2[1] + '%',
              codeValue: Math.round(tb.tier2.reimbursementRatio * 100) + '%'
            });
          }
        }
      }
    }
  }
}

import * as fs from 'fs';
import * as path from 'path';

const outPath = path.resolve(__dirname, '../../docs/quote-mismatches.json');
fs.writeFileSync(outPath, JSON.stringify(mismatches, null, 2), 'utf-8');
console.log(`Saved ${mismatches.length} mismatches to ${outPath}`);


const byProvince: Record<string, Mismatch[]> = {};
for (const m of mismatches) {
  if (!byProvince[m.provinceName]) byProvince[m.provinceName] = [];
  byProvince[m.provinceName].push(m);
}

for (const [prov, items] of Object.entries(byProvince)) {
  console.log(`\n【${prov}】(${items.length}项差异):`);
  for (const item of items) {
    console.log(`  - [${item.cityName} (${item.cityCode})] ${item.category}: 公文称 [${item.quoteValue}] vs 代码配置 [${item.codeValue}]`);
  }
}

