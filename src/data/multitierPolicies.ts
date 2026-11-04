/**
 * 全国多层次医疗保障体系政策库 (Multi-Tier Healthcare Security Policy Registry)
 * 涵盖：
 * 1. 长期护理保险（长护险 / 医保第六险）全国代表试点城市政策规程
 * 2. 城市普惠型商业健康保险（城市惠民保）代表城市保障梯次与特药条款
 * 
 * 依据文件：
 * - 医保发〔2020〕37号《关于扩大长期护理保险制度试点的指导意见》
 * - 医保办发〔2021〕37号《长期护理失能等级评估标准（试行）》
 * - 中发〔2020〕5号《中共中央 国务院关于深化医疗保障制度改革的意见》
 */

import type {
  LtcCityPolicy,
  LtcDisabilityGrade,
  LtcCareMode,
  HuiminbaoProductPolicy
} from './types';

// ============================================================================
// 1. 长期护理保险 (LTC) 代表城市政策矩阵
// ============================================================================

export const LTC_POLICIES: Record<string, LtcCityPolicy> = {
  // 上海市 (310100 / 310000)
  '310100': {
    cityCode: '310100',
    cityName: '上海市',
    sourceDocNumber: '沪医保规〔2023〕8号及沪人社规〔2017〕42号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'institution', 'institution_pension'],
    homeService: {
      hourlyRate: 65,
      fundPayRatio: 0.90,
      monthlyMaxCap: 3500,
      monthlyMaxCapByGrade: {
        moderate: 2100,
        severe1: 2800,
        severe2: 3500,
        severe3: 4200
      }
    },
    institutionalCare: {
      fundPayRatio: 0.85,
      dailyBedSubsidy: 50,
      monthlyMaxCap: 3500,
      monthlyFixedCapByGrade: {
        moderate: 2000,
        severe1: 2600,
        severe2: 3200,
        severe3: 3800
      }
    },
    defaultHomeRatio: 0.90,
    defaultInstitutionRatio: 0.85,
    defaultMonthlyCap: 3500,
    notes: [
      '上海市长护险评估等级2~6级享受待遇',
      '居家照护基金支付90%，机构照护基金支付85%'
    ]
  },
  '310000': {
    cityCode: '310000',
    cityName: '上海市',
    sourceDocNumber: '沪医保规〔2023〕8号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'institution', 'institution_pension'],
    homeService: {
      hourlyRate: 65,
      fundPayRatio: 0.90,
      monthlyMaxCap: 3500,
      monthlyMaxCapByGrade: {
        moderate: 2100,
        severe1: 2800,
        severe2: 3500,
        severe3: 4200
      }
    },
    institutionalCare: {
      fundPayRatio: 0.85,
      dailyBedSubsidy: 50,
      monthlyMaxCap: 3500,
      monthlyFixedCapByGrade: {
        moderate: 2000,
        severe1: 2600,
        severe2: 3200,
        severe3: 3800
      }
    },
    defaultHomeRatio: 0.90,
    defaultInstitutionRatio: 0.85,
    defaultMonthlyCap: 3500
  },

  // 广州市 (440100)
  '440100': {
    cityCode: '440100',
    cityName: '广州市',
    sourceDocNumber: '穗医保规字〔2021〕2号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'institution', 'institution_pension', 'institution_medical'],
    homeService: {
      hourlyRate: 50,
      fundPayRatio: 0.90,
      monthlyMaxCap: 2000,
      monthlyMaxCapByGrade: {
        moderate: 1200,
        severe1: 1600,
        severe2: 2000,
        severe3: 2400
      }
    },
    institutionalCare: {
      fundPayRatio: 0.75,
      dailyBedSubsidy: 35,
      monthlyMaxCap: 2400,
      monthlyFixedCapByGrade: {
        moderate: 1500,
        severe1: 1800,
        severe2: 2100,
        severe3: 2400
      }
    },
    defaultHomeRatio: 0.90,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2200,
    notes: ['广州市长护险职工机构支付75%，居家支付90%，床位费最高35元/天']
  },

  // 成都市 (510100)
  '510100': {
    cityCode: '510100',
    cityName: '成都市',
    sourceDocNumber: '成医保发〔2022〕18号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'home_cash_allowance', 'institution', 'institution_pension'],
    homeService: {
      hourlyRate: 45,
      fundPayRatio: 0.75,
      monthlyMaxCap: 1796,
      monthlyMaxCapByGrade: {
        moderate: 860,
        severe1: 1077,
        severe2: 1437,
        severe3: 1796
      }
    },
    institutionalCare: {
      fundPayRatio: 0.75,
      dailyBedSubsidy: 60,
      monthlyMaxCap: 2296,
      monthlyFixedCapByGrade: {
        moderate: 1100,
        severe1: 1377,
        severe2: 1837,
        severe3: 2296
      }
    },
    defaultHomeRatio: 0.75,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2296,
    notes: ['成都市长护险定额包干支付：机构定额重度二级1837元/月、三级2296元/月']
  },

  // 青岛市 (370200)
  '370200': {
    cityCode: '370200',
    cityName: '青岛市',
    sourceDocNumber: '青医保发〔2021〕26号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3', 'dementia'],
    supportedModes: ['home', 'home_service', 'institution', 'institution_medical'],
    homeService: {
      hourlyRate: 50,
      fundPayRatio: 0.90,
      monthlyMaxCap: 2000,
      monthlyMaxCapByGrade: {
        moderate: 1400,
        severe1: 1700,
        severe2: 2000,
        severe3: 2400,
        dementia: 2000
      }
    },
    institutionalCare: {
      fundPayRatio: 0.85,
      dailyBedSubsidy: 65,
      monthlyMaxCap: 2400,
      monthlyFixedCapByGrade: {
        moderate: 1600,
        severe1: 1900,
        severe2: 2200,
        severe3: 2400,
        dementia: 2200
      }
    },
    defaultHomeRatio: 0.90,
    defaultInstitutionRatio: 0.85,
    defaultMonthlyCap: 2400
  },

  // 苏州市 (320500)
  '320500': {
    cityCode: '320500',
    cityName: '苏州市',
    sourceDocNumber: '苏医保发〔2022〕45号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'institution'],
    homeService: {
      hourlyRate: 40,
      fundPayRatio: 0.9375, // 40元中基金付37.5元，个人付2.5元
      monthlyMaxCap: 1800,
      monthlyMaxCapByGrade: {
        moderate: 1200,
        severe1: 1500,
        severe2: 1800,
        severe3: 2100
      }
    },
    institutionalCare: {
      fundPayRatio: 0.80,
      dailyBedSubsidy: 30,
      monthlyMaxCap: 2200,
      monthlyFixedCapByGrade: {
        moderate: 690,
        severe1: 900,
        severe2: 1500,
        severe3: 2200
      }
    },
    defaultHomeRatio: 0.9375,
    defaultInstitutionRatio: 0.80,
    defaultMonthlyCap: 2000
  },

  // 南通市 (320600)
  '320600': {
    cityCode: '320600',
    cityName: '南通市',
    sourceDocNumber: '通医保发〔2021〕33号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'home_cash_allowance', 'institution'],
    homeService: {
      hourlyRate: 45,
      fundPayRatio: 0.75,
      monthlyMaxCap: 1600,
      monthlyMaxCapByGrade: {
        moderate: 1000,
        severe1: 1300,
        severe2: 1600,
        severe3: 1900
      }
    },
    institutionalCare: {
      fundPayRatio: 0.80,
      dailyBedSubsidy: 50,
      monthlyMaxCap: 2100,
      monthlyFixedCapByGrade: {
        moderate: 900,
        severe1: 1200,
        severe2: 1600,
        severe3: 2100
      }
    },
    defaultHomeRatio: 0.75,
    defaultInstitutionRatio: 0.80,
    defaultMonthlyCap: 2000
  },

  // 荆门市 (420800)
  '420800': {
    cityCode: '420800',
    cityName: '荆门市',
    sourceDocNumber: '荆政办发〔2020〕15号',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'home_service', 'institution'],
    homeService: {
      hourlyRate: 40,
      fundPayRatio: 0.85,
      monthlyMaxCap: 1500,
      monthlyMaxCapByGrade: {
        moderate: 900,
        severe1: 1200,
        severe2: 1500,
        severe3: 1800
      }
    },
    institutionalCare: {
      fundPayRatio: 0.80,
      dailyBedSubsidy: 40,
      monthlyMaxCap: 2000,
      monthlyFixedCapByGrade: {
        moderate: 1000,
        severe1: 1300,
        severe2: 1700,
        severe3: 2000
      }
    },
    defaultHomeRatio: 0.85,
    defaultInstitutionRatio: 0.80,
    defaultMonthlyCap: 1800
  },

  // 宁波市 (330200)
  '330200': {
    cityCode: '330200',
    cityName: '宁波市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.80,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2200
  },

  // 上饶市 (361100)
  '361100': {
    cityCode: '361100',
    cityName: '上饶市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.75,
    defaultInstitutionRatio: 0.70,
    defaultMonthlyCap: 1800
  },

  // 石河子市 (660100)
  '660100': {
    cityCode: '660100',
    cityName: '石河子市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.75,
    defaultInstitutionRatio: 0.70,
    defaultMonthlyCap: 1800
  },

  // 北京市 (110100 / 110000)
  '110100': {
    cityCode: '110100',
    cityName: '北京市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.80,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2500
  },
  '110000': {
    cityCode: '110000',
    cityName: '北京市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.80,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2500
  },

  // 天津市 (120100 / 120000)
  '120100': {
    cityCode: '120100',
    cityName: '天津市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.80,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2200
  },
  '120000': {
    cityCode: '120000',
    cityName: '天津市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.80,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2200
  },

  // 重庆市 (500100 / 500000)
  '500100': {
    cityCode: '500100',
    cityName: '重庆市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.75,
    defaultInstitutionRatio: 0.70,
    defaultMonthlyCap: 2000
  },
  '500000': {
    cityCode: '500000',
    cityName: '重庆市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.75,
    defaultInstitutionRatio: 0.70,
    defaultMonthlyCap: 2000
  },

  // 长春市 (220100)
  '220100': {
    cityCode: '220100',
    cityName: '长春市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.80,
    defaultInstitutionRatio: 0.75,
    defaultMonthlyCap: 2100
  },

  // 济南市 (370100)
  '370100': {
    cityCode: '370100',
    cityName: '济南市',
    supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3'],
    supportedModes: ['home', 'institution'],
    defaultHomeRatio: 0.85,
    defaultInstitutionRatio: 0.80,
    defaultMonthlyCap: 2200
  }
};

