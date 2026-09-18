import type { CityInsuranceData } from '../types';

export const lhasaCityData: CityInsuranceData = {
  cityCode: '540100',
  cityName: '拉萨市',
  provinceCode: '540000',
  provinceName: '西藏自治区',
  hotline: '0891-12393',
  officialPortalUrl: 'http://ybj.xizang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'xz-employee-outpatient-2021-36',
      title: '西藏自治区关于建立职工基本医疗保险门诊共济保障机制的实施办法',
      docNumber: '藏政办发〔2021〕36号及2023年优化调整规程',
      issuingDept: ['西藏自治区人民政府办公厅', '西藏自治区医疗保障局'],
      publishDate: '2021-12-25',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xizang.gov.cn/zwgk/zcfg/202305/t20230510_3190823.html',
      summaryQuote: '在职职工门诊年度累计起付标准为200元（退休140元）。统筹支付比例一级及以下80%（退休90%）、二级70%（退休80%）、三级60%（退休70%）。门诊统筹年度最高支付限额提高至5000元。'
    },
    {
      docId: 'ls-medical-insurance-inpatient-2024',
      title: '拉萨市基本医疗保险住院与医疗救助待遇管理细则',
      docNumber: '拉医保发〔2024〕19号',
      issuingDept: ['拉萨市医疗保障局', '拉萨市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xizang.gov.cn/zwgk/zcfg/202411/t20241126_3490124.html',
      summaryQuote: '职工住院起付线：三级600元、二级300元、一级100元；在职支付比例三级90%、二级92%、一级95%（退休人员提高至94%、96%、98%）。居民住院起付线三级500元/70%、二级200元/80%、一级100元/90%。基本统筹限额15万元。大病保险起付线8000元，分段报销65%-85%，封顶40万元。'
    }
  ],

  // 城镇职工医保待遇 (拉萨/西藏标准)
  employee: {
    outpatient: {
      sourceDocId: 'xz-employee-outpatient-2021-36',
      annualDeductible: 200, // 在职门诊起付线 200 元（退休140元）
      annualCap: 5000,       // 门诊统筹年度最高限额 5000 元
      annualCapRetiree: 5000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '自治区重点三甲医院', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线在职200元、退休140元。统筹报销比例在职60%-80%，退休人员提高10%（70%-90%）。年度最高支付限额5000元。'
    },
    inpatient: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹 + 职工大额救助
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 100, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '自治区重点三甲医院', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线享受规程减半。'
    },
    catastrophic: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '西藏医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省异地就医直接结算享受对应比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (拉萨/西藏标准)
  resident: {
    outpatient: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      annualCap: 400, // 居民普通门诊年度限额 400 元
      tierBenefits: {
        community: { tierName: '基层卫生院及社区中心', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '自治区三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销60%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '基层社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 500, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '自治区重点三甲医院', deductible: 500, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 8000,
      annualCap: 400000,
      tiers: [
        { minAmount: 8000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ls-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '西藏医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定办理转诊手续或备案的外出就医人员，支付比例相应降低。'
      ]
    }
  }
};
