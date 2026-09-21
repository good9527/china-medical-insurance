<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中，永不跳动) -->
    <AppHeader currentTab="index" />

    <view class="content-box">
      <!-- 页面简明标题与操作栏 (清新实用，去除浮夸官腔) -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="16" y1="14" x2="16" y2="14.01"></line>
                <line x1="8" y1="14" x2="8" y2="14.01"></line>
                <line x1="12" y1="14" x2="12" y2="14.01"></line>
                <line x1="8" y1="18" x2="8" y2="18.01"></line>
                <line x1="12" y1="18" x2="12" y2="18.01"></line>
                <line x1="16" y1="18" x2="16" y2="18.01"></line>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">医保报销测算</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">{{ currentCityOption.cityName }}</text>
                </view>
              </view>
              <text class="page-sub-title">输入就医花费及类型，快速估算医保统筹报销额度与个人自付明细</text>
            </view>
          </view>
        </view>

      </view>

      <!-- 双栏 Bento 工作台 -->
      <view class="bento-grid">
        <!-- 左栏：测算配置器 -->
        <view class="bento-card config-card">
          <!-- 模块 1: 参保统筹区 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">参保统筹区</text>
              <view class="quick-search-trigger" @click="showSearchModal = !showSearchModal">
                <text class="search-trigger-txt">{{ showSearchModal ? '收起搜索 ✕' : '快速检索城市 ↵' }}</text>
              </view>
            </view>

            <!-- 城市搜索面板 -->
            <view class="search-panel" v-if="showSearchModal" @click.stop>
              <view class="input-wrap">
                <input 
                  class="search-input" 
                  v-model="citySearchQuery" 
                  placeholder="输入城市拼音或中文（如：成都 / 拉萨 / 西安）" 
                  :focus="true"
                  @confirm="onSearchConfirm"
                />
                <text class="search-clear-btn" v-if="citySearchQuery" @click.stop="citySearchQuery = ''">✕</text>
              </view>
              <view class="search-results-list" v-if="filteredSearchCities.length > 0">
                <view 
                  class="search-result-row" 
                  v-for="item in filteredSearchCities" 
                  :key="item.cityCode"
                  @click="selectSearchedCity(item)"
                >
                  <view class="row-left">
                    <text class="c-name">{{ item.cityName }}</text>
                    <text class="c-prov">{{ item.provinceName }}</text>
                  </view>
                  <text class="c-action">选择 ↵</text>
                </view>
              </view>
              <view class="search-empty" v-else-if="citySearchQuery.trim()">
                <text class="empty-txt">未匹配到该城市，请尝试省份全称</text>
              </view>
            </view>

            <!-- 省市二级下拉 (等宽并排) -->
            <view class="region-dropdown-grid dropdown-anchor-row">
              <view class="col-field">
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

              <view class="col-field">
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

          <!-- 模块 2: 参保身份类别 -->
          <view class="config-group mt-16">
            <view class="group-header">
              <text class="group-label">医保身份类别</text>
            </view>
            <!-- 二段式胶囊切换器 (Segmented Pill) -->
            <view class="segmented-control">
              <view 
                class="seg-btn" 
                :class="{ active: form.insuranceType === 'employee' }"
                @click="switchInsuranceType('employee')"
              >
                <text class="seg-title">城镇职工医保</text>
              </view>
              <view 
                class="seg-btn" 
                :class="{ active: form.insuranceType === 'resident' }"
                @click="switchInsuranceType('resident')"
              >
                <text class="seg-title">城乡居民医保</text>
              </view>
            </view>

            <!-- 职工退休优待开关 -->
            <view class="retiree-bar" v-if="form.insuranceType === 'employee'" @click="toggleRetiree">
              <view class="retiree-bar-left">
                <text class="retiree-label">退休人员待遇优待</text>
                <text class="retiree-sub">（报销比例享受倾斜上浮）</text>
              </view>
              <view class="custom-switch" :class="{ checked: form.isRetiree }">
                <view class="switch-handle"></view>
              </view>
            </view>
          </view>

          <!-- 模块 3: 就医场景与定点机构 -->
          <view class="config-group mt-16">
            <view class="group-header">
              <text class="group-label">就医场景与机构等级</text>
            </view>
            <view class="grid-2col dropdown-anchor-row">
              <!-- 就医类型切换器 -->
              <view class="col-field">
                <view class="sub-segmented-control">
                  <view 
                    class="sub-seg-btn" 
                    :class="{ active: form.treatmentType === 'inpatient' }"
                    @click="switchTreatmentType('inpatient')"
                  >
                    <text class="sub-seg-txt">住院治疗</text>
                  </view>
                  <view 
                    class="sub-seg-btn" 
                    :class="{ active: form.treatmentType === 'outpatient' }"
                    @click="switchTreatmentType('outpatient')"
                  >
                    <text class="sub-seg-txt">普通门诊</text>
                  </view>
                </view>
              </view>

              <!-- 机构等级下拉 -->
              <view class="col-field">
                <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'hospital' }" @click.stop="toggleDropdown('hospital')">
                  <text class="select-val">{{ hospitalTiers[selectedHospitalIndex].shortName }}</text>
                  <text class="select-arrow" :class="{ rotated: openDropdown === 'hospital' }">▾</text>
                </view>
                <view class="cyber-dropdown-menu" v-if="openDropdown === 'hospital'" @click.stop>
                  <view 
                    class="dropdown-item" 
                    v-for="(h, idx) in hospitalTiers" 
                    :key="h.tier"
                    :class="{ selected: selectedHospitalIndex === idx }"
                    @click.stop="selectHospital(idx)"
                  >
                    <text class="item-name">{{ h.name }}</text>
                    <text class="item-check" v-if="selectedHospitalIndex === idx">✓</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 门诊政策规则即时通报 -->
            <view class="policy-notice" v-if="form.treatmentType === 'outpatient'">
              <text class="notice-badge">门诊政策提醒</text>
              <text class="notice-content" v-if="form.insuranceType === 'employee'">
                {{ currentCityData.cityName }}职工门诊共济：{{ currentCityData.employee.outpatient.annualDeductible > 0 ? ('年起付线 ¥' + currentCityData.employee.outpatient.annualDeductible + (currentCityData.employee.outpatient.annualDeductibleRetiree ? '（退休优待¥' + currentCityData.employee.outpatient.annualDeductibleRetiree + '）；' : '；')) : '0元起付直接报销；' }}{{ currentCityData.employee.outpatient.annualCap >= 9999999 ? '门诊不设最高封顶线（上不封顶）。' : ('在职年封顶 ¥' + currentCityData.employee.outpatient.annualCap + '，退休年封顶 ¥' + (currentCityData.employee.outpatient.annualCapRetiree || currentCityData.employee.outpatient.annualCap) + '。') }}
              </text>
              <text class="notice-content" v-else>
                {{ currentCityData.cityName }}居民门诊统筹：年封顶额度 ¥{{ currentCityData.resident.outpatient.annualCap }}/人，{{ currentCityData.resident.outpatient.annualDeductible > 0 ? ('年起付标准 ¥' + currentCityData.resident.outpatient.annualDeductible + '；') : '定点基层机构免起付线即时结算。' }}
              </text>
            </view>
          </view>

          <!-- 模块 4: 预估医疗花费与快捷芯片 -->
          <view class="config-group mt-16">
            <view class="group-header">
              <text class="group-label">预估医疗总花费</text>
            </view>
            <!-- 主输入框 -->
            <view class="amount-input-box">
              <text class="currency-symbol">¥</text>
              <input 
                type="digit" 
                class="main-amount-input" 
                v-model="form.totalCost" 
                placeholder="0"
                @input="triggerCalculation"
              />
              <text class="currency-unit">元</text>
            </view>

            <!-- 快捷预设金额药丸 (规整排版) -->
            <view class="preset-pill-row">
              <view 
                class="preset-pill" 
                v-for="amt in quickAmounts" 
                :key="amt"
                :class="{ active: form.totalCost === String(amt) }"
                @click="setQuickCost(amt)"
              >
                <text class="pill-text">{{ formatQuickPill(amt) }}</text>
              </view>
            </view>
          </view>

          <!-- 模块 5: 异地与自费折叠面板 (干净微光卡片，非虚线) -->
          <view class="advanced-collapse-card mt-16">
            <view class="collapse-trigger" @click="showExtra = !showExtra">
              <text class="trigger-label">异地就医与全自费项目</text>
              <text class="trigger-arrow">{{ showExtra ? '收起 ▴' : '展开 ▾' }}</text>
            </view>

            <view class="collapse-content" v-if="showExtra">
              <view class="collapse-field">
                <text class="field-label">异地就医备案状态</text>
                <view class="dropdown-anchor-row" @click.stop>
                  <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'remote' }" @click.stop="toggleDropdown('remote')">
                    <text class="select-val">{{ remoteOptions[selectedRemoteIndex].label }}</text>
                    <text class="select-arrow" :class="{ rotated: openDropdown === 'remote' }">▾</text>
                  </view>
                  <view class="cyber-dropdown-menu" v-if="openDropdown === 'remote'" @click.stop>
                    <view 
                      class="dropdown-item" 
                      v-for="(r, idx) in remoteOptions" 
                      :key="r.value"
                      :class="{ selected: selectedRemoteIndex === idx }"
                      @click.stop="selectRemote(idx)"
                    >
                      <text class="item-name">{{ r.label }}</text>
                      <text class="item-check" v-if="selectedRemoteIndex === idx">✓</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="collapse-field mt-12">
                <text class="field-label">全自费项目费用 (丙类药/特需耗材，不可报销额)</text>
                <input 
                  type="digit" 
                  class="collapse-input" 
                  v-model="form.nonInsuranceCost" 
                  placeholder="无自费项目可填 0" 
                  @input="triggerCalculation"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 右栏：报销测算明细凭证 -->
        <view class="bento-card receipt-card">
          <view class="receipt-inner" v-if="result">
            <!-- 凭证顶栏 -->
            <view class="receipt-header">
              <view class="receipt-title-wrap">
                <view class="status-indicator"></view>
                <text class="receipt-title">
                  <text class="desktop-title-txt">医保测算结果看板</text>
                  <text class="mobile-title-txt">测算结果看板</text>
                </text>
              </view>
              <view class="receipt-actions">
                <view class="copy-voucher-btn" @click.stop="copyReceipt" title="一键复制测算凭据">
                  <svg class="copy-btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <text class="copy-btn-txt">复制凭据</text>
                </view>
                <view class="ratio-pill">
                  <text class="ratio-text">综合报销率 {{ displayRatio }}%</text>
                </view>
              </view>
            </view>

            <!-- 核心主数值 -->
            <view class="receipt-hero-block">
              <text class="receipt-hero-label">医保预计综合报销</text>
              <view class="receipt-price-row">
                <text class="price-symbol">¥</text>
                <text class="price-number">{{ displayReimbursed.toLocaleString() }}</text>
              </view>
              <text class="receipt-note">由医保统筹基金直接抵扣结算，出院窗口免垫资</text>
            </view>

            <!-- 基金支付与自理对比矩阵 -->
            <view class="compare-matrix">
              <view class="matrix-cell">
                <text class="cell-label">统筹基金支付</text>
                <text class="cell-val text-cyan">¥{{ (result.breakdown.baseReimbursed + result.breakdown.catastrophicReimbursed).toLocaleString() }}</text>
              </view>
              <view class="matrix-cell">
                <text class="cell-label">个人预计自理</text>
                <text class="cell-val text-amber">¥{{ displayPersonalPay.toLocaleString() }}</text>
              </view>
            </view>

            <!-- 能量构成条形图 -->
            <view class="progress-bar-wrap">
              <view class="progress-labels">
                <text class="prog-txt text-cyan">统筹基金 ({{ result.breakdown.effectiveRatio }}%)</text>
                <text class="prog-txt text-dim">个人负担 ({{ (100 - result.breakdown.effectiveRatio).toFixed(1) }}%)</text>
              </view>
              <view class="progress-track">
                <view class="progress-bar bar-cyan" :style="{ width: result.breakdown.effectiveRatio + '%' }"></view>
                <view class="progress-bar bar-dim" :style="{ width: Math.max(0, 100 - result.breakdown.effectiveRatio) + '%' }"></view>
              </view>
            </view>

            <!-- 费用测算结构收据明细 (结构严整的清单) -->
            <view class="receipt-breakdown-card">
              <view class="breakdown-head" @click="showDetail = !showDetail">
                <text class="b-head-title">费用分项测算明细</text>
                <text class="b-head-action">{{ showDetail ? '收起 ▴' : '展开 ▾' }}</text>
              </view>
              <view class="breakdown-table" v-if="showDetail">
                <view class="b-row">
                  <text class="b-col-name">总医疗花费</text>
                  <text class="b-col-val">¥{{ (parseFloat(form.totalCost) || 0).toLocaleString() }}</text>
                </view>
                <view class="b-row" v-if="result.breakdown.nonInsuranceDeducted > 0">
                  <text class="b-col-name">自费/乙类先行自付</text>
                  <text class="b-col-val text-dim">- ¥{{ result.breakdown.nonInsuranceDeducted.toLocaleString() }}</text>
                </view>
                <view class="b-row">
                  <text class="b-col-name">扣除起付线门槛</text>
                  <text class="b-col-val text-dim">- ¥{{ result.breakdown.deductibleDeducted.toLocaleString() }}</text>
                </view>
                <view class="b-row">
                  <text class="b-col-name">实际纳规报销基数</text>
                  <text class="b-col-val">¥{{ Math.max(0, result.breakdown.eligibleCost - result.breakdown.deductibleDeducted).toLocaleString() }}</text>
                </view>
                <view class="b-row">
                  <text class="b-col-name">统筹基金报销</text>
                  <text class="b-col-val text-cyan font-bold">¥{{ result.breakdown.baseReimbursed.toLocaleString() }}</text>
                </view>
                <view class="b-row" v-if="result.breakdown.catastrophicReimbursed > 0">
                  <text class="b-col-name">大病互助二次报销</text>
                  <text class="b-col-val text-emerald font-bold">+ ¥{{ result.breakdown.catastrophicReimbursed }}</text>
                </view>
                <view class="b-row" v-if="result.breakdown.nonInsuranceCost > 0">
                  <text class="b-col-name">全自费丙类药/特需</text>
                  <text class="b-col-val text-dim">- ¥{{ result.breakdown.nonInsuranceCost }}</text>
                </view>
              </view>
            </view>

            <!-- 经办政策备忘提醒 -->
            <view class="policy-memo" v-if="result.policyNotes.length > 0">
              <view v-for="(note, idx) in result.policyNotes" :key="idx" class="memo-row">
                <text class="memo-dot">·</text>
                <text class="memo-txt">{{ note }}</text>
              </view>
            </view>

            <!-- 官方权威文件依据卡片 (底部稳固收口) -->
            <view class="official-statute-badge" @click="openDocUrl">
              <view class="statute-info">
                <view class="statute-tag-row">
                  <text class="statute-tag">法定政策依据</text>
                  <text class="statute-doc-num">{{ result.officialDocUsed?.docNumber || '现行基本医保规范' }}</text>
                </view>
                <text class="statute-title">{{ result.officialDocUsed?.title || currentCityOption.cityName + '基本医疗保险政策' }}</text>
              </view>
              <view class="statute-btn">
                <text class="statute-btn-txt">查看公文 ↗</text>
              </view>
            </view>
          </view>

          <!-- 空状态 -->
          <view class="empty-receipt-wrap" v-else>
            <view class="empty-svg-wrap">
              <svg class="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
            </view>
            <text class="empty-title">等待输入费用金额</text>
            <text class="empty-desc">在左侧输入医疗花费并选择就医参数，右侧将自动调取 {{ currentCityOption.cityName }} 现行医保政策测算报销明细</text>
          </view>
        </view>
      </view>

      <!-- 移动端底部悬浮结果快捷卡片 (仅手机视口展示，实时反馈测算结论) -->
      <view class="mobile-calc-float-bar" v-if="result" @click="scrollToReceipt">
        <view class="float-bar-left">
          <text class="float-tag">预估报销</text>
          <view class="float-val-group">
            <text class="float-currency">¥</text>
            <text class="float-amount">{{ displayReimbursed.toLocaleString() }}</text>
          </view>
          <text class="float-ratio">({{ displayRatio }}%)</text>
        </view>
        <view class="float-bar-right">
          <text class="float-cta">查看测算凭证 ↓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import type { HospitalTier, CalculateRequest, CalculateResult } from '../../data/types';
