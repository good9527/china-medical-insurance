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

// 兼容别名
export type SourceDocument = OfficialPolicyDoc;

// 医院等级划分
export type HospitalTier = 'community' | 'tier1' | 'tier2' | 'tier3' | 'tier3_top';

// 费用分段累进报销阶梯定义
export interface CostRangeTier {
  minAmount: number;         // 分段起始金额（政策范围内合规费用）
  maxAmount?: number;        // 分段截止金额（若无上限则留空或省略）
  ratio: number;             // 在职报销比例 (0~1)
  retireeRatioBonus?: number;// 退休上浮比例 (如 0.03)
  retireeRatio?: number;     // 退休指定比例 (若直接指定则优先使用)
}

// 医院等级待遇参数
export interface HospitalTierBenefit {
  tierName: string;           // 医院级别名称，如 '三级医疗机构'
  deductible: number;         // 起付线（元）
  reimbursementRatio: number; // 统筹报销比例 (0~1)，如 0.65
  retireeRatioBonus?: number; // 退休人员上浮比例，如 0.05 (增加5%)
  costRanges?: CostRangeTier[]; // 分段累进比例阶梯（如西安市等统筹区分段报销）
}

// 门诊保障规则
export interface OutpatientBenefit {
  sourceDocId: string;        // 关联的官方文件 ID
  annualDeductible?: number;  // 门诊年度累计起付线（元）或基准起付标准（若未配置默认为0或按就医等级）
  annualDeductibleRetiree?: number; // 退休人员门诊年度起付线（若有优待政策，如北京1300/成都150/天津700/重庆100/杭州200/苏州400）
  deductibleType?: 'annual' | 'per_visit'; // 起付标准类型：'annual'(年度累计起付，默认) 或 'per_visit'(按就医诊次起付)
  annualCap: number;          // 门诊统筹年度最高支付限额（在职）
  annualCapRetiree?: number;  // 退休人员年度最高限额
  tierBenefits: Record<HospitalTier, HospitalTierBenefit>;
  note?: string;              // 特别说明（如：须在签约基层卫生服务机构或定点医院）
}

// 多次住院起付线精算策略类型定义
export type RepeatedDeductiblePolicyType =
  | 'none'                      // 不递减 (如上海、广州)
  | 'half_from_second'          // 第2次及以上统一减半 (如北京、深圳、武汉、四川各市)
  | 'half_second_zero_third'    // 第2次减半，第3次及以上免起付线 (如浙江、江苏等)
  | 'step_down'                 // 每次递减固定金额直至保底线 (如安徽、河北、广西、贵州)
  | 'custom_matrix'             // 明确分级阶梯表 (如西安职工、安康职工)
  | 'highest_tier_once';        // 年内按最高等级医院计算一次 (如杭州、宁波)

export interface RepeatedDeductiblePolicy {
  type: RepeatedDeductiblePolicyType;
  stepAmount?: number;          // 每次递减金额 (例如 100 或 50)
  minFloor?: number;            // 保底起付线 (例如 100 或 200 或 0)
  excludeTiers?: HospitalTier[];// 不参与递减的等级 (例如武汉社区及一级机构除外)
  tierMatrix?: Partial<Record<HospitalTier, number[]>>; // 阶梯矩阵: [第1次, 第2次, 第3次, 第4次及以上]
}

// 住院保障规则
export interface InpatientBenefit {
  sourceDocId: string;        // 关联的官方文件 ID
  tierBenefits: Record<HospitalTier, HospitalTierBenefit>;
  annualCap: number;          // 基本医疗保险统筹基金年最高支付限额（元）
  annualCapRetiree?: number;  // 退休人员统筹最高限额（若有差异）
  comprehensiveCap?: number;  // 叠加职工大额互助/大病保险后的年度综合最高保障额度（如重庆、武汉等）
  repeatedDeductibleRule?: string; // 年内多次住院起付线递减规则说明
  repeatedDeductiblePolicy?: RepeatedDeductiblePolicy; // 年内多次住院结构化精算规程
}

// 大病保险 / 大额医疗互助规则
export interface CatastrophicBenefit {
  sourceDocId?: string;       // 关联官方文件ID（若未独立制定则默认遵从住院综合规程）
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

  // 可选高精精算扩展字段 (向后兼容)
  adjustmentMode?: 'multiplicative' | 'subtractive'; // 折算模式：'multiplicative'(乘数折算，默认) | 'subtractive'(百分点扣减)
  fixedTargetRatios?: {
    transfer?: number;        // 如石家庄居民省外转诊固定 0.50
    unfiledNormal?: number;   // 如石家庄居民省外未备案固定 0.30
  };
  offsiteDeductibles?: {
    transferDeductible?: number;    // 如随州转市外起付线 1200 元
    unfiledDeductible?: number;      // 如石家庄省外未备案起付线 4000 元
  };
  excludePenaltyFromCatastrophic?: boolean; // 降比例自付是否从大病保险基数中剔除（默认为 true）
  regionalAlliances?: string[];    // 免备案协同圈，如 ['京津冀免备案', '长三角一体化', '省内免备案']
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
  hospitalizationCount?: 1 | 2 | 3;      // 年内住院频次 (1: 首次, 2: 二次, 3: 三次及以上住院)
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
    classBSelfPay?: number;              // 乙类先行自付金额 (兼容别名)
    eligibleCost: number;                // 符合医保政策范围内的费用 (可报销基数)
    standardDeductible: number;          // 首次基准起付线
    appliedDeductible: number;           // 本次实际适用起付线标准 (经多次递减后)
    deductibleReduction: number;         // 起付线减免金额 (standardDeductible - appliedDeductible)
    deductibleDeducted: number;          // 实际扣除起付线金额 (min(eligibleCost, appliedDeductible))
    costInReimbursementSpan: number;     // 进入报销段合规费用 (max(0, eligibleCost - deductibleDeducted))
    baseReimbursed: number;              // 基本医保统筹报销金额
    catastrophicReimbursed: number;      // 大病保险/大额互助报销金额
    totalReimbursed: number;             // 医保合计报销总额
    effectiveRatio: number;              // 实际综合报销比例 (合计报销 / 总费用)
    personalPayTotal: number;            // 个人最终自掏腰包总额
    personalDeductiblePaid: number;      // 个人承担的起付线金额 (等于 deductibleDeducted)
    personalSpanCoPay: number;           // 个人在报销段内自负金额
  };
  
  tierName: string;
  policyNotes: string[];                 // 政策提示（如封顶线、起付线减免等）
}

