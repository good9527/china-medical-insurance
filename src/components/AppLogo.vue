<template>
  <view class="app-logo-box" :class="[sizeClass]">
    <svg 
      class="logo-svg" 
      viewBox="0 0 128 128" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- 徽章底座渐变：医保科技深蓝到晴空青蓝 -->
        <linearGradient id="appLogoBgGrad" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1d4ed8" />
          <stop offset="50%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <!-- 医疗十字渐变：翡翠绿到深林绿 -->
        <linearGradient id="appLogoCrossGrad" x1="44" y1="40" x2="84" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>

        <!-- 柔和立体阴影 -->
        <filter id="appLogoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.25" />
        </filter>
      </defs>

      <!-- 徽章外壳底座 (平滑超椭圆 Squircle) -->
      <rect x="4" y="4" width="120" height="120" rx="26" fill="url(#appLogoBgGrad)" />
      <rect x="4" y="4" width="120" height="120" rx="26" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />

      <!-- 医疗守护盾牌主体 (纯净玉白) -->
      <path 
        d="M64 22 L32 34 V60 C32 80 46 98 64 104 C82 98 96 80 96 60 V34 L64 22 Z" 
        fill="#ffffff" 
        filter="url(#appLogoShadow)" 
      />

      <!-- 核心医疗十字 (翡翠绿健康基底) -->
      <path 
        d="M58 44 C58 41.8 59.8 40 62 40 H66 C68.2 40 70 41.8 70 44 V58 H84 C86.2 58 88 59.8 88 62 V66 C88 68.2 86.2 70 84 70 H70 V84 C70 86.2 68.2 88 66 88 H62 C59.8 88 58 86.2 58 84 V70 H44 C41.8 70 40 68.2 40 66 V62 C40 59.8 41.8 58 44 58 H58 V44 Z" 
        fill="url(#appLogoCrossGrad)" 
      />

      <!-- 十字中心科技脉搏白核 -->
      <circle cx="64" cy="64" r="4.5" fill="#ffffff" />
    </svg>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg';
}>(), {
  size: 'md'
});

const sizeClass = computed(() => `logo-${props.size}`);
</script>

<style scoped>
.app-logo-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
}

.logo-sm {
  width: 24px;
  height: 24px;
}

.logo-md {
  width: 32px;
  height: 32px;
}

.logo-lg {
  width: 40px;
  height: 40px;
}

.logo-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.app-logo-box:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 12px rgba(37, 99, 235, 0.35));
}
</style>
