<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中，永不跳动) -->
    <AppHeader currentTab="policy" />

    <view class="content-box">
      <!-- 页面简明标题与操作栏 -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">{{ currentCity.cityName }} · 医保报销待遇</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">现行有效标准</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 地区切换自定义下拉框与快速搜索 -->
        <view class="toolbar-pickers-row">
          <view class="quick-search-trigger" @click="showSearchModal = !showSearchModal">
            <text class="search-trigger-txt">{{ showSearchModal ? '收起 ✕' : '快速检索城市 ↵' }}</text>
          </view>

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

      <!-- 城市快速搜索面板 -->
      <view class="search-panel" v-if="showSearchModal" @click.stop>
        <view class="input-wrap">
          <input 
            class="search-input" 
            v-model="citySearchQuery" 
            placeholder="输入城市拼音或中文（如：成都 / 拉萨 / 咸阳）" 
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
            <text class="c-action">查看待遇 ↵</text>
          </view>
        </view>
        <view class="search-empty" v-else-if="citySearchQuery.trim()">
          <text class="empty-txt">未匹配到该城市，请尝试省份全称</text>
        </view>
      </view>

      <!-- 身份类型切换 (精致胶囊切换，去除冗余描述) -->
      <view class="identity-switch-bar mb-16">
        <view 
          class="switch-pill-btn" 
          :class="{ active: currentType === 'employee' }"
          @click="currentType = 'employee'; persistCityChoice()"
        >
          <text class="pill-title">城镇职工医保</text>
        </view>
        <view 
          class="switch-pill-btn" 
          :class="{ active: currentType === 'resident' }"
          @click="currentType = 'resident'; persistCityChoice()"
        >
          <text class="pill-title">城乡居民医保</text>
        </view>
      </view>

      <!-- 立即去测算 CTA 卡片 (高转换导流横幅) -->
      <view class="calc-shortcut-banner mb-20" @click="goToCalculator">
        <view class="banner-left">
          <view class="banner-icon-wrap">
            <svg class="banner-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <view class="banner-text">
            <text class="banner-title">想了解在 {{ currentCity.cityName }} 能实际报销多少？</text>
            <text class="banner-sub">一键带入当前 {{ currentType === 'employee' ? '职工' : '居民' }} 政策参数，快速模拟医疗花费与自付金额</text>
          </view>
        </view>
        <view class="banner-btn">
          <text class="banner-btn-txt">立即去测算 ➔</text>
        </view>
      </view>

      <!-- 门诊与住院待遇卡片 -->
      <view class="benefits-grid">
        <!-- 门诊待遇卡片 -->
        <view class="card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">普通门诊统筹待遇</text>
            </view>
            <view class="badge-pill" :class="currentType === 'employee' ? 'badge-cyan' : 'badge-emerald'">
              <text class="badge-txt">{{ currentType === 'employee' ? '职工门诊共济' : '基层门诊统筹' }}</text>
            </view>
          </view>

          <!-- 门诊核心两要素指标 (纯净清晰，去除下方冗长描述) -->
          <view class="metric-grid">
            <view class="metric-cell">
              <text class="m-label">{{ outpatientDeductibleDisplay.label }}</text>
              <text class="m-val" :class="currentType === 'employee' ? 'text-cyan' : 'text-emerald'">{{ outpatientDeductibleDisplay.val }}</text>
            </view>
            <view class="metric-cell">
              <text class="m-label">年度统筹最高支付限额</text>
              <text class="m-val text-white">{{ outpatientCapDisplay.val }}</text>
            </view>
          </view>

          <!-- 门诊各级医疗机构报销比例对照表 -->
          <view class="table-container">
            <view class="t-row t-head">
              <text class="t-cell f-2">医疗机构等级</text>
              <text class="t-cell f-1 text-center">门诊起付</text>
              <text class="t-cell f-1 text-center">{{ currentType === 'employee' ? '在职比例' : '报销比例' }}</text>
              <text class="t-cell f-1 text-center" v-if="currentType === 'employee'">退休比例</text>
            </view>
            <view class="t-row" v-for="(tier, key) in displayOutpatientTiers" :key="key">
              <view class="t-cell f-2 tier-cell">
                <view class="tier-tag" :class="getTierTagClass(key)">{{ getTierTag(key) }}</view>
                <text class="tier-title">{{ getTierCleanName(key, tier.tierName) }}</text>
              </view>
              <text class="t-cell f-1 text-center font-bold" :class="tier.deductible === 0 ? 'text-emerald' : 'text-slate-light'">
                {{ tier.deductible === 0 ? '0 元 (免)' : '¥' + tier.deductible }}
              </text>
              <text class="t-cell f-1 text-center font-bold text-cyan">{{ Math.round(tier.reimbursementRatio * 100) }}%</text>
              <text class="t-cell f-1 text-center font-bold text-amber" v-if="currentType === 'employee'">
                {{ Math.round((tier.reimbursementRatio + (tier.retireeRatioBonus || 0)) * 100) }}%
              </text>
            </view>
          </view>
          <!-- 门诊未覆盖医院极简注释 (替代原先3整行0%无效废行) -->
          <view class="table-footnote" v-if="currentType === 'resident' && hasUncoveredOutpatientTiers">
            <text class="footnote-txt">* 二级及以上定点医院普通门诊暂不纳入统筹报销</text>
          </view>
        </view>

        <!-- 住院待遇卡片 -->
        <view class="card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">住院医疗统筹待遇</text>
            </view>
            <view class="badge-pill badge-indigo">
              <text class="badge-txt">{{ inpatientCapBadgeText }}</text>
            </view>
          </view>

          <!-- 住院各级医院起付线与报销比例对照表 -->
          <view class="table-container">
            <view class="t-row t-head">
              <text class="t-cell f-2">医疗机构等级</text>
              <text class="t-cell f-1 text-center">起付线</text>
              <text class="t-cell f-1 text-center">{{ currentType === 'employee' ? '在职比例' : '居民比例' }}</text>
              <text class="t-cell f-1 text-center" v-if="currentType === 'employee'">退休比例</text>
            </view>
            <view class="t-row" v-for="(tier, key) in currentPkg.inpatient.tierBenefits" :key="key">
              <view class="t-cell f-2 tier-cell">
                <view class="tier-tag" :class="getTierTagClass(key)">{{ getTierTag(key) }}</view>
                <text class="tier-title">{{ getTierCleanName(key, tier.tierName) }}</text>
              </view>
              <text class="t-cell f-1 text-center font-bold text-white">¥{{ tier.deductible }}</text>
              <text class="t-cell f-1 text-center font-bold text-cyan">{{ Math.round(tier.reimbursementRatio * 100) }}%</text>
              <text class="t-cell f-1 text-center font-bold text-amber" v-if="currentType === 'employee'">
                {{ Math.round((tier.reimbursementRatio + (tier.retireeRatioBonus || 0)) * 100) }}%
              </text>
            </view>
          </view>

          <!-- 多次住院递减规则 -->
          <view class="memo-notice mt-12" v-if="currentPkg.inpatient.repeatedDeductibleRule">
            <text class="notice-tag">多次住院优待：</text>
            <text class="notice-txt">{{ currentPkg.inpatient.repeatedDeductibleRule }}</text>
          </view>
        </view>
      </view>

      <!-- 官方参考政策文件与权威溯源档案矩阵 -->
      <view class="card mt-24">
        <view class="card-head">
          <view class="head-left">
            <text class="card-head-title">依据的现行官方红头文件与法定溯源档案</text>
          </view>
          <view class="badge-pill badge-cyan">
            <text class="badge-txt">共 {{ currentCity.sourceDocs.length }} 份规范性文件纳管</text>
          </view>
        </view>

        <!-- 权威防盗链与查验说明提示 -->
        <view class="doc-notice-banner">
          <text class="doc-notice-icon">🛡️</text>
          <text class="doc-notice-text">
            【官方溯源保障】所有待遇参数均采掘自地方医保局或人民政府现行正式红头文件。部分省市政务网设有严格的外部防盗链规则（拦截跨域外链跳转）或历史静态归档迁移。若直链提示拦截或 404，推荐点击【文号精准核验】直达官方公文公开页面。
          </text>
        </view>

        <!-- 溯源公文档案卡片网格 -->
        <view class="doc-grid">
          <view class="doc-card" v-for="doc in currentCity.sourceDocs" :key="doc.docId">
            <view class="doc-card-top">
              <view class="doc-seal-pill">
                <svg class="seal-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18"></path>
                  <path d="M5 21V7l7-4 7 4v14"></path>
                  <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9z"></path>
                </svg>
                <text class="doc-type-label">现行法定规范性文件</text>
              </view>
              <text class="doc-status-tag">官方现行有效</text>
            </view>

            <text class="doc-title">{{ doc.title }}</text>
            <text class="doc-number">{{ doc.docNumber }}</text>

            <view class="doc-meta-row">
              <text class="meta-label">发文单位：</text>
              <text class="meta-val">{{ doc.issuingDept.join('、') }}</text>
            </view>

            <view class="doc-meta-row" v-if="doc.publishDate">
              <text class="meta-label">有效时期：</text>
              <text class="meta-val">{{ doc.publishDate }} 发布（{{ doc.effectiveDate }} 施行）</text>
            </view>

            <view class="doc-quote-box">
              <text class="quote-header">核心法定条款摘录：</text>
              <text class="quote-content">“{{ doc.summaryQuote }}”</text>
            </view>

            <view class="doc-actions-row">
              <view class="doc-btn btn-view" @click="openDocUrl(doc.officialUrl)">
                <text class="doc-btn-txt">查看官网出处 ↗</text>
              </view>
              <view class="doc-btn btn-search" @click="searchDocByNumber(doc.docNumber, doc.title)">
                <text class="doc-btn-txt">文号精准核验 🔍</text>
              </view>
              <view class="doc-btn btn-copy" @click="copyDocUrl(doc.officialUrl)">
                <text class="doc-btn-txt">复制链接</text>
              </view>
            </view>
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
import { allCities } from '../../data';

