import type { CityInsuranceData } from '../types';

export const shantouCityData: CityInsuranceData = {
  cityCode: '440500',
  cityName: '汕头市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0754-12393',
  officialPortalUrl: 'http://www.shantou.gov.cn/ybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'st-employee-outpatient-2022-38',
      title: '汕头市医疗保障局关于印发汕头市基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '汕医保〔2022〕38号',
      issuingDept: ['汕头市医疗保障局', '汕头市财政局'],
      publishDate: '2022-11-28',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.shantou.gov.cn/ybj/zwgk/zcfg/202211/t20221130_210984.shtml',
      summaryQuote: '职工普通门诊不设起付线。参保人选定定点医疗机构就医，基层选定医疗机构报销比例为75%（退休人员80%），二级机构报销60%（退休65%），三级机构报销50%（退休55%）。年度普通门诊统筹支付限额在职约为2400元，退休约为2800元。'
    },
    {
      docId: 'st-medical-insurance-inpatient-2024',
      title: '汕头市基本医疗保险住院统筹待遇与大病保险管理规定',
      docNumber: '汕府规〔2023〕12号',
      issuingDept: ['汕头市人民政府', '汕头市医疗保障局'],
      publishDate: '2023-12-18',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.shantou.gov.cn/ybj/zwgk/zcfg/202312/t20231222_231908.shtml',
      summaryQuote: '职工住院起付标准：一级及以下200元、二级400元、三级1000元；在职支付比例一级92%、二级88%、三级82%（退休人员分别为95%、91%、86%）。居民住院起付线同级，支付比例一级88%、二级80%、三级70%。基本统筹年度封顶60万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'st-employee-outpatient-2022-38',
      annualDeductible: 0,
      annualCap: 2400,
      annualCapRetiree: 2800,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。定点就医基层报销75%（退休80%），二级报销60%（退休65%），三级报销50%（退休55%）。年度限额在职2400元，退休2800元。'
    },
    inpatient: {
      sourceDocId: 'st-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'st-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'st-medical-insurance-inpatient-2024',
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
      sourceDocId: 'st-medical-insurance-inpatient-2024',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '居民门诊免设起付线，基层选点报销65%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'st-medical-insurance-inpatient-2024',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1000, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'st-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'st-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
