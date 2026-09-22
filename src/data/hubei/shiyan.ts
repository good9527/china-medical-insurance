import type { CityInsuranceData } from '../types';

/**
 * 十堰市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420300
 */
export const shiyanCityData: CityInsuranceData = {
  cityCode: '420300',
  cityName: '十堰市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0719-12393 / 0719-8629000',
  officialPortalUrl: 'http://ybj.shiyan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'sy-employee-outpatient-2022',
      title: '关于印发《十堰市职工基本医疗保险门诊共济保障实施细则（试行）》的通知',
      docNumber: '十政办发〔2022〕61号',
      issuingDept: ['十堰市人民政府办公室', '十堰市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.shiyan.gov.cn/zwgk/zcfg/202212/t20221230_3829101.html',
      summaryQuote: '十政办发〔2022〕61号规定：在职职工与退休人员普通门诊统筹年度起付标准统一为500元，最高支付限额统一为3000元。统筹基金支付比例：在职职工在三级医疗机构为50%、二级医疗机构为65%、一级医疗机构为80%；退休人员在各级医疗机构统筹支付比例相应提高10个百分点（一级90%、二级75%、三级60%）。'
    },
    {
      docId: 'sy-inpatient-regulations-2024',
      title: '十堰市基本医疗保险住院及大额医疗补助待遇标准规范',
      docNumber: '十医保发〔2024〕12号',
      issuingDept: ['十堰市医疗保障局', '十堰市财政局'],
      publishDate: '2024-01-10',
      effectiveDate: '2024-02-01',
      status: 'active',
      officialUrl: 'http://ybj.shiyan.gov.cn/zwgk/zcjd/202401/t20240115_3987211.html',
      summaryQuote: '十堰市职工医保住院起付标准：一级医疗机构200元，二级医疗机构500元，三级医疗机构首次1000元（二次及以上800元）。统筹基金支付比例：一级在职90%（退休92%），二级在职88%（退休90%），三级在职85%（退休87%）。居民医保住院起付标准：一级200元、二级500元、三级1000元，支付比例一级85%、二级75%、三级65%。基本统筹年限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'sy-employee-outpatient-2022',
      annualDeductible: 500,
      annualCap: 3000,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '十堰市在职职工与退休人员门诊统筹起付线均为500元，年封顶3000元。基层报销80%（退休90%），二级65%（退休75%），三级50%（退休60%）。'
    },
    inpatient: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '三级医疗机构年度内二次及以上住院起付标准降为800元。'
    },
    catastrophic: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      name: '十堰市职工大额医疗费用补助',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '十堰医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范转诊执行省内统一转诊报销政策。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层卫生院/社区卫生站', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹在基层医疗机构免起付线报销50%，年度限额400元。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三甲重点医院', deductible: 1000, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '按分级诊疗要求向下转诊住院免除下级医院起付线。'
    },
    catastrophic: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      name: '十堰市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sy-inpatient-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定办理异地备案或转诊的外出就诊人员，报销比例相应降低。'
      ]
    }
  }
};
