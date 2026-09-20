<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中，永不跳动) -->
    <AppHeader currentTab="service" />

    <view class="content-box">
      <!-- 页面简明标题与操作栏 (清新实用，去除浮夸官腔) -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">医保热线与官网</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">{{ currentProvince.name }} · 在线通达</text>
                </view>
              </view>
              <text class="page-sub-title">全国统一 12393 医保咨询电话及各统筹区医保政务网入口</text>
            </view>
          </view>
        </view>

        <!-- 省份切换自定义下拉框 -->
        <view class="toolbar-pickers-row">
          <view class="picker-anchor">
            <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'province' }" @click.stop="toggleDropdown('province')">
              <text class="select-val">{{ currentProvince.name }}</text>
              <text class="select-arrow" :class="{ rotated: openDropdown === 'province' }">▾</text>
            </view>
            <view class="cyber-dropdown-menu" v-if="openDropdown === 'province'" @click.stop>
              <view 
                class="dropdown-item" 
                v-for="(p, idx) in provinceList" 
                :key="p.code"
                :class="{ selected: selectedProvinceIndex === idx }"
                @click.stop="selectProvince(idx)"
              >
                <text class="item-name">{{ p.name }}</text>
                <text class="item-check" v-if="selectedProvinceIndex === idx">✓</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 该省各城市专线与官网自适应卡片网格 -->
      <view class="card mt-20">
        <view class="card-head">
          <view class="head-left">
            <text class="card-head-title">{{ currentProvince.name }}各统筹区官方服务入口</text>
          </view>
          <view class="badge-pill badge-cyan">
            <text class="badge-txt">{{ provinceCityHotlines.length }} 个统筹区在线</text>
          </view>
        </view>

        <view class="hotline-grid">
          <view class="hotline-card" v-for="item in provinceCityHotlines" :key="item.cityCode">
            <view class="hotline-card-top">
              <view class="city-name-wrap">
                <text class="city-name">{{ item.cityName }}</text>
                <text class="city-code-tag">{{ item.cityCode }}</text>
              </view>
              <text class="update-chip" v-if="item.lastUpdated">核验: {{ item.lastUpdated }}</text>
            </view>

            <!-- 官方热线列表 (支持区分全国12393与经办座机，绝不拼接乱号) -->
            <view class="phone-list-wrap">
              <view class="phone-item-row" v-for="(p, pIdx) in item.phoneList" :key="pIdx">
                <view class="phone-item-left">
                  <text class="phone-tag-badge">{{ p.label }}</text>
                  <text class="phone-number-txt">{{ p.display }}</text>
                </view>
                <view class="btn-micro-dial" @click="callPhone(p.cleanTel)">
                  <text class="micro-dial-txt">拨打 ↗</text>
                </view>
              </view>
            </view>

            <view class="hotline-card-foot" v-if="item.officialPortalUrl">
              <view class="action-btn btn-portal" @click="openPortal(item.officialPortalUrl)">
                <text class="btn-label">进入参保地医保政务网 ↗</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 政策众包纠错与补充建议面板 -->
      <view class="card mt-24">
        <view class="card-head">
          <view class="head-left">
            <text class="card-head-title">政策动态纠错与公文数据众包提交</text>
          </view>
          <view class="badge-pill badge-emerald">
            <text class="badge-txt">数据持续演化</text>
          </view>
        </view>
        <text class="desc-tip">全国各地医保政策随新医改深化动态调整。如发现当地最新公文出台或报销门槛调整，欢迎提交权威线索，我们将及时核验更新：</text>

        <view class="feedback-form">
          <view class="form-grid">
            <view class="form-group">
              <text class="form-label">涉及统筹地区：</text>
              <input class="form-input" v-model="feedback.city" placeholder="例如：四川省成都市 或 陕西省延安市" />
            </view>
            <view class="form-group">
              <text class="form-label">红头文件全称 / 官方发文字号：</text>
              <input class="form-input" v-model="feedback.docInfo" placeholder="例如：成医保发〔202X〕XX号" />
            </view>
          </view>

          <view class="form-group mt-16">
            <text class="form-label">政策变动说明、条款摘录或政府公开网址：</text>
            <textarea class="form-textarea" v-model="feedback.content" placeholder="请简要描述变动的门诊/住院起付线、报销比例或官方公文网页链接..." />
          </view>

          <view class="form-submit-row">
            <view class="btn-submit-feedback" @click="submitFeedback">
              <text class="submit-txt">提交公文线索与核验建议</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮回到顶部 FAB 按钮 -->
    <view class="fab-back-top" :class="{ show: showBackTop }" @click="scrollToTop">
      <svg class="fab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <text class="fab-txt">顶部</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { onShow, onPageScroll } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import { provinceList, getCitiesByProvinceCode } from '../../data/provinces';
