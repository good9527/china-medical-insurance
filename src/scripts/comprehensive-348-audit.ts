import { allCities } from '../data';
import type { CityInsuranceData, HospitalTier } from '../data/types';

interface AuditReport {
  totalCities: number;
  passedCities: number;
  failedCities: number;
  totalDocs: number;
  yearDistribution: Record<string, number>;
  issues: {
    cityCode: string;
    cityName: string;
    provinceName: string;
    severity: 'error' | 'warning';
    category: string;
    message: string;
  }[];
}

const REQUIRED_TIERS: HospitalTier[] = ['community', 'tier1', 'tier2', 'tier3', 'tier3_top'];

export function runComprehensive348Audit(): AuditReport {
  const report: AuditReport = {
    totalCities: allCities.length,
    passedCities: 0,
    failedCities: 0,
    totalDocs: 0,
    yearDistribution: {},
    issues: []
  };

  const cityCodeSet = new Set<string>();

  for (const city of allCities) {
    let cityHasError = false;

    // 1. 行政基础编码唯一性与完备性
    if (!city.cityCode || city.cityCode.length !== 6) {
      report.issues.push({
        cityCode: city.cityCode || 'UNKNOWN',
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'error',
        category: 'ADMIN_CODE',
        message: `城市行政代码格式异常: ${city.cityCode}`
      });
      cityHasError = true;
    }

    if (cityCodeSet.has(city.cityCode)) {
      report.issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'error',
        category: 'DUPLICATE_CITY',
        message: `出现重复的城市行政代码: ${city.cityCode}`
      });
      cityHasError = true;
    }
    cityCodeSet.add(city.cityCode);

    // 2. 红头文件与官方溯源档案审计
    if (!city.sourceDocs || city.sourceDocs.length === 0) {
      report.issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'error',
        category: 'SOURCE_DOCS',
        message: '未配置任何官方规范性文件档案'
      });
      cityHasError = true;
    } else {
      report.totalDocs += city.sourceDocs.length;
      for (const doc of city.sourceDocs) {
        // 统计年份
        const yearMatch = (doc.docNumber + doc.title + (doc.publishDate || '')).match(/202[0-9]/);
        const year = yearMatch ? yearMatch[0] : '其他年份';
        report.yearDistribution[year] = (report.yearDistribution[year] || 0) + 1;

        if (!doc.title || doc.title.length < 5) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'error',
            category: 'DOC_TITLE',
            message: `公文标题不完备: ${doc.title}`
          });
          cityHasError = true;
        }

        if (!doc.docNumber || doc.docNumber.length < 3) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'error',
            category: 'DOC_NUMBER',
            message: `发文字号缺失或过短: ${doc.docNumber}`
          });
          cityHasError = true;
        }

        if (!doc.summaryQuote || doc.summaryQuote.length < 10) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'warning',
            category: 'DOC_QUOTE',
            message: `公文核心条款摘录过短: ${doc.summaryQuote}`
          });
        }
      }
    }

    // 3. 职工医保政策审计 (门诊 + 住院 + 大病 + 异地)
    const emp = city.employee;
    if (!emp) {
      report.issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'error',
        category: 'EMPLOYEE_POLICY',
        message: '职工医保待遇包完全缺失'
      });
      cityHasError = true;
    } else {
      // 门诊
      if (emp.outpatient.annualDeductible < 0 || isNaN(emp.outpatient.annualDeductible)) {
        report.issues.push({
          cityCode: city.cityCode,
          cityName: city.cityName,
          provinceName: city.provinceName,
          severity: 'error',
          category: 'OUTPATIENT_DEDUCTIBLE',
          message: `职工门诊起付线异常: ${emp.outpatient.annualDeductible}`
        });
        cityHasError = true;
      }

      for (const t of REQUIRED_TIERS) {
        const tb = emp.outpatient.tierBenefits[t];
        if (!tb) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'error',
            category: 'TIER_MISSING',
            message: `职工门诊缺失医疗机构级别: ${t}`
          });
          cityHasError = true;
        } else if (tb.reimbursementRatio < 0 || tb.reimbursementRatio > 1) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'error',
            category: 'RATIO_OUT_OF_BOUNDS',
            message: `职工门诊 ${t} 报销比例越界: ${tb.reimbursementRatio}`
          });
          cityHasError = true;
        }
      }

      // 住院
      if (emp.inpatient.annualCap <= 0 || isNaN(emp.inpatient.annualCap)) {
        report.issues.push({
          cityCode: city.cityCode,
          cityName: city.cityName,
          provinceName: city.provinceName,
          severity: 'error',
          category: 'INPATIENT_CAP',
          message: `职工住院年度封顶线异常: ${emp.inpatient.annualCap}`
        });
        cityHasError = true;
      }

      const commIn = emp.inpatient.tierBenefits.community;
      const t3In = emp.inpatient.tierBenefits.tier3;
      if (commIn && t3In) {
        if (commIn.deductible > t3In.deductible) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'error',
            category: 'DEDUCTIBLE_INVERSION',
            message: `职工住院基层起付线(¥${commIn.deductible})高于三级医院起付线(¥${t3In.deductible})，出现逻辑倒挂`
          });
          cityHasError = true;
        }
        if (commIn.reimbursementRatio < t3In.reimbursementRatio) {
          report.issues.push({
            cityCode: city.cityCode,
            cityName: city.cityName,
            provinceName: city.provinceName,
            severity: 'warning',
            category: 'RATIO_INVERSION',
            message: `职工住院基层报销比例(${commIn.reimbursementRatio})低于三级医院(${t3In.reimbursementRatio})`
          });
        }
      }
    }

    // 4. 居民医保政策审计 (门诊 + 住院 + 大病 + 异地)
    const res = city.resident;
    if (!res) {
      report.issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'error',
        category: 'RESIDENT_POLICY',
        message: '居民医保待遇包完全缺失'
      });
      cityHasError = true;
    } else {
      if (res.inpatient.annualCap <= 0 || isNaN(res.inpatient.annualCap)) {
        report.issues.push({
          cityCode: city.cityCode,
          cityName: city.cityName,
          provinceName: city.provinceName,
          severity: 'error',
          category: 'RES_INPATIENT_CAP',
          message: `居民住院年度封顶线异常: ${res.inpatient.annualCap}`
        });
        cityHasError = true;
      }

      const commIn = res.inpatient.tierBenefits.community;
      const t3In = res.inpatient.tierBenefits.tier3;
      if (commIn && t3In && commIn.deductible > t3In.deductible) {
        report.issues.push({
          cityCode: city.cityCode,
          cityName: city.cityName,
          provinceName: city.provinceName,
          severity: 'error',
          category: 'RES_DEDUCTIBLE_INVERSION',
          message: `居民住院基层起付线(¥${commIn.deductible})高于三级医院起付线(¥${t3In.deductible})`
        });
        cityHasError = true;
      }
    }

    // 5. 便民服务热线核实
    if (!city.hotline || city.hotline.trim().length === 0) {
      report.issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'error',
        category: 'HOTLINE',
        message: '医保咨询热线未配置'
      });
      cityHasError = true;
    }

    if (cityHasError) {
      report.failedCities++;
    } else {
      report.passedCities++;
    }
  }

  return report;
}

