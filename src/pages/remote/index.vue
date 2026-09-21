<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中，永不跳动) -->
    <AppHeader currentTab="remote" />

    <view class="content-box">
      <!-- 页面简明标题与操作栏 (清新实用，去除浮夸官腔) -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">异地就医指南</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">参保地: {{ currentCityOption.cityName }}</text>
                </view>
              </view>
              <text class="page-sub-title">外地就医直接联网结算流程、各就医场景报销折算比例及备案提醒</text>
            </view>
          </view>
        </view>

        <!-- 地区切换自定义下拉框 -->
        <view class="toolbar-pickers-row">
          <!-- 省份下拉 -->
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

          <!-- 城市下拉 -->
          <view class="picker-anchor">
            <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'city' }" @click.stop="toggleDropdown('city')">
              <text class="select-val">{{ currentCityOption.cityName }}</text>
              <text class="select-arrow" :class="{ rotated: openDropdown === 'city' }">▾</text>
            </view>
            <view class="cyber-dropdown-menu" v-if="openDropdown === 'city'" @click.stop>
              <view 
                class="dropdown-item" 
                v-for="(c, idx) in cityOptions" 
                :key="c.cityCode"
                :class="{ selected: selectedCityIndex === idx }"
                @click.stop="selectCity(idx)"
              >
                <text class="item-name">{{ c.cityName }}</text>
                <text class="item-check" v-if="selectedCityIndex === idx">✓</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 参保地异地就医折算细则 (4色科技指标网格) -->
      <view class="card mt-20">
        <view class="card-head">
          <view class="head-left">
            <text class="card-head-title">{{ currentCity.cityName }} 异地就医报销折算比例</text>
          </view>
          <view class="segment-switch-sm">
            <view 
              class="switch-pill" 
              :class="{ active: currentType === 'employee' }"
              @click="currentType = 'employee'"
            >
              <text class="pill-txt">职工医保</text>
            </view>
            <view 
              class="switch-pill" 
              :class="{ active: currentType === 'resident' }"
              @click="currentType = 'resident'"
            >
              <text class="pill-txt">居民医保</text>
            </view>
          </view>
        </view>

        <!-- 4大折算比例网格 -->
        <view class="ratio-grid">
          <!-- 01 长期居住 -->
          <view class="ratio-card border-emerald">
            <view class="ratio-top">
              <text class="ratio-tag text-emerald">同城同待遇</text>
              <text class="ratio-seq">01</text>
            </view>
            <text class="r-label">长期居住 / 异地安置</text>
            <view class="r-num-row">
              <text class="r-val text-emerald">{{ Math.round(remotePolicy.longTermFiledRatio * 100) }}%</text>
            </view>
            <text class="r-sub">已规范备案，享受参保地同等报销待遇</text>
          </view>

          <!-- 02 规范转诊 -->
          <view class="ratio-card border-cyan">
            <view class="ratio-top">
              <text class="ratio-tag text-cyan">规范转诊</text>
              <text class="ratio-seq">02</text>
            </view>
            <text class="r-label">按规定转诊转院</text>
            <view class="r-num-row">
              <text class="r-val text-cyan">{{ Math.round(remotePolicy.transferFiledRatio * 100) }}%</text>
            </view>
            <text class="r-sub">由定点医疗机构开具转诊证明并完成备案</text>
          </view>

          <!-- 03 异地急诊 -->
          <view class="ratio-card border-amber">
            <view class="ratio-top">
              <text class="ratio-tag text-amber">突发抢救</text>
              <text class="ratio-seq">03</text>
            </view>
            <text class="r-label">异地急诊抢救</text>
            <view class="r-num-row">
              <text class="r-val text-amber">{{ Math.round(remotePolicy.unfiledEmergencyRatio * 100) }}%</text>
            </view>
            <text class="r-sub">急诊抢救留观病历符合条件视同转诊待遇</text>
          </view>

          <!-- 04 自行就医 -->
          <view class="ratio-card border-rose">
            <view class="ratio-top">
              <text class="ratio-tag text-rose">未备案降点</text>
              <text class="ratio-seq">04</text>
            </view>
            <text class="r-label">自行就医 (未备案)</text>
            <view class="r-num-row">
              <text class="r-val text-rose">{{ Math.round(remotePolicy.unfiledNormalRatio * 100) }}%</text>
            </view>
            <text class="r-sub">未办理备案自行前往外地，比例受扣减惩罚</text>
          </view>
        </view>

        <!-- 推荐备案通道与注意事项 (双列网格) -->
        <view class="dual-info-grid mt-20">
          <view class="info-box" v-if="remotePolicy.filingChannels && remotePolicy.filingChannels.length > 0">
            <text class="info-head">推荐线上自助备案渠道</text>
            <view class="chip-tags-row">
              <text class="info-chip" v-for="ch in remotePolicy.filingChannels" :key="ch">{{ ch }}</text>
            </view>
          </view>

          <view class="info-box" v-if="remotePolicy.specialNotes && remotePolicy.specialNotes.length > 0">
            <text class="info-head">统筹区经办特别提示</text>
            <view class="memo-list">
              <view class="memo-item" v-for="(note, idx) in remotePolicy.specialNotes" :key="idx">
                <text class="memo-dot">·</text>
                <text class="memo-txt">{{ note }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 下半部分：自助备案 4 步流程与核心黄金法则 (双栏并排) -->
      <view class="bottom-dual-grid mt-24">
        <!-- 手机极速备案 4 步流程 -->
        <view class="card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">手机极速自助备案 4 步流程</text>
            </view>
          </view>
          
          <view class="step-timeline">
            <view class="timeline-row">
              <view class="step-badge">1</view>
              <view class="step-body">
                <text class="step-name">登录官方备案平台</text>
                <text class="step-info">微信搜索“国家异地就医备案”小程序，或登录“国家医保服务平台”App，亦可直接使用参保省市地方政务医保小程序。</text>
              </view>
            </view>

            <view class="timeline-row">
              <view class="step-badge">2</view>
              <view class="step-body">
                <text class="step-name">选定人员类型与就医省市</text>
                <text class="step-info">长期居住人员凭居住证承诺享受参保地同等报销比例；临时就医因病情转院治疗按转诊比例执行。</text>
              </view>
            </view>

            <view class="timeline-row">
              <view class="step-badge">3</view>
              <view class="step-body">
                <text class="step-name">在线提交并即时开通生效</text>
                <text class="step-info">全国绝大多数统筹区临时外出就医支持“自助开通，即时生效”；可在“备案记录”中实时查看回执。</text>
              </view>
            </view>

            <view class="timeline-row">
              <view class="step-badge">4</view>
              <view class="step-body">
                <text class="step-name">出院出示医保码直接联网结算</text>
                <text class="step-info">出院缴费时主动出示国家医保电子凭证或全国社保卡，统筹基金直接扣减，仅需支付自费自理部分。</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 异地就医两大核心法则 -->
        <view class="card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">跨省异地就医两大核心法则</text>
            </view>
          </view>

          <view class="rule-card">
            <view class="rule-seq-tag text-cyan">法则一</view>
            <text class="rule-headline">“就医地目录，参保地政策”</text>
            <text class="rule-paragraph">哪些药品、耗材和诊疗服务项目能纳入报销？严格按【就医所在省市】的医保目录执行；起付标准是多少、报销比例多高、统筹封顶限额多大？严格按【参保统筹区（{{ currentCity.cityName }}）】的医保政策测算执行。</text>
          </view>

          <view class="rule-card mt-16">
            <view class="rule-seq-tag text-amber">法则二</view>
            <text class="rule-headline">出院结算前务必完成备案，避免降点</text>
            <text class="rule-paragraph">若未提前办理转诊手续且未提前备案直接前往外地住院，统筹基金支付比例通常会被扣减 10%~20%（急诊抢救除外）。务必在出院结账前通过手机端完成自助补办备案。</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import { provinceList, getCitiesByProvinceCode, getCityData } from '../../data/provinces';

onMounted(() => {
  uni.switchTab({ url: '/pages/service/index' });
});

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
  selectedCityIndex.value = 0;
  openDropdown.value = null;
  persistCityChoice();
}

