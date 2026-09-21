import { allCities } from '../data';

console.log('Checking all 348 cities for data quality and consistency...');

interface Issue {
  cityCode: string;
  cityName: string;
  provinceName: string;
  type: string;
  detail: string;
}

const issues: Issue[] = [];

for (const city of allCities) {
  const { cityCode, cityName, provinceName } = city;

  // 1. Source docs check
  if (!city.sourceDocs || city.sourceDocs.length === 0) {
    issues.push({ cityCode, cityName, provinceName, type: 'NO_SOURCE_DOCS', detail: '没有配置任何政策文件' });
  } else {
    for (const d of city.sourceDocs) {
      if (!d.docNumber || d.docNumber.trim() === '') {
        issues.push({ cityCode, cityName, provinceName, type: 'EMPTY_DOC_NUM', detail: `文件 [${d.title}] 缺少文号` });
      }
      if (!d.officialUrl || !d.officialUrl.startsWith('http')) {
        issues.push({ cityCode, cityName, provinceName, type: 'INVALID_URL', detail: `文件 [${d.title}] URL无效: ${d.officialUrl}` });
      }
    }
  }

  // 2. Employee Inpatient check
  const ei = city.employee?.inpatient;
  if (!ei) {
    issues.push({ cityCode, cityName, provinceName, type: 'MISSING_EMPLOYEE_INPATIENT', detail: '缺少职工住院待遇' });
  } else {
    const tb = ei.tierBenefits;
    if (!tb.tier1 || !tb.tier2 || !tb.tier3) {
      issues.push({ cityCode, cityName, provinceName, type: 'MISSING_INPATIENT_TIERS', detail: '职工住院缺少基本医院分级' });
    }
    // Check ratio range
    for (const [tierKey, t] of Object.entries(tb)) {
      if (!t) continue;
      if (t.reimbursementRatio < 0.50 || t.reimbursementRatio > 1.0) {
        issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_RATIO', detail: `职工住院 ${tierKey} 比例异常: ${t.reimbursementRatio}` });
      }
      if (t.deductible < 0 || t.deductible > 5000) {
        issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_DEDUCTIBLE', detail: `职工住院 ${tierKey} 起付线异常: ${t.deductible}` });
      }
    }
  }

  // 3. Resident Inpatient check
  const ri = city.resident?.inpatient;
  if (!ri) {
    issues.push({ cityCode, cityName, provinceName, type: 'MISSING_RESIDENT_INPATIENT', detail: '缺少居民住院待遇' });
  } else {
    const tb = ri.tierBenefits;
    if (!tb.tier1 || !tb.tier2 || !tb.tier3) {
      issues.push({ cityCode, cityName, provinceName, type: 'MISSING_INPATIENT_TIERS', detail: '居民住院缺少基本医院分级' });
    }
    for (const [tierKey, t] of Object.entries(tb)) {
      if (!t) continue;
      if (t.reimbursementRatio < 0.45 || t.reimbursementRatio > 1.0) {
        issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_RATIO', detail: `居民住院 ${tierKey} 比例异常: ${t.reimbursementRatio}` });
      }
      if (t.deductible < 0 || t.deductible > 3000) {
        issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_DEDUCTIBLE', detail: `居民住院 ${tierKey} 起付线异常: ${t.deductible}` });
      }
    }
  }

  // 4. Employee Outpatient check
  const eo = city.employee?.outpatient;
  if (!eo) {
    issues.push({ cityCode, cityName, provinceName, type: 'MISSING_EMPLOYEE_OUTPATIENT', detail: '缺少职工门诊待遇' });
  } else {
    if (!eo.annualCap || eo.annualCap < 500 || eo.annualCap > 50000) {
      issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_OUTPATIENT_CAP', detail: `职工门诊封顶线异常: ${eo.annualCap}` });
    }
  }

  // 5. Resident Outpatient check
  const ro = city.resident?.outpatient;
  if (!ro) {
    issues.push({ cityCode, cityName, provinceName, type: 'MISSING_RESIDENT_OUTPATIENT', detail: '缺少居民门诊待遇' });
  } else {
    if (!ro.annualCap || ro.annualCap < 50 || ro.annualCap > 10000) {
      issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_RESIDENT_OUTPATIENT_CAP', detail: `居民门诊封顶线异常: ${ro.annualCap}` });
    }
  }

  // 6. Catastrophic check
  const cat = city.resident?.catastrophic;
  if (!cat) {
    issues.push({ cityCode, cityName, provinceName, type: 'MISSING_CATASTROPHIC', detail: '缺少居民大病保险' });
  } else {
    if (cat.deductible < 5000 || cat.deductible > 30000) {
      issues.push({ cityCode, cityName, provinceName, type: 'ABNORMAL_CAT_DED', detail: `居民大病起付线异常: ${cat.deductible}` });
    }
  }
}

console.log(`Total general issues: ${issues.length}`);
for (const i of issues) {
  console.log(`- [${i.provinceName} - ${i.cityName}] ${i.type}: ${i.detail}`);
}
