import { allCities } from '../data';

const henan = allCities.filter(c => c.provinceName === '河南省');
for (const c of henan) {
  const empIn = c.employee?.inpatient?.tierBenefits;
  const resIn = c.resident?.inpatient?.tierBenefits;
  const empOut = c.employee?.outpatient;
  const resOut = c.resident?.outpatient;
  console.log(`${c.cityName}: 职工住院三级=${empIn?.tier3?.deductible}元/${Math.round((empIn?.tier3?.reimbursementRatio||0)*100)}%, 居民住院三级=${resIn?.tier3?.deductible}元/${Math.round((resIn?.tier3?.reimbursementRatio||0)*100)}%, 职工门诊起付=${empOut?.annualDeductible}元/顶${empOut?.annualCap}元, 居民门诊顶=${resOut?.annualCap}元`);
}
