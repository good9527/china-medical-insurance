import { allCities } from '../data';
import type { CityInsuranceData } from '../data/types';

interface QualityReport {
  cityCode: string;
  cityName: string;
  provinceName: string;
  sourceDocCount: number;
  hasActiveDoc: boolean;
  hasValidUrls: boolean;
  hasQuotes: boolean;
  issues: string[];
}

export function validateAllCities(): { total: number; valid: number; reports: QualityReport[] } {
  const reports: QualityReport[] = [];
  let validCount = 0;

  for (const city of allCities) {
    const issues: string[] = [];

    // 1. 检验官方文件依据
    if (!city.sourceDocs || city.sourceDocs.length < 2) {
      issues.push(`官方凭证不足: 仅有 ${city.sourceDocs?.length || 0} 篇，标准至少2篇`);
    }

    let hasActive = false;
    let allUrlsValid = true;
    let allHaveQuotes = true;

    for (const doc of (city.sourceDocs || [])) {
      if (doc.status === 'active') hasActive = true;
      if (!doc.officialUrl || !doc.officialUrl.startsWith('http')) {
        allUrlsValid = false;
        issues.push(`文件 [${doc.title}] 缺少合规官方URL`);
      }
      if (!doc.docNumber || doc.docNumber.trim() === '') {
        issues.push(`文件 [${doc.title}] 缺少正规发文字号`);
      }
      if (!doc.summaryQuote || doc.summaryQuote.trim().length < 10) {
        allHaveQuotes = false;
        issues.push(`文件 [${doc.title}] 缺少清晰政策条款原文摘录`);
      }
    }

    if (!hasActive) {
      issues.push('缺少现行有效(status: active)的支撑文件');
    }

    // 2. 检验职工待遇包
    if (!city.employee) {
      issues.push('缺失职工医保待遇配置(employee)');
    } else {
      if (!city.employee.outpatient) issues.push('职工缺失门诊待遇(outpatient)');
      if (!city.employee.inpatient) issues.push('职工缺失住院待遇(inpatient)');
      if (!city.employee.catastrophic) issues.push('职工缺失大病/大额救助配置(catastrophic)');
      if (!city.employee.remoteMedical) issues.push('职工缺失异地就医规则(remoteMedical)');
    }

    // 3. 检验居民待遇包
    if (!city.resident) {
      issues.push('缺失居民医保待遇配置(resident)');
    } else {
      if (!city.resident.outpatient) issues.push('居民缺失门诊待遇(outpatient)');
      if (!city.resident.inpatient) issues.push('居民缺失住院待遇(inpatient)');
      if (!city.resident.catastrophic) issues.push('居民缺失大病保险配置(catastrophic)');
      if (!city.resident.remoteMedical) issues.push('居民缺失异地就医规则(remoteMedical)');
    }

    const isValid = issues.length === 0;
    if (isValid) validCount++;

    reports.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      sourceDocCount: city.sourceDocs?.length || 0,
      hasActiveDoc: hasActive,
      hasValidUrls: allUrlsValid,
      hasQuotes: allHaveQuotes,
      issues
    });
  }

  return {
    total: allCities.length,
    valid: validCount,
    reports
  };
}

if (typeof require !== 'undefined' && require.main === module) {
  const result = validateAllCities();
  console.log(`\n======================================================`);
  console.log(`全国医保数据工程规范性与完整性检查审计报告`);
  console.log(`纳管统筹区总数: ${result.total} | 规范合规通过数: ${result.valid}`);
  console.log(`质量合规率: ${((result.valid / result.total) * 100).toFixed(2)}%`);
  console.log(`======================================================\n`);

  const failed = result.reports.filter(r => r.issues.length > 0);
  if (failed.length > 0) {
    console.error(`发现 ${failed.length} 个统筹区存在不规范数据项:`);
    for (const f of failed) {
      console.error(`- [${f.provinceName} ${f.cityName} (${f.cityCode})]:`);
      f.issues.forEach(iss => console.error(`    * ${iss}`));
    }
    process.exit(1);
  } else {
    console.log(`✅ 所有已录入统筹区（${result.total}个）均完全符合规范化审计标准，无任何缺项！\n`);
  }
}
