import type { CityInsuranceData } from '../types';

export const nujiangCityData: CityInsuranceData = {
  cityCode: '533300',
  cityName: '怒江傈僳族自治州',
  provinceCode: '530000',
  provinceName: '云南省',
  hotline: '0886-12393',
  officialPortalUrl: 'http://ybj.nujiang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'nj-employee-outpatient-2022',
      title: '怒江州人民政府办公室关于印发怒江州职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '怒政办规〔2022〕10号',
      issuingDept: ['怒江傈僳族自治州人民政府办公室', '怒江州医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nujiang.gov.cn/zwgk/zcfg/202212/t20221220_1189234.html',
      summaryQuote: '门诊起付标准一级20元、二级40元、三级60元。在职职工统筹支付比例一级60%、二级55%、三级50%，退休人员各提高10个百分点（分别为70%、65%、60%）。门诊统筹年度最高支付限额统一为6000元。'
    },
    {
      docId: 'nj-medical-insurance-policy-2023',
      title: '怒江州医疗保障局关于调整基本医疗保险待遇政策的通知',
      docNumber: '怒医保发〔2023〕15号',
      issuingDept: ['怒江州医疗保障局', '怒江州财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nujiang.gov.cn/zwgk/zcfg/202311/t20231126_1289123.html',
      summaryQuote: '居民门诊在定点基层机构免起付线，报销50%，年度限额400元。城乡居民住院起付线一级100元、二级400元、三级800元，政策范围内报销比例对应85%、75%、60%，统筹年度限额6万元。职工住院起付线一级200元、二级500元、三级1200元，在职报销91%、88%、85%，退休提高4个百分点。'
    }
  ],

  // 城镇职工医保待遇 (怒江标准)
  employee: {
    outpatient: {
      sourceDocId: 'nj-employee-outpatient-2022',
      annualDeductible: 60,
      annualCap: 6000,
      annualCapRetiree: 6000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 20, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 20, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 40, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 60, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 60, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊起付标准一级20元、二级40元、三级60元。在职报销50%~60%，退休人员提高10%（60%~70%），年度封顶6000元。'
    },
    inpatient: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.91, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.91, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省属重点三甲医院', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至100元。'
    },
    catastrophic: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      filingChannels: ['国家医保服务平台APP', '一部手机办事通', '怒江医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地就医备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (怒江标准)
  resident: {
    outpatient: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 0, reimbursementRatio: 0 }
      },
      note: '居民门诊统筹仅在基层机构免起付享受，报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      annualCap: 60000,
      tierBenefits: {
        community: { tierName: '基层医疗机构/卫生院', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属重点医院', deductible: 1200, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nj-medical-insurance-policy-2023',
      filingChannels: ['国家医保服务平台APP', '一部手机办事通', '怒江医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '未按规定转诊自行跨省异地就医降低20个百分点。'
      ]
    }
  }
};
