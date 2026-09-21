import type { CityInsuranceData } from '../types';

/**
 * 安康市基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 */
export const ankangCityData: CityInsuranceData = {
  cityCode: '610900',
  cityName: '安康市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '0915-12393',
  officialPortalUrl: 'https://www.ankang.gov.cn/',
  lastUpdated: '2026-03-01',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'ak-employee-outpatient-2022',
      title: '安康市人民政府办公室关于印发《安康市职工基本医疗保险门诊共济保障机制实施办法（试行）》的通知',
      docNumber: '安政办发〔2022〕25号',
      issuingDept: ['安康市人民政府办公室', '安康市医疗保障局', '安康市财政局'],
      publishDate: '2022-12-15',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://www.ankang.gov.cn/Content-2615103.html',
      summaryQuote: '一个自然年度内，参保人员个人发生的政策范围内普通门诊费用累计起付线标准为每人每年200元。在职职工门诊统筹基金支付比例为一级及以下定点医疗机构60%、二级定点医疗机构55%、三级定点医疗机构50%，退休人员门诊统筹支付比例按医疗机构级别较在职职工标准分别提高10个百分点。在职职工普通门诊统筹年度最高支付限额为800元，退休人员为1000元，跨年不结转。'
    },
    {
      docId: 'ak-employee-inpatient-2022',
      title: '安康市医疗保障局关于印发《安康市职工基本医疗保险市级统筹实施细则》的通知',
      docNumber: '安医保发〔2022〕12号',
      issuingDept: ['安康市医疗保障局', '安康市财政局'],
      publishDate: '2022-03-15',
      effectiveDate: '2022-04-01',
      status: 'active',
      officialUrl: 'https://www.ankang.gov.cn/Content-2432422.html',
      summaryQuote: '起付标准设置为：一级医疗机构第一次200元、第二次100元、第三次及以后0元；二级医疗机构第一次400元、第二次200元、第三次及以后0元；三级医疗机构第一次800元、第二次400元、第三次及以后0元。退休人员在上述对应标准分别降低100元。统筹基金支付比例：一级医疗机构95%，二级医疗机构94%，三级医疗机构91%，退休人员个人自付比例降低1个百分点（支付比例增加1个百分点）。基本医疗保险统筹基金年最高支付限额为12万元。大病医疗保险超出统筹最高支付限额部分个人自付10%（基金支付90%），年度最高支付限额为14万元。'
    },
    {
      docId: 'ak-resident-basic-2019',
      title: '安康市人民政府关于印发《安康市城乡居民基本医疗保险市级统筹办法实施细则》的通知',
      docNumber: '安政发〔2019〕33号',
      issuingDept: ['安康市人民政府', '安康市医疗保障局'],
      publishDate: '2019-12-10',
      effectiveDate: '2020-01-01',
      status: 'active',
      officialUrl: 'https://www.ankang.gov.cn/Content-2276128.html',
      summaryQuote: '城乡居民门诊在基层医疗卫生机构就医基金支付50%~60%，年度限额100元/人，两病门诊用药限额300元。住院起付线一级医疗机构200元（报销80%），二级医疗机构600元（报销70%），三级医疗机构2000元（报销60%）。统筹基金年最高支付限额12万元。城乡居民大病保险起付线10000元，1-5万元报销60%，5-10万元报销70%，10万元以上报销80%，最高限额30万元。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'ak-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 800,
      annualCapRetiree: 1000,
      tierBenefits: {
        community: {
          tierName: '基层社区卫生服务中心/乡镇卫生院',
          deductible: 200,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.10
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.60,
          retireeRatioBonus: 0.10
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.55,
          retireeRatioBonus: 0.10
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.10
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 200,
          reimbursementRatio: 0.50,
          retireeRatioBonus: 0.10
        }
      },
      note: '自然年度内职工普通门诊合规费用累计达200元起付线后启动统筹支付。在职人员一级60%、二级55%、三级50%，退休人员支付比例对应提高10个百分点。在职年限额800元，退休年限额1000元。'
    },
    inpatient: {
      sourceDocId: 'ak-employee-inpatient-2022',
      annualCap: 120000, // 基本医保统筹基金年最高支付限额12万元
      repeatedDeductibleRule: '同一自然年度内多次住院起付线逐步递减：一级医院依次为200元、100元、第三次及以后0元；二级医院依次为400元、200元、第三次及以后0元；三级医院依次为800元、400元、第三次及以后0元。退休人员各级起付线对应减少100元。',
      tierBenefits: {
        community: {
          tierName: '基层社区卫生服务中心/乡镇卫生院',
          deductible: 200,
          reimbursementRatio: 0.95,
          retireeRatioBonus: 0.01
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.95,
          retireeRatioBonus: 0.01
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 400,
          reimbursementRatio: 0.94,
          retireeRatioBonus: 0.01
        },
        tier3: {
          tierName: '三级定点医疗机构',
          deductible: 800,
          reimbursementRatio: 0.91,
          retireeRatioBonus: 0.01
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 800,
          reimbursementRatio: 0.91,
          retireeRatioBonus: 0.01
        }
      }
    },
    catastrophic: {
      sourceDocId: 'ak-employee-inpatient-2022',
      name: '安康市城镇职工大病医疗保险',
      deductible: 0, // 基本统筹12万元封顶后无缝衔接
      tiers: [
        { minAmount: 120000, ratio: 0.90 } // 超出基本统筹最高支付限额部分大病基金报销90%
      ],
      annualCap: 140000 // 大病保险年度最高支付限额14万元（叠加基本统筹可达26万元）
    },
    remoteMedical: {
      sourceDocId: 'ak-employee-inpatient-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '安康医保经办服务窗口/热线'],
      longTermFiledRatio: 1.0,      // 异地安置人员按统筹区内标准执行（不降低）
      transferFiledRatio: 0.90,     // 经转诊到统筹区外住院，统筹基金支付比例降低10%（自付提高10%）
      unfiledEmergencyRatio: 0.90,  // 急诊下浮10%
      unfiledNormalRatio: 0.85,     // 未经转诊自行跨统筹区住院，统筹基金支付比例降低15%
      specialNotes: [
        '异地安置退休、异地长期居住人员办理备案后，享受安康统筹区内同等住院报销待遇。',
        '经二级以上定点医疗机构规范转诊到统筹区外住院的，报销比例在原标准上下调10个百分点。',
        '未经转诊自行前往统筹区外定点医疗机构住院的，报销比例下调15个百分点。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'ak-resident-basic-2019',
      annualDeductible: 0,
      annualCap: 100, // 居民门诊统筹年度限额100元/人
      tierBenefits: {
        community: {
          tierName: '村卫生室/社区卫生服务站',
          deductible: 0,
          reimbursementRatio: 0.60
        },
        tier1: {
          tierName: '乡镇卫生院/定点社区卫生服务中心',
          deductible: 0,
          reimbursementRatio: 0.50
        },
        tier2: {
          tierName: '二级定点医疗机构（门诊统筹未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3: {
          tierName: '三级定点医疗机构（门诊统筹未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        },
        tier3_top: {
          tierName: '三级甲等综合医院（门诊统筹未覆盖）',
          deductible: 0,
          reimbursementRatio: 0.00
        }
      },
      note: '居民门诊统筹主要在基层医疗卫生机构就医：村卫生室/社区站报销60%，乡镇卫生院/社区中心报销50%，年限额100元；高血压、糖尿病两病门诊用药报销50%，限额300元。二级及以上医疗机构不设普通门诊统筹报销。'
    },
    inpatient: {
      sourceDocId: 'ak-resident-basic-2019',
      annualCap: 120000, // 居民统筹基金年度最高支付限额12万元
      repeatedDeductibleRule: '根据安康市最新现行规定，住院起付标准不执行多次住院减免政策，参保人员每次住院均统一执行定点机构首次起付标准。',
      tierBenefits: {
        community: {
          tierName: '乡镇卫生院/社区卫生服务中心',
          deductible: 200,
          reimbursementRatio: 0.80
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.80
        },
        tier2: {
          tierName: '二级定点医疗机构',
          deductible: 600,
          reimbursementRatio: 0.70
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
      sourceDocId: 'ak-resident-basic-2019',
      name: '安康市城乡居民大病保险',
      deductible: 10000, // 居民大病保险起付线1万元
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ],
      annualCap: 300000 // 居民大病最高支付限额30万元
    },
    remoteMedical: {
      sourceDocId: 'ak-resident-basic-2019',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '参保地医保经办机构窗口'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.85,
      specialNotes: [
        '参保居民长期异地居住备案后享受参保地同等报销待遇。',
        '经规范转诊或急诊在统筹区外住院的，统筹基金支付比例下浮10%。',
        '未经转诊自行前往省内三级定点医疗机构或跨省住院的，报销比例下浮10%~15%。'
      ]
    }
  }
};
