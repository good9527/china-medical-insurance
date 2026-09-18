<template>
  <view class="site-header">
    <view class="site-header-inner">
      <!-- 左侧：简洁品牌 (去除浮夸官腔，搭载专属科技医保矢量Logo) -->
      <view class="header-brand" @click="navTo('/pages/index/index')">
        <AppLogo size="md" />
        <view class="brand-text-group">
          <text class="brand-name">医保报销助手</text>
          <text class="brand-sub">测算与政策参考工具</text>
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
          :class="{ active: currentTab === 'remote' }" 
          @click="navTo('/pages/remote/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <text class="nav-label">异地就医</text>
        </view>
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'service' }" 
          @click="navTo('/pages/service/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <text class="nav-label">服务热线</text>
        </view>
      </view>

      <!-- 右侧：等宽对称区 (与左侧240px完全对称，确保中间Tab栏绝对恒定居中) -->
      <view class="header-extra">
        <view class="status-pill">
          <view class="status-dot"></view>
          <text class="status-txt">国家法定政策核验</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AppLogo from './AppLogo.vue';

defineProps<{
  currentTab: 'index' | 'policy' | 'remote' | 'service';
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
  max-width: 1160px;
  margin: 0 auto;
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

/* 桌面端：经典对称 3 栏 Grid，左右均为 240px，确保中间 Tab 栏处于绝对几何正中心 */
@media (min-width: 860px) {
  .site-header-inner {
    display: grid;
    grid-template-columns: 240px 1fr 240px;
    align-items: center;
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.brand-text-group {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.brand-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 1px;
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
  margin: 0 auto;
}

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 9999rpx;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: #64748b;
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
}

.header-extra {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

@media (max-width: 859px) {
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