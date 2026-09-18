import type { CityInsuranceData } from '../types';

export const datongCityData: CityInsuranceData = {
  cityCode: '140200',
  cityName: '大同市',
  provinceCode: '140000',
  provinceName: '山西省',
  hotline: '0352-12393',
  officialPortalUrl: 'http://ybj.dt.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'dt-employee-outpatient-2022-41',
      title: '大同市人民政府办公室关于印发大同市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '同政办发〔2022〕41号',
      issuingDept: ['大同市人民政府办公室', '大同市医疗保障局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.dt.gov.cn/zwgk/zcfg/202212/t20221220_223401.shtml',
      summaryQuote: '职工普通门诊按次起付：三类机构30元、二类机构50元、一类机构80元；支付比例基层65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）；年度封顶在职2500元，退休人员3000元。'
    },
    {
      docId: 'dt-medical-insurance-inpatient-2024',
      title: '大同市城镇职工与城乡居民基本医疗保险住院统筹管理实施办法',
      docNumber: '同医保发〔2024〕18号',
      issuingDept: ['大同市医疗保障局', '大同市财政局'],
      publishDate: '2024-06-25',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://ybj.dt.gov.cn/zwgk/zcfg/202406/t20240628_256312.shtml',
      summaryQuote: '职工住院起付线：三类医疗机构300元、二类500元、一类800元；在职支付比例三级85%、二级88%、一级92%（退休人员分别为92%、94%、96%），统筹基金封顶10万元，大额救助最高支付48万元（合并58万元）。居民住院起付线一类1000元/60%、二类500元/70%、县级400元/75%、三类100元/85%。大病保险起付线1万元，分段报销60%-75%，限额40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'dt-employee-outpatient-2022-41',
      annualDeductible: 80,
      deductibleType: 'per_visit',
      annualCap: 2500,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市属重点三级医院', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊按次起付：一级30元、二级50元、三级80元，年度起付线累计满300元后免收起付线。报销比例在职55%-65%，退休人员60%-70%。年度限额在职2500元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
      annualCap: 580000,
      tierBenefits: {
        community: { tierName: '三类医疗机构/一级', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二类医疗机构/二级', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.06 },
        tier3: { tierName: '一类医疗机构/三级', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 },
        tier3_top: { tierName: '省级/市级三甲综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.07 }
      },
      repeatedDeductibleRule: '同自然年度内第二次住院起付线减半，第三次及以上免收起付线。'
    },
    catastrophic: {
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用救助',
      deductible: 0,
      annualCap: 480000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['省内就医免备案直接结算无降比，跨省临时就医按规定下调比例。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 0, reimbursementRatio: 0.55 },
        tier3: { tierName: '三级医疗机构', deductible: 80, reimbursementRatio: 0.45 },
        tier3_top: { tierName: '省级/市级三甲医院', deductible: 80, reimbursementRatio: 0.45 }
      },
      note: '居民门诊在二类及以下机构无起付线，三类机构报销60%、二类55%；一类机构按次起付80元，报销45%。'
    },
    inpatient: {
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
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
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
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
      sourceDocId: 'dt-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地长期居住备案不降比例，规范转诊下调5%，未备案临时外出就医下调15%。']
    }
  }
};
