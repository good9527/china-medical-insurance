import type { CityInsuranceData } from '../types';

export const nanningCityData: CityInsuranceData = {
  cityCode: '450100',
  cityName: '南宁市',
  provinceCode: '450000',
  provinceName: '广西壮族自治区',
  hotline: '0771-12393',
  officialPortalUrl: 'http://ybj.nanning.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'nn-employee-outpatient-2022-31',
      title: '南宁市职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '南府规〔2022〕31号',
      issuingDept: ['南宁市人民政府', '南宁市医疗保障局'],
      publishDate: '2022-12-08',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nanning.gov.cn/zwgk/zcfg/202212/t20221215_4289012.html',
      summaryQuote: '参保职工门诊起付标准一级100元、二级200元、三级300元。统筹支付比例一级60%（退休65%）、二级55%（退休60%）、三级50%（退休55%）。年度门诊统筹最高支付限额在职2000元，退休2600元。'
    },
    {
      docId: 'nn-medical-insurance-inpatient-2024',
      title: '南宁市基本医疗保险住院与医疗救助待遇管理规程',
      docNumber: '南医保规〔2024〕16号',
      issuingDept: ['南宁市医疗保障局', '南宁市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nanning.gov.cn/zwgk/zcfg/202411/t20241125_4678129.html',
      summaryQuote: '职工住院起付线：三级800元、二级400元、一级200元；在职支付比例三级85%、二级90%、一级92%（退休人员分别为88%、93%、95%）。居民住院起付线三级600元/60%、二级300元/75%、一级100元/90%，基本统筹限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (南宁标准)
  employee: {
    outpatient: {
      sourceDocId: 'nn-employee-outpatient-2022-31',
      annualDeductible: 300, // 门诊年度基准起付线
      annualCap: 2000,       // 在职限额 2000 元
      annualCapRetiree: 2600, // 退休限额 2600 元
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '自治区级三甲医院', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线一级100元、二级200元、三级300元。报销比例在职50%-60%，退休人员加5%，在职限额2000元，退休限额2600元。'
    },
    inpatient: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹 + 职工大额救助
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '自治区级重点三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线享受递减规程。'
    },
    catastrophic: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '广西医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范办理备案直接联网结算享受对应比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (南宁标准)
  resident: {
    outpatient: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      annualCap: 300, // 居民普通门诊年度限额 300 元
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '自治区三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额300元。'
    },
    inpatient: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '一级定点医疗机构及基层中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 600, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '自治区重点三甲医院', deductible: 600, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 400000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nn-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '广西医保微信小程序'],
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
