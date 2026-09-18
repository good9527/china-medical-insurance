import type { CityInsuranceData } from '../types';

export const yangquanCityData: CityInsuranceData = {
  cityCode: '140300',
  cityName: '阳泉市',
  provinceCode: '140000',
  provinceName: '山西省',
  hotline: '0353-12393',
  officialPortalUrl: 'http://yqyb.yq.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'yq-employee-outpatient-2022-43',
      title: '阳泉市人民政府办公室关于建立健全职工基本医疗保险门诊共济保障机制的实施方案',
      docNumber: '阳政办发〔2022〕43号',
      issuingDept: ['阳泉市人民政府办公室', '阳泉市医疗保障局'],
      publishDate: '2022-12-22',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://yqyb.yq.gov.cn/zwgk/zcfg/202212/t20221225_209182.shtml',
      summaryQuote: '职工普通门诊按次起付标准：三类机构30元、二类50元、一类80元。支付比例在职55%-65%，退休人员60%-70%。年度统筹限额在职2500元，退休3000元。'
    },
    {
      docId: 'yq-medical-insurance-inpatient-2024',
      title: '阳泉市关于执行山西省统一基本医疗保险和大病保险政策的通知',
      docNumber: '阳医保发〔2024〕21号',
      issuingDept: ['阳泉市医疗保障局', '阳泉市财政局'],
      publishDate: '2024-07-02',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'http://yqyb.yq.gov.cn/zwgk/zcfg/202407/t20240705_239102.shtml',
      summaryQuote: '职工基本医疗保险住院起付线一类800元、二类500元、三类300元；在职支付比例82%-90%，退休提高至91%-95%，封顶总额55万元。居民住院起付标准100元-1000元，报销比例60%-85%，基本封顶7万元，大病最高40万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'yq-employee-outpatient-2022-43',
      annualDeductible: 80,
      deductibleType: 'per_visit',
      annualCap: 2500,
      annualCapRetiree: 3000,
      tierBenefits: {
        community: { tierName: '基层及一级医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 30, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级及以上重点三甲医院', deductible: 80, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊按次起付：基层30元、二级50元、三级80元，年内累计超300元免起付线。在职报销55%-65%，退休60%-70%。'
    },
    inpatient: {
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
      annualCap: 550000,
      tierBenefits: {
        community: { tierName: '基层与一级医疗机构', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.86, retireeRatioBonus: 0.07 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.09 },
        tier3_top: { tierName: '市级重点三甲综合医院', deductible: 800, reimbursementRatio: 0.82, retireeRatioBonus: 0.09 }
      },
      repeatedDeductibleRule: '同自然年度内第二次住院起付线减半，第三次及以上免收起付线。'
    },
    catastrophic: {
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
      name: '职工大额医疗互助保障',
      deductible: 0,
      annualCap: 450000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['跨省规范转诊支付比例下调10%，未备案自行就医下调20%。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '三类机构/基层社区卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二类医疗机构', deductible: 0, reimbursementRatio: 0.55 },
        tier3: { tierName: '一类医疗机构/三级', deductible: 80, reimbursementRatio: 0.45 },
        tier3_top: { tierName: '市级三甲综合医院', deductible: 80, reimbursementRatio: 0.45 }
      },
      note: '普通门诊在基层定点免起付线报销60%，二级机构报销55%；三级机构按次起付80元报销45%。'
    },
    inpatient: {
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
      annualCap: 70000,
      tierBenefits: {
        community: { tierName: '三类收费医疗机构/基层', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.85 },
        tier2: { tierName: '二类收费机构/县级医院', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '二类收费机构/市级医院', deductible: 500, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '一类收费机构/三甲医院', deductible: 1000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以后住院，起付标准降低50%。'
    },
    catastrophic: {
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
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
      sourceDocId: 'yq-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '山西医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地长期居住备案不降比例，跨省转诊下调5%，未备案临时就医下调15%。']
    }
  }
};
