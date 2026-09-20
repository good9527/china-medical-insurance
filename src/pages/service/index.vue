<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中) -->
    <AppHeader currentTab="service" />

    <view class="content-box">
      <!-- 页面顶部品牌与功能栏 -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">医保便民服务中心</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">{{ activeSubTab === 'remote' ? ('参保地: ' + currentCityOption.cityName) : (currentProvince.name + ' · 官方专线') }}</text>
                </view>
              </view>
              <text class="page-sub-title">全国 344 统筹区跨省/市异地就医备案结算指南、12393 咨询专线与医保政务网入口</text>
            </view>
          </view>
        </view>

        <!-- 模式切换：异地就医指南 vs 医保热线与官网 -->
        <view class="subtab-switch-dock">
          <view 
            class="switch-pill" 
            :class="{ active: activeSubTab === 'remote' }"
            @click="activeSubTab = 'remote'"
          >
            <svg class="pill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <text class="pill-label">异地就医指南</text>
          </view>
          <view 
            class="switch-pill" 
            :class="{ active: activeSubTab === 'hotline' }"
            @click="activeSubTab = 'hotline'"
          >
            <svg class="pill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <text class="pill-label">医保热线与官网</text>
          </view>
        </view>
      </view>

      <!-- ============================================================ -->
      <!-- 子模块 1：异地就医指南                                       -->
      <!-- ============================================================ -->
      <view class="subtab-view" v-if="activeSubTab === 'remote'">
        <!-- 地区切换选择器栏 -->
        <view class="toolbar-pickers-row mb-16">
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
                <svg class="check-svg" v-if="selectedProvinceIndex === idx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
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
                <svg class="check-svg" v-if="selectedCityIndex === idx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </view>
            </view>
          </view>
        </view>

        <!-- 参保地异地就医折算细则 (4色指标网格) -->
        <view class="card">
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

          <!-- 推荐备案通道与注意事项 -->
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

        <!-- 自助备案 4 步流程与核心黄金法则 -->
        <view class="bottom-dual-grid mt-20">
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

      <!-- ============================================================ -->
      <!-- 子模块 2：医保热线与官网                                     -->
      <!-- ============================================================ -->
      <view class="subtab-view" v-else>
        <!-- 省份切换工具栏 -->
        <view class="toolbar-pickers-row mb-16">
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
                <svg class="check-svg" v-if="selectedProvinceIndex === idx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </view>
            </view>
          </view>
        </view>

        <!-- 该省各城市专线与官网自适应卡片网格 -->
        <view class="card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">{{ currentProvince.name }}各统筹区官方服务入口</text>
            </view>
            <view class="badge-pill badge-cyan">
              <text class="badge-txt">{{ provinceCityHotlines.length }} 个统筹区在线</text>
            </view>
          </view>

          <view class="hotline-grid">
            <view class="hotline-card" v-for="item in provinceCityHotlines" :key="item.cityCode">
              <view class="hotline-card-top">
                <view class="city-name-wrap">
                  <text class="city-name">{{ item.cityName }}</text>
                  <text class="city-code-tag">{{ item.cityCode }}</text>
                </view>
                <text class="update-chip" v-if="item.lastUpdated">核验: {{ item.lastUpdated }}</text>
              </view>

              <!-- 官方热线列表 -->
              <view class="phone-list-wrap">
                <view class="phone-item-row" v-for="(p, pIdx) in item.phoneList" :key="pIdx">
                  <view class="phone-item-left">
                    <text class="phone-tag-badge">{{ p.label }}</text>
                    <text class="phone-number-txt">{{ p.display }}</text>
                  </view>
                  <view class="btn-micro-dial" @click="callPhone(p.cleanTel)">
                    <text class="micro-dial-txt">拨打 ↗</text>
                  </view>
                </view>
              </view>

              <view class="hotline-card-foot" v-if="item.officialPortalUrl">
                <view class="action-btn btn-portal" @click="openPortal(item.officialPortalUrl)">
                  <text class="btn-label">进入参保地医保政务网 ↗</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 拨打须知小贴士 -->
        <view class="card mt-20">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">全国 12393 医保专线统一服务规范</text>
            </view>
          </view>
          <view class="notice-text-block">
            <text class="notice-p">1. 【本地拨打】：在参保地所在城市直接拨打 12393，无需加拨区号即可直接接入当地医保公共服务热线。</text>
            <text class="notice-p">2. 【异地拨打】：若人在外地咨询参保地医保政策，请在 12393 前加拨参保地所属地级市电话区号（如咨询北京医保请拨打 010-12393，咨询广州拨打 020-12393）。</text>
            <text class="notice-p">3. 【人工服务时间】：法定工作日 9:00 - 12:00，13:30 - 17:00（各统筹区略有浮动，智能语音客服 7×24 小时在线）。</text>
          </view>
        </view>
      </view>

      <!-- 引导至专属政策纠错与智库核验中心 -->
      <view class="correction-guide-card mt-20" @click="goToCorrection">
        <view class="guide-left">
          <view class="guide-icon-box">
            <svg class="guide-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </view>
          <view class="guide-text-stack">
            <text class="guide-main-txt">发现参保地政策变动或红头公文更新？</text>
            <text class="guide-sub-txt">进入【政策纠错与智库核验中心】，调取现行参数即时测算推演并提交勘误</text>
          </view>
        </view>
        <view class="guide-btn">
          <text class="guide-btn-txt">前往纠错核验 ↗</text>
        </view>
      </view>

    </view>

    <!-- 悬浮回到顶部 FAB 按钮 -->
    <view class="fab-back-top" :class="{ show: showBackTop }" @click="scrollToTop">
      <svg class="fab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <text class="fab-txt">顶部</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import { provinceList, getCitiesByProvinceCode, getCityData } from '../../data/provinces';
