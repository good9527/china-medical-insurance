<template>
  <view class="home-page-container" @click="handlePageClick">
    <!-- 全局统一顶栏 -->
    <AppHeader currentTab="home" />

    <view class="home-main-wrapper">
      <!-- 英雄区：标题、动态标杆与实时搜索 (搭载旗舰级柔和层级渐进展开) -->
      <view class="hero-control-header anim-cascade-1">
        <view class="hero-left-title">
          <view class="hero-badge-pill clickable" @click="showSourceModal = true" title="点击查看底图数据来源与审图号合规声明">
            <span class="pulse-dot"></span>
            <text class="badge-txt"><text class="desk-only">天地图官方矢量配准 · </text>审图号 GS（2026）4921号</text>
            <text class="count-txt"><text class="desk-only">全国 </text>380 空间实体全域配准</text>
            <text class="source-link-tag">合规声明 ↗</text>
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
              placeholder="输入省份或统筹区（如：四川 / 广东 / 成都 / 深圳 / 西安）" 
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

      <!-- 地图工具条：图层指标切换与快速标杆统筹区 (第2级柔和入场) -->
      <view class="map-toolbar anim-cascade-2">
        <view class="dimension-picker">
          <text class="dim-lead">图层指标：</text>
          <view class="dim-chips-group">
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'overall' }"
              @click="currentMetric = 'overall'"
            >
              <text class="dim-txt">综合保障力</text>
            </view>
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'inpatient' }"
              @click="currentMetric = 'inpatient'"
            >
              <text class="dim-txt">职工三级住院比</text>
            </view>
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'outpatient' }"
              @click="currentMetric = 'outpatient'"
            >
              <text class="dim-txt">门诊共济封顶</text>
            </view>
            <view 
              class="dim-chip" 
              :class="{ active: currentMetric === 'resident' }"
              @click="currentMetric = 'resident'"
            >
              <text class="dim-txt">居民三级住院</text>
            </view>
          </view>
        </view>

        <!-- 标杆城市快速触达 -->
        <view class="benchmark-quick-bar">
          <text class="bench-label">快速寻址：</text>
          <view class="bench-chips">
            <text class="bench-item" @click="focusCityByCode('440300')">深圳市 91.6</text>
            <text class="bench-item" @click="focusCityByCode('320100')">南京市 82.3</text>
            <text class="bench-item" @click="focusCityByCode('441900')">东莞市 79.6</text>
            <text class="bench-item" @click="focusCityByCode('440100')">广州市 79.1</text>
            <text class="bench-item" @click="focusCityByCode('310100')">上海市 77.3</text>
            <text class="bench-item" @click="focusCityByCode('110100')">北京市 75.8</text>
            <text class="bench-item" @click="focusCityByCode('610100')">西安市 74.5</text>
            <text class="bench-item" @click="focusCityByCode('510100')">成都市 73.8</text>
            <text class="bench-item" @click="focusCityByCode('330100')">杭州市 76.1</text>
            <text class="bench-item" @click="focusCityByCode('420100')">武汉市 74.2</text>
          </view>
        </view>
      </view>

      <!-- 核心矢量地图展示区 (第3级质感展开) -->
      <view class="map-stage-card anim-cascade-3">
        <!-- 右上角动态响应式微看板 (Live Brief Board: 鼠标悬浮即变幻，科技金融质感) -->
        <view class="map-live-brief-card" v-if="!activeCity">
          <view class="brief-card-inner" v-if="hoveredCity">
            <view class="bci-top">
              <span class="live-dot-green"></span>
              <text class="bci-city">{{ hoveredCity.cityName }}</text>
              <text class="bci-prov">{{ hoveredCity.provinceName }}</text>
              <text class="bci-score font-mono" v-if="hoveredCity.overallScore">{{ hoveredCity.overallScore }}分</text>
            </view>
            <view class="bci-mid">
              <text class="bci-metric-name">{{ metricLegend.title }}：</text>
              <text class="bci-metric-val font-mono">{{ getMetricDisplayVal(hoveredCity) }}</text>
            </view>
            <view class="bci-actions-row" v-if="hoveredCity.hasInsuranceData !== false && !hoveredCity.isSpecialRegion">
              <view class="bci-act-pill" @click.stop="navToPolicy(hoveredCity.cityCode)">
                <text class="act-txt">政策库 ↗</text>
              </view>
              <view class="bci-act-pill act-primary" @click.stop="navToEstimate(hoveredCity.cityCode)">
                <text class="act-txt">去测算 ↗</text>
              </view>
            </view>
            <view class="bci-sub-row" v-else>
              <text class="bci-hint">属地专属医疗卫生保障体系</text>
            </view>
          </view>
          <view class="brief-card-inner brief-default" v-else>
            <view class="bci-top">
              <span class="live-dot-blue"></span>
              <text class="bci-title">348 统筹区空间联动</text>
            </view>
            <text class="bci-desc">悬浮或轻触多边形，调取全维保障力与出院测算</text>
            <view class="bci-bench-row">
              <text class="bench-tag" @click.stop="focusCityByCode('440300')">深圳 91.6</text>
              <text class="bench-tag" @click.stop="focusCityByCode('320100')">南京 82.3</text>
              <text class="bench-tag" @click.stop="focusCityByCode('310100')">上海 77.3</text>
            </view>
          </view>
        </view>

        <!-- 右上角复位全景按钮 (明确文字标识，方便快速找回归位) -->
        <button class="map-reset-btn" @click.stop="resetView" title="重置地图视角至全国全貌">
          <svg class="reset-ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <text class="reset-txt">复位全景</text>
        </button>

        <!-- 图例说明 (Legend) -->
        <view class="map-legend-dock">
          <text class="legend-title">{{ metricLegend.title }}</text>
          <view class="legend-gradient-bar" :style="{ background: metricLegend.gradient }"></view>
          <view class="legend-labels">
            <text class="l-min">{{ metricLegend.minLabel }}</text>
            <text class="l-max">{{ metricLegend.maxLabel }}</text>
          </view>
          <view class="legend-special-row">
            <span class="lsi-dot"></span>
            <text class="lsi-txt">属地专属体系 (无缝版图保留)</text>
          </view>
          <view class="legend-dashed-row">
            <span class="lsi-dash"></span>
            <text class="lsi-txt-gray">省级区隔虚线 (便捷省域检索)</text>
          </view>
        </view>

        <!-- 审图号官方标识 (依法依规合规标明，支持点击弹出权威合规声明，选中城市时静默隐藏避免遮挡卡片) -->
        <view class="map-audit-tag clickable" v-if="!activeCity" @click.stop="showSourceModal = true" title="查看底图数据来源与审图号合规声明">
          <svg class="shield-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <text class="audit-txt">审图号：GS（2026）4921号（天地图底层矢量数据审图号）· 数据说明 ↗</text>
        </view>

        <!-- SVG 空间地图画板 (支持鼠标滚轮与拖拽平移) -->
        <view 
          class="svg-viewport"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel.prevent.stop="onWheelZoom"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <svg 
            class="china-svg-canvas"
            viewBox="0 0 920 940" 
            preserveAspectRatio="xMidYMid meet"
          >
            <!-- 整体缩放与平移变换组 -->
            <g 
              :transform="`translate(${panX}, ${panY}) scale(${zoomScale})`" 
              class="map-root-g"
              :class="{ 'is-dragging': isDragging, 'is-wheel-zooming': isWheelZooming }"
            >
              <!-- 海洋背景底衬 (采用透明设计，使画板中心微光径向氛围自然透显) -->
              <rect x="-1000" y="-1000" width="3000" height="3000" fill="transparent" />

              <!-- 348 个医保统筹区多边形面图层 (包含三沙市及南海诸岛，天然融为一体) -->
              <g class="cities-layer">
                <path 
                  v-for="c in citiesList"
                  :key="c.cityCode"
                  :d="c.path"
                  :fill="getCityFillColor(c)"
                  stroke="#ffffff"
                  stroke-width="0.6"
                  class="city-path"
                  @mouseenter="onCityHover(c, $event)"
                  @mouseleave="onCityLeave"
                  @click.stop="selectCity(c)"
                />
              </g>

              <!-- 省级行政区划虚线区隔图层 (相邻省界虚线区隔，让用户秒定省份定位统筹区) -->
              <g class="province-dashed-layer" pointer-events="none" v-if="boundaries.provinceDashedBoundaryPath">
                <!-- 底部高对比度微白晕，确保在任何深色/浅色统筹区上均极其清晰 -->
                <path 
                  :d="boundaries.provinceDashedBoundaryPath"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  opacity="0.6"
                />
                <!-- 核心深蓝灰色精细虚线 -->
                <path 
                  :d="boundaries.provinceDashedBoundaryPath"
                  fill="none"
                  stroke="#334155"
                  stroke-width="1.3"
                  stroke-dasharray="5,3.5"
                  stroke-linecap="round"
                  opacity="0.8"
                />
              </g>

              <!-- 悬浮高亮层：将当前 hovered 城市提升到顶层绘制，绝不被临近区域压边 -->
              <g class="hover-overlay-layer" pointer-events="none" v-if="hoveredCity && (!activeCity || hoveredCity.cityCode !== activeCity.cityCode)">
                <path 
                  :d="hoveredCity.path"
                  fill="rgba(37, 99, 235, 0.08)"
                  stroke="#2563eb"
                  stroke-width="1.8"
                />
              </g>

              <!-- 选中高光置顶层：将当前 activeCity 专属提升到所有城市最顶层，永远拥有完整无遮挡的 2.6px 橙色光环与外发光！ -->
              <g class="active-overlay-layer" pointer-events="none" v-if="activeCity">
                <path 
                  :d="activeCity.path"
                  fill="rgba(234, 88, 12, 0.12)"
                  stroke="#ea580c"
                  stroke-width="2.6"
                />
              </g>

              <!-- 1. 法定未定国界线图层 (帕米尔高原等历史未定国界线，依规标准虚线表示) -->
              <g class="undetermined-boundary-layer" pointer-events="none" v-if="boundaries.undeterminedBoundaryPath">
                <path 
                  :d="boundaries.undeterminedBoundaryPath"
                  fill="none"
                  stroke="#475569"
                  stroke-width="1.3"
                  stroke-dasharray="4,3"
                  stroke-linecap="round"
                />
              </g>

              <!-- 2. 法定特别行政区界线图层 (香港、澳门特区法定界线) -->
              <g class="sar-boundary-layer" pointer-events="none" v-if="boundaries.sarBoundaryPath">
                <path 
                  :d="boundaries.sarBoundaryPath"
                  fill="none"
                  stroke="#334155"
                  stroke-width="1.2"
                  stroke-dasharray="3,2"
                  stroke-linecap="round"
                />
              </g>

              <!-- 3. 法定海上省界线图层 (琼州海峡、杭州湾、长江口等海上省界) -->
              <g class="maritime-boundary-layer" pointer-events="none" v-if="boundaries.maritimeBoundaryPath">
                <path 
                  :d="boundaries.maritimeBoundaryPath"
                  fill="none"
                  stroke="#94a3b8"
                  stroke-width="0.8"
                  stroke-dasharray="2,2"
                  stroke-linecap="round"
                />
              </g>

              <!-- 4. 法定南海十段线图层 (天地图官方正规矢量数据，真实地理经纬度精准原貌) -->
              <g class="ten-dash-layer" pointer-events="none">
                <path 
                  :d="boundaries.tenDashLinePath"
                  fill="none"
                  stroke="#2563eb"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>

              <!-- 选中统筹区高光定位指示锚标 (原生平滑参数动画，精准锚定地理点位，杜绝外扩重叠) -->
              <g v-if="activeCity && activeCity.centroid" class="active-pin-group" pointer-events="none">
                <circle 
                  :cx="activeCity.centroid[0]" 
                  :cy="activeCity.centroid[1]" 
                  r="6" 
                  fill="none" 
                  stroke="#ea580c" 
                  stroke-width="2"
                >
                  <animate attributeName="r" from="6" to="22" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="stroke-width" from="2.5" to="0.4" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.9" to="0" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle 
                  :cx="activeCity.centroid[0]" 
                  :cy="activeCity.centroid[1]" 
                  r="5.5" 
                  fill="#ea580c" 
                  stroke="#ffffff" 
                  stroke-width="2" 
                />
              </g>
            </g>
          </svg>
        </view>

        <!-- 选中统筹区直达浮动 Bento 看板 (用户核心诉求：可视化点击转跳到各个统筹区) -->
        <view class="active-city-dock" v-if="activeCity" @click.stop>
          <view class="dock-header">
            <view class="dock-title-left">
              <view 
                class="dock-badge"
                :class="{
                  'badge-special': activeCity.isSpecialRegion,
                  'badge-xpcc': activeCity.cityCode.startsWith('659'),
                  'badge-hainan': activeCity.cityCode.startsWith('469')
                }"
              >
                {{ activeCity.isSpecialRegion ? '特别行政区 / 台湾省' : (activeCity.cityCode.startsWith('659') ? '兵团统筹师市' : (activeCity.cityCode.startsWith('469') ? '海南全省统筹直辖' : '已收录统筹区')) }}
              </view>
              <text class="dock-city-name">{{ activeCity.cityName }}</text>
              <text class="dock-prov-name">{{ activeCity.provinceName }}</text>
            </view>
            <view class="dock-score-pill" v-if="activeCity.hasInsuranceData !== false && !activeCity.isSpecialRegion">
              <text class="score-label">综合保障指数</text>
              <text class="score-num font-mono">{{ activeCity.overallScore }}</text>
              <text class="score-unit">分</text>
            </view>
            <view class="dock-score-pill score-special" v-else>
              <text class="score-label">保障体系</text>
              <text class="score-num-spec">属地专属</text>
            </view>
            <button class="dock-close-btn" @click="activeCity = null">✕</button>
          </view>

          <!-- 港澳台特区专属保障呈现 (恪守国家版图完整性第一优先级，友好说明) -->
          <view class="dock-special-box" v-if="activeCity.isSpecialRegion || activeCity.hasInsuranceData === false">
            <view class="dsb-lead-row">
              <text class="dsb-tag">{{ activeCity.cityName }} · 属地专属医疗卫生保障体系</text>
              <text class="dsb-sub">恪守中国国家版图完整性全域收录</text>
            </view>
            <text class="dsb-desc">
              根据国家测绘与地图审核技术规范，本平台将中国国家版图完整性列为第一绝对优先级，100% 完整保留神圣领土全貌与空间矢量；该地区实行其属地专属的医疗卫生体系（如香港医管局公立医疗体系与长者医疗券、澳门卫生局全免费及全民医疗补贴、台湾地区全民健保制度），暂不纳入内地基本医疗保险公文与报销测算。
            </text>
            <view class="dsb-btn-row">
              <button class="dsb-close-btn" @click="activeCity = null">返回探索其他统筹区</button>
            </view>
          </view>

          <!-- 核心待遇指标卡片矩阵 (内地统筹区) -->
          <view class="dock-metrics-grid" v-if="!activeCity.isSpecialRegion && activeCity.hasInsuranceData !== false">
            <view class="dm-item">
              <view class="dm-head">
                <text class="dm-label">职工三级住院</text>
                <text class="dm-badge badge-blue">大病统筹</text>
              </view>
              <text class="dm-val text-blue font-mono">{{ Math.round((activeCity.empInpatientRatio || 0) * 100) }}%</text>
              <text class="dm-sub">起付线 ¥{{ activeCity.empInpatientDed }} · 超额按比报</text>
            </view>
            <view class="dm-item">
              <view class="dm-head">
                <text class="dm-label">职工门诊共济</text>
                <text class="dm-badge badge-indigo">门诊小病</text>
              </view>
              <text class="dm-val font-mono">{{ formatCap(activeCity.empOutpatientCap || 0) }}</text>
              <text class="dm-sub">年门诊统筹最高可报额</text>
            </view>
            <view class="dm-item">
              <view class="dm-head">
                <text class="dm-label">居民三级住院</text>
                <text class="dm-badge badge-emerald">老人儿童</text>
              </view>
              <text class="dm-val text-emerald font-mono">{{ Math.round((activeCity.resInpatientRatio || 0) * 100) }}%</text>
              <text class="dm-sub">大病二次最高报 {{ Math.round((activeCity.catastrophicMaxRatio || 0) * 100) }}%</text>
            </view>
            <view class="dm-item">
              <view class="dm-head">
                <text class="dm-label">退休倾斜上浮</text>
                <text class="dm-badge badge-amber">尊老优待</text>
              </view>
              <text class="dm-val text-amber font-mono">+{{ Math.round((activeCity.retireeBonusRatio || 0) * 100) }}%</text>
              <text class="dm-sub" :title="activeCity.docNumber">退休比在职多报 · 关照长者</text>
            </view>
          </view>

          <!-- 三大直达快速跳转通道 (跳转政策详情、带入估算、加入双城对比) -->
          <view class="dock-action-row" v-if="!activeCity.isSpecialRegion && activeCity.hasInsuranceData !== false">
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

      <!-- 底部平台四大服务板块直通 (第4级瀑布流浮现) -->
      <view class="quick-service-section anim-cascade-4">
        <view class="service-block-header">
          <text class="sb-title">全国医保便民公共服务直通</text>
          <text class="sb-sub">数据均来自于各省市医保局及政府公开发布的正式文件与办事规程</text>
        </view>
        <view class="service-cards-grid">
          <view class="s-card anim-card-1" @click="switchTab('/pages/index/index')">
            <view class="s-ico ico-calc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="16" y1="14" x2="16" y2="14.01"></line></svg>
            </view>
            <text class="s-name">医保自负与估算</text>
            <text class="s-desc">输入就医类型与花费明细，自动按分级比例和起付线预估自负金额</text>
            <text class="s-link">立即测算 ➔</text>
          </view>

          <view class="s-card anim-card-2" @click="switchTab('/pages/policy/index')">
            <view class="s-ico ico-policy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>
            </view>
            <text class="s-name">政策待遇与规章库</text>
            <text class="s-desc">全国 348 统筹区门诊共济、分级住院、大病二次报销公文精准溯源</text>
            <text class="s-link">查阅公文 ➔</text>
          </view>

          <view class="s-card anim-card-3" @click="switchTab('/pages/ranking/index')">
            <view class="s-ico ico-rank">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </view>
            <text class="s-name">全维大宽表与双城PK</text>
            <text class="s-desc">16+ 项法定客观参数横滑排序与双城 24 项法定条款纵深比拼</text>
            <text class="s-link">进入对决 ➔</text>
          </view>

          <view class="s-card anim-card-4" @click="switchTab('/pages/service/index')">
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

    <!-- 底图数据来源与审图号合规声明模态框 -->
    <view class="source-modal-overlay" v-if="showSourceModal" @click="showSourceModal = false">
      <view class="source-modal-card" @click.stop>
        <view class="sm-card-header">
          <view class="sm-card-title-group">
            <view class="sm-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </view>
            <view class="sm-title-texts">
              <text class="sm-main-title">底图矢量数据来源与审图号合规声明</text>
              <text class="sm-sub-title">自然资源部天地图官方底图标准配准 · 法律与合规公示</text>
            </view>
          </view>
          <button class="sm-close-btn" @click="showSourceModal = false">✕</button>
        </view>

        <view class="sm-scroll-content">
          <!-- 审图号重点澄清警示条 (按用户明确指示：审图号是数据的审图号不是我们这个图的审图号，天地图官方写的是可以用来可视化) -->
          <view class="sm-highlight-box">
            <view class="sm-hb-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 22px; height: 22px; color: #2563eb;">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </view>
            <view class="sm-hb-content">
              <text class="sm-hb-title">审图号法律界定与权利声明：</text>
              <text class="sm-hb-text">
                本平台展示之审图号 <text class="font-bold font-mono">GS（2026）4921号</text> 为中华人民共和国自然资源部配准发布之<text class="font-bold text-blue">天地图底层行政区划矢量数据的官方批准审图号</text>，<text class="font-bold text-amber">并非本应用自行测绘或二次出版的自制地图审图号</text>。依据自然资源部天地图官方公开数据使用规范，该行政区划矢量数据可免费公开用于行业数据分析、政务信息与公共服务可视化呈现。
              </text>
            </view>
          </view>

          <!-- 〇、国家版图完整性第一优先级与原始数据归档 -->
          <view class="sm-section">
            <view class="sm-sec-header">
              <text class="sm-sec-tag">00</text>
              <text class="sm-sec-title">国家版图完整性第一优先级与原始底图完整归档</text>
            </view>
            <text class="sm-sec-p">
              本系统严格遵照国家地图审核管理规定与测绘地理信息法律法规，始终将<text class="text-bold">保持中国地图的绝对完整性列为第一绝对优先级</text>。无论该行政空间实体是否纳入内地基本医保统筹（如港澳台等），均 100% 完整保留其法定空间多边形、重要岛礁（钓鱼岛、赤尾屿、黄尾屿、南海诸岛等）以及法定全部 13 条边界线（未定国界线、特区界线、十段线、海上省界线）。
            </text>
            <text class="sm-sec-p">
              天地图官方原始矢量底图数据（《审图号：GS（2026）4921号中国_省.geojson》、《中国_市.geojson》、《中国_县.geojson》）已 100% 原始无损归档保存在项目代码库 <text class="font-mono text-bold">src/data/map/raw/</text> 目录中。
            </text>
          </view>

          <!-- 一、底图数据官方来源 -->
          <view class="sm-section">
            <view class="sm-sec-header">
              <text class="sm-sec-tag">01</text>
              <text class="sm-sec-title">底图数据官方来源与投影标准</text>
            </view>
            <text class="sm-sec-p">
              底图数据源自中华人民共和国自然资源部全国地理信息资源目录服务系统（国家地理信息公共服务平台·天地图），包含标准《中国_市》、《中国_省》、《中国_县》行政区划矢量及法定南海十段线（LineString），采用标准中国 Albers 等面积割圆锥投影 (标准纬线 25°N, 47°N，中央经线 105°E) 进行规范化拓扑空间配准。
            </text>
          </view>

          <!-- 二、空间全域完整性说明 -->
          <view class="sm-section">
            <view class="sm-sec-header">
              <text class="sm-sec-tag">02</text>
              <text class="sm-sec-title">空间行政实体全域配准 (380 空间实体无漏洞)</text>
            </view>
            <text class="sm-sec-p">
              针对传统地级市数据容易出现的版图视觉空洞，本系统完成了 100% 空间实体的拓扑全量补齐，绝无任何空白漏缺：
            </text>
            <view class="sm-grid-list">
              <view class="sm-grid-item">
                <text class="sgi-badge">海南全省统筹</text>
                <text class="sgi-text">全量收录五指山、琼海、文昌、万宁、东方、澄迈、定安等 15 个直辖县市多边形，全面填满海南全岛，依规映射《琼医保规〔2022〕4号》海南全省统筹待遇。</text>
              </view>
              <view class="sm-grid-item">
                <text class="sgi-badge">新疆兵团师市</text>
                <text class="sgi-text">全量收录石河子、阿拉尔、图木舒克、五家渠等 12 个兵团直辖师市独立多边形，彻底消除新疆腹地空白漏洞，统一映射《兵医保规〔2022〕2号》兵团统筹政策。</text>
              </view>
              <view class="sm-grid-item">
                <text class="sgi-badge">神圣领土全貌</text>
                <text class="sgi-text">完整保留港澳台特别行政区与台湾省法定矢量几何，依法依规展示神圣领土全貌，并贴心提供专属保障体系特别说明。</text>
              </view>
            </view>
          </view>

          <!-- 三、医保政策公文溯源 -->
          <view class="sm-section">
            <view class="sm-sec-header">
              <text class="sm-sec-tag">03</text>
              <text class="sm-sec-title">医保待遇公文溯源</text>
            </view>
            <text class="sm-sec-p">
              全国各统筹区的住院起付线、报销比例、门诊共济限额、大病封顶及退休倾斜比例，均提取自各省市医保局公开发布的正式有效规章公文，并在系统内逐条标注公文发文字号，保障数据严谨客观。
            </text>
          </view>
        </view>

        <view class="sm-card-footer">
          <button class="sm-understand-btn" @click="showSourceModal = false">我已了解合规声明</button>
        </view>
      </view>
    </view>

    <!-- 全局悬浮气泡探针 Tooltip (置于最顶层，严格遵照视口坐标定位，绝不受任何卡片形变或容器裁剪干扰) -->
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import citiesRawData from '@/data/map/china_cities_map.json';
import boundariesRawData from '@/data/map/china_boundaries.json';

