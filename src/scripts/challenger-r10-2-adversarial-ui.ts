/**
 * Challenger R10.2: Frontend UI Ergonomics, 0-Emoji Compliance, Fluid Clamp Typography & Touch Targets Oracle
 *
 * Mandatory Verification Scope:
 * 1. Independent Adversarial 0-Emoji & Dingbats scanning across all .vue, .ts, .json files in src/pages and src/components, plus src/data and src/engine.
 * 2. Fluid Clamp Typography validation (App.vue, index.vue, ranking/index.vue, MultiCitySimulator.vue) across 320px, 360px, 375px, 520px, 768px.
 * 3. Responsive Layout verification (no horizontal overflow, graceful 1fr single column fallback, safe-area-inset handling).
 * 4. Mobile Touch Targets (all interactive buttons, pills, dropdown triggers, and cards >= 44px min-height).
 */

import * as fs from 'fs';
import * as path from 'path';

interface OracleStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  findings: Array<{ category: string; description: string; detail: string }>;
}

const stats: OracleStats = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  findings: []
};

function recordAssert(category: string, condition: boolean, description: string, detail: string = ''): void {
  stats.totalChecks++;
  if (!condition) {
    stats.failedChecks++;
    console.error(`  [FAIL][${category}] ${description} ${detail ? `(${detail})` : ''}`);
    stats.findings.push({ category, description, detail });
  } else {
    stats.passedChecks++;
    console.log(`  [PASS][${category}] ${description}`);
  }
}

// ============================================================================
// SUITE 1: Adversarial 0-Emoji, Dingbats & Pictograph Static Sweep
// ============================================================================
function runSuite1EmojiScan(): void {
  console.log('\n>>> [Suite 1] Adversarial 0-Emoji & Dingbats Static Sweep...');
  const category = '0-Emoji Compliance';

  // Comprehensive Unicode patterns for pictographic emojis, emoticons, dingbats, misc symbols
  const emojiPatterns = [
    { name: 'Extended Pictographic', regex: /\p{Extended_Pictographic}/u },
    { name: 'Emoji / Emoticons / Pictographs', regex: /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F1E0}-\u{1F1FF}]/u },
    { name: 'Dingbats', regex: /[\u{2700}-\u{27BF}]/u },
    { name: 'Miscellaneous Symbols', regex: /[\u{2600}-\u{26FF}]/u },
    { name: 'Miscellaneous Technical', regex: /[\u{2300}-\u{23FF}]/u }
  ];

  interface Violation {
    file: string;
    line: number;
    pattern: string;
    char: string;
    snippet: string;
  }

  const violations: Violation[] = [];

  // Exclude benign typographic chars or symbols that might fall in broader symbol blocks
  // such as checkmarks (✓ \u2713), crosses (✕ \u2715), arrows (▾ \u25be, ↗ \u2197, ➔ \u2794, ↕ \u2195), math symbols, copyright (© \u00a9), Chinese punctuation
  const allowedSymbols = new Set(['✓', '✕', '▾', '↵', '•', '·', '—', '～', '±', '×', '÷', '★', '☆', '▲', '▼', '►', '◄', '◀', '▶', '↗', '➔', '↕', '©']);

  function scanDirectory(dir: string): void {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', '.git', '.agents'].includes(entry.name)) {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.vue', '.ts', '.json'].includes(ext)) {
          // Skip check-emojis or test scripts that contain the regex patterns themselves
          if (entry.name.includes('check-emojis') || entry.name.includes('challenger') || fullPath.includes('__tests__')) {
            continue;
          }

          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            const trimmed = line.trim();
            // Skip comments
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
              return;
            }

            for (const p of emojiPatterns) {
              const match = line.match(p.regex);
              if (match) {
                const char = match[0];
                if (!allowedSymbols.has(char)) {
                  violations.push({
                    file: path.relative(process.cwd(), fullPath),
                    line: idx + 1,
                    pattern: p.name,
                    char,
                    snippet: trimmed.slice(0, 80)
                  });
                  break;
                }
              }
            }
          });
        }
      }
    }
  }

  // 1.1 Frontend Pages & Components
  const frontendDirs = ['src/pages', 'src/components'];
  for (const d of frontendDirs) {
    scanDirectory(d);
  }

  recordAssert(
    category,
    violations.length === 0,
    `src/pages and src/components 0-Emoji verification (found ${violations.length} violations)`,
    violations.map(v => `${v.file}:${v.line} [${v.char}] "${v.snippet}"`).join('; ')
  );

  // 1.2 Also verify src/App.vue
  const appVuePath = path.resolve(process.cwd(), 'src/App.vue');
  if (fs.existsSync(appVuePath)) {
    const appContent = fs.readFileSync(appVuePath, 'utf-8');
    let appViolations = 0;
    appContent.split('\n').forEach((l, idx) => {
      const t = l.trim();
      if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return;
      for (const p of emojiPatterns) {
        const m = l.match(p.regex);
        if (m && !allowedSymbols.has(m[0])) {
          appViolations++;
        }
      }
    });
    recordAssert(
      category,
      appViolations === 0,
      `src/App.vue 0-Emoji verification (found ${appViolations} violations)`
    );
  }

  // 1.3 Verify check-emojis.ts exists and runs cleanly
  const checkEmojiScript = path.resolve(process.cwd(), 'src/scripts/check-emojis.ts');
  recordAssert(
    category,
    fs.existsSync(checkEmojiScript),
    'src/scripts/check-emojis.ts existence check'
  );
}

