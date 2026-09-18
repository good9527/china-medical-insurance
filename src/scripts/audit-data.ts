import { allCities } from '../data';
import { provinceList } from '../data/provinces';

interface AuditIssue {
  cityCode: string;
  cityName: string;
  category: 'hierarchy' | 'deductible' | 'ratio' | 'doc' | 'cap' | 'remote';
  message: string;
  severity: 'error' | 'warning';
}

export function runFullAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const cityEntries = Object.entries(allCities);
  console.log(`\n🔍 开始对全国 ${cityEntries.length} 个统筹区医保政策数据进行地毯式深度核查...\n`);

  for (const [code, city] of cityEntries) {
    if (!city) {
      issues.push({
        cityCode: code,
        cityName: code,
        category: 'hierarchy',
        severity: 'error',
        message: `城市数据对象为空或未导出`
      });
      continue;
    }

    const empOut = city.employee?.outpatient;
    const empIn = city.employee?.inpatient;
    const resOut = city.resident?.outpatient;
    const resIn = city.resident?.inpatient;
    const remote = city.remoteHealthcare;

    if (!empIn || !empOut || !resIn || !resOut) {
      issues.push({
        cityCode: code,
        cityName: city.cityName || code,
        category: 'hierarchy',
        severity: 'error',
        message: `缺少核心待遇模块 (empIn: ${!!empIn}, empOut: ${!!empOut}, resIn: ${!!resIn}, resOut: ${!!resOut})`
      });
      continue;
    }

    // 1. 住院保障 tierBenefits 完整性及数值合理性核查 (职工 + 居民)
    for (const [typeName, inRule] of [['职工住院', empIn], ['居民住院', resIn]] as const) {
      if (!inRule.tierBenefits) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'hierarchy',
          severity: 'error',
          message: `${typeName} 缺少 tierBenefits 医院分级对象`
        });
        continue;
      }

      const t1 = inRule.tierBenefits.tier1;
      const t2 = inRule.tierBenefits.tier2;
      const t3 = inRule.tierBenefits.tier3;

      // 起付线阶梯检查 (三级 >= 二级 >= 一级)
      if (t3 && t2 && t3.deductible < t2.deductible) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'deductible',
          severity: 'error',
          message: `${typeName} 三级起付线(¥${t3.deductible})低于二级起付线(¥${t2.deductible})`
        });
      }
      if (t2 && t1 && t2.deductible < t1.deductible) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'deductible',
          severity: 'error',
          message: `${typeName} 二级起付线(¥${t2.deductible})低于一级起付线(¥${t1.deductible})`
        });
      }

      // 报销比例阶梯检查 (三级 <= 二级 <= 一级)
      if (t3 && t2 && t3.reimbursementRatio > t2.reimbursementRatio) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'ratio',
          severity: 'error',
          message: `${typeName} 三级报销比例(${(t3.reimbursementRatio * 100).toFixed(1)}%)反常高于二级(${(t2.reimbursementRatio * 100).toFixed(1)}%)`
        });
      }
      if (t2 && t1 && t2.reimbursementRatio > t1.reimbursementRatio) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'ratio',
          severity: 'error',
          message: `${typeName} 二级报销比例(${(t2.reimbursementRatio * 100).toFixed(1)}%)反常高于一级(${(t1.reimbursementRatio * 100).toFixed(1)}%)`
        });
      }

      // 封顶线合理性
      if (inRule.annualCap < 30000 && !inRule.comprehensiveCap) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'cap',
          severity: 'warning',
          message: `${typeName} 基本统筹封顶线(¥${inRule.annualCap})偏低且未注明综合保障额度`
        });
      }
    }

    // 2. 门诊保障 tierBenefits 完整性及数值合理性核查
    for (const [typeName, outRule] of [['职工门诊', empOut], ['居民门诊', resOut]] as const) {
      if (!outRule.tierBenefits) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'hierarchy',
          severity: 'error',
          message: `${typeName} 缺少 tierBenefits 医院分级对象`
        });
        continue;
      }

      const t1 = outRule.tierBenefits.tier1;
      const t2 = outRule.tierBenefits.tier2;
      const t3 = outRule.tierBenefits.tier3;

      // 报销比例阶梯检查 (三级 <= 二级 <= 一级)
      if (t3 && t2 && t3.reimbursementRatio > t2.reimbursementRatio) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'ratio',
          severity: 'error',
          message: `${typeName} 三级门诊报销比例(${(t3.reimbursementRatio * 100).toFixed(1)}%)反常高于二级(${(t2.reimbursementRatio * 100).toFixed(1)}%)`
        });
      }
      if (t2 && t1 && t2.reimbursementRatio > t1.reimbursementRatio) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'ratio',
          severity: 'error',
          message: `${typeName} 二级门诊报销比例(${(t2.reimbursementRatio * 100).toFixed(1)}%)反常高于一级(${(t1.reimbursementRatio * 100).toFixed(1)}%)`
        });
      }

      // 退休门诊起付线不能高于在职门诊起付线
      if (typeName === '职工门诊' && outRule.annualDeductibleRetiree !== undefined && outRule.annualDeductibleRetiree > outRule.annualDeductible) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'deductible',
          severity: 'error',
          message: `退休人员门诊起付线(¥${outRule.annualDeductibleRetiree})高于在职起付线(¥${outRule.annualDeductible})`
        });
      }
    }

    // 3. 异地就医合理性
    if (remote) {
      if (remote.transferFiledRatio < remote.unfiledNormalRatio) {
        issues.push({
          cityCode: code,
          cityName: city.cityName,
          category: 'remote',
          severity: 'error',
          message: `异地转诊备案比例(${remote.transferFiledRatio})反常低于未备案自行就医(${remote.unfiledNormalRatio})`
        });
      }
    }

    // 4. 官方参考公文规范性
    if (!city.sourceDocs || city.sourceDocs.length === 0) {
      issues.push({
        cityCode: code,
        cityName: city.cityName,
        category: 'doc',
        severity: 'error',
        message: `缺少官方规范性依据公文`
      });
    } else {
      for (const doc of city.sourceDocs) {
        if (doc.docNumber && (doc.docNumber.includes('XX') || doc.docNumber.includes('202X') || doc.title.includes('TODO'))) {
          issues.push({
            cityCode: code,
            cityName: city.cityName,
            category: 'doc',
            severity: 'error',
            message: `公文文号含有占位符: ${doc.docNumber} - ${doc.title}`
          });
        }
      }
    }
  }

  return issues;
}

const found = runFullAudit();
console.log(`\n══════════════════════════════════════════════════════════`);
console.log(`📊 核查结果统计：共发现 ${found.length} 项潜在异常或不规范之处`);
console.log(`══════════════════════════════════════════════════════════`);

const errors = found.filter(f => f.severity === 'error');
const warnings = found.filter(f => f.severity === 'warning');

console.log(`❌ 致命逻辑/数据错误: ${errors.length} 项`);
console.log(`⚠️ 需核验预警: ${warnings.length} 项\n`);

errors.forEach((err, i) => {
  console.log(`${i + 1}. [${err.cityName} ${err.cityCode}] [${err.category}] ${err.message}`);
});

if (warnings.length > 0) {
  console.log(`\n--- 预警项清单 (前 30 条) ---`);
  warnings.slice(0, 30).forEach((w, i) => {
    console.log(`${i + 1}. [${w.cityName} ${w.cityCode}] [${w.category}] ${w.message}`);
  });
}