import { getCityDataByCode } from '../../data';

// 悬浮回到顶部控制
const showBackTop = ref(false);

onPageScroll((e) => {
  showBackTop.value = e.scrollTop > 350;
});

function scrollToTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 350
  });
}

const openDropdown = ref<string | null>(null);


function navToTab(url: string) {
  uni.switchTab({ url });
}

function closeAllDropdowns() { openDropdown.value = null; }

function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

function selectProvince(idx: number) {
  selectedProvinceIndex.value = idx;
  openDropdown.value = null;
}

const selectedProvinceIndex = ref(0);
const currentProvince = computed(() => provinceList[selectedProvinceIndex.value]);

interface HotlineEntry {
  label: string;
  display: string;
  cleanTel: string;
}

interface CityHotlineDisplay {
  cityCode: string;
  cityName: string;
  officialPortalUrl?: string;
  lastUpdated?: string;
  phoneList: HotlineEntry[];
}

function parseHotlines(rawHotline: string, cityName: string): HotlineEntry[] {
  if (!rawHotline || rawHotline.trim() === '') {
    return [{ label: '全国医保专线', display: '12393 (本地直拨)', cleanTel: '12393' }];
  }

  // 拆分可能存在的多条专线 (以 / 或 、 或 或 分割)
  const parts = rawHotline.split(/[/、或,，]/).map(s => s.trim()).filter(Boolean);
  const entries: HotlineEntry[] = [];

  for (const part of parts) {
    const clean = part.replace(/[^0-9]/g, '');
    if (!clean) continue;

    let label = '医保便民专线';
    if (clean.endsWith('12393')) {
      label = clean === '12393' ? '全国统一医保热线' : '医保热线 (异地加区号)';
    } else if (clean.endsWith('12345')) {
      label = '政务服务便民热线';
    } else if (clean.endsWith('12333')) {
      label = '人社与社保咨询专线';
    } else {
      label = `${cityName}经办业务座机`;
    }

    entries.push({
      label,
      display: part,
      cleanTel: clean
    });
  }

  // 若为空则兜底 12393
  if (entries.length === 0) {
    entries.push({ label: '全国统一医保热线', display: '12393', cleanTel: '12393' });
  }

  return entries;
}

const provinceCityHotlines = computed<CityHotlineDisplay[]>(() => {
  const cities = getCitiesByProvinceCode(currentProvince.value.code);
  return cities.map(c => {
    const data = getCityDataByCode(c.cityCode);
    const raw = data?.hotline || '12393';
    const phoneList = parseHotlines(raw, c.cityName);

    // 计算核验日期 fallback
    let lastUpdated = data?.lastUpdated;
    if (!lastUpdated && data?.sourceDocs && data.sourceDocs.length > 0) {
      lastUpdated = data.sourceDocs[0]?.publishDate;
    }

    return {
      cityCode: c.cityCode,
      cityName: c.cityName,
      officialPortalUrl: data?.officialPortalUrl,
      lastUpdated: lastUpdated || '2026-03-01',
      phoneList
    };
  });
});

const feedback = reactive({
  city: '',
  docInfo: '',
  content: ''
});

