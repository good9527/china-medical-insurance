import type { CityInsuranceData } from '../types';

/**
 * 嘉兴市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330400
 */
export const jiaxingCityData: CityInsuranceData = {
  cityCode: '330400',
  cityName: '嘉兴市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0573-12393',
  officialPortalUrl: 'https://ybj.jiaxing.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'jx-medical-insurance-measures-2022',
      title: '嘉兴市基本医疗保险办法',
      docNumber: '嘉政发〔2022〕20号',
      issuingDept: ['嘉兴市人民政府', '嘉兴市医疗保障局'],
      publishDate: '2022-11-25',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.jiaxing.gov.cn/art/2022/11/28/art_1229248234_58931234.html',
      summaryQuote: '基层医疗机构不设门诊起付线（0元起步）。二级及以上医疗机构门诊起付标准为在职400元、退休200元。统筹基金年度最高支付限额为10000元。统筹报销比例：基层医疗机构在职85%（退休90%）、二级医疗机构在职70%（退休75%）、其他机构及三级医院在职60%（退休65%）。'
    },
    {
      docId: 'jx-medical-insurance-inpatient-2023',
      title: '嘉兴市医疗保障局关于调整基本医疗保险住院统筹待遇标准的通知',
      docNumber: '嘉医保发〔2022〕45号',
      issuingDept: ['嘉兴市医疗保障局', '嘉兴市财政局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.jiaxing.gov.cn/art/2022/12/18/art_1229248234_58941238.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、基层及一级200元（当年第二次减半，第三次及以上免除）。职工统筹支付比例三级86%、二级90%、基层95%（退休提高3%-5%）。基本统筹限额40万元。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线2万元。'
    }
  ],

  // 城镇职工医保待遇 (嘉兴标准)
  employee: {
    outpatient: {
      sourceDocId: 'jx-medical-insurance-measures-2022',
      annualDeductible: 400,   // 在职门诊基准起付线 400 元，退休 200 元（基层免起付 0 元）
      annualCap: 10000,        // 门诊年限额 1 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/乡镇卫生院', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省重点三甲医疗机构', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '基层医疗机构免设门诊起付线直接按85%（退休90%）报销；二级及三级医院在职起付400元（退休200元），二级报销70%（退休75%），三级报销60%（退休65%）。年度限额1万元。'
    },
    inpatient: {
      sourceDocId: 'jx-medical-insurance-inpatient-2023',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省重点三级甲等医院', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'jx-medical-insurance-inpatient-2023',
      name: '嘉兴市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jx-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '嘉兴医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (嘉兴标准)
  resident: {
    outpatient: {
      sourceDocId: 'jx-medical-insurance-measures-2022',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额1200元。'
    },
    inpatient: {
      sourceDocId: 'jx-medical-insurance-inpatient-2023',
      annualCap: 300000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层社区卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'jx-medical-insurance-inpatient-2023',
      name: '嘉兴市城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jx-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
