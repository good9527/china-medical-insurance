<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { onMounted } from 'vue';

onLaunch(() => {
  console.log("Antigravity Engine Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    initAntigravityCanvas();
  }
});

function initAntigravityCanvas() {
  if (document.getElementById('antigravity-bg-canvas')) return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'antigravity-bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 鼠标引力坐标与物理状态
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    radius: 200,
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // 移动端多点与单点触控微引力响应
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
  }, { passive: true });

  // 量子粒子系统
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseAlpha: number;
    hue: number;
  }

  const particleCount = Math.min(65, Math.floor((width * height) / 18000));
  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.8,
      baseAlpha: Math.random() * 0.4 + 0.15,
      hue: Math.random() > 0.6 ? 188 : 230 // 电晶青与深空靛蓝
    });
  }

  function render() {
    // 鼠标缓动插值 (Damping)
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    ctx!.clearRect(0, 0, width, height);

    // 1. 随鼠标移动的柔和浅蓝环境微光 (Ambient Light Spotlight)
    const ambientGlow = ctx!.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      Math.max(width * 0.45, 450)
    );
    ambientGlow.addColorStop(0, 'rgba(37, 99, 235, 0.04)');
    ambientGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.015)');
    ambientGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx!.fillStyle = ambientGlow;
    ctx!.fillRect(0, 0, width, height);

    // 2. 交互式微尘粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius && mouse.active) {
        const force = (1 - dist / mouse.radius) * 0.4;
        p.vx += (dx / dist) * force * 0.08;
        p.vy += (dy / dist) * force * 0.08;
      }

      p.vx *= 0.985;
      p.vy *= 0.985;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      else if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      else if (p.y > height) p.y = 0;

      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(37, 99, 235, ${p.baseAlpha * 0.35})`;
      ctx!.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const pdist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pdist < 100) {
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(p2.x, p2.y);
          ctx!.strokeStyle = `rgba(37, 99, 235, ${0.04 * (1 - pdist / 100)})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
</script>

<style>
:root {
  --bg-space: #f8fafc;
  --bg-card: #ffffff;
  --bg-card-hover: #f1f5f9;
  --border-subtle: #e2e8f0;
  --border-active: #2563eb;
  --cyan: #2563eb;
  --cyan-glow: rgba(37, 99, 235, 0.15);
  --emerald: #059669;
  --amber: #d97706;
  --rose: #e11d48;
  --text-pure: #0f172a;
  --text-main: #1e293b;
  --text-dim: #64748b;
  --text-mute: #94a3b8;
  
  /* 统一圆角系统：严格4档规范，杜绝视觉凌乱 */
  --radius-sm: 8rpx;
  --radius-md: 12rpx;
  --radius-lg: 16rpx;
  --radius-pill: 9999rpx;

  /* QQ弹弹物理动效系统 (Spring Elastic Physics) */
  --spring-bounce: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  /* 全局流体自适应变量与黄金极限规范 */
  --container-max-w: 1280px;
  --fluid-pad-x: clamp(12px, 2vw, 28px);
  --fluid-pad-y: clamp(10px, 1.5vh, 20px);
  --card-pad: clamp(14px, 1.5vw, 22px);
  /* 全局统一字号阶梯规范 (Design System Typographic Scale) */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  
  --font-hero: 32px;
  --font-h1: 22px;
  --font-h2: 16px;
  --font-h3: 13.5px;
  --font-body: 13px;
  --font-sub: 12px;
  --font-caption: 11px;
}

*, *::before, *::after {
  box-sizing: border-box;
}

page {
  background-color: #f8fafc;
  color: #1e293b;
  font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  line-height: 1.5;
  user-select: none;
}

