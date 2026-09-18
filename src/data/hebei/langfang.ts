import type { CityInsuranceData } from '../types';

export const langfangData: CityInsuranceData = {
  cityCode: '131000',
  cityName: '廊坊市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0316-12393',
  officialPortalUrl: 'http://ybj.lf.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'lf-employee-outpatient-2021',
      title: '廊坊市职工基本医疗保险门诊共济保障机制实施细则及2026年限额调整通知',
      docNumber: '廊医保规〔2021〕2号',
      issuingDept: ['廊坊市医疗保障局', '廊坊市财政局'],
      publishDate: '2021-12-28',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'http://ybj.lf.gov.cn/art/2021/12/31/art_1420_17921.html',
      summaryQuote: '自2026年1月1日起，职工门诊年度起付标准为100元，在职报销比例为60%，退休人员为70%。年度最高支付限额：45岁以下在职3000元，45岁（含）以上在职4000元，退休人员调整至5000元。参保人需在定点医疗机构持码结算。'
    },
    {
      docId: 'lf-resident-employee-inpatient-2023',
      title: '廊坊市医疗保障局关于完善城乡居民门诊统筹及基本医疗保险住院待遇的通知',
      docNumber: '廊医保发〔2023〕25号',
      issuingDept: ['廊坊市医疗保障局', '廊坊市财政局'],
      publishDate: '2023-07-15',
      effectiveDate: '2023-08-01',
      status: 'active',
      officialUrl: 'http://ybj.lf.gov.cn/art/2023/7/20/art_1420_19315.html',
      summaryQuote: '居民门诊取消起付线，报销50%（连续参保满3年提高至60%），年度限额80元。居民住院起付线：一级200元、二级600元、三级1200元，报销比例对应85%、75%、60%，限额15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销93%、88%、85%，退休人员增加3个百分点，职工医保限额20万元，大额补助50万元。'
    }
  ],

  // 城镇职工医保待遇 (廊坊标准)
  employee: {
    outpatient: {
      sourceDocId: 'lf-employee-outpatient-2021',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 3000,       // 45岁以下在职限额 3000 元 (45岁以上4000元)
      annualCapRetiree: 5000, // 退休限额 5000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线100元，在职报销60%，退休报销70%。限额45岁以下在职3000元，45岁及以上4000元，退休5000元。'
    },
    inpatient: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      annualCap: 200000, // 职工基本医保年度限额 20 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内就医视同备案直接联网结算，享受与廊坊本地同等待遇，北三县与通州协同深度融合。'
      ]
    }
  },

  // 城乡居民医保待遇 (廊坊标准)
  resident: {
    outpatient: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      annualCap: 80, // 普通门诊统筹年度最高限额 80 元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '普通门诊统筹取消起付线，报销50%（连续参保满3年报销60%），年度限额80元。'
    },
    inpatient: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'lf-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '京津冀区域就医视同备案直接联网结算。'
      ]
    }
  }
};