// 下拉菜单控制
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
}

function onSearchConfirm() {
  if (filteredSearchCities.value.length > 0) {
    selectSearchedCity(filteredSearchCities.value[0]);
  }
}

function persistCityChoice() {
  if (currentCityOption.value?.cityCode) {
    uni.setStorageSync('selected_medical_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_type', currentType.value);
  }
}

function goToCalculator() {
  persistCityChoice();
  uni.switchTab({ url: '/pages/index/index' });
}

function syncCityFromStorage() {
  try {
    const targetCityCode = uni.getStorageSync('selected_policy_city_code') || uni.getStorageSync('selected_medical_city_code');
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
    console.error('Failed to sync policy city:', e);
  }
}

onMounted(() => {
  syncCityFromStorage();
});

onShow(() => {
  syncCityFromStorage();
});

// 省市二级联动
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

// 获取当前城市政策实体
const currentCity = computed(() => {
  const code = currentCityOption.value.hasData ? currentCityOption.value.cityCode : '610100';
  return getCityData(code)!;
});

// 规范核验日期推导（告别 undefined）
const cityLastUpdatedText = computed(() => {
  if (currentCity.value?.lastUpdated) return currentCity.value.lastUpdated;
  const docs = currentCity.value?.sourceDocs || [];
  for (const d of docs) {
    if (d.publishDate && d.publishDate.length >= 7) return d.publishDate;
  }
  return '2026-03-01';
});

