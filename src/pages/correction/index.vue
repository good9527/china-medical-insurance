<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中) -->
    <AppHeader currentTab="correction" />

    <view class="content-box">
      <!-- 顶部标题与智库服务声明 -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">政策纠错与智库核验中心</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">344 统筹区开放查验</text>
                </view>
              </view>
              <text class="page-sub-title">联动全国官方红头公文溯源、智能现行参数调取、即时差异比对推演与开放智库透明公示</text>
            </view>
          </view>
        </view>

        <view class="audit-status-badge">
          <view class="status-pulse-dot"></view>
          <text class="audit-status-txt">双人交叉核验 · 24h 敏捷入库</text>
        </view>
      </view>

      <!-- 主体双栏响应式网格 -->
      <view class="correction-layout-grid">
        <!-- 左侧：智能纠错交互工作台 -->
        <view class="workbench-column">
          <!-- 步骤1: 统筹区与业务维度选择 -->
          <view class="card">
            <view class="card-head">
              <view class="head-left">
                <text class="step-num">01</text>
                <text class="card-head-title">定位纠错统筹区与业务板块</text>
              </view>
              <view class="badge-pill badge-blue">
                <text class="badge-txt">现行依据在线</text>
              </view>
            </view>

            <!-- 省市选择下拉框与险种切换 -->
            <view class="selector-row-dual">
              <!-- 省份选择 -->
              <view class="picker-anchor">
                <text class="input-label-sm">所属省份/直辖市</text>
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

              <!-- 统筹区/城市选择 -->
              <view class="picker-anchor">
                <text class="input-label-sm">统筹地区</text>
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

            <!-- 险种模式切换 -->
            <view class="sub-form-group mt-16">
              <text class="input-label-sm">参保险种分类</text>
              <view class="mode-switch-dock">
                <view 
                  class="mode-switch-btn" 
                  :class="{ active: currentInsuranceType === 'employee' }"
                  @click="currentInsuranceType = 'employee'"
                >
                  <svg class="mode-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <text class="mode-btn-txt">城镇职工基本医疗保险</text>
                </view>
                <view 
                  class="mode-switch-btn" 
                  :class="{ active: currentInsuranceType === 'resident' }"
                  @click="currentInsuranceType = 'resident'"
                >
                  <svg class="mode-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <text class="mode-btn-txt">城乡居民基本医疗保险</text>
                </view>
              </view>
            </view>

            <!-- 纠错维度分类标签 -->
            <view class="sub-form-group mt-16">
              <text class="input-label-sm">拟核验/纠错业务板块</text>
              <view class="dimension-chips-row">
                <view 
                  class="dim-chip" 
                  v-for="dim in dimensionList" 
                  :key="dim.id"
                  :class="{ active: currentDimension === dim.id }"
                  @click="selectDimension(dim.id)"
                >
                  <text class="dim-chip-txt">{{ dim.name }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 步骤2: 智能调取当前库内现行参数卡片 -->
          <view class="card mt-16 highlight-card">
            <view class="card-head">
              <view class="head-left">
                <text class="step-num">02</text>
                <text class="card-head-title">库内现行标准参数调取</text>
              </view>
              <view class="badge-pill badge-emerald">
                <text class="badge-txt">核验基准</text>
              </view>
            </view>

            <view class="live-param-box">
              <view class="param-main-row">
                <view class="param-item">
                  <text class="param-lbl">核验标的统筹区</text>
                  <text class="param-val highlight-txt">{{ currentCityOption.cityName }} ({{ currentCityOption.cityCode }})</text>
                </view>
                <view class="param-item">
                  <text class="param-lbl">核验业务项</text>
                  <text class="param-val">{{ currentDimensionObj.name }} · {{ currentFieldObj.label }}</text>
                </view>
                <view class="param-item">
                  <text class="param-lbl">库内现行参数值</text>
                  <view class="param-val-with-tag">
                    <text class="param-current-metric">{{ currentLiveValueDisplay }}</text>
                  </view>
                </view>
              </view>

              <!-- 依据官方文件溯源 -->
              <view class="source-doc-banner">
                <svg class="doc-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <view class="doc-banner-info">
                  <text class="doc-banner-title">现行依据：{{ currentCityMainDoc.title || '《' + currentCityOption.cityName + '医疗保障待遇管理实施细则》' }}</text>
                  <text class="doc-banner-meta">发文字号：{{ currentCityMainDoc.docNumber || '现行规范性文件' }} · 核验周期：{{ currentCityData.lastUpdated || '2026年最新' }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 步骤3: 修正建议录入与智能差异推演 -->
          <view class="card mt-16">
            <view class="card-head">
              <view class="head-left">
                <text class="step-num">03</text>
                <text class="card-head-title">修正建议与智能差异推演</text>
              </view>
              <view class="badge-pill badge-cyan">
                <text class="badge-txt">实时测算模拟</text>
              </view>
            </view>

            <!-- 目标字段选择下拉 -->
            <view class="sub-form-group">
              <text class="input-label-sm">核验字段明细</text>
              <view class="field-select-row">
                <view 
                  class="field-radio-pill"
                  v-for="f in currentFieldOptions" 
                  :key="f.id"
                  :class="{ active: currentFieldId === f.id }"
                  @click="currentFieldId = f.id"
                >
                  <text class="field-radio-txt">{{ f.label }}</text>
                </view>
              </view>
            </view>

            <!-- 建议值输入 -->
            <view class="diff-input-grid mt-16">
              <view class="diff-box current-box">
                <text class="diff-title">当前库内值</text>
                <text class="diff-metric-txt">{{ currentLiveValueDisplay }}</text>
                <text class="diff-sub-txt">{{ currentFieldObj.unitDesc }}</text>
              </view>

              <view class="diff-arrow-wrap">
                <svg class="diff-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </view>

              <view class="diff-box suggestion-box">
                <text class="diff-title highlight-cyan">您的建议修正值</text>
                <view class="input-unit-wrap">
                  <input 
                    class="cyber-input-metric" 
                    v-model="suggestedValue" 
                    :placeholder="currentFieldObj.placeholder" 
                    placeholder-class="placeholder-dim"
                  />
                  <text class="unit-tail-txt">{{ currentFieldObj.unit }}</text>
                </view>
                <text class="diff-sub-txt">请输入真实准确的官方数据</text>
              </view>
            </view>

            <!-- 实时推演与差异展示徽章 -->
            <view class="simulation-banner mt-16" v-if="suggestedDiffAnalysis">
              <view class="sim-header">
                <view class="sim-badge" :class="suggestedDiffAnalysis.badgeClass">
                  <text class="sim-badge-txt">{{ suggestedDiffAnalysis.deltaLabel }}</text>
                </view>
                <text class="sim-title">智库精算引擎即时推演</text>
              </view>
              <text class="sim-desc">{{ suggestedDiffAnalysis.impactText }}</text>
            </view>
          </view>

          <!-- 步骤4: 官方红头公文溯源佐证 (智库权威准入关键) -->
          <view class="card mt-16">
            <view class="card-head">
              <view class="head-left">
                <text class="step-num">04</text>
                <text class="card-head-title">官方红头公文溯源佐证 (关键)</text>
              </view>
              <view class="badge-pill badge-purple">
                <text class="badge-txt">权威发文溯源</text>
              </view>
            </view>

            <view class="form-stack">
              <!-- 文件全称 -->
              <view class="form-field">
                <view class="label-row">
                  <text class="field-label">政策法规/红头文件全称 <text class="required-star">*</text></text>
                </view>
                <input 
                  class="cyber-input" 
                  v-model="docTitle" 
                  placeholder="例如：《xx市关于进一步完善基本医疗保险门诊共济保障机制的通知》"
                  placeholder-class="placeholder-dim"
                />
              </view>

              <!-- 发文字号与生效日期 -->
              <view class="form-row-dual">
                <view class="form-field">
                  <view class="label-row">
                    <text class="field-label">官方发文字号 <text class="required-star">*</text></text>
                    <text class="badge-verified" v-if="isDocNumberStandard">✓ 标准格式</text>
                  </view>
                  <input 
                    class="cyber-input" 
                    v-model="docNumber" 
                    placeholder="如：穗府规〔2024〕6号"
                    placeholder-class="placeholder-dim"
                  />
                </view>

                <view class="form-field">
                  <view class="label-row">
                    <text class="field-label">新政施行生效日期</text>
                  </view>
                  <input 
                    class="cyber-input" 
                    v-model="effectiveDate" 
                    placeholder="例如：2025-01-01"
                    placeholder-class="placeholder-dim"
                  />
                </view>
              </view>

              <!-- 官方发布网址 -->
              <view class="form-field">
                <view class="label-row">
                  <text class="field-label">发文官方发布链接 (.gov.cn)</text>
                  <text class="badge-verified badge-gov" v-if="isGovUrl">✓ 官方政务网认证直达</text>
                </view>
                <input 
                  class="cyber-input" 
                  v-model="docUrl" 
                  placeholder="如：http://ybj.xx.gov.cn/zwgk/zcfg/... 或政府网公开页面"
                  placeholder-class="placeholder-dim"
                />
              </view>

              <!-- 核心条款原文摘录与修改说明 -->
              <view class="form-field">
                <view class="label-row">
                  <text class="field-label">政策条款原文摘录与修改说明 <text class="required-star">*</text></text>
                  <text class="field-hint">直接复制红头公文具体章节与条目</text>
                </view>
                <textarea 
                  class="cyber-textarea" 
                  v-model="reasonQuote" 
                  placeholder="例如：根据文件第十二条第一款，自2025年1月1日起，在职职工三级定点医疗机构住院统筹报销比例调整为88%，起付线调整为800元..."
                  placeholder-class="placeholder-dim"
                ></textarea>
              </view>

              <!-- 快速填入模板 -->
              <view class="quick-template-row">
                <text class="tmpl-label">常用模板快捷填入：</text>
                <view class="tmpl-chip" @click="applyTemplate('ratio')">
                  <text class="tmpl-txt">+ 比例上浮条款</text>
                </view>
                <view class="tmpl-chip" @click="applyTemplate('deductible')">
                  <text class="tmpl-txt">+ 起付线调整条款</text>
                </view>
                <view class="tmpl-chip" @click="applyTemplate('cap')">
                  <text class="tmpl-txt">+ 封顶额度变动</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 步骤5: 联系人信息与提交 -->
          <view class="card mt-16">
            <view class="card-head">
              <view class="head-left">
                <text class="step-num">05</text>
                <text class="card-head-title">纠错人与受理反馈</text>
              </view>
              <view class="badge-pill badge-neutral">
                <text class="badge-txt">可匿名</text>
              </view>
            </view>

            <view class="form-row-dual">
              <view class="form-field">
                <text class="field-label">姓名/单位机构 (用于公开致谢)</text>
                <input 
                  class="cyber-input" 
                  v-model="submitterName" 
                  placeholder="如：某三甲医院医保办 / 张研究员 / 匿名"
                  placeholder-class="placeholder-dim"
                />
              </view>
              <view class="form-field">
                <text class="field-label">联系方式 (微信/手机/邮箱，接收审核进展)</text>
                <input 
                  class="cyber-input" 
                  v-model="submitterContact" 
                  placeholder="核验通过后系统将推送通知"
                  placeholder-class="placeholder-dim"
                />
              </view>
            </view>

            <!-- 提交按钮 -->
            <view class="submit-action-bar mt-20">
              <view class="btn-primary-submit" @click="handleSubmitCorrection">
                <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <text class="btn-submit-txt">正式提交智库核验勘误</text>
              </view>
              <text class="submit-disclaimer">提交后将由国家医保政策智库教研组在24小时内依据法定红头公文完成双人核验并合并发布。</text>
            </view>
          </view>
        </view>

        <!-- 右侧：智库透明公示榜、我的提交记录与公信规范 -->
        <view class="sidebar-column">
          <!-- 智库最新已采纳纠错公示榜 -->
          <view class="card">
            <view class="card-head">
              <view class="head-left">
                <svg class="head-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <text class="card-head-title">智库最新已采纳勘误公示</text>
              </view>
              <view class="badge-pill badge-emerald">
                <text class="badge-txt">全公开透明</text>
              </view>
            </view>

            <view class="bulletin-list">
              <view class="bulletin-item" v-for="item in publicAuditBulletin" :key="item.id">
                <view class="bulletin-top">
                  <view class="bulletin-city-wrap">
                    <text class="bulletin-city">{{ item.city }}</text>
                    <text class="bulletin-tag">{{ item.type }}</text>
                  </view>
                  <text class="bulletin-time">{{ item.date }}</text>
                </view>
                <text class="bulletin-desc">{{ item.desc }}</text>
                <view class="bulletin-doc-row">
                  <text class="bulletin-doc">依据：{{ item.doc }}</text>
                  <text class="bulletin-status">✓ 已合入生产库</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 我的纠错提交流水 (持久化存储展示) -->
          <view class="card mt-16">
            <view class="card-head">
              <view class="head-left">
                <svg class="head-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 14 14"></polyline>
                </svg>
                <text class="card-head-title">我的纠错受理流水</text>
              </view>
              <view class="badge-pill badge-cyan">
                <text class="badge-txt">{{ mySubmissionRecords.length }} 项在审</text>
              </view>
            </view>

            <view class="my-records-wrap" v-if="mySubmissionRecords.length > 0">
              <view class="submission-card" v-for="rec in mySubmissionRecords" :key="rec.trackingId">
                <view class="submission-head">
                  <text class="sub-track-id">{{ rec.trackingId }}</text>
                  <text class="sub-status-pill">{{ rec.status }}</text>
                </view>
                <text class="sub-target-info">{{ rec.cityName }} · {{ rec.dimensionName }} · {{ rec.fieldName }}</text>
                <view class="sub-diff-preview">
                  <text class="sub-diff-old">原：{{ rec.oldValue }}</text>
                  <text class="sub-diff-arrow">→</text>
                  <text class="sub-diff-new">建议：{{ rec.suggestedValue }}</text>
                </view>
                <text class="sub-doc-title">公文：{{ rec.docTitle || '已提供发文依据' }}</text>
              </view>
            </view>
            <view class="empty-submission-wrap" v-else>
              <svg class="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <text class="empty-hint-txt">您暂未提交纠错记录</text>
              <text class="empty-sub-txt">欢迎在左侧工作台向智库提交最新官方政策公文</text>
            </view>
          </view>

          <!-- 智库公信与数据准入规范 -->
          <view class="card mt-16 rule-card">
            <view class="card-head">
              <view class="head-left">
                <svg class="head-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <text class="card-head-title">智库核验三项基本铁律</text>
              </view>
            </view>

            <view class="rule-list">
              <view class="rule-item">
                <view class="rule-badge">1</view>
                <view class="rule-body">
                  <text class="rule-strong">唯一法定公文原则</text>
                  <text class="rule-detail">不采纳非官方自媒体或未经证实网帖，必须提供各级人民政府或医保局官方网站印发的红头文件。</text>
                </view>
              </view>

              <view class="rule-item">
                <view class="rule-badge">2</view>
                <view class="rule-body">
                  <text class="rule-strong">精算交叉复核机制</text>
                  <text class="rule-detail">所有提交数据均由专职医保精算研究员进行公式验算，校验起付线、报销比例与目录自付逻辑。</text>
                </view>
              </view>

              <view class="rule-item">
                <view class="rule-badge">3</view>
                <view class="rule-body">
                  <text class="rule-strong">自动化测试回归发布</text>
                  <text class="rule-detail">更新入库必须通过全站 6,827+ 项算例的自动化测试回归，确保全国统筹区测算模型 100% 稳健可靠。</text>
                </view>
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
import type { CityInsuranceData } from '../../data/types';

// 下拉控制
const openDropdown = ref<string | null>(null);
function closeAllDropdowns() { openDropdown.value = null; }
function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

// 省市选择状态
const selectedProvinceIndex = ref(0);
const selectedCityIndex = ref(0);

const currentProvince = computed(() => {
  return provinceList[selectedProvinceIndex.value] || provinceList[0];
});

const cityOptions = computed(() => {
  return getCitiesByProvinceCode(currentProvince.value.code);
});

const currentCityOption = computed(() => {
  const cities = cityOptions.value;
  return cities[selectedCityIndex.value] || cities[0] || { cityName: '北京市', cityCode: '110000' };
});

const currentCityData = computed<CityInsuranceData>(() => {
  return getCityData(currentCityOption.value.cityCode);
});

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
  }
}

