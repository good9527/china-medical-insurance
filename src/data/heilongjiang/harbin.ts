import type { CityInsuranceData } from '../types';

export const harbinCityData: CityInsuranceData = {
  cityCode: '230100',
  cityName: '哈尔滨市',
  provinceCode: '230000',
  provinceName: '黑龙江省',
  hotline: '0451-12393',
  officialPortalUrl: 'http://ybj.harbin.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hrb-employee-outpatient-2022-9',
      title: '哈尔滨市人民政府办公室关于印发哈尔滨市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '哈政办规〔2022〕9号',
      issuingDept: ['哈尔滨市人民政府办公室', '哈尔滨市医疗保障局'],
      publishDate: '2022-11-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.harbin.gov.cn/art/2022/11/20/art_11982_1294812.html',
      summaryQuote: '门诊统筹年度起付标准为400元。一级及以下机构在职报销70%（退休75%），二级机构在职报销60%（退休65%），三级机构在职报销50%（退休55%）。年度统筹基金最高支付限额在职职工提高至6000元、退休人员提高至7000元。'
    },
    {
      docId: 'hrb-medical-insurance-inpatient-2024',
      title: '哈尔滨市基本医疗保险住院与医疗救助待遇管理办法',
      docNumber: '哈医保规〔2024〕12号',
      issuingDept: ['哈尔滨市医疗保障局', '哈尔滨市财政局'],
      publishDate: '2024-11-26',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.harbin.gov.cn/art/2024/11/30/art_11982_1389021.html',
      summaryQuote: '职工住院起付线：三级720元、二级480元、一级240元；在职支付比例三级90%、二级93%、一级95%（退休人员各提高2-3%）。居民住院起付线三级720元/60%、二级480元/70%、一级240元/80%、社区200元/85%。基本医保年度统筹限额15万元。大病保险起付线1.2万元，分段报销60%-75%，封顶35万元。'
    }
  ],

  // 城镇职工医保待遇 (哈尔滨标准)
  employee: {
    outpatient: {
      sourceDocId: 'hrb-employee-outpatient-2022-9',
      annualDeductible: 400, // 门诊年度起付线 400 元
      annualCap: 6000,       // 门诊统筹年度最高限额 6000 元 (在职)
      annualCapRetiree: 7000, // 退休人员年度限额 7000 元
      tierBenefits: {
        community: { tierName: '一级及基层定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线400元。一级报销70%（退休75%），二级报销60%（退休65%），三级报销50%（退休55%）。年度限额在职6000元、退休7000元。'
    },
    inpatient: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹15万 + 职工大病互助
      tierBenefits: {
        community: { tierName: '一级基层医疗机构', deductible: 240, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 240, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 480, reimbursementRatio: 0.93, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 720, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省级三甲重点综合医院', deductible: 720, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线享受减免递减规程。'
    },
    catastrophic: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      name: '职工大额医疗救助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '龙江医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按规定规范备案跨省及异地就医直接结算享受对应待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (哈尔滨标准)
  resident: {
    outpatient: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      annualCap: 300, // 基层普通门诊年度限额 300 元
      tierBenefits: {
        community: { tierName: '社区卫生服务中心及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%-60%，年度限额300元。'
    },
    inpatient: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民统筹年度限额 15 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务中心及卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 240, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级定点医疗机构', deductible: 480, reimbursementRatio: 0.70 },
        tier3: { tierName: '市属三级医疗机构', deductible: 720, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省级三甲重点综合医院', deductible: 720, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hrb-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '龙江医保微信小程序'],
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
