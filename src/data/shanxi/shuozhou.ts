import type { CityInsuranceData } from '../types';

export const shuozhouCityData: CityInsuranceData = {
  cityCode: '140600',
  cityName: '朔州市',
  provinceCode: '140000',
  provinceName: '山西省',
  hotline: '0349-12393',
  officialPortalUrl: 'http://www.shuozhou.gov.cn/zsz/szsybj/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'sz-employee-outpatient-2022-48',
      title: '朔州市人民政府办公室关于印发朔州市职工基本医疗保险门诊共济保障机制实施办法的通知',
      docNumber: '朔政办发〔2022〕48号',
      issuingDept: ['朔州市人民政府办公室', '朔州市医疗保障局'],
      publishDate: '2022-12-25',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://www.shuozhou.gov.cn/zwgk/zcfg/202212/t20221228_182901.shtml',
      summaryQuote: '职工普通门诊按次起付标准：基层30元、二级50元、三级80元；支付比例基层65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）；年度封顶在职2500元，退休3000元。'
    },
    {
      docId: 'sz-medical-insurance-inpatient-2024',
      title: '朔州市基本医疗保险和补充医疗保险住院结算管理办法',
      docNumber: '朔医保发〔2024〕16号',
      issuingDept: ['朔州市医疗保障局', '朔州市财政局'],
      publishDate: '2024-06-20',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://www.shuozhou.gov.cn/zwgk/zcfg/202406/t20240625_201948.shtml',
      summaryQuote: '职工基本医保住院起付线：三类300元、二类500元、一类800元；在职支付比例三级83%、二级87%、一级91%（退休人员分别为92%、94%、96%），职工合并封顶55万元。居民住院起付线100元-1000元，报销比例60%-85%，统筹最高7万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'sz-employee-outpatient-2022-48',
      annualDeductible: 80,
      deductibleType: 'per_visit',
      annualCap: 2500,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层及一级医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊按次起付标准：一级30元、二级50元、三级80元，年度起付线累计满300元后免收起付线。年度统筹在职限额2500元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      annualCap: 550000,
      tierBenefits: {
        community: { tierName: '三类医疗机构/一级', deductible: 300, reimbursementRatio: 0.91, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.91, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二类医疗机构/二级', deductible: 500, reimbursementRatio: 0.87, retireeRatioBonus: 0.07 },
        tier3: { tierName: '一类医疗机构/三级', deductible: 800, reimbursementRatio: 0.83, retireeRatioBonus: 0.09 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 800, reimbursementRatio: 0.83, retireeRatioBonus: 0.09 }
      },
      repeatedDeductibleRule: '同自然年度内第二次住院起付线减半，第三次及以上免收起付线。'
    },
    catastrophic: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      name: '职工大额医疗互助',
      deductible: 0,
      annualCap: 450000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省异地就医规范转诊比例下调10%，未备案就医按70%结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 0, reimbursementRatio: 0.55 },
        tier3: { tierName: '三级医疗机构', deductible: 80, reimbursementRatio: 0.45 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 80, reimbursementRatio: 0.45 }
      },
      note: '普通门诊在基层定点免起付线报销60%，二级机构免起付线报销55%；三级机构按次起付80元报销45%。'
    },
    inpatient: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      annualCap: 70000,
      tierBenefits: {
        community: { tierName: '三类收费医疗机构/乡镇卫生院', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二类收费医疗机构/县级', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '二类收费医疗机构/市级', deductible: 500, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '一类收费医疗机构/三甲', deductible: 1000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以后住院，起付标准降低50%。'
    },
    catastrophic: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 400000,
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调5%，未备案临时外出下调15%。']
    }
  }
};
