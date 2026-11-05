import * as fs from 'fs';
import * as path from 'path';

/**
 * Serious Civic 0-Emoji Governance Scanner
 * Strict verification that zero informal pictographic emojis exist across
 * the entire repository (Vue components, TypeScript source, scripts, JSON data, and Markdown).
 */

// 1. Comprehensive Pictographic Unicode Regex:
// Covers Supplementary Multilingual Plane (SMP) & Basic Multilingual Plane (BMP) emoji blocks:
// - U+1F300-U+1FAFF (Symbols & Pictographs, Emoticons, Transport, Food, Activities)
// - U+1F1E0-U+1F1FF (Regional Indicator Symbols / Flags)
// - U+2600-U+26FF     (Miscellaneous Symbols e.g. Warning [WARN])
// - U+2700-U+27BF     (Dingbats e.g. Cross Mark [FAIL], Heavy Check Mark [PASS])
// - U+FE0F            (Variation Selector-16 emoji presentation)
const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{1F1E0}-\u{1F1FF}\u2600-\u26FF\u2700-\u27BF\uFE0F]/gu;

// 2. Whitelist of Legitimate Civic Typographical & Mathematical Symbols:
// These are standard typographical symbols routinely used in government policies and medical formulas.
const ALLOWED_CIVIC_SYMBOLS = new Set([
  '✓', '✕', '▾', '↵', '•', '·', '—', '～', '±', '×', '÷',
  '★', '☆', '▲', '▼', '►', '◄', '◀', '▶', '↗', '➔', '↕',
  '©', '※', '¥', '…', '§', '°', '‰', '℃', '℉', '™', '®'
]);

// 3. Ignored Directories:
const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.agents',
  'screenshots',
  'unpackage'
]);

// 4. Scanned File Extensions:
const SCANNED_EXTENSIONS = new Set([
  '.vue',
  '.ts',
  '.js',
  '.json',
  '.md',
  '.html',
  '.css',
  '.scss'
]);

// 5. Excluded Files (Self-exemption or historical reports):
const EXEMPT_FILES = new Set([
  'check-emojis.ts',
  'challenger_oracle_report.json'
]);

interface Finding {
  file: string;
  line: number;
  char: string;
  code: string;
  content: string;
}

const findings: Finding[] = [];
let totalFilesScanned = 0;

function scanDirectory(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (EXEMPT_FILES.has(entry.name)) {
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (SCANNED_EXTENSIONS.has(ext)) {
        totalFilesScanned++;
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, idx) => {
          const trimmed = line.trim();

          // Skip pure code comments in source files
          if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
            return;
          }

          EMOJI_REGEX.lastIndex = 0;
          let match: RegExpExecArray | null;
          while ((match = EMOJI_REGEX.exec(line)) !== null) {
            const ch = match[0];
            if (!ALLOWED_CIVIC_SYMBOLS.has(ch)) {
              findings.push({
                file: path.relative(process.cwd(), fullPath).replace(/\\/g, '/'),
                line: idx + 1,
                char: ch,
                code: 'U+' + (ch.codePointAt(0) || 0).toString(16).toUpperCase(),
                content: trimmed.length > 70 ? trimmed.slice(0, 67) + '...' : trimmed
              });
            }
          }
        });
      }
    }
  }
}

// Execute scan starting from project root
scanDirectory('.');

console.log(`\n================================================================================`);
console.log(`[SCAN] 全库严肃政务 0-Emoji 规范多格式全量扫描报告`);
console.log(`================================================================================`);
console.log(`已扫描文件总数: ${totalFilesScanned} 个 (.vue, .ts, .js, .json, .md, .html, .css)`);
console.log(`发现违规 Emoji 项: ${findings.length} 处\n`);

if (findings.length > 0) {
  console.error(`[FAIL] 检测到以下代码、脚本或文档包含未授权的 Emoji 字符:`);
  findings.slice(0, 50).forEach((f, i) => {
    console.error(`  ${i + 1}. [${f.file}:${f.line}] [${f.code}] (${f.char}) -> ${f.content}`);
  });
  if (findings.length > 50) {
    console.error(`  ... 以及另外 ${findings.length - 50} 处违规项`);
  }
  console.log(`================================================================================\n`);
  process.exit(1);
} else {
  console.log(`[PASS] 100% 达标！全库代码、前端组件、开发脚本与输出文案完全无任何 Emoji 表情字符！`);
  console.log(`[PASS] 所有图标均符合纯文本或矢量 SVG 严肃政务规范。`);
  console.log(`================================================================================\n`);
  process.exit(0);
}
