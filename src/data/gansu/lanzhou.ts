import type { CityInsuranceData } from '../types';

export const lanzhouData: CityInsuranceData = {
  cityCode: '620100',
  cityName: '兰州市',
  provinceCode: '620000',
  provinceName: '甘肃省',
  hotline: '0931-12393',
  officialPortalUrl: 'http://ybj.lanzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [

    {
      docId: 'lz-employee-outpatient-2022-140',
      title: '兰州市职工基本医疗保险门诊共济保障实施细则',
      docNumber: '兰政办发〔2022〕140号',
      issuingDept: ['兰州市人民政府办公室', '兰州市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.lanzhou.gov.cn/art/2022/12/20/art_11221_1189912.html',
      summaryQuote: '门诊年度起付标准为200元，最高支付限额2500元。一级定点医疗机构在职报销65%、退休70%；二级定点医疗机构在职报销60%、退休65%；三级定点医疗机构在职报销55%、退休60%。'
    },
    {
      docId: 'lz-medical-insurance-inpatient-2025',
      title: '兰州市基本医疗保险住院与门诊统筹待遇保障管理办法',
      docNumber: '兰医保发〔2024〕36号',
      issuingDept: ['兰州市医疗保障局', '兰州市财政局'],
      publishDate: '2024-11-18',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.lanzhou.gov.cn/art/2024/11/20/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级甲等1000元、三级600元、二级400元、一级200元；在职支付比例三甲85%、三级86%、二级90%、一级92%（退休人员各提高3%）。居民住院起付线：三甲1400元、三级600元、二级400元、一级200元、社区100元；报销比例分别为65%、70%、80%、85%、90%。居民普通门诊乡镇卫生院及社区70%，免起付线，年度封顶130元。'
    }
  ],

  // 城镇职工医保待遇 (兰州标准)
  employee: {
    outpatient: {
      sourceDocId: 'lz-employee-outpatient-2022-140',
      annualDeductible: 200, // 在职与退休统一 200 元
      annualCap: 2500,       // 门诊统筹年度最高支付限额 2500 元
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '一级定点医疗机构/社区卫生服务中心', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级乙等定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹年度起付线200元，年度限额2500元，退休人员报销比例各提高5个百分点。'
    },
    inpatient: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      annualCap: 500000, // 基本医保统筹限额 50 万元
      tierBenefits: {
        community: { tierName: '社区服务中心/一级机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级乙等定点医疗机构', deductible: 600, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等定点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员在同级别医疗机构多次住院的，第二次及以上起付标准按相应标准递减。'
    },
    catastrophic: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范备案人员与参保地享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (兰州标准)
  resident: {
    outpatient: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      annualCap: 130, // 居民门诊统筹年度支付限额 130 元
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（门诊统筹未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '参保居民在乡镇卫生院、社区卫生服务中心普通门诊零起付线，报销70%，每人每年年度支付限额130元。'
    },
    inpatient: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      annualCap: 150000, // 居民住院年最高限额 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级乙等定点医疗机构', deductible: 600, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 1400, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      name: '城乡居民大病保险',
      deductible: 5000,
      tiers: [
        { minAmount: 5000, maxAmount: 10000, ratio: 0.60 },
        { minAmount: 10000, maxAmount: 20000, ratio: 0.65 },
        { minAmount: 20000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lz-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '按分级诊疗要求规范备案，直接结算享受相应比例。'
      ]
    }
  }
};
