import type { CityInsuranceData } from '../types';

export const changchunCityData: CityInsuranceData = {
  cityCode: '220100',
  cityName: '长春市',
  provinceCode: '220000',
  provinceName: '吉林省',
  hotline: '0431-12393',
  officialPortalUrl: 'http://ccyb.changchun.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'cc-employee-outpatient-2022-16',
      title: '关于建立健全职工基本医疗保险门诊共济保障机制的通知',
      docNumber: '长医保联〔2022〕16号',
      issuingDept: ['长春市医疗保障局', '长春市财政局'],
      publishDate: '2022-11-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ccyb.changchun.gov.cn/zcfg/202211/t20221125_3098124.html',
      summaryQuote: '门诊统筹次均起付标准一级100元、二级200元、三级300元。在职职工支付比例一级及以下60%、二级55%、三级50%（退休人员各提高2个百分点）。年度门诊统筹基金最高支付限额为2000元。'
    },
    {
      docId: 'cc-medical-insurance-inpatient-2024',
      title: '长春市基本医疗保险住院保障及大额救助实施办法',
      docNumber: '长医保发〔2024〕30号',
      issuingDept: ['长春市医疗保障局', '长春市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ccyb.changchun.gov.cn/zcfg/202411/t20241126_3290123.html',
      summaryQuote: '职工住院次均起付标准一级200元、二级400元、三级700元、省级三级1200元；在职支付比例分别为95%、92%、88%、85%（退休人员各加2%）。居民住院起付线一级200元/85%、二级400元/75%、市属三级800元/65%、省级三级1200元/55%。基本医保年度统筹限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (长春标准)
  employee: {
    outpatient: {
      sourceDocId: 'cc-employee-outpatient-2022-16',
      annualDeductible: 300, // 门诊基准起付线
      annualCap: 2000,       // 门诊统筹年度最高限额 2000 元
      annualCapRetiree: 2000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.02 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '省级三级医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.02 }
      },
      note: '门诊次均起付线一级100元、二级200元、三级300元。在职报销50%-60%，退休人员报销52%-62%，年度最高支付限额2000元。'
    },
    inpatient: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹15万 + 职工大额补助
      tierBenefits: {
        community: { tierName: '一级基层医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 700, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '省级三级重点综合医院', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付线累计达到年度上限后，不再扣减起付线。'
    },
    catastrophic: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '吉事办微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗要求规范备案结算，未备案自行就医按降幅执行。'
      ]
    }
  },

  // 城乡居民医保待遇 (长春标准)
  resident: {
    outpatient: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      annualCap: 1000, // 居民门诊统筹年度限额 1000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构及卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三级医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊一级机构免起付线、二级起付200元，报销50%，年度限额1000元。'
    },
    inpatient: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民统筹年度限额 15 万元
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省级三级重点医疗机构', deductible: 1200, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 350000,
      tiers: [
        { minAmount: 13000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '吉林医保公共服务小程序'],
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
