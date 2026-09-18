import { allCities } from '../data';

interface AnomalyReport {
  cityCode: string;
  cityName: string;
  provinceName: string;
  category: 'SUSPECTED_REMOTE_RATIO' | 'ODD_RATIO' | 'INVALID_DOC_NUMBER' | 'CLONED_DATA';
  description: string;
  currentData: string;
}

const reports: AnomalyReport[] = [];

// 1. 扫描全国统筹区的居民住院比例异常
for (const city of allCities) {
  const ri = city.resident?.inpatient;
  const ei = city.employee?.inpatient;
  const eo = city.employee?.outpatient;
  const ro = city.resident?.outpatient;

  // A. 居民二级比例偏低（低于75%通常是把异地就医或特殊下调比例误采了）
  if (ri?.tierBenefits?.tier2?.reimbursementRatio !== undefined) {
    const r2 = ri.tierBenefits.tier2.reimbursementRatio;
    if (r2 < 0.75) {
      reports.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        category: 'SUSPECTED_REMOTE_RATIO',
        description: `居民二级住院比例仅 ${(r2 * 100).toFixed(1)}%（正常本地二级通常应在 75%~85% 之间）`,
        currentData: `二级比例: ${(r2 * 100).toFixed(1)}%`
      });
    }
  }

  // B. 居民三级比例偏低（低于60%极可能是误采了异地就医或未备案转外比例）
  if (ri?.tierBenefits?.tier3?.reimbursementRatio !== undefined) {
    const r3 = ri.tierBenefits.tier3.reimbursementRatio;
    if (r3 < 0.60) {
      reports.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        category: 'SUSPECTED_REMOTE_RATIO',
        description: `居民三级住院比例仅 ${(r3 * 100).toFixed(1)}%（正常本地三级通常在 60%~75% 之间，低于60%极可能是异地转诊比例）`,
        currentData: `三级比例: ${(r3 * 100).toFixed(1)}%`
      });
    }
  }

  // C. 奇数/奇怪的救助过渡比例（如类似 78%、72%、68% 等非 5% 整数倍的比例，极可能是扶贫救助兜底比例误植）
  if (ri?.tierBenefits?.tier2?.reimbursementRatio !== undefined) {
    const r2 = Math.round(ri.tierBenefits.tier2.reimbursementRatio * 100);
    if (r2 % 5 !== 0) {
      reports.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        category: 'ODD_RATIO',
        description: `居民二级住院比例为非标准整档 ${r2}%（需核实是否为脱贫攻坚或特定救助过渡兜底比例）`,
        currentData: `二级比例: ${r2}%`
      });
    }
  }

  if (ri?.tierBenefits?.tier3?.reimbursementRatio !== undefined) {
    const r3 = Math.round(ri.tierBenefits.tier3.reimbursementRatio * 100);
    if (r3 % 5 !== 0) {
      reports.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        category: 'ODD_RATIO',
        description: `居民三级住院比例为非标准整档 ${r3}%（需核实是否为异地就医浮动或特殊救助比例）`,
        currentData: `三级比例: ${r3}%`
      });
    }
  }

  // D. 职工住院比例中异常非整档比例
  if (ei?.tierBenefits?.tier3?.reimbursementRatio !== undefined) {
    const r3 = Math.round(ei.tierBenefits.tier3.reimbursementRatio * 100);
    if (r3 % 2 !== 0 && r3 % 5 !== 0) {
      reports.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        category: 'ODD_RATIO',
        description: `职工三级住院比例为异常档位 ${r3}%`,
        currentData: `职工三级: ${r3}%`
      });
    }
  }

  // E. 检查公文文号中是否有“一览表”、“现行参考”、“实施细则汇总”等非正规红头文号
  for (const doc of city.sourceDocs) {
    const num = doc.docNumber || '';
    if (!num.includes('〔') && !num.includes('(') && !num.includes('【') && !num.includes('第') && !num.includes('号')) {
      reports.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        category: 'INVALID_DOC_NUMBER',
        description: `依据公文文号不规范，缺少标准发文字号: "${num}" (${doc.title})`,
        currentData: `docNumber: ${num}`
      });
    }
  }
}

console.log(`================================================================================`);
console.log(`🔍 全国 344 个统筹区“咸阳式数据病灶”地毯式深度排查报告`);
console.log(`================================================================================`);
console.log(`总计扫描统筹区: ${allCities.length} 个`);
console.log(`检出疑似异常项: ${reports.length} 项\n`);

const provGroup = new Map<string, AnomalyReport[]>();
for (const r of reports) {
  if (!provGroup.has(r.provinceName)) provGroup.set(r.provinceName, []);
  provGroup.get(r.provinceName)!.push(r);
}

for (const [prov, list] of provGroup.entries()) {
  console.log(`\n【${prov}】 (共 ${list.length} 个重点怀疑点):`);
  for (const item of list) {
    console.log(`  - ${item.cityName.padEnd(6, '　')} (${item.cityCode}) [${item.category}] ${item.description}`);
  }
}
