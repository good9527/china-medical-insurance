import type { CityInsuranceData } from '../types';

/**
 * 仙桃市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：429004
 */
export const xiantaoCityData: CityInsuranceData = {
  cityCode: '429004',
  cityName: '仙桃市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0728-12393 / 0728-3266831',
  officialPortalUrl: 'http://ybj.xiantao.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'xt-employee-outpatient-2022',
      title: '仙桃市职工基本医疗保险门诊共济保障实施细则',
      docNumber: '仙政规〔2022〕15号',
      issuingDept: ['仙桃市人民政府', '仙桃市医疗保障局'],
      publishDate: '2022-09-09',
      effectiveDate: '2022-12-31',
      status: 'active',
      officialUrl: 'http://ybj.xiantao.gov.cn/zwgk/zcfg/202209/t20220915_431920.html',
      summaryQuote: '仙政规〔2022〕15号规定：普通门诊统筹年度起付标准在职职工600元、退休人员500元。普通门诊统筹年度最高支付限额在职职工2000元、退休人员2500元。统筹基金支付比例：一级医疗机构80%、二级医疗机构65%、三级医疗机构50%，退休人员在上述比例基础上提高10个百分点（一级90%、二级75%、三级60%）。'
    },
    {
      docId: 'xt-inpatient-regulations-2023',
      title: '仙桃市基本医疗保险住院与大额救助管理办法',
      docNumber: '仙医保发〔2023〕16号',
      issuingDept: ['仙桃市医疗保障局', '仙桃市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xiantao.gov.cn/zwgk/zcjd/202311/t20231128_459201.html',
      summaryQuote: '统筹区内职工住院起付标准：一级医疗机构100元、二级医疗机构400元、三级医疗机构500元。统筹支付比例一级92%、二级88%、三级85%（退休人员增加2%）。城乡居民医保住院起付标准一级100元、二级400元、三级500元，支付比例一级88%、二级75%、三级60%。职工基本统筹年度最高支付限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'xt-employee-outpatient-2022',
      annualDeductible: 600,
      annualDeductibleRetiree: 500, // 退休人员门诊起付线 500 元
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '仙桃市职工门诊年起付线在职600元、退休500元；一级80%（退休90%）、二级65%（退休75%）、三级50%（退休60%）；在职限额2000元，退休限额2500元。'
    },
    inpatient: {
      sourceDocId: 'xt-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 100, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 500, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付线按政策规定办理。'
    },
    catastrophic: {
      sourceDocId: 'xt-inpatient-regulations-2023',
      name: '仙桃市职工大额医疗保险',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xt-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '鄂汇办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '转市外医院就医起付标准为800元，规范备案享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'xt-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度限额400元。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'xt-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '按分级诊疗向下转诊免除下级医院起付线。'
    },
    catastrophic: {
      sourceDocId: 'xt-inpatient-regulations-2023',
      name: '仙桃市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xt-inpatient-regulations-2023',
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
