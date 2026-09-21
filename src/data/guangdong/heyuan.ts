import type { CityInsuranceData } from '../types';

export const heyuanCityData: CityInsuranceData = {
  cityCode: '441600',
  cityName: '河源市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0762-12393',
  officialPortalUrl: 'http://www.heyuan.gov.cn/hysylbzj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'hy-employee-outpatient-2022-26',
      title: '河源市医疗保障局关于印发河源市职工基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '河医保〔2022〕26号',
      issuingDept: ['河源市医疗保障局', '河源市财政局'],
      publishDate: '2022-11-20',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.heyuan.gov.cn/hysylbzj/zwgk/zcfg/202211/t20221124_219084.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定基层医疗机构报销比例为70%（退休人员75%），二级机构报销60%（退休65%），三级机构报销50%（退休55%）。年度普通门诊统筹限额在职约为2000元，退休约为2400元。'
    },
    {
      docId: 'hy-medical-insurance-inpatient-2024',
      title: '河源市基本医疗保险住院与大病保险管理规定',
      docNumber: '河府办〔2023〕19号',
      issuingDept: ['河源市人民政府办公室', '河源市医疗保障局'],
      publishDate: '2023-12-22',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.heyuan.gov.cn/hysylbzj/zwgk/zcfg/202312/t20231226_231908.shtml',
      summaryQuote: '职工住院起付线：一级及以下200元、二级500元、三级800元；在职支付比例一级90%、二级85%、三级80%（退休人员各项提高3%）。居民住院起付线同级，支付比例一级85%、二级78%、三级68%。基本统筹年度限额50万元，大病最高35万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'hy-employee-outpatient-2022-26',
      annualDeductible: 0,
      annualCap: 2000,
      annualCapRetiree: 2400,
      tierBenefits: {
        community: { tierName: '基层及一级选定机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医基层报销70%（退休75%），二级报销60%（退休65%），三级报销50%（退休55%）。年度限额在职2000元，退休2400元。'
    },
    inpatient: {
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.80, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.80, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
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
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
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
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
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
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
      annualCap: 300000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.78 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1000, reimbursementRatio: 0.68 }
      }
    },
    catastrophic: {
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
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
      sourceDocId: 'hy-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
