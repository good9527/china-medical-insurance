import type { CityInsuranceData } from '../types';

/**
 * 北京市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹级别：直辖市级统筹（全市统一标准）
 */
export const beijingCityData: CityInsuranceData = {
  cityCode: '110100',
  cityName: '北京市',
  provinceCode: '110000',
  provinceName: '北京市',
  hotline: '010-12393',
  officialPortalUrl: 'https://ybj.beijing.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'bj-employee-outpatient-reform',
      title: '北京市医疗保障局关于调整本市职工基本医疗保险门诊报销待遇有关问题的通知',
      docNumber: '京医保发〔2022〕28号',
      issuingDept: ['北京市医疗保障局', '北京市财政局'],
      publishDate: '2022-08-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.beijing.gov.cn/zfxxgk/2022zc/202208/t20220810_2791880.html',
      summaryQuote: '自2023年1月1日起，参保人员在定点医疗机构发生的门诊医疗费用，不再设置封顶线。在职职工门诊起付线为1800元，社区卫生服务机构报销90%、其他医疗机构报销70%；退休人员起付线1300元，社区报销90%，其他医疗机构报销85%至90%。'
    },
    {
      docId: 'bj-employee-inpatient-basic',
      title: '北京市统筹地区基本医疗保险规定及其实施细则',
      docNumber: '北京市人民政府令第158号及调整规程',
      issuingDept: ['北京市人民政府', '北京市医疗保障局'],
      publishDate: '2021-12-15',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.beijing.gov.cn/zwgk/zcfg/202112/t20211230_2577626.html',
      summaryQuote: '本市城镇职工基本医疗保险参保人员住院起付标准为：年度内第一次住院1300元，第二次及以后650元。基本医疗保险统筹基金最高支付限额为50万元。在职职工三级医院分段报销85%至95%，一级医疗机构报销90%至97%。'
    },
    {
      docId: 'bj-resident-inpatient-basic',
      title: '北京市城乡居民基本医疗保险办法实施细则',
      docNumber: '京人社医发〔2017〕250号及市医保局现行调整标准',
      issuingDept: ['北京市人力资源和社会保障局', '北京市医疗保障局'],
      publishDate: '2017-12-01',
      effectiveDate: '2018-01-01',
      status: 'active',
      officialUrl: 'https://ybj.beijing.gov.cn/zwgk/zcfg/201801/t20180105_198425.html',
      summaryQuote: '城乡居民在定点医疗机构门诊起付线：一级及以下100元（报销55%）、二级及三级550元（报销50%），年度最高支付限额为5000元。住院起付线：一级300元（报销80%）、二级800元（报销75%）、三级1300元（报销75%-78%），年度最高支付限额为25万元。'
    },
    {
      docId: 'bj-catastrophic-official',
      title: '北京市城乡居民大病保险办法及年度起付线动态调整公告',
      docNumber: '京医保发〔2024〕12号',
      issuingDept: ['北京市医疗保障局', '北京市财政局'],
      publishDate: '2024-04-18',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.beijing.gov.cn/zfxxgk/2024zc/202404/t20240418_3622419.html',
      summaryQuote: '大病保险实行二次报销，2024-2025年起付线为30404元。起付线以上至5万元（含）报销60%，5万元以上部分报销70%，不设封顶线。'
    },
    {
      docId: 'bj-family-sharing-2024',
      title: '北京市医疗保障局关于进一步规范和推进基本医疗保险个人账户家庭共济使用工作的通知',
      docNumber: '京医保发〔2024〕15号',
      issuingDept: ['北京市医疗保障局', '北京市财政局', '国家税务总局北京市税务局'],
      publishDate: '2024-07-20',
      effectiveDate: '2024-08-01',
      status: 'active',
      officialUrl: 'https://ybj.beijing.gov.cn/zfxxgk/2024zc/202407/t20240722_3751289.html',
      summaryQuote: '职工基本医疗保险个人账户结余资金，可用于支付参保人员本人及其配偶、父母、子女在定点医药机构就医购药发生的由个人负担的医疗费用，以及参加城乡居民医保等的个人缴费。'
    }
  ],

  // 城镇职工医保待遇 (北京标准)
  employee: {
    outpatient: {
      sourceDocId: 'bj-employee-outpatient-reform',
      annualDeductible: 1800, // 在职门诊年起付线 1800 元
      annualDeductibleRetiree: 1300, // 退休人员门诊年起付线 1300 元
      annualCap: 9999999,     // 北京自2023年起取消职工门诊封顶线（上不封顶）
      annualCapRetiree: 9999999,
      tierBenefits: {
        community: { tierName: '社区卫生服务机构/乡镇卫生院', deductible: 1800, reimbursementRatio: 0.90, retireeRatioBonus: 0.00 },
        tier1: { tierName: '一级定点医疗机构', deductible: 1800, reimbursementRatio: 0.90, retireeRatioBonus: 0.00 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1800, reimbursementRatio: 0.70, retireeRatioBonus: 0.15 }, // 退休报销85%
        tier3: { tierName: '三级定点医疗机构', deductible: 1800, reimbursementRatio: 0.70, retireeRatioBonus: 0.15 },
        tier3_top: { tierName: '三甲综合医院/专科医院', deductible: 1800, reimbursementRatio: 0.70, retireeRatioBonus: 0.15 }
      },
      note: '在职职工门诊起付线为 1800 元，退休人员门诊起付线为 1300 元。2023年起取消门诊最高支付限额，实施上不封顶。'
    },
    inpatient: {
      sourceDocId: 'bj-employee-inpatient-basic',
      annualCap: 500000, // 基本医疗保险统筹基金年封顶线 50 万元
      tierBenefits: {
        community: { tierName: '一级及社区卫生服务机构', deductible: 1300, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 1300, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 1300, reimbursementRatio: 0.87, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1300, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 1300, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '本年度第一次住院起付线1300元，第二次及以后住院起付线减半为650元。'
    },
    catastrophic: {
      sourceDocId: 'bj-catastrophic-official',
      name: '城镇职工大病医疗保障（二次报销）',
      deductible: 30404,
      tiers: [
        { minAmount: 30404, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bj-employee-inpatient-basic',
      filingChannels: ['国家医保服务平台APP', '北京医保微信公众号', '北京医保公共服务平台'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内就医已实现“视同备案”，参保人员在津冀定点医院就医享受参保地同等报销待遇。',
        '跨省临时就医未备案人员，统筹基金支付比例按规定下浮。'
      ]
    }
  },

  // 城乡居民医保待遇 (北京标准)
  resident: {
    outpatient: {
      sourceDocId: 'bj-resident-inpatient-basic',
      annualDeductible: 100, // 基层起付线100元，二级三级550元
      annualCap: 5000,       // 门诊年最高支付限额 5000 元/人
      tierBenefits: {
        community: { tierName: '一级及基层社区卫生服务机构', deductible: 100, reimbursementRatio: 0.55 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.55 },
        tier2: { tierName: '二级定点医疗机构', deductible: 550, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点医疗机构', deductible: 550, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '三甲定点医疗机构', deductible: 550, reimbursementRatio: 0.50 }
      },
      note: '门急诊起付标准：一级及以下100元（报销55%），二级及以上550元（报销50%），年度累计封顶5000元。'
    },
    inpatient: {
      sourceDocId: 'bj-resident-inpatient-basic',
      annualCap: 250000, // 居民住院年最高限额 25 万元
      tierBenefits: {
        community: { tierName: '一级及社区卫生服务机构', deductible: 300, reimbursementRatio: 0.80 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.78 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1300, reimbursementRatio: 0.75 },
        tier3_top: { tierName: '区属三级医疗机构', deductible: 1300, reimbursementRatio: 0.78 }
      },
      repeatedDeductibleRule: '老年人和劳动年龄内居民一个年度内第二次及以后住院起付线减半；学生儿童住院起付线均减半。'
    },
    catastrophic: {
      sourceDocId: 'bj-catastrophic-official',
      name: '城乡居民大病保险',
      deductible: 30404,
      tiers: [
        { minAmount: 30404, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bj-employee-inpatient-basic',
      filingChannels: ['国家医保服务平台APP', '北京医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀异地就医免备案，普通门诊与住院直接刷卡实时结算。'
      ]
    }
  }
};
