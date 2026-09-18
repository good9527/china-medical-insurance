import type { CityInsuranceData } from '../../data/types';

export type DiagnosticSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AnomalyCategory = 
  | 'RATIO_INVERSION'         // 比例倒挂 (如低级医疗机构比例低于高级)
  | 'REMOTE_RATIO_CONFUSION'   // 异地转诊比例混淆 (误将外转下调比例当做本地基础待遇)
  | 'ODD_TRANSITION_RATIO'     // 特殊救助/过渡兜底非标比例 (如78%、68%等脱贫过渡参数)
  | 'RETIREE_OVERFLOW'         // 退休上浮超限或倒挂
  | 'HOMOGENEOUS_CLONE'        // 同省单一模板克隆污染
  | 'INVALID_SOURCE_DOC'       // 非正规公文/文号拼凑/虚假一览表
  | 'OUTPATIENT_LIMIT_ABNORMAL';// 门诊限额/起付线明显偏离政策区间

export interface DiagnosticItem {
  cityCode: string;
  cityName: string;
  provinceName: string;
  severity: DiagnosticSeverity;
  category: AnomalyCategory;
  title: string;
  detail: string;
  fieldPath?: string;
  currentValue?: any;
  suggestedFix?: string;
  matchedDoc?: {
    docNumber: string;
    title: string;
  };
}

export interface InspectionSummary {
  inspectedAt: string;
  mode: 'FULL' | 'RANDOM_SAMPLE' | 'CASCADE';
  totalCities: number;
  healthyCities: number;
  healthyRate: number; // 0~100
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  items: DiagnosticItem[];
  provinceStats: Record<string, { total: number; healthy: number; issues: number }>;
}

export interface SamplingConfig {
  sampleSize?: number; // 抽查城市数量，默认 35 个（约 10%）
  seed?: number;       // 随机种子，便于复现
  guaranteeProvinces?: boolean; // 是否确保每个省至少抽取 1 个城市
}

export interface CascadeFilter {
  targetCityCode?: string;     // 当某城市报错时传入
  targetCategory?: AnomalyCategory; // 针对特定病灶展开全国广播扫描
  patternMatcher?: (city: CityInsuranceData) => boolean;
}
