<template>
  <view class="site-header">
    <view class="site-header-inner">
      <!-- 左侧：简洁品牌 (去除浮夸官腔，搭载专属科技医保矢量Logo) -->
      <view class="header-brand" @click="navTo('/pages/home/index')">
        <AppLogo size="md" />
        <view class="brand-text-group">
          <text class="brand-name">全国医保待遇估算与政策查询</text>
          <text class="brand-sub">
            <text class="desktop-sub">覆盖全国 348 统筹区 · 公开政策整理与待遇估算参考</text>
            <text class="mobile-sub">全国 348 统筹区 · 公开政策整理参考</text>
          </text>
        </view>
      </view>

      <!-- 中间：绝对对称恒定居中的 Tab 导航栏 (像素级零偏移) -->
      <view class="header-nav">
        <view 
          class="nav-tab" 
          :class="{ active: currentTab === 'home' }" 
          @click="navTo('/pages/home/index')"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          <text class="nav-label">首页地图</text>
        </view>
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
          <text class="nav-label">报销估算</text>
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

      <!-- 右侧：等宽对称区 (联系作者与运行状态) -->
      <view class="header-extra">
        <view class="contact-pill" @click="showContactModal = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="contact-svg">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <text class="contact-txt">联系作者</text>
        </view>
        <view class="status-pill">
          <view class="status-dot"></view>
          <text class="status-txt">已收录 348 统筹区</text>
        </view>
      </view>
    </view>

    <!-- 全局快捷联系作者与数据合作弹窗 -->
    <view class="contact-modal-mask" v-if="showContactModal" @click="showContactModal = false">
      <view class="contact-modal-card" @click.stop>
        <view class="modal-head">
          <view class="head-brand">
            <AppLogo size="sm" />
            <text class="modal-title">联系作者 / 公文反馈与交流</text>
          </view>
          <text class="modal-close-btn" @click="showContactModal = false">✕</text>
        </view>

        <view class="modal-body">
          <text class="modal-desc">
            欢迎就全国 348 统筹区公开政策文件、待遇估算规则或公文勘误直接联系我们：
          </text>

          <view class="modal-contact-list">
            <view class="m-contact-item" @click="copyInfo(SITE_CONFIG.email, '邮箱')">
              <view class="m-icon mail-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="m-svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </view>
              <view class="m-info">
                <text class="m-k">官方反馈邮箱</text>
                <text class="m-v font-mono">{{ SITE_CONFIG.email }}</text>
              </view>
              <text class="m-copy-chip">复制</text>
            </view>

            <view class="m-contact-item" @click="copyInfo(SITE_CONFIG.wechat, '微信号')">
              <view class="m-icon wx-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="m-svg">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </view>
              <view class="m-info">
                <text class="m-k">个人微信</text>
                <text class="m-v">{{ SITE_CONFIG.wechat }}</text>
              </view>
              <text class="m-copy-chip">复制</text>
            </view>

            <view class="m-contact-item" @click="copyInfo(SITE_CONFIG.officialAccount, '公众号名称')">
              <view class="m-icon gzh-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="m-svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </view>
              <view class="m-info">
                <text class="m-k">微信公众号</text>
                <text class="m-v">{{ SITE_CONFIG.officialAccount }}</text>
              </view>
              <text class="m-copy-chip">复制</text>
            </view>
          </view>

          <view class="modal-foot">
            <text class="m-dev-tag">开发者：{{ SITE_CONFIG.author }}</text>
            <text class="m-repo-link" @click="openRepo">GitHub 仓库 ↗</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import AppLogo from './AppLogo.vue';
import { SITE_CONFIG } from '../config/site';

defineProps<{
  currentTab: 'home' | 'index' | 'policy' | 'ranking' | 'remote' | 'service' | 'correction';
}>();

const showContactModal = ref(false);

watch(showContactModal, (val) => {
  if (typeof document !== 'undefined') {
    if (val) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('modal-open');
  }
});

function navTo(url: string) {
  uni.switchTab({ url });
}

function copyInfo(text: string, label: string) {
  if (typeof uni !== 'undefined' && uni.setClipboardData) {
    uni.setClipboardData({
      data: text,
      showToast: false,
      success: () => {
        uni.showToast({ title: `${label}已复制`, icon: 'success' });
      },
      fail: () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(text);
          uni.showToast({ title: `${label}已复制`, icon: 'success' });
        }
      }
    });
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    uni.showToast({ title: `${label}已复制`, icon: 'success' });
  }
}

function openRepo() {
  const url = SITE_CONFIG.githubRepo;
  // #ifdef H5
  window.open(url, '_blank');
  // #endif
  // #ifndef H5
  copyInfo(url, 'GitHub 链接');
  // #endif
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
  gap: 10px;
  flex-shrink: 0;
}

.contact-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 9999rpx;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-pill:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  transform: translateY(-1px);
}

.contact-svg {
  width: 13px;
  height: 13px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.contact-txt {
  font-size: 11.5px;
  color: #1d4ed8;
  font-weight: 700;
  white-space: nowrap !important;
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

/* 弹窗遮罩与卡片 */
.contact-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 16px;
  box-sizing: border-box;
}

.contact-modal-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.2);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.head-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.modal-close-btn {
  font-size: 15px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.modal-body {
  padding: 18px;
}

.modal-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 14px;
  display: block;
}

.modal-contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.m-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.m-contact-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.m-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mail-bg { background: #dbeafe; color: #2563eb; }
.wx-bg { background: #dcfce7; color: #16a34a; }
.gzh-bg { background: #fef3c7; color: #d97706; }

.m-svg {
  width: 16px;
  height: 16px;
}

.m-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.m-k {
  font-size: 11px;
  color: #64748b;
}

.m-v {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 1px;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.m-copy-chip {
  font-size: 11px;
  color: #2563eb;
  background: #ffffff;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}

.modal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
}

.m-dev-tag {
  color: #64748b;
  font-weight: 600;
}

.m-repo-link {
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
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
  .contact-pill {
    padding: 3px 8px;
  }
  .contact-txt {
    font-size: 11px;
  }
}
</style>