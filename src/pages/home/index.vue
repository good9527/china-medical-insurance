<template>
  <view class="home-page-container" @click="handlePageClick">
    <!-- 全局统一顶栏 -->
    <AppHeader currentTab="home" />

    <view class="home-main-wrapper">
      <!-- 英雄区：标题、动态标杆与实时搜索 -->
      <view class="hero-control-header">
        <view class="hero-left-title">
          <view class="hero-badge-pill clickable" @click="showSourceModal = true" title="点击查看底图数据来源与审图号合规声明">
            <span class="pulse-dot"></span>
            <text class="badge-txt">天地图官方矢量配准 · 审图号 GS（2026）4921号</text>
            <text class="count-txt">全国 380 空间实体全域配准</text>
            <text class="source-link-tag">数据来源与合规说明 ↗</text>
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
          <text class="bench-label">标杆统筹区：</text>
          <view class="bench-chips">
            <text class="bench-item" @click="focusCityByCode('440300')">深圳市 91.6</text>
            <text class="bench-item" @click="focusCityByCode('320100')">南京市 82.3</text>
            <text class="bench-item" @click="focusCityByCode('441900')">东莞市 79.6</text>
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
          @wheel.prevent="onWheelZoom"
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
              :class="{ 'is-dragging': isDragging }"
            >
              <!-- 海洋背景底衬 -->
              <rect x="-1000" y="-1000" width="3000" height="3000" fill="#f8fafc" />

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
              <text class="dm-label">职工三级住院报销</text>
              <text class="dm-val text-blue font-mono">{{ Math.round((activeCity.empInpatientRatio || 0) * 100) }}%</text>
              <text class="dm-sub">起付门槛 ¥{{ activeCity.empInpatientDed }}</text>
            </view>
            <view class="dm-item">
              <text class="dm-label">职工门诊共济封顶</text>
              <text class="dm-val font-mono">{{ formatCap(activeCity.empOutpatientCap || 0) }}</text>
              <text class="dm-sub">年度统筹支付限额</text>
            </view>
            <view class="dm-item">
              <text class="dm-label">居民三级住院统筹</text>
              <text class="dm-val text-emerald font-mono">{{ Math.round((activeCity.resInpatientRatio || 0) * 100) }}%</text>
              <text class="dm-sub">大病最高 {{ Math.round((activeCity.catastrophicMaxRatio || 0) * 100) }}%</text>
            </view>
            <view class="dm-item">
              <text class="dm-label">退休在职倾斜上浮</text>
              <text class="dm-val text-amber font-mono">+{{ Math.round((activeCity.retireeBonusRatio || 0) * 100) }}%</text>
              <text class="dm-sub" :title="activeCity.docNumber">依据: {{ activeCity.docNumber }}</text>
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

// 视角控制 (以画布视口几何中心 460, 470 为基准等比缩放)
function zoomIn() {
  if (zoomScale.value < 5.0) {
    const newScale = Math.min(5.0, +(zoomScale.value * 1.25).toFixed(2));
    const ratio = newScale / zoomScale.value;
    panX.value = Math.round(460 - (460 - panX.value) * ratio);
    panY.value = Math.round(470 - (470 - panY.value) * ratio);
    zoomScale.value = newScale;
  }
}

function zoomOut() {
  if (zoomScale.value > 0.75) {
    const newScale = Math.max(0.75, +(zoomScale.value * 0.8).toFixed(2));
    const ratio = newScale / zoomScale.value;
    panX.value = Math.round(460 - (460 - panX.value) * ratio);
    panY.value = Math.round(470 - (470 - panY.value) * ratio);
    zoomScale.value = newScale;
  }
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

// 鼠标滚轮缩放 (高精度以鼠标指针所在位置为定焦中心进行平滑连续缩放)
function onWheelZoom(e: WheelEvent) {
  e.preventDefault();
  const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (!container || container.width <= 0) return;

  const mouseX = e.clientX - container.left;
  const mouseY = e.clientY - container.top;

  // 映射至 SVG viewBox 坐标系 (920 x 940)
  const svgX = (mouseX / container.width) * 920;
  const svgY = (mouseY / container.height) * 940;

  const factor = e.deltaY < 0 ? 1.15 : 0.87;
  const oldScale = zoomScale.value;
  let newScale = oldScale * factor;
  if (newScale < 0.75) newScale = 0.75;
  if (newScale > 5.0) newScale = 5.0;

  if (Math.abs(newScale - oldScale) < 0.001) return;

  const ratio = newScale / oldScale;
  panX.value = Math.round(svgX - (svgX - panX.value) * ratio);
  panY.value = Math.round(svgY - (svgY - panY.value) * ratio);
  zoomScale.value = +newScale.toFixed(3);
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
  transition: all 0.18s ease;
}

.hero-badge-pill.clickable:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
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
  height: 640px;
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
  gap: 5px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border: 1px solid #e2e8f0;
  padding: 5px 12px;
  border-radius: 6px;
}

.map-audit-tag.clickable {
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.18s ease;
}

.map-audit-tag.clickable:hover {
  background: #ffffff;
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.15);
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

/* 缩放平移图层过渡：拖拽时 0 延迟，缩放与聚焦时平滑缓动 */
.map-root-g {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: 0 0;
  will-change: transform;
}

.map-root-g.is-dragging {
  transition: none !important;
}

/* 统筹区矢量 Path 样式 */
.city-path {
  cursor: pointer;
  transition: fill 0.18s ease, stroke 0.18s ease;
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

/* 选中统筹区直达浮动 Bento 看板 (紧凑排布，彻底杜绝遮挡与视口截断) */
.active-city-dock {
  position: absolute;
  bottom: 12px;
  left: 14px;
  right: 14px;
  max-width: 720px;
  margin: 0 auto;
  z-index: 35;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
  padding: 12px 18px 14px;
  animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(14px); }
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
}

.dock-close-btn:hover { background: #e2e8f0; color: #0f172a; }

.dock-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.dm-item {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 6px 10px;
}

.dm-label { font-size: 11px; color: #64748b; display: block; }
.dm-val { font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 1px; display: block; }
.dm-sub { font-size: 10px; color: #94a3b8; margin-top: 1px; display: block; }

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

/* 底图数据来源与审图号合规声明模态框 */
.source-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  animation: fadeIn 0.18s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.source-modal-card {
  background: #ffffff;
  border-radius: 16px;
  max-width: 680px;
  width: 100%;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: modalScale 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
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
