import type { CityInsuranceData } from '../types';

/**
 * 台州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：331000
 */
export const taizhouZjCityData: CityInsuranceData = {
  cityCode: '331000',
  cityName: '台州市',
  provinceCode: '330000',
  provinceName: '浙江省',
  hotline: '0576-12393',
  officialPortalUrl: 'https://ybj.zjtz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'tz-zj-medical-insurance-measures-2021',
      title: '台州市人民政府办公室关于印发台州市全民医疗保障办法的通知',
      docNumber: '台政办发〔2021〕65号',
      issuingDept: ['台州市人民政府办公室', '台州市医疗保障局'],
      publishDate: '2021-12-15',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.zjtz.gov.cn/art/2021/12/18/art_1229048877_58931234.html',
      summaryQuote: '门诊医疗费用在个人账户当年资金用完后由统筹基金支付，起付标准为在职500元、退休250元。统筹基金年度累计最高报销额度在职10000元、退休人员12000元。统筹基金支付比例：基层定点卫生医疗机构75%（参与医改基层最高86%）、二级医疗机构70%、三级医疗机构60%（退休人员倾斜增加5%）。'
    },
    {
      docId: 'tz-zj-medical-insurance-inpatient-2023',
      title: '台州市医疗保障局关于调整基本医疗保险住院统筹待遇标准的通知',
      docNumber: '台医保发〔2022〕42号',
      issuingDept: ['台州市医疗保障局', '台州市财政局'],
      publishDate: '2022-12-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.zjtz.gov.cn/art/2022/12/15/art_1229048877_58941235.html',
      summaryQuote: '职工住院起付线：三级800元、二级500元、基层及一级200元（当年第二次减半，第三次及以上免除）。统筹支付比例三级86%、二级90%、基层95%（退休提高3%-5%）。统筹基金最高支付限额40万元。居民住院起付线三级800元、二级500元、一级200元，比例一级85%、二级75%、三级65%。大病保险起付线2万元。'
    }
  ],

  // 城镇职工医保待遇 (台州标准)
  employee: {
    outpatient: {
      sourceDocId: 'tz-zj-medical-insurance-measures-2021',
      annualDeductible: 500,   // 在职门诊起付线 500 元，退休 250 元
      annualCap: 10000,        // 在职门诊限额 1 万元
      annualCapRetiree: 12000, // 退休门诊限额 1.2 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务机构/乡镇卫生院', deductible: 500, reimbursementRatio: 0.86, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点综合医院', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '门诊起付线在职500元、退休250元。基层医改定点机构报销86%（退休91%）、二级报销70%（退休75%）、三级报销60%（退休65%）。在职限额1万元，退休限额1.2万元。'
    },
    inpatient: {
      sourceDocId: 'tz-zj-medical-insurance-inpatient-2023',
      annualCap: 400000, // 基本统筹限额 40 万元
      repeatedDeductibleRule: '当年第二次住院起付标准减半，第三次及以上免除',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医院', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医院', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级综合医院', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '重点三甲医疗机构', deductible: 800, reimbursementRatio: 0.86, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      sourceDocId: 'tz-zj-medical-insurance-inpatient-2023',
      name: '台州市职工大病保险',
      deductible: 20000,
      annualCap: 500000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tz-zj-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP', '台州医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  },

  // 城乡居民医保待遇 (台州标准)
  resident: {
    outpatient: {
      sourceDocId: 'tz-zj-medical-insurance-measures-2021',
      annualCap: 900,
      tierBenefits: {
        community: { tierName: '基层社区服务机构/医改机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构', deductible: 0, reimbursementRatio: 0.20 },
        tier3: { tierName: '三级医疗机构', deductible: 0, reimbursementRatio: 0.10 },
        tier3_top: { tierName: '重点三甲医院', deductible: 0, reimbursementRatio: 0.10 }
      },
      note: '居民在参保地普通门诊：一级50%（医改机构60%）、二级20%、三级10%，年度最高支付限额900元（签约家庭医生1200元）。'
    },
    inpatient: {
      sourceDocId: 'tz-zj-medical-insurance-inpatient-2023',
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
      sourceDocId: 'tz-zj-medical-insurance-inpatient-2023',
      name: '台州市城乡居民大病保险',
      deductible: 20000,
      annualCap: 400000,
      tiers: [
        { minAmount: 20000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'tz-zj-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '浙里办APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角异地就医直接结算，省内就医免备案直接结算。']
    }
  }
};