interface CityMapItem {
  cityCode: string;
  cityName: string;
  rawName?: string;
  gbCode?: string;
  provinceName: string;
  hasInsuranceData?: boolean;
  isSpecialRegion?: boolean;
  specialNotice?: string;
  overallScore: number | null;
  employeeScore: number | null;
  residentScore: number | null;
  empInpatientRatio: number | null;
  empInpatientDed: number | null;
  empOutpatientCap: number | null;
  resInpatientRatio: number | null;
  resOutpatientCap: number | null;
  catastrophicMaxRatio: number | null;
  retireeBonusRatio: number | null;
  docNumber: string;
  centroid: [number, number];
  path: string;
  isInset?: boolean;
}

const citiesList = ref<CityMapItem[]>(citiesRawData as CityMapItem[]);
const boundaries = ref(boundariesRawData);

// 合规声明与数据来源弹窗控制
const showSourceModal = ref(false);

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
const isWheelZooming = ref(false);
let wheelTimer: any = null;
const dragStart = { x: 0, y: 0 };
const panStart = { x: 0, y: 0 };

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
  // 属地专属体制地区（港澳台等）：保留完整主权版图，采用专属温和蓝紫调（#e0e7ff），杜绝假数据混淆
  if (city.isSpecialRegion || city.hasInsuranceData === false) {
    return '#e0e7ff';
  }
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
  if (city.isSpecialRegion || city.hasInsuranceData === false) {
    return '属地专属体系（完整版图保留）';
  }
  if (currentMetric.value === 'inpatient') {
    return Math.round((city.empInpatientRatio || 0) * 100) + '%';
  } else if (currentMetric.value === 'outpatient') {
    return formatCap(city.empOutpatientCap || 0);
  } else if (currentMetric.value === 'resident') {
    return Math.round((city.resInpatientRatio || 0) * 100) + '%';
  }
  return (city.overallScore || 0) + ' 分';
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
    // 平滑聚焦并计算精确视口偏移 (viewBox 920x940，目标定焦在水平中心460，垂直380，留出底部Bento安全间距)
    zoomScale.value = 1.7;
    panX.value = Math.round(460 - city.centroid[0] * 1.7);
    panY.value = Math.round(380 - city.centroid[1] * 1.7);
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
  let x = event.clientX + 16;
  let y = event.clientY + 12;

  // #ifdef H5
  if (typeof window !== 'undefined') {
    // 预留 Tooltip 安全宽度 ~260px，若靠近屏幕右边缘则自动翻转至光标左侧
    if (x + 260 > window.innerWidth) {
      x = Math.max(12, event.clientX - 260);
    }
    // 靠近屏幕底部时自动上移
    if (y + 80 > window.innerHeight) {
      y = Math.max(12, event.clientY - 70);
    }
    if (y < 40) {
      y = event.clientY + 20;
    }
  }
  // #endif

  tooltipPos.value = { x, y };
}

