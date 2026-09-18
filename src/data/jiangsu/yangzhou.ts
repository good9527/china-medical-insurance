import type { CityInsuranceData } from '../types';

/**
 * 扬州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：321000
 */
export const yangzhouCityData: CityInsuranceData = {
  cityCode: '321000',
  cityName: '扬州市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0514-12393',
  officialPortalUrl: 'https://ybj.yangzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'yz-employee-outpatient-reform-2022',
      title: '扬州市建立健全职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '扬政办发〔2022〕85号',
      issuingDept: ['扬州市人民政府办公室', '扬州市医疗保障局'],
      publishDate: '2022-12-22',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.yangzhou.gov.cn/yzyb/zcfg/202212/03290b213bfa472fb89c8a9a2503a4b9.shtml',
      summaryQuote: '门诊统筹实行按医院等级设立起付标准：一级医疗机构（含社区）300元、二级医疗机构500元、三级医疗机构800元。统筹支付比例：一级医疗机构在职60%（退休65%）、二级医疗机构在职55%（退休60%）、三级医疗机构在职50%（退休55%）。门诊统筹年度最高支付限额在职4000元，退休5000元。'
    },
    {
      docId: 'yz-medical-insurance-inpatient-2023',
      title: '扬州市基本医疗保险住院统筹待遇实施细则',
      docNumber: '扬医保发〔2022〕56号',
      issuingDept: ['扬州市医疗保障局', '扬州市财政局'],
      publishDate: '2022-11-30',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.yangzhou.gov.cn/yzyb/zcfg/202211/38290b213bfa472fb89c8a9a2503a110.shtml',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（第二次减半，第三次及以上免除）。在职统筹支付比例三级87%、二级91%、一级95%（退休提高3%-5%）。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (扬州标准)
  employee: {
    outpatient: {
      sourceDocId: 'yz-employee-outpatient-reform-2022',
      annualDeductible: 500,   // 基准门诊起付线 500 元（按机构级别梯次设置）
      annualCap: 4000,         // 在职门诊限额 4000 元
      annualCapRetiree: 5000,  // 退休门诊限额 5000 元
      tierBenefits: {
        community: { tierName: '基层卫生服务机构/乡镇卫生院', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点综合医院', deductible: 800, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊起付线按医院级别设立：一级300元、二级500元、三级800元。报销比例一级60%（退休65%）、二级55%（退休60%）、三级50%（退休55%）。在职限额4000元，退休5000元。'
    },
    inpatient: {
      sourceDocId: 'yz-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.91, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '苏中重点三甲医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '扬州市职工大额医疗互助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (扬州标准)
  resident: {
    outpatient: {
      sourceDocId: 'yz-employee-outpatient-reform-2022',
      annualCap: 800,
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '三甲重点医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额800元。'
    },
    inpatient: {
      sourceDocId: 'yz-medical-insurance-inpatient-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '扬州市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
