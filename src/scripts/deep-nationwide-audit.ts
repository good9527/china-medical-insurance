import { allCities } from '../data';
import type { CityInsuranceData, HospitalTierBenefit } from '../data/types';

export interface AuditIssue {
  cityCode: string;
  cityName: string;
  provinceName: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  dimension: 'MONOTONICITY' | 'QUOTE_MISMATCH' | 'DOC_STANDARDS' | 'ANOMALY_RATIO' | 'FRESHNESS';
  title: string;
  detail: string;
  expected?: any;
  actual?: any;
}

export function runDeepAudit(): {
  totalCities: number;
  issues: AuditIssue[];
  freshnessStats: Record<string, number>;
} {
  const issues: AuditIssue[] = [];
  const freshnessStats: Record<string, number> = {
    '2025-2026': 0,
    '2024': 0,
    '2022-2023': 0,
    'pre-2022': 0,
  };

  for (const city of allCities) {
    const { cityCode, cityName, provinceName } = city;

    // --- 1. Freshness Audit ---
    let maxYear = 2000;
    for (const doc of city.sourceDocs || []) {
      const pYear = parseInt((doc.publishDate || '').slice(0, 4), 10) || 0;
      const eYear = parseInt((doc.effectiveDate || '').slice(0, 4), 10) || 0;
      const year = Math.max(pYear, eYear);
      if (year > maxYear) maxYear = year;

      // Check document standards
      const docNum = doc.docNumber || '';
      if (docNum.includes('一览表') || docNum.includes('参考') || docNum.includes('待核准') || docNum.includes('等现行')) {
        issues.push({
          cityCode, cityName, provinceName,
          severity: 'CRITICAL',
          dimension: 'DOC_STANDARDS',
          title: '公文文号含有非正式标记',
          detail: `文件 [${doc.title}] 文号为 "${docNum}"`
        });
      }
      if (!docNum.includes('〔') && !docNum.includes('(') && !docNum.includes('【') && !docNum.includes('号') && !docNum.includes('第') && !docNum.includes('令')) {
        issues.push({
          cityCode, cityName, provinceName,
          severity: 'WARNING',
          dimension: 'DOC_STANDARDS',
          title: '公文文号缺少正式公文字样',
          detail: `文件 [${doc.title}] 文号为 "${docNum}"`
        });
      }
      if (!doc.officialUrl || !doc.officialUrl.startsWith('http')) {
        issues.push({
          cityCode, cityName, provinceName,
          severity: 'CRITICAL',
          dimension: 'DOC_STANDARDS',
          title: '公文缺少官方有效链接',
          detail: `文件 [${doc.title}] officialUrl: "${doc.officialUrl}"`
        });
      }
      if (!doc.summaryQuote || doc.summaryQuote.trim().length < 15) {
        issues.push({
          cityCode, cityName, provinceName,
          severity: 'WARNING',
          dimension: 'DOC_STANDARDS',
          title: '公文摘录过短或缺失',
          detail: `文件 [${doc.title}] summaryQuote 长度仅为 ${doc.summaryQuote?.length || 0}`
        });
      }
    }

    if (maxYear >= 2025) {
      freshnessStats['2025-2026']++;
    } else if (maxYear === 2024) {
      freshnessStats['2024']++;
    } else if (maxYear >= 2022) {
      freshnessStats['2022-2023']++;
    } else {
      freshnessStats['pre-2022']++;
      issues.push({
        cityCode, cityName, provinceName,
        severity: 'NOTICE',
        dimension: 'FRESHNESS',
        title: '最新公文年份偏早',
        detail: `最新公文生效年份为 ${maxYear}，建议核实是否有 2023-2026 年新发文`
      });
    }

    // --- 2. Inpatient Monotonicity & Boundary ---
    for (const type of ['employee', 'resident'] as const) {
      const pkg = city[type];
      const label = type === 'employee' ? '职工' : '居民';
      if (!pkg) {
        issues.push({
          cityCode, cityName, provinceName,
          severity: 'CRITICAL',
          dimension: 'DOC_STANDARDS',
          title: `${label}医保待遇包缺失`,
          detail: `city.${type} 为空`
        });
        continue;
      }

      const inp = pkg.inpatient;
      if (inp?.tierBenefits) {
        const tb = inp.tierBenefits;
        const tiers: HospitalTierBenefit[] = [tb.community, tb.tier1, tb.tier2, tb.tier3, tb.tier3_top].filter(Boolean);

        // Deductible Monotonicity
        const d_comm = tb.community?.deductible ?? 0;
        const d_1 = tb.tier1?.deductible ?? d_comm;
        const d_2 = tb.tier2?.deductible ?? 0;
        const d_3 = tb.tier3?.deductible ?? 0;
        const d_top = tb.tier3_top?.deductible ?? d_3;

        if (d_comm > d_1 || d_1 > d_2 || d_2 > d_3 || d_3 > d_top) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}住院起付线倒挂`,
            detail: `社区=${d_comm}, 一级=${d_1}, 二级=${d_2}, 三级=${d_3}, 三甲=${d_top}`,
            actual: { d_comm, d_1, d_2, d_3, d_top }
          });
        }

        // Ratio Monotonicity
        const r_comm = tb.community?.reimbursementRatio ?? 0;
        const r_1 = tb.tier1?.reimbursementRatio ?? r_comm;
        const r_2 = tb.tier2?.reimbursementRatio ?? 0;
        const r_3 = tb.tier3?.reimbursementRatio ?? 0;
        const r_top = tb.tier3_top?.reimbursementRatio ?? r_3;

        // Ratio inversion check: community should >= tier1 >= tier2 >= tier3 >= tier3_top
        if (r_comm < r_1 && r_comm > 0) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}住院报销比例倒挂 (一级高于社区)`,
            detail: `社区=${(r_comm*100).toFixed(0)}%, 一级=${(r_1*100).toFixed(0)}%`
          });
        }
        if (r_1 < r_2 && r_2 > 0) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}住院报销比例倒挂 (二级高于一级)`,
            detail: `一级=${(r_1*100).toFixed(0)}%, 二级=${(r_2*100).toFixed(0)}%`
          });
        }
        if (r_2 < r_3 && r_3 > 0) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}住院报销比例倒挂 (三级高于二级)`,
            detail: `二级=${(r_2*100).toFixed(0)}%, 三级=${(r_3*100).toFixed(0)}%`
          });
        }
        if (r_3 < r_top && r_top > 0) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}住院报销比例倒挂 (三甲高于普通三级)`,
            detail: `三级=${(r_3*100).toFixed(0)}%, 三甲=${(r_top*100).toFixed(0)}%`
          });
        }

        // Retiree overflow check
        for (const t of tiers) {
          const ratio = t.reimbursementRatio || 0;
          const bonus = t.retireeRatioBonus || 0;
          if (ratio + bonus > 1.0) {
            issues.push({
              cityCode, cityName, provinceName,
              severity: 'CRITICAL',
              dimension: 'ANOMALY_RATIO',
              title: `${label}退休住院报销比例突破 100%`,
              detail: `${t.tierName}: 在职 ${(ratio*100).toFixed(0)}% + 退休上浮 ${(bonus*100).toFixed(0)}% = ${((ratio+bonus)*100).toFixed(0)}%`
            });
          }
        }
      }

      // Outpatient Cap vs Deductible
      const op = pkg.outpatient;
      if (op) {
        const cap = op.annualCap ?? 0;
        const ded = op.annualDeductible ?? 0;
        if (cap > 0 && cap < 999999 && ded > 0 && cap <= ded) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}门诊封顶线小于等于起付线`,
            detail: `封顶=${cap}, 起付=${ded}`
          });
        }
        if (op.annualCapRetiree && cap > 0 && op.annualCapRetiree < cap) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'MONOTONICITY',
            title: `${label}退休门诊限额低于在职`,
            detail: `退休=${op.annualCapRetiree}, 在职=${cap}`
          });
        }
      }

      // Catastrophic
      const cat = pkg.catastrophic;
      if (cat) {
        if (cat.deductible < 0) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'ANOMALY_RATIO',
            title: `${label}大病保险起付线小于0`,
            detail: `deductible = ${cat.deductible}`
          });
        }
        for (let i = 0; i < (cat.tiers || []).length - 1; i++) {
          if (cat.tiers[i].ratio > cat.tiers[i+1].ratio) {
            issues.push({
              cityCode, cityName, provinceName,
              severity: 'CRITICAL',
              dimension: 'MONOTONICITY',
              title: `${label}大病保险梯度报销比例倒挂`,
              detail: `梯段${i+1}(${(cat.tiers[i].ratio*100).toFixed(0)}%) > 梯段${i+2}(${(cat.tiers[i+1].ratio*100).toFixed(0)}%)`
            });
          }
        }
      }
    }

    // --- 3. Compare Quotes with Coded Numbers ---
    for (const doc of city.sourceDocs || []) {
      const q = doc.summaryQuote || '';
      
      // Look for resident inpatient pattern: "居民住院.*一级(?<r1>\d+)%.*二级(?<r2>\d+)%.*三级(?<r3>\d+)%"
      const mRatio = q.match(/居民.*?(?:住院|统筹).*?一级.*?(\d{2})%.*?二级.*?(\d{2})%.*?三级.*?(\d{2})%/);
      if (mRatio) {
        const q_r1 = parseInt(mRatio[1], 10) / 100;
        const q_r2 = parseInt(mRatio[2], 10) / 100;
        const q_r3 = parseInt(mRatio[3], 10) / 100;

        const tb = city.resident?.inpatient?.tierBenefits;
        if (tb) {
          const c_r1 = tb.tier1?.reimbursementRatio ?? tb.community?.reimbursementRatio;
          const c_r2 = tb.tier2?.reimbursementRatio;
          const c_r3 = tb.tier3?.reimbursementRatio;

          if (c_r2 !== undefined && Math.abs(c_r2 - q_r2) > 0.001) {
            issues.push({
              cityCode, cityName, provinceName,
              severity: 'CRITICAL',
              dimension: 'QUOTE_MISMATCH',
              title: '居民二级住院比例与官方公文摘录不符',
              detail: `公文 [${doc.docNumber}] 明确为 ${(q_r2*100).toFixed(0)}%，但代码配置为 ${(c_r2*100).toFixed(0)}%`,
              expected: q_r2,
              actual: c_r2
            });
          }
          if (c_r3 !== undefined && Math.abs(c_r3 - q_r3) > 0.001) {
            issues.push({
              cityCode, cityName, provinceName,
              severity: 'CRITICAL',
              dimension: 'QUOTE_MISMATCH',
              title: '居民三级住院比例与官方公文摘录不符',
              detail: `公文 [${doc.docNumber}] 明确为 ${(q_r3*100).toFixed(0)}%，但代码配置为 ${(c_r3*100).toFixed(0)}%`,
              expected: q_r3,
              actual: c_r3
            });
          }
        }
      }

      // Look for resident inpatient deductible pattern: "居民住院起付线.*?一级(?<d1>\d+)元.*?二级(?<d2>\d+)元.*?三级(?<d3>\d+)元"
      const mDed = q.match(/居民住院起付线.*?一级.*?(\d+)元.*?二级.*?(\d+)元.*?三级.*?(\d+)元/);
      if (mDed) {
        const q_d1 = parseInt(mDed[1], 10);
        const q_d2 = parseInt(mDed[2], 10);
        const q_d3 = parseInt(mDed[3], 10);

        const tb = city.resident?.inpatient?.tierBenefits;
        if (tb) {
          const c_d1 = tb.tier1?.deductible;
          const c_d2 = tb.tier2?.deductible;
          const c_d3 = tb.tier3?.deductible;

          if (c_d2 !== undefined && c_d2 !== q_d2) {
            issues.push({
              cityCode, cityName, provinceName,
              severity: 'CRITICAL',
              dimension: 'QUOTE_MISMATCH',
              title: '居民二级住院起付线与官方公文摘录不符',
              detail: `公文 [${doc.docNumber}] 明确为 ${q_d2}元，但代码配置为 ${c_d2}元`,
              expected: q_d2,
              actual: c_d2
            });
          }
          if (c_d3 !== undefined && c_d3 !== q_d3) {
            issues.push({
              cityCode, cityName, provinceName,
              severity: 'CRITICAL',
              dimension: 'QUOTE_MISMATCH',
              title: '居民三级住院起付线与官方公文摘录不符',
              detail: `公文 [${doc.docNumber}] 明确为 ${q_d3}元，但代码配置为 ${c_d3}元`,
              expected: q_d3,
              actual: c_d3
            });
          }
        }
      }

      // Look for employee outpatient cap pattern: "在职职工.*?(?:年度最高支付限额|限额).*?(\d+)元.*?退休.*?(\d+)元"
      const mEmpCap = q.match(/在职职工.*?(?:年度最高支付限额|限额|封顶).*?(\d+)元.*?退休.*?(?:年度最高支付限额|限额|封顶).*?(\d+)元/);
      if (mEmpCap) {
        const q_cap = parseInt(mEmpCap[1], 10);
        const q_ret = parseInt(mEmpCap[2], 10);
        const eo = city.employee?.outpatient;
        if (eo && eo.annualCap && eo.annualCap !== q_cap) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'QUOTE_MISMATCH',
            title: '在职职工门诊年度限额与公文摘录不符',
            detail: `公文 [${doc.docNumber}] 明确为 ${q_cap}元，但代码配置为 ${eo.annualCap}元`,
            expected: q_cap,
            actual: eo.annualCap
          });
        }
        if (eo && eo.annualCapRetiree && eo.annualCapRetiree !== q_ret) {
          issues.push({
            cityCode, cityName, provinceName,
            severity: 'CRITICAL',
            dimension: 'QUOTE_MISMATCH',
            title: '退休职工门诊年度限额与公文摘录不符',
            detail: `公文 [${doc.docNumber}] 明确为 ${q_ret}元，但代码配置为 ${eo.annualCapRetiree}元`,
            expected: q_ret,
            actual: eo.annualCapRetiree
          });
        }
      }
    }
  }

  return {
    totalCities: allCities.length,
    issues,
    freshnessStats
  };
}