import { provinceList, getCitiesByProvinceCode, getCityData } from '../../data/provinces';
import { allCities } from '../../data';
import { calculateReimbursement } from '../../engine/calculator';

const openDropdown = ref<string | null>(null);

function navToTab(url: string) {
  uni.switchTab({ url });
}

function closeAllDropdowns() {
  openDropdown.value = null;
}

function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

function selectProvince(idx: number) {
  selectedProvinceIndex.value = idx;
  selectedCityIndex.value = 0;
  openDropdown.value = null;
  persistCityChoice();
  triggerCalculation();
}

function selectCity(idx: number) {
  selectedCityIndex.value = idx;
  openDropdown.value = null;
  persistCityChoice();
  triggerCalculation();
}

function persistCityChoice() {
  if (currentCityOption.value?.cityCode) {
    uni.setStorageSync('selected_medical_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_type', form.insuranceType);
  }
}

function selectHospital(idx: number) {
  selectedHospitalIndex.value = idx;
  openDropdown.value = null;
  triggerCalculation();
}

function selectRemote(idx: number) {
  selectedRemoteIndex.value = idx;
  openDropdown.value = null;
  triggerCalculation();
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
const currentCityData = computed(() => getCityData(currentCityOption.value.cityCode));

const showSearchModal = ref(false);
const citySearchQuery = ref('');
const filteredSearchCities = computed(() => {
  const q = citySearchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return allCities
    .filter(c => c.cityName.toLowerCase().includes(q) || c.provinceName.toLowerCase().includes(q))
    .slice(0, 10);
});

function selectSearchedCity(item: { cityCode: string; provinceCode: string }) {
  const pIndex = provinceList.findIndex(p => p.code === item.provinceCode);
  if (pIndex !== -1) {
    selectedProvinceIndex.value = pIndex;
    const cities = getCitiesByProvinceCode(item.provinceCode);
    const cIndex = cities.findIndex(c => c.cityCode === item.cityCode);
    if (cIndex !== -1) {
      selectedCityIndex.value = cIndex;
    }
  }
  showSearchModal.value = false;
  citySearchQuery.value = '';
  persistCityChoice();
  triggerCalculation();
}

function onSearchConfirm() {
  if (filteredSearchCities.value.length > 0) {
    selectSearchedCity(filteredSearchCities.value[0]);
  }
}

const form = reactive<{
  insuranceType: 'employee' | 'resident';
  isRetiree: boolean;
  treatmentType: 'outpatient' | 'inpatient';
  totalCost: string;
  nonInsuranceCost: string;
}>({
  insuranceType: 'employee',
  isRetiree: false,
  treatmentType: 'inpatient',
  totalCost: '10000',
  nonInsuranceCost: ''
});

const quickAmounts = [1000, 3000, 10000, 30000, 50000];
function formatQuickPill(amt: number): string {
  if (amt >= 10000) {
    return '¥' + (amt / 10000) + '万';
  }
  return '¥' + amt;
}

function triggerHaptic() {
  try {
    // #ifdef MP || APP-PLUS
    uni.vibrateShort({ type: 'light' });
    // #endif
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(8);
    }
  } catch {}
}

