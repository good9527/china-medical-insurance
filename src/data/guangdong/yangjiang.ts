import type { CityInsuranceData } from '../types';

export const yangjiangCityData: CityInsuranceData = {
  cityCode: '441700',
  cityName: '阳江市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0662-12393',
  officialPortalUrl: 'http://www.yangjiang.gov.cn/yjybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'yj-medical-benefits-2025',
      title: '阳江市医疗保障局关于印发阳江市医疗保障待遇清单（2025年版）的通知',
      docNumber: '阳医保发〔2024〕28号',
      issuingDept: ['阳江市医疗保障局', '阳江市财政局'],
      publishDate: '2024-12-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://www.yangjiang.gov.cn/yjybj/zwgk/zcfg/202412/t20241225_241908.shtml',
      summaryQuote: '职工普通门诊按月度限额管理，职工普通门诊限额165.5元/月（折算年限额约1986元）。实行一大一小选点，基层报销70%（退休75%），一级报销60%（退休65%），二级报销55%（退休60%），三级未纳统筹。居民普通门诊月度限额132.4元/月（年限额折算约1588元），基层报销60%。居民统筹年度限额15万元。'
    },
    {
      docId: 'yj-medical-insurance-inpatient-2024',
      title: '阳江市医疗保障局关于调整基本医疗保险住院及门诊特定病种报销比例的通知',
      docNumber: '阳医保发〔2024〕16号',
      issuingDept: ['阳江市医疗保障局', '阳江市财政局'],
      publishDate: '2024-09-20',
      effectiveDate: '2024-10-01',
      status: 'active',
      officialUrl: 'http://www.yangjiang.gov.cn/yjybj/zwgk/zcfg/202409/t20240925_241908.shtml',
      summaryQuote: '职工住院起付线：一级及以下200元、二级500元、三级800元；报销比例在职一级95%、二级88%、三级82%（退休人员对应为97%、91%、85%）。居民住院起付线同级，支付比例一级88%、二级80%、三级70%。基本医保年限额50万元，大病最高35万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'yj-medical-benefits-2025',
      annualDeductible: 0,
      annualCap: 1986,
      annualCapRetiree: 1986,
      tierBenefits: {
        community: { tierName: '基层社区/卫生院(小点)', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构(大点)', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '实行一大一小双定点就医，免起付线。月度限额165.5元/月（年折算约1986元）。基层在职70%（退休75%），一级在职60%（退休65%），二级在职55%（退休60%），三级未纳普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'yj-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'yj-medical-insurance-inpatient-2024',
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
      sourceDocId: 'yj-medical-insurance-inpatient-2024',
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
      sourceDocId: 'yj-medical-benefits-2025',
      annualCap: 1588,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级三甲综合医院(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊免设起付线，选定基层机构报销60%，月度限额132.4元/月（年累计折算约1588元）。二级及以上不设普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'yj-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 800, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'yj-medical-insurance-inpatient-2024',
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
      sourceDocId: 'yj-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
