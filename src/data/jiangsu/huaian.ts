import type { CityInsuranceData } from '../types';

/**
 * 淮安市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320800
 */
export const huaianCityData: CityInsuranceData = {
  cityCode: '320800',
  cityName: '淮安市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0517-12393',
  officialPortalUrl: 'https://ybj.huaian.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'ha-employee-outpatient-reform-2022',
      title: '淮安市职工基本医疗保险门诊共济保障机制实施办法',
      docNumber: '淮政规〔2022〕9号',
      issuingDept: ['淮安市人民政府', '淮安市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.huaian.gov.cn/col/4666_845209/art/16723456/16723456.html',
      summaryQuote: '普通门诊统筹起付标准为600元（退休人员按50%执行即300元）。统筹基金年度最高支付限额在职6000元，退休7000元。统筹支付比例：一级及基层医疗机构在职75%（退休85%）、二级医疗机构在职65%（退休75%）、三级医疗机构在职55%（退休65%）。'
    },
    {
      docId: 'ha-medical-insurance-inpatient-2023',
      title: '淮安市医疗保障局关于完善基本医疗保险住院统筹待遇的通知',
      docNumber: '淮医保发〔2022〕48号',
      issuingDept: ['淮安市医疗保障局', '淮安市财政局'],
      publishDate: '2022-11-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.huaian.gov.cn/col/4666_845209/art/16712345/16712345.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（二次减半，三次免除）。统筹支付比例三级87%、二级91%、一级95%（退休提高3%-5%）。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (淮安标准)
  employee: {
    outpatient: {
      sourceDocId: 'ha-employee-outpatient-reform-2022',
      annualDeductible: 600,   // 在职门诊起付线 600 元，退休 300 元
      annualDeductibleRetiree: 300, // 退休人员门诊起付线 300 元
      annualCap: 6000,         // 在职门诊限额 6000 元
      annualCapRetiree: 7000,  // 退休门诊限额 7000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心/卫生院', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级综合医院', deductible: 600, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 600, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线在职600元、退休300元。基层报销75%（退休85%）、二级报销65%（退休75%）、三级报销55%（退休65%）。在职限额6000元，退休7000元。'
    },
    inpatient: {
      sourceDocId: 'ha-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.91, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省重点三甲医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '淮安市职工大额医疗补助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ha-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (淮安标准)
  resident: {
    outpatient: {
      sourceDocId: 'ha-employee-outpatient-reform-2022',
      annualCap: 800,
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额800元。'
    },
    inpatient: {
      sourceDocId: 'ha-medical-insurance-inpatient-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三级医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '淮安市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ha-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