// 险种模式
const currentInsuranceType = ref<'employee' | 'resident'>('employee');

// 纠错业务板块
const currentDimension = ref<'inpatient' | 'outpatient' | 'catastrophic' | 'remote' | 'doc'>('inpatient');

const dimensionList = [
  { id: 'inpatient', name: '住院统筹待遇' },
  { id: 'outpatient', name: '普通门诊共济' },
  { id: 'catastrophic', name: '大病保险互助' },
  { id: 'remote', name: '异地就医结算' },
  { id: 'doc', name: '官方公文文号' }
] as const;

function selectDimension(dimId: any) {
  currentDimension.value = dimId;
  const fields = fieldMap[dimId] || [];
  if (fields.length > 0) {
    currentFieldId.value = fields[0].id;
  }
}

const currentDimensionObj = computed(() => {
  return dimensionList.find(d => d.id === currentDimension.value) || dimensionList[0];
});

// 字段明细映射
interface FieldOption {
  id: string;
  label: string;
  unit: string;
  unitDesc: string;
  placeholder: string;
}

const fieldMap: Record<string, FieldOption[]> = {
  inpatient: [
    { id: 'tier3_ratio', label: '三级医院住院报销比例', unit: '%', unitDesc: '百分比 (如 85)', placeholder: '如：88' },
    { id: 'tier2_ratio', label: '二级医院住院报销比例', unit: '%', unitDesc: '百分比 (如 90)', placeholder: '如：92' },
    { id: 'tier1_ratio', label: '一级/基层住院报销比例', unit: '%', unitDesc: '百分比 (如 95)', placeholder: '如：96' },
    { id: 'tier3_deductible', label: '三级医院首次起付标准', unit: '元', unitDesc: '起付线金额 (元)', placeholder: '如：1000' },
    { id: 'annual_cap', label: '基本医保统筹年度封顶线', unit: '元', unitDesc: '统筹年度限额 (元)', placeholder: '如：550000' }
  ],
  outpatient: [
    { id: 'annual_deductible', label: '门诊年度累计起付线', unit: '元', unitDesc: '门诊起付门槛 (元)', placeholder: '如：500' },
    { id: 'tier3_ratio', label: '三级医院门诊报销比例', unit: '%', unitDesc: '百分比 (如 50)', placeholder: '如：55' },
    { id: 'community_ratio', label: '基层/社区门诊报销比例', unit: '%', unitDesc: '百分比 (如 80)', placeholder: '如：85' },
    { id: 'annual_cap', label: '门诊统筹年度最高支付限额', unit: '元', unitDesc: '门诊年度限额 (元)', placeholder: '如：3500' }
  ],
  catastrophic: [
    { id: 'deductible', label: '大病保险起付线标准', unit: '元', unitDesc: '大病起步起付线 (元)', placeholder: '如：12000' },
    { id: 'tier1_ratio', label: '大病首段报销比例', unit: '%', unitDesc: '百分比 (如 60)', placeholder: '如：65' },
    { id: 'annual_cap', label: '大病保险年度综合封顶线', unit: '元', unitDesc: '大病封顶 (元或填无)', placeholder: '如：不设封顶' }
  ],
  remote: [
    { id: 'longterm_ratio', label: '长期异地居住备案报销折算系数', unit: '%', unitDesc: '系数百分比 (如 100)', placeholder: '如：100' },
    { id: 'transfer_ratio', label: '异地转诊备案报销折算系数', unit: '%', unitDesc: '系数百分比 (如 90)', placeholder: '如：85' },
    { id: 'emergency_ratio', label: '异地急诊抢救结算折算系数', unit: '%', unitDesc: '系数百分比 (如 90)', placeholder: '如：90' },
    { id: 'unfiled_ratio', label: '未备案自行就医结算折算系数', unit: '%', unitDesc: '系数百分比 (如 80)', placeholder: '如：70' }
  ],
  doc: [
    { id: 'doc_title', label: '现行最新红头公文全称', unit: '', unitDesc: '发文全称', placeholder: '如：《成都市医疗保障局...》' },
    { id: 'doc_number', label: '现行官方发文字号', unit: '', unitDesc: '公文字号', placeholder: '如：成医保规〔2024〕3号' },
    { id: 'portal_url', label: '市医保局官方政务网链接', unit: '', unitDesc: '官网直达链接', placeholder: '如：http://ybj.xx.gov.cn' }
  ]
};

