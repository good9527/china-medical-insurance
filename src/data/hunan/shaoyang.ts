import type { CityInsuranceData } from '../types';

/**
 * 邵阳市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：430500
 */
export const shaoyangCityData: CityInsuranceData = {
  cityCode: '430500',
  cityName: '邵阳市',
  provinceCode: '430000',
  provinceName: '湖南省',
  hotline: '0739-12393 / 0739-5322966',
  officialPortalUrl: 'http://ybj.shaoyang.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'sy-employee-outpatient-2022',
      title: '关于印发邵阳市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '邵市政办发〔2022〕22号',
      issuingDept: ['邵阳市人民政府办公室', '邵阳市医疗保障局'],
      publishDate: '2022-09-18',
      effectiveDate: '2022-10-01',
      status: 'active',
      officialUrl: 'http://ybj.shaoyang.gov.cn/zwgk/zcfg/202209/t20220922_1629831.html',
      summaryQuote: '邵市政办发〔2022〕22号明确：在职职工门诊统筹年度最高支付限额1500元，退休人员2000元。一级医疗机构及基层医疗卫生机构不设起付标准，统筹支付比例70%；二级医疗机构起付标准200元，支付比例60%；三级医疗机构起付标准300元，支付比例60%。一个自然年度内起付标准累计不超过300元，退休人员统筹支付比例上浮5%。'
    },
    {
      docId: 'sy-inpatient-regulations-2023',
      title: '邵阳市基本医疗保险住院与医疗救助待遇管理规程',
      docNumber: '邵医保发〔2023〕21号',
      issuingDept: ['邵阳市医疗保障局', '邵阳市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.shaoyang.gov.cn/zwgk/zcjd/202311/t20231128_1682910.html',
      summaryQuote: '住院起付标准：基层医疗机构200元、一级500元、二级800元、三级1200元、省部属2000元。在职职工统筹支付比例：基层93%、一级92%、二级90%、三级85%、省部属80%，退休人员分别提高2个百分点。城乡居民医保住院支付比例：基层85%、一级82%、二级80%、三级65%、省部属60%。同年度同级别第二次及以上住院起付线减半。职工统筹基金年度最高支付限额15万元，大额救助最高50万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'sy-employee-outpatient-2022',
      annualDeductible: 300,
      annualCap: 1500,
      annualCapRetiree: 2000,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '市级三级定点医疗机构', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省部属三级医院', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线累计300元。基层免起付线报销70%，二级起付200元报销60%，三级起付300元报销60%（退休增加5%）；在职限额1500元，退休限额2000元。'
    },
    inpatient: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '基层卫生机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '省部属重点医疗机构', deductible: 2000, reimbursementRatio: 0.80, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度同级别医疗机构第二次及以上住院，起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      name: '邵阳市职工大额医疗费用补助',
      deductible: 150000,
      annualCap: 500000,
      tiers: [
        { minAmount: 150000, maxAmount: 650000, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湘医保小程序', '邵阳医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省或省内异地就医直接结算，规范转诊备案人员享受参保地同等级别报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销70%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.82 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省部属医疗机构', deductible: 2000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '同级别第二次及以上住院起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      name: '邵阳市城乡居民大病保险',
      deductible: 16000,
      annualCap: 400000,
      tiers: [
        { minAmount: 16000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sy-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湘医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定转诊备案自行外出就医的，支付比例相应降低。'
      ]
    }
  }
};
