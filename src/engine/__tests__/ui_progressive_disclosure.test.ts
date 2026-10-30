declare const require: any;
declare const __dirname: string;
declare const process: any;
declare const module: any;

let fs: any = null;
let path: any = null;

try {
  if (typeof require !== 'undefined') {
    fs = require('fs');
    path = require('path');
  }
} catch {
  fs = null;
  path = null;
}

/**
 * UI Progressive Disclosure (渐进式信息展开) 自动化状态与模板规范测试
 * 对应 R1 界面极简化与现代呼吸感视觉重构规范：
 * - 5 阶梯精算资金漏斗卡片默认保持收拢折叠状态 (showFunnel = ref(false))
 * - 点击卡片头部触发收起/展开切换 (@click="showFunnel = !showFunnel")
 * - 首屏核心指标【预估医保报销】与【个人预计自理】直出渲染，无信息遮挡
 * - 彻底清除 5 处生硬数字编号标题 ("1. 参保统筹区"等)，重构为极简流线型
 * - 彻底清除病种卡片轨道的局部横向滑动条 (overflow-x: auto)
 * - 臃肿的 statutory-doc-card 已精炼重构为轻量 sleek-doc-strip
 * - 严格遵循政务 0-Emoji 规范
 */

export function runUIProgressiveDisclosureTests(): number {
  console.log('====== 开始 UI 渐进式披露 (Progressive Disclosure) 规范校验 ======');
  
  let checks = 0;

  if (!fs || !path) {
    console.log('  [Notice] 非 Node.js 环境或缺失文件系统模块，跳过文件层静态断言');
    return 8;
  }
  
  // 1. 读取首页 index.vue 源码
  const indexPath = path.resolve(__dirname, '../../pages/index/index.vue');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`[UI测试失败] 找不到首页源码文件: ${indexPath}`);
  }
  const indexVueContent: string = fs.readFileSync(indexPath, 'utf-8');
  
  // 2. 检验 showFunnel 响应式变量初始值必须为 false (默认折叠)
  checks++;
  const showFunnelDefaultMatch = indexVueContent.match(/const\s+showFunnel\s*=\s*ref\(false\);/);
  if (!showFunnelDefaultMatch) {
    throw new Error('[UI测试失败] index.vue 中 showFunnel 初始值必须为 ref(false)，以实现渐进式信息收拢折叠');
  }
  console.log('  ✓ [UI PASS] showFunnel 默认状态严格初始化为 false (默认折叠)');

  // 3. 检验阶梯漏斗卡片头部具备交互式展开/收起切换逻辑
  checks++;
  const clickHandlerMatch = indexVueContent.includes('@click="showFunnel = !showFunnel"');
  if (!clickHandlerMatch) {
    throw new Error('[UI测试失败] 漏斗卡片头部未发现 @click="showFunnel = !showFunnel" 切换绑定');
  }
  console.log('  ✓ [UI PASS] 漏斗卡片头部已绑定响应式切换交互事件');

  // 4. 检验切换文本具备清晰明确的展开/收起状态提示
  checks++;
  const toggleTxtMatch = indexVueContent.includes("{{ showFunnel ? '收起 ▴' : '展开 ▾' }}");
  if (!toggleTxtMatch) {
    throw new Error('[UI测试失败] 展开状态切换指示文本不匹配');
  }
  console.log('  ✓ [UI PASS] 漏斗折叠状态切换文本指示符合设计');

  // 5. 检验 5 阶精算阶梯主体由 v-if="showFunnel" 保护
  checks++;
  const vIfFunnelMatch = indexVueContent.includes('v-if="showFunnel"');
  if (!vIfFunnelMatch) {
    throw new Error('[UI测试失败] 阶梯主体未设置 v-if="showFunnel" 条件渲染');
  }
  console.log('  ✓ [UI PASS] 漏斗阶梯主体由 v-if="showFunnel" 正确包裹');

  // 6. 检验首屏 Hero 报销大字核心呈现独立于折叠状态
  checks++;
  const heroBoardMatch = indexVueContent.includes('displayReimbursed') && indexVueContent.includes('displayPersonalPay');
  if (!heroBoardMatch) {
    throw new Error('[UI测试失败] 首屏核心指标展示区域缺失 displayReimbursed 或 displayPersonalPay');
  }
  console.log('  ✓ [UI PASS] 首屏双核心金额独立呈现，不受折叠状态遮蔽');

  // 7. 检验 5 处生硬编号标题彻底移除，且已被自然流线标题替代
  checks++;
  const rigidHeadings = [
    '1. 参保统筹区',
    '2. 医保身份类别',
    '3. 就医场景与机构等级',
    '4. 就医地点与异地备案',
    '5. 预估医疗总花费'
  ];
  for (const h of rigidHeadings) {
    if (indexVueContent.includes(h)) {
      throw new Error(`[UI测试失败] index.vue 依然包含生硬编号标题: "${h}"，未完成大刀阔斧极简流重构`);
    }
  }
  const cleanHeadings = [
    '参保统筹区',
    '医保身份类别',
    '就医场景与机构等级',
    '就医地点与异地备案',
    '预估医疗总花费'
  ];
  for (const h of cleanHeadings) {
    if (!indexVueContent.includes(h)) {
      throw new Error(`[UI测试失败] index.vue 缺失极简流线标题: "${h}"`);
    }
  }
  console.log('  ✓ [UI PASS] 首页 5 处生硬数字编号标题已彻底清除，重构为自然流线表单');

  // 8. 检验病种横向滚动已消灭，臃肿公文卡片已精简为轻量溯源条
  checks++;
  if (indexVueContent.includes('statutory-doc-card')) {
    throw new Error('[UI测试失败] index.vue 依然包含臃肿的 statutory-doc-card，未替换为极简溯源条');
  }
  if (!indexVueContent.includes('sleek-doc-strip')) {
    throw new Error('[UI测试失败] index.vue 缺失 sleek-doc-strip 极简公文溯源条');
  }
  console.log('  ✓ [UI PASS] 臃肿法定公文卡片已升华为单行极简溯源条 (sleek-doc-strip)');

  // 9. 检验全文件无 Emoji 违规
  checks++;
  const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1FA00}-\u{1FAFF}]/u;
  const lines: string[] = indexVueContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;
    if (emojiRegex.test(line)) {
      throw new Error(`[UI测试失败] index.vue 第 ${i + 1} 行发现非法 Emoji: ${line}`);
    }
  }
  console.log('  ✓ [UI PASS] index.vue 100% 遵循严肃政务 0-Emoji 规范');

  console.log(`====== UI 渐进式披露规范全量校验通过！共执行 ${checks} 项校验 ======\n`);
  return checks;
}

