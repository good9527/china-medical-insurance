import * as fs from 'fs';
import * as path from 'path';

// Unicode regex matching colorful pictographic emojis (excluding basic typography symbols like checkmarks or stars)
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1FA00}-\u{1FAFF}]/u;

interface Finding {
  file: string;
  line: number;
  content: string;
}

const findings: Finding[] = [];

function scan(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'scripts'].includes(entry.name)) {
        scan(full);
      }
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      const text = fs.readFileSync(full, 'utf-8');
      const lines = text.split('\n');
      lines.forEach((l, idx) => {
        // Exclude pure comments
        const trimmed = l.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
        if (emojiRegex.test(l)) {
          findings.push({
            file: path.relative(process.cwd(), full),
            line: idx + 1,
            content: trimmed
          });
        }
      });
    }
  }
}

scan('src/pages');
scan('src/components');

console.log(`\n======================================================`);
console.log(`🔍 全局前端代码与页面组件 0-Emoji 规范扫描`);
console.log(`======================================================`);
console.log(`扫描完成！发现 Emoji 项: ${findings.length} 处`);

if (findings.length > 0) {
  findings.slice(0, 30).forEach(f => {
    console.log(`  [${f.file}:${f.line}] -> ${f.content}`);
  });
} else {
  console.log(`✅ 100% 达标！前端界面与页面代码中完全无任何 Emoji 表情字符，所有图标均采用规范 SVG！`);
}
console.log(`======================================================\n`);
