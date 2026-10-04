import * as fs from 'fs';
import * as path from 'path';

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

const data: Mismatch[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../docs/quote-mismatches.json'), 'utf8'));

const counts: Record<string, number> = {};
const byCategory: Record<string, number> = {};
const byProv: Record<string, Mismatch[]> = {};

for (const m of data) {
  counts[m.provinceName] = (counts[m.provinceName] || 0) + 1;
  byCategory[m.category] = (byCategory[m.category] || 0) + 1;
  if (!byProv[m.provinceName]) byProv[m.provinceName] = [];
  byProv[m.provinceName].push(m);
}

console.log('--- 按省份统计差异数量 ---');
for (const [k, v] of Object.entries(counts)) {
  console.log(`${k}: ${v}项`);
}

console.log('\n--- 按类别统计差异数量 ---');
for (const [k, v] of Object.entries(byCategory)) {
  console.log(`${k}: ${v}项`);
}


console.log('\n--- 差异按省份汇总 ---');
for (const [prov, items] of Object.entries(byProv)) {
  const cityNames = Array.from(new Set(items.map(i => i.cityName)));
  console.log(`【${prov}】: ${items.length}项差异, 涉及城市: ${cityNames.join(', ')}`);
}

