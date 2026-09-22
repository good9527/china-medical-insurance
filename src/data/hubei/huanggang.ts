import type { CityInsuranceData } from '../types';

/**
 * 黄冈市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：421100
 */
export const huanggangCityData: CityInsuranceData = {
  cityCode: '421100',
  cityName: '黄冈市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0713-12393 / 0713-8386120',
  officialPortalUrl: 'http://ybj.hg.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'hg-employee-outpatient-2022',
      title: '关于印发黄冈市职工基本医疗保险门诊共济保障实施办法的通知',
      docNumber: '黄政办发〔2022〕41号',
      issuingDept: ['黄冈市人民政府办公室', '黄冈市医疗保障局'],
      publishDate: '2022-12-16',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hg.gov.cn/zwgk/zcfg/202212/t20221221_182931.html',
      summaryQuote: '黄政办发〔2022〕41号明确：普通门诊统筹年度起付标准在职职工600元、退休人员500元。普通门诊统筹年度最高支付限额在职职工1800元、退休人员2000元。统筹基金支付比例：一级医疗机构70%、二级医疗机构60%、三级医疗机构50%，退休人员在上述比例基础上统一上调10%（一级80%、二级70%、三级60%）。'
    },
    {
      docId: 'hg-inpatient-regulations-2022',
      title: '黄冈市职工基本医疗保险实施办法及住院报销规定',
      docNumber: '黄政规〔2022〕6号',
      issuingDept: ['黄冈市人民政府', '黄冈市医疗保障局'],
      publishDate: '2022-10-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hg.gov.cn/zwgk/zcjd/202210/t20221025_179210.html',
      summaryQuote: '统筹区内职工医保住院起付标准：一级及以下300元、二级500元、三级700元。统筹支付比例一级92%、二级88%、三级85%（退休人员增加2%）。城乡居民医保住院起付标准一级200元、二级500元、三级900元，支付比例一级85%、二级75%、三级60%。职工统筹基金年度最高支付限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'hg-employee-outpatient-2022',
      annualDeductible: 600,
      annualDeductibleRetiree: 500, // 退休人员门诊起付线 500 元
      annualCap: 1800,
      annualCapRetiree: 2000,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 600, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.70, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '黄冈市职工门诊年起付线在职600元、退休500元；一级70%（退休80%）、二级60%（退休70%）、三级50%（退休60%）；在职限额1800元，退休限额2000元。'
    },
    inpatient: {
      sourceDocId: 'hg-inpatient-regulations-2022',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 700, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '一个自然年度内多次住院起付线按政策享受递减倾斜。'
    },
    catastrophic: {
      sourceDocId: 'hg-inpatient-regulations-2022',
      name: '黄冈市职工大额医疗保险',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hg-inpatient-regulations-2022',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', 'i黄冈APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按规定办理异地备案享受同等待遇，未备案人员首先自付20%后按比例报销。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'hg-inpatient-regulations-2022',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点综合医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度限额400元。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'hg-inpatient-regulations-2022',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 900, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '向下级医疗机构转诊免除下级医院起付标准。'
    },
    catastrophic: {
      sourceDocId: 'hg-inpatient-regulations-2022',
      name: '黄冈市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hg-inpatient-regulations-2022',
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
