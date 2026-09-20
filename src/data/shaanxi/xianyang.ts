import type { CityInsuranceData } from '../types';

/**
 * 咸阳市基本医疗保险政策数据与官方文件溯源库
 * 数据核准更新：2025-2026年现行标准
 * 依据官方文件：
 * 1.《咸阳市职工医保门诊共济机制改革政策九问九答》及实施细则
 * 2.《咸阳市医疗保障局关于调整医疗保险和救助政策的通知》（咸医保发〔2024〕48号，2025年1月1日起执行）
 * 3.《咸阳市城乡居民医疗保障政策解读》
 */
export const xianyangCityData: CityInsuranceData = {
  cityCode: '610400',
  cityName: '咸阳市',
  provinceCode: '610000',
  provinceName: '陕西省',
  hotline: '029-12393',
  officialPortalUrl: 'https://ybj.xianyang.gov.cn/',
  
  sourceDocs: [
    {
      docId: 'xy-employee-outpatient-official',
      title: '咸阳市职工医保门诊共济机制改革政策细则及官方问答',
      docNumber: '咸医保发〔2022〕46号',
      issuingDept: ['咸阳市医疗保障局', '咸阳市财政局'],
      publishDate: '2023-01-01',
      effectiveDate: '2023-01-01',
      status: 'active',
      officialUrl: 'https://ybj.xianyang.gov.cn/xwzx/xwdt/202302/t20230221_1599168.html',
      summaryQuote: '门诊统筹起付线为260元/年；政策范围内报销比例：一级（含社区及卫生院）70%、二级60%、三级50%，退休人员相应提高5%；在职职工年报销封顶线为1500元，退休职工年报销封顶线为1700元。'
    },
    {
      docId: 'xy-medical-adjust-2024-48',
      title: '咸阳市医疗保障局关于调整医疗保险和救助政策的通知',
      docNumber: '咸医保发〔2024〕48号',
      issuingDept: ['咸阳市医疗保障局'],
      publishDate: '2024-11-29',
      effectiveDate: '2025-01-01',
      status: 'active',
      officialUrl: 'https://ybj.xianyang.gov.cn/zfxxgk/fdzdgknr/zcwj/zcfg1/202412/t20241231_1894800.html',
      summaryQuote: '城乡居民大病保险起付线调整为1.5万元。规范异地就医住院政策，规范转诊到省内异地三级或三特医疗机构的，居民住院报销比例提高5个百分点为55%。将居民门诊“两病”用药保障服务范围扩大到二级及以下医疗机构。'
    },
    {
      docId: 'xy-resident-official-guide',
      title: '咸阳市城乡居民医疗保障政策解读与经办指南',
      docNumber: '咸政办发〔2020〕18号及待遇更新细则',
      issuingDept: ['咸阳市人民政府办公室', '咸阳市医疗保障局'],
      publishDate: '2023-07-26',
      effectiveDate: '2023-08-01',
      status: 'active',
      officialUrl: 'https://ybj.xianyang.gov.cn/xwzx/ztzl/lszl/xczx/202307/t20230726_1659410.html',
      summaryQuote: '城乡居民普通门诊统筹年报销封顶线为120元/人（年末实行0结余）；每诊次限额一级医院40元、镇卫生院40元、村卫生室30元。“两病”门诊用药报销比例60%，高血压年封顶400元、糖尿病年封顶500元。'
    },
    {
      docId: 'xy-resident-inpatient-regulations',
      title: '咸阳市人民政府办公室关于印发咸阳市城乡居民基本医疗保险市级统筹实施办法的通知及待遇细则',
      docNumber: '咸政办发〔2019〕60号及现行待遇标准',
      issuingDept: ['咸阳市人民政府办公室', '咸阳市医疗保障局'],
      publishDate: '2019-12-20',
      effectiveDate: '2020-01-01',
      status: 'active',
      officialUrl: 'https://ybj.xianyang.gov.cn/zfxxgk/fdzdgknr/zcwj/zcfg1/202412/t20241231_1894800.html',
      summaryQuote: '咸阳市城乡居民基本医疗保险住院待遇（市内）：一级医疗机构/镇卫生院起付金160元、报销比例90%；二级医疗机构起付金550元、报销比例75%；三级医疗机构起付金1500元、报销比例60%；三特医疗机构（西京、唐都、交大一附院、交大二附院、西安市中心医院、陕西省人民医院）起付金3000元、报销比例50%（经规范转诊提高5个百分点为55%）。年度最高支付限额20万元。大病保险起付金1.5万元（特困低保0.75万元），5万元以下报销60%、5万-10万元报销65%、10万元以上报销70%，封顶线30万元（特困低保无封顶）。'
    }
  ],

  // 城镇职工医保待遇 (咸阳标准)
  employee: {
    outpatient: {
      sourceDocId: 'xy-employee-outpatient-official',
      annualDeductible: 260, // 咸阳职工门诊起付线为 260 元/年
      annualCap: 1500,       // 咸阳在职职工门诊封顶线为 1500 元/年
      annualCapRetiree: 1700,// 咸阳退休职工门诊封顶线为 1700 元/年
      tierBenefits: {
        community: { tierName: '基层社区服务中心/卫生院', deductible: 260, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier1: { tierName: '一级医疗机构', deductible: 260, reimbursementRatio: 0.70, retireeRatioBonus: 0.05 },
        tier2: { tierName: '二级医疗机构', deductible: 260, reimbursementRatio: 0.60, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级医疗机构', deductible: 260, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三级甲等综合医院', deductible: 260, reimbursementRatio: 0.50, retireeRatioBonus: 0.05 }
      },
      note: '自然年度内门诊累计满 260 元起付线后启动报销，在职每年最高限额 1500 元，退休人员限额 1700 元。'
    },
    inpatient: {
      sourceDocId: 'xy-resident-inpatient-regulations',
      annualCap: 350000,
      tierBenefits: {
        community: { tierName: '基层社区/乡镇卫生院', deductible: 160, reimbursementRatio: 0.90, retireeRatioBonus: 0.04 },
        tier1: { tierName: '一级医疗机构', deductible: 160, reimbursementRatio: 0.90, retireeRatioBonus: 0.04 },
        tier2: { tierName: '二级医疗机构', deductible: 550, reimbursementRatio: 0.85, retireeRatioBonus: 0.05 },
        tier3: { tierName: '三级医疗机构', deductible: 1200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 },
        tier3_top: { tierName: '三甲重点医院', deductible: 1200, reimbursementRatio: 0.80, retireeRatioBonus: 0.05 }
      }
    },
    catastrophic: {
      sourceDocId: 'xy-medical-adjust-2024-48',
      name: '城镇职工大额医疗互助',
      deductible: 0,
      tiers: [{ minAmount: 350000, ratio: 0.88 }]
    },
    remoteMedical: {
      sourceDocId: 'xy-medical-adjust-2024-48',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序', '咸阳医保网厅'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.80,
      specialNotes: [
        '西咸一体化就医协同推进中，部分定点可直接刷卡结算。',
        '转诊至省内异地三级医疗机构就医，备案后按规定享受统筹待遇。'
      ]
    }
  },

  // 城乡居民医保待遇 (咸阳标准)
  resident: {
    outpatient: {
      sourceDocId: 'xy-resident-official-guide',
      annualDeductible: 0,
      annualCap: 120, // 咸阳居民普通门诊统筹年报销封顶线为 120 元/人
      tierBenefits: {
        community: { tierName: '村卫生室/社区卫生站', deductible: 0, reimbursementRatio: 0.70 },
        tier1: { tierName: '乡镇卫生院/社区卫生服务中心', deductible: 0, reimbursementRatio: 0.60 },
        tier2: { tierName: '二级定点医院（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3: { tierName: '三级定点医院（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 },
        tier3_top: { tierName: '三甲综合医院（普通门诊未覆盖）', deductible: 0, reimbursementRatio: 0.00 }
      },
      note: '咸阳城乡居民普通门诊统筹限定在基层医疗机构（乡镇卫生院/社区中心报销60%、村室报销70%），年报销封顶120元/人（每诊次乡镇/一级40元、村室30元）。二级及以上医院普通门诊不予报销（慢特病与两病用药除外）。'
    },
    inpatient: {
      sourceDocId: 'xy-resident-inpatient-regulations',
      annualCap: 200000,
      tierBenefits: {
        community: { tierName: '一级医疗机构/镇卫生院(社区卫生中心)', deductible: 160, reimbursementRatio: 0.90 },
        tier1: { tierName: '一级医疗机构/卫生院', deductible: 160, reimbursementRatio: 0.90 },
        tier2: { tierName: '二级医疗机构', deductible: 550, reimbursementRatio: 0.75 },
        tier3: { tierName: '三级医疗机构', deductible: 1500, reimbursementRatio: 0.60 },
        tier3_top: { tierName: '三特医疗机构(西京/唐都/交大等)', deductible: 3000, reimbursementRatio: 0.50 }
      }
    },
    catastrophic: {
      sourceDocId: 'xy-medical-adjust-2024-48',
      name: '城乡居民大病保险',
      deductible: 15000, // 咸阳市居民大病保险起付线：一般群众1.5万元，特困低保0.75万元
      annualCap: 300000, // 一般群众封顶线 30 万元，特困/低保/返贫致贫人口无封顶
      tiers: [
        { minAmount: 15000, maxAmount: 50000, ratio: 0.60 },
        { minAmount: 50000, maxAmount: 100000, ratio: 0.65 },
        { minAmount: 100000, ratio: 0.70 }
      ]
    },
    remoteMedical: {
      sourceDocId: 'xy-medical-adjust-2024-48',
      filingChannels: ['国家医保服务平台APP', '陕西医保微信小程序'],
      longTermFiledRatio: 1.0,
      transferFiledRatio: 0.90,
      unfiledEmergencyRatio: 0.90,
      unfiledNormalRatio: 0.70,
      specialNotes: [
        '省内异地/跨省异地长期居住：一级起付160/90%，二级起付1500/70%，三级起付3000/50%。',
        '跨省异地转诊和急救人员：一级起付160/80%，二级起付1500/70%，三级起付3000/50%。',
        '跨省其他临时外出及未办理备案人员：一级起付160/70%，二级起付1500/60%，三级起付3000/40%。',
        '经市内二、三级医疗机构因病情需要规范转诊到省内异地三级或三特医疗机构就医，城乡居民住院报销比例提高5个百分点为55%。'
      ]
    }
  }
};
