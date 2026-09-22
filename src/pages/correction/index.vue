<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中) -->
    <AppHeader currentTab="correction" />

    <view class="content-box">
      <!-- 页面简明标题与简介 (清新大方，低心智负担) -->
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
                <text class="page-main-title">医保政策纠错与公文提报</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">开源协同维护</text>
                </view>
              </view>
              <text class="page-sub-title">发现参保地公开政策变动、报销比例出入或有最新公文补充？欢迎提交，我们将在核实后及时更新本地数据。</text>
            </view>
          </view>
        </view>

        <view class="audit-status-badge">
          <view class="status-pulse-dot"></view>
          <text class="audit-status-txt">已收录 348 统筹区开放核对</text>
        </view>
      </view>

      <!-- 双栏布局：左侧简洁直接表单，右侧最新采纳动态 -->
      <view class="correction-main-grid">
        <!-- 左侧：极简纠错工作台 (单卡片一体化流程) -->
        <view class="form-card">
          <view class="card-head">
            <view class="head-left">
              <text class="card-head-title">提交政策纠错与建议</text>
            </view>
            <text class="head-tip">带 * 为关键项，公文依据越详实入库越快</text>
          </view>

          <!-- 第 1 部分：统筹区与险种选择 -->
          <view class="form-section">
            <text class="section-label">1. 选择所属统筹区与险种</text>
            <view class="region-row">
              <view class="region-selectors-grid">
                <!-- 省份选择 -->
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

                <!-- 城市选择 -->
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

              <!-- 险种胶囊切换 -->
              <view class="type-capsule-group">
                <view 
                  class="type-capsule-btn" 
                  :class="{ active: currentInsuranceType === 'employee' }"
                  @click="currentInsuranceType = 'employee'"
                >
                  <text class="type-btn-txt">职工医保</text>
                </view>
                <view 
                  class="type-capsule-btn" 
                  :class="{ active: currentInsuranceType === 'resident' }"
                  @click="currentInsuranceType = 'resident'"
                >
                  <text class="type-btn-txt">居民医保</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 第 2 部分：纠错类别胶囊选择 -->
          <view class="form-section mt-16">
            <text class="section-label">2. 拟纠错板块</text>
            <view class="category-pills-row">
              <view 
                class="cat-pill" 
                v-for="cat in categoryList" 
                :key="cat.id"
                :class="{ active: currentCategory === cat.id }"
                @click="selectCategory(cat.id)"
              >
                <text class="cat-pill-txt">{{ cat.name }}</text>
              </view>
            </view>
          </view>

          <!-- 智能现行参数轻提示 (自动根据城市+分类调取，一行清爽展示) -->
          <view class="live-param-banner mt-12">
            <view class="live-banner-left">
              <text class="live-bulb">💡</text>
              <text class="live-banner-txt"><text class="font-bold">{{ currentCityOption.cityName }} · {{ currentCategoryObj.name }}</text> 库内现行数据：{{ liveBenchmarkText }}</text>
            </view>
          </view>

          <!-- 第 3 部分：纠错项与修改建议 -->
          <view class="form-section mt-16">
            <text class="section-label">3. 修正建议 <text class="required-star">*</text></text>
            <view class="suggest-input-row">
              <!-- 快捷字段选择 -->
              <view class="field-picker-wrap">
                <view class="field-trigger" @click.stop="toggleDropdown('field')">
                  <text class="field-val">{{ currentFieldObj.label }}</text>
                  <text class="select-arrow" :class="{ rotated: openDropdown === 'field' }">▾</text>
                </view>
                <view class="cyber-dropdown-menu" v-if="openDropdown === 'field'" @click.stop>
                  <view 
                    class="dropdown-item" 
                    v-for="f in currentFieldList" 
                    :key="f.id"
                    :class="{ selected: currentFieldId === f.id }"
                    @click.stop="selectField(f.id)"
                  >
                    <text class="item-name">{{ f.label }}</text>
                    <text class="item-check" v-if="currentFieldId === f.id">✓</text>
                  </view>
                </view>
              </view>

              <!-- 建议修改值输入 -->
              <view class="suggest-value-box">
                <input 
                  class="cyber-clean-input" 
                  v-model="suggestedValue" 
                  :placeholder="'建议值 (现行: ' + currentFieldValue + ')'"
                  placeholder-class="placeholder-dim"
                />
                <text class="unit-text" v-if="currentFieldObj.unit">{{ currentFieldObj.unit }}</text>
              </view>
            </view>

            <!-- 极简差异微提示 (仅在有输入时轻量显示) -->
            <view class="diff-chip-hint mt-8" v-if="diffHintText">
              <text class="diff-hint-txt">{{ diffHintText }}</text>
            </view>
          </view>

          <!-- 第 4 部分：官方依据与说明 (合并简明输入) -->
          <view class="form-section mt-16">
            <text class="section-label">4. 官方依据文件与说明</text>
            <view class="doc-input-stack">
              <view class="input-with-badge">
                <input 
                  class="cyber-clean-input full-width" 
                  v-model="docTitleOrNumber" 
                  placeholder="发文全称或发文字号 (如：成医保发〔2024〕3号 或 当地医保局通知)"
                  placeholder-class="placeholder-dim"
                />
                <text class="mini-verified-badge" v-if="isDocStandard">✓ 格式规范</text>
              </view>

              <view class="input-with-badge">
                <input 
                  class="cyber-clean-input full-width" 
                  v-model="docUrl" 
                  placeholder="发文官方链接 (如政府网/医保局官网链接，选填)"
                  placeholder-class="placeholder-dim"
                />
                <text class="mini-gov-badge" v-if="isGovUrl">✓ 官方政务网</text>
              </view>

              <textarea 
                class="cyber-clean-textarea" 
                v-model="reasonQuote" 
                placeholder="补充说明或条款原文 (选填，例如：根据新政通知，自2025年起住院起付线下调至800元...)"
                placeholder-class="placeholder-dim"
              ></textarea>
            </view>
          </view>

          <!-- 第 5 部分：联系人与提交 -->
          <view class="form-section mt-16">
            <view class="submit-row">
              <input 
                class="cyber-clean-input contact-input" 
                v-model="submitterContact" 
                placeholder="您的称呼或联系方式 (选填，核验后通知)"
                placeholder-class="placeholder-dim"
              />
              <view class="btn-clean-submit" @click="handleSubmitCorrection">
                <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <text class="btn-submit-txt">提交政策纠错</text>
              </view>
            </view>

            <view class="submit-note-hint mt-8">
              <text class="hint-text">💡 填写并提交后将自动生成标准化 Issue 草稿，支持一键投递至 GitHub 或唤起邮件直接发送作者团队。</text>
            </view>
          </view>

          <!-- 提交成功与直连投递选择面板 -->
          <view class="submission-success-bar mt-16" v-if="lastSubmittedId">
            <view class="success-left">
              <text class="success-icon">✓</text>
              <view class="success-txts">
                <text class="success-title">纠错内容已就绪！核验编号：{{ lastSubmittedId }}</text>
                <text class="success-sub">本工具为民间公益开源项目，为确保您的宝贵建议能被作者及时核实并入库更新，请选择下方通道一键投递：</text>
              </view>
            </view>

            <view class="dispatch-channels-grid mt-12">
              <view class="dispatch-btn btn-github" @click="dispatchToGithub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dispatch-svg">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <view class="d-txts">
                  <text class="d-primary">在 GitHub 提交 Issue (推荐)</text>
                  <text class="d-sub">公开透明 · 永久留存 · GitHub 官方自动邮件提醒作者</text>
                </view>
                <text class="d-arrow">↗</text>
              </view>

              <view class="dispatch-btn btn-email" @click="dispatchToEmail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dispatch-svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <view class="d-txts">
                  <text class="d-primary">一键调起邮件发送作者</text>
                  <text class="d-sub">直发 keepkid0824@gmail.com · 自动预填标题与公文参数</text>
                </view>
                <text class="d-arrow">✉️</text>
              </view>

              <view class="dispatch-btn btn-wechat" @click="copyDirect(SITE_CONFIG.wechat, '微信号')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dispatch-svg">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <view class="d-txts">
                  <text class="d-primary">复制作者个人微信</text>
                  <text class="d-sub">微信号: {{ SITE_CONFIG.wechat }} · 支持发送公文原件截图与交流</text>
                </view>
                <text class="d-arrow">📋</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 右侧：近期采纳与透明动态 (紧凑对称设计，高度与左侧表单完美平齐) -->
        <view class="sidebar-column">
          <!-- 我的在审记录 (如果有) -->
          <view class="card mb-12" v-if="myRecords.length > 0">
            <view class="card-head">
              <view class="head-left">
                <text class="card-head-title">我的纠错记录</text>
              </view>
              <text class="head-chip">{{ myRecords.length }} 项待核</text>
            </view>
            <view class="my-rec-list">
              <view class="my-rec-item" v-for="rec in myRecords" :key="rec.id">
                <view class="my-rec-top">
                  <text class="my-rec-city">{{ rec.cityName }} · {{ rec.fieldName }}</text>
                  <text class="my-rec-status">已登记</text>
                </view>
                <text class="my-rec-diff">建议：{{ rec.suggestedValue }}</text>
                <text class="my-rec-id">编号: {{ rec.id }}</text>
              </view>
            </view>
          </view>

          <!-- 近期已采纳动态卡片 (带内滚动，高度与左侧表单平齐) -->
          <view class="card dynamic-scroll-card">
            <view class="card-head">
              <view class="head-left">
                <svg class="head-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 14 14"></polyline>
                </svg>
                <text class="card-head-title">近期公开采纳与更新动态</text>
              </view>
              <text class="head-chip-emerald">穿透核准发布</text>
            </view>

            <view class="dynamic-summary-bar">
              <text class="summary-badge">🛡️ 全域台账</text>
              <text class="summary-txt">已合入 150+ 项公文纠偏 · {{ SITE_CONFIG.totalAssertions }} 项断言守护</text>
            </view>

            <view class="recent-scroll-body">
              <view class="recent-item" v-for="item in displayedUpdates" :key="item.id">
                <view class="recent-item-top">
                  <view class="recent-city-tag">
                    <text class="r-city">{{ item.city }}</text>
                    <text class="r-tag">{{ item.type }}</text>
                  </view>
                  <text class="r-date">{{ item.date }}</text>
                </view>
                <text class="recent-desc">{{ item.desc }}</text>
                <text class="recent-doc">依据：{{ item.doc }} · <text class="text-emerald">已合入本地库</text></text>
              </view>
            </view>

            <view class="expand-more-wrap" v-if="CORRECTION_UPDATES_LOG.length > 5">
              <button class="expand-more-btn" @click="toggleShowAllUpdates">
                {{ showAllUpdates ? '收起部分动态' : `查看更多官方更新记录 (共 ${CORRECTION_UPDATES_LOG.length} 条) ↓` }}
              </button>
            </view>
          </view>

          <!-- 紧凑联系作者轻量条 -->
          <view class="contact-compact-bar mt-12">
            <view class="compact-bar-head">
              <text class="compact-bar-title">📮 公文直投 / 联系作者团队</text>
            </view>
            <view class="compact-pills-row">
              <view class="compact-pill-btn" @click="copyDirect(SITE_CONFIG.email, '邮箱')">
                <text class="pill-k">邮箱</text>
                <text class="pill-v monospace">{{ SITE_CONFIG.email }}</text>
                <text class="pill-act">复制</text>
              </view>
              <view class="compact-pill-btn" @click="copyDirect(SITE_CONFIG.wechat, '微信号')">
                <text class="pill-k">微信</text>
                <text class="pill-v">{{ SITE_CONFIG.wechat }}</text>
                <text class="pill-act">复制</text>
              </view>
              <view class="compact-pill-btn" @click="copyDirect(SITE_CONFIG.officialAccount, '公众号名称')">
                <text class="pill-k">公众号</text>
                <text class="pill-v">{{ SITE_CONFIG.officialAccount }}</text>
                <text class="pill-act">复制</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部通栏横向流程看板：纠错机制如何闭环？信息去哪了？ -->
      <view class="card pipeline-fullwidth-card mt-16">
        <view class="card-head">
          <view class="head-left">
            <svg class="head-svg text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <text class="card-head-title">纠错机制如何透明闭环？信息去哪了？</text>
          </view>
          <text class="head-chip-cyan">透明开源流转 · 零成本运营</text>
        </view>

        <!-- 横向 5 步专业流程步骤条 -->
        <view class="stepper-horizontal-grid">
          <view class="step-card-box">
            <view class="step-head-row">
              <text class="step-badge">1</text>
              <text class="step-name">提交工单草稿</text>
            </view>
            <text class="step-detail">系统自动生成带统筹区与公文溯源的标准化 GitHub Issue 或直投邮件。</text>
          </view>

          <view class="step-arrow-divider">➔</view>

          <view class="step-card-box">
            <view class="step-head-row">
              <text class="step-badge">2</text>
              <text class="step-name">秒级邮件提醒</text>
            </view>
            <text class="step-detail">Issue 秒级推送至作者邮箱（{{ SITE_CONFIG.email }}），手机即时收到通知。</text>
          </view>

          <view class="step-arrow-divider">➔</view>

          <view class="step-card-box">
            <view class="step-head-row">
              <text class="step-badge">3</text>
              <text class="step-name">本地公文核对</text>
            </view>
            <text class="step-detail">作者运行 <text class="cmd-code">npm run feedback:list</text> 调取工单，穿透公文条款修订数据。</text>
          </view>

          <view class="step-arrow-divider">➔</view>

          <view class="step-card-box">
            <view class="step-head-row">
              <text class="step-badge">4</text>
              <text class="step-name">{{ SITE_CONFIG.totalAssertions }}项全通质检</text>
            </view>
            <text class="step-detail">运行 <text class="cmd-code">npm run test:calc</text>，全量覆盖 348 统筹区全通断言，杜绝误改与偶发逻辑冲突。</text>
          </view>

          <view class="step-arrow-divider">➔</view>

          <view class="step-card-box">
            <view class="step-head-row">
              <text class="step-badge">5</text>
              <text class="step-name">自动部署与反馈</text>
            </view>
            <text class="step-detail">代码 push 后 GitHub Actions 自动构建发布；并在 Issue 回复关闭，提交者自动获知生效。</text>
          </view>
        </view>

        <view class="patrol-notice-mini mt-10">
          <text class="patrol-icon">🛡️</text>
          <text class="patrol-txt">云端长效自动巡查：配置 GitHub Actions 定期 Cron 工作流，每周一自动核验全国 348 统筹区规则与官网连通性，全周期守卫政策真实性。</text>
        </view>
      </view>
    </view>

    <!-- 全站通用规范页脚 -->
    <AppFooter />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import AppFooter from '../../components/AppFooter.vue';