import { getCityDataByCode } from '../../data';

function goToCorrection() {
  uni.switchTab({ url: '/pages/correction/index' });
}

// 子选项卡切换：remote (异地就医) | hotline (服务热线)
const activeSubTab = ref<'remote' | 'hotline'>('remote');

onLoad((query: any) => {
  if (query && query.tab === 'hotline') {
    activeSubTab.value = 'hotline';
  } else if (query && query.tab === 'remote') {
    activeSubTab.value = 'remote';
  }
});

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

// 下拉状态与地区联动
const openDropdown = ref<string | null>(null);
const selectedProvinceIndex = ref(0);
const selectedCityIndex = ref(0);
const currentType = ref<'employee' | 'resident'>('employee');

function closeAllDropdowns() { openDropdown.value = null; }

function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

const currentProvince = computed(() => provinceList[selectedProvinceIndex.value] || provinceList[0]);
const cityOptions = computed(() => getCitiesByProvinceCode(currentProvince.value.code));
const currentCityOption = computed(() => cityOptions.value[selectedCityIndex.value] || cityOptions.value[0]);
const currentCity = computed(() => getCityData(currentProvince.value.code, currentCityOption.value.cityCode));

const remotePolicy = computed(() => {
  const c = currentCity.value;
  return currentType.value === 'employee' ? c.employee.remoteSettlement : c.resident.remoteSettlement;
});

function selectProvince(idx: number) {
  selectedProvinceIndex.value = idx;
  selectedCityIndex.value = 0;
  openDropdown.value = null;
}

function selectCity(idx: number) {
  selectedCityIndex.value = idx;
  openDropdown.value = null;
}

// 热线数据结构与解析
interface HotlineEntry {
  label: string;
  display: string;
  cleanTel: string;
}

interface CityHotlineDisplay {
  cityCode: string;
  cityName: string;
  officialPortalUrl?: string;
  lastUpdated?: string;
  phoneList: HotlineEntry[];
}

