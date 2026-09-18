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
  --input-h: clamp(36px, 4.2vh, 44px);
}

*, *::before, *::after {
  box-sizing: border-box;
}

page {
  background-color: #f8fafc;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  user-select: none;
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

/* 全局 QQ 弹弹交互基础类与按压反馈 */
button, .elastic-btn, .interactive-item {
  position: relative;
  cursor: pointer;
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
</style>