// 国家标准长护险兜底政策 (针对未单独建制地区或统一标准)
export const DEFAULT_LTC_POLICY: LtcCityPolicy = {
  cityCode: 'default',
  cityName: '国家长护险试点统一规范',
  supportedGrades: ['moderate', 'severe1', 'severe2', 'severe3', 'dementia'],
  supportedModes: ['home', 'home_service', 'institution', 'institution_pension'],
  defaultHomeRatio: 0.75,
  defaultInstitutionRatio: 0.70,
  defaultMonthlyCap: 2000,
  notes: ['遵照国家医保局医保发〔2020〕37号长护险通用试点框架执行']
};

/**
 * 依据城市编码查询长护险政策
 */
export function getLtcPolicy(cityCode: string): LtcCityPolicy {
  return LTC_POLICIES[cityCode] || DEFAULT_LTC_POLICY;
}

// ============================================================================
// 2. 城市普惠型商业健康保险 (惠民保) 代表产品矩阵
// ============================================================================

export const HUIMINBAO_POLICIES: Record<string, HuiminbaoProductPolicy> = {
  // 北京市 - 北京普惠健康保 (110100 / 110000)
  '110100': {
    productCode: 'beijing_puhui',
    productName: '北京普惠健康保',
    cityCode: '110100',
    cityName: '北京市',
    premiumAnnual: 195,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 30400,
      deductibleConsecutive: 30400,
      reimbursementRatioHealthy: 0.80,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 5000, // 连续3年参保无理赔下调至5000元
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 3000000,
    notes: ['北京市医保局、金融监管总局北京监管局共同指导，连续参保医保外自费免赔额低至5000元']
  },
  '110000': {
    productCode: 'beijing_puhui',
    productName: '北京普惠健康保',
    cityCode: '110000',
    cityName: '北京市',
    premiumAnnual: 195,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 30400,
      deductibleConsecutive: 30400,
      reimbursementRatioHealthy: 0.80,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 5000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 3000000
  },

  // 上海市 - 上海沪惠保 (310100 / 310000)
  '310100': {
    productCode: 'shanghai_huhuibao',
    productName: '上海沪惠保',
    cityCode: '310100',
    cityName: '上海市',
    premiumAnnual: 129,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 14000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 12000,
      deductibleConsecutive: 10000, // 连续参保无理赔下调至10000元
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1100000 // 含国内特药100万、海外特药30万、CAR-T 50万
    },
    comprehensiveAnnualCap: 3100000,
    notes: ['上海市医保局指导，聚焦目录外高额自费与特药，CAR-T与质子重离子0免赔']
  },
  '310000': {
    productCode: 'shanghai_huhuibao',
    productName: '上海沪惠保',
    cityCode: '310000',
    cityName: '上海市',
    premiumAnnual: 129,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 14000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 12000,
      deductibleConsecutive: 10000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1100000
    },
    comprehensiveAnnualCap: 3100000
  },

  // 广州市 - 广州穗岁康 (440100)
  '440100': {
    productCode: 'guangzhou_suisukang',
    productName: '广州穗岁康',
    cityCode: '440100',
    cityName: '广州市',
    premiumAnnual: 180,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 16000,
      deductibleConsecutive: 15000,
      reimbursementRatioHealthy: 0.80,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 16000,
      deductibleConsecutive: 15000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 16000,
      deductibleConsecutive: 15000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 300000
    },
    comprehensiveAnnualCap: 2450000,
    notes: ['广州市医保局主导设计，一站式协同直赔，连续参保免赔额降至1.5万元']
  },

  // 深圳市 - 深圳惠民保 (440300)
  '440300': {
    productCode: 'shenzhen_huiminbao',
    productName: '深圳惠民保',
    cityCode: '440300',
    cityName: '深圳市',
    premiumAnnual: 88,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 10000,
      reimbursementRatioHealthy: 0.80,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1200000
    },
    outCatalogCoverage: {
      deductibleStandard: 11000,
      deductibleConsecutive: 10000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.45,
      annualCap: 1200000
    },
    specialDrugCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 10000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1100000
    },
    comprehensiveAnnualCap: 3500000,
    notes: ['深圳市医保局主导，88元保超350万，全面覆盖医保内自付、住院自费与罕见病创新药']
  },

  // 杭州市 - 杭州西湖益联保 (330100)
  '330100': {
    productCode: 'hangzhou_xihuyilianbao',
    productName: '杭州西湖益联保',
    cityCode: '330100',
    cityName: '杭州市',
    premiumAnnual: 150,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 13000,
      deductibleConsecutive: 10000,
      reimbursementRatioHealthy: 0.80,
      reimbursementRatioPreExisting: 0.50,
      annualCap: 1200000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 10000,
      deductibleConsecutive: 5000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 3200000,
    notes: ['杭州市医保局指导，西湖益联保大病补充与住院自费衔接，特药多达上百种']
  },

  // 成都市 - 成都惠蓉保 (510100)
  '510100': {
    productCode: 'chengdu_huirongbao',
    productName: '成都惠蓉保',
    cityCode: '510100',
    cityName: '成都市',
    premiumAnnual: 59,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 8000, // 连续参保优待降至8000元
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 11000,
      reimbursementRatioHealthy: 0.30,
      reimbursementRatioPreExisting: 0.20,
      annualCap: 500000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.20,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 2300000,
    notes: ['成都市医保局指导，59元普惠保，全自费特药0免赔']
  },

  // 重庆市 - 重庆渝快保 (500100 / 500000)
  '500100': {
    productCode: 'chongqing_yukaibao',
    productName: '重庆渝快保',
    cityCode: '500100',
    cityName: '重庆市',
    premiumAnnual: 69,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.75,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.55,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 3000000
  },
  '500000': {
    productCode: 'chongqing_yukaibao',
    productName: '重庆渝快保',
    cityCode: '500000',
    cityName: '重庆市',
    premiumAnnual: 69,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.75,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.55,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 3000000
  },

  // 武汉市 - 武汉江城安心保 (420100)
  '420100': {
    productCode: 'wuhan_jiangchenganxin',
    productName: '武汉江城安心保',
    cityCode: '420100',
    cityName: '武汉市',
    premiumAnnual: 99,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.75,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 600000
    },
    comprehensiveAnnualCap: 2600000
  },

  // 南京市 - 南京宁惠保 (320100)
  '320100': {
    productCode: 'nanjing_ninghuibao',
    productName: '南京宁惠保',
    cityCode: '320100',
    cityName: '南京市',
    premiumAnnual: 99,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.80,
      reimbursementRatioPreExisting: 0.45,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 1000000
    },
    comprehensiveAnnualCap: 3000000
  },

  // 济南市 - 济南齐鲁保 (370100)
  '370100': {
    productCode: 'jinan_qilubao',
    productName: '济南齐鲁保',
    cityCode: '370100',
    cityName: '济南市',
    premiumAnnual: 149,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 14000,
      deductibleConsecutive: 11000,
      reimbursementRatioHealthy: 0.75,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    comprehensiveAnnualCap: 2500000
  },

  // 长沙市 - 长沙星惠保 (430100)
  '430100': {
    productCode: 'changsha_xinghuibao',
    productName: '长沙星惠保',
    cityCode: '430100',
    cityName: '长沙市',
    premiumAnnual: 48,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 800000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.50,
      reimbursementRatioPreExisting: 0.25,
      annualCap: 700000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    comprehensiveAnnualCap: 2000000
  },

  // 郑州市 - 郑州医惠保 (410100)
  '410100': {
    productCode: 'zhengzhou_yihuibao',
    productName: '郑州医惠保',
    cityCode: '410100',
    cityName: '郑州市',
    premiumAnnual: 89,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 800000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.50,
      reimbursementRatioPreExisting: 0.25,
      annualCap: 700000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.65,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    comprehensiveAnnualCap: 2000000
  },

  // 西安市 - 西安长安益康保 (610100)
  '610100': {
    productCode: 'xian_changanyikang',
    productName: '西安长安益康保',
    cityCode: '610100',
    cityName: '西安市',
    premiumAnnual: 99,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.75,
      reimbursementRatioPreExisting: 0.40,
      annualCap: 1000000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.55,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 1000000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.65,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    comprehensiveAnnualCap: 2500000
  },

  // 沈阳市 - 沈阳盛京保 (210100)
  '210100': {
    productCode: 'shenyang_shengjingbao',
    productName: '沈阳盛京保',
    cityCode: '210100',
    cityName: '沈阳市',
    premiumAnnual: 115,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 800000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.50,
      reimbursementRatioPreExisting: 0.25,
      annualCap: 700000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    comprehensiveAnnualCap: 2000000
  },

  // 哈尔滨市 - 哈尔滨龙江惠民保 (230100)
  '230100': {
    productCode: 'harbin_longjianghuimin',
    productName: '哈尔滨龙江惠民保',
    cityCode: '230100',
    cityName: '哈尔滨市',
    premiumAnnual: 99,
    effectiveYear: 2025,
    inCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.70,
      reimbursementRatioPreExisting: 0.35,
      annualCap: 800000
    },
    outCatalogCoverage: {
      deductibleStandard: 15000,
      deductibleConsecutive: 12000,
      reimbursementRatioHealthy: 0.50,
      reimbursementRatioPreExisting: 0.25,
      annualCap: 700000
    },
    specialDrugCoverage: {
      deductibleStandard: 0,
      deductibleConsecutive: 0,
      reimbursementRatioHealthy: 0.60,
      reimbursementRatioPreExisting: 0.30,
      annualCap: 500000
    },
    comprehensiveAnnualCap: 2000000
  }
};

