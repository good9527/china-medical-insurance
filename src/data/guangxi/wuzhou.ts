import type { CityInsuranceData } from '../types';

export const wuzhouCityData: CityInsuranceData = {
  cityCode: '450400',
  cityName: '梧州市',
  provinceCode: '450000',
  provinceName: '广西壮族自治区',
  hotline: '0774-12393',
  officialPortalUrl: 'http://ybj.wuzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'wz-employee-outpatient-2022',
      title: '梧州市人民政府关于印发梧州市职工基本医疗保险门诊共济保障实施办法的通知',
      docNumber: '梧政规〔2022〕11号',
      issuingDept: ['梧州市人民政府', '梧州市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.wuzhou.gov.cn/zwgk/zcfg/202212/t20221219_2193845.html',
      summaryQuote: '职工门诊统筹起付标准一级100元、二级200元、三级300元。统筹支付比例一级及以下60%（退休65%）、二级55%（退休60%）、三级50%（退休55%）。门诊统筹年度最高支付限额在职职工1800元，退休人员2400元。'
    },
    {
      docId: 'wz-medical-treatment-policy-2023',
      title: '梧州市医疗保障局关于进一步完善基本医疗保险待遇政策的通知',
      docNumber: '梧医保发〔2023〕15号',
      issuingDept: ['梧州市医疗保障局', '梧州市财政局'],
      publishDate: '2023-11-25',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.wuzhou.gov.cn/zwgk/zcfg/202311/t20231130_2314582.html',
      summaryQuote: '城乡居民普通门诊统筹在基层定点机构免起付线，报销比例60%，年度限额200元。城乡居民住院起付线一级100元、二级300元、三级600元，政策范围内报销比例对应90%、75%、60%，统筹年度限额15万元。职工住院起付线一级200元、二级400元、三级800元，在职报销92%、90%、85%，退休提高3个百分点，统筹加大额补助限额50万元。'
    }
  ],

  // 城镇职工医保待遇 (梧州标准)
  employee: {
    outpatient: {
      sourceDocId: 'wz-employee-outpatient-2022',
      annualDeductible: 300,
      annualCap: 1800,
      annualCapRetiree: 2400,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '自治区级重点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊起付线一级100元、二级200元、三级300元。在职报销50%~60%，退休人员各段提高5个百分点，在职封顶1800元，退休2400元。'
    },
    inpatient: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '自治区级三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至100元。'
    },
    catastrophic: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      name: '职工大额医疗费用救助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '广西医保微信公众号', '智桂通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (梧州标准)
  resident: {
    outpatient: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 0, reimbursementRatio: 0 }
      },
      note: '居民门诊统筹仅在基层机构免起付享受，报销60%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '自治区级重点定点医院', deductible: 800, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '广西医保微信公众号', '智桂通'],
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
