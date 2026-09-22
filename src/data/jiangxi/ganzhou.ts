import type { CityInsuranceData } from '../types';

export const ganzhouData: CityInsuranceData = {
  cityCode: '360700',
  cityName: '赣州市',
  provinceCode: '360000',
  provinceName: '江西省',
  hotline: '0797-12393',
  officialPortalUrl: 'http://ybj.ganzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'gz-employee-outpatient-2022',
      title: '赣州市人民政府办公室关于印发赣州市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '赣市府办发〔2022〕19号',
      issuingDept: ['赣州市人民政府办公室', '赣州市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.ganzhou.gov.cn/gzyb/c102283/202212/6253907c11f74ef7b53589b252ce8a30.shtml',
      summaryQuote: '普通门诊统筹年度起付标准为300元。一级及以下医疗机构支付比例为65%、二级医疗机构为60%、三级医疗机构为55%；退休人员支付比例提高5个百分点（一级70%、二级65%、三级60%）。职工门诊统筹年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'gz-medical-treatment-policy-2023',
      title: '赣州市医疗保障局关于进一步明确基本医疗保险待遇保障有关事项的通知',
      docNumber: '赣市医保发〔2023〕15号',
      issuingDept: ['赣州市医疗保障局', '赣州市财政局'],
      publishDate: '2023-06-15',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'http://ybj.ganzhou.gov.cn/gzyb/c102283/202306/2504958c213448fdb09349880adbf1b3.shtml',
      summaryQuote: '居民医保普通门诊在基层定点机构不设起付线，政策范围内报销65%，年度最高支付限额150元。居民住院起付线一级100元、二级400元、三级600元，报销比例90%、80%、65%，封顶15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销95%、90%、85%，退休提高3个百分点，职工医保统筹最高支付10万元，大病补助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (赣州标准)
  employee: {
    outpatient: {
      sourceDocId: 'gz-employee-outpatient-2022',
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
      note: '门诊起付线300元/年。一级65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）。在职封顶2000元，退休封顶3000元。'
    },
    inpatient: {
      sourceDocId: 'gz-medical-treatment-policy-2023',
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
      sourceDocId: 'gz-medical-treatment-policy-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'gz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省及省内异地就医直接联网结算，长期异地备案享受与赣州同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (赣州标准)
  resident: {
    outpatient: {
      sourceDocId: 'gz-medical-treatment-policy-2023',
      annualCap: 150000, // 县域内一级及以下基层医疗机构不设单项封顶线，合并基本医保限额 15 万元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '参保居民在参保地县域内一级及以下定点基层医疗机构门诊就医，免起付线，报销比例65%，不设单项封顶线（合并年度统筹限额15万元）。二级及以上医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'gz-medical-treatment-policy-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/基层机构', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省属三甲医疗机构', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'gz-medical-treatment-policy-2023',
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
      sourceDocId: 'gz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '办理备案后直接结算，未备案转诊下浮20个百分点。'
      ]
    }
  }
};
