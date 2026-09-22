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
      docId: 'qz-employee-outpatient-2024',
      title: '泉州市医疗保障局关于建立职工医保门诊医疗费用综合保障制度的通知',
      docNumber: '泉医保规〔2024〕5号',
      issuingDept: ['泉州市医疗保障局', '泉州市财政局'],
      publishDate: '2024-03-25',
      effectiveDate: '2024-04-01',
      status: 'active',
      officialUrl: 'http://ybj.quanzhou.gov.cn/',
      summaryQuote: '泉医保规〔2024〕5号规定自2024年4月1日起施行：全面实行职工门诊按费用保障，取消原特殊病种限制。门诊统筹起付标准为：三级医疗机构700元、二级医疗机构300元、一级及基层医疗机构50元（基层公立机构使用国家基本药物免起付线）。在职统筹支付比例：一级90%、二级85%、三级80%（退休人员提高5个百分点）。门诊与住院合并计算统筹基金年度最高支付限额40万元（基本统筹15万+大额补助25万）。'
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
      sourceDocId: 'qz-employee-outpatient-2024',
      annualDeductible: 300,
      annualCap: 400000,
      annualCapRetiree: 400000,
      tierBenefits: {
        community: { tierName: '基层公立定点医疗机构', deductible: 50, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 700, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊起付线按机构分级：三级700元、二级300元、一级及基层50元（基层使用基药免起付）。在职报销80%~90%，退休提高5个百分点（85%~95%），门诊住院合并限额40万元。'
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