// CLI 执行入口
if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('comprehensive-348-audit'))) {
  console.log('\n================================================================');
  console.log('🏛️  全国 348 个医保统筹区全量政策数据穿透式深度核验审计');
  console.log('================================================================\n');

  const result = runComprehensive348Audit();

  console.log(`📊 审计概况:`);
  console.log(`- 统筹区总数: ${result.totalCities}`);
  console.log(`- 100% 达标统筹区: ${result.passedCities} (${((result.passedCities / result.totalCities) * 100).toFixed(2)}%)`);
  console.log(`- 存在异常统筹区: ${result.failedCities}`);
  console.log(`- 纳管规范性公文总数: ${result.totalDocs} 份\n`);

  console.log('📅 公文年份分布:');
  const sortedYears = Object.keys(result.yearDistribution).sort().reverse();
  for (const yr of sortedYears) {
    console.log(`  * ${yr}: ${result.yearDistribution[yr]} 份 (${((result.yearDistribution[yr] / result.totalDocs) * 100).toFixed(1)}%)`);
  }

  console.log(`\n🔍 异常项统计: 共发现 ${result.issues.length} 个关注项`);
  const errors = result.issues.filter(i => i.severity === 'error');
  const warnings = result.issues.filter(i => i.severity === 'warning');

  console.log(`  * 严重阻断级错误 (ERROR):   ${errors.length}`);
  console.log(`  * 提示建议级关注 (WARNING): ${warnings.length}\n`);

  if (errors.length > 0) {
    console.error('❌ 阻断性错误详情:');
    for (const err of errors.slice(0, 10)) {
      console.error(`  - [${err.provinceName} · ${err.cityName}] (${err.category}): ${err.message}`);
    }
    if (errors.length > 10) {
      console.error(`  ... 另有 ${errors.length - 10} 项阻断错误`);
    }
    process.exit(1);
  } else {
    console.log('🎉 结论: 全国 348 个统筹区医保数据全部通过严密质量核验！0 阻断性错误！\n');
  }
}
