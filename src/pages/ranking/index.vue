<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <AppHeader currentTab="ranking" />

    <view class="content-box">
      <!-- 页面顶栏 -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">全国医保待遇榜单与政策对比</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">344 统筹区全量覆盖</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 模式切换：天梯榜单 vs 双城PK -->
        <view class="mode-switch-group">
          <view 
            class="mode-btn" 
            :class="{ active: viewMode === 'leaderboard' }"
            @click="viewMode = 'leaderboard'"
          >
            <text class="mode-btn-txt">天梯榜单</text>
          </view>
          <view 
            class="mode-btn" 
            :class="{ active: viewMode === 'battle' }"
            @click="viewMode = 'battle'"
          >
            <text class="mode-btn-txt">双城对决 PK</text>
          </view>
        </view>
      </view>

      <!-- ============================================================ -->
      <!-- 模式一：天梯榜单 (Leaderboard)                                -->
      <!-- ============================================================ -->
      <view class="view-section" v-if="viewMode === 'leaderboard'">
        <!-- 维度切换胶囊栏 -->
        <view class="dimension-bar">
          <view 
            class="dim-pill" 
            v-for="dim in dimensions" 
            :key="dim.id"
            :class="{ active: currentDimension === dim.id }"
            @click="currentDimension = dim.id"
          >
            <text class="dim-icon">{{ dim.icon }}</text>
            <text class="dim-label">{{ dim.label }}</text>
          </view>
        </view>

        <!-- 筛选与搜索工具条 -->
        <view class="filter-toolbar">
          <!-- 省份筛选下拉 -->
          <view class="picker-anchor">
            <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'province' }" @click.stop="toggleDropdown('province')">
              <text class="select-val">{{ selectedProvince === 'all' ? '全部省份 (全国)' : selectedProvince }}</text>
              <text class="select-arrow" :class="{ rotated: openDropdown === 'province' }">▾</text>
            </view>
            <view class="cyber-dropdown-menu" v-if="openDropdown === 'province'" @click.stop>
              <view 
                class="dropdown-item" 
                :class="{ selected: selectedProvince === 'all' }"
                @click.stop="selectedProvince = 'all'; openDropdown = null"
              >
                <text class="item-name">全部省份 (全国 344 区)</text>
                <text class="item-check" v-if="selectedProvince === 'all'">✓</text>
              </view>
              <view 
                class="dropdown-item" 
                v-for="p in provinceOptions" 
                :key="p"
                :class="{ selected: selectedProvince === p }"
                @click.stop="selectedProvince = p; openDropdown = null"
              >
                <text class="item-name">{{ p }}</text>
                <text class="item-check" v-if="selectedProvince === p">✓</text>
              </view>
            </view>
          </view>

          <!-- 搜索输入框 -->
          <view class="search-box">
            <input 
              class="search-input" 
              v-model="searchKeyword" 
              placeholder="搜索统筹区或省份（如：广州 / 成都）" 
            />
            <text class="search-clear" v-if="searchKeyword" @click="searchKeyword = ''">✕</text>
          </view>
        </view>

        <!-- 前三甲领奖台卡片 (仅在没有特定搜索时展示前三甲高光) -->
        <view class="podium-grid" v-if="!searchKeyword && selectedProvince === 'all' && rankings.length >= 3">
          <!-- 第二名 (银牌) -->
          <view class="podium-card rank-2" @click="goToCityPolicy(rankings[1].cityCode)">
            <view class="medal silver">🥈 榜眼</view>
            <text class="podium-city">{{ rankings[1].cityName }}</text>
            <text class="podium-prov">{{ rankings[1].provinceName }}</text>
            <text class="podium-val">{{ rankings[1].highlightValue }}</text>
            <text class="podium-sub">{{ rankings[1].secondaryText }}</text>
          </view>

          <!-- 第一名 (金牌) -->
          <view class="podium-card rank-1" @click="goToCityPolicy(rankings[0].cityCode)">
            <view class="medal gold">👑 状元</view>
            <text class="podium-city">{{ rankings[0].cityName }}</text>
            <text class="podium-prov">{{ rankings[0].provinceName }}</text>
            <text class="podium-val text-gold">{{ rankings[0].highlightValue }}</text>
            <text class="podium-sub">{{ rankings[0].secondaryText }}</text>
          </view>

          <!-- 第三名 (铜牌) -->
          <view class="podium-card rank-3" @click="goToCityPolicy(rankings[2].cityCode)">
            <view class="medal bronze">🥉 探花</view>
            <text class="podium-city">{{ rankings[2].cityName }}</text>
            <text class="podium-prov">{{ rankings[2].provinceName }}</text>
            <text class="podium-val">{{ rankings[2].highlightValue }}</text>
            <text class="podium-sub">{{ rankings[2].secondaryText }}</text>
          </view>
        </view>

        <!-- 完整排行表格 -->
        <view class="rank-table-card">
          <view class="table-header">
            <text class="th-cell w-rank">排位</text>
            <text class="th-cell w-city">统筹区</text>
            <text class="th-cell w-score text-right">核心数据</text>
            <text class="th-cell w-desc">亮点说明</text>
            <text class="th-cell w-action text-right">操作</text>
          </view>

          <view 
            class="table-row" 
            v-for="item in rankings" 
            :key="item.cityCode"
            @click="goToCityPolicy(item.cityCode)"
          >
            <view class="td-cell w-rank">
              <view class="rank-badge" :class="getRankBadgeClass(item.rank)">
                {{ item.rank }}
              </view>
            </view>
            <view class="td-cell w-city">
              <text class="city-name">{{ item.cityName }}</text>
              <text class="province-tag">{{ item.provinceName }}</text>
            </view>
            <view class="td-cell w-score text-right">
              <text class="score-val">{{ item.highlightValue }}</text>
            </view>
            <view class="td-cell w-desc">
              <text class="desc-text">{{ item.secondaryText }}</text>
            </view>
            <view class="td-cell w-action text-right">
              <text class="action-link">查待遇 ↗</text>
            </view>
          </view>

          <view class="table-empty" v-if="rankings.length === 0">
            <text class="empty-txt">未检索到符合条件的统筹区</text>
          </view>
        </view>
      </view>

      <!-- ============================================================ -->
      <!-- 模式二：双城对决 PK (City Battle)                            -->
      <!-- ============================================================ -->
      <view class="view-section" v-else>
        <!-- 城市选择卡片 -->
        <view class="pk-header-card">
          <!-- 城市 1 选择器 -->
          <view class="pk-city-box left">
            <text class="pk-tag">蓝方城市</text>
            <view class="picker-anchor w-full">
              <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'city1' }" @click.stop="toggleDropdown('city1')">
                <text class="select-val font-bold">{{ battleCity1.cityName }} ({{ battleCity1.provinceName }})</text>
                <text class="select-arrow">▾</text>
              </view>
              <view class="cyber-dropdown-menu" v-if="openDropdown === 'city1'" @click.stop>
                <view 
                  class="dropdown-item" 
                  v-for="c in allCitiesList" 
                  :key="'c1_' + c.cityCode"
                  :class="{ selected: cityCode1 === c.cityCode }"
                  @click.stop="cityCode1 = c.cityCode; openDropdown = null"
                >
                  <text class="item-name">{{ c.cityName }} ({{ c.provinceName }})</text>
                  <text class="item-check" v-if="cityCode1 === c.cityCode">✓</text>
                </view>
              </view>
            </view>
            <view class="score-pill">综合保障 {{ comparisonResult?.city1Composite }} 分</view>
          </view>

          <!-- VS 徽标与对决统计 -->
          <view class="pk-vs-block">
            <view class="vs-circle">VS</view>
            <text class="vs-score-summary" v-if="comparisonResult">
              {{ comparisonResult.city1WinCount }} 胜 · {{ comparisonResult.city2WinCount }} 胜
            </text>
          </view>

          <!-- 城市 2 选择器 -->
          <view class="pk-city-box right">
            <text class="pk-tag">红方城市</text>
            <view class="picker-anchor w-full">
              <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'city2' }" @click.stop="toggleDropdown('city2')">
                <text class="select-val font-bold">{{ battleCity2.cityName }} ({{ battleCity2.provinceName }})</text>
                <text class="select-arrow">▾</text>
              </view>
              <view class="cyber-dropdown-menu" v-if="openDropdown === 'city2'" @click.stop>
                <view 
                  class="dropdown-item" 
                  v-for="c in allCitiesList" 
                  :key="'c2_' + c.cityCode"
                  :class="{ selected: cityCode2 === c.cityCode }"
                  @click.stop="cityCode2 = c.cityCode; openDropdown = null"
                >
                  <text class="item-name">{{ c.cityName }} ({{ c.provinceName }})</text>
                  <text class="item-check" v-if="cityCode2 === c.cityCode">✓</text>
                </view>
              </view>
            </view>
            <view class="score-pill">综合保障 {{ comparisonResult?.city2Composite }} 分</view>
          </view>
        </view>

        <!-- 详细指标 PK 矩阵 -->
        <view class="pk-matrix-card" v-if="comparisonResult">
          <view class="matrix-head">
            <text class="m-head-title">各项待遇指标横向对决</text>
          </view>

          <view class="matrix-list">
            <view 
              class="matrix-row" 
              v-for="(metric, idx) in comparisonResult.metrics" 
              :key="idx"
            >
              <!-- 城市 1 数值 -->
              <view class="m-val-col col-left" :class="{ win: metric.advantage === 'city1' }">
                <text class="m-num">{{ metric.city1Val }}</text>
                <text class="win-badge" v-if="metric.advantage === 'city1'">更优 ✓</text>
              </view>

              <!-- 指标名称 -->
              <view class="m-name-col">
                <text class="m-title">{{ metric.name }}</text>
                <text class="m-cat">{{ metric.category }}</text>
              </view>

              <!-- 城市 2 数值 -->
              <view class="m-val-col col-right" :class="{ win: metric.advantage === 'city2' }">
                <text class="m-num">{{ metric.city2Val }}</text>
                <text class="win-badge" v-if="metric.advantage === 'city2'">更优 ✓</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import { allCities } from '../../data';