if (typeof require !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');

  console.log('\n======================================================');
  console.log('🚀 执行全国 348 个医保统筹区全面深度核验审计');
  console.log('======================================================');

  const { totalCities, issues, freshnessStats } = runDeepAudit();

  console.log(`\n📊 审计概况:`);
  console.log(`- 统筹区总数: ${totalCities}`);
  console.log(`- 发现问题总数: ${issues.length}`);
  console.log(`- 政策时效性分布:`);
  for (const [k, v] of Object.entries(freshnessStats)) {
    console.log(`    * ${k}: ${v} 个统筹区 (${((v/totalCities)*100).toFixed(1)}%)`);
  }

  const critical = issues.filter(i => i.severity === 'CRITICAL');
  const warning = issues.filter(i => i.severity === 'WARNING');
  const notice = issues.filter(i => i.severity === 'NOTICE');

  console.log(`\n🔴 严重问题 (CRITICAL): ${critical.length}`);
  console.log(`🟡 警告提示 (WARNING):  ${warning.length}`);
  console.log(`🔵 关注建议 (NOTICE):   ${notice.length}`);

  // Write detailed findings to file
  const outJson = path.resolve(process.cwd(), 'docs/deep-audit-findings.json');
  fs.writeFileSync(outJson, JSON.stringify({ totalCities, freshnessStats, issues }, null, 2), 'utf-8');
  console.log(`\n💾 详细审计结果已写入: ${outJson}`);

  // Summary by province
  const provMap = new Map<string, typeof issues>();
  for (const issue of issues) {
    if (!provMap.has(issue.provinceName)) provMap.set(issue.provinceName, []);
    provMap.get(issue.provinceName)!.push(issue);
  }

  console.log('\n按省份问题汇总:');
  for (const [p, list] of provMap.entries()) {
    const cCount = list.filter(i => i.severity === 'CRITICAL').length;
    const wCount = list.filter(i => i.severity === 'WARNING').length;
    console.log(`  - ${p}: 🔴 CRITICAL ${cCount}, 🟡 WARNING ${wCount}`);
  }
}

