import type { CityInsuranceData } from '../types';

export const handanData: CityInsuranceData = {
  cityCode: '130400',
  cityName: '邯郸市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0310-12393',
  officialPortalUrl: 'https://ybj.hd.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'hd-employee-outpatient-2021',
      title: '邯郸市人民政府办公室关于印发邯郸市职工基本医疗保险门诊共济保障机制实施细则的通知',
      docNumber: '邯政办规〔2021〕9号',
      issuingDept: ['邯郸市人民政府办公室', '邯郸市医疗保障局'],
      publishDate: '2021-12-28',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://www.hd.gov.cn/gov/govfile/202112/t20211231_1452391.html',
      summaryQuote: '参保职工普通门诊统筹年度起付标准为100元；起付标准以上、最高支付限额以下费用，在职职工支付比例为60%，退休人员支付比例为70%。年度统筹基金最高支付限额：在职职工2500元，退休人员4000元。个人账户资金可用于家庭成员共济就医购药。'
    },
    {
      docId: 'hd-employee-resident-inpatient-2023',
      title: '邯郸市医疗保障局关于印发邯郸市医疗保险待遇政策明白卡及实施办法的通知',
      docNumber: '邯医保发〔2023〕18号',
      issuingDept: ['邯郸市医疗保障局', '邯郸市财政局'],
      publishDate: '2023-04-12',
      effectiveDate: '2023-05-01',
      status: 'active',
      officialUrl: 'https://ybj.hd.gov.cn/art/2023/4/15/art_1720_19281.html',
      summaryQuote: '职工住院起付线：三级800元、二级600元、一级400元；报销比例分别为85%、88%、93%，退休人员报销比例增加3个百分点，职工医保年度限额20万元，大额救助最高支付50万元。城乡居民门诊免起付线报销50%，限额75元；居民住院起付线三级1200元、二级800元（县级500元）、一级400元、乡镇100元，报销比例对应60%、75%、85%、90%，年度限额15万元。'
    }
  ],

  // 城镇职工医保待遇 (邯郸标准)
  employee: {
    outpatient: {
      sourceDocId: 'hd-employee-outpatient-2021',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 2500,       // 在职限额 2500 元
      annualCapRetiree: 4000, // 退休限额 4000 元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 100, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 }
      },
      note: '门诊年度起付线100元，在职报销60%，退休人员报销70%。在职限额2500元，退休限额4000元。'
    },
    inpatient: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      annualCap: 200000, // 基本医保年度限额 20 万元
      tierBenefits: {
        community: { tierName: '基层医疗机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '同自然年度内多次住院，每次起付线依次递减100元，最低不低于200元。'
    },
    catastrophic: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内就医视同备案，直接联网结算享受本地同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (邯郸标准)
  resident: {
    outpatient: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      annualCap: 75, // 普通门诊统筹年度限额 75 元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '基层门诊不设起付线，报销比例50%，年度限额75元；二级及三级医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      annualCap: 150000, // 居民医保年度限额 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.85 },
        tier2: { tierName: '二级定点医疗机构', deductible: 800, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 13000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'hd-employee-resident-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '京津冀区域内就医免备案直接结算。'
      ]
    }
  }
};
