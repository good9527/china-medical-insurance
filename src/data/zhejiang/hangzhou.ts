import type { CityInsuranceData } from '../types';

/**
 * 杭州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效，含2026新规）
 * 统筹区编码：330100
 */
export const hangzhouCityData: CityInsuranceData = {
  cityCode: '330100',
  cityName: '杭州市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0571-12393',
  officialPortalUrl: 'https://ybj.hangzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'hz-medical-insurance-regulations-2025',
      title: '杭州市基本医疗保障办法及门诊报销待遇优化调整方案',
      docNumber: '杭政办函〔2024〕68号及杭医保〔2024〕36号',
      issuingDept: ['杭州市人民政府办公厅', '杭州市医疗保障局'],
      publishDate: '2024-11-25',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'https://ybj.hangzhou.gov.cn/art/2024/11/28/art_1229063385_18349210.html',
      summaryQuote: '自2025年1月1日起施行。职工医保普通门诊起付线调整为在职600元、退休200元（签约基层家庭医生减免300元起付标准）；起付线以上在职社区报销86%、其他医疗机构报销80%、三级医疗机构报销76%（退休人员各项对应上浮6%至92%、86%、82%）。普通门诊统筹不设年度最高支付限额（上不封顶）。职工住院统筹限额40万元。'
    },
    {
      docId: 'hz-resident-medical-2024',
      title: '杭州市城乡居民基本医疗保险实施办法及大病保险管理规定',
      docNumber: '杭医保〔2023〕45号',
      issuingDept: ['杭州市医疗保障局', '杭州市财政局'],
      publishDate: '2023-11-10',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.hangzhou.gov.cn/art/2023/11/15/art_1229063385_17942890.html',
      summaryQuote: '城乡居民医保门诊起付线300元（签约家庭医生免起付线），社区报销70%、其他医疗机构报销60%、三级医疗机构报销40%。住院起付线：社区300元（报销80%）、二级500元（报销75%）、三级800元（报销70%）。大病保险起付线为2.5万元，分段报销60%至85%。'
    },
    {
      docId: 'hz-remote-delta-2024',
      title: '杭州市医疗保障局关于推进长三角区域及跨省异地就医直接联网结算有关事项的通知',
      docNumber: '杭医保发〔2024〕18号',
      issuingDept: ['杭州市医疗保障局', '杭州市财政局'],
      publishDate: '2024-06-12',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'https://ybj.hangzhou.gov.cn/art/2024/06/15/art_1229063385_18561240.html',
      summaryQuote: '深入推进长三角区域一体化就医免备案直接结算，参保人员在江浙沪皖定点医药机构就医享受参保地同等统筹报销比例；全国跨省异地就医通过“浙里办”或国家平台实现秒级自助备案。'
    }
  ],

  // 城镇职工医保待遇 (杭州标准)
  employee: {
    outpatient: {
      sourceDocId: 'hz-medical-insurance-regulations-2025',
      annualDeductible: 600, // 2025年新政：在职门诊起付线降至 600 元
      annualDeductibleRetiree: 200, // 退休人员门诊起付线降至 200 元（签约家庭医生减免300元）
      annualCap: 9999999,    // 杭州职工门诊不设封顶线（上不封顶）
      annualCapRetiree: 9999999,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/乡镇卫生院', deductible: 600, reimbursementRatio: 0.86, retireeRatioBonus: 0.06 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.86, retireeRatioBonus: 0.06 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.06 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.76, retireeRatioBonus: 0.06 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 600, reimbursementRatio: 0.76, retireeRatioBonus: 0.06 }
      },
      note: '2025年起在职职工门诊起付线为600元，退休人员为200元（签约社区家庭医生减免300元起付）。普通门诊统筹上不封顶。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-regulations-2025',
      annualCap: 400000, // 基本医疗保险统筹限额 40 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.84, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '三级甲等重点医院', deductible: 800, reimbursementRatio: 0.84, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-regulations-2025',
      name: '杭州市大病医疗保险',
      deductible: 25000,
      annualCap: 600000,
      tiers: [
        { minAmount: 25000, maxAmount: 50000, ratio: 0.70 },
        { minAmount: 50000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-regulations-2025',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角就医免备案，普通门诊与住院直接联网结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (杭州标准)
  resident: {
    outpatient: {
      sourceDocId: 'hz-resident-medical-2024',
      annualDeductible: 300, // 门诊起付线 300 元（签约免起付）
      annualCap: 300000,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 300, reimbursementRatio: 0.70 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.70 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.60 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '三甲重点医院', deductible: 300, reimbursementRatio: 0.40 }
      },
      note: '居民医保门诊起付线300元（签约家庭医生免收），社区报销70%、二级60%、三级40%。'
    },
    inpatient: {
      sourceDocId: 'hz-resident-medical-2024',
      annualCap: 300000, // 居民住院年最高限额 30 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 300, reimbursementRatio: 0.80 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 800, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-resident-medical-2024',
      name: '杭州市城乡居民大病保险',
      deductible: 25000,
      annualCap: 600000, // 明确基准最高支付限额 60 万元
      tiers: [
        { minAmount: 25000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, maxAmount: 200000, ratio: 0.75 },
        { minAmount: 200000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-regulations-2025',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角区域内就医直接刷卡结算。'
      ]
    }
  }
};
