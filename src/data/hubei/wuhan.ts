import type { CityInsuranceData } from '../types';

/**
 * 武汉市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420100
 */
export const wuhanCityData: CityInsuranceData = {
  cityCode: '420100',
  cityName: '武汉市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '027-12393 / 027-87812393',
  officialPortalUrl: 'https://ybj.wuhan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'wh-employee-outpatient-reform-2023',
      title: '武汉市人民政府关于印发武汉市职工基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '武政规〔2022〕24号及市医保局现行规程',
      issuingDept: ['武汉市人民政府', '武汉市医疗保障局'],
      publishDate: '2022-12-31',
      effectiveDate: '2023-02-01',
      status: 'active',
      officialUrl: 'https://ybj.wuhan.gov.cn/zwgk/zcfg/202301/t20230105_2125890.html',
      summaryQuote: '自2023年2月1日起实施。职工普通门诊统筹起付标准调整为0元（免起付线）。在职职工在一级医疗机构/药店报销85%（退休90%）、二级医疗机构报销65%（退休75%）、三级医疗机构报销55%（退休65%）。普通门诊年度统筹最高支付限额在职职工3500元，退休人员4500元。'
    },
    {
      docId: 'wh-medical-insurance-inpatient',
      title: '武汉市基本医疗保险和生育保险办法及其实施细则',
      docNumber: '武汉市人民政府令第292号及2024调整通知',
      issuingDept: ['武汉市人民政府', '武汉市医疗保障局'],
      publishDate: '2022-11-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.wuhan.gov.cn/zwgk/zcjd/202211/t20221120_2098765.html',
      summaryQuote: '职工医保住院起付线：三级800元、二级600元、一级400元、社区200元（年度内二次及以上住院减半）。在职职工三级住院报销比例约为86%（退休人员约为90%）。基本医疗保险统筹基金年最高支付限额24万元，超过部分进入大额医保继续报销30万元（合计54万元）。居民住院起付线：三级800元、二级400元、一级200元，报销比例平均约70%，年度限额约15万元。'
    },
    {
      docId: 'wh-outpatient-zerodeductible-2024',
      title: '武汉市医疗保障局关于优化调整职工基本医疗保险普通门诊统筹起付标准有关事项的通知',
      docNumber: '武医保发〔2024〕12号',
      issuingDept: ['武汉市医疗保障局', '武汉市财政局'],
      publishDate: '2024-03-28',
      effectiveDate: '2024-04-01',
      status: 'active',
      officialUrl: 'https://ybj.wuhan.gov.cn/zwgk/zcfg/202404/t20240402_2384910.html',
      summaryQuote: '自2024年4月1日起，职工医保普通门诊统筹起付标准由在职700元、退休500元统一调整为0元（免起付门槛）；在职一级机构报销85%（退休90%）、二级报销65%（退休75%）、三级报销55%（退休65%），年度限额在职3500元、退休4500元。'
    },
    {
      docId: 'wh-resident-insurance-2024',
      title: '武汉市城乡居民基本医疗保险门诊统筹及大病保险管理规程',
      docNumber: '武医保规〔2023〕16号',
      issuingDept: ['武汉市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.wuhan.gov.cn/zwgk/zcjd/202311/t20231125_2219481.html',
      summaryQuote: '城乡居民普通门诊统筹在基层定点社区卫生服务中心或乡镇卫生院免起付线即时结算，报销比例50%，年度统筹基金最高支付限额为400元/人。大病保险实行按费用分段报销，政策范围内个人负担费用超过起付线后报销60%至75%。'
    }
  ],

  // 城镇职工医保待遇 (武汉标准)
  employee: {
    outpatient: {
      sourceDocId: 'wh-employee-outpatient-reform-2023',
      annualDeductible: 0,   // 武汉职工门诊全面取消起付线（0元起付）
      annualCap: 3500,       // 在职门诊年限额 3500 元
      annualCapRetiree: 4500, // 退休门诊年限额 4500 元
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '普通门诊免设起付线，在职职工在社区/一级医院报销85%（退休90%），二级医院报销65%（退休75%），三级医院报销55%（退休65%）。在职限额3500元，退休限额4500元。'
    },
    inpatient: {
      sourceDocId: 'wh-medical-insurance-inpatient',
      annualCap: 240000, // 基本医疗保险统筹限额 24 万元
      comprehensiveCap: 540000, // 叠加职工大额医疗保险30万后综合年保障 54 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.90, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '一个年度内二次及以上住院起付线减半。'
    },
    catastrophic: {
      sourceDocId: 'wh-medical-insurance-inpatient',
      name: '武汉市城镇职工大额医疗保险',
      deductible: 240000,
      annualCap: 300000,
      tiers: [
        { minAmount: 240000, maxAmount: 540000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wh-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省异地就医直接联网结算，符合规范备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (武汉标准)
  resident: {
    outpatient: {
      sourceDocId: 'wh-employee-outpatient-reform-2023',
      annualDeductible: 0,
      annualCap: 400, // 居民门诊统筹限额 400 元
      tierBenefits: {
        community: { tierName: '基层社区服务中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点社区卫生中心不设起付线，报销50%，年限额400元。'
    },
    inpatient: {
      sourceDocId: 'wh-medical-insurance-inpatient',
      annualCap: 150000, // 居民住院年最高限额 15 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务中心/乡镇卫生院', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.70 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 800, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '一个医保年度内第二次及以上住院，起付标准减半（社区及一级机构除外）。'
    },
    catastrophic: {
      sourceDocId: 'wh-medical-insurance-inpatient',
      name: '城乡居民大病保险',
      deductible: 12000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wh-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，规范备案人员与本地享受同等待遇。'
      ]
    }
  }
};
