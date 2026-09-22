import type { CityInsuranceData } from '../types';

export const ningdeCityData: CityInsuranceData = {
  cityCode: '350900',
  cityName: '宁德市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0593-12393',
  officialPortalUrl: 'http://ybj.ningde.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'nd-employee-outpatient-2022',
      title: '宁德市人民政府办公室关于印发宁德市职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '宁政办规〔2022〕6号',
      issuingDept: ['宁德市人民政府办公室', '宁德市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.ningde.gov.cn/zwgk/zfxxgk/zfxxgkml/zcfg/202212/t20221221_1728394.htm',
      summaryQuote: '职工门诊统筹年度起付标准调整为600元。起付标准以上统筹基金支付比例：一级及以下定点医疗机构85%、二级定点医疗机构80%、三级定点医疗机构75%；退休人员支付比例分别提高5个百分点（一级90%、二级85%、三级80%）。普通门诊统筹年度最高支付限额在职及退休人员均为20000元。'
    },
    {
      docId: 'nd-medical-treatment-policy-2023',
      title: '宁德市医疗保障局关于进一步健全基本医疗保险待遇保障机制的通知',
      docNumber: '宁医保规〔2023〕15号',
      issuingDept: ['宁德市医疗保障局', '宁德市财政局'],
      publishDate: '2023-11-26',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.ningde.gov.cn/zwgk/zfxxgk/zfxxgkml/zcfg/202312/t20231201_1837482.htm',
      summaryQuote: '城乡居民普通门诊免起付线，在基层定点医疗卫生机构报销50%，年度限额400元。城乡居民住院起付线基层100元、一级300元、二级500元、三级800元，政策范围内报销比例对应90%、85%、75%、60%，统筹年度限额10万元。职工住院起付线基层200元、一级400元、二级600元、三级800元，在职报销95%、92%、88%、85%，退休提高3个百分点，职工医保统筹加大额互助限额50万元。'
    }
  ],

  // 城镇职工医保待遇 (宁德标准)
  employee: {
    outpatient: {
      sourceDocId: 'nd-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 20000,
      annualCapRetiree: 20000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊年度起付线600元。在职报销75%~85%，退休人员各段提高5个百分点（80%~90%），年度封顶2万元。'
    },
    inpatient: {
      sourceDocId: 'nd-medical-treatment-policy-2023',
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
      sourceDocId: 'nd-medical-treatment-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nd-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (宁德标准)
  resident: {
    outpatient: {
      sourceDocId: 'nd-medical-treatment-policy-2023',
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹在基层及一级机构免起付线，报销50%，年度限额400元（二级及以上定点机构未纳普通门诊统筹）。'
    },
    inpatient: {
      sourceDocId: 'nd-medical-treatment-policy-2023',
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
      sourceDocId: 'nd-medical-treatment-policy-2023',
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
      sourceDocId: 'nd-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '未按规定转诊自行跨省就医的，医保报销比例降低20个百分点。'
      ]
    }
  }
};