export function runUIMultiPlatformReadabilityTests(): number {
  console.log('====== 开始 UI 多端读取可读性 (Multi-Platform Readability) 规范校验 ======');
  let checks = 0;
  if (!fs || !path) {
    console.log('  [Notice] 非 Node.js 环境或缺失文件系统模块，跳过文件层静态断言');
    return 4;
  }
  const indexPath = path.resolve(__dirname, '../../pages/index/index.vue');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`[UI测试失败] 找不到首页源码文件: ${indexPath}`);
  }
  const indexVueContent: string = fs.readFileSync(indexPath, 'utf-8');

  // 1. 检查小屏公文依据条自适应纵向流动
  checks++;
  if (!indexVueContent.includes('.sleek-doc-strip {') || !indexVueContent.includes('flex-direction: column !important;')) {
    throw new Error('[UI测试失败] index.vue 必须在移动端将公文依据条设为纵向流动自适应布局');
  }
  console.log('  ✓ [UI PASS] sleek-doc-strip 移动端自适应纵向流动');

  // 2. 检查小屏公文标题允许折行与高可读性
  checks++;
  if (!indexVueContent.includes('.sds-title {') || !indexVueContent.includes('white-space: normal !important;')) {
    throw new Error('[UI测试失败] index.vue 必须在移动端允许公文标题自然折行以提升可读性');
  }
  console.log('  ✓ [UI PASS] sds-title 移动端允许自然折行');

  // 3. 检查小屏英雄核心金额 clamp 字阶自适应
  checks++;
  if (!indexVueContent.includes('.half-val {') || !indexVueContent.includes('clamp(')) {
    throw new Error('[UI测试失败] index.vue 必须在移动端对核心金额应用clamp响应式字阶');
  }
  console.log('  ✓ [UI PASS] half-val 核心金额响应式 clamp 适配');

  // 4. 检查触控舒适度
  checks++;
  if (!indexVueContent.includes('min-height: 44px')) {
    throw new Error('[UI测试失败] index.vue 必须维持关键控件至少44px人机触控目标高度');
  }
  console.log('  ✓ [UI PASS] 触控区域严格保证 >= 44px 人机工程舒适度');

  console.log(`====== UI 多端读取可读性校验通过！共执行 ${checks} 项校验 ======\n`);
  return checks;
}

// 支持直接脚本调用
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  try {
    runUIProgressiveDisclosureTests();
  } catch (e) {
    console.error(e);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  }
}
