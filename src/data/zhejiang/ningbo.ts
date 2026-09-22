import type { CityInsuranceData } from '../types';

/**
 * 宁波市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330200
 */
export const ningboCityData: CityInsuranceData = {
  cityCode: '330200',
  cityName: '宁波市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0574-12393',
  officialPortalUrl: 'https://ybj.ningbo.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'nb-employee-outpatient-reform-2022',
      title: '宁波市人民政府办公厅关于建立健全职工基本医疗保险门诊共济保障机制的实施意见',
      docNumber: '甬政办发〔2022〕46号',
      issuingDept: ['宁波市人民政府办公厅', '宁波市医疗保障局'],
      publishDate: '2022-12-25',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.ningbo.gov.cn/art/2022/12/28/art_1229048877_58937123.html',
      summaryQuote: '在职职工门诊起付标准（自负段）为750元（45周岁以下900元、45周岁及以上600元），退休人员为300元。年度统筹基金最高支付限额为20000元。统筹支付比例：社区卫生服务机构在职86%（退休92%）、二级及其他医疗机构在职80%（退休80%）、三级医疗机构在职75%（退休75%）。'
    },
    {
      docId: 'nb-medical-insurance-measures-2023',
      title: '宁波市基本医疗保险办法',
      docNumber: '甬政规〔2023〕1号',
      issuingDept: ['宁波市人民政府', '宁波市医疗保障局'],
      publishDate: '2023-03-10',
      effectiveDate: '2023-04-01',
      status: 'active',
      officialUrl: 'https://ybj.ningbo.gov.cn/art/2023/3/15/art_1229048877_58941234.html',
      summaryQuote: '职工住院起付线：三级1200元、其他600元、社区300元；年度内多次住院起付线按所住最高等级标准计算一次（不超过1200元）。统筹支付比例三级在职86%（退休90%）、二级在职90%（退休93%）、基层95%（退休97%）。基本医疗保险统筹最高支付限额30万元。居民住院起付线同上，报销比例一级85%、二级75%、三级65%。大病保险起付线2万元，分段报销60%-85%。'
    }
  ],

  // 城镇职工医保待遇 (宁波标准)
  employee: {
    outpatient: {
      sourceDocId: 'nb-employee-outpatient-reform-2022',
      annualDeductible: 750,   // 在职门诊基准起付线 750 元（45岁以下900/45岁以上600，退休300）
      annualDeductibleRetiree: 300,
      annualCap: 20000,        // 门诊统筹限额 2 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务机构/卫生院', deductible: 750, reimbursementRatio: 0.86, retireeRatioBonus: 0.06 },
        tier1: { tierName: '一级定点医疗机构', deductible: 750, reimbursementRatio: 0.86, retireeRatioBonus: 0.06 },
        tier2: { tierName: '二级及其他医疗机构', deductible: 750, reimbursementRatio: 0.80, retireeRatioBonus: 0.00 },
        tier3: { tierName: '三级定点医疗机构', deductible: 750, reimbursementRatio: 0.75, retireeRatioBonus: 0.00 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 750, reimbursementRatio: 0.75, retireeRatioBonus: 0.00 }
      },
      note: '职工门诊实行账户段、自负段、共济段三段式。自负段在职平均750元、退休300元。社区报销86%（退休92%）、二级报销80%、三级报销75%。年度最高支付限额2万元。'
    },
    inpatient: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '年度内多次住院按所住最高级别医院计算一次起付线（上限1200元）',
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医院', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级综合医院', deductible: 1200, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 1200, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      name: '宁波市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.65 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.75 },
        { minAmount: 100000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '宁波医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (宁波标准)
  resident: {
    outpatient: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      annualCap: 5000, // 普通门诊限额已提高至 5000 元
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构', deductible: 300, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级医疗机构', deductible: 300, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '重点三级甲等医院', deductible: 300, reimbursementRatio: 0.40 }
      },
      note: '居民门诊在基层免起付线报销60%，二级/三级设300元起付线，年度封顶提升至5000元。'
    },
    inpatient: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      annualCap: 300000,
      repeatedDeductibleRule: '年度内多次住院按最高等级医院计算一次起付线（上限1200元）',
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构', deductible: 300, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点机构', deductible: 300, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点机构', deductible: 1200, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 1200, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      name: '宁波市城乡居民大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nb-medical-insurance-measures-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
