import type { CityInsuranceData } from '../types';

export const chengdeData: CityInsuranceData = {
  cityCode: '130800',
  cityName: '承德市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0314-12393',
  officialPortalUrl: 'http://ybj.chengde.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'cd-employee-outpatient-2021',
      title: '承德市关于建立健全职工基本医疗保险门诊共济保障机制的实施细则及2024年待遇提升通知',
      docNumber: '承政办规〔2021〕6号',
      issuingDept: ['承德市人民政府办公室', '承德市医疗保障局'],
      publishDate: '2021-12-26',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'http://ybj.chengde.gov.cn/art/2021/12/30/art_1120_17421.html',
      summaryQuote: '参保职工门诊统筹年度起付标准为100元；起付标准以上政策范围内费用，在职职工支付比例为50%，退休人员支付比例为60%。根据承德市2024年度医疗保障提升工程政策，职工医保门诊统筹年度最高支付限额已由原1200元提高至2000元。个人账户资金可用于配偶、父母、子女在定点医药机构共济结算。'
    },
    {
      docId: 'cd-resident-employee-inpatient-2022',
      title: '承德市城乡居民基本医疗保险及城镇职工住院保障待遇细则',
      docNumber: '承政规〔2022〕2号',
      issuingDept: ['承德市人民政府', '承德市医疗保障局'],
      publishDate: '2022-04-10',
      effectiveDate: '2022-05-01',
      status: 'active',
      officialUrl: 'http://ybj.chengde.gov.cn/art/2022/4/15/art_1120_18632.html',
      summaryQuote: '居民住院起付线：一级（含乡镇卫生院）200元、二级600元、三级1200元；报销比例分别为85%、75%、60%，年度最高支付限额15万元，大病最高支付30万元。职工住院起付线一级200元、二级500元、三级800元，在职报销92%、88%、85%，退休人员报销比例提高3个百分点，基本医保年度限额20万元，大额救助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (承德标准)
  employee: {
    outpatient: {
      sourceDocId: 'cd-employee-outpatient-2021',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 2000,       // 2024年提升工程调整：职工门诊统筹年度限额提高至 2000 元
      annualCapRetiree: 2000, // 退休限额 2000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线100元，在职报销50%，退休报销60%。2024年医疗保障提升工程将统筹限额提高至2000元。'
    },
    inpatient: {
      sourceDocId: 'cd-resident-employee-inpatient-2022',
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
      sourceDocId: 'cd-resident-employee-inpatient-2022',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cd-resident-employee-inpatient-2022',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内就医免备案直接结算，享受与承德本地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (承德标准)
  resident: {
    outpatient: {
      sourceDocId: 'cd-resident-employee-inpatient-2022',
      annualCap: 200, // 普通门诊统筹年度最高限额 200 元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊统筹基层定点报销50%，年度统筹限额200元；二级及三级医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'cd-resident-employee-inpatient-2022',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'cd-resident-employee-inpatient-2022',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cd-resident-employee-inpatient-2022',
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
