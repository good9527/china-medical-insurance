import type { CityInsuranceData } from '../types';

/**
 * 宜昌市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：420500
 */
export const yichangCityData: CityInsuranceData = {
  cityCode: '420500',
  cityName: '宜昌市',
  provinceCode: '420000',
  provinceName: '湖北省',
  hotline: '0717-12393 / 0717-6551719',
  officialPortalUrl: 'http://ybj.yichang.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'yc-employee-outpatient-2022',
      title: '宜昌市建立健全职工基本医疗保险门诊共济保障机制实施细则',
      docNumber: '宜府办发〔2022〕73号',
      issuingDept: ['宜昌市人民政府办公室', '宜昌市医疗保障局'],
      publishDate: '2022-12-29',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.yichang.gov.cn/content-21-48293-1.html',
      summaryQuote: '宜府办发〔2022〕73号规定：在职职工门诊年度起付标准为500元、退休人员为400元。普通门诊统筹年度最高支付限额在职职工2200元、退休人员2600元。统筹基金支付比例：一级及以下定点医疗机构70%（基层医疗卫生机构提高至75%），二级定点医疗机构60%，三级定点医疗机构50%，退休人员在上述基础上提高5个百分点（三级55%、二级65%、基层80%）。'
    },
    {
      docId: 'yc-employee-inpatient-2023',
      title: '宜昌市职工基本医疗保险实施办法',
      docNumber: '宜府办发〔2023〕51号',
      issuingDept: ['宜昌市人民政府办公室', '宜昌市医疗保障局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.yichang.gov.cn/content-21-50123-1.html',
      summaryQuote: '宜府办发〔2023〕51号明确自2024年1月1日起施行：住院起付线一级200元、二级500元、三级1000元，年度内住院2次及以上的起付标准减半。统筹基金政策范围内支付比例一级92%、二级90%、三级88%（退休人员增加2%）。职工基本统筹年度最高支付限额为15万元，超过部分进入大额医疗保险补助。城乡居民医保住院起付标准一级200元、二级500元、三级1000元，报销比例一级85%、二级75%、三级60%。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'yc-employee-outpatient-2022',
      annualDeductible: 500,
      annualCap: 2200,
      annualCapRetiree: 2600,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/卫生院', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 500, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '宜昌市职工门诊年起付线在职500元、退休400元；基层卫生机构报销75%（退休80%）、二级60%（退休65%）、三级50%（退休55%）；在职限额2200元，退休限额2600元。'
    },
    inpatient: {
      sourceDocId: 'yc-employee-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '社区卫生服务中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 1000, reimbursementRatio: 0.88, retireeRatioBonus: 0.02 }
      },
      repeatedDeductibleRule: '年度内住院2次及以上的，起付标准减半。'
    },
    catastrophic: {
      sourceDocId: 'yc-employee-inpatient-2023',
      name: '宜昌市职工大额医疗保险',
      deductible: 150000,
      annualCap: 350000,
      tiers: [
        { minAmount: 150000, maxAmount: 500000, ratio: 0.85 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yc-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序', '宜昌医保公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '办理异地就医备案后，在备案地住院报销享受与本地相同级别医疗机构的同等政策。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'yc-employee-inpatient-2023',
      annualDeductible: 0,
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层社区卫生中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 }
      },
      note: '居民门诊统筹在基层医疗机构免起付线报销50%，年度统筹最高限额400元。'
    },
    inpatient: {
      sourceDocId: 'yc-employee-inpatient-2023',
      annualCap: 150000,
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三甲重点医院', deductible: 1000, reimbursementRatio: 0.60 }
      },
      repeatedDeductibleRule: '按转诊规定向下级医院转诊就医取消下级医院起付线。'
    },
    catastrophic: {
      sourceDocId: 'yc-employee-inpatient-2023',
      name: '宜昌市城乡居民大病保险',
      deductible: 12000,
      annualCap: 300000,
      tiers: [
        { minAmount: 12000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, maxAmount: 9999999, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'yc-employee-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '湖北医疗保障小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.80,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未按规定备案或自行到市外医疗机构住院的，降低报销比例。'
      ]
    }
  }
};