function switchInsuranceType(type: 'employee' | 'resident') {
  triggerHaptic();
  form.insuranceType = type;
  persistCityChoice();
  triggerCalculation();
}

function switchTreatmentType(type: 'inpatient' | 'outpatient') {
  triggerHaptic();
  form.treatmentType = type;
  triggerCalculation();
}

function toggleRetiree() {
  triggerHaptic();
  form.isRetiree = !form.isRetiree;
  triggerCalculation();
}

function setQuickCost(val: number) {
  triggerHaptic();
  form.totalCost = String(val);
  triggerCalculation();
}

const showExtra = ref(false);
const showDetail = ref(true);

const hospitalTiers: { tier: HospitalTier; name: string; shortName: string }[] = [
  { tier: 'tier3_top', name: '三甲医院 (重点三甲)', shortName: '三甲医院' },
  { tier: 'tier3', name: '普通三级医院', shortName: '普通三级' },
  { tier: 'tier2', name: '二级医院 (区县级)', shortName: '二级医院' },
  { tier: 'tier1', name: '一级医院 (卫生院)', shortName: '一级医院' },
  { tier: 'community', name: '社区服务中心 / 诊所', shortName: '社区诊所' }
];
const selectedHospitalIndex = ref(0);

const remoteOptions = [
  { value: 'local', label: '本地定点医院就医' },
  { value: 'long_term', label: '异地长期居住 (已备案)' },
  { value: 'transfer', label: '跨市/省转诊 (已备案)' },
  { value: 'unfiled_normal', label: '外地就医 (未提前备案)' }
];
const selectedRemoteIndex = ref(0);

