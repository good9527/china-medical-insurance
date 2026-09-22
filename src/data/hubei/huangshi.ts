import type { CityInsuranceData } from '../types';

/**
 * 黄石市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420200
 */
export const huangshiCityData: CityInsuranceData = {
  cityCode: '420200',
  cityName: '黄石市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0714-12393 / 0714-6522675',
  officialPortalUrl: 'http://ybj.huangshi.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'hs-employee-outpatient-2022',
      title: '黄石市建立健全职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '黄政办发〔2022〕63号',
      issuingDept: ['黄石市人民政府办公室', '黄石市医疗保障局'],
      publishDate: '2022-12-30',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.huangshi.gov.cn/zwgk/zcfg/202301/t20230110_987654.html',
      summaryQuote: '黄政办发〔2022〕63号明确：在职职工年度起付标准为200元（一级及以下）、400元（二级）、800元（三级）。一个医疗年度内，定点医疗机构间起付线合并计算，按就高原则全年只负担一次。统筹支付比例一级80%、二级70%、三级60%，退休人员在上述基础上提高5个百分点。普通门诊年度最高支付限额在职职工6000元，退休人员7000元。'
    },
    {
      docId: 'hs-inpatient-regulations-2024',
      title: '黄石市基本医疗保险住院与医疗救助保障待遇规程',
      docNumber: '黄医保发〔2024〕16号',
      issuingDept: ['黄石市医疗保障局', '黄石市财政局'],
      publishDate: '2024-01-15',
      effectiveDate: '2024-02-01',
      status: 'active',
      officialUrl: 'http://ybj.huangshi.gov.cn/zwgk/zcjd/202401/t20240118_1029384.html',
      summaryQuote: '黄石市职工医保住院起付标准：一级及以下200元、二级500元、三级800元，二次及以上住院起付标准降低100元。在职职工统筹支付比例：一级90%、二级88%、三级86%，退休人员相应提高2个百分点。城乡居民医保住院起付标准同上，支付比例一级90%、二级75%、三级60%。基本医保统筹基金年度最高支付限额17万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'hs-employee-outpatient-2022',
      annualDeductible: 400,
      annualCap: 6000,
      annualCapRetiree: 7000,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '黄石市门诊共济起付线合并计算就高负担一次。在职职工基层报销80%、二级70%、三级60%，退休人员上浮5个百分点；在职限额6000元/年，退休7000元/年。'
    },
    inpatient: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      annualCap: 170000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '一个自然年度内住院2次及以上的，起付标准降低100元。'
    },
    catastrophic: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      name: '黄石市职工大额医疗费用补助',
      deductible: 170000,
      annualCap: 300000,
      tiers: [
        { minAmount: 170000, maxAmount: 470000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '鄂汇办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省及省内异地就医规范备案人员享受参保地同等级别医疗机构报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区卫生中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民医保普通门诊统筹在基层医疗卫生机构就医享受免起付线报销50%，年度限额400元。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生中心', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 800, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '从上级医疗机构转往下级医疗机构住院的，取消下级医疗机构住院起付线。'
    },
    catastrophic: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      name: '黄石市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hs-inpatient-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '异地规范转诊就医报销比例按规定执行，异地非急诊且未备案按比例相应下浮。'
      ]
    }
  }
};
