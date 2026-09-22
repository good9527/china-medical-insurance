import type { CityInsuranceData } from '../types';

export const nanyangCityData: CityInsuranceData = {
  cityCode: '411300',
  cityName: '南阳市',
  provinceCode: '410000',
  provinceName: '河南省',
  hotline: '0377-12393',
  officialPortalUrl: 'http://ybj.nanyang.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'ny-employee-outpatient-2022-38',
      title: '南阳市人民政府办公室关于印发南阳市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '宛政办〔2022〕38号',
      issuingDept: ['南阳市人民政府办公室', '南阳市医疗保障局'],
      publishDate: '2022-06-25',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://ybj.nanyang.gov.cn/zwgk/zcfg/202206/t20220628_210984.shtml',
      summaryQuote: '职工普通门诊按次设起付标准：每次30元（基层医疗机构免起付）；报销比例基层65%（退休75%），二级60%（退休70%），三级55%（退休65%）；年度支付限额在职1800元，退休2300元。'
    },
    {
      docId: 'ny-medical-insurance-inpatient-2023',
      title: '南阳市医疗保障局关于调整基本医疗保险住院与大病保险待遇政策的通知',
      docNumber: '宛医保发〔2023〕36号',
      issuingDept: ['南阳市医疗保障局', '南阳市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nanyang.gov.cn/zwgk/zcfg/202311/t20231125_219084.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级500元、三级800元；在职支付比例一级92%、二级88%、三级85%（退休人员各项提高3%）。居民住院起付线一级150元、二级500元、三级1000元，支付比例一级85%、二级75%、三级65%。大病保险起付线15000元，支付比例60%-80%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'ny-employee-outpatient-2022-38',
      annualDeductible: 30,
      deductibleType: 'per_visit',
      annualCap: 1800,
      annualCapRetiree: 2300,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 30, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 50, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '南阳市第一人民医院等三甲', deductible: 50, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '门诊按次设起付线（基层免起付线、二级30元/次、三级50元/次）。在职报销比例：基层65%、二级60%、三级55%（退休人员各项提高10%）。年度最高支付限额在职职工1800元，退休人员2300元。'
    },
    inpatient: {
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，从第二次住院起，起付标准降低100元。'
    },
    catastrophic: {
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
      name: '南阳市职工大额医疗救助',
      deductible: 15000,
      annualCap: 400000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.80 },
        { minAmount: 50000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
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
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
      annualCap: 300,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '市级重点三甲(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊在基层定点机构免起付报销60%，县级二级机构每次起付50元报销50%，年度限额300元。'
    },
    inpatient: {
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 1000, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '参保人员自然年度内多次住院的，起付标准递减100元。'
    },
    catastrophic: {
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
      name: '南阳市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ny-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
