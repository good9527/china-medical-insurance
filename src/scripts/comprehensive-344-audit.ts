import { allCities } from '../data';

interface Issue {
  cityCode: string;
  cityName: string;
  provinceName: string;
  level: 'CRITICAL' | 'WARNING' | 'NOTICE';
  type: string;
  message: string;
}

const issues: Issue[] = [];

for (const c of allCities) {
  const code = c.cityCode;
  const name = c.cityName;
  const prov = c.provinceName;

  const ri = c.resident?.inpatient;
  const ro = c.resident?.outpatient;
  const rCat = c.resident?.catastrophic;

  const ei = c.employee?.inpatient;
  const eo = c.employee?.outpatient;
  const eCat = c.employee?.catastrophic;

  // --- 1. 住院起付线单调性与合理性 ---
  if (ri?.tierBenefits) {
    const d1 = ri.tierBenefits.tier1?.deductible ?? 0;
    const d2 = ri.tierBenefits.tier2?.deductible ?? 0;
    const d3 = ri.tierBenefits.tier3?.deductible ?? 0;
    if (d1 > d2 || d2 > d3) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '居民住院起付线倒挂',
        message: `一级=${d1}, 二级=${d2}, 三级=${d3}`
      });
    }
    if (d1 > 800 || d1 < 50) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'WARNING',
        type: '居民一级起付线可能失真',
        message: `一级=${d1}`
      });
    }
    if (d3 > 3500 || d3 < 300) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'WARNING',
        type: '居民三级起付线可能失真',
        message: `三级=${d3}`
      });
    }
  }

  if (ei?.tierBenefits) {
    const d1 = ei.tierBenefits.tier1?.deductible ?? 0;
    const d2 = ei.tierBenefits.tier2?.deductible ?? 0;
    const d3 = ei.tierBenefits.tier3?.deductible ?? 0;
    if (d1 > d2 || d2 > d3) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '职工住院起付线倒挂',
        message: `一级=${d1}, 二级=${d2}, 三级=${d3}`
      });
    }
  }

  // --- 2. 住院报销比例单调性与合理性 ---
  if (ri?.tierBenefits) {
    const r1 = ri.tierBenefits.tier1?.reimbursementRatio ?? 0;
    const r2 = ri.tierBenefits.tier2?.reimbursementRatio ?? 0;
    const r3 = ri.tierBenefits.tier3?.reimbursementRatio ?? 0;
    if (r1 < r2 || r2 < r3) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '居民住院比例倒挂',
        message: `一级=${(r1 * 100).toFixed(1)}%, 二级=${(r2 * 100).toFixed(1)}%, 三级=${(r3 * 100).toFixed(1)}%`
      });
    }
    if (r3 < 0.50) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'WARNING',
        type: '居民三级比例过低',
        message: `三级=${(r3 * 100).toFixed(1)}%`
      });
    }
  }

  if (ei?.tierBenefits) {
    const r1 = ei.tierBenefits.tier1?.reimbursementRatio ?? 0;
    const r2 = ei.tierBenefits.tier2?.reimbursementRatio ?? 0;
    const r3 = ei.tierBenefits.tier3?.reimbursementRatio ?? 0;
    if (r1 < r2 || r2 < r3) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '职工住院比例倒挂',
        message: `一级=${(r1 * 100).toFixed(1)}%, 二级=${(r2 * 100).toFixed(1)}%, 三级=${(r3 * 100).toFixed(1)}%`
      });
    }
    if (r3 < 0.70) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'WARNING',
        type: '职工三级比例过低',
        message: `三级=${(r3 * 100).toFixed(1)}%`
      });
    }
  }

  // --- 3. 门诊封顶与起付线合理性 ---
  if (ro) {
    if (ro.annualCap && ro.annualDeductible && ro.annualCap <= ro.annualDeductible) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '居民门诊封顶与起付倒挂',
        message: `封顶=${ro.annualCap}, 起付=${ro.annualDeductible}`
      });
    }
    if (ro.annualCap && ro.annualCap < 50) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'WARNING',
        type: '居民门诊封顶过低',
        message: `封顶=${ro.annualCap}`
      });
    }
  }

  if (eo) {
    if (eo.annualCap && eo.annualCap < 999999 && eo.annualDeductible && eo.annualCap <= eo.annualDeductible) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '职工门诊封顶与起付倒挂',
        message: `封顶=${eo.annualCap}, 起付=${eo.annualDeductible}`
      });
    }
  }

  // --- 4. 大病保险合理性 ---
  if (rCat) {
    if (rCat.deductible <= 0 || rCat.deductible > 40000) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'WARNING',
        type: '居民大病起付线异常',
        message: `大病起付=${rCat.deductible}`
      });
    }
    if (!rCat.tiers || rCat.tiers.length === 0) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'CRITICAL',
        type: '居民大病缺少报销梯度',
        message: `tiers 为空`
      });
    } else {
      for (let i = 0; i < rCat.tiers.length - 1; i++) {
        if (rCat.tiers[i].ratio > rCat.tiers[i + 1].ratio) {
          issues.push({
            cityCode: code, cityName: name, provinceName: prov,
            level: 'CRITICAL',
            type: '居民大病阶梯比例倒挂',
            message: `段${i + 1}(${(rCat.tiers[i].ratio * 100).toFixed(0)}%) > 段${i + 2}(${(rCat.tiers[i + 1].ratio * 100).toFixed(0)}%)`
          });
        }
      }
    }
  } else {
    issues.push({
      cityCode: code, cityName: name, provinceName: prov,
      level: 'WARNING',
      type: '缺少居民大病保险配置',
      message: `resident.catastrophic 未配置`
    });
  }

  // --- 5. 基本封顶线合理性 ---
  if (ri?.maxPaymentLimit !== undefined) {
    if (ri.maxPaymentLimit < 50000 || ri.maxPaymentLimit > 500000) {
      issues.push({
        cityCode: code, cityName: name, provinceName: prov,
        level: 'NOTICE',
        type: '居民基本医保封顶线需核实',
        message: `基本封顶=${ri.maxPaymentLimit}`
      });
    }
  }
  // --- 6. 门诊/住院未覆盖层级虚假待遇/复制粘贴错误检测 ---
  for (const group of ['employee', 'resident'] as const) {
    for (const kind of ['outpatient', 'inpatient'] as const) {
      const section = c[group]?.[kind];
      if (section?.tierBenefits) {
        for (const [tierKey, b] of Object.entries(section.tierBenefits)) {
          const name = b.tierName || '';
          const isMarkedNotCovered = name.includes('未纳统筹') || 
                                     name.includes('未开通') || 
                                     name.includes('未签约') || 
                                     name.includes('不予报销') || 
                                     name.includes('未覆盖') ||
                                     name.includes('未纳入') ||
                                     name.includes('门诊未覆盖') ||
                                     name.includes('不报销') ||
                                     name.includes('未纳门诊');
          if (isMarkedNotCovered && (b.reimbursementRatio > 0 || b.deductible > 0)) {
            issues.push({
              cityCode: code, cityName: name, provinceName: prov,
              level: 'CRITICAL',
              type: `${group === 'employee' ? '职工' : '居民'}${kind === 'outpatient' ? '门诊' : '住院'}未覆盖层级配置了非零待遇(复制残留)`,
              message: `${tierKey} (${name}): deductible=${b.deductible}, ratio=${(b.reimbursementRatio * 100).toFixed(0)}%`
            });
          }
        }
      }
    }
  }

}

