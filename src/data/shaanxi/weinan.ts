import type { CityInsuranceData } from '../types';

/**
 * 渭南市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 依据官方文件：
 * 1.《渭南市建立健全职工基本医疗保险门诊共济保障机制实施办法》（渭政办发〔2022〕55号）
 * 2.《渭南市城乡居民基本医疗保险实施办法》（渭政办发〔2019〕137号）
 * 3.《渭南市医疗保障局关于参保职工、居民跨省临时外出就医异地转诊和异地急诊抢救报销标准的公告》（2025年最新）
 */
export const weinanCityData: CityInsuranceData = {
  cityCode: '610500',
  cityName: '渭南市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0913-12393',
  officialPortalUrl: 'https://www.weinan.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'wn-employee-outpatient-2022-55',
      title: '渭南市人民政府办公室关于印发渭南市建立健全职工基本医疗保险门诊共济保障机制实施办法的通知',
      docNumber: '渭政办发〔2022〕55号',
      issuingDept: ['渭南市人民政府办公室', '渭南市医疗保障局', '渭南市财政局'],
      publishDate: '2022-10-31',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://www.weinan.gov.cn/czzq/zcwj/1627926401384480769.html',
      summaryQuote: '参保人员普通门诊统筹起付标准为每人每年200元。在职职工普通门诊医疗费用支付比例为：一级医疗机构（含乡镇卫生院、社区卫生服务中心）65%，二级医疗机构55%，三级医疗机构50%。退休人员支付比例按医疗机构级别相应提高2个百分点（即一级67%、二级57%、三级52%）。参保人员普通门诊统筹最高支付限额为：在职职工每人每年1000元，退休人员每人每年1200元。普通门诊统筹最高支付限额仅限当年使用，不结转、不累加到次年，不能跨年度使用。'
    },
    {
      docId: 'wn-resident-basic-2019-137',
      title: '渭南市人民政府办公室关于印发〈渭南市城乡居民基本医疗保险实施办法〉的通知',
      docNumber: '渭政办发〔2019〕137号',
      issuingDept: ['渭南市人民政府办公室', '渭南市医疗保障局', '渭南市财政局'],
      publishDate: '2019-12-30',
      effectiveDate: '2020-01-01',
      status: 'active',
      officialUrl: 'https://www.weinan.gov.cn/czzq/zcwj/1627926387966902273.html',
      summaryQuote: '普通门诊统筹不设起付线。参保居民在定点村卫生室和社区卫生服务站门诊就诊发生的合规医疗费用，统筹基金支付70%，个人自付30%；在定点乡镇卫生院和社区卫生服务中心门诊就诊发生的合规医疗费用，统筹基金支付60%，个人自付40%。每人每年普通门诊统筹基金最高支付限额为150元。居民住院起付线：一级200元报销90%，二级500元报销80%，三级1000元报销65%。年度最高限额13万元。大病保险起付线10000元，1-3万报销60%，3-10万报销70%，10万以上报销80%，最高支付限额30万元。'
    },
    {
      docId: 'wn-remote-medical-2022',
      title: '渭南市医疗保障局关于参保职工、居民跨省临时外出就医异地转诊和异地急诊抢救报销标准的公告',
      docNumber: '市医保发〔2022〕45号',
      issuingDept: ['渭南市医疗保障局'],
      publishDate: '2022-12-28',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://www.weinan.gov.cn/czzq/zcwj/1627926401384480769.html',
      summaryQuote: '参保职工、居民跨省异地长期居住人员办理备案后，按参保地同级医疗机构标准执行；规范办理转诊备案或异地急诊抢救的，统筹基金支付比例下浮10%；未办理转诊备案手续自行跨省异地就医的，统筹基金支付比例下浮20%。'
    }
  ],

  // 城镇职工基本医疗保险待遇
  employee: {
    outpatient: {
      sourceDocId: 'wn-employee-outpatient-2022-55',
      annualDeductible: 200, // 职工门诊年起付线200元
      annualCap: 1000,       // 在职职工门诊封顶线1000元
      annualCapRetiree: 1200,// 退休人员门诊封顶线1200元
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含乡镇卫生院/社区卫生服务中心)',
          deductible: 200,
          reimbursementRatio: 0.65,
          retireeRatioBonus: 0.02
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.65,
          retireeRatioBonus: 0.02
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.55,
          retireeRatioBonus: 0.02
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.02
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.02
        }
      },
      note: '自然年度内门诊费用累计满200元起付线后启动报销，退休人员按医疗机构级别相应提高2个百分点（一级67%、二级57%、三级52%）。在职年限额1000元，退休年限额1200元。'
    },
    inpatient: {
      sourceDocId: 'wn-employee-outpatient-2022-55',
      annualCap: 350000, // 职工基本医保统筹基金年度最高支付限额35万元
      repeatedDeductibleRule: '参保职工在一个自然年度内多次住院，起付标准按定点医疗机构级别分别执行。',
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含社区/卫生院)',
          deductible: 200,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.02
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.02
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 500,
          reimbursementRatio: 0.88,
          retireeRatioBonus: 0.02
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 1000,
          reimbursementRatio: 0.86,
          retireeRatioBonus: 0.02
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 1000,
          reimbursementRatio: 0.86,
          retireeRatioBonus: 0.02
        }
      }
    },
    catastrophic: {
      sourceDocId: 'wn-employee-outpatient-2022-55',
      name: '职工大额医疗费用互助',
      deductible: 0,
      tiers: [
        { minAmount: 350000, ratio: 0.88 }
      ],
      annualCap: 300000
    },
    remoteMedical: {
      sourceDocId: 'wn-remote-medical-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '渭南医保微信公众号', '经办窗口电话'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '长期异地居住备案后享受参保地同等报销待遇。',
        '异地转诊或急诊抢救报销比例下浮10%，未备案自行异地就医报销比例下浮20%。'
      ]
    }
  },

  // 城乡居民基本医疗保险待遇
  resident: {
    outpatient: {
      sourceDocId: 'wn-resident-basic-2019-137',
      annualDeductible: 0,
      annualCap: 150, // 居民普通门诊统筹年度最高支付限额150元
      tierBenefits: {
        community: {
          tierName: '定点村卫生室/社区卫生服务站',
          deductible: 0,
          reimbursementRatio: 0.70
        },
        tier1: {
          tierName: '定点乡镇卫生院/社区卫生服务中心',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier2: {
          tierName: '二级定点医疗机构（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3: {
          tierName: '三级医疗机构（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3_top: {
          tierName: '三级甲等综合医院（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        }
      },
      note: '普通门诊统筹不设起付线，限定在定点村卫生室/社区站（报销70%）与乡镇卫生院/社区服务中心（报销60%），每人每年统筹基金最高支付150元。二级及以上医疗机构不纳入门诊统筹（两病门诊用药高血压年封顶300元、糖尿病年封顶480元）。'
    },
    inpatient: {
      sourceDocId: 'wn-resident-basic-2019-137',
      annualCap: 130000, // 居民基本医保统筹基金年度最高支付限额13万元
      repeatedDeductibleRule: '参保居民在一个自然年度内多次住院，起付标准按定点医疗机构级别分别计算。',
      tierBenefits: {
        community: {
          tierName: '一级医院(含乡镇/社区)',
          deductible: 200,
          reimbursementRatio: 0.90
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.90
        },
        tier2: {
          tierName: '二级定点医院',
          deductible: 500,
          reimbursementRatio: 0.80
        },
        tier3: {
          tierName: '三级定点医院',
          deductible: 1000,
          reimbursementRatio: 0.65
        },
        tier3_top: {
          tierName: '省内外三级特等医院(西京/唐都/省人医等)',
          deductible: 3000,
          reimbursementRatio: 0.65
        }
      }
    },
    catastrophic: {
      sourceDocId: 'wn-resident-basic-2019-137',
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
      sourceDocId: 'wn-remote-medical-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '渭南医保服务热线'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '2024年4月1日起执行渭医保发〔2024〕50号新规。',
        '统筹区外住院起付标准：省内一级500元、二级1000元、三级2500元、三特3000元；跨省二级1000元、三级2500元、三特3000元。',
        '统筹区内未规范转诊报销比例下调10%，统筹区外未规范转诊报销比例下调20%。',
        '基本医疗保险起付标准费用不计入城乡居民大病保险合规自付范围。'
      ]
    }
  }
};
