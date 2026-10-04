import { allCities } from '../data';

console.log('--- 扫描可疑数值 (全量 348 统筹区) ---');

// 1. 扫描居民门诊封顶线异常偏大 (> 5000元，但排除直辖市/特例)
console.log('\n[1] 居民门诊年封顶线 > 5000 元的城市:');
for (const c of allCities) {
  const cap = c.resident?.outpatient?.annualCap;
  if (cap && cap > 5000 && !['北京市', '上海市', '杭州市'].includes(c.cityName)) {
    console.log(`  - ${c.cityName} (${c.provinceName}): resident.outpatient.annualCap = ${cap}元`);
  }
}

// 2. 扫描职工门诊起付线异常偏高 (>= 1000元，排除北京1800、厦门1200)
console.log('\n[2] 职工门诊年起付线 >= 1000 元的城市:');
for (const c of allCities) {
  const ded = c.employee?.outpatient?.annualDeductible;
  if (ded && ded >= 1000 && !['北京市', '厦门市'].includes(c.cityName)) {
    console.log(`  - ${c.cityName} (${c.provinceName}): employee.outpatient.annualDeductible = ${ded}元`);
  }
}

// 3. 扫描居民住院起付线倒挂或异常 (三级起付线 > 2000元 或 < 300元)
console.log('\n[3] 居民住院三级起付线异常 (>2000元 或 <300元):');
for (const c of allCities) {
  const d3 = c.resident?.inpatient?.tierBenefits?.tier3?.deductible;
  if (d3 !== undefined && (d3 > 2000 || d3 < 300)) {
    console.log(`  - ${c.cityName} (${c.provinceName}): resident.inpatient.tier3.deductible = ${d3}元`);
  }
}

// 4. 扫描居民住院三级报销比例异常 (< 50% 或 > 80%)
console.log('\n[4] 居民住院三级报销比例异常 (<50% 或 >80%):');
for (const c of allCities) {
  const r3 = c.resident?.inpatient?.tierBenefits?.tier3?.reimbursementRatio;
  if (r3 !== undefined && (r3 < 0.50 || r3 > 0.80)) {
    console.log(`  - ${c.cityName} (${c.provinceName}): resident.inpatient.tier3.reimbursementRatio = ${(r3*100).toFixed(0)}%`);
  }
}

// 5. 扫描职工住院三级起付线异常 (> 2000元 或 < 400元)
console.log('\n[5] 职工住院三级起付线异常 (>2000元 或 <400元):');
for (const c of allCities) {
  const d3 = c.employee?.inpatient?.tierBenefits?.tier3?.deductible;
  if (d3 !== undefined && (d3 > 2000 || d3 < 400)) {
    console.log(`  - ${c.cityName} (${c.provinceName}): employee.inpatient.tier3.deductible = ${d3}元`);
  }
}
