<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中) -->
    <AppHeader currentTab="service" />

    <view class="content-box">
      <!-- 页面顶部品牌与功能栏 (取消二级Tab，单页自然流转) -->
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
                  <text class="city-indicator-txt">参保地: {{ currentCityOption.cityName }} ({{ currentProvince.name }})</text>
                </view>
              </view>
              <text class="page-sub-title">全国 348 统筹区异地就医直接结算指南、12393 咨询热线与医保政务网入口一站式通达</text>
            </view>
          </view>
        </view>

        <!-- 地区快速切换下拉框 (直接控制全页参保地与热线) -->
        <view class="toolbar-pickers-row">
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
      </view>

      <!-- ============================================================ -->
      <!-- 板块一：异地就医结算指南                                      -->
      <!-- ============================================================ -->
      <view class="card">
        <view class="card-head">
          <view class="head-left">
            <view class="section-badge-dot dot-blue"></view>
            <text class="card-head-title">{{ currentCity.cityName }} · 异地就医报销折算标准</text>
            <view class="city-benchmark-badge">
              <text class="benchmark-txt">{{ currentType === 'employee' ? '职工三级基准' : '居民三级基准' }}: {{ Math.round(baseTier3Ratio * 100) }}% · {{ baseAnnualCapText }}</text>
            </view>
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
              <text class="r-val text-emerald">{{ actualLongTermRatio }}%</text>
              <text class="r-coef-tag">折算系数 {{ Math.round(remotePolicy.longTermFiledRatio * 100) }}%</text>
            </view>
            <text class="r-sub">已规范备案，按参保地同等报销比例享受待遇</text>
          </view>

          <!-- 02 规范转诊 -->
          <view class="ratio-card border-cyan">
            <view class="ratio-top">
              <text class="ratio-tag text-cyan">规范转诊</text>
              <text class="ratio-seq">02</text>
            </view>
            <text class="r-label">按规定转诊转院</text>
            <view class="r-num-row">
              <text class="r-val text-cyan">{{ actualTransferRatio }}%</text>
              <text class="r-coef-tag">折算系数 {{ Math.round(remotePolicy.transferFiledRatio * 100) }}%</text>
            </view>
            <text class="r-sub">定点医疗机构开具转诊证明并备案，统筹支付略有下浮</text>
          </view>

          <!-- 03 异地急诊 -->
          <view class="ratio-card border-amber">
            <view class="ratio-top">
              <text class="ratio-tag text-amber">突发抢救</text>
              <text class="ratio-seq">03</text>
            </view>
            <text class="r-label">异地急诊抢救</text>
            <view class="r-num-row">
              <text class="r-val text-amber">{{ actualEmergencyRatio }}%</text>
              <text class="r-coef-tag">折算系数 {{ Math.round(remotePolicy.unfiledEmergencyRatio * 100) }}%</text>
            </view>
            <text class="r-sub">急诊抢救留观病历符合条件视同转诊待遇结算</text>
          </view>

          <!-- 04 自行就医 -->
          <view class="ratio-card border-rose">
            <view class="ratio-top">
              <text class="ratio-tag text-rose">未备案降点</text>
              <text class="ratio-seq">04</text>
            </view>
            <text class="r-label">自行就医 (未备案)</text>
            <view class="r-num-row">
              <text class="r-val text-rose">{{ actualUnfiledRatio }}%</text>
              <text class="r-coef-tag">折算系数 {{ Math.round(remotePolicy.unfiledNormalRatio * 100) }}%</text>
            </view>
            <text class="r-sub">未办理转诊备案自行前往外地，执行惩罚性降点结算</text>
          </view>
        </view>
      </view>

      <!-- 异地就医双栏指引：4步流程 & 2大核心法则 -->
      <view class="dual-info-grid mt-20">
        <view class="card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">手机极速自助备案 4 步流程</text>
            </view>
          </view>

          <view class="steps-flow">
            <view class="step-item">
              <view class="step-num">1</view>
              <view class="step-content">
                <text class="step-title">登录官方备案平台</text>
                <text class="step-desc">微信搜索“国家异地就医备案”小程序，或登录“国家医保服务平台”App，亦可直接使用参保省市地方政务医保小程序。</text>
              </view>
            </view>

            <view class="step-item">
              <view class="step-num">2</view>
              <view class="step-content">
                <text class="step-title">选定人员类型与就医省市</text>
                <text class="step-desc">长期居住人员凭居住证承诺享受参保地同等报销比例；临时就医因病情转院治疗按转诊比例执行。</text>
              </view>
            </view>

            <view class="step-item">
              <view class="step-num">3</view>
              <view class="step-content">
                <text class="step-title">在线提交并即时开通生效</text>
                <text class="step-desc">全国绝大多数统筹区临时外出就医支持“自助开通，即时生效”；可在“备案记录”中实时查看回执。</text>
              </view>
            </view>

            <view class="step-item">
              <view class="step-num">4</view>
              <view class="step-content">
                <text class="step-title">出院出示医保码直接联网结算</text>
                <text class="step-desc">出院缴费时主动出示国家医保电子凭证或全国社保卡，统筹基金直接扣减，仅需支付自费自理部分。</text>
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

      <!-- ============================================================ -->
      <!-- 板块二：医保热线与官网服务入口 (直接无缝在下方展示，顺畅下翻) -->
      <!-- ============================================================ -->
      <view class="section-title-bar mt-24">
        <view class="section-title-left">
          <view class="section-badge-dot dot-emerald"></view>
          <text class="section-title-txt">{{ currentProvince.name }} 医保公共服务热线与政务网</text>
        </view>
        <view class="badge-pill badge-cyan">
          <text class="badge-txt">全省 {{ provinceCityHotlines.length }} 个统筹区直达</text>
        </view>
      </view>

      <!-- 当前选定统筹区专席卡片 (高亮置顶展示) -->
      <view class="card current-city-hotline-card mt-12" v-if="currentCityHotline">
        <view class="c-card-head">
          <view class="c-head-left">
            <text class="c-target-chip">当前选定统筹区</text>
            <text class="c-city-title">{{ currentCityHotline.cityName }}</text>
            <text class="city-code-tag">{{ currentCityHotline.cityCode }}</text>
          </view>
          <text class="update-chip" v-if="currentCityHotline.lastUpdated">官方核验: {{ currentCityHotline.lastUpdated }}</text>
        </view>

        <view class="c-card-body">
          <view class="c-phones-row">
            <view class="phone-item-row" v-for="(p, pIdx) in currentCityHotline.phoneList" :key="pIdx">
              <view class="phone-item-left">
                <text class="phone-tag-badge">{{ p.label }}</text>
                <text class="phone-number-txt">{{ p.display }}</text>
              </view>
              <view class="btn-micro-dial" @click="callPhone(p.cleanTel)">
                <text class="micro-dial-txt">拨打 ↗</text>
              </view>
            </view>
          </view>

          <view class="c-action-wrap" v-if="currentCityHotline.officialPortalUrl">
            <view class="action-btn btn-portal-primary" @click="openPortal(currentCityHotline.officialPortalUrl)">
              <text class="btn-label">进入{{ currentCityHotline.cityName }}医保政务网 ↗</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 全省各统筹区热线与官网网格 (下翻着看) -->
      <view class="card mt-16">
        <view class="card-head">
          <view class="head-left">
            <text class="card-head-title">{{ currentProvince.name }} 全部统筹区热线与官网名录 (向下翻阅)</text>
          </view>
        </view>

        <view class="hotline-grid">
          <view 
            class="hotline-card" 
            v-for="item in provinceCityHotlines" 
            :key="item.cityCode"
            :class="{ 'is-current-city': item.cityCode === currentCityOption.cityCode }"
          >
            <view class="hotline-card-top">
              <view class="city-name-wrap">
                <text class="city-name">{{ item.cityName }}</text>
                <text class="city-code-tag">{{ item.cityCode }}</text>
                <text class="current-tag" v-if="item.cityCode === currentCityOption.cityCode">当前选定</text>
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

      <!-- 全国 12393 专线统一规范 -->
      <view class="card mt-16">
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

      <!-- ============================================================ -->
      <!-- 板块三：政策纠错直通卡片                                      -->
      <!-- ============================================================ -->
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
            <text class="guide-sub-txt">进入【政策纠错中心】，快速提交修改建议与官方发文，智库将核验入库</text>
          </view>
        </view>
        <view class="guide-btn">
          <text class="guide-btn-txt">前往政策纠错 ↗</text>
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
import { onPageScroll } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import { provinceList, getCitiesByProvinceCode, getCityData } from '../../data/provinces';
import { getCityDataByCode, allCities } from '../../data';

