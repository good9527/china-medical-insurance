import type { CityInsuranceData } from '../types';

export const haikouCityData: CityInsuranceData = {
  cityCode: '460100',
  cityName: '海口市',
  provinceCode: '460000',
  provinceName: '海南省',
  hotline: '0898-12393',
  officialPortalUrl: 'http://ybj.hainan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hn-employee-outpatient-2021-5',
      title: '海南省城镇从业人员基本医疗保险普通门诊共济保障管理办法（试行）',
      docNumber: '琼医保规〔2021〕5号',
      issuingDept: ['海南省医疗保障局', '海南省财政厅'],
      publishDate: '2021-12-15',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hainan.gov.cn/zwgk/zcfg/202112/t20211220_3108912.html',
      summaryQuote: '门诊年度起付标准一级及以下10元、二级50元、三级100元。统筹支付比例一级及以下70%、二级60%、三级50%。年度门诊统筹最高支付标准在职1500元，退休人员2000元。'
    },
    {
      docId: 'hn-medical-insurance-inpatient-2024',
      title: '海南省基本医疗保险住院保障及全省统筹支付管理细则',
      docNumber: '琼医保规〔2024〕12号',
      issuingDept: ['海南省医疗保障局', '海南省财政厅'],
      publishDate: '2024-11-25',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hainan.gov.cn/zwgk/zcfg/202411/t20241130_3490124.html',
      summaryQuote: '职工住院起付线：三级600元、二级300元、一级150元；在职支付比例三级85%、二级88%、一级92%（退休人员提高至89%、92%、95%）。居民住院起付线三级600元/65%、二级300元/75%、一级100元/90%。全省统筹基本医保年度限额26万元。'
    }
  ],

  // 城镇职工医保待遇 (海口/海南标准)
  employee: {
    outpatient: {
      sourceDocId: 'hn-employee-outpatient-2021-5',
      annualDeductible: 100, // 门诊年度基准起付线
      annualCap: 1500,       // 在职限额 1500 元
      annualCapRetiree: 2000, // 退休限额 2000 元
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 10, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 10, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.60 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 100, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 100, reimbursementRatio: 0.50 }
      },
      note: '门诊年度起付线一级10元、二级50元、三级100元。统筹报销比例50%-70%。在职限额1500元，退休限额2000元。'
    },
    inpatient: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹26万 + 大额救助
      tierBenefits: {
        community: { tierName: '一级基层定点医疗机构', deductible: 150, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省级重点三甲综合医院', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '全省范围内医保就医直接联网结算，多次住院起付线按规定执行。'
    },
    catastrophic: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '海南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省异地就医直接结算享受对应比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (海口/海南标准)
  resident: {
    outpatient: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      annualCap: 300, // 居民普通门诊年度限额 300 元
      tierBenefits: {
        community: { tierName: '基层卫生院及社区中心', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额300元。'
    },
    inpatient: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '基层社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 600, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 600, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 300000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hn-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '海南医保小程序'],
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
