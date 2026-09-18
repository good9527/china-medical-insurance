import type { CityInsuranceData } from '../types';

export const quanzhouCityData: CityInsuranceData = {
  cityCode: '350500',
  cityName: '泉州市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0595-12393',
  officialPortalUrl: 'http://ybj.quanzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'qz-employee-outpatient-2022',
      title: '泉州市人民政府办公室关于印发泉州市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '泉政办〔2022〕28号',
      issuingDept: ['泉州市人民政府办公室', '泉州市医疗保障局'],
      publishDate: '2022-12-16',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.quanzhou.gov.cn/zwgk/zfxxgk/zfxxgkml/zcfg/202212/t20221220_2809124.htm',
      summaryQuote: '职工门诊统筹年度起付标准调整为600元。起付线以上统筹基金支付比例：一级及以下定点医疗机构85%、二级定点医疗机构80%、三级定点医疗机构75%；退休人员支付比例分别相应提高5个百分点（一级90%、二级85%、三级80%）。普通门诊统筹年度最高支付限额在职职工及退休人员均为25000元。'
    },
    {
      docId: 'qz-medical-treatment-policy-2023',
      title: '泉州市医疗保障局关于调整完善基本医疗保险有关政策的通知',
      docNumber: '泉医保规〔2023〕12号',
      issuingDept: ['泉州市医疗保障局', '泉州市财政局'],
      publishDate: '2023-11-28',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.quanzhou.gov.cn/zwgk/zfxxgk/zfxxgkml/zcfg/202312/t20231205_2958172.htm',
      summaryQuote: '城乡居民普通门诊免起付线，在基层定点机构报销50%，年度封顶500元。城乡居民住院起付线基层150元、一级300元、二级600元、三级1000元，政策范围内报销比例对应90%、85%、75%、60%，基本统筹年度封顶10万元。职工住院起付线基层300元、一级500元、二级700元、三级1000元，在职报销95%、93%、88%、85%，退休提高3个百分点，职工医保统筹加大额补助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (泉州标准)
  employee: {
    outpatient: {
      sourceDocId: 'qz-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 25000,
      annualCapRetiree: 25000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊年度起付线600元。在职报销75%~85%，退休人员各级提高5个百分点（80%~90%），年度封顶2.5万元。'
    },
    inpatient: {
      sourceDocId: 'qz-medical-treatment-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三甲重点医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减200元，最低降至0元。'
    },
    catastrophic: {
      sourceDocId: 'qz-medical-treatment-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省直接联网结算，长期备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (泉州标准)
  resident: {
    outpatient: {
      sourceDocId: 'qz-medical-treatment-policy-2023',
      annualCap: 500,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.40 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.35 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.35 }
      },
      note: '居民医保普通门诊在基层免起付线，报销50%，年度限额500元。'
    },
    inpatient: {
      sourceDocId: 'qz-medical-treatment-policy-2023',
      annualCap: 100000,
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 150, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级甲等医院', deductible: 1200, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'qz-medical-treatment-policy-2023',
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
      sourceDocId: 'qz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '未按规定转诊备案自行跨省就医的，医保报销比例降低20个百分点。'
      ]
    }
  }
};