// ============================================================================
// 跨城就医待遇实测对比模拟器数据模型 (Multi-City Actuarial Simulation Contracts)
// ============================================================================

/**
 * 跨城就医待遇实测对比模拟器 - 同等就医场景输入参数
 */
export interface ComparisonScenarioInput {
  totalCost: number;                                          // 预估医疗总花费 (元)
  insuranceType: 'employee' | 'resident';                     // 参保险种: 城镇职工 vs 城乡居民
  isRetiree?: boolean;                                        // 是否退休 (仅职工医保有效)
  treatmentType: 'outpatient' | 'inpatient';                  // 就医类型: 普通门诊 vs 住院
  hospitalTier: HospitalTier;                                 // 医疗机构等级 ('community' | 'tier1' | 'tier2' | 'tier3' | 'tier3_top')
  hospitalizationCount?: 1 | 2 | 3;                            // 自然年度内住院频次 (1: 首次, 2: 二次, 3: 三次及以上)
  remoteStatus: 'local' | 'long_term' | 'transfer' | 'unfiled_emergency' | 'unfiled_normal'; // 就医地与备案状态
  nonInsuranceCost?: number;                                  // 目录外全自费费用 (丙类/特需等)
  classBCost?: number;                                        // 目录内乙类项目费用 (需先行自付)
  classBSelfPayRatio?: number;                                // 乙类自付比例 (默认0.05)
}

/**
 * 单一统筹区在指定场景下的精算测算与比对结果实体
 */
export interface CitySimulationOutcome {
  cityCode: string;                                           // 统筹区行政代码 (如 '610100')
  cityName: string;                                           // 统筹区名称 (如 '西安市')
  provinceName: string;                                       // 所属省份 (如 '陕西省')
  totalCost: number;                                          // 医疗总花费
  totalReimbursed: number;                                    // 医保合计报销总额
  personalPayTotal: number;                                   // 个人自理总金额
  reimbursementRatio: number;                                 // 实际综合报销比例 (%)
  deductibleDeducted: number;                                 // 实扣起付线金额
  deductibleReduction: number;                                // 起付线递减减免金额
  baseReimbursed: number;                                     // 基本医保统筹基金支付额
  catastrophicReimbursed: number;                             // 大病保险/大额互助救助额
  personalSpanCoPay: number;                                  // 报销段内政策自负金额
  nonInsuranceAndPriorPay: number;                            // 丙类全自费与乙类先行自付合计
  isConserved: boolean;                                       // 资金物理守恒校验状态
  isWinnerReimbursed: boolean;                                // 是否基金报销最高
  isWinnerLowestOutPocket: boolean;                           // 是否个人自负最少
  isWinnerLowestDeductible: boolean;                          // 是否起付门槛最低
  isWinnerHighestCatastrophic: boolean;                       // 是否大病二次救助最高
  deltaReimbursedVsCityA: number;                             // 相比基准城市(City A)的报销差额
  deltaPersonalPayVsCityA: number;                            // 相比基准城市(City A)的自付差额
  officialDocUsed: OfficialPolicyDoc;                         // 本次测算依据的官方红头公文
  specialNotes?: string[];                                    // 政策特色与测算注解
  calcResult?: CalculateResult;                               // 底层测算完整明细 (可选透传)
  hotline?: string;                                           // 医保热线
  portalUrl?: string;                                         // 官方政务网链接
}

/**
 * 跨城待遇实测对比模拟器多城综合测算报告
 */
export interface MultiCitySimulationResult {
  scenario: ComparisonScenarioInput;                          // 输入的统一就医场景
  cities: CitySimulationOutcome[];                            // 各统筹区并排测算结果列表
  winnerReimbursedCity: string;                               // 报销最高胜出城市 (并列时以斜杠隔开并注并列)
  winnerLowestOutPocketCity: string;                          // 自负最少胜出城市
  winnerLowestDeductibleCity: string;                         // 门槛最低胜出城市
  winnerHighestCatastrophicCity: string;                      // 大病救助最高胜出城市
  maxReimbursementDelta: number;                              // 最大报销跨度落差 (max - min)
  maxPersonalPayDelta: number;                                // 最大自付跨度落差 (max - min)
  keyInsights: string[];                                      // 精算自动化决策洞察文案 (0-Emoji)
  allConserved: boolean;                                      // 全城全场景资金物理守恒审计结论
}

