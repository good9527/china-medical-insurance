import { allCities } from '../data';

console.log('=== 检查全国 344 个统筹区 hotline 格式与拨号清洁度 ===');

let complexCount = 0;
for (const c of allCities) {
  const h = c.hotline || '';
  if (h.includes('/') || h.includes('、') || h.includes('或') || h.includes('，') || h.includes(',')) {
    console.log(`[复合热线] ${c.cityName} (${c.cityCode}): "${h}"`);
    complexCount++;
  } else if (!h.includes('12393') && !h.includes('12345')) {
    console.log(`[非标准热线] ${c.cityName} (${c.cityCode}): "${h}"`);
  }
}
console.log(`共发现 ${complexCount} 个城市包含复合热线分隔符！`);
