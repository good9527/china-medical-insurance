import * as fs from 'fs';
import * as path from 'path';

// 检查并修复所有四川、甘肃、山东东营、广东江门、陕西杨凌文件的语法
const fileList = [
  'src/data/sichuan/mianyang.ts',
  'src/data/sichuan/deyang.ts',
  'src/data/sichuan/yibin.ts',
  'src/data/sichuan/zigong.ts',
  'src/data/sichuan/panzhihua.ts',
  'src/data/sichuan/luzhou.ts',
  'src/data/sichuan/guangyuan.ts',
  'src/data/sichuan/suining.ts',
  'src/data/sichuan/neijiang.ts',
  'src/data/sichuan/leshan.ts',
  'src/data/sichuan/nanchong.ts',
  'src/data/sichuan/meishan.ts',
  'src/data/sichuan/guangan.ts',
  'src/data/sichuan/dazhou.ts',
  'src/data/sichuan/yaan.ts',
  'src/data/sichuan/bazhong.ts',
  'src/data/sichuan/ziyang.ts',
  'src/data/sichuan/aba.ts',
  'src/data/sichuan/garze.ts',
  'src/data/sichuan/liangshan.ts',
  'src/data/gansu/jiayuguan.ts',
  'src/data/gansu/jinchang.ts',
  'src/data/gansu/zhangye.ts',
  'src/data/gansu/lanzhou_new_area.ts',
  'src/data/shandong/dongying.ts',
  'src/data/guangdong/jiangmen.ts',
  'src/data/shaanxi/yangling.ts'
];

const root = path.resolve(__dirname, '../../');

for (const rel of fileList) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) continue;
  let text = fs.readFileSync(p, 'utf-8');

  // 清理多余的 tier1~tier3_top 重复块
  // 形如：
  //       },
  //         tier1: { tierName: ... },
  //         ...
  //       },
  const dupRegex = /\},\s*tier1:\s*\{[^}]*?\}\s*,\s*tier2:\s*\{[^}]*?\}\s*,\s*tier3:\s*\{[^}]*?\}\s*,\s*tier3_top:\s*\{[^}]*?\}\s*\},/g;
  if (dupRegex.test(text)) {
    text = text.replace(dupRegex, '},');
    fs.writeFileSync(p, text, 'utf-8');
    console.log(`Cleaned duplicates in: ${rel}`);
  }
}

console.log('Duplicate check done.');
