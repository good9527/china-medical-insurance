<template>
  <view class="home-page-container" @click="handlePageClick">
    <!-- 全局统一顶栏 -->
    <AppHeader currentTab="home" />

    <view class="home-main-wrapper">
      <!-- 英雄区：标题、动态标杆与实时搜索 -->
      <view class="hero-control-header">
        <view class="hero-left-title">
          <view class="hero-badge-pill">
            <span class="pulse-dot"></span>
            <text class="badge-txt">天地图官方矢量配准 · 审图号 GS（2026）4921号</text>
            <text class="count-txt">全国 348 统筹区全收录</text>
          </view>
          <view class="hero-title-row">
            <text class="hero-h1">全国医保统筹区空间全景地图</text>
          </view>
          <text class="hero-sub">轻触或悬浮可探索各地真实医保待遇，点击统筹区直接转跳查看政策细则、估算报销与双城对决</text>
        </view>

        <!-- 快速搜索框与标杆推荐 -->
        <view class="hero-search-area">
          <view class="search-input-wrapper">
            <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              class="map-search-input"
              v-model="searchKeyword" 
              placeholder="输入省份或城市（如：成都 / 深圳 / 西安 / 威海）" 
              @click.stop
            />
            <text class="clear-search" v-if="searchKeyword" @click.stop="searchKeyword = ''">✕</text>
          </view>

          <!-- 搜索联想下拉面板 -->
          <view class="search-suggest-panel" v-if="searchKeyword.trim() && suggestedCities.length > 0" @click.stop>
            <view 
              class="suggest-item"
              v-for="item in suggestedCities"
              :key="'sug_' + item.cityCode"
              @click="selectCity(item, true)"
            >
              <view class="sug-left">
                <text class="sug-city">{{ item.cityName }}</text>
                <text class="sug-prov">{{ item.provinceName }}</text>
              </view>
              <view class="sug-right">
                <text class="sug-score font-mono">{{ item.overallScore }}分</text>
                <text class="sug-arrow">定位 ↗</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 地图工具条：图层指标切换与快速标杆统筹区 -->
      <view class="map-toolbar">
        <view class="dimension-picker">
          <text class="dim-lead">图层指标：</text>
          <view class="dim-chips-group">
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'overall' }"
              @click="currentMetric = 'overall'"
            >
              <text class="dim-ico">🏆</text>
              <text class="dim-txt">综合保障力</text>
            </view>
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'inpatient' }"
              @click="currentMetric = 'inpatient'"
            >
              <text class="dim-ico">🏥</text>
              <text class="dim-txt">职工三级住院比</text>
            </view>
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'outpatient' }"
              @click="currentMetric = 'outpatient'"
            >
              <text class="dim-ico">💊</text>
              <text class="dim-txt">门诊共济封顶</text>
            </view>
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'resident' }"
              @click="currentMetric = 'resident'"
            >
              <text class="dim-ico">🏡</text>
              <text class="dim-txt">居民三级住院</text>
            </view>
          </view>
        </view>

        <!-- 标杆城市快速触达 -->
        <view class="benchmark-quick-bar">
          <text class="bench-label">标杆统筹区：</text>
          <view class="bench-chips">
            <text class="bench-item" @click="focusCityByCode('440300')">🥇 深圳市 91.6</text>
            <text class="bench-item" @click="focusCityByCode('320100')">🥈 南京市 82.3</text>
            <text class="bench-item" @click="focusCityByCode('441900')">🥉 东莞市 79.6</text>
            <text class="bench-item" @click="focusCityByCode('440100')">广州市 79.1</text>
            <text class="bench-item" @click="focusCityByCode('310100')">上海市 77.3</text>
            <text class="bench-item" @click="focusCityByCode('110100')">北京市 75.8</text>
          </view>
        </view>
      </view>

      <!-- 核心矢量地图展示区 -->
      <view class="map-stage-card">
        <!-- 缩放与复位控制器 -->
        <view class="map-controls-dock" @click.stop>
          <button class="zoom-btn" title="放大视角" @click="zoomIn">＋</button>
          <button class="zoom-btn" title="缩小视角" @click="zoomOut">－</button>
          <button class="zoom-btn reset-btn" title="复位全景" @click="resetView">⟲</button>
        </view>

        <!-- 图例说明 (Legend) -->
        <view class="map-legend-dock">
          <text class="legend-title">{{ metricLegend.title }}</text>
          <view class="legend-gradient-bar" :style="{ background: metricLegend.gradient }"></view>
          <view class="legend-labels">
            <text class="l-min">{{ metricLegend.minLabel }}</text>
            <text class="l-max">{{ metricLegend.maxLabel }}</text>
          </view>
        </view>

        <!-- 审图号官方标识 (依法依规合规标明) -->
        <view class="map-audit-tag">
          <svg class="shield-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <text class="audit-txt">审图号：GS（2026）4921号 · 自然资源部监制 · 天地图矢量</text>
        </view>

        <!-- SVG 空间地图画板 (支持鼠标滚轮与拖拽平移) -->
        <view 
          class="svg-viewport"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel.prevent="onWheelZoom"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <svg 
            class="china-svg-canvas"
            viewBox="0 0 1000 760" 
            preserveAspectRatio="xMidYMid meet"
          >
            <!-- 整体缩放与平移变换组 -->
            <g :transform="`translate(${panX}, ${panY}) scale(${zoomScale})`" class="map-root-g">
              <!-- 海洋背景底衬 -->
              <rect x="-1000" y="-1000" width="3000" height="3000" fill="#f8fafc" />

              <!-- 348 个医保统筹区多边形面图层 -->
              <g class="cities-layer">
                <path 
                  v-for="c in citiesList"
                  :key="c.cityCode"
                  :d="c.path"
                  :fill="getCityFillColor(c)"
                  :stroke="activeCity && activeCity.cityCode === c.cityCode ? '#ea580c' : '#ffffff'"
                  :stroke-width="activeCity && activeCity.cityCode === c.cityCode ? '2.5' : '0.5'"
                  class="city-path"
                  :class="{ 
                    'is-active': activeCity && activeCity.cityCode === c.cityCode,
                    'is-hover': hoveredCity && hoveredCity.cityCode === c.cityCode 
                  }"
                  @mouseenter="onCityHover(c, $event)"
                  @mouseleave="onCityLeave"
                  @click.stop="selectCity(c)"
                />
              </g>

              <!-- 省级边界线图层 (柔和深灰分隔线) -->
              <g class="province-borders-layer" pointer-events="none">
                <path 
                  v-for="(p, idx) in boundaries.provinceBorders"
                  :key="'pb_' + idx"
                  :d="p.mainPath"
                  fill="none"
                  stroke="#cbd5e1"
                  stroke-width="0.8"
                  stroke-dasharray="2,2"
                />
              </g>

              <!-- 十段线与国界骨架线图层 (天地图官方现行有效法定九段/十段线) -->
              <g class="ten-dash-layer" pointer-events="none">
                <path 
                  v-for="(td, idx) in boundaries.tenDashLines"
                  :key="'td_' + idx"
                  :d="td.mainPath"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="1.8"
                />
              </g>

              <!-- 南海诸岛附图线框 (法定国家标准附图位置) -->
              <g class="south-sea-inset-group">
                <!-- 附图底盒背景与边框 -->
                <rect 
                  x="815" 
                  y="515" 
                  width="170" 
                  height="230" 
                  fill="#f1f5f9" 
                  stroke="#94a3b8" 
                  stroke-width="1.2" 
                  rx="4" 
                />
                <text x="825" y="533" fill="#475569" font-size="11" font-weight="bold">南海诸岛 (附图)</text>
                
                <!-- 附图省份与诸岛路径 -->
                <g class="inset-elements">
                  <path 
                    v-for="(p, idx) in boundaries.provinceBorders"
                    :key="'in_pb_' + idx"
                    :d="p.insetPath"
                    fill="none"
                    stroke="#cbd5e1"
                    stroke-width="0.7"
                  />
                  <!-- 三沙市及南海诸岛多边形 -->
                  <path 
                    v-if="sanshaCity"
                    :d="sanshaCity.path"
                    :fill="getCityFillColor(sanshaCity)"
                    stroke="#2563eb"
                    stroke-width="1"
                    @click.stop="selectCity(sanshaCity)"
                  />
                  <!-- 十段线附图矢量 -->
                  <path 
                    v-for="(td, idx) in boundaries.tenDashLines"
                    :key="'in_td_' + idx"
                    :d="td.insetPath"
                    fill="none"
                    stroke="#2563eb"
                    stroke-width="1.5"
                    pointer-events="none"
                  />
                </g>
              </g>

              <!-- 选中统筹区高光定位指示锚标 -->
              <g v-if="activeCity && activeCity.centroid" class="active-pin-group" pointer-events="none">
                <circle 
                  :cx="activeCity.centroid[0]" 
                  :cy="activeCity.centroid[1]" 
                  r="7" 
                  fill="#ea580c" 
                  stroke="#ffffff" 
                  stroke-width="2" 
                  class="pin-circle"
                />
                <circle 
                  :cx="activeCity.centroid[0]" 
                  :cy="activeCity.centroid[1]" 
                  r="14" 
                  fill="none" 
                  stroke="#ea580c" 
                  stroke-width="1.5" 
                  class="pin-pulse"
                />
              </g>
            </g>
          </svg>

          <!-- 鼠标移入即时气泡提示 Tooltip -->
          <view 
            class="map-hover-tooltip"
            v-if="hoveredCity && !activeCity"
            :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
          >
            <view class="tt-head">
              <text class="tt-city">{{ hoveredCity.cityName }}</text>
              <text class="tt-prov">{{ hoveredCity.provinceName }}</text>
            </view>
            <view class="tt-metric-row">
              <text class="tt-label">{{ metricLegend.title }}:</text>
              <text class="tt-val font-mono">{{ getMetricDisplayVal(hoveredCity) }}</text>
            </view>
          </view>
        </view>

        <!-- 选中统筹区直达浮动 Bento 看板 (用户核心诉求：可视化点击转跳到各个统筹区) -->
        <view class="active-city-dock" v-if="activeCity" @click.stop>
          <view class="dock-header">
            <view class="dock-title-left">
              <view class="dock-badge">已选中统筹区</view>
              <text class="dock-city-name">{{ activeCity.cityName }}</text>
              <text class="dock-prov-name">{{ activeCity.provinceName }}</text>
            </view>
            <view class="dock-score-pill">
              <text class="score-label">综合保障指数</text>
              <text class="score-num font-mono">{{ activeCity.overallScore }}</text>
              <text class="score-unit">分</text>
            </view>
            <button class="dock-close-btn" @click="activeCity = null">✕</button>
          </view>

          <!-- 核心待遇指标卡片矩阵 -->
          <view class="dock-metrics-grid">
            <view class="dm-item">
              <text class="dm-label">职工三级住院报销</text>
              <text class="dm-val text-blue font-mono">{{ Math.round(activeCity.empInpatientRatio * 100) }}%</text>
              <text class="dm-sub">起付门槛 ¥{{ activeCity.empInpatientDed }}</text>
            </view>
            <view class="dm-item">
              <text class="dm-label">职工门诊共济封顶</text>
              <text class="dm-val font-mono">{{ formatCap(activeCity.empOutpatientCap) }}</text>
              <text class="dm-sub">年度统筹支付限额</text>
            </view>
            <view class="dm-item">
              <text class="dm-label">居民三级住院统筹</text>
              <text class="dm-val text-emerald font-mono">{{ Math.round(activeCity.resInpatientRatio * 100) }}%</text>
              <text class="dm-sub">大病最高 {{ Math.round(activeCity.catastrophicMaxRatio * 100) }}%</text>
            </view>
            <view class="dm-item">
              <text class="dm-label">退休在职倾斜上浮</text>
              <text class="dm-val text-amber font-mono">+{{ Math.round(activeCity.retireeBonusRatio * 100) }}%</text>
              <text class="dm-sub">依据: {{ activeCity.docNumber }}</text>
            </view>
          </view>

          <!-- 三大直达快速跳转通道 (跳转政策详情、带入估算、加入双城对比) -->
          <view class="dock-action-row">
            <view class="dock-btn btn-policy" @click="navToPolicy(activeCity.cityCode)">
              <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <text class="btn-text">查看本市政策详情 ↗</text>
            </view>
            <view class="dock-btn btn-calc" @click="navToEstimate(activeCity.cityCode)">
              <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="14.01"></line><line x1="8" y1="14" x2="8" y2="14.01"></line></svg>
              <text class="btn-text">进行该市报销估算 ↗</text>
            </view>
            <view class="dock-btn btn-pk" @click="navToBattle(activeCity.cityCode)">
              <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              <text class="btn-text">加入双城政策对决 ↗</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部平台四大服务板块直通 -->
      <view class="quick-service-section">
        <view class="service-block-header">
          <text class="sb-title">全国医保便民公共服务直通</text>
          <text class="sb-sub">数据均来自于各省市医保局及政府公开发布的正式文件与办事规程</text>
        </view>
        <view class="service-cards-grid">
          <view class="s-card" @click="switchTab('/pages/index/index')">
            <view class="s-ico ico-calc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="16" y1="14" x2="16" y2="14.01"></line></svg>
            </view>
            <text class="s-name">医保自负与估算</text>
            <text class="s-desc">输入就医类型与花费明细，自动按分级比例和起付线预估自负金额</text>
            <text class="s-link">立即测算 ➔</text>
          </view>

          <view class="s-card" @click="switchTab('/pages/policy/index')">
            <view class="s-ico ico-policy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>
            </view>
            <text class="s-name">政策待遇与规章库</text>
            <text class="s-desc">全国 348 统筹区门诊共济、分级住院、大病二次报销公文精准溯源</text>
            <text class="s-link">查阅公文 ➔</text>
          </view>

          <view class="s-card" @click="switchTab('/pages/ranking/index')">
            <view class="s-ico ico-rank">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </view>
            <text class="s-name">全维大宽表与双城PK</text>
            <text class="s-desc">16+ 项法定客观参数横滑排序与双城 24 项法定条款纵深比拼</text>
            <text class="s-link">进入对决 ➔</text>
          </view>

          <view class="s-card" @click="switchTab('/pages/service/index')">
            <view class="s-ico ico-service">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            </view>
            <text class="s-name">便民热线与异地指南</text>
            <text class="s-desc">一键查询全国 12393 医保专线、跨省异地就医免垫付直接结算指南</text>
            <text class="s-link">热线检索 ➔</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import citiesRawData from '@/data/map/china_cities_map.json';
