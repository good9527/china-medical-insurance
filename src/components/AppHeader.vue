<template>
  <view class="site-header">
    <view class="site-header-inner">
      <!-- 左侧：简洁品牌 (去除浮夸官腔，搭载专属科技医保矢量Logo) -->
      <view class="header-brand" @click="navTo('/pages/index/index')">
        <AppLogo size="md" />
        <view class="brand-text-group">
          <text class="brand-name">全国医保待遇测算平台</text>
          <text class="brand-sub">
            <text class="desktop-sub">覆盖全国 348 统筹区 · 权威政策红头溯源</text>
            <text class="mobile-sub">全国 348 统筹区 · 官方政策精准溯源</text>
          </text>
        </view>
      </view>

      <!-- 中间：绝对对称恒定居中的 Tab 导航栏 (像素级零偏移) -->
      <view class="header-nav">
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'index' }" 
          @click="navTo('/pages/index/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="14" x2="16" y2="14.01"></line>
            <line x1="8" y1="14" x2="8" y2="14.01"></line>
            <line x1="12" y1="14" x2="12" y2="14.01"></line>
            <line x1="8" y1="18" x2="8" y2="18.01"></line>
            <line x1="12" y1="18" x2="12" y2="18.01"></line>
            <line x1="16" y1="18" x2="16" y2="18.01"></line>
          </svg>
          <text class="nav-label">报销测算</text>
        </view>
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'policy' }" 
          @click="navTo('/pages/policy/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <text class="nav-label">政策待遇</text>
        </view>
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'ranking' }" 
          @click="navTo('/pages/ranking/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <text class="nav-label">政策对比</text>
        </view>
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'service' || currentTab === 'remote' }" 
          @click="navTo('/pages/service/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
            <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
          </svg>
          <text class="nav-label">便民服务</text>
        </view>
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'correction' }" 
          @click="navTo('/pages/correction/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <text class="nav-label">政策纠错</text>
        </view>
      </view>

      <!-- 右侧：等宽对称区 (确保中间Tab栏居中) -->
      <view class="header-extra">
        <view class="status-pill">
          <view class="status-dot"></view>
          <text class="status-txt">348 统筹区政策在线</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AppLogo from './AppLogo.vue';

defineProps<{
  currentTab: 'index' | 'policy' | 'ranking' | 'remote' | 'service' | 'correction';
}>();

function navTo(url: string) {
  uni.switchTab({ url });
}
</script>

<style scoped>
.site-header {
  width: 100%;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.site-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .site-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.brand-text-group {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.brand-name {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
  white-space: nowrap !important;
  word-break: keep-all;
}

.brand-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 1px;
  white-space: nowrap !important;
  word-break: keep-all;
}

.desktop-sub {
  display: inline;
  white-space: nowrap !important;
  word-break: keep-all;
}

.mobile-sub {
  display: none;
  white-space: nowrap !important;
  word-break: keep-all;
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999rpx;
  padding: 3px;
  gap: 4px;
  flex-shrink: 0;
}

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999rpx;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: #64748b;
  white-space: nowrap !important;
  word-break: keep-all !important;
  flex-shrink: 0;
}

.tab-svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  stroke: currentColor;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #0f172a;
}

.nav-tab.active {
  background: #ffffff;
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.15);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.nav-label {
  font-size: 13px;
  font-weight: 600;
  color: inherit;
  white-space: nowrap !important;
  word-break: keep-all !important;
  line-height: 1;
}

.header-extra {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 12px;
  border-radius: 9999rpx;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.status-txt {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

@media (max-width: 767px) {
  .desktop-sub {
    display: none !important;
  }
  .mobile-sub {
    display: inline !important;
  }
  .site-header-inner {
    height: 52px;
    padding: 0 14px;
  }
  .header-nav {
    display: none;
  }
  .status-pill {
    display: none;
  }
}
</style>