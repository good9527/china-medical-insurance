import type { CityInsuranceData } from '../types';

/**
 * 西安市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 */
export const xianCityData: CityInsuranceData = {
  cityCode: '610100',
  cityName: '西安市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '029-12393',
  officialPortalUrl: 'http://ybj.xa.gov.cn/',
  lastUpdated: '2026-03-01',
  
  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'xa-employee-outpatient-2022-75',
      title: '西安市医疗保障局等四部门关于印发《西安市职工基本医疗保险门诊共济保障机制实施细则》的通知',
      docNumber: '市医保发〔2022〕75号',
      issuingDept: ['西安市医疗保障局', '西安市财政局', '西安市人力资源和社会保障局', '国家税务总局西安市税务局'],
      publishDate: '2022-12-05',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xa.gov.cn/zcfg/zcjd/63fc0884f8fd1c4c21438eeb.html',
      summaryQuote: '参保人员在定点医疗机构门诊发生符合规定的医疗费用，年度起付标准为200元。一级医疗机构统筹基金支付比例在职职工70%、退休人员75%；二级医疗机构在职职工60%、退休人员65%；三级医疗机构在职职工50%、退休人员55%。年度最高支付限额在职职工2000元，退休人员2500元。'
    },
    {
      docId: 'xa-employee-inpatient-basic',
      title: '西安市人民政府办公厅关于印发《西安市城镇职工基本医疗保险实施细则》的通知',
      docNumber: '市政办发〔2017〕72号',
      issuingDept: ['西安市人民政府办公厅', '西安市医疗保障局'],
      publishDate: '2017-08-15',
      effectiveDate: '2017-09-01',
      status: 'active',
      officialUrl: 'http://ybj.xa.gov.cn/wsdt/bszn/1877601888153145345.html',
      summaryQuote: '职工医保参保人员在定点医疗机构住院，起付标准：社区/一级医疗机构200元，二级医疗机构500元，三级医疗机构1200元。统筹基金支付比例：一级医疗机构在职90%（退休94%），二级医疗机构在职85%（退休90%），三级医疗机构在职80%（退休85%）。统筹基金最高支付限额为40万元。'
    },
    {
      docId: 'xa-resident-basic-2019-40',
      title: '西安市人民政府办公厅关于印发《西安市城乡居民基本医疗保险实施办法》的通知',
      docNumber: '市政办发〔2019〕40号',
      issuingDept: ['西安市人民政府办公厅', '西安市医疗保障局'],
      publishDate: '2019-12-25',
      effectiveDate: '2020-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xa.gov.cn/zcfg/zcjd/1976915235862294530.html',
      summaryQuote: '城乡居民在定点医疗机构住院起付线与报销比例：一级医院（含社区卫生服务中心、卫生院）150元报销80%；二级医院400元报销70%；三级普通医院1200元报销60%；三级特等医院（交大一附院/西京/唐都等）2000元报销50%。年度基本统筹基金最高支付限额20万元。大病保险起付线1万元。'
    },
    {
      docId: 'xa-remote-medical-2022',
      title: '西安市医疗保障局关于进一步做好基本医疗保险跨省及省内异地就医直接结算工作的通知',
      docNumber: '市医保函〔2022〕119号',
      issuingDept: ['西安市医疗保障局', '西安市财政局'],
      publishDate: '2022-12-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://ybj.xa.gov.cn/zcfg/zcjd/1834782607324250114.html',
      summaryQuote: '异地安置退休、异地长期居住、常驻异地工作人员办理备案后，享受参保地同等就医待遇；异地转诊人员备案后就医报销比例下浮10%；未备案自行外出就医（非急诊抢救）报销比例下浮20%。'
    },
    {
      docId: 'xa-resident-2024-notice',
      title: '西安市医疗保障局等四部门关于做好2024年城乡居民基本医疗保障有关工作的通知',
      docNumber: '市医保发〔2024〕38号',
      issuingDept: ['西安市医疗保障局', '西安市财政局', '国家税务总局西安市税务局'],
      publishDate: '2024-09-05',
      effectiveDate: '2024-09-10',
      status: 'active',
      officialUrl: 'http://ybj.xa.gov.cn/zcfg/zcjd/1892182736182910291.html',
      summaryQuote: '全面落实参保长效机制，对连续参保人员按规定提高大病保险最高支付限额；优化门诊统筹与“两病”用药保障，二级以下医疗机构普通门诊报销保持稳定。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'xa-employee-outpatient-2022-75',
      annualDeductible: 200, // 门诊年起付线 200元
      annualCap: 2000,       // 在职年限额 2000元
      annualCapRetiree: 2500,// 退休年限额 2500元
      tierBenefits: {
        community: {
          tierName: '基层社区服务中心/卫生院',
          deductible: 200,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.05
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.05
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.05
        }
      },
      note: '自然年度内门诊费用累计计算，达200元起付线后开始按比例报销，退休人员报销比例上浮5%。'
    },
    inpatient: {
      sourceDocId: 'xa-employee-inpatient-basic',
      annualCap: 400000, // 基本医保年封顶 40 万元
      repeatedDeductibleRule: '同一自然年度内多次住院，起付线每次递减20%，但最低不得低于一级医院标准。',
      tierBenefits: {
        community: {
          tierName: '社区卫生服务机构/乡镇卫生院',
          deductible: 200,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.04
        },
        tier1: {
          tierName: '一级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.04
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 500,
          reimbursementRatio: 0.85,
          retireeRatioBonus: 0.05
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 1200,
          reimbursementRatio: 0.80,
          retireeRatioBonus: 0.05
        },
        tier3_top: {
          tierName: '三甲重点医院(西京/唐都/交大一二附等)',
          deductible: 1200,
          reimbursementRatio: 0.80,
          retireeRatioBonus: 0.05
        }
      }
    },
    catastrophic: {
      sourceDocId: 'xa-employee-inpatient-basic',
      name: '城镇职工大额医疗补助',
      deductible: 0, // 基本统筹超限后无缝衔接
      tiers: [
        { minAmount: 400000, ratio: 0.90 } // 超过40万部分由大额补助支付90%
      ],
      annualCap: 500000
    },
    remoteMedical: {
      sourceDocId: 'xa-remote-medical-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '西安医保微信公众号', '参保地医保经办中心窗口/电话'],
      longTermFiledRatio: 1.0,      // 不降
      transferFiledRatio: 0.90,     // 降 10%
      unfiledEmergencyRatio: 0.90,  // 急诊降 10%
      unfiledNormalRatio: 0.80,     // 非急诊自行就医降 20%
      specialNotes: [
        '跨省或省内跨市住院建议在入院前或出院结算前办理备案。',
        '在国家医保平台APP或陕西医保小程序备案成功后，出院可直接刷社保卡或医保码即时结算。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'xa-resident-basic-2019-40',
      annualDeductible: 0,
      annualCap: 200, // 城乡居民门诊统筹年度限额相对较低（以基层定点为主）
      tierBenefits: {
        community: {
          tierName: '社区卫生服务站/村卫生室',
          deductible: 0,
          reimbursementRatio: 0.70
        },
        tier1: {
          tierName: '一级医院/社区卫生服务中心',
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
          tierName: '三级特等/三甲医院（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        }
      },
      note: '居民医保普通门诊统筹仅限定点基层社区卫生服务中心/站、村卫生室和一级医院，免起付线报销60%~70%，年度最高支付限额200元。二级及三级医院普通门诊不纳入门诊统筹报销范围（门诊慢特病及两病专项除外）。'
    },
    inpatient: {
      sourceDocId: 'xa-resident-basic-2019-40',
      annualCap: 200000, // 居民基本医保统筹封顶 20 万元
      repeatedDeductibleRule: '一个自然年度内多次住院，起付线每次递减50元，但最低不得低于100元。',
      tierBenefits: {
        community: {
          tierName: '社区卫生服务中心/卫生院',
          deductible: 150,
          reimbursementRatio: 0.80
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 150,
          reimbursementRatio: 0.80
        },
        tier2: {
          tierName: '二级医疗机构',
          deductible: 400,
          reimbursementRatio: 0.70
        },
        tier3: {
          tierName: '三级普通医疗机构',
          deductible: 1200,
          reimbursementRatio: 0.60
        },
        tier3_top: {
          tierName: '三级特等医院(交大一附院/西京/唐都等)',
          deductible: 2000,
          reimbursementRatio: 0.50
        }
      }
    },
    catastrophic: {
      sourceDocId: 'xa-resident-basic-2019-40',
      name: '城乡居民大病保险',
      deductible: 20000, // 2025年1月1日起调为20000元（特困人员、低保对象10000元）
      annualCap: 300000, // 年度最高支付限额30万元（特困人员、低保对象无封顶）
      tiers: [
        { minAmount: 20000, ratio: 0.60 } // 政策范围内合规自付费用统一报销60%
      ]
    },
    remoteMedical: {
      sourceDocId: 'xa-remote-medical-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '西安医保经办热线'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '居民省内跨市就医或跨省就医，未转诊备案直接异地住院的，报销比例下浮20%。'
      ]
    }
  }
};
