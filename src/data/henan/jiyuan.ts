import type { CityInsuranceData } from '../types';

export const jiyuanCityData: CityInsuranceData = {
  cityCode: '419001',
  cityName: '济源示范区',
  provinceCode: '410000',
  provinceName: '河南省',
  hotline: '0391-12393',
  officialPortalUrl: 'http://ybj.jiyuan.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'jy-employee-outpatient-2022-25',
      title: '济源示范区管委会办公室关于印发济源示范区建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '济管办〔2022〕25号',
      issuingDept: ['济源产城融合示范区管委会办公室', '济源示范区医疗保障局'],
      publishDate: '2022-06-25',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://ybj.jiyuan.gov.cn/zwgk/zcfg/202206/t20220628_210984.shtml',
      summaryQuote: '职工普通门诊按次设起付标准：每次30元（基层医疗机构免起付）；报销比例基层65%（退休75%），二级60%（退休70%），三级55%（退休65%）；年度支付限额在职1800元，退休2300元。'
    },
    {
      docId: 'jy-medical-insurance-inpatient-2023',
      title: '济源示范区基本医疗保险统筹基金支付管理细则',
      docNumber: '济医保发〔2023〕19号',
      issuingDept: ['济源示范区医疗保障局', '济源示范区财政金融局'],
      publishDate: '2023-10-18',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jiyuan.gov.cn/zwgk/zcfg/202310/t20231023_219084.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级450元、三级750元；在职支付比例一级92%、二级88%、三级85%（退休人员各项提高3%）。居民住院起付线一级150元、二级450元、三级900元，支付比例一级85%、二级75%、三级65%。大病保险起付线15000元，支付比例60%-80%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'jy-employee-outpatient-2022-25',
      annualDeductible: 30,
      deductibleType: 'per_visit',
      annualCap: 1800,
      annualCapRetiree: 2300,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 30, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 30, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '济源市人民医院等重点医院', deductible: 30, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '门诊基层机构免起付线，二级及以上每次30元。基层报销65%（退休75%），二级60%（退休70%），三级55%（退休65%）。限额在职1800元，退休2300元。'
    },
    inpatient: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 750, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 750, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，从第二次住院起，起付标准降低100元。'
    },
    catastrophic: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      name: '济源示范区职工大额医疗救助',
      deductible: 15000,
      annualCap: 400000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.80 },
        { minAmount: 50000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地就医规范转诊下调10%，未备案自行外出就医按70%结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊在基层定点机构免起付线报销60%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点医院', deductible: 900, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，起付标准递减100元。'
    },
    catastrophic: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      name: '济源示范区城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jy-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