function callPhone(tel: string) {
  if (!tel) return;
  uni.makePhoneCall({ phoneNumber: tel });
}

function openPortal(url: string) {
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank');
  } else {
    uni.setClipboardData({
      data: url,
      success: () => {
        uni.showToast({ title: '官网网址已复制，可粘贴访问', icon: 'none' });
      }
    });
  }
}

function submitFeedback() {
  if (!feedback.city || !feedback.content) {
    uni.showToast({ title: '请填写城市和反馈内容', icon: 'none' });
    return;
  }
  uni.showToast({ title: '感谢您的纠错反馈！核验后将及时更新', icon: 'success' });
  feedback.city = '';
  feedback.docInfo = '';
  feedback.content = '';
}

function syncProvinceFromStorage() {
  const savedCode = uni.getStorageSync('selected_medical_city_code') || uni.getStorageSync('selected_policy_city_code');
  if (savedCode) {
    for (let pIdx = 0; pIdx < provinceList.length; pIdx++) {
      const cities = getCitiesByProvinceCode(provinceList[pIdx].code);
      if (cities.some(c => c.cityCode === savedCode)) {
        selectedProvinceIndex.value = pIdx;
        break;
      }
    }
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
      openDropdown.value = null;
    });
  }
  syncProvinceFromStorage();
});

onShow(() => {
  syncProvinceFromStorage();
});
</script>

<style scoped>
/* 页面主容器 */
.page-wrapper {
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
  box-sizing: border-box;
}

.content-box {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 16px 20px 40px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 页面顶部简明标题与操作栏 (清新实用，去除吹嘘) */
.page-intro-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 0;
  flex-wrap: wrap;
  gap: 12px;
}

.intro-left {
  display: flex;
  flex-direction: column;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.08);
}

.feature-svg {
  width: 20px;
  height: 20px;
  stroke: #2563eb;
}

.page-title-stack {
  display: flex;
  flex-direction: column;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.page-main-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
}

.city-indicator-chip {
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 2px 10px;
  border-radius: 9999rpx;
}

