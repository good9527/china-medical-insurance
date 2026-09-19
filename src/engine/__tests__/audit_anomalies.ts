import { allCities } from '../../data';

console.log('Total cities loaded:', allCities.length);
const anomalies: string[] = [];

for (const city of allCities) {
  const cName = `${city.cityName} (${city.provinceName} ${city.cityCode})`;
  const empIn = city.employee?.inpatient;
  const empOut = city.employee?.outpatient;
  const resIn = city.resident?.inpatient;
  const resOut = city.resident?.outpatient;

  // 1. 字段 undefined 检查 (已通过数据归一化自动补齐)
  if (!empOut || empOut.annualDeductible === undefined) {
    anomalies.push(`[UNDEFINED 职工门诊起付] ${cName}`);
  }
  if (!resOut || resOut.annualDeductible === undefined) {
    anomalies.push(`[UNDEFINED 居民门诊起付] ${cName}`);
  }

  // 2. 居民三级住院报销比例异常偏高 (> 80%) 检查
  // 特区法定特例排除：深圳(政府令第358号居民住院比例与职工同比例90%)、珠海(珠府〔2024〕57号居民各级住院统筹90%)
  const isSpecialZone = city.cityCode === '440300' || city.cityCode === '440400';
  const resT3 = resIn?.tierBenefits?.tier3?.reimbursementRatio ?? 0;
  if (resT3 > 0.80 && !isSpecialZone) {
    anomalies.push(`[ANOMALY RATIO 居民三级住院偏高] ${(resT3 * 100).toFixed(1)}%: ${cName}`);
  }
  const resT2 = resIn?.tierBenefits?.tier2?.reimbursementRatio ?? 0;
  if (resT2 > 0.88 && !isSpecialZone) {
    anomalies.push(`[ANOMALY RATIO 居民二级住院偏高] ${(resT2 * 100).toFixed(1)}%: ${cName}`);
  }

  // 3. 居民报销比例倒挂 (居民三级 >= 职工三级)
  const empT3 = empIn?.tierBenefits?.tier3?.reimbursementRatio ?? 0;
  if (resT3 >= empT3 && empT3 > 0 && !isSpecialZone) {
    anomalies.push(`[RATIO INVERSION 居民比例倒挂职工] 居民三级(${(resT3*100).toFixed(1)}%) >= 职工三级(${(empT3*100).toFixed(1)}%): ${cName}`);
  }

  // 4. 起付线倒挂检查 (三级起付线一般高于一级起付线)
  const empDed1 = empIn?.tierBenefits?.tier1?.deductible ?? 0;
  const empDed3 = empIn?.tierBenefits?.tier3?.deductible ?? 0;
  if (empDed1 > empDed3 && empDed3 > 0) {
    anomalies.push(`[DEDUCTIBLE INVERSION 职工起付线倒挂] 一级(${empDed1}) > 三级(${empDed3}): ${cName}`);
  }
}

console.log(`\n========================================`);
console.log(`比例与倒挂排查完成！共发现 ${anomalies.length} 项异常：`);
console.log(`========================================`);
for (const a of anomalies) {
  console.log(a);
}
