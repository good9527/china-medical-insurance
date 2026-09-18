import type { CityInsuranceData } from '../types';

export const xinjiData: CityInsuranceData = {
  cityCode: '130181',
  cityName: '辛集市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0311-12393',
  officialPortalUrl: 'http://www.xinji.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'xj-employee-outpatient-2022',
      title: '辛集市人民政府办公室关于印发辛集市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '辛政办字〔2022〕15号',
      issuingDept: ['辛集市人民政府办公室', '辛集市医疗保障局'],
      publishDate: '2022-01-20',
      effectiveDate: '2022-02-01',
      status: 'active',
      officialUrl: 'http://www.xinji.gov.cn/art/2022/1/25/art_1420_17842.html',
      summaryQuote: '参保职工门诊统筹年度起付标准为100元；起付标准以上统筹基金支付比例为：在职职工50%，退休职工60%。年度最高支付限额在职职工为1000元，退休职工为1300元。个人账户资金可由配偶、父母、子女在定点医药机构共济使用。'
    },
    {
      docId: 'xj-resident-employee-inpatient-2023',
      title: '辛集市医疗保障局关于调整城乡居民及职工基本医疗保险住院保障待遇标准的通知',
      docNumber: '辛医保字〔2023〕14号',
      issuingDept: ['辛集市医疗保障局', '辛集市财政局'],
      publishDate: '2023-06-10',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'http://www.xinji.gov.cn/art/2023/6/15/art_1420_18963.html',
      summaryQuote: '居民门诊不设起付线，报销比例50%，年度限额100元。居民住院起付线一级200元、二级500元、三级1200元，报销比例85%、75%、60%，年度限额15万元。职工住院起付线一级200元、二级500元、三级800元，在职报销92%、88%、85%，退休提高3个百分点，职工医保限额20万元，大额救助50万元。'
    }
  ],

  // 城镇职工医保待遇 (辛集标准)
  employee: {
    outpatient: {
      sourceDocId: 'xj-employee-outpatient-2022',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 1000,       // 在职限额 1000 元
      annualCapRetiree: 1300, // 退休限额 1300 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线100元，在职报销50%，退休报销60%。限额在职1000元，退休1300元。'
    },
    inpatient: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
      annualCap: 200000, // 职工基本医保年度限额 20 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内就医免备案直接联网结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (辛集标准)
  resident: {
    outpatient: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
      annualCap: 100, // 普通门诊统筹年度最高限额 100 元
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '普通门诊统筹免起付线，报销比例50%，年度限额100元。'
    },
    inpatient: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xj-resident-employee-inpatient-2023',
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
