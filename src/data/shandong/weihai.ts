import type { CityInsuranceData } from '../types';

export const weihaiCityData: CityInsuranceData = {
  cityCode: '371000',
  cityName: '威海市',
  provinceCode: '370000',
  provinceName: '山东省',
  hotline: '0631-12393',
  officialPortalUrl: 'http://ybj.weihai.gov.cn/',
  lastUpdated: '2026-03-01',

  sourceDocs: [
    {
      docId: 'wh-employee-outpatient-2022-18',
      title: '威海市人民政府办公室关于印发威海市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '威政办发〔2022〕18号',
      issuingDept: ['威海市人民政府办公室', '威海市医疗保障局'],
      publishDate: '2022-12-16',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.weihai.gov.cn/zwgk/zcfg/202212/t20221220_198234.shtml',
      summaryQuote: '职工普通门诊统筹起付标准为200元；报销比例：基层医疗机构80%（退休85%），二级医疗机构70%（退休75%），三级医疗机构60%（退休65%）；年度最高支付限额在职职工3000元，退休人员3500元。'
    },
    {
      docId: 'wh-medical-insurance-inpatient-2024',
      title: '威海市医疗保障局关于印发威海市基本医疗保险待遇保障办法的通知',
      docNumber: '威医保发〔2024〕8号',
      issuingDept: ['威海市医疗保障局', '威海市财政局'],
      publishDate: '2024-04-12',
      effectiveDate: '2024-06-01',
      status: 'active',
      officialUrl: 'http://ybj.weihai.gov.cn/zwgk/zcfg/202404/t20240416_231908.shtml',
      summaryQuote: '职工住院起付线：一级200元、二级400元、三级800元；在职支付比例一级93%、二级90%、三级87%（退休人员各项提高3%）。居民住院起付线一级100元、二级300元、三级700元，支付比例一级88%、二级78%、三级68%。大病保险起付线14000元，支付比例60%-75%。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'wh-employee-outpatient-2022-18',
      annualDeductible: 200,
      annualCap: 4500, // 职工门诊年度最高支付限额 4500 元（含大额补助1000元）
      annualCapRetiree: 5500, // 退休职工门诊年度最高支付限额 5500 元（含大额补助1000元）
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心及卫生院', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '威海市立医院等重点三甲', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹年度起付线200元。基层报销80%（退休85%），二级70%（退休75%），三级60%（退休65%）。年度限额在职4500元（含大额补助1000元），退休5500元（含大额补助1000元）。'
    },
    inpatient: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      annualCap: 600000,
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第二次及以上住院，起付标准递减50%。'
    },
    catastrophic: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      name: '威海市职工大额医疗救助',
      deductible: 14000,
      annualCap: 500000,
      tiers: [
        { minAmount: 14000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '威海医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: ['省内异地就医免备案直接同比例结算，跨省异地转诊规范备案。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      annualDeductible: 0,
      annualCap: 400, // 城乡居民普通门诊统筹年度最高支付限额 400 元（二档缴费400元，一档200元）
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心及卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳门诊统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民普通门诊在基层定点机构就医，政策范围内报销50%~60%，年度最高支付限额二档400元（一档200元）。'
    },
    inpatient: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      annualCap: 200000, // 一档20万，二档30万
      tierBenefits: {
        community: { tierName: '基层社区卫生中心及卫生院', deductible: 100, reimbursementRatio: 0.88 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.88 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.78 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.68 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 700, reimbursementRatio: 0.68 }
      },
      repeatedDeductibleRule: '参保人员自然年度内第一、二次住院设起付标准，第三次住院起免除起付线。'
    },
    catastrophic: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      name: '威海市城乡居民大病保险',
      deductible: 14000,
      annualCap: 400000,
      tiers: [
        { minAmount: 18000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, maxAmount: 200000, ratio: 0.65 },
        { minAmount: 200000, maxAmount: 300000, ratio: 0.70 },
        { minAmount: 300000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wh-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '爱山东APP', '威海医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: ['跨省异地就医规范转诊下调15%，未备案自行外出就医按60%结算。']
    }
  }
};
