import type { CityInsuranceData } from '../types';

export const shenyangCityData: CityInsuranceData = {
  cityCode: '210100',
  cityName: '沈阳市',
  provinceCode: '210000',
  provinceName: '辽宁省',
  hotline: '024-12393',
  officialPortalUrl: 'http://ybj.shenyang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'sy-employee-outpatient-2022-21',
      title: '沈阳市人民政府办公室关于印发沈阳市建立健全职工基本医疗保险门诊共济保障机制实施方案的通知',
      docNumber: '沈政办发〔2022〕21号及2024年实施细则',
      issuingDept: ['沈阳市人民政府办公室', '沈阳市医疗保障局'],
      publishDate: '2022-12-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.shenyang.gov.cn/zwgk/zcfg/202312/t20231228_4589123.html',
      summaryQuote: '在职职工门诊起付线一级及二级200元、三级400元、特大型三级600元。报销比例：一级及以下70%、二级65%、三级55%（退休人员各加5%）。门诊统筹年度最高支付限额1.2万元。'
    },
    {
      docId: 'sy-medical-insurance-inpatient-2025',
      title: '沈阳市基本医疗保险住院保障及统筹基金支付管理细则',
      docNumber: '沈医保发〔2024〕31号',
      issuingDept: ['沈阳市医疗保障局', '沈阳市财政局'],
      publishDate: '2024-11-15',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'http://ybj.shenyang.gov.cn/zwgk/zcfg/202411/t20241120_4791024.html',
      summaryQuote: '职工住院起付线：特大型三级1200元、三级600元、二级300元、一级200元；在职报销比例一级94%、二级93%、三级88%、特大型三级85%（退休人员提高至97%、96%、92%、89%）。居民住院起付线特大型三级1200元/60%、三级800元/65%、二级400元/75%、一级200元/85%。基本医保年度统筹限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (沈阳标准)
  employee: {
    outpatient: {
      sourceDocId: 'sy-employee-outpatient-2022-21',
      annualDeductible: 400, // 门诊基准起付线
      annualCap: 12000,      // 门诊统筹年度最高限额 12000 元
      annualCapRetiree: 12000,
      tierBenefits: {
        community: { tierName: '基层及一级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 400, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '特大型三级医疗机构', deductible: 600, reimbursementRatio: 0.55, retireeRatioBonus: 0.05 }
      },
      note: '门诊起付线一级/二级200元、三级400元、特大型三级600元。报销比例在职55%-70%，退休人员加5%（60%-75%），年度限额12000元。'
    },
    inpatient: {
      sourceDocId: 'sy-medical-insurance-inpatient-2025',
      annualCap: 550000, // 基本统筹15万 + 职工大额补助
      tierBenefits: {
        community: { tierName: '一级基层医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.94, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.04 },
        tier3_top: { tierName: '特大型三级医疗机构', deductible: 1200, reimbursementRatio: 0.85, retireeRatioBonus: 0.04 }
      },
      repeatedDeductibleRule: '转院就医只需补齐起付标准差额，年内多次住院享受减免政策。'
    },
    catastrophic: {
      sourceDocId: 'sy-medical-insurance-inpatient-2025',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sy-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '沈阳智慧医保APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '按分级诊疗规范转诊备案，结算享受对应报销比例。'
      ]
    }
  },

  // 城乡居民医保待遇 (沈阳标准)
  resident: {
    outpatient: {
      sourceDocId: 'sy-medical-insurance-inpatient-2025',
      annualCap: 400, // 居民门诊统筹年度限额 400 元
      tierBenefits: {
        community: { tierName: '基层定点医疗卫生机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '特大型三级医院（门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊在基层医疗机构免起付线，报销50%-60%，年度限额400元。'
    },
    inpatient: {
      sourceDocId: 'sy-resident-medical-2019-19',
      annualCap: 150000, // 居民基本统筹限额 15 万元
      tierBenefits: {
        community: { tierName: '一级医疗机构及社区中心', deductible: 200, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.80 },
        tier3: { tierName: '市属三级定点医疗机构', deductible: 800, reimbursementRatio: 0.75 },
        tier3_top: { tierName: '特大型三级综合医院', deductible: 1200, reimbursementRatio: 0.70 }
      },
      repeatedDeductibleRule: '从第二次住院起，起付标准递减15%，一年内最多递减两次。恶性肿瘤患者一个自然年度内只需交纳首次住院起付标准。'
    },
    catastrophic: {
      sourceDocId: 'sy-resident-medical-2019-19',
      name: '城乡居民大病保险（上不封顶）',
      deductible: 15000,
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'sy-medical-insurance-inpatient-2025',
      filingChannels: ['国家医保服务平台APP', '沈阳智慧医保APP'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.60,
      specialNotes: [
        '未办理规范转诊备案跨市就医人员，报销比例下浮。'
      ]
    }
  }
};
