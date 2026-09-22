import type { CityInsuranceData } from '../types';

/**
 * 襄阳市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420600
 */
export const xiangyangCityData: CityInsuranceData = {
  cityCode: '420600',
  cityName: '襄阳市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0710-12393 / 0710-3607811',
  officialPortalUrl: 'http://ybj.xiangyang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'xy-employee-outpatient-2022',
      title: '襄阳市人民政府办公室关于印发襄阳市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '襄政办发〔2022〕46号',
      issuingDept: ['襄阳市人民政府办公室', '襄阳市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2022-12-31',
      status: 'active',
      officialUrl: 'http://ybj.xiangyang.gov.cn/zwgk/zcfg/202212/t20221220_2984712.html',
      summaryQuote: '襄政办发〔2022〕46号明确：在职职工门诊年度起付标准为500元、退休人员为400元。统筹基金支付比例：一级定点医疗机构70%、二级定点医疗机构60%、三级定点医疗机构50%，退休人员在上述比例基础上提高10个百分点（一级80%、二级70%、三级60%）。普通门诊统筹年度最高支付限额在职职工2700元、退休人员3100元。'
    },
    {
      docId: 'xy-employee-inpatient-2024',
      title: '襄阳市职工基本医疗保险实施办法',
      docNumber: '襄政规〔2024〕4号',
      issuingDept: ['襄阳市人民政府', '襄阳市医疗保障局'],
      publishDate: '2024-03-25',
      effectiveDate: '2024-05-01',
      status: 'active',
      officialUrl: 'http://ybj.xiangyang.gov.cn/zwgk/zcjd/202404/t20240402_3120984.html',
      summaryQuote: '襄政规〔2024〕4号规定：职工医保住院起付标准为一级及以下200元、二级500元、三级900元（三级综合1200元）。统筹基金政策范围内支付比例一级92%、二级90%、三级82%，退休人员相应增加优待。居民医保住院起付标准一级200元、二级500元、三级900元，支付比例一级90%、二级75%、三级60%。职工统筹基金年度最高支付限额18万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'xy-employee-outpatient-2022',
      annualDeductible: 500,
      annualDeductibleRetiree: 400, // 退休人员门诊起付线 400 元
      annualCap: 2700,
      annualCapRetiree: 3100,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '襄阳市职工门诊年起付线在职500元、退休400元；报销比例一级70%（退休80%）、二级60%（退休70%）、三级50%（退休60%）；在职最高支付2700元，退休最高支付3100元。'
    },
    inpatient: {
      sourceDocId: 'xy-employee-inpatient-2024',
      annualCap: 200000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.82, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 1200, reimbursementRatio: 0.82, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '按疗程治疗多次住院的，第二次及以上住院起付标准降为200元。'
    },
    catastrophic: {
      sourceDocId: 'xy-employee-inpatient-2024',
      name: '襄阳市职工大额医疗费用补助',
      deductible: 200000,
      annualCap: 350000,
      tiers: [
        { minAmount: 200000, maxAmount: 550000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xy-employee-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '襄阳医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范备案享受本地同等级别医疗机构同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'xy-employee-inpatient-2024',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区卫生中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民医保普通门诊统筹在基层医疗机构免起付线报销50%，年度限额400元。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'xy-employee-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 900, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '急诊住院或转诊住院起付线按规范标准计算。'
    },
    catastrophic: {
      sourceDocId: 'xy-employee-inpatient-2024',
      name: '襄阳市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xy-employee-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定备案或自行到市外医疗机构住院的，政策报销比例相应降低。'
      ]
    }
  }
};
