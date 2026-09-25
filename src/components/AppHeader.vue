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
    <!-- 全局快捷联系作者与数据合作弹窗 (H5 环境下 Teleport 至 body，彻底脱离父级 sticky/backdrop-filter 包含块) -->
    <!-- #ifdef H5 -->
    <teleport to="body">
      <view class="contact-modal-mask" v-if="showContactModal" @click="showContactModal = false">
        <view class="contact-modal-card" @click.stop>
          <view class="modal-head">
            <view class="head-brand">
              <AppLogo size="sm" />
              <view class="brand-text-col">
                <text class="modal-title">联系作者 · 医保数据合作与公文交流</text>
                <text class="modal-badge-sub">国家医保政策开源协同 · 覆盖 348 统筹区</text>
              </view>
            </view>
            <view class="modal-close-round" @click="showContactModal = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="close-x-svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </view>
          </view>

          <view class="modal-body">
            <view class="modal-intro-pill">
              <span class="intro-dot"></span>
              <text class="intro-txt">欢迎就地方最新政策变动、报销算法公文或勘误建议直接交流：</text>
            </view>

            <view class="contact-bento-grid">
              <!-- 1. 官方反馈邮箱 -->
              <view class="bento-tile tile-mail" @click="copyInfo(SITE_CONFIG.email, '邮箱')">
                <view class="tile-head">
                  <view class="tile-icon-box box-mail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </view>
                  <text class="tile-chip chip-mail">点击复制</text>
                </view>
                <text class="tile-label">官方反馈邮箱</text>
                <text class="tile-val font-mono">{{ SITE_CONFIG.email }}</text>
              </view>

              <!-- 2. 个人微信 -->
              <view class="bento-tile tile-wx" @click="copyInfo(SITE_CONFIG.wechat, '微信号')">
                <view class="tile-head">
                  <view class="tile-icon-box box-wx">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </view>
                  <text class="tile-chip chip-wx">点击复制</text>
                </view>
                <text class="tile-label">作者个人微信</text>
                <text class="tile-val font-mono">{{ SITE_CONFIG.wechat }}</text>
              </view>

              <!-- 3. 微信公众号 -->
              <view class="bento-tile tile-gzh" @click="copyInfo(SITE_CONFIG.officialAccount, '公众号名称')">
                <view class="tile-head">
                  <view class="tile-icon-box box-gzh">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </view>
                  <text class="tile-chip chip-gzh">点击复制</text>
                </view>
                <text class="tile-label">微信公众号</text>
                <text class="tile-val">{{ SITE_CONFIG.officialAccount }}</text>
              </view>

              <!-- 4. 政策纠错与公文提报直通入口 -->
              <view class="bento-tile tile-corr" @click="navTo('/pages/correction/index'); showContactModal = false">
                <view class="tile-head">
                  <view class="tile-icon-box box-corr">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </view>
                  <text class="tile-chip chip-corr">立即前往 ↗</text>
                </view>
                <text class="tile-label">公文勘误与政策纠错</text>
                <text class="tile-val text-purple">进入协同纠错通道</text>
              </view>
            </view>

            <view class="modal-foot">
              <view class="foot-author-badge">
                <text class="foot-author-txt">项目维护者：{{ SITE_CONFIG.author }}</text>
              </view>
              <view class="foot-repo-btn" @click="openRepo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="repo-svg">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <text class="foot-repo-txt">开源代码仓库 ↗</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </teleport>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <view class="contact-modal-mask" v-if="showContactModal" @click="showContactModal = false">
      <view class="contact-modal-card" @click.stop>
        <view class="modal-head">
          <view class="head-brand">
            <AppLogo size="sm" />
            <view class="brand-text-col">
              <text class="modal-title">联系作者 · 医保数据合作与公文交流</text>
              <text class="modal-badge-sub">国家医保政策开源协同 · 覆盖 348 统筹区</text>
            </view>
          </view>
          <view class="modal-close-round" @click="showContactModal = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="close-x-svg">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <view class="modal-body">
          <view class="modal-intro-pill">
            <span class="intro-dot"></span>
            <text class="intro-txt">欢迎就地方最新政策变动、报销算法公文或勘误建议直接交流：</text>
          </view>

          <view class="contact-bento-grid">
            <!-- 1. 官方反馈邮箱 -->
            <view class="bento-tile tile-mail" @click="copyInfo(SITE_CONFIG.email, '邮箱')">
              <view class="tile-head">
                <view class="tile-icon-box box-mail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </view>
                <text class="tile-chip chip-mail">点击复制</text>
              </view>
              <text class="tile-label">官方反馈邮箱</text>
              <text class="tile-val font-mono">{{ SITE_CONFIG.email }}</text>
            </view>

            <!-- 2. 个人微信 -->
            <view class="bento-tile tile-wx" @click="copyInfo(SITE_CONFIG.wechat, '微信号')">
              <view class="tile-head">
                <view class="tile-icon-box box-wx">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </view>
                <text class="tile-chip chip-wx">点击复制</text>
              </view>
              <text class="tile-label">作者个人微信</text>
              <text class="tile-val font-mono">{{ SITE_CONFIG.wechat }}</text>
            </view>

            <!-- 3. 微信公众号 -->
            <view class="bento-tile tile-gzh" @click="copyInfo(SITE_CONFIG.officialAccount, '公众号名称')">
              <view class="tile-head">
                <view class="tile-icon-box box-gzh">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </view>
                <text class="tile-chip chip-gzh">点击复制</text>
              </view>
              <text class="tile-label">微信公众号</text>
              <text class="tile-val">{{ SITE_CONFIG.officialAccount }}</text>
            </view>

            <!-- 4. 政策纠错与公文提报直通入口 -->
            <view class="bento-tile tile-corr" @click="navTo('/pages/correction/index'); showContactModal = false">
              <view class="tile-head">
                <view class="tile-icon-box box-corr">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tile-svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </view>
                <text class="tile-chip chip-corr">立即前往 ↗</text>
              </view>
              <text class="tile-label">公文勘误与政策纠错</text>
              <text class="tile-val text-purple">进入协同纠错通道</text>
            </view>
          </view>

          <view class="modal-foot">
            <view class="foot-author-badge">
              <text class="foot-author-txt">项目维护者：{{ SITE_CONFIG.author }}</text>
            </view>
            <view class="foot-repo-btn" @click="openRepo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="repo-svg">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <text class="foot-repo-txt">开源代码仓库 ↗</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->
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