function selectCity(idx: number) {
  selectedCityIndex.value = idx;
  openDropdown.value = null;
  persistCityChoice();
}

function persistCityChoice() {
  if (currentCityOption.value?.cityCode) {
    uni.setStorageSync('selected_medical_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_type', currentType.value);
  }
}

function syncCityFromStorage() {
  try {
    const targetCityCode = uni.getStorageSync('selected_medical_city_code') || uni.getStorageSync('selected_policy_city_code');
    if (targetCityCode && targetCityCode !== currentCityOption.value.cityCode) {
      for (let pIdx = 0; pIdx < provinceList.length; pIdx++) {
        const p = provinceList[pIdx];
        const cities = getCitiesByProvinceCode(p.code);
        const cIdx = cities.findIndex(c => c.cityCode === targetCityCode);
        if (cIdx !== -1) {
          selectedProvinceIndex.value = pIdx;
          selectedCityIndex.value = cIdx;
          break;
        }
      }
    }

    const targetType = uni.getStorageSync('selected_policy_type');
    if (targetType === 'employee' || targetType === 'resident') {
      currentType.value = targetType;
    }
  } catch (e) {
    console.error('Failed to sync remote city:', e);
  }
}

const selectedProvinceIndex = ref(0);
const currentProvince = computed(() => provinceList[selectedProvinceIndex.value]);

