import type { CityInsuranceData } from '../types';

export const jilinCityData: CityInsuranceData = {
  cityCode: '220200',
  cityName: '吉林市',
  provinceCode: '220000',
  provinceName: '吉林省',
  hotline: '0432-12393',
  officialPortalUrl: 'http://ybj.jlcity.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'jl-employee-outpatient-2022',
      title: '吉林市人民政府办公室关于印发吉林市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '吉市政办发〔2022〕26号',
      issuingDept: ['吉林市人民政府办公室', '吉林市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jlcity.gov.cn/zwgk/zcfg/202212/t20221226_1128392.html',
      summaryQuote: '职工门诊起付标准按自然年度累计计算：一级及以下100元、二级200元、三级300元。政策范围内报销比例：在职职工一级及以下60%、二级55%、三级50%（退休人员各项提高5个百分点，达65%/60%/55%）。普通门诊统筹年度最高支付限额在职及退休人员均为1000元。'
    },
    {
      docId: 'jl-medical-insurance-policy-2023',
      title: '关于调整吉林市基本医疗保险有关待遇政策的通知',
      docNumber: '吉市医保发〔2023〕18号',
      issuingDept: ['吉林市医疗保障局', '吉林市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.jlcity.gov.cn/zwgk/zcfg/202311/t20231125_1239482.html',
      summaryQuote: '城乡居民普通门诊统筹定点基层机构免起付线，报销50%，年度限额200元。居民住院起付线一级200元、二级500元、三级900元，政策范围内报销比例一级85%、二级75%、三级60%，统筹年度限额10万元。职工住院起付线一级300元、二级500元、三级800元，在职报销92%、88%、85%，退休提高3个百分点。'
    }
  ],

  // 城镇职工医保待遇 (吉林市标准)
  employee: {
    outpatient: {
      sourceDocId: 'jl-employee-outpatient-2022',
      annualDeductible: 100,
      annualCap: 1000,
      annualCapRetiree: 1000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三甲重点医疗机构', deductible: 300, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线累计计算（一级100元、二级200元、三级300元）。达到起付线后在职报销比例：一级60%、二级55%、三级50%（退休人员各项提高5%，即65%/60%/55%）。普通门诊统筹年度最高支付限额1000元。'
    },
    inpatient: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '一级基层定点机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省级三甲医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减100元，最低降至100元。'
    },
    catastrophic: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      filingChannels: ['国家医保服务平台APP', '吉事办', '吉林市医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地就医备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (吉林市标准)
  resident: {
    outpatient: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      annualCap: 200,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0 },
        tier3_top: { tierName: '三级甲等医疗机构', deductible: 0, reimbursementRatio: 0 }
      },
      note: '居民门诊统筹仅在基层机构免起付享受，报销50%，年度限额200元。'
    },
    inpatient: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      annualCap: 100000,
      tierBenefits: {
        community: { tierName: '基层医疗机构/卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省级重点医院', deductible: 1200, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      name: '城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'jl-medical-insurance-policy-2023',
      filingChannels: ['国家医保服务平台APP', '吉事办', '吉林市医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '未办理转诊自行跨省异地就医降低20个百分点。'
      ]
    }
  }
};
