import type { CityInsuranceData } from '../types';

/**
 * 深圳市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：440300
 */
export const shenzhenCityData: CityInsuranceData = {
  cityCode: '440300',
  cityName: '深圳市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0755-12393',
  officialPortalUrl: 'https://hsa.sz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'sz-medical-insurance-regulations-2023',
      title: '深圳市医疗保障办法',
      docNumber: '深圳市人民政府令第358号',
      issuingDept: ['深圳市人民政府', '深圳市医疗保障局'],
      publishDate: '2023-09-18',
      effectiveDate: '2023-10-01',
      status: 'active',
      officialUrl: 'https://hsa.sz.gov.cn/zwgk/zcfg/content/post_10842890.html',
      summaryQuote: '本办法自2023年10月1日起施行。职工一档普通门诊统筹年度支付限额为在岗职工年平均工资的6%（在职约1万元，退休约1.2万元），无门诊起付线；一级以下医疗机构报销75%（退休80%）、二级报销65%、三级报销55%。住院起付线一级以下200元、二级400元、三级600元（多次住院减半）；在职报销比例三级90%、二级91%、一级92%（退休统一95%）。连续参保72个月以上统筹基金最高支付限额达上上年度在岗职工年平均工资的6倍（超100万元）。'
    },
    {
      docId: 'sz-resident-medical-rules',
      title: '深圳市居民医疗保险及职工二档门诊统筹经办指引',
      docNumber: '深医保规〔2023〕7号',
      issuingDept: ['深圳市医疗保障局'],
      publishDate: '2023-09-25',
      effectiveDate: '2023-10-01',
      status: 'active',
      officialUrl: 'https://hsa.sz.gov.cn/zwgk/zcjd/content/post_10849921.html',
      summaryQuote: '居民医保参保人员普通门诊统筹限定在绑定的社康中心等基层医疗机构就医，支付比例为75%（60岁以上老人80%），年最高支付限额为在岗职工年平均工资的1.5%（约2655元）。居民住院起付线及报销比例与职工医保一致。大病保险实行不设封顶线的阶梯保障。'
    },
    {
      docId: 'sz-remote-settlement-2024',
      title: '深圳市医疗保障局关于进一步做好基本医疗保险跨省及省内异地就医直接结算工作的通知',
      docNumber: '深医保发〔2024〕10号',
      issuingDept: ['深圳市医疗保障局', '深圳市财政局'],
      publishDate: '2024-05-15',
      effectiveDate: '2024-06-01',
      status: 'active',
      officialUrl: 'https://hsa.sz.gov.cn/zwgk/zcfg/content/post_11438902.html',
      summaryQuote: '异地长期居住人员完成规范备案后，在备案地定点医药机构就医享受与市内就医同等的医保基金支付比例；跨省临时外出就医人员可直接通过“深圳医保”微信公众号实现免证明材料自助备案。'
    }
  ],

  // 城镇职工医保待遇 (深圳标准 - 一档统账结合)
  employee: {
    outpatient: {
      sourceDocId: 'sz-medical-insurance-regulations-2023',
      annualDeductible: 0,   // 深圳职工一档门诊免设起付线（0元起付）
      annualCap: 10000,      // 在职约 10000 元（按在岗职工年平均工资6%）
      annualCapRetiree: 12000, // 退休约 12000 元（按在岗职工年平均工资7%）
      tierBenefits: {
        community: { tierName: '社康中心/一级以下基层医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 0, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊无起付线，在职职工在社康中心/一级医院报销75%（退休80%）、二级医院报销65%（退休70%）、三级医院报销55%（退休60%）。在职限额约10000元，退休限额约12000元。'
    },
    inpatient: {
      sourceDocId: 'sz-medical-insurance-regulations-2023',
      annualCap: 1050000, // 连续参保72个月以上统筹基金最高支付限额约105万元
      tierBenefits: {
        community: { tierName: '一级及社康中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.91, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '年度内二次及以上住院起付线减半（一级100元、二级200元、三级300元）。'
    },
    catastrophic: {
      sourceDocId: 'sz-medical-insurance-regulations-2023',
      name: '深圳市大病保险（二次报销）',
      deductible: 10000,
      tiers: [
        { minAmount: 10000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-medical-insurance-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '深圳医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省及省内异地就医直接联网结算，符合规定备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (深圳标准)
  resident: {
    outpatient: {
      sourceDocId: 'sz-resident-medical-rules',
      annualDeductible: 0,
      annualCap: 2655, // 在岗职工年平均工资1.5%
      tierBenefits: {
        community: { tierName: '绑定的社康中心/基层医疗机构', deductible: 0, reimbursementRatio: 0.75 },
        tier1: { tierName: '一级定点医疗机构（未绑定）', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊统筹限定在绑定的基层社康机构就诊，报销比例75%（60岁以上老人80%），年最高支付限额约2655元。'
    },
    inpatient: {
      sourceDocId: 'sz-medical-insurance-regulations-2023',
      annualCap: 500000, // 居民住院统筹年限额约 50 万元
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.91 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.90 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 600, reimbursementRatio: 0.90 }
      },
      repeatedDeductibleRule: '多次住院起付线依次减半。'
    },
    catastrophic: {
      sourceDocId: 'sz-resident-medical-rules',
      name: '城乡居民大病保险',
      deductible: 10000,
      tiers: [
        { minAmount: 10000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-medical-insurance-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '深圳医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内及跨省异地就医直接结算，规范备案享受本地待遇。'
      ]
    }
  }
};