const currentType = ref<'employee' | 'resident'>('employee');
const currentPkg = computed(() => currentCity.value[currentType.value]);

// 门诊起付线文案（精确区分【按年度累计起付】与【按就医诊次起付】及退休优待）
const outpatientDeductibleDisplay = computed(() => {
  const pkg = currentPkg.value.outpatient;
  const isPerVisit = pkg.deductibleType === 'per_visit';

  if (currentType.value === 'employee') {
    if (isPerVisit) {
      const commDed = pkg.tierBenefits.community?.deductible ?? 0;
      const t2Ded = pkg.tierBenefits.tier2?.deductible ?? pkg.annualDeductible;
      return {
        label: '门诊起付标准 (按诊次起付)',
        val: commDed === 0 ? `基层 0 元 / 医院每次 ¥${t2Ded}` : `每次 ¥${pkg.annualDeductible}`,
        hint: '按每就医诊次执行起付线，基层通常免起付或低起付，每次达标后即时按比例报销'
      };
    }

    if (pkg.annualDeductible === 0) {
      return { 
        label: '年度门诊起付线',
        val: '0 元 (免起付门槛)', 
        hint: '职工门诊免设起付门槛，门诊就诊直接按对应医院比例报销' 
      };
    }

    if (pkg.annualDeductibleRetiree !== undefined && pkg.annualDeductibleRetiree !== pkg.annualDeductible) {
      return {
        label: '年度门诊起付线',
        val: `在职 ¥${pkg.annualDeductible} / 退休 ¥${pkg.annualDeductibleRetiree}`,
        hint: `自然年度内累计自付超起付门槛（退休优待起付线 ¥${pkg.annualDeductibleRetiree}）后按比例实时报销`
      };
    }

    return {
      label: '年度门诊起付线',
      val: `¥${pkg.annualDeductible}`,
      hint: '自然年度内门诊政策范围内费用累计自付满此起付线后按比例实时报销'
    };
  } else {
    // 居民医保 (防御式判断，彻底杜绝 undefined)
    const dedVal = pkg.annualDeductible;
    if (dedVal === undefined || dedVal === null || dedVal === 0) {
      return { 
        label: '年度门诊起付线',
        val: '0 元 (免起付)', 
        hint: '在定点基层乡镇卫生院或社区卫生服务中心凭医保凭证即时结算' 
      };
    }
    return {
      label: isPerVisit ? '门诊起付标准 (按诊次)' : '年度门诊起付线',
      val: `¥${dedVal}`,
      hint: isPerVisit ? '每次就诊扣除起付线后按规定比例结算' : '自然年度内门诊政策范围内费用累计满此起付标准后按比例报销'
    };
  }
});

