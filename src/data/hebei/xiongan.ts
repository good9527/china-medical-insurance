import type { CityInsuranceData } from '../types';

export const xionganData: CityInsuranceData = {
  cityCode: '133100',
  cityName: '雄安新区',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0312-12393',
  officialPortalUrl: 'http://www.xiongan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'xa-employee-resident-2022',
      title: '河北雄安新区职工基本医疗保险和生育保险实施办法（试行）及门诊共济方案',
      docNumber: '冀雄政办发〔2022〕15号',
      issuingDept: ['河北雄安新区管理委员会公共服务局', '雄安新区党工委管委会办公室'],
      publishDate: '2022-09-20',
      effectiveDate: '2022-10-01',
      status: 'active',
      officialUrl: 'http://www.xiongan.gov.cn/2022-09/25/c_121168921.htm',
      summaryQuote: '雄安新区职工医保门诊统筹年度起付标准：在职职工900元，退休人员650元；起付标准以上统筹支付比例：二级及以下定点医疗机构80%，三级定点医疗机构60%。门急诊统筹年度最高支付限额10000元。职工统筹基金年度累计最高支付限额65万元。京雄医保目录互通互认，待遇不低于北京。'
    },
    {
      docId: 'xa-resident-inpatient-2023',
      title: '河北雄安新区城乡居民基本医疗保险门诊及住院保障实施细则',
      docNumber: '冀雄公服发〔2023〕18号',
      issuingDept: ['河北雄安新区管理委员会公共服务局'],
      publishDate: '2023-04-10',
      effectiveDate: '2023-05-01',
      status: 'active',
      officialUrl: 'http://www.xiongan.gov.cn/2023-04/15/c_121179432.htm',
      summaryQuote: '居民医保普通门诊一级及以下报销90%，二级及以上报销75%，二档缴费取消起付线；居民住院起付线一级200元、二级500元、三级1000元，报销比例对应90%、80%、65%，年度最高限额20万-25万元。大病保险起付线1.3万元，报销比例60%-80%。'
    }
  ],

  // 城镇职工医保待遇 (雄安高标准)
  employee: {
    outpatient: {
      sourceDocId: 'xa-employee-resident-2022',
      annualDeductible: 900, // 门诊年度起付线 在职900元 (退休650元)
      annualCap: 10000,      // 门急诊统筹年度限额高达 10000 元
      annualCapRetiree: 10000, // 退休限额 10000 元
      tierBenefits: {
        community: { tierName: '二级及以下基层医疗机构', deductible: 900, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 900, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 900, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '国家/省部重点医疗机构', deductible: 900, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职900元，退休650元。二级及以下定点报销80%，三级报销60%，退休人员提高5个百分点。年度支付限额高达10000元。'
    },
    inpatient: {
      sourceDocId: 'xa-employee-resident-2022',
      annualCap: 650000, // 雄安统筹限额高达 65 万元
      tierBenefits: {
        community: { tierName: '基层医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '新区及直属三级医院', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '京津及省直顶尖重点医院', deductible: 1000, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至200元。'
    },
    catastrophic: {
      sourceDocId: 'xa-employee-resident-2022',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 650000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xa-employee-resident-2022',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序', '雄安办医保'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 1.0, // 京津冀免备案，待遇同城化
      unfiledEmergencyRatio: 0.95,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '雄安新区与北京市实现医保目录同城化覆盖，京津冀直接免备案结算并享受本地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (雄安高标准)
  resident: {
    outpatient: {
      sourceDocId: 'xa-resident-inpatient-2023',
      annualCap: 400, // 普通门诊统筹年度最高限额 400 元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 0, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.75 },
        tier3_top: { tierName: '顶尖医疗机构', deductible: 0, reimbursementRatio: 0.75 }
      },
      note: '居民门诊一级及以下报销90%，二级及以上报销75%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'xa-resident-inpatient-2023',
      annualCap: 250000, // 居民年度限额 25 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省属/京津定点医院', deductible: 1200, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'xa-resident-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 350000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xa-resident-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.75,
      specialNotes: [
        '京津冀区域就医视同备案直接联网结算。'
      ]
    }
  }
};
