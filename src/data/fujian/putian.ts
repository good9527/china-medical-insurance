import type { CityInsuranceData } from '../types';

export const putianCityData: CityInsuranceData = {
  cityCode: '350300',
  cityName: '莆田市',
  provinceCode: '350000',
  provinceName: '福建省',
  hotline: '0594-12393',
  officialPortalUrl: 'http://ybj.putian.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'pt-employee-outpatient-2022',
      title: '莆田市人民政府办公室关于建立健全职工基本医疗保险门诊共济保障机制的实施细则',
      docNumber: '莆政办规〔2022〕4号',
      issuingDept: ['莆田市人民政府办公室', '莆田市医疗保障局'],
      publishDate: '2022-12-12',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.putian.gov.cn/zwgk/zcjd/202212/t20221215_1792341.htm',
      summaryQuote: '职工门诊年度起付标准调整为600元。起付线以上统筹基金支付比例：一级及以下定点医疗机构85%、二级定点医疗机构80%、三级定点医疗机构75%；退休人员各段提高5个百分点（一级90%、二级85%、三级80%）。普通门诊统筹年度最高支付限额在职职工及退休人员均为20000元。'
    },
    {
      docId: 'pt-medical-treatment-policy-2023',
      title: '莆田市医疗保障局关于落实基本医疗保险待遇保障工作的通知',
      docNumber: '莆医保〔2023〕18号',
      issuingDept: ['莆田市医疗保障局', '莆田市财政局'],
      publishDate: '2023-11-20',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.putian.gov.cn/zwgk/zcfg/202311/t20231128_1876542.htm',
      summaryQuote: '城乡居民普通门诊免起付线，基层定点医疗机构报销50%，年度封顶400元。城乡居民住院起付线基层150元、一级300元、二级600元、三级900元，政策范围内报销比例对应90%、85%、75%、60%，统筹年度封顶10万元。职工住院起付线基层300元、一级500元、二级700元、三级900元，在职报销95%、92%、88%、85%，退休提高3个百分点，职工医保统筹加大额互助限额50万元。'
    }
  ],

  // 城镇职工医保待遇 (莆田标准)
  employee: {
    outpatient: {
      sourceDocId: 'pt-employee-outpatient-2022',
      annualDeductible: 600,
      annualCap: 20000,
      annualCapRetiree: 20000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 600, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '省属三级重点医疗机构', deductible: 600, reimbursementRatio: 0.75, retireeRatioBonus: 0.05 }
      },
      note: '职工门诊年度起付线600元。在职报销75%~85%，退休人员各段提高5个百分点（80%~90%），年度封顶2万元。'
    },
    inpatient: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      annualCap: 500000,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 300, reimbursementRatio: 0.95, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 500, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级甲等医院', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，起付线每次递减200元，最低降至0元。'
    },
    catastrophic: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      name: '职工大额医疗费用补充保险',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '长期异地就医备案享受参保地同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (莆田标准)
  resident: {
    outpatient: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      annualCap: 400,
      tierBenefits: {
        community: { tierName: '基层定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民门诊统筹在乡镇卫生院/社区卫生服务中心免起付线报销60%（次均封顶35元），村级50%（次均封顶30元），年度累计限额400元（二级及以上未纳普通门诊统筹）。'
    },
    inpatient: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      annualCap: 100000,
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 150, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 300, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 900, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级甲等医院', deductible: 1100, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 350000,
      tiers: [
        { minAmount: 0, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'pt-medical-treatment-policy-2023',
      filingChannels: ['国家医保服务平台APP', '福建医疗保障小程序', '闽政通'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '未按规定转诊自行跨省就医降低20个百分点。'
      ]
    }
  }
};
