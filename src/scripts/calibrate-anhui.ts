import fs from 'fs';
import path from 'path';

const anhuiDir = 'src/data/anhui';
const files = fs.readdirSync(anhuiDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log(`=== 校准安徽省 ${files.length} 个地级市居民住院真实报销比例 ===`);

for (const f of files) {
  const fullPath = path.join(anhuiDir, f);
  let content = fs.readFileSync(fullPath, 'utf-8');

  // 替换居民住院的 tierBenefits
  // 匹配 resident: { ... inpatient: { ... tierBenefits: { ... } } }
  // 一级 90%, 二级 80%, 市属三级 75%, 省属三级 70%
  content = content.replace(
    /tier2:\s*\{\s*tierName:\s*['"][^'"]*['"],\s*deductible:\s*500,\s*reimbursementRatio:\s*0\.85\s*\}/g,
    `tier2: { tierName: '二级及县级医疗机构', deductible: 500, reimbursementRatio: 0.80 }`
  );
  content = content.replace(
    /tier3:\s*\{\s*tierName:\s*['"][^'"]*['"],\s*deductible:\s*700,\s*reimbursementRatio:\s*0\.80\s*\}/g,
    `tier3: { tierName: '市属三级定点医院', deductible: 700, reimbursementRatio: 0.75 }`
  );
  content = content.replace(
    /tier3_top:\s*\{\s*tierName:\s*['"][^'"]*['"],\s*deductible:\s*1000,\s*reimbursementRatio:\s*0\.75\s*\}/g,
    `tier3_top: { tierName: '省属三级重点医疗机构', deductible: 1000, reimbursementRatio: 0.70 }`
  );

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`[安徽] 已校准 ${f} 居民住院比例 (二级80%, 市三级75%, 省三级70%)`);
}
