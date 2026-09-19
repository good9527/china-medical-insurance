import type { CityInsuranceData } from '../types';

export const zhongshanCityData: CityInsuranceData = {
  cityCode: '442000',
  cityName: '中山市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0760-12393',
  officialPortalUrl: 'http://www.zs.gov.cn/ybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'zs-employee-outpatient-2022-29',
      title: '中山市人民政府办公室关于印发中山市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '中府办〔2022〕29号',
      issuingDept: ['中山市人民政府办公室', '中山市医疗保障局'],
      publishDate: '2022-11-20',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.zs.gov.cn/ybj/zwgk/zcfg/202211/t20221125_219083.shtml',
      summaryQuote: '职工普通门诊不设起付线。统账结合参保人在基层医疗机构报销82%（退休人员87%），二级医疗机构报销65%（退休70%），三级医疗机构报销50%（退休55%）。年度门诊统筹最高支付限额在职约为3190元，退休约为3500元。'
    },
    {
      docId: 'zs-medical-insurance-inpatient-2023',
      title: '中山市基本医疗保险办法及住院统筹支付规程',
      docNumber: '中府〔2023〕65号',
      issuingDept: ['中山市人民政府', '中山市医疗保障局'],
      publishDate: '2023-11-28',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.zs.gov.cn/ybj/zwgk/zcfg/202311/t20231130_239108.shtml',
      summaryQuote: '职工住院起付线：一级及以下400元、二级600元、三级800元；统账结合参保人报销比例在职三级90%、二级92%、一级95%（退休人员分别为92%、94%、97%）。居民住院起付线同级，支付比例一级90%、二级85%、三级75%。大病保险起付线1.5万元，分段报销60%-80%，年度封顶40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'zs-employee-outpatient-2022-29',
      annualDeductible: 0,
      annualCap: 3190,
      annualCapRetiree: 3500,
      tierBenefits: {
        community: { tierName: '基层社区定点医疗机构', deductible: 0, reimbursementRatio: 0.82, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.82, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。统账结合基层报销82%（退休87%），二级报销65%（退休70%），三级报销50%（退休55%）。年度限额在职3190元，退休3500元。'
    },
    inpatient: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '参保人年度内多次住院，起付线每次按医疗机构级别扣除；跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      name: '职工大病医疗保险',
      deductible: 15000,
      annualCap: 400000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
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
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '居民门诊免设起付线，基层选点报销70%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 400, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.85 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.75 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 800, reimbursementRatio: 0.75 }
      }
    },
    catastrophic: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 400000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