import { SITE_CONFIG } from '../../config/site';
import { provinceList, getCitiesByProvinceCode, getCityData } from '../../data/provinces';
import type { CityInsuranceData } from '../../data/types';
import { CORRECTION_UPDATES_LOG } from '../../data/correctionUpdates';

// 下拉菜单控制
const openDropdown = ref<string | null>(null);
function closeAllDropdowns() { openDropdown.value = null; }
function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

// 省市与险种
const selectedProvinceIndex = ref(0);
const selectedCityIndex = ref(0);
const currentInsuranceType = ref<'employee' | 'resident'>('employee');

const currentProvince = computed(() => provinceList[selectedProvinceIndex.value] || provinceList[0]);
const cityOptions = computed(() => getCitiesByProvinceCode(currentProvince.value.code));
const currentCityOption = computed(() => cityOptions.value[selectedCityIndex.value] || cityOptions.value[0]);
const currentCityData = computed<CityInsuranceData>(() => getCityData(currentCityOption.value.cityCode));

function selectProvince(idx: number) {
  selectedProvinceIndex.value = idx;
  selectedCityIndex.value = 0;
  openDropdown.value = null;
}

function selectCity(idx: number) {
  selectedCityIndex.value = idx;
  openDropdown.value = null;
}

function copyDirect(text: string, label: string) {
  if (typeof uni !== 'undefined' && uni.setClipboardData) {
    uni.setClipboardData({
      data: text,
      showToast: false,
      success: () => {
        uni.showToast({ title: `${label}已复制`, icon: 'success' });
      },
      fail: () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(text);
          uni.showToast({ title: `${label}已复制`, icon: 'success' });
        }
      }
    });
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    uni.showToast({ title: `${label}已复制`, icon: 'success' });
  }
}

