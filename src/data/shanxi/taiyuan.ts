import type { CityInsuranceData } from '../types';

export const taiyuanCityData: CityInsuranceData = {
  cityCode: '140100',
  cityName: '太原市',
  provinceCode: '140000',
  provinceName: '山西省',
  hotline: '0351-12393',
  officialPortalUrl: 'http://ybj.taiyuan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'ty-employee-outpatient-2022-42',
      title: '太原市人民政府办公室关于印发太原市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '并政办发〔2022〕42号',
      issuingDept: ['太原市人民政府办公室', '太原市医疗保障局'],
      publishDate: '2022-12-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.taiyuan.gov.cn/zwgk/zcfg/202212/t20221215_2189034.shtml',
      summaryQuote: '在职职工门诊起付线一级30元、二级50元、三级80元；统筹支付比例一级60%（退休65%）、二级55%（退休60%）、三级50%（退休55%）。年度门诊统筹最高支付限额在职1800元，退休人员2000元。'
    },
    {
      docId: 'ty-medical-insurance-inpatient-2024',
      title: '太原市基本医疗保险住院与大额费用补助管理实施细则',
      docNumber: '并医保发〔2024〕26号',
      issuingDept: ['太原市医疗保障局', '太原市财政局'],
      publishDate: '2024-11-15',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.taiyuan.gov.cn/zwgk/zcfg/202411/t20241120_2391082.shtml',
      summaryQuote: '职工住院起付线：三类/一级300元、二类/二级500元、一类/三级800元；在职支付比例三级82%、二级86%、一级90%（退休人员分别为91%、93%、95%）。职工基本与大额救助合并最高支付限额60万元。居民住院起付线三级1000元/60%、二级500元/75%、一级200元/85%。大病保险起付线1万元，分段报销60%-75%，封顶40万元。'
    }
  ],

  // 城镇职工医保待遇 (太原标准)
  employee: {
    outpatient: {
      sourceDocId: 'ty-employee-outpatient-2022-42',
      annualDeductible: 80,
      deductibleType: 'per_visit', // 门诊次均起付线
      annualCap: 1800,      // 在职门诊限额 1800 元
      annualCapRetiree: 2000, // 退休门诊限额 2000 元
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 30, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 30, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 80, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 80, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊次均起付标准一级30元、二级50元、三级80元。在职报销50%-60%，退休人员报销55%-65%。在职限额1800元，退休限额2000元。'
    },
    inpatient: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      annualCap: 600000, // 基本统筹 + 职工大额补助
      tierBenefits: {
        community: { tierName: '三类医疗机构/一级', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二类医疗机构/二级', deductible: 500, reimbursementRatio: 0.86, retireeRatioBonus: 0.07 },
        tier3: { tierName: '一类医疗机构/三级', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.09 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.09 }
      },
      repeatedDeductibleRule: '同自然年度内第二次住院起付线减半，第三次及以上免收起付线。'
    },
    catastrophic: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 600000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省异地就医直接联网结算享受对应比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (太原标准)
  resident: {
    outpatient: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      annualCap: 200, // 居民普通门诊年度最高限额 200 元
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 1000, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 400000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ty-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
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
