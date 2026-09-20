<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <AppHeader currentTab="ranking" />

    <view class="content-box">
      <!-- 顶部 Benchmark 标头与评测元数据卡 -->
      <view class="benchmark-header">
        <view class="header-main-stack">
          <view class="badge-row">
            <view class="benchmark-chip">
              <span class="chip-pulse"></span>
              <text class="chip-txt">国家医保政策竞争力全样本天梯榜 · CMI-Index 2026</text>
            </view>
            <view class="meta-tag">
              <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <text class="meta-txt">344 统筹区多维量化核验</text>
            </view>
          </view>
          <text class="benchmark-title">全国各统筹区医保保障力排行与政策对决</text>
          <text class="benchmark-sub">构建全域整体综合、城镇职工医保、城乡居民医保三大权威评价体系，支持多维即时重排与自选双城同台竞技</text>
        </view>

        <!-- 模式切换：天梯榜单 vs 双城竞技场 -->
        <view class="arena-switch-bar">
          <view 
            class="switch-pill" 
            :class="{ active: viewMode === 'leaderboard' }"
            @click="viewMode = 'leaderboard'; triggerHaptic()"
          >
            <svg class="pill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <text class="pill-label">天梯排行榜</text>
          </view>
          <view 
            class="switch-pill" 
            :class="{ active: viewMode === 'battle' }"
            @click="viewMode = 'battle'; triggerHaptic()"
          >
            <svg class="pill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <text class="pill-label">双城竞技场</text>
          </view>
        </view>
      </view>

      <!-- ============================================================ -->
      <!-- 视图 1：天梯榜单 (Leaderboard)                                -->
      <!-- ============================================================ -->
      <view class="view-body" v-if="viewMode === 'leaderboard'">
        
        <!-- 群体分类大胶囊切换栏 (整体综合 / 职工医保 / 居民医保) -->
        <view class="category-segmented-bar">
          <view 
            class="seg-item" 
            :class="{ active: currentCategory === 'overall' }"
            @click="switchCategory('overall')"
          >
            <view class="seg-icon-box cat-overall">
              <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </view>
            <view class="seg-texts">
              <view class="seg-title-row">
                <text class="seg-title">全域整体综合榜</text>
                <text class="seg-badge badge-indigo">全维度</text>
              </view>
              <text class="seg-desc">兼顾职工与居民全域真实保障水平</text>
            </view>
            <view class="seg-active-indicator" v-if="currentCategory === 'overall'"></view>
          </view>

          <view 
            class="seg-item" 
            :class="{ active: currentCategory === 'employee' }"
            @click="switchCategory('employee')"
          >
            <view class="seg-icon-box cat-employee">
              <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </view>
            <view class="seg-texts">
              <view class="seg-title-row">
                <text class="seg-title">城镇职工医保榜</text>
                <text class="seg-badge badge-blue">职工专属</text>
              </view>
              <text class="seg-desc">门诊共济 · 住院保障 · 退休倾斜</text>
            </view>
            <view class="seg-active-indicator" v-if="currentCategory === 'employee'"></view>
          </view>

          <view 
            class="seg-item" 
            :class="{ active: currentCategory === 'resident' }"
            @click="switchCategory('resident')"
          >
            <view class="seg-icon-box cat-resident">
              <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </view>
            <view class="seg-texts">
              <view class="seg-title-row">
                <text class="seg-title">城乡居民医保榜</text>
                <text class="seg-badge badge-emerald">居民专属</text>
              </view>
              <text class="seg-desc">基层统筹 · 二三级住院 · 大病兜底</text>
            </view>
            <view class="seg-active-indicator" v-if="currentCategory === 'resident'"></view>
          </view>
        </view>

        <!-- 评测体系说明卡片 (展示对应人群权重) -->
        <view class="methodology-card">
          <view class="method-head" @click="showMethodology = !showMethodology; triggerHaptic()">
            <view class="method-left">
              <view class="method-icon-pulse">
                <svg class="info-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </view>
              <text class="method-title">{{ currentCategoryTitle }}评测模型架构：</text>
              <text class="method-weights">{{ currentCategoryWeightsSummary }}</text>
            </view>
            <view class="method-toggle">
              <text class="toggle-txt">{{ showMethodology ? '收起架构 ▴' : '解析六维权重 ▾' }}</text>
            </view>
          </view>
          <view class="method-body" v-if="showMethodology">
            <view class="weight-grid" v-if="currentCategory === 'overall'">
              <view class="w-item">
                <view class="w-top"><text class="w-name">住院全层级保障</text><text class="w-pct">权重 25%</text></view>
                <text class="w-desc">三级/二级/基层分级诊疗梯次与政策范围内统筹报销力度</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">门诊共济减负力</text><text class="w-pct">权重 20%</text></view>
                <text class="w-desc">普通门诊统筹年度最高封顶线、小病起付线及报销比例</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">大病重疾抗风险</text><text class="w-pct">权重 20%</text></view>
                <text class="w-desc">基本险年度封顶线深度与城乡居民大病保险不设限兜底能力</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">群体倾斜关怀度</text><text class="w-pct">权重 15%</text></view>
                <text class="w-desc">退休职工住院上浮倾斜、门诊封顶优待及高龄老人关照</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">异地就医自由度</text><text class="w-pct">权重 10%</text></view>
                <text class="w-desc">跨省异地规范转诊报销保持率与自行外出宽容度</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">起付门槛友好度</text><text class="w-pct">权重 10%</text></view>
                <text class="w-desc">门诊与首次住院起付门槛，0 元免起付统筹区获得顶格满分</text>
              </view>
            </view>
            <view class="weight-grid" v-else-if="currentCategory === 'employee'">
              <view class="w-item">
                <view class="w-top"><text class="w-name">在职住院全保障</text><text class="w-pct">权重 30%</text></view>
                <text class="w-desc">三甲公立医院与二级定点医院在职职工政策统筹报销比例</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">门诊共济年度封顶</text><text class="w-pct">权重 25%</text></view>
                <text class="w-desc">普通门诊统筹年度最高支付限额及上不封顶政策加成</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">门诊0起付友好度</text><text class="w-pct">权重 15%</text></view>
                <text class="w-desc">普通门诊自然年度起付线，0 元免起付门槛统筹区获最高分</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">退休人员倾斜优待</text><text class="w-pct">权重 15%</text></view>
                <text class="w-desc">退休职工住院报销相比在职人员额外上浮幅度及门诊额度倾斜</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">异地就医流动权益</text><text class="w-pct">权重 15%</text></view>
                <text class="w-desc">退休随迁与异地就医转诊直接结算待遇保留率</text>
              </view>
            </view>
            <view class="weight-grid" v-else>
              <view class="w-item">
                <view class="w-top"><text class="w-name">三级重症大病住院</text><text class="w-pct">权重 35%</text></view>
                <text class="w-desc">三级重点医疗机构城乡居民政策范围内统筹报销比例（55%~92%）</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">大病兜底与安全垫</text><text class="w-pct">权重 25%</text></view>
                <text class="w-desc">城乡居民大病保险（二次报销）是否设立年封顶限制与最高段比例</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">基层门诊统筹减负</text><text class="w-pct">权重 15%</text></view>
                <text class="w-desc">社区卫生站与乡镇卫生院门诊报销限额与比例</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">住院低起付门槛</text><text class="w-pct">权重 15%</text></view>
                <text class="w-desc">基层与二三级定点医院起付门槛与多次住院减半优待</text>
              </view>
              <view class="w-item">
                <view class="w-top"><text class="w-name">异地规范转诊保障</text><text class="w-pct">权重 10%</text></view>
                <text class="w-desc">居民异地转诊转院政策范围内报销比例保留程度</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 工具栏：省份筛选、视图布局切换与搜索 -->
        <view class="filter-bar">
          <view class="filter-left">
            <!-- 省份下拉 -->
            <view class="picker-anchor">
              <view class="dropdown-trigger" :class="{ open: openDropdown === 'province' }" @click.stop="toggleDropdown('province')">
                <svg class="picker-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                <text class="dropdown-label">{{ selectedProvince === 'all' ? '全国 344 统筹区' : selectedProvince }}</text>
                <text class="dropdown-caret">▾</text>
              </view>
              <view class="dropdown-menu" v-if="openDropdown === 'province'" @click.stop>
                <view 
                  class="menu-item" 
                  :class="{ active: selectedProvince === 'all' }"
                  @click.stop="selectedProvince = 'all'; openDropdown = null"
                >
                  <text class="item-name">全国 344 统筹区 (全量数据)</text>
                  <svg class="check-svg" v-if="selectedProvince === 'all'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </view>
                <view 
                  class="menu-item" 
                  v-for="p in provinceOptions" 
                  :key="p"
                  :class="{ active: selectedProvince === p }"
                  @click.stop="selectedProvince = p; openDropdown = null"
                >
                  <text class="item-name">{{ p }}</text>
                  <svg class="check-svg" v-if="selectedProvince === p" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </view>
              </view>
            </view>

            <!-- 视图布局切换器 (政策卡片 vs 全维宽表) -->
            <view class="layout-toggle-dock">
              <view 
                class="layout-btn" 
                :class="{ active: displayLayout === 'cards' }"
                @click="displayLayout = 'cards'; triggerHaptic()"
              >
                <svg class="layout-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <text class="layout-txt">政策卡片</text>
              </view>
              <view 
                class="layout-btn" 
                :class="{ active: displayLayout === 'table' }"
                @click="displayLayout = 'table'; triggerHaptic()"
              >
                <svg class="layout-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <text class="layout-txt">全维宽表</text>
              </view>
            </view>

            <!-- 排序提示徽章 -->
            <view class="sort-indicator-pill">
              <text class="sort-tip-label">排序：</text>
              <text class="sort-tip-val">{{ currentSortLabel }} {{ sortAsc ? '▲ 升序' : '▼ 降序' }}</text>
            </view>
          </view>

          <!-- 搜索框 -->
          <view class="search-input-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              class="search-input" 
              v-model="searchQuery" 
              placeholder="搜索统筹区或省份（如：西安 / 成都 / 威海）" 
            />
            <svg class="clear-svg" v-if="searchQuery" @click="searchQuery = ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </view>
        </view>

        <!-- 前三甲领奖台高光卡片 (权威金融科技级香槟金/钛银/瑰铜华堂) -->
        <view class="podium-row" v-if="!searchQuery && selectedProvince === 'all' && sortColumn === 'composite' && !sortAsc && rankings.length >= 3">
          <!-- 银席 No.2 -->
          <view class="podium-card rank-2" @click="goToCityPolicy(rankings[1].cityCode)">
            <view class="podium-halo halo-silver"></view>
            <view class="podium-crest crest-silver">
              <svg class="crest-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              <text class="crest-txt">NO.2 · 榜眼席</text>
            </view>
            <text class="podium-city">{{ rankings[1].cityName }}</text>
            <text class="podium-prov">{{ getPodiumSub(rankings[1], "卓越示范统筹区") }}</text>
            <view class="podium-score-group">
              <text class="score-num silver-num">{{ getCategoryScore(rankings[1]) }}</text>
              <text class="score-unit">综合指数</text>
            </view>
            <view class="podium-feats">
              <text class="feat-tag">{{ getPodiumFeat1(rankings[1]) }}</text>
              <text class="feat-tag">{{ getPodiumFeat2(rankings[1]) }}</text>
            </view>
            <view class="podium-btn silver-btn" @click.stop="quickBattle(rankings[1].cityCode)">
              <text class="btn-txt">加入对比</text><svg class="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </view>
          </view>

          <!-- 金席 No.1 榜首 (至尊殿堂级凸显) -->
          <view class="podium-card rank-1" @click="goToCityPolicy(rankings[0].cityCode)">
            <view class="podium-halo halo-gold"></view>
            <view class="podium-crest crest-gold">
              <svg class="crest-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <text class="crest-txt">NO.1 · 榜首领跑者</text>
            </view>
            <text class="podium-city gold-city">{{ rankings[0].cityName }}</text>
            <text class="podium-prov">{{ getPodiumSub(rankings[0], "国家标杆统筹区") }}</text>
            <view class="podium-score-group">
              <text class="score-num gold-num">{{ getCategoryScore(rankings[0]) }}</text>
              <text class="score-unit gold-unit">综合指数</text>
            </view>
            <view class="podium-feats">
              <text class="feat-tag feat-gold">{{ getPodiumFeat1(rankings[0]) }}</text>
              <text class="feat-tag feat-gold">{{ getPodiumFeat2(rankings[0]) }}</text>
            </view>
            <view class="podium-btn gold-btn" @click.stop="quickBattle(rankings[0].cityCode)">
              <text class="btn-txt gold-btn-txt">加入双城对决</text><svg class="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </view>
          </view>

          <!-- 铜席 No.3 -->
          <view class="podium-card rank-3" @click="goToCityPolicy(rankings[2].cityCode)">
            <view class="podium-halo halo-bronze"></view>
            <view class="podium-crest crest-bronze">
              <svg class="crest-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="6"></circle>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
              </svg>
              <text class="crest-txt">NO.3 · 探花席</text>
            </view>
            <text class="podium-city">{{ rankings[2].cityName }}</text>
            <text class="podium-prov">{{ getPodiumSub(rankings[2], "卓越示范统筹区") }}</text>
            <view class="podium-score-group">
              <text class="score-num bronze-num">{{ getCategoryScore(rankings[2]) }}</text>
              <text class="score-unit">综合指数</text>
            </view>
            <view class="podium-feats">
              <text class="feat-tag">{{ getPodiumFeat1(rankings[2]) }}</text>
              <text class="feat-tag">{{ getPodiumFeat2(rankings[2]) }}</text>
            </view>
            <view class="podium-btn bronze-btn" @click.stop="quickBattle(rankings[2].cityCode)">
              <text class="btn-txt">加入对比</text><svg class="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </view>
          </view>
        </view>

        <!-- ========================================================== -->
        <!-- 布局 A：精工政策卡片流 (Card View) - 移动端专属自适应        -->
        <!-- ========================================================== -->
        <view class="cards-stream-wrapper" v-if="displayLayout === 'cards' && rankings.length > 0">
          <view 
            class="bento-rank-card"
            v-for="item in displayedRankings" 
            :key="'c_' + item.cityCode"
            @click="goToCityPolicy(item.cityCode)"
          >
            <!-- 卡片顶栏 -->
            <view class="brc-top">
              <view class="brc-left">
                <view class="brc-rank-badge" :class="getRankClass(item.rank)">
                  <text class="rank-num">#{{ item.rank }}</text>
                </view>
                <view class="brc-name-stack">
                  <view class="brc-title-row">
                    <text class="brc-city">{{ item.cityName }}</text>
                    <text class="brc-prov" v-if="getProvinceSubtext(item)">{{ getProvinceSubtext(item) }}</text>
                  </view>
                  <text class="brc-tier" :class="getTierBadge(item.rank).class">{{ getTierBadge(item.rank).text }}</text>
                </view>
              </view>
              <view class="brc-score-capsule">
                <text class="brc-score-num">{{ getCategoryScore(item) }}</text>
                <text class="brc-score-unit">分</text>
              </view>
            </view>

            <!-- 卡片中栏：四项关键法定指标对比 -->
            <view class="brc-metrics-grid">
              <view class="brc-m-cell">
                <text class="brc-m-name">三级住院统筹</text>
                <text class="brc-m-val text-blue font-mono">{{ Math.round((currentCategory === 'resident' ? item.resInpatientRatio : item.empInpatientRatio) * 100) }}%</text>
              </view>
              <view class="brc-m-cell">
                <text class="brc-m-name">{{ currentCategory === 'resident' ? '基层门诊限额' : '门诊共济封顶' }}</text>
                <text class="brc-m-val font-mono">{{ currentCategory === 'resident' ? ('¥' + item.resOutpatientCap) : formatCap(item.empOutpatientCap) }}</text>
              </view>
              <view class="brc-m-cell">
                <text class="brc-m-name">大病兜底保障</text>
                <text class="brc-m-val text-purple font-mono">{{ item.isCatastrophicUncapped ? '不设封顶' : ('¥' + Math.round(item.annualMaxCap / 10000) + '万') }}</text>
              </view>
              <view class="brc-m-cell">
                <text class="brc-m-name">退休倾斜优待</text>
                <text class="brc-m-val text-amber font-mono">+{{ Math.round(item.retireeBonusRatio * 100) }}%</text>
              </view>
            </view>

            <!-- 综合保障力流动能量条 -->
            <view class="brc-meter-wrap">
              <view class="brc-meter-track">
                <view class="brc-meter-fill" :style="{ width: getCategoryScore(item) + '%' }"></view>
              </view>
            </view>

            <!-- 卡片底栏：特色标签与快捷操作 -->
            <view class="brc-bottom">
              <view class="brc-moat-tag">
                <span class="moat-dot"></span>
                <text class="brc-moat-text">{{ getCityMoatText(item) }}</text>
              </view>
              <view class="brc-actions" @click.stop>
                <view class="brc-act-btn btn-policy" @click.stop="goToCityPolicy(item.cityCode)">
                  <text>待遇详情 ↗</text>
                </view>
                <view class="brc-act-btn btn-pk" @click.stop="quickBattle(item.cityCode)">
                  <text class="pk-btn-txt">深度对决</text><svg class="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- ========================================================== -->
        <!-- 布局 B：多列可排序 Benchmark 数据大宽表 (Table View)         -->
        <!-- ========================================================== -->
        <view class="benchmark-table-card" v-if="displayLayout === 'table'">
          <!-- 移动端横滑提示栏 -->
          <view class="mobile-table-hint">
            <svg class="hint-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
              <polyline points="9 18 3 12 9 6"></polyline>
            </svg>
            <text class="hint-txt">可横向轻滑浏览各维度深度参数 · 也可在上方切换为【政策卡片】视图</text>
            <svg class="hint-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
              <polyline points="15 18 21 12 15 6"></polyline>
            </svg>
          </view>

          <view class="table-scroll-wrapper">
            <table class="benchmark-table">
              <thead>
                <!-- 表头：全域整体综合模式 -->
                <tr class="b-thead-tr" v-if="currentCategory === 'overall'">
                  <th class="col-rank"># 排名</th>
                  <th class="col-city">统筹区</th>
                  <th class="col-sortable col-score" @click="toggleSort('overall_score')">
                    <view class="th-sort-inner">
                      <text>全域综合分</text>
                      <text class="sort-arrow" :class="{ active: sortColumn === 'overall_score' || sortColumn === 'composite' }">
                        {{ sortColumn === 'overall_score' || sortColumn === 'composite' ? (sortAsc ? '▲' : '▼') : '↕' }}
                      </text>
                    </view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('employee_score')">
                    <view class="th-sort-inner"><text>职工综合</text><text class="sort-arrow" :class="{ active: sortColumn === 'employee_score' }">{{ sortColumn === 'employee_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('resident_score')">
                    <view class="th-sort-inner"><text>居民综合</text><text class="sort-arrow" :class="{ active: sortColumn === 'resident_score' }">{{ sortColumn === 'resident_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('inpatient_score')">
                    <view class="th-sort-inner"><text>住院保障</text><text class="sort-arrow" :class="{ active: sortColumn === 'inpatient_score' }">{{ sortColumn === 'inpatient_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('outpatient_score')">
                    <view class="th-sort-inner"><text>门诊共济</text><text class="sort-arrow" :class="{ active: sortColumn === 'outpatient_score' }">{{ sortColumn === 'outpatient_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('catastrophic_score')">
                    <view class="th-sort-inner"><text>大病兜底</text><text class="sort-arrow" :class="{ active: sortColumn === 'catastrophic_score' }">{{ sortColumn === 'catastrophic_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('retiree_score')">
                    <view class="th-sort-inner"><text>群体倾斜</text><text class="sort-arrow" :class="{ active: sortColumn === 'retiree_score' }">{{ sortColumn === 'retiree_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-action text-right">操作</th>
                </tr>

                <!-- 表头：城镇职工医保专属列 -->
                <tr class="b-thead-tr" v-else-if="currentCategory === 'employee'">
                  <th class="col-rank"># 排名</th>
                  <th class="col-city">统筹区</th>
                  <th class="col-sortable col-score" @click="toggleSort('employee_score')">
                    <view class="th-sort-inner"><text>职工综合分</text><text class="sort-arrow" :class="{ active: sortColumn === 'employee_score' || sortColumn === 'composite' }">{{ sortColumn === 'employee_score' || sortColumn === 'composite' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('emp_inpatient')">
                    <view class="th-sort-inner"><text>在职三级住院</text><text class="sort-arrow" :class="{ active: sortColumn === 'emp_inpatient' }">{{ sortColumn === 'emp_inpatient' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th>二级定点比例</th>
                  <th class="col-sortable" @click="toggleSort('emp_outpatient_cap')">
                    <view class="th-sort-inner"><text>门诊共济封顶</text><text class="sort-arrow" :class="{ active: sortColumn === 'emp_outpatient_cap' }">{{ sortColumn === 'emp_outpatient_cap' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('threshold_score')">
                    <view class="th-sort-inner"><text>门诊起付门槛</text><text class="sort-arrow" :class="{ active: sortColumn === 'threshold_score' }">{{ sortColumn === 'threshold_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('retiree_bonus')">
                    <view class="th-sort-inner"><text>退休上浮优待</text><text class="sort-arrow" :class="{ active: sortColumn === 'retiree_bonus' }">{{ sortColumn === 'retiree_bonus' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-action text-right">操作</th>
                </tr>

                <!-- 表头：城乡居民医保专属列 -->
                <tr class="b-thead-tr" v-else>
                  <th class="col-rank"># 排名</th>
                  <th class="col-city">统筹区</th>
                  <th class="col-sortable col-score" @click="toggleSort('resident_score')">
                    <view class="th-sort-inner"><text>居民综合分</text><text class="sort-arrow" :class="{ active: sortColumn === 'resident_score' || sortColumn === 'composite' }">{{ sortColumn === 'resident_score' || sortColumn === 'composite' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('res_inpatient')">
                    <view class="th-sort-inner"><text>居民三级住院</text><text class="sort-arrow" :class="{ active: sortColumn === 'res_inpatient' }">{{ sortColumn === 'res_inpatient' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th>居民二级住院</th>
                  <th class="col-sortable" @click="toggleSort('res_outpatient_cap')">
                    <view class="th-sort-inner"><text>基层门诊限额</text><text class="sort-arrow" :class="{ active: sortColumn === 'res_outpatient_cap' }">{{ sortColumn === 'res_outpatient_cap' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('catastrophic_score')">
                    <view class="th-sort-inner"><text>大病兜底机制</text><text class="sort-arrow" :class="{ active: sortColumn === 'catastrophic_score' }">{{ sortColumn === 'catastrophic_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-action text-right">操作</th>
                </tr>
              </thead>

              <tbody>
                <tr 
                  class="b-tbody-tr" 
                  v-for="item in displayedRankings" 
                  :key="item.cityCode"
                  @click="goToCityPolicy(item.cityCode)"
                >
                  <!-- 排名 -->
                  <td class="col-rank">
                    <view class="rank-badge" :class="getRankClass(item.rank)">
                      {{ item.rank }}
                    </view>
                  </td>

                  <!-- 城市与省份：极简化设计，消除重复城市名与塑料灰色标签 -->
                  <td class="col-city">
                    <view class="city-cell-stack">
                      <text class="city-name">{{ item.cityName }}</text>
                      <text class="city-prov-sub" v-if="getProvinceSubtext(item)">{{ getProvinceSubtext(item) }}</text>
                    </view>
                  </td>

                  <!-- 全域整体模式数据行：消除多余背景框，聚焦核心数字与法定待遇明细 -->
                  <template v-if="currentCategory === 'overall'">
                    <td class="col-score">
                      <text class="score-display font-bold">{{ item.overallScore }}</text>
                    </td>
                    <td><text class="plain-data-txt font-bold text-blue">{{ item.employeeScore }}</text></td>
                    <td><text class="plain-data-txt font-bold text-emerald">{{ item.residentScore }}</text></td>
                    <td>
                      <view class="dim-stat-cell">
                        <text class="dim-stat-score text-cyan">{{ item.radar.inpatient }}</text>
                        <text class="dim-stat-detail">{{ Math.round(item.empInpatientRatio * 100) }}% / {{ Math.round(item.resInpatientRatio * 100) }}%</text>
                      </view>
                    </td>
                    <td>
                      <view class="dim-stat-cell">
                        <text class="dim-stat-score text-blue">{{ item.radar.outpatient }}</text>
                        <text class="dim-stat-detail">{{ formatCap(item.empOutpatientCap) }}</text>
                      </view>
                    </td>
                    <td>
                      <view class="dim-stat-cell">
                        <text class="dim-stat-score text-purple">{{ item.radar.catastrophic }}</text>
                        <text class="dim-stat-detail">{{ item.isCatastrophicUncapped ? '不设封顶' : '¥' + Math.round(item.annualMaxCap / 10000) + '万' }}</text>
                      </view>
                    </td>
                    <td>
                      <view class="dim-stat-cell">
                        <text class="dim-stat-score text-amber">{{ item.radar.retiree }}</text>
                        <text class="dim-stat-detail">+{{ Math.round(item.retireeBonusRatio * 100) }}%</text>
                      </view>
                    </td>
                  </template>

                  <!-- 城镇职工医保模式数据行 -->
                  <template v-else-if="currentCategory === 'employee'">
                    <td class="col-score">
                      <text class="score-display font-bold text-blue">{{ item.employeeScore }}</text>
                    </td>
                    <td><text class="plain-data-txt font-semibold text-blue">{{ Math.round(item.empInpatientRatio * 100) }}%</text></td>
                    <td><text class="plain-data-txt">{{ Math.round(item.empInpatientTier2Ratio * 100) }}%</text></td>
                    <td><text class="plain-data-txt" :class="{ 'text-emerald font-bold': item.empOutpatientCap >= 9999999 }">{{ formatCap(item.empOutpatientCap) }}</text></td>
                    <td><text class="plain-data-txt">{{ item.empOutpatientDed === 0 ? '0元 (免起付)' : '¥' + item.empOutpatientDed }}</text></td>
                    <td><text class="plain-data-txt font-semibold text-amber">+{{ Math.round(item.retireeBonusRatio * 100) }}%</text></td>
                  </template>

                  <!-- 城乡居民医保模式数据行 -->
                  <template v-else>
                    <td class="col-score">
                      <text class="score-display font-bold text-emerald">{{ item.residentScore }}</text>
                    </td>
                    <td><text class="plain-data-txt font-semibold text-emerald">{{ Math.round(item.resInpatientRatio * 100) }}%</text></td>
                    <td><text class="plain-data-txt">{{ Math.round(item.resInpatientTier2Ratio * 100) }}%</text></td>
                    <td><text class="plain-data-txt">¥{{ item.resOutpatientCap }}/年</text></td>
                    <td>
                      <view class="dim-stat-cell">
                        <text class="dim-stat-score text-purple">{{ item.radar.catastrophic }}分</text>
                        <text class="dim-stat-detail">{{ item.isCatastrophicUncapped ? '不设封顶' : '¥' + Math.round(item.annualMaxCap / 10000) + '万' }}</text>
                      </view>
                    </td>
                  </template>

                  <!-- 操作列：加入竞技场 PK -->
                  <td class="col-action text-right" @click.stop>
                    <view class="action-btn-group">
                      <button class="mini-pk-btn" @click.stop="quickBattle(item.cityCode)">
                        <text class="pk-btn-txt">深度对决</text><svg class="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </view>
                  </td>
                </tr>
              </tbody>
            </table>
          </view>
        </view>

        <!-- 现代化高性能分页条 -->
        <view class="table-pagination-bar" v-if="rankings.length > 0">
          <view class="page-summary">
            <text class="page-sum-txt">共 {{ rankings.length }} 个统筹区 · 当前第 {{ currentPage }} / {{ totalPages }} 页</text>
          </view>

          <view class="pagination-controls">
            <!-- 每页条数快捷选项 -->
            <view class="page-size-selector">
              <text class="size-label">每页显示：</text>
              <view class="size-options">
                <view 
                  class="size-pill" 
                  v-for="s in [15, 25, 50, 999]" 
                  :key="s"
                  :class="{ active: pageSize === s }"
                  @click="setPageSize(s); triggerHaptic()"
                >
                  <text class="size-txt">{{ s === 999 ? '全部' : s }}</text>
                </view>
              </view>
            </view>

            <!-- 翻页控制钮 -->
            <view class="page-flipper" v-if="totalPages > 1">
              <button 
                class="page-nav-btn" 
                :disabled="currentPage <= 1"
                @click="goToPage(currentPage - 1); triggerHaptic()"
              >
                ‹ 上一页
              </button>
              <view class="page-direct-num">
                <text class="current-page-num">{{ currentPage }}</text>
                <text class="slash">/</text>
                <text class="total-page-num">{{ totalPages }}</text>
              </view>
              <button 
                class="page-nav-btn" 
                :disabled="currentPage >= totalPages"
                @click="goToPage(currentPage + 1); triggerHaptic()"
              >
                下一页 ›
              </button>
            </view>
          </view>
        </view>

        <!-- 空态 -->
        <view class="empty-box" v-if="rankings.length === 0">
          <text class="empty-txt">未找到匹配的统筹区，请尝试其他关键词</text>
        </view>
      </view>

      <!-- ============================================================ -->
      <!-- 视图 2：双城竞技场 PK (Policy Arena)                          -->
      <!-- ============================================================ -->
      <view class="view-body" v-else>
        
        <!-- 热门巅峰对决预设 (快速一键对战) -->
        <view class="preset-battle-bar">
          <view class="preset-label-wrap">
            <svg class="fire-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
            <text class="preset-label">热门对标对决：</text>
          </view>
          <view class="preset-chips">
            <view 
              class="preset-chip" 
              v-for="b in popularBattles" 
              :key="b.id"
              @click="loadPreset(b.city1, b.city2)"
            >
              <text class="chip-name">{{ b.name }} ({{ b.label }})</text>
            </view>
          </view>
        </view>

        <!-- 双方战绩对决头牌看板 -->
        <view class="arena-board-card" v-if="battleResult">
          <!-- 蓝方选手 -->
          <view class="combatant-box left-box" :class="{ 'is-winner': battleResult.city1WinCount > battleResult.city2WinCount }">
            <view class="box-tag blue-tag">
              蓝方统筹区
              <view class="winner-tag-badge" v-if="battleResult.city1WinCount > battleResult.city2WinCount"><svg class="winner-badge-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><text>综合胜出</text></view>
            </view>
            
            <view class="picker-anchor mt-8">
              <view class="city-selector-trigger" @click.stop="toggleDropdown('battle1')">
                <text class="sel-city-name">{{ battleResult.city1.cityName }}</text>
                <text class="sel-prov-name" v-if="battleResult.city1.provinceName !== battleResult.city1.cityName">({{ battleResult.city1.provinceName }})</text>
                <text class="sel-caret">▾</text>
              </view>
              <view class="dropdown-menu" v-if="openDropdown === 'battle1'" @click.stop>
                <view 
                  class="menu-item" 
                  v-for="c in allCitiesList" 
                  :key="'b1_' + c.cityCode"
                  :class="{ active: cityCode1 === c.cityCode }"
                  @click.stop="cityCode1 = c.cityCode; openDropdown = null"
                >
                  <text class="item-name">{{ c.cityName }}<template v-if="c.provinceName !== c.cityName"> ({{ c.provinceName }})</template></text>
                  <svg class="check-svg" v-if="cityCode1 === c.cityCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </view>
              </view>
            </view>

            <view class="combatant-score">
              <text class="score-label">全域综合：</text>
              <text class="score-val text-blue">{{ battleResult.city1.overallScore }}</text>
              <text class="score-sub-caps">(职工{{ battleResult.city1.employeeScore }} / 居民{{ battleResult.city1.residentScore }})</text>
            </view>

            <view class="combatant-actions mt-8">
              <text class="combat-act-btn btn-policy" @click="goToCityPolicy(battleResult.city1.cityCode)">政策详情 ↗</text>
              <view class="combat-act-btn btn-calc" @click="goToCityCalc(battleResult.city1.cityCode)"><text>测算报销</text><svg class="inline-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></view>
            </view>
          </view>

          <!-- 中间：胜场比分与能量条 -->
          <view class="arena-center-vs">
            <view class="vs-emblem">VS</view>
            
            <view class="vs-score-title">
              <text class="score-win win-blue">{{ battleResult.city1WinCount }} 胜</text>
              <text class="score-divider">:</text>
              <text class="score-win win-orange">{{ battleResult.city2WinCount }} 胜</text>
            </view>
            <text class="equal-sub" v-if="battleResult.equalCount > 0">（{{ battleResult.equalCount }} 项打平）</text>

            <view class="win-meter-bar">
              <view class="meter-blue" :style="{ width: blueWinPercent + '%' }"></view>
              <view class="meter-orange" :style="{ width: orangeWinPercent + '%' }"></view>
            </view>
          </view>

          <!-- 橙方选手 -->
          <view class="combatant-box right-box" :class="{ 'is-winner': battleResult.city2WinCount > battleResult.city1WinCount }">
            <view class="box-tag orange-tag">
              橙方统筹区
              <view class="winner-tag-badge" v-if="battleResult.city2WinCount > battleResult.city1WinCount"><svg class="winner-badge-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><text>综合胜出</text></view>
            </view>
            
            <view class="picker-anchor mt-8">
              <view class="city-selector-trigger" @click.stop="toggleDropdown('battle2')">
                <text class="sel-city-name">{{ battleResult.city2.cityName }}</text>
                <text class="sel-prov-name" v-if="battleResult.city2.provinceName !== battleResult.city2.cityName">({{ battleResult.city2.provinceName }})</text>
                <text class="sel-caret">▾</text>
              </view>
              <view class="dropdown-menu" v-if="openDropdown === 'battle2'" @click.stop>
                <view 
                  class="menu-item" 
                  v-for="c in allCitiesList" 
                  :key="'b2_' + c.cityCode"
                  :class="{ active: cityCode2 === c.cityCode }"
                  @click.stop="cityCode2 = c.cityCode; openDropdown = null"
                >
                  <text class="item-name">{{ c.cityName }}<template v-if="c.provinceName !== c.cityName"> ({{ c.provinceName }})</template></text>
                  <svg class="check-svg" v-if="cityCode2 === c.cityCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </view>
              </view>
            </view>

            <view class="combatant-score">
              <text class="score-label">全域综合：</text>
              <text class="score-val text-orange">{{ battleResult.city2.overallScore }}</text>
              <text class="score-sub-caps">(职工{{ battleResult.city2.employeeScore }} / 居民{{ battleResult.city2.residentScore }})</text>
            </view>

            <view class="combatant-actions mt-8">
              <text class="combat-act-btn btn-policy" @click="goToCityPolicy(battleResult.city2.cityCode)">政策详情 ↗</text>
              <view class="combat-act-btn btn-calc" @click="goToCityCalc(battleResult.city2.cityCode)"><text>测算报销</text><svg class="inline-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></view>
            </view>
          </view>
        </view>

        <!-- 双城六大雷达能力对比面板 -->
        <view class="radar-compare-card" v-if="battleResult">
          <view class="radar-card-head">
            <text class="radar-head-title">六大核心能力维度深度对比 (Radar Benchmark 2.0)</text>
            <view class="legend-row">
              <view class="legend-item"><span class="dot-blue"></span><text>{{ battleResult.city1.cityName }}</text></view>
              <view class="legend-item"><span class="dot-orange"></span><text>{{ battleResult.city2.cityName }}</text></view>
            </view>
          </view>

          <view class="radar-bars-grid">
            <view class="radar-dim-row" v-for="dim in radarDimensions" :key="dim.key">
              <view class="dim-info">
                <text class="dim-title">{{ dim.name }}</text>
                <text class="dim-desc">{{ dim.desc }}</text>
              </view>
              <view class="dim-bars">
                <!-- 蓝方条 -->
                <view class="bar-track">
                  <view class="bar-fill blue-fill" :style="{ width: battleResult.city1.radar[dim.key] + '%' }">
                    <text class="bar-label">{{ battleResult.city1.radar[dim.key] }}分</text>
                  </view>
                </view>
                <!-- 橙方条 -->
                <view class="bar-track mt-4">
                  <view class="bar-fill orange-fill" :style="{ width: battleResult.city2.radar[dim.key] + '%' }">
                    <text class="bar-label">{{ battleResult.city2.radar[dim.key] }}分</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 详细对决指标对照表 (12 项核心法定条款技术指标) -->
        <view class="metrics-battle-card" v-if="battleResult">
          <view class="metrics-head">
            <text class="metrics-head-title">详细待遇指标比拼矩阵 (12 项法定条款纵深对决)</text>
            <text class="metrics-head-sub">涵盖门诊共济、分级住院、大病兜底、特殊优待与异地流动，智能标出优势方与领先幅度</text>
          </view>

          <view class="battle-item-list">
            <view 
              class="battle-item-row" 
              v-for="(m, idx) in battleResult.metrics" 
              :key="idx"
            >
              <!-- 蓝方数值 -->
              <view class="val-col left-val" :class="{ 'val-win': m.advantage === 'city1' }">
                <text class="val-txt">{{ m.city1Val }}</text>
                <view class="win-tag win-blue-tag" v-if="m.advantage === 'city1'"><svg class="win-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><text>更优</text></view>
              </view>

              <!-- 中间指标名称与领先幅度说明 -->
              <view class="info-col">
                <text class="metric-title">{{ m.name }}</text>
                <view class="diff-badge" :class="getDiffClass(m.advantage)">
                  <text class="diff-txt">{{ m.diffText }}</text>
                </view>
                <text class="metric-exp" v-if="m.explanation">{{ m.explanation }}</text>
              </view>

              <!-- 橙方数值 -->
              <view class="val-col right-val" :class="{ 'val-win': m.advantage === 'city2' }">
                <text class="val-txt">{{ m.city2Val }}</text>
                <view class="win-tag win-orange-tag" v-if="m.advantage === 'city2'"><svg class="win-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><text>更优</text></view>
              </view>
            </view>
          </view>
        </view>

      </view>

    </view>

    <!-- 悬浮回到顶部 FAB 按钮 (全端通用，长列表轻松回弹) -->
    <view class="fab-back-top" :class="{ show: showBackTop }" @click="scrollToTop">
      <svg class="fab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <text class="fab-txt">顶部</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { onPageScroll, onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import { 
  getBenchmarkRankings, 
  compareTwoCities, 
  popularBattles,
  type BenchmarkCategory,
  type SortColumn,
  type BenchmarkCityMetrics
} from '../../engine/ranking';
import { provinceList } from '../../data/provinces';
import { allCities } from '../../data';

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

// 视图模式：'leaderboard' | 'battle'
const viewMode = ref<'leaderboard' | 'battle'>('leaderboard');
const showMethodology = ref(false);

// 榜单展示布局：'cards' (政策卡片流) | 'table' (全维宽表)
const displayLayout = ref<'cards' | 'table'>('table');

onMounted(() => {
  try {
    // #ifdef H5
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      displayLayout.value = 'cards';
    }
    // #endif
  } catch {}
});

// 三大人群分类：'overall' | 'employee' | 'resident'
const currentCategory = ref<BenchmarkCategory>('overall');

function switchCategory(cat: BenchmarkCategory) {
  triggerHaptic();
  currentCategory.value = cat;
  sortColumn.value = 'composite';
  sortAsc.value = false;
  currentPage.value = 1;
}

const currentCategoryTitle = computed(() => {
  if (currentCategory.value === 'employee') return '城镇职工医保';
  if (currentCategory.value === 'resident') return '城乡居民医保';
  return '全域整体综合';
});

const currentCategoryWeightsSummary = computed(() => {
  if (currentCategory.value === 'employee') {
    return '在职住院 30% · 门诊共济 25% · 门诊0起付 15% · 退休倾斜 15% · 异地流动 15%';
  }
  if (currentCategory.value === 'resident') {
    return '三级重症住院 35% · 大病兜底安全垫 25% · 基层门诊 15% · 起付低门槛 15% · 异地转诊 10%';
  }
  return '住院全保障 25% · 门诊共济 20% · 大病抗风险 20% · 群体倾斜 15% · 异地流动 10% · 门槛友好 10%';
});

// 下拉菜单控制
const openDropdown = ref<string | null>(null);
function closeAllDropdowns() { openDropdown.value = null; }
function toggleDropdown(key: string) {
  openDropdown.value = openDropdown.value === key ? null : key;
}

// -------------------------------------------------------------
// 1. 排行榜逻辑
// -------------------------------------------------------------
const sortColumn = ref<SortColumn>('composite');
const sortAsc = ref(false);
const selectedProvince = ref<string>('all');
const searchQuery = ref('');

const provinceOptions = computed(() => provinceList.map(p => p.name));

const sortColumnLabels: Record<SortColumn, string> = {
  composite: '综合分',
  overall_score: '全域综合分',
  employee_score: '职工综合分',
  resident_score: '居民综合分',
  inpatient_score: '住院保障力',
  outpatient_score: '门诊共济力',
  catastrophic_score: '大病抗风险',
  threshold_score: '门槛友好度',
  retiree_score: '群体倾斜度',
  mobility_score: '异地自由度',
  emp_inpatient: '职工三级住院比例',
  res_inpatient: '居民三级住院比例',
  emp_outpatient_cap: '职工门诊共济限额',
  res_outpatient_cap: '居民门诊年度限额',
  annual_cap: '住院年度封顶限额',
  retiree_bonus: '退休优待上浮幅度'
};

const currentSortLabel = computed(() => sortColumnLabels[sortColumn.value] || '综合分');

function toggleSort(col: SortColumn) {
  triggerHaptic();
  if (sortColumn.value === col) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortColumn.value = col;
    sortAsc.value = false;
  }
  currentPage.value = 1;
}

const rankings = computed(() => {
  return getBenchmarkRankings(
    currentCategory.value,
    sortColumn.value,
    sortAsc.value,
    selectedProvince.value,
    searchQuery.value
  );
});

// 性能飞跃：高性能分页体系
const pageSize = ref(25);
const currentPage = ref(1);

const totalPages = computed(() => {
  if (pageSize.value >= 999) return 1;
  return Math.ceil(rankings.value.length / pageSize.value) || 1;
});

const displayedRankings = computed(() => {
  if (pageSize.value >= 999) return rankings.value;
  const start = (currentPage.value - 1) * pageSize.value;
  return rankings.value.slice(start, start + pageSize.value);
});

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p;
  }
}

function setPageSize(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

watch([selectedProvince, searchQuery], () => {
  currentPage.value = 1;
});

function formatCap(cap: number): string {
  if (cap >= 9999999) return '上不封顶';
  if (cap >= 10000) {
    if (cap % 10000 === 0) return `¥${cap / 10000}万`;
    const inWan = cap / 10000;
    return `¥${inWan.toFixed(1).replace(/\.0$/, '')}万`;
  }
  return `¥${cap}`;
}

function getRankClass(rank: number): string {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  if (rank <= 10) return 'rank-top10';
  return 'rank-normal';
}

function getTierBadge(rank: number): { text: string; class: string } {
  if (rank === 1) return { text: '全国榜首 · TOP 1', class: 'tier-gold' };
  if (rank <= 3) return { text: '前三甲领跑席', class: 'tier-top3' };
  if (rank <= 10) return { text: '全国十强标杆', class: 'tier-top10' };
  if (rank <= 30) return { text: '第一梯队优选', class: 'tier-tier1' };
  if (rank <= 100) return { text: '百强示范区', class: 'tier-top100' };
  return { text: '法定统筹区', class: 'tier-standard' };
}

function getCityMoatText(item: BenchmarkCityMetrics): string {
  if (currentCategory.value === 'employee') {
    if (item.empOutpatientCap >= 9999999) return '普通门诊统筹上不封顶';
    if (item.empInpatientRatio >= 0.90) return `在职三级住院报销达 ${Math.round(item.empInpatientRatio * 100)}%`;
    if (item.empOutpatientDed === 0) return '普通门诊 0 元免起付线';
    if (item.retireeBonusRatio >= 0.08) return `退休住院特享 +${Math.round(item.retireeBonusRatio * 100)}% 倾斜`;
    return `在职二级定点 ${Math.round(item.empInpatientTier2Ratio * 100)}%`;
  }
  if (currentCategory.value === 'resident') {
    if (item.isCatastrophicUncapped) return '居民大病二次报销不设封顶';
    if (item.resInpatientRatio >= 0.75) return `居民三级住院报销达 ${Math.round(item.resInpatientRatio * 100)}%`;
    if (item.resOutpatientCap >= 500) return `基层门诊统筹额度 ¥${item.resOutpatientCap}/年`;
    return `居民二级定点 ${Math.round(item.resInpatientTier2Ratio * 100)}%`;
  }
  if (item.empOutpatientCap >= 9999999 && item.isCatastrophicUncapped) return '门诊共济与大病双顶格不设限';
  if (item.isCatastrophicUncapped) return '大病兜底不设年度封顶';
  if (item.empInpatientRatio >= 0.90) return '职工三级统筹报销超 90%';
  return '政策范围待遇全面均衡';
}

function getCategoryScore(item: BenchmarkCityMetrics): number {
  if (currentCategory.value === 'employee') return item.employeeScore;
  if (currentCategory.value === 'resident') return item.residentScore;
  return item.overallScore;
}


function getProvinceSubtext(item: BenchmarkCityMetrics | any): string {
  if (!item) return ''
  // 若已在省份筛选器中锁定某一省份，则统筹区列无需重复罗列相同省份
  if (selectedProvince.value !== 'all') return ''
  // 若统筹区名称与省份名称相同（如北京市、上海市、天津市、重庆市），严禁出现“上海市 上海市”这类冗余重名
  if (item.provinceName === item.cityName || ['北京市', '上海市', '天津市', '重庆市'].includes(item.cityName)) {
    return ''
  }
  return item.provinceName
}

function getPodiumSub(item: BenchmarkCityMetrics | any, defaultTier: string): string {
  if (!item) return defaultTier
  if (item.provinceName === item.cityName || ['北京市', '上海市', '天津市', '重庆市'].includes(item.cityName)) {
    return `直辖示范 · ${defaultTier}`
  }
  return `${item.provinceName} · ${defaultTier}`
}

function getPodiumFeat1(item: BenchmarkCityMetrics): string {
  if (currentCategory.value === 'employee') return `在职三级 ${Math.round(item.empInpatientRatio * 100)}%`;
  if (currentCategory.value === 'resident') return `居民三级 ${Math.round(item.resInpatientRatio * 100)}%`;
  return `职工三级 ${Math.round(item.empInpatientRatio * 100)}%`;
}

function getPodiumFeat2(item: BenchmarkCityMetrics): string {
  if (currentCategory.value === 'employee') return `门诊共济 ${formatCap(item.empOutpatientCap)}`;
  if (currentCategory.value === 'resident') return `大病兜底 ${item.isCatastrophicUncapped ? '不设封顶' : '¥' + Math.round(item.annualMaxCap / 10000) + '万'}`;
  return `大病抗风险 ${item.radar.catastrophic}分`;
}

function goToCityPolicy(cityCode: string) {
  uni.setStorageSync('selected_medical_city_code', cityCode);
  uni.setStorageSync('selected_policy_city_code', cityCode);
  if (currentCategory.value === 'employee') {
    uni.setStorageSync('selected_policy_type', 'employee');
  } else if (currentCategory.value === 'resident') {
    uni.setStorageSync('selected_policy_type', 'resident');
  }
  uni.switchTab({ url: '/pages/policy/index' });
}

function goToCityCalc(cityCode: string) {
  uni.setStorageSync('selected_medical_city_code', cityCode);
  uni.setStorageSync('selected_policy_city_code', cityCode);
  if (currentCategory.value === 'employee') {
    uni.setStorageSync('selected_policy_type', 'employee');
  } else if (currentCategory.value === 'resident') {
    uni.setStorageSync('selected_policy_type', 'resident');
  }
  uni.switchTab({ url: '/pages/index/index' });
}

// -------------------------------------------------------------
// 2. 双城竞技场 (Battle) 逻辑
// -------------------------------------------------------------
const cityCode1 = ref('110100'); // 北京
const cityCode2 = ref('310100'); // 上海

const allCitiesList = computed(() => {
  return allCities.map(c => ({
    cityCode: c.cityCode,
    cityName: c.cityName,
    provinceName: c.provinceName
  }));
});

const battleResult = computed(() => {
  return compareTwoCities(cityCode1.value, cityCode2.value);
});

const blueWinPercent = computed(() => {
  if (!battleResult.value) return 50;
  const total = battleResult.value.city1WinCount + battleResult.value.city2WinCount;
  if (total === 0) return 50;
  return Math.round((battleResult.value.city1WinCount / total) * 100);
});

const orangeWinPercent = computed(() => {
  return 100 - blueWinPercent.value;
});

const radarDimensions = [
  { key: 'inpatient', name: '住院全层级保障力', desc: '三级公立医院及各层级医疗机构住院政策统筹报销力度' },
  { key: 'outpatient', name: '门诊共济减负水平', desc: '普通门诊统筹年度最高支付限额、起付线及自付减负力度' },
  { key: 'catastrophic', name: '大病重疾抗风险力', desc: '基本医保统筹年封顶线深度与城乡居民大病不设限安全垫' },
  { key: 'threshold', name: '起付门槛友好程度', desc: '门诊与首次住院起付门槛（0元免起付门槛获满分）' },
  { key: 'retiree', name: '群体倾斜关怀优待', desc: '退休参保人员住院报销额外上浮幅度及门诊额度倾斜优待' },
  { key: 'mobility', name: '异地就医流动自由', desc: '规范跨省异地转诊与就医直接结算报销待遇保留率' }
] as const;

function loadPreset(c1: string, c2: string) {
  triggerHaptic();
  cityCode1.value = c1;
  cityCode2.value = c2;
}

function quickBattle(targetCityCode: string) {
  triggerHaptic();
  cityCode2.value = targetCityCode;
  viewMode.value = 'battle';
}

function getDiffClass(adv: 'city1' | 'city2' | 'equal' | 'neutral'): string {
  if (adv === 'city1') return 'diff-blue';
  if (adv === 'city2') return 'diff-orange';
  return 'diff-equal';
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 60px;
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

/* 顶部标头 */
.benchmark-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 20px;
}

.header-main-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  flex: 1;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.benchmark-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 12px;
  border-radius: 9999rpx;
}

.chip-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 6px rgba(37, 99, 235, 0.6);
}

.chip-txt {
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 3px 10px;
  border-radius: 9999rpx;
}

.meta-svg {
  width: 12px;
  height: 12px;
  color: #64748b;
}

.meta-txt {
  font-size: 11px;
  color: #475569;
  font-weight: 500;
}

.benchmark-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 6px;
}

.benchmark-sub {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  max-width: 720px;
}

/* 模式切换 */
.arena-switch-bar {
  display: flex;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
  flex-shrink: 0;
}

.switch-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: #475569;
}

.switch-pill.active {
  background: #ffffff;
  color: #2563eb;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.pill-svg {
  width: 15px;
  height: 15px;
}

.pill-label {
  font-size: 13px;
}

/* 群体分类大胶囊栏 (全域综合 / 职工医保 / 居民医保) */
.category-segmented-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: rgba(241, 245, 249, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  padding: 6px;
  border-radius: 14px;
  margin-bottom: 20px;
}

.seg-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.seg-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.seg-item.active {
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.seg-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-overall { background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe; }
.cat-employee { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.cat-resident { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }

.cat-svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.seg-texts {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.seg-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seg-title {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}

.seg-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.badge-indigo { background: #eef2ff; color: #4f46e5; }
.badge-blue { background: #eff6ff; color: #2563eb; }
.badge-emerald { background: #ecfdf5; color: #059669; }

.seg-item.active .seg-title {
  color: #0f172a;
}

.seg-desc {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seg-active-indicator {
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2.5px;
  background: #2563eb;
  border-radius: 3px 3px 0 0;
}

/* 评测模型方法卡片 */
.methodology-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.method-head {
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  cursor: pointer;
  user-select: none;
}

.method-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.method-icon-pulse {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-svg {
  width: 14px;
  height: 14px;
  color: #2563eb;
}

.method-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.method-weights {
  font-size: 12px;
  color: #64748b;
}

.toggle-txt {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

.method-body {
  padding: 16px 18px;
  border-top: 1px solid #f1f5f9;
}

.weight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.w-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px 14px;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.w-item:hover {
  border-color: #cbd5e1;
}

.w-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.w-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.w-pct {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 2px 6px;
  border-radius: 4px;
}

.w-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.45;
}

/* 筛选与搜索工具条 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.picker-anchor {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  min-width: 170px;
  justify-content: space-between;
  transition: all 0.18s ease;
}

.picker-svg {
  width: 14px;
  height: 14px;
  color: #2563eb;
  flex-shrink: 0;
}

.dropdown-trigger.open {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.dropdown-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-caret {
  font-size: 12px;
  color: #64748b;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 220px;
  max-height: 360px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.menu-item:hover { background: #f8fafc; }
.menu-item.active { background: #eff6ff; font-weight: 700; color: #2563eb; }
.item-name { font-size: 13px; color: inherit; }
.item-check { font-size: 13px; color: #2563eb; }

/* 视图切换坞 */
.layout-toggle-dock {
  display: inline-flex;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.layout-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.layout-btn.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.layout-svg {
  width: 13px;
  height: 13px;
  stroke: currentColor;
}

.layout-txt {
  font-size: 12px;
}

.sort-indicator-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sort-tip-label { font-size: 12px; color: #64748b; }
.sort-tip-val { font-size: 12px; color: #0f172a; font-weight: 700; }

.search-input-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  width: 300px;
  transition: border-color 0.18s ease;
}

.search-input-box:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.search-icon {
  width: 15px;
  height: 15px;
  color: #94a3b8;
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 38px;
  font-size: 13px;
  color: #1e293b;
}

.search-clear {
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  font-size: 13px;
}

/* 前三甲领奖台卡片 (权威金融科技级香槟金/钛银/瑰铜华堂) */
.podium-row {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 18px;
  margin-bottom: 24px;
  align-items: flex-end;
}

.podium-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}

.podium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.1);
}

.podium-card.rank-1 {
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 30px 22px;
  background: linear-gradient(180deg, #fffdfa 0%, #ffffff 100%);
  box-shadow: 0 8px 24px -2px rgba(245, 158, 11, 0.12), 0 2px 6px rgba(0,0,0,0.04);
}

.podium-card.rank-2 {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: linear-gradient(180deg, #fbfcfe 0%, #ffffff 100%);
}

.podium-card.rank-3 {
  border: 1px solid rgba(217, 119, 6, 0.3);
  background: linear-gradient(180deg, #fffcf8 0%, #ffffff 100%);
}

.podium-halo {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.halo-gold {
  width: 220px;
  height: 100px;
  background: radial-gradient(ellipse, rgba(245, 158, 11, 0.22) 0%, transparent 70%);
}

.halo-silver {
  width: 200px;
  height: 90px;
  background: radial-gradient(ellipse, rgba(148, 163, 184, 0.2) 0%, transparent 70%);
}

.halo-bronze {
  width: 200px;
  height: 90px;
  background: radial-gradient(ellipse, rgba(217, 119, 6, 0.16) 0%, transparent 70%);
}

.podium-crest {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 9999rpx;
  margin-bottom: 12px;
}

.crest-gold {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border: 1px solid #f59e0b;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.crest-silver {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #334155;
  border: 1px solid #cbd5e1;
}

.crest-bronze {
  background: linear-gradient(135deg, #ffedd5, #fed7aa);
  color: #9a3412;
  border: 1px solid #f97316;
}

.crest-svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}

.podium-city {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  display: block;
  letter-spacing: -0.3px;
}

.gold-city {
  font-size: 26px;
}

.podium-prov {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: block;
}

.podium-score-group {
  margin: 14px 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
}

.score-num {
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -1px;
  font-feature-settings: 'tnum';
}

.gold-num {
  font-size: 42px;
  background: linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.silver-num {
  color: #334155;
}

.bronze-num {
  color: #9a3412;
}

.score-unit {
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
}

.gold-unit {
  color: #b45309;
}

.podium-feats {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.feat-tag {
  font-size: 11px;
  font-weight: 600;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
  color: #475569;
}

.feat-gold {
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.podium-btn {
  border-radius: 8px;
  padding: 8px 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.podium-btn:hover {
  transform: translateY(-1px);
}

.gold-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

.gold-btn-txt {
  color: #ffffff;
  font-weight: 800;
  font-size: 12px;
}

.silver-btn, .bronze-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.silver-btn .btn-txt, .bronze-btn .btn-txt {
  color: #1e293b;
  font-weight: 700;
  font-size: 12px;
}

/* ============================================================ */
/* 布局 A：精工政策卡片流 (Cards Stream)                          */
/* ============================================================ */
.cards-stream-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.bento-rank-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bento-rank-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}

.brc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.brc-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brc-rank-badge {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  font-feature-settings: 'tnum';
  flex-shrink: 0;
}

.rank-gold {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);
}

.rank-silver {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.rank-bronze {
  background: #ffedd5;
  color: #9a3412;
  border: 1px solid #fed7aa;
}

.rank-top10 {
  background: #0f172a;
  color: #ffffff;
}

.rank-normal {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.brc-name-stack {
  display: flex;
  flex-direction: column;
}

.brc-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brc-city {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.brc-prov {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
}

.brc-tier {
  font-size: 10px;
  font-weight: 700;
  margin-top: 2px;
}

.tier-gold { color: #d97706; }
.tier-top3 { color: #b45309; }
.tier-top10 { color: #2563eb; }
.tier-tier1 { color: #059669; }
.tier-top100 { color: #475569; }
.tier-standard { color: #94a3b8; }

.brc-score-capsule {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 4px 10px;
  display: flex;
  align-items: baseline;
  gap: 2px;
  flex-shrink: 0;
}

.brc-score-num {
  font-size: 18px;
  font-weight: 900;
  color: #1d4ed8;
  font-feature-settings: 'tnum';
}

.brc-score-unit {
  font-size: 11px;
  color: #3b82f6;
  font-weight: 700;
}

.brc-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px solid #f1f5f9;
}

.brc-m-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brc-m-name {
  font-size: 11px;
  color: #64748b;
}

.brc-m-val {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.font-mono {
  font-feature-settings: 'tnum';
}

.text-purple { color: #7e22ce; }
.text-amber { color: #d97706; }

.brc-meter-wrap {
  margin-bottom: 12px;
}

.brc-meter-track {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.brc-meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #06b6d4);
  border-radius: 2px;
}

.brc-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.brc-moat-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.moat-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

.brc-moat-text {
  font-size: 11px;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brc-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.brc-act-btn {
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-policy {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.btn-pk {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.brc-act-btn:hover {
  transform: translateY(-1px);
}

/* ============================================================ */
/* 布局 B：Benchmark 大宽表                                      */
/* ============================================================ */
.benchmark-table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
}

.mobile-table-hint {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
}

.hint-svg {
  width: 14px;
  height: 14px;
  color: #2563eb;
  flex-shrink: 0;
}

.hint-txt {
  font-size: 11px;
  color: #1e40af;
  font-weight: 600;
}

.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.benchmark-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
  min-width: 900px;
}

.b-thead-tr {
  background: #f8fafc;
}

.b-thead-tr th {
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  user-select: none;
  border-bottom: 2px solid #e2e8f0;
  background: #f8fafc;
}

.col-sortable {
  cursor: pointer;
  transition: background 0.15s ease;
}

.col-sortable:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.th-sort-inner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sort-arrow {
  font-size: 11px;
  color: #94a3b8;
}

.sort-arrow.active {
  color: #2563eb;
  font-weight: 800;
}

.b-tbody-tr {
  transition: background 0.15s ease;
  cursor: pointer;
}

.b-tbody-tr td {
  padding: 12px 14px;
  font-size: 13px;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
}

.b-tbody-tr:hover td {
  background: #f8fafc;
}

/* 粘性固定列：排名列与统筹区列在横向滑动时不丢失 */
.col-rank {
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: center;
  position: sticky;
  left: 0;
  z-index: 2;
}

.b-thead-tr th.col-rank {
  position: sticky;
  left: 0;
  z-index: 4;
  background: #f8fafc;
}

.col-city {
  width: 130px;
  min-width: 130px;
  position: sticky;
  left: 50px;
  z-index: 2;
  box-shadow: 4px 0 8px -2px rgba(0, 0, 0, 0.04);
}

.b-thead-tr th.col-city {
  position: sticky;
  left: 50px;
  z-index: 4;
  background: #f8fafc;
  box-shadow: 4px 0 8px -2px rgba(0, 0, 0, 0.04);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}

.city-name-group {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.city-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.prov-tag {
  font-size: 10px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
  align-self: center;
}

.score-cell-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 90px;
}

.score-display {
  font-size: 14px;
  color: #0f172a;
}

.score-bar-bg {
  width: 100%;
  height: 5px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  border-radius: 3px;
}

.score-bar-fill.fill-blue {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.score-bar-fill.fill-emerald {
  background: linear-gradient(90deg, #059669, #34d399);
}

.dim-score-pill {
  display: inline-flex;
  flex-direction: column;
  padding: 3px 8px;
  border-radius: 6px;
  line-height: 1.2;
}

.dim-score-val {
  font-size: 12px;
  font-weight: 800;
}

.dim-score-sub {
  font-size: 10px;
  opacity: 0.85;
  margin-top: 1px;
}

.pill-cyan { background: #f0fdfa; color: #0f766e; border: 1px solid #ccfbf1; }
.pill-purple { background: #faf5ff; color: #7e22ce; border: 1px solid #f3e8ff; }

.data-pill {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
}

.pill-blue { background: #eff6ff; color: #1d4ed8; }
.pill-blue .data-txt { color: #1d4ed8; font-weight: 700; font-size: 12px; }

.pill-emerald { background: #ecfdf5; color: #047857; }
.pill-emerald .data-txt { color: #047857; font-weight: 700; font-size: 12px; }

.pill-amber { background: #fffbeb; color: #b45309; }
.pill-amber .data-txt { color: #b45309; font-weight: 700; font-size: 12px; }

.plain-data-txt {
  font-size: 13px;
  color: #1e293b;
}

.text-blue { color: #2563eb; }
.text-emerald { color: #059669; }

.mini-pk-btn {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.mini-pk-btn:hover {
  background: #2563eb;
}

.mini-pk-btn:hover .pk-btn-txt {
  color: #ffffff;
}

.pk-btn-txt {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
}

/* ============================================================ */
/* 双城竞技场 (Battle) 样式                                      */
/* ============================================================ */
.preset-battle-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.preset-label-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fire-svg {
  width: 15px;
  height: 15px;
  color: #f59e0b;
}

.preset-label {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.preset-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-chip {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 5px 12px;
  border-radius: 9999rpx;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.preset-chip:hover {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-1px);
}

.chip-name {
  font-size: 12px;
  color: #334155;
  font-weight: 600;
}

/* 双方看板 */
.arena-board-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  align-items: center;
  margin-bottom: 24px;
}

.combatant-box {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.left-box {
  border: 1px solid #bfdbfe;
}

.right-box {
  border: 1px solid #fed7aa;
}

/* 优势方高光脉冲动画 (深蓝 / 炽橙) */
.left-box.is-winner {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2), 0 8px 24px -4px rgba(37, 99, 235, 0.25);
  animation: winnerPulse 2.4s infinite ease-in-out;
}

.right-box.is-winner {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2), 0 8px 24px -4px rgba(249, 115, 22, 0.25);
  animation: winnerPulseOrange 2.4s infinite ease-in-out;
}

@keyframes winnerPulse {
  0% {
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25), 0 4px 12px -2px rgba(37, 99, 235, 0.15);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.4), 0 10px 28px -2px rgba(37, 99, 235, 0.35);
  }
  100% {
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25), 0 4px 12px -2px rgba(37, 99, 235, 0.15);
  }
}

@keyframes winnerPulseOrange {
  0% {
    box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.25), 0 4px 12px -2px rgba(249, 115, 22, 0.15);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.4), 0 10px 28px -2px rgba(249, 115, 22, 0.35);
  }
  100% {
    box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.25), 0 4px 12px -2px rgba(249, 115, 22, 0.15);
  }
}

.box-tag {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 9999rpx;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
}

.winner-tag-badge {
  margin-left: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #d97706;
  background: #fef3c7;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid #fde68a;
  animation: badgeBlink 1.8s infinite ease-in-out;
}

@keyframes badgeBlink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.05); }
}

.blue-tag { background: #eff6ff; color: #1d4ed8; }
.orange-tag { background: #fff7ed; color: #c2410c; }

.city-selector-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.sel-city-name { font-size: 18px; font-weight: 800; color: #0f172a; }
.sel-prov-name { font-size: 12px; color: #64748b; }
.sel-caret { font-size: 12px; color: #64748b; }

.combatant-score {
  margin-top: 12px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.score-label { font-size: 12px; color: #64748b; }
.score-val { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
.text-orange { color: #f97316; }
.score-sub-caps { font-size: 11px; color: #64748b; margin-left: 2px; }

.combatant-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.combat-act-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-policy {
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.btn-policy:hover {
  background: #dbeafe;
}

.btn-calc {
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.btn-calc:hover {
  background: #d1fae5;
}

/* 中间比分 */
.arena-center-vs {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
}

.vs-emblem {
  font-size: 18px;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 2px;
}

.vs-score-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 6px 0 2px;
}

.score-win {
  font-size: 20px;
  font-weight: 900;
}

.win-blue { color: #2563eb; }
.win-orange { color: #f97316; }
.score-divider { font-size: 16px; color: #cbd5e1; }
.equal-sub { font-size: 11px; color: #94a3b8; margin-bottom: 6px; }

.win-meter-bar {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  margin-top: 4px;
}

.meter-blue { background: #2563eb; height: 100%; transition: width 0.3s ease; }
.meter-orange { background: #f97316; height: 100%; transition: width 0.3s ease; }

/* 六维雷达对比面板 */
.radar-compare-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.radar-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.radar-head-title { font-size: 16px; font-weight: 800; color: #0f172a; }

.legend-row {
  display: flex;
  gap: 16px;
  font-size: 13px;
  font-weight: 700;
}

.legend-item { display: flex; align-items: center; gap: 6px; }
.dot-blue { width: 10px; height: 10px; border-radius: 50%; background: #2563eb; }
.dot-orange { width: 10px; height: 10px; border-radius: 50%; background: #f97316; }

.radar-bars-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.radar-dim-row {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  align-items: center;
}

.dim-info { display: flex; flex-direction: column; }
.dim-title { font-size: 13px; font-weight: 700; color: #1e293b; }
.dim-desc { font-size: 11px; color: #64748b; margin-top: 2px; }

.dim-bars { display: flex; flex-direction: column; }
.bar-track {
  width: 100%;
  height: 18px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.blue-fill { background: linear-gradient(90deg, #60a5fa, #2563eb); }
.orange-fill { background: linear-gradient(90deg, #fb923c, #ea580c); }
.bar-label { font-size: 10px; font-weight: 800; color: #ffffff; }

/* 12项条款比拼表 */
.metrics-battle-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.metrics-head {
  padding: 18px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.metrics-head-title { font-size: 16px; font-weight: 800; color: #0f172a; display: block; }
.metrics-head-sub { font-size: 12px; color: #64748b; margin-top: 4px; display: block; }

.battle-item-list {
  display: flex;
  flex-direction: column;
}

.battle-item-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background 0.15s ease;
}

.battle-item-row:hover { background: #f8fafc; }

.val-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.left-val { align-items: flex-start; text-align: left; }
.right-val { align-items: flex-end; text-align: right; }

.val-txt {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.val-win .val-txt {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.win-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.win-blue-tag { background: #eff6ff; color: #2563eb; }
.win-orange-tag { background: #fff7ed; color: #ea580c; }

.info-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.metric-title { font-size: 13px; font-weight: 800; color: #1e293b; }

.diff-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.diff-blue { background: #eff6ff; color: #2563eb; }
.diff-orange { background: #fff7ed; color: #ea580c; }
.diff-equal { background: #f1f5f9; color: #64748b; }
.metric-exp { font-size: 11px; color: #94a3b8; line-height: 1.3; max-width: 320px; }

/* 分页条样式 */
.table-pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-top: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  flex-wrap: wrap;
  gap: 12px;
}

.page-sum-txt {
  font-size: 12px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}

.size-label {
  font-size: 12px;
  color: #64748b;
}

.size-options {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 2px;
  border-radius: 6px;
}

.size-pill {
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-pill.active {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.size-pill.active .size-txt {
  color: #2563eb;
  font-weight: 700;
}

.size-txt {
  font-size: 11px;
  color: #64748b;
}

.page-flipper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-nav-btn {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  line-height: 1.5;
  transition: all 0.15s ease;
}

.page-nav-btn:hover:not([disabled]) {
  background: #f8fafc;
  border-color: #94a3b8;
}

.page-nav-btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-direct-num {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 2px;
}

.current-page-num {
  font-weight: 800;
  color: #2563eb;
}

/* 全站通用悬浮回到顶部 FAB 按钮 */
.fab-back-top {
  position: fixed;
  right: 24px;
  bottom: calc(75px + env(safe-area-inset-bottom));
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 998;
  opacity: 0;
  transform: translateY(20px) scale(0.85);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fab-back-top.show {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.fab-back-top:hover {
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.2);
  border-color: #bfdbfe;
}

.fab-back-top:active {
  transform: scale(0.92);
}

.fab-svg {
  width: 16px;
  height: 16px;
  stroke: #2563eb;
}

.fab-txt {
  font-size: 9px;
  font-weight: 800;
  color: #2563eb;
  margin-top: -1px;
}

/* ------------------------------------------------------------- */
/* 移动端深度优化与极速适配 (< 768px & < 520px)                   */
/* ------------------------------------------------------------- */
@media (max-width: 768px) {
  .content-box {
    padding: 12px 14px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .benchmark-header {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 14px;
  }

  .benchmark-title {
    font-size: 20px;
    line-height: 1.3;
  }

  .benchmark-sub {
    font-size: 12px;
  }

  .arena-switch-bar {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .category-segmented-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    padding: 4px;
    margin-bottom: 12px;
  }

  .seg-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 8px 4px;
    gap: 4px;
  }

  .seg-icon-box {
    width: 32px;
    height: 32px;
  }

  .cat-svg {
    width: 16px;
    height: 16px;
  }

  .seg-title-row {
    flex-direction: column;
    gap: 2px;
  }

  .seg-title {
    font-size: 12px;
  }

  .seg-badge {
    display: none;
  }

  .seg-desc {
    display: none;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 14px;
  }

  .filter-left {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .picker-anchor {
    flex: 1;
    min-width: 0;
  }

  .dropdown-trigger {
    width: 100%;
    box-sizing: border-box;
    min-width: unset;
    padding: 8px 10px;
  }

  .layout-toggle-dock {
    flex-shrink: 0;
  }

  .sort-indicator-pill {
    display: none;
  }

  .search-input-box {
    width: 100%;
    box-sizing: border-box;
  }

  /* 评测模型方法卡片移动端精细化 */
  .methodology-card {
    margin-bottom: 14px;
  }

  .method-head {
    padding: 10px 12px;
    gap: 8px;
  }

  .method-left {
    flex: 1;
    min-width: 0;
    gap: 6px;
    flex-wrap: nowrap;
  }

  .method-title {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .method-weights {
    display: none;
  }

  .method-toggle {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .toggle-txt {
    font-size: 11px;
    white-space: nowrap;
  }

  /* 领奖台移动端尊享升级：NO.1 金榜领航居首横跨双列，NO.2/NO.3 钛银与瑰铜双峰并立 */
  .podium-row {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
    align-items: stretch;
  }

  /* NO.1 榜首领跑席 (跨双列 Hero Card) */
  .podium-card.rank-1 {
    order: 1;
    grid-column: span 2;
    padding: 18px 16px 16px;
    border-radius: 16px;
    background: radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.18) 0%, #ffffff 80%);
    box-shadow: 0 4px 20px -2px rgba(245, 158, 11, 0.15), 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .podium-card.rank-1 .podium-crest {
    font-size: 11px;
    padding: 4px 12px;
    margin-bottom: 8px;
  }

  .podium-card.rank-1 .gold-city {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.3px;
  }

  .podium-card.rank-1 .podium-prov {
    font-size: 12px;
    color: #b45309;
    margin-top: 2px;
  }

  .podium-card.rank-1 .podium-score-group {
    margin: 10px 0 8px;
  }

  .podium-card.rank-1 .gold-num {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: -1px;
  }

  .podium-card.rank-1 .score-unit {
    font-size: 12px;
    color: #92400e;
  }

  .podium-card.rank-1 .podium-feats {
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .podium-card.rank-1 .feat-tag {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 6px;
  }

  .podium-card.rank-1 .podium-btn {
    padding: 10px 16px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
  }

  .podium-card.rank-1 .gold-btn-txt {
    font-size: 13px;
    font-weight: 700;
  }

  /* NO.2 榜眼席 & NO.3 探花席 (下层双列并峙) */
  .podium-card.rank-2 {
    order: 2;
    grid-column: 1;
    padding: 14px 12px 12px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .podium-card.rank-3 {
    order: 3;
    grid-column: 2;
    padding: 14px 12px 12px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .podium-card.rank-2 .podium-crest,
  .podium-card.rank-3 .podium-crest {
    font-size: 10px;
    padding: 2px 8px;
    margin-bottom: 6px;
  }

  .podium-card.rank-2 .podium-city,
  .podium-card.rank-3 .podium-city {
    font-size: 16px;
    font-weight: 700;
  }

  .podium-card.rank-2 .podium-prov,
  .podium-card.rank-3 .podium-prov {
    font-size: 10.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .podium-card.rank-2 .podium-score-group,
  .podium-card.rank-3 .podium-score-group {
    margin: 8px 0 6px;
  }

  .podium-card.rank-2 .score-num,
  .podium-card.rank-3 .score-num {
    font-size: 24px;
    font-weight: 800;
  }

  .podium-card.rank-2 .podium-feats,
  .podium-card.rank-3 .podium-feats {
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
  }

  .podium-card.rank-2 .feat-tag,
  .podium-card.rank-3 .feat-tag {
    font-size: 10px;
    padding: 2px 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .podium-card.rank-2 .podium-btn,
  .podium-card.rank-3 .podium-btn {
    padding: 6px 8px;
    border-radius: 6px;
    width: 100%;
    box-sizing: border-box;
  }

  .podium-card.rank-2 .btn-txt,
  .podium-card.rank-3 .btn-txt {
    font-size: 11px;
    font-weight: 600;
  }

  /* 卡片流自适应 */
  .cards-stream-wrapper {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* 大宽表提示 */
  .mobile-table-hint {
    display: flex;
  }

  .table-pagination-bar {
    padding: 12px;
  }

  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }

  .page-size-selector {
    display: none;
  }

  /* 热门对战预设移动端横向自适应流 */
  .preset-battle-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 14px;
    width: 100%;
  }

  .preset-chips {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 8px;
    padding-bottom: 4px;
  }

  .preset-chips::-webkit-scrollbar {
    display: none;
  }

  .preset-chip {
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* 竞技场移动端 */
  .arena-board-card {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .arena-center-vs {
    order: -1;
  }

  .radar-dim-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .battle-item-row {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }

  .left-val, .right-val {
    align-items: center;
    text-align: center;
  }
}

/* 动效与触觉类 */
.switch-pill,
.seg-item,
.dropdown-trigger,
.layout-btn,
.podium-card,
.podium-btn,
.bento-rank-card,
.brc-act-btn,
.mini-pk-btn,
.preset-chip,
.page-nav-btn {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-icon-svg {
  width: 12px;
  height: 12px;
  margin-left: 4px;
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
.inline-arrow-svg {
  width: 12px;
  height: 12px;
  margin-left: 3px;
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
.winner-badge-svg {
  width: 12px;
  height: 12px;
  margin-right: 3px;
  fill: #f59e0b;
  display: inline-block;
  vertical-align: middle;
}
.win-check-svg {
  width: 11px;
  height: 11px;
  margin-right: 3px;
  stroke: currentColor;
  display: inline-block;
  vertical-align: middle;
}
.check-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
  flex-shrink: 0;
}
.clear-svg {
  width: 14px;
  height: 14px;
  stroke: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
  transition: stroke 0.2s ease;
}
.clear-svg:hover {
  stroke: #475569;
}


.city-cell-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.25;
}

.city-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.city-prov-sub {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.dim-stat-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.25;
}

.dim-stat-score {
  font-size: 13.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.dim-stat-detail {
  font-size: 11px;
  color: #64748b;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  margin-top: 1px;
}

.text-cyan {
  color: #0284c7;
}

.text-blue {
  color: #2563eb;
}

.text-emerald {
  color: #059669;
}

.text-purple {
  color: #7c3aed;
}

.text-amber {
  color: #d97706;
}

</style>