function onCityLeave() {
  hoveredCity.value = null;
}

// 页面点击空白处
function handlePageClick() {
  // 不重置 activeCity，方便查看
}

// 视角控制与全景复位

function resetView() {
  zoomScale.value = 1.0;
  panX.value = 0;
  panY.value = 0;
  activeCity.value = null;
  searchKeyword.value = '';
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

// 鼠标滚轮缩放 (精准补偿 SVG viewBox letterboxing，以鼠标所在地理几何点为定焦中心，60fps 连续实时缩放)
function onWheelZoom(e: WheelEvent) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  // 获取 SVG 视口 DOM 容器真实矩形
  const viewport = document.querySelector('.svg-viewport') as HTMLElement | null;
  const rect = viewport ? viewport.getBoundingClientRect() : null;
  if (!rect || rect.width <= 0 || rect.height <= 0) return;

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // 根据 SVG viewBox (920 x 940) 和 preserveAspectRatio="xMidYMid meet" 规范，精准计算实际投影尺寸与白边偏移
  const vbW = 920;
  const vbH = 940;
  const vbAspect = vbW / vbH; // ~0.9787
  const containerAspect = rect.width / rect.height;

  let s = 1.0;
  let ox = 0;
  let oy = 0;

  if (containerAspect > vbAspect) {
    // 容器偏宽（桌面端）：高度撑满，左右居中留白
    s = rect.height / vbH;
    ox = (rect.width - vbW * s) / 2;
    oy = 0;
  } else {
    // 容器偏窄（移动端）：宽度撑满，上下居中留白
    s = rect.width / vbW;
    ox = 0;
    oy = (rect.height - vbH * s) / 2;
  }

  // 获得鼠标指针在 SVG viewBox (920 x 940) 原始坐标系下的真实位置
  const svgX = (mouseX - ox) / s;
  const svgY = (mouseY - oy) / s;

  // 保证 svgX, svgY 为有效数值
  if (!isFinite(svgX) || !isFinite(svgY)) return;

  // 严格遵照规范：往前滚（deltaY < 0）是放大，往后滚（deltaY > 0）是缩小
  const isZoomIn = e.deltaY < 0;
  const zoomFactor = isZoomIn ? 1.15 : 0.87;
  const oldScale = (typeof zoomScale.value === 'number' && !isNaN(zoomScale.value) && zoomScale.value > 0) ? zoomScale.value : 1.0;
  let newScale = oldScale * zoomFactor;
  if (newScale < 0.7) newScale = 0.7;
  if (newScale > 6.0) newScale = 6.0;

  if (Math.abs(newScale - oldScale) < 0.001) return;

  // 滚轮缩放期间关闭 CSS 缓动延迟，实现 60fps 实时连续无卡顿响应
  isWheelZooming.value = true;
  if (wheelTimer) clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    isWheelZooming.value = false;
  }, 120);

  // 以鼠标指针在底图上的真实几何点为定焦中心进行平滑缩放
  const currentPanX = typeof panX.value === 'number' && !isNaN(panX.value) ? panX.value : 0;
  const currentPanY = typeof panY.value === 'number' && !isNaN(panY.value) ? panY.value : 0;
  const ratio = newScale / oldScale;

  const nextPanX = Math.round(svgX - (svgX - currentPanX) * ratio);
  const nextPanY = Math.round(svgY - (svgY - currentPanY) * ratio);

  if (isFinite(nextPanX)) panX.value = nextPanX;
  if (isFinite(nextPanY)) panY.value = nextPanY;
  zoomScale.value = +newScale.toFixed(3);
}

