import type { CityInsuranceData } from '../types';

export const bayannurData: CityInsuranceData = {
  cityCode: '150800',
  cityName: '巴彦淖尔市',
  provinceCode: '150000',
  provinceName: '内蒙古自治区',
  hotline: '0478-12393',
  officialPortalUrl: 'http://ybj.bynr.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'bynr-employee-outpatient-2023',
      title: '巴彦淖尔市建立完善职工基本医疗保险门诊共济保障实施细则',
      docNumber: '巴政办发〔2023〕52号',
      issuingDept: ['巴彦淖尔市人民政府办公室', '巴彦淖尔市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.bynr.gov.cn/art/2023/11/25/art_11221_1189912.html',
      summaryQuote: '职工门诊年度起付线按自然年度累计计算：一级200元、二级300元、三级500元（退休人员相应为50元、200元、300元）。统筹基金支付比例：一级及以下80%、二级80%、三级60%（退休人员各增加5%）。年度累计最高支付限额在职5000元，退休人员6000元。'
    },
    {
      docId: 'bynr-medical-insurance-inpatient-2024',
      title: '巴彦淖尔市基本医疗保险综合保障管理规程',
      docNumber: '巴医保发〔2024〕35号',
      issuingDept: ['巴彦淖尔市医疗保障局', '巴彦淖尔市财政局'],
      publishDate: '2024-11-20',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.bynr.gov.cn/art/2024/11/25/art_11221_1345672.html',
      summaryQuote: '职工住院起付线：三级1000元、二级500元、一级300元；在职统筹支付比例三级85%、二级88%、一级92%（退休各加3%）。居民住院起付线三级800元/60%、二级450元/75%、一级200元/85%。居民基层门诊免起付线，报销50%，年限额200元。'
    }
  ],

  // 城镇职工医保待遇 (巴彦淖尔标准)
  employee: {
    outpatient: {
      sourceDocId: 'bynr-employee-outpatient-2023',
      annualDeductible: 500,
      annualCap: 5000,
      annualCapRetiree: 6000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线一级200/二级300/三级500，报销比例一级80%、二级80%、三级60%（退休各加5%），在职限额5000元，退休限额6000元。'
    },
    inpatient: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用互助补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '内蒙古医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按内蒙古自治区统一部署异地直接结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (巴彦淖尔标准)
  resident: {
    outpatient: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区及卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层定点机构免起付线，报销50%，年度最高支付限额200元。'
    },
    inpatient: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 450, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险（全区统一）',
      deductible: 14000,
      annualCap: 350000,
      tiers: [
        { minAmount: 14000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bynr-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '内蒙古医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '跨省跨区异地直接联网结算。'
      ]
    }
  }
};
