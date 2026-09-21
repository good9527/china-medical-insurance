import type { CityInsuranceData } from '../types';

export const dongyingCityData: CityInsuranceData = {
  cityCode: '370500',
  cityName: '东营市',
  provinceCode: '370000',
  provinceName: '山东省',
  hotline: '0546-12393',
  officialPortalUrl: 'http://ybj.dongying.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'dy-employee-outpatient-2022-15',
      title: '东营市人民政府办公室关于建立健全职工基本医疗保险门诊共济保障机制的实施细则',
      docNumber: '东政办发〔2022〕15号',
      issuingDept: ['东营市人民政府办公室', '东营市医疗保障局'],
      publishDate: '2022-12-19',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.dongying.gov.cn/zwgk/zcfg/202212/t20221223_192839.shtml',
      summaryQuote: '职工普通门诊统筹起付标准为200元；报销比例：基层定点机构80%（退休85%），二级机构70%（退休75%），三级机构60%（退休65%）；年度统筹最高支付限额在职职工3000元，退休人员3500元。'
    },
    {
      docId: 'dy-medical-insurance-inpatient-2024',
      title: '东营市医疗保障局关于调整基本医疗保险住院与门诊待遇标准的通知',
      docNumber: '东医保发〔2024〕10号',
      issuingDept: ['东营市医疗保障局', '东营市财政局'],
      publishDate: '2024-04-15',
      effectiveDate: '2024-06-01',
      status: 'active',
      officialUrl: 'http://ybj.dongying.gov.cn/zwgk/zcfg/202404/t20240420_231908.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级400元、三级800元；在职支付比例一级95%、二级92%、三级88%（退休人员各项提高3%）。居民住院起付线一级100元、二级300元、三级700元，支付比例一级88%、二级78%、三级68%。大病保险起付线14000元，支付比例60%-75%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'dy-employee-outpatient-2022-15',
      annualDeductible: 200,
      annualCap: 3000,
      annualCapRetiree: 3500,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹按年度设起付线200元。基层报销80%（退休85%），二级70%（退休75%），三级60%（退休65%）。限额在职3000元，退休3500元。'
    },
    inpatient: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '基层社区及一级医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以上住院，起付标准递减50%。'
    },
    catastrophic: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      name: '东营市职工大额医疗救助',
      deductible: 14000,
      annualCap: 500000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '东营医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['省内异地就医免备案直接同比例结算，跨省异地转诊规范备案。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      annualCap: 450,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构(普通门诊未签约)', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊在基层定点机构免起付线报销60%，年度限额450元。'
    },
    inpatient: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      annualCap: 250000,
      tierBenefits: {
        community: { tierName: '基层及一级医疗机构', deductible: 100, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.78 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 700, reimbursementRatio: 0.68 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，起付标准相应递减。'
    },
    catastrophic: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      name: '东营市城乡居民大病保险',
      deductible: 14000,
      annualCap: 300000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'dy-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '东营医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