function goToCorrection() {
  uni.switchTab({ url: '/pages/correction/index' });
}

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
const currentCity = computed(() => {
  return getCityData(currentCityOption.value.cityCode) || allCities[0];
});

const currentPackage = computed(() => {
  const c = currentCity.value;
  return currentType.value === 'employee' ? c.employee : c.resident;
});

const remotePolicy = computed(() => {
  return currentPackage.value?.remoteMedical || {
    sourceDocId: '',
    filingChannels: [],
    longTermFiledRatio: 1.0,
    transferFiledRatio: 0.9,
    unfiledEmergencyRatio: 0.9,
    unfiledNormalRatio: 0.7,
    specialNotes: []
  };
});

// 本地参保地基准三级医院报销比例与封顶线
const baseTier3Ratio = computed(() => {
  const pkg = currentPackage.value;
  return pkg?.inpatient?.tierBenefits?.tier3?.reimbursementRatio || (currentType.value === 'employee' ? 0.85 : 0.65);
});

const baseAnnualCapText = computed(() => {
  const pkg = currentPackage.value;
  const cap = pkg?.inpatient?.annualCap;
  if (!cap) return '不设统筹限额';
  return '封顶 ¥' + Math.round(cap / 10000) + '万';
});

// 折算后的四种实际参考报销比例
const actualLongTermRatio = computed(() => {
  return Math.round(baseTier3Ratio.value * remotePolicy.value.longTermFiledRatio * 100);
});

