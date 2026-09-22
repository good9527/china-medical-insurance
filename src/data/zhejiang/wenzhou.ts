import type { CityInsuranceData } from '../types';

/**
 * 温州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330300
 */
export const wenzhouCityData: CityInsuranceData = {
  cityCode: '330300',
  cityName: '温州市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0577-12393',
  officialPortalUrl: 'https://ybj.wenzhou.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'wz-medical-insurance-measures-2022',
      title: '温州市人民政府关于印发温州市全民医疗保障办法的通知',
      docNumber: '温政发〔2022〕22号',
      issuingDept: ['温州市人民政府', '温州市医疗保障局'],
      publishDate: '2022-11-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.wenzhou.gov.cn/art/2022/11/20/art_1229246445_58931234.html',
      summaryQuote: '职工医保门诊统筹起付标准为在职600元、退休400元。统筹基金年度最高支付限额为10000元。起付线以上政策范围内报销比例：基层医疗机构80%（退休85%）、二级及其他医疗机构70%（退休75%）、三级医疗机构60%（退休65%）。'
    },
    {
      docId: 'wz-medical-insurance-inpatient-2024',
      title: '温州市医疗保障局关于公布基本医疗保险及城乡居民大病待遇标准的通知及待遇简明表',
      docNumber: '温医保发〔2024〕28号',
      issuingDept: ['温州市医疗保障局', '温州市财政局'],
      publishDate: '2024-09-15',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'https://ybj.wenzhou.gov.cn/art/2022/12/15/art_1229246445_58941235.html',
      summaryQuote: '居民门诊在基层医疗机构就医报销50%（慢性病60%），年度最高支付限额1500元。居民住院起付线：三级700元、二级400元、一级及基层300元；报销比例：三级70%、二级80%、基层90%。年度内设一次住院起付标准，多次住院按最高级别标准计算。基本医保年度限额20万元。大病保险起付线25700元，符合范围部分按70%报销。'
    }
  ],

  // 城镇职工医保待遇 (温州标准)
  employee: {
    outpatient: {
      sourceDocId: 'wz-medical-insurance-measures-2022',
      annualDeductible: 600,   // 在职门诊起付线 600 元，退休 400 元
      annualCap: 10000,        // 门诊年限额 1 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/乡镇卫生院', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级及其他定点医院', deductible: 600, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级综合医院', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 600, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线在职600元、退休400元。基层报销80%（退休85%）、二级报销70%（退休75%）、三级报销60%（退休65%）。年度最高支付限额1万元。'
    },
    inpatient: {
      sourceDocId: 'wz-medical-insurance-inpatient-2023',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 300, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医院', deductible: 300, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.89, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '浙南重点三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'wz-medical-insurance-inpatient-2023',
      name: '温州市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '温州医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (温州标准)
  resident: {
    outpatient: {
      sourceDocId: 'wz-medical-insurance-inpatient-2024',
      annualCap: 1500, // 居民普通门诊年度限额1500元
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构', deductible: 100, reimbursementRatio: 0.35 },
        tier3: { tierName: '三级医疗机构', deductible: 100, reimbursementRatio: 0.35 },
        tier3_top: { tierName: '重点三甲医院', deductible: 100, reimbursementRatio: 0.35 }
      },
      note: '居民基层门诊免起付线报销50%（慢性病60%），其他机构起付100元报销35%，年度限额1500元。'
    },
    inpatient: {
      sourceDocId: 'wz-medical-insurance-inpatient-2024',
      annualCap: 200000, // 居民统筹年度限额 20 万元
      repeatedDeductibleRule: '年度内设一次住院起付标准，多次住院按最高级别标准计算',
      tierBenefits: {
        community: { tierName: '基层社区医院', deductible: 300, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 700, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '重点三甲医院', deductible: 700, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'wz-medical-insurance-inpatient-2024',
      name: '温州市城乡居民大病保险',
      deductible: 25700,
      annualCap: 400000,
      tiers: [
        { minAmount: 25700, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wz-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
