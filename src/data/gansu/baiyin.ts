import type { CityInsuranceData } from '../types';

export const baiyinData: CityInsuranceData = {
  cityCode: '620400',
  cityName: '白银市',
  provinceCode: '620000',
  provinceName: '甘肃省',
  hotline: '0943-12393',
  officialPortalUrl: 'http://ybj.baiyin.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'by-employee-outpatient-2022',
      title: '白银市职工基本医疗保险门诊共济保障实施细则',
      docNumber: '白政办发〔2022〕89号',
      issuingDept: ['白银市人民政府办公室', '白银市医疗保障局'],
      publishDate: '2022-12-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.baiyin.gov.cn/art/2022/12/15/art_11221_1189912.html',
      summaryQuote: '门诊年度起付标准为200元，统筹基金最高支付限额1200元。一级医疗机构在职报销65%、退休70%；二级医疗机构在职报销60%、退休65%；三级医疗机构在职报销55%、退休60%。'
    },
    {
      docId: 'by-medical-insurance-inpatient-2024',
      title: '白银市基本医疗保险统筹基金支付与经办规程管理办法',
      docNumber: '白医保发〔2024〕31号',
      issuingDept: ['白银市医疗保障局', '白银市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.baiyin.gov.cn/art/2024/11/26/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级200元；在职支付比例三级85%、二级88%、一级92%（退休人员各提高3%）。居民住院起付线：三级900元、二级500元、一级200元，支付比例分别为65%、75%、85%。居民基层门诊免起付线，报销60%，年限额150元。'
    }
  ],

  // 城镇职工医保待遇 (白银标准)
  employee: {
    outpatient: {
      sourceDocId: 'by-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 1200,       // 白银统筹基金限额 1200 元
      annualCapRetiree: 1200,
      tierBenefits: {
        community: { tierName: '一级定点医疗机构/社区卫生服务中心', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付标准200元，统筹基金最高支付限额1200元，在职报销65%/60%/55%，退休各提高5个百分点。'
    },
    inpatient: {
      sourceDocId: 'by-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '社区服务中心/一级机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'by-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'by-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按政策规范办理异地备案享本地同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (白银标准)
  resident: {
    outpatient: {
      sourceDocId: 'by-medical-insurance-inpatient-2024',
      annualCap: 150,
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民基层普通门诊零起付线，报销比例60%，年度最高支付限额150元。'
    },
    inpatient: {
      sourceDocId: 'by-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 900, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'by-medical-insurance-inpatient-2024',
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
      sourceDocId: 'by-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '甘肃省内及跨省异地就医直接结算。'
      ]
    }
  }
};