import { 
  getCityRankings, 
  compareTwoCities, 
  type RankingDimension 
} from '../../engine/ranking';

// 视图模式：leaderboard（天梯榜）| battle（双城PK）
const viewMode = ref<'leaderboard' | 'battle'>('leaderboard');

// 排行榜控制
const currentDimension = ref<RankingDimension>('composite');
const selectedProvince = ref<string>('all');
const searchKeyword = ref<string>('');
const openDropdown = ref<string | null>(null);

const dimensions = [
  { id: 'composite' as RankingDimension, icon: '🏆', label: '综合保障指数' },
  { id: 'resident_inpatient' as RankingDimension, icon: '🏥', label: '居民住院保障' },
  { id: 'employee_outpatient' as RankingDimension, icon: '🏢', label: '职工门诊共济' },
  { id: 'annual_cap' as RankingDimension, icon: '🛡️', label: '基金最高限额' },
  { id: 'retiree_preference' as RankingDimension, icon: '👴', label: '退休优待倾斜' }
];

const allCitiesList = allCities;

// 所有可用省份列表
const provinceOptions = computed(() => {
  const set = new Set<string>();
  allCities.forEach(c => set.add(c.provinceName));
  return Array.from(set);
});

// 计算当前排位列表
const rankings = computed(() => {
  return getCityRankings(currentDimension.value, selectedProvince.value, searchKeyword.value);
});

