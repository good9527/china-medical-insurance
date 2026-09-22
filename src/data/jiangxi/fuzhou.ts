import type { CityInsuranceData } from '../types';

export const fuzhouData: CityInsuranceData = {
  cityCode: '361000',
  cityName: '抚州市',
  provinceCode: '360000',
  provinceName: '江西省',
  hotline: '0794-12393',
  officialPortalUrl: 'http://ybj.jxfz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'fz-employee-outpatient-2022',
      title: '抚州市医疗保障局等四部门关于印发抚州市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '抚医保发〔2022〕16号',
      issuingDept: ['抚州市医疗保障局', '抚州市财政局', '抚州市卫生健康委员会'],
      publishDate: '2022-12-22',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jxfz.gov.cn/art/2022/12/26/art_4123_3943922.html',
      summaryQuote: '普通门诊统筹年度起付标准为300元。起付标准以上统筹基金支付比例：一级及以下定点医疗机构65%、二级定点医疗机构60%、三级定点医疗机构55%；退休人员支付比例提高5个百分点（一级70%、二级65%、三级60%）。职工门诊统筹年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'fz-medical-treatment-policy-2023',
      title: '抚州市医疗保障局关于进一步做好基本医疗保险待遇保障工作的通知',
      docNumber: '抚医保发〔2023〕18号',
      issuingDept: ['抚州市医疗保障局', '抚州市财政局'],
      publishDate: '2023-06-28',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'http://ybj.jxfz.gov.cn/art/2023/7/3/art_4123_4021893.html',
      summaryQuote: '城乡居民普通门诊统筹在基层定点机构不设起付线，政策范围内报销65%，年度最高支付150元。居民住院起付线一级100元、二级400元、三级600元，报销比例90%、80%、65%，年度封顶15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销95%、90%、85%，退休提高3个百分点，职工医保统筹加互助年度最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (抚州标准)
  employee: {
    outpatient: {
      sourceDocId: 'fz-employee-outpatient-2022',
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
      note: '职工门诊年度起付线300元。一级65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）。在职封顶2000元，退休封顶3000元。'
    },
    inpatient: {
      sourceDocId: 'fz-medical-treatment-policy-2023',
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
      sourceDocId: 'fz-medical-treatment-policy-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'fz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省异地就医直接联网结算，长期备案人员享受参保地同等报销比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (抚州标准)
  resident: {
    outpatient: {
      sourceDocId: 'fz-medical-treatment-policy-2023',
      annualCap: 150000, // 基层普通门诊不设单项封顶线，合并基本医保年度最高支付限额 15 万元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层及一级机构享受，无起付线，报销比例65%，不设单项封顶线（合并年度统筹限额15万元）。'
    },
    inpatient: {
      sourceDocId: 'fz-medical-treatment-policy-2023',
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
      sourceDocId: 'fz-medical-treatment-policy-2023',
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
      sourceDocId: 'fz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '江西医保公共服务小程序', '赣服通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '按规定备案转诊直接结算，未备案自行异地就医报销比例下浮20个百分点。'
      ]
    }
  }
};
