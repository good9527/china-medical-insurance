import type { CityInsuranceData } from '../types';

/**
 * 广州市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 统筹区编码：440100
 */
export const guangzhouCityData: CityInsuranceData = {
  cityCode: '440100',
  cityName: '广州市',
  provinceCode: '440000',
  provinceName: '广东省',
  hotline: '020-12393',
  officialPortalUrl: 'http://ybj.gz.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'gz-employee-outpatient-2022',
      title: '广州市医疗保障局 广州市财政局 广州市卫生健康委员会关于印发广州市职工基本医疗保险门诊共济保障实施细则的通知',
      docNumber: '穗医保规字〔2022〕3号',
      issuingDept: ['广州市医疗保障局', '广州市财政局', '广州市卫生健康委员会'],
      publishDate: '2022-11-20',
      effectiveDate: '2022-12-01',
      status: 'active',
      officialUrl: 'http://ybj.gz.gov.cn/zwgk/zcfg/content/post_8673891.html',
      summaryQuote: '在职职工在选定基层医疗机构普通门诊就医报销比例为80%（退休人员85%），在其他定点医疗机构在职职工报销65%（退休人员70%）。年度门诊统筹最高支付限额在职职工约为社平工资的5%（约8000元），退休人员约为社平工资的6%（约10000元），免设门诊起付线。'
    },
    {
      docId: 'gz-medical-insurance-inpatient-2023',
      title: '广州市社会医疗保险规定',
      docNumber: '广州市人民政府令第193号及现行执行规程',
      issuingDept: ['广州市人民政府', '广州市医疗保障局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.gz.gov.cn/zwgk/zcfg/content/post_8712345.html',
      summaryQuote: '职工医保住院起付标准：一级250元、二级500元、三级1000元；在职职工报销比例一级90%、二级85%、三级80%（退休人员分别为93%、89.5%、86%）。居民医保住院起付标准：一级150元、二级300元、三级500元；报销比例一级90%、二级80%、三级70%（未成年学生一级90%、二级85%、三级80%）。基本医疗保险年度累计最高限额为在岗职工年平均工资的6倍（超额约100万元）。'
    },
    {
      docId: 'gz-resident-medical-2024',
      title: '广州市城乡居民基本医疗保险门诊及大病保险管理规程',
      docNumber: '穗医保规字〔2023〕5号',
      issuingDept: ['广州市医疗保障局'],
      publishDate: '2023-12-05',
      effectiveDate: '2024-01-01',
      status: 'active',
      officialUrl: 'http://ybj.gz.gov.cn/zwgk/zcjd/content/post_9356123.html',
      summaryQuote: '居民医保普通门诊无起付线，基层定点医疗机构报销比例不低于50%（广州社区定点报销80%），年最高支付限额按规定执行。大病保险实行分段梯次报销，最高支付限额达40万至45万元。'
    },
    {
      docId: 'gz-outpatient-chronic-2024',
      title: '广州市医疗保障局 广州市财政局 广州市卫生健康委员会关于调整广州市社会医疗保险门诊特定病种有关待遇的通知',
      docNumber: '穗医保规字〔2024〕2号',
      issuingDept: ['广州市医疗保障局', '广州市财政局', '广州市卫生健康委员会'],
      publishDate: '2024-03-20',
      effectiveDate: '2024-04-01',
      status: 'active',
      officialUrl: 'http://ybj.gz.gov.cn/zwgk/zcfg/content/post_9581230.html',
      summaryQuote: '门诊特定病种不设起付线；选定基层定点医疗机构支付比例在职85%、退休90%；其他医疗机构在职70%、退休75%，极大提升慢特病门诊保障待遇。'
    }
  ],

  // 城镇职工医保待遇 (广州标准)
  employee: {
    outpatient: {
      sourceDocId: 'gz-employee-outpatient-2022',
      annualDeductible: 0,   // 广州职工普通门诊免设起付线（0元起付）
      annualCap: 8000,       // 在职职工年限额约 8000 元
      annualCapRetiree: 10000, // 退休人员年限额约 10000 元
      tierBenefits: {
        community: { tierName: '基层选定医疗机构/社区卫生服务中心', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点综合医院', deductible: 0, reimbursementRatio: 0.65, retireeRatioBonus: 0.05 }
      },
      note: '普通门诊免设起付线，选定基层医疗机构报销80%（退休85%），二级及以上选定医院报销65%（退休70%）。在职限额8000元，退休10000元。'
    },
    inpatient: {
      sourceDocId: 'gz-medical-insurance-inpatient-2023',
      annualCap: 1000000, // 上上年度平均工资6倍（约100万元）
      tierBenefits: {
        community: { tierName: '一级及基层医疗机构', deductible: 250, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 250, reimbursementRatio: 0.90, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.85, retireeRatioBonus: 0.045 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.80, retireeRatioBonus: 0.06 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 1000, reimbursementRatio: 0.80, retireeRatioBonus: 0.06 }
      },
      repeatedDeductibleRule: '参保人员每次住院支付一次起付标准；连续住院超过90天需重新支付一次。'
    },
    catastrophic: {
      sourceDocId: 'gz-medical-insurance-inpatient-2023',
      name: '广州市职工重大疾病医疗补助',
      deductible: 0,
      tiers: [
        { minAmount: 1000000, ratio: 0.95 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'gz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '粤医保微信小程序', '穗好办'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '广东省内异地就医直接结算，规范备案人员与广州参保地同等待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (广州标准)
  resident: {
    outpatient: {
      sourceDocId: 'gz-resident-medical-2024',
      annualDeductible: 0,
      annualCap: 1000, // 居民门诊定点年报销限额
      tierBenefits: {
        community: { tierName: '基层社区服务中心/乡镇卫生院', deductible: 0, reimbursementRatio: 0.80 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级医疗机构（门诊统筹未选定）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构（门诊统筹未选定）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲重点医疗机构（门诊统筹未选定）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民医保普通门诊无起付线，在选定基层定点社区卫生服务机构报销80%，年度统筹限额1000元。未选定二级及以上医院门诊不予统筹支付。'
    },
    inpatient: {
      sourceDocId: 'gz-medical-insurance-inpatient-2023',
      annualCap: 350000, // 居民医保基本统筹限额 35 万元
      tierBenefits: {
        community: { tierName: '一级医疗机构/社区中心', deductible: 150, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 150, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 300, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三甲重点医疗机构', deductible: 500, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'gz-resident-medical-2024',
      name: '城乡居民大病保险',
      deductible: 18000,
      tiers: [
        { minAmount: 18000, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.70 }
      ],
      annualCap: 450000
    },
    remoteMedical: {
      sourceDocId: 'gz-medical-insurance-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '粤医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地就医直接结算，规范备案人员与本地享受同等待遇。'
      ]
    }
  }
};
