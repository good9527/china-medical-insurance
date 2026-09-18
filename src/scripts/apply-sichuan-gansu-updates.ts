import * as fs from 'fs';
import * as path from 'path';

interface CityTargetUpdate {
  filePath: string;
  residentInpatient: {
    annualCap?: number;
    community?: { deductible: number; reimbursementRatio: number; tierName?: string };
    tier1?: { deductible: number; reimbursementRatio: number; tierName?: string };
    tier2: { deductible: number; reimbursementRatio: number; tierName?: string };
    tier3: { deductible: number; reimbursementRatio: number; tierName?: string };
    tier3_top?: { deductible: number; reimbursementRatio: number; tierName?: string };
  };
  // 恢复可能被误伤的 resident outpatient
  restoreResidentOutpatient?: {
    cap: number;
    commRatio: number;
    tier1Ratio: number;
    tier2Ratio?: number;
    tier3Ratio?: number;
  };
}

const updates: CityTargetUpdate[] = [
  // 四川省
  {
    filePath: 'src/data/sichuan/mianyang.ts',
    residentInpatient: {
      annualCap: 300000,
      community: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级医疗机构/卫生院' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.65, tierName: '市级三甲综合医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/deyang.ts',
    residentInpatient: {
      annualCap: 280000,
      community: { deductible: 150, reimbursementRatio: 0.90, tierName: '基层及一级机构' },
      tier1: { deductible: 150, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.70, tierName: '重点三甲医疗机构' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/yibin.ts',
    residentInpatient: {
      annualCap: 150000,
      community: { deductible: 150, reimbursementRatio: 0.85, tierName: '基层定点医疗机构' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.65, tierName: '重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/zigong.ts',
    residentInpatient: {
      annualCap: 130000,
      community: { deductible: 120, reimbursementRatio: 0.88, tierName: '乡镇卫生院/社区服务中心' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 700, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 700, reimbursementRatio: 0.65, tierName: '三级甲等综合医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/panzhihua.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 100, reimbursementRatio: 0.95, tierName: '基层及乡镇卫生院' },
      tier1: { deductible: 100, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 200, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 400, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 400, reimbursementRatio: 0.70, tierName: '重点三甲医疗机构' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/luzhou.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 100, reimbursementRatio: 0.90, tierName: '一级及基层医疗机构' },
      tier1: { deductible: 200, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 400, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 800, reimbursementRatio: 0.60, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 800, reimbursementRatio: 0.60, tierName: '重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/guangyuan.ts',
    residentInpatient: {
      annualCap: 200000,
      community: { deductible: 200, reimbursementRatio: 0.90, tierName: '基层及乡镇卫生院' },
      tier1: { deductible: 200, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 400, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 1000, reimbursementRatio: 0.60, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 1000, reimbursementRatio: 0.60, tierName: '重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/suining.ts',
    residentInpatient: {
      annualCap: 220000,
      community: { deductible: 300, reimbursementRatio: 0.90, tierName: '基层社区及乡镇卫生院' },
      tier1: { deductible: 400, reimbursementRatio: 0.80, tierName: '一级及无等级定点医院' },
      tier2: { deductible: 500, reimbursementRatio: 0.70, tierName: '二级定点医疗机构' },
      tier3: { deductible: 700, reimbursementRatio: 0.60, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 800, reimbursementRatio: 0.55, tierName: '三级甲等医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/neijiang.ts',
    residentInpatient: {
      annualCap: 200000,
      community: { deductible: 150, reimbursementRatio: 0.90, tierName: '乡镇卫生院及社区中心' },
      tier1: { deductible: 200, reimbursementRatio: 0.85, tierName: '一级及以下医疗机构' },
      tier2: { deductible: 400, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 700, reimbursementRatio: 0.65, tierName: '三级乙等医疗机构' },
      tier3_top: { deductible: 1000, reimbursementRatio: 0.55, tierName: '三级甲等综合医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/leshan.ts',
    residentInpatient: {
      annualCap: 220000,
      community: { deductible: 100, reimbursementRatio: 0.90, tierName: '社区/乡镇卫生院' },
      tier1: { deductible: 200, reimbursementRatio: 0.82, tierName: '一级定点医疗机构' },
      tier2: { deductible: 550, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 850, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 850, reimbursementRatio: 0.70, tierName: '重点三甲医疗机构' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/nanchong.ts',
    residentInpatient: {
      annualCap: 200000,
      community: { deductible: 200, reimbursementRatio: 0.80, tierName: '一级及以下基层机构' },
      tier1: { deductible: 200, reimbursementRatio: 0.80, tierName: '一级定点医疗机构' },
      tier2: { deductible: 450, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 600, reimbursementRatio: 0.70, tierName: '三级乙等医疗机构' },
      tier3_top: { deductible: 800, reimbursementRatio: 0.60, tierName: '三级甲等定点医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/meishan.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 150, reimbursementRatio: 0.85, tierName: '基层医疗机构' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.65, tierName: '重点三甲医疗机构' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/guangan.ts',
    residentInpatient: {
      annualCap: 220000,
      community: { deductible: 200, reimbursementRatio: 0.85, tierName: '无等级及一级医疗机构' },
      tier1: { deductible: 200, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 550, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 550, reimbursementRatio: 0.70, tierName: '重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/dazhou.ts',
    residentInpatient: {
      annualCap: 180000,
      community: { deductible: 100, reimbursementRatio: 0.90, tierName: '乡镇卫生院及社区中心' },
      tier1: { deductible: 400, reimbursementRatio: 0.75, tierName: '一级及其他定点机构' },
      tier2: { deductible: 400, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 600, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 600, reimbursementRatio: 0.70, tierName: '市级重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/yaan.ts',
    residentInpatient: {
      annualCap: 200000,
      community: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级基层定点医疗机构' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.65, tierName: '重点三甲医疗机构' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/bazhong.ts',
    residentInpatient: {
      annualCap: 200000,
      community: { deductible: 150, reimbursementRatio: 0.85, tierName: '基层及一级定点医疗机构' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.65, tierName: '市级重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/ziyang.ts',
    residentInpatient: {
      annualCap: 220000,
      community: { deductible: 150, reimbursementRatio: 0.85, tierName: '基层乡镇卫生院及社区' },
      tier1: { deductible: 150, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 350, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 650, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 650, reimbursementRatio: 0.65, tierName: '市属三甲综合医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/aba.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 80, reimbursementRatio: 0.90, tierName: '州内乡镇卫生院/社区' },
      tier1: { deductible: 100, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 250, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 500, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 500, reimbursementRatio: 0.70, tierName: '州级重点医疗机构' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/garze.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 80, reimbursementRatio: 0.90, tierName: '乡镇卫生院及基层机构' },
      tier1: { deductible: 100, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 250, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 500, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 500, reimbursementRatio: 0.70, tierName: '州属定点三级医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },
  {
    filePath: 'src/data/sichuan/liangshan.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 80, reimbursementRatio: 0.90, tierName: '州内乡镇及社区机构' },
      tier1: { deductible: 100, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 250, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 500, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 500, reimbursementRatio: 0.70, tierName: '州属三甲综合医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  },

  // 甘肃省
  {
    filePath: 'src/data/gansu/jiayuguan.ts',
    residentInpatient: {
      annualCap: 150000,
      community: { deductible: 100, reimbursementRatio: 0.88, tierName: '社区服务中心/卫生院' },
      tier1: { deductible: 100, reimbursementRatio: 0.88, tierName: '一级定点医疗机构' },
      tier2: { deductible: 400, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 500, reimbursementRatio: 0.72, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 500, reimbursementRatio: 0.72, tierName: '三级甲等综合医院' }
    },
    restoreResidentOutpatient: { cap: 160, commRatio: 0.65, tier1Ratio: 0.65 }
  },
  {
    filePath: 'src/data/gansu/jinchang.ts',
    residentInpatient: {
      annualCap: 160000,
      community: { deductible: 100, reimbursementRatio: 0.90, tierName: '乡镇卫生院/社区中心' },
      tier1: { deductible: 200, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 450, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 800, reimbursementRatio: 0.75, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 800, reimbursementRatio: 0.75, tierName: '三级甲等综合医院' }
    },
    restoreResidentOutpatient: { cap: 160, commRatio: 0.65, tier1Ratio: 0.65 }
  },
  {
    filePath: 'src/data/gansu/zhangye.ts',
    residentInpatient: {
      annualCap: 160000,
      community: { deductible: 200, reimbursementRatio: 0.90, tierName: '乡镇卫生院/社区中心' },
      tier1: { deductible: 300, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 800, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 1500, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 1500, reimbursementRatio: 0.70, tierName: '三级甲等综合医院' }
    },
    restoreResidentOutpatient: { cap: 160, commRatio: 0.65, tier1Ratio: 0.65 }
  },
  {
    filePath: 'src/data/gansu/lanzhou_new_area.ts',
    residentInpatient: {
      annualCap: 160000,
      community: { deductible: 100, reimbursementRatio: 0.90, tierName: '社区服务中心/卫生院' },
      tier1: { deductible: 200, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 400, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 800, reimbursementRatio: 0.70, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 800, reimbursementRatio: 0.70, tierName: '三级甲等综合医院' }
    },
    restoreResidentOutpatient: { cap: 150, commRatio: 0.65, tier1Ratio: 0.65 }
  },

  // 山东省东营市
  {
    filePath: 'src/data/shandong/dongying.ts',
    residentInpatient: {
      annualCap: 250000,
      community: { deductible: 100, reimbursementRatio: 0.85, tierName: '基层及一级医疗机构' },
      tier1: { deductible: 100, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 300, reimbursementRatio: 0.75, tierName: '二级定点医疗机构' },
      tier3: { deductible: 700, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 700, reimbursementRatio: 0.65, tierName: '市级重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 450, commRatio: 0.60, tier1Ratio: 0.00 }
  },

  // 广东省江门市
  {
    filePath: 'src/data/guangdong/jiangmen.ts',
    residentInpatient: {
      annualCap: 540000,
      community: { deductible: 500, reimbursementRatio: 0.85, tierName: '一级及以下医疗机构' },
      tier1: { deductible: 500, reimbursementRatio: 0.85, tierName: '一级定点医疗机构' },
      tier2: { deductible: 600, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 900, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 900, reimbursementRatio: 0.65, tierName: '市级三甲综合医院' }
    },
    restoreResidentOutpatient: { cap: 1200, commRatio: 0.65, tier1Ratio: 0.65, tier2Ratio: 0.50, tier3Ratio: 0.40 }
  },

  // 陕西省杨凌示范区
  {
    filePath: 'src/data/shaanxi/yangling.ts',
    residentInpatient: {
      annualCap: 200000,
      community: { deductible: 160, reimbursementRatio: 0.90, tierName: '基层医疗机构及卫生院' },
      tier1: { deductible: 160, reimbursementRatio: 0.90, tierName: '一级定点医疗机构' },
      tier2: { deductible: 550, reimbursementRatio: 0.80, tierName: '二级定点医疗机构' },
      tier3: { deductible: 1000, reimbursementRatio: 0.65, tierName: '三级定点医疗机构' },
      tier3_top: { deductible: 1000, reimbursementRatio: 0.65, tierName: '市级重点三甲医院' }
    },
    restoreResidentOutpatient: { cap: 200, commRatio: 0.60, tier1Ratio: 0.60 }
  }
];

function updateCityCleanly(content: string, item: CityTargetUpdate): string {
  // 1. 恢复/重构 resident.outpatient
  if (item.restoreResidentOutpatient) {
    const ro = item.restoreResidentOutpatient;
    const t2 = (ro.tier2Ratio !== undefined ? ro.tier2Ratio : 0.00).toFixed(2);
    const t3 = (ro.tier3Ratio !== undefined ? ro.tier3Ratio : 0.00).toFixed(2);
    
    // 替换 outpatient 内部的 tierBenefits
    const outpatientMatch = content.match(/(resident:\s*\{[\s\S]*?outpatient:\s*\{[\s\S]*?tierBenefits:\s*\{)([\s\S]*?)(\},\s*note:)/);
    if (outpatientMatch) {
      const cleanOutpatientBenefits = `
        community: { tierName: '基层社区及定点门诊', deductible: 0, reimbursementRatio: ${ro.commRatio.toFixed(2)} },
        tier1: { tierName: '一级定点医疗机构', deductible: 0, reimbursementRatio: ${ro.tier1Ratio.toFixed(2)} },
        tier2: { tierName: '二级医疗机构', deductible: 0, reimbursementRatio: ${t2} },
        tier3: { tierName: '三级医疗机构', deductible: 0, reimbursementRatio: ${t3} },
        tier3_top: { tierName: '市级三甲医院', deductible: 0, reimbursementRatio: ${t3} }
      `;
      content = content.replace(outpatientMatch[0], `${outpatientMatch[1]}${cleanOutpatientBenefits}${outpatientMatch[3]}`);
    }
  }

  // 2. 精确替换 resident.inpatient
  const ri = item.residentInpatient;
  const inpatientMatch = content.match(/(resident:\s*\{[\s\S]*?inpatient:\s*\{)([\s\S]*?)(\},\s*catastrophic:)/);
  if (inpatientMatch) {
    let inpart = inpatientMatch[2];

    // 更新 annualCap
    if (ri.annualCap) {
      inpart = inpart.replace(/(annualCap:\s*)\d+/, `$1${ri.annualCap}`);
    }

    // 重新格式化 inpatient tierBenefits
    const inTierMatch = inpart.match(/(tierBenefits:\s*\{)([\s\S]*?)(\})/);
    if (inTierMatch) {
      const cleanInpatientBenefits = `
        community: { tierName: '${ri.community?.tierName || '基层及一级机构'}', deductible: ${ri.community?.deductible || 100}, reimbursementRatio: ${(ri.community?.reimbursementRatio || 0.90).toFixed(2)} },
        tier1: { tierName: '${ri.tier1?.tierName || '一级定点医疗机构'}', deductible: ${ri.tier1?.deductible || 150}, reimbursementRatio: ${(ri.tier1?.reimbursementRatio || 0.85).toFixed(2)} },
        tier2: { tierName: '${ri.tier2.tierName || '二级定点医疗机构'}', deductible: ${ri.tier2.deductible}, reimbursementRatio: ${ri.tier2.reimbursementRatio.toFixed(2)} },
        tier3: { tierName: '${ri.tier3.tierName || '三级定点医疗机构'}', deductible: ${ri.tier3.deductible}, reimbursementRatio: ${ri.tier3.reimbursementRatio.toFixed(2)} },
        tier3_top: { tierName: '${ri.tier3_top?.tierName || '重点三甲医疗机构'}', deductible: ${ri.tier3_top?.deductible || ri.tier3.deductible}, reimbursementRatio: ${(ri.tier3_top?.reimbursementRatio || ri.tier3.reimbursementRatio).toFixed(2)} }
      `;
      inpart = inpart.replace(inTierMatch[0], `${inTierMatch[1]}${cleanInpatientBenefits}${inTierMatch[3]}`);
    }

    content = content.replace(inpatientMatch[0], `${inpatientMatch[1]}${inpart}${inpatientMatch[3]}`);
  }

  return content;
}

function run() {
  const root = path.resolve(__dirname, '../../');
  let count = 0;
  for (const item of updates) {
    const fullPath = path.join(root, item.filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn('Missing file:', fullPath);
      continue;
    }
    const oldContent = fs.readFileSync(fullPath, 'utf-8');
    const newContent = updateCityCleanly(oldContent, item);
    fs.writeFileSync(fullPath, newContent, 'utf-8');
    count++;
    console.log(`Cleanly updated [${count}]: ${item.filePath}`);
  }
  console.log(`\n🎉 Successfully restored outpatient and updated inpatient for ${count} cities!`);
}

run();
