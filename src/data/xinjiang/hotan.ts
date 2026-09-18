import type { CityInsuranceData } from '../types';

export const hotanData: CityInsuranceData = {
  cityCode: '653200',
  cityName: '和田地区',
  provinceCode: '650000',
  provinceName: '新疆维吾尔自治区',
  hotline: '0903-12393',
  officialPortalUrl: 'http://ybj.xjht.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'ht-employee-outpatient-2024-13',
      title: '关于印发新疆维吾尔自治区职工基本医疗保险门诊共济保障实施办法的通知',
      docNumber: '新政办发〔2024〕13号',
      issuingDept: ['新疆维吾尔自治区人民政府办公厅', '和田地区医疗保障局'],
      publishDate: '2024-03-15',
      effectiveDate: '2024-04-01',
      status: 'active',
      officialUrl: 'http://ybj.xjht.gov.cn/zwgk/zcfg/202403/t20240325_589123.html',
      summaryQuote: '门诊统筹次均起付标准一级20元、二级40元、三级90元。统筹支付比例一级80%（退休85%）、二级70%（退休75%）、三级60%（退休65%）。门诊统筹年度最高支付限额统一为4000元。'
    },
    {
      docId: 'ht-medical-insurance-inpatient-2024',
      title: '和田地区基本医疗保险综合保障管理实施细则',
      docNumber: '和医保发〔2024〕25号',
      issuingDept: ['和田地区医疗保障局', '和田地区财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xjht.gov.cn/zwgk/zcfg/202411/t20241126_691234.html',
      summaryQuote: '职工住院起付线：三级900元、二级400元、一级200元；在职支付比例三级85%、二级88%、一级92%（退休人员加3%-4%）。居民住院起付线三级800元/60%、二级300元/75%、一级100元/85%。基本统筹限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (和田标准)
  employee: {
    outpatient: {
      sourceDocId: 'ht-employee-outpatient-2024-13',
      annualDeductible: 90,
      annualCap: 4000,
      annualCapRetiree: 4000,
      tierBenefits: {
        community: { tierName: '一级及基层定点医疗机构', deductible: 20, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 20, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 40, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '地区三级定点医疗机构', deductible: 90, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 90, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊次均起付标准一级20元、二级40元、三级90元。统筹报销比例60%-80%，退休人员加5%（65%-85%），年度限额4000元。'
    },
    inpatient: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '地区三级定点医疗机构', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '三甲综合医院', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线按规定递减。'
    },
    catastrophic: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '新疆医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '执行自治区统一异地就医直接结算标准。'
      ]
    }
  },

  // 城乡居民医保待遇 (和田标准)
  resident: {
    outpatient: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲综合医院', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全疆统一）',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ht-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '新疆医保微信小程序'],
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
