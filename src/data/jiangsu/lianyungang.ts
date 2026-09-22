import type { CityInsuranceData } from '../types';

/**
 * 连云港市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320700
 */
export const lianyungangCityData: CityInsuranceData = {
  cityCode: '320700',
  cityName: '连云港市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0518-12393',
  officialPortalUrl: 'https://ybj.lyg.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'lyg-employee-outpatient-reform-2022',
      title: '连云港市建立健全职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '连政办发〔2022〕73号',
      issuingDept: ['连云港市人民政府办公室', '连云港市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.lyg.gov.cn/art/2022/12/30/art_50280_3981245.html',
      summaryQuote: '门诊起付标准在职职工为750元，退休人员为600元。统筹基金年度最高支付限额在职及退休人员均为6000元。统筹支付比例：一级及以下医疗机构在职70%（退休75%）、二级医疗机构在职65%（退休70%）、三级医疗机构60%（退休60%）。'
    },
    {
      docId: 'lyg-medical-insurance-inpatient-2023',
      title: '连云港市医疗保障局关于规范基本医疗保险住院统筹待遇的通知',
      docNumber: '连医保规〔2022〕3号',
      issuingDept: ['连云港市医疗保障局', '连云港市财政局'],
      publishDate: '2022-11-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.lyg.gov.cn/art/2022/11/20/art_50280_3970123.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（当年第二次住院起付线减半，第三次及以上免除）。统筹支付比例三级87%、二级91%、一级95%（退休提高3%-5%）。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (连云港标准)
  employee: {
    outpatient: {
      sourceDocId: 'lyg-employee-outpatient-reform-2022',
      annualDeductible: 750,   // 在职门诊起付线 750 元，退休 600 元
      annualDeductibleRetiree: 600, // 退休人员门诊起付线 600 元
      annualCap: 6000,         // 门诊年限额 6000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心/乡镇卫生院', deductible: 750, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 750, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 750, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级综合医院', deductible: 750, reimbursementRatio: 0.60, retireeRatioBonus: 0.00 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 750, reimbursementRatio: 0.60, retireeRatioBonus: 0.00 }
      },
      note: '门诊年度起付线在职750元、退休600元。一级报销70%（退休75%）、二级报销65%（退休70%）、三级报销60%（退休60%）。年度最高支付限额6000元。'
    },
    inpatient: {
      sourceDocId: 'lyg-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.91, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '重点三级甲等医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '连云港市职工大额医疗救助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lyg-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (连云港标准)
  resident: {
    outpatient: {
      sourceDocId: 'lyg-employee-outpatient-reform-2022',
      annualCap: 800,
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额800元。'
    },
    inpatient: {
      sourceDocId: 'lyg-medical-insurance-inpatient-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三级医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '连云港市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lyg-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
