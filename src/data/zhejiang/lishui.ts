import type { CityInsuranceData } from '../types';

/**
 * 丽水市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：331100
 */
export const lishuiCityData: CityInsuranceData = {
  cityCode: '331100',
  cityName: '丽水市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0578-12393',
  officialPortalUrl: 'https://ybj.lishui.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'ls-medical-insurance-measures-2022',
      title: '丽水市人民政府关于印发丽水市全民医疗保障办法的通知',
      docNumber: '丽政发〔2022〕18号',
      issuingDept: ['丽水市人民政府', '丽水市医疗保障局'],
      publishDate: '2022-11-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.lishui.gov.cn/art/2022/11/15/art_1229248234_58931234.html',
      summaryQuote: '在职职工门诊统筹起付标准为1188元（个人账户额度），退休职工为420元。统筹基金年度最高支付限额为8000元。基层医疗卫生机构就医不设起付线，政策范围内报销比例不低于70%（退休75%）；二级医疗机构在职60%（退休65%）；三级医疗机构在职50%（退休55%）。结合“浙丽保”全民健康补充医疗保险实行多层次报销。'
    },
    {
      docId: 'ls-medical-insurance-inpatient-2023',
      title: '丽水市医疗保障局关于完善基本医疗保险住院统筹待遇的通知',
      docNumber: '丽医保发〔2022〕35号',
      issuingDept: ['丽水市医疗保障局', '丽水市财政局'],
      publishDate: '2022-12-18',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.lishui.gov.cn/art/2022/12/20/art_1229248234_58941235.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级及基层200元（当年第二次减半，第三次及以上免除）。统筹支付比例三级85%、二级89%、基层93%（退休人员增加4%）。统筹基金最高支付限额40万元。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线2万元。'
    }
  ],

  // 城镇职工医保待遇 (丽水标准)
  employee: {
    outpatient: {
      sourceDocId: 'ls-medical-insurance-measures-2022',
      annualDeductible: 1188,  // 在职门诊起付线 1188 元，退休 420 元（基层免起付 0 元）
      annualDeductibleRetiree: 420,
      annualCap: 8000,         // 门诊年限额 8000 元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/乡镇卫生院', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医院', deductible: 1188, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级综合医院', deductible: 1188, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 1188, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '基层卫生机构全面免设门诊起付线按70%（退休75%）报销；二级医院在职起付1188元（退休420元），二级报销60%（退休65%），三级报销50%（退休55%）。年度限额8000元。'
    },
    inpatient: {
      sourceDocId: 'ls-medical-insurance-inpatient-2023',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.89, retireeRatioBonus: 0.04 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '浙西南重点三甲医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'ls-medical-insurance-inpatient-2023',
      name: '丽水市职工大病保险（浙丽保补充）',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ls-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '丽水医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (丽水标准)
  resident: {
    outpatient: {
      sourceDocId: 'ls-medical-insurance-measures-2022',
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
      sourceDocId: 'ls-medical-insurance-inpatient-2023',
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
      sourceDocId: 'ls-medical-insurance-inpatient-2023',
      name: '丽水市城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ls-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