import boundariesRawData from '@/data/map/china_boundaries.json';

interface CityMapItem {
  cityCode: string;
  cityName: string;
  provinceName: string;
  overallScore: number;
  employeeScore: number;
  residentScore: number;
  empInpatientRatio: number;
  empInpatientDed: number;
  empOutpatientCap: number;
  resInpatientRatio: number;
  resOutpatientCap: number;
  catastrophicMaxRatio: number;
  retireeBonusRatio: number;
  docNumber: string;
  centroid: [number, number];
  path: string;
  isInset?: boolean;
}

const citiesList = ref<CityMapItem[]>(citiesRawData as CityMapItem[]);
const boundaries = ref(boundariesRawData);

// 当前高亮/选中的统筹区
const activeCity = ref<CityMapItem | null>(null);
const hoveredCity = ref<CityMapItem | null>(null);
const tooltipPos = ref({ x: 0, y: 0 });

// 搜索框状态
const searchKeyword = ref('');

// 地图当前展示的指标图层
type MetricType = 'overall' | 'inpatient' | 'outpatient' | 'resident';
const currentMetric = ref<MetricType>('overall');

// 缩放与平移状态
const zoomScale = ref(1.0);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const dragStart = { x: 0, y: 0 };
const panStart = { x: 0, y: 0 };

