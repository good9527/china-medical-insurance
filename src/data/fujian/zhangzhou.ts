import type { CityInsuranceData } from '../types';

export const zhangzhouCityData: CityInsuranceData = {
  cityCode: '350600',
  cityName: '漳州市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0596-12393',
  officialPortalUrl: 'http://ybj.zhangzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'zz-employee-outpatient-2022',
      title: '漳州市人民政府办公室关于印发漳州市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '漳政办规〔2022〕6号',
      issuingDept: ['漳州市人民政府办公室', '漳州市医疗保障局'],
      publishDate: '2022-12-19',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.zhangzhou.gov.cn/cms/html/zzsylbzj/2022-12-22/1654891234.html',
      summaryQuote: '职工医保普通门诊统筹年度起付标准为600元。起付标准以上统筹基金支付比例：一级及以下定点医疗机构85%、二级定点医疗机构80%、三级定点医疗机构75%；退休人员相应提高5个百分点（一级90%、二级85%、三级80%）。普通门诊统筹年度最高支付限额在职及退休人员均为20000元。'
    },
    {
      docId: 'zz-medical-treatment-policy-2023',
      title: '漳州市医疗保障局关于进一步完善基本医疗保险待遇政策的通知',
      docNumber: '漳医保〔2023〕35号',
      issuingDept: ['漳州市医疗保障局', '漳州市财政局'],
      publishDate: '2023-11-15',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.zhangzhou.gov.cn/cms/html/zzsylbzj/2023-11-20/1789452310.html',
      summaryQuote: '居民医保普通门诊在基层公立机构报销75%，每次起付10元（基药免起付），年度封顶300元。城乡居民住院起付线基层100元、一级300元、二级500元、三级800元，报销比例90%、85%、75%、60%，统筹限额10万元。职工住院起付线基层200元、一级400元、二级600元、三级800元，在职报销95%、92%、88%、85%，退休提高3个百分点，职工医保统筹加大额互助限额50万元。'
    }
  ],

  // 城镇职工医保待遇 (漳州标准)
  employee: {
    outpatient: {
      sourceDocId: 'zz-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 20000,
      annualCapRetiree: 20000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属重点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊年度起付线600元。在职报销75%~85%，退休人员各段提高5个百分点（80%~90%），年度封顶2万元。'
    },
    inpatient: {
      sourceDocId: 'zz-medical-treatment-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减200元，最低降至0元。'
    },
    catastrophic: {
      sourceDocId: 'zz-medical-treatment-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zz-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地就医备案享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (漳州标准)
  resident: {
    outpatient: {
      sourceDocId: 'zz-medical-treatment-policy-2023',
      annualCap: 300,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 10, reimbursementRatio: 0.75 },
        tier1: { tierName: '一级定点医疗机构', deductible: 10, reimbursementRatio: 0.75 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '依据漳政综规〔2022〕10号，城乡居民普通门诊在基层公立机构报销75%，每次起付10元（基本药物免起付），单次封顶50元，年度限额300元。二级及以上机构未纳普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'zz-medical-treatment-policy-2023',
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
      sourceDocId: 'zz-medical-treatment-policy-2023',
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
      sourceDocId: 'zz-medical-treatment-policy-2023',
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