// 纠错板块分类 (轻巧5大类)
const currentCategory = ref('inpatient');
const categoryList = [
  { id: 'inpatient', name: '住院待遇' },
  { id: 'outpatient', name: '门诊共济' },
  { id: 'catastrophic', name: '大病保险' },
  { id: 'remote', name: '异地就医' },
  { id: 'doc_other', name: '官方公文/其他' }
];

function selectCategory(id: string) {
  currentCategory.value = id;
  const fields = fieldOptionsMap[id] || [];
  if (fields.length > 0) {
    currentFieldId.value = fields[0].id;
  }
}

const currentCategoryObj = computed(() => {
  return categoryList.find(c => c.id === currentCategory.value) || categoryList[0];
});

// 字段映射与现行数据
interface FieldDef {
  id: string;
  label: string;
  unit: string;
}

const fieldOptionsMap: Record<string, FieldDef[]> = {
  inpatient: [
    { id: 'tier3_ratio', label: '三级医院住院报销比例', unit: '%' },
    { id: 'tier2_ratio', label: '二级医院住院报销比例', unit: '%' },
    { id: 'tier3_deductible', label: '三级医院起付标准', unit: '元' },
    { id: 'annual_cap', label: '统筹基金年度封顶限额', unit: '元' }
  ],
  outpatient: [
    { id: 'annual_deductible', label: '门诊年度起付线', unit: '元' },
    { id: 'tier3_ratio', label: '三级医院门诊报销比例', unit: '%' },
    { id: 'community_ratio', label: '社区/基层门诊报销比例', unit: '%' },
    { id: 'annual_cap', label: '门诊年度最高支付限额', unit: '元' }
  ],
  catastrophic: [
    { id: 'deductible', label: '大病保险起付线', unit: '元' },
    { id: 'tier1_ratio', label: '大病首段报销比例', unit: '%' },
    { id: 'annual_cap', label: '大病年度封顶线', unit: '元' }
  ],
  remote: [
    { id: 'longterm_ratio', label: '长期异地居住备案报销折算系数', unit: '%' },
    { id: 'transfer_ratio', label: '异地转诊备案报销折算系数', unit: '%' },
    { id: 'unfiled_ratio', label: '未备案自行就医结算折算系数', unit: '%' }
  ],
  doc_other: [
    { id: 'doc_title', label: '最新红头文件全称变更', unit: '' },
    { id: 'doc_number', label: '官方发文字号修订', unit: '' },
    { id: 'other', label: '其他政策或待遇数据变动', unit: '' }
  ]
};

