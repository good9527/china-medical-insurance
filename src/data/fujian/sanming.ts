import type { CityInsuranceData } from '../types';

export const sanmingCityData: CityInsuranceData = {
  cityCode: '350400',
  cityName: '三明市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0598-12393',
  officialPortalUrl: 'http://ybj.sm.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'sm-employee-outpatient-2022',
      title: '三明市人民政府办公室关于健全职工基本医疗保险门诊共济保障机制的实施细则',
      docNumber: '明政办字〔2022〕35号',
      issuingDept: ['三明市人民政府办公室', '三明市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.sm.gov.cn/xxgk/zfxxgkzl/zfxxgkml/zcfg/202212/t20221218_1859871.htm',
      summaryQuote: '职工医保门诊统筹年度起付标准为600元。起付标准以上统筹基金支付比例：基层定点医疗机构85%、二级定点医疗机构80%、三级定点医疗机构75%；退休人员支付比例分别提高5个百分点（一级及基层90%、二级85%、三级80%）。普通门诊统筹年度最高支付限额在职及退休职工均为25000元。'
    },
    {
      docId: 'sm-medical-reform-policy-2023',
      title: '三明市医疗保障局关于进一步深化医疗保障待遇保障制度改革的通知',
      docNumber: '明医保〔2023〕26号',
      issuingDept: ['三明市医疗保障局', '三明市财政局'],
      publishDate: '2023-11-25',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.sm.gov.cn/xxgk/zfxxgkzl/zfxxgkml/zcfg/202311/t20231130_1965823.htm',
      summaryQuote: '居民医保普通门诊在基层医疗卫生机构免起付线，报销50%，年度限额400元。城乡居民住院起付线基层100元、一级300元、二级500元、三级800元，政策范围内报销比例对应90%、85%、75%、60%，统筹年度限额10万元。职工住院起付线基层200元、一级400元、二级600元、三级800元，在职报销95%、92%、88%、85%，退休提高3个百分点，统筹加大额互助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (三明标准)
  employee: {
    outpatient: {
      sourceDocId: 'sm-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 25000,
      annualCapRetiree: 25000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属重点医院', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊年度起付线600元。在职报销75%~85%，退休人员各段提高5个百分点（80%~90%），年度封顶2.5万元。'
    },
    inpatient: {
      sourceDocId: 'sm-medical-reform-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属重点定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减200元，最低降至0元。'
    },
    catastrophic: {
      sourceDocId: 'sm-medical-reform-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sm-medical-reform-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '三明医改深化异地就医直接联网结算，长期异地人员待遇与本地同等。'
      ]
    }
  },

  // 城乡居民医保待遇 (三明标准)
  resident: {
    outpatient: {
      sourceDocId: 'sm-medical-reform-policy-2023',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属重点医疗机构', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹在基层及一级医疗机构免起付线，政策范围内报销60%，次均封顶40元/日人，年度限额200元（二级及以上未纳普通门诊统筹）。'
    },
    inpatient: {
      sourceDocId: 'sm-medical-reform-policy-2023',
      annualCap: 100000,
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级甲等医院', deductible: 1000, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'sm-medical-reform-policy-2023',
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
      sourceDocId: 'sm-medical-reform-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
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