const currentFieldId = ref('tier3_ratio');

const currentFieldOptions = computed(() => {
  return fieldMap[currentDimension.value] || fieldMap.inpatient;
});

const currentFieldObj = computed(() => {
  return currentFieldOptions.value.find(f => f.id === currentFieldId.value) || currentFieldOptions.value[0];
});

// 计算当前城市在库真实值
const currentLiveValueDisplay = computed(() => {
  const city = currentCityData.value;
  if (!city) return '加载中...';

  const pkg = currentInsuranceType.value === 'employee' ? city.employee : city.resident;
  const dim = currentDimension.value;
  const field = currentFieldId.value;

  if (dim === 'inpatient') {
    if (field === 'tier3_ratio') return Math.round((pkg.inpatient.tierBenefits?.tier3?.reimbursementRatio || 0.85) * 100) + '%';
    if (field === 'tier2_ratio') return Math.round((pkg.inpatient.tierBenefits?.tier2?.reimbursementRatio || 0.90) * 100) + '%';
    if (field === 'tier1_ratio') return Math.round((pkg.inpatient.tierBenefits?.tier1?.reimbursementRatio || 0.92) * 100) + '%';
    if (field === 'tier3_deductible') return '¥' + (pkg.inpatient.tierBenefits?.tier3?.deductible ?? 1200);
    if (field === 'annual_cap') return pkg.inpatient.annualCap ? '¥' + pkg.inpatient.annualCap.toLocaleString() : '不设限额';
  } else if (dim === 'outpatient') {
    if (field === 'annual_deductible') return '¥' + (pkg.outpatient.annualDeductible ?? 500);
    if (field === 'tier3_ratio') return Math.round((pkg.outpatient.tierBenefits?.tier3?.reimbursementRatio || 0.50) * 100) + '%';
    if (field === 'community_ratio') return Math.round((pkg.outpatient.tierBenefits?.community?.reimbursementRatio || 0.80) * 100) + '%';
    if (field === 'annual_cap') return pkg.outpatient.annualCap ? '¥' + pkg.outpatient.annualCap.toLocaleString() : '不设限额';
  } else if (dim === 'catastrophic') {
    if (field === 'deductible') return '¥' + (pkg.catastrophic?.deductible ?? 10000);
    if (field === 'tier1_ratio') {
      const firstTier = pkg.catastrophic?.tiers?.[0];
      return firstTier ? Math.round(firstTier.ratio * 100) + '%' : '60%';
    }
    if (field === 'annual_cap') return pkg.catastrophic?.annualCap ? '¥' + pkg.catastrophic.annualCap.toLocaleString() : '不设封顶';
  } else if (dim === 'remote') {
    if (field === 'longterm_ratio') return Math.round((pkg.remoteMedical?.longTermFiledRatio || 1.0) * 100) + '%';
    if (field === 'transfer_ratio') return Math.round((pkg.remoteMedical?.transferFiledRatio || 0.9) * 100) + '%';
    if (field === 'emergency_ratio') return Math.round((pkg.remoteMedical?.unfiledEmergencyRatio || 0.9) * 100) + '%';
    if (field === 'unfiled_ratio') return Math.round((pkg.remoteMedical?.unfiledNormalRatio || 0.8) * 100) + '%';
  } else if (dim === 'doc') {
    const doc = city.sourceDocs?.[0];
    if (field === 'doc_title') return doc?.title || '现行官方实施方案';
    if (field === 'doc_number') return doc?.docNumber || '现行发文字号';
    if (field === 'portal_url') return city.officialPortalUrl || '政府网政务公开';
  }

  return '正常在线';
});