// 全局滚轮命中测试拦截：只要光标在地图画板范围内，立刻捕获滚轮事件，阻止页面滚动并触发平滑缩放
function handleGlobalWheel(e: WheelEvent) {
  // #ifdef H5
  const viewport = document.querySelector('.svg-viewport') as HTMLElement | null;
  if (!viewport) return;
  const rect = viewport.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return;

  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    onWheelZoom(e);
  }
  // #endif
}

onMounted(() => {
  // #ifdef H5
  window.addEventListener('wheel', handleGlobalWheel, { passive: false });
  const viewport = document.querySelector('.svg-viewport') as HTMLElement | null;
  if (viewport) {
    viewport.addEventListener('wheel', onWheelZoom, { passive: false });
  }
  // #endif
});

onUnmounted(() => {
  // #ifdef H5
  window.removeEventListener('wheel', handleGlobalWheel);
  const viewport = document.querySelector('.svg-viewport') as HTMLElement | null;
  if (viewport) {
    viewport.removeEventListener('wheel', onWheelZoom);
  }
  // #endif
  if (wheelTimer) clearTimeout(wheelTimer);
});

// 触摸屏手势：单指 60fps 零延迟平滑拖拽，双指智能定焦缩放（Pinch-to-zoom）
let touchStartX = 0;
let touchStartY = 0;
let touchStartDist = 0;
let touchStartScale = 1.0;

