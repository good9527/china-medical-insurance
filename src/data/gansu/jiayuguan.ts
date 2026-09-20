import type { CityInsuranceData } from '../types';

export const jiayuguanData: CityInsuranceData = {
  cityCode: '620200',
  cityName: '嘉峪关市',
  provinceCode: '620000',
  provinceName: '甘肃省',
  hotline: '0937-12393',
  officialPortalUrl: 'http://ybj.jyg.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'jyg-employee-outpatient-2022',
      title: '嘉峪关市职工基本医疗保险门诊共济保障实施细则',
      docNumber: '嘉政办发〔2022〕58号',
      issuingDept: ['嘉峪关市人民政府办公室', '嘉峪关市医疗保障局'],
      publishDate: '2022-07-22',
      effectiveDate: '2022-08-01',
      status: 'active',
      officialUrl: 'http://ybj.jyg.gov.cn/art/2022/07/28/art_11221_1189912.html',
      summaryQuote: '门诊年度起付标准为200元，统筹基金最高支付限额2500元。一级定点医疗机构在职报销65%、退休70%；二级定点医疗机构在职报销60%、退休65%；三级定点医疗机构在职报销55%、退休60%。'
    },
    {
      docId: 'jyg-medical-insurance-inpatient-2024',
      title: '嘉峪关市基本医疗保险综合保障政策管理办法',
      docNumber: '嘉医保发〔2024〕30号',
      issuingDept: ['嘉峪关市医疗保障局', '嘉峪关市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jyg.gov.cn/art/2024/11/25/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级800元、二级450元、一级200元；在职支付比例三级86%、二级90%、一级93%（退休人员各提高3%）。居民住院起付线：三级500元、二级400元、一级100元，市内报销比例分别为72%、75%、88%（市外异地转诊二级65%）。居民基层门诊免起付线，报销65%，年限额160元。甘肃居民大病保险全省统筹起付线5000元。'
    }
  ],

  // 城镇职工医保待遇 (嘉峪关标准)
  employee: {
    outpatient: {
      sourceDocId: 'jyg-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 2500,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '社区及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊年度起付标准200元，最高支付限额2500元，退休人员报销比例各提高5个百分点。'
    },
    inpatient: {
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '社区服务中心/一级机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '三级甲等定点医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医规范备案享同等待遇，未备案自行就医比例降低。'
      ]
    }
  },

  // 城乡居民医保待遇 (嘉峪关标准)
  resident: {
    outpatient: {
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      annualCap: 160,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊在基层社区和乡镇医疗机构零门槛，报销65%，年度限额160元。'
    },
    inpatient: {
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区服务中心/卫生院', deductible: 100, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.72 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 500, reimbursementRatio: 0.72 }
      }
    },
    catastrophic: {
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全省统筹）',
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
      sourceDocId: 'jyg-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '甘肃医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '执行甘肃省统一异地就医直接结算规程。'
      ]
    }
  }
};
