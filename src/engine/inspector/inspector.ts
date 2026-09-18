import { allCities as defaultCities } from '../../data';
import type { CityInsuranceData } from '../../data/types';
import { allInspectionRules } from './rules';
import type {
  DiagnosticItem,
  InspectionSummary,
  SamplingConfig,
  CascadeFilter,
  AnomalyCategory
} from './types';

export class PolicyInspector {
  private cities: CityInsuranceData[];

  constructor(cities: CityInsuranceData[] = defaultCities) {
    this.cities = cities;
  }

  /**
   * 全量 344 个统筹区多维智能深度体检
   */
  public inspectAll(): InspectionSummary {
    const items: DiagnosticItem[] = [];
    const provStats: Record<string, { total: number; healthy: number; issues: number }> = {};

    for (const city of this.cities) {
      if (!provStats[city.provinceName]) {
        provStats[city.provinceName] = { total: 0, healthy: 0, issues: 0 };
      }
      provStats[city.provinceName].total++;

      let cityHasIssue = false;
      for (const rule of allInspectionRules) {
        const issues = rule(city, this.cities);
        if (issues.length > 0) {
          cityHasIssue = true;
          items.push(...issues);
        }
      }

      if (cityHasIssue) {
        provStats[city.provinceName].issues++;
      } else {
        provStats[city.provinceName].healthy++;
      }
    }

    const healthyCities = Object.values(provStats).reduce((acc, s) => acc + s.healthy, 0);
    const criticalCount = items.filter(i => i.severity === 'CRITICAL').length;
    const warningCount = items.filter(i => i.severity === 'WARNING').length;
    const infoCount = items.filter(i => i.severity === 'INFO').length;

    return {
      inspectedAt: new Date().toISOString(),
      mode: 'FULL',
      totalCities: this.cities.length,
      healthyCities,
      healthyRate: (healthyCities / this.cities.length) * 100,
      criticalCount,
      warningCount,
      infoCount,
      items,
      provinceStats: provStats
    };
  }

  /**
   * 定期随机抽样巡检机制 (Random Sampling Patrol)
   * 随机抽取指定数量的城市深度检测，如果抽样中发现任何 CRITICAL/WARNING，自动启动级联联动全量排查
   */
  public randomSamplePatrol(config: SamplingConfig = {}): {
    sampleSummary: InspectionSummary;
    cascadeTriggered: boolean;
    cascadeSummary?: InspectionSummary;
  } {
    const sampleSize = config.sampleSize || 35; // 默认约 10% 样本量
    const shuffled = [...this.cities];

    // 洗牌算法
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const sampledCities = shuffled.slice(0, sampleSize);
    const sampleInspector = new PolicyInspector(sampledCities);
    const sampleSummary = sampleInspector.inspectAll();
    sampleSummary.mode = 'RANDOM_SAMPLE';

    let cascadeTriggered = false;
    let cascadeSummary: InspectionSummary | undefined;

    // 联动触发条件：若抽查中发现了 CRITICAL 错误，或者发现属于异地就医误植或过渡兜底问题
    const criticalIssues = sampleSummary.items.filter(
      i => i.severity === 'CRITICAL' || i.category === 'REMOTE_RATIO_CONFUSION' || i.category === 'ODD_TRANSITION_RATIO'
    );

    if (criticalIssues.length > 0) {
      cascadeTriggered = true;
      // 提取出现的首要病灶类别，在全国范围内执行穿透级联排查
      const targetCategory = criticalIssues[0].category;
      cascadeSummary = this.cascadeInvestigate({ targetCategory });
    }

    return {
      sampleSummary,
      cascadeTriggered,
      cascadeSummary
    };
  }

  /**
   * 级联联动排查机制 (Cascade Root-Cause Investigation)
   * 当一个统筹区发现特定病灶时，在全国 344 个统筹区中广播扫描所有相似问题
   */
  public cascadeInvestigate(filter: CascadeFilter): InspectionSummary {
    const fullSummary = this.inspectAll();
    let filteredItems = fullSummary.items;

    if (filter.targetCategory) {
      filteredItems = filteredItems.filter(i => i.category === filter.targetCategory);
    }

    if (filter.targetCityCode) {
      const targetIssue = fullSummary.items.find(i => i.cityCode === filter.targetCityCode);
      if (targetIssue) {
        filteredItems = filteredItems.filter(i => i.category === targetIssue.category);
      }
    }

    return {
      ...fullSummary,
      mode: 'CASCADE',
      items: filteredItems
    };
  }

  /**
   * 格式化输出报告
   */
  public static formatConsoleReport(summary: InspectionSummary): string {
    const lines: string[] = [];
    lines.push('================================================================================');
    lines.push(`🛡️ 全国医保数据智能巡检与级联排查系统报告 [模式: ${summary.mode}]`);
    lines.push(`巡检时间: ${summary.inspectedAt}`);
    lines.push(`纳管统筹区: ${summary.totalCities} | 健康统筹区: ${summary.healthyCities} | 健康率: ${summary.healthyRate.toFixed(1)}%`);
    lines.push(`🔴 致命缺陷(CRITICAL): ${summary.criticalCount} | 🟡 潜在风险(WARNING): ${summary.warningCount} | 🔵 优化提示(INFO): ${summary.infoCount}`);
    lines.push('================================================================================');

    if (summary.items.length === 0) {
      lines.push('\n🎉 完美！全量统筹区各项核心待遇与公文凭证全部符合现行医保政策规范！\n');
      return lines.join('\n');
    }

    // 按省份聚合展示
    const group = new Map<string, DiagnosticItem[]>();
    for (const item of summary.items) {
      if (!group.has(item.provinceName)) group.set(item.provinceName, []);
      group.get(item.provinceName)!.push(item);
    }

    for (const [prov, list] of group.entries()) {
      lines.push(`\n【${prov}】 (检出 ${list.length} 个关注项):`);
      for (const item of list) {
        const icon = item.severity === 'CRITICAL' ? '🔴 [严重]' : '🟡 [警告]';
        lines.push(`  ${icon} ${item.cityName.padEnd(5, '　')} (${item.cityCode}) [${item.category}] ${item.title}`);
        lines.push(`     详情: ${item.detail}`);
        if (item.suggestedFix) {
          lines.push(`     💡 整改建议: ${item.suggestedFix}`);
        }
      }
    }

    lines.push('\n================================================================================');
    return lines.join('\n');
  }
}
