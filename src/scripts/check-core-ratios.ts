import { allCities } from '../data';

const coreCityCodes = [
  '110100', // 北京
  '310100', // 上海
  '120100', // 天津
  '500100', // 重庆
  '440100', // 广州
  '440300', // 深圳
  '330100', // 杭州
  '320100', // 南京
  '320500', // 苏州
  '420100', // 武汉
  '510100', // 成都
  '610100', // 西安
  '410100', // 郑州
  '430100', // 长沙
  '370100', // 济南
  '370200', // 青岛
  '210100', // 沈阳
  '210200', // 大连
  '350100', // 福州
  '350200', // 厦门
  '360100', // 南昌
  '340100', // 合肥
  '530100', // 昆明
  '520100', // 贵阳
  '450100', // 南宁
  '460100', // 海口
  '650100', // 乌鲁木齐
  '640100', // 银川
  '620100', // 兰州
  '630100', // 西宁
  '150100', // 呼和浩特
  '230100', // 哈尔滨
  '220100', // 长春
  '130100', // 石家庄
  '140100'  // 太原
];

console.log('=== 全国 35 个重点核心城市报销比例真实性大排查 ===\n');

for (const code of coreCityCodes) {
  const city = allCities.find(c => c.cityCode === code);
  if (!city) continue;

  const eo = city.employee.outpatient.tierBenefits;
  const ei = city.employee.inpatient.tierBenefits;
  const ro = city.resident.outpatient.tierBenefits;
  const ri = city.resident.inpatient.tierBenefits;

  console.log(`--------------------------------------------------------------------------------`);
  console.log(`【${city.provinceName} ${city.cityName} (${city.cityCode})】`);
  console.log(`  职工门诊比例: 社区 ${(eo.community?.reimbursementRatio*100||0)}% | 一级 ${(eo.tier1?.reimbursementRatio*100||0)}% | 二级 ${(eo.tier2?.reimbursementRatio*100||0)}% | 三级 ${(eo.tier3?.reimbursementRatio*100||0)}% (退休上浮: +${(eo.tier3?.retireeRatioBonus*100||0)}%)`);
  console.log(`  职工住院比例: 社区 ${(ei.community?.reimbursementRatio*100||0)}% | 一级 ${(ei.tier1?.reimbursementRatio*100||0)}% | 二级 ${(ei.tier2?.reimbursementRatio*100||0)}% | 三级 ${(ei.tier3?.reimbursementRatio*100||0)}% (退休上浮: +${(ei.tier3?.retireeRatioBonus*100||0)}%)`);
  console.log(`  居民门诊比例: 社区 ${(ro.community?.reimbursementRatio*100||0)}% | 一级 ${(ro.tier1?.reimbursementRatio*100||0)}% | 二级 ${(ro.tier2?.reimbursementRatio*100||0)}% | 三级 ${(ro.tier3?.reimbursementRatio*100||0)}%`);
  console.log(`  居民住院比例: 社区 ${(ri.community?.reimbursementRatio*100||0)}% | 一级 ${(ri.tier1?.reimbursementRatio*100||0)}% | 二级 ${(ri.tier2?.reimbursementRatio*100||0)}% | 三级 ${(ri.tier3?.reimbursementRatio*100||0)}%`);
  console.log(`  依据公文: ${city.sourceDocs.map(d => d.docNumber).join(' / ')}`);
}
