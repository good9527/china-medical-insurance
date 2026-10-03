import { allCities } from '../data';

console.log('全国统筹区总计:', allCities.length);

const distribution: Record<number, number> = {};
const byProvince: Record<string, { total: number; minYear: number; maxYear: number }> = {};

allCities.forEach(c => {
  const docs = c.sourceDocs || [];
  let newestYear = 2000;
  docs.forEach(d => {
    const text = `${d.docNumber} ${d.title} ${d.publishDate || ''}`;
    for (const m of text.matchAll(/(20\d{2})/g)) {
      const y = parseInt(m[1]);
      if (y > newestYear && y <= 2026) newestYear = y;
    }
  });

  distribution[newestYear] = (distribution[newestYear] || 0) + 1;

  if (!byProvince[c.provinceName]) {
    byProvince[c.provinceName] = { total: 0, minYear: 2026, maxYear: 2000 };
  }
  const p = byProvince[c.provinceName];
  p.total++;
  if (newestYear < p.minYear) p.minYear = newestYear;
  if (newestYear > p.maxYear) p.maxYear = newestYear;
});

console.log('\n=== 全国 348 统筹区最新公文年份分布 ===');
Object.entries(distribution).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([year, count]) => {
  console.log(`- ${year} 年: ${count} 个统筹区 (${((count / allCities.length) * 100).toFixed(1)}%)`);
});

console.log('\n=== 各省/自治区/直辖市统筹区基线覆盖情况 ===');
Object.entries(byProvince).forEach(([prov, stats]) => {
  console.log(`- ${prov.padEnd(8, ' ')}: ${stats.total.toString().padStart(2, ' ')} 个统筹区 | 年份范围: ${stats.minYear} ~ ${stats.maxYear}`);
});
