import type { CityInsuranceData } from '../types';

/**
 * 孝感市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420900
 */
export const xiaoganCityData: CityInsuranceData = {
  cityCode: '420900',
  cityName: '孝感市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0712-12393 / 0712-2702660',
  officialPortalUrl: 'http://ybj.xiaogan.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'xg-employee-outpatient-2022',
      title: '孝感市人民政府办公室关于印发孝感市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '孝感政办发〔2022〕33号',
      issuingDept: ['孝感市人民政府办公室', '孝感市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xiaogan.gov.cn/zwgk/zcfg/202212/t20221220_928174.html',
      summaryQuote: '孝感政办发〔2022〕33号规定：门诊统筹年度起付标准在职职工600元、退休人员500元。统筹基金支付比例：一级医疗机构70%、二级医疗机构60%、三级医疗机构50%，退休人员在上述比例基础上提高10个百分点（一级80%、二级70%、三级60%）。普通门诊统筹年度最高支付限额在职职工2000元、退休人员2400元。'
    },
    {
      docId: 'xg-inpatient-regulations-2023',
      title: '孝感市基本医疗保险和医疗救助办法',
      docNumber: '孝感医保发〔2023〕18号',
      issuingDept: ['孝感市医疗保障局', '孝感市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xiaogan.gov.cn/zwgk/zcjd/202311/t20231125_958102.html',
      summaryQuote: '孝感市职工医保住院起付标准：一级医院400元（二次350元）、二级医院400元（二次350元）、三级医院500元（二次400元）。统筹支付比例一级92%、二级90%、三级88%。城乡居民医保住院起付标准：一级200元（二次100元）、二级400元（二次200元）、三级800元（二次400元），支付比例一级85%、二级75%、三级60%。基本统筹年最高支付限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'xg-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 2000,
      annualCapRetiree: 2400,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 600, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '孝感市职工门诊年起付线在职600元、退休500元；一级70%（退休80%）、二级60%（退休70%）、三级50%（退休60%）；在职限额2000元，退休限额2400元。'
    },
    inpatient: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内二次及以后住院起付标准相应递减50-100元。'
    },
    catastrophic: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      name: '孝感市职工大额医疗费用补助',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '孝感医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医规范备案享受同等报销待遇，非急诊未备案下浮。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度统筹限额400元。'
    },
    inpatient: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 800, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '同年度内二次及以后住院起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      name: '孝感市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xg-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定转诊备案外出就医的，降低10%报销比例。'
      ]
    }
  }
};