// 单独提取三沙市（用于南海诸岛附图）
const sanshaCity = computed(() => {
  return citiesList.value.find(c => c.isInset || c.cityName.includes('三沙'));
});

// 联想建议列表
const suggestedCities = computed(() => {
  const q = searchKeyword.value.trim().toLowerCase();
  if (!q) return [];
  return citiesList.value
    .filter(c => c.cityName.toLowerCase().includes(q) || c.provinceName.toLowerCase().includes(q))
    .slice(0, 8);
});

// 图例配置
const metricLegend = computed(() => {
  switch (currentMetric.value) {
    case 'inpatient':
      return {
        title: '职工三级住院比例',
        gradient: 'linear-gradient(90deg, #d1fae5, #059669)',
        minLabel: '75%',
        maxLabel: '95%'
      };
    case 'outpatient':
      return {
        title: '门诊共济年度最高封顶',
        gradient: 'linear-gradient(90deg, #fef3c7, #d97706)',
        minLabel: '¥1000',
        maxLabel: '上不封顶'
      };
    case 'resident':
      return {
        title: '居民三级住院统筹比例',
        gradient: 'linear-gradient(90deg, #ede9fe, #7c3aed)',
        minLabel: '50%',
        maxLabel: '85%'
      };
    case 'overall':
    default:
      return {
        title: '全域医保保障综合力指数',
        gradient: 'linear-gradient(90deg, #dbeafe, #2563eb)',
        minLabel: '60分',
        maxLabel: '92分'
      };
  }
});

