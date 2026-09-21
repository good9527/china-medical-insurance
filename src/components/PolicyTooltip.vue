<template>
  <view class="policy-tooltip-anchor" @click.stop="toggleTooltip">
    <view class="info-trigger-badge" :class="{ active: isOpen }">
      <text class="trigger-char">?</text>
    </view>

    <!-- 桌面悬浮与移动端点击展开气泡 -->
    <view class="tooltip-popover" v-if="isOpen" @click.stop>
      <view class="popover-arrow"></view>
      <view class="popover-header">
        <text class="popover-title">{{ title }}</text>
        <text class="popover-close" @click.stop="isOpen = false">✕</text>
      </view>
      <text class="popover-body">{{ text }}</text>
      <view class="popover-example" v-if="example">
        <text class="example-tag">实例说明</text>
        <text class="example-txt">{{ example }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  title: string;
  text: string;
  example?: string;
}>();

const isOpen = ref(false);

function toggleTooltip() {
  isOpen.value = !isOpen.value;
}

function handleGlobalClick() {
  if (isOpen.value) {
    isOpen.value = false;
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleGlobalClick);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleGlobalClick);
  }
});
</script>

<style scoped>
.policy-tooltip-anchor {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
  z-index: 10;
}

.info-trigger-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.15s ease;
}

.info-trigger-badge:hover,
.info-trigger-badge.active {
  background: #0284c7;
  border-color: #0284c7;
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
}

.trigger-char {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.tooltip-popover {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  background: #1e293b;
  color: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
  z-index: 999;
  font-size: 12px;
  line-height: 1.5;
  animation: popIn 0.15s ease-out;
}

@media (max-width: 640px) {
  .tooltip-popover {
    width: 230px;
    left: auto;
    right: -20px;
    transform: none;
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    margin-bottom: -4px;
  }
  to {
    opacity: 1;
    margin-bottom: 0;
  }
}

.popover-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #1e293b transparent transparent transparent;
}

@media (max-width: 640px) {
  .popover-arrow {
    left: auto;
    right: 24px;
    transform: none;
  }
}

.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 4px;
}

.popover-title {
  font-weight: 700;
  font-size: 12px;
  color: #38bdf8;
}

.popover-close {
  color: #94a3b8;
  font-size: 11px;
  cursor: pointer;
  padding: 0 2px;
}

.popover-close:hover {
  color: #ffffff;
}

.popover-body {
  color: #cbd5e1;
  font-size: 11.5px;
  display: block;
}

.popover-example {
  margin-top: 6px;
  padding: 5px 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  border-left: 2px solid #38bdf8;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.example-tag {
  font-size: 9.5px;
  font-weight: 600;
  color: #38bdf8;
}

.example-txt {
  font-size: 11px;
  color: #e2e8f0;
}
</style>
