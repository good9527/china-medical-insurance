import type { CityInsuranceData } from '../types';

/**
 * 天门市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：429006
 */
export const tianmenCityData: CityInsuranceData = {
  cityCode: '429006',
  cityName: '天门市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0728-12393 / 0728-5245655',
  officialPortalUrl: 'http://ybj.tianmen.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'tm-employee-outpatient-2022',
      title: '关于印发天门市职工基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '天政办发〔2022〕39号',
      issuingDept: ['天门市人民政府办公室', '天门市医疗保障局'],
      publishDate: '2022-11-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.tianmen.gov.cn/zwgk/zcfg/202211/t20221120_419201.html',
      summaryQuote: '天政办发〔2022〕39号明确：在职职工门诊统筹年度起付标准600元、退休人员500元。普通门诊统筹年度最高支付限额在职职工2000元、退休人员2500元。统筹基金支付比例：一级医疗机构（含社区卫生机构）80%、二级医疗机构65%、三级医疗机构50%，退休人员在上述比例基础上提高10个百分点（一级90%、二级75%、三级60%）。'
    },
    {
      docId: 'tm-inpatient-regulations-2023',
      title: '天门市基本医疗保险住院与医疗救助待遇管理细则',
      docNumber: '天医保发〔2023〕18号',
      issuingDept: ['天门市医疗保障局', '天门市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.tianmen.gov.cn/zwgk/zcjd/202311/t20231128_439201.html',
      summaryQuote: '统筹区内职工住院起付标准：一级医疗机构200元、二级医疗机构500元、三级医疗机构900元。统筹支付比例一级90%、二级88%、三级85%（退休人员增加2%）。城乡居民医保住院起付标准一级200元、二级500元、三级900元，支付比例一级85%、二级75%、三级60%。职工统筹基金年度最高支付限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'tm-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '天门市职工门诊年起付线在职600元、退休500元；一级80%（退休90%）、二级65%（退休75%）、三级50%（退休60%）；在职限额2000元，退休限额2500元。'
    },
    inpatient: {
      sourceDocId: 'tm-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付标准按政策递减优惠。'
    },
    catastrophic: {
      sourceDocId: 'tm-inpatient-regulations-2023',
      name: '天门市职工大额医疗保险',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tm-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '天门医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接联网结算，规范备案人员享受同等报销标准。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'tm-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'tm-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 900, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '向下转诊免除下级医院起付标准。'
    },
    catastrophic: {
      sourceDocId: 'tm-inpatient-regulations-2023',
      name: '天门市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tm-inpatient-regulations-2023',
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
