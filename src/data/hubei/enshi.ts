import type { CityInsuranceData } from '../types';

/**
 * 恩施土家族苗族自治州基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：422800
 */
export const enshiCityData: CityInsuranceData = {
  cityCode: '422800',
  cityName: '恩施土家族苗族自治州',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0718-12393 / 0718-8222923',
  officialPortalUrl: 'http://ybj.enshi.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'es-employee-outpatient-2022',
      title: '关于印发恩施州建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '恩施州政办发〔2022〕41号',
      issuingDept: ['恩施州人民政府办公室', '恩施州医疗保障局'],
      publishDate: '2022-12-22',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.enshi.gov.cn/zwgk/zcfg/202212/t20221228_1098231.html',
      summaryQuote: '恩施州政办发〔2022〕41号明确：普通门诊统筹年度起付标准在职职工400元、退休人员300元。普通门诊统筹年度最高支付限额在职职工2000元、退休人员2400元。统筹基金支付比例：一级医疗机构70%、二级医疗机构60%、三级医疗机构50%，退休人员在上述比例基础上各提高10个百分点（一级80%、二级70%、三级60%）。'
    },
    {
      docId: 'es-resident-insurance-2023',
      title: '恩施土家族苗族自治州城乡居民基本医疗保险实施办法',
      docNumber: '恩施州政发〔2023〕12号',
      issuingDept: ['恩施州人民政府', '恩施州医疗保障局'],
      publishDate: '2023-08-15',
      effectiveDate: '2023-09-01',
      status: 'active',
      officialUrl: 'http://ybj.enshi.gov.cn/zwgk/zcjd/202308/t20230825_1120934.html',
      summaryQuote: '恩施州实行医保州级统筹：州内住院起付标准一级医疗机构300元、二级医疗机构500元、三级医疗机构1000元。居民医保住院政策范围内支付比例一级85%、二级75%、三级60%；职工医保住院支付比例一级92%、二级88%、三级85%（退休人员增加2%）。转州外起付标准相应提高至800元、1000元、1500元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'es-employee-outpatient-2022',
      annualDeductible: 400,
      annualCap: 2000,
      annualCapRetiree: 2400,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '恩施州职工门诊年起付线在职400元、退休300元；一级70%（退休80%）、二级60%（退休70%）、三级50%（退休60%）；在职限额2000元，退休限额2400元。'
    },
    inpatient: {
      sourceDocId: 'es-resident-insurance-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '按分级诊疗要求向上转诊的，只计算起付标准差额。'
    },
    catastrophic: {
      sourceDocId: 'es-resident-insurance-2023',
      name: '恩施州职工大额医疗保险',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'es-resident-insurance-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '恩施医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范转诊享受同等级别医保报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'es-resident-insurance-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'es-resident-insurance-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 300, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 1000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '按分级诊疗向下转诊免除下级医院起付线。'
    },
    catastrophic: {
      sourceDocId: 'es-resident-insurance-2023',
      name: '恩施州城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'es-resident-insurance-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '转州外定点医疗机构住院起付标准提高，未备案自行就医比例降低。'
      ]
    }
  }
};
