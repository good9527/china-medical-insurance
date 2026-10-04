import { allCities } from '../data';

const majorCities = [
  '北京市', '上海市', '天津市', '重庆市',
  '广州市', '深圳市', '成都市', '武汉市', '杭州市', '南京市', '西安市', '郑州市', '长沙市', '沈阳市', '青岛市', '济南市',
  '宁波市', '福州市', '厦门市', '合肥市', '南昌市', '昆明市', '贵阳市', '南宁市', '石家庄市', '太原市', '哈尔滨市', '长春市',
  '呼和浩特市', '乌鲁木齐市', '兰州市', '西宁市', '银川市', '海口市', '大连市', '苏州市', '无锡市', '佛山市', '东莞市'
];

console.log(`Analyzing ${majorCities.length} key cities...`);

for (const name of majorCities) {
  const city = allCities.find(c => c.cityName === name || c.cityName.includes(name.replace('市', '')));
  if (!city) {
    console.log('MISSING:', name);
    continue;
  }
  const empIn = city.employee?.inpatient?.tierBenefits;
  const resIn = city.resident?.inpatient?.tierBenefits;
  const empOut = city.employee?.outpatient;
  const resOut = city.resident?.outpatient;
  console.log(`=== ${city.cityName} (${city.provinceName}) [code: ${city.cityCode}] ===`);
  console.log('  职工住院起付/比例: ' +
    `一级:${empIn?.tier1?.deductible}元/${Math.round((empIn?.tier1?.reimbursementRatio||0)*100)}% | ` +
    `二级:${empIn?.tier2?.deductible}元/${Math.round((empIn?.tier2?.reimbursementRatio||0)*100)}% | ` +
    `三级:${empIn?.tier3?.deductible}元/${Math.round((empIn?.tier3?.reimbursementRatio||0)*100)}%`
  );
  console.log('  居民住院起付/比例: ' +
    `一级:${resIn?.tier1?.deductible}元/${Math.round((resIn?.tier1?.reimbursementRatio||0)*100)}% | ` +
    `二级:${resIn?.tier2?.deductible}元/${Math.round((resIn?.tier2?.reimbursementRatio||0)*100)}% | ` +
    `三级:${resIn?.tier3?.deductible}元/${Math.round((resIn?.tier3?.reimbursementRatio||0)*100)}%`
  );
  console.log(`  职工门诊: 起付=${empOut?.annualDeductible}元, 封顶=${empOut?.annualCap}元, 一/二/三比例=${Math.round((empOut?.tierBenefits?.tier1?.reimbursementRatio||0)*100)}%/${Math.round((empOut?.tierBenefits?.tier2?.reimbursementRatio||0)*100)}%/${Math.round((empOut?.tierBenefits?.tier3?.reimbursementRatio||0)*100)}%`);
  console.log(`  居民门诊: 起付=${resOut?.annualDeductible}元, 封顶=${resOut?.annualCap}元, 一/二/三比例=${Math.round((resOut?.tierBenefits?.tier1?.reimbursementRatio||0)*100)}%/${Math.round((resOut?.tierBenefits?.tier2?.reimbursementRatio||0)*100)}%/${Math.round((resOut?.tierBenefits?.tier3?.reimbursementRatio||0)*100)}%`);
  console.log(`  公文标题: ${city.sourceDocs?.[0]?.title || '无'} (文号: ${city.sourceDocs?.[0]?.docNumber})`);
}
