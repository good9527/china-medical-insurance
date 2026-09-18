import { allCities } from '../data';

const shandong = allCities.filter(c => c.provinceName === '山东省');
console.log('=== 山东省 16 市政策待遇核验 ===');
for (const c of shandong) {
  const eo = c.employee?.outpatient;
  const ei = c.employee?.inpatient?.tierBenefits;
  const ro = c.resident?.outpatient;
  const ri = c.resident?.inpatient?.tierBenefits;
  console.log(
    c.cityName.padEnd(5, '　') +
    ` | 职工门诊限额: ${(eo?.annualCap || 0).toString().padStart(5)}` +
    ` | 门诊比例(社区/二/三): ${((eo?.tierBenefits.community?.reimbursementRatio||0)*100).toFixed(0)}% / ${((eo?.tierBenefits.tier2?.reimbursementRatio||0)*100).toFixed(0)}% / ${((eo?.tierBenefits.tier3?.reimbursementRatio||0)*100).toFixed(0)}%` +
    ` | 职工住院三级: ${((ei?.tier3?.reimbursementRatio||0)*100).toFixed(0)}%` +
    ` | 居民门诊限额: ${(ro?.annualCap || 0).toString().padStart(4)}` +
    ` | 居民住院三级: ${((ri?.tier3?.reimbursementRatio||0)*100).toFixed(0)}%`
  );
}