const currentFieldId = ref('tier3_ratio');

const currentFieldList = computed(() => {
  return fieldOptionsMap[currentCategory.value] || fieldOptionsMap.inpatient;
});

const currentFieldObj = computed(() => {
  return currentFieldList.value.find(f => f.id === currentFieldId.value) || currentFieldList.value[0];
});

function selectField(id: string) {
  currentFieldId.value = id;
  openDropdown.value = null;
}

// 智能提取库内现行数据
const liveBenchmarkText = computed(() => {
  const city = currentCityData.value;
  if (!city) return '载入中...';
  const pkg = currentInsuranceType.value === 'employee' ? city.employee : city.resident;
  const cat = currentCategory.value;

  if (cat === 'inpatient') {
    const r3 = Math.round((pkg.inpatient.tierBenefits?.tier3?.reimbursementRatio || 0.85) * 100);
    const d3 = pkg.inpatient.tierBenefits?.tier3?.deductible ?? 1200;
    const cap = pkg.inpatient.annualCap ? '¥' + Math.round(pkg.inpatient.annualCap / 10000) + '万' : '不设限额';
    return `三级报销 ${r3}%，起付线 ¥${d3}，封顶 ${cap}`;
  } else if (cat === 'outpatient') {
    const ded = pkg.outpatient.annualDeductible ?? 500;
    const r3 = Math.round((pkg.outpatient.tierBenefits?.tier3?.reimbursementRatio || 0.50) * 100);
    const cap = pkg.outpatient.annualCap ? '¥' + pkg.outpatient.annualCap : '不设限额';
    return `门诊起付 ¥${ded}，三级报销 ${r3}%，年度限额 ${cap}`;
  } else if (cat === 'catastrophic') {
    const ded = pkg.catastrophic?.deductible ?? 10000;
    const r1 = pkg.catastrophic?.tiers?.[0]?.ratio ? Math.round(pkg.catastrophic.tiers[0].ratio * 100) : 60;
    return `起付线 ¥${ded}，首段比例 ${r1}%`;
  } else if (cat === 'remote') {
    const rLong = Math.round((pkg.remoteMedical?.longTermFiledRatio || 1.0) * 100);
    const rTrans = Math.round((pkg.remoteMedical?.transferFiledRatio || 0.9) * 100);
    return `长期备案 ${rLong}%，转诊备案 ${rTrans}%`;
  } else {
    const doc = city.sourceDocs?.[0];
    return doc ? `现行发文《${doc.title}》(${doc.docNumber})` : '现行规范性文件';
  }
});

