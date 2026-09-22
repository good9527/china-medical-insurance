import type { CityInsuranceData } from '../types';

export const tonglingData: CityInsuranceData = {
  cityCode: '340700',
  cityName: '铜陵市',
  provinceCode: '340000',
  provinceName: '安徽省',
  hotline: '0562-12393',
  officialPortalUrl: 'http://ybj.tl.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'tl-employee-outpatient-2022',
      title: '铜陵市建立健全职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '铜医保发〔2022〕15号',
      issuingDept: ['铜陵市医疗保障局', '铜陵市财政局'],
      publishDate: '2022-06-28',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://ybj.tl.gov.cn/zcfg/zcjd/6841920.html',
      summaryQuote: '门诊统筹起付标准：一级及未定级医疗机构200元，二级及三级医疗机构400元。起付线以上支付比例：在职职工一级60%、二级及三级50%；退休人员一级70%、二级及三级60%。年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'tl-resident-employee-inpatient-2023',
      title: '铜陵市城乡居民与职工基本医疗保险住院保障细则及年度待遇标准通知',
      docNumber: '铜医保发〔2023〕18号',
      issuingDept: ['铜陵市医疗保障局', '铜陵市财政局'],
      publishDate: '2023-05-20',
      effectiveDate: '2023-06-01',
      status: 'active',
      officialUrl: 'http://ybj.tl.gov.cn/zcfg/gfxwj/6910245.html',
      summaryQuote: '居民基层普通门诊免起付线，报销60%，限额150元。居民住院起付线一级200元、二级500元、三级800元，支付比例对应85%、80%、70%，年度限额30万元。职工住院起付线一级200元、二级400元、三级600元，在职报销94%、92%、90%，退休提高3个百分点，职工医保限额30万元，大病救助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (铜陵标准)
  employee: {
    outpatient: {
      sourceDocId: 'tl-employee-outpatient-2022',
      annualDeductible: 400, // 门诊年度起付线 (基层200元，二三级400元)
      annualCap: 2000,       // 在职限额 2000 元
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '基层一级医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线一级200元、二级及三级400元。在职报销一级60%、二三级50%；退休人员一级70%、二三级60%。限额在职2000元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      annualCap: 300000, // 职工基本医保限额 30 万元
      tierBenefits: {
        community: { tierName: '一级机构及社区卫生服务中心', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      name: '职工大额互助医疗救助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序', '皖事通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角区域异地就医免备案直接结算，享受与铜陵本地同等医保待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (铜陵标准)
  resident: {
    outpatient: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      annualCap: 150, // 依据皖医保发〔2024〕9号，普通门诊统筹年度限额150元
      tierBenefits: {
        community: { tierName: '基层卫生院/社区服务中心', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '依据皖医保发〔2024〕9号，居民普通门诊统筹在基层及一级定点医疗机构免起付线报销60%，年度限额150元。二级及以上医疗机构未纳普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      annualCap: 300000, // 居民基本医保年度封顶 30 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tl-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '长三角区域就医视同备案直接联网结算。'
      ]
    }
  }
};
