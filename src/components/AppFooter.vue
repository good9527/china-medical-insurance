<template>
  <view class="site-footer">
    <view class="footer-inner">
      <!-- 上半区：网格布局 -->
      <view class="footer-grid">
        <!-- 左侧：品牌与政策严谨性说明 -->
        <view class="footer-col footer-col-brand">
          <view class="brand-row">
            <AppLogo size="sm" />
            <text class="footer-brand-title">{{ SITE_CONFIG.name }}</text>
          </view>
          <text class="footer-tagline">{{ SITE_CONFIG.brandSubDesktop }}</text>
          <text class="footer-disclaimer">{{ SITE_CONFIG.disclaimer }}</text>
        </view>

        <!-- 中间：联系与合作通道 -->
        <view class="footer-col footer-col-contact">
          <text class="col-title">联系作者 & 数据合作</text>
          <view class="contact-cards-group">
            <!-- 邮箱联系 -->
            <view class="contact-item" @click="copyText(SITE_CONFIG.email, '联系邮箱')">
              <view class="contact-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="c-svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </view>
              <view class="contact-item-body">
                <text class="contact-label">官方反馈邮箱</text>
                <text class="contact-val email-val">{{ SITE_CONFIG.email }}</text>
              </view>
              <text class="contact-copy-tip">复制</text>
            </view>

            <!-- 微信联系 -->
            <view class="contact-item" @click="copyText(SITE_CONFIG.wechat, '微信号')">
              <view class="contact-item-icon wx-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="c-svg">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </view>
              <view class="contact-item-body">
                <text class="contact-label">个人微信</text>
                <text class="contact-val">{{ SITE_CONFIG.wechat }}</text>
              </view>
              <text class="contact-copy-tip">复制</text>
            </view>
          </view>
        </view>

        <!-- 右侧：公众号与开源生态 -->
        <view class="footer-col footer-col-community">
          <text class="col-title">官方关注 & 开源项目</text>
          <view class="community-box">
            <!-- 公众号 -->
            <view class="community-row" @click="copyText(SITE_CONFIG.officialAccount, '微信公众号名称')">
              <view class="comm-badge">公众号</view>
              <view class="comm-detail">
                <text class="comm-name">{{ SITE_CONFIG.officialAccount }}</text>
                <text class="comm-sub">微信搜索关注 · 获取最新政策解析</text>
              </view>
              <text class="comm-copy-btn">复制名称 ↵</text>
            </view>

            <!-- 开发者与代码仓库 -->
            <view class="meta-links-row">
              <text class="dev-info">开发者：<text class="dev-name">{{ SITE_CONFIG.author }}</text></text>
              <view class="github-link" @click="openGithub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="git-svg">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <text class="git-txt">GitHub 开源仓库</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底下版权与备案栏 -->
      <view class="footer-bottom-bar">
        <text class="copyright-txt">© 2024–2026 {{ SITE_CONFIG.name }} · 覆盖全国 348 统筹区</text>
        <text class="license-txt">基于 MIT 协议完全开源 · 民生公益工具</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AppLogo from './AppLogo.vue';
import { SITE_CONFIG } from '../config/site';

function copyText(text: string, label: string) {
  if (typeof uni !== 'undefined' && uni.setClipboardData) {
    uni.setClipboardData({
      data: text,
      showToast: false,
      success: () => {
        uni.showToast({
          title: `${label}已复制`,
          icon: 'success',
          duration: 2000
        });
      },
      fail: () => {
        webFallbackCopy(text, label);
      }
    });
  } else {
    webFallbackCopy(text, label);
  }
}

function webFallbackCopy(text: string, label: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      uni.showToast({
        title: `${label}已复制`,
        icon: 'success',
        duration: 2000
      });
    }).catch(() => {
      promptManualCopy(text, label);
    });
  } else {
    promptManualCopy(text, label);
  }
}

function promptManualCopy(text: string, label: string) {
  uni.showModal({
    title: label,
    content: text,
    showCancel: false,
    confirmText: '我知道了'
  });
}

function openGithub() {
  const url = SITE_CONFIG.githubRepo;
  // #ifdef H5
  window.open(url, '_blank');
  // #endif
  // #ifndef H5
  copyText(url, 'GitHub 仓库地址');
  // #endif
}
</script>

<style scoped>
.site-footer {
  width: 100%;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  margin-top: 48px;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 28px;
  box-sizing: border-box;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.1fr;
  gap: 36px;
  align-items: start;
}

/* 品牌列 */
.footer-col-brand {
  display: flex;
  flex-direction: column;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.footer-brand-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.footer-tagline {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-disclaimer {
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
}

/* 标题通用 */
.col-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 14px;
  display: block;
}

/* 联系方式卡片组 */
.contact-cards-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.contact-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: translateY(-1px);
}

.contact-item-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-item-icon.wx-icon {
  background: #dcfce7;
  color: #16a34a;
}

.c-svg {
  width: 15px;
  height: 15px;
}

.contact-item-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-size: 11px;
  color: #64748b;
  line-height: 1.2;
}

.contact-val {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
  margin-top: 2px;
}

.email-val {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.contact-copy-tip {
  font-size: 11px;
  color: #2563eb;
  background: #ffffff;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

/* 社区与开发者列 */
.community-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.community-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.community-row:hover {
  background: #f0fdf4;
  border-color: #bbf7d0;
  transform: translateY(-1px);
}

.comm-badge {
  font-size: 11px;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 1;
  flex-shrink: 0;
}

.comm-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.comm-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.comm-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.comm-copy-btn {
  font-size: 11px;
  color: #16a34a;
  background: #ffffff;
  border: 1px solid #bbf7d0;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}

.meta-links-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px;
  gap: 10px;
  flex-wrap: wrap;
}

.dev-info {
  font-size: 12px;
  color: #64748b;
}

.dev-name {
  font-weight: 700;
  color: #0f172a;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  user-select: none;
}

.github-link:hover {
  text-decoration: underline;
}

.git-svg {
  width: 14px;
  height: 14px;
}

/* 底部收口栏 */
.footer-bottom-bar {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
  flex-wrap: wrap;
  gap: 10px;
}

/* 移动端深度优化适配与 TabBar 避让 */
@media (max-width: 767px) {
  .site-footer {
    margin-top: 32px;
    padding-bottom: calc(84px + env(safe-area-inset-bottom));
  }

  .footer-inner {
    padding: 24px 16px 16px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-bottom-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
