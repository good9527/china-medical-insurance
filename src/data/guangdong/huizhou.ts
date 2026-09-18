import type { CityInsuranceData } from '../types';

export const huizhouCityData: CityInsuranceData = {
  cityCode: '441300',
  cityName: '惠州市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0752-12393',
  officialPortalUrl: 'http://hzyb.huizhou.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'hz-employee-outpatient-2022-31',
      title: '惠州市人民政府办公室关于印发惠州市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '惠府办〔2022〕31号',
      issuingDept: ['惠州市人民政府办公室', '惠州市医疗保障局'],
      publishDate: '2022-11-25',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://hzyb.huizhou.gov.cn/zwgk/zcfg/202211/t20221128_190842.shtml',
      summaryQuote: '职工普通门诊统筹不设起付线。实行选点就医，统账结合在职职工一级医院报销85%（退休90%），二级医院报销65%（退休70%），三级医院报销60%（退休65%）。普通门诊年度统筹支付限额约为2028元至2500元。'
    },
    {
      docId: 'hz-medical-insurance-inpatient-2023',
      title: '惠州市基本医疗保险住院统筹待遇与医疗救助实施细则',
      docNumber: '惠医保发〔2023〕18号',
      issuingDept: ['惠州市医疗保障局', '惠州市财政局'],
      publishDate: '2023-12-05',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://hzyb.huizhou.gov.cn/zwgk/zcfg/202312/t20231210_231908.shtml',
      summaryQuote: '职工医保市内住院起付标准：一级200元、二级400元、三级800元；连续缴费满6个月后，市内定点医疗机构统筹报销比例统一为95%（退休人员96%）。居民住院起付线同级，报销比例一级90%、二级80%、三级70%。大病保险起付线1万元，分段报销60%-80%，年度封顶40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'hz-employee-outpatient-2022-31',
      annualDeductible: 0,
      annualCap: 2500,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层及一级选定医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医在职一级报销85%（退休90%），二级报销65%（退休70%），三级报销60%（退休65%）。在职限额2500元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.01 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.01 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.01 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.95, retireeRatioBonus: 0.01 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.95, retireeRatioBonus: 0.01 }
      },
      repeatedDeductibleRule: '参保人年度内多次住院，起付线每次按医疗机构级别扣除；市内跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      name: '职工大病医疗保险',
      deductible: 10000,
      annualCap: 400000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
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
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层定点门诊机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点机构(选定)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构(选定)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '居民门诊免设起付线，基层选点报销70%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 800, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 400000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