/* 强制所有表单元素继承全局字体与抗锯齿渲染 */
input, button, select, textarea, uni-input, uni-button {
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 全局主视口容器：严格锁定最大黄金极限 1280px，杜绝超宽屏变形与稀疏 */
uni-page-body {
  width: 100%;
  max-width: var(--container-max-w);
  margin: 0 auto;
  min-height: 100vh;
  background-color: transparent;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

/* 消除原生套壳移动端顶栏：全端使用自研沉浸式科技顶栏 */
uni-page-head {
  display: none !important;
}

/* 桌面端隐藏原生移动端底部 TabBar，转由各页面顶部官网级科技导航呈现 */
@media (min-width: 768px) {
  uni-tabbar {
    display: none !important;
  }
}

/* 移动端沉浸式磨砂微光 TabBar 与安全区适配 */
@media (max-width: 767px) {
  uni-page-body {
    padding-bottom: calc(76px + env(safe-area-inset-bottom)) !important;
  }
  uni-tabbar {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    z-index: 998 !important;
    display: block !important;
    margin: 0 !important;
  }
  .uni-tabbar {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    height: 54px !important;
    background: rgba(255, 255, 255, 0.96) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-top: 1px solid rgba(226, 232, 240, 0.9) !important;
    box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.06) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
    display: flex !important;
    align-items: center !important;
    box-sizing: content-box !important;
  }
  .uni-tabbar .uni-tabbar__item {
    flex: 1 !important;
    height: 54px !important;
    padding: 4px 0 2px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .uni-tabbar .uni-tabbar__item:active {
    transform: scale(0.92) !important;
  }
  .uni-tabbar .uni-tabbar__bd {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .uni-tabbar .uni-tabbar__icon {
    width: 22px !important;
    height: 22px !important;
    margin-top: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .uni-tabbar .uni-tabbar__icon img {
    width: 22px !important;
    height: 22px !important;
    object-fit: contain !important;
  }
  .uni-tabbar .uni-tabbar__label {
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: -0.2px !important;
    margin-top: 2px !important;
    white-space: nowrap !important;
    word-break: keep-all !important;
    line-height: 1.2 !important;
  }
}

/* 全局模态弹窗打开时隐藏底栏与浮动条，彻底解决层级遮挡与手势误触问题 */
body.modal-open uni-tabbar,
uni-app.modal-open uni-tabbar,
.modal-open uni-tabbar,
body.modal-open .uni-tabbar {
  display: none !important;
}

body.modal-open .mobile-calc-float-bar {
  display: none !important;
}

body.modal-open {
  overflow: hidden !important;
}

/* ==================== 现代微科技硬件光标系统 (0 运行时开销) ==================== */
@media (pointer: fine) {
  html, body, page, uni-app, uni-page-body, .page-wrapper {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M3 2L15 12L9.5 13L6.5 19L3 2Z' fill='%230f172a' stroke='%23ffffff' stroke-width='1.5' stroke-linejoin='round'/%3E%3Ccircle cx='9.5' cy='13' r='1.4' fill='%2338bdf8'/%3E%3C/svg%3E") 3 2, default !important;
  }

  button, 
  a, 
  .clickable, 
  .interactive-item, 
  .elastic-btn,
  .nav-tab,
  .dim-chip,
  .bench-item,
  .preset-pill,
  .preset-chip,
  .seg-item,
  .switch-pill,
  .dock-btn,
  .bci-act-pill,
  .action-btn,
  .city-path,
  .contact-pill,
  .contact-item,
  .community-row,
  .suggest-item,
  .col-sortable,
  .sort-dropdown-trigger,
  .dropdown-trigger,
  .cyber-dropdown-trigger,
  .dropdown-item,
  .menu-item,
  .sub-seg-btn,
  .id-card,
  .treat-btn,
  .bento-tile,
  .s-card,
  .bento-rank-card,
  .podium-card,
  .voucher-gen-btn,
  .copy-voucher-btn,
  .modal-close-round,
  .modal-close-btn,
  .collapse-trigger,
  .map-reset-btn {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M3 2L14 11L8.8 12.2L6 17.5L3 2Z' fill='%230284c7' stroke='%23ffffff' stroke-width='1.6' stroke-linejoin='round'/%3E%3Ccircle cx='15' cy='15' r='3.5' stroke='%230284c7' stroke-width='1.2' fill='rgba(2,132,199,0.15)'/%3E%3Ccircle cx='15' cy='15' r='1' fill='%230284c7'/%3E%3C/svg%3E") 3 2, pointer !important;
  }

  /* 地图平移画板保留专业的空间抓取光标 */
  .svg-viewport {
    cursor: grab !important;
  }
  .svg-viewport:active {
    cursor: grabbing !important;
  }
}

/* 全局 QQ 弹弹交互基础类与按压反馈 */
button, .elastic-btn, .interactive-item {
  position: relative;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.22s var(--spring-bounce), box-shadow 0.22s ease, background-color 0.2s ease, border-color 0.2s ease !important;
  will-change: transform;
}

button:hover, .elastic-btn:hover, .interactive-item:hover {
  transform: translateY(-1rpx) scale(1.008);
}

button:active, .elastic-btn:active, .interactive-item:active {
  transform: translateY(1rpx) scale(0.98) !important;
  transition-duration: 0.08s !important;
}

/* 全局页面载入轻平滑动画 */
@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.page-wrapper {
  animation: pageFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

/* 优雅卡片悬浮与按压反馈 */
.card-hover-lift {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease !important;
}
.card-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.07), 0 4px 8px -2px rgba(15, 23, 42, 0.03) !important;
}

/* 状态绿点轻呼吸动效 */
@keyframes liveDotPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
.status-pulse-dot, .status-dot {
  animation: liveDotPulse 2.2s infinite ease-out !important;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: var(--radius-sm);
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
::-webkit-scrollbar-track {
  background: transparent;
}

/* ==================== 专属打印输出友好适配 (@media print) ==================== */
@media print {
  /* 隐藏非凭据单据与交互UI元素 */
  #antigravity-bg-canvas,
  .site-header,
  .site-footer,
  .mobile-tabbar,
  .page-intro-bar,
  .bento-card.config-card,
  .mobile-calc-float-bar,
  .quick-search-trigger,
  .search-panel,
  .cyber-dropdown-menu,
  .copy-voucher-btn,
  .statute-btn,
  .modal-actions-bar,
  .modal-close-btn,
  .action-btn,
  .policy-tooltip-anchor,
  .arena-switch-bar,
  .category-segmented-bar,
  .toolbar-pickers-row,
  .identity-switch-bar,
  .calc-shortcut-banner,
  .contact-pill {
    display: none !important;
  }

  body, page, uni-page-body, .page-wrapper {
    background: #ffffff !important;
    color: #000000 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .content-box {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .bento-grid {
    display: block !important;
  }

  .bento-card.receipt-card {
    border: 1px solid #333333 !important;
    box-shadow: none !important;
    background: #ffffff !important;
    border-radius: 0 !important;
    break-inside: avoid;
  }

  .receipt-hero-block {
    background: #f8fafc !important;
    border: 1px solid #cbd5e1 !important;
    box-shadow: none !important;
  }

  /* 如果打开了医保报销预估凭据单弹窗，完全只打印凭据单正文卡片 */
  .voucher-modal-mask {
    position: static !important;
    background: transparent !important;
    padding: 0 !important;
    backdrop-filter: none !important;
  }
  .voucher-modal-dialog {
    max-width: 100% !important;
    box-shadow: none !important;
    border: none !important;
  }
  .voucher-sheet {
    border: 1px solid #333333 !important;
    box-shadow: none !important;
    padding: 10mm !important;
    page-break-inside: avoid;
  }
}
</style>