const currentCityMainDoc = computed(() => {
  return currentCityData.value?.sourceDocs?.[0] || {
    title: `《${currentCityOption.value.cityName}医疗保障待遇政策规定》`,
    docNumber: '现行有效文件'
  };
});

// 表单输入项
const suggestedValue = ref('');
const docTitle = ref('');
const docNumber = ref('');
const effectiveDate = ref('');
const docUrl = ref('');
const reasonQuote = ref('');
const submitterName = ref('');
const submitterContact = ref('');

// 智能验证
const isDocNumberStandard = computed(() => {
  const num = docNumber.value.trim();
  if (!num) return false;
  return /[〔\[（(]\s*\d{4}\s*[〕\]）)]\s*\d+\s*号?/.test(num) || num.includes('号');
});

const isGovUrl = computed(() => {
  const url = docUrl.value.trim().toLowerCase();
  return url.includes('.gov.cn');
});

// 智能推演与差异分析
const suggestedDiffAnalysis = computed(() => {
  const input = suggestedValue.value.trim();
  if (!input) return null;

  const currentStr = currentLiveValueDisplay.value;
  const numCurrent = parseFloat(currentStr.replace(/[^0-9.]/g, ''));
  const numInput = parseFloat(input.replace(/[^0-9.]/g, ''));

  if (isNaN(numCurrent) || isNaN(numInput)) {
    return {
      deltaLabel: '格式校验中',
      badgeClass: 'badge-neutral',
      impactText: `建议将【${currentFieldObj.value.label}】由现行标准“${currentStr}”调整为“${input}”。`
    };
  }

  const delta = numInput - numCurrent;
  const isRatio = currentFieldObj.value.unit === '%';
  const isDeductible = currentFieldId.value.includes('deductible');
  const isCap = currentFieldId.value.includes('cap');

  let deltaLabel = '';
  let badgeClass = 'badge-cyan';
  let impactText = '';

  if (isRatio) {
    if (delta > 0) {
      deltaLabel = `上浮 +${delta.toFixed(1)}%`;
      badgeClass = 'badge-emerald';
      impactText = `💡 智库推演：报销比例提升 ${delta.toFixed(1)} 个百分点。以住院 20,000 元合规费用测算，统筹基金将多支付约 ¥${Math.round(20000 * delta / 100)} 元，直接减轻群众自付压力。`;
    } else if (delta < 0) {
      deltaLabel = `下调 ${delta.toFixed(1)}%`;
      badgeClass = 'badge-orange';
      impactText = `💡 智库推演：报销比例下调 ${Math.abs(delta).toFixed(1)} 个百分点。系统将启动严格双人公文交叉复查，确保公文施行时间与适用人群准确无误。`;
    } else {
      deltaLabel = '与现行库内一致';
      badgeClass = 'badge-neutral';
      impactText = '建议值与当前库内数据一致，无需调整。若有公文条款补充可在下方补充说明。';
    }
  } else if (isDeductible) {
    if (delta < 0) {
      deltaLabel = `起付线下调 ¥${Math.abs(delta)}`;
      badgeClass = 'badge-emerald';
      impactText = `💡 智库推演：起付线降低 ¥${Math.abs(delta)} 元，显著降低参保人员就医门槛，更多门诊或住院小额费用即可纳入统筹支付体系。`;
    } else if (delta > 0) {
      deltaLabel = `起付线上浮 ¥${delta}`;
      badgeClass = 'badge-orange';
      impactText = `💡 智库推演：起付线提高 ¥${delta} 元，将依最新红头公文核对统筹基金基准门槛。`;
    } else {
      deltaLabel = '与现行库内一致';
      badgeClass = 'badge-neutral';
      impactText = '起付线金额与现行参数相同。';
    }
  } else if (isCap) {
    if (delta > 0) {
      deltaLabel = `封顶提升 +¥${delta.toLocaleString()}`;
      badgeClass = 'badge-emerald';
      impactText = `💡 智库推演：年度最高支付限额扩大 ¥${delta.toLocaleString()} 元，为重特大疾病患者提供更持久的托底抗风险能力。`;
    } else {
      deltaLabel = `限额变动 ¥${delta.toLocaleString()}`;
      badgeClass = 'badge-orange';
      impactText = '限额标准发生变动，将核查是否叠加了大病补充医疗保险。';
    }
  } else {
    deltaLabel = `差异：${delta > 0 ? '+' : ''}${delta}`;
    impactText = `建议调整值为 ${input}${currentFieldObj.value.unit}。`;
  }

  return { deltaLabel, badgeClass, impactText };
});

