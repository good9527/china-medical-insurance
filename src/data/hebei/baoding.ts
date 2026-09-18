import type { CityInsuranceData } from '../types';

export const baodingData: CityInsuranceData = {
  cityCode: '130600',
  cityName: '保定市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0312-12393',
  officialPortalUrl: 'https://ybj.baoding.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'bd-employee-outpatient-2022',
      title: '保定市城镇职工基本医疗保险实施细则及门诊共济保障机制调整方案',
      docNumber: '保医保发〔2022〕4号',
      issuingDept: ['保定市医疗保障局', '保定市财政局'],
      publishDate: '2022-01-15',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.baoding.gov.cn/art/2022/1/18/art_1320_18210.html',
      summaryQuote: '自2024年1月1日起，保定市职工医保普通门诊统筹年度起付线为100元，在职职工报销比例提高至60%，退休人员提高至70%。在职参保人员年度统筹最高支付限额900元，退休人员1200元。个人账户资金可用于配偶、父母、子女在定点医药机构共济结算。'
    },
    {
      docId: 'bd-employee-resident-inpatient-2021',
      title: '保定市城镇职工基本医疗保险实施办法及城乡居民保障政策通知',
      docNumber: '保医保发〔2021〕84号',
      issuingDept: ['保定市医疗保障局', '保定市财政局'],
      publishDate: '2021-12-20',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.baoding.gov.cn/art/2021/12/25/art_1320_17492.html',
      summaryQuote: '职工住院起付线：三级医疗机构800元、二级500元、一级200元；在职支付比例分别为85%、88%、92%，退休人员支付比例上浮3个百分点，职工医保年度统筹限额20万元，大额医疗补助限额50万元。城乡居民门诊报销比例提高至60%；居民住院起付线三级1200元、二级600元、一级200元，报销比例对应60%、75%、85%，年度限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (保定标准)
  employee: {
    outpatient: {
      sourceDocId: 'bd-employee-outpatient-2022',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 900,        // 在职限额 900 元
      annualCapRetiree: 1200, // 退休限额 1200 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线100元，在职报销60%，退休人员报销70%。限额在职900元，退休1200元。'
    },
    inpatient: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      annualCap: 200000, // 职工基本医保年度限额 20 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内医疗机构就医免备案直接结算，享受与保定同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (保定标准)
  resident: {
    outpatient: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      annualCap: 200, // 普通门诊统筹年度最高限额 200 元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '普通门诊统筹报销比例提高至60%（基层），年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bd-employee-resident-inpatient-2021',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '京津冀区域内就医免备案直接联网结算。'
      ]
    }
  }
};
