import type { CityInsuranceData } from '../types';

export const qingyuanCityData: CityInsuranceData = {
  cityCode: '441800',
  cityName: '清远市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0763-12393',
  officialPortalUrl: 'http://www.gdqy.gov.cn/channel/qysylbzj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'qy-employee-outpatient-2022-35',
      title: '清远市医疗保障局关于印发清远市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '清医保〔2022〕35号',
      issuingDept: ['清远市医疗保障局', '清远市财政局'],
      publishDate: '2022-11-20',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.gdqy.gov.cn/channel/qysylbzj/zwgk/zcfg/202211/t20221125_219084.shtml',
      summaryQuote: '职工普通门诊不设起付线。统筹区内选定一级及以下医疗机构支付比例为85%（退休人员90%），二级医疗机构支付比例为65%（退休70%），三级医疗机构支付比例为55%（退休60%）。年度普通门诊统筹限额在职约为2400元，退休约为2800元。'
    },
    {
      docId: 'qy-medical-insurance-inpatient-2024',
      title: '清远市基本医疗保险住院与大病保险管理实施细则',
      docNumber: '清府办〔2023〕18号',
      issuingDept: ['清远市人民政府办公室', '清远市医疗保障局'],
      publishDate: '2023-12-25',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.gdqy.gov.cn/channel/qysylbzj/zwgk/zcfg/202312/t20231228_231908.shtml',
      summaryQuote: '职工住院起付线：基层卫生机构300元、一级500元、二级800元、三级1200元；在职支付比例一级92%、二级88%、三级82%（退休人员各项提高3%）。居民住院起付线同级，支付比例一级85%、二级78%、三级68%。基本统筹年度限额55万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'qy-employee-outpatient-2022-35',
      annualDeductible: 0,
      annualCap: 2400,
      annualCapRetiree: 2800,
      tierBenefits: {
        community: { tierName: '基层及一级选定医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医一级及以下报销85%（退休90%），二级报销65%（退休70%），三级报销55%（退休60%）。在职限额2400元，退休2800元。'
    },
    inpatient: {
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
      annualCap: 550000,
      tierBenefits: {
        community: { tierName: '基层卫生服务机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 1200, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；市内转诊补足差额。'
    },
    catastrophic: {
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
      name: '职工大病医疗保险',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
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
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 800, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 1200, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1200, reimbursementRatio: 0.65 }
      },
      note: '居民门诊免设起付线，基层选点报销65%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
      annualCap: 300000,
      tierBenefits: {
        community: { tierName: '基层卫生服务机构', deductible: 300, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1200, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
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
      sourceDocId: 'qy-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
