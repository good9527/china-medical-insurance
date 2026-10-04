import { allCities } from '../data';

const jx = allCities.filter(c => c.provinceName === '江西省');
for (const c of jx) {
  console.log(`${c.cityName} (${c.cityCode}): 居民门诊封顶=${c.resident?.outpatient?.annualCap}元, 职工门诊封顶=${c.employee?.outpatient?.annualCap}元`);
}
