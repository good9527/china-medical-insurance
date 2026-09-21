import type { CityInsuranceData } from '../types';

/**
 * 神农架林区基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：429021
 */
export const shennongjiaCityData: CityInsuranceData = {
  cityCode: '429021',
  cityName: '神农架林区',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0719-12393 / 0719-3333988',
  officialPortalUrl: 'http://ybj.snj.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'snj-employee-outpatient-2022',
      title: '关于印发神农架林区建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '神政规〔2022〕2号',
      issuingDept: ['神农架林区人民政府', '神农架林区医疗保障局'],
      publishDate: '2022-10-13',
      effectiveDate: '2022-12-31',
      status: 'active',
      officialUrl: 'http://ybj.snj.gov.cn/zwgk/zcfg/202210/t20221020_412984.html',
      summaryQuote: '神政规〔2022〕2号明确：普通门诊统筹年度起付标准在职职工500元、退休人员400元。普通门诊统筹年度最高支付限额在职职工2000元、退休人员2400元。统筹基金支付比例：一级医疗机构（含乡镇卫生院及社区卫生站）80%、二级医疗机构65%、三级医疗机构50%，退休人员在上述比例基础上提高5个百分点（一级85%、二级70%、三级55%）。'
    },
    {
      docId: 'snj-inpatient-regulations-2023',
      title: '神农架林区基本医疗保险住院统筹待遇实施细则',
      docNumber: '神医保发〔2023〕14号',
      issuingDept: ['神农架林区医疗保障局', '神农架林区财政局'],
      publishDate: '2023-11-10',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.snj.gov.cn/zwgk/zcjd/202311/t20231118_428190.html',
      summaryQuote: '林区内住院起付标准：一级医疗机构200元、二级医疗机构400元、三级医疗机构800元。职工医保统筹支付比例一级90%、二级88%、三级85%（退休人员增加2%）。城乡居民医保住院起付标准一级200元、二级400元、三级800元，支付比例一级88%、二级75%、三级60%。职工统筹基金年度最高支付限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'snj-employee-outpatient-2022',
      annualDeductible: 500,
      annualCap: 2000,
      annualCapRetiree: 2400,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '神农架林区职工门诊年起付线在职500元、退休400元；一级80%（退休85%）、二级65%（退休70%）、三级50%（退休55%）；在职限额2000元，退休限额2400元。'
    },
    inpatient: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付线按规定执行。'
    },
    catastrophic: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      name: '神农架林区职工大额医疗互助',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '神农架医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范转诊享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 800, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '向下转诊免除下级医院起付标准。'
    },
    catastrophic: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      name: '神农架林区城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'snj-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定转诊备案自行外出就医的，支付比例相应降低。'
      ]
    }
  }
};
