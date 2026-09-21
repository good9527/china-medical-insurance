import type { CityInsuranceData } from '../types';

export const jiangmenCityData: CityInsuranceData = {
  cityCode: '440700',
  cityName: '江门市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0750-12393',
  officialPortalUrl: 'http://www.jiangmen.gov.cn/bmpd/jmsylbzj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'jm-employee-outpatient-2022-25',
      title: '江门市医疗保障局关于印发江门市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '江医保〔2022〕25号',
      issuingDept: ['江门市医疗保障局', '江门市财政局'],
      publishDate: '2022-11-15',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.jiangmen.gov.cn/bmpd/jmsylbzj/zwgk/zcfg/202211/t20221118_273901.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定基层定点医疗机构就医报销比例为75%（退休人员80%），二级或三级医疗机构就医报销比例为60%（退休人员65%）。年度门诊统筹最高支付限额在职约为2800元，退休约为3200元。'
    },
    {
      docId: 'jm-medical-insurance-inpatient-2024',
      title: '江门市基本医疗保险住院与大病保险管理办法',
      docNumber: '江医保发〔2024〕12号',
      issuingDept: ['江门市医疗保障局', '江门市财政局'],
      publishDate: '2024-06-20',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://www.jiangmen.gov.cn/bmpd/jmsylbzj/zwgk/zcfg/202406/t20240625_291084.shtml',
      summaryQuote: '职工住院起付线：一级及以下500元、二级600元、三级900元（退休人员统筹起付线降低100元）；报销比例在职一级93%、二级90%、三级83%（退休人员各项提高3%）。居民住院起付线同级，支付比例一级88%、二级82%、三级72%。基本统筹年度限额60万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'jm-employee-outpatient-2022-25',
      annualDeductible: 0,
      annualCap: 2800,
      annualCapRetiree: 3200,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '普通门诊免设起付线。选点就医基层报销75%（退休80%），二级及三级报销60%（退休65%）。年度限额在职2800元，退休3200元。'
    },
    inpatient: {
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层定点医疗机构', deductible: 500, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.83, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 900, reimbursementRatio: 0.83, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内退休人员各级起付标准降低100元；多次住院每次扣减相应起付线。'
    },
    catastrophic: {
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
      name: '职工大病医疗保险',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
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
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
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
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
      annualCap: 540000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 500, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.82 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.72 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 900, reimbursementRatio: 0.72 }
      }
    },
    catastrophic: {
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jm-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