const cityOptions = computed(() => getCitiesByProvinceCode(currentProvince.value.code));
const selectedCityIndex = ref(0);
const currentCityOption = computed(() => {
  const list = cityOptions.value;
  if (!list || list.length === 0) {
    return { cityCode: '610100', cityName: '西安市', provinceCode: '610000', hasData: true };
  }
  return list[selectedCityIndex.value] || list[0];
});

const currentCity = computed(() => {
  const code = currentCityOption.value.hasData ? currentCityOption.value.cityCode : '610100';
  return getCityData(code)!;
});

const currentType = ref<'employee' | 'resident'>('employee');
const remotePolicy = computed(() => currentCity.value[currentType.value].remoteMedical);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
      openDropdown.value = null;
    });
  }
  syncCityFromStorage();
});

onShow(() => {
  syncCityFromStorage();
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

.segment-switch-sm {
  display: flex;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8rpx;
  padding: 4rpx;
  gap: 4rpx;
}

.switch-pill {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.switch-pill.active {
  background: #ffffff;
  border: 1px solid rgba(37, 99, 235, 0.25);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.pill-txt {
  font-size: 20rpx;
  color: #64748b;
  font-weight: 600;
}

.switch-pill.active .pill-txt {
  color: #2563eb;
}

.ratio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

@media (min-width: 900px) {
  .ratio-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.ratio-card {
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ratio-card:hover {
  transform: translateY(-2rpx);
}

.border-emerald { 
  background: #f0fdf4; 
  border: 1px solid #bbf7d0; 
}
.border-emerald:hover { 
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
}

.border-cyan { 
  background: #eff6ff; 
  border: 1px solid #bfdbfe; 
}
.border-cyan:hover { 
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
}

.border-amber { 
  background: #fffbeb; 
  border: 1px solid #fde68a; 
}
.border-amber:hover { 
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.15);
}

.border-rose { 
  background: #fff1f2; 
  border: 1px solid #fecdd3; 
}
.border-rose:hover { 
  box-shadow: 0 4px 16px rgba(244, 63, 94, 0.15);
}

.ratio-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.ratio-tag { font-size: 20rpx; font-weight: 700; }
.ratio-seq { font-size: 18rpx; color: #94a3b8; font-weight: 600; }
.r-label { font-size: 22rpx; font-weight: 700; color: #0f172a; display: block; }
.r-num-row { margin: 8rpx 0; }
.r-val { font-size: 48rpx; font-weight: 900; letter-spacing: -1rpx; }
.text-emerald { color: #059669; }
.text-cyan { color: #0284c7; }
.text-amber { color: #d97706; }
.text-rose { color: #e11d48; }
.r-sub { font-size: 18rpx; color: #64748b; line-height: 1.4; display: block; }

.dual-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16rpx;
}

@media (min-width: 800px) {
  .dual-info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.info-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 18rpx;
}

.info-head {
  font-size: 20rpx;
  color: #1e293b;
  font-weight: 700;
  display: block;
  margin-bottom: 10rpx;
}

.chip-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.info-chip {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 18rpx;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
  font-weight: 500;
}

.memo-list {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.memo-item {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
}

.memo-dot { color: #2563eb; font-size: 22rpx; line-height: 1; }
.memo-txt { font-size: 18rpx; color: #475569; line-height: 1.5; flex: 1; }

.bottom-dual-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24rpx;
}

@media (min-width: 900px) {
  .bottom-dual-grid {
    grid-template-columns: 1.1fr 0.9fr;
  }
}

.step-timeline {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.timeline-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 16rpx;
}

.step-badge {
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  width: 38rpx;
  height: 38rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20rpx;
  flex-shrink: 0;
}

.step-body { flex: 1; }
.step-name { font-size: 22rpx; font-weight: 700; color: #0f172a; display: block; }
.step-info { font-size: 18rpx; color: #64748b; margin-top: 4rpx; line-height: 1.5; display: block; }

.rule-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 18rpx;
}

.rule-seq-tag { font-size: 18rpx; font-weight: 700; display: block; margin-bottom: 4rpx; }
.rule-headline { font-size: 24rpx; font-weight: 800; color: #0f172a; display: block; }
.rule-paragraph { font-size: 18rpx; color: #475569; margin-top: 6rpx; line-height: 1.6; display: block; }


/* ==================== 优雅收敛微弹性动效 ==================== */
.cyber-dropdown-trigger,
.dropdown-item,
.switch-pill,
.ratio-card,
.step-card,
.portal-btn {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
  will-change: transform;
}

.cyber-dropdown-trigger:hover,
.switch-pill:hover,
.ratio-card:hover,
.step-card:hover,
.portal-btn:hover {
  transform: translateY(-1rpx) scale(1.008);
}

.cyber-dropdown-trigger:active,
.dropdown-item:active,
.switch-pill:active,
.ratio-card:active,
.step-card:active,
.portal-btn:active {
  transform: translateY(1rpx) scale(0.98) !important;
  transition-duration: 0.08s !important;
}


.desktop-omni-nav { display: none; }

@media (min-width: 768px) {
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


@media (min-width: 768px) {
  .page {
    padding: clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px);
  }
}

@media (min-width: 768px) and (max-height: 780px) {
  .page {
    padding: 10px 18px;
  }
  .card {
    padding: 14px 18px;
  }
}

/* -------------------- 移动端响应式断点 (max-width: 767px) -------------------- */
@media (max-width: 767px) {
  .content-box {
    padding: 12px 14px calc(84px + env(safe-area-inset-bottom)) !important;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
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

  .segment-switch-sm {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: center;
    box-sizing: border-box;
  }

  .switch-pill {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12rpx 0;
  }

  .ratio-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .ratio-card {
    padding: 18rpx 20rpx;
  }

  .r-val {
    font-size: 44rpx;
  }

  .dual-info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .steps-col {
    gap: 10px;
  }

  .step-card {
    padding: 16rpx 18rpx;
  }

  .step-badge {
    width: 40rpx;
    height: 40rpx;
    font-size: 24rpx;
  }

  .step-name {
    font-size: 26rpx;
  }

  .step-info {
    font-size: 22rpx;
    line-height: 1.45;
  }

  .rule-card {
    padding: 16rpx 18rpx;
  }

  .rule-headline {
    font-size: 26rpx;
  }

  .rule-paragraph {
    font-size: 22rpx;
    line-height: 1.45;
  }

  .content-box {
    padding: 12px 12px calc(80px + env(safe-area-inset-bottom)) !important;
  }
}

</style>