// 门诊封顶线文案（告别 9999999 等假数据，规范展示上不封顶与退休上浮额度）
const outpatientCapDisplay = computed(() => {
  const pkg = currentPkg.value.outpatient;
  if (pkg.annualCap >= 9999999) {
    return {
      val: '不设封顶 (上不封顶)',
      hint: currentType.value === 'employee' ? '普通门诊统筹不设年度最高封顶线，医保政策范围内费用按比例报销' : '门诊统筹不设封顶线'
    };
  }
  if (currentType.value === 'employee') {
    const retireeCap = pkg.annualCapRetiree || pkg.annualCap;
    const hint = retireeCap !== pkg.annualCap 
      ? `在职最高 ¥${pkg.annualCap}，退休人员上调优待限额 ¥${retireeCap}`
      : '自然年度内普通门诊统筹基金最高支付限额';
    return { val: `¥${pkg.annualCap}`, hint };
  }
  return { val: `¥${pkg.annualCap}`, hint: '自然年度内普通门诊统筹基金最高支付限额' };
});

// 住院封顶徽章文案（展示基本统筹与大病互助综合保障水平）
const inpatientCapBadgeText = computed(() => {
  const inPkg = currentPkg.value.inpatient;
  if (inPkg.comprehensiveCap && inPkg.comprehensiveCap > inPkg.annualCap) {
    return `基本封顶 ¥${inPkg.annualCap / 10000}万 · 大病综合保障 ¥${inPkg.comprehensiveCap / 10000}万`;
  }
  return `基本医保年封顶 ¥${inPkg.annualCap / 10000}万`;
});

// 门诊经办提醒文案
const outpatientMemoText = computed(() => {
  const pkg = currentPkg.value.outpatient;
  if (currentType.value === 'employee') {
    let text = '';
    if (pkg.annualDeductible === 0) {
      text += '职工门诊共济无起付线门槛，定点医疗机构挂号就医凭医保码直接扣减支付；';
    } else {
      const retTip = pkg.annualDeductibleRetiree ? `（退休优待 ¥${pkg.annualDeductibleRetiree}）` : '';
      text += `职工门诊共济起付线 ¥${pkg.annualDeductible}${retTip}按自然年度累计；自付超过起付线后统筹基金自动扣减支付；`;
    }
    if (pkg.annualCap >= 9999999) {
      text += '普通门诊统筹不设年度最高封顶线（上不封顶）。';
    } else {
      const retCapTip = (pkg.annualCapRetiree && pkg.annualCapRetiree !== pkg.annualCap) ? `，退休人员限额 ¥${pkg.annualCapRetiree}` : '';
      text += `直至达到年度最高支付限额（在职限额 ¥${pkg.annualCap}${retCapTip}）。`;
    }
    return text;
  } else {
    if (pkg.annualDeductible === 0) {
      return `居民门诊统筹重点保障基层就医，在定点乡镇卫生院或社区卫生服务中心免起付线即时结算（${currentCity.value.cityName}年度限额 ¥${pkg.annualCap}）。`;
    } else {
      return `城乡居民门诊统筹起付标准为 ¥${pkg.annualDeductible}，在定点医疗机构年度累计超起付线后按比例结算（${currentCity.value.cityName}年度限额 ¥${pkg.annualCap}）。`;
    }
  }
});

