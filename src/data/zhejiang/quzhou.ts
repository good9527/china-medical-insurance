import type { CityInsuranceData } from '../types';

/**
 * 衢州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330800
 */
export const quzhouCityData: CityInsuranceData = {
  cityCode: '330800',
  cityName: '衢州市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0570-12393',
  officialPortalUrl: 'https://ybj.qz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'qz-medical-insurance-measures-2020',
      title: '衢州市医疗保障暂行办法',
      docNumber: '衢政发〔2020〕26号',
      issuingDept: ['衢州市人民政府', '衢州市医疗保障局'],
      publishDate: '2020-11-20',
      effectiveDate: '2021-01-01',
      status: 'active',
      officialUrl: 'https://ybj.qz.gov.cn/art/2020/11/25/art_1229091632_58931234.html',
      summaryQuote: '衢政发〔2020〕26号明确：职工门诊起付标准在职300元、退休150元，限额3000元，支付比例一级70%、二级60%、三级50%（退休提高5%）。居民门诊起付线100元，最高限额1800元。住院起付线：二级及以上800元，二级以下400元（年度内累计不超过1400元）。统筹基金最高支付限额职工35万元，居民15万元。城乡居民大病保险起付线为1.8万元。'
    },
    {
      docId: 'qz-medical-insurance-inpatient-2023',
      title: '衢州市医疗保障局关于进一步完善基本医疗保险住院与大病待遇的通知',
      docNumber: '衢医保发〔2022〕36号',
      issuingDept: ['衢州市医疗保障局', '衢州市财政局'],
      publishDate: '2022-12-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.qz.gov.cn/art/2022/12/15/art_1229091632_58941235.html',
      summaryQuote: '职工住院起付线：三级800元、二级及以下400元（年度内住院起付线累计不超过1400元）。统筹支付比例二级及以下87%、二级及以上84%（退休人员提高5%）。最高支付限额35万元。居民住院起付线三级800元、二级及以下400元，比例一级85%、二级75%、三级65%。居民基本医保限额15万元，大病保险起付线1.8万元。'
    }
  ],

  // 城镇职工医保待遇 (衢州标准)
  employee: {
    outpatient: {
      sourceDocId: 'qz-medical-insurance-measures-2020',
      annualDeductible: 300,   // 在职门诊起付线 300 元，退休 150 元
      annualCap: 3000,         // 门诊年限额 3000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/卫生院', deductible: 300, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点综合医院', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职300元、退休150元。一级报销70%（退休75%）、二级报销60%（退休65%）、三级报销50%（退休55%）。年度最高支付限额3000元。'
    },
    inpatient: {
      sourceDocId: 'qz-medical-insurance-inpatient-2023',
      annualCap: 350000, // 基本统筹限额 35 万元
      repeatedDeductibleRule: '年度内多次住院起付线累计封顶不超过1400元',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 400, reimbursementRatio: 0.87, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医院', deductible: 400, reimbursementRatio: 0.87, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医院', deductible: 400, reimbursementRatio: 0.87, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.84, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '浙西重点三甲医院', deductible: 800, reimbursementRatio: 0.84, retireeRatioBonus: 0.05 }
      }
    },
    catastrophic: {
      sourceDocId: 'qz-medical-insurance-inpatient-2023',
      name: '衢州市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '衢州医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (衢州标准)
  resident: {
    outpatient: {
      sourceDocId: 'qz-medical-insurance-measures-2020',
      annualCap: 1800,
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 100, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级医疗机构', deductible: 100, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构', deductible: 100, reimbursementRatio: 0.40 },
        tier3: { tierName: '三级医疗机构', deductible: 100, reimbursementRatio: 0.30 },
        tier3_top: { tierName: '重点三甲医院', deductible: 100, reimbursementRatio: 0.30 }
      },
      note: '居民门诊起付线100元，基层报销50%，二级40%，三级30%，年度最高支付限额1800元。'
    },
    inpatient: {
      sourceDocId: 'qz-medical-insurance-inpatient-2023',
      annualCap: 150000,
      repeatedDeductibleRule: '年度内多次住院起付线累计封顶不超过1400元',
      tierBenefits: {
        community: { tierName: '基层卫生机构', deductible: 400, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三级医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'qz-medical-insurance-inpatient-2023',
      name: '衢州市城乡居民大病保险',
      deductible: 18000,
      annualCap: 400000,
      tiers: [
        { minAmount: 18000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
