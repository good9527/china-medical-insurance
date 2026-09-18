import { allCities } from '../data';

interface DataSourceIssue {
  cityCode: string;
  cityName: string;
  provinceName: string;
  issueType: '异地比例混淆' | '临时/拼凑文号' | '母体文件缺失' | '比例失真';
  detail: string;
  sourceDocNumber?: string;
}

const issues: DataSourceIssue[] = [];

for (const city of allCities) {
  const ri = city.resident?.inpatient;
  const ro = city.resident?.outpatient;
  const ei = city.employee?.inpatient;

  // 1. 检查引用的 sourceDocs 是否存在拼凑文号或非正式公文
  for (const doc of city.sourceDocs) {
    if (doc.docNumber.includes('等现行') || doc.docNumber.includes('一览表') || doc.docNumber.includes('待核准') || doc.docNumber.includes('参考')) {
      issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        issueType: '临时/拼凑文号',
        detail: `公文文号含非正式公文标记: "${doc.docNumber}" (文件: ${doc.title})`,
        sourceDocNumber: doc.docNumber
      });
    }
  }

  // 2. 检查居民住院二级定点比例是否异样（低于70%通常属于异地就医或特殊下浮比例被误植）
  if (ri?.tierBenefits?.tier2?.reimbursementRatio) {
    const ratio = ri.tierBenefits.tier2.reimbursementRatio;
    if (ratio < 0.70) {
      issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        issueType: '异地比例混淆',
        detail: `居民二级住院比例仅为 ${(ratio * 100).toFixed(0)}%，疑似误采异地转诊下调比例（正常本地二级通常 75%~85%）`
      });
    }
  }

  // 3. 检查居民住院三级定点比例是否过低（低于50%通常属于异地就医比例）
  if (ri?.tierBenefits?.tier3?.reimbursementRatio) {
    const ratio = ri.tierBenefits.tier3.reimbursementRatio;
    if (ratio < 0.50) {
      issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        issueType: '异地比例混淆',
        detail: `居民三级住院比例仅为 ${(ratio * 100).toFixed(0)}%，低于国家政策底线 50%，疑似误采未备案/异地就医比例`
      });
    }
  }

  // 4. 检查引用的住院依据文件是否与门诊文件混淆（如 sourceDocId 指向门诊文件）
  if (ri?.sourceDocId) {
    const doc = city.sourceDocs.find(d => d.docId === ri.sourceDocId);
    if (doc && (doc.title.includes('门诊') && !doc.title.includes('住院') && !doc.title.includes('统筹') && !doc.title.includes('办法') && !doc.title.includes('实施细则'))) {
      issues.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        issueType: '母体文件缺失',
        detail: `居民住院数据绑定了纯门诊文件: ${doc.title} (${doc.docNumber})`
      });
    }
  }
}

console.log(`=== 全国 344 统筹区“咸阳式数据源根源问题”全面排查 ===`);
console.log(`发现潜在问题统筹区: ${issues.length} 项\n`);

const group = new Map<string, DataSourceIssue[]>();
for (const issue of issues) {
  if (!group.has(issue.provinceName)) group.set(issue.provinceName, []);
  group.get(issue.provinceName)!.push(issue);
}

for (const [prov, list] of group.entries()) {
  console.log(`【${prov}】(${list.length} 项需核查):`);
  for (const item of list) {
    console.log(`  - ${item.cityName} (${item.cityCode}): [${item.issueType}] ${item.detail}`);
  }
}
