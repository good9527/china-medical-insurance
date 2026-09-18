import type { CityInsuranceData } from '../types';

export const jiuquanData: CityInsuranceData = {
  cityCode: '620900',
  cityName: '酒泉市',
  provinceCode: '620000',
  provinceName: '甘肃省',
  hotline: '0937-12393',
  officialPortalUrl: 'http://ybj.jiuquan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'jq-employee-outpatient-2022',
      title: '酒泉市职工基本医疗保险门诊共济保障实施细则',
      docNumber: '酒政办发〔2022〕85号',
      issuingDept: ['酒泉市人民政府办公室', '酒泉市医疗保障局'],
      publishDate: '2022-11-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jiuquan.gov.cn/art/2022/11/20/art_11221_1189912.html',
      summaryQuote: '门诊年度起付标准为200元，统筹基金最高支付限额在职1500元、退休1600元。一级医疗机构在职报销65%、退休70%；二级医疗机构在职报销60%、退休65%；三级医疗机构在职报销55%、退休60%。'
    },
    {
      docId: 'jq-medical-insurance-inpatient-2024',
      title: '酒泉市基本医疗保险待遇标准与经办规范实施办法',
      docNumber: '酒医保发〔2024〕33号',
      issuingDept: ['酒泉市医疗保障局', '酒泉市财政局'],
      publishDate: '2024-11-22',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jiuquan.gov.cn/art/2024/11/28/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级800元、二级450元、一级200元；在职统筹支付比例三级85%、二级89%、一级92%（退休各提3%）。居民住院起付线：三级900元、二级450元、一级200元，报销比例分别为65%、75%、85%。居民基层门诊免起付线，报销60%，年限额150元。'
    }
  ],

  // 城镇职工医保待遇 (酒泉标准)
  employee: {
    outpatient: {
      sourceDocId: 'jq-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 1500,       // 酒泉在职限额 1500 元
      annualCapRetiree: 1600,// 酒泉退休限额 1600 元
      tierBenefits: {
        community: { tierName: '一级定点医疗机构/社区卫生服务中心', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付标准200元，最高支付限额在职1500元、退休1600元，在职报销65%/60%/55%，退休各加5%。'
    },
    inpatient: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '社区服务中心/一级机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.89, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用互助保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省跨市直接联网结算，已备案与本地一致，未备案自行外出降比。'
      ]
    }
  },

  // 城乡居民医保待遇 (酒泉标准)
  resident: {
    outpatient: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      annualCap: 150,
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊基层定点机构零起付，报销比例60%，年度最高支付限额150元。'
    },
    inpatient: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 900, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全省统筹）',
      deductible: 5000,
      tiers: [
        { minAmount: 5000, maxAmount: 10000, ratio: 0.60 },
        { minAmount: 10000, maxAmount: 20000, ratio: 0.65 },
        { minAmount: 20000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jq-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '按甘肃省统一异地就医结算标准办理。'
      ]
    }
  }
};
