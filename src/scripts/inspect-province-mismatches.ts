import * as fs from 'fs';
import * as path from 'path';

const provName = process.argv[2] || '江西省';
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../docs/quote-mismatches.json'), 'utf8'));

const filtered = data.filter((m: any) => m.provinceName.includes(provName));
console.log(`\n=== 【${provName}】共 ${filtered.length} 项差异 ===\n`);

for (const item of filtered) {
  console.log(`--------------------------------------------------`);
  console.log(`城市: ${item.cityName} (${item.cityCode})`);
  console.log(`分类: ${item.category}`);
  console.log(`公文标题: ${item.docTitle}`);
  console.log(`公文摘录: "${item.quoteSnippet}"`);
  console.log(`公文数值: ${item.quoteValue}`);
  console.log(`代码数值: ${item.codeValue}`);
}
