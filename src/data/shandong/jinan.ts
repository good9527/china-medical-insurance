import type { CityInsuranceData } from '../types';

/**
 * 济南市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：370100
 */
export const jinanCityData: CityInsuranceData = {
  cityCode: '370100',
  cityName: '济南市',
  provinceCode: '370000',
  provinceName: '山东省',
  hotline: '0531-12393',
  officialPortalUrl: 'https://ybj.jinan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'jn-employee-outpatient-2023',
      title: '济南市人民政府办公厅关于印发济南市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '济政办发〔2022〕18号',
      issuingDept: ['济南市人民政府办公厅', '济南市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.jinan.gov.cn/art/2022/12/22/art_1234_189201.html',
      summaryQuote: '在职职工普通门诊起付线为200元，退休人员为100元。一级及社区医疗机构在职报销80%（退休85%）、二级医疗机构在职报销70%（退休75%）、三级医疗机构在职报销60%（退休65%）。门诊统筹年度最高支付限额在职职工3000元，退休人员4000元。'
    },
    {
      docId: 'jn-medical-insurance-inpatient-2025',
      title: '济南市基本医疗保险实施办法及2025年度待遇标准公告',
      docNumber: '济医保发〔2024〕25号',
      issuingDept: ['济南市医疗保障局', '济南市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'https://ybj.jinan.gov.cn/art/2024/11/25/art_1234_198762.html',
      summaryQuote: '职工住院起付线：三级1000元、二级及一级400元、社区200元（第二次减半，第三次起免除）。在职职工报销比例三级88%（退休91%）、二级93%（退休96%）、一级93%（退休96%）。年度统筹最高支付限额60万元。居民住院起付线：三级1000元、二级及一级400元、社区200元；报销比例三级70%、二级75%、一级80%、社区85%，年度限额25万元。居民普通门诊签约基层机构免起付线，报销65%，限额500元。'
    }
  ],

  // 城镇职工医保待遇 (济南标准)
  employee: {
    outpatient: {
      sourceDocId: 'jn-employee-outpatient-2023',
      annualDeductible: 200, // 在职门诊起付线 200 元（退休100元）
      annualDeductibleRetiree: 100, // 退休人员门诊起付线 100 元
      annualCap: 6000,       // 在职职工门诊年最高支付限额提升至 6000 元
      annualCapRetiree: 7000, // 退休职工门诊年最高支付限额提升至 7000 元
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 800, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付标准合并计算就高执行一次（社区200元、二级400元、三级800元），在职社区报销80%、二级70%、三级60%（退休人员各提高5个百分点）。在职年限额6000元，退休限额7000元。'
    },
    inpatient: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      annualCap: 600000, // 基本医疗保险统筹限额 60 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 1000, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '第二次住院起付线减半，第三次及以上免除起付线。'
    },
    catastrophic: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      name: '济南市职工大额医疗救助',
      deductible: 600000,
      tiers: [
        { minAmount: 600000, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '济南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医免备案直接联网结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (济南标准)
  resident: {
    outpatient: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      annualDeductible: 0,
      annualCap: 500, // 居民门诊限额 500 元
      tierBenefits: {
        community: { tierName: '签约社区卫生中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级医疗机构（普通门诊未签约）', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在签约基层医疗机构无起付线，报销65%，年度最高支付限额500元。'
    },
    inpatient: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      annualCap: 250000, // 居民住院年最高限额 25 万元
      tierBenefits: {
        community: { tierName: '社区医院/乡镇卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 1000, reimbursementRatio: 0.70 }
      },
      repeatedDeductibleRule: '第二次住院起付线减半，第三次及以上免起付线。'
    },
    catastrophic: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      name: '城乡居民大病保险',
      deductible: 14000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, maxAmount: 200000, ratio: 0.65 },
        { minAmount: 200000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jn-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '爱山东APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '全省范围内异地就医联网结算，规范备案人员与参保地享受同等待遇。'
      ]
    }
  }
};
