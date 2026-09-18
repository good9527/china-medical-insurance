import type { CityInsuranceData } from '../types';

export const jinchengCityData: CityInsuranceData = {
  cityCode: '140500',
  cityName: '晋城市',
  provinceCode: '140000',
  provinceName: '山西省',
  hotline: '0356-12393',
  officialPortalUrl: 'http://ybj.jcgov.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'jc-employee-outpatient-2022-35',
      title: '晋城市医疗保障局关于印发晋城市职工基本医疗保险门诊共济保障机制实施办法的通知',
      docNumber: '晋市医保发〔2022〕35号',
      issuingDept: ['晋城市医疗保障局', '晋城市财政局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jcgov.gov.cn/zwgk/zcfg/202212/t20221218_1708231.shtml',
      summaryQuote: '职工普通门诊按次起付标准：基层30元、二级50元、三级80元；支付比例在职55%-65%，退休人员60%-70%。年度统筹支付限额在职2500元，退休3000元。'
    },
    {
      docId: 'jc-medical-insurance-inpatient-2024',
      title: '晋城市基本医疗保险住院统筹待遇与医疗费用综合保障办法',
      docNumber: '晋市医保发〔2024〕19号',
      issuingDept: ['晋城市医疗保障局', '晋城市财政局'],
      publishDate: '2024-06-28',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://ybj.jcgov.gov.cn/zwgk/zcfg/202406/t20240630_1987123.shtml',
      summaryQuote: '职工住院起付线：一级300元、二级600元、三级800元；在职支付比例三级85%、二级88%、一级92%（退休人员分别为92%、94%、96%），职工统筹基金封顶12万元，大额补充医疗限额48万元（总封顶60万元）。居民住院起付线100元-1000元，支付比例60%-85%，统筹最高7万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'jc-employee-outpatient-2022-35',
      annualDeductible: 80,
      deductibleType: 'per_visit',
      annualCap: 2500,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三级甲等综合医院', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊按次起付标准：一级30元、二级50元、三级80元，年度起付线累计满300元后免收起付线。年度统筹在职限额2500元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '三类医疗机构/一级', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二类医疗机构/二级', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.06 },
        tier3: { tierName: '一类医疗机构/三级', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 },
        tier3_top: { tierName: '市属重点三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 }
      },
      repeatedDeductibleRule: '同自然年度内第二次住院起付线减半，第三次及以上由统筹基金支付免收起付线；退休人员年内首次住院起付线降低100元。'
    },
    catastrophic: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      name: '职工大额补充医疗保险',
      deductible: 0,
      annualCap: 480000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省规范转诊支付比例下调10%，未备案临时就医按70%执行。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '三类医疗机构/基层社区卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二类定点医疗机构', deductible: 0, reimbursementRatio: 0.55 },
        tier3: { tierName: '一类医疗机构/三级', deductible: 80, reimbursementRatio: 0.45 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 80, reimbursementRatio: 0.45 }
      },
      note: '普通门诊在基层及二级机构不设起付线，分别报销60%、55%；三级机构按次起付80元，报销45%。'
    },
    inpatient: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      annualCap: 70000,
      tierBenefits: {
        community: { tierName: '三类收费机构/乡镇卫生院', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二类收费机构/县级', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '二类收费机构/市级', deductible: 500, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '一类收费机构/三甲', deductible: 1000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以后住院，起付标准降低50%。'
    },
    catastrophic: {
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
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
      sourceDocId: 'jc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调5%，未备案临时外出下调15%。']
    }
  }
};