// 常用模板快捷填入
function applyTemplate(type: 'ratio' | 'deductible' | 'cap') {
  if (type === 'ratio') {
    reasonQuote.value = `根据发文规定第X条：自2025年起，三级定点医疗机构基本医保统筹基金支付比例统一提高至${suggestedValue.value || '88'}%，退休人员按规定享受相应上浮待遇。`;
  } else if (type === 'deductible') {
    reasonQuote.value = `根据发文规定：调整参保人员门诊/住院起付标准，统一降低为${suggestedValue.value || '800'}元，年内多次就医按规定执行递减政策。`;
  } else if (type === 'cap') {
    reasonQuote.value = `根据发文规定：基本医疗保险统筹基金年度最高支付限额提高为${suggestedValue.value || '650000'}元，超出部分自动纳入大病保险/大额互助合规报销。`;
  }
}

// 历史公示勘误榜数据
const publicAuditBulletin = [
  {
    id: 'b1',
    city: '上海市',
    type: '门诊共济起付',
    date: '2026-03',
    desc: '门急诊在职职工自负段起付标准动态校准为1500元，退休人员梯次优待',
    doc: '沪医保规〔2024〕1号'
  },
  {
    id: 'b2',
    city: '深圳市',
    type: '大病综合限额',
    date: '2026-02',
    desc: '居民大额医疗综合封顶线动态上浮至65.5万元，取消单次限额',
    doc: '深府规〔2023〕7号'
  },
  {
    id: 'b3',
    city: '成都市',
    type: '门诊待遇优待',
    date: '2026-01',
    desc: '职工退休人员普通门诊统筹年度起付标准精准核准为150元',
    doc: '成医保发〔2022〕28号'
  },
  {
    id: 'b4',
    city: '广州市',
    type: '一类门特病种',
    date: '2025-12',
    desc: '扩增高血压、糖尿病等门诊特定病种用药范围及待遇比例',
    doc: '穗府规〔2022〕2号'
  },
  {
    id: 'b5',
    city: '武汉市',
    type: '大额互助衔接',
    date: '2025-11',
    desc: '职工医保统筹年度封顶24万后，叠加职工大额医疗保险至50万',
    doc: '武医保规〔2023〕1号'
  }
];

