import fs from 'fs';
import path from 'path';

interface CityCorrection {
  filePath: string;
  cityName: string;
  r1Deductible?: number;
  r1Ratio?: number;
  r2Deductible?: number;
  r2Ratio: number;
  r3Deductible?: number;
  r3Ratio: number;
  annualCap?: number;
}

const corrections: CityCorrection[] = [
  // 广东地市
  {
    filePath: 'src/data/guangdong/zhanjiang.ts',
    cityName: '湛江市',
    r1Deductible: 100,
    r1Ratio: 0.85,
    r2Deductible: 300,
    r2Ratio: 0.75,
    r3Deductible: 500,
    r3Ratio: 0.65,
    annualCap: 200000
  },
  {
    filePath: 'src/data/guangdong/shaoguan.ts',
    cityName: '韶关市',
    r1Deductible: 300,
    r1Ratio: 0.90,
    r2Deductible: 600,
    r2Ratio: 0.80,
    r3Deductible: 1000,
    r3Ratio: 0.70,
    annualCap: 250000
  },
  {
    filePath: 'src/data/guangdong/meizhou.ts',
    cityName: '梅州市',
    r1Deductible: 200,
    r1Ratio: 0.90,
    r2Deductible: 450,
    r2Ratio: 0.80,
    r3Deductible: 800,
    r3Ratio: 0.65
  },
  {
    filePath: 'src/data/guangdong/qingyuan.ts',
    cityName: '清远市',
    r1Deductible: 300,
    r1Ratio: 0.90,
    r2Deductible: 800,
    r2Ratio: 0.75,
    r3Deductible: 1200,
    r3Ratio: 0.65
  },
  {
    filePath: 'src/data/guangdong/heyuan.ts',
    cityName: '河源市',
    r1Deductible: 300,
    r1Ratio: 0.92,
    r2Deductible: 500,
    r2Ratio: 0.75,
    r3Deductible: 700,
    r3Ratio: 0.65
  },
  {
    filePath: 'src/data/guangdong/shanwei.ts',
    cityName: '汕尾市',
    r1Deductible: 300,
    r1Ratio: 0.85,
    r2Deductible: 600,
    r2Ratio: 0.80,
    r3Deductible: 800,
    r3Ratio: 0.75,
    annualCap: 654000
  },
  {
    filePath: 'src/data/guangdong/chaozhou.ts',
    cityName: '潮州市',
    r1Deductible: 300,
    r1Ratio: 0.90,
    r2Deductible: 500,
    r2Ratio: 0.85,
    r3Deductible: 700,
    r3Ratio: 0.70,
    annualCap: 300000
  },
  {
    filePath: 'src/data/guangdong/jieyang.ts',
    cityName: '揭阳市',
    r1Deductible: 300,
    r1Ratio: 0.90,
    r2Deductible: 500,
    r2Ratio: 0.80,
    r3Deductible: 700,
    r3Ratio: 0.70
  },
  {
    filePath: 'src/data/guangdong/yunfu.ts',
    cityName: '云浮市',
    r1Deductible: 300,
    r1Ratio: 0.90,
    r2Deductible: 600,
    r2Ratio: 0.75,
    r3Deductible: 900,
    r3Ratio: 0.75
  },
  {
    filePath: 'src/data/guangdong/zhaoqing.ts',
    cityName: '肇庆市',
    r1Deductible: 400,
    r1Ratio: 0.90,
    r2Deductible: 800,
    r2Ratio: 0.80,
    r3Deductible: 1200,
    r3Ratio: 0.70,
    annualCap: 220000
  },
  // 山东地市
  {
    filePath: 'src/data/shandong/dezhou.ts',
    cityName: '德州市',
    r1Deductible: 200,
    r1Ratio: 0.90,
    r2Deductible: 500,
    r2Ratio: 0.72,
    r3Deductible: 900,
    r3Ratio: 0.60
  },
  {
    filePath: 'src/data/shandong/liaocheng.ts',
    cityName: '聊城市',
    r1Deductible: 200,
    r1Ratio: 0.80,
    r2Deductible: 500,
    r2Ratio: 0.75,
    r3Deductible: 900,
    r3Ratio: 0.60,
    annualCap: 150000
  },
  {
    filePath: 'src/data/shandong/binzhou.ts',
    cityName: '滨州市',
    r1Deductible: 200,
    r1Ratio: 0.90,
    r2Deductible: 500,
    r2Ratio: 0.75,
    r3Deductible: 1000,
    r3Ratio: 0.50,
    annualCap: 200000
  },
  {
    filePath: 'src/data/shandong/heze.ts',
    cityName: '菏泽市',
    r1Deductible: 200,
    r1Ratio: 0.85,
    r2Deductible: 700,
    r2Ratio: 0.75,
    r3Deductible: 1000,
    r3Ratio: 0.60,
    annualCap: 150000
  },
  {
    filePath: 'src/data/shandong/rizhao.ts',
    cityName: '日照市',
    r1Deductible: 100,
    r1Ratio: 0.80,
    r2Deductible: 300,
    r2Ratio: 0.70,
    r3Deductible: 500,
    r3Ratio: 0.55
  }
];

