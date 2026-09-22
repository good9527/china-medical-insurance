import type { CityInsuranceData } from '../types';

/**
 * 荆门市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420800
 */
export const jingmenCityData: CityInsuranceData = {
  cityCode: '420800',
  cityName: '荆门市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0724-12393 / 0724-8885623',
  officialPortalUrl: 'http://ybj.jingmen.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'jm-employee-outpatient-2022',
      title: '关于印发荆门市职工基本医疗保险门诊共济保障实施办法（试行）等文件的通知',
      docNumber: '荆政发〔2022〕15号',
      issuingDept: ['荆门市人民政府', '荆门市医疗保障局'],
      publishDate: '2022-09-23',
      effectiveDate: '2022-10-01',
      status: 'active',
      officialUrl: 'http://ybj.jingmen.gov.cn/art/2022/9/25/art_8392_91823.html',
      summaryQuote: '荆政发〔2022〕15号明确：普通门诊统筹年度起付标准为在职职工500元、退休人员400元。普通门诊统筹年度最高支付限额在职职工2000元、退休人员2500元。统筹基金支付比例：一级定点医疗机构75%、二级定点医疗机构65%、三级定点医疗机构55%，退休人员相应提高5个百分点（一级80%、二级70%、三级60%）。'
    },
    {
      docId: 'jm-inpatient-regulations-2023',
      title: '荆门市基本医疗保险和生育保险住院待遇管理办法',
      docNumber: '荆医保发〔2023〕29号',
      issuingDept: ['荆门市医疗保障局', '荆门市财政局'],
      publishDate: '2023-11-15',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jingmen.gov.cn/art/2023/11/20/art_8392_99812.html',
      summaryQuote: '荆门市职工医保住院起付标准：一级定点医疗机构200元、二级定点医疗机构500元、三级定点医疗机构900元。统筹基金支付比例一级90%、二级88%、三级85%（退休人员增加2%）。城乡居民医保住院起付标准相同，统筹支付比例一级85%、二级75%、三级65%。年度基本统筹最高支付限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'jm-employee-outpatient-2022',
      annualDeductible: 500,
      annualDeductibleRetiree: 400, // 退休人员门诊起付线 400 元
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '荆门市职工门诊年起付线在职500元、退休400元；基层报销75%（退休80%）、二级65%（退休70%）、三级55%（退休60%）；年度最高支付在职2000元，退休2500元。'
    },
    inpatient: {
      sourceDocId: 'jm-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付线按规范标准分次计算，按疗程住院享受起付优惠。'
    },
    catastrophic: {
      sourceDocId: 'jm-inpatient-regulations-2023',
      name: '荆门市职工大额医疗保险',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jm-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '荆门医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '宜荆荆都市圈内异地就医免备案直接结算，享受参保地同等级别待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'jm-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊在基层定点医疗机构免起付线报销50%，年度限额400元。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'jm-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三甲重点医院', deductible: 900, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '按分级诊疗要求向下转诊免除下级医疗机构住院起付线。'
    },
    catastrophic: {
      sourceDocId: 'jm-inpatient-regulations-2023',
      name: '荆门市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jm-inpatient-regulations-2023',
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
