import type { CityInsuranceData } from '../types';

/**
 * 鄂州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420700
 */
export const ezhouCityData: CityInsuranceData = {
  cityCode: '420700',
  cityName: '鄂州市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0711-12393 / 0711-3358556',
  officialPortalUrl: 'http://ybj.ezhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'ez-employee-outpatient-2022',
      title: '关于印发鄂州市职工基本医疗保险门诊共济保障实施办法（试行）的通知',
      docNumber: '鄂州政办发〔2022〕42号',
      issuingDept: ['鄂州市人民政府办公室', '鄂州市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.ezhou.gov.cn/zwgk/zcfg/202301/t20230103_498210.html',
      summaryQuote: '鄂州政办发〔2022〕42号明确：职工门诊统筹起付标准为在职人员500元/年、退休人员400元/年。普通门诊统筹年度最高支付限额在职职工2300元、退休人员2500元。统筹基金支付比例：一级及以下定点医疗机构75%、二级定点医疗机构65%、三级定点医疗机构55%，退休人员在上述比例基础上提高5个百分点（一级80%、二级70%、三级60%）。'
    },
    {
      docId: 'ez-inpatient-regulations-2024',
      title: '关于调整鄂州市基本医疗保险和医疗救助有关政策的通知',
      docNumber: '鄂州医保发〔2023〕62号',
      issuingDept: ['鄂州市医疗保障局', '鄂州市财政局'],
      publishDate: '2023-12-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.ezhou.gov.cn/zwgk/zcjd/202312/t20231228_501923.html',
      summaryQuote: '统筹区内住院起付标准：乡镇卫生院100元、一级医院300元、二级医院500元、三级医院800元，年度内住院二次及以上起付标准减半（乡镇及一级除外）。在职职工统筹支付比例一级90%、二级88%、三级85%（退休人员增加2%）。城乡居民医保住院起付标准相同，支付比例一级90%、二级75%、三级60%。职工统筹基金年度最高支付限额按参保年限逐年提升（满3年最高30万元）。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'ez-employee-outpatient-2022',
      annualDeductible: 500,
      annualCap: 2300,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心/卫生院', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '鄂州市职工门诊年起付线在职500元、退休400元；基层报销75%（退休80%）、二级65%（退休70%）、三级55%（退休60%）；在职最高限额2300元，退休最高限额2500元。'
    },
    inpatient: {
      sourceDocId: 'ez-inpatient-regulations-2024',
      annualCap: 300000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '参保人员在12个月内住院两次及以上的，二级及三级医院住院起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'ez-inpatient-regulations-2024',
      name: '鄂州市职工大额医疗保险补助',
      deductible: 300000,
      annualCap: 200000,
      tiers: [
        { minAmount: 300000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ez-inpatient-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '鄂汇办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范转诊享受与参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'ez-inpatient-regulations-2024',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗机构免起付线按50%报销，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'ez-inpatient-regulations-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 800, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '同年度内多次住院二级及三级医院起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'ez-inpatient-regulations-2024',
      name: '鄂州市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ez-inpatient-regulations-2024',
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
