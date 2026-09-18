import type { CityInsuranceData } from '../types';

export const zhuhaiCityData: CityInsuranceData = {
  cityCode: '440400',
  cityName: '珠海市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0756-12393',
  officialPortalUrl: 'http://zhylbz.zhuhai.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'zh-employee-outpatient-2022-18',
      title: '珠海市医疗保障局关于印发珠海市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '珠医保〔2022〕18号',
      issuingDept: ['珠海市医疗保障局', '珠海市财政局'],
      publishDate: '2022-10-25',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://zhylbz.zhuhai.gov.cn/zwgk/zcfg/202210/t20221028_341901.shtml',
      summaryQuote: '职工普通门诊统筹不设起付线。选定门诊统筹定点机构后，在职职工报销80%，退休人员报销85%（签约家庭医生提高5%）。经转诊到市内二级及以上定点医疗机构，支付比例为70%。年度普通门诊统筹最高支付限额在职及退休累计为3500元。'
    },
    {
      docId: 'zh-medical-insurance-inpatient-2024',
      title: '珠海市人民政府关于印发珠海市基本医疗保险办法的通知',
      docNumber: '珠府〔2024〕57号',
      issuingDept: ['珠海市人民政府', '珠海市医疗保障局'],
      publishDate: '2024-08-20',
      effectiveDate: '2024-09-01',
      status: 'active',
      officialUrl: 'http://zhylbz.zhuhai.gov.cn/zwgk/zcfg/content/post_3698712.html',
      summaryQuote: '职工住院起付线：一级300元、二级500元、三级1000元。统账结合职工报销比例在职一级94%、二级93%、三级92%；退休人员各级统一为95%。基本医疗保险统筹基金年支付限额60万元。城乡居民住院起付线一级300元、二级500元、三级1000元，统筹基金支付比例一级、二级、三级医院统一为90%。连续缴费满1年及集中缴费期参保居民年度限额40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'zh-employee-outpatient-2022-18',
      annualDeductible: 0, // 珠海职工门诊免设起付线
      annualCap: 3500,     // 年度统筹支付限额 3500 元
      annualCapRetiree: 3500,
      tierBenefits: {
        community: { tierName: '基层门诊统筹选定定点机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级医疗机构(转诊)', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构(转诊)', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院(转诊)', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选定门诊统筹定点机构在职报销80%（退休85%），签约家庭医生再提5%；转诊二级及以上机构报销70%（退休75%）。年度限额3500元。'
    },
    inpatient: {
      sourceDocId: 'zh-medical-insurance-inpatient-2023',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 300, reimbursementRatio: 0.94, retireeRatioBonus: 0.01 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.94, retireeRatioBonus: 0.01 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.93, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 1000, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人年度内多次住院，起付线每次均按对应机构级别扣除；转诊住院扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'zh-medical-insurance-inpatient-2023',
      name: '职工大病医疗保险/大爱乐康',
      deductible: 10000,
      annualCap: 500000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.80 },
        { minAmount: 100000, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zh-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地长期居住备案不降比例，规范转诊市外报销比例下调10%，非备案自行就医报销比例按70%执行。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'zh-medical-insurance-inpatient-2023',
      annualCap: 1500,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点机构(转诊)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(转诊)', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '居民门诊在基层定点机构免起付线报销70%，转诊二级及以上报销50%，年度统筹支付限额1500元。'
    },
    inpatient: {
      sourceDocId: 'zh-medical-insurance-inpatient-2024',
      annualCap: 400000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 300, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.90 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1000, reimbursementRatio: 0.90 }
      }
    },
    catastrophic: {
      sourceDocId: 'zh-medical-insurance-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 400000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zh-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
