import type { CityInsuranceData } from '../types';

/**
 * 杨凌示范区基本医疗保险政策数据与官方文件溯源库
 * 数据基准年度：2025-2026年（现行有效）
 */
export const yanglingCityData: CityInsuranceData = {
  cityCode: '610403',
  cityName: '杨凌示范区',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '029-12393',
  officialPortalUrl: 'http://www.yangling.gov.cn/',

  // 官方依据文件库
  sourceDocs: [
    {
      docId: 'yl-employee-outpatient-2022',
      title: '杨凌示范区管委会办公室关于印发《杨凌示范区职工基本医疗保险门诊共济保障机制实施细则》的通知',
      docNumber: '杨管办发〔2022〕26号',
      issuingDept: ['杨凌示范区管委会办公室', '杨凌示范区医疗保障局', '杨凌示范区财政局'],
      publishDate: '2022-09-09',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'http://www.yangling.gov.cn/zwgk/fdzdgknr/gfxwj/1584796854618693634.html',
      summaryQuote: '参保人员一个自然年度内在定点医疗机构发生的政策范围内的费用，由统筹基金按以下规定支付：普通门诊待遇起付线为200元；在职职工普通门诊支付比例为一级医疗机构（含乡镇卫生院及社区卫生服务中心）70%、二级医疗机构60%、三级医疗机构50%，退休人员支付比例按医疗机构级别相应提高5个百分点；在职职工普通门诊每人每年最高支付限额为2000元，退休人员最高支付限额为2500元。'
    },
    {
      docId: 'yl-employee-inpatient-2024',
      title: '杨凌示范区管委会办公室关于印发《杨凌示范区城镇职工基本医疗保险市级统筹实施办法》的通知',
      docNumber: '杨管办发〔2024〕1号',
      issuingDept: ['杨凌示范区管委会办公室', '杨凌示范区医疗保障局'],
      publishDate: '2024-02-06',
      effectiveDate: '2024-01-10',
      status: 'active',
      officialUrl: 'http://www.yangling.gov.cn/zwgk/fdzdgknr/gfxwj/1878718964081799170.html',
      summaryQuote: '住院医疗待遇起付标准：一级医院第一次200元、第二次150元、第三次100元、第四次及以上0元；二级医院第一次400元、第二次300元、第三次150元、第四次及以上0元；三级医院第一次850元、第二次650元、第三次400元、第四次及以上0元。报销比例：一级医院在职95%，退休97%；二级医院在职93%，退休95%；三级医院在职86%，退休88%。基本医疗保险统筹基金年度最高支付限额15万元。大额医疗补助范围是超出基本医保统筹基金最高支付限额且符合政策规定的费用，补助支付标准为95%，年度最高支付限额为20万元。'
    },
    {
      docId: 'yl-resident-basic-2022',
      title: '杨凌示范区医疗保障局关于调整城乡居民基本医疗保险有关政策的通知',
      docNumber: '杨医保发〔2022〕18号',
      issuingDept: ['杨凌示范区医疗保障局', '杨凌示范区财政局'],
      publishDate: '2022-06-25',
      effectiveDate: '2022-07-01',
      status: 'active',
      officialUrl: 'http://www.yangling.gov.cn/xwzx/bdyw/1534721489801129986.html',
      summaryQuote: '区内一级医疗机构（镇办卫生院/社区中心）起付线100元，报销比例90%；区内二级公立医疗机构起付线400元，报销比例85%；区内三级定点医疗机构起付线800元，报销比例75%；区外三级定点起付线2000元，报销比例70%。基本医保年度最高支付限额13万元。大病保险起付线10000元，按省定分段比例60%、70%、80%支付。'
    }
  ],

  // 城镇职工医保待遇
  employee: {
    outpatient: {
      sourceDocId: 'yl-employee-outpatient-2022',
      annualDeductible: 200,
      annualCap: 2000,
      annualCapRetiree: 2500,
      tierBenefits: {
        community: { tierName: '基层社区服务中心/镇卫生院', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级定点医疗机构', deductible: 200, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级定点医疗机构', deductible: 200, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级定点医疗机构', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 200, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '一个自然年度内普通门诊起付线为200元。在职职工一级70%、二级60%、三级50%，退休人员支付比例按医疗机构级别相应提高5个百分点。在职年限额2000元，退休人员2500元。'
    },
    inpatient: {
      sourceDocId: 'yl-employee-inpatient-2024',
      annualCap: 150000, // 基本医疗保险统筹基金年度最高支付限额15万元
      repeatedDeductibleRule: '一个自然年度内多次住院起付线逐步递减：一级医院依次为200元、150元、100元、第四次及以上0元；二级医院依次为400元、300元、150元、第四次及以上0元；三级医院依次为850元、650元、400元、第四次及以上0元。',
      tierBenefits: {
        community: {
          tierName: '镇卫生院/社区卫生服务中心',
          deductible: 200,
          reimbursementRatio: 0.95,
          retireeRatioBonus: 0.02
        },
        tier1: {
          tierName: '一级定点医疗机构',
          deductible: 200,
          reimbursementRatio: 0.95,
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
          deductible: 850,
          reimbursementRatio: 0.86,
          retireeRatioBonus: 0.02
        },
        tier3_top: {
          tierName: '三级甲等综合医院',
          deductible: 850,
          reimbursementRatio: 0.86,
          retireeRatioBonus: 0.02
        }
      }
    },
    catastrophic: {
      sourceDocId: 'yl-employee-inpatient-2024',
      name: '城镇职工大额医疗补助',
      deductible: 0, // 基本统筹15万元封顶后无缝衔接
      tiers: [
        { minAmount: 150000, ratio: 0.95 } // 超出基本医保统筹基金最高支付限额费用补助支付比例95%
      ],
      annualCap: 200000 // 大额医疗补助年度最高支付限额20万元（叠加基本统筹最高达35万元）
    },
    remoteMedical: {
      sourceDocId: 'yl-employee-inpatient-2024',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '杨凌示范区政务大厅医保窗口'],
      longTermFiledRatio: 1.0,      // 异地长期居住或常驻人员备案后报销比例不降低
      transferFiledRatio: 0.90,     // 规范转诊异地住院支付比例下浮10%
      unfiledEmergencyRatio: 0.90,  // 异地急诊抢救支付比例下浮10%
      unfiledNormalRatio: 0.80,     // 未办理转诊备案手续自行跨统筹区住院下浮20%
      specialNotes: [
        '杨凌参保职工异地长期居住或常驻工作人员，备案后享受示范区同等就医待遇。',
        '规范转诊或急诊抢救在示范区外定点医疗机构住院的，基金支付比例下浮10%。',
        '未按规定办理转诊手续自行前往异地就医住院的，基金支付比例下浮20%直接结算。'
      ]
    }
  },

  // 城乡居民医保待遇
  resident: {
    outpatient: {
      sourceDocId: 'yl-resident-basic-2022',
      annualCap: 150,
      tierBenefits: {
        community: { tierName: '基层社区及乡镇卫生院', deductible: 0, reimbursementRatio: 0.60 },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级医疗机构(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '重点三甲医院(未纳统筹)', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '城乡居民门诊统筹主要在区内基层医疗机构就医：村卫生室/社区站报销60%，乡镇卫生院/社区中心报销50%，年度统筹支付最高限额150元。二级及以上医疗机构不设普通门诊统筹。'
    },
    inpatient: {
      sourceDocId: 'yl-resident-basic-2022',
      annualCap: 200000, // 居民基本医疗保险年度统筹基金最高支付限额13万元
      repeatedDeductibleRule: '统筹年度内多次住院起付线按规定标准执行，鼓励基层就医。',
      tierBenefits: {
        community: { tierName: '基层医疗机构及卫生院', deductible: 160, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级定点医疗机构', deductible: 160, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级定点医疗机构', deductible: 550, reimbursementRatio: 0.80 },
        tier3: { tierName: '三级定点医疗机构', deductible: 1000, reimbursementRatio: 0.65 },
        tier3_top: { tierName: '市级重点三甲医院', deductible: 1000, reimbursementRatio: 0.65 }
      }
    },
    catastrophic: {
      sourceDocId: 'yl-resident-basic-2022',
      name: '杨凌示范区城乡居民大病保险',
      deductible: 10000, // 居民大病保险起付线1万元
      tiers: [
        { minAmount: 10000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.70 },
        { minAmount: 100000, ratio: 0.80 }
      ],
      annualCap: undefined // 居民大病保险原则上不设封顶线
    },
    remoteMedical: {
      sourceDocId: 'yl-resident-basic-2022',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '杨凌医保热线029-12393'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '杨凌参保居民异地长期居住备案后享受示范区同等就医报销待遇。',
        '区外住院一级起付线800元报销90%，二级报销80%，三级起付线2000元报销70%。',
        '未按规定办理转院转诊或备案手续的区外住院，报销比例在原基础上降低10%~20%。'
      ]
    }
  }
};