// 门诊表格过滤：居民医保下过滤 0% 未覆盖无效行，避免界面杂乱堆砌
const displayOutpatientTiers = computed(() => {
  const tiers = currentPkg.value.outpatient.tierBenefits;
  if (currentType.value === 'resident') {
    const activeEntries = Object.entries(tiers).filter(([_, t]) => t.reimbursementRatio > 0);
    if (activeEntries.length > 0) {
      return Object.fromEntries(activeEntries);
    }
  }
  return tiers;
});

// 是否存在未覆盖的门诊机构
const hasUncoveredOutpatientTiers = computed(() => {
  const tiers = currentPkg.value.outpatient.tierBenefits;
  return Object.values(tiers).some(t => t.reimbursementRatio === 0);
});

// 规范简洁的机构名称，杜绝重叠与长词挤压
function getTierCleanName(key: string | number, rawName: string) {
  switch (key) {
    case 'community': return '社区卫生站 / 村卫生室';
    case 'tier1': return '一级定点医院 / 卫生院';
    case 'tier2': return '二级定点医院';
    case 'tier3': return '三级定点医院';
    case 'tier3_top': return '三甲重点医院';
    default: return rawName;
  }
}

function getTierTag(key: string | number) {
  switch (key) {
    case 'community': return '基层';
    case 'tier1': return '一级';
    case 'tier2': return '二级';
    case 'tier3': return '三级';
    case 'tier3_top': return '三甲';
    default: return '定点';
  }
}

function getTierTagClass(key: string | number) {
  switch (key) {
    case 'community': return 'tag-emerald';
    case 'tier1': return 'tag-blue';
    case 'tier2': return 'tag-cyan';
    case 'tier3': return 'tag-indigo';
    case 'tier3_top': return 'tag-amber';
    default: return 'tag-cyan';
  }
}

function openDocUrl(url: string) {
  if (!url || url === '#' || url.trim() === '') {
    uni.showToast({ title: '暂未提供直接公网外链', icon: 'none' });
    return;
  }
  if (typeof window !== 'undefined') {
    // 关键优化：采用 noopener + noreferrer 的动态超链接跳转，彻底剥离 Referer 避免政务网防盗链 403 阻断
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noreferrer noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } else {
    copyDocUrl(url);
  }
}

function searchDocByNumber(docNumber: string, title: string) {
  const query = encodeURIComponent(`${docNumber} ${title}`);
  const searchUrl = `https://www.baidu.com/s?wd=${query}`;
  if (typeof window !== 'undefined') {
    try {
      const a = document.createElement('a');
      a.href = searchUrl;
      a.target = '_blank';
      a.rel = 'noreferrer noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  } else {
    uni.setClipboardData({
      data: `${docNumber} ${title}`,
      success: () => {
        uni.showToast({ title: '发文字号已复制，可搜索核验', icon: 'none' });
      }
    });
  }
}

function copyDocUrl(url: string) {
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '官方链接已复制', icon: 'none' });
    }
  });
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

/* 页面顶部简明标题与省市切换工具条 (清新实用，去除吹嘘) */
.page-intro-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 0 4px;
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

.tier-cell {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
}

.tier-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
  line-height: 1.4;
  flex-shrink: 0;
}

.tag-emerald {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.tag-blue {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.tag-cyan {
  background: #f0fdfa;
  color: #0d9488;
  border: 1px solid #99f6e4;
}

.tag-indigo {
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
}

.tag-amber {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.doc-seal-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 3px 10px;
  border-radius: 9999rpx;
}

.seal-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
  flex-shrink: 0;
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

/* 快速检索城市触发器与面板 */
.quick-search-trigger {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12rpx;
  padding: 0 16rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-trigger-txt {
  font-size: 22rpx;
  color: #2563eb;
  font-weight: 700;
  white-space: nowrap;
}

.search-panel {
  background: #ffffff;
  border: 1px solid #93c5fd;
  border-radius: 12rpx;
  padding: 12px;
  margin-bottom: 14px;
  box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.08);
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 76rpx;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8rpx;
  padding: 0 50rpx 0 20rpx;
  font-size: 24rpx;
  color: #0f172a;
  box-sizing: border-box;
}

.search-clear-btn {
  position: absolute;
  right: 18rpx;
  font-size: 24rpx;
  color: #94a3b8;
  cursor: pointer;
  padding: 4rpx;
}

.search-results-list {
  margin-top: 10px;
  max-height: 380rpx;
  overflow-y: auto;
  border-top: 1px solid #f1f5f9;
}

.search-result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 10rpx;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
}

.search-result-row:hover {
  background: #f0fdf4;
}

.row-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.c-name {
  font-size: 26rpx;
  font-weight: 700;
  color: #0f172a;
}

.c-prov {
  font-size: 22rpx;
  color: #64748b;
  background: #f1f5f9;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}

.c-action {
  font-size: 22rpx;
  color: #2563eb;
  font-weight: 600;
}

.search-empty {
  padding: 16px 0;
  text-align: center;
}

.empty-txt {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 立即去测算 CTA 卡片 */
.calc-shortcut-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 14px 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.05);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.calc-shortcut-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.1);
  border-color: #93c5fd;
}