// 根据当前指标获取数值与渐变颜色
function getCityFillColor(city: CityMapItem): string {
  if (currentMetric.value === 'inpatient') {
    // 75% ~ 95%
    const ratio = city.empInpatientRatio || 0.8;
    const t = Math.max(0, Math.min(1, (ratio - 0.75) / 0.20));
    return interpolateColor('#d1fae5', '#047857', t);
  } else if (currentMetric.value === 'outpatient') {
    // 1000 ~ 15000+
    const cap = city.empOutpatientCap || 3000;
    const t = cap >= 999999 ? 1.0 : Math.max(0, Math.min(1, (cap - 1000) / 14000));
    return interpolateColor('#fef3c7', '#b45309', t);
  } else if (currentMetric.value === 'resident') {
    // 50% ~ 85%
    const ratio = city.resInpatientRatio || 0.65;
    const t = Math.max(0, Math.min(1, (ratio - 0.50) / 0.35));
    return interpolateColor('#ede9fe', '#6d28d9', t);
  } else {
    // overall score 65 ~ 92
    const score = city.overallScore || 75;
    const t = Math.max(0, Math.min(1, (score - 65) / 27));
    return interpolateColor('#dbeafe', '#1d4ed8', t);
  }
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16)
  };
}

function interpolateColor(hex1: string, hex2: string, t: number): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function getMetricDisplayVal(city: CityMapItem): string {
  if (currentMetric.value === 'inpatient') {
    return Math.round(city.empInpatientRatio * 100) + '%';
  } else if (currentMetric.value === 'outpatient') {
    return formatCap(city.empOutpatientCap);
  } else if (currentMetric.value === 'resident') {
    return Math.round(city.resInpatientRatio * 100) + '%';
  }
  return city.overallScore + ' 分';
}

