import type { CityInsuranceData } from '../types';

export const dalianCityData: CityInsuranceData = {
  cityCode: '210200',
  cityName: '大连市',
  provinceCode: '210000',
  provinceName: '辽宁省',
  hotline: '0411-83709222/12393',
  officialPortalUrl: 'http://ybj.dl.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'dl-employee-outpatient-2022-23',
      title: '大连市人民政府办公室关于印发大连市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '大政办发〔2022〕23号及2024优化调整规程',
      issuingDept: ['大连市人民政府办公室', '大连市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.dl.gov.cn/art/2023/12/26/art_1421_2190812.html',
      summaryQuote: '在职职工门诊起付线二级200元、三级400元、特殊三级600元。报销比例一级70%、二级65%、三级55%（退休人员各加5%）。门诊统筹年度最高支付限额1.2万元。'
    },
    {
      docId: 'dl-medical-insurance-inpatient-2025',
      title: '大连市基本医疗保险住院与医疗救助待遇规程',
      docNumber: '大医保发〔2024〕29号',
      issuingDept: ['大连市医疗保障局', '大连市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.dl.gov.cn/art/2024/11/25/art_1421_2345109.html',
      summaryQuote: '职工住院起付线：三级甲等1000元、三级600元、二级300元、一级200元；在职支付比例分别为85%、88%、92%、94%（退休人员各提高3%）。居民住院起付线三级甲等1200元/60%、三级800元/65%、二级400元/75%、一级200元/85%。基本统筹年度限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (大连标准)
  employee: {
    outpatient: {
      sourceDocId: 'dl-employee-outpatient-2022-23',
      annualDeductible: 400, // 门诊年度基准起付线
      annualCap: 12000,      // 门诊统筹年度最高限额 12000 元
      annualCapRetiree: 12000,
      tierBenefits: {
        community: { tierName: '基层社区及一级医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '特殊三级重点医疗机构', deductible: 600, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线二级200元、三级400元、特殊三级600元。报销比例55%-70%，退休人员加5%，年度限额12000元。'
    },
    inpatient: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      annualCap: 500000, // 基本统筹15万 + 大额补充医疗
      tierBenefits: {
        community: { tierName: '基层一级医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等重点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线享受梯度减免。'
    },
    catastrophic: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '大连医保微信服务号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，符合转诊要求人员与本地享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (大连标准)
  resident: {
    outpatient: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      annualCap: 400, // 基层普通门诊年度限额 400 元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%-60%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      annualCap: 150000, // 居民统筹年度限额 15 万元
      tierBenefits: {
        community: { tierName: '基层社区服务中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三级甲等重点医疗机构', deductible: 1200, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      name: '城乡居民大病保险',
      deductible: 16000,
      annualCap: 400000,
      tiers: [
        { minAmount: 16000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'dl-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '大连医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '按规定备案结算，未备案自行就医按对应降幅报销。'
      ]
    }
  }
};
