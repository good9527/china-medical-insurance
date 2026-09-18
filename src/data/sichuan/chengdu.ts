import type { CityInsuranceData } from '../types';

/**
 * 成都市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：510100
 */
export const chengduCityData: CityInsuranceData = {
  cityCode: '510100',
  cityName: '成都市',
  provinceCode: '510000',
  provinceName: '四川省',
  hotline: '028-12393',
  officialPortalUrl: 'https://ybj.chengdu.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'cd-employee-outpatient-2022',
      title: '成都市建立健全职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '成办规〔2022〕4号',
      issuingDept: ['成都市人民政府办公厅', '成都市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.chengdu.gov.cn/cdsb/c139855/2022-12/29/content_5852eb8c82364c74a0041eb9eecf1367.shtml',
      summaryQuote: '在职职工普通门诊统筹起付标准为200元/年，退休人员为150元/年。二级及以下定点医疗机构在职职工支付比例为60%、退休人员为70%；三级定点医疗机构及定点零售药店在职职工为50%、退休人员为60%。统账结合方式参保年度支付限额在职职工2000元，退休人员2500元。'
    },
    {
      docId: 'cd-medical-insurance-regulations-2023',
      title: '成都市医疗保障局关于明确基本医疗保险有关待遇标准的通知',
      docNumber: '成医保发〔2023〕18号及现行执行规程',
      issuingDept: ['成都市医疗保障局', '成都市财政局'],
      publishDate: '2023-06-15',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'https://ybj.chengdu.gov.cn/cdsb/c139855/2023-06/16/content_18a09f899a7248f382a87fb25db5998a.shtml',
      summaryQuote: '职工医保住院起付线：乡镇卫生院/社区160元、一级医院200元、二级医院400元、三级医院800元；在职职工报销比例三级85%、二级89%、一级92%、基层95%，退休人员相应提高。居民医保住院起付线：乡镇卫生院/一级100元、二级200元、三级500元；高档缴费报销比例：基层95%、一级87%、二级82%、三级68%。大病保险起付线按上年度城乡居民人均可支配收入50%动态调整，分段报销60%、70%、80%。'
    },
    {
      docId: 'cd-resident-outpatient-regulations',
      title: '成都市城乡居民基本医疗保险普通门诊统筹保障办法',
      docNumber: '成医保发〔2021〕29号',
      issuingDept: ['成都市医疗保障局'],
      publishDate: '2021-11-20',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.chengdu.gov.cn/cdsb/c139855/2021-11/25/content_7781ff7382364c74a0041eb9eecf2231.shtml',
      summaryQuote: '居民医保普通门诊统筹限定在基层定点医疗机构（乡镇卫生院、社区卫生服务中心）就医，报销比例60%，年度最高支付限额为200元/人。二级及以上医疗机构普通门诊不予报销。'
    },
    {
      docId: 'cd-resident-medical-2024',
      title: '成都市医疗保障局等四部门关于做好2024-2025年成都市城乡居民基本医疗保险参保缴费及待遇保障工作的通知',
      docNumber: '成医保规〔2024〕1号',
      issuingDept: ['成都市医疗保障局', '成都市财政局', '国家税务总局成都市税务局'],
      publishDate: '2024-08-28',
      effectiveDate: '2024-09-01',
      status: 'active',
      officialUrl: 'https://ybj.chengdu.gov.cn/cdsb/c139855/2024-08/30/content_29a17b889a7248f382a87fb25db56611.shtml',
      summaryQuote: '深入落实国家参保长效机制，对连续参保人员提高大病保险最高支付限额；巩固普通门诊统筹及“两病”门诊用药保障机制，基层报销比例不低于60%。'
    }
  ],

  // 城镇职工医保待遇 (成都标准)
  employee: {
    outpatient: {
      sourceDocId: 'cd-employee-outpatient-2022',
      annualDeductible: 200, // 在职职工门诊起付线 200 元
      annualDeductibleRetiree: 150, // 退休人员门诊起付线 150 元
      annualCap: 2000,       // 在职门诊年限额 2000 元
      annualCapRetiree: 2500,// 退休门诊年限额 2500 元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构/乡镇卫生院', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '普通门诊统筹年度累计满200元（退休150元）后按规定报销，二级及以下60%（退休70%），三级50%（退休60%）。统账结合在职限额2000元，退休限额2500元。'
    },
    inpatient: {
      sourceDocId: 'cd-medical-insurance-regulations-2023',
      annualCap: 450000, // 基本医疗保险年最高支付限额约为平均工资6倍（约45万元）
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 160, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.89, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'cd-medical-insurance-regulations-2023',
      name: '城镇职工大病医疗互助补充保险',
      deductible: 0,
      tiers: [
        { minAmount: 450000, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cd-medical-insurance-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '四川医保微信小程序', '成都医保'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '成渝双城经济圈医保互联互通，异地就医直接联网结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (成都标准)
  resident: {
    outpatient: {
      sourceDocId: 'cd-resident-outpatient-regulations',
      annualDeductible: 0,
      annualCap: 200, // 居民普通门诊年限额 200 元
      tierBenefits: {
        community: { tierName: '基层乡镇卫生院/社区中心', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊统筹仅限在基层定点乡镇卫生院/社区卫生服务中心使用，报销比例60%，年最高限额200元。二级及以上定点医院普通门诊未纳入门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'cd-medical-insurance-regulations-2023',
      annualCap: 240000, // 居民住院年最高支付限额 24 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.95 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.87 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.82 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 500, reimbursementRatio: 0.68 }
      }
    },
    catastrophic: {
      sourceDocId: 'cd-medical-insurance-regulations-2023',
      name: '城乡居民大病保险',
      deductible: 18000, // 约1.8万元起付线
      tiers: [
        { minAmount: 18000, maxAmount: 68000, ratio: 0.60 },
        { minAmount: 68000, maxAmount: 118000, ratio: 0.70 },
        { minAmount: 118000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cd-medical-insurance-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '四川医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '川内及跨省异地就医直接结算，规范备案人员与参保地报销待遇一致。'
      ]
    }
  }
};
