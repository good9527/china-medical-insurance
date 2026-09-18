import type { CityInsuranceData } from '../types';

/**
 * 绍兴市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330600
 */
export const shaoxingCityData: CityInsuranceData = {
  cityCode: '330600',
  cityName: '绍兴市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0575-12393',
  officialPortalUrl: 'https://ybj.sx.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'sx-medical-insurance-measures-2023',
      title: '绍兴市医疗保障办法',
      docNumber: '绍政发〔2023〕18号',
      issuingDept: ['绍兴市人民政府', '绍兴市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.sx.gov.cn/art/2023/11/25/art_1229248234_58931234.html',
      summaryQuote: '在职职工门诊起付标准为400元，退休人员为200元。门诊统筹年度最高支付限额在职5000元、退休6000元。统筹支付比例：基层医疗卫生机构在职80%（退休85%）、二级医疗机构在职70%（退休75%）、三级医疗机构在职60%（退休65%）。'
    },
    {
      docId: 'sx-medical-insurance-policy-notice',
      title: '关于完善绍兴市基本医疗保险有关政策的通知',
      docNumber: '绍市医保〔2022〕42号',
      issuingDept: ['绍兴市医疗保障局', '绍兴市财政局'],
      publishDate: '2022-12-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.sx.gov.cn/art/2022/12/15/art_1229248234_58941235.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、基层及一级200元（当年第二次减半，第三次及以上免除）。统筹支付比例三级86%、二级90%、基层95%（退休提高3%-5%）。统筹基金最高支付限额40万元。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线2万元。'
    }
  ],

  // 城镇职工医保待遇 (绍兴标准)
  employee: {
    outpatient: {
      sourceDocId: 'sx-medical-insurance-measures-2023',
      annualDeductible: 400,   // 在职门诊起付线 400 元，退休 200 元
      annualCap: 5000,         // 在职门诊限额 5000 元
      annualCapRetiree: 6000,  // 退休门诊限额 6000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/卫生院', deductible: 400, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点综合医院', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职400元、退休200元。基层报销80%（退休85%）、二级报销70%（退休75%）、三级报销60%（退休65%）。在职限额5000元，退休限额6000元。'
    },
    inpatient: {
      sourceDocId: 'sx-medical-insurance-policy-notice',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'sx-medical-insurance-policy-notice',
      name: '绍兴市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sx-medical-insurance-policy-notice',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '绍兴医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (绍兴标准)
  resident: {
    outpatient: {
      sourceDocId: 'sx-medical-insurance-measures-2023',
      annualCap: 1000,
      tierBenefits: {
        community: { tierName: '基层社区卫生机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.35 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.35 }
      },
      note: '居民基层门诊免起付线报销50%，限额1000元。'
    },
    inpatient: {
      sourceDocId: 'sx-medical-insurance-policy-notice',
      annualCap: 300000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层卫生机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三级医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'sx-medical-insurance-policy-notice',
      name: '绍兴市城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sx-medical-insurance-policy-notice',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
