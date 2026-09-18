import type { CityInsuranceData } from '../types';

/**
 * 舟山市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：330900
 */
export const zhoushanCityData: CityInsuranceData = {
  cityCode: '330900',
  cityName: '舟山市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0580-12393',
  officialPortalUrl: 'https://ybj.zhoushan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'zs-medical-insurance-measures-2022',
      title: '舟山市医疗保障办法',
      docNumber: '舟政发〔2022〕16号',
      issuingDept: ['舟山市人民政府', '舟山市医疗保障局'],
      publishDate: '2022-11-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.zhoushan.gov.cn/art/2022/11/25/art_1229248234_58931234.html',
      summaryQuote: '基层医疗卫生机构全面取消门诊起付线（0元免起付）。二级及以上医疗机构门诊起付标准为在职400元、退休200元。统筹基金年度最高支付限额为8000元。基层就医报销比例在职68%（退休73%）、二级医疗机构在职60%（退休65%）、三级医疗机构在职50%（退休55%）。'
    },
    {
      docId: 'zs-medical-insurance-inpatient-2023',
      title: '舟山市医疗保障局关于规范全市基本医疗保险住院与大病待遇的通知',
      docNumber: '舟医保发〔2022〕32号',
      issuingDept: ['舟山市医疗保障局', '舟山市财政局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.zhoushan.gov.cn/art/2022/12/18/art_1229248234_58941235.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（当年第二次减半，第三次及以上免除）。统筹支付比例三级85%、二级89%、基层93%（退休人员增加4%）。统筹限额40万元。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线2万元。'
    }
  ],

  // 城镇职工医保待遇 (舟山标准)
  employee: {
    outpatient: {
      sourceDocId: 'zs-medical-insurance-measures-2022',
      annualDeductible: 400,   // 在职门诊基准起付线 400 元，退休 200 元（基层免起付 0 元）
      annualCap: 8000,         // 门诊年限额 8000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心/海岛卫生院', deductible: 0, reimbursementRatio: 0.68, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.68, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医院', deductible: 400, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点综合医院', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 400, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '基层海岛社区医疗机构全面免门诊起付线直接按68%（退休73%）报销；二级医院在职起付400元（退休200元），二级报销60%（退休65%），三级报销50%（退休55%）。年度限额8000元。'
    },
    inpatient: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.89, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '重点三级甲等医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      name: '舟山市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '舟山医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (舟山标准)
  resident: {
    outpatient: {
      sourceDocId: 'zs-medical-insurance-measures-2022',
      annualCap: 1000,
      tierBenefits: {
        community: { tierName: '基层社区服务机构', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3: { tierName: '三级医疗机构', deductible: 200, reimbursementRatio: 0.30 },
        tier3_top: { tierName: '重点三甲医院', deductible: 200, reimbursementRatio: 0.30 }
      },
      note: '居民基层门诊免起付线报销50%，限额1000元。'
    },
    inpatient: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
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
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      name: '舟山市城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'zs-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
