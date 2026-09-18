import fs from 'fs';
import path from 'path';

console.log('=== 开始对 41 个口径与起付冲突城市进行深度校准 ===');

// 1. 河南各市：门诊共济按诊次起付 (deductibleType: 'per_visit')
const henanDir = 'src/data/henan';
if (fs.existsSync(henanDir)) {
  const files = fs.readdirSync(henanDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  for (const f of files) {
    const fullPath = path.join(henanDir, f);
    let content = fs.readFileSync(fullPath, 'utf-8');
    if (!content.includes("deductibleType: 'per_visit'")) {
      content = content.replace(
        /(annualDeductible:\s*[0-9]+,)/g,
        `$1\n      deductibleType: 'per_visit',`
      );
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`[河南] 已校准 ${f} 门诊起付类型为 per_visit`);
    }
  }
}

// 2. 山西各市：门诊共济按诊次起付 (deductibleType: 'per_visit')
const shanxiDir = 'src/data/shanxi';
if (fs.existsSync(shanxiDir)) {
  const files = fs.readdirSync(shanxiDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  for (const f of files) {
    const fullPath = path.join(shanxiDir, f);
    let content = fs.readFileSync(fullPath, 'utf-8');
    if (!content.includes("deductibleType: 'per_visit'")) {
      content = content.replace(
        /(annualDeductible:\s*[0-9]+,)/g,
        `$1\n      deductibleType: 'per_visit',`
      );
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`[山西] 已校准 ${f} 门诊起付类型为 per_visit`);
    }
  }
}

// 3. 北京、上海、广州、深圳、重庆、天津等核心大城市补充 lastUpdated
const coreFiles = [
  'src/data/beijing/index.ts',
  'src/data/shanghai/index.ts',
  'src/data/guangdong/guangzhou.ts',
  'src/data/guangdong/shenzhen.ts',
  'src/data/tianjin/index.ts',
  'src/data/chongqing/index.ts',
  'src/data/sichuan/chengdu.ts',
  'src/data/zhejiang/hangzhou.ts',
  'src/data/hubei/wuhan.ts',
  'src/data/shandong/jinan.ts',
  'src/data/shandong/qingdao.ts',
  'src/data/henan/zhengzhou.ts'
];

for (const cf of coreFiles) {
  if (fs.existsSync(cf)) {
    let content = fs.readFileSync(cf, 'utf-8');
    if (!content.includes('lastUpdated:')) {
      content = content.replace(
        /(officialPortalUrl:\s*['"][^'"]+['"],)/g,
        `$1\n  lastUpdated: '2026-03-01',`
      );
      fs.writeFileSync(cf, content, 'utf-8');
      console.log(`[核心城市] 已补充 lastUpdated: ${cf}`);
    }
  }
}

console.log('校准完成！');
