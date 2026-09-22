import type { CityInsuranceData } from '../types';

export const maanshanData: CityInsuranceData = {
  cityCode: '340500',
  cityName: '马鞍山市',
  provinceCode: '340000',
  provinceName: '安徽省',
  hotline: '0555-12393',
  officialPortalUrl: 'http://ybj.mas.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'mas-employee-outpatient-2022',
      title: '马鞍山市建立健全职工基本医疗保险门诊共济保障机制实施方案',
      docNumber: '马医保发〔2022〕18号',
      issuingDept: ['马鞍山市医疗保障局', '马鞍山市财政局'],
      publishDate: '2022-06-25',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://ybj.mas.gov.cn/zcfg/zcjd/7123912.html',
      summaryQuote: '普通门诊统筹起付标准：一级及以下医疗机构200元，二级及三级医疗机构400元。起付线以上统筹基金支付比例：在职职工一级60%、二级及三级50%；退休人员支付比例分别提高5个百分点（一级65%、二级及三级55%）。年度统筹基金最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'mas-resident-employee-inpatient-2023',
      title: '马鞍山市基本医疗保险待遇保障实施细则及年度保障标准通知',
      docNumber: '马医保发〔2023〕14号',
      issuingDept: ['马鞍山市医疗保障局', '马鞍山市财政局'],
      publishDate: '2023-05-15',
      effectiveDate: '2023-06-01',
      status: 'active',
      officialUrl: 'http://ybj.mas.gov.cn/zcfg/gfxwj/7184201.html',
      summaryQuote: '居民门诊免起付线，基层报销55%，年度限额150元。居民住院起付线一级200元、二级500元、三级800元，支付比例对应85%、80%、70%，年度最高限额30万元。职工住院起付线一级200元、二级400元、三级600元，在职报销94%、92%、90%，退休提高3个百分点，职工医保限额30万元，大病救助最高支付50万元。'
    }
  ],

  // 城镇职工医保待遇 (马鞍山标准)
  employee: {
    outpatient: {
      sourceDocId: 'mas-employee-outpatient-2022',
      annualDeductible: 400, // 门诊年度起付线 (基层200元，二三级400元)
      annualCap: 2000,       // 在职限额 2000 元
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '基层一级医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线一级200元、二级及三级400元。在职报销一级60%、二三级50%；退休人员提高5个百分点。限额在职2000元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      annualCap: 300000, // 职工基本医保限额 30 万元
      tierBenefits: {
        community: { tierName: '一级机构及社区卫生服务中心', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      name: '职工大病医疗救助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序', '皖事通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角区域异地就医免备案直接联网结算，南京马鞍山同城化医保待遇协同推进。'
      ]
    }
  },

  // 城乡居民医保待遇 (马鞍山标准)
  resident: {
    outpatient: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      annualCap: 150, // 依据皖医保发〔2024〕9号，普通门诊统筹年度限额150元
      tierBenefits: {
        community: { tierName: '基层卫生院/社区服务中心', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '依据皖医保发〔2024〕9号，居民普通门诊统筹在基层及一级定点医疗机构免起付线报销60%，年度限额150元。二级及以上医疗机构未纳普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      annualCap: 300000, // 居民基本医保年度封顶 30 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'mas-resident-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '安徽医保公共服务小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '长三角区域就医视同备案直接联网结算。'
      ]
    }
  }
};