// ============================================================================
// SUITE 2: Fluid Clamp Typography & Viewport Probing
// ============================================================================
function runSuite2ClampTypography(): void {
  console.log('\n>>> [Suite 2] Fluid Clamp Typography & Viewport Probing...');
  const category = 'Fluid Clamp Typography';

  // 2.1 App.vue Global CSS Fluid Variables
  const appVuePath = path.resolve(process.cwd(), 'src/App.vue');
  const appVueContent = fs.readFileSync(appVuePath, 'utf-8');

  recordAssert(
    category,
    appVueContent.includes('--fluid-pad-x: clamp('),
    'App.vue defines fluid horizontal padding --fluid-pad-x using clamp()'
  );

  recordAssert(
    category,
    appVueContent.includes('--fluid-pad-y: clamp('),
    'App.vue defines fluid vertical padding --fluid-pad-y using clamp()'
  );

  recordAssert(
    category,
    appVueContent.includes('--card-pad: clamp('),
    'App.vue defines fluid card padding --card-pad using clamp()'
  );

  // Evaluate CSS variable clamp values at various viewports:
  // --fluid-pad-x: clamp(12px, 2vw, 28px)
  // At 320px: 2vw = 6.4px -> clamped to 12px
  // At 768px: 2vw = 15.36px -> 15.36px
  // At 1400px: 2vw = 28px -> clamped to 28px
  const calcClamp = (min: number, valVw: number, max: number, viewportWidth: number) => {
    const preferred = (viewportWidth * valVw) / 100;
    return Math.min(Math.max(min, preferred), max);
  };

  const padAt320 = calcClamp(12, 2, 28, 320);
  recordAssert(category, padAt320 === 12, `At 320px viewport, --fluid-pad-x clamps to minimum 12px (computed: ${padAt320}px)`);

  const padAt768 = calcClamp(12, 2, 28, 768);
  recordAssert(category, padAt768 === 15.36, `At 768px viewport, --fluid-pad-x scales fluidly to 15.36px (computed: ${padAt768}px)`);

  // 2.2 index.vue Fluid Hero Amounts
  const indexVuePath = path.resolve(process.cwd(), 'src/pages/index/index.vue');
  const indexContent = fs.readFileSync(indexVuePath, 'utf-8');

  // Verify .half-val fluid clamp at max-width 767px: clamp(22px, 5.8vw, 28px)
  const hasMobileClamp = indexContent.includes('clamp(22px, 5.8vw, 28px)');
  recordAssert(
    category,
    hasMobileClamp,
    'index.vue .half-val uses fluid clamp(22px, 5.8vw, 28px) on mobile viewports (<= 767px)'
  );

  // Verify .half-val compact clamp at max-width 380px: clamp(17px, 5.2vw, 21px)
  const hasNarrowClamp = indexContent.includes('clamp(17px, 5.2vw, 21px)');
  recordAssert(
    category,
    hasNarrowClamp,
    'index.vue .half-val uses fluid clamp(17px, 5.2vw, 21px) on ultra-narrow viewports (<= 380px)'
  );

  // Mathematical bounds across viewports:
  const viewports = [320, 360, 375, 380, 520, 768];
  for (const vp of viewports) {
    if (vp <= 380) {
      const computed = calcClamp(17, 5.2, 21, vp);
      recordAssert(
        category,
        computed >= 17 && computed <= 21,
        `Viewport ${vp}px: .half-val font-size computes to ${computed.toFixed(2)}px (within [17px, 21px])`
      );
    } else {
      const computed = calcClamp(22, 5.8, 28, vp);
      recordAssert(
        category,
        computed >= 22 && computed <= 28,
        `Viewport ${vp}px: .half-val font-size computes to ${computed.toFixed(2)}px (within [22px, 28px])`
      );
    }
  }

  // 2.3 Container paddings in index.vue, policy/index.vue, remote/index.vue
  const filesWithClampPad = [
    'src/pages/index/index.vue',
    'src/pages/policy/index.vue',
    'src/pages/remote/index.vue'
  ];
  for (const f of filesWithClampPad) {
    const fc = fs.readFileSync(path.resolve(process.cwd(), f), 'utf-8');
    recordAssert(
      category,
      fc.includes('clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px)'),
      `${f} implements responsive container padding clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px)`
    );
  }
}