// 双城 PK 选定城市 (默认选北京 vs 咸阳)
const cityCode1 = ref('110000'); // 北京
const cityCode2 = ref('610400'); // 咸阳

const battleCity1 = computed(() => allCities.find(c => c.cityCode === cityCode1.value) || allCities[0]);
const battleCity2 = computed(() => allCities.find(c => c.cityCode === cityCode2.value) || allCities[1]);

const comparisonResult = computed(() => {
  return compareTwoCities(cityCode1.value, cityCode2.value);
});

function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

function closeAllDropdowns() {
  openDropdown.value = null;
}

function getRankBadgeClass(rank: number) {
  if (rank === 1) return 'rank-top-1';
  if (rank === 2) return 'rank-top-2';
  if (rank === 3) return 'rank-top-3';
  return 'rank-normal';
}

function goToCityPolicy(cityCode: string) {
  uni.navigateTo({
    url: `/pages/policy/index?cityCode=${cityCode}`
  });
}
</script>

<style scoped>
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
}

/* 顶栏 */
.page-intro-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.intro-left {
  display: flex;
  align-items: center;
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
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
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
}

.city-indicator-chip {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 3px 10px;
  border-radius: 9999rpx;
}

.city-indicator-txt {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

/* 模式切换 */
.mode-switch-group {
  display: inline-flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.mode-btn {
  padding: 6px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.mode-btn-txt {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.mode-btn.active .mode-btn-txt {
  color: #0f172a;
  font-weight: 700;
}

/* 维度切换 */
.dimension-bar {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 16px;
}

.dim-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 9999rpx;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.dim-pill:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.dim-pill.active {
  background: #eff6ff;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.dim-icon {
  font-size: 14px;
}

.dim-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.dim-pill.active .dim-label {
  color: #1d4ed8;
  font-weight: 700;
}

/* 筛选工具条 */
.filter-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.picker-anchor {
  position: relative;
  min-width: 180px;
}

.cyber-dropdown-trigger {
  height: 38px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
}

.cyber-dropdown-trigger.open,
.cyber-dropdown-trigger:hover {
  border-color: #2563eb;
}

.select-val {
  font-size: 13px;
  color: #0f172a;
}

.select-arrow {
  font-size: 12px;
  color: #64748b;
  transition: transform 0.2s;
}

.select-arrow.rotated {
  transform: rotate(180deg);
}

.cyber-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 280px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 100;
}

.dropdown-item {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
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
}

.dropdown-item.selected .item-name {
  color: #2563eb;
  font-weight: 700;
}

.dropdown-item .item-check {
  color: #2563eb;
  font-weight: 700;
  font-size: 12px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 240px;
}

.search-input {
  width: 100%;
  height: 38px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 36px 0 14px;
  font-size: 13px;
  color: #0f172a;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #2563eb;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 10px;
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
}

/* 前三甲领奖台 */
.podium-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 16px;
  align-items: end;
  margin-bottom: 24px;
}

.podium-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.podium-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
}

.podium-card.rank-1 {
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
  border-color: #fde68a;
  padding: 28px 16px;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.08);
}