const result = ref<CalculateResult | null>(null);

// 高精数字滚动动效状态
const displayReimbursed = ref(0);
const displayRatio = ref(0);
const displayPersonalPay = ref(0);
let animationFrameId: any = null;

function animateNumbers(targetReimbursed: number, targetRatio: number, targetPersonal: number) {
  const startReimbursed = displayReimbursed.value;
  const startRatio = displayRatio.value;
  const startPersonal = displayPersonalPay.value;
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const duration = 380; // 380ms 黄金缓动周期

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic 减速曲线
    const ease = 1 - Math.pow(1 - progress, 3);

    displayReimbursed.value = Math.round(startReimbursed + (targetReimbursed - startReimbursed) * ease);
    displayRatio.value = parseFloat((startRatio + (targetRatio - startRatio) * ease).toFixed(1));
    displayPersonalPay.value = Math.round(startPersonal + (targetPersonal - startPersonal) * ease);

    if (progress < 1) {
      if (typeof requestAnimationFrame !== 'undefined') {
        animationFrameId = requestAnimationFrame(step);
      }
    } else {
      displayReimbursed.value = targetReimbursed;
      displayRatio.value = targetRatio;
      displayPersonalPay.value = targetPersonal;
    }
  }

  if (animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(animationFrameId);
  }
  if (typeof requestAnimationFrame !== 'undefined') {
    animationFrameId = requestAnimationFrame(step);
  } else {
    displayReimbursed.value = targetReimbursed;
    displayRatio.value = targetRatio;
    displayPersonalPay.value = targetPersonal;
  }
}

