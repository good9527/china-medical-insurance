import type { CityInsuranceData } from '../types';

export const maomingCityData: CityInsuranceData = {
  cityCode: '440900',
  cityName: '茂名市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0668-12393',
  officialPortalUrl: 'http://www.maoming.gov.cn/gdmmybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'mm-employee-outpatient-2022-22',
      title: '茂名市医疗保障局关于印发茂名市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '茂医保〔2022〕22号',
      issuingDept: ['茂名市医疗保障局', '茂名市财政局'],
      publishDate: '2022-11-20',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.maoming.gov.cn/gdmmybj/zwgk/zcfg/202211/t20221124_219084.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定基层医疗机构普通门诊报销比例为75%（退休人员80%），二级医疗机构报销60%（退休65%），三级医疗机构报销50%（退休55%）。职工门诊年度统筹支付限额在职约为2200元，退休约为2600元。'
    },
    {
      docId: 'mm-medical-insurance-inpatient-2024',
      title: '茂名市基本医疗保险住院统筹待遇与大病保险管理规定',
      docNumber: '茂府规〔2023〕15号',
      issuingDept: ['茂名市人民政府', '茂名市医疗保障局'],
      publishDate: '2023-12-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.maoming.gov.cn/gdmmybj/zwgk/zcfg/202312/t20231225_231908.shtml',
      summaryQuote: '职工住院起付线：乡镇及一级200元、二级500元、三级700元；在职支付比例乡镇及一级90%、二级80%、三级80%（退休人员对应为92%、85%、85%）。居民住院起付线同级，支付比例一级85%、二级75%、三级65%。基本医保年度限额50万元，大病保险最高35万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'mm-employee-outpatient-2022-22',
      annualDeductible: 0,
      annualCap: 2200,
      annualCapRetiree: 2600,
      tierBenefits: {
        community: { tierName: '乡镇卫生院及基层门诊', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医基层报销75%（退休80%），二级报销60%（退休65%），三级报销50%（退休55%）。在职限额2200元，退休2600元。'
    },
    inpatient: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/一级机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 700, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院起付线递减扣除；跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地就医规范转诊下调10%，未备案自行外出就医按70%结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '居民门诊免设起付线，基层选点报销65%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      annualCap: 300000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/一级机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 700, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'mm-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
