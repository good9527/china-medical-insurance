import { allCities } from '../data';
import { provinceList } from '../data/provinces';

console.log('=== 省内城市数据同质化与真实性审查 ===');

const provMap = new Map<string, typeof allCities>();
for (const city of allCities) {
  if (!provMap.has(city.provinceName)) {
    provMap.set(city.provinceName, []);
  }
  provMap.get(city.provinceName)!.push(city);
}

for (const [prov, cities] of provMap.entries()) {
  if (cities.length <= 1) continue; // 直辖市跳过
  
  // 检查城市间的门诊封顶线、起付线、住院起付线是否完全相同
  const signatures = cities.map(c => {
    const eo = c.employee.outpatient;
    const ei = c.employee.inpatient;
    const ro = c.resident.outpatient;
    const ri = c.resident.inpatient;
    return `${eo.annualDeductible}_${eo.annualCap}_${ei.tierBenefits.tier3.deductible}_${ro.annualCap}_${ri.tierBenefits.tier3.deductible}`;
  });

  const uniqueSigs = new Set(signatures);
  const ratio = (uniqueSigs.size / cities.length) * 100;
  console.log(`[${prov}] 统筹区数量: ${cities.length} | 独特待遇参数套数: ${uniqueSigs.size} (多样率: ${ratio.toFixed(0)}%)`);
  if (uniqueSigs.size === 1) {
    console.log(`  ⚠️ 警告: [${prov}] 所有 ${cities.length} 个地级统筹区待遇参数完全相同！疑似全省使用单一模板！`);
  }
}
