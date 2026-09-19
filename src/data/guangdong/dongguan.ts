import type { CityInsuranceData } from '../types';

export const dongguanCityData: CityInsuranceData = {
  cityCode: '441900',
  cityName: '东莞市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0769-12393',
  officialPortalUrl: 'http://dgyb.dg.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'dg-employee-outpatient-2022-12',
      title: '东莞市医疗保障局等四部门关于印发东莞市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '东医保〔2022〕12号',
      issuingDept: ['东莞市医疗保障局', '东莞市财政局', '东莞市卫生健康局'],
      publishDate: '2022-11-10',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://dgyb.dg.gov.cn/zwgk/zcfg/202211/t20221115_189024.shtml',
      summaryQuote: '职工普通门诊不设起付线。实行“主点+辅点”选点就医管理。在基层选定社区卫生服务中心就医支付比例为70%（退休人员75%，签约家庭医生再提高5%至80%）；转诊市内定点医院支付比例为50%至60%。年度普通门诊统筹限额在职约3000元，退休约3500元。'
    },
    {
      docId: 'dg-medical-insurance-inpatient-2023',
      title: '东莞市基本医疗保险统筹基金住院与重大疾病待遇保障办法',
      docNumber: '东府办〔2023〕45号',
      issuingDept: ['东莞市人民政府办公室', '东莞市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://dgyb.dg.gov.cn/zwgk/zcfg/202311/t20231125_219084.shtml',
      summaryQuote: '市内住院起付标准：一级500元、二级800元、三级1300元；统账结合职工报销比例在职三级85%、二级90%、一级95%（退休人员各级分别上浮3%至5%）。居民住院起付线同级，报销比例在职三级75%、二级80%、一级85%。大病保险起付线1.2万元，分段报销60%-85%，年度封顶40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'dg-employee-outpatient-2022-12',
      annualDeductible: 0,
      annualCap: 3000,
      annualCapRetiree: 3500,
      tierBenefits: {
        community: { tierName: '社区卫生服务机构(主点)', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构(辅点/转诊)', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构(辅点/转诊)', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院(转诊)', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选定社区卫生服务机构报销75%（退休80%）；转诊市内定点医院报销50%-60%。在职限额3000元，退休3500元。'
    },
    inpatient: {
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 500, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1300, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市属重点三甲综合医院', deductible: 1300, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '参保人同一自然年度内多次住院，起付线每次按医疗机构级别扣除；市内跨院转诊扣除差额。'
    },
    catastrophic: {
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
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
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
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
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '社区门诊定点机构', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65 },
        tier2: { tierName: '二级定点医疗机构(转诊)', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点医疗机构(转诊)', deductible: 0, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 0, reimbursementRatio: 0.40 }
      },
      note: '居民门诊免设起付线，社区就医报销70%，转诊定点医院报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/社区医院', deductible: 500, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1300, reimbursementRatio: 0.75 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1300, reimbursementRatio: 0.75 }
      }
    },
    catastrophic: {
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
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
      sourceDocId: 'dg-medical-insurance-inpatient-2023',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