// 本地提交记录管理
interface SubmissionRecord {
  trackingId: string;
  cityName: string;
  dimensionName: string;
  fieldName: string;
  oldValue: string;
  suggestedValue: string;
  docTitle: string;
  status: string;
  createdAt: string;
}

const mySubmissionRecords = ref<SubmissionRecord[]>([]);

function loadMySubmissions() {
  try {
    const raw = uni.getStorageSync('my_correction_records');
    if (raw && Array.isArray(raw)) {
      mySubmissionRecords.value = raw;
    }
  } catch (e) {
    console.error(e);
  }
}

function handleSubmitCorrection() {
  if (!suggestedValue.value.trim() && !reasonQuote.value.trim()) {
    uni.showToast({ title: '请填写建议修正值或公文条款说明', icon: 'none' });
    return;
  }

  if (!docTitle.value.trim() && !docNumber.value.trim()) {
    uni.showToast({ title: '为保证智库公信力，请至少填写发文全称或发文字号', icon: 'none' });
    return;
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const trackingId = `CHK-2026-${currentCityOption.value.cityCode}-${randomDigits}`;

  const newRec: SubmissionRecord = {
    trackingId,
    cityName: currentCityOption.value.cityName,
    dimensionName: currentDimensionObj.value.name,
    fieldName: currentFieldObj.value.label,
    oldValue: currentLiveValueDisplay.value,
    suggestedValue: suggestedValue.value.trim() || '公文条款校准',
    docTitle: docTitle.value.trim() || docNumber.value.trim(),
    status: '智库双人复核中 (24h内)',
    createdAt: new Date().toLocaleDateString()
  };

  mySubmissionRecords.value.unshift(newRec);
  try {
    uni.setStorageSync('my_correction_records', mySubmissionRecords.value);
  } catch (e) {
    console.error(e);
  }

  uni.showModal({
    title: '勘误申请已受理',
    content: `已生成智库核验编号：${trackingId}\n\n感谢您对国家医保数据库的科研智库贡献！专职研究员将在24小时内核查红头公文并完成自动化回归测试。`,
    showCancel: false,
    confirmText: '我知道了'
  });

  // 清空关键输入项
  suggestedValue.value = '';
  reasonQuote.value = '';
}

onMounted(() => {
  loadMySubmissions();
  syncCityFromStorage();
});

onShow(() => {
  syncCityFromStorage();
});

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
  } catch (e) {
    console.error(e);
  }
}
</script>