for (const c of corrections) {
  const fullPath = path.resolve(c.filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${c.filePath}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');

  // 更新居民住院二级比例和起付线
  if (c.r2Ratio !== undefined) {
    content = content.replace(
      /(tier2:\s*\{\s*tierName:\s*['"][^'"]+['"],\s*deductible:\s*)(\d+)(,\s*reimbursementRatio:\s*)[\d.]+(\s*\})/g,
      (match, p1, oldDed, p3, p4) => {
        const newDed = c.r2Deductible !== undefined ? c.r2Deductible : oldDed;
        return `${p1}${newDed}${p3}${c.r2Ratio.toFixed(2)}${p4}`;
      }
    );
  }

  // 更新居民住院三级比例和起付线
  if (c.r3Ratio !== undefined) {
    content = content.replace(
      /(tier3:\s*\{\s*tierName:\s*['"][^'"]+['"],\s*deductible:\s*)(\d+)(,\s*reimbursementRatio:\s*)[\d.]+(\s*\})/g,
      (match, p1, oldDed, p3, p4) => {
        const newDed = c.r3Deductible !== undefined ? c.r3Deductible : oldDed;
        return `${p1}${newDed}${p3}${c.r3Ratio.toFixed(2)}${p4}`;
      }
    );
    content = content.replace(
      /(tier3_top:\s*\{\s*tierName:\s*['"][^'"]+['"],\s*deductible:\s*)(\d+)(,\s*reimbursementRatio:\s*)[\d.]+(\s*\})/g,
      (match, p1, oldDed, p3, p4) => {
        const newDed = c.r3Deductible !== undefined ? c.r3Deductible : oldDed;
        return `${p1}${newDed}${p3}${c.r3Ratio.toFixed(2)}${p4}`;
      }
    );
  }

  // 更新一级起付和比例
  if (c.r1Ratio !== undefined) {
    content = content.replace(
      /(tier1:\s*\{\s*tierName:\s*['"][^'"]+['"],\s*deductible:\s*)(\d+)(,\s*reimbursementRatio:\s*)[\d.]+(\s*\})/g,
      (match, p1, oldDed, p3, p4) => {
        const newDed = c.r1Deductible !== undefined ? c.r1Deductible : oldDed;
        return `${p1}${newDed}${p3}${c.r1Ratio.toFixed(2)}${p4}`;
      }
    );
  }

  // 更新年封顶
  if (c.annualCap !== undefined) {
    content = content.replace(
      /(resident:\s*\{[\s\S]*?inpatient:\s*\{[\s\S]*?annualCap:\s*)\d+/g,
      `$1${c.annualCap}`
    );
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✓ 成功更新 [${c.cityName}] 真实报销待遇参数`);
}
