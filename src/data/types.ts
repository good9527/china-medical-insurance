/**
 * 医保政策与官方文件溯源数据类型定义
 */

// 官方政策法规文件元数据（溯源基石）
export interface OfficialPolicyDoc {
  docId: string;              // 唯一编码，如 'xa-employee-outpatient-2022-75'
  title: string;              // 政策文件全称，如《西安市医疗保障局等四部门关于印发西安市职工基本医疗保险门诊共济保障机制实施细则的通知》
  docNumber: string;          // 官方发文字号，如 '市医保发〔2022〕75号'
  issuingDept: string[];      // 发文部门，如 ['西安市医疗保障局', '西安市财政局']
  publishDate: string;        // 发文日期 '2022-12-01'
  effectiveDate: string;      // 施行日期 '2023-01-01'
  status: 'active' | 'superseded'; // 现行有效 / 已废止或修订
  officialUrl: string;        // 官方网站直链（政府网或各市医保局官网）
  summaryQuote: string;       // 对应条款核心原文摘录
}

// 医院等级划分
export type HospitalTier = 'community' | 'tier1' | 'tier2' | 'tier3' | 'tier3_top';

// 医院等级待遇参数
export interface HospitalTierBenefit {
  tierName: string;           // 医院级别名称，如 '三级医疗机构'
  deductible: number;         // 起付线（元）
  reimbursementRatio: number; // 统筹报销比例 (0~1)，如 0.65
  retireeRatioBonus?: number; // 退休人员上浮比例，如 0.05 (增加5%)
}

// 门诊保障规则
export interface OutpatientBenefit {
  sourceDocId: string;        // 关联的官方文件 ID
  annualDeductible: number;   // 门诊年度累计起付线（元）或基准起付标准
  annualDeductibleRetiree?: number; // 退休人员门诊年度起付线（若有优待政策，如北京1300/成都150/天津700/重庆100/杭州200/苏州400）
  deductibleType?: 'annual' | 'per_visit'; // 起付标准类型：'annual'(年度累计起付，默认) 或 'per_visit'(按就医诊次起付)
  annualCap: number;          // 门诊统筹年度最高支付限额（在职）
  annualCapRetiree?: number;  // 退休人员年度最高限额
  tierBenefits: Record<HospitalTier, HospitalTierBenefit>;
  note?: string;              // 特别说明（如：须在签约基层卫生服务机构或定点医院）
}

// 住院保障规则
export interface InpatientBenefit {
  sourceDocId: string;        // 关联的官方文件 ID
  tierBenefits: Record<HospitalTier, HospitalTierBenefit>;
  annualCap: number;          // 基本医疗保险统筹基金年最高支付限额（元）
  annualCapRetiree?: number;  // 退休人员统筹最高限额（若有差异）
  comprehensiveCap?: number;  // 叠加职工大额互助/大病保险后的年度综合最高保障额度（如重庆、武汉等）
  repeatedDeductibleRule?: string; // 年内多次住院起付线递减规则说明
}

// 大病保险 / 大额医疗互助规则
export interface CatastrophicBenefit {
  sourceDocId: string;
  name: string;               // '城镇职工大额医疗互助' 或 '城乡居民大病保险'
  deductible: number;         // 起付线
  tiers: {
    minAmount: number;        // 分段起始金额
    maxAmount?: number;       // 分段结束金额（若无限额则留空）
    ratio: number;            // 报销比例
  }[];
  annualCap?: number;         // 封顶线（居民大病通常不设封顶）
}

// 异地就医结算与调整规则
export interface RemoteMedicalRule {
  sourceDocId: string;
  filingChannels: string[];   // 推荐办理渠道，如 ['国家医保服务平台APP', '陕西医保微信小程序', '电话直备']
  longTermFiledRatio: number; // 异地长期居住/安置退休人员（已备案）：报销比例调整系数 (1.0 = 不降低)
  transferFiledRatio: number; // 异地转诊转院（已备案）：报销比例调整系数 (如 0.9 = 降低10%)
  unfiledEmergencyRatio: number; // 异地急诊抢救（未备案）：报销比例调整系数 (如 0.9 = 降低10%)
  unfiledNormalRatio: number; // 自行就医（未备案非急诊）：报销比例调整系数 (如 0.8 = 降低20%)
  specialNotes: string[];     // 异地特别注意事项
}

// 险种待遇包
export interface InsuranceTypePackage {
  outpatient: OutpatientBenefit;
  inpatient: InpatientBenefit;
  catastrophic: CatastrophicBenefit;
  remoteMedical: RemoteMedicalRule;
}

// 城市完整医保政策包
export interface CityInsuranceData {
  cityCode: string;           // 行政代码，如 '610100'
  cityName: string;           // '西安市'
  provinceCode: string;       // '610000'
  provinceName: string;       // '陕西省'
  hotline: string;            // 医保政务热线，如 '029-12393'
  officialPortalUrl: string;  // 市医保局官网主页
  lastUpdated?: string;       // 政策最近权威核验更新日期，如 '2026-03-01'
  sourceDocs: OfficialPolicyDoc[]; // 本地市收录的所有官方红头文件
  employee: InsuranceTypePackage;  // 城镇职工医保政策
  resident: InsuranceTypePackage;  // 城乡居民医保政策
}

// 测算请求输入
export interface CalculateRequest {
  cityCode: string;
  insuranceType: 'employee' | 'resident'; // 职工 或 居民
  isRetiree?: boolean;                   // 是否退休（仅对职工有效）
  treatmentType: 'outpatient' | 'inpatient'; // 普通门诊 或 住院
  hospitalTier: HospitalTier;            // 医疗机构级别
  remoteStatus: 'local' | 'long_term' | 'transfer' | 'unfiled_emergency' | 'unfiled_normal'; // 就医地状态
  totalCost: number;                     // 医疗总费用（元）
  nonInsuranceCost?: number;             // 目录外全自费费用（丙类/特需等，默认为0）
  classBCost?: number;                   // 目录内乙类药品/项目费用（需先行自付，默认为0）
  classBSelfPayRatio?: number;           // 乙类平均先行自付比例（默认按 0.05~0.10，通常约为 5%）
}

// 测算详细账单结果
export interface CalculateResult {
  cityData: CityInsuranceData;
  officialDocUsed: OfficialPolicyDoc;    // 本次测算使用的官方文件依据
  input: CalculateRequest;
  
  breakdown: {
    totalCost: number;                   // 总医疗花费
    nonInsuranceCost: number;            // 目录外完全自费金额
    classBCost: number;                  // 乙类费用
    classBPriorPay: number;              // 乙类先行自付金额 (进入统筹前个人承担)
    eligibleCost: number;                // 符合医保政策范围内的费用 (可报销基数)
    deductibleDeducted: number;          // 扣除起付线金额
    baseReimbursed: number;              // 基本医保统筹报销金额
    catastrophicReimbursed: number;      // 大病保险/大额互助报销金额
    totalReimbursed: number;             // 医保合计报销总额
    effectiveRatio: number;              // 实际综合报销比例 (合计报销 / 总费用)
    personalPayTotal: number;            // 个人最终自掏腰包总额
  };
  
  tierName: string;
  policyNotes: string[];                 // 政策提示（如封顶线、起付线减免等）
}
