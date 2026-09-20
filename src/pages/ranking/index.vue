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
              <text class="chip-txt">全国医保政策竞争力天梯榜 · Policy Benchmark 2026</text>
            </view>
            <view class="meta-tag">
              <text class="meta-txt">344 统筹区全样本量化评测</text>
            </view>
          </view>
          <text class="benchmark-title">全国各统筹区医保保障力排行与政策对决</text>
          <text class="benchmark-sub">分设全域整体综合、城镇职工医保、城乡居民医保三大权威榜单，支持任意维度表头即时重排与自选双城同台竞技</text>
        </view>

        <!-- 模式切换：天梯榜单 vs 双城竞技场 -->
        <view class="arena-switch-bar">
          <view 
            class="switch-pill" 
            :class="{ active: viewMode === 'leaderboard' }"
            @click="viewMode = 'leaderboard'"
          >
            <svg class="pill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <text class="pill-label">天梯榜单</text>
          </view>
          <view 
            class="switch-pill" 
            :class="{ active: viewMode === 'battle' }"
            @click="viewMode = 'battle'"
          >
            <svg class="pill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
              <line x1="13" y1="19" x2="19" y2="13"></line>
              <line x1="16" y1="16" x2="20" y2="20"></line>
              <line x1="19" y1="21" x2="21" y2="19"></line>
            </svg>
            <text class="pill-label">双城竞技场 PK</text>
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
            <span class="seg-icon">🌐</span>
            <view class="seg-texts">
              <text class="seg-title">全域整体综合榜</text>
              <text class="seg-desc">兼顾职工与居民全域实力</text>
            </view>
          </view>

          <view 
            class="seg-item" 
            :class="{ active: currentCategory === 'employee' }"
            @click="switchCategory('employee')"
          >
            <span class="seg-icon">💼</span>
            <view class="seg-texts">
              <text class="seg-title">城镇职工医保榜</text>
              <text class="seg-desc">门诊共济 · 住院保障 · 退休倾斜</text>
            </view>
          </view>

          <view 
            class="seg-item" 
            :class="{ active: currentCategory === 'resident' }"
            @click="switchCategory('resident')"
          >
            <span class="seg-icon">🏡</span>
            <view class="seg-texts">
              <text class="seg-title">城乡居民医保榜</text>
              <text class="seg-desc">基层统筹 · 二三级住院 · 大病上限</text>
            </view>
          </view>
        </view>

        <!-- 评测体系说明卡片 (展示对应人群权重) -->
        <view class="methodology-card">
          <view class="method-head" @click="showMethodology = !showMethodology">
            <view class="method-left">
              <svg class="info-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <text class="method-title">{{ currentCategoryTitle }}评测模型说明：</text>
              <text class="method-weights">{{ currentCategoryWeightsSummary }}</text>
            </view>
            <view class="method-toggle">
              <text class="toggle-txt">{{ showMethodology ? '收起说明 ▴' : '查看维度权重 ▾' }}</text>
            </view>
          </view>
          <view class="method-body" v-if="showMethodology">
            <view class="weight-grid" v-if="currentCategory === 'overall'">
              <view class="w-item"><text class="w-name">🏥 住院全层级保障 (25%)</text><text class="w-desc">三级/二级/基层分级诊疗梯次与政策范围内住院统筹报销力度</text></view>
              <view class="w-item"><text class="w-name">💊 门诊共济减负力 (20%)</text><text class="w-desc">普通门诊统筹年度最高封顶线、小病起付线及报销比例</text></view>
              <view class="w-item"><text class="w-name">🛡️ 大病重疾抗风险 (20%)</text><text class="w-desc">基本险年度封顶线深度与城乡居民大病保险不设限兜底能力</text></view>
              <view class="w-item"><text class="w-name">👴 群体倾斜关怀度 (15%)</text><text class="w-desc">退休职工住院上浮倾斜、门诊封顶优待及高龄老人关照</text></view>
              <view class="w-item"><text class="w-name">🌐 异地就医自由度 (10%)</text><text class="w-desc">跨省异地规范转诊报销保持率与自行外出宽容度</text></view>
              <view class="w-item"><text class="w-name">🚪 门槛起付友好度 (10%)</text><text class="w-desc">门诊与首次住院起付门槛，0 元免起付统筹区获得顶格满分</text></view>
            </view>
            <view class="weight-grid" v-else-if="currentCategory === 'employee'">
              <view class="w-item"><text class="w-name">🏥 在职住院全保障 (30%)</text><text class="w-desc">三甲公立医院与二级定点医院在职职工政策统筹报销比例</text></view>
              <view class="w-item"><text class="w-name">💊 门诊共济年度封顶 (25%)</text><text class="w-desc">普通门诊统筹年度最高支付限额及上不封顶政策加成</text></view>
              <view class="w-item"><text class="w-name">🚪 门诊0起付友好度 (15%)</text><text class="w-desc">普通门诊自然年度起付线，0 元免起付门槛统筹区获最高分</text></view>
              <view class="w-item"><text class="w-name">👴 退休人员倾斜优待 (15%)</text><text class="w-desc">退休职工住院报销相比在职人员额外上浮幅度及门诊额度倾斜</text></view>
              <view class="w-item"><text class="w-name">🌐 异地就医流动权益 (15%)</text><text class="w-desc">退休随迁与异地就医转诊直接结算待遇保留率</text></view>
            </view>
            <view class="weight-grid" v-else>
              <view class="w-item"><text class="w-name">🏥 三级重症大病住院 (35%)</text><text class="w-desc">三级重点医疗机构城乡居民政策范围内统筹报销比例（55%~92%）</text></view>
              <view class="w-item"><text class="w-name">🛡️ 大病兜底与安全垫 (25%)</text><text class="w-desc">城乡居民大病保险（二次报销）是否设立年封顶限制与最高段比例</text></view>
              <view class="w-item"><text class="w-name">💊 基层门诊统筹减负 (15%)</text><text class="w-desc">社区卫生站与乡镇卫生院门诊报销限额与比例</text></view>
              <view class="w-item"><text class="w-name">🚪 住院低起付门槛 (15%)</text><text class="w-desc">基层与二三级定点医院起付门槛与多次住院减半优待</text></view>
              <view class="w-item"><text class="w-name">🌐 异地规范转诊保障 (10%)</text><text class="w-desc">居民异地转诊转院政策范围内报销比例保留程度</text></view>
            </view>
          </view>
        </view>

        <!-- 工具栏：省份筛选与搜索 -->
        <view class="filter-bar">
          <view class="filter-left">
            <!-- 省份下拉 -->
            <view class="picker-anchor">
              <view class="dropdown-trigger" :class="{ open: openDropdown === 'province' }" @click.stop="toggleDropdown('province')">
                <text class="dropdown-label">{{ selectedProvince === 'all' ? '全部省份 (全国 344 区)' : selectedProvince }}</text>
                <text class="dropdown-caret">▾</text>
              </view>
              <view class="dropdown-menu" v-if="openDropdown === 'province'" @click.stop>
                <view 
                  class="menu-item" 
                  :class="{ active: selectedProvince === 'all' }"
                  @click.stop="selectedProvince = 'all'; openDropdown = null"
                >
                  <text class="item-name">全部省份 (全国 344 区)</text>
                  <text class="item-check" v-if="selectedProvince === 'all'">✓</text>
                </view>
                <view 
                  class="menu-item" 
                  v-for="p in provinceOptions" 
                  :key="p"
                  :class="{ active: selectedProvince === p }"
                  @click.stop="selectedProvince = p; openDropdown = null"
                >
                  <text class="item-name">{{ p }}</text>
                  <text class="item-check" v-if="selectedProvince === p">✓</text>
                </view>
              </view>
            </view>

            <!-- 排序提示徽章 -->
            <view class="sort-indicator-pill">
              <text class="sort-tip-label">当前排序：</text>
              <text class="sort-tip-val">{{ currentSortLabel }} {{ sortAsc ? '（升序 ▲）' : '（降序 ▼）' }}</text>
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
            <text class="search-clear" v-if="searchQuery" @click="searchQuery = ''">✕</text>
          </view>
        </view>

        <!-- 前三甲领奖台高光卡片 (动态匹配当前人群榜单) -->
        <view class="podium-row" v-if="!searchQuery && selectedProvince === 'all' && sortColumn === 'composite' && !sortAsc && rankings.length >= 3">
          <!-- 银牌 -->
          <view class="podium-card rank-2" @click="goToCityPolicy(rankings[1].cityCode)">
            <view class="medal-tag silver">🥈 NO.2 榜眼</view>
            <text class="podium-city">{{ rankings[1].cityName }}</text>
            <text class="podium-prov">{{ rankings[1].provinceName }}</text>
            <view class="podium-score-group">
              <text class="score-num">{{ getCategoryScore(rankings[1]) }}</text>
              <text class="score-unit">综合分</text>
            </view>
            <view class="podium-feats">
              <text class="feat-tag">{{ getPodiumFeat1(rankings[1]) }}</text>
              <text class="feat-tag">{{ getPodiumFeat2(rankings[1]) }}</text>
            </view>
            <view class="podium-btn" @click.stop="quickBattle(rankings[1].cityCode)">
              <text class="btn-txt">拉入 PK ⚔️</text>
            </view>
          </view>

          <!-- 金牌 -->
          <view class="podium-card rank-1" @click="goToCityPolicy(rankings[0].cityCode)">
            <view class="medal-tag gold">👑 NO.1 榜首</view>
            <text class="podium-city">{{ rankings[0].cityName }}</text>
            <text class="podium-prov">{{ rankings[0].provinceName }}</text>
            <view class="podium-score-group">
              <text class="score-num gold-num">{{ getCategoryScore(rankings[0]) }}</text>
              <text class="score-unit">综合分</text>
            </view>
            <view class="podium-feats">
              <text class="feat-tag">{{ getPodiumFeat1(rankings[0]) }}</text>
              <text class="feat-tag">{{ getPodiumFeat2(rankings[0]) }}</text>
            </view>
            <view class="podium-btn gold-btn" @click.stop="quickBattle(rankings[0].cityCode)">
              <text class="btn-txt">拉入 PK ⚔️</text>
            </view>
          </view>

          <!-- 铜牌 -->
          <view class="podium-card rank-3" @click="goToCityPolicy(rankings[2].cityCode)">
            <view class="medal-tag bronze">🥉 NO.3 探花</view>
            <text class="podium-city">{{ rankings[2].cityName }}</text>
            <text class="podium-prov">{{ rankings[2].provinceName }}</text>
            <view class="podium-score-group">
              <text class="score-num">{{ getCategoryScore(rankings[2]) }}</text>
              <text class="score-unit">综合分</text>
            </view>
            <view class="podium-feats">
              <text class="feat-tag">{{ getPodiumFeat1(rankings[2]) }}</text>
              <text class="feat-tag">{{ getPodiumFeat2(rankings[2]) }}</text>
            </view>
            <view class="podium-btn" @click.stop="quickBattle(rankings[2].cityCode)">
              <text class="btn-txt">拉入 PK ⚔️</text>
            </view>
          </view>
        </view>

        <!-- 核心：多列可排序 Benchmark 数据大宽表 -->
        <view class="benchmark-table-card">
          <!-- 移动端横滑提示栏 -->
          <view class="mobile-table-hint">
            <svg class="hint-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
              <polyline points="9 18 3 12 9 6"></polyline>
            </svg>
            <text class="hint-txt">可左右滑动查看 6 大维度细分指标 · 排名与城市已置顶固定</text>
            <svg class="hint-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
              <polyline points="15 18 21 12 15 6"></polyline>
            </svg>
          </view>
          <view class="table-scroll-wrapper">
            <table class="benchmark-table">
              <thead>
                <!-- 表头：根据当前群体分类动态呈现最关切的核心指标列 -->
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
                    <view class="th-sort-inner"><text>职工综合分</text><text class="sort-arrow" :class="{ active: sortColumn === 'employee_score' }">{{ sortColumn === 'employee_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('resident_score')">
                    <view class="th-sort-inner"><text>居民综合分</text><text class="sort-arrow" :class="{ active: sortColumn === 'resident_score' }">{{ sortColumn === 'resident_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('inpatient_score')">
                    <view class="th-sort-inner"><text>🏥 住院保障</text><text class="sort-arrow" :class="{ active: sortColumn === 'inpatient_score' }">{{ sortColumn === 'inpatient_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('outpatient_score')">
                    <view class="th-sort-inner"><text>💊 门诊共济</text><text class="sort-arrow" :class="{ active: sortColumn === 'outpatient_score' }">{{ sortColumn === 'outpatient_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('catastrophic_score')">
                    <view class="th-sort-inner"><text>🛡️ 大病兜底</text><text class="sort-arrow" :class="{ active: sortColumn === 'catastrophic_score' }">{{ sortColumn === 'catastrophic_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
                  </th>
                  <th class="col-sortable" @click="toggleSort('retiree_score')">
                    <view class="th-sort-inner"><text>👴 群体倾斜</text><text class="sort-arrow" :class="{ active: sortColumn === 'retiree_score' }">{{ sortColumn === 'retiree_score' ? (sortAsc ? '▲' : '▼') : '↕' }}</text></view>
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

                  <!-- 城市与省份 -->
                  <td class="col-city">
                    <view class="city-name-group">
                      <text class="city-name">{{ item.cityName }}</text>
                      <text class="prov-tag">{{ item.provinceName }}</text>
                    </view>
                  </td>

                  <!-- 全域整体模式数据行 -->
                  <template v-if="currentCategory === 'overall'">
                    <td class="col-score">
                      <view class="score-cell-group">
                        <text class="score-display font-bold">{{ item.overallScore }}</text>
                        <view class="score-bar-bg"><view class="score-bar-fill" :style="{ width: item.overallScore + '%' }"></view></view>
                      </view>
                    </td>
                    <td><text class="plain-data-txt font-bold text-blue">{{ item.employeeScore }}</text></td>
                    <td><text class="plain-data-txt font-bold text-emerald">{{ item.residentScore }}</text></td>
                    <td>
                      <view class="dim-score-pill pill-cyan">
                        <text class="dim-score-val">{{ item.radar.inpatient }}</text>
                        <text class="dim-score-sub">({{ Math.round(item.empInpatientRatio * 100) }}%/{{ Math.round(item.resInpatientRatio * 100) }}%)</text>
                      </view>
                    </td>
                    <td>
                      <view class="dim-score-pill pill-blue">
                        <text class="dim-score-val">{{ item.radar.outpatient }}</text>
                        <text class="dim-score-sub">({{ formatCap(item.empOutpatientCap) }})</text>
                      </view>
                    </td>
                    <td>
                      <view class="dim-score-pill pill-purple">
                        <text class="dim-score-val">{{ item.radar.catastrophic }}</text>
                        <text class="dim-score-sub">({{ item.isCatastrophicUncapped ? '不设封顶' : '¥' + Math.round(item.annualMaxCap / 10000) + '万' }})</text>
                      </view>
                    </td>
                    <td>
                      <view class="dim-score-pill pill-amber">
                        <text class="dim-score-val">{{ item.radar.retiree }}</text>
                        <text class="dim-score-sub">(+{{ Math.round(item.retireeBonusRatio * 100) }}%)</text>
                      </view>
                    </td>
                  </template>

                  <!-- 城镇职工医保模式数据行 -->
                  <template v-else-if="currentCategory === 'employee'">
                    <td class="col-score">
                      <view class="score-cell-group">
                        <text class="score-display font-bold text-blue">{{ item.employeeScore }}</text>
                        <view class="score-bar-bg"><view class="score-bar-fill fill-blue" :style="{ width: item.employeeScore + '%' }"></view></view>
                      </view>
                    </td>
                    <td><view class="data-pill pill-blue"><text class="data-txt">{{ Math.round(item.empInpatientRatio * 100) }}%</text></view></td>
                    <td><text class="plain-data-txt">{{ Math.round(item.empInpatientTier2Ratio * 100) }}%</text></td>
                    <td><text class="plain-data-txt" :class="{ 'text-emerald font-bold': item.empOutpatientCap >= 9999999 }">{{ formatCap(item.empOutpatientCap) }}</text></td>
                    <td><text class="plain-data-txt">{{ item.empOutpatientDed === 0 ? '0元 (免起付)' : '¥' + item.empOutpatientDed }}</text></td>
                    <td><view class="data-pill pill-amber"><text class="data-txt">+{{ Math.round(item.retireeBonusRatio * 100) }}%</text></view></td>
                  </template>

                  <!-- 城乡居民医保模式数据行 -->
                  <template v-else>
                    <td class="col-score">
                      <view class="score-cell-group">
                        <text class="score-display font-bold text-emerald">{{ item.residentScore }}</text>
                        <view class="score-bar-bg"><view class="score-bar-fill fill-emerald" :style="{ width: item.residentScore + '%' }"></view></view>
                      </view>
                    </td>
                    <td><view class="data-pill pill-emerald"><text class="data-txt">{{ Math.round(item.resInpatientRatio * 100) }}%</text></view></td>
                    <td><text class="plain-data-txt">{{ Math.round(item.resInpatientTier2Ratio * 100) }}%</text></td>
                    <td><text class="plain-data-txt">¥{{ item.resOutpatientCap }}/年</text></td>
                    <td>
                      <view class="dim-score-pill pill-purple">
                        <text class="dim-score-val">{{ item.radar.catastrophic }}分</text>
                        <text class="dim-score-sub">{{ item.isCatastrophicUncapped ? '不设封顶' : '¥' + Math.round(item.annualMaxCap / 10000) + '万' }}</text>
                      </view>
                    </td>
                  </template>

                  <!-- 操作列：加入竞技场 PK -->
                  <td class="col-action text-right" @click.stop>
                    <view class="action-btn-group">
                      <button class="mini-pk-btn" @click.stop="quickBattle(item.cityCode)">
                        <text class="pk-btn-txt">加入 PK ⚔️</text>
                      </button>
                    </view>
                  </td>
                </tr>
              </tbody>
            </table>
          </view>

          <!-- 性能飞跃：现代化高性能分页条 -->
          <view class="table-pagination-bar" v-if="rankings.length > 0">
            <view class="page-summary">
              <text class="page-sum-txt">共 {{ rankings.length }} 个统筹区 · 当前第 {{ currentPage }} / {{ totalPages }} 页</text>
            </view>

            <view class="pagination-controls">
              <!-- 每页条数切换胶囊 -->
              <view class="page-size-selector">
                <text class="page-size-label">每页显示：</text>
                <view class="page-size-pills">
                  <view 
                    class="size-pill" 
                    :class="{ active: pageSize === 25 }" 
                    @click="setPageSize(25)"
                  >
                    25 条
                  </view>
                  <view 
                    class="size-pill" 
                    :class="{ active: pageSize === 50 }" 
                    @click="setPageSize(50)"
                  >
                    50 条
                  </view>
                  <view 
                    class="size-pill" 
                    :class="{ active: pageSize === 999 }" 
                    @click="setPageSize(999)"
                  >
                    全部展开
                  </view>
                </view>
              </view>

              <!-- 翻页按钮组 -->
              <view class="page-buttons" v-if="totalPages > 1 && pageSize !== 999">
                <button 
                  class="page-nav-btn" 
                  :disabled="currentPage <= 1"
                  @click="goToPage(currentPage - 1)"
                >
                  上一页
                </button>
                <text class="current-page-num">{{ currentPage }}</text>
                <button 
                  class="page-nav-btn" 
                  :disabled="currentPage >= totalPages"
                  @click="goToPage(currentPage + 1)"
                >
                  下一页
                </button>
              </view>
            </view>
          </view>

          <!-- 空态 -->
          <view class="empty-box" v-if="rankings.length === 0">
            <text class="empty-txt">未找到匹配的统筹区，请尝试其他关键词</text>
          </view>
        </view>
      </view>

      <!-- ============================================================ -->
      <!-- 视图 2：双城竞技场 PK (Policy Arena)                          -->
      <!-- ============================================================ -->
      <view class="view-body" v-else>
        
        <!-- 热门巅峰对决预设 (快速一键对战) -->
        <view class="preset-battle-bar">
          <text class="preset-label">🔥 热门巅峰对决：</text>
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
              <text class="winner-tag-badge" v-if="battleResult.city1WinCount > battleResult.city2WinCount">👑 优势领先</text>
            </view>
            
            <view class="picker-anchor mt-8">
              <view class="city-selector-trigger" @click.stop="toggleDropdown('battle1')">
                <text class="sel-city-name">{{ battleResult.city1.cityName }}</text>
                <text class="sel-prov-name">({{ battleResult.city1.provinceName }})</text>
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
                  <text class="item-name">{{ c.cityName }} ({{ c.provinceName }})</text>
                  <text class="item-check" v-if="cityCode1 === c.cityCode">✓</text>
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
              <text class="combat-act-btn btn-calc" @click="goToCityCalc(battleResult.city1.cityCode)">测算报销 ➔</text>
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
              <text class="winner-tag-badge" v-if="battleResult.city2WinCount > battleResult.city1WinCount">👑 优势领先</text>
            </view>
            
            <view class="picker-anchor mt-8">
              <view class="city-selector-trigger" @click.stop="toggleDropdown('battle2')">
                <text class="sel-city-name">{{ battleResult.city2.cityName }}</text>
                <text class="sel-prov-name">({{ battleResult.city2.provinceName }})</text>
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
                  <text class="item-name">{{ c.cityName }} ({{ c.provinceName }})</text>
                  <text class="item-check" v-if="cityCode2 === c.cityCode">✓</text>
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
              <text class="combat-act-btn btn-calc" @click="goToCityCalc(battleResult.city2.cityCode)">测算报销 ➔</text>
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
                <text class="dim-name">{{ dim.name }}</text>
                <text class="dim-note">{{ dim.desc }}</text>
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
                <view class="win-tag win-blue-tag" v-if="m.advantage === 'city1'">更优 ✓</view>
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
                <view class="win-tag win-orange-tag" v-if="m.advantage === 'city2'">更优 ✓</view>
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
  inpatient_score: '🏥 住院保障力',
  outpatient_score: '💊 门诊共济力',
  catastrophic_score: '🛡️ 大病抗风险',
  threshold_score: '🚪 门槛友好度',
  retiree_score: '👴 群体倾斜度',
  mobility_score: '🌐 异地自由度',
  emp_inpatient: '职工三级住院比例',
  res_inpatient: '居民三级住院比例',
  emp_outpatient_cap: '职工门诊共济限额',
  res_outpatient_cap: '居民门诊年度限额',
  annual_cap: '住院年度封顶限额',
  retiree_bonus: '退休优待上浮幅度'
};

const currentSortLabel = computed(() => sortColumnLabels[sortColumn.value] || '综合分');

function toggleSort(col: SortColumn) {
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
  return `¥${cap}`;
}

function getRankClass(rank: number): string {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-normal';
}

function getCategoryScore(item: BenchmarkCityMetrics): number {
  if (currentCategory.value === 'employee') return item.employeeScore;
  if (currentCategory.value === 'resident') return item.residentScore;
  return item.overallScore;
}

function getPodiumFeat1(item: BenchmarkCityMetrics): string {
  if (currentCategory.value === 'employee') return `在职三级 ${Math.round(item.empInpatientRatio * 100)}%`;
  if (currentCategory.value === 'resident') return `居民三级 ${Math.round(item.resInpatientRatio * 100)}%`;
  return `职工三级 ${Math.round(item.empInpatientRatio * 100)}%`;
}

function getPodiumFeat2(item: BenchmarkCityMetrics): string {
  if (currentCategory.value === 'employee') return `门诊封顶 ${formatCap(item.empOutpatientCap)}`;
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
  { key: 'inpatient', name: '🏥 住院全层级保障力', desc: '三级大病与各层级医疗机构住院政策统筹报销力度' },
  { key: 'outpatient', name: '💊 门诊共济与减负力', desc: '普通门诊统筹年度最高封顶线、起付友好度及减负水平' },
  { key: 'catastrophic', name: '🛡️ 大病重疾抗风险力', desc: '基本医保统筹年封顶线深度与大病不设限安全垫' },
  { key: 'threshold', name: '🚪 门槛起付友好度', desc: '门诊与首次住院起付门槛（0元免起付得分最高）' },
  { key: 'retiree', name: '👴 群体倾斜关怀度', desc: '退休参保人员住院/门诊倾斜优待及高龄老人关照' },
  { key: 'mobility', name: '🌐 异地就医自由度', desc: '异地转诊与长期异地安置备案报销待遇保留率' }
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
  margin-bottom: 10px;
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
}

.chip-txt {
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
}

.meta-tag {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 9999rpx;
}

.meta-txt {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.benchmark-title {
  display: block;
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.5px;
  line-height: 1.35;
  word-break: break-word;
}

.benchmark-sub {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.6;
  word-break: break-word;
}

/* 模式切换胶囊 */
.arena-switch-bar {
  display: flex;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
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
  transition: all 0.2s ease;
  color: #475569;
}

.switch-pill.active {
  background: #ffffff;
  color: #2563eb;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.pill-svg {
  width: 16px;
  height: 16px;
}

.pill-label {
  font-size: 13px;
}

/* 群体分类大胶囊栏 (全域综合 / 职工医保 / 居民医保) */
.category-segmented-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: #e2e8f0;
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
  transition: all 0.2s ease;
  user-select: none;
}

.seg-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.seg-item.active {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.seg-icon {
  font-size: 24px;
}

.seg-texts {
  display: flex;
  flex-direction: column;
}

.seg-title {
  font-size: 15px;
  font-weight: 800;
  color: #334155;
}

.seg-item.active .seg-title {
  color: #2563eb;
}

.seg-desc {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

/* 评测模型方法卡片 */
.methodology-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.method-head {
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  cursor: pointer;
}

.method-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.info-svg {
  width: 16px;
  height: 16px;
  color: #2563eb;
  flex-shrink: 0;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.w-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  border-radius: 8px;
}

.w-name {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.w-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
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
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  min-width: 180px;
  justify-content: space-between;
}

.dropdown-trigger.open {
  border-color: #2563eb;
}

.dropdown-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
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

.sort-indicator-pill {
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 6px;
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
  width: 320px;
}

.search-icon {
  width: 16px;
  height: 16px;
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

/* 前三甲领奖台卡片 */
.podium-row {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-end;
}

.podium-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
}

.podium-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.podium-card.rank-1 {
  border-top: 4px solid #f59e0b;
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 40%);
  padding: 26px 20px;
}

.podium-card.rank-2 {
  border-top: 4px solid #94a3b8;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 40%);
}

.podium-card.rank-3 {
  border-top: 4px solid #b45309;
  background: linear-gradient(180deg, #fef3c7 0%, #ffffff 40%);
}

.medal-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 9999rpx;
  margin-bottom: 8px;
}

.medal-tag.gold { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
.medal-tag.silver { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.medal-tag.bronze { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }

.podium-city {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  display: block;
}

.podium-prov {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: block;
}

.podium-score-group {
  margin: 12px 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.score-num {
  font-size: 32px;
  font-weight: 900;
  color: #1e293b;
  letter-spacing: -1px;
}

.gold-num {
  color: #d97706;
}

.score-unit {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.podium-feats {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 14px;
}

.feat-tag {
  font-size: 11px;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #475569;
}

.podium-btn {
  background: #f1f5f9;
  border-radius: 6px;
  padding: 6px 12px;
}

.gold-btn {
  background: #fef3c7;
}

.podium-btn .btn-txt {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

/* Benchmark 大宽表 */
.benchmark-table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
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
  box-shadow: 4px 0 8px -2px rgba(0, 0, 0, 0.06);
}

.b-thead-tr th.col-city {
  position: sticky;
  left: 50px;
  z-index: 4;
  background: #f8fafc;
  box-shadow: 4px 0 8px -2px rgba(0, 0, 0, 0.06);
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

.rank-gold { background: #fef3c7; color: #b45309; }
.rank-silver { background: #f1f5f9; color: #475569; }
.rank-bronze { background: #ffedd5; color: #9a3412; }
.rank-normal { background: transparent; color: #94a3b8; }

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
  transition: all 0.2s;
}

.preset-chip:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.chip-name {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.arena-board-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 20px;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.combatant-box {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
}

.combatant-box.is-winner {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.12), inset 0 0 0 1px rgba(37, 99, 235, 0.2);
  animation: winnerPulse 3s infinite ease-in-out;
}

.combatant-box.right-box.is-winner {
  border-color: rgba(234, 88, 12, 0.3);
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.12), inset 0 0 0 1px rgba(234, 88, 12, 0.2);
  animation: winnerPulseOrange 3s infinite ease-in-out;
}

@keyframes winnerPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1), inset 0 0 0 1px rgba(37, 99, 235, 0.2); }
  50% { box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2), inset 0 0 0 1.5px rgba(37, 99, 235, 0.4); }
}

@keyframes winnerPulseOrange {
  0%, 100% { box-shadow: 0 4px 16px rgba(234, 88, 12, 0.1), inset 0 0 0 1px rgba(234, 88, 12, 0.2); }
  50% { box-shadow: 0 8px 24px rgba(234, 88, 12, 0.2), inset 0 0 0 1.5px rgba(234, 88, 12, 0.4); }
}

.winner-tag-badge {
  margin-left: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #d97706;
  background: #fef3c7;
  padding: 1px 6px;
  border-radius: 9999rpx;
  border: 1px solid #fde68a;
  display: inline-block;
  vertical-align: middle;
}

.combatant-box.left-box { align-items: flex-start; }
.combatant-box.right-box { align-items: flex-end; }

.box-tag {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
}

.blue-tag { background: #eff6ff; color: #1d4ed8; }
.orange-tag { background: #fff7ed; color: #c2410c; }

.city-selector-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.sel-city-name { font-size: 16px; font-weight: 800; color: #0f172a; }
.sel-prov-name { font-size: 12px; color: #64748b; }
.sel-caret { font-size: 12px; color: #94a3b8; }

.combatant-score {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.score-label { font-size: 12px; color: #64748b; }
.score-val { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
.score-sub-caps { font-size: 11px; color: #64748b; margin-left: 2px; }

.combatant-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.combat-act-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.combat-act-btn:active {
  transform: scale(0.96);
}

.btn-policy {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-calc {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.arena-center-vs {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.vs-emblem {
  font-size: 14px;
  font-weight: 900;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 9999rpx;
  margin-bottom: 8px;
}

.vs-score-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 28px;
  font-weight: 900;
}

.win-blue { color: #2563eb; }
.win-orange { color: #ea580c; }
.score-divider { color: #cbd5e1; }
.equal-sub { font-size: 12px; color: #64748b; margin-top: 2px; }

.win-meter-bar {
  width: 100%;
  max-width: 240px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  margin-top: 12px;
}

.meter-blue { height: 100%; background: #2563eb; transition: width 0.3s; }
.meter-orange { height: 100%; background: #ea580c; transition: width 0.3s; }

/* 五大能力对比 */
.radar-compare-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.radar-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.radar-head-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.legend-row {
  display: flex;
  gap: 16px;
  font-size: 12px;
  font-weight: 600;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot-blue { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; }
.dot-orange { width: 8px; height: 8px; border-radius: 50%; background: #ea580c; }

.radar-bars-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.radar-dim-row {
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: center;
  gap: 20px;
}

.dim-name { font-size: 13px; font-weight: 700; color: #1e293b; display: block; }
.dim-note { font-size: 11px; color: #64748b; display: block; margin-top: 1px; }

.dim-bars {
  display: flex;
  flex-direction: column;
}

.bar-track {
  width: 100%;
  height: 20px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.blue-fill { background: #3b82f6; }
.orange-fill { background: #f97316; }

.bar-label { font-size: 11px; font-weight: 800; color: #ffffff; }

/* 详细技术指标比拼矩阵 */
.metrics-battle-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.metrics-head {
  padding: 18px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.metrics-head-title { font-size: 16px; font-weight: 800; color: #0f172a; display: block; }
.metrics-head-sub { font-size: 12px; color: #64748b; margin-top: 2px; display: block; }

.battle-item-list {
  display: flex;
  flex-direction: column;
}

.battle-item-row {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.battle-item-row:last-child { border-bottom: none; }

.val-col {
  display: flex;
  flex-direction: column;
}

.left-val { align-items: flex-start; }
.right-val { align-items: flex-end; }

.val-txt { font-size: 16px; font-weight: 800; color: #334155; }
.val-win .val-txt { font-size: 18px; }
.left-val.val-win .val-txt { color: #2563eb; }
.right-val.val-win .val-txt { color: #ea580c; }

.win-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 3px;
}

.win-blue-tag { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.win-orange-tag { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

.info-col {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-title { font-size: 14px; font-weight: 700; color: #0f172a; }

.diff-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 9999rpx;
  margin: 4px 0 2px;
}

.diff-blue { background: #eff6ff; border: 1px solid #bfdbfe; }
.diff-blue .diff-txt { color: #1d4ed8; font-weight: 700; font-size: 11px; }

.diff-orange { background: #fff7ed; border: 1px solid #fed7aa; }
.diff-orange .diff-txt { color: #c2410c; font-weight: 700; font-size: 11px; }

.diff-equal { background: #f1f5f9; }
.diff-equal .diff-txt { color: #64748b; font-size: 11px; }

.metric-exp { font-size: 11px; color: #94a3b8; line-height: 1.3; max-width: 320px; }

/* 高性能分页条样式 */
.table-pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 12px;
}

.page-summary {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-size-label {
  font-size: 12px;
  color: #64748b;
}

.page-size-pills {
  display: flex;
  gap: 4px;
}

.size-pill {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}

.size-pill:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.size-pill.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
}

.page-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-nav-btn {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  cursor: pointer;
}

.page-nav-btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.current-page-num {
  font-size: 13px;
  font-weight: 800;
  color: #2563eb;
  padding: 0 4px;
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

  .badge-row {
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 6px;
  }

  .benchmark-chip {
    padding: 3px 8px;
  }

  .chip-txt {
    font-size: 11px;
  }

  .meta-txt {
    font-size: 10px;
  }

  .benchmark-title {
    font-size: 19px;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .benchmark-sub {
    font-size: 12px;
    line-height: 1.45;
  }

  .arena-switch-bar {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 3px;
    box-sizing: border-box;
  }

  .switch-pill {
    justify-content: center;
    padding: 8px 10px;
  }

  .pill-label {
    font-size: 12px;
  }

  /* 群体分类切换器：移动端紧凑三等分胶囊 */
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
    gap: 2px;
  }

  .seg-icon {
    font-size: 18px;
  }

  .seg-title {
    font-size: 12px;
    font-weight: 700;
  }

  .seg-desc {
    display: none; /* 移动端隐藏冗长副标题，节省手机高度 */
  }

  /* 评测模型方法卡片 */
  .methodology-card {
    margin-bottom: 12px;
  }

  .method-head {
    padding: 10px 12px;
  }

  .method-title {
    font-size: 12px;
  }

  .method-weights {
    display: none; /* 移动端在折叠状态下隐藏长副标题 */
  }

  .toggle-txt {
    font-size: 11px;
    white-space: nowrap;
  }

  .method-body {
    padding: 12px;
  }

  .weight-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .w-name {
    font-size: 12px;
  }

  .w-desc {
    font-size: 11px;
  }

  /* 筛选工具栏 */
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 12px;
  }

  .filter-left {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  .picker-anchor {
    flex: 1;
    min-width: 0;
  }

  .dropdown-trigger {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
  }

  .dropdown-label {
    font-size: 12px;
  }

  .dropdown-menu {
    min-width: 180px;
    max-height: 280px;
  }

  .sort-indicator-pill {
    padding: 6px 10px;
    white-space: nowrap;
    font-size: 11px;
    flex-shrink: 0;
  }

  .sort-tip-label, .sort-tip-val {
    font-size: 11px;
  }

  .search-input-box {
    width: 100%;
    min-width: unset;
    box-sizing: border-box;
    height: 38px;
  }

  /* 前三甲高光卡片：移动端保持紧凑优雅的奥运领奖台三联排 */
  .podium-row {
    grid-template-columns: 1fr 1.08fr 1fr;
    gap: 6px;
    margin-bottom: 14px;
    align-items: flex-end;
  }

  .podium-card {
    padding: 10px 4px 8px;
    border-radius: 10px;
  }

  .podium-card.rank-1 {
    padding: 14px 4px 10px;
  }

  .medal-tag {
    font-size: 9px;
    padding: 2px 4px;
    margin-bottom: 4px;
  }

  .podium-city {
    font-size: 13px;
    font-weight: 800;
  }

  .podium-prov {
    font-size: 10px;
  }

  .podium-score-group {
    margin: 4px 0;
    gap: 2px;
  }

  .score-num {
    font-size: 18px;
    letter-spacing: -0.5px;
  }

  .score-unit {
    font-size: 9px;
  }

  .podium-feats {
    flex-direction: column;
    gap: 2px;
    margin-bottom: 6px;
  }

  .feat-tag {
    font-size: 9px;
    padding: 1px 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .podium-btn {
    padding: 4px 4px;
    border-radius: 4px;
  }

  .podium-btn .btn-txt {
    font-size: 10px;
  }

  /* 大宽表移动端优化 */
  .benchmark-table-card {
    border-radius: 10px;
  }

  .benchmark-table {
    min-width: 820px;
  }

  .b-thead-tr th {
    padding: 10px 8px;
    font-size: 11px;
  }

  .b-tbody-tr td {
    padding: 10px 8px;
    font-size: 12px;
  }

  .col-rank {
    width: 44px;
    min-width: 44px;
    max-width: 44px;
  }

  .col-city {
    width: 108px;
    min-width: 108px;
    left: 44px;
  }

  .b-thead-tr th.col-city {
    left: 44px;
  }

  .city-name {
    font-size: 13px;
  }

  .prov-tag {
    font-size: 9px;
    padding: 1px 3px;
  }

  .score-display {
    font-size: 13px;
  }

  .score-cell-group {
    min-width: 76px;
  }

  .data-pill, .dim-score-pill {
    padding: 2px 6px;
  }

  .data-txt {
    font-size: 11px;
  }

  .dim-score-val {
    font-size: 12px;
  }

  .dim-score-sub {
    font-size: 9px;
  }

  .mini-pk-btn {
    padding: 4px 8px;
  }

  .pk-btn-txt {
    font-size: 11px;
  }

  .table-pagination-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 10px;
  }

  .page-summary {
    text-align: center;
  }

  .page-sum-txt {
    font-size: 11px;
  }

  .pagination-controls {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .page-size-selector {
    justify-content: center;
  }

  /* 竞技场战斗视图移动端适配 */
  .preset-battle-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 12px;
  }

  .preset-label {
    font-size: 12px;
  }

  .preset-chips {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    gap: 6px;
  }

  .preset-chip {
    padding: 4px 10px;
    flex-shrink: 0;
  }

  .chip-name {
    font-size: 11px;
  }

  .arena-board-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
    margin-bottom: 14px;
  }

  .combatant-box.left-box, .combatant-box.right-box {
    align-items: center;
  }

  .city-selector-trigger {
    padding: 6px 12px;
  }

  .sel-city-name {
    font-size: 14px;
  }

  .combatant-score {
    margin-top: 6px;
  }

  .score-val {
    font-size: 26px;
  }

  .score-sub-caps {
    font-size: 10px;
  }

  .vs-score-title {
    font-size: 16px;
  }

  .score-win {
    font-size: 16px;
  }

  .arena-radar-card, .battle-matrix-card {
    padding: 14px 10px;
    margin-bottom: 14px;
  }

  .radar-head-title, .metrics-head-title {
    font-size: 15px;
  }

  .radar-head-sub, .metrics-head-sub {
    font-size: 11px;
  }

  .radar-dim-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .radar-dim-card {
    padding: 10px 8px;
  }

  .dim-name {
    font-size: 12px;
  }

  .radar-score {
    font-size: 15px;
  }

  .metrics-head {
    padding: 12px 14px;
  }

  .battle-item-row {
    grid-template-columns: 1fr 1.2fr 1fr;
    gap: 4px;
    padding: 12px 6px;
  }

  .val-txt {
    font-size: 13px;
  }

  .metric-title {
    font-size: 12px;
  }

  .diff-badge {
    padding: 2px 6px;
  }

  .diff-txt {
    font-size: 10px;
  }

  .metric-exp {
    display: none; /* 移动端在对决列表中隐藏长解释，凸显数字比拼 */
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
