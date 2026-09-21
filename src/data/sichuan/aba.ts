import type { CityInsuranceData } from '../types';

export const abaCityData: CityInsuranceData = {
  cityCode: '513200',
  cityName: '阿坝藏族羌族自治州',
  provinceCode: '510000',
  provinceName: '四川省',
  hotline: '0837-12393',
  officialPortalUrl: 'http://ybj.abazhou.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'ab-employee-outpatient-2022-42',
      title: '阿坝州人民政府办公室关于印发阿坝州建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '阿府办发〔2022〕42号',
      issuingDept: ['阿坝州人民政府办公室', '阿坝州医疗保障局'],
      publishDate: '2022-12-23',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.abazhou.gov.cn/zwgk/zcfg/202212/t20221227_218932.shtml',
      summaryQuote: '职工普通门诊统筹按自然年度设一次起付标准：在职职工200元、退休人员150元；支付比例二级及以下60%（退休70%），三级50%（退休60%）；年度支付限额在职2000元、退休2500元。'
    },
    {
      docId: 'ab-medical-insurance-inpatient-2023',
      title: '阿坝州医疗保障局关于印发阿坝州基本医疗保险和大病保险管理办法的通知',
      docNumber: '阿医保发〔2023〕19号',
      issuingDept: ['阿坝州医疗保障局', '阿坝州财政局'],
      publishDate: '2023-09-12',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.abazhou.gov.cn/zwgk/zcfg/202309/t20230918_229871.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级400元、三级700元；在职支付比例一级92%、二级88%、三级85%（退休人员各项提高3%）。居民住院起付线一级100元、二级250元、三级550元，支付比例一级88%、二级80%、三级68%（高原藏区倾斜支持）。大病保险起付线11000元，支付比例60%-75%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'ab-employee-outpatient-2022-42',
      annualDeductible: 200,
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层及一级定点机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '普通门诊按自然年度设一次起付线：在职200元、退休150元。二级及以下报销60%（退休70%），三级报销50%（退休60%）。限额在职2000元，退休2500元。'
    },
    inpatient: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 700, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，从第二次住院起，起付标准降低50%。'
    },
    catastrophic: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.80 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '四川医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地就医规范转诊下调10%，未备案自行外出就医按70%结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊在基层医疗机构免起付线报销60%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      annualCap: 250000,
      tierBenefits: {
        community: { tierName: '基层及一级机构', deductible: 100, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 250, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 550, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 550, reimbursementRatio: 0.68 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，从第二次住院起，起付标准降低50%。'
    },
    catastrophic: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 11000,
      annualCap: 300000,
      tiers: [
        { minAmount: 11000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ab-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '四川医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
