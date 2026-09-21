import type { CityInsuranceData } from '../types';

export const zhanjiangCityData: CityInsuranceData = {
  cityCode: '440800',
  cityName: '湛江市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0759-12393',
  officialPortalUrl: 'http://www.zhanjiang.gov.cn/gdzjylbzj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'zj-employee-outpatient-2022-28',
      title: '湛江市医疗保障局关于印发湛江市职工基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '湛医保〔2022〕28号',
      issuingDept: ['湛江市医疗保障局', '湛江市财政局'],
      publishDate: '2022-11-25',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.zhanjiang.gov.cn/gdzjylbzj/zwgk/zcfg/202211/t20221128_219084.shtml',
      summaryQuote: '职工普通门诊不设起付线。参保人在选定定点医疗机构就医，在职职工在一级及以下、二级、三级医疗机构支付比例分别为60%、55%、50%（退休人员对应为63%、58%、53%）。年度最高支付限额在职及退休约为2152元至2500元。'
    },
    {
      docId: 'zj-medical-insurance-inpatient-2024',
      title: '湛江市基本医疗保险住院与大病保险管理办法',
      docNumber: '湛医保发〔2024〕15号',
      issuingDept: ['湛江市医疗保障局', '湛江市财政局'],
      publishDate: '2024-06-25',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://www.zhanjiang.gov.cn/gdzjylbzj/zwgk/zcfg/202406/t20240628_241908.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级500元、三级800元；在职支付比例一级90%、二级86%、三级82%（退休人员各项提高3%）。居民住院起付线同级，支付比例一级85%、二级78%、三级68%。基本统筹年限额50万元，大病最高35万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'zj-employee-outpatient-2022-28',
      annualDeductible: 0,
      annualCap: 2152,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层及一级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.03 }
      },
      note: '普通门诊免设起付线。选点就医一级及以下报销60%（退休63%），二级报销55%（退休58%），三级报销50%（退休53%）。在职限额2152元，退休2500元。'
    },
    inpatient: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；市内转诊补足差额。'
    },
    catastrophic: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      name: '职工大病医疗保险',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地就医规范转诊下调10%，未备案自行外出就医按70%结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层社区及定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级医疗机构(普通门诊未签约)', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级重点三甲医院(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊免设起付线，基层选点报销65%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      annualCap: 200000,
      tierBenefits: {
        community: { tierName: '一级及社区基层机构', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.78 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 500, reimbursementRatio: 0.68 }
      }
    },
    catastrophic: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zj-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