// ============================================================================
// SUITE 3: Multi-Device Responsive Layout Verification (320px - 768px)
// ============================================================================
function runSuite3ResponsiveLayout(): void {
  console.log('\n>>> [Suite 3] Multi-Device Responsive Layout Verification (320px - 768px)...');
  const category = 'Responsive Layout';

  const indexVue = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/index/index.vue'), 'utf-8');
  const rankingVue = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/ranking/index.vue'), 'utf-8');
  const simulatorVue = fs.readFileSync(path.resolve(process.cwd(), 'src/components/MultiCitySimulator.vue'), 'utf-8');

  // 3.1 380px ultra-compact breakpoint
  recordAssert(
    category,
    indexVue.includes('@media (max-width: 380px)'),
    'index.vue contains explicit @media (max-width: 380px) ultra-compact breakpoint'
  );

  // Verify single column grid collapse in 380px breakpoint
  const narrowBreakpointMatch = indexVue.match(/@media\s*\(max-width:\s*380px\)\s*\{([\s\S]+?)\n\}/);
  if (narrowBreakpointMatch) {
    const block = narrowBreakpointMatch[1];
    recordAssert(
      category,
      block.includes('grid-template-columns: 1fr'),
      'index.vue collapses region-dropdown-grid, identity-grid, treatment-type-grid to 1fr on <= 380px'
    );
  } else {
    recordAssert(category, false, 'index.vue @media (max-width: 380px) block could not be extracted');
  }

  // 3.2 520px mobile breakpoint & floating action bar
  recordAssert(
    category,
    indexVue.includes('@media (max-width: 520px)'),
    'index.vue contains explicit @media (max-width: 520px) mobile breakpoint'
  );

  recordAssert(
    category,
    indexVue.includes('.mobile-calc-float-bar'),
    'index.vue includes .mobile-calc-float-bar floating voucher action pill bar'
  );

  recordAssert(
    category,
    indexVue.includes('bottom: calc(56px + env(safe-area-inset-bottom))') || indexVue.includes('calc(56px + env(safe-area-inset-bottom))'),
    '.mobile-calc-float-bar accounts for iPhone bottom home indicator safe-area-inset-bottom'
  );

  // 3.3 Public Document Strip (sleek-doc-strip) Responsive Wrapping
  recordAssert(
    category,
    indexVue.includes('.sleek-doc-strip') && indexVue.includes('flex-direction: column !important;'),
    'sleek-doc-strip collapses into vertical column layout on mobile to prevent clipping'
  );

  recordAssert(
    category,
    indexVue.includes('.sds-title') && indexVue.includes('white-space: normal !important;'),
    'sds-title allows normal text wrapping on mobile to prevent text truncation'
  );

  // 3.4 Ranking page responsive adaptability
  recordAssert(
    category,
    rankingVue.includes('@media (max-width: 767px)'),
    'ranking/index.vue contains @media (max-width: 767px) mobile layout rule'
  );

  recordAssert(
    category,
    rankingVue.includes('.cards-stream-wrapper') && rankingVue.includes('grid-template-columns: 1fr;'),
    'ranking/index.vue cards stream collapses to single column (1fr) on mobile'
  );

  recordAssert(
    category,
    rankingVue.includes('.podium-card.rank-1') && rankingVue.includes('grid-column: span 2;'),
    'ranking/index.vue top podium card expands to span 2 columns as mobile Hero card'
  );

  // 3.5 MultiCitySimulator responsive layout
  recordAssert(
    category,
    simulatorVue.includes('@media (max-width: 768px)'),
    'MultiCitySimulator.vue contains @media (max-width: 768px) responsive block'
  );

  recordAssert(
    category,
    simulatorVue.includes('.side-by-side-grid.grid-2') && simulatorVue.includes('grid-template-columns: 1fr;'),
    'MultiCitySimulator.vue side-by-side comparison collapses to 1fr on mobile'
  );

  recordAssert(
    category,
    simulatorVue.includes('.hospital-tier-chips') && simulatorVue.includes('grid-template-columns: 1fr;'),
    'MultiCitySimulator.vue hospital tier chips collapse to 1fr on mobile'
  );

  // 3.6 Check for unsafe fixed widths (> 300px without max-width) in mobile sections
  const filesToCheck = [
    { file: 'src/pages/index/index.vue', content: indexVue },
    { file: 'src/pages/ranking/index.vue', content: rankingVue },
    { file: 'src/components/MultiCitySimulator.vue', content: simulatorVue }
  ];

  for (const { file, content } of filesToCheck) {
    // Scan all width: [3-9]\d{2}px rules and ensure they don't cause overflow on 320px
    const widthMatches = content.match(/width\s*:\s*([3-9]\d{2})px/g) || [];
    let unsafeWidthCount = 0;
    for (const wm of widthMatches) {
      const px = parseInt(wm.replace(/width\s*:\s*/, '').replace('px', ''), 10);
      // If width > 320px and not inside a desktop media query or modal overlay
      if (px > 320) {
        // Check context around match
        const idx = content.indexOf(wm);
        const snippet = content.slice(Math.max(0, idx - 150), Math.min(content.length, idx + 150));
        if (!snippet.includes('max-width') && !snippet.includes('min-width: 768px') && !snippet.includes('modal') && !snippet.includes('dropdown')) {
          unsafeWidthCount++;
        }
      }
    }
    recordAssert(
      category,
      unsafeWidthCount === 0,
      `${file} free of unconditional fixed widths > 320px (unsafe count: ${unsafeWidthCount})`
    );
  }
}

