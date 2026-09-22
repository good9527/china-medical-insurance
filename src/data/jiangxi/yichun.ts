import type { CityInsuranceData } from '../types';

export const yichunData: CityInsuranceData = {
  cityCode: '360900',
  cityName: '宜春市',
  provinceCode: '360000',
  provinceName: '江西省',
  hotline: '0795-12393',
  officialPortalUrl: 'http://ybj.yichun.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'yc-employee-outpatient-2022',
      title: '宜春市人民政府办公室关于印发宜春市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '宜府办发〔2022〕19号',
      issuingDept: ['宜春市人民政府办公室', '宜春市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.yichun.gov.cn/ycsylbzj/zcfg/202212/28d05fcfe55848bb9211c472f8832a82.shtml',
      summaryQuote: '普通门诊统筹年度起付标准为300元。起付标准以上统筹基金支付比例：一级及以下定点医疗机构65%、二级定点医疗机构60%、三级定点医疗机构55%；退休人员支付比例提高5个百分点（一级70%、二级65%、三级60%）。职工门诊统筹年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'yc-medical-treatment-policy-2023',
      title: '宜春市医疗保障局关于进一步完善基本医疗保险有关待遇政策的通知',
      docNumber: '宜医保字〔2023〕20号',
      issuingDept: ['宜春市医疗保障局', '宜春市财政局'],
      publishDate: '2023-06-25',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'http://ybj.yichun.gov.cn/ycsylbzj/zcfg/202306/11d13fcae66948bb9211c472f8833b91.shtml',
      summaryQuote: '居民医保普通门诊在定点基层及一级机构无起付线，报销65%，年度封顶150元。城乡居民住院起付线一级100元、二级400元、三级600元，报销比例对应90%、80%、65%，年度封顶15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销95%、90%、85%，退休提高3个百分点，职工医保统筹限额10万元，大病补助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (宜春标准)
  employee: {
    outpatient: {
      sourceDocId: 'yc-employee-outpatient-2022',
      annualDeductible: 300,
      annualCap: 2000,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层及一级定点机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级重点医疗机构', deductible: 300, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊起付线300元/年。一级65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）。在职封顶2000元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三甲定点机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至100元。'
    },
    catastrophic: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '异地长期居住人员备案后联网直接结算，享受与参保地同等报销比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (宜春标准)
  resident: {
    outpatient: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      annualCap: 150000, // 基层普通门诊不设单项封顶线，合并基本医保年度最高支付限额 15 万元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '居民普通门诊统筹在基层定点机构免起付线，政策范围内报销比例65%，不设单项封顶线（合并年度统筹限额15万元）。'
    },
    inpatient: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      name: '城乡居民大病保险',
      deductible: 14000,
      annualCap: 350000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yc-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '按规定备案转诊直接结算，未备案自行外出降低20个百分点。'
      ]
    }
  }
};
