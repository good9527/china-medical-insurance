import type { CityInsuranceData } from '../types';

export const jinchangData: CityInsuranceData = {
  cityCode: '620300',
  cityName: '金昌市',
  provinceCode: '620000',
  provinceName: '甘肃省',
  hotline: '0935-12393',
  officialPortalUrl: 'http://ybj.jcs.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'jc-employee-outpatient-2022',
      title: '金昌市职工基本医疗保险门诊共济保障实施细则',
      docNumber: '金政办发〔2022〕67号',
      issuingDept: ['金昌市人民政府办公室', '金昌市医疗保障局'],
      publishDate: '2022-10-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jcs.gov.cn/art/2022/10/25/art_11221_1189912.html',
      summaryQuote: '门诊年度起付标准为200元，统筹基金最高支付限额在职1495元、退休1610元。一级医疗机构在职报销65%、退休70%；二级医疗机构在职报销60%、退休65%；三级医疗机构在职报销55%、退休60%。'
    },
    {
      docId: 'jc-medical-insurance-inpatient-2024',
      title: '金昌市基本医疗保险统筹基金综合保障管理规程',
      docNumber: '金医保发〔2024〕29号',
      issuingDept: ['金昌市医疗保障局', '金昌市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jcs.gov.cn/art/2024/11/25/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级800元、二级450元、一级200元；在职支付比例三级86%、二级90%、一级93%（退休人员各提高3%）。居民住院起付线：三级900元、二级450元、一级200元，报销比例分别为65%、78%、85%。居民基层门诊免起付线，报销65%，年限额160元。'
    }
  ],

  // 城镇职工医保待遇 (金昌标准)
  employee: {
    outpatient: {
      sourceDocId: 'jc-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 1495,       // 金昌在职基金支付限额 1495 元
      annualCapRetiree: 1610,// 金昌退休基金支付限额 1610 元
      tierBenefits: {
        community: { tierName: '社区及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线200元，统筹基金最高支付限额在职1495元、退休1610元，在职报销65%/60%/55%，退休各加5%。'
    },
    inpatient: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '社区服务中心/一级机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等定点医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按甘肃省统一政策异地就医直接结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (金昌标准)
  resident: {
    outpatient: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      annualCap: 160,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民基层普通门诊零门槛，报销比例65%，年度最高支付限额160元。'
    },
    inpatient: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      annualCap: 160000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.75 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 800, reimbursementRatio: 0.75 }
      }
    },
    catastrophic: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
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
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '跨省或省内异地就医直接结算享受对应待遇。'
      ]
    }
  }
};