function triggerCalculation() {
  const cost = parseFloat(form.totalCost);
  if (isNaN(cost) || cost <= 0) {
    result.value = null;
    displayReimbursed.value = 0;
    displayRatio.value = 0;
    displayPersonalPay.value = 0;
    return;
  }

  const cityCode = currentCityOption.value.hasData ? currentCityOption.value.cityCode : '610100';

  const req: CalculateRequest = {
    cityCode: cityCode,
    insuranceType: form.insuranceType,
    isRetiree: form.isRetiree,
    treatmentType: form.treatmentType,
    hospitalTier: hospitalTiers[selectedHospitalIndex.value].tier,
    remoteStatus: remoteOptions[selectedRemoteIndex.value].value as any,
    totalCost: cost,
    nonInsuranceCost: parseFloat(form.nonInsuranceCost) || 0
  };

  try {
    const res = calculateReimbursement(req);
    result.value = res;
    animateNumbers(
      res.breakdown.totalReimbursed,
      res.breakdown.effectiveRatio,
      res.breakdown.personalPayTotal
    );
  } catch (err: any) {
    uni.showToast({ title: err.message || '计算出错', icon: 'none' });
  }
}

function openDocUrl() {
  if (!result.value?.officialDocUsed?.officialUrl) return;
  const url = result.value.officialDocUsed.officialUrl;
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank');
  } else {
    uni.setClipboardData({
      data: url,
      success: () => {
        uni.showToast({ title: '官方网址已复制，可粘贴访问', icon: 'none' });
      }
    });
  }
}

function copyReceipt() {
  if (!result.value) {
    uni.showToast({ title: '暂无测算结果', icon: 'none' });
    return;
  }
  const res = result.value;
  const b = res.breakdown;
  const city = currentCityOption.value?.cityName || '参保地';
  const insType = form.insuranceType === 'employee' ? (form.isRetiree ? '职工医保 (退休)' : '职工医保 (在职)') : '城乡居民医保';
  const treatType = form.treatmentType === 'inpatient' ? '住院就医' : '普通门诊';
  const hospTier = hospitalTiers[selectedHospitalIndex.value]?.shortName || '三级医院';
  const remote = remoteOptions[selectedRemoteIndex.value]?.label || '本地就医';
  const totalCost = (parseFloat(form.totalCost) || 0).toLocaleString();
  const reimbursed = b.totalReimbursed.toLocaleString();
  const personal = b.personalPayTotal.toLocaleString();
  const basePay = (b.baseReimbursed + b.catastrophicReimbursed).toLocaleString();
  const deductible = b.deductibleDeducted.toLocaleString();
  const eligible = b.eligibleCost.toLocaleString();
  const docTitle = res.officialDocUsed?.title || `${city}基本医疗保险政策`;

  const voucher = `【医保报销测算凭据】
统筹区域：${city}
参保类型：${insType}
就医方式：${treatType}（${hospTier} | ${remote}）
医疗总费用：¥${totalCost}
------------------------
★ 医保综合报销：¥${reimbursed} (报销率 ${b.effectiveRatio}%)
  - 统筹基金支付：¥${basePay}
  - 扣除起付线：¥${deductible}
  - 进入报销基数：¥${eligible}
★ 个人预计自理：¥${personal}
------------------------
测算政策依据：《${docTitle}》
测算平台：全国医保报销精算引擎`;

  uni.setClipboardData({
    data: voucher,
    showToast: false,
    success: () => {
      uni.showToast({ title: '测算凭据已复制', icon: 'success' });
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(voucher).then(() => {
          uni.showToast({ title: '测算凭据已复制', icon: 'success' });
        }).catch(() => {
          uni.showToast({ title: '复制失败，请截图保存', icon: 'none' });
        });
      } else {
        uni.showToast({ title: '复制失败，请截图保存', icon: 'none' });
      }
    }
  });
}

function scrollToReceipt() {
  uni.pageScrollTo({
    selector: '.receipt-card',
    duration: 350,
    offsetTop: -16
  });
}

function syncCityFromStorage() {
  const savedCode = uni.getStorageSync('selected_medical_city_code') || uni.getStorageSync('selected_policy_city_code');
  if (savedCode && savedCode !== currentCityOption.value.cityCode) {
    for (let pIdx = 0; pIdx < provinceList.length; pIdx++) {
      const p = provinceList[pIdx];
      const cities = getCitiesByProvinceCode(p.code);
      const cIdx = cities.findIndex(c => c.cityCode === savedCode);
      if (cIdx !== -1) {
        selectedProvinceIndex.value = pIdx;
        selectedCityIndex.value = cIdx;
        break;
      }
    }
  }

  const savedType = uni.getStorageSync('selected_policy_type');
  if (savedType === 'employee' || savedType === 'resident') {
    form.insuranceType = savedType;
  }
  triggerCalculation();
}

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
/* ==========================================================================
   Apple / Google Antigravity 级 Bento Grid 工业美学控制台样式
   ========================================================================== */

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

