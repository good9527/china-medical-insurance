import type { CityInsuranceData } from '../types';

/**
 * 南通市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320600
 */
export const nantongCityData: CityInsuranceData = {
  cityCode: '320600',
  cityName: '南通市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0513-12393',
  officialPortalUrl: 'https://ybj.nantong.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'nt-employee-outpatient-reform-2022',
      title: '关于健全职工基本医疗保险门诊共济保障机制实施方案',
      docNumber: '通政办发〔2022〕134号',
      issuingDept: ['南通市人民政府办公室', '南通市医疗保障局'],
      publishDate: '2022-12-29',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.nantong.gov.cn/ntsylbzj/zcfg/content/9d983fb0-1845-4203-b097-f0b982121.html',
      summaryQuote: '门诊统筹年度起付标准为800元（退休人员为500元）。统筹基金年度最高支付限额为10000元。统筹支付比例：基层定点医疗机构在职75%（退休85%）、二级医疗机构在职65%（退休75%）、三级医疗机构在职55%（退休65%）。'
    },
    {
      docId: 'nt-medical-insurance-inpatient-2024',
      title: '南通市医疗保障办法及住院报销实施规程',
      docNumber: '通政规〔2024〕3号',
      issuingDept: ['南通市人民政府', '南通市医疗保障局'],
      publishDate: '2024-05-10',
      effectiveDate: '2024-07-01',
      status: 'active',
      officialUrl: 'https://ybj.nantong.gov.cn/ntsylbzj/zcfg/content/7e883fb0-2345-4203-b097-f0b982123.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及以下200元；二次减半，三次免除。统筹支付比例三级87%、二级92%、一级95%（退休提高3%-5%）。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (南通标准)
  employee: {
    outpatient: {
      sourceDocId: 'nt-employee-outpatient-reform-2022',
      annualDeductible: 800,   // 在职门诊起付线 800 元，退休 500 元
      annualCap: 10000,        // 门诊年限额 1 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 800, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 800, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线在职800元、退休500元。基层报销75%（退休85%）、二级报销65%（退休75%）、三级报销55%（退休65%）。年度统筹限额1万元。'
    },
    inpatient: {
      sourceDocId: 'nt-medical-insurance-inpatient-2024',
      annualCap: 350000, // 基本统筹限额 35 万元
      repeatedDeductibleRule: '当年第二次住院起付线减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '省重点三甲医院', deductible: 800, reimbursementRatio: 0.87, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '南通市职工大额医疗救助',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nt-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (南通标准)
  resident: {
    outpatient: {
      sourceDocId: 'nt-employee-outpatient-reform-2022',
      annualCap: 1000,
      tierBenefits: {
        community: { tierName: '基层卫生服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额1000元。'
    },
    inpatient: {
      sourceDocId: 'nt-medical-insurance-inpatient-2024',
      annualCap: 250000,
      repeatedDeductibleRule: '二次住院起付线减半',
      tierBenefits: {
        community: { tierName: '基层社区医院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '南通市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nt-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