function formatCap(num: number): string {
  if (!num || num <= 0) return '0元';
  if (num >= 999999) return '上不封顶';
  if (num >= 10000) return '¥' + (num / 10000).toFixed(1).replace('.0', '') + '万';
  return '¥' + num;
}

// 城市选择交互
function selectCity(city: CityMapItem, shouldCenter: boolean = false) {
  activeCity.value = city;
  searchKeyword.value = '';
  if (shouldCenter && city.centroid) {
    // 平滑聚焦并计算精确视口偏移 (考虑 1.6 倍缩放，使所选统筹区居中偏上)
    zoomScale.value = 1.6;
    panX.value = Math.round(500 - city.centroid[0] * 1.6);
    panY.value = Math.round(330 - city.centroid[1] * 1.6);
  }
}

function focusCityByCode(code: string) {
  const target = citiesList.value.find(c => c.cityCode === code);
  if (target) {
    selectCity(target, true);
  }
}

function onCityHover(city: CityMapItem, event: MouseEvent) {
  hoveredCity.value = city;
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15
  };
}

function onCityLeave() {
  hoveredCity.value = null;
}

// 页面点击空白处
function handlePageClick() {
  // 不重置 activeCity，方便查看
}

// 视角控制
function zoomIn() {
  if (zoomScale.value < 3.5) zoomScale.value = +(zoomScale.value + 0.3).toFixed(1);
}

