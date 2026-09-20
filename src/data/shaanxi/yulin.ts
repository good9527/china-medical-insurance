import type { CityInsuranceData } from '../types';

/**
 * 榆林市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 依据官方文件：
 * 1.《榆林市城镇职工基本医疗保险门诊共济保障机制实施办法》（公开索引号：11610800MB2964997P/2024-00022）
 * 2.《榆林市职工基本医疗保险实施办法》（榆政办发〔2023〕16号）
 * 3.《关于调整我市城乡居民大病保险起付标准的通知》（榆医保发〔2025〕49号）
 */
export const yulinCityData: CityInsuranceData = {
  cityCode: '610800',
  cityName: '榆林市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0912-12393',
  officialPortalUrl: 'http://ybj.yl.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'yl-employee-outpatient-2024',
      title: '榆林市人民政府办公室关于印发榆林市城镇职工基本医疗保险门诊共济保障机制实施办法的通知',
      docNumber: '榆政办发〔2022〕134号 (索引: 11610800MB2964997P/2024-00022)',
      issuingDept: ['榆林市人民政府办公室', '榆林市医疗保障局'],
      publishDate: '2022-09-27',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.yl.gov.cn/zfxxgk/fdzdgknr/gfxwj/202408/t20240823_1816584.html',
      summaryQuote: '职工门诊共济统筹基金支付不设起付线（起付线0元）。参保人员在定点医疗机构普通门诊就医，二级及以下医疗机构，在职职工支付比例为75%，退休人员为80%；三级医疗机构，在职职工支付比例为70%，退休人员为75%。门诊共济统筹基金年度最高支付限额在职人员为1500元，退休人员为1800元。年度最高支付限额在当年使用，不结转、不滚存。'
    },
    {
      docId: 'yl-employee-inpatient-2023-16',
      title: '榆林市人民政府办公室关于印发榆林市职工基本医疗保险实施办法的通知',
      docNumber: '榆政办发〔2023〕16号',
      issuingDept: ['榆林市人民政府办公室', '榆林市医疗保障局', '榆林市财政局'],
      publishDate: '2023-06-19',
      effectiveDate: '2023-07-01',
      status: 'active',
      officialUrl: 'https://www.yl.gov.cn/zwgk/zc/qtwj/szfbwj/202306/t20230621_72003.html',
      summaryQuote: '住院医疗费用起付标准：一级定点医疗机构为200元；二级定点医疗机构为400元；三级定点医疗机构为800元。参保职工一个自然年度内第二次及以上住院的，起付标准减半（50%）。统筹基金支付比例：一级医疗机构在职90%（退休93%），二级在职85%（退休88%），三级在职80%（退休83%）。统筹基金最高支付限额为25万元。超过25万元以上部分，由职工大额医疗费用补助资金按92%支付，不设年度封顶线。'
    },
    {
      docId: 'yl-resident-catastrophic-2025-49',
      title: '榆林市医疗保障局关于调整我市城乡居民大病保险起付标准的通知',
      docNumber: '榆医保发〔2025〕49号',
      issuingDept: ['榆林市医疗保障局', '榆林市财政局'],
      publishDate: '2025-12-22',
      effectiveDate: '2026-01-01',
      status: 'active',
      officialUrl: 'http://ybj.yl.gov.cn/zfxxgk/fdzdgknr/gfxwj/202601/t20260130_2072057.html',
      summaryQuote: '自2026年1月1日起，我市城乡居民大病保险起付标准调整为13500元。大病合规自付费用13500元至3万元部分报销60%；3万元至10万元部分报销70%；10万元以上部分报销80%。年度最高支付限额为30万元。经三重保障后政策范围内个人自付仍超过3万元部分，由大病保险资金按50%进行二次补偿。'
    }
  ],

  // 城镇职工基本医疗保险待遇
  employee: {
    outpatient: {
      sourceDocId: 'yl-employee-outpatient-2024',
      annualDeductible: 0, // 榆林职工门诊共济统筹不设起付线（0元）
      annualCap: 1500,     // 在职职工年限额1500元
      annualCapRetiree: 1800,// 退休人员年限额1800元
      tierBenefits: {
        community: {
          tierName: '基层社区卫生服务中心/乡镇卫生院',
          deductible: 0,
          reimbursementRatio: 0.75,
          retireeRatioBonus: 0.05
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.75,
          retireeRatioBonus: 0.05
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.75,
          retireeRatioBonus: 0.05
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 0,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        }
      },
      note: '职工门诊共济统筹不设起付线（0元），二级及以下在职支付75%（退休80%），三级在职支付70%（退休75%），在职年封顶1500元，退休年封顶1800元。'
    },
    inpatient: {
      sourceDocId: 'yl-employee-inpatient-2023-16',
      annualCap: 250000, // 职工基本统筹封顶25万元
      repeatedDeductibleRule: '参保职工一个自然年度内第二次及以上住院的，起付标准减半（50%）。',
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含卫生院)',
          deductible: 200,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.03
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.03
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 400,
          reimbursementRatio: 0.85,
          retireeRatioBonus: 0.03
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 800,
          reimbursementRatio: 0.80,
          retireeRatioBonus: 0.03
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 800,
          reimbursementRatio: 0.80,
          retireeRatioBonus: 0.03
        }
      }
    },
    catastrophic: {
      sourceDocId: 'yl-employee-inpatient-2023-16',
      name: '职工大额医疗费用补助',
      deductible: 0,
      tiers: [
        { minAmount: 250000, ratio: 0.92 } // 超过25万部分由大额补助按92%支付，不设封顶
      ],
      annualCap: undefined // 不设年度封顶线
    },
    remoteMedical: {
      sourceDocId: 'yl-employee-inpatient-2023-16',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '榆林市医疗保障局网厅'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '陕西省内就医免备案直接结算，享受参保地同等报销待遇。',
        '跨省异地转诊与急诊抢救报销比例下浮10%，未备案跨省就医报销比例下浮20%。'
      ]
    }
  },

  // 城乡居民基本医疗保险待遇
  resident: {
    outpatient: {
      sourceDocId: 'yl-resident-catastrophic-2025-49',
      annualDeductible: 0,
      annualCap: 100, // 榆林市城乡居民普通门诊统筹年度限额为 100 元/人（两病患者可叠加用药补助）
      tierBenefits: {
        community: {
          tierName: '定点村卫生室/社区服务站',
          deductible: 0,
          reimbursementRatio: 0.70
        },
        tier1: {
          tierName: '定点乡镇卫生院/社区服务中心',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier2: {
          tierName: '二级医疗机构（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3: {
          tierName: '三级医疗机构（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3_top: {
          tierName: '三级甲等医院（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        }
      },
      note: '城乡居民普通门诊不设起付线，限定在基层卫生室（报销70%）、乡镇卫生院（报销60%），年限额100元；高血压年封顶300元、糖尿病年封顶480元。二级及三级医院普通门诊不予报销。'
    },
    inpatient: {
      sourceDocId: 'yl-resident-catastrophic-2025-49',
      annualCap: 150000, // 居民基本医保统筹封顶15万元
      repeatedDeductibleRule: '参保居民在一个自然年度内多次住院，起付标准按定点医疗机构级别分别计算。',
      tierBenefits: {
        community: {
          tierName: '一级医院(含乡镇卫生院)',
          deductible: 200,
          reimbursementRatio: 0.85
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.85
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 600,
          reimbursementRatio: 0.75
        },
        tier3: {
          tierName: '三级医疗机构(如星元医院等)',
          deductible: 1500,
          reimbursementRatio: 0.65
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 1500,
          reimbursementRatio: 0.65
        }
      }
    },
    catastrophic: {
      sourceDocId: 'yl-resident-catastrophic-2025-49',
      name: '城乡居民大病保险',
      deductible: 13500, // 2026年1月1日起调整为13500元
      tiers: [
        { minAmount: 13500, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ],
      annualCap: 300000
    },
    remoteMedical: {
      sourceDocId: 'yl-resident-catastrophic-2025-49',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '榆林医保经办热线'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '经规范转诊跨省就医报销比例下浮10%，未备案跨省自行就医报销比例下浮20%。'
      ]
    }
  }
};
