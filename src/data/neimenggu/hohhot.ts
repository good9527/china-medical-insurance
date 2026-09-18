import type { CityInsuranceData } from '../types';

export const hohhotCityData: CityInsuranceData = {
  cityCode: '150100',
  cityName: '呼和浩特市',
  provinceCode: '150000',
  provinceName: '内蒙古自治区',
  hotline: '0471-12393',
  officialPortalUrl: 'http://ybj.huhhot.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hhht-employee-outpatient-2022-66',
      title: '呼和浩特市建立完善职工基本医疗保险门诊共济保障实施细则',
      docNumber: '呼政办发〔2022〕66号',
      issuingDept: ['呼和浩特市人民政府办公室', '呼和浩特市医疗保障局'],
      publishDate: '2022-12-05',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.huhhot.gov.cn/zwgk/zcfg/202212/t20221210_1390124.html',
      summaryQuote: '门诊年度起付标准统一为1000元。在职职工支付比例二级及以下80%、三级60%，退休人员各增加5个百分点（分别为85%、65%）。年度累计最高支付限额在职5000元，退休人员6000元。'
    },
    {
      docId: 'hhht-medical-insurance-inpatient-2024',
      title: '呼和浩特市基本医疗保险住院保障及大病救助实施细则',
      docNumber: '呼医保发〔2024〕19号',
      issuingDept: ['呼和浩特市医疗保障局', '呼和浩特市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.huhhot.gov.cn/zwgk/zcfg/202411/t20241126_1590123.html',
      summaryQuote: '职工住院起付线：三级1000元、二级500元、一级300元；在职支付比例三级85%、二级88%、一级92%（退休人员分别为89%、92%、95%）。居民住院起付线三级800元/60%、二级400元/75%、一级100元/85%。基本统筹限额15万元。大病保险起付线1.4万元，分段报销60%-75%，封顶35万元。'
    }
  ],

  // 城镇职工医保待遇 (呼和浩特标准)
  employee: {
    outpatient: {
      sourceDocId: 'hhht-employee-outpatient-2022-66',
      annualDeductible: 1000, // 门诊年度起付线 1000 元
      annualCap: 5000,       // 在职限额 5000 元
      annualCapRetiree: 6000, // 退休限额 6000 元
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 1000, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 1000, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1000, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '自治区重点三甲医院', deductible: 1000, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线1000元。二级及以下报销80%（退休85%），三级报销60%（退休65%）。在职限额5000元，退休限额6000元。'
    },
    inpatient: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹 + 职工大病救助
      tierBenefits: {
        community: { tierName: '一级基层定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '自治区重点三甲综合医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线享受规程减免。'
    },
    catastrophic: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '内蒙古医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省及异地就医直接结算享受对应比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (呼和浩特标准)
  resident: {
    outpatient: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      annualCap: 200, // 居民普通门诊年度限额 200 元
      tierBenefits: {
        community: { tierName: '基层社区及卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '自治区三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '一级及基层社区中心', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '自治区重点三甲医院', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 14000,
      annualCap: 350000,
      tiers: [
        { minAmount: 14000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hhht-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '内蒙古医保小程序'],
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
