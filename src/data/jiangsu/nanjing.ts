import type { CityInsuranceData } from '../types';

/**
 * 南京市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：320100
 */
export const nanjingCityData: CityInsuranceData = {
  cityCode: '320100',
  cityName: '南京市',
  provinceCode: '320000',
  provinceName: '江苏省',
  hotline: '025-12393',
  officialPortalUrl: 'https://ybj.nanjing.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'nj-employee-outpatient-reform',
      title: '南京市人民政府办公厅关于印发南京市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '宁政办发〔2022〕60号',
      issuingDept: ['南京市人民政府办公厅', '南京市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.nanjing.gov.cn/njybj/202212/t20221223_3789421.html',
      summaryQuote: '南京市全面取消职工医保门诊统筹起付标准（0元起付）。统筹基金支付比例按医疗机构级别实行差异化支付：社区卫生服务机构在职报销85%（退休90%）、二级医疗机构在职报销70%（退休75%）、三级医疗机构在职报销60%（退休65%）。门诊统筹年度最高支付限额在职职工提高至1.5万元，退休人员提高至1.8万元。'
    },
    {
      docId: 'nj-medical-insurance-inpatient',
      title: '南京市城乡居民基本医疗保险办法及住院报销规程',
      docNumber: '宁政规字〔2021〕6号及2024调整规程',
      issuingDept: ['南京市人民政府', '南京市医疗保障局'],
      publishDate: '2021-12-10',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.nanjing.gov.cn/njybj/202112/t20211218_3214567.html',
      summaryQuote: '基本医疗保险住院起付线：一级300元、二级500元、三级1000元（第二次减半，第三次及以上免除）。职工住院报销比例三级在职88%（退休93%）、二级92%、一级95%；统筹基金最高支付限额36万元。居民住院起付线同上，报销比例一级90%、二级85%、三级65%，年度最高支付限额为36万元。大病保险起付线为1.5万元，不设封顶线。'
    }
  ],

  // 城镇职工医保待遇 (南京标准)
  employee: {
    outpatient: {
      sourceDocId: 'nj-employee-outpatient-reform',
      annualDeductible: 0,   // 南京职工门诊全面取消起付线（0元起付）
      annualCap: 15000,      // 在职门诊年限额 1.5 万元
      annualCapRetiree: 18000, // 退休门诊年限额 1.8 万元
      tierBenefits: {
        community: { tierName: '社区卫生服务机构/乡镇卫生院', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲综合医院', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线，社区医疗机构在职报销85%（退休90%），二级医院报销70%（退休75%），三级医院报销60%（退休65%）。在职年限额1.5万元，退休1.8万元。'
    },
    inpatient: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      annualCap: 360000, // 基本医疗保险统筹限额 36 万元
      tierBenefits: {
        community: { tierName: '一级及社区卫生机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.88, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 1000, reimbursementRatio: 0.88, retireeRatioBonus: 0.05 }
      },
      repeatedDeductibleRule: '第二次住院起付线减半，第三次及以上住院免除起付线。'
    },
    catastrophic: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      name: '南京市大病保险（不设封顶线）',
      deductible: 15000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP', '我的南京APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角异地就医直接联网结算，符合规范备案人员享受参保地同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (南京标准)
  resident: {
    outpatient: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      annualDeductible: 200, // 居民门诊起付线 200 元（学生儿童 100 元）
      annualCap: 1200, // 居民门诊统筹限额
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 200, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier2: { tierName: '二级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '城乡居民普通门诊起付标准为200元（学生儿童100元），限定在基层定点社区卫生服务机构，报销比例60%，年最高限额1200元。'
    },
    inpatient: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      annualCap: 360000, // 居民住院年最高限额 36 万元
      tierBenefits: {
        community: { tierName: '基层社区卫生服务中心', deductible: 300, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.85 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 1000, reimbursementRatio: 0.65 }
      },
      repeatedDeductibleRule: '第二次住院起付线减半，第三次及以上免起付线。'
    },
    catastrophic: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      name: '城乡居民大病保险',
      deductible: 15000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nj-medical-insurance-inpatient',
      filingChannels: ['国家医保服务平台APP', '江苏医保云APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长三角区域一体化直接结算，省内就医免备案直接结算。'
      ]
    }
  }
};
