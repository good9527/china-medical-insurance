import type { CityInsuranceData } from '../types';

/**
 * 宝鸡市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 */
export const baojiCityData: CityInsuranceData = {
  cityCode: '610300',
  cityName: '宝鸡市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0917-12393',
  officialPortalUrl: 'http://ybj.baoji.gov.cn/',
  lastUpdated: '2026-03-01',
  
  sourceDocs: [
    {
      docId: 'bj-employee-outpatient-2022-54',
      title: '宝鸡市人民政府办公室关于印发〈宝鸡市职工基本医疗保险门诊共济保障实施办法（试行）〉的通知',
      docNumber: '宝政办发〔2022〕54号',
      issuingDept: ['宝鸡市人民政府办公室', '宝鸡市医疗保障局', '宝鸡市财政局'],
      publishDate: '2022-07-30',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.baoji.gov.cn/',
      summaryQuote: '参保职工在定点医药机构普通门诊就诊，医保基金起付标准为50元/次。一个自然月内只收取1次起付标准，一个年度内收取起付标准的次数累计不超过4次。支付比例：一级医疗机构及定点药店在职60%、退休65%；二级医疗机构在职55%、退休60%；三级医疗机构在职50%、退休55%。年度最高支付限额：在职职工500元/年，退休职工900元/年，不结转。'
    },
    {
      docId: 'bj-resident-inpatient-adjust-2022-66',
      title: '宝鸡市医疗保障局 宝鸡市财政局关于调整城乡居民基本医疗保险有关政策的通知',
      docNumber: '宝医保发〔2022〕66号',
      issuingDept: ['宝鸡市医疗保障局', '宝鸡市财政局'],
      publishDate: '2022-08-25',
      effectiveDate: '2022-09-01',
      status: 'active',
      officialUrl: 'http://ybj.baoji.gov.cn/',
      summaryQuote: '调整宝鸡市城乡居民医保住院起付线与报销比例：一级定点医疗机构起付线400元（学生儿童100元），支付比例90%；二级医疗机构起付线由800元下调至600元（学生儿童400元），支付比例调整为80%（原78%）；三级医疗机构起付线由2000元下调至1500元（学生儿童1000元），支付比例调整为65%（原62%）。'
    },
    {
      docId: 'bj-employee-inpatient-policy-2020',
      title: '宝鸡市人民政府关于印发〈宝鸡市建立健全职工基本医疗保险市级统筹制度实施办法〉的通知及住院待遇标准',
      docNumber: '宝政发〔2020〕25号',
      issuingDept: ['宝鸡市人民政府', '宝鸡市医疗保障局'],
      publishDate: '2020-12-10',
      effectiveDate: '2021-01-01',
      status: 'active',
      officialUrl: 'http://ybj.baoji.gov.cn/',
      summaryQuote: '职工医保住院起付标准：一级定点医疗机构300元，二级定点医疗机构600元，三级定点医疗机构1500元。符合政策范围费用支付比例：一级机构在职92%（退休94%），二级机构在职90%（退休92%），三级机构在职85%（退休87%）。统筹基金年度最高支付限额35万元。'
    }
  ],

  employee: {
    outpatient: {
      sourceDocId: 'bj-employee-outpatient-2022-54',
      annualDeductible: 50, // 按次50元（月计1次，年最多收4次即200元）
      annualCap: 500,       // 宝鸡在职职工普通门诊限额500元/年
      annualCapRetiree: 900,// 宝鸡退休人员普通门诊限额900元/年
      tierBenefits: {
        community: { tierName: '基层社区/一级医疗机构', deductible: 50, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 50, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 50, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 50, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '参保职工门诊就医每次起付50元（一个自然月只收1次，年累计不超过4次）。在职报销比例：一级60%、二级55%、三级50%，退休人员上浮5%。在职年度限额500元，退休年度限额900元。'
    },
    inpatient: {
      sourceDocId: 'bj-employee-inpatient-policy-2020',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '基层乡镇卫生院/社区中心', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.92, retireeRatioBonus: 0.02 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.90, retireeRatioBonus: 0.02 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 },
        tier3_top: { tierName: '三甲综合医院', deductible: 1500, reimbursementRatio: 0.85, retireeRatioBonus: 0.02 }
      }
    },
    catastrophic: {
      sourceDocId: 'bj-employee-inpatient-policy-2020',
      name: '城镇职工大额医疗补助',
      deductible: 0,
      tiers: [{ minAmount: 350000, ratio: 0.88 }]
    },
    remoteMedical: {
      sourceDocId: 'bj-employee-inpatient-policy-2020',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '宝鸡医保办事大厅'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: ['宝鸡参保人员异地转诊至西安市三级甲等重点医院就医，规范备案后直接刷卡结算。']
    }
  },

  resident: {
    outpatient: {
      sourceDocId: 'bj-resident-inpatient-adjust-2022-66',
      annualDeductible: 0,
      annualCap: 80, // 宝鸡市城乡居民普通门诊统筹年度最高支付限额为 80 元/人
      tierBenefits: {
        community: { tierName: '定点村卫生室/社区服务站', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '定点乡镇卫生院/社区服务中心', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三级甲等医院（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹限定在基层定点机构：村卫生室/社区站报销60%（日限额30元），镇卫生院/社区中心报销50%（日限额50元），每人每年最高支付限额80元（部分试点区县100元）。两病专项用药报销60%，限额300元（双病600元）。'
    },
    inpatient: {
      sourceDocId: 'bj-resident-inpatient-adjust-2022-66',
      annualCap: 130000, // 宝鸡市城乡居民基本医疗保险统筹基金年度最高支付限额13万元
      repeatedDeductibleRule: '参保人在同级别定点医疗机构住院，按规定执行起付标准；分级诊疗转诊差额补齐起付线。',
      tierBenefits: {
        community: { tierName: '基层医疗机构及乡镇卫生院', deductible: 150, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1500, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '重点三甲综合医院', deductible: 1500, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'bj-resident-inpatient-adjust-2022-66',
      name: '城乡居民大病保险',
      deductible: 10000,
      annualCap: 300000, // 宝鸡市城乡居民大病保险年度最高支付限额30万元
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'bj-resident-inpatient-adjust-2022-66',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: ['跨市就医建议提前在陕西医保小程序自助备案。']
    }
  }
};
