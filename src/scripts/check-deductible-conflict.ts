import { allCities } from '../data';

console.log('=== 检查门诊起付线内外层不一致 ===');

let count = 0;
for (const city of allCities) {
  const eo = city.employee.outpatient;
  if (eo.annualDeductible > 0) {
    for (const [tierKey, t] of Object.entries(eo.tierBenefits)) {
      if (t.deductible === 0) {
        console.log(`[${city.cityName}] 外层 annualDeductible=${eo.annualDeductible}, 但 ${tierKey}.deductible=0 !`);
        count++;
        break;
      }
    }
  }
}
console.log(`共发现 ${count} 个城市存在内外层门诊起付线冲突！`);
