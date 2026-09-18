import type { CityInsuranceData } from '../types';

/**
 * 随州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：421300
 */
export const suizhouCityData: CityInsuranceData = {
  cityCode: '421300',
  cityName: '随州市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0722-12393 / 0722-3596001',
  officialPortalUrl: 'http://ybj.suizhou.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'sz-employee-outpatient-2022',
      title: '关于印发随州市职工基本医疗保险普通门诊共济保障实施细则的通知',
      docNumber: '随政办发〔2022〕26号',
      issuingDept: ['随州市人民政府办公室', '随州市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.suizhou.gov.cn/zwgk/zcfg/202212/t20221226_1048291.html',
      summaryQuote: '随政办发〔2022〕26号明确：在职人员年度起付标准为500元、退休人员为400元。普通门诊统筹年度最高支付限额在职人员1300元、退休人员1600元。统筹基金支付比例：一级医疗机构（含社区卫生服务中心）80%、二级医疗机构70%、三级医疗机构60%，退休人员在上述基础上支付比例提高5个百分点（一级85%、二级75%、三级65%）。'
    },
    {
      docId: 'sz-basic-insurance-2023',
      title: '随州市基本医疗保险实施细则',
      docNumber: '随政发〔2023〕21号',
      issuingDept: ['随州市人民政府', '随州市医疗保障局'],
      publishDate: '2023-12-18',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.suizhou.gov.cn/zwgk/zcjd/202312/t20231225_1069213.html',
      summaryQuote: '随政发〔2023〕21号自2024年1月1日起施行：职工住院起付标准一级400元、二级600元、三级800元；甲类费用基金支付比例一级95%、二级93%、三级91%。居民住院起付标准一级200元、二级500元、三级900元；甲类费用基金支付比例一级90%、二级80%、三级70%。乙类费用个人先行自付10%后再按比例报销。职工基本统筹年度限额15万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'sz-employee-outpatient-2022',
      annualDeductible: 500,
      annualCap: 1300,
      annualCapRetiree: 1600,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/一级定点', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '随州市职工门诊年起付线在职500元、退休400元；基层报销80%（退休85%）、二级70%（退休75%）、三级60%（退休65%）；在职最高支付限额1300元，退休1600元。'
    },
    inpatient: {
      sourceDocId: 'sz-basic-insurance-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.93, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.91, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 800, reimbursementRatio: 0.91, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '同年度内多次住院起付线按规定执行，转诊就医只补差额。'
    },
    catastrophic: {
      sourceDocId: 'sz-basic-insurance-2023',
      name: '随州市职工大额医疗互助',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-basic-insurance-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '随州医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按规定办理转外就医备案的，转市外定点医疗机构住院起付标准为1200元。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'sz-basic-insurance-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心/卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗卫生机构免起付线报销50%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'sz-basic-insurance-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三甲重点医院', deductible: 900, reimbursementRatio: 0.70 }
      },
      repeatedDeductibleRule: '按分级诊疗向下转诊免除下级医院起付线。'
    },
    catastrophic: {
      sourceDocId: 'sz-basic-insurance-2023',
      name: '随州市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sz-basic-insurance-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '转市外定点医疗机构住院起付标准为1500元，未备案外出按规定下浮。'
      ]
    }
  }
};
