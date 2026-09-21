import type { CityInsuranceData } from '../types';

export const hefeiData: CityInsuranceData = {
  cityCode: '340100',
  cityName: '合肥市',
  provinceCode: '340000',
  provinceName: '安徽省',
  hotline: '0551-12393',
  officialPortalUrl: 'http://ybj.hefei.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [

    {
      docId: 'hf-employee-outpatient-2023-opt',
      title: '合肥市职工基本医疗保险门诊共济保障机制实施细则及优化待遇标准',
      docNumber: '合医保发〔2023〕18号',
      issuingDept: ['合肥市医疗保障局', '合肥市财政局'],
      publishDate: '2023-09-15',
      effectiveDate: '2023-10-01',
      status: 'active',
      officialUrl: 'http://ybj.hefei.gov.cn/zcfg/zcjd/18542019.html',
      summaryQuote: '在职职工门诊起付线基层200元、二级及三级400元；报销比例基层60%、二级及三级50%。退休人员报销比例各提高10个百分点（基层70%、二级及三级60%）。年度门诊最高支付限额在职职工4000元，退休人员5000元。'
    },
    {
      docId: 'hf-medical-insurance-inpatient-2024',
      title: '合肥市基本医疗保险待遇保障实施细则及2025年度标准公告',
      docNumber: '合医保发〔2024〕19号',
      issuingDept: ['合肥市医疗保障局', '合肥市财政局'],
      publishDate: '2024-11-28',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hefei.gov.cn/zcfg/gfxwj/18659124.html',
      summaryQuote: '职工住院起付线：一级200元、二级400元、三级600元；在职支付比例一级94%、二级92%、三级90%（退休人员分别为97%、96%、95%），基本医保统筹限额30万元。居民住院起付线：一级200元/90%、二级500元/85%、市属三级700元/80%、省属三级1000元/75%，基本医保限额30万元。大病保险起付线1.5万元，分段报销60%-85%，不设封顶线。'
    }
  ],

  // 城镇职工医保待遇 (合肥标准)
  employee: {
    outpatient: {
      sourceDocId: 'hf-employee-outpatient-2023-opt',
      annualDeductible: 400, // 门诊累计起付线最高 400 元 (基层200元，二三级400元)
      annualCap: 4000,       // 在职限额 4000 元
      annualCapRetiree: 5000, // 退休限额 5000 元
      tierBenefits: {
        community: { tierName: '基层社区及一级医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线基层200元、二级及以上400元。基层报销60%（退休70%），二级及以上报销50%（退休60%）。在职限额4000元，退休限额5000元。'
    },
    inpatient: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      annualCap: 300000, // 基本医保统筹限额 30 万元
      tierBenefits: {
        community: { tierName: '基层一级机构/社区中心', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier3: { tierName: '市级三级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '同自然年度内自第二次住院起，起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角一体化联网就医免备案，享受与参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (合肥标准)
  resident: {
    outpatient: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      annualCap: 200, // 基层普通门诊年度限额 200 元
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.55 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%-55%，每人每年年度支付限额200元。'
    },
    inpatient: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      annualCap: 300000, // 居民基本医保统筹限额 30 万元
      tierBenefits: {
        community: { tierName: '一级及以下医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级及县级医疗机构', deductible: 500, reimbursementRatio: 0.85 },
        tier3: { tierName: '市属三级定点医院', deductible: 700, reimbursementRatio: 0.80 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 1000, reimbursementRatio: 0.75 }
      }
    },
    catastrophic: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 15000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 200000, ratio: 0.75 },
        { minAmount: 200000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hf-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '长三角区域内门诊及住院直接结算享受对应报销比例。'
      ]
    }
  }
};
