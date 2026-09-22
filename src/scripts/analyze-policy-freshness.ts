import { allCities } from '../data';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== 全国 348 统筹区政策新鲜度与时效性深入统计 ===');

interface CityFreshness {
  cityCode: string;
  cityName: string;
  provinceName: string;
  latestYear: number;
  latestDoc: string;
  latestDocNumber: string;
  latestDate: string;
}

const list: CityFreshness[] = [];

for (const city of allCities) {
  let maxYear = 2000;
  let latestDocTitle = '';
  let latestDocNum = '';
  let latestDateStr = '';

  for (const doc of city.sourceDocs || []) {
    const dStr = doc.effectiveDate || doc.publishDate || '2000-01-01';
    const yr = parseInt(dStr.slice(0, 4), 10) || 2000;
    if (yr > maxYear || (yr === maxYear && dStr > latestDateStr)) {
      maxYear = yr;
      latestDocTitle = doc.title;
      latestDocNum = doc.docNumber;
      latestDateStr = dStr;
    }
  }

  list.push({
    cityCode: city.cityCode,
    cityName: city.cityName,
    provinceName: city.provinceName,
    latestYear: maxYear,
    latestDoc: latestDocTitle,
    latestDocNumber: latestDocNum,
    latestDate: latestDateStr
  });
}

// Group by year
const yearCounts: Record<number, number> = {};
for (const item of list) {
  yearCounts[item.latestYear] = (yearCounts[item.latestYear] || 0) + 1;
}

console.log('\n政策最新年份分布:');
for (const [yr, count] of Object.entries(yearCounts).sort((a, b) => Number(b[0]) - Number(a[0]))) {
  console.log(`  ${yr} 年: ${count} 个统筹区 (${((count / 348) * 100).toFixed(1)}%)`);
}

// Group older (< 2024) by province
const older = list.filter(x => x.latestYear < 2024);
console.log(`\n政策依据在 2024 年之前的统筹区共有 ${older.length} 个:`);

const byProv: Record<string, CityFreshness[]> = {};
for (const item of older) {
  byProv[item.provinceName] = byProv[item.provinceName] || [];
  byProv[item.provinceName].push(item);
}

for (const [prov, items] of Object.entries(byProv)) {
  console.log(`\n【${prov}】(${items.length} 个):`);
  for (const it of items) {
    console.log(`  - ${it.cityName}: ${it.latestYear}年 [${it.latestDocNumber}] ${it.latestDoc} (${it.latestDate})`);
  }
}