.podium-card.rank-2 {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-color: #cbd5e1;
}

.podium-card.rank-3 {
  background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
  border-color: #fed7aa;
}

.medal {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999rpx;
  margin-bottom: 8px;
}

.medal.gold { background: #fef3c7; color: #b45309; }
.medal.silver { background: #f1f5f9; color: #475569; }
.medal.bronze { background: #ffedd5; color: #c2410c; }

.podium-city {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  display: block;
}

.podium-prov {
  font-size: 11px;
  color: #64748b;
  display: block;
  margin-top: 2px;
}

.podium-val {
  font-size: 20px;
  font-weight: 800;
  color: #0284c7;
  display: block;
  margin: 10px 0 4px;
}

.podium-val.text-gold {
  color: #d97706;
}

.podium-sub {
  font-size: 11px;
  color: #94a3b8;
  display: block;
}

/* 榜单表格 */
.rank-table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.table-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.th-cell {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.w-rank { width: 50px; flex-shrink: 0; }
.w-city { width: 140px; flex-shrink: 0; }
.w-score { width: 110px; flex-shrink: 0; }
.w-desc { flex: 1; min-width: 0; padding: 0 16px; }
.w-action { width: 70px; flex-shrink: 0; }

.rank-badge {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.rank-top-1 { background: #fef3c7; color: #b45309; }
.rank-top-2 { background: #f1f5f9; color: #475569; }
.rank-top-3 { background: #ffedd5; color: #c2410c; }
.rank-normal { background: #f8fafc; color: #64748b; }

.city-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  display: block;
}

.province-tag {
  font-size: 11px;
  color: #94a3b8;
  display: block;
}

.score-val {
  font-size: 15px;
  font-weight: 800;
  color: #0284c7;
}

.desc-text {
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.action-link {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

.table-empty {
  padding: 40px;
  text-align: center;
}

.empty-txt {
  font-size: 13px;
  color: #94a3b8;
}

/* ============================================================ */
/* 双城 PK 样式                                                  */
/* ============================================================ */
.pk-header-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.pk-city-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pk-city-box.right {
  align-items: flex-end;
}

.pk-tag {
  font-size: 12px;
  font-weight: 700;
}

.pk-city-box.left .pk-tag { color: #0284c7; }
.pk-city-box.right .pk-tag { color: #e11d48; }

.w-full {
  width: 100%;
}

.score-pill {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.pk-vs-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.vs-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #e11d48 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}

.vs-score-summary {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

/* PK 矩阵卡片 */
.pk-matrix-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.matrix-head {
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.m-head-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.matrix-list {
  display: flex;
  flex-direction: column;
}

.matrix-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.matrix-row:last-child {
  border-bottom: none;
}

.m-name-col {
  text-align: center;
  padding: 0 12px;
}

.m-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  display: block;
}

.m-cat {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.m-val-col {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-val-col.col-left {
  justify-content: flex-start;
}

.m-val-col.col-right {
  justify-content: flex-end;
}

.m-num {
  font-size: 15px;
  font-weight: 700;
  color: #475569;
}

.m-val-col.win .m-num {
  color: #059669;
  font-weight: 800;
}

.win-badge {
  font-size: 11px;
  font-weight: 700;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  padding: 2px 6px;
  border-radius: 4px;
}

.text-right {
  text-align: right;
}

.font-bold {
  font-weight: 700;
}

@media (max-width: 768px) {
  .podium-grid {
    grid-template-columns: 1fr;
  }
  .w-desc {
    display: none;
  }
  .pk-header-card {
    grid-template-columns: 1fr;
  }
  .pk-city-box.right {
    align-items: flex-start;
  }
}
</style>
