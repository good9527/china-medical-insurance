import type { CityInsuranceData } from '../types';

/**
 * 天津市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹级别：直辖市级统筹（全市统一标准）
 */
export const tianjinCityData: CityInsuranceData = {
  cityCode: '120100',
  cityName: '天津市',
  provinceCode: '120000',
  provinceName: '天津市',
  hotline: '022-12393',
  officialPortalUrl: 'https://ybj.tj.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'tj-employee-outpatient-reform',
      title: '天津市医疗保障局 天津市财政局关于调整职工基本医疗保险门诊报销待遇有关问题的通知',
      docNumber: '津医保发〔2023〕72号',
      issuingDept: ['天津市医疗保障局', '天津市财政局'],
      publishDate: '2023-12-15',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.tj.gov.cn/zwgk_70/zcfg/202312/t20231220_6490332.html',
      summaryQuote: '自2024年1月1日起，职工医保门急诊最高支付限额调整至10000元。在职职工门诊起付线为800元，退休人员为700元（70岁以上650元）。起付线至5500元区间：一级医院报销75%、二级65%、三级55%；5500元以上至10000元区间统一报销55%。'
    },
    {
      docId: 'tj-medical-insurance-inpatient',
      title: '天津市基本医疗保险住院及门诊特殊病报销实施细则',
      docNumber: '津医保发〔2022〕56号及调整通知',
      issuingDept: ['天津市医疗保障局', '天津市财政局'],
      publishDate: '2022-10-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.tj.gov.cn/zwgk_70/zcjd/202210/t20221025_6015523.html',
      summaryQuote: '职工医保首次住院起付线：一级800元、二级1100元、三级1700元（第二次及以上依次减至270/350/500元）；在职报销比例一级85%、二级85%、三级80%（退休人员提高5个百分点）。统筹基金最高支付限额35万元。居民住院起付标准统一为500元（二次住院起不再设起付线），报销比例一级75%、二级70%、三级65%（高档缴费提高10个百分点），年限额25万元。'
    },
    {
      docId: 'tj-resident-outpatient-regulations',
      title: '天津市城乡居民基本医疗保险门诊统筹及大病保险管理办法',
      docNumber: '津医保发〔2021〕88号及2025年度指引',
      issuingDept: ['天津市医疗保障局'],
      publishDate: '2021-12-01',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.tj.gov.cn/zwgk_70/zcwj/202112/t20211210_5742111.html',
      summaryQuote: '城乡居民医保门诊起付线为600元，连续参保人员门诊年报销封顶线为5000元。大病保险起付线按人均可支配收入50%确定（约2.8万元），政策范围内分段报销60%、70%，医疗救助对象取消封顶线。'
    }
  ],

  // 城镇职工医保待遇 (天津标准)
  employee: {
    outpatient: {
      sourceDocId: 'tj-employee-outpatient-reform',
      annualDeductible: 800, // 在职职工门诊起付线 800 元（退休700元）
      annualDeductibleRetiree: 700, // 退休人员门诊起付线 700 元
      annualCap: 10000,      // 2024年起门诊限额提升至 10000 元
      annualCapRetiree: 10000,
      tierBenefits: {
        community: { tierName: '一级及基层社区卫生服务机构', deductible: 800, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 800, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 800, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职800元（退休700元），起付线以上至5500元按等级报销55%-75%，超过5500元至10000元按55%报销。年度累计最高报销10000元。'
    },
    inpatient: {
      sourceDocId: 'tj-medical-insurance-inpatient',
      annualCap: 350000, // 基本统筹限额 35 万元
      tierBenefits: {
        community: { tierName: '一级及社区定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1100, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1700, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等重点医院', deductible: 1700, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '首次住院起付线为800/1100/1700元，第二次及以上降低为270/350/500元。'
    },
    catastrophic: {
      sourceDocId: 'tj-resident-outpatient-regulations',
      name: '城镇职工大额医疗救助',
      deductible: 20000,
      tiers: [
        { minAmount: 20000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tj-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '天津医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀协同发展：京津冀三地跨省异地就医直接结算视同备案，享受本地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (天津标准)
  resident: {
    outpatient: {
      sourceDocId: 'tj-resident-outpatient-regulations',
      annualDeductible: 600, // 门诊起付线 600 元
      annualCap: 5000,       // 连续参保门诊最高支付限额 5000 元/人
      tierBenefits: {
        community: { tierName: '一级及社区卫生服务机构', deductible: 600, reimbursementRatio: 0.55 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.55 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '三甲重点医院', deductible: 600, reimbursementRatio: 0.50 }
      },
      note: '城乡居民门急诊起付线为600元，一级医院报销55%、二级及以上报销50%，年度连续参保限额5000元。'
    },
    inpatient: {
      sourceDocId: 'tj-medical-insurance-inpatient',
      annualCap: 250000, // 居民住院年最高限额 25 万元
      tierBenefits: {
        community: { tierName: '一级及基层社区服务中心', deductible: 500, reimbursementRatio: 0.75 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.70 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三甲综合医院', deductible: 500, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '自然年度内第二次及以上住院不再设起付线。'
    },
    catastrophic: {
      sourceDocId: 'tj-resident-outpatient-regulations',
      name: '城乡居民大病保险',
      deductible: 28000,
      tiers: [
        { minAmount: 28000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tj-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '天津医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀异地就医免备案直接联网结算。'
      ]
    }
  }
};
