import type { CityInsuranceData } from '../types';

export const tangshanData: CityInsuranceData = {
  cityCode: '130200',
  cityName: '唐山市',
  provinceCode: '130000',
  provinceName: '河北省',
  hotline: '0315-12393',
  officialPortalUrl: 'https://ybj.tangshan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 权威规范性红头文件与政府溯源凭证
  sourceDocs: [
    {
      docId: 'ts-employee-outpatient-2021',
      title: '唐山市人民政府办公室关于建立健全职工基本医疗保险门诊共济保障机制的实施细则',
      docNumber: '唐政办发〔2021〕9号',
      issuingDept: ['唐山市人民政府办公室', '唐山市医疗保障局'],
      publishDate: '2021-12-25',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'https://www.tangshan.gov.cn/zhuzhan/zhengfubangongshiwj/20211231/1376829.html',
      summaryQuote: '参保职工普通门诊统筹年度起付标准为100元；起付标准以上部分，由统筹基金按比例支付：在职人员支付比例为50%，退休人员为60%。自2023年5月1日起，年度统筹基金最高支付限额在职职工提高至1600元，退休人员提高至2000元。'
    },
    {
      docId: 'ts-employee-resident-inpatient-2023',
      title: '唐山市城镇职工基本医疗保险实施办法及城乡居民保障政策通知',
      docNumber: '唐政发〔2023〕1号',
      issuingDept: ['唐山市人民政府', '唐山市医疗保障局'],
      publishDate: '2023-01-10',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.tangshan.gov.cn/art/2023/1/12/art_2210_18921.html',
      summaryQuote: '职工住院起付线：三级医疗机构900元、二级500元、一级200元；在职支付比例三级85%、二级88%、一级92%，退休人员支付比例增加3个百分点；多次住院每次起付线递减100元；年度封顶15万元，大额补助最高支付50万元。居民住院起付线：三级1200元、二级700元、一级200元、乡镇100元，支付比例对应为60%、75%、90%、90%，年度限额30万元。'
    }
  ],

  // 城镇职工医保待遇 (唐山标准)
  employee: {
    outpatient: {
      sourceDocId: 'ts-employee-outpatient-2021',
      annualDeductible: 100, // 门诊年度起付线 100 元
      annualCap: 1600,       // 在职限额 1600 元
      annualCapRetiree: 2000, // 退休限额 2000 元
      tierBenefits: {
        community: { tierName: '基层医疗机构/门诊部', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier1: { tierName: '一级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier2: { tierName: '二级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3: { tierName: '三级定点医疗机构', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 100, reimbursementRatio: 0.50, retireeRatioBonus: 0.10 }
      },
      note: '门诊统筹年度起付标准100元，在职报销50%，退休人员报销60%。年度最高支付限额在职1600元，退休2000元。'
    },
    inpatient: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      annualCap: 150000, // 统筹基金年度封顶线 15 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区中心', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.92, retireeRatioBonus: 0.03 },
        tier2: { tierName: '二级定点医疗机构', deductible: 500, reimbursementRatio: 0.88, retireeRatioBonus: 0.03 },
        tier3: { tierName: '市属三级定点医院', deductible: 900, reimbursementRatio: 0.85, retireeRatioBonus: 0.03 },
        tier3_top: { tierName: '省属三级重点医院', deductible: 1100, reimbursementRatio: 0.82, retireeRatioBonus: 0.03 }
      },
      repeatedDeductibleRule: '一个自然年度内多次住院的，每次住院起付标准递减100元，最低降至100元。'
    },
    catastrophic: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      name: '职工大额医疗费用补助',
      deductible: 0,
      annualCap: 500000,
      tiers: [
        { minAmount: 0, ratio: 0.90 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '京津冀区域内医疗机构就医视同备案，直接联网结算并享受与唐山市同等医保报销待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (唐山标准)
  resident: {
    outpatient: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      annualCap: 200, // 基层普通门诊年度最高限额 200 元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 0, reimbursementRatio: 0.50 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.50 },
        tier2: { tierName: '二级定点医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '市属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '省属三级医疗机构（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '居民在基层定点医疗机构门诊就医不设起付线，按50%比例支付，年度统筹基金最高支付200元；二级及三级医疗机构普通门诊未纳入统筹。'
    },
    inpatient: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      annualCap: 300000, // 居民基本医保年度封顶 30 万元
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 700, reimbursementRatio: 0.75 },
        tier3: { tierName: '市属三级医疗机构', deductible: 1200, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '省属三级定点医院', deductible: 1500, reimbursementRatio: 0.55 }
      }
    },
    catastrophic: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      name: '城乡居民大病保险',
      deductible: 15000,
      annualCap: 300000,
      tiers: [
        { minAmount: 0, maxAmount: 100000, ratio: 0.60 },
        { minAmount: 100000, ratio: 0.75 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'ts-employee-resident-inpatient-2023',
      filingChannels: ['国家医保服务平台APP', '河北智慧医保小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.85,
      unfiledEmergencyRatio: 0.85,
      unfiledNormalRatio: 0.65,
      specialNotes: [
        '京津冀区域内就医免备案直接结算，执行同等级定点医疗机构报销比例。'
      ]
    }
  }
};
