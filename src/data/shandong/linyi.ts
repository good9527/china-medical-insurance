import type { CityInsuranceData } from '../types';

export const linyiCityData: CityInsuranceData = {
  cityCode: '371300',
  cityName: '临沂市',
  provinceCode: '370000',
  provinceName: '山东省',
  hotline: '0539-12393',
  officialPortalUrl: 'http://ybj.linyi.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'ly-employee-outpatient-2022-18',
      title: '临沂市人民政府办公室关于印发临沂市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '临政办发〔2022〕18号',
      issuingDept: ['临沂市人民政府办公室', '临沂市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.linyi.gov.cn/zwgk/zcfg/202212/t20221222_198231.shtml',
      summaryQuote: '职工普通门诊统筹起付标准为200元；报销比例：基层医疗机构75%（退休80%），二级医疗机构65%（退休70%），三级医疗机构55%（退休60%）；年度最高支付限额在职职工2000元，退休人员2500元。'
    },
    {
      docId: 'ly-medical-insurance-inpatient-2023',
      title: '临沂市医疗保障局关于调整基本医疗保险统筹支付与大病保险待遇政策的通知',
      docNumber: '临医保发〔2023〕35号',
      issuingDept: ['临沂市医疗保障局', '临沂市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.linyi.gov.cn/zwgk/zcfg/202311/t20231125_219084.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级500元、三级800元；在职支付比例一级92%、二级88%、三级85%（退休人员各项提高3%）。居民住院起付线一级150元、二级400元、三级750元，支付比例一级85%、二级75%、三级65%。大病保险起付线14000元，支付比例60%-75%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'ly-employee-outpatient-2022-18',
      annualDeductible: 200,
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 200, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '临沂市人民医院等重点三甲', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹按年度设起付线200元。基层报销75%（退休80%），二级65%（退休70%），三级55%（退休60%）。限额在职2000元，退休2500元。'
    },
    inpatient: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以上住院，起付标准递减50%。'
    },
    catastrophic: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      name: '临沂市职工大额医疗救助',
      deductible: 14000,
      annualCap: 450000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '临沂医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['省内异地就医免备案直接同比例结算，跨省异地转诊规范备案。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
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
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      annualCap: 250000,
      tierBenefits: {
        community: { tierName: '基层及一级医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 750, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 750, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，起付标准相应递减。'
    },
    catastrophic: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      name: '临沂市城乡居民大病保险',
      deductible: 14000,
      annualCap: 300000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '临沂医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