// 支持按 ESC 键平滑关闭弹窗
if (typeof window !== 'undefined') {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showContactModal.value) {
      showContactModal.value = false;
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
}

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('modal-open');
  }
});

const TAB_BAR_PAGES = [
  '/pages/home/index',
  '/pages/index/index',
  '/pages/policy/index',
  '/pages/ranking/index',
  '/pages/service/index'
];

function navTo(url: string) {
  if (TAB_BAR_PAGES.includes(url)) {
    uni.switchTab({ url });
  } else {
    uni.navigateTo({ url });
  }
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
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
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

/* 弹窗遮罩与卡片 (电影级深邃渐进多层散焦，彻底融化背景割裂感) */
.contact-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.82) 0%, rgba(8, 12, 24, 0.95) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 16px;
  box-sizing: border-box;
  animation: modalFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.contact-modal-card {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 36px 90px -16px rgba(15, 23, 42, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden;
  animation: cardSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardSlideUp {
  from { opacity: 0; transform: scale(0.96) translateY(14px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* 弹窗头部 (科技深蓝微光渐变，沉稳大气) */
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
}

.head-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-text-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.modal-title {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.2px;
}

.modal-badge-sub {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.2px;
}

.modal-close-round {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close-round:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

.close-x-svg {
  width: 14px;
  height: 14px;
  stroke: #ffffff;
}

/* 弹窗主体 */
.modal-body {
  padding: 18px 20px;
}

.modal-intro-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 14px;
  width: 100%;
  box-sizing: border-box;
}

.intro-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
}

.intro-txt {
  font-size: 11.5px;
  color: #475569;
  line-height: 1.4;
}

/* 2x2 Bento 科技卡片网格 */
.contact-bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.bento-tile {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.bento-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -2px rgba(15, 23, 42, 0.08);
}

.tile-mail {
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  border-color: #bfdbfe;
}

.tile-wx {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  border-color: #bbf7d0;
}

.tile-gzh {
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  border-color: #fde68a;
}

.tile-corr {
  background: linear-gradient(135deg, #faf5ff 0%, #ffffff 100%);
  border-color: #e9d5ff;
}

.tile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.tile-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.box-mail { background: #dbeafe; color: #2563eb; }
.box-wx { background: #dcfce7; color: #16a34a; }
.box-gzh { background: #fef3c7; color: #d97706; }
.box-corr { background: #ede9fe; color: #7c3aed; }

.tile-svg {
  width: 15px;
  height: 15px;
}

.tile-chip {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  line-height: 1.4;
}

.chip-mail { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.chip-wx { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-gzh { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.chip-corr { background: #7c3aed; color: #ffffff; }

.tile-label {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
}

.tile-val {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-purple {
  color: #7c3aed !important;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* 底部铭牌栏 */
.modal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.foot-author-badge {
  display: inline-flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
}

.foot-author-txt {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.foot-repo-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #0f172a;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.18s ease;
}

.foot-repo-btn:hover {
  background: #1e293b;
}

.repo-svg {
  width: 12px;
  height: 12px;
}

.foot-repo-txt {
  font-size: 11.5px;
  font-weight: 600;
}

@media (max-width: 580px) {
  .contact-bento-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
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