import type { CityInsuranceData } from '../types';

/**
 * 郑州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：410100
 */
export const zhengzhouCityData: CityInsuranceData = {
  cityCode: '410100',
  cityName: '郑州市',
  provinceCode: '410000',
  provinceName: '河南省',
  hotline: '0371-12393',
  officialPortalUrl: 'https://ybj.zhengzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'zz-employee-outpatient-reform-2022',
      title: '郑州市人民政府办公厅关于印发郑州市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '郑政办〔2022〕56号',
      issuingDept: ['郑州市人民政府办公厅', '郑州市医疗保障局'],
      publishDate: '2022-06-28',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'https://ybj.zhengzhou.gov.cn/zcfg/6654321.jhtml',
      summaryQuote: '基层定点医疗机构不设起付线，报销比例65%（退休75%）；其他等级医疗机构门诊起付线为每次40元，二级医院在职报销60%（退休70%），省级三甲医院在职报销55%（退休65%）。年度门诊统筹最高支付限额在职职工1800元，退休人员2300元。'
    },
    {
      docId: 'zz-medical-insurance-inpatient',
      title: '郑州市基本医疗保险实施办法及现行住院待遇标准',
      docNumber: '郑政办〔2021〕38号及2024年调整标准',
      issuingDept: ['郑州市人民政府办公厅', '郑州市医疗保障局'],
      publishDate: '2021-12-25',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.zhengzhou.gov.cn/zcjd/5987123.jhtml',
      summaryQuote: '职工住院起付线：乡级200元、市级二级300元、市级三级600元、省级三甲900元；在职职工报销比例二级92%、市级三级89%、省级三甲86%（退休人员相应上浮）。基本统筹年度封顶15万元。居民住院起付线：基层150元、二级600元、三级1200元、省级三甲2000元；分段报销二级75%、三级70%、省级三甲65%，基本统筹年封顶15万元。'
    }
  ],

  // 城镇职工医保待遇 (郑州标准)
  employee: {
    outpatient: {
      sourceDocId: 'zz-employee-outpatient-reform-2022',
      annualDeductible: 40,
      deductibleType: 'per_visit',  // 门诊起付线每诊次40元（基层0元）
      annualCap: 1800,       // 在职门诊年限额 1800 元
      annualCapRetiree: 2300, // 退休门诊年限额 2300 元
      tierBenefits: {
        community: { tierName: '基层社区服务中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 40, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 40, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 40, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 40, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 }
      },
      note: '基层机构不设起付线报销65%（退休75%），二级及以上医院每次起付线40元，二级报销60%、三级报销55%（退休各上浮10%）。在职限额1800元，退休限额2300元。'
    },
    inpatient: {
      sourceDocId: 'zz-medical-insurance-inpatient',
      annualCap: 150000, // 基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生中心', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市级三级定点医疗机构', deductible: 600, reimbursementRatio: 0.89, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 900, reimbursementRatio: 0.86, retireeRatioBonus: 0.03 }
      }
    },
    catastrophic: {
      sourceDocId: 'zz-medical-insurance-inpatient',
      name: '郑州市城镇职工大额医疗救助',
      deductible: 150000,
      annualCap: 400000,
      tiers: [
        { minAmount: 150000, maxAmount: 550000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zz-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序', '郑好办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '跨省异地就医直接结算，规范备案人员享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (郑州标准)
  resident: {
    outpatient: {
      sourceDocId: 'zz-employee-outpatient-reform-2022',
      annualDeductible: 0,
      deductibleType: 'per_visit',
      annualCap: 300, // 居民门诊限额 2024年提升至300元
      tierBenefits: {
        community: { tierName: '基层卫生院/社区卫生中心', deductible: 0, reimbursementRatio: 0.65 },
        tier1: { tierName: '一级医疗机构', deductible: 40, reimbursementRatio: 0.55 },
        tier2: { tierName: '二级医疗机构', deductible: 40, reimbursementRatio: 0.55 },
        tier3: { tierName: '三级医疗机构', deductible: 40, reimbursementRatio: 0.45 },
        tier3_top: { tierName: '省级三甲医院', deductible: 40, reimbursementRatio: 0.45 }
      },
      note: '居民门诊基层免起付线报销65%，其他医院每次40元起付线，报销45%-55%，年度最高报销300元。'
    },
    inpatient: {
      sourceDocId: 'zz-medical-insurance-inpatient',
      annualCap: 150000, // 居民住院年最高限额 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 150, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier2: { tierName: '市级二级医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '市级三级医疗机构', deductible: 1200, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '省级三甲综合医院', deductible: 2000, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'zz-medical-insurance-inpatient',
      name: '郑州市城乡居民大病保险',
      deductible: 11000,
      annualCap: 400000,
      tiers: [
        { minAmount: 11000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zz-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '河南医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，规范备案人员与本地享受同等待遇。'
      ]
    }
  }
};
