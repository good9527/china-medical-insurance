import type { CityInsuranceData } from '../types';

/**
 * 盐城市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320900
 */
export const yanchengCityData: CityInsuranceData = {
  cityCode: '320900',
  cityName: '盐城市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0515-12393',
  officialPortalUrl: 'https://ybj.yancheng.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'yc-employee-outpatient-reform-2022',
      title: '盐城市关于建立健全职工基本医疗保险门诊共济保障机制的实施办法',
      docNumber: '盐政规发〔2022〕10号',
      issuingDept: ['盐城市人民政府', '盐城市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.yancheng.gov.cn/art/2022/12/30/art_2056_3987123.html',
      summaryQuote: '在职职工门诊起付标准为700元，退休人员为300元。年度最高支付限额在职6000元，退休7000元。统筹支付比例：基层一级及以下医疗机构在职75%（退休85%）、二级医疗机构在职70%（退休80%）、三级医疗机构在职60%（退休70%）。'
    },
    {
      docId: 'yc-medical-insurance-inpatient-2023',
      title: '盐城市医疗保障局关于规范全市基本医疗保险住院保障待遇的通知',
      docNumber: '盐医保发〔2023〕12号',
      issuingDept: ['盐城市医疗保障局', '盐城市财政局'],
      publishDate: '2023-04-18',
      effectiveDate: '2023-05-01',
      status: 'active',
      officialUrl: 'https://ybj.yancheng.gov.cn/art/2023/4/20/art_2056_4120987.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（二次住院起付线减半，三次免除）。职工统筹支付比例三级87%、二级91%、一级95%（退休增加3%-5%）。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (盐城标准)
  employee: {
    outpatient: {
      sourceDocId: 'yc-employee-outpatient-reform-2022',
      annualDeductible: 700,   // 在职门诊起付线 700 元，退休 300 元
      annualDeductibleRetiree: 300, // 退休人员门诊起付线 300 元
      annualCap: 6000,         // 在职门诊限额 6000 元
      annualCapRetiree: 7000,  // 退休门诊限额 7000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 700, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 700, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级综合医院', deductible: 700, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 700, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线在职700元、退休300元。基层报销75%（退休85%）、二级报销70%（退休80%）、三级报销60%（退休70%）。在职限额6000元，退休限额7000元。'
    },
    inpatient: {
      sourceDocId: 'yc-medical-insurance-inpatient-2023',
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
      name: '盐城市职工大额医疗救助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yc-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (盐城标准)
  resident: {
    outpatient: {
      sourceDocId: 'yc-employee-outpatient-reform-2022',
      annualCap: 800,
      tierBenefits: {
        community: { tierName: '基层社区卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额800元。'
    },
    inpatient: {
      sourceDocId: 'yc-medical-insurance-inpatient-2023',
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
      name: '盐城市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yc-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
