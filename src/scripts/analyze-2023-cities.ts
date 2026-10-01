import { allCities } from '../data';

const list = allCities.map(c => {
  const docs = c.sourceDocs || [];
  let oldestYear = 2026;
  let newestYear = 2000;
  const docNumbers: string[] = [];

  for (const d of docs) {
    docNumbers.push(d.docNumber);
    const text = `${d.docNumber} ${d.title} ${d.publishDate || ''}`;
    const matches = Array.from(text.matchAll(/(20\d{2})/g));
    for (const m of matches) {
      const y = parseInt(m[1]);
      if (y >= 2000 && y <= 2026) {
        if (y < oldestYear) oldestYear = y;
        if (y > newestYear) newestYear = y;
      }
    }
  }

  return {
    cityCode: c.cityCode,
    cityName: c.cityName,
    provinceName: c.provinceName,
    newestYear,
    oldestYear,
    docsCount: docs.length,
    docNumbers: docNumbers.join('; ')
  };
});

const list2023 = list.filter(c => c.newestYear === 2023);
console.log('Total cities with newestYear === 2023:', list2023.length);

const byProvince: Record<string, number> = {};
list2023.forEach(c => {
  byProvince[c.provinceName] = (byProvince[c.provinceName] || 0) + 1;
});

console.log('\n2023 Cities breakdown by Province:');
const sortedProvinces = Object.entries(byProvince).sort((a, b) => b[1] - a[1]);
sortedProvinces.forEach(([prov, count]) => {
  console.log(`- ${prov}: ${count} 个统筹区`);
});

console.log('\n--- 重点省份剩余 2023 基线统筹区清单 ---');
const targetProvs = ['福建省', '安徽省'];
targetProvs.forEach(prov => {
  const cities = list2023.filter(c => c.provinceName === prov);
  console.log(`\n【${prov}】剩余 ${cities.length} 个统筹区需升级:`);
  cities.forEach(c => {
    console.log(`- [${c.cityCode}] ${c.cityName} | 现存公文: ${c.docNumbers}`);
  });
});