console.log('================================================================================');
console.log(`📋 全国 344 个统筹区全量规则化深度审查结果`);
console.log('================================================================================');
console.log(`总计排查统筹区: ${allCities.length} 个`);
console.log(`发现问题项总计: ${issues.length} 项`);

const critical = issues.filter(i => i.level === 'CRITICAL');
const warning = issues.filter(i => i.level === 'WARNING');
const notice = issues.filter(i => i.level === 'NOTICE');

console.log(`- 严重阻断性问题 (CRITICAL): ${critical.length} 项`);
console.log(`- 重点需核实预警 (WARNING):  ${warning.length} 项`);
console.log(`- 参保限额关注项 (NOTICE):   ${notice.length} 项\n`);

if (critical.length > 0) {
  console.log(`🚨 【严重阻断性问题 CRITICAL】 (共 ${critical.length} 项):`);
  for (const c of critical) {
    console.log(`  [${c.provinceName} ${c.cityName}] (${c.cityCode}) ${c.type}: ${c.message}`);
  }
}

if (warning.length > 0) {
  console.log(`\n⚠️ 【重点需核实预警 WARNING】 (共 ${warning.length} 项):`);
  for (const w of warning) {
    console.log(`  [${w.provinceName} ${w.cityName}] (${w.cityCode}) ${w.type}: ${w.message}`);
  }
}



if (notice.length > 0) {
  console.log(`\nℹ️ 【参保限额关注项 NOTICE】 (共 ${notice.length} 项，展示前 15 项):`);
  for (const n of notice.slice(0, 15)) {
    console.log(`  [${n.provinceName} ${n.cityName}] (${n.cityCode}) ${n.type}: ${n.message}`);
  }
}
