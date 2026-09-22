import type { CityInsuranceData } from '../types';

export const fuzhouCityData: CityInsuranceData = {
  cityCode: '350100',
  cityName: '福州市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0591-12345/12393',
  officialPortalUrl: 'http://ybj.fuzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'fz-employee-outpatient-2024',
      title: '福州市医疗保障局关于落实完善职工基本医疗保险门诊共济保障机制的通知',
      docNumber: '榕医保文〔2024〕21号',
      issuingDept: ['福州市医疗保障局', '福州市财政局'],
      publishDate: '2024-03-25',
      effectiveDate: '2024-03-31',
      status: 'active',
      officialUrl: 'http://ybj.fuzhou.gov.cn/',
      summaryQuote: '榕医保文〔2024〕21号规定：自2024年3月31日起，职工门诊起付线调整为600元，使用国家基本药物免起付线。一级及以下机构在职报销88%（退休93%），二级机构在职报销83%（退休88%），三级机构在职报销78%（退休83%）。普通门诊统筹年度最高支付限额提高至3万元。'
    },
    {
      docId: 'fz-medical-insurance-inpatient-2025',
      title: '福州市基本医疗保险住院与大额补充医疗保险实施办法',
      docNumber: '榕政办规〔2023〕18号',
      issuingDept: ['福州市人民政府办公厅', '福州市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.fuzhou.gov.cn/zz/fzybj/zwgk/zcfg/202311/t20231125_4732109.htm',
      summaryQuote: '职工住院起付线：三级800元、二级及一级600元、基层300元；报销比例三级85%（退休88%）、二级90%（退休93%）、一级93%（退休96%），基本统筹限额12万元。居民住院起付线三级800元/60%、二级400元/75%、一级200元/85%、基层150元/90%，统筹限额12万元。居民普通门诊免起付线，基层报销50%，年度限额800元。'
    }
  ],

  // 城镇职工医保待遇 (福州标准)
  employee: {
    outpatient: {
      sourceDocId: 'fz-employee-outpatient-2024',
      annualDeductible: 600, // 门诊年度起付线 600 元
      annualCap: 30000,      // 门诊统筹年度限额 30000 元
      annualCapRetiree: 30000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.83, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.78, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级三甲医院', deductible: 600, reimbursementRatio: 0.78, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线600元（使用国家基药免起付线），在职报销78%-88%，退休人员报销83%-93%，年度限额3万元。'
    },
    inpatient: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      annualCap: 500000, // 基本统筹12万 + 职工大病大额互助
      tierBenefits: {
        community: { tierName: '基层医疗机构/卫生院', deductible: 300, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省级三甲医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同年度内多次住院，起付线逐次递减200-240元，直至降为0。'
    },
    catastrophic: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '闽政通APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，规范备案人员与参保地享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (福州标准)
  resident: {
    outpatient: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      annualCap: 800, // 居民普通门诊年度最高限额 800 元
      tierBenefits: {
        community: { tierName: '社区服务中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层及一级医疗机构免起付线，报销50%，签约家庭医生提高5%，年度最高限额800元。'
    },
    inpatient: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      annualCap: 120000, // 居民统筹年度限额 12 万元
      tierBenefits: {
        community: { tierName: '基层社区服务中心/卫生院', deductible: 150, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 800, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '同年度内多次住院，起付标准依次递减100元，直至降为0。'
    },
    catastrophic: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      name: '城乡居民大病保险',
      deductible: 23200,
      annualCap: 300000,
      tiers: [
        { minAmount: 23200, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'fz-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '闽政通APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '规范备案直接联网结算，自行就医按规定比例下浮。'
      ]
    }
  }
};
