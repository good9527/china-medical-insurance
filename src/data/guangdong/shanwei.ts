import type { CityInsuranceData } from '../types';

export const shanweiCityData: CityInsuranceData = {
  cityCode: '441500',
  cityName: '汕尾市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0660-12393',
  officialPortalUrl: 'http://www.shanwei.gov.cn/swybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'sw-employee-outpatient-2022-31',
      title: '汕尾市医疗保障局关于印发汕尾市职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '汕医保〔2022〕31号',
      issuingDept: ['汕尾市医疗保障局', '汕尾市财政局'],
      publishDate: '2022-11-25',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.shanwei.gov.cn/swybj/zwgk/zcfg/202211/t20221128_219084.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定一级及以下医疗机构报销比例为70%（退休人员75%），其他定点医疗机构报销60%（退休65%）。2025-2026年度普通门诊统筹年度支付限额在职及退休约为1787元至2100元。'
    },
    {
      docId: 'sw-medical-insurance-inpatient-2024',
      title: '汕尾市基本医疗保险住院与大病保险管理细则',
      docNumber: '汕府规〔2023〕11号',
      issuingDept: ['汕尾市人民政府', '汕尾市医疗保障局'],
      publishDate: '2023-12-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.shanwei.gov.cn/swybj/zwgk/zcfg/202312/t20231225_231908.shtml',
      summaryQuote: '职工市内住院起付标准：一级及以下300元、二级600元、三级800元；报销比例在职一级95%、二级90%、三级85%（退休人员对应提高2%）。居民住院起付线同级，支付比例一级85%、二级78%、三级68%。基本统筹年限额50万元，大病最高35万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'sw-employee-outpatient-2022-31',
      annualDeductible: 0,
      annualCap: 1787,
      annualCapRetiree: 2100,
      tierBenefits: {
        community: { tierName: '基层及一级选定机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医一级及以下报销70%（退休75%），其他机构报销60%（退休65%）。年度限额在职1787元，退休2100元。'
    },
    inpatient: {
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
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
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
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
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
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
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
      annualCap: 654000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.78 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1000, reimbursementRatio: 0.68 }
      }
    },
    catastrophic: {
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
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
      sourceDocId: 'sw-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
