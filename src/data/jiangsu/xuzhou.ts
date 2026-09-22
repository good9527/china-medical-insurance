import type { CityInsuranceData } from '../types';

/**
 * 徐州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320300
 */
export const xuzhouCityData: CityInsuranceData = {
  cityCode: '320300',
  cityName: '徐州市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0516-12393',
  officialPortalUrl: 'https://ybj.xz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'xz-employee-outpatient-reform-2022',
      title: '徐州市职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '徐政办发〔2022〕115号',
      issuingDept: ['徐州市人民政府办公室', '徐州市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.xz.gov.cn/zwgk/002002/20221226/7821345.html',
      summaryQuote: '在职职工门诊起付标准为700元，退休人员按50%执行（即350元）。统筹基金最高支付限额为7000元。支付比例：一级及以下医疗机构在职75%、二级医疗机构在职65%、三级医疗机构在职60%。退休人员在上述比例基础上再提高10个百分点（分别达85%、75%、70%）。'
    },
    {
      docId: 'xz-resident-medical-2023',
      title: '徐州市人民政府关于印发徐州市城乡居民医疗保险办法的通知',
      docNumber: '徐政规〔2023〕7号',
      issuingDept: ['徐州市人民政府', '徐州市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.xz.gov.cn/zwgk/002002/20231125/8921345.html',
      summaryQuote: '居民门诊年度政策范围内医疗费用最高支付限额提高至1200元（签约家庭医生1800元）。居民住院起付线：一级及社区300元、二级700元、三级医疗机构1500元；报销比例一级85%、二级75%、三级65%。年度内多次住院起付线依次递减100元，各级别最低限额为一级100元、二级300元、三级1100元。基本医保年度最高支付限额25万元。'
    }
  ],

  // 城镇职工医保待遇 (徐州标准)
  employee: {
    outpatient: {
      sourceDocId: 'xz-employee-outpatient-reform-2022',
      annualDeductible: 700,   // 在职门诊起付线 700 元，退休 350 元
      annualDeductibleRetiree: 350, // 退休人员门诊起付线 350 元
      annualCap: 7000,         // 门诊年限额 7000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 700, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 700, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级综合医院', deductible: 700, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '淮海经济区重点三甲医院', deductible: 700, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线在职700元、退休人员减半（350元）。基层报销75%（退休85%）、二级报销65%（退休75%）、三级报销60%（退休70%）。年度统筹限额7000元。'
    },
    inpatient: {
      sourceDocId: 'xz-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.91, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '徐州市职工大额医疗互助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (徐州标准)
  resident: {
    outpatient: {
      sourceDocId: 'xz-resident-medical-2023',
      annualCap: 1200, // 居民门诊统筹年度限额1200元（签约家庭医生1800元）
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '省属重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额1200元（家庭医生签约对象1800元）。'
    },
    inpatient: {
      sourceDocId: 'xz-resident-medical-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '同一统筹年度内多次住院起付线依次递减100元，三级不低于1100元、二级不低于300元、一级不低于100元',
      tierBenefits: {
        community: { tierName: '一级机构及社区卫生服务中心', deductible: 300, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1500, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医院', deductible: 1500, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '徐州市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
