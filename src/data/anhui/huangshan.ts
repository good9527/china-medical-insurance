import type { CityInsuranceData } from '../types';

export const huangshanData: CityInsuranceData = {
  cityCode: '341000',
  cityName: '黄山市',
  provinceCode: '340000',
  provinceName: '安徽省',
  hotline: '0559-12393',
  officialPortalUrl: 'http://ybj.huangshan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hs-employee-outpatient-2022',
      title: '黄山市建立健全职工基本医疗保险门诊共济保障机制实施方案',
      docNumber: '黄医保发〔2022〕16号',
      issuingDept: ['黄山市医疗保障局', '黄山市财政局'],
      publishDate: '2022-06-22',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://ybj.huangshan.gov.cn/zcfg/zcjd/9128312.html',
      summaryQuote: '参保职工门诊统筹年度起付标准为一级及以下200元、二级及三级400元（基准政策按全省联动优化）。起付线以上支付比例：在职职工一级60%、二级55%、三级50%；退休人员支付比例分别提高5个百分点。年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'hs-resident-employee-inpatient-2023',
      title: '黄山市基本医疗保险住院待遇保障实施细则及2024年度保障标准通知',
      docNumber: '黄医保发〔2023〕12号',
      issuingDept: ['黄山市医疗保障局', '黄山市财政局'],
      publishDate: '2023-05-18',
      effectiveDate: '2023-06-01',
      status: 'active',
      officialUrl: 'http://ybj.huangshan.gov.cn/zcfg/gfxwj/9184201.html',
      summaryQuote: '居民基层门诊免起付线，报销50%，限额150元。居民住院起付线一级200元、二级500元、三级800元，支付比例对应85%、80%、70%，限额30万元。职工住院起付线一级200元、二级400元、三级600元，在职报销94%、92%、90%，退休提高3个百分点，职工医保限额30万元，大病救助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (黄山标准)
  employee: {
    outpatient: {
      sourceDocId: 'hs-employee-outpatient-2022',
      annualDeductible: 400, // 门诊年度起付线 (基层200元，二三级400元)
      annualCap: 2000,       // 在职限额 2000 元
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '基层一级医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线一级200元、二级及三级400元。在职报销一级60%、二级55%、三级50%；退休人员提高5个百分点。限额在职2000元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'hs-resident-employee-inpatient-2023',
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
      sourceDocId: 'hs-resident-employee-inpatient-2023',
      name: '职工大病医疗互助救助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hs-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序', '皖事通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角区域异地就医免备案直接结算，享受黄山本地同等医保报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (黄山标准)
  resident: {
    outpatient: {
      sourceDocId: 'hs-resident-employee-inpatient-2023',
      annualCap: 150, // 普通门诊统筹年度最高限额 150 元
      tierBenefits: {
        community: { tierName: '基层卫生院/社区服务中心', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '普通门诊统筹免起付线，基层报销50%，年度限额150元。'
    },
    inpatient: {
      sourceDocId: 'hs-resident-employee-inpatient-2023',
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
      sourceDocId: 'hs-resident-employee-inpatient-2023',
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
      sourceDocId: 'hs-resident-employee-inpatient-2023',
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