const actualTransferRatio = computed(() => {
  return Math.round(baseTier3Ratio.value * remotePolicy.value.transferFiledRatio * 100);
});

const actualEmergencyRatio = computed(() => {
  return Math.round(baseTier3Ratio.value * remotePolicy.value.unfiledEmergencyRatio * 100);
});

const actualUnfiledRatio = computed(() => {
  return Math.round(baseTier3Ratio.value * remotePolicy.value.unfiledNormalRatio * 100);
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

// 当前省份所有统筹区热线
const provinceCityHotlines = computed<CityHotlineDisplay[]>(() => {
  const cities = cityOptions.value;
  return cities.map(c => {
    const fullData = getCityDataByCode(c.cityCode);
    const rawHotline = fullData ? fullData.hotline : '12393';
    return {
      cityCode: c.cityCode,
      cityName: c.cityName,
      officialPortalUrl: fullData?.officialPortalUrl,
      lastUpdated: fullData?.lastUpdated,
      phoneList: parseHotlines(rawHotline, c.cityName)
    };
  });
});

// 当前所选统筹区专属热线
const currentCityHotline = computed<CityHotlineDisplay | undefined>(() => {
  return provinceCityHotlines.value.find(h => h.cityCode === currentCityOption.value.cityCode) || provinceCityHotlines.value[0];
});

function callPhone(tel: string) {
  if (!tel) return;
  uni.makePhoneCall({
    phoneNumber: tel,
    fail: () => {
      uni.showToast({ title: `请拨打: ${tel}`, icon: 'none' });
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

onMounted(() => {
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
});
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
  gap: 3px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-main-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
  line-height: 1.25;
}

.city-indicator-chip {
  padding: 2px 8px;
  border-radius: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.city-indicator-txt {
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
}

.page-sub-title {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.toolbar-pickers-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.picker-anchor {
  position: relative;
}

.cyber-dropdown-trigger {
  height: 38px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.cyber-dropdown-trigger:hover, .cyber-dropdown-trigger.open {
  border-color: #2563eb;
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
  min-width: 140px;
  max-height: 240px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
  padding: 4px;
}

.dropdown-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown-item:hover { background: #f1f5f9; }
.dropdown-item.selected { background: #eff6ff; color: #2563eb; font-weight: 700; }
.item-name { font-size: 13px; }
.check-svg { width: 14px; height: 14px; stroke: #2563eb; }

/* 通用卡片与版块 */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.mt-20 { margin-top: 20px; }
.mt-24 { margin-top: 24px; }

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

.section-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-blue { background: #2563eb; }
.dot-emerald { background: #10b981; }

.card-head-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
  line-height: 1.3;
}

.city-benchmark-badge {
  padding: 2px 8px;
  border-radius: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: inline-flex;
  align-items: center;
}

.benchmark-txt {
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
}

.segment-switch-sm {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

.switch-pill {
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-pill.active {
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pill-txt {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.switch-pill.active .pill-txt {
  color: #2563eb;
  font-weight: 700;
}

/* 4大比例色卡 */
.ratio-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.ratio-card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.border-emerald { border-color: #a7f3d0; background: #f0fdf4; }
.border-cyan { border-color: #a5f3fc; background: #ecfeff; }
.border-amber { border-color: #fde68a; background: #fffbeb; }
.border-rose { border-color: #fecdd3; background: #fff1f2; }

.ratio-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ratio-tag {
  font-size: 11px;
  font-weight: 700;
}

.ratio-seq {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
}

.r-label {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.r-num-row {
  display: flex;
  align-items: baseline;
  margin: 2px 0;
}

.r-val {
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.r-coef-tag {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: rgba(0, 0, 0, 0.05);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.text-emerald { color: #059669; }
.text-cyan { color: #0891b2; }
.text-amber { color: #d97706; }
.text-rose { color: #e11d48; }

.r-sub {
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.45;
}

/* 双栏指引流程 */
.dual-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.steps-flow {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-num {
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

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.step-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.rule-card {
  padding: 12px 14px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-seq-tag {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.rule-headline {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.rule-paragraph {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

/* 热线板块标题 */
.section-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.section-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title-txt {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.badge-pill {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.badge-cyan { background: #ecfeff; border: 1px solid #a5f3fc; color: #0e7490; }
.badge-txt { font-size: 11px; font-weight: 600; }

/* 当前统筹区高亮专属卡片 */
.current-city-hotline-card {
  background: #f0fdfa;
  border: 1px solid #99f6e4;
}

.c-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #ccfbf1;
  margin-bottom: 14px;
}

.c-head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.c-target-chip {
  padding: 2px 6px;
  background: #0d9488;
  color: #ffffff;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.c-city-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.c-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.c-phones-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-portal-primary {
  background: #0d9488;
  color: #ffffff;
}

.btn-portal-primary .btn-label {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

/* 全省热线网格 */
.hotline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.hotline-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
}

.hotline-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
}

.hotline-card.is-current-city {
  border-color: #2dd4bf;
  background: #f0fdfa;
}

.hotline-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
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
  line-height: 1.2;
}

.city-code-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 0 5px;
  height: 18px;
  border-radius: 4px;
  line-height: 1;
  box-sizing: border-box;
}

.current-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #0d9488;
  background: #ccfbf1;
  padding: 0 5px;
  height: 18px;
  border-radius: 4px;
  line-height: 1;
  box-sizing: border-box;
}

.update-chip {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1;
}

.phone-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.phone-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 38px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.phone-item-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.phone-tag-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 0 6px;
  height: 20px;
  border-radius: 4px;
  line-height: 1;
  box-sizing: border-box;
}

.phone-number-txt {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.btn-micro-dial {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  cursor: pointer;
  box-sizing: border-box;
}

.micro-dial-txt {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1;
}

.hotline-card-foot {
  margin-top: auto;
  padding-top: 4px;
}

.btn-portal {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  height: 32px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-portal .btn-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  line-height: 1;
}

.btn-portal:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

/* 拨打规范 */
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
  font-size: 13.5px;
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

/* 悬浮置顶 */
.fab-back-top {
  position: fixed;
  right: 24px;
  bottom: calc(40px + env(safe-area-inset-bottom));
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #bfdbfe;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.fab-back-top.show {
  opacity: 1;
  pointer-events: auto;
}

.fab-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
}

.fab-txt {
  font-size: 10px;
  font-weight: 700;
  color: #2563eb;
  line-height: 1;
  margin-top: 1px;
}

/* 响应式移动端适配 */
@media (max-width: 860px) {
  .content-box {
    padding: 12px 14px calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .page-intro-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 14px;
  }

  .page-main-title {
    font-size: 19px;
    white-space: nowrap;
  }

  .card-head-title,
  .section-title-txt,
  .c-city-title {
    font-size: 15px;
  }

  .title-row {
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .city-indicator-chip {
    white-space: nowrap;
  }

  .toolbar-pickers-row {
    width: 100%;
  }

  .picker-anchor {
    flex: 1;
  }

  /* 险种切换与折算基准在移动端优雅两行展开，告别挤压成竖排文字 */
  .card-head {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .head-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .segment-switch-sm {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    box-sizing: border-box;
  }

  .segment-switch-sm .switch-pill {
    justify-content: center;
    padding: 6px 0;
    text-align: center;
  }

  .ratio-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .ratio-card {
    padding: 12px;
  }

  .r-num-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin: 4px 0;
  }

  .r-coef-tag {
    margin-left: 0;
    white-space: nowrap;
  }

  .dual-info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .hotline-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .c-card-body {
    flex-direction: column;
    align-items: stretch;
  }

  .c-action-wrap .btn-portal-primary {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

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
}
</style>
