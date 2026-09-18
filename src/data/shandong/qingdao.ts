import type { CityInsuranceData } from '../types';

export const qingdaoCityData: CityInsuranceData = {
  cityCode: '370200',
  cityName: '青岛市',
  provinceCode: '370000',
  provinceName: '山东省',
  hotline: '0532-12393',
  officialPortalUrl: 'http://ybj.qingdao.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'qd-employee-outpatient-2022-17',
      title: '青岛市人民政府办公厅关于建立健全职工基本医疗保险门诊共济保障机制的实施意见',
      docNumber: '青政办发〔2022〕17号',
      issuingDept: ['青岛市人民政府办公厅', '青岛市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.qingdao.gov.cn/zwgk/zcfg/202212/t20221225_210984.shtml',
      summaryQuote: '职工普通门诊统筹起付线：一级及社区100元，二级及三级200元；报销比例：基层80%（退休85%），二级70%（退休75%），三级60%（退休65%）；年度统筹支付限额在职职工3000元，退休人员4000元。'
    },
    {
      docId: 'qd-medical-insurance-inpatient-2024',
      title: '青岛市医疗保障局关于印发青岛市基本医疗保险待遇保障办法的通知',
      docNumber: '青医保发〔2024〕12号',
      issuingDept: ['青岛市医疗保障局', '青岛市财政局'],
      publishDate: '2024-05-18',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://ybj.qingdao.gov.cn/zwgk/zcfg/202405/t20240522_231908.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级500元、三级800元；在职支付比例一级92%、二级90%、三级88%（退休人员各项提高3%）。居民住院起付线一级200元、二级500元、三级800元，支付比例一级85%、二级75%、三级70%。大病保险起付线14000元，支付比例60%-75%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'qd-employee-outpatient-2022-17',
      annualDeductible: 0, // 基层医疗机构免起付线
      annualCap: 6000,       // 在职职工门诊年最高支付限额 6000 元
      annualCapRetiree: 7000, // 退休职工门诊年最高支付限额 7000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹自由就医，基层医疗机构免起付线。在职报销比例基层80%、二级70%、三级60%（退休人员各加5个百分点）。在职年限额6000元，退休限额7000元。'
    },
    inpatient: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '青医附院等重点三甲', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次住院起付线减半，第三次及以上免除起付线。'
    },
    catastrophic: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      name: '青岛市职工大额医疗补助',
      deductible: 14000,
      annualCap: 500000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '青岛医疗保障微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['省内跨市异地就医免备案直接联网同比例结算，跨省自行外出下浮。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      annualCap: 450,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构(普通门诊未签约)', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构(普通门诊未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(普通门诊未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲综合医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊在签约基层定点机构免起付线报销60%，年度限额450元。'
    },
    inpatient: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      annualCap: 250000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 800, reimbursementRatio: 0.70 }
      },
      repeatedDeductibleRule: '居民参保人年度内多次住院，起付线按规定依次递减。'
    },
    catastrophic: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      name: '青岛市城乡居民大病保险',
      deductible: 14000,
      annualCap: 300000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, maxAmount: 200000, ratio: 0.65 },
        { minAmount: 200000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qd-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '青岛医疗保障微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
