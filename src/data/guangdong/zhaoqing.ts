import type { CityInsuranceData } from '../types';

export const zhaoqingCityData: CityInsuranceData = {
  cityCode: '441200',
  cityName: '肇庆市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '0758-12393',
  officialPortalUrl: 'http://www.zhaoqing.gov.cn/zqybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'zq-employee-outpatient-2022-21',
      title: '肇庆市医疗保障局关于印发肇庆市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '肇医保〔2022〕21号',
      issuingDept: ['肇庆市医疗保障局', '肇庆市财政局'],
      publishDate: '2022-11-22',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://www.zhaoqing.gov.cn/zqybj/zwgk/zcfg/202211/t20221125_210984.shtml',
      summaryQuote: '职工普通门诊不设起付线。选定基层医疗机构普通门诊报销比例为75%（退休人员80%），二级医疗机构报销60%（退休65%），三级医疗机构报销50%（退休55%）。职工门诊年度统筹支付限额在职约为2400元，退休约为2800元。'
    },
    {
      docId: 'zq-medical-insurance-inpatient-2024',
      title: '肇庆市基本医疗保险住院与大额医疗费用补助实施方案',
      docNumber: '肇府规〔2023〕8号',
      issuingDept: ['肇庆市人民政府', '肇庆市医疗保障局'],
      publishDate: '2023-12-15',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://www.zhaoqing.gov.cn/zqybj/zwgk/zcfg/202312/t20231220_231908.shtml',
      summaryQuote: '职工住院起付线：一级及以下300元、二级500元、三级800元；在职支付比例一级92%、二级88%、三级84%（退休人员分别为95%、91%、87%）。居民住院起付线同级，支付比例一级88%、二级80%、三级70%。基本医保年度限额60万元，大病保险最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'zq-employee-outpatient-2022-21',
      annualDeductible: 0,
      annualCap: 2400,
      annualCapRetiree: 2800,
      tierBenefits: {
        community: { tierName: '基层及一级选定医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级选定医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级选定医疗机构', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 0, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线。选点就医基层报销75%（退休80%），二级报销60%（退休65%），三级报销50%（退休55%）。在职限额2400元，退休2800元。'
    },
    inpatient: {
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.84, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.84, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院按医疗机构级别扣除起付标准；市内转诊补足差额。'
    },
    catastrophic: {
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 12000,
      annualCap: 400000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
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
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层社区及定点门诊机构', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级医疗机构(普通门诊未签约)', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级重点三甲医院(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊免设起付线，基层选点报销65%，选定二级及以上报销40%-50%，年度限额1200元。'
    },
    inpatient: {
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
      annualCap: 220000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 1000, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
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
      sourceDocId: 'zq-medical-insurance-inpatient-2024',
      filingChannels: ['粤医保微信小程序', '国家医保服务平台APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案临时外出下调20%。']
    }
  }
};