const currentFieldValue = computed(() => {
  const city = currentCityData.value;
  if (!city) return '';
  const pkg = currentInsuranceType.value === 'employee' ? city.employee : city.resident;
  const fid = currentFieldId.value;

  if (fid === 'tier3_ratio') return Math.round((pkg.inpatient.tierBenefits?.tier3?.reimbursementRatio || 0.85) * 100) + '%';
  if (fid === 'tier2_ratio') return Math.round((pkg.inpatient.tierBenefits?.tier2?.reimbursementRatio || 0.90) * 100) + '%';
  if (fid === 'tier3_deductible') return '¥' + (pkg.inpatient.tierBenefits?.tier3?.deductible ?? 1200);
  if (fid === 'annual_cap') return pkg.inpatient.annualCap ? '¥' + pkg.inpatient.annualCap : '不设限额';
  if (fid === 'annual_deductible') return '¥' + (pkg.outpatient.annualDeductible ?? 500);
  if (fid === 'community_ratio') return Math.round((pkg.outpatient.tierBenefits?.community?.reimbursementRatio || 0.80) * 100) + '%';
  if (fid === 'deductible') return '¥' + (pkg.catastrophic?.deductible ?? 10000);
  if (fid === 'tier1_ratio') return '60%';
  if (fid === 'longterm_ratio') return Math.round((pkg.remoteMedical?.longTermFiledRatio || 1.0) * 100) + '%';
  if (fid === 'transfer_ratio') return Math.round((pkg.remoteMedical?.transferFiledRatio || 0.9) * 100) + '%';
  if (fid === 'unfiled_ratio') return Math.round((pkg.remoteMedical?.unfiledNormalRatio || 0.8) * 100) + '%';
  return '现行有效';
});

// 表单输入
const suggestedValue = ref('');
const docTitleOrNumber = ref('');
const docUrl = ref('');
const reasonQuote = ref('');
const submitterContact = ref('');
const lastSubmittedId = ref('');

