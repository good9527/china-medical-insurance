import { shaanxiCities } from '../data/shaanxi';

console.log('=== 陕西省 11 个统筹区城乡居民医保住院待遇穿透审查 ===\n');
for (const c of shaanxiCities) {
  const ri = c.resident.inpatient;
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`【${c.cityName} (${c.cityCode})】`);
  console.log(`  一级/社区: 起付 ¥${ri.tierBenefits.tier1?.deductible} | 报销 ${(ri.tierBenefits.tier1?.reimbursementRatio * 100).toFixed(0)}%`);
  console.log(`  二级医疗: 起付 ¥${ri.tierBenefits.tier2?.deductible} | 报销 ${(ri.tierBenefits.tier2?.reimbursementRatio * 100).toFixed(0)}%`);
  console.log(`  三级医疗: 起付 ¥${ri.tierBenefits.tier3?.deductible} | 报销 ${(ri.tierBenefits.tier3?.reimbursementRatio * 100).toFixed(0)}%`);
  console.log(`  三甲医疗: 起付 ¥${ri.tierBenefits.tier3_top?.deductible} | 报销 ${(ri.tierBenefits.tier3_top?.reimbursementRatio * 100).toFixed(0)}%`);
  console.log(`  封顶限额: ¥${ri.annualCap}`);
  console.log(`  来源公文: ${c.sourceDocs.map(d => `${d.docNumber} (${d.title})`).join('\n            ')}`);
}
