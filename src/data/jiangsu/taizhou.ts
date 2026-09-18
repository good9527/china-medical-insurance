import type { CityInsuranceData } from '../types';

/**
 * 泰州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：321200
 */
export const taizhouCityData: CityInsuranceData = {
  cityCode: '321200',
  cityName: '泰州市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0523-12393',
  officialPortalUrl: 'https://ybj.taizhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'tz-employee-outpatient-reform-2022',
      title: '市政府办公室关于印发泰州市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '泰政办发〔2022〕44号',
      issuingDept: ['泰州市人民政府办公室', '泰州市医疗保障局'],
      publishDate: '2022-10-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.taizhou.gov.cn/art/2022/10/20/art_57392_3419082.html',
      summaryQuote: '在职人员门诊起付标准为800元/年，退休人员为500元/年。门诊统筹年度最高支付限额为9000元/年。统筹支付比例：一级及以下医疗机构75%、二级及以上医疗机构65%（退休人员均提高5个百分点，分别达80%、70%）。'
    },
    {
      docId: 'tz-medical-insurance-inpatient-2023',
      title: '泰州市基本医疗保险和生育保险办法实施细则',
      docNumber: '泰医保规〔2022〕3号',
      issuingDept: ['泰州市医疗保障局', '泰州市财政局'],
      publishDate: '2022-11-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.taizhou.gov.cn/art/2022/11/25/art_57392_3429871.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级200元（当年第二次减半，第三次及以上免除）。统筹支付比例三级87%、二级91%、一级95%（退休提高3%-5%）。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (泰州标准)
  employee: {
    outpatient: {
      sourceDocId: 'tz-employee-outpatient-reform-2022',
      annualDeductible: 800,   // 在职门诊起付线 800 元，退休 500 元
      annualCap: 9000,         // 门诊年限额 9000 元
      tierBenefits: {
        community: { tierName: '一级及以下定点医疗机构/卫生院', deductible: 800, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 800, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职800元、退休500元。一级及以下报销75%（退休80%）、二级及以上报销65%（退休70%）。年度最高支付限额9000元。'
    },
    inpatient: {
      sourceDocId: 'tz-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.91, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省重点三甲医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '泰州市职工大额医疗救助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (泰州标准)
  resident: {
    outpatient: {
      sourceDocId: 'tz-employee-outpatient-reform-2022',
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
      sourceDocId: 'tz-medical-insurance-inpatient-2023',
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
      name: '泰州市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
