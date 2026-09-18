import type { CityInsuranceData } from '../types';

export const guiyangCityData: CityInsuranceData = {
  cityCode: '520100',
  cityName: '贵阳市',
  provinceCode: '520000',
  provinceName: '贵州省',
  hotline: '0851-12393',
  officialPortalUrl: 'http://ybj.guiyang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'gy-employee-outpatient-2022-28',
      title: '贵阳贵安建立健全职工基本医疗保险门诊共济保障机制实施方案',
      docNumber: '筑府办发〔2022〕28号',
      issuingDept: ['贵阳市人民政府办公厅', '贵阳市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.guiyang.gov.cn/zwgk/zcfg/202212/t20221220_7761023.html',
      summaryQuote: '门诊年度起付标准为150元。在职职工统筹支付比例一级及以下75%、二级70%、三级65%（退休人员各提高5个百分点）。门诊统筹年度最高支付限额统一为2000元。'
    },
    {
      docId: 'gy-medical-insurance-inpatient-2024',
      title: '贵阳市基本医疗保险住院保障及统筹支付管理细则',
      docNumber: '筑医保发〔2024〕18号',
      issuingDept: ['贵阳市医疗保障局', '贵阳市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.guiyang.gov.cn/zwgk/zcfg/202411/t20241126_7910234.html',
      summaryQuote: '职工住院起付线：省级高水平三级1500元、主要三级950元、二级700元、一级300元；在职支付比例分别为84%、89%、94%、95%（退休人员分别为92%、94.5%、97%、97.5%）。居民住院起付线省级三甲1400元/60%、市属三级800元/60%、二级400元/75%、一级100元/85%。基本医保统筹限额25万元。'
    }
  ],

  // 城镇职工医保待遇 (贵阳标准)
  employee: {
    outpatient: {
      sourceDocId: 'gy-employee-outpatient-2022-28',
      annualDeductible: 150, // 门诊年度起付线 150 元
      annualCap: 2000,       // 门诊统筹年度最高限额 2000 元
      annualCapRetiree: 2000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 150, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 150, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '主要三级定点医疗机构', deductible: 150, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级高水平三级医院', deductible: 150, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线150元。一级报销75%（退休80%），二级报销70%（退休75%），三级报销65%（退休70%）。年度统筹最高支付限额2000元。'
    },
    inpatient: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹15万 + 职工大额互助
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.025 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.025 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier3: { tierName: '主要三级定点医疗机构', deductible: 950, reimbursementRatio: 0.89, retireeRatioBonus: 0.055 },
        tier3_top: { tierName: '省级高水平三甲医院', deductible: 1500, reimbursementRatio: 0.84, retireeRatioBonus: 0.08 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付线减半。'
    },
    catastrophic: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '贵州医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗要求规范备案结算，未备案自行就医按降幅执行。'
      ]
    }
  },

  // 城乡居民医保待遇 (贵阳标准)
  resident: {
    outpatient: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      annualCap: 300, // 居民普通门诊年度限额 300 元
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级高水平医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度限额300元。'
    },
    inpatient: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      annualCap: 250000, // 居民统筹年度限额 25 万元
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省级高水平三甲重点医院', deductible: 1400, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 200000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'gy-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '贵州医保小程序'],
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
