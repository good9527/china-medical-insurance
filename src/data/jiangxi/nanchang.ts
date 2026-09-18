import type { CityInsuranceData } from '../types';

export const nanchangCityData: CityInsuranceData = {
  cityCode: '360100',
  cityName: '南昌市',
  provinceCode: '360000',
  provinceName: '江西省',
  hotline: '0791-12393',
  officialPortalUrl: 'http://ybj.nc.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'nc-employee-outpatient-2022-118',
      title: '南昌市人民政府办公室关于印发南昌市建立健全职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '洪府办发〔2022〕118号及2023年优化调整公告',
      issuingDept: ['南昌市人民政府办公室', '南昌市医疗保障局'],
      publishDate: '2022-12-08',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nc.gov.cn/ncybj/zcfg/202306/6190823.shtml',
      summaryQuote: '在职职工门诊年度起付标准调整为300元。报销比例一级及以下65%（退休70%）、二级60%（退休65%）、三级55%（退休60%）。门诊统筹年度最高支付限额在职职工2000元，退休人员3000元。'
    },
    {
      docId: 'nc-medical-insurance-inpatient-2024',
      title: '南昌市基本医疗保险住院与医疗救助待遇管理细则',
      docNumber: '洪医保发〔2024〕25号',
      issuingDept: ['南昌市医疗保障局', '南昌市财政局'],
      publishDate: '2024-11-18',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.nc.gov.cn/ncybj/zcfg/202411/7291034.shtml',
      summaryQuote: '职工住院起付线：三级800元、二级500元、一级200元；在职支付比例三级85%、二级90%、一级95%（退休人员各提高3%）。居民住院起付线：三级600元/70%、二级400元/80%、一级100元/90%，居民基本医保年度统筹限额15万元。大病保险起付线1.5万元，分段报销60%-75%，封顶35万元。'
    }
  ],

  // 城镇职工医保待遇 (南昌标准)
  employee: {
    outpatient: {
      sourceDocId: 'nc-employee-outpatient-2022-118',
      annualDeductible: 300, // 门诊年度起付线 300 元
      annualCap: 2000,       // 在职限额 2000 元
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 300, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省级三甲医院', deductible: 300, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊年度起付线300元。一级报销65%（退休70%），二级报销60%（退休65%），三级报销55%（退休60%）。在职限额2000元，退休限额3000元。'
    },
    inpatient: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      annualCap: 500000, // 基本统筹15万 + 职工大额互助
      tierBenefits: {
        community: { tierName: '一级基层定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.95, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省级三甲重点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '恶性肿瘤放化疗等特殊病种住院享受起付线减免政策。'
    },
    catastrophic: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '赣服通小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医免证明联网直接结算，异地规范转诊备案按规定比例报销。'
      ]
    }
  },

  // 城乡居民医保待遇 (南昌标准)
  resident: {
    outpatient: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      annualCap: 400, // 基层普通门诊年度限额 400 元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省级三甲医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层医疗卫生机构免起付线，报销60%，每人每年年度支付限额400元。'
    },
    inpatient: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级医疗机构', deductible: 600, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '省级三甲重点医院', deductible: 800, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 350000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'nc-medical-insurance-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '赣服通小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '按分级诊疗要求规范备案结算，未备案自行就医支付比例降低。'
      ]
    }
  }
};
