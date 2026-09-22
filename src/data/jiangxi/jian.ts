import type { CityInsuranceData } from '../types';

export const jianData: CityInsuranceData = {
  cityCode: '360800',
  cityName: '吉安市',
  provinceCode: '360000',
  provinceName: '江西省',
  hotline: '0796-12393',
  officialPortalUrl: 'http://ybj.jian.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'ja-employee-outpatient-2022',
      title: '吉安市人民政府办公室关于印发吉安市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '吉府办字〔2022〕42号',
      issuingDept: ['吉安市人民政府办公室', '吉安市医疗保障局'],
      publishDate: '2022-12-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jian.gov.cn/news-show-12582.html',
      summaryQuote: '职工医保门诊统筹年度起付标准调整为300元。起付线以上政策范围内报销比例：一级及以下定点医疗机构65%、二级定点机构60%、三级定点机构55%；退休人员相应提高5个百分点（一级70%、二级65%、三级60%）。职工门诊统筹年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'ja-medical-treatment-policy-2023',
      title: '吉安市医疗保障局关于优化调整基本医疗保险待遇政策的通知',
      docNumber: '吉医保发〔2023〕12号',
      issuingDept: ['吉安市医疗保障局', '吉安市财政局'],
      publishDate: '2023-06-20',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'http://ybj.jian.gov.cn/news-show-13491.html',
      summaryQuote: '居民医保普通门诊在基层医疗卫生机构不设起付线，报销65%，年度限额150元。城乡居民住院起付线一级100元、二级400元、三级600元，报销比例90%、80%、65%，年度封顶15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销95%、90%、85%，退休人员各段提高3个百分点，职工统筹加互助年度最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (吉安标准)
  employee: {
    outpatient: {
      sourceDocId: 'ja-employee-outpatient-2022',
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
      note: '门诊起付标准300元/年。一级65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）。在职封顶2000元，退休封顶3000元。'
    },
    inpatient: {
      sourceDocId: 'ja-medical-treatment-policy-2023',
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
      sourceDocId: 'ja-medical-treatment-policy-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ja-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省异地就医直接联网结算，长期备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (吉安标准)
  resident: {
    outpatient: {
      sourceDocId: 'ja-medical-treatment-policy-2023',
      annualCap: 150000, // 基层普通门诊不设单项封顶线，合并基本医保年度最高支付限额 15 万元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三级甲等医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民医保普通门诊统筹在基层及一级机构享受，免起付线，报销比例65%，不设单项封顶线（合并年度统筹限额15万元）。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'ja-medical-treatment-policy-2023',
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
      sourceDocId: 'ja-medical-treatment-policy-2023',
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
      sourceDocId: 'ja-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '未按规定办理异地备案转诊的，报销比例降低20个百分点。'
      ]
    }
  }
};