/* 页面顶部标题与工具条 (大方朴实，左右对齐) */
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
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
  line-height: 1.25;
}

.city-indicator-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 0 10px;
  height: 24px;
  border-radius: 9999px;
  box-sizing: border-box;
}

.city-indicator-txt {
  font-size: 11.5px;
  color: #2563eb;
  font-weight: 600;
  line-height: 1;
}

.page-sub-title {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  line-height: 1.5;
}

/* -------------------- 2. 主工作台 Bento 栅格 -------------------- */
.bento-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 20px;
  align-items: stretch;
}

/* Bento 卡片基础 */
.bento-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  padding: 24px 26px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 12rpx 36rpx rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* -------------------- 左栏：测算配置器组件 -------------------- */
.config-group {
  display: flex;
  flex-direction: column;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.group-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
}

.quick-search-trigger {
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.search-trigger-txt {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

/* 城市搜索面板 */
.search-panel {
  background: #ffffff;
  border: 1px solid #93c5fd;
  border-radius: 12rpx;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.08);
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 36px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #0f172a;
  padding: 0 40px 0 12px;
  font-size: 13px;
  box-sizing: border-box;
}

.search-clear-btn {
  position: absolute;
  right: 12px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
}

.search-results-list {
  max-height: 200rpx;
  overflow-y: auto;
  margin-top: 8px;
}

.search-result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
  cursor: pointer;
}

.search-result-row:hover {
  background: #eff6ff;
}