function getTouchDistance(touches: TouchList) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    isDragging.value = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    panStart.x = panX.value;
    panStart.y = panY.value;
    touchStartDist = 0;
  } else if (e.touches.length === 2) {
    isDragging.value = true;
    touchStartDist = getTouchDistance(e.touches);
    touchStartScale = zoomScale.value;
    panStart.x = panX.value;
    panStart.y = panY.value;
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length === 1 && touchStartDist === 0) {
    panX.value = panStart.x + (e.touches[0].clientX - touchStartX);
    panY.value = panStart.y + (e.touches[0].clientY - touchStartY);
  } else if (e.touches.length === 2) {
    const newDist = getTouchDistance(e.touches);
    if (touchStartDist > 0) {
      const scaleFactor = newDist / touchStartDist;
      let newScale = +(touchStartScale * scaleFactor).toFixed(3);
      if (newScale < 0.7) newScale = 0.7;
      if (newScale > 6.0) newScale = 6.0;
      zoomScale.value = newScale;
    }
  }
}

function onTouchEnd(e: TouchEvent) {
  if (e.touches.length === 0) {
    isDragging.value = false;
    touchStartDist = 0;
  } else if (e.touches.length === 1) {
    touchStartDist = 0;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    panStart.x = panX.value;
    panStart.y = panY.value;
  }
}

