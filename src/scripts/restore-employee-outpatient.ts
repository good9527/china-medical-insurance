import * as fs from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '../../');

// 四川省地级市职工门诊
const sichuanCities = [
  'src/data/sichuan/mianyang.ts',
  'src/data/sichuan/deyang.ts',
  'src/data/sichuan/yibin.ts',
  'src/data/sichuan/zigong.ts',
  'src/data/sichuan/panzhihua.ts',
  'src/data/sichuan/luzhou.ts',
  'src/data/sichuan/guangyuan.ts',
  'src/data/sichuan/suining.ts',
  'src/data/sichuan/neijiang.ts',
  'src/data/sichuan/leshan.ts',
  'src/data/sichuan/nanchong.ts',
  'src/data/sichuan/meishan.ts',
  'src/data/sichuan/guangan.ts',
  'src/data/sichuan/dazhou.ts',
  'src/data/sichuan/yaan.ts',
  'src/data/sichuan/bazhong.ts',
  'src/data/sichuan/ziyang.ts',
  'src/data/sichuan/aba.ts',
  'src/data/sichuan/garze.ts',
  'src/data/sichuan/liangshan.ts'
];

for (const rel of sichuanCities) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  let text = fs.readFileSync(full, 'utf-8');

  // 定位 employee.outpatient.tierBenefits
  const pattern = /(employee:\s*\{[\s\S]*?outpatient:\s*\{[\s\S]*?tierBenefits:\s*\{)([\s\S]*?)(\},\s*note:)/;
  const scBenefits = `
        community: { tierName: '基层及一级定点机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      `;
  text = text.replace(pattern, `$1${scBenefits}$3`);
  fs.writeFileSync(full, text, 'utf-8');
  console.log(`Restored Sichuan employee outpatient: ${rel}`);
}

// 甘肃省
const gansuCities = [
  'src/data/gansu/jiayuguan.ts',
  'src/data/gansu/jinchang.ts',
  'src/data/gansu/zhangye.ts',
  'src/data/gansu/lanzhou_new_area.ts'
];

for (const rel of gansuCities) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  let text = fs.readFileSync(full, 'utf-8');
  const pattern = /(employee:\s*\{[\s\S]*?outpatient:\s*\{[\s\S]*?tierBenefits:\s*\{)([\s\S]*?)(\},\s*note:)/;
  const gsBenefits = `
        community: { tierName: '社区及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      `;
  text = text.replace(pattern, `$1${gsBenefits}$3`);
  fs.writeFileSync(full, text, 'utf-8');
  console.log(`Restored Gansu employee outpatient: ${rel}`);
}

// 山东东营
{
  const full = path.join(root, 'src/data/shandong/dongying.ts');
  let text = fs.readFileSync(full, 'utf-8');
  const pattern = /(employee:\s*\{[\s\S]*?outpatient:\s*\{[\s\S]*?tierBenefits:\s*\{)([\s\S]*?)(\},\s*note:)/;
  const dyBenefits = `
        community: { tierName: '基层定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      `;
  text = text.replace(pattern, `$1${dyBenefits}$3`);
  fs.writeFileSync(full, text, 'utf-8');
  console.log(`Restored Dongying employee outpatient`);
}

// 陕西杨凌
{
  const full = path.join(root, 'src/data/shaanxi/yangling.ts');
  let text = fs.readFileSync(full, 'utf-8');
  const pattern = /(employee:\s*\{[\s\S]*?outpatient:\s*\{[\s\S]*?tierBenefits:\s*\{)([\s\S]*?)(\},\s*note:)/;
  const ylBenefits = `
        community: { tierName: '基层社区服务中心/镇卫生院', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      `;
  text = text.replace(pattern, `$1${ylBenefits}$3`);
  fs.writeFileSync(full, text, 'utf-8');
  console.log(`Restored Yangling employee outpatient`);
}

console.log('Finished restoring all employee outpatient benefits.');