.c-name { font-size: 13px; color: #0f172a; font-weight: 600; }
.c-prov { font-size: 11.5px; color: #64748b; margin-left: 8px; }
.c-action { font-size: 12px; color: #2563eb; font-weight: 600; }
.empty-txt { font-size: 12px; color: #64748b; }

/* 双列栅格 */
.grid-2col,
.region-dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dropdown-anchor-row {
  position: relative;
}

.col-field {
  position: relative;
}

/* 下拉触发器 */
.cyber-dropdown-trigger {
  width: 100%;
  height: 72rpx;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12rpx;
  padding: 0 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s;
}

.cyber-dropdown-trigger:hover,
.cyber-dropdown-trigger.open {
  border-color: #2563eb;
  background: #eff6ff;
}

.select-val {
  font-size: 13px;
  color: #0f172a;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-arrow {
  font-size: 11px;
  color: #64748b;
  transition: transform 0.2s ease;
}

.select-arrow.rotated {
  transform: rotate(180deg);
  color: #2563eb;
}

/* 下拉菜单浮层 */
.cyber-dropdown-menu {
  position: absolute;
  top: calc(100% + 6rpx);
  left: 0;
  width: 100%;
  max-height: 320px;
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
  padding: 12rpx 16rpx;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.selected {
  background: #eff6ff;
}

.dropdown-item .item-name {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.dropdown-item.selected .item-name {
  color: #2563eb;
  font-weight: 700;
}

.dropdown-item .item-check {
  font-size: 12px;
  color: #2563eb;
  font-weight: 700;
}

/* 二段式胶囊切换器 (Segmented Control) */
.segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
}

.seg-btn {
  padding: 10rpx 14rpx;
  border-radius: 10rpx;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.seg-btn.active {
  background: #ffffff;
  border: 1px solid rgba(37, 99, 235, 0.25);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.seg-title {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  display: block;
}

.seg-btn.active .seg-title {
  color: #2563eb;
}

.seg-desc {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.seg-btn.active .seg-desc {
  color: #64748b;
}

/* 退休优待开关栏 */
.retiree-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10rpx;
  padding: 8px 12px;
  cursor: pointer;
}

.retiree-bar-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.retiree-label {
  font-size: 13px;
  color: #1e293b;
  font-weight: 600;
}

.retiree-sub {
  font-size: 11.5px;
  color: #64748b;
}

.custom-switch {
  width: 56rpx;
  height: 32rpx;
  border-radius: 9999rpx;
  background: #cbd5e1;
  position: relative;
  transition: all 0.2s ease;
}

.custom-switch.checked {
  background: #10b981;
}

.switch-handle {
  width: 26rpx;
  height: 26rpx;
  border-radius: 50%;
  background: #ffffff;
  position: absolute;
  top: 3rpx;
  left: 3rpx;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.custom-switch.checked .switch-handle {
  transform: translateX(24rpx);
}

/* 子分段器 (就医类型) */
.sub-segmented-control {
  display: flex;
  height: 72rpx;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 4rpx;
  gap: 4rpx;
  box-sizing: border-box;
}

.sub-seg-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  cursor: pointer;
}

.sub-seg-btn.active {
  background: #ffffff;
  border: 1px solid rgba(37, 99, 235, 0.25);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.sub-seg-txt {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.sub-seg-btn.active .sub-seg-txt {
  color: #2563eb;
}

/* 门诊政策通知卡 */
.policy-notice {
  margin-top: 10px;
  background: #eff6ff;
  border-left: 3rpx solid #2563eb;
  border-radius: 8rpx;
  padding: 8px 12px;
}

.notice-badge {
  font-size: 11.5px;
  color: #1d4ed8;
  font-weight: 700;
  display: block;
  margin-bottom: 2px;
}

.notice-content {
  font-size: 12px;
  color: #1e3a8a;
  line-height: 1.5;
  display: block;
}

/* 大金额主输入框 */
.amount-input-box {
  display: flex;
  align-items: center;
  height: 80rpx;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12rpx;
  padding: 0 18rpx;
  box-sizing: border-box;
  transition: all 0.2s;
}

.amount-input-box:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  background: #ffffff;
}

.currency-symbol {
  font-size: 20px;
  color: #2563eb;
  font-weight: 700;
  margin-right: 8px;
}

.main-amount-input {
  flex: 1;
  height: 100%;
  color: #0f172a;
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.currency-unit {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

/* 预设金额药丸行 */
.preset-pill-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.preset-pill {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8rpx 4rpx;
  border-radius: 8rpx;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s;
}

.preset-pill.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.pill-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
  word-break: keep-all;
  line-height: 1.2;
}

.preset-pill.active .pill-text {
  color: #2563eb;
}

/* 高级折叠面板 */
.advanced-collapse-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 10px 14px;
}

.collapse-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.trigger-label {
  font-size: 12.5px;
  color: #475569;
  font-weight: 600;
}

.trigger-arrow {
  font-size: 11px;
  color: #64748b;
}

.collapse-content {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.collapse-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  display: block;
}

.collapse-input {
  width: 100%;
  height: 36px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #0f172a;
  padding: 0 12px;
  font-size: 13px;
  box-sizing: border-box;
}

.mt-16 { margin-top: 16px; }
.mt-12 { margin-top: 12px; }

/* -------------------- 右栏：报销测算凭证组件 -------------------- */
.receipt-card {
  border-color: #e2e8f0;
}

.receipt-inner {
  display: flex;
  flex-direction: column;
}

.receipt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.receipt-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.receipt-title {
  font-size: 15px;
  color: #0f172a;
  font-weight: 700;
  white-space: nowrap;
  word-break: keep-all;
}

.desktop-title-txt { display: inline; }
.mobile-title-txt { display: none; }

.receipt-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.copy-voucher-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 9999rpx;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  white-space: nowrap;
  word-break: keep-all;
  flex-shrink: 0;
}

.copy-voucher-btn:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  transform: translateY(-1px);
}

.copy-voucher-btn:active {
  background: #dbeafe;
  transform: scale(0.95);
}

.copy-btn-svg {
  width: 12px;
  height: 12px;
  stroke: #475569;
  flex-shrink: 0;
}

.copy-voucher-btn:hover .copy-btn-svg {
  stroke: #2563eb;
}

.copy-btn-txt {
  font-size: 11.5px;
  color: #475569;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  word-break: keep-all;
}

.copy-voucher-btn:hover .copy-btn-txt {
  color: #2563eb;
}

.ratio-pill {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  word-break: keep-all;
  flex-shrink: 0;
}

.ratio-text {
  font-size: 12px;
  color: #1d4ed8;
  font-weight: 700;
  white-space: nowrap;
  word-break: keep-all;
}

/* 主指标大金额 */
.receipt-hero-block {
  text-align: center;
  padding: 16px 0 14px;
  background: linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%);
  border: 1px solid #dcfce7;
  border-radius: 12rpx;
  margin-top: 12px;
}

.receipt-hero-label {
  font-size: 13px;
  color: #059669;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.receipt-price-row {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.price-symbol {
  font-size: 20px;
  color: #059669;
  font-weight: 700;
}

.price-number {
  font-size: 32px;
  font-weight: 900;
  color: #047857;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
}

.receipt-note {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-top: 4px;
}

/* 对比矩阵 */
.compare-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: #f8fafc;
  padding: 12px 14px;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
  margin-top: 12px;
}

.matrix-cell {
  text-align: center;
}

.matrix-cell:first-child {
  border-right: 1px solid #e2e8f0;
}

.cell-label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 2px;
}

.cell-val {
  font-size: 16px;
  font-weight: 700;
  display: block;
  font-variant-numeric: tabular-nums;
}

.text-cyan { color: #0284c7; }
.text-amber { color: #d97706; }
.text-emerald { color: #059669; }
.text-dim { color: #64748b; }
.font-bold { font-weight: 700; }

/* 能量条 */
.progress-bar-wrap {
  margin-top: 14px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.prog-txt {
  font-size: 11.5px;
  font-weight: 600;
}

.progress-track {
  display: flex;
  height: 10px;
  background: #e2e8f0;
  border-radius: 9999rpx;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
}

.progress-bar {
  height: 100%;
  transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.bar-cyan { 
  background: linear-gradient(90deg, #2563eb 0%, #0284c7 60%, #059669 100%); 
  position: relative;
  overflow: hidden;
}

.bar-cyan::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-100%);
  animation: barShimmer 2.8s infinite ease-in-out;
}

@keyframes barShimmer {
  0% { transform: translateX(-100%); }
  45%, 100% { transform: translateX(100%); }
}
.bar-dim { 
  background: #cbd5e1; 
}

/* 费用测算结构清单 */
.receipt-breakdown-card {
  margin-top: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10rpx;
  padding: 10px 14px;
}

.breakdown-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.b-head-title {
  font-size: 13.5px;
  color: #1e293b;
  font-weight: 700;
}

.b-head-action {
  font-size: 12px;
  color: #64748b;
}

.breakdown-table {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.b-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 13px;
}

.b-col-name { color: #64748b; font-size: 13px; }
.b-col-val { font-weight: 600; color: #0f172a; font-size: 13px; font-variant-numeric: tabular-nums; }

/* 政策备忘 */
.policy-memo {
  margin-top: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8rpx;
  padding: 10px 12px;
}

.memo-row {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
  margin-bottom: 4px;
}

.memo-row:last-child { margin-bottom: 0; }
.memo-dot { color: #2563eb; font-size: 14px; line-height: 1; }
.memo-txt { font-size: 12px; color: #475569; line-height: 1.5; flex: 1; }

/* 底部官方依据卡片 (稳固收口) */
.official-statute-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10rpx;
  padding: 10px 14px;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.official-statute-badge:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}

.statute-info {
  flex: 1;
  min-width: 0;
}

.statute-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.statute-tag {
  font-size: 11px;
  color: #2563eb;
  font-weight: 700;
}

.statute-doc-num {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.statute-title {
  font-size: 13px;
  color: #0f172a;
  font-weight: 600;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.statute-btn {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 6px;
  flex-shrink: 0;
}

.statute-btn-txt {
  font-size: 12px;
  color: #1d4ed8;
  font-weight: 600;
}

/* 空状态 */
.empty-receipt-wrap {
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-svg-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.empty-svg {
  width: 28px;
  height: 28px;
  stroke: #94a3b8;
}

.empty-title { font-size: 15px; font-weight: 700; color: #475569; }
.empty-desc { font-size: 12.5px; color: #64748b; margin-top: 8px; line-height: 1.5; max-width: 320px; }

/* -------------------- 3. 响应式布局：移动端自适应 -------------------- */
@media (min-width: 768px) {
  .page {
    padding: clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px);
  }
}

@media (min-width: 768px) and (max-height: 780px) {
  .page {
    padding: 10px 18px;
  }
  .bento-card {
    padding: 18px 20px;
  }
}

/* -------------------- 移动端响应式断点 (max-width: 767px) -------------------- */
@media (max-width: 767px) {
  .content-box {
    padding: 12px 14px calc(84px + env(safe-area-inset-bottom)) !important;
  }

  .cyber-dropdown-menu {
    max-height: 46vh !important;
    z-index: 9999 !important;
    box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18) !important;
    -webkit-overflow-scrolling: touch;
  }

  .desktop-title-txt { display: none !important; }
  .mobile-title-txt { display: inline !important; }

  .receipt-header {
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding-bottom: 10px;
  }

  .receipt-title {
    font-size: 13.5px !important;
  }

  .receipt-actions {
    margin-left: auto;
    gap: 6px;
  }

  .copy-voucher-btn {
    padding: 3px 8px !important;
  }

  .copy-btn-txt {
    font-size: 11px !important;
  }

  .ratio-pill {
    padding: 3px 8px !important;
  }

  .ratio-text {
    font-size: 11px !important;
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

  .page-main-title {
    font-size: 19px;
  }

  .title-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .toolbar-mode-row {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .bento-card {
    padding: 20rpx 18rpx;
    overflow: hidden;
  }
}

/* -------------------- 手机端及超窄视口 (max-width: 520px) -------------------- */
@media (max-width: 520px) {
  .page {
    padding: 10px 10px 48px;
  }

  .page-main-title {
    font-size: 19px;
  }

  .bento-card {
    padding: 20rpx 18rpx;
  }

  .price-number {
    font-size: 28px;
  }

  .preset-pill-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    flex-wrap: nowrap;
  }

  .preset-pill {
    min-width: 0;
    padding: 10rpx 2rpx;
  }

  .pill-text {
    font-size: 12px;
    white-space: nowrap;
  }

  .region-dropdown-grid {
    gap: 8px;
  }

  .content-box {
    padding: 12px 12px calc(110px + env(safe-area-inset-bottom)) !important;
  }

  .mobile-calc-float-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: calc(56px + env(safe-area-inset-bottom));
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.94);
    color: #ffffff;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 10px 14px;
    border-radius: 9999rpx;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.12);
    z-index: 990;
    cursor: pointer;
    box-sizing: border-box;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  }

  .mobile-calc-float-bar:active {
    transform: scale(0.98);
  }

  .float-bar-left {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
  }

  .float-tag {
    font-size: 11px;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.12);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .float-val-group {
    display: flex;
    align-items: baseline;
    gap: 2px;
    white-space: nowrap;
  }

  .float-currency {
    font-size: 12px;
    color: #60a5fa;
    font-weight: 700;
  }

  .float-amount {
    font-size: 17px;
    font-weight: 800;
    color: #60a5fa;
  }

  .float-ratio {
    font-size: 11px;
    color: #93c5fd;
    font-weight: 600;
    white-space: nowrap;
  }

  .float-bar-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .float-cta {
    font-size: 11px;
    font-weight: 700;
    color: #ffffff;
    background: #2563eb;
    padding: 5px 10px;
    border-radius: 9999rpx;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
  }
}

.mobile-calc-float-bar {
  display: none;
}

@media (max-width: 380px) {
  .pulse-chip {
    display: none;
  }

  .grid-2col {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .price-number {
    font-size: 26px;
  }

  .compare-matrix {
    padding: 12px 8px;
    gap: 8px;
  }

  .cell-val {
    font-size: 14.5px;
  }
}

/* ==================== 微动效与微交互 ==================== */
.nav-pill-item,
.quick-search-trigger,
.cyber-dropdown-trigger,
.dropdown-item,
.seg-btn,
.sub-seg-btn,
.preset-pill,
.collapse-trigger,
.official-statute-badge,
.retiree-bar {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
}

.nav-pill-item:hover,
.seg-btn:hover,
.sub-seg-btn:hover,
.preset-pill:hover,
.official-statute-badge:hover {
  transform: translateY(-1rpx) scale(1.008);
}

.nav-pill-item:active,
.cyber-dropdown-trigger:active,
.dropdown-item:active,
.seg-btn:active,
.sub-seg-btn:active,
.preset-pill:active,
.collapse-trigger:active,
.official-statute-badge:active,
.retiree-bar:active {
  transform: translateY(1rpx) scale(0.98) !important;
  transition-duration: 0.08s !important;
}
</style>
