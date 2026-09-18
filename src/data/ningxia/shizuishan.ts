import type { CityInsuranceData } from '../types';

export const shizuishanData: CityInsuranceData = {
  cityCode: '640200',
  cityName: '石嘴山市',
  provinceCode: '640000',
  provinceName: '宁夏回族自治区',
  hotline: '0952-12393',
  officialPortalUrl: 'http://ybj.shizuishan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'szs-employee-outpatient-2023',
      title: '宁夏回族自治区职工基本医疗保险门诊共济保障实施办法',
      docNumber: '宁医保规〔2023〕3号',
      issuingDept: ['宁夏回族自治区医疗保障局', '石嘴山市医疗保障局'],
      publishDate: '2023-05-15',
      effectiveDate: '2023-06-01',
      status: 'active',
      officialUrl: 'http://ybj.shizuishan.gov.cn/zwgk/zcfg/202305/t20230520_4109234.html',
      summaryQuote: '门诊年度起付标准一级及以下免起付线、二级100元、三级300元。统筹支付比例三甲60%（退休65%）、三乙65%（退休70%）、二级70%（退休75%）、一级及以下75%（退休80%）。门诊统筹年度基金最高支付限额在职4000元，退休人员4500元。'
    },
    {
      docId: 'szs-medical-insurance-inpatient-2024',
      title: '石嘴山市基本医疗保险统筹支付与待遇保障管理细则',
      docNumber: '石医保发〔2024〕25号',
      issuingDept: ['石嘴山市医疗保障局', '石嘴山市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.shizuishan.gov.cn/zwgk/zcfg/202411/t20241126_5190123.html',
      summaryQuote: '职工住院起付线：三级800元、二级400元、一级200元；在职支付比例三级85%、二级88%、一级92%（退休人员提高至89%、92%、95%）。居民住院起付线三级700元/60%、二级300元/75%、一级100元/85%。基本统筹限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (石嘴山标准)
  employee: {
    outpatient: {
      sourceDocId: 'szs-employee-outpatient-2023',
      annualDeductible: 300,
      annualCap: 4000,
      annualCapRetiree: 4500,
      tierBenefits: {
        community: { tierName: '一级及基层定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线一级免起付、二级100元、三级300元。报销比例在职60%-75%，退休人员加5%（65%-80%）。在职限额4000元，退休限额4500元。'
    },
    inpatient: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '三甲综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线按全区统一规定执行。'
    },
    catastrophic: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '宁夏医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省及区内异地直接联网结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (石嘴山标准)
  resident: {
    outpatient: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      annualCap: 300,
      tierBenefits: {
        community: { tierName: '基层社区及卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额300元。'
    },
    inpatient: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲综合医院', deductible: 700, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全区统一）',
      deductible: 10000,
      annualCap: 300000,
      tiers: [
        { minAmount: 10000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'szs-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '宁夏医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '执行全区统一异地就医直接结算标准。'
      ]
    }
  }
};
