import type { CityInsuranceData } from '../types';

/**
 * 湖州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330500
 */
export const huzhouCityData: CityInsuranceData = {
  cityCode: '330500',
  cityName: '湖州市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0572-12393',
  officialPortalUrl: 'http://ybj.huzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'hz-medical-insurance-measures-2023',
      title: '湖州市人民政府办公室关于印发湖州市基本医疗保障办法的通知',
      docNumber: '湖政办发〔2023〕48号',
      issuingDept: ['湖州市人民政府办公室', '湖州市医疗保障局'],
      publishDate: '2023-12-18',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.huzhou.gov.cn/art/2023/12/20/art_1229207903_58931234.html',
      summaryQuote: '在同一个医保结算年度内，职工医保普通门诊统筹起付标准为在职600元、退休300元。年度最高报销额度在职1700元、退休2200元。统筹报销比例：一级及以下医疗机构60%（退休65%）、二级医疗机构55%（退休60%）、三级医疗机构50%（退休55%）。'
    },
    {
      docId: 'hz-medical-insurance-inpatient-2024',
      title: '湖州市医疗保障局关于规范全市基本医疗保险住院统筹待遇的通知',
      docNumber: '湖医保发〔2023〕35号',
      issuingDept: ['湖州市医疗保障局', '湖州市财政局'],
      publishDate: '2023-11-25',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.huzhou.gov.cn/art/2023/11/28/art_1229207903_58941235.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（第二次减半，第三次及以上免除）。职工统筹支付比例三级85%、二级89%、基层93%（退休人员增加4%）。基本统筹限额40万元。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线2万元。'
    }
  ],

  // 城镇职工医保待遇 (湖州标准)
  employee: {
    outpatient: {
      sourceDocId: 'hz-medical-insurance-measures-2023',
      annualDeductible: 600,   // 在职门诊起付线 600 元，退休 300 元
      annualCap: 1700,         // 在职门诊年限额 1700 元
      annualCapRetiree: 2200,  // 退休门诊年限额 2200 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/乡镇卫生院', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医院', deductible: 600, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点综合医院', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 600, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职600元、退休300元。基层报销60%（退休65%）、二级报销55%（退休60%）、三级报销50%（退休55%）。在职限额1700元，退休限额2200元。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2024',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.89, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '浙北重点三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-inpatient-2024',
      name: '湖州市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '湖州医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (湖州标准)
  resident: {
    outpatient: {
      sourceDocId: 'hz-medical-insurance-measures-2023',
      annualCap: 1000,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.30 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.30 }
      },
      note: '居民基层门诊免起付线报销50%，限额1000元。'
    },
    inpatient: {
      sourceDocId: 'hz-medical-insurance-inpatient-2024',
      annualCap: 300000,
      repeatedDeductibleRule: '二次及多次住院起付线依次递减',
      tierBenefits: {
        community: { tierName: '基层卫生机构', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三级医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-medical-insurance-inpatient-2024',
      name: '湖州市城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hz-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
