import type { CityInsuranceData } from '../types';

export const jiujiangData: CityInsuranceData = {
  cityCode: '360400',
  cityName: '九江市',
  provinceCode: '360000',
  provinceName: '江西省',
  hotline: '0792-12393',
  officialPortalUrl: 'http://ybj.jiujiang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'jj-employee-outpatient-2022',
      title: '九江市人民政府办公室关于建立健全九江市职工基本医疗保险门诊共济保障机制的实施意见',
      docNumber: '九府办发〔2022〕21号',
      issuingDept: ['九江市人民政府办公室', '九江市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jiujiang.gov.cn/zwgk/zcfg/202212/t20221220_5891042.html',
      summaryQuote: '普通门诊统筹年度起付标准调整为300元。起付线以上统筹基金支付比例：一级及以下医疗机构65%、二级医疗机构60%、三级医疗机构55%；退休人员支付比例分别提高5个百分点（一级70%、二级65%、三级60%）。门诊统筹年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'jj-resident-employee-inpatient-2023',
      title: '九江市基本医疗保险住院及门诊待遇保障细则通知',
      docNumber: '九医保发〔2023〕18号',
      issuingDept: ['九江市医疗保障局', '九江市财政局'],
      publishDate: '2023-05-18',
      effectiveDate: '2023-06-01',
      status: 'active',
      officialUrl: 'http://ybj.jiujiang.gov.cn/zwgk/zcfg/202305/t20230522_6019241.html',
      summaryQuote: '居民基层普通门诊免起付线，报销65%，限额150元。居民住院起付线一级100元、二级400元、三级600元，支付比例对应90%、80%、65%，限额15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销95%、90%、85%，退休提高3个百分点，职工医保限额15万元，大病救助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (九江标准)
  employee: {
    outpatient: {
      sourceDocId: 'jj-employee-outpatient-2022',
      annualDeductible: 300, // 门诊年度起付线 300 元
      annualCap: 2000,       // 在职限额 2000 元
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '基层及一级定点机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级重点医疗机构', deductible: 300, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线300元。一级报销65%（退休70%），二级报销60%（退休65%），三级报销55%（退休60%）。在职限额2000元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      annualCap: 500000, // 基本统筹15万 + 大额补助
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省级重点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省异地就医直接联网结算，长期异地备案享受与九江本地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (九江标准)
  resident: {
    outpatient: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      annualCap: 150000, // 基层普通门诊不设单项封顶线，合并基本医保年度最高支付限额 15 万元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省级医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '居民基层普通门诊免起付线，政策范围内报销比例65%，不设单项封顶线（合并年度统筹限额15万元）。'
    },
    inpatient: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级医疗机构', deductible: 600, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省级定点医院', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 350000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jj-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '跨省及省内异地就医直接联网结算。'
      ]
    }
  }
};
