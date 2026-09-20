import type { CityInsuranceData } from '../types';

export const foshanCityData: CityInsuranceData = {
  cityCode: '440600',
  cityName: '佛山市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0757-12393',
  officialPortalUrl: 'http://fssi.foshan.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'fs-employee-outpatient-2022-26',
      title: '佛山市人民政府办公室关于印发佛山市基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '佛府办〔2022〕26号',
      issuingDept: ['佛山市人民政府办公室', '佛山市医疗保障局'],
      publishDate: '2022-10-18',
      effectiveDate: '2022-11-01',
      status: 'active',
      officialUrl: 'http://fssi.foshan.gov.cn/zwgk/zcfg/202210/t20221020_210984.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定基层医疗机构普通门诊报销比例为80%（退休人员85%），二级机构报销65%（退休70%），三级机构报销55%（退休60%）。职工门诊年度统筹支付限额在职及退休约为2500元至3000元。'
    },
    {
      docId: 'fs-medical-insurance-inpatient-2023',
      title: '佛山市基本医疗保险住院与大病保险待遇保障办法',
      docNumber: '佛医保发〔2023〕15号',
      issuingDept: ['佛山市医疗保障局', '佛山市财政局'],
      publishDate: '2023-12-10',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://fssi.foshan.gov.cn/zwgk/zcfg/202312/t20231215_241908.shtml',
      summaryQuote: '职工医保住院起付线：一级及以下250元、二级500元、三级1000元；报销比例在职一级95%、二级91%、三级87%（退休人员分别为97%、93%、89%）。基本医保年度封顶60万元。居民住院起付线同级，报销比例一级90%、二级85%、三级75%。大病保险起付线1.5万元，报销比例60%-80%，年度限额40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'fs-employee-outpatient-2022-26',
      annualDeductible: 0,
      annualCap: 3000,
      annualCapRetiree: 3500,
      tierBenefits: {
        community: { tierName: '基层社区定点门诊机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三级甲等医院', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选定基层就医报销80%（退休85%），二级机构报销65%（退休70%），三级机构报销55%（退休60%）。在职限额3000元，退休3500元。'
    },
    inpatient: {
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 250, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 250, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.91, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.87, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 1000, reimbursementRatio: 0.87, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '参保人员每次住院支付一次起付标准；恶性肿瘤放化疗等同年度内第二次起付线减半，第三次及以上免起付线。'
    },
    catastrophic: {
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
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
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['异地长期居留备案享受同等比例，市内/市外规范转诊按规定结算，未备案非急诊就医下调比例。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
      annualCap: 1500,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点医疗机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点医疗机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '居民门诊在基层定点机构免起付线报销70%，选定二级及以上机构报销40%-50%，年度限额1500元。'
    },
    inpatient: {
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 300, reimbursementRatio: 0.95 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.95 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.90 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.85 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1200, reimbursementRatio: 0.85 }
      },
      repeatedDeductibleRule: '参保人员每次住院支付一次起付标准；日间手术起付标准为500元/次；严重精神障碍住院不设起付标准。'
    },
    catastrophic: {
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 762538, // 挂钩上上年度职工年平均工资7倍（2024-2025年为762538元）
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'fs-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.75, // 临时自行到市外就医支付比例提高为一级75%、二级70%、三级65%
      specialNotes: [
        '长期居住异地备案享受市内同等待遇。未备案临时市外就医支付比例为一级75%、二级70%、三级65%，大病保险降低25个百分点。'
      ]
    }
  }
};
