import type { CityInsuranceData } from '../types';

/**
 * 上海市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026医保年度（现行有效）
 * 统筹级别：直辖市级统筹（全市统一标准）
 */
export const shanghaiCityData: CityInsuranceData = {
  cityCode: '310100',
  cityName: '上海市',
  provinceCode: '310000',
  provinceName: '上海市',
  hotline: '021-12393',
  officialPortalUrl: 'https://ybj.sh.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'sh-medical-insurance-regulations-2024',
      title: '上海市基本医疗保险办法及2024-2025医保年度待遇调整通知',
      docNumber: '沪医保规〔2023〕8号及2024年度待遇调整文告',
      issuingDept: ['上海市医疗保障局', '上海市财政局'],
      publishDate: '2024-06-25',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'https://ybj.sh.gov.cn/zfxxgk/202406/t20240628_3159231.html',
      summaryQuote: '2024-2025医保年度本市职工医保统筹基金最高支付限额提高至63万元（2025-2026医保年度提高至65万元），超过部分按80%继续报销。在职职工门急诊自负段为500元，一级医疗机构报销80%、二级报销75%、三级报销70%（退休人员上浮5%至10%）。在职职工住院起付线为1500元，统筹报销比例为85%（退休92%）。'
    },
    {
      docId: 'sh-resident-medical-regulations',
      title: '上海市城乡居民基本医疗保险办法实施细则',
      docNumber: '沪医保规〔2020〕13号及现行执行规程',
      issuingDept: ['上海市医疗保障局', '上海市教育委员会'],
      publishDate: '2020-12-10',
      effectiveDate: '2021-01-01',
      status: 'active',
      officialUrl: 'https://ybj.sh.gov.cn/zfxxgk/202012/t20201215_1876543.html',
      summaryQuote: '城乡居民门急诊自负段：19-59岁人员为500元，一级医院报销70%、二级60%、三级50%。居民住院起付线：一级50元（报销90%）、二级100元（报销80%）、三级300元（报销70%）。大病保险涵盖重症尿毒症、恶性肿瘤等，政策范围内自负费用报销60%。'
    },
    {
      docId: 'sh-delta-medical-2023',
      title: '上海市医疗保障局关于深入推进长三角生态绿色一体化发展示范区医疗保障一体化发展的通知',
      docNumber: '沪医保规〔2023〕2号',
      issuingDept: ['上海市医疗保障局', '青浦区人民政府'],
      publishDate: '2023-03-10',
      effectiveDate: '2023-04-01',
      status: 'active',
      officialUrl: 'https://ybj.sh.gov.cn/zfxxgk/202303/t20230315_1876543.html',
      summaryQuote: '长三角一体化示范区内参保人员在示范区定点医疗机构就医，全面实行门诊及住院免备案直接刷卡结算，执行参保地报销待遇与统筹标准。'
    }
  ],

  // 城镇职工医保待遇 (上海标准)
  employee: {
    outpatient: {
      sourceDocId: 'sh-medical-insurance-regulations-2024',
      annualDeductible: 500, // 在职门急诊自负段 500 元（2001年后退休300元）
      annualDeductibleRetiree: 300, // 退休人员自负段 300 元
      annualCap: 650000,     // 计入统筹基金最高支付限额 65 万元
      annualCapRetiree: 650000,
      tierBenefits: {
        community: { tierName: '一级及社区卫生服务中心', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 }
      },
      note: '门急诊费用自负段在职500元、退休300元，共负段一级报销80%、二级75%、三级70%（退休各上浮5%）。门诊与住院合并计算统筹封顶线（65万元），超过限额由附加基金继续报销80%。'
    },
    inpatient: {
      sourceDocId: 'sh-medical-insurance-regulations-2024',
      annualCap: 650000, // 2025医保年度封顶 65 万元
      tierBenefits: {
        community: { tierName: '一级及社区卫生机构', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 },
        tier1: { tierName: '一级定点医疗机构', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 },
        tier3_top: { tierName: '三级甲等重点医院', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 }
      },
      repeatedDeductibleRule: '在职住院起付线1500元（退休1200元），当年多次住院不递减。'
    },
    catastrophic: {
      sourceDocId: 'sh-medical-insurance-regulations-2024',
      name: '上海市职工地方附加医疗保险',
      deductible: 650000,
      tiers: [
        { minAmount: 650000, ratio: 0.80 } // 超过65万部分按80%报销，不设封顶线
      ]
    },
    remoteMedical: {
      sourceDocId: 'sh-medical-insurance-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '随申办市民云', '上海医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角示范区（青浦、吴江、嘉善等）门诊与住院就医免备案直接实时结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (上海标准)
  resident: {
    outpatient: {
      sourceDocId: 'sh-resident-medical-regulations',
      annualDeductible: 500, // 19-59岁居民自负段 500 元（学生儿童300元）
      annualCap: 250000,
      tierBenefits: {
        community: { tierName: '村卫生室/社区卫生服务中心', deductible: 500, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.60 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 500, reimbursementRatio: 0.50 }
      },
      note: '门急诊自负段500元（学生儿童及老人300元），起付线以上一级医院报销70%、二级60%、三级50%。'
    },
    inpatient: {
      sourceDocId: 'sh-resident-medical-regulations',
      annualCap: 250000, // 居民年统筹限额 25 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务中心/一级定点', deductible: 50, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 300, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'sh-resident-medical-regulations',
      name: '城乡居民大病保险',
      deductible: 0,
      tiers: [
        { minAmount: 0, ratio: 0.60 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sh-medical-insurance-regulations-2024',
      filingChannels: ['国家医保服务平台APP', '随申办市民云'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角区域一体化结算，规范备案人员与上海本地享受同等待遇。'
      ]
    }
  }
};