// 通用标准普惠型商业健康保险兜底规则
export const DEFAULT_HUIMINBAO_POLICY: HuiminbaoProductPolicy = {
  productCode: 'default_huiminbao',
  productName: '城市普惠型商业健康保险',
  cityCode: 'default',
  cityName: '全国代表城市普惠保通用基准',
  premiumAnnual: 99,
  effectiveYear: 2025,
  inCatalogCoverage: {
    deductibleStandard: 15000,
    deductibleConsecutive: 12000,
    reimbursementRatioHealthy: 0.70,
    reimbursementRatioPreExisting: 0.35,
    annualCap: 1000000
  },
  outCatalogCoverage: {
    deductibleStandard: 15000,
    deductibleConsecutive: 12000,
    reimbursementRatioHealthy: 0.50,
    reimbursementRatioPreExisting: 0.25,
    annualCap: 1000000
  },
  specialDrugCoverage: {
    deductibleStandard: 0,
    deductibleConsecutive: 0,
    reimbursementRatioHealthy: 0.60,
    reimbursementRatioPreExisting: 0.30,
    annualCap: 500000
  },
  comprehensiveAnnualCap: 2000000,
  notes: ['遵照全国典型城市普惠型商业健康保险产品通用基准精算执行']
};

/**
 * 依据城市编码或产品编码查询惠民保产品政策
 */
export function getHuiminbaoPolicy(cityCode: string, productId?: string): HuiminbaoProductPolicy {
  if (productId) {
    const found = Object.values(HUIMINBAO_POLICIES).find(p => p.productCode === productId);
    if (found) return found;
  }
  return HUIMINBAO_POLICIES[cityCode] || DEFAULT_HUIMINBAO_POLICY;
}
