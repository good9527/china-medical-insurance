import type { CityInsuranceData } from '../types';

/**
 * 商洛市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 */
export const shangluoCityData: CityInsuranceData = {
  cityCode: '611000',
  cityName: '商洛市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0914-12393',
  officialPortalUrl: 'https://www.shangluo.gov.cn/ybj/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'sl-employee-outpatient-2022',
      title: '商洛市人民政府办公室关于印发职工基本医疗保险门诊共济保障实施办法的通知',
      docNumber: '商政办发〔2022〕27号',
      issuingDept: ['商洛市人民政府办公室', '商洛市医疗保障局', '商洛市财政局'],
      publishDate: '2022-07-22',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://www.shangluo.gov.cn/info/1115/108712.htm',
      summaryQuote: '设立统筹基金起付标准：一级及以下定点医疗机构30元/次，二级定点医疗机构60元/次，三级定点医疗机构90元/次；在职职工统筹基金支付比例：一级及以下定点医疗机构70%，二级定点医疗机构65%，三级定点医疗机构60%；退休人员提高5个百分点；年度最高支付限额：在职人员1500元、退休人员2000元。'
    },
    {
      docId: 'sl-employee-inpatient-2022',
      title: '商洛市人民政府关于印发《商洛市城镇职工基本医疗保险和生育保险实施办法》的通知',
      docNumber: '商政发〔2022〕3号',
      issuingDept: ['商洛市人民政府', '商洛市医疗保障局'],
      publishDate: '2022-01-20',
      effectiveDate: '2022-02-01',
      status: 'active',
      officialUrl: 'https://www.shangluo.gov.cn/ybj/info/1032/1598.htm',
      summaryQuote: '统筹基金起付标准：一级医院第一次300元、第二次220元、三次及以上180元；二级医院第一次400元、第二次300元、三次及以上200元；三级医院第一次600元、第二次460元、三次及以上320元。起付标准以上统筹基金分段支付，1万元以上：一级在职94%(退休96%)，二级在职93%(退休95%)，三级在职92%(退休94%)。基本医疗保险统筹基金年度最高支付限额原则上控制在全市职工年平均工资的4倍左右（约28万元）；超过最高支付限额的医疗费用，通过大病医疗互助基金等途径解决，大病医疗互助基金不设封顶线，个人负担比例一般不超过10%（即基金支付90%）。'
    },
    {
      docId: 'sl-resident-remote-2023',
      title: '商洛市医疗保障局关于调整基本医疗保险省内异地就医政策的通知',
      docNumber: '商医保发〔2023〕81号',
      issuingDept: ['商洛市医疗保障局', '商洛市财政局'],
      publishDate: '2023-08-15',
      effectiveDate: '2023-09-01',
      status: 'active',
      officialUrl: 'https://www.shangluo.gov.cn/ybj/info/1032/3494.htm',
      summaryQuote: '市内居民住院起付线：乡镇卫生院/社区服务中心100元，一级300元，二级400元，三级500元。报销比例：一级医院不低于80%，二级75%，三级70%。基本医疗保险年度最高支付限额13万元。大病保险起付线10000元，1-3万元按60%、3-10万元按70%、10万元以上按80%报销，最高封顶线30万元。跨省异地转诊人员和异地急诊抢救人员住院在本地比例基础上下调10个百分点；跨省非急诊且未转诊的其他临时外出就医人员住院下调15个百分点。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'sl-employee-outpatient-2022',
      annualDeductible: 30, // 商洛按次设起付线（一级30/二级60/三级90元/次），系统首诊起付标准基准为30元
      annualCap: 1500,      // 在职职工门诊统筹年最高限额1500元
      annualCapRetiree: 2000,// 退休人员年最高限额2000元
      tierBenefits: {
        community: {
          tierName: '基层社区卫生服务中心/卫生院',
          deductible: 30,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 30,
          reimbursementRatio: 0.70,
          retireeRatioBonus: 0.05
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 60,
          reimbursementRatio: 0.65,
          retireeRatioBonus: 0.05
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 90,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.05
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 90,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.05
        }
      },
      note: '商洛职工门诊共济按次设立起付标准：一级及以下30元/次，二级60元/次，三级90元/次。在职职工统筹支付比例为一级70%、二级65%、三级60%，退休人员相应提高5个百分点。在职年度最高支付限额1500元，退休人员2000元。'
    },
    inpatient: {
      sourceDocId: 'sl-employee-inpatient-2022',
      annualCap: 280000, // 基本医保统筹基金年度最高支付限额约28万元
      repeatedDeductibleRule: '同一自然年度内多次住院，起付标准依次降低：一级医院首次300元、第二次220元、三次及以上180元；二级医院首次400元、第二次300元、三次及以上200元；三级医院首次600元、第二次460元、三次及以上320元。',
      tierBenefits: {
        community: {
          tierName: '基层社区卫生服务中心/乡镇卫生院',
          deductible: 300,
          reimbursementRatio: 0.94,
          retireeRatioBonus: 0.02
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 300,
          reimbursementRatio: 0.94,
          retireeRatioBonus: 0.02
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 400,
          reimbursementRatio: 0.93,
          retireeRatioBonus: 0.02
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 600,
          reimbursementRatio: 0.92,
          retireeRatioBonus: 0.02
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 600,
          reimbursementRatio: 0.92,
          retireeRatioBonus: 0.02
        }
      }
    },
    catastrophic: {
      sourceDocId: 'sl-employee-inpatient-2022',
      name: '城镇职工大额医疗互助',
      deductible: 0, // 基本医疗统筹封顶后无缝衔接
      tiers: [
        { minAmount: 280000, ratio: 0.90 } // 超过基本统筹限额部分由大额互助基金按90%报销
      ],
      annualCap: undefined // 大病医疗互助基金不设封顶线
    },
    remoteMedical: {
      sourceDocId: 'sl-resident-remote-2023',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '商洛医保政务服务窗口'],
      longTermFiledRatio: 1.0,      // 异地安置及长期居住人员备案后报销比例不降低
      transferFiledRatio: 0.90,     // 跨省及市外转诊住院下浮10%
      unfiledEmergencyRatio: 0.90,  // 异地急诊抢救住院下浮10%
      unfiledNormalRatio: 0.85,     // 临时外出未办理转诊手续就医下浮15%
      specialNotes: [
        '参保职工办理异地安置或异地长期居住备案后，享受参保地同等就医结算待遇。',
        '跨省异地转诊人员和异地急诊抢救人员住院在本地比例基础上下调10个百分点。',
        '跨省非急诊且未转诊的其他临时外出就医人员住院报销比例下调15个百分点。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'sl-resident-remote-2023',
      annualDeductible: 0,
      annualCap: 100, // 居民门诊统筹年度支付限额每人每年100元
      tierBenefits: {
        community: {
          tierName: '村卫生室/社区卫生服务站',
          deductible: 0,
          reimbursementRatio: 0.50
        },
        tier1: {
          tierName: '乡镇卫生院/社区卫生服务中心',
          deductible: 0,
          reimbursementRatio: 0.50
        },
        tier2: {
          tierName: '二级医疗机构（门诊统筹未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3: {
          tierName: '三级医疗机构（门诊统筹未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3_top: {
          tierName: '三级甲等综合医院（门诊统筹未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        }
      },
      note: '居民普通门诊统筹主要在定点基层医疗机构报销，政策范围内医疗费用报销50%，每人每年报销金额不超过100元。二级及以上医疗机构不设普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'sl-resident-remote-2023',
      annualCap: 130000, // 基本医疗保险年度最高支付限额13万元
      repeatedDeductibleRule: '同自然年度内多次住院起付线依次降低20%，最高降低40%（最低降至基准标准的60%）。',
      tierBenefits: {
        community: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 100, reimbursementRatio: 0.85 },
        tier1: { tierName: '一级定点公立医疗机构', deductible: 300, reimbursementRatio: 0.80 },
        tier2: { tierName: '二级定点医疗机构', deductible: 400, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级定点医疗机构', deductible: 500, reimbursementRatio: 0.70 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 500, reimbursementRatio: 0.70 }
      }
    },
    catastrophic: {
      sourceDocId: 'sl-resident-remote-2023',
      name: '商洛市城乡居民大病保险',
      deductible: 10000, // 居民大病保险起付线1万元
      tiers: [
        { minAmount: 10000, maxAmount: 30000, ratio: 0.60 },
        { minAmount: 30000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ],
      annualCap: 300000 // 居民大病保险最高封顶线30万元
    },
    remoteMedical: {
      sourceDocId: 'sl-resident-remote-2023',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '商洛医保政务大厅'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.85,
      specialNotes: [
        '参保居民办理异地长期居住备案后享受参保地同等就医报销待遇。',
        '跨省异地转诊人员和异地急诊抢救人员住院在本地比例基础上下调10个百分点。',
        '跨省非急诊且未转诊的其他临时外出就医人员住院报销比例下调15个百分点。'
      ]
    }
  }
};
