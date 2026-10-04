import * as fs from 'fs';
import * as path from 'path';

const nmDir = path.resolve(__dirname, '../data/neimenggu');

const targetFiles = [
  'hohhot.ts',
  'wuhai.ts',
  'chifeng.ts',
  'tongliao.ts',
  'ordos.ts',
  'hulunbuir.ts',
  'bayannur.ts',
  'ulanqab.ts',
  'xilingol.ts',
  'hinggan.ts',
  'alxa.ts'
];

const replacementBlock = `    outpatient: {
      sourceDocId: '$DOC_ID$',
      annualDeductible: 500, // 门诊年度起付线（三级500元、二级300元、一级200元）
      annualDeductibleRetiree: 300,
      annualCap: 5000,       // 在职限额 5000 元
      annualCapRetiree: 6000, // 退休限额 6000 元
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊起付线按年度累计：一级200元、二级300元、三级500元（退休人员相应为50元、200元、300元）。统筹支付比例：一级及二级80%（退休85%）、三级60%（退休65%）。在职限额5000元，退休限额6000元。'
    },`;

for (const file of targetFiles) {
  const filePath = path.join(nmDir, file);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract docId
  const match = content.match(/employee:\s*\{\s*outpatient:\s*\{\s*sourceDocId:\s*'([^']+)'/);
  if (!match) {
    console.log('Could not find outpatient sourceDocId in', file);
    continue;
  }
  const docId = match[1];
  
  const block = replacementBlock.replace('$DOC_ID$', docId);
  content = content.replace(/employee:\s*\{\s*outpatient:\s*\{[\s\S]*?note:[\s\S]*?\},/m, `employee: {\n${block}`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated outpatient in ${file}`);
}
