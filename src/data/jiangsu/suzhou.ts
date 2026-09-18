import type { CityInsuranceData } from '../types';

/**
 * 苏州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320500
 */
export const suzhouCityData: CityInsuranceData = {
  cityCode: '320500',
  cityName: '苏州市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0512-12393',
  officialPortalUrl: 'https://ybj.suzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'sz-employee-outpatient-reform-2022',
      title: '苏州市人民政府办公室关于印发苏州市职工基本医疗保险门诊共济保障机制实施细则（试行）的通知',
      docNumber: '苏府办〔2022〕207号',
      issuingDept: ['苏州市人民政府办公室', '苏州市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.suzhou.gov.cn/szsylbzj/zcfg/202212/8ec54972e60c4aa387e37603c14dcb37.shtml',
      summaryQuote: '在职职工门诊起付标准为600元，退休人员为400元。统筹基金年度最高支付限额统一提高至13000元。支付比例：一级及基层医疗机构在职80%（退休90%）、二级医疗机构在职75%（退休85%）、三级医疗机构在职60%（退休70%）。'
    },
    {
      docId: 'sz-medical-insurance-inpatient-2023',
      title: '苏州市基本医疗保险和生育保险办法及住院报销实施细则',
      docNumber: '苏府规〔2022〕8号',
      issuingDept: ['苏州市人民政府', '苏州市医疗保障局'],
      publishDate: '2022-11-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.suzhou.gov.cn/szsylbzj/zcfg/202211/t20221115_398012.shtml',
      summaryQuote: '职工住院起付线：三级医院在职800元/退休700元、二级医院在职600元/退休500元、基层医疗机构400元；当年第二次住院减半，第三次及以上统一为200元。在职报销比例三级90%、二级92%、一级95%（退休提高至95%）。居民住院起付线三级800元、二级600元、一级400元，报销比例一级85%、二级80%、三级70%。大病保险起付线1.5万元，按60%-80%分段报销。'
    }
  ],

  // 城镇职工医保待遇 (苏州标准)
  employee: {
    outpatient: {
      sourceDocId: 'sz-employee-outpatient-reform-2022',
      annualDeductible: 600,   // 在职门诊起付线 600 元，退休 400 元
      annualDeductibleRetiree: 400, // 退休人员门诊起付线 400 元
      annualCap: 13000,        // 门诊统筹年度限额 1.3 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务机构/乡镇卫生院', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省/市属重点三甲医院', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线在职600元、退休400元。一级及社区在职报销80%（退休90%）、二级报销75%（退休85%）、三级报销60%（退休70%）。年度统筹限额1.3万元。'
    },
    inpatient: {
      sourceDocId: 'sz-medical-insurance-inpatient-2023',
      annualCap: 350000, // 基本统筹限额 35 万元
      repeatedDeductibleRule: '当年第二次住院起付线减半，第三次及以上统一降低至200元',
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级综合医院', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 }
      }
    },
    catastrophic: {
      name: '苏州市职工大额医疗费用社会共济',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.95 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (苏州标准)
  resident: {
    outpatient: {
      sourceDocId: 'sz-medical-insurance-inpatient-2023',
      annualCap: 1200,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '省属三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民门诊统筹向基层倾斜，基层免起付报销60%，年限额1200元。'
    },
    inpatient: {
      sourceDocId: 'sz-medical-insurance-inpatient-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '年度内多次住院起付线依次递减50%',
      tierBenefits: {
        community: { tierName: '基层卫生院/社区医院', deductible: 400, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 800, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      name: '苏州市城乡居民大病保险',
      deductible: 15000,
      annualCap: 350000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
