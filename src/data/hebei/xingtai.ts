import type { CityInsuranceData } from '../types';

export const xingtaiData: CityInsuranceData = {
  cityCode: '130500',
  cityName: '邢台市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0319-12393',
  officialPortalUrl: 'https://ybj.xingtai.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'xt-employee-outpatient-2021',
      title: '邢台市人民政府办公室关于建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '邢政办发〔2021〕8号',
      issuingDept: ['邢台市人民政府办公室', '邢台市医疗保障局'],
      publishDate: '2021-12-29',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://www.xingtai.gov.cn/zwgk/zfwj/zfbwj/202112/t20211231_794215.html',
      summaryQuote: '参保职工门诊统筹年度起付标准为100元；起付标准以上由统筹基金支付：在职人员支付比例为50%，退休人员为60%。使用中医药治疗的支付比例提高20个百分点。自2023年7月1日起，统筹基金年度最高支付限额在职职工调整为1600元，退休人员调整为2000元。'
    },
    {
      docId: 'xt-resident-inpatient-outpatient-2023',
      title: '邢台市医疗保障局关于印发邢台市城乡居民医保门诊统筹及住院待遇管理细则的通知',
      docNumber: '邢医保发〔2023〕12号',
      issuingDept: ['邢台市医疗保障局', '邢台市财政局'],
      publishDate: '2023-05-18',
      effectiveDate: '2023-06-01',
      status: 'active',
      officialUrl: 'https://ybj.xingtai.gov.cn/art/2023/5/22/art_1435_16781.html',
      summaryQuote: '居民普通门诊不设起付线，村卫生室报销90%（年限额70元），乡镇卫生院报销80%（年限额400元）。居民住院起付线：一级200元、二级600元、三级1200元，支付比例对应为85%、75%、60%，年度限额15万元；职工住院起付线一级200元、二级500元、三级800元，在职支付比例93%、88%、85%，退休提高3个百分点，职工医保年度限额20万元，大额补助50万元。'
    }
  ],

  // 城镇职工医保待遇 (邢台标准)
  employee: {
    outpatient: {
      sourceDocId: 'xt-employee-outpatient-2021',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 1600,       // 在职限额 1600 元
      annualCapRetiree: 2000, // 退休限额 2000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线100元，在职报销50%，退休报销60%。中医药治疗额外提高20个百分点。限额在职1600元，退休2000元。'
    },
    inpatient: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      annualCap: 200000, // 职工基本医保年度限额 20 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内医疗机构就医视同备案，直接联网结算并享受本地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (邢台标准)
  resident: {
    outpatient: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      annualCap: 400, // 乡镇卫生院门诊统筹年度最高限额 400 元 (村卫生室70元)
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 0, reimbursementRatio: 0.80 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '普通门诊统筹不设起付线，村卫生室报销90%（限额70元），乡镇卫生院报销80%（限额400元）。'
    },
    inpatient: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xt-resident-inpatient-outpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '京津冀区域内就医免备案直接结算。'
      ]
    }
  }
};