function parseHotlines(rawHotline: string, cityName: string): HotlineEntry[] {
  if (!rawHotline || rawHotline.trim() === '') {
    return [{ label: '全国医保专线', display: '12393 (本地直拨)', cleanTel: '12393' }];
  }

  const parts = rawHotline.split(/[/、或,，]/).map(s => s.trim()).filter(Boolean);
  const entries: HotlineEntry[] = [];

  for (const part of parts) {
    const clean = part.replace(/[^0-9]/g, '');
    if (!clean) continue;

    let label = '医保便民专线';
    if (clean.endsWith('12393')) {
      label = clean === '12393' ? '全国统一医保热线' : '医保热线 (异地加区号)';
    } else if (clean.endsWith('12345')) {
      label = '政务服务便民热线';
    } else if (clean.endsWith('12333')) {
      label = '人社与社保咨询专线';
    } else {
      label = `${cityName}经办业务座机`;
    }

    entries.push({
      label,
      display: part,
      cleanTel: clean
    });
  }

  if (entries.length === 0) {
    entries.push({ label: '全国统一医保热线', display: '12393', cleanTel: '12393' });
  }

  return entries;
}

const provinceCityHotlines = computed<CityHotlineDisplay[]>(() => {
  const cities = getCitiesByProvinceCode(currentProvince.value.code);
  return cities.map(c => {
    const data = getCityDataByCode(c.cityCode);
    const raw = data?.hotline || '12393';
    const phoneList = parseHotlines(raw, c.cityName);

    let lastUpdated = data?.lastUpdated;
    if (!lastUpdated && data?.sourceDocs && data.sourceDocs.length > 0) {
      lastUpdated = data.sourceDocs[0]?.publishDate;
    }

    return {
      cityCode: c.cityCode,
      cityName: c.cityName,
      officialPortalUrl: data?.officialPortalUrl,
      lastUpdated: lastUpdated || '2026-03-01',
      phoneList
    };
  });
});

function callPhone(cleanTel: string) {
  if (!cleanTel) return;
  uni.makePhoneCall({
    phoneNumber: cleanTel,
    fail: () => {
      uni.showToast({ title: `已复制电话: ${cleanTel}`, icon: 'none' });
      uni.setClipboardData({ data: cleanTel });
    }
  });
}

function openPortal(url: string) {
  if (!url) return;
  // #ifdef H5
  window.open(url, '_blank');
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: url,
    success: () => uni.showToast({ title: '官网链接已复制', icon: 'none' })
  });
  // #endif
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
  padding: 0;
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
  gap: 4px;
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
  letter-spacing: -0.3px;
}

.city-indicator-chip {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 2px 8px;
  border-radius: 6px;
}

.city-indicator-txt {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

.page-sub-title {
  font-size: 12.5px;
  color: #64748b;
}

/* 顶部子模式切换胶囊 */
.subtab-switch-dock {
  display: flex;
  align-items: center;
  background: #e2e8f0;
  padding: 3px;
  border-radius: 10px;
  gap: 3px;
}

.switch-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.switch-pill.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.pill-svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}

/* 下拉选择栏 */
.toolbar-pickers-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.picker-anchor {
  position: relative;
  min-width: 140px;
}

