import type { CityInsuranceData } from '../types';

export const hezeCityData: CityInsuranceData = {
  cityCode: '371700',
  cityName: '菏泽市',
  provinceCode: '370000',
  provinceName: '山东省',
  hotline: '0530-12393',
  officialPortalUrl: 'http://ybj.heze.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'hz-employee-outpatient-2022-20',
      title: '菏泽市人民政府办公室关于印发菏泽市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '菏政办发〔2022〕20号',
      issuingDept: ['菏泽市人民政府办公室', '菏泽市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.heze.gov.cn/zwgk/zcfg/202212/t20221222_198231.shtml',
      summaryQuote: '职工普通门诊统筹起付标准为200元；报销比例：基层医疗机构75%（退休80%），二级医疗机构65%（退休70%），三级医疗机构55%（退休60%）；年度最高支付限额在职职工2000元，退休人员2500元。'
    },
    {
      docId: 'hz-medical-insurance-inpatient-2023',
      title: '菏泽市医疗保障局关于印发菏泽市基本医疗保险统筹基金支付与重大疾病保障实施细则的通知',
      docNumber: '菏医保发〔2023〕32号',
      issuingDept: ['菏泽市医疗保障局', '菏泽市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.heze.gov.cn/zwgk/zcfg/202311/t20231125_219084.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级450元、三级750元；在职支付比例一级92%、二级88%、三级85%（退休人员各项提高3%）。居民住院起付线一级100元、二级350元、三级750元，支付比例一级85%、二级76%、三级66%。大病保险起付线14000元，支付比例60%-75%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'hz-employee-outpatient-2022-20',
      annualDeductible: 200,
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 200, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '菏泽市立医院等重点三甲', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹按年度设起付线200元。基层报销75%（退休80%），二级65%（退休70%），三级55%（退休60%）。限额在职2000元，退休2500元。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 750, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 750, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以上住院，起付标准递减50%。'
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      name: '菏泽市职工大额医疗救助',
      deductible: 14000,
      annualCap: 450000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '菏泽医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['省内异地就医免备案直接同比例结算，跨省异地转诊规范备案。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      annualCap: 350,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构(普通门诊未签约)', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊在基层定点机构免起付线报销60%，年度限额350元。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '基层及一级医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 350, reimbursementRatio: 0.76 },
        tier3: { tierName: '三级定点医疗机构', deductible: 750, reimbursementRatio: 0.66 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 750, reimbursementRatio: 0.66 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，起付标准相应递减。'
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      name: '菏泽市城乡居民大病保险',
      deductible: 14000,
      annualCap: 300000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '菏泽医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