// 智能小徽标
const isDocStandard = computed(() => {
  const t = docTitleOrNumber.value.trim();
  return /〔|\[|（|\(|\d{4}|号|通知|细则/.test(t) && t.length > 5;
});

const isGovUrl = computed(() => {
  return docUrl.value.trim().toLowerCase().includes('.gov.cn');
});

// 极简差异微提示
const diffHintText = computed(() => {
  const val = suggestedValue.value.trim();
  if (!val) return '';
  return `💡 已录入建议修改为：“${val}${currentFieldObj.value.unit}” (原现行标准为：${currentFieldValue.value})`;
});

// 官方采纳与更新动态（动态读取自 CORRECTION_UPDATES_LOG）
const showAllUpdates = ref(false);
const displayedUpdates = computed(() => {
  if (showAllUpdates.value) {
    return CORRECTION_UPDATES_LOG;
  }
  return CORRECTION_UPDATES_LOG.slice(0, 5);
});
function toggleShowAllUpdates() {
  showAllUpdates.value = !showAllUpdates.value;
}

interface MyRecord {
  id: string;
  cityName: string;
  fieldName: string;
  suggestedValue: string;
}

const myRecords = ref<MyRecord[]>([]);

function loadMyRecords() {
  try {
    const raw = uni.getStorageSync('simple_correction_records');
    if (raw && Array.isArray(raw)) {
      myRecords.value = raw;
    }
  } catch (e) {
    console.error(e);
  }
}

const submittedDraft = ref<any>(null);

function handleSubmitCorrection() {
  const val = suggestedValue.value.trim();
  const quote = reasonQuote.value.trim();
  const doc = docTitleOrNumber.value.trim();
  const url = docUrl.value.trim();
  const contact = submitterContact.value.trim();

  if (!val && !quote) {
    uni.showToast({ title: '请填写建议修改值或条款说明', icon: 'none' });
    return;
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const trackId = `CHK-2026-${currentCityOption.value.cityCode}-${randomNum}`;
  lastSubmittedId.value = trackId;

  submittedDraft.value = {
    city: currentCityOption.value.cityName,
    province: currentProvince.value.name,
    category: currentCategoryObj.value.name,
    field: currentFieldObj.value.label,
    suggestedVal: val || '条款勘误',
    currentVal: currentFieldValue.value,
    docNumber: doc || '未注明',
    docUrl: url || '未注明',
    quote: quote || '无额外补充说明',
    contact: contact || '未留'
  };

  const newRec: MyRecord = {
    id: trackId,
    cityName: currentCityOption.value.cityName,
    fieldName: currentFieldObj.value.label,
    suggestedValue: val || '条款勘误'
  };

  myRecords.value.unshift(newRec);
  try {
    uni.setStorageSync('simple_correction_records', myRecords.value);
  } catch (e) {
    console.error(e);
  }

  uni.showToast({ title: '草稿已就绪，请选择投递方式', icon: 'success' });
}

function dispatchToGithub() {
  const d = submittedDraft.value || {
    city: currentCityOption.value.cityName,
    province: currentProvince.value.name,
    category: currentCategoryObj.value.name,
    field: currentFieldObj.value.label,
    suggestedVal: suggestedValue.value || '请补充建议值',
    currentVal: currentFieldValue.value,
    docNumber: docTitleOrNumber.value || '未注明',
    docUrl: docUrl.value || '未注明',
    quote: reasonQuote.value || '无额外说明',
    contact: submitterContact.value || '未留'
  };

  const title = encodeURIComponent(`【政策纠错】${d.province}${d.city} - ${d.field}`);
  const body = encodeURIComponent(`### 政策纠错与公文提报

- **统筹地区**: ${d.province} · ${d.city}
- **拟纠错板块**: ${d.category}
- **拟修正指标**: ${d.field}
- **建议修正值**: ${d.suggestedVal}
- **原库内参考值**: ${d.currentVal}
- **官方公文与字号**: ${d.docNumber}
- **官方网址/公开链接**: ${d.docUrl}
- **条款说明与依据摘录**:
${d.quote}
- **反馈人与联系方式**: ${d.contact}

---
*由全国医保待遇估算与政策查询工具前台提交生成*`);

  const ghUrl = `https://github.com/good9527/china-medical-insurance/issues/new?title=${title}&body=${body}`;

  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.open(ghUrl, '_blank');
  }
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: ghUrl,
    success: () => {
      uni.showToast({ title: 'GitHub Issue 链接已复制', icon: 'none' });
    }
  });
  // #endif
}

function dispatchToEmail() {
  const d = submittedDraft.value || {
    city: currentCityOption.value.cityName,
    province: currentProvince.value.name,
    category: currentCategoryObj.value.name,
    field: currentFieldObj.value.label,
    suggestedVal: suggestedValue.value || '请补充建议值',
    currentVal: currentFieldValue.value,
    docNumber: docTitleOrNumber.value || '未注明',
    docUrl: docUrl.value || '未注明',
    quote: reasonQuote.value || '未注明',
    contact: submitterContact.value || '未留'
  };

  const subject = encodeURIComponent(`【医保政策纠错】${d.province}${d.city} - ${d.field}`);
  const body = encodeURIComponent(`作者您好：

我在医保政策查询与估算工具中核对发现以下数据需要更新：

【统筹区域】：${d.province} · ${d.city}
【纠错板块】：${d.category}
【修正指标】：${d.field}
【建议修正值】：${d.suggestedVal}
【原库内参数】：${d.currentVal}
【官方公文与字号】：${d.docNumber}
【公文链接】：${d.docUrl}
【条款依据摘录】：
${d.quote}
【我的联系方式】：${d.contact}

请在核实公开政策公文后予以更新，谢谢！`);

  const mailtoUrl = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;

  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.location.href = mailtoUrl;
  }
  // #endif
  // #ifndef H5
  copyDirect(SITE_CONFIG.email, '作者邮箱');
  // #endif
}

