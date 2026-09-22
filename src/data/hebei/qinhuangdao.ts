import type { CityInsuranceData } from '../types';

export const qinhuangdaoData: CityInsuranceData = {
  cityCode: '130300',
  cityName: '秦皇岛市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0335-12393',
  officialPortalUrl: 'https://ybj.qhd.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'qhd-employee-outpatient-2021',
      title: '秦皇岛市职工基本医疗保险和生育保险市级统筹实施细则及门诊共济方案',
      docNumber: '秦政办规〔2021〕1号',
      issuingDept: ['秦皇岛市人民政府办公室', '秦皇岛市医疗保障局'],
      publishDate: '2021-12-18',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://www.qhd.gov.cn/front/detail/20211228100142.html',
      summaryQuote: '自2024年1月1日起，一级定点医疗机构门诊取消起付线，报销比例在职职工为60%、退休人员为70%；二级及以上医疗机构起付线100元，在职报销55%、退休65%。45周岁（含）以上在职人员年度限额提高至2500元（45周岁以下2000元），退休人员提高至3000元。'
    },
    {
      docId: 'qhd-resident-inpatient-outpatient-2023',
      title: '秦皇岛市医疗保障局 秦皇岛市财政局关于做好城乡居民基本医疗保险门诊统筹及住院保障工作的通知',
      docNumber: '秦医保规〔2023〕1号',
      issuingDept: ['秦皇岛市医疗保障局', '秦皇岛市财政局'],
      publishDate: '2023-03-15',
      effectiveDate: '2023-04-01',
      status: 'active',
      officialUrl: 'https://ybj.qhd.gov.cn/art/2023/3/20/art_1582_17643.html',
      summaryQuote: '城乡居民普通门诊起付线50元，报销比例50%，年度限额65元（大学生门诊免起付线、报销60%、限额400元）。居民住院起付线：一级（含乡镇社区）100元、二级500元、三级1500元；报销比例分别为90%、75%、60%，居民基本医保年度限额15万元，大病保险年度限额40万元，累计最高报销55万元。'
    }
  ],

  // 城镇职工医保待遇 (秦皇岛标准)
  employee: {
    outpatient: {
      sourceDocId: 'qhd-employee-outpatient-2021',
      annualDeductible: 100, // 门诊基准年度起付线 100 元 (一级取消起付线)
      annualCap: 2000,       // 45岁以下基准限额 2000 元 (45岁及以上2500元)
      annualCapRetiree: 3000, // 退休限额 3000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.55, retireeRatioBonus: 0.10 },
        tier3: { tierName: '市属三级医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '一级机构免起付线报销60%（退休70%）；二级及以上起付线100元，在职报销50%-55%，退休人员增加10个百分点。年度限额在职2000-2500元，退休3000元。'
    },
    inpatient: {
      sourceDocId: 'qhd-employee-outpatient-2021',
      annualCap: 150000, // 基本医保年度最高限额 15 万元
      tierBenefits: {
        community: { tierName: '基层医疗卫生机构', deductible: 200, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 400, reimbursementRatio: 0.93, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 600, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 800, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1000, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '一个自然年度内多次住院的，从第二次住院起起付线递减，最低不低于200元。'
    },
    catastrophic: {
      sourceDocId: 'qhd-employee-outpatient-2021',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qhd-employee-outpatient-2021',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内免备案直接结算，享受与秦皇岛同级别定点医疗机构同等报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (秦皇岛标准)
  resident: {
    outpatient: {
      sourceDocId: 'qhd-resident-inpatient-outpatient-2023',
      annualCap: 65, // 普通门诊统筹年度最高限额 65 元 (在校大学生400元)
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 50, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 50, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '普通门诊统筹基层定点起付线50元，报销50%，限额65元；二级及三级医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'qhd-resident-inpatient-outpatient-2023',
      annualCap: 150000, // 居民基本医保年度封顶 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1500, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1800, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'qhd-resident-inpatient-outpatient-2023',
      name: '城乡居民大病保险',
      deductible: 14000,
      annualCap: 400000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'qhd-resident-inpatient-outpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '京津冀区域就医视同备案，直接联网结算。'
      ]
    }
  }
};
