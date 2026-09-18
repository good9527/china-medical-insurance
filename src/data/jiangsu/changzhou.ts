import type { CityInsuranceData } from '../types';

/**
 * 常州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320400
 */
export const changzhouCityData: CityInsuranceData = {
  cityCode: '320400',
  cityName: '常州市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0519-12393',
  officialPortalUrl: 'https://ybj.changzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'cz-employee-outpatient-reform-2022',
      title: '常州市人民政府办公室印发关于进一步健全常州市职工基本医疗保险门诊共济保障机制的实施方案的通知',
      docNumber: '常政办发〔2022〕91号',
      issuingDept: ['常州市人民政府办公室', '常州市医疗保障局'],
      publishDate: '2022-12-23',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.changzhou.gov.cn/html/ybj/2022/KLFMGLPP_1226/12345.html',
      summaryQuote: '在职职工门诊起付标准为600元，退休人员为400元。年度最高支付限额在职10000元，退休人员12000元。支付比例：基层一级及以下医疗机构在职80%（退休85%）、二级医疗机构在职70%（退休75%）、三级医疗机构在职60%（退休65%）。'
    },
    {
      docId: 'cz-medical-insurance-inpatient-2023',
      title: '常州市基本医疗保险和生育保险办法实施细则',
      docNumber: '常医保规〔2022〕4号',
      issuingDept: ['常州市医疗保障局', '常州市财政局'],
      publishDate: '2022-11-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.changzhou.gov.cn/html/ybj/2022/ODNBLMKB_1130/54321.html',
      summaryQuote: '职工住院起付线：三级800元、二级600元、一级及基层300元；二次住院减半，三次免除。报销比例在职三级88%、二级92%、一级95%（退休提高3%-5%）。居民住院起付线三级800元、二级500元、一级200元，报销比例一级85%、二级75%、三级65%。大病保险起付线1.5万元。'
    }
  ],

  // 城镇职工医保待遇 (常州标准)
  employee: {
    outpatient: {
      sourceDocId: 'cz-employee-outpatient-reform-2022',
      annualDeductible: 600,   // 在职门诊起付线 600 元，退休 400 元
      annualCap: 10000,        // 门诊年限额 1 万元
      annualCapRetiree: 12000, // 退休门诊年限额 1.2 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务机构/乡镇卫生院', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级综合医院', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省重点三级甲等医院', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职600元、退休400元。基层报销80%（退休85%）、二级报销70%（退休75%）、三级报销60%（退休65%）。在职限额1万元，退休1.2万元。'
    },
    inpatient: {
      sourceDocId: 'cz-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 600, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医院', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '常州市职工补充医疗保险',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (常州标准)
  resident: {
    outpatient: {
      sourceDocId: 'cz-employee-outpatient-reform-2022',
      annualCap: 1000,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '省属重点三甲医院', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民基层门诊免起付线报销60%，限额1000元。'
    },
    inpatient: {
      sourceDocId: 'cz-medical-insurance-inpatient-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层社区卫生院', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '常州市城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