// 快速跳转至各主要功能页 (用户核心诉求：可视化点击转跳到各个统筹区)
function getNavCityCode(cityCode: string): string {
  // 新疆生产建设兵团直辖师市 (659001 ~ 659012) 统一映射至兵团统筹代码 660000
  if (cityCode.startsWith('659')) {
    return '660000';
  }
  // 海南省直辖县/县级市 (469001 ~ 469030) 统一映射至海南省级统筹基准 460100 (海口市)
  if (cityCode.startsWith('469')) {
    return '460100';
  }
  // 甘肃省特殊保护区
  if (cityCode === '629700') return '620700';
  if (cityCode === '629800' || cityCode === '629900') return '622900';
  return cityCode;
}

function navToPolicy(cityCode: string) {
  const code = getNavCityCode(cityCode);
  uni.setStorageSync('selected_medical_city_code', code);
  uni.setStorageSync('selected_policy_city_code', code);
  uni.switchTab({
    url: '/pages/policy/index'
  });
}

function navToEstimate(cityCode: string) {
  const code = getNavCityCode(cityCode);
  uni.setStorageSync('selected_medical_city_code', code);
  uni.setStorageSync('selected_policy_city_code', code);
  uni.switchTab({
    url: '/pages/index/index'
  });
}

function navToBattle(cityCode: string) {
  const code = getNavCityCode(cityCode);
  uni.setStorageSync('battle_target_city', code);
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

/* 旗舰级层级瀑布流渐进展开 (Staggered Cascade Reveal) */
@keyframes cascadeFadeIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes stageCardReveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.anim-cascade-1 {
  animation: cascadeFadeIn 0.48s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.anim-cascade-2 {
  animation: cascadeFadeIn 0.48s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}

.anim-cascade-3 {
  animation: stageCardReveal 0.58s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both;
}

.anim-cascade-4 {
  animation: cascadeFadeIn 0.52s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
}

.anim-card-1 {
  animation: cascadeFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.26s both;
}
.anim-card-2 {
  animation: cascadeFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.31s both;
}
.anim-card-3 {
  animation: cascadeFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both;
}
.anim-card-4 {
  animation: cascadeFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.41s both;
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

.hero-badge-pill.clickable {
  cursor: pointer;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-badge-pill.clickable:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  transform: translateY(-1.5px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.14);
}

.source-link-tag {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #ffffff;
  border: 1px solid #bfdbfe;
  padding: 1px 7px;
  border-radius: 9999px;
  margin-left: 4px;
  transition: all 0.2s ease;
}

.hero-badge-pill.clickable:hover .source-link-tag {
  border-color: #93c5fd;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.15);
}

.desk-only { display: inline; }
@media (max-width: 767px) {
  .desk-only { display: none !important; }
}

/* 赋予国家级配准实时生命力的双重雷达脉冲呼吸灯 */
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
  position: relative;
  display: inline-block;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
}

.pulse-dot::before,
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1.5px solid #2563eb;
  animation: radarRipple 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  pointer-events: none;
}

.pulse-dot::after {
  animation-delay: 1.1s;
}

@keyframes radarRipple {
  0% {
    transform: scale(0.8);
    opacity: 0.85;
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
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
  padding: 5px 13px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.dim-chip:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.dim-chip.active {
  background: #2563eb;
  border-color: #1d4ed8;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
  transform: translateY(-1px);
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
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bench-item:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
}

.bench-item:active {
  transform: translateY(0) scale(0.97);
}

/* 核心地图画板卡片 (搭载居中径向柔光与旗舰级纵深阴影) */
.map-stage-card {
  position: relative;
  background: radial-gradient(circle at 50% 42%, #ffffff 0%, #f8fafc 75%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 40px -12px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(0, 0, 0, 0.02);
  height: 640px;
  transition: box-shadow 0.3s ease;
}

/* 动态响应式微看板 (Live Brief Board) */
.map-live-brief-card {
  position: absolute;
  top: 16px;
  right: 126px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  pointer-events: auto;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 190px;
  max-width: 250px;
}

.brief-card-inner {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bci-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.live-dot-green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
  animation: radarRipple 2s infinite ease-out;
}

.live-dot-blue {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 6px rgba(37, 99, 235, 0.8);
}

.bci-city {
  font-size: 13.5px;
  font-weight: 800;
  color: #0f172a;
}

.bci-prov {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
}

.bci-score {
  font-size: 12px;
  font-weight: 800;
  color: #2563eb;
  margin-left: auto;
}

.bci-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.bci-desc {
  font-size: 10.5px;
  color: #64748b;
  line-height: 1.35;
  margin-top: 1px;
}

.bci-mid {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 2px;
}

.bci-metric-name {
  font-size: 11px;
  color: #64748b;
}

.bci-metric-val {
  font-size: 12.5px;
  font-weight: 800;
  color: #0284c7;
}

.bci-actions-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.bci-act-pill {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 6px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.bci-act-pill:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.bci-act-pill.act-primary {
  background: #eff6ff;
  border-color: #93c5fd;
}

.bci-act-pill.act-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.bci-act-pill.act-primary:hover .act-txt {
  color: #ffffff;
}

.act-txt {
  font-size: 10.5px;
  font-weight: 700;
  color: #1e293b;
}

.bci-act-pill.act-primary .act-txt {
  color: #2563eb;
}

.bci-sub-row {
  margin-top: 2px;
}

.bci-hint {
  font-size: 10px;
  color: #2563eb;
  font-weight: 600;
}

.bci-bench-row {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.bench-tag {
  font-size: 10.5px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 1px 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

/* 右上角复位全景按钮 (旗舰级高透磨砂亚克力胶囊) */
.map-reset-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid rgba(203, 213, 225, 0.85);
  border-radius: 9999px;
  padding: 7px 15px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.26s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1;
}

.map-reset-btn:hover {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.18);
  transform: translateY(-2px) scale(1.02);
}

.map-reset-btn:active {
  transform: translateY(0) scale(0.98);
}

.reset-ico {
  width: 14px;
  height: 14px;
  color: #2563eb;
  flex-shrink: 0;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.map-reset-btn:hover .reset-ico {
  transform: rotate(-120deg);
}

.reset-txt {
  font-size: 12.5px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.map-reset-btn:hover .reset-txt {
  color: #2563eb;
}

/* 图例 (高透毛玻璃) */
.map-legend-dock {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid rgba(203, 213, 225, 0.85);
  border-radius: 12px;
  padding: 9px 13px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.map-legend-dock:hover {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
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
  transition: background 0.4s ease;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
  margin-top: 3px;
  font-weight: 700;
}

.legend-special-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  padding-top: 5px;
  border-top: 1px dashed #e2e8f0;
}

.lsi-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #e0e7ff;
  border: 1px solid #a5b4fc;
}

.lsi-txt {
  font-size: 9.5px;
  color: #4f46e5;
  font-weight: 700;
}

.legend-dashed-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.lsi-dash {
  width: 14px;
  height: 0;
  border-top: 2px dashed #475569;
}

.lsi-txt-gray {
  font-size: 9.5px;
  color: #475569;
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
  gap: 6px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(226, 232, 240, 0.85);
  padding: 5px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.map-audit-tag.clickable {
  pointer-events: auto;
  cursor: pointer;
}

.map-audit-tag.clickable:hover {
  background: #ffffff;
  border-color: #93c5fd;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.16);
}

.map-audit-tag.clickable:hover .audit-txt {
  color: #2563eb;
}

.shield-svg {
  width: 13px;
  height: 13px;
  color: #2563eb;
  flex-shrink: 0;
}

.audit-txt {
  font-size: 11px;
  color: #475569;
  font-weight: 600;
  transition: color 0.15s ease;
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

/* 缩放平移图层过渡：拖拽与滚轮时 0 延迟实时响应，点击聚焦与复位时如航拍云台般平滑缓动 */
.map-root-g {
  transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: 0 0;
  will-change: transform;
}

.map-root-g.is-dragging,
.map-root-g.is-wheel-zooming {
  transition: none !important;
}

/* 统筹区矢量 Path 样式 (液态色彩平滑流动与微光辉光) */
.city-path {
  cursor: pointer;
  transition: fill 0.45s cubic-bezier(0.4, 0, 0.2, 1), 
              stroke 0.25s ease, 
              stroke-width 0.25s ease, 
              filter 0.25s ease;
}

.city-path:hover,
.city-path.is-hover {
  filter: brightness(1.12) drop-shadow(0 2px 10px rgba(37, 99, 235, 0.42));
  stroke: #2563eb !important;
  stroke-width: 1.6 !important;
}

.city-path.is-active {
  stroke: #ea580c !important;
  stroke-width: 2.4 !important;
  filter: drop-shadow(0 0 10px rgba(234, 88, 12, 0.65)) brightness(1.08);
}

/* 浮动 Tooltip (严格保持比例与矩形形状，严禁折行或竖向挤压变形) */
.map-hover-tooltip {
  position: fixed !important;
  z-index: 99999 !important;
  background: rgba(15, 23, 42, 0.90) !important;
  backdrop-filter: blur(16px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
  color: #ffffff !important;
  padding: 8px 14px !important;
  border-radius: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08) inset !important;
  pointer-events: none !important;
  white-space: nowrap !important;
  width: max-content !important;
  min-width: 190px !important;
  max-width: none !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;
  animation: tooltipFade 0.12s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes tooltipFade {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tt-head {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.tt-city {
  font-size: 13.5px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.tt-prov {
  font-size: 11px !important;
  color: #94a3b8 !important;
  background: rgba(255, 255, 255, 0.08) !important;
  padding: 1px 6px !important;
  border-radius: 4px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.tt-metric-row {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin-top: 2px !important;
  font-size: 12px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.tt-label {
  color: #cbd5e1 !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.tt-val {
  color: #38bdf8 !important;
  font-weight: 800 !important;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.35) !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

/* 选中统筹区直达浮动 Bento 看板 (旗舰级弹性升起与高阶光影质感) */
.active-city-dock {
  position: absolute;
  bottom: 14px;
  left: 16px;
  right: 16px;
  max-width: 740px;
  margin: 0 auto;
  z-index: 35;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(191, 219, 254, 0.8);
  border-radius: 16px;
  box-shadow: 0 20px 48px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  padding: 14px 20px 16px;
  animation: bentoDockSlideUp 0.36s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes bentoDockSlideUp {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.975);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
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

.dock-badge.badge-special {
  background: #fdf2f8 !important;
  color: #db2777 !important;
  border-color: #fbcfe8 !important;
}

.dock-badge.badge-xpcc {
  background: #f0fdf4 !important;
  color: #15803d !important;
  border-color: #bbf7d0 !important;
}

.dock-badge.badge-hainan {
  background: #f0fdfa !important;
  color: #0f766e !important;
  border-color: #99f6e4 !important;
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

.dock-score-pill.score-special {
  background: #fdf2f8 !important;
  border-color: #fbcfe8 !important;
}

.score-num-spec {
  font-size: 13px;
  font-weight: 800;
  color: #db2777;
}

/* 港澳台特区专属看板 */
.dock-special-box {
  background: #fdf2f8;
  border: 1px solid #fbcfe8;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
}

.dsb-lead-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.dsb-tag {
  font-size: 13px;
  font-weight: 800;
  color: #be185d;
}

.dsb-sub {
  font-size: 11px;
  color: #9d174d;
  font-weight: 600;
}

.dsb-desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.55;
  display: block;
}

.dsb-btn-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.dsb-close-btn {
  background: #ffffff;
  border: 1px solid #fbcfe8;
  color: #be185d;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dsb-close-btn:hover {
  background: #fce7f3;
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
  transition: all 0.18s ease;
}

.dock-close-btn:hover { background: #e2e8f0; color: #0f172a; transform: scale(1.05); }

.dock-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.dm-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.dm-item:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.dm-label { font-size: 11px; color: #64748b; }
.dm-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  white-space: nowrap;
}

.badge-blue { background: #eff6ff; color: #2563eb; }
.badge-indigo { background: #e0e7ff; color: #4338ca; }
.badge-emerald { background: #ecfdf5; color: #059669; }
.badge-amber { background: #fffbeb; color: #b45309; }

.dm-val { font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 2px; display: block; }
.dm-sub { font-size: 10.5px; color: #64748b; margin-top: 2px; display: block; line-height: 1.35; }

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
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
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
.btn-policy:hover { background: #059669; color: #ffffff; border-color: #059669; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(5, 150, 105, 0.25); }

.btn-calc {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.btn-calc:hover { background: #2563eb; color: #ffffff; border-color: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25); }

.btn-pk {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}
.btn-pk:hover { background: #ea580c; color: #ffffff; border-color: #ea580c; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(234, 88, 12, 0.25); }

.dock-btn:active {
  transform: translateY(0) scale(0.98);
}

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
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 38px -8px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(0, 0, 0, 0.02);
  border-color: #cbd5e1;
}

.s-ico {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-card:hover .s-ico {
  transform: scale(1.08) translateY(-2px);
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.s-card:hover .s-link {
  transform: translateX(4px);
}

/* 底图数据来源与审图号合规声明模态框 (旗舰级磨砂玻璃与弹性缩放展开) */
.source-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  animation: fadeIn 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.source-modal-card {
  background: #ffffff;
  border-radius: 20px;
  max-width: 680px;
  width: 100%;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96) translateY(14px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.sm-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.sm-card-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sm-icon-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sm-icon-badge svg {
  width: 20px;
  height: 20px;
}

.sm-title-texts {
  display: flex;
  flex-direction: column;
}

.sm-main-title {
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
}

.sm-sub-title {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 2px;
}

.sm-close-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  padding: 0;
}

.sm-close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.sm-scroll-content {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
}

.sm-highlight-box {
  background: #fefce8;
  border: 1px solid #fef08a;
  border-left: 4px solid #ca8a04;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.sm-hb-icon {
  font-size: 20px;
  line-height: 1.2;
}

.sm-hb-content {
  flex: 1;
}

.sm-hb-title {
  font-size: 13px;
  font-weight: 800;
  color: #854d0e;
  display: block;
  margin-bottom: 4px;
}

.sm-hb-text {
  font-size: 12px;
  color: #713f12;
  line-height: 1.6;
}

.font-bold { font-weight: 800; }

.sm-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sm-sec-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sm-sec-tag {
  font-size: 10px;
  font-weight: 900;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 1px 6px;
  border-radius: 4px;
}

.sm-sec-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #1e293b;
}

.sm-sec-p {
  font-size: 12px;
  color: #475569;
  line-height: 1.6;
}

.sm-grid-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.sm-grid-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sgi-badge {
  font-size: 11px;
  font-weight: 800;
  color: #1d4ed8;
}

.sgi-text {
  font-size: 11.5px;
  color: #475569;
  line-height: 1.5;
}

.sm-card-footer {
  padding: 14px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
}

.sm-understand-btn {
  background: #2563eb;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 22px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.sm-understand-btn:hover {
  background: #1d4ed8;
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
  .map-live-brief-card {
    display: none !important;
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
    bottom: 8px;
    left: 8px;
    padding: 3px 8px;
  }
  .map-audit-tag .audit-txt {
    font-size: 10px;
  }
}

@media (max-width: 600px) {
  .home-main-wrapper {
    padding: 10px 12px calc(76px + env(safe-area-inset-bottom));
  }
  .hero-badge-pill {
    padding: 4px 10px;
    font-size: 11px;
    gap: 6px;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .hero-badge-pill .count-txt {
    display: none;
  }
  .hero-h1 {
    font-size: 19px;
  }
  .hero-sub {
    font-size: 12px;
    line-height: 1.45;
  }
  .map-toolbar {
    padding: 8px 12px;
    gap: 10px;
    margin-bottom: 12px;
  }
  .dimension-picker {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2px;
    scrollbar-width: none;
  }
  .dimension-picker::-webkit-scrollbar {
    display: none;
  }
  .dim-lead {
    white-space: nowrap;
    flex-shrink: 0;
  }
  .dim-chips-group {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    width: 100%;
  }
  .dim-chips-group::-webkit-scrollbar {
    display: none;
  }
  .dim-chip {
    white-space: nowrap;
    flex-shrink: 0;
    padding: 4px 10px;
    font-size: 11.5px;
  }
  .benchmark-quick-bar {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2px;
    scrollbar-width: none;
  }
  .benchmark-quick-bar::-webkit-scrollbar {
    display: none;
  }
  .bench-label {
    white-space: nowrap;
    flex-shrink: 0;
  }
  .bench-chips {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .bench-chips::-webkit-scrollbar {
    display: none;
  }
  .bench-item {
    white-space: nowrap;
    flex-shrink: 0;
    padding: 3px 8px;
    font-size: 11px;
  }
  .map-stage-card {
    height: 480px;
  }
  .map-legend-dock {
    top: 8px;
    left: 8px;
    padding: 6px 10px;
    border-radius: 8px;
  }
  .legend-title {
    font-size: 10px;
    margin-bottom: 3px;
  }
  .legend-gradient-bar {
    width: 80px;
    height: 6px;
    border-radius: 3px;
  }
  .legend-labels {
    font-size: 8.5px;
    margin-top: 2px;
  }
  .legend-special-row,
  .legend-dashed-row {
    display: none !important;
  }
  .map-reset-btn {
    top: 8px;
    right: 8px;
    padding: 6px 10px;
  }
  .map-reset-btn .reset-txt {
    font-size: 11px;
  }
  .map-audit-tag {
    bottom: 6px;
    left: 6px;
    padding: 3px 8px;
  }
  .map-audit-tag .audit-txt {
    font-size: 9.5px;
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
  .sm-card-header {
    padding: 14px 16px;
  }
  .sm-scroll-content {
    padding: 14px 16px;
    gap: 14px;
  }
  .sm-main-title {
    font-size: 14.5px;
  }
  .sm-card-footer {
    padding: 10px 16px;
  }
}
</style>