function zoomOut() {
  if (zoomScale.value > 0.8) zoomScale.value = +(zoomScale.value - 0.3).toFixed(1);
}

function resetView() {
  zoomScale.value = 1.0;
  panX.value = 0;
  panY.value = 0;
}

// 鼠标拖拽平移
function startDrag(e: MouseEvent) {
  isDragging.value = true;
  dragStart.x = e.clientX;
  dragStart.y = e.clientY;
  panStart.x = panX.value;
  panStart.y = panY.value;
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return;
  panX.value = panStart.x + (e.clientX - dragStart.x);
  panY.value = panStart.y + (e.clientY - dragStart.y);
}

function endDrag() {
  isDragging.value = false;
}

function onWheelZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.15 : 0.15;
  const newScale = +(zoomScale.value + delta).toFixed(2);
  if (newScale >= 0.8 && newScale <= 3.5) {
    zoomScale.value = newScale;
  }
}

// 触摸屏手势拖拽
let touchStartX = 0;
let touchStartY = 0;
function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    panStart.x = panX.value;
    panStart.y = panY.value;
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length === 1) {
    panX.value = panStart.x + (e.touches[0].clientX - touchStartX);
    panY.value = panStart.y + (e.touches[0].clientY - touchStartY);
  }
}

function onTouchEnd() {}

// 快速跳转至各主要功能页 (用户核心诉求：可视化点击转跳到各个统筹区)
function navToPolicy(cityCode: string) {
  uni.setStorageSync('selected_medical_city_code', cityCode);
  uni.setStorageSync('selected_policy_city_code', cityCode);
  uni.switchTab({
    url: '/pages/policy/index'
  });
}

function navToEstimate(cityCode: string) {
  uni.setStorageSync('selected_medical_city_code', cityCode);
  uni.setStorageSync('selected_policy_city_code', cityCode);
  uni.switchTab({
    url: '/pages/index/index'
  });
}

function navToBattle(cityCode: string) {
  uni.setStorageSync('battle_target_city', cityCode);
  uni.switchTab({
    url: '/pages/ranking/index'
  });
}

function switchTab(url: string) {
  uni.switchTab({ url });
}
</script>

<style scoped>
.home-page-container {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.home-main-wrapper {
  max-width: 1360px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 20px 48px;
  box-sizing: border-box;
}

/* 英雄区控制台 */
.hero-control-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.hero-left-title {
  flex: 1;
  min-width: 320px;
}

.hero-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.badge-txt {
  font-size: 11.5px;
  font-weight: 700;
  color: #1d4ed8;
}

.count-txt {
  font-size: 11.5px;
  color: #3b82f6;
  border-left: 1px solid #bfdbfe;
  padding-left: 8px;
}

.hero-h1 {
  font-size: 26px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.5px;
  line-height: 1.25;
}

.hero-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 6px;
  display: block;
  line-height: 1.5;
}

