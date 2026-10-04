import * as fs from 'fs';
import * as path from 'path';

const files = [
  'ganzhou.ts',
  'jian.ts',
  'yichun.ts',
  'fuzhou.ts',
  'shangrao.ts',
  'jingdezhen.ts',
  'jiujiang.ts',
  'xinyu.ts',
  'yingtan.ts'
];

const jxDir = path.resolve(__dirname, '../data/jiangxi');

for (const f of files) {
  const filePath = path.join(jxDir, f);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace resident outpatient annualCap: 150000 -> 150
  // Note: Only under resident.outpatient
  const oldPattern = /outpatient:\s*\{[^}]*?annualCap:\s*150000[^}]*?\}/s;
  const match = content.match(oldPattern);
  if (match) {
    const updated = match[0].replace(/annualCap:\s*150000[^\n]*/, 'annualCap: 150, // 居民普通门诊年度限额 150 元');
    content = content.replace(match[0], updated);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed resident outpatient annualCap in ${f}`);
  } else {
    // If regex did not match multiline block, do precise replacement
    const precisePattern = /(resident:\s*\{\s*outpatient:\s*\{[^}]*?annualCap:\s*)150000/s;
    if (precisePattern.test(content)) {
      content = content.replace(precisePattern, '$1150');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Precisely fixed ${f}`);
    } else {
      console.log(`No match in ${f}`);
    }
  }
}
