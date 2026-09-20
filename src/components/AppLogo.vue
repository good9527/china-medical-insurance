<template>
  <view class="app-logo-box" :class="[sizeClass]">
    <svg 
      class="logo-svg" 
      viewBox="6 2 36 42" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- 盾牌外轮廓渐变：沉稳深蓝到科技青 -->
        <linearGradient id="shieldGradLight" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <!-- 盾牌轻透背景渐变 -->
        <linearGradient id="shieldBgLight" x1="12" y1="8" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#eff6ff" />
          <stop offset="100%" stop-color="#e0f2fe" />
        </linearGradient>

        <!-- 十字渐变：医保翡翠绿到天青蓝 -->
        <linearGradient id="crossGradLight" x1="16" y1="14" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#2563eb" />
        </linearGradient>

        <!-- 浅色柔和弥散阴影 -->
        <filter id="glowFilterLight" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#2563eb" flood-opacity="0.18" />
        </filter>
      </defs>

      <!-- 外层守护盾牌轮廓 -->
      <path 
        d="M24 4L9 9.8V21.6C9 30.5 15.4 38.8 24 41.5C32.6 38.8 39 30.5 39 21.6V9.8L24 4Z" 
        fill="url(#shieldBgLight)" 
        stroke="url(#shieldGradLight)" 
        stroke-width="2.4" 
        stroke-linejoin="round"
        filter="url(#glowFilterLight)"
      />

      <!-- 内部白色护垫 -->
      <path 
        d="M24 8.5L12.5 13V21C12.5 28 17.5 34.5 24 37C30.5 34.5 35.5 28 35.5 21V13L24 8.5Z" 
        fill="#ffffff" 
        stroke="#dbeafe"
        stroke-width="1"
      />

      <!-- 核心医疗十字 (救死扶伤与基本医疗保障) -->
      <path 
        d="M21.5 15C21.5 14.17 22.17 13.5 23 13.5H25C25.83 13.5 26.5 14.17 26.5 15V20.5H32C32.83 20.5 33.5 21.17 33.5 22V24C33.5 24.83 32.83 25.5 32 25.5H26.5V31C26.5 31.83 25.83 32.5 25 32.5H23C22.17 32.5 21.5 31.83 21.5 31V25.5H16C15.17 25.5 14.5 24.83 14.5 24V22C14.5 21.17 15.17 20.5 16 20.5H21.5V15Z" 
        fill="url(#crossGradLight)" 
      />

      <!-- 跃动脉搏中心核点 -->
      <circle cx="24" cy="23" r="2.2" fill="#ffffff" stroke="#2563eb" stroke-width="1.2" />
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
  width: 22px;
  height: 26px;
}

.logo-md {
  width: 30px;
  height: 35px;
}

.logo-lg {
  width: 38px;
  height: 44px;
}

.logo-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.app-logo-box:hover {
  transform: scale(1.04);
  filter: drop-shadow(0 0 8px rgba(0, 242, 254, 0.45));
}
</style>