.calc-shortcut-banner:active {
  transform: scale(0.99);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
}

.banner-svg {
  width: 20px;
  height: 20px;
  stroke: #2563eb;
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.banner-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e3a8a;
}

.banner-sub {
  font-size: 12px;
  color: #64748b;
}

.banner-btn {
  background: #2563eb;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 9999rpx;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.banner-btn-txt {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}

/* 地区选择器行 */
.toolbar-pickers-row {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
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

/* 身份类型切换（现代轻量胶囊风格） */
.identity-switch-bar {
  display: inline-flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  width: fit-content;
  align-self: flex-start;
}

.switch-pill-btn {
  padding: 8px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.switch-pill-btn.active {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.pill-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  line-height: 1;
}

.switch-pill-btn.active .pill-title {
  color: #0f172a;
  font-weight: 700;
}

.mb-20 { margin-bottom: 20px; }
.mt-24 { margin-top: 24px; }
.mt-16 { margin-top: 16px; }
.mt-12 { margin-top: 12px; }

/* 待遇双栏 */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 900px) {
  .benefits-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  overflow: hidden;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 18px;
}

.card-head-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.badge-pill {
  padding: 3px 10px;
  border-radius: 9999rpx;
}

.badge-cyan { background: #eff6ff; border: 1px solid #bfdbfe; }
.badge-cyan .badge-txt { color: #1d4ed8; }

.badge-emerald { background: #ecfdf5; border: 1px solid #a7f3d0; }
.badge-emerald .badge-txt { color: #047857; }

.badge-indigo { background: #eef2ff; border: 1px solid #c7d2fe; }
.badge-indigo .badge-txt { color: #4338ca; }

.badge-txt { font-size: 12px; font-weight: 600; }

.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-cell {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
}

.m-label { font-size: 12px; color: #64748b; display: block; font-weight: 500; }
.m-val { font-size: 20px; font-weight: 800; display: block; margin-top: 4px; color: #0f172a; }

.table-container {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}

.t-row {
  display: flex;
  padding: 10px 14px;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.t-row:last-child { border-bottom: none; }
.t-head { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.t-head .t-cell { color: #64748b; font-weight: 600; font-size: 12px; }
.t-cell { font-size: 13px; color: #1e293b; }

.tier-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.tier-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  line-height: 1.2;
  flex-shrink: 0;
}

.tag-emerald { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
.tag-blue { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.tag-cyan { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
.tag-indigo { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
.tag-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

.tier-title {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-footnote {
  padding: 8px 12px;
  background: #f8fafc;
  border-top: 1px dashed #e2e8f0;
}

.footnote-txt {
  font-size: 11px;
  color: #94a3b8;
}

.f-1 { flex: 1; }
.f-2 { flex: 2; }
.text-center { text-align: center; }
.font-med { font-weight: 500; }
.font-bold { font-weight: 700; }

.text-dark { color: #0f172a; }
.text-white { color: #0f172a; }
.text-cyan { color: #0284c7; }
.text-amber { color: #d97706; }
.text-emerald { color: #059669; }
.text-dim { color: #64748b; font-size: 12px; }

.memo-notice {
  background: #eff6ff;
  border-left: 3px solid #2563eb;
  border-radius: 6px;
  padding: 10px 14px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.notice-tag { font-size: 12px; color: #1d4ed8; font-weight: 700; flex-shrink: 0; }
.notice-txt { font-size: 12px; color: #1e3a8a; line-height: 1.5; }

.doc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16rpx;
  margin-top: 16rpx;
}

@media (min-width: 800px) {
  .doc-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.doc-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease;
}

.doc-card:hover {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
}

.doc-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.doc-type-label { font-size: 18rpx; color: #1d4ed8; font-weight: 600; }
.doc-status-tag {
  font-size: 18rpx;
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 2rpx 10rpx;
  border-radius: 9999rpx;
  font-weight: 600;
}

.doc-title { font-size: 24rpx; font-weight: 700; color: #0f172a; line-height: 1.4; display: block; }
.doc-number { font-size: 18rpx; color: #64748b; display: block; margin-top: 4rpx; }
.doc-meta-row { display: flex; font-size: 18rpx; margin-top: 10rpx; }
.meta-label { color: #64748b; }
.meta-val { color: #334155; }

.doc-quote-box {
  background: #f8fafc;
  border-left: 3rpx solid #cbd5e1;
  padding: 10rpx 12rpx;
  border-radius: 8rpx;
  margin-top: 12rpx;
}

.quote-header { font-size: 16rpx; color: #64748b; display: block; margin-bottom: 2rpx; }
.quote-content { font-size: 18rpx; color: #334155; line-height: 1.5; display: block; }

.doc-notice-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10rpx;
  padding: 12rpx 16rpx;
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.doc-notice-icon {
  font-size: 20rpx;
  line-height: 1.4;
  flex-shrink: 0;
}

.doc-notice-text {
  font-size: 19rpx;
  color: #166534;
  line-height: 1.5;
}

.doc-actions-row { display: flex; gap: 10rpx; margin-top: 16rpx; }
.doc-btn { flex: 1; padding: 8rpx 0; text-align: center; border-radius: 8rpx; cursor: pointer; }
.btn-view { background: #eff6ff; border: 1px solid #bfdbfe; }
.btn-view:hover { background: #dbeafe; }
.btn-view .doc-btn-txt { color: #1d4ed8; }
.btn-search { background: #f0fdfa; border: 1px solid #99f6e4; }
.btn-search:hover { background: #ccfbf1; }
.btn-search .doc-btn-txt { color: #0f766e; }
.btn-copy { background: #f8fafc; border: 1px solid #e2e8f0; }
.btn-copy:hover { background: #f1f5f9; }
.btn-copy .doc-btn-txt { color: #475569; }
.doc-btn-txt { font-size: 18rpx; font-weight: 600; }


/* ==================== 优雅收敛微弹性动效 ==================== */
.cyber-dropdown-trigger,
.dropdown-item,
.tab-card,
.doc-btn,
.badge-pill {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
  will-change: transform;
}

.cyber-dropdown-trigger:hover,
.tab-card:hover,
.doc-btn:hover {
  transform: translateY(-1rpx) scale(1.008);
}

.cyber-dropdown-trigger:active,
.dropdown-item:active,
.tab-card:active,
.doc-btn:active,
.badge-pill:active {
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

  .tab-group-2 {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .tab-card {
    padding: 18rpx 20rpx;
  }

  .tab-card-title {
    font-size: 28rpx;
  }

  .tab-card-desc {
    font-size: 22rpx;
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

  .metric-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .metric-cell {
    padding: 16rpx 18rpx;
  }

  .m-label {
    font-size: 24rpx;
  }

  .m-val {
    font-size: 30rpx;
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .t-row {
    padding: 14rpx 16rpx;
  }

  .t-cell {
    font-size: 24rpx;
  }

  .t-head .t-cell {
    font-size: 24rpx;
    font-weight: 700;
  }

  .doc-meta-row {
    flex-direction: column;
    gap: 6rpx;
  }

  .doc-actions-row {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .doc-btn {
    flex: 1;
    min-width: calc(50% - 6px);
    justify-content: center;
    padding: 10rpx 14rpx;
  }

  .content-box {
    padding: 12px 12px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .calc-shortcut-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 14px;
  }

  .banner-left {
    gap: 10px;
  }

  .banner-icon-wrap {
    width: 32px;
    height: 32px;
  }

  .banner-svg {
    width: 16px;
    height: 16px;
  }

  .banner-title {
    font-size: 13px;
  }

  .banner-sub {
    font-size: 11px;
  }

  .banner-btn {
    width: 100%;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }

  .banner-btn-txt {
    font-size: 13px;
  }

  .quick-search-trigger {
    width: 100%;
    justify-content: center;
  }
}

</style>
