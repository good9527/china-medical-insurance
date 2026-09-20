import type { CityInsuranceData } from '../types';

export const shijiazhuangData: CityInsuranceData = {
  cityCode: '130100',
  cityName: '石家庄市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0311-12393 / 0311-89876006',
  officialPortalUrl: 'https://ybj.sjz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [

    {
      docId: 'sjz-employee-outpatient-inpatient-2023',
      title: '石家庄市职工基本医疗保险实施办法及门诊共济保障机制细则',
      docNumber: '石政办发〔2023〕18号',
      issuingDept: ['石家庄市人民政府办公室', '石家庄市医疗保障局'],
      publishDate: '2023-09-28',
      effectiveDate: '2023-11-01',
      status: 'active',
      officialUrl: 'https://www.sjz.gov.cn/col/1585808798952/2023/10/08/1696748920114.html',
      summaryQuote: '参保职工门诊年度起付标准为100元，在职职工统筹基金报销60%（退休人员提高至70%）。45周岁以下在职限额3500元，45周岁及以上4500元，退休人员6000元。职工住院起付线：省属三级900元、市属三级600元、二级500元、一级100元；在职报销比例分别为82%、85%、90%、98%，退休人员起付线降低100元（最低100元），报销比例提高3个百分点。'
    },
    {
      docId: 'sjz-resident-inpatient-outpatient-2025',
      title: '石家庄市城乡居民基本医疗保险实施办法及2025年度保障待遇通知',
      docNumber: '石医保发〔2024〕42号',
      issuingDept: ['石家庄市医疗保障局', '石家庄市财政局'],
      publishDate: '2024-11-15',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'https://ybj.sjz.gov.cn/art/2024/11/20/art_1421_189921.html',
      summaryQuote: '城乡居民普通门诊不设起付线，乡镇卫生院/社区卫生服务中心报销90%，村卫生室95%，年度限额400元；其他定点医药机构报销50%，限额200元。住院起付线与支付比例：一级200元/90%、二级800元/75%、市属三级1000元/65%、省属三级1500元/60%，基本医保年度限额20万元。大病保险起付线1.34万元，0-10万报销60%，10-20万报销70%，20万以上报销80%，大病限额30万元。'
    }
  ],

  // 城镇职工医保待遇 (石家庄标准)
  employee: {
    outpatient: {
      sourceDocId: 'sjz-employee-outpatient-inpatient-2023',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 3500,       // 在职45岁以下基准限额 3500 元 (45岁以上4500元)
      annualCapRetiree: 6000, // 退休限额 6000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊统筹年度起付标准100元，在职报销60%，退休人员报销70%。45周岁以下在职职工限额3500元，45周岁以上4500元，退休人员6000元。'
    },
    inpatient: {
      sourceDocId: 'sjz-employee-outpatient-inpatient-2023',
      annualCap: 350000, // 职工统筹基本医疗保险年度支付限额 35 万元
      tierBenefits: {
        community: { tierName: '一级及以下基层机构', deductible: 100, reimbursementRatio: 0.98, retireeRatioBonus: 0.01 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.98, retireeRatioBonus: 0.01 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 900, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '退休人员起付标准在在职职工基础上降低100元（最低不低于100元），同年度多次住院依次递减。'
    },
    catastrophic: {
      sourceDocId: 'sjz-employee-outpatient-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sjz-employee-outpatient-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内免备案直接结算，享受与本市同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (石家庄标准)
  resident: {
    outpatient: {
      sourceDocId: 'sjz-resident-inpatient-outpatient-2025',
      annualCap: 400, // 基层普通门诊年度最高限额 400 元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 0, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3: { tierName: '市属三级医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 0, reimbursementRatio: 0.50 }
      },
      note: '普通门诊免起付线，乡镇卫生院/社区服务中心报销90%（村卫生室95%），年度限额400元；二级及三级医院按50%报销，限额200元。'
    },
    inpatient: {
      sourceDocId: 'sjz-resident-inpatient-outpatient-2025',
      annualCap: 200000, // 居民基本医疗保险年度限额 20 万元
      tierBenefits: {
        community: { tierName: '一级及以下医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '省属三级重点综合医院', deductible: 1500, reimbursementRatio: 0.60 }
      }
    },
    catastrophic: {
      sourceDocId: 'sjz-resident-inpatient-outpatient-2025',
      name: '城乡居民大病保险',
      deductible: 13400,
      annualCap: 300000,
      tiers: [
        { minAmount: 13400, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, maxAmount: 200000, ratio: 0.70 },
        { minAmount: 200000, ratio: 0.80 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sjz-resident-inpatient-outpatient-2021',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.77, // 省外转诊经备案支付比例统一为50%（折合参保地三级65%的约77%）
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.46, // 省外未备案自行就医直接按30%结算（折合约46%），且自付不进大病保险
      specialNotes: [
        '京津冀区域内就医视同本地就医，免证明免备案直接联网结算。',
        '河北省内市外就医按本市同等级别医疗机构标准执行；转往省外经备案支付比例为50%（起付线2000元），省外未备案自行就医支付比例仅为30%（起付线4000元且自付部分不计入大病保险）。'
      ]
    }
  }
};