.cyber-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.cyber-dropdown-trigger.open {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.select-val {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.select-arrow {
  font-size: 11px;
  color: #64748b;
  margin-left: 6px;
  transition: transform 0.2s ease;
}

.select-arrow.rotated {
  transform: rotate(180deg);
}

.cyber-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  max-height: 260px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 99;
  padding: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12.5px;
  color: #334155;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item.selected {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.check-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
}

/* 卡片基础体系 */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-head-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.segment-switch-sm {
  display: flex;
  background: #f1f5f9;
  padding: 2px;
  border-radius: 6px;
  gap: 2px;
}

.segment-switch-sm .switch-pill {
  padding: 4px 10px;
  font-size: 11.5px;
  border-radius: 5px;
}

/* 4大折算比例网格 */
.ratio-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.ratio-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ratio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.ratio-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ratio-tag {
  font-size: 10.5px;
  font-weight: 700;
}

.ratio-seq {
  font-size: 11px;
  font-weight: 800;
  color: #cbd5e1;
}

.r-label {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.r-num-row {
  margin-bottom: 6px;
}

.r-val {
  font-size: 26px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.r-sub {
  font-size: 11px;
  color: #64748b;
  line-height: 1.35;
}

.border-emerald { border-color: rgba(16, 185, 129, 0.3); background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 60%); }
.border-cyan { border-color: rgba(6, 182, 212, 0.3); background: linear-gradient(180deg, #ecfeff 0%, #ffffff 60%); }
.border-amber { border-color: rgba(245, 158, 11, 0.3); background: linear-gradient(180deg, #fffbeb 0%, #ffffff 60%); }
.border-rose { border-color: rgba(244, 63, 94, 0.3); background: linear-gradient(180deg, #fff1f2 0%, #ffffff 60%); }

.text-emerald { color: #059669; }
.text-cyan { color: #0891b2; }
.text-amber { color: #d97706; }
.text-rose { color: #e11d48; }

/* 双列信息网格 */
.dual-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.info-head {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
  display: block;
}

.chip-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.info-chip {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.memo-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.memo-item {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.memo-dot {
  color: #2563eb;
  font-weight: 700;
}

.memo-txt {
  font-size: 11.5px;
  color: #475569;
  line-height: 1.4;
}

/* 流程图与法则 */
.bottom-dual-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 16px;
}

.step-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.step-info {
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.4;
}

.rule-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.rule-seq-tag {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.rule-headline {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  display: block;
}

.rule-paragraph {
  font-size: 11.5px;
  color: #475569;
  line-height: 1.45;
  display: block;
}

/* 热线网格 */
.hotline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.hotline-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.hotline-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hotline-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.city-name-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.city-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.city-code-tag {
  font-size: 10px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.update-chip {
  font-size: 10px;
  color: #94a3b8;
}

.phone-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.phone-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  padding: 6px 10px;
  border-radius: 8px;
}

.phone-item-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.phone-tag-badge {
  font-size: 10px;
  color: #64748b;
}

.phone-number-txt {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  font-family: monospace;
}

.btn-micro-dial {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.micro-dial-txt {
  font-size: 11px;
  font-weight: 600;
}

.hotline-card-foot {
  border-top: 1px dashed #f1f5f9;
  padding-top: 10px;
}

.action-btn.btn-portal {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.btn-portal:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
}

.notice-text-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notice-p {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

.badge-pill.badge-cyan {
  background: #ecfeff;
  border: 1px solid #a5f3fc;
  color: #0891b2;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.mb-16 { margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.mt-20 { margin-top: 20px; }

/* 悬浮置顶按钮 */
.fab-back-top {
  position: fixed;
  right: 24px;
  bottom: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fab-back-top.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.fab-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
}

.fab-txt {
  font-size: 9px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1;
  margin-top: 1px;
}

/* 政策纠错引导卡片 */
.correction-guide-card {
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 16px;
}

.correction-guide-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.08);
}

.guide-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.guide-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #93c5fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-svg {
  width: 20px;
  height: 20px;
  stroke: #2563eb;
}

.guide-text-stack {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.guide-main-txt {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.guide-sub-txt {
  font-size: 12px;
  color: #475569;
}

.guide-btn {
  padding: 8px 14px;
  background: #2563eb;
  border-radius: 8px;
  flex-shrink: 0;
}

.guide-btn-txt {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

/* 响应式移动端适配 */
@media (max-width: 768px) {
  .correction-guide-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .guide-btn {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .content-box {
    padding: 12px 14px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .page-intro-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 14px;
  }

  .subtab-switch-dock {
    width: 100%;
    justify-content: space-between;
  }

  .subtab-switch-dock .switch-pill {
    flex: 1;
    justify-content: center;
  }

  .ratio-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .dual-info-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .bottom-dual-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .hotline-grid {
    grid-template-columns: 1fr;
  }

  .toolbar-pickers-row {
    width: 100%;
  }

  .picker-anchor {
    flex: 1;
  }
}
</style>
