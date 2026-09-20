import type { CityInsuranceData } from '../types';

export const mianyangCityData: CityInsuranceData = {
  cityCode: '510700',
  cityName: '绵阳市',
  provinceCode: '510000',
  provinceName: '四川省',
  hotline: '0816-12393',
  officialPortalUrl: 'http://ybj.my.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'my-employee-outpatient-2022-45',
      title: '绵阳市人民政府办公室关于印发绵阳市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '绵府办规〔2022〕2号',
      issuingDept: ['绵阳市人民政府办公室', '绵阳市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.my.gov.cn/zwgk/zcfg/202212/t20221220_210984.shtml',
      summaryQuote: '职工普通门诊按自然年度设一次起付线：在职200元、退休150元；报销比例二级及以下60%（退休70%），三级定点机构50%（退休60%）；年度支付限额在职2000元，退休2500元。'
    },
    {
      docId: 'my-medical-insurance-inpatient-2024',
      title: '绵阳市基本医疗保险住院与大病保险管理办法',
      docNumber: '绵医保发〔2024〕16号',
      issuingDept: ['绵阳市医疗保障局', '绵阳市财政局'],
      publishDate: '2024-06-25',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://ybj.my.gov.cn/zwgk/zcfg/202406/t20240628_241908.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级450元、三级750元；在职支付比例一级92%、二级88%、三级84%（退休人员各项提高3%）。居民住院起付线一级150元、二级350元、三级650元，支付比例一级85%、二级78%、三级65%。基本统筹年限额50万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'my-employee-outpatient-2022-45',
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
      sourceDocId: 'my-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 750, reimbursementRatio: 0.84, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 750, reimbursementRatio: 0.84, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以上住院，起付线降低50%。'
    },
    catastrophic: {
      sourceDocId: 'my-medical-insurance-inpatient-2024',
      name: '职工大额医疗互助',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.80 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'my-medical-insurance-inpatient-2024',
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
      sourceDocId: 'my-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊在基层定点机构免起付线报销60%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'my-medical-insurance-inpatient-2024',
      annualCap: 300000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 150, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 350, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 650, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 650, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以上住院，起付线降低50%。'
    },
    catastrophic: {
      sourceDocId: 'my-medical-insurance-inpatient-2021',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000, // 对齐四川省统一居民大病保险年度最高支付限额30万元/年
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'my-medical-insurance-inpatient-2021',
      filingChannels: ['国家医保服务平台APP', '四川医保公共服务平台微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '四川省内跨市就医直接联网结算，无需备案享受本地同等报销待遇。',
        '跨省异地就医按规定办理转诊或备案手续，临时未备案外出就医支付比例相应下调。'
      ]
    }
  }
};