onMounted(() => {
  loadMyRecords();
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 9999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  box-sizing: border-box;
}

.city-indicator-txt {
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
  line-height: 1;
}

.page-sub-title {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
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
}

.audit-status-txt {
  font-size: 12px;
  font-weight: 600;
  color: #166534;
}

/* 主布局 */
.correction-main-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  align-items: start;
}

/* 单卡片一体化纠错表单 */
.form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 18px;
}

.card-head-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.head-tip {
  font-size: 11px;
  color: #94a3b8;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #334155;
}

.required-star {
  color: #ef4444;
}

.mt-8 { margin-top: 8px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.mt-20 { margin-top: 20px; }
.mb-16 { margin-bottom: 16px; }

/* 地区行与胶囊 */
.region-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.region-selectors-grid {
  display: flex;
  gap: 10px;
  flex: 1;
}

.picker-anchor {
  position: relative;
  flex: 1;
  min-width: 130px;
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
  font-size: 11px;
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
  min-width: 140px;
  max-height: 320px;
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

.type-capsule-group {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

.type-capsule-btn {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-capsule-btn.active {
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.type-btn-txt {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.type-capsule-btn.active .type-btn-txt {
  color: #2563eb;
  font-weight: 700;
}

/* 纠错分类标签 */
.category-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-pill {
  padding: 6px 14px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cat-pill.active {
  background: #0f172a;
  border-color: #0f172a;
}

.cat-pill-txt {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.cat-pill.active .cat-pill-txt {
  color: #ffffff;
}

/* 现行参数轻提示条 */
.live-param-banner {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 10px 14px;
}

.live-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-bulb {
  font-size: 14px;
}

.live-banner-txt {
  font-size: 12px;
  color: #1e40af;
  line-height: 1.4;
}

.font-bold {
  font-weight: 700;
}

/* 建议修正行 */
.suggest-input-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
}

.field-picker-wrap {
  position: relative;
}

.field-trigger {
  height: 40px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.field-val {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggest-value-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
  box-sizing: border-box;
}

.suggest-value-box:focus-within {
  border-color: #2563eb;
  background: #ffffff;
}

.cyber-clean-input {
  flex: 1;
  height: 38px;
  font-size: 13px;
  color: #0f172a;
}

.unit-text {
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
  margin-left: 6px;
}

.diff-chip-hint {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 6px 10px;
}

.diff-hint-txt {
  font-size: 11px;
  color: #15803d;
  font-weight: 600;
}

/* 公文输入 */
.doc-input-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-with-badge {
  position: relative;
  display: flex;
  align-items: center;
}

.full-width {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  box-sizing: border-box;
}

.full-width:focus {
  border-color: #2563eb;
  background: #ffffff;
}

.mini-verified-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  font-size: 11px;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  padding: 0 8px;
  border-radius: 4px;
  line-height: 1;
  box-sizing: border-box;
}

.mini-gov-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  font-size: 11px;
  font-weight: 700;
  color: #0e7490;
  background: #cffafe;
  padding: 0 8px;
  border-radius: 4px;
  line-height: 1;
  box-sizing: border-box;
}

.cyber-clean-textarea {
  width: 100%;
  height: 64px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #0f172a;
  box-sizing: border-box;
  line-height: 1.4;
}

.cyber-clean-textarea:focus {
  border-color: #2563eb;
  background: #ffffff;
}

.placeholder-dim {
  color: #94a3b8;
  font-size: 12px;
}

/* 联系人与提交按钮 */
.submit-row {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 12px;
}

.contact-input {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  height: 42px;
  box-sizing: border-box;
}

.contact-input:focus {
  border-color: #2563eb;
  background: #ffffff;
}

.btn-clean-submit {
  height: 42px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-clean-submit:hover { opacity: 0.95; }
.btn-clean-submit:active { opacity: 0.85; }

.btn-svg {
  width: 16px;
  height: 16px;
  stroke: #ffffff;
}

.btn-submit-txt {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.submit-note-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
}

.hint-text {
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.45;
}

/* 提交成功提示条 */
.submission-success-bar {
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 12px 14px;
}

.success-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.success-icon {
  width: 20px;
  height: 20px;
  background: #10b981;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}

.success-txts {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.success-title {
  font-size: 13px;
  font-weight: 700;
  color: #166534;
}

.success-sub {
  font-size: 11px;
  color: #15803d;
  line-height: 1.5;
}

/* 直连投递通道按钮组 */
.dispatch-channels-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dispatch-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
  border: 1px solid transparent;
}

.dispatch-svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.d-txts {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.d-primary {
  font-size: 13px;
  font-weight: 700;
}

.d-sub {
  font-size: 11px;
  opacity: 0.85;
  margin-top: 2px;
}

.d-arrow {
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.btn-github {
  background: #0f172a;
  color: #ffffff;
}
.btn-github:hover {
  background: #1e293b;
}

.btn-email {
  background: #2563eb;
  color: #ffffff;
}
.btn-email:hover {
  background: #1d4ed8;
}

.btn-wechat {
  background: #ffffff;
  color: #0f172a;
  border-color: #cbd5e1;
}
.btn-wechat:hover {
  background: #f1f5f9;
}

/* 右侧栏卡片 */
.sidebar-column {
  display: flex;
  flex-direction: column;
}

.head-svg {
  width: 16px;
  height: 16px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.head-chip {
  font-size: 11px;
  font-weight: 600;
  color: #0e7490;
  background: #ecfeff;
  padding: 2px 8px;
  border-radius: 6px;
}

.head-chip-emerald {
  font-size: 11px;
  font-weight: 600;
  color: #15803d;
  background: #f0fdf4;
  padding: 2px 8px;
  border-radius: 6px;
}

.dynamic-summary-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 12px;
}

.summary-badge {
  font-size: 11px;
  font-weight: 700;
  color: #166534;
  background: #dcfce7;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.summary-txt {
  font-size: 11.5px;
  color: #15803d;
  font-weight: 600;
  line-height: 1.4;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.recent-city-tag {
  display: flex;
  align-items: center;
  gap: 6px;
}

.r-city {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.r-tag {
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 1px 5px;
  border-radius: 4px;
}

.r-date {
  font-size: 11px;
  color: #94a3b8;
}

.recent-desc {
  font-size: 12px;
  color: #334155;
  line-height: 1.4;
}

.recent-doc {
  font-size: 11px;
  color: #64748b;
}

.text-emerald {
  color: #059669;
  font-weight: 600;
}

.expand-more-wrap {
  margin-top: 10px;
}

.expand-more-btn {
  width: 100%;
  height: 34px;
  line-height: 34px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.expand-more-btn:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}

/* 我的提交 */
.my-rec-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.my-rec-item {
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.my-rec-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.my-rec-city {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.my-rec-status {
  font-size: 11px;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 1px 5px;
  border-radius: 4px;
}

.my-rec-diff {
  font-size: 11px;
  color: #0e7490;
  font-weight: 600;
}

.my-rec-id {
  font-size: 11px;
  color: #94a3b8;
}

/* 零成本开源协同反馈闭环看板 */
.head-chip-cyan {
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 右侧采纳动态内滚动容器 (高度与左侧对齐) */
.dynamic-scroll-card {
  display: flex;
  flex-direction: column;
}

.recent-scroll-body {
  max-height: 410px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

/* 紧凑联系作者轻量条 */
.contact-compact-bar {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.compact-bar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.compact-bar-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
}

.compact-pills-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.compact-pill-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.compact-pill-btn:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.pill-k {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
}

.pill-v {
  font-size: 11px;
  color: #2563eb;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pill-act {
  font-size: 10px;
  color: #64748b;
  background: #e2e8f0;
  padding: 1px 4px;
  border-radius: 3px;
}

/* 底部通栏横向流程看板 */
.pipeline-fullwidth-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.stepper-horizontal-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

.step-card-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  box-sizing: border-box;
}

.step-head-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.step-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-name {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-detail {
  font-size: 11px;
  color: #64748b;
  line-height: 1.45;
}

.step-arrow-divider {
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  user-select: none;
}

.cmd-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0369a1;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 600;
}

.patrol-notice-mini {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.patrol-icon {
  font-size: 14px;
  line-height: 1.2;
}

.patrol-txt {
  font-size: 11px;
  color: #0369a1;
  line-height: 1.45;
}

/* 移动端响应式 */
@media (max-width: 767px) {
  .content-box {
    padding: 12px 14px calc(84px + env(safe-area-inset-bottom)) !important;
  }

  .cyber-dropdown-menu {
    max-height: 46vh !important;
    z-index: 9999 !important;
    box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18) !important;
    -webkit-overflow-scrolling: touch;
  }

  .correction-main-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .page-main-title {
    font-size: 19px;
    white-space: nowrap;
  }

  .card-head-title {
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

  .page-intro-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 14px;
  }

  .audit-status-badge {
    align-self: flex-start;
  }

  .region-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .region-selectors-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
  }

  .region-selectors-grid .picker-anchor {
    min-width: 0;
  }

  .type-capsule-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .type-capsule-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
  }

  .category-pills-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
  }

  .cat-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    text-align: center;
    box-sizing: border-box;
  }

  .cat-pill:nth-child(4) {
    grid-column: span 1;
  }

  .cat-pill:nth-child(5) {
    grid-column: span 2;
  }

  .suggest-input-row {
    grid-template-columns: 1fr;
  }

  .submit-row {
    grid-template-columns: 1fr;
  }

  /* 移动端步骤流程自适应为纵向清晰步骤条 */
  .stepper-horizontal-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .step-card-box {
    padding: 10px 12px;
  }

  .step-arrow-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(90deg);
    height: 14px;
    margin: -2px 0;
    opacity: 0.7;
  }

  .compact-pills-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
