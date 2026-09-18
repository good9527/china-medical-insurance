import type { CityInsuranceData } from '../types';

/**
 * 无锡市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320200
 */
export const wuxiCityData: CityInsuranceData = {
  cityCode: '320200',
  cityName: '无锡市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '0510-12393',
  officialPortalUrl: 'https://ybj.wuxi.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方规范性红头文件与政府公开溯源凭证
  sourceDocs: [
    {
      docId: 'wx-employee-outpatient-reform-2022',
      title: '市政府办公室印发关于建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '锡政办发〔2022〕97号',
      issuingDept: ['无锡市人民政府办公室', '无锡市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.wuxi.gov.cn/doc/2022/12/30/3810234.shtml',
      summaryQuote: '在职职工年度门诊起付标准为500元，退休人员为300元。一个自然年度内在职和退休人员政策范围内医疗费用最高支付限额均为12000元。报销比例：社区卫生服务机构在职80%（退休90%）、一二级医疗机构在职75%（退休85%）、三级医疗机构在职60%（退休70%）。'
    },
    {
      docId: 'wx-medical-insurance-inpatient-2023',
      title: '无锡市医疗保障局关于调整基本医疗保险住院统筹待遇标准的通知',
      docNumber: '锡医保发〔2023〕18号',
      issuingDept: ['无锡市医疗保障局', '无锡市财政局'],
      publishDate: '2023-06-15',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'https://ybj.wuxi.gov.cn/doc/2023/06/18/3950123.shtml',
      summaryQuote: '职工住院起付线：三级在职950元/退休750元、二级在职750元/退休600元、一级400元、社区300元（第二次减半，第三次及以上为25%）。在职统筹支付比例三级88%、二级92%、一级95%（退休人员加3%）。居民住院起付线三级800元、二级600元、一级300元，报销比例一级85%、二级75%、三级65%。职工基本统筹限额30万元。'
    }
  ],

  // 城镇职工医保待遇 (无锡标准)
  employee: {
    outpatient: {
      sourceDocId: 'wx-employee-outpatient-reform-2022',
      annualDeductible: 500,   // 在职门诊起付线 500 元，退休 300 元
      annualCap: 12000,        // 门诊年限额 1.2 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 500, reimbursementRatio: 0.80, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级综合医院', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属重点三甲医院', deductible: 500, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊起付线在职500元、退休300元。社区报销80%（退休90%）、一二级报销75%（退休85%）、三级报销60%（退休70%）。年度限额1.2万元。'
    },
    inpatient: {
      sourceDocId: 'wx-medical-insurance-inpatient-2023',
      annualCap: 300000, // 基本统筹限额 30 万元
      repeatedDeductibleRule: '第二次住院起付线按50%计算，第三次及以上按25%计算',
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级医疗机构', deductible: 400, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级医疗机构', deductible: 750, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级综合医院', deductible: 950, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '三甲重点医院', deductible: 950, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 }
      }
    },
    catastrophic: {
      name: '无锡市职工大病补充医疗保险',
      deductible: 0,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wx-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  },

  // 城乡居民医保待遇 (无锡标准)
  resident: {
    outpatient: {
      sourceDocId: 'wx-employee-outpatient-reform-2022',
      annualCap: 1000,
      tierBenefits: {
        community: { tierName: '社区卫生服务机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点机构', deductible: 200, reimbursementRatio: 0.50 },
        tier3: { tierName: '三级定点机构', deductible: 200, reimbursementRatio: 0.40 },
        tier3_top: { tierName: '三甲重点机构', deductible: 200, reimbursementRatio: 0.40 }
      },
      note: '居民门诊在基层医疗机构免起付线报销60%，限额1000元。'
    },
    inpatient: {
      sourceDocId: 'wx-medical-insurance-inpatient-2023',
      annualCap: 250000,
      repeatedDeductibleRule: '二次及多次住院起付线逐次递减',
      tierBenefits: {
        community: { tierName: '基层卫生机构', deductible: 300, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点机构', deductible: 400, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点机构', deductible: 800, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三级甲等医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      name: '无锡市城乡居民大病保险',
      deductible: 15000,
      annualCap: 350000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'wx-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.70,
      specialNotes: ['长三角一体化直接结算，跨市就医按规定办理异地备案。']
    }
  }
};