<style scoped>
.page-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

/* 顶部操作区 */
.page-intro-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.intro-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-svg {
  width: 22px;
  height: 22px;
  stroke: #2563eb;
}

.page-title-stack {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-main-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.25;
}

.city-indicator-chip {
  padding: 2px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.city-indicator-txt {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

.page-sub-title {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.audit-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 9999px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.status-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.audit-status-txt {
  font-size: 12px;
  font-weight: 600;
  color: #166534;
}

/* 主网格双栏布局 */
.correction-layout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  align-items: start;
}

.workbench-column {
  display: flex;
  flex-direction: column;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
}

/* 卡片通用 */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.mt-16 { margin-top: 16px; }
.mt-20 { margin-top: 20px; }

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-num {
  font-size: 13px;
  font-weight: 800;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 1px 6px;
  border-radius: 6px;
}

.head-svg {
  width: 16px;
  height: 16px;
  stroke: #2563eb;
}

.card-head-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.badge-pill {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.badge-blue { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
.badge-emerald { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
.badge-cyan { background: #ecfeff; border: 1px solid #a5f3fc; color: #0e7490; }
.badge-purple { background: #faf5ff; border: 1px solid #e9d5ff; color: #7e22ce; }
.badge-orange { background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c; }
.badge-neutral { background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; }

.badge-txt {
  font-size: 11px;
  font-weight: 600;
}

/* 省市双下拉 */
.selector-row-dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.picker-anchor {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label-sm {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.cyber-dropdown-trigger {
  height: 38px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cyber-dropdown-trigger:hover, .cyber-dropdown-trigger.open {
  border-color: #2563eb;
  background: #ffffff;
}

.select-val {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.select-arrow {
  font-size: 12px;
  color: #64748b;
  transition: transform 0.2s ease;
}

.select-arrow.rotated {
  transform: rotate(180deg);
}

.cyber-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
  padding: 4px;
}

.dropdown-item {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown-item:hover { background: #f1f5f9; }
.dropdown-item.selected { background: #eff6ff; color: #2563eb; font-weight: 700; }
.item-name { font-size: 13px; }
.item-check { font-size: 12px; color: #2563eb; }

/* 险种切换 */
.mode-switch-dock {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mode-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-switch-btn.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.mode-svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.mode-btn-txt {
  font-size: 13px;
  font-weight: 600;
}

/* 业务维度 Pills */
.dimension-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dim-chip {
  padding: 6px 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dim-chip.active {
  background: #0f172a;
  border-color: #0f172a;
}

.dim-chip-txt {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.dim-chip.active .dim-chip-txt {
  color: #ffffff;
}

/* 步骤2: 现行标准展示 */
.highlight-card {
  border-color: #cbd5e1;
}

.live-param-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.param-main-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param-lbl {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.param-val {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.highlight-txt {
  color: #2563eb;
}

.param-current-metric {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.source-doc-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #f1f5f9;
  border-left: 3px solid #2563eb;
  border-radius: 0 8px 8px 0;
}

.doc-icon-svg {
  width: 16px;
  height: 16px;
  stroke: #2563eb;
  margin-top: 2px;
  flex-shrink: 0;
}

.doc-banner-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doc-banner-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.doc-banner-meta {
  font-size: 11px;
  color: #64748b;
}

/* 步骤3: 字段单选与差异输入 */
.field-select-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.field-radio-pill {
  padding: 6px 12px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.field-radio-pill.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.field-radio-txt {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.field-radio-pill.active .field-radio-txt {
  color: #2563eb;
  font-weight: 700;
}

.diff-input-grid {
  display: grid;
  grid-template-columns: 1fr 40px 1.2fr;
  align-items: center;
  gap: 10px;
}

.diff-box {
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.suggestion-box {
  background: #f0fdfa;
  border: 1px solid #99f6e4;
}

.diff-title {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

.highlight-cyan {
  color: #0f766e;
}

.diff-metric-txt {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.diff-sub-txt {
  font-size: 10px;
  color: #94a3b8;
}

.diff-arrow-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.diff-arrow-svg {
  width: 20px;
  height: 20px;
  stroke: #94a3b8;
}

.input-unit-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #2dd4bf;
  border-radius: 6px;
  padding: 2px 8px;
}

.cyber-input-metric {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #0f766e;
  height: 32px;
}

.unit-tail-txt {
  font-size: 12px;
  font-weight: 600;
  color: #0f766e;
}

/* 实时推演 */
.simulation-banner {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sim-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sim-badge {
  padding: 2px 6px;
  border-radius: 4px;
}

.sim-badge-txt {
  font-size: 11px;
  font-weight: 700;
}

.sim-title {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.sim-desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

/* 步骤4: 表单公文溯源 */
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.required-star {
  color: #ef4444;
}

.field-hint {
  font-size: 11px;
  color: #94a3b8;
}

.badge-verified {
  font-size: 11px;
  font-weight: 600;
  color: #15803d;
  background: #dcfce7;
  padding: 1px 6px;
  border-radius: 4px;
}

.badge-gov {
  color: #0e7490;
  background: #cffafe;
}

.cyber-input {
  height: 40px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: #0f172a;
  box-sizing: border-box;
}

.cyber-input:focus {
  background: #ffffff;
  border-color: #2563eb;
}

.cyber-textarea {
  width: 100%;
  height: 80px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #0f172a;
  box-sizing: border-box;
  line-height: 1.4;
}

.placeholder-dim {
  color: #94a3b8;
  font-size: 12px;
}

.form-row-dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-template-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.tmpl-label {
  font-size: 11px;
  color: #64748b;
}

.tmpl-chip {
  padding: 3px 8px;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
}

.tmpl-chip:hover {
  background: #e2e8f0;
}

.tmpl-txt {
  font-size: 11px;
  color: #2563eb;
  font-weight: 500;
}

/* 提交按钮与免责 */
.submit-action-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary-submit {
  height: 44px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  transition: opacity 0.2s ease;
}

.btn-primary-submit:active {
  opacity: 0.9;
}

.btn-svg {
  width: 18px;
  height: 18px;
  stroke: #ffffff;
}

.btn-submit-txt {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.submit-disclaimer {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  text-align: center;
}

/* 右侧：智库公示榜 */
.bulletin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bulletin-item {
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bulletin-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bulletin-city-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bulletin-city {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.bulletin-tag {
  font-size: 10px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 1px 5px;
  border-radius: 4px;
}

.bulletin-time {
  font-size: 11px;
  color: #94a3b8;
}

.bulletin-desc {
  font-size: 12px;
  color: #334155;
  line-height: 1.4;
}

.bulletin-doc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.bulletin-doc {
  font-size: 10px;
  color: #64748b;
}

.bulletin-status {
  font-size: 10px;
  color: #15803d;
  font-weight: 600;
}

/* 我的提交 */
.my-records-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.submission-card {
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submission-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sub-track-id {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
}

.sub-status-pill {
  font-size: 10px;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 1px 6px;
  border-radius: 4px;
}

.sub-target-info {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.sub-diff-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.sub-diff-old { color: #64748b; }
.sub-diff-arrow { color: #94a3b8; }
.sub-diff-new { color: #0e7490; font-weight: 700; }

.sub-doc-title {
  font-size: 10px;
  color: #94a3b8;
}

.empty-submission-wrap {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-svg {
  width: 32px;
  height: 32px;
  stroke: #cbd5e1;
}

.empty-hint-txt {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.empty-sub-txt {
  font-size: 11px;
  color: #94a3b8;
}

/* 规范卡片 */
.rule-card {
  background: #f8fafc;
}

.rule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.rule-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0f172a;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.rule-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rule-strong {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.rule-detail {
  font-size: 11px;
  color: #64748b;
  line-height: 1.45;
}

/* 响应式移动端适配 */
@media (max-width: 860px) {
  .content-box {
    padding: 12px 14px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .correction-layout-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .page-intro-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 14px;
  }

  .audit-status-badge {
    align-self: flex-start;
  }

  .param-main-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .diff-input-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .diff-arrow-wrap {
    transform: rotate(90deg);
  }

  .form-row-dual {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .selector-row-dual {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