/* 搜索栏 */
.hero-search-area {
  position: relative;
  width: 380px;
  max-width: 100%;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.search-input-wrapper:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.search-ico {
  width: 18px;
  height: 18px;
  color: #64748b;
  flex-shrink: 0;
  margin-right: 8px;
}

.map-search-input {
  flex: 1;
  font-size: 13.5px;
  color: #0f172a;
}

.clear-search {
  cursor: pointer;
  color: #94a3b8;
  font-size: 13px;
  padding: 2px 6px;
}

.search-suggest-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  z-index: 100;
  max-height: 320px;
  overflow-y: auto;
}

.suggest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s ease;
}

.suggest-item:hover {
  background: #eff6ff;
}

.sug-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sug-city {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.sug-prov {
  font-size: 11.5px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
}

.sug-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sug-score {
  font-size: 13px;
  font-weight: 800;
  color: #2563eb;
}

.sug-arrow {
  font-size: 11.5px;
  color: #3b82f6;
}

/* 工具栏 */
.map-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.dimension-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.dim-lead {
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
}

.dim-chips-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.dim-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.dim-chip:hover {
  background: #e2e8f0;
}

.dim-chip.active {
  background: #2563eb;
  border-color: #1d4ed8;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.dim-ico { font-size: 13px; }
.dim-txt { font-size: 12px; font-weight: 700; color: inherit; }

.benchmark-quick-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bench-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.bench-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.bench-item {
  font-size: 11.5px;
  font-weight: 700;
  color: #1e293b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.bench-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

/* 核心地图画板卡片 */
.map-stage-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  height: 720px;
}

/* 缩放控制器 */
.map-controls-dock {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.zoom-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #ffffff;
  color: #0f172a;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid #e2e8f0;
  line-height: 1;
}

.zoom-btn:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.zoom-btn.reset-btn {
  font-size: 15px;
  border-bottom: none;
}

/* 图例 */
.map-legend-dock {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.legend-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #334155;
  display: block;
  margin-bottom: 5px;
}

.legend-gradient-bar {
  width: 140px;
  height: 8px;
  border-radius: 4px;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
  margin-top: 3px;
  font-weight: 700;
}

/* 审图号 */
.map-audit-tag {
  position: absolute;
  bottom: 14px;
  left: 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
  pointer-events: none;
}

.shield-svg {
  width: 12px;
  height: 12px;
  color: #2563eb;
}

.audit-txt {
  font-size: 11px;
  color: #475569;
  font-weight: 600;
}

/* SVG 视口 */
.svg-viewport {
  width: 100%;
  height: 100%;
  cursor: grab;
  position: relative;
  overflow: hidden;
}

.svg-viewport:active {
  cursor: grabbing;
}

.china-svg-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* 统筹区矢量 Path 样式 */
.city-path {
  cursor: pointer;
  transition: fill 0.18s ease, stroke 0.18s ease, transform 0.18s ease;
}

.city-path:hover,
.city-path.is-hover {
  filter: brightness(1.08) drop-shadow(0 0 4px rgba(37, 99, 235, 0.4));
  stroke: #2563eb !important;
  stroke-width: 1.5 !important;
}

.city-path.is-active {
  stroke: #ea580c !important;
  stroke-width: 2.2 !important;
  filter: drop-shadow(0 0 6px rgba(234, 88, 12, 0.5));
}

/* 定位锚点 */
.pin-pulse {
  animation: mapPulse 1.8s infinite ease-out;
  transform-origin: center;
}

@keyframes mapPulse {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* 浮动 Tooltip */
.map-hover-tooltip {
  position: fixed;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(6px);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  transform: translate(-50%, -120%);
  white-space: nowrap;
}

.tt-head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tt-city {
  font-size: 13px;
  font-weight: 800;
}

.tt-prov {
  font-size: 11px;
  color: #94a3b8;
}

.tt-metric-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  font-size: 11.5px;
}

.tt-label { color: #cbd5e1; }
.tt-val { color: #60a5fa; font-weight: 800; }

/* 选中统筹区直达浮动 Bento 看板 */
.active-city-dock {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  max-width: 780px;
  margin: 0 auto;
  z-index: 30;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.15);
  padding: 16px 20px;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.dock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.dock-title-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dock-badge {
  font-size: 10.5px;
  font-weight: 800;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 4px;
}

.dock-city-name {
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
}

.dock-prov-name {
  font-size: 13px;
  color: #64748b;
}

.dock-score-pill {
  display: flex;
  align-items: baseline;
  gap: 4px;
  background: #f8fafc;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
}

.score-label { font-size: 11.5px; color: #64748b; }
.score-num { font-size: 18px; font-weight: 900; color: #2563eb; }
.score-unit { font-size: 11px; color: #64748b; }

.dock-close-btn {
  background: #f1f5f9;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
}

.dock-close-btn:hover { background: #e2e8f0; color: #0f172a; }

.dock-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.dm-item {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px 12px;
}

.dm-label { font-size: 11px; color: #64748b; display: block; }
.dm-val { font-size: 16px; font-weight: 900; color: #0f172a; margin-top: 2px; display: block; }
.dm-sub { font-size: 10.5px; color: #94a3b8; margin-top: 2px; display: block; }

.text-blue { color: #2563eb !important; }
.text-emerald { color: #059669 !important; }
.text-amber { color: #d97706 !important; }

.dock-action-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.dock-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.btn-svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.btn-policy {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.btn-policy:hover { background: #059669; color: #ffffff; border-color: #059669; }

.btn-calc {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.btn-calc:hover { background: #2563eb; color: #ffffff; border-color: #2563eb; }

.btn-pk {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}
.btn-pk:hover { background: #ea580c; color: #ffffff; border-color: #ea580c; }

/* 底部服务网格 */
.quick-service-section {
  margin-top: 28px;
}

.service-block-header {
  margin-bottom: 14px;
}

.sb-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  display: block;
}

.sb-sub {
  font-size: 12.5px;
  color: #64748b;
  margin-top: 3px;
  display: block;
}

.service-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.s-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.18s ease;
}

.s-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}

.s-ico {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.s-ico svg {
  width: 20px;
  height: 20px;
}

.ico-calc { background: #eff6ff; color: #2563eb; }
.ico-policy { background: #ecfdf5; color: #059669; }
.ico-rank { background: #faf5ff; color: #7c3aed; }
.ico-service { background: #fff7ed; color: #ea580c; }

.s-name {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}

.s-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
  flex: 1;
  margin-bottom: 12px;
}

.s-link {
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
}

/* 响应式适配 */
@media (max-width: 900px) {
  .hero-control-header {
    flex-direction: column;
    gap: 12px;
  }
  .hero-search-area {
    width: 100%;
  }
  .map-stage-card {
    height: 580px;
  }
  .service-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dock-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dock-action-row {
    grid-template-columns: 1fr;
  }
  .map-audit-tag {
    display: none;
  }
}

@media (max-width: 600px) {
  .home-main-wrapper {
    padding: 10px 12px 36px;
  }
  .hero-h1 {
    font-size: 20px;
  }
  .map-stage-card {
    height: 480px;
  }
  .service-cards-grid {
    grid-template-columns: 1fr;
  }
  .active-city-dock {
    left: 8px;
    right: 8px;
    bottom: 8px;
    padding: 12px;
  }
  .dock-city-name {
    font-size: 17px;
  }
  .dock-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
}
</style>
