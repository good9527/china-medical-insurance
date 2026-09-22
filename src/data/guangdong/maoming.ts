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
      docId: 'mm-medical-insurance-2025-02',
      title: '茂名市人民政府关于印发茂名市基本医疗保险管理办法的通知',
      docNumber: '茂府规〔2025〕2号',
      issuingDept: ['茂名市人民政府', '茂名市医疗保障局'],
      publishDate: '2025-01-15',
      effectiveDate: '2025-02-01',
      status: 'active',
      officialUrl: 'http://www.maoming.gov.cn/gdmmybj/zwgk/zcfg/202501/t20250115_239108.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定乡镇卫生院及村卫生站80%、一级70%、二级60%、三级50%（退休人员各项提高5个百分点）。2026年度职工门诊统筹最高支付限额为2088元/年。居民普通门诊统筹最高支付限额为263元/年，基层报销比例70%。'
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
      sourceDocId: 'mm-medical-insurance-2025-02',
      annualDeductible: 0,
      annualCap: 2088,
      annualCapRetiree: 2088,
      tierBenefits: {
        community: { tierName: '乡镇卫生院及村卫生站', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医乡镇基层报销80%（退休85%），一级报销70%（退休75%），二级报销60%（退休65%），三级报销50%（退休55%）。2026年度最高支付限额为2088元/年。'
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
      sourceDocId: 'mm-medical-insurance-2025-02',
      annualCap: 263,
      tierBenefits: {
        community: { tierName: '基层选定卫生院/村站', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点机构(仅定额门诊查费3元)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点机构(仅定额门诊查费3元)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级三甲综合医院(仅定额门诊查费3元)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊免设起付线，基层选点一般诊疗费报销70%，年度最高支付限额263元/年。二级及以上公立医院门诊仅享受每人每次3元诊查费定额报销。'
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