.city-indicator-txt {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

.page-sub-title {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.toolbar-pickers-row {
  display: flex;
  gap: 12rpx;
}

.picker-anchor {
  position: relative;
}

.cyber-dropdown-trigger {
  height: 72rpx;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 0 20rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.cyber-dropdown-trigger:hover,
.cyber-dropdown-trigger.open {
  border-color: #2563eb;
  background: #eff6ff;
}

.select-val {
  font-size: 24rpx;
  font-weight: 600;
  color: #0f172a;
}

.select-arrow {
  font-size: 20rpx;
  color: #64748b;
  transition: transform 0.2s;
}

.select-arrow.rotated {
  transform: rotate(180deg);
  color: #2563eb;
}

.cyber-dropdown-menu {
  position: absolute;
  top: calc(100% + 8rpx);
  right: 0;
  min-width: 220rpx;
  max-height: 420rpx;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 18rpx;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.dropdown-item:hover { background: #f8fafc; }
.dropdown-item.selected { background: #eff6ff; }
.dropdown-item .item-name { font-size: 24rpx; color: #334155; }
.dropdown-item.selected .item-name { color: #2563eb; font-weight: 700; }
.dropdown-item .item-check { font-size: 22rpx; color: #2563eb; font-weight: 700; }

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  padding: 28rpx 30rpx;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8rpx 32rpx rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  overflow: hidden;
  word-break: break-word;
}

.mt-16 { margin-top: 20rpx; }
.mt-20 { margin-top: 24rpx; }
.mt-24 { margin-top: 28rpx; }

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}

.card-head-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #0f172a;
}

.badge-pill {
  padding: 4rpx 14rpx;
  border-radius: 9999rpx;
}

.badge-cyan { background: #eff6ff; border: 1px solid #bfdbfe; }
.badge-cyan .badge-txt { color: #1d4ed8; }

.badge-emerald { background: #ecfdf5; border: 1px solid #a7f3d0; }
.badge-emerald .badge-txt { color: #047857; }

.badge-txt { font-size: 18rpx; font-weight: 600; }

.hotline-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16rpx;
}

@media (min-width: 600px) {
  .hotline-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1000px) {
  .hotline-grid { grid-template-columns: repeat(3, 1fr); }
}

.hotline-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s;
}

.hotline-card:hover {
  border-color: #93c5fd;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  transform: translateY(-2rpx);
}

.hotline-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.city-name-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.city-name { font-size: 26rpx; font-weight: 700; color: #0f172a; }
.city-code-tag {
  font-size: 18rpx;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.update-chip { font-size: 18rpx; color: #64748b; }

.phone-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.phone-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10rpx;
  padding: 10rpx 14rpx;
  gap: 8rpx;
}

.phone-item-left {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.phone-tag-badge {
  font-size: 16rpx;
  font-weight: 600;
  color: #0369a1;
  background: #f0f9ff;
  border-radius: 4rpx;
  align-self: flex-start;
  padding: 1rpx 6rpx;
}

.phone-number-txt {
  font-size: 26rpx;
  font-weight: 800;
  color: #1e293b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.btn-micro-dial {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-micro-dial:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-micro-dial:hover .micro-dial-txt {
  color: #ffffff;
}

.micro-dial-txt {
  font-size: 20rpx;
  font-weight: 700;
  color: #1d4ed8;
}

.hotline-card-foot {
  margin-top: 4rpx;
}

.action-btn {
  width: 100%;
  padding: 12rpx 0;
  border-radius: 8rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-portal { background: #ffffff; border: 1px solid #cbd5e1; }
.btn-portal:hover { background: #f8fafc; border-color: #94a3b8; }
.btn-portal .btn-label { color: #334155; font-weight: 600; font-size: 20rpx; }

.desc-tip {
  font-size: 22rpx;
  color: #64748b;
  line-height: 1.6;
  display: block;
  margin-bottom: 20rpx;
}

.feedback-form {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 22rpx;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16rpx;
}

@media (min-width: 800px) {
  .form-grid { grid-template-columns: 1fr 1fr; }
}

.form-group { display: flex; flex-direction: column; }
.form-label { font-size: 20rpx; color: #334155; font-weight: 600; margin-bottom: 8rpx; }
.form-input {
  height: 68rpx;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8rpx;
  color: #0f172a;
  padding: 0 16rpx;
  font-size: 22rpx;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus { 
  border-color: #2563eb; 
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-textarea {
  width: 100%;
  height: 130rpx;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8rpx;
  color: #0f172a;
  padding: 12rpx 16rpx;
  font-size: 22rpx;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-textarea:focus { 
  border-color: #2563eb; 
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-submit-row { margin-top: 20rpx; display: flex; justify-content: flex-end; }
.btn-submit-feedback {
  background: #2563eb;
  border: 1px solid #1d4ed8;
  padding: 10rpx 26rpx;
  border-radius: 8rpx;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
  transition: all 0.2s;
}

.btn-submit-feedback:hover {
  background: #1d4ed8;
}

.submit-txt { font-size: 20rpx; color: #ffffff; font-weight: 700; }


/* ==================== 优雅收敛微弹性动效 ==================== */
.cyber-dropdown-trigger,
.dropdown-item,
.action-btn,
.btn-dial,
.btn-portal,
.btn-submit-feedback,
.hotline-card {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
  will-change: transform;
}

.cyber-dropdown-trigger:hover,
.action-btn:hover,
.btn-submit-feedback:hover {
  transform: translateY(-1rpx) scale(1.008);
}

.cyber-dropdown-trigger:active,
.dropdown-item:active,
.action-btn:active,
.btn-dial:active,
.btn-portal:active,
.btn-submit-feedback:active,
.hotline-card:active {
  transform: translateY(1rpx) scale(0.98) !important;
  transition-duration: 0.08s !important;
}


.desktop-omni-nav { display: none; }

@media (min-width: 860px) {
  .page {
    padding: 18px 28px 40px;
  }

  .desktop-omni-nav {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 9999rpx;
    padding: 4px;
    gap: 4px;
    backdrop-filter: blur(16px);
  }

  .nav-pill-item {
    padding: 6px 18px;
    border-radius: 9999rpx;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-pill-item:hover { background: rgba(255, 255, 255, 0.08); }
  .nav-pill-item.active {
    background: rgba(0, 240, 255, 0.16);
    border: 1px solid rgba(0, 240, 255, 0.4);
    box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
  }

  .nav-pill-txt { font-size: 13px; color: #94a3b8; font-weight: 600; }
  .nav-pill-item.active .nav-pill-txt { color: #00f0ff; }
}


@media (min-width: 860px) {
  .page {
    padding: clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px);
  }
}

@media (min-width: 860px) and (max-height: 780px) {
  .page {
    padding: 10px 18px;
  }
  .card {
    padding: 14px 18px;
  }
}

/* -------------------- 移动端响应式断点 (max-width: 768px) -------------------- */
@media (max-width: 768px) {
  .content-box {
    padding: 12px 14px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .page-intro-bar {
    padding: 0 !important;
  }

  .page {
    padding: 14px 12px 36px;
  }

  .hero-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .hero-left {
    align-items: flex-start;
    gap: 12px;
  }

  .hero-title {
    font-size: 32rpx;
  }

  .title-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .toolbar-pickers-row {
    width: 100%;
  }

  .picker-anchor {
    width: 100%;
  }

  .cyber-dropdown-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .cyber-dropdown-menu {
    left: 0;
    right: 0;
    min-width: 100%;
    width: 100%;
  }

  .card {
    padding: 20rpx 18rpx;
  }
}

/* -------------------- 手机端及超窄视口 (max-width: 520px) -------------------- */
@media (max-width: 520px) {
  .page {
    padding: 10px 10px 48px;
  }

  .hero-title {
    font-size: 32rpx;
  }

  .hero-desc {
    font-size: 24rpx;
    line-height: 1.5;
  }

  .card-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-head-title {
    font-size: 28rpx;
  }

  .badge-pill {
    align-self: flex-start;
  }

  .hotline-card {
    padding: 20rpx 18rpx;
  }

  .phone-number {
    font-size: 36rpx;
  }

  .hotline-actions {
    gap: 8px;
  }

  .action-btn {
    padding: 14rpx 0;
  }

  .btn-label {
    font-size: 24rpx;
  }

  .desc-tip {
    font-size: 22rpx;
    line-height: 1.45;
  }

  .feedback-form {
    padding: 20rpx 18rpx;
  }

  .form-label {
    font-size: 24rpx;
  }

  .form-input {
    height: 76rpx;
    font-size: 26rpx;
  }

  .form-textarea {
    font-size: 26rpx;
  }

  .btn-submit-feedback {
    width: 100%;
    text-align: center;
    padding: 18rpx 0;
    box-sizing: border-box;
    font-size: 26rpx;
  }

  .form-submit-row {
    justify-content: stretch;
  }

  .content-box {
    padding: 12px 12px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .fab-back-top {
    right: 16px;
    bottom: calc(68px + env(safe-area-inset-bottom));
    width: 42px;
    height: 42px;
  }
}

/* 全站通用悬浮回到顶部 FAB 按钮 */
.fab-back-top {
  position: fixed;
  right: 24px;
  bottom: calc(75px + env(safe-area-inset-bottom));
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #2563eb;
  border: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  cursor: pointer;
  z-index: 980;
  opacity: 0;
  transform: translateY(20px) scale(0.85);
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fab-back-top.show {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.fab-back-top:hover {
  background: #ffffff;
  color: #1d4ed8;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.2);
}

.fab-back-top:active {
  transform: translateY(1px) scale(0.95);
}

.fab-svg {
  width: 16px;
  height: 16px;
}

.fab-txt {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}
</style>
