import type { CityInsuranceData } from '../types';

export const lanzhouNewAreaBenefitData: CityInsuranceData = {
  cityCode: '620108',
  cityName: '兰州新区',
  provinceCode: '620000',
  provinceName: '甘肃省',
  hotline: '0931-12393',
  officialPortalUrl: 'http://ybj.lanzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'lzxq-employee-outpatient-2022',
      title: '兰州新区职工基本医疗保险门诊共济保障实施细则',
      docNumber: '新政办规〔2022〕8号',
      issuingDept: ['兰州新区管委会办公室', '兰州新区民政司法和社会保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.lanzhou.gov.cn/art/2022/12/22/art_11221_1189912.html',
      summaryQuote: '门诊年度起付标准为200元，统筹基金最高支付限额2500元。一级医疗机构在职报销65%、退休70%；二级医疗机构在职报销60%、退休65%；三级医疗机构在职报销55%、退休60%。'
    },
    {
      docId: 'lzxq-medical-insurance-inpatient-2024',
      title: '兰州新区基本医疗保险统筹支付与待遇保障办法',
      docNumber: '新社保发〔2024〕25号',
      issuingDept: ['兰州新区民政司法和社会保障局', '兰州新区财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.lanzhou.gov.cn/art/2024/11/25/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级800元、二级450元、一级200元；在职支付比例三级85%、二级89%、一级92%（退休人员各提高3%）。居民住院起付线：三级900元、二级450元、一级200元，报销比例分别为65%、76%、85%。居民基层门诊免起付线，报销65%，年限额150元。'
    }
  ],

  // 城镇职工医保待遇 (兰州新区标准)
  employee: {
    outpatient: {
      sourceDocId: 'lzxq-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 2500,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '社区及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊年度起付标准200元，统筹基金最高支付限额2500元，退休人员比例各提高5个百分点。'
    },
    inpatient: {
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
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
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用互助补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '规范备案直接联网结算享受本地同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (兰州新区标准)
  resident: {
    outpatient: {
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
      annualCap: 150,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民基层普通门诊零门槛，报销比例65%，年度最高支付限额150元。'
    },
    inpatient: {
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
      annualCap: 160000,
      tierBenefits: {
        community: { tierName: '社区服务中心/卫生院', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 800, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全省统一标准）',
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
      sourceDocId: 'lzxq-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '甘肃省内及跨省异地就医直接联网结算。'
      ]
    }
  }
};
