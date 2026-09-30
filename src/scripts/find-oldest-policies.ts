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

list.sort((a, b) => a.newestYear - b.newestYear);

console.log('Total cities analyzed:', list.length);
console.log('\nTop 25 cities with oldest newestYear:');
list.slice(0, 25).forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.cityCode}] ${c.provinceName}·${c.cityName}: 最新公文年份=${c.newestYear} | 公文=${c.docNumbers}`);
});

const yearCounts: Record<number, number> = {};
list.forEach(c => {
  yearCounts[c.newestYear] = (yearCounts[c.newestYear] || 0) + 1;
});
console.log('\nNewest Document Year distribution across 348 regions:');
console.table(yearCounts);
