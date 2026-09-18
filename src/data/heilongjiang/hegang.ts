import type { CityInsuranceData } from '../types';

export const hegangCityData: CityInsuranceData = {
  cityCode: '230400',
  cityName: '鹤岗市',
  provinceCode: '230000',
  provinceName: '黑龙江省',
  hotline: '0468-12393',
  officialPortalUrl: 'http://ybj.hegang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hg-employee-outpatient-2022',
      title: '鹤岗市人民政府办公室关于印发鹤岗市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '鹤政办规〔2022〕13号',
      issuingDept: ['鹤岗市人民政府办公室', '鹤岗市医疗保障局'],
      publishDate: '2022-12-14',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hegang.gov.cn/zwgk/zcfg/202212/t20221220_1189234.html',
      summaryQuote: '在职职工门诊年度起付标准400元。一级及以下机构统筹支付70%、二级机构60%、三级机构50%；退休人员支付比例分别提高5个百分点（一级75%、二级65%、三级55%）。门诊统筹年度最高支付限额在职及退休职工均为2000元。'
    },
    {
      docId: 'hg-medical-insurance-policy-2023',
      title: '鹤岗市医疗保障局关于进一步完善基本医疗保险待遇政策的通知',
      docNumber: '鹤医保发〔2023〕15号',
      issuingDept: ['鹤岗市医疗保障局', '鹤岗市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hegang.gov.cn/zwgk/zcfg/202311/t20231126_1289123.html',
      summaryQuote: '居民门诊在基层定点机构免起付线，报销50%，年度限额200元。城乡居民住院起付线一级200元、二级450元、三级700元，政策范围内报销比例对应85%、75%、60%，统筹年度限额10万元。职工住院起付线一级240元、二级480元、三级720元，在职报销95%、92%、88%，退休提高2个百分点。'
    }
  ],

  // 城镇职工医保待遇 (鹤岗标准)
  employee: {
    outpatient: {
      sourceDocId: 'hg-employee-outpatient-2022',
      annualDeductible: 400,
      annualCap: 2000,
      annualCapRetiree: 2000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线400元。在职报销50%~70%，退休人员各段提高5个百分点（55%~75%），年度封顶2000元。'
    },
    inpatient: {
      sourceDocId: 'hg-medical-insurance-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 240, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 240, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 480, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 720, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '省属重点三甲医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至100元。'
    },
    catastrophic: {
      sourceDocId: 'hg-medical-insurance-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hg-medical-insurance-policy-2023',
      filingChannels: ['国家医保服务平台APP', '全省事', '鹤岗医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地就医备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (鹤岗标准)
  resident: {
    outpatient: {
      sourceDocId: 'hg-medical-insurance-policy-2023',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 0, reimbursementRatio: 0 }
      },
      note: '居民门诊统筹仅在基层机构免起付享受，报销50%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'hg-medical-insurance-policy-2023',
      annualCap: 100000,
      tierBenefits: {
        community: { tierName: '基层医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属重点医院', deductible: 1000, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'hg-medical-insurance-policy-2023',
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
      sourceDocId: 'hg-medical-insurance-policy-2023',
      filingChannels: ['国家医保服务平台APP', '全省事', '鹤岗医保微信公众号'],
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
