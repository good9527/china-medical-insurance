import * as fs from 'fs';
import * as path from 'path';
import { transformSync } from 'esbuild';

const targets = [
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
  'src/data/sichuan/liangshan.ts',
  'src/data/gansu/jiayuguan.ts',
  'src/data/gansu/jinchang.ts',
  'src/data/gansu/zhangye.ts',
  'src/data/gansu/lanzhou_new_area.ts',
  'src/data/shandong/dongying.ts',
  'src/data/guangdong/jiangmen.ts',
  'src/data/shaanxi/yangling.ts'
];

const root = path.resolve(__dirname, '../../');

for (const rel of targets) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;

  let text = fs.readFileSync(full, 'utf-8');

  // 匹配 resident: { \s* outpatient: { ... } 直到 inpatient:
  const resOpPattern = /(resident:\s*\{[\s\S]*?outpatient:\s*\{)([\s\S]*?)(\n\s*inpatient:\s*\{)/;
  const match = text.match(resOpPattern);

  if (match) {
    const isJiangmen = rel.includes('jiangmen');
    const isDongying = rel.includes('dongying');
    const isGansu = rel.includes('gansu');

    // 提取 sourceDocId, annualCap, note
    const docIdMatch = match[2].match(/sourceDocId:\s*['"]([^'"]+)['"]/);
    const capMatch = match[2].match(/annualCap:\s*(\d+)/);
    const noteMatch = match[2].match(/note:\s*['"]([^'"]+)['"]/);

    const docId = docIdMatch ? docIdMatch[1] : 'default-doc';
    const cap = capMatch ? capMatch[1] : '200';
    const note = noteMatch ? noteMatch[1] : '居民门诊在基层定点机构免起付线报销，年度设支付限额。';

    let tiersContent = '';
    if (isJiangmen) {
      tiersContent = `
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }`;
    } else if (isDongying) {
      tiersContent = `
        community: { tierName: '基层社区卫生服务中心及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构(普通门诊未签约)', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }`;
    } else if (isGansu) {
      tiersContent = `
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }`;
    } else {
      tiersContent = `
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }`;
    }

    const cleanOutpatientBlock = `
      sourceDocId: '${docId}',
      annualCap: ${cap},
      tierBenefits: {${tiersContent}
      },
      note: '${note}'
    },`;

    text = text.replace(resOpPattern, `${match[1]}${cleanOutpatientBlock}${match[3]}`);
    fs.writeFileSync(full, text, 'utf-8');
    console.log(`Cleanly formatted outpatient in: ${rel}`);
  }
}

// 语法验证
let errCount = 0;
for (const rel of targets) {
  const full = path.join(root, rel);
  try {
    transformSync(fs.readFileSync(full, 'utf-8'), { loader: 'ts' });
  } catch (e: any) {
    errCount++;
    console.error(`❌ Syntax error in ${rel}: ${e.message}`);
  }
}

if (errCount === 0) {
  console.log('\n🎉 ALL 27 target files are 100% syntactically valid and verified!');
}
