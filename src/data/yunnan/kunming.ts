import type { CityInsuranceData } from '../types';

export const kunmingCityData: CityInsuranceData = {
  cityCode: '530100',
  cityName: '昆明市',
  provinceCode: '530000',
  provinceName: '云南省',
  hotline: '0871-12393',
  officialPortalUrl: 'http://ybj.km.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'km-employee-outpatient-2024-opt',
      title: '云南省职工基本医疗保险门诊共济保障实施办法及昆明市优化落实细则',
      docNumber: '云政办规〔2021〕1号及2024优化规程',
      issuingDept: ['云南省人民政府办公厅', '昆明市医疗保障局'],
      publishDate: '2024-10-25',
      effectiveDate: '2024-11-01',
      status: 'active',
      officialUrl: 'http://ybj.km.gov.cn/c/2024-10-28/6908123.shtml',
      summaryQuote: '门诊起付标准一级20元、二级40元、三级60元。在职职工统筹支付比例一级60%、二级55%、三级50%，退休人员各提高10个百分点（分别为70%、65%、60%）。门诊统筹年度最高支付限额统一为6000元。'
    },
    {
      docId: 'km-medical-insurance-inpatient-2024',
      title: '昆明市基本医疗保险住院与医疗救助待遇保障管理办法',
      docNumber: '昆医保发〔2024〕21号',
      issuingDept: ['昆明市医疗保障局', '昆明市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.km.gov.cn/c/2024-11-25/7109234.shtml',
      summaryQuote: '职工住院起付线：三级1200元、二级500元、一级200元；在职支付比例三级85%、二级88%、一级91%（退休人员分别为89%、92%、95%）。居民住院起付线：三级880元/60%、二级550元/75%、一级200元/85%，基本医保年度限额6万元。大病保险起付线1.2万元，分段报销60%-80%，封顶30万元。'
    }
  ],

  // 城镇职工医保待遇 (昆明标准)
  employee: {
    outpatient: {
      sourceDocId: 'km-employee-outpatient-2024-opt',
      annualDeductible: 60, // 门诊次均起付线
      annualCap: 6000,      // 门诊统筹年度最高限额 6000 元
      annualCapRetiree: 6000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 20, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 20, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 40, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 60, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 60, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊起付标准一级20元、二级40元、三级60元。在职报销50%-60%，退休人员提高10%（60%-70%），年度最高支付限额6000元。'
    },
    inpatient: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹 + 职工大病互助
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 200, reimbursementRatio: 0.91, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.91, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省级重点三甲医院', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '同自然年度内住院按次收取起付线。'
    },
    catastrophic: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '一部手机办事通APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范跨省及异地就医直接结算享受对应比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (昆明标准)
  resident: {
    outpatient: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      annualCap: 400, // 居民普通门诊年度限额 400 元
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲综合医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层医疗机构免起付线，报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      annualCap: 60000, // 居民基本统筹限额 6 万元
      tierBenefits: {
        community: { tierName: '一级医疗机构及社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 550, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 880, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 880, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'km-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '云南医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定办理转诊备案跨市就医人员，支付比例相应降低。'
      ]
    }
  }
};
