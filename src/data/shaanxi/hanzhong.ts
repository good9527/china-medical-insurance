import type { CityInsuranceData } from '../types';

/**
 * 汉中市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 * 依据官方文件：
 * 1.《汉中市建立健全职工基本医疗保险门诊共济保障机制实施办法》（汉政办发〔2022〕29号）
 * 2.《汉中市城乡居民基本医疗保险实施细则》（汉政办发〔2021〕45号）
 * 3.《汉中市城镇职工基本医疗保险和大额医疗保险年度支付限额调整政策》（汉医保发〔2024〕18号）
 * 4.《汉中市异地就医医疗费用结算经办细则（试行）》（汉医保发〔2022〕12号）
 */
export const hanzhongCityData: CityInsuranceData = {
  cityCode: '610700',
  cityName: '汉中市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0916-12393',
  officialPortalUrl: 'http://ybj.hanzhong.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'hz-employee-outpatient-2022-29',
      title: '汉中市人民政府办公室关于印发建立健全职工基本医疗保险门诊共济保障机制实施办法的通知',
      docNumber: '汉政办发〔2022〕29号',
      issuingDept: ['汉中市人民政府办公室', '汉中市医疗保障局'],
      publishDate: '2022-07-26',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://www.hanzhong.gov.cn/hzszf/zwgk/zfwj/zfbwj/hzbfwj/202208/31b677be3aa34c02a1e8ce250a38e8b9.shtml',
      summaryQuote: '一个自然年度内，参保职工个人发生的政策范围内的普通门诊费用累计起付标准为每人每年200元。在职职工普通门诊支付比例为一级医疗机构（含乡镇卫生院及社区卫生服务中心）70%、二级医疗机构60%、三级医疗机构50%，退休人员支付比例按医疗机构级别相应提高5%（即一级75%、二级65%、三级55%）。年度最高支付限额：在职人员800元，退休人员1000元。年度支付限额仅限本人当年使用，跨年不滚存、不结转。'
    },
    {
      docId: 'hz-resident-basic-2021-45',
      title: '汉中市人民政府办公室关于印发汉中市城乡居民基本医疗保险实施细则的通知',
      docNumber: '汉政办发〔2021〕45号',
      issuingDept: ['汉中市人民政府办公室', '汉中市医疗保障局', '汉中市财政局'],
      publishDate: '2021-12-28',
      effectiveDate: '2022-01-01',
      status: 'active',
      officialUrl: 'http://ybj.hanzhong.gov.cn/hzsylbzj/zcfgz/202312/7b0b252a9b334ab9b4ae1d09e7d1fc2d.shtml',
      summaryQuote: '门诊费用报销不设起付线（0元），实行年度定额报销管理，参保人年度基金支付限额100元。在二级医疗机构就诊的统筹支付40%；在乡镇（社区）医疗机构就诊的支付50%；在村卫生室（站）就诊的支付60%。“两病”普通门诊药品报销不设起付线，高血压、糖尿病年度基金支付限额分别均为300元。居民住院起付线：一级200元报销90%，二级700元报销75%（二级中医医院600元报销80%），三级2000元报销60%。基本医保最高支付限额15万元。大病保险起付线10000元，1-3万报销60%，3-10万报销70%，10万以上报销80%，封顶30万元。'
    },
    {
      docId: 'hz-employee-inpatient-2024',
      title: '汉中市城镇职工基本医疗保险和大额医疗保险年度支付限额调整政策及待遇标准',
      docNumber: '汉医保发〔2024〕18号',
      issuingDept: ['汉中市医疗保障局', '汉中市财政局'],
      publishDate: '2024-05-15',
      effectiveDate: '2024-05-15',
      status: 'active',
      officialUrl: 'http://ybj.hanzhong.gov.cn/hzsylbzj/ybdt/202008/9b783042968c415c95a1848dd78b7e16.shtml',
      summaryQuote: '职工住院起付标准：一级500元，二级1000元，三级2000元；二次住院起付标准降低10%。统筹支付比例：一级医疗机构在职94%（退休96%），二级在职92%（退休94%），三级在职90%（退休92%）。职工基本医保年度最高支付限额由6万元提高至10万元，职工大额医疗保险年度最高支付限额调整为20万元（合计30万元）。超出基本统筹封顶线部分由大额医疗保险按90%~92%报销。'
    },
    {
      docId: 'hz-remote-medical-2022-25',
      title: '关于印发〈汉中市异地就医医疗费用结算经办细则（试行）〉的通知',
      docNumber: '汉医保发〔2022〕12号',
      issuingDept: ['汉中市医疗保障局'],
      publishDate: '2022-02-28',
      effectiveDate: '2022-03-01',
      status: 'active',
      officialUrl: 'http://ybj.hanzhong.gov.cn/hzsylbzj/zcfgz/202202/11e7d586959a4c15b7187931762336e2.shtml',
      summaryQuote: '异地安置退休、异地长期居住人员按参保地同等级别定点机构标准执行；因急诊抢救在市域外发生的医药费用视为规范转诊；未办理转诊备案手续在市域外发生的住院费用，起付标准提高20%，报销比例在现行基础上降低10%（报销系数0.90）。'
    }
  ],

  // 城镇职工基本医疗保险待遇
  employee: {
    outpatient: {
      sourceDocId: 'hz-employee-outpatient-2022-29',
      annualDeductible: 200, // 汉中职工门诊年累计起付线200元
      annualCap: 800,        // 在职人员门诊年限额800元
      annualCapRetiree: 1000,// 退休人员门诊年限额1000元
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含乡镇卫生院/社区卫生中心)',
          deductible: 200,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05 // 退休上浮5% (一级75%)
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
          retireeRatioBonus: 0.05 // 二级65%
        },
        tier3: {
          tierName: '三级医疗机构',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.05 // 三级55%
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.05
        }
      },
      note: '自然年度内门诊费用累计达到200元起付线后启动报销，退休人员按医疗机构级别相应提高5个百分点。在职年限额800元，退休年限额1000元。'
    },
    inpatient: {
      sourceDocId: 'hz-employee-inpatient-2024',
      annualCap: 100000, // 2024年5月最新优化：基本统筹限额提高至10万元
      repeatedDeductibleRule: '一个参保年度内第二次住院起付标准降低10%，多次住院执行第二次住院起付标准。',
      tierBenefits: {
        community: {
          tierName: '一级医疗机构(含社区/乡镇)',
          deductible: 500,
          reimbursementRatio: 0.94,
          retireeRatioBonus: 0.02 // 在职94%, 退休96%
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 500,
          reimbursementRatio: 0.94,
          retireeRatioBonus: 0.02
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 1000,
          reimbursementRatio: 0.92,
          retireeRatioBonus: 0.02 // 在职92%, 退休94%
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 2000,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.02 // 在职90%, 退休92%
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 2000,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.02
        }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-employee-inpatient-2024',
      name: '职工大额医疗保险',
      deductible: 0,
      tiers: [
        { minAmount: 100000, ratio: 0.90 } // 基本统筹封顶10万后无缝衔接，大额按90%报销
      ],
      annualCap: 200000 // 大额医疗保险年度最高限额20万元（合计30万元）
    },
    remoteMedical: {
      sourceDocId: 'hz-remote-medical-2022-25',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '汉中医保政务服务大厅'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,      // 异地转诊下浮10%
      unfiledEmergencyRatio: 0.90,   // 急诊视同规范转诊 (系数 0.90)
      unfiledNormalRatio: 0.90,      // 未备案自行就医降低10% (系数 0.90)
      specialNotes: [
        '长期异地居住备案后享受参保地同等报销待遇。',
        '未办理转诊备案手续自行跨市就医的，起付标准提高20%，报销比例降低10%。'
      ]
    }
  },

  // 城乡居民基本医疗保险待遇
  resident: {
    outpatient: {
      sourceDocId: 'hz-resident-basic-2021-45',
      annualDeductible: 0,
      annualCap: 100, // 城乡居民普通门诊统筹年度限额100元
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
          tierName: '二级医疗机构',
          deductible: 0,
          reimbursementRatio: 0.40 // 汉政办发〔2021〕45号明确二级统筹基金支付40%
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
      note: '汉中居民门诊0起付线，年基金限额100元（村站60%、乡镇50%、二级40%）；三级医院普通门诊不纳入门诊统筹；两病专项门诊高血压年封顶300元、糖尿病年封顶300元。'
    },
    inpatient: {
      sourceDocId: 'hz-resident-basic-2021-45',
      annualCap: 150000, // 居民基本医保基金累计最高支付限额15万元
      repeatedDeductibleRule: '参保居民在一个自然年度内多次住院，起付标准按定点医疗机构级别分别计算。',
      tierBenefits: {
        community: {
          tierName: '一级医院(含乡镇/社区)',
          deductible: 200,
          reimbursementRatio: 0.90
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.90
        },
        tier2: {
          tierName: '二级医疗机构(综合医院)',
          deductible: 700,
          reimbursementRatio: 0.75 // 综合医院700元/75%（二级中医医院为600元/80%）
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 2000,
          reimbursementRatio: 0.60
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 2000,
          reimbursementRatio: 0.60
        }
      }
    },
    catastrophic: {
      sourceDocId: 'hz-resident-basic-2021-45',
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
      sourceDocId: 'hz-remote-medical-2022-25',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '汉中医保热线'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.90,
      specialNotes: [
        '汉中参保居民异地就医办理转诊或急诊抢救的按规范比例报销；自行跨市就医报销比例降低10%。'
      ]
    }
  }
};
