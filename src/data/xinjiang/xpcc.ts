import type { CityInsuranceData } from '../types';

export const xpccCityData: CityInsuranceData = {
  cityCode: '660000',
  cityName: '新疆生产建设兵团',
  provinceCode: '660000',
  provinceName: '新疆生产建设兵团',
  hotline: '0991-12393',
  officialPortalUrl: 'http://ybj.xjbt.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'xpcc-employee-outpatient-2022-2',
      title: '新疆生产建设兵团职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '兵医保规〔2022〕2号',
      issuingDept: ['新疆生产建设兵团医疗保障局', '新疆生产建设兵团财政局'],
      publishDate: '2022-10-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xjbt.gov.cn/zwgk/zcfg/202210/t20221025_4812390.html',
      summaryQuote: '普通门诊统筹起付标准一级及以下机构20元、二级机构50元、三级机构100元。统筹支付比例一级75%、二级65%、三级55%，退休人员相应提高5个百分点（80%、70%、60%）。门诊统筹年度最高支付限额在职2500元，退休人员3000元。'
    },
    {
      docId: 'xpcc-medical-insurance-inpatient-2024',
      title: '新疆生产建设兵团医疗保障待遇清单及全团统筹住院支付细则',
      docNumber: '兵医保发〔2024〕18号',
      issuingDept: ['新疆生产建设兵团医疗保障局', '新疆生产建设兵团财政局'],
      publishDate: '2024-10-15',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xjbt.gov.cn/zwgk/zcfg/202410/t20241020_6319802.html',
      summaryQuote: '职工住院起付线：三级800元、二级400元、一级200元；在职支付比例三级85%、二级88%、一级90%（退休人员相应提高至88%、91%、93%）。基本统筹限额12万元，叠加职工大额救助最高支付限额55万元。居民住院起付线三级800元/60%、二级400元/75%、一级200元/85%。居民大病保险起付线1.2万元，分段报销60%-75%。'
    }
  ],

  // 城镇职工医保待遇 (兵团直辖各师市统筹标准)
  employee: {
    outpatient: {
      sourceDocId: 'xpcc-employee-outpatient-2022-2',
      annualDeductible: 100, // 门诊年度基准起付线
      annualCap: 2500,       // 在职限额 2500 元
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '团场连队卫生室及一级定点医疗机构', deductible: 20, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 20, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '师市二级定点医疗机构', deductible: 50, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '兵团直属及三级定点医疗机构', deductible: 100, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 100, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊统筹起付线一级20元、二级50元、三级100元。在职报销55%-75%，退休提高5%（60%-80%）。限额在职2500元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      annualCap: 550000, // 基本统筹12万 + 兵团职工大额互助
      tierBenefits: {
        community: { tierName: '团场连队卫生院/一级机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier2: { tierName: '师市二级定点医疗机构', deductible: 400, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '师市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '兵团直属三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '全团范围内定点医疗机构就医直接联网结算，同一自然年度内多次住院起付线按规定依次递减。'
    },
    catastrophic: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      name: '兵团职工大额医疗互助',
      deductible: 0,
      annualCap: 550000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '兵团医保微信公众号', '兵团政务APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '涵盖第一师阿拉尔、第二师铁门关、第三师图木舒克、第四师可克达拉、第五师双河、第六师五家渠、第七师胡杨河、第八师石河子、第九师白杨、第十师北屯、第十一师、第十二师、第十三师新星、第十四师昆玉各师市参保人员。'
      ]
    }
  },

  // 城乡居民医保待遇 (兵团城乡居民统筹标准)
  resident: {
    outpatient: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      annualCap: 200, // 居民普通门诊年度限额 200 元
      tierBenefits: {
        community: { tierName: '团场连队基层卫生室', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医院（未纳入门诊统筹）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点医院（未纳入门诊统筹）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '兵团直属三甲医院（未纳入门诊统筹）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层医疗机构免起付线，报销50%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '团场连队基层医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '师市二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '师市三级定点医疗机构', deductible: 800, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '兵团直属重点三甲医院', deductible: 800, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      name: '兵团城乡居民大病保险',
      deductible: 12000,
      annualCap: 350000,
      tiers: [
        { minAmount: 12000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xpcc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '兵团医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定办理转诊手续或备案的外出就医人员，支付比例相应降低。'
      ]
    }
  }
};
