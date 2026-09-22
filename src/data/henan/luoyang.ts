import type { CityInsuranceData } from '../types';

export const luoyangCityData: CityInsuranceData = {
  cityCode: '410300',
  cityName: '洛阳市',
  provinceCode: '410000',
  provinceName: '河南省',
  hotline: '0379-12393',
  officialPortalUrl: 'http://ybj.ly.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'ly-employee-outpatient-2022-42',
      title: '洛阳市人民政府办公室关于印发洛阳市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '洛政办〔2022〕42号',
      issuingDept: ['洛阳市人民政府办公室', '洛阳市医疗保障局'],
      publishDate: '2022-06-28',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://ybj.ly.gov.cn/zwgk/zcfg/202206/t20220630_210984.shtml',
      summaryQuote: '职工普通门诊按次设起付标准：基层医疗机构免设起付线，二级及以上医院每次30元；报销比例基层65%（退休75%），二级60%（退休70%），三级55%（退休65%）；年度支付限额在职1800元，退休2300元。'
    },
    {
      docId: 'ly-medical-insurance-inpatient-2023',
      title: '洛阳市医疗保障局关于印发洛阳市基本医疗保险住院待遇保障办法的通知',
      docNumber: '洛医保发〔2023〕35号',
      issuingDept: ['洛阳市医疗保障局', '洛阳市财政局'],
      publishDate: '2023-10-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.ly.gov.cn/zwgk/zcfg/202310/t20231025_219084.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级500元、三级900元；在职支付比例一级92%、二级88%、三级85%（退休人员各项提高3%）。居民住院起付线一级150元、二级500元、三级1000元，支付比例一级85%、二级75%、三级65%。大病保险起付线15000元，支付比例60%-80%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'ly-employee-outpatient-2022-42',
      annualDeductible: 30,
      deductibleType: 'per_visit',
      annualCap: 1800,
      annualCapRetiree: 2300,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/卫生院', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级及以下定点医疗机构', deductible: 20, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 40, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '河南科技大学一附院等三甲', deductible: 40, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '门诊按次设起付线（基层免起付线、二级20元/次、三级40元/次）。在职报销比例：基层65%、二级60%、三级55%（退休人员各项提高10%）。年度最高支付限额在职职工1800元，退休人员2300元。'
    },
    inpatient: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，从第二次住院起，起付标准降低100元。'
    },
    catastrophic: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      name: '洛阳市职工大额医疗救助',
      deductible: 15000,
      annualCap: 400000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.80 },
        { minAmount: 50000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地就医规范转诊下调10%，未备案自行外出就医按70%结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      annualCap: 350,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲综合医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊在基层定点机构免起付线报销50%（村卫生室每次限额50元），年度最高支付限额提高至350元。'
    },
    inpatient: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医院', deductible: 1000, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，起付标准递减100元。'
    },
    catastrophic: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      name: '洛阳市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ly-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
