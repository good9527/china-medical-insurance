import type { CityInsuranceData } from '../types';

/**
 * 延安市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 依据官方文件：
 * 1.《延安市建立健全职工基本医疗保险门诊共济保障机制实施办法（试行）》（延政办发〔2022〕16号）
 * 2.《关于城乡居民基本医疗保险普通门诊统筹有关问题的暂行通知》（延市医保2019-611321）
 * 3.《关于调整城乡居民基本医疗保险住院报销政策的通知》（11610600016074442J/2022-654633）
 * 4.《延安市医疗保障局对市政协六届三次会议第212号提案的答复函》（延医保函〔2024〕212号）
 */
export const yananCityData: CityInsuranceData = {
  cityCode: '610600',
  cityName: '延安市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0911-12393',
  officialPortalUrl: 'http://www.yanan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'ya-employee-outpatient-2022-16',
      title: '延安市人民政府办公室关于印发〈延安市建立健全职工基本医疗保险门诊共济保障机制实施办法（试行）〉的通知',
      docNumber: '延政办发〔2022〕16号',
      issuingDept: ['延安市人民政府办公室', '延安市医疗保障局'],
      publishDate: '2022-09-02',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://www.yanan.gov.cn/gk/zc/xzgfxwjk/1560235869355503618.html',
      summaryQuote: '职工医保普通门诊统筹不设起付线。参保职工在定点医疗机构门诊发生的政策范围内费用，一级医疗机构在职职工支付70%，退休人员支付80%；二级医疗机构在职职工支付60%，退休人员支付70%；三级医疗机构在职职工支付50%，退休人员支付60%。年度统筹基金最高支付限额在职职工为1500元，退休人员为2500元。年度最高支付限额仅限当年使用，不结转、不累加。'
    },
    {
      docId: 'ya-resident-outpatient-2019',
      title: '关于城乡居民基本医疗保险普通门诊统筹有关问题的暂行通知',
      docNumber: '延医保发〔2019〕38号 (索引: 12610600MB2994985A/2019-611321)',
      issuingDept: ['延安市医疗保障局', '延安市财政局', '延安市卫生健康委员会'],
      publishDate: '2019-12-18',
      effectiveDate: '2020-01-01',
      status: 'active',
      officialUrl: 'http://www.yanan.gov.cn/gk/fdzdgknr/msly/wsjkly/1561963470465843201.html',
      summaryQuote: '城乡居民门诊统筹不设起付线。在定点社区卫生服务中心、乡镇卫生院（一级医院）就诊，支付比例为50%，单次报销限额30元；在定点社区卫生服务站、村卫生室就诊，支付比例为60%，单次报销限额20元。每人每年普通门诊统筹累计最高限额为100元。'
    },
    {
      docId: 'ya-resident-inpatient-adjust-2022',
      title: '关于调整城乡居民基本医疗保险住院报销政策的通知',
      docNumber: '延医保发〔2022〕28号 (索引: 11610600016074442J/2022-654633)',
      issuingDept: ['延安市医疗保障局', '延安市财政局'],
      publishDate: '2022-08-11',
      effectiveDate: '2022-09-01',
      status: 'active',
      officialUrl: 'http://www.yanan.gov.cn/gk/zc/xzgfxwjk/1560235869355503618.html',
      summaryQuote: '调整后居民住院报销比例全面上浮：一级医疗机构报销比例提高至85%；二级医疗机构报销比例提高至75%；三级乙等医疗机构报销比例提高至70%；三级甲等医疗机构报销比例提高至65%。统筹最高支付限额15万元。大病保险起付线10000元，1-3万报销60%，3-10万报销70%，10万以上报销80%，最高限额30万元。'
    },
    {
      docId: 'ya-employee-inpatient-proposal-2024',
      title: '延安市医疗保障局对市政协六届三次会议第212号提案的答复函',
      docNumber: '延医保函〔2024〕212号',
      issuingDept: ['延安市医疗保障局'],
      publishDate: '2024-09-29',
      effectiveDate: '2024-10-01',
      status: 'active',
      officialUrl: 'http://www.yanan.gov.cn/gk/fdzdgknr/jyta/zxta/1839477136604323841.html',
      summaryQuote: '职工住院起付线：一级400元（在职92%、退休96%），二级500元（在职90%、退休94%），三级700元（在职88%、退休92%）。二次住院起付标准降低20%，三次及以上降低30%。职工统筹基金年度封顶约45万元。大额医疗互助报销92%，封顶40万元。异地转诊备案报销比例降低5%，未备案非急诊就医降低10%。'
    }
  ],

  // 城镇职工基本医疗保险待遇
  employee: {
    outpatient: {
      sourceDocId: 'ya-employee-outpatient-2022-16',
      annualDeductible: 0, // 延安职工门诊统筹不设起付线（0元）
      annualCap: 1500,     // 在职职工年限额1500元
      annualCapRetiree: 2500,// 退休人员年限额2500元
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含乡镇/社区)',
          deductible: 0,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.10 // 退休上浮10% (一级在职70%, 退休80%)
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.10
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.10 // 二级在职60%, 退休70%
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.10 // 三级在职50%, 退休60%
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 0,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.10
        }
      },
      note: '职工门诊共济不设起付线（0元），退休人员报销比例上浮10个百分点。在职年限额1500元，退休人员2500元。'
    },
    inpatient: {
      sourceDocId: 'ya-employee-inpatient-proposal-2024',
      annualCap: 450000, // 职工基本统筹封顶约45万元
      repeatedDeductibleRule: '参保职工在一个自然年度内第二次住院起付标准降低20%，第三次及以上住院起付标准降低30%。',
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含乡镇/社区)',
          deductible: 400,
          reimbursementRatio: 0.92,
          retireeRatioBonus: 0.04 // 在职92%, 退休96%
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 400,
          reimbursementRatio: 0.92,
          retireeRatioBonus: 0.04
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 500,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.04 // 在职90%, 退休94%
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 700,
          reimbursementRatio: 0.88,
          retireeRatioBonus: 0.04 // 在职88%, 退休92%
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 700,
          reimbursementRatio: 0.88,
          retireeRatioBonus: 0.04
        }
      }
    },
    catastrophic: {
      sourceDocId: 'ya-employee-inpatient-proposal-2024',
      name: '职工大额医疗费用互助',
      deductible: 0,
      tiers: [
        { minAmount: 450000, ratio: 0.92 }
      ],
      annualCap: 400000
    },
    remoteMedical: {
      sourceDocId: 'ya-employee-inpatient-proposal-2024',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '延安医保经办大厅'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.95,      // 延安异地转诊降低5% (系数 0.95)
      unfiledEmergencyRatio: 0.95,   // 延安异地急诊视同转诊降低5% (系数 0.95)
      unfiledNormalRatio: 0.90,      // 未备案自行就医降低10% (系数 0.90)
      specialNotes: [
        '异地长期居住备案享受参保地同等报销待遇。',
        '异地转诊备案及急诊抢救统筹支付比例降低5%，未备案非急诊就医降低10%。'
      ]
    }
  },

  // 城乡居民基本医疗保险待遇
  resident: {
    outpatient: {
      sourceDocId: 'ya-resident-outpatient-2019',
      annualDeductible: 0,
      annualCap: 100, // 城乡居民普通门诊统筹年最高限额100元
      tierBenefits: {
        community: {
          tierName: '定点村卫生室/社区卫生站',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier1: {
          tierName: '定点乡镇卫生院/社区服务中心',
          deductible: 0,
          reimbursementRatio: 0.50
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
      note: '门诊统筹不设起付线，限定在基层定点机构，年限额100元；社区站/村室支付60%（单次限额20元），卫生院/社区中心支付50%（单次限额30元）；二级及三级医院普通门诊不予报销（两病门诊用药高血压300元、糖尿病480元除外）。'
    },
    inpatient: {
      sourceDocId: 'ya-resident-inpatient-adjust-2022',
      annualCap: 150000, // 居民基本医保统筹封顶15万元
      repeatedDeductibleRule: '参保居民在一个自然年度内多次住院，每次均按定点医院级别扣除起付线。',
      tierBenefits: {
        community: {
          tierName: '一级医院(含乡镇/社区)',
          deductible: 200,
          reimbursementRatio: 0.85
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.85
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 500,
          reimbursementRatio: 0.75
        },
        tier3: {
          tierName: '三级乙等定点医疗机构',
          deductible: 1000,
          reimbursementRatio: 0.70
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 1200,
          reimbursementRatio: 0.65
        }
      }
    },
    catastrophic: {
      sourceDocId: 'ya-resident-inpatient-adjust-2022',
      name: '城乡居民大病保险',
      deductible: 10000,
      tiers: [
        { minAmount: 10000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ],
      annualCap: 300000
    },
    remoteMedical: {
      sourceDocId: 'ya-employee-inpatient-proposal-2024',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '延安医保便民热线'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.95,
      unfiledEmergencyRatio: 0.95,
      unfiledNormalRatio: 0.90,
      specialNotes: [
        '居民异地就医规范转诊备案或急诊抢救降低5%，未办理转诊手续跨省自行就医降低10%。'
      ]
    }
  }
};
