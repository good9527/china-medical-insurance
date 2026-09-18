import type { CityInsuranceData } from '../types';

/**
 * 重庆市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹级别：直辖市级统筹（全市统一标准）
 */
export const chongqingCityData: CityInsuranceData = {
  cityCode: '500100',
  cityName: '重庆市',
  provinceCode: '500000',
  provinceName: '重庆市',
  hotline: '023-12393',
  officialPortalUrl: 'https://ybj.cq.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'cq-employee-outpatient-reform',
      title: '重庆市人民政府办公厅关于建立健全职工基本医疗保险门诊共济保障机制的实施意见',
      docNumber: '渝府办发〔2022〕140号',
      issuingDept: ['重庆市人民政府办公厅', '重庆市医疗保障局'],
      publishDate: '2022-12-30',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.cq.gov.cn/zwgk_214/zcwj/202301/t20230103_11448657.html',
      summaryQuote: '在职职工普通门诊起付线为200元/年，退休人员为100元/年。二级及以下定点医疗机构支付比例为60%，三级定点医疗机构为50%；退休人员相应提高10个百分点（二级及以下70%、三级60%）。随单位参保在职限额3000元，退休限额4000元。'
    },
    {
      docId: 'cq-medical-insurance-regulations',
      title: '重庆市医疗保障局 重庆市财政局关于调整基本医疗保险有关政策的通知',
      docNumber: '渝医保发〔2023〕35号及2025调整规程',
      issuingDept: ['重庆市医疗保障局', '重庆市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'https://ybj.cq.gov.cn/zwgk_214/zcwj/202311/t20231128_12613146.html',
      summaryQuote: '职工医保住院起付线：一级220元、二级440元、三级880元。在职职工统筹支付比例：一级90%、二级87%、三级85%；退休人员统一为95%。基本统筹年限额4.7万元，大额互助保险限额50万元。居民医保住院起付线：一级100元、二级300元、三级800元；报销比例一级80%、二级70%、三级50%。大病保险起付线2025年为18797元，报销比例60%。'
    },
    {
      docId: 'cq-resident-outpatient-regulations',
      title: '重庆市城乡居民合作医疗保险普通门诊统筹及两病保障规程',
      docNumber: '渝医保发〔2021〕68号',
      issuingDept: ['重庆市医疗保障局'],
      publishDate: '2021-10-15',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://ybj.cq.gov.cn/zwgk_214/zcjd/202110/t20211020_9861054.html',
      summaryQuote: '居民医保普通门诊统筹：一级及以下定点医疗机构报销比例60%，二级医疗机构报销40%，三级医院普通门诊不予报销。年度支付限额一档300元/人，二档500元/人。'
    },
    {
      docId: 'cq-catastrophic-resident-2024',
      title: '重庆市医疗保障局等四部门关于做好2024年城乡居民基本医疗保障工作的通知',
      docNumber: '渝医保发〔2024〕20号',
      issuingDept: ['重庆市医疗保障局', '重庆市财政局', '国家税务总局重庆市税务局'],
      publishDate: '2024-09-10',
      effectiveDate: '2024-09-15',
      status: 'active',
      officialUrl: 'https://ybj.cq.gov.cn/zwgk_214/zcwj/202409/t20240915_13612890.html',
      summaryQuote: '全面落实大病保险保障待遇，提升门诊慢特病保障水平；巩固成渝双城经济圈医保协同结算成果，推进跨省跨区域就医免备案直接结算。'
    }
  ],

  // 城镇职工医保待遇 (重庆标准)
  employee: {
    outpatient: {
      sourceDocId: 'cq-employee-outpatient-reform',
      annualDeductible: 200, // 在职职工门诊起付线 200 元
      annualDeductibleRetiree: 100, // 退休人员门诊起付线 100 元
      annualCap: 3000,       // 在职职工门诊封顶线 3000 元
      annualCapRetiree: 4000,// 退休人员门诊封顶线 4000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/乡镇卫生院', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '自然年度内门诊累计满200元（退休100元）起付线后启动报销，二级及以下报销60%（退休70%），三级报销50%（退休60%）。单位在职限额3000元，退休限额4000元。'
    },
    inpatient: {
      sourceDocId: 'cq-medical-insurance-regulations',
      annualCap: 47000, // 基本医疗保险统筹基金年封顶线 4.7 万元（超过由职工大额互助100%报销至50万）
      comprehensiveCap: 500000, // 职工大额互助衔接后年度最高支付限额 50 万元
      tierBenefits: {
        community: { tierName: '一级及社区卫生服务机构', deductible: 220, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 }, // 退休95%
        tier1: { tierName: '一级定点医疗机构', deductible: 220, reimbursementRatio: 0.90, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 440, reimbursementRatio: 0.87, retireeRatioBonus: 0.08 },
        tier3: { tierName: '三级定点医疗机构', deductible: 880, reimbursementRatio: 0.85, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '三甲重点医院', deductible: 880, reimbursementRatio: 0.85, retireeRatioBonus: 0.10 }
      },
      repeatedDeductibleRule: '参保人员一年内多次住院的，从第二次起起付线依次降低。'
    },
    catastrophic: {
      sourceDocId: 'cq-medical-insurance-regulations',
      name: '城镇职工大额医疗互助保险',
      deductible: 47000, // 超过基本医保4.7万后启动
      annualCap: 500000,
      tiers: [
        { minAmount: 47000, maxAmount: 547000, ratio: 1.00 } // 100%报销
      ]
    },
    remoteMedical: {
      sourceDocId: 'cq-medical-insurance-regulations',
      filingChannels: ['国家医保服务平台APP', '重庆医保微信公众号', '渝快办'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '川渝两地推进医保一体化，跨省就医已实现免备案直接结算。'
      ]
    }
  },

  // 城乡居民医保待遇 (重庆标准)
  resident: {
    outpatient: {
      sourceDocId: 'cq-resident-outpatient-regulations',
      annualDeductible: 0,
      annualCap: 300, // 居民普通门诊一档300元，二档500元
      tierBenefits: {
        community: { tierName: '基层乡镇卫生院/社区卫生站', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.40 },
        tier3: { tierName: '三级定点医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊限定一级及以下（报销60%）和二级医疗机构（报销40%），三级医疗机构不予报销。年支付限额一档300元、二档500元。'
    },
    inpatient: {
      sourceDocId: 'cq-medical-insurance-regulations',
      annualCap: 80000, // 居民住院一档8万元，二档12万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/一级定点医疗机构', deductible: 100, reimbursementRatio: 0.80 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.70 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 800, reimbursementRatio: 0.50 }
      }
    },
    catastrophic: {
      sourceDocId: 'cq-medical-insurance-regulations',
      name: '城乡居民大病保险',
      deductible: 19856, // 2026年起最新调整为19856元
      tiers: [
        { minAmount: 19856, ratio: 0.60 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'cq-medical-insurance-regulations',
      filingChannels: ['国家医保服务平台APP', '重庆医保微信公众号'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '川渝跨省异地就医直接结算，规范备案人员与参保地报销待遇一致。'
      ]
    }
  }
};