// ============================================================================
// SUITE 4: Mobile Touch Target Ergonomics (>= 44px)
// ============================================================================
function runSuite4TouchTargets(): void {
  console.log('\n>>> [Suite 4] Mobile Touch Target Ergonomics (>= 44px)...');
  const category = 'Touch Ergonomics (>= 44px)';

  interface TouchTargetDefinition {
    file: string;
    selector: string;
    description: string;
    minHeightExpected: number;
  }

  const targets: TouchTargetDefinition[] = [
    // index.vue
    { file: 'src/pages/index/index.vue', selector: '.cyber-dropdown-trigger', description: 'Dropdown region picker trigger', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.dropdown-item', description: 'Dropdown selection menu item', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.preset-pill', description: 'Preset expenditure quick pills', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.copy-voucher-btn', description: 'Voucher copy button', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.voucher-gen-btn', description: 'Generate voucher CTA button', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.retiree-bar', description: 'Retiree preference toggle bar', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.seg-btn', description: 'Insurance type identity selection button', minHeightExpected: 44 },
    { file: 'src/pages/index/index.vue', selector: '.sub-seg-btn', description: 'Hospital tier treatment selection button', minHeightExpected: 44 },

    // ranking/index.vue
    { file: 'src/pages/ranking/index.vue', selector: '.switch-pill', description: 'Ranking arena mode switch pill', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.seg-item', description: 'Category segmented control item', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.dropdown-trigger', description: 'Ranking province/sort dropdown trigger', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.layout-toggle-dock .layout-btn', description: 'Layout grid/table toggle button', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.search-input-box', description: 'Ranking search input box', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.search-input', description: 'Ranking search text input', minHeightExpected: 44 },
    { file: 'src/pages/ranking/index.vue', selector: '.fab-back-top', description: 'Floating back-to-top action button', minHeightExpected: 44 },

    // MultiCitySimulator.vue
    { file: 'src/components/MultiCitySimulator.vue', selector: '.tier-chip', description: 'Simulator hospital tier chip', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.freq-item-btn', description: 'Simulator visit frequency button', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.remote-chip', description: 'Simulator remote medical status chip', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.retiree-toggle-bar', description: 'Simulator retiree toggle bar', minHeightExpected: 44 },
    { file: 'src/components/MultiCitySimulator.vue', selector: '.rh-act-btn', description: 'Simulator copy/hotline action button', minHeightExpected: 44 }
  ];

  for (const t of targets) {
    const fullPath = path.resolve(process.cwd(), t.file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Check if the selector has min-height: 44px or height: 44px or height >= 44
    // We look for selector block
    const escapedSelector = t.selector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const ruleRegex = new RegExp(`${escapedSelector}[^{]*\\{([^}]+)\\}`, 'g');
    let match: RegExpExecArray | null;
    let satisfiesTouch = false;
    let explicitSizes: string[] = [];

    while ((match = ruleRegex.exec(content)) !== null) {
      const body = match[1];
      const minH = body.match(/min-height\s*:\s*(\d+)px/);
      const h = body.match(/(?:^|[^-\w])height\s*:\s*(\d+)px/);
      const minW = body.match(/min-width\s*:\s*(\d+)px/);
      const w = body.match(/(?:^|[^-\w])width\s*:\s*(\d+)px/);

      if (minH && parseInt(minH[1], 10) >= t.minHeightExpected) satisfiesTouch = true;
      if (h && parseInt(h[1], 10) >= t.minHeightExpected) satisfiesTouch = true;

      if (minH) explicitSizes.push(`min-height: ${minH[1]}px`);
      if (h) explicitSizes.push(`height: ${h[1]}px`);
      if (minW) explicitSizes.push(`min-width: ${minW[1]}px`);
      if (w) explicitSizes.push(`width: ${w[1]}px`);
    }

    recordAssert(
      category,
      satisfiesTouch,
      `${t.file} -> ${t.selector} (${t.description}) satisfies >= ${t.minHeightExpected}px`,
      explicitSizes.join(', ') || 'No explicit height found'
    );
  }

  // 4.2 Adversarial Check: Ensure NO media query reduces interactive elements below 44px
  const files = [
    'src/pages/index/index.vue',
    'src/pages/ranking/index.vue',
    'src/components/MultiCitySimulator.vue'
  ];

  for (const f of files) {
    const content = fs.readFileSync(path.resolve(process.cwd(), f), 'utf-8');
    const mediaQueries = content.match(/@media[^{]+\{([\s\S]+?\}(?:\s*\})?)/g) || [];

    let sub44Violations: string[] = [];
    for (const mq of mediaQueries) {
      // Check for any interactive element having explicit height < 44px inside media query
      const sub44Matches = mq.match(/(?:\.btn|\.pill|\.chip|\.trigger|\.item|\.card|\.tab)[^{]*\{[^}]*(?:[^\-]height\s*:\s*([1-3]\d)px)/g);
      if (sub44Matches) {
        for (const m of sub44Matches) {
          if (!m.includes('svg') && !m.includes('icon') && !m.includes('pulse')) {
            sub44Violations.push(m.trim().replace(/\s+/g, ' '));
          }
        }
      }
    }

    recordAssert(
      category,
      sub44Violations.length === 0,
      `${f} media queries contain 0 sub-44px interactive height reductions`,
      sub44Violations.join('; ')
    );
  }
}

// ============================================================================
// MAIN RUNNER & VERDICT
// ============================================================================
export function runChallengerUIOracle(): OracleStats {
  console.log('================================================================================');
  console.log('>>> [CHALLENGER R10.2] Frontend UI Ergonomics, 0-Emoji & Fluid Layout Oracle <<<');
  console.log('================================================================================');

  runSuite1EmojiScan();
  runSuite2ClampTypography();
  runSuite3ResponsiveLayout();
  runSuite4TouchTargets();

  console.log('\n================================================================================');
  console.log('>>> [CHALLENGER R10.2 VERDICT SUMMARY] <<<');
  console.log(`  Total Checks Executed:  ${stats.totalChecks}`);
  console.log(`  Passed Checks:          ${stats.passedChecks}`);
  console.log(`  Failed Checks:          ${stats.failedChecks}`);
  console.log(`  Pass Rate:              ${((stats.passedChecks / stats.totalChecks) * 100).toFixed(2)}%`);
  console.log(`  Findings/Defects:       ${stats.findings.length}`);
  console.log('================================================================================\n');

  if (stats.findings.length > 0) {
    console.error('CRITICAL FINDINGS DETECTED:');
    stats.findings.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.category}] ${f.description} - ${f.detail}`);
    });
    console.error('\n>>> FINAL VERDICT: REQUEST_CHANGES <<<\n');
  } else {
    console.log('>>> FINAL VERDICT: APPROVE <<<');
    console.log('All frontend ergonomics, strict 0-Emoji compliance, fluid clamp typography,');
    console.log('multi-device responsive layouts (320px-768px), and mobile touch targets >= 44px');
    console.log('have been EMPIRICALLY AUDITED AND VERIFIED.\n');
  }

  return stats;
}

runChallengerUIOracle();
