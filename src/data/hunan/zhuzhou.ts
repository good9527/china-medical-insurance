import type { CityInsuranceData } from '../types';

/**
 * 株洲市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：430200
 */
export const zhuzhouCityData: CityInsuranceData = {
  cityCode: '430200',
  cityName: '株洲市',
  provinceCode: '430000',
  provinceName: '湖南省',
  hotline: '0731-12393 / 0731-28681552',
  officialPortalUrl: 'http://ybj.zhuzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'zz-employee-outpatient-2022',
      title: '关于印发株洲市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '株政办发〔2022〕16号',
      issuingDept: ['株洲市人民政府办公室', '株洲市医疗保障局'],
      publishDate: '2022-08-20',
      effectiveDate: '2022-10-01',
      status: 'active',
      officialUrl: 'http://ybj.zhuzhou.gov.cn/c16723/20220825/i1928301.html',
      summaryQuote: '株政办发〔2022〕16号明确：在职职工普通门诊统筹年度最高支付限额1500元，退休人员2000元。一级及基层定点医疗卫生机构不设起付标准，统筹基金支付比例70%；二级定点医疗机构起付线200元，支付比例60%；三级定点医疗机构起付线300元，支付比例60%。一个自然年度内起付标准累计不超过300元，退休人员统筹支付比例相应提高5个百分点。'
    },
    {
      docId: 'zz-inpatient-regulations-2023',
      title: '株洲市基本医疗保险和生育保险住院待遇实施办法',
      docNumber: '株医保发〔2023〕18号',
      issuingDept: ['株洲市医疗保障局', '株洲市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.zhuzhou.gov.cn/c16723/20231128/i1982310.html',
      summaryQuote: '住院起付标准：基层医疗卫生机构200元、一级500元、二级800元、三级1200元、省部属2000元。在职职工统筹支付比例：一级92%、二级90%、三级85%、省部属80%，退休人员增加2%。居民医保住院支付比例：基层85%、一级82%、二级80%、三级65%、省部属60%。同年度内同级别第二次及以上住院起付标准减半。职工统筹年度限额15万元，大额救助最高50万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'zz-employee-outpatient-2022',
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
      note: '门诊年度起付线累计300元。基层免起付线报销70%，二级起付200元报销60%，三级起付300元报销60%（退休上浮5%）；在职限额1500元，退休限额2000元。'
    },
    inpatient: {
      sourceDocId: 'zz-inpatient-regulations-2023',
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
      sourceDocId: 'zz-inpatient-regulations-2023',
      name: '株洲市职工大额医疗费用补助',
      deductible: 150000,
      annualCap: 500000,
      tiers: [
        { minAmount: 150000, maxAmount: 650000, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zz-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湘医保小程序', '株洲医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医免备案直接结算，跨省异地就医规范备案享受同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'zz-inpatient-regulations-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销70%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'zz-inpatient-regulations-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.82 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1200, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省部属医疗机构', deductible: 2000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '同级别第二次及以上住院起付线减半，年度累计不超过3000元。'
    },
    catastrophic: {
      sourceDocId: 'zz-inpatient-regulations-2023',
      name: '株洲市城乡居民大病保险',
      deductible: 16000,
      annualCap: 400000,
      tiers: [
        { minAmount: 16000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zz-inpatient-regulations-2023',
      filingChannels: ['国家医保服务平台APP', '湘医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定转诊备案自行跨区域就医的，支付比例相应降低。'
      ]
    }
  }
};
