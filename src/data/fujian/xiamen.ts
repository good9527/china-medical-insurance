import type { CityInsuranceData } from '../types';

export const xiamenCityData: CityInsuranceData = {
  cityCode: '350200',
  cityName: '厦门市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0592-12333/12393',
  officialPortalUrl: 'http://ybj.xm.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'xm-employee-insurance-2022-12',
      title: '厦门市人民政府关于印发厦门市职工医疗保险实施细则的通知',
      docNumber: '厦府规〔2022〕12号',
      issuingDept: ['厦门市人民政府', '厦门市医疗保障局'],
      publishDate: '2022-11-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://www.xm.gov.cn/zwgk/flfg/sfgz/202212/t20221201_2704512.htm',
      summaryQuote: '在职职工门诊起付标准1200元，退休人员800元（使用国家基本药物免起付线）。门诊统筹报销比例：一级及以下在职90%（退休95%），二级在职85%（退休90%），三级在职75%（退休85%）。职工住院起付标准在职1000元，退休500元，报销比例在职90%，退休95%。统筹基金年度累计最高支付限额10万元（门诊住院合并计算），大病保险最高支付限额110万元。'
    },
    {
      docId: 'xm-resident-insurance-2024',
      title: '厦门市城乡居民医疗保险实施细则及2025年度待遇简明表',
      docNumber: '厦医保〔2024〕38号',
      issuingDept: ['厦门市医疗保障局', '厦门市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xm.gov.cn/zwgk/zcjd/202411/t20241125_2891234.htm',
      summaryQuote: '城乡居民在基层公立定点医疗机构门诊使用国家基本药物不设起付线，报销55%-60%。住院起付线：三级1000元、二级400元、一级100元；报销比例三级70%、二级80%、一级90%。统筹基金年度最高支付限额10万元。'
    }
  ],

  // 城镇职工医保待遇 (厦门标准)
  employee: {
    outpatient: {
      sourceDocId: 'xm-employee-insurance-2022-12',
      annualDeductible: 1200, // 在职门诊起付线 1200 元（退休800元）
      annualDeductibleRetiree: 800, // 退休人员门诊起付线 800 元
      annualCap: 100000,      // 门诊与住院合并统筹限额 10 万元
      annualCapRetiree: 100000,
      tierBenefits: {
        community: { tierName: '基层公立定点医疗机构', deductible: 1200, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 1200, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三级重点综合医院', deductible: 1200, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 }
      },
      note: '门诊起付标准在职1200元、退休800元。基层报销在职90%（退休95%），二级报销在职85%（退休90%），三级报销在职75%（退休85%）。门诊住院合并年封顶10万元。'
    },
    inpatient: {
      sourceDocId: 'xm-employee-insurance-2022-12',
      annualCap: 100000, // 基本医保统筹限额 10 万元
      tierBenefits: {
        community: { tierName: '基层医疗机构', deductible: 1000, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 1000, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1000, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级重点综合医院', deductible: 1000, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '首次住院在职1000元/退休500元，第二次及以上住院起付线减半（在职500元/退休250元）。'
    },
    catastrophic: {
      sourceDocId: 'xm-employee-insurance-2022-12',
      name: '职工大病保险',
      deductible: 0,
      annualCap: 1100000, // 职工大病最高限额 110 万元
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xm-employee-insurance-2022-12',
      filingChannels: ['国家医保服务平台APP', '闽政通APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，规范备案人员与本地享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (厦门标准)
  resident: {
    outpatient: {
      sourceDocId: 'xm-resident-insurance-2024',
      annualCap: 600, // 基层普通门诊年度限额 600 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构使用基本药物不设起付线，报销60%，年度限额600元。'
    },
    inpatient: {
      sourceDocId: 'xm-resident-insurance-2024',
      annualCap: 100000, // 居民统筹年度限额 10 万元
      tierBenefits: {
        community: { tierName: '基层医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 1000, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'xm-resident-insurance-2024',
      name: '城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xm-resident-insurance-2024',
      filingChannels: ['国家医保服务平台APP', '闽政通APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定办理转诊手续或备案的外出就医人员，支付比例相应降低。'
      ]
    }
  }
};
