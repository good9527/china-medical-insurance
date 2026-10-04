import { allCities } from '../data';

const topCities = [
  '北京市', '上海市', '天津市', '重庆市',
  '广州市', '深圳市', '成都市', '武汉市', '杭州市', '南京市', '西安市', '郑州市', '长沙市', '沈阳市', '青岛市', '济南市',
  '宁波市', '福州市', '厦门市', '合肥市'
];

for (const name of topCities) {
  const city = allCities.find(c => c.cityName === name || c.cityName.includes(name.replace('市', '')));
  if (!city) continue;
  const empIn = city.employee?.inpatient?.tierBenefits;
  const resIn = city.resident?.inpatient?.tierBenefits;
  const empOut = city.employee?.outpatient;
  const resOut = city.resident?.outpatient;
  console.log(`=== ${city.cityName} (${city.provinceName}) ===`);
  console.log('  职工住院起付: ' + `一级:${empIn?.tier1?.deductible} 二级:${empIn?.tier2?.deductible} 三级:${empIn?.tier3?.deductible}`);
  console.log('  职工住院比例: ' + `一级:${Math.round((empIn?.tier1?.reimbursementRatio||0)*100)}% 二级:${Math.round((empIn?.tier2?.reimbursementRatio||0)*100)}% 三级:${Math.round((empIn?.tier3?.reimbursementRatio||0)*100)}% (退休加成: ${Math.round((empIn?.tier3?.retireeRatioBonus||0)*100)}%)`);
  console.log('  居民住院起付: ' + `一级:${resIn?.tier1?.deductible} 二级:${resIn?.tier2?.deductible} 三级:${resIn?.tier3?.deductible}`);
  console.log('  居民住院比例: ' + `一级:${Math.round((resIn?.tier1?.reimbursementRatio||0)*100)}% 二级:${Math.round((resIn?.tier2?.reimbursementRatio||0)*100)}% 三级:${Math.round((resIn?.tier3?.reimbursementRatio||0)*100)}%`);
  console.log('  职工门诊: 起付=' + empOut?.annualDeductible + ' 顶=' + empOut?.annualCap);
  console.log('  居民门诊: 起付=' + resOut?.annualDeductible + ' 顶=' + resOut?.annualCap);
}
