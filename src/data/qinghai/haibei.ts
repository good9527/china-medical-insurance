import type { CityInsuranceData } from '../types';

export const haibeiData: CityInsuranceData = {
  cityCode: '632200',
  cityName: '海北藏族自治州',
  provinceCode: '630000',
  provinceName: '青海省',
  hotline: '0970-12393',
  officialPortalUrl: 'http://ybj.haibei.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hb-employee-outpatient-2021',
      title: '青海省职工基本医疗保险门诊共济保障实施办法',
      docNumber: '青政办〔2021〕79号',
      issuingDept: ['青海省人民政府办公厅', '海北州医疗保障局'],
      publishDate: '2021-12-28',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'http://ybj.haibei.gov.cn/zwgk/zcfg/202112/t20211230_3190823.html',
      summaryQuote: '门诊统筹不设起付标准。统筹基金支付比例二级及以下60%（退休70%）、三级50%（退休60%）。门诊统筹每人每年最高支付限额统一为2000元。'
    },
    {
      docId: 'hb-medical-insurance-inpatient-2024',
      title: '海北州基本医疗保险综合保障管理实施细则',
      docNumber: '北医保发〔2024〕26号',
      issuingDept: ['海北藏族自治州医疗保障局', '海北藏族自治州财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.haibei.gov.cn/zwgk/zcfg/202411/t20241126_6391024.html',
      summaryQuote: '职工住院起付线：三级800元、二级400元、一级200元；在职支付比例三级85%、二级88%、一级92%（退休人员提高至89%、92%、95%）。居民住院起付线三级700元/60%、二级300元/75%、一级100元/85%。基本统筹限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (海北标准)
  employee: {
    outpatient: {
      sourceDocId: 'hb-employee-outpatient-2021',
      annualDeductible: 0,
      annualCap: 2000,
      annualCapRetiree: 2000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '州属三级定点医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '普通门诊零起付线，二级及以下报销60%（退休70%），三级50%（退休60%），年限额统一2000元。'
    },
    inpatient: {
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '州属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '三甲综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线按规定递减。'
    },
    catastrophic: {
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '青海医保微信服务平台'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省及省内异地直接联网结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (海北标准)
  resident: {
    outpatient: {
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
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
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
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
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全省统一）',
      deductible: 10000,
      annualCap: 350000,
      tiers: [
        { minAmount: 10000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hb-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '青海医保微信服务平台'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '执行全省统一异地就医直接结算标准。'
      ]
    }
  }
};
