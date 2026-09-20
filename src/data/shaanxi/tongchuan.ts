import type { CityInsuranceData } from '../types';

/**
 * 铜川市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 */
export const tongchuanCityData: CityInsuranceData = {
  cityCode: '610200',
  cityName: '铜川市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0919-12393',
  officialPortalUrl: 'https://www.tongchuan.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'tc-employee-outpatient-2022',
      title: '铜川市人民政府办公室关于印发《铜川市建立健全职工基本医疗保险门诊共济保障机制实施办法》的通知',
      docNumber: '铜政办发〔2022〕23号',
      issuingDept: ['铜川市人民政府办公室', '铜川市医疗保障局', '铜川市财政局'],
      publishDate: '2022-11-20',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://www.tongchuan.gov.cn/resources/site/1/html/xxgk/zcwj/tcszfwj/tzbf/202211/673091.html',
      summaryQuote: '一个自然年度内普通门诊统筹起付线为200元。在职职工普通门诊统筹支付比例为一级医疗机构（含乡镇卫生院及社区卫生服务中心）70%，二级医疗机构60%，三级医疗机构50%。退休人员支付比例按医疗机构级别相应提高5个百分点。最高支付限额：在职职工年度最高支付限额为800元，退休人员年度最高支付限额为1000元。职工普通门诊统筹基金年度支付限额仅限本人在当年使用，跨年不结转。'
    },
    {
      docId: 'tc-employee-inpatient-2022',
      title: '铜川市人民政府办公室关于印发《铜川市职工医疗保险实施细则》的通知',
      docNumber: '铜政办发〔2022〕28号',
      issuingDept: ['铜川市人民政府办公室', '铜川市医疗保障局'],
      publishDate: '2023-01-04',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://www.tongchuan.gov.cn/resources/site/1/html/xxgk/zcwj/gfwj/szfbgs/202301/678689.html',
      summaryQuote: '第二十六条 一个年度内，职工医疗保险参保人在定点医药机构发生的住院、门诊医疗费用，统筹基金最高支付限额为9.5万元；大额医疗补助暂不设最高支付限额。第二十八条 住院起付标准及报销比例：乡镇卫生院/社区卫生服务中心起付线150元，报销比例93%；一级医院起付线450元（45岁以下550元），报销比例91%（退休93%）；二级医院起付线550元（45岁以下650元），报销比例90%（退休92%）；三级医院起付线650元（45岁以下750元），报销比例89%（退休91%）。注：参保人员在一个参保年度内，第三次及以后住院不再设立起付标准。第三十二条 建立职工大额医疗补助制度，在基本医疗保险最高支付限额以上部分，由大额医疗补助基金按92%的比例支付，暂不设最高支付限额。'
    },
    {
      docId: 'tc-resident-basic-2024',
      title: '铜川市人民政府办公室关于印发《铜川市城乡居民基本医疗保险实施办法》的通知',
      docNumber: '铜政办发〔2024〕23号',
      issuingDept: ['铜川市人民政府办公室', '铜川市医疗保障局'],
      publishDate: '2025-01-10',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'https://www.tongchuan.gov.cn/resources/site/1/html/xxgk/zcwj/gfwj/szfbgs/202501/869264.html',
      summaryQuote: '第二十一条 统筹区域内一级及以下医疗机构起付标准300元，支付比例85%；二级医疗机构起付标准600元，支付比例75%；三级医疗机构起付标准1200元，支付比例65%。省内异地一级及以下起付300元比例80%；二级起付1200元比例70%；三级起付2400元比例60%。第二十二条 全面开展居民医保普通门诊统筹，参保人员在二级及以下定点医疗机构发生的政策范围内门诊医疗费，由居民医保基金按60%的比例支付，年度支付限额120元/人。第二十七条 城乡居民在一个保险年度内，基本医疗保险基金累计支付最高限额为13万元。第二十九至三十条 大病保险起付线10000元，分段报销60%、70%、80%。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'tc-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 800,
      annualCapRetiree: 1000,
      tierBenefits: {
        community: {
          tierName: '基层社区卫生服务中心/乡镇卫生院',
          deductible: 200,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.05
        },
        tier3: {
          tierName: '三级定点医疗机构',
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
      note: '一个自然年度内普通门诊统筹起付线为200元。在职职工一级70%、二级60%、三级50%，退休人员支付比例对应提高5个百分点。在职年度最高支付限额800元，退休人员1000元。'
    },
    inpatient: {
      sourceDocId: 'tc-employee-inpatient-2022',
      annualCap: 95000, // 基本医保统筹基金年度最高支付限额9.5万元
      repeatedDeductibleRule: '参保人员在一个参保年度内第三次及以后住院免收起付线（0元）。第二次住院起付线降低（一级300元、二级400元、三级500元）。45周岁及以下在职职工起付线在基准上增加100元。',
      tierBenefits: {
        community: {
          tierName: '乡镇卫生院/社区卫生服务中心',
          deductible: 150,
          reimbursementRatio: 0.93,
          retireeRatioBonus: 0.02
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 450,
          reimbursementRatio: 0.91,
          retireeRatioBonus: 0.02
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 550,
          reimbursementRatio: 0.90,
          retireeRatioBonus: 0.02
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 650,
          reimbursementRatio: 0.89,
          retireeRatioBonus: 0.02
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 650,
          reimbursementRatio: 0.89,
          retireeRatioBonus: 0.02
        }
      }
    },
    catastrophic: {
      sourceDocId: 'tc-employee-inpatient-2022',
      name: '城镇职工大额医疗补助',
      deductible: 0, // 基本医疗保险统筹封顶后无缝衔接
      tiers: [
        { minAmount: 95000, ratio: 0.92 } // 在基本医保最高支付限额9.5万元以上部分，大额补助报销92%
      ],
      annualCap: undefined // 大额医疗补助暂不设最高支付限额
    },
    remoteMedical: {
      sourceDocId: 'tc-employee-inpatient-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '铜川医保微信公众号', '铜川医保经办大厅'],
      longTermFiledRatio: 1.0,      // 异地长期居住人员备案后报销比例不降低
      transferFiledRatio: 0.90,     // 异地转诊转院住院下浮10%
      unfiledEmergencyRatio: 0.90,  // 异地急诊抢救下浮10%
      unfiledNormalRatio: 0.80,     // 未备案自行外出就医下浮20%
      specialNotes: [
        '铜川参保职工办理异地长期居住或安置退休备案后，按参保地同等标准直接结算。',
        '因病情需要转诊至省内外异地定点医疗机构住院的，统筹基金支付比例下浮10%。',
        '未按规定办理转诊备案手续自行跨统筹区就医的，统筹基金支付比例下浮20%。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'tc-resident-basic-2024',
      annualDeductible: 0,
      annualCap: 120, // 居民普通门诊统筹年度最高支付限额120元/人
      tierBenefits: {
        community: {
          tierName: '一级及以下基层医疗机构/社区中心',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier3: {
          tierName: '三级定点医疗机构（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3_top: {
          tierName: '三级甲等综合医院（普通门诊未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        }
      },
      note: '铜川参保居民在二级及以下定点医疗机构发生的政策范围内门诊医疗费，由医保基金按60%比例支付，年度支付限额120元/人。三级医疗机构不设居民普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'tc-resident-basic-2024',
      annualCap: 130000, // 居民基本医疗保险年度统筹最高支付限额13万元
      repeatedDeductibleRule: '统筹区域内定点医疗机构起付线按标准执行；年度内多次住院起付线按规定递减。',
      tierBenefits: {
        community: {
          tierName: '一级及以下/基层社区卫生服务中心',
          deductible: 300,
          reimbursementRatio: 0.85
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 300,
          reimbursementRatio: 0.85
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 600,
          reimbursementRatio: 0.75
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 1200,
          reimbursementRatio: 0.65
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 1200,
          reimbursementRatio: 0.65
        }
      }
    },
    catastrophic: {
      sourceDocId: 'tc-resident-basic-2024',
      name: '铜川市城乡居民大病保险',
      deductible: 10000, // 居民大病保险起付线1万元
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ],
      annualCap: 300000 // 铜川市城乡居民大病保险年度最高支付限额30万元（特困人员/低保对象除外）
    },
    remoteMedical: {
      sourceDocId: 'tc-resident-basic-2024',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '铜川市医保经办机构'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '参保居民办理异地长期居住备案后享受参保地同等就医报销待遇。',
        '省内异地就医一级起付300元支付80%，二级起付1200元支付70%，三级起付2400元支付60%。',
        '未按规定办理转诊备案手续自行前往省内外异地住院的，支付比例下浮20%。'
      ]
    }
  }
};
