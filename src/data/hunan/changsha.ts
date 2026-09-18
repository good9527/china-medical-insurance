import type { CityInsuranceData } from '../types';

export const changshaData: CityInsuranceData = {
  cityCode: '430100',
  cityName: '长沙市',
  provinceCode: '430000',
  provinceName: '湖南省',
  hotline: '0731-12393',
  officialPortalUrl: 'http://ybj.changsha.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [

    {
      docId: 'cs-employee-outpatient-2022-39',
      title: '长沙市人民政府办公厅关于印发〈长沙市职工基本医疗保险门诊共济保障机制实施细则〉的通知',
      docNumber: '长政办发〔2022〕39号',
      issuingDept: ['长沙市人民政府办公厅', '长沙市医疗保障局'],
      publishDate: '2022-09-20',
      effectiveDate: '2022-10-01',
      status: 'active',
      officialUrl: 'http://www.changsha.gov.cn/zfxxgk/szfzf/zfbgtwj/202209/t20220926_10793645.html',
      summaryQuote: '在职职工门诊统筹年度最高支付限额为1500元，退休人员为2000元。基层及一级定点医疗机构不设起付标准，报销比例70%；二级定点医疗机构起付线200元，报销比例60%；三级定点医疗机构起付线300元，报销比例60%。年度累计起付标准不超过300元。'
    },
    {
      docId: 'cs-medical-insurance-inpatient-2024',
      title: '长沙市基本医疗保险住院与医疗救助待遇管理细则',
      docNumber: '长医保发〔2024〕28号',
      issuingDept: ['长沙市医疗保障局', '长沙市财政局'],
      publishDate: '2024-11-25',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.changsha.gov.cn/zwgk/zcfg/202411/t20241128_11678943.html',
      summaryQuote: '职工住院起付线：省部属1500元、三级1100元、二级800元、一级500元、基层200元；在职支付比例分别为80%、85%、90%、92%、93%（退休人员各加2%）。居民住院起付线：省部属2000元、三级1200元、二级800元、一级500元、基层200元；报销比例分别为60%、65%、80%、82%、85%。同一年度内同级别多次住院，起付线减半。大病保险起付线1.6万元，分段报销60%-85%，封顶40万元。'
    }
  ],

  // 城镇职工医保待遇 (长沙标准)
  employee: {
    outpatient: {
      sourceDocId: 'cs-employee-outpatient-2022-39',
      annualDeductible: 300, // 门诊年度累计最高起付线 300 元 (基层0/二级200/三级300)
      annualCap: 1500,       // 在职门诊限额 1500 元
      annualCapRetiree: 2000, // 退休门诊限额 2000 元
      tierBenefits: {
        community: { tierName: '一级定点及基层医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60 },
        tier3: { tierName: '市级三级定点医疗机构', deductible: 300, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省部属三级医院', deductible: 300, reimbursementRatio: 0.60 }
      },
      note: '门诊年度起付线累计300元。基层无起付线报销70%，二级起付200元报销60%，三级起付300元报销60%。在职限额1500元，退休限额2000元。'
    },
    inpatient: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      annualCap: 500000, // 职工医保统筹限额 50 万元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级医疗机构', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级医疗机构', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1100, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '省部属重点医疗机构', deductible: 1500, reimbursementRatio: 0.80, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度同级别医疗机构第二次及以上住院，起付标准按50%计算，累计不超过2000元。'
    },
    catastrophic: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '湘医保微信公众号/小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，规范备案人员与参保地享受同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (长沙标准)
  resident: {
    outpatient: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      annualCap: 400, // 基层普通门诊年度限额 400 元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省部属三级医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在定点基层医疗机构免起付线，报销70%，每人每年限额400元。'
    },
    inpatient: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本医疗保险年度最高支付限额 15 万元
      tierBenefits: {
        community: { tierName: '基层卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.82 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省部属重点医疗机构', deductible: 2000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '同年度同级别医疗机构第二次及以上住院起付标准减半计算。'
    },
    catastrophic: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 16000,
      annualCap: 400000,
      tiers: [
        { minAmount: 16000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 80000, ratio: 0.65 },
        { minAmount: 80000, maxAmount: 150000, ratio: 0.75 },
        { minAmount: 150000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cs-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '湘医保微信小程序'],
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
