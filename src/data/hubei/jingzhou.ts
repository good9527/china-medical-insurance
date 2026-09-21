import type { CityInsuranceData } from '../types';

/**
 * 荆州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：421000
 */
export const jingzhouCityData: CityInsuranceData = {
  cityCode: '421000',
  cityName: '荆州市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0716-12393 / 0716-8257869',
  officialPortalUrl: 'http://ybj.jingzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'jz-employee-outpatient-2022',
      title: '关于印发荆州市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '荆政办发〔2022〕38号',
      issuingDept: ['荆州市人民政府办公室', '荆州市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jingzhou.gov.cn/zwgk/zcfg/202212/t20221223_782910.html',
      summaryQuote: '荆政办发〔2022〕38号规定：职工医保普通门诊统筹年度起付标准在职职工500元、退休人员400元。统筹基金支付比例：一级医疗机构70%、二级医疗机构60%、三级医疗机构50%，退休人员在上述比例基础上提高5个百分点（一级75%、二级65%、三级55%）。普通门诊统筹年度最高支付限额在职职工2100元、退休人员2400元。'
    },
    {
      docId: 'jz-employee-inpatient-2023',
      title: '荆州市职工基本医疗保险实施细则及住院管理规程',
      docNumber: '荆政规〔2017〕4号及市医保局现行调整通知',
      issuingDept: ['荆州市人民政府', '荆州市医疗保障局'],
      publishDate: '2023-10-15',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jingzhou.gov.cn/zwgk/zcjd/202310/t20231020_812930.html',
      summaryQuote: '统筹区内住院起付标准：一级医疗机构300元、二级医疗机构800元、三级医疗机构1200元。在职职工政策范围内报销比例一级90%、二级85%、三级82%，退休人员相应增加3个百分点。居民医保住院起付标准：一级200元、二级500元、三级900元，支付比例一级85%、二级75%、三级60%。职工统筹基金年度最高支付限额16万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'jz-employee-outpatient-2022',
      annualDeductible: 500,
      annualCap: 2100,
      annualCapRetiree: 2400,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '荆州市职工门诊年起付线在职500元、退休400元；一级70%（退休75%）、二级60%（退休65%）、三级50%（退休55%）；在职最高限额2100元，退休最高限额2400元。'
    },
    inpatient: {
      sourceDocId: 'jz-employee-inpatient-2023',
      annualCap: 160000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 1200, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '按规定办理转诊或特定疾病多次住院，起付线享受减免政策。'
    },
    catastrophic: {
      sourceDocId: 'jz-employee-inpatient-2023',
      name: '荆州市职工大额医疗互助',
      deductible: 160000,
      annualCap: 350000,
      tiers: [
        { minAmount: 160000, maxAmount: 510000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jz-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '荆州医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按规定办理备案手续的，个人先自付10%后按同级标准支付；未按规定转诊个人先自付20%。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'jz-employee-inpatient-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗机构免起付线报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'jz-employee-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 900, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '按分级诊疗要求向下转诊免除下级医疗机构住院起付线。'
    },
    catastrophic: {
      sourceDocId: 'jz-employee-inpatient-2023',
      name: '荆州市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jz-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定备案或自行到市外医疗机构住院的，政策报销比例相应下浮。'
      ]
    }
  }
};
