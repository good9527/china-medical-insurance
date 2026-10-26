<template>
  <view class="page-wrapper" @click="closeAllDropdowns">
    <!-- 全站统一全局导航 (Tab栏像素级恒定居中，永不跳动) -->
    <AppHeader currentTab="index" />

    <view class="content-box">
      <!-- 页面简明标题与操作栏 (清新实用，去除浮夸官腔) -->
      <view class="page-intro-bar">
        <view class="intro-left">
          <view class="title-with-badge">
            <view class="page-feature-icon">
              <svg class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="16" y1="14" x2="16" y2="14.01"></line>
                <line x1="8" y1="14" x2="8" y2="14.01"></line>
                <line x1="12" y1="14" x2="12" y2="14.01"></line>
                <line x1="8" y1="18" x2="8" y2="18.01"></line>
                <line x1="12" y1="18" x2="12" y2="18.01"></line>
                <line x1="16" y1="18" x2="16" y2="18.01"></line>
              </svg>
            </view>
            <view class="page-title-stack">
              <view class="title-row">
                <text class="page-main-title">医保报销估算</text>
                <view class="city-indicator-chip">
                  <text class="city-indicator-txt">{{ currentCityOption.cityName }}</text>
                </view>
              </view>
              <text class="page-sub-title">根据地方公开政策文件规则，估算统筹报销金额与自付明细（结果仅供参考）</text>
            </view>
          </view>
        </view>

      </view>

      <!-- 双栏 Bento 工作台 -->
      <view class="bento-grid">
        <!-- 左栏：测算配置器 -->
        <view class="bento-card config-card">
          <!-- 卡片顶头标题与搜索入口 -->
          <view class="card-lead-head">
            <view class="lead-left">
              <view class="lead-icon-wrap">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="lead-svg">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </view>
              <view class="lead-texts">
                <text class="lead-title">参数录入配置</text>
                <text class="lead-subtitle">选择参保地与场景，调取地方公文规程</text>
              </view>
            </view>
            <view class="quick-search-trigger" @click="showSearchModal = !showSearchModal">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" class="qs-svg">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <text class="search-trigger-txt">{{ showSearchModal ? '收起搜索' : '检索城市' }}</text>
            </view>
          </view>

          <!-- 城市搜索面板 -->
          <view class="search-panel" v-if="showSearchModal" @click.stop>
            <view class="input-wrap">
              <input 
                class="search-input" 
                v-model="citySearchQuery" 
                placeholder="输入城市拼音或中文（如：成都 / 晋中 / 西安）" 
                :focus="true"
                @confirm="onSearchConfirm"
              />
              <text class="search-clear-btn" v-if="citySearchQuery" @click.stop="citySearchQuery = ''">✕</text>
            </view>
            <view class="search-results-list" v-if="filteredSearchCities.length > 0">
              <view 
                class="search-result-row" 
                v-for="item in filteredSearchCities" 
                :key="item.cityCode"
                @click="selectSearchedCity(item)"
              >
                <view class="row-left">
                  <text class="c-name">{{ item.cityName }}</text>
                  <text class="c-prov">{{ item.provinceName }}</text>
                </view>
                <text class="c-action">选择 ↵</text>
              </view>
            </view>
            <view class="search-empty" v-else-if="citySearchQuery.trim()">
              <text class="empty-txt">未匹配到该城市，请尝试省份全称</text>
            </view>
          </view>

          <!-- 参保统筹区 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">参保统筹区</text>
              <text class="group-hint">当前：{{ currentCityOption.cityName }}（{{ currentProvince.name }}）</text>
            </view>
            <view class="region-dropdown-grid dropdown-anchor-row">
              <view class="col-field">
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

              <view class="col-field">
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
          </view>

          <!-- 参保身份类别 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">医保身份类别</text>
            </view>
            <view class="segmented-control">
              <view 
                class="seg-btn" 
                :class="{ active: form.insuranceType === 'employee' }"
                @click="switchInsuranceType('employee')"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="seg-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <text class="seg-title">城镇职工医保</text>
              </view>
              <view 
                class="seg-btn" 
                :class="{ active: form.insuranceType === 'resident' }"
                @click="switchInsuranceType('resident')"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="seg-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <text class="seg-title">城乡居民医保</text>
              </view>
            </view>

            <!-- 职工退休优待开关 -->
            <view class="retiree-bar" v-if="form.insuranceType === 'employee'" @click="toggleRetiree">
              <view class="retiree-bar-left">
                <text class="retiree-label">退休人员待遇优待</text>
                <text class="retiree-badge">比例上浮 +3%~5%</text>
                <PolicyTooltip title="什么是退休人员待遇倾斜？" text="各地医保政策对退休参保人员给予法定倾斜优待，报销比例通常比在职人员高 3%~5%，部分城市门诊起付线更低或封顶线更高。" example="以西安三级医院住院为例，在职职工报销80%，退休职工报销85%。" />
              </view>
              <view class="custom-switch" :class="{ checked: form.isRetiree }">
                <view class="switch-handle"></view>
              </view>
            </view>
          </view>

          <!-- 就医场景与机构等级 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">就医场景与机构等级</text>
            </view>
            <view class="grid-2col dropdown-anchor-row">
              <view class="col-field">
                <view class="sub-segmented-control">
                  <view 
                    class="sub-seg-btn" 
                    :class="{ active: form.treatmentType === 'inpatient' }"
                    @click="switchTreatmentType('inpatient')"
                  >
                    <text class="sub-seg-txt">住院治疗</text>
                  </view>
                  <view 
                    class="sub-seg-btn" 
                    :class="{ active: form.treatmentType === 'outpatient' }"
                    @click="switchTreatmentType('outpatient')"
                  >
                    <text class="sub-seg-txt">普通门诊</text>
                  </view>
                </view>
              </view>

              <view class="col-field">
                <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'hospital' }" @click.stop="toggleDropdown('hospital')">
                  <text class="select-val">{{ hospitalTiers[selectedHospitalIndex].shortName }}</text>
                  <text class="select-arrow" :class="{ rotated: openDropdown === 'hospital' }">▾</text>
                </view>
                <view class="cyber-dropdown-menu" v-if="openDropdown === 'hospital'" @click.stop>
                  <view 
                    class="dropdown-item" 
                    v-for="(h, idx) in hospitalTiers" 
                    :key="h.tier"
                    :class="{ selected: selectedHospitalIndex === idx }"
                    @click.stop="selectHospital(idx)"
                  >
                    <text class="item-name">{{ h.name }}</text>
                    <text class="item-check" v-if="selectedHospitalIndex === idx">✓</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 住院就诊频次阶梯选择器 (仅住院场景生效) -->
            <view class="admission-frequency-bar" v-if="form.treatmentType === 'inpatient'">
              <view class="frequency-header">
                <text class="frequency-label">年内住院频次：</text>
                <text class="frequency-badge" v-if="form.hospitalizationCount > 1">享受起付阶梯递减</text>
              </view>
              <view class="frequency-segmented-control">
                <view 
                  class="freq-btn" 
                  :class="{ active: form.hospitalizationCount === 1 }"
                  @click="setHospitalizationCount(1)"
                >
                  <text class="freq-txt">首次住院</text>
                  <text class="freq-sub">基准门槛</text>
                </view>
                <view 
                  class="freq-btn" 
                  :class="{ active: form.hospitalizationCount === 2 }"
                  @click="setHospitalizationCount(2)"
                >
                  <text class="freq-txt">二次住院</text>
                  <text class="freq-sub">起付递减</text>
                </view>
                <view 
                  class="freq-btn" 
                  :class="{ active: form.hospitalizationCount === 3 }"
                  @click="setHospitalizationCount(3)"
                >
                  <text class="freq-txt">三次及以上</text>
                  <text class="freq-sub">免/极低门槛</text>
                </view>
              </view>
              <view class="frequency-policy-hint" v-if="currentRepeatedDeductibleRule">
                <text class="hint-bullet">※</text>
                <text class="hint-txt">{{ currentRepeatedDeductibleRule }}</text>
              </view>
            </view>

            <!-- 门诊政策提醒 -->
            <view class="policy-notice" v-if="form.treatmentType === 'outpatient' && currentCityData">
              <text class="notice-badge">门诊政策提醒</text>
              <text class="notice-content" v-if="form.insuranceType === 'employee'">
                {{ currentCityData.cityName }}职工门诊共济：{{ (currentCityData.employee.outpatient.annualDeductible || 0) > 0 ? ('年起付线 ¥' + currentCityData.employee.outpatient.annualDeductible + (currentCityData.employee.outpatient.annualDeductibleRetiree ? '（退休优待¥' + currentCityData.employee.outpatient.annualDeductibleRetiree + '）；' : '；')) : '0元起付直接报销；' }}{{ currentCityData.employee.outpatient.annualCap >= 9999999 ? '门诊不设最高封顶线（上不封顶）。' : ('在职年封顶 ¥' + currentCityData.employee.outpatient.annualCap + '，退休年封顶 ¥' + (currentCityData.employee.outpatient.annualCapRetiree || currentCityData.employee.outpatient.annualCap) + '。') }}
              </text>
              <text class="notice-content" v-else>
                {{ currentCityData.cityName }}居民门诊统筹：年封顶额度 ¥{{ currentCityData.resident.outpatient.annualCap }}/人，{{ (currentCityData.resident.outpatient.annualDeductible || 0) > 0 ? ('年起付标准 ¥' + currentCityData.resident.outpatient.annualDeductible + '；') : '定点基层机构免起付线即时结算。' }}
              </text>
            </view>
          </view>

          <!-- 就医地点与异地备案 (一级控件前置) -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">就医地点与异地备案</text>
              <text class="group-remote-badge" :class="remoteOptions[selectedRemoteIndex].badgeClass">
                {{ remoteOptions[selectedRemoteIndex].badge }}
              </text>
            </view>

            <view class="dropdown-anchor-row" @click.stop>
              <view 
                class="cyber-dropdown-trigger" 
                :class="{ open: openDropdown === 'remote' }" 
                @click.stop="toggleDropdown('remote')"
              >
                <view class="remote-trigger-inner">
                  <text class="select-val">{{ remoteOptions[selectedRemoteIndex].label }}</text>
                  <text class="mini-rate-tag" :class="remoteOptions[selectedRemoteIndex].badgeClass">
                    {{ remoteOptions[selectedRemoteIndex].badge }}
                  </text>
                </view>
                <text class="select-arrow" :class="{ rotated: openDropdown === 'remote' }">▾</text>
              </view>

              <view class="cyber-dropdown-menu remote-dropdown-menu" v-if="openDropdown === 'remote'" @click.stop>
                <view 
                  class="dropdown-item remote-dropdown-item" 
                  v-for="(r, idx) in remoteOptions" 
                  :key="r.value"
                  :class="{ selected: selectedRemoteIndex === idx }"
                  @click.stop="selectRemote(idx)"
                >
                  <view class="remote-item-left">
                    <view class="remote-item-title-row">
                      <text class="item-name">{{ r.label }}</text>
                      <text class="item-rate-badge" :class="r.badgeClass">{{ r.badge }}</text>
                    </view>
                    <text class="item-desc">{{ r.desc }}</text>
                  </view>
                  <text class="item-check" v-if="selectedRemoteIndex === idx">✓</text>
                </view>
              </view>
            </view>

            <!-- 异地就医动态政策指引 -->
            <view class="remote-policy-guide" v-if="selectedRemoteIndex > 0">
              <view class="rpg-header">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" class="rpg-svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <text class="rpg-title">{{ currentCityOption.cityName }}异地就医规程指引</text>
              </view>
              <text class="rpg-content">{{ dynamicRemoteHint }}</text>
            </view>
          </view>

          <!-- 预估医疗总花费 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">预估医疗总花费</text>
            </view>
            <view class="amount-input-box">
              <text class="currency-symbol">¥</text>
              <input 
                type="digit" 
                class="main-amount-input" 
                v-model="form.totalCost" 
                placeholder="0"
                @input="onCostInput"
              />
              <text class="currency-unit">元</text>
            </view>

            <!-- 快捷预设金额药丸 -->
            <view class="preset-pill-row">
              <view 
                class="preset-pill" 
                v-for="amt in quickAmounts" 
                :key="amt"
                :class="{ active: form.totalCost === String(amt) && !selectedScenarioId }"
                @click="setQuickCost(amt)"
              >
                <text class="pill-text">{{ formatQuickPill(amt) }}</text>
              </view>
            </view>

            <!-- 典型临床就医场景智能一键代入 -->
            <view class="scenario-lead-row">
              <view class="scenario-lead-left">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" class="sc-svg">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <text class="scenario-lead-txt">常见病种手术临床场景一键代入：</text>
              </view>
            </view>

            <view class="scenario-chips-scroll">
              <view 
                class="scenario-chip" 
                v-for="sc in medicalScenarios" 
                :key="sc.id"
                :class="{ active: selectedScenarioId === sc.id }"
                @click="applyScenario(sc)"
              >
                <text class="sc-badge">{{ sc.badge }}</text>
                <text class="sc-name">{{ sc.name }}</text>
                <text class="sc-price font-mono">¥{{ (sc.totalCost / 10000 >= 1 ? (sc.totalCost / 10000 + '万') : sc.totalCost) }}</text>
              </view>
            </view>
          </view>

          <!-- 高级自费折叠面板 -->
          <view class="advanced-collapse-card">
            <view class="collapse-trigger" @click="showExtra = !showExtra">
              <view class="trigger-label-group">
                <text class="trigger-label">自费与先行自付项目 (可选补充)</text>
                <PolicyTooltip title="什么是全自费与先行自付？" text="丙类自费药品与特需耗材不属于基本医保目录，需全额自理；乙类项目先由个人按地方规定自付一定比例（通常5%~10%），剩余部分再纳入统筹报销。" />
              </view>
              <text class="trigger-arrow">{{ showExtra ? '收起 ▴' : '展开 ▾' }}</text>
            </view>

            <view class="collapse-content" v-if="showExtra">
              <view class="collapse-field">
                <text class="field-label">全自费项目金额 (丙类药/特需耗材/不可报销项目)</text>
                <input 
                  type="digit" 
                  class="collapse-input" 
                  v-model="form.nonInsuranceCost" 
                  placeholder="无自费项目可填 0" 
                  @input="triggerCalculation"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 右栏：报销测算明细凭证 -->
        <view class="bento-card receipt-card">
          <view class="receipt-inner" v-if="result">
            <!-- 凭证顶栏 -->
            <view class="receipt-header">
              <view class="receipt-title-wrap">
                <view class="status-indicator"></view>
                <text class="receipt-title">
                  <text class="desktop-title-txt">费用估算参考看板</text>
                  <text class="mobile-title-txt">费用估算参考</text>
                </text>
              </view>
              <view class="receipt-actions">
                <view class="voucher-gen-btn" @click.stop="showVoucherModal = true" title="生成结算凭据单海报">
                  <svg class="voucher-btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <text class="voucher-btn-txt">生成凭据单</text>
                </view>
                <view class="copy-voucher-btn" @click.stop="copyReceipt" title="一键复制估算凭据">
                  <svg class="copy-btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <text class="copy-btn-txt">复制凭据</text>
                </view>
              </view>
            </view>

            <!-- 核心精炼英雄结算看板 (左右并列，精致双核，杜绝冗余厚度) -->
            <view class="result-hero-board">
              <view class="hero-split-row">
                <!-- 预估医保报销 -->
                <view class="hero-half half-reimbursed">
                  <view class="half-tag tag-cyan">
                    <text class="half-tag-txt">预估医保报销</text>
                    <text class="half-tag-pct">{{ displayRatio }}%</text>
                  </view>
                  <view class="half-price-row">
                    <text class="half-yen text-cyan">¥</text>
                    <text class="half-val text-cyan">{{ displayReimbursed.toLocaleString() }}</text>
                  </view>
                  <text class="half-hint">出院窗口联网直接结算抵扣</text>
                </view>

                <view class="hero-center-divider"></view>

                <!-- 个人自付金额 -->
                <view class="hero-half half-personal">
                  <view class="half-tag tag-amber">
                    <text class="half-tag-txt">个人自付金额</text>
                    <text class="half-tag-pct">{{ (100 - (result.breakdown.effectiveRatio || 0)).toFixed(1) }}%</text>
                  </view>
                  <view class="half-price-row">
                    <text class="half-yen text-amber">¥</text>
                    <text class="half-val text-amber">{{ displayPersonalPay.toLocaleString() }}</text>
                  </view>
                  <text class="half-hint">含起付线、按比自负及自费项</text>
                </view>
              </view>

              <!-- 极细构成双色比例条 -->
              <view class="hero-mini-meter">
                <view class="mini-bar bar-cyan" :style="{ width: result.breakdown.effectiveRatio + '%' }"></view>
                <view class="mini-bar bar-amber" :style="{ width: Math.max(0, 100 - result.breakdown.effectiveRatio) + '%' }"></view>
              </view>

              <!-- 首屏副标：直接呈现权威公文出处及 12393 咨询指引 -->
              <view class="hero-authority-sub">
                <view class="authority-doc-box" @click.stop="openDocUrl" :title="result.officialDocUsed?.title || '查看公文原文'">
                  <svg class="authority-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <text class="authority-doc-title">{{ currentDocSummary }}</text>
                </view>
                <view class="authority-hotline-btn" @click.stop="handleCallHotline">
                  <svg class="authority-hotline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <text class="authority-hotline-txt">12393 咨询指引</text>
                </view>
              </view>
            </view>

            <!-- 资金流向阶梯式漏斗可视化卡片 (Uni-app H5 & 微信小程序通用) -->
            <view class="stepped-funnel-card">
              <view class="funnel-card-header" :class="{ 'has-bottom-border': showFunnel }" @click="showFunnel = !showFunnel">
                <view class="fch-left">
                  <view class="funnel-icon-box">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  </view>
                  <text class="funnel-header-title">查看精算报销明细</text>
                  <text class="funnel-header-badge">5阶精算拆解</text>
                </view>
                <text class="funnel-toggle-txt">{{ showFunnel ? '收起 ▴' : '展开 ▾' }}</text>
              </view>

              <view class="funnel-ladder-body" v-if="showFunnel">
                <!-- Step 1: 医疗总费用 (Total Medical Cost) -->
                <view class="funnel-step step-total">
                  <view class="step-spine">
                    <view class="spine-node node-slate"><text class="node-num">1</text></view>
                    <view class="spine-line"></view>
                  </view>
                  <view class="step-content">
                    <view class="step-top-row">
                      <view class="step-label-group">
                        <text class="step-label font-bold">Step 1. 医疗总花费 (定点账面流水)</text>
                      </view>
                      <text class="step-val font-mono font-bold">¥ {{ (result.breakdown.totalCost || 0).toLocaleString() }}</text>
                    </view>
                    <view class="step-bar-wrap">
                      <view class="funnel-bar bar-total" style="width: 100%"></view>
                    </view>
                    <text class="step-desc">定点医药机构出具的住院/门诊全部合规与自费项目账面总金额 (100% 原始基准)</text>
                  </view>
                </view>

                <!-- Step 2: 扣除全自费/先行自付 -->
                <view class="funnel-step step-deduct-self">
                  <view class="step-spine">
                    <view class="spine-node node-amber"><text class="node-num">-</text></view>
                    <view class="spine-line"></view>
                  </view>
                  <view class="step-content">
                    <view class="step-top-row">
                      <view class="step-label-group">
                        <text class="step-label text-amber font-bold">Step 2. 扣除全自费与先行自付</text>
                        <PolicyTooltip title="全自费与先行自付" text="丙类全自费项目不入医保统筹池；乙类药品耗材按地方规定由个人先行自付5%~10%后进入统筹范围。" />
                      </view>
                      <text class="step-val text-amber font-mono font-bold">
                        - ¥ {{ ((result.breakdown.nonInsuranceCost || 0) + (result.breakdown.classBPriorPay || result.breakdown.classBSelfPay || 0)).toLocaleString() }}
                      </text>
                    </view>
                    <view class="step-bar-wrap">
                      <view class="funnel-bar bar-eligible" :style="{ width: Math.max(15, Math.min(100, Math.round(((result.breakdown.eligibleCost || 0) / (result.breakdown.totalCost || 1)) * 100))) + '%' }"></view>
                    </view>
                    <view class="step-sub-badges">
                      <text class="sub-badge badge-amber" v-if="result.breakdown.nonInsuranceCost > 0">
                        丙类全自费 ¥{{ (result.breakdown.nonInsuranceCost || 0).toLocaleString() }}
                      </text>
                      <text class="sub-badge badge-orange" v-if="(result.breakdown.classBPriorPay || result.breakdown.classBSelfPay || 0) > 0">
                        乙类先行自付 ¥{{ (result.breakdown.classBPriorPay || result.breakdown.classBSelfPay || 0).toLocaleString() }}
                      </text>
                      <text class="sub-badge badge-gray" v-if="result.breakdown.nonInsuranceCost === 0 && (result.breakdown.classBPriorPay || result.breakdown.classBSelfPay || 0) === 0">
                        全自费与先行自付 ¥0 (全部费用纳规)
                      </text>
                    </view>
                    <view class="step-result-bubble">
                      <text class="bubble-txt">➔ 医保统筹可结算基数 (Eligible Cost)：<text class="font-mono font-bold">¥ {{ (result.breakdown.eligibleCost || 0).toLocaleString() }}</text></text>
                    </view>
                  </view>
                </view>

                <!-- Step 3: 扣除免赔起付线 -->
                <view class="funnel-step step-deductible">
                  <view class="step-spine">
                    <view class="spine-node node-indigo"><text class="node-num">2</text></view>
                    <view class="spine-line"></view>
                  </view>
                  <view class="step-content">
                    <view class="step-top-row">
                      <view class="step-label-group">
                        <text class="step-label text-indigo font-bold">Step 3. 扣除免赔起付线门槛</text>
                        <text class="discount-pill" v-if="form.treatmentType === 'inpatient' && form.hospitalizationCount > 1">
                          年内第{{ form.hospitalizationCount }}次住院阶梯优惠
                        </text>
                      </view>
                      <text class="step-val text-indigo font-mono font-bold">
                        - ¥ {{ (result.breakdown.deductibleDeducted || 0).toLocaleString() }}
                      </text>
                    </view>
                    <view class="step-bar-wrap">
                      <view class="funnel-bar bar-deductible" :style="{ width: Math.max(10, Math.min(100, Math.round((Math.max(0, result.breakdown.eligibleCost - result.breakdown.deductibleDeducted) / (result.breakdown.totalCost || 1)) * 100))) + '%' }"></view>
                    </view>
                    <view class="deductible-detail-tags" v-if="result.breakdown.deductibleReduction > 0">
                      <text class="deductible-tag">首选基准起付: ¥{{ result.breakdown.standardDeductible }}</text>
                      <text class="deductible-tag tag-discount">频次递减减免: -¥{{ result.breakdown.deductibleReduction }}</text>
                      <text class="deductible-tag tag-applied">实际执行标准: ¥{{ result.breakdown.appliedDeductible }}</text>
                    </view>
                    <view class="step-result-bubble bubble-indigo">
                      <text class="bubble-txt">➔ 实际进入统筹报销段合规费用：<text class="font-mono font-bold">¥ {{ Math.max(0, result.breakdown.eligibleCost - result.breakdown.deductibleDeducted).toLocaleString() }}</text></text>
                    </view>
                  </view>
                </view>

                <!-- Step 4: 医保基金统筹报销 + 大病/大额基金补充报销 -->
                <view class="funnel-step step-reimburse">
                  <view class="step-spine">
                    <view class="spine-node node-cyan"><text class="node-num">✓</text></view>
                    <view class="spine-line"></view>
                  </view>
                  <view class="step-content">
                    <view class="step-top-row">
                      <view class="step-label-group">
                        <text class="step-label text-cyan font-bold">Step 4. 医保基金统筹报销合计</text>
                        <text class="ratio-pill">实报 {{ result.breakdown.effectiveRatio }}%</text>
                      </view>
                      <text class="step-val text-cyan font-bold font-mono">
                        + ¥ {{ (result.breakdown.totalReimbursed || 0).toLocaleString() }}
                      </text>
                    </view>
                    <view class="step-bar-wrap">
                      <view class="funnel-bar bar-reimburse" :style="{ width: Math.max(5, Math.min(100, result.breakdown.effectiveRatio)) + '%' }"></view>
                    </view>
                    <view class="fund-split-tags">
                      <view class="fund-tag tag-base">
                        <text class="ft-label">基本统筹基金支付：</text>
                        <text class="ft-val font-mono">¥{{ (result.breakdown.baseReimbursed || 0).toLocaleString() }}</text>
                      </view>
                      <view class="fund-tag tag-cata" v-if="(result.breakdown.catastrophicReimbursed || 0) > 0">
                        <text class="ft-label">大病互助补充报销：</text>
                        <text class="ft-val font-mono">+¥{{ (result.breakdown.catastrophicReimbursed || 0).toLocaleString() }}</text>
                      </view>
                    </view>
                  </view>
                </view>

                <!-- Step 5: 个人最终预计自理 -->
                <view class="funnel-step step-personal">
                  <view class="step-spine">
                    <view class="spine-node node-rose"><text class="node-num">5</text></view>
                  </view>
                  <view class="step-content">
                    <view class="step-top-row">
                      <view class="step-label-group">
                        <text class="step-label text-rose font-bold">Step 5. 个人最终预计自理总额</text>
                        <text class="personal-ratio-pill">自理占比 {{ (100 - (result.breakdown.effectiveRatio || 0)).toFixed(1) }}%</text>
                      </view>
                      <text class="step-val text-rose font-bold font-mono">
                        ¥ {{ (result.breakdown.personalPayTotal || 0).toLocaleString() }}
                      </text>
                    </view>
                    <view class="step-bar-wrap">
                      <view class="funnel-bar bar-personal" :style="{ width: Math.max(5, Math.min(100, Math.round(100 - result.breakdown.effectiveRatio))) + '%' }"></view>
                    </view>
                    <view class="personal-split-grid">
                      <view class="ps-item">
                        <text class="ps-label">起付线自付：</text>
                        <text class="ps-val font-mono">¥{{ (result.breakdown.personalDeductiblePaid || 0).toLocaleString() }}</text>
                      </view>
                      <view class="ps-item">
                        <text class="ps-label">政策内按比自负：</text>
                        <text class="ps-val font-mono">¥{{ (result.breakdown.personalSpanCoPay || 0).toLocaleString() }}</text>
                      </view>
                      <view class="ps-item" v-if="((result.breakdown.nonInsuranceCost || 0) + (result.breakdown.classBPriorPay || result.breakdown.classBSelfPay || 0)) > 0">
                        <text class="ps-label">自费及先行自付：</text>
                        <text class="ps-val font-mono">¥{{ ((result.breakdown.nonInsuranceCost || 0) + (result.breakdown.classBPriorPay || result.breakdown.classBSelfPay || 0)).toLocaleString() }}</text>
                      </view>
                    </view>
                    <view class="step-conservation-notice">
                      <text class="sc-note">★ 资金物理守恒：医保报销 (¥{{ (result.breakdown.totalReimbursed || 0).toLocaleString() }}) + 个人自理 (¥{{ (result.breakdown.personalPayTotal || 0).toLocaleString() }}) = 总花费 (¥{{ (result.breakdown.totalCost || 0).toLocaleString() }})</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 政策备忘 (仅当存在特别说明时呈现) -->
            <view class="policy-memo" v-if="result.policyNotes.length > 0">
              <view v-for="(note, idx) in result.policyNotes" :key="idx" class="memo-row">
                <text class="memo-dot">·</text>
                <text class="memo-txt">{{ note }}</text>
              </view>
            </view>

            <!-- 极简法定政策公文依据与溯源条 (Sleek Statutory Citation Strip) -->
            <view class="sleek-doc-strip">
              <view class="sds-main" @click.stop="openDocUrl">
                <view class="sds-dot"></view>
                <text class="sds-label">公文依据：</text>
                <text class="sds-title">{{ result.officialDocUsed?.title || currentCityOption.cityName + '基本医疗保险政策' }}</text>
                <text class="sds-num font-mono" v-if="result.officialDocUsed?.docNumber">({{ result.officialDocUsed.docNumber }})</text>
              </view>
              <view class="sds-actions">
                <view class="sds-btn" @click.stop="openDocUrl" v-if="result.officialDocUsed?.officialUrl" title="查阅公文原文">
                  <text class="sds-btn-txt">查阅原文 ↗</text>
                </view>
                <view class="sds-btn" @click.stop="copyDocQuote" v-if="result.officialDocUsed?.summaryQuote" title="复制公文条款">
                  <text class="sds-btn-txt">复制依据</text>
                </view>
                <view class="sds-btn" @click.stop="openPortalUrl" v-if="currentCityData?.officialPortalUrl" title="访问医保官网">
                  <text class="sds-btn-txt">{{ currentCityOption.cityName }}官网</text>
                </view>
                <view class="sds-btn sds-btn-hotline" @click.stop="handleCallHotline" title="拨打12393医保专线">
                  <text class="sds-btn-txt">12393专线</text>
                </view>
              </view>
            </view>

            <view class="estimate-footnote-bar">
              <text class="footnote-txt">* 测算基于地方公开医保公文规则，实际以出院结算单为准</text>
            </view>
          </view>

          <!-- 空状态 -->
          <view class="empty-receipt-wrap" v-else>
            <view class="empty-svg-wrap">
              <svg class="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
            </view>
            <text class="empty-title">等待输入费用金额</text>
            <text class="empty-desc">在左侧输入医疗花费并选择就医参数，右侧将自动调取 {{ currentCityOption.cityName }} 公开医保政策规则估算自费与报销明细</text>
          </view>
        </view>
      </view>

      <!-- 移动端底部悬浮结果快捷卡片 (仅手机视口展示，实时反馈估算结论) -->
      <view class="mobile-calc-float-bar" v-if="result">
        <view class="float-bar-left" @click="scrollToReceipt">
          <text class="float-tag">预估报销</text>
          <view class="float-val-group">
            <text class="float-currency">¥</text>
            <text class="float-amount">{{ displayReimbursed.toLocaleString() }}</text>
          </view>
          <text class="float-ratio">({{ displayRatio }}%)</text>
        </view>
        <view class="float-bar-right">
          <view class="float-voucher-tag" @click.stop="showVoucherModal = true">
            <text class="tag-txt">生成凭据单</text>
          </view>
          <text class="float-cta" @click="scrollToReceipt">明细 ↓</text>
        </view>
      </view>
    </view>

    <!-- 医保报销预估凭据单/海报弹窗 -->
    <EstimateVoucherModal
      :visible="showVoucherModal"
      :cityName="currentCityOption.cityName"
      :provinceName="currentProvince.name"
      :cityCode="currentCityOption.cityCode"
      :insuranceType="form.insuranceType"
      :isRetiree="form.isRetiree"
      :treatmentType="form.treatmentType"
      :hospitalTierName="hospitalTiers[selectedHospitalIndex].name"
      :remoteLabel="remoteOptions[selectedRemoteIndex].label"
      :totalCost="form.totalCost"
      :result="result"
      @close="showVoucherModal = false"
    />

    <!-- 全站通用规范页脚 (含作者联系方式、微信公众号与开源仓库) -->
    <AppFooter />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import AppFooter from '../../components/AppFooter.vue';
import EstimateVoucherModal from '../../components/EstimateVoucherModal.vue';
import PolicyTooltip from '../../components/PolicyTooltip.vue';
import type { HospitalTier, CalculateRequest, CalculateResult } from '../../data/types';
import { provinceList, getCitiesByProvinceCode, getCityData } from '../../data/provinces';
import { allCities } from '../../data';
import { calculateReimbursement } from '../../engine/calculator';

const showVoucherModal = ref(false);
const openDropdown = ref<string | null>(null);

function navToTab(url: string) {
  uni.switchTab({ url });
}

function closeAllDropdowns() {
  openDropdown.value = null;
}

function toggleDropdown(type: string) {
  openDropdown.value = openDropdown.value === type ? null : type;
}

function selectProvince(idx: number) {
  selectedProvinceIndex.value = idx;
  selectedCityIndex.value = 0;
  openDropdown.value = null;
  persistCityChoice();
  triggerCalculation();
}

function selectCity(idx: number) {
  selectedCityIndex.value = idx;
  openDropdown.value = null;
  persistCityChoice();
  triggerCalculation();
}

function persistCityChoice() {
  if (currentCityOption.value?.cityCode) {
    uni.setStorageSync('selected_medical_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_city_code', currentCityOption.value.cityCode);
    uni.setStorageSync('selected_policy_type', form.insuranceType);
  }
}

function selectHospital(idx: number) {
  selectedHospitalIndex.value = idx;
  openDropdown.value = null;
  triggerCalculation();
}

function selectRemote(idx: number) {
  selectedRemoteIndex.value = idx;
  openDropdown.value = null;
  triggerCalculation();
}

const selectedProvinceIndex = ref(0);
const currentProvince = computed(() => provinceList[selectedProvinceIndex.value]);

const cityOptions = computed(() => getCitiesByProvinceCode(currentProvince.value.code));
const selectedCityIndex = ref(0);
const currentCityOption = computed(() => {
  const list = cityOptions.value;
  if (!list || list.length === 0) {
    return { cityCode: '610100', cityName: '西安市', provinceCode: '610000', hasData: true };
  }
  return list[selectedCityIndex.value] || list[0];
});
const currentCityData = computed(() => getCityData(currentCityOption.value.cityCode));

const showSearchModal = ref(false);
const citySearchQuery = ref('');
const filteredSearchCities = computed(() => {
  const q = citySearchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return allCities
    .filter(c => c.cityName.toLowerCase().includes(q) || c.provinceName.toLowerCase().includes(q))
    .slice(0, 10);
});

function selectSearchedCity(item: { cityCode: string; provinceCode: string }) {
  const pIndex = provinceList.findIndex(p => p.code === item.provinceCode);
  if (pIndex !== -1) {
    selectedProvinceIndex.value = pIndex;
    const cities = getCitiesByProvinceCode(item.provinceCode);
    const cIndex = cities.findIndex(c => c.cityCode === item.cityCode);
    if (cIndex !== -1) {
      selectedCityIndex.value = cIndex;
    }
  }
  showSearchModal.value = false;
  citySearchQuery.value = '';
  persistCityChoice();
  triggerCalculation();
}

function onSearchConfirm() {
  if (filteredSearchCities.value.length > 0) {
    selectSearchedCity(filteredSearchCities.value[0]);
  }
}

const form = reactive<{
  insuranceType: 'employee' | 'resident';
  isRetiree: boolean;
  treatmentType: 'outpatient' | 'inpatient';
  hospitalizationCount: 1 | 2 | 3;
  totalCost: string;
  nonInsuranceCost: string;
}>({
  insuranceType: 'employee',
  isRetiree: false,
  treatmentType: 'inpatient',
  hospitalizationCount: 1,
  totalCost: '10000',
  nonInsuranceCost: ''
});

function setHospitalizationCount(count: 1 | 2 | 3) {
  triggerHaptic();
  form.hospitalizationCount = count;
  triggerCalculation();
}

const quickAmounts = [1000, 3000, 10000, 30000, 50000];
function formatQuickPill(amt: number): string {
  if (amt >= 10000) {
    return '¥' + (amt / 10000) + '万';
  }
  return '¥' + amt;
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

function switchInsuranceType(type: 'employee' | 'resident') {
  triggerHaptic();
  form.insuranceType = type;
  persistCityChoice();
  triggerCalculation();
}

function switchTreatmentType(type: 'inpatient' | 'outpatient') {
  triggerHaptic();
  form.treatmentType = type;
  triggerCalculation();
}

function toggleRetiree() {
  triggerHaptic();
  form.isRetiree = !form.isRetiree;
  triggerCalculation();
}

function onCostInput() {
  selectedScenarioId.value = null;
  triggerCalculation();
}

function setQuickCost(val: number) {
  triggerHaptic();
  selectedScenarioId.value = null;
  form.totalCost = String(val);
  triggerCalculation();
}

const showExtra = ref(false);
const showDetail = ref(true);
const showFunnel = ref(false);

const hospitalTiers: { tier: HospitalTier; name: string; shortName: string }[] = [
  { tier: 'tier3_top', name: '三甲医院 (重点三甲)', shortName: '三甲医院' },
  { tier: 'tier3', name: '普通三级医院', shortName: '普通三级' },
  { tier: 'tier2', name: '二级医院 (区县级)', shortName: '二级医院' },
  { tier: 'tier1', name: '一级医院 (卫生院)', shortName: '一级医院' },
  { tier: 'community', name: '社区服务中心 / 诊所', shortName: '社区诊所' }
];
const selectedHospitalIndex = ref(0);

// 典型临床就医场景预设模型
interface MedicalScenario {
  id: string;
  name: string;
  badge: string;
  treatmentType: 'inpatient' | 'outpatient';
  hospitalTier: HospitalTier;
  totalCost: number;
  nonInsuranceCost: number;
  insuranceType?: 'employee' | 'resident';
}

const medicalScenarios: MedicalScenario[] = [
  {
    id: 'cataract',
    name: '白内障超声乳化',
    badge: '日间手术',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    totalCost: 8000,
    nonInsuranceCost: 1200
  },
  {
    id: 'appendicitis',
    name: '急性阑尾炎微创',
    badge: '普外住院',
    treatmentType: 'inpatient',
    hospitalTier: 'tier2',
    totalCost: 12000,
    nonInsuranceCost: 1500
  },
  {
    id: 'stent',
    name: '冠脉支架微创植入',
    badge: '介入重点',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3_top',
    totalCost: 35000,
    nonInsuranceCost: 3000
  },
  {
    id: 'child_pneumonia',
    name: '儿童支原体肺炎',
    badge: '儿科住院',
    treatmentType: 'inpatient',
    hospitalTier: 'tier3',
    totalCost: 6000,
    nonInsuranceCost: 600
  },
  {
    id: 'fever_clinic',
    name: '门诊发热化验开药',
    badge: '社区/门诊',
    treatmentType: 'outpatient',
    hospitalTier: 'community',
    totalCost: 600,
    nonInsuranceCost: 50
  }
];

const selectedScenarioId = ref<string | null>(null);

function applyScenario(sc: MedicalScenario) {
  triggerHaptic();
  selectedScenarioId.value = sc.id;
  form.treatmentType = sc.treatmentType;
  form.hospitalizationCount = 1;
  form.totalCost = String(sc.totalCost);
  form.nonInsuranceCost = sc.nonInsuranceCost > 0 ? String(sc.nonInsuranceCost) : '';
  
  const tierIdx = hospitalTiers.findIndex(h => h.tier === sc.hospitalTier);
  if (tierIdx !== -1) {
    selectedHospitalIndex.value = tierIdx;
  }
  
  if (sc.insuranceType) {
    form.insuranceType = sc.insuranceType;
  }
  
  triggerCalculation();
}

interface RemoteOptionItem {
  value: 'local' | 'long_term' | 'transfer' | 'unfiled_emergency' | 'unfiled_normal';
  label: string;
  badge: string;
  badgeClass: string;
  desc: string;
}

const remoteOptions: RemoteOptionItem[] = [
  {
    value: 'local',
    label: '本地定点医疗机构',
    badge: '标准 100%',
    badgeClass: 'badge-success',
    desc: '参保统筹区内定点医药机构，享受法定基准待遇'
  },
  {
    value: 'long_term',
    label: '异地长期居住/安置 (已备案)',
    badge: '同等 100%',
    badgeClass: 'badge-success',
    desc: '已办理跨省/跨市长期居住备案，享受与本地同等报销比例'
  },
  {
    value: 'transfer',
    label: '跨省/跨市转诊转院 (已备案)',
    badge: '合规下浮',
    badgeClass: 'badge-warning',
    desc: '参保地最高级别医院出具转诊证明并备案，合规比例微幅下调'
  },
  {
    value: 'unfiled_emergency',
    label: '异地急诊抢救 (急危重症未备案)',
    badge: '急诊直接结算',
    badgeClass: 'badge-cyan',
    desc: '突发急危重症异地救治未提前备案，视同已备案直接结算'
  },
  {
    value: 'unfiled_normal',
    label: '跨省/跨市临时自行就医 (未备案)',
    badge: '惩罚性下浮',
    badgeClass: 'badge-danger',
    desc: '未提前备案自行前往异地就医，执行惩罚性降点下浮'
  }
];
const selectedRemoteIndex = ref(0);

const currentRepeatedDeductibleRule = computed(() => {
  if (!currentCityData.value) return '';
  const pkg = form.insuranceType === 'employee' ? currentCityData.value.employee : currentCityData.value.resident;
  return pkg?.inpatient?.repeatedDeductibleRule || currentCityData.value.employee?.inpatient?.repeatedDeductibleRule || '';
});

const currentRemoteRule = computed(() => {
  if (!currentCityData.value) return null;
  return form.insuranceType === 'employee' 
    ? currentCityData.value.employee.remoteMedical 
    : currentCityData.value.resident.remoteMedical;
});

const dynamicRemoteHint = computed(() => {
  if (!currentCityData.value) return '';
  const rule = currentRemoteRule.value;
  const cityName = currentCityOption.value.cityName;
  const status = remoteOptions[selectedRemoteIndex.value].value;

  if (status === 'long_term') {
    return `【异地长期居住】已办理异地安置或长居备案，在备案就医地定点医院联网直接结算享受与${cityName}本地定点机构完全一致的报销待遇（待遇不降点）。`;
  }
  if (status === 'transfer') {
    const ratioStr = rule?.transferFiledRatio ? `（报销比例按本地标准折算 ${Math.round(rule.transferFiledRatio * 100)}%）` : '（按地方规定合规下浮5%~10%）';
    const channels = rule?.filingChannels?.length ? `推荐备案渠道：${rule.filingChannels.join('、')}。` : '';
    return `【规范转诊】经本地最高级别定点医院转诊并备案前往异地就医${ratioStr}。${channels}`;
  }
  if (status === 'unfiled_emergency') {
    const ratioStr = rule?.unfiledEmergencyRatio ? `（折算系数 ${Math.round(rule.unfiledEmergencyRatio * 100)}%）` : '（按急诊直接结算规程报销）';
    return `【急诊抢救】参保人员异地突发急危重症就医救治${ratioStr}。国家医保服务平台支持就医地免备案或通过“急诊转住院”直接联网结算。`;
  }
  if (status === 'unfiled_normal') {
    const ratioStr = rule?.unfiledNormalRatio ? `（报销比例按本地标准折算 ${Math.round(rule.unfiledNormalRatio * 100)}%）` : '（执行惩罚性降点10%~20%）';
    return `【临时自行外出就医】跨省/跨市临时自行前往异地就医未提前备案${ratioStr}。建议就医前通过“国家医保服务平台APP”或热线进行线上自助快速备案，以享受更高报销比例。`;
  }
  return '';
});

const result = ref<CalculateResult | null>(null);

const currentDocSummary = computed(() => {
  if (result.value?.officialDocUsed) {
    const doc = result.value.officialDocUsed;
    const title = doc.title || `${currentCityOption.value.cityName}基本医疗保险政策`;
    const num = doc.docNumber ? `（${doc.docNumber}）` : '';
    return `政策依据：《${title}》${num}`;
  }
  return `政策依据：《${currentCityOption.value.cityName}基本医疗保险政策》`;
});

// 高精数字滚动动效状态
const displayReimbursed = ref(0);
const displayRatio = ref(0);
const displayPersonalPay = ref(0);
let animationFrameId: any = null;

function animateNumbers(targetReimbursed: number, targetRatio: number, targetPersonal: number) {
  const startReimbursed = displayReimbursed.value;
  const startRatio = displayRatio.value;
  const startPersonal = displayPersonalPay.value;
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const duration = 380; // 380ms 黄金缓动周期

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic 减速曲线
    const ease = 1 - Math.pow(1 - progress, 3);

    displayReimbursed.value = Math.round(startReimbursed + (targetReimbursed - startReimbursed) * ease);
    displayRatio.value = parseFloat((startRatio + (targetRatio - startRatio) * ease).toFixed(1));
    displayPersonalPay.value = Math.round(startPersonal + (targetPersonal - startPersonal) * ease);

    if (progress < 1) {
      if (typeof requestAnimationFrame !== 'undefined') {
        animationFrameId = requestAnimationFrame(step);
      }
    } else {
      displayReimbursed.value = targetReimbursed;
      displayRatio.value = targetRatio;
      displayPersonalPay.value = targetPersonal;
    }
  }

  if (animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(animationFrameId);
  }
  if (typeof requestAnimationFrame !== 'undefined') {
    animationFrameId = requestAnimationFrame(step);
  } else {
    displayReimbursed.value = targetReimbursed;
    displayRatio.value = targetRatio;
    displayPersonalPay.value = targetPersonal;
  }
}

function triggerCalculation() {
  const cost = parseFloat(form.totalCost);
  if (isNaN(cost) || cost <= 0) {
    result.value = null;
    displayReimbursed.value = 0;
    displayRatio.value = 0;
    displayPersonalPay.value = 0;
    return;
  }

  const cityCode = currentCityOption.value.hasData ? currentCityOption.value.cityCode : '610100';

  const req: CalculateRequest = {
    cityCode: cityCode,
    insuranceType: form.insuranceType,
    isRetiree: form.isRetiree,
    treatmentType: form.treatmentType,
    hospitalTier: hospitalTiers[selectedHospitalIndex.value].tier,
    remoteStatus: remoteOptions[selectedRemoteIndex.value].value,
    totalCost: cost,
    nonInsuranceCost: parseFloat(form.nonInsuranceCost) || 0,
    hospitalizationCount: form.treatmentType === 'inpatient' ? form.hospitalizationCount : 1
  };

  try {
    const res = calculateReimbursement(req);
    result.value = res;
    animateNumbers(
      res.breakdown.totalReimbursed,
      res.breakdown.effectiveRatio,
      res.breakdown.personalPayTotal
    );
  } catch (err: any) {
    uni.showToast({ title: err.message || '计算出错', icon: 'none' });
  }
}

function copyText(data: string, successMsg: string) {
  uni.setClipboardData({
    data,
    showToast: false,
    success: () => {
      uni.showToast({ title: successMsg, icon: 'success' });
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(data).then(() => {
          uni.showToast({ title: successMsg, icon: 'success' });
        }).catch(() => {
          uni.showToast({ title: '复制失败，请长按手动复制', icon: 'none' });
        });
      } else {
        uni.showToast({ title: '复制失败，请长按手动复制', icon: 'none' });
      }
    }
  });
}

function copyDocNumber() {
  if (!result.value?.officialDocUsed?.docNumber) return;
  copyText(result.value.officialDocUsed.docNumber, '发文字号已复制');
}

function copyDocQuote() {
  if (!result.value?.officialDocUsed) return;
  const doc = result.value.officialDocUsed;
  const quote = `【政策公文依据】《${doc.title}》（${doc.docNumber}）：\n“${doc.summaryQuote}”`;
  copyText(quote, '法规条款原文已复制');
}

function openPortalUrl() {
  const url = currentCityData.value?.officialPortalUrl;
  if (!url) return;
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank');
  } else {
    copyText(url, '政务官网网址已复制，可粘贴访问');
  }
}

function handleCallHotline() {
  const hotline = currentCityData.value?.hotline || '12393';
  // #ifdef MP || APP-PLUS
  uni.makePhoneCall({
    phoneNumber: hotline.replace(/[^0-9]/g, ''),
    fail: () => {
      copyText(hotline, `医保专线 ${hotline} 已复制`);
    }
  });
  // #endif
  // #ifdef H5
  if (typeof window !== 'undefined' && /mobile/i.test(navigator.userAgent)) {
    window.location.href = `tel:${hotline.replace(/[^0-9]/g, '')}`;
  } else {
    copyText(hotline, `医保专线 ${hotline} 已复制，欢迎拨打咨询`);
  }
  // #endif
}

function openDocUrl() {
  if (!result.value?.officialDocUsed?.officialUrl) return;
  const url = result.value.officialDocUsed.officialUrl;
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank');
  } else {
    copyText(url, '官方网址已复制，可粘贴访问');
  }
}

function copyReceipt() {
  if (!result.value) {
    uni.showToast({ title: '暂无估算结果', icon: 'none' });
    return;
  }
  const res = result.value;
  const b = res.breakdown;
  const city = currentCityOption.value?.cityName || '参保地';
  const insType = form.insuranceType === 'employee' ? (form.isRetiree ? '职工医保 (退休)' : '职工医保 (在职)') : '城乡居民医保';
  const hospFreq = form.treatmentType === 'inpatient' 
    ? (form.hospitalizationCount === 1 ? '首次住院' : (form.hospitalizationCount === 2 ? '二次住院' : '三次及以上住院'))
    : '';
  const treatType = form.treatmentType === 'inpatient' 
    ? `住院就医（${hospFreq}）` 
    : '普通门诊';
  const hospTier = hospitalTiers[selectedHospitalIndex.value]?.shortName || '三级医院';
  const remote = remoteOptions[selectedRemoteIndex.value]?.label || '本地就医';
  const totalCost = (parseFloat(form.totalCost) || 0).toLocaleString();
  const reimbursed = b.totalReimbursed.toLocaleString();
  const personal = b.personalPayTotal.toLocaleString();
  const basePay = b.baseReimbursed.toLocaleString();
  const cataPay = b.catastrophicReimbursed > 0 ? ` + 大病互助 ¥${b.catastrophicReimbursed.toLocaleString()}` : '';
  const deductible = b.deductibleDeducted.toLocaleString();
  const deductibleTip = b.deductibleReduction > 0 ? ` (基准¥${b.standardDeductible}，递减-¥${b.deductibleReduction})` : '';
  const eligible = b.eligibleCost.toLocaleString();
  const docTitle = res.officialDocUsed?.title || `${city}基本医疗保险政策`;
  const docNum = res.officialDocUsed?.docNumber ? `（${res.officialDocUsed.docNumber}）` : '';

  const voucher = `【医保报销估算凭据】
统筹区域：${city}
参保类型：${insType}
就医方式：${treatType}（${hospTier} | ${remote}）
医疗总费用：¥${totalCost}
------------------------
★ 医保预估统筹报销：¥${reimbursed} (预估比例 ${b.effectiveRatio}%)
  - 基本统筹基金支付：¥${basePay}${cataPay}
  - 扣除免赔起付线：¥${deductible}${deductibleTip}
  - 纳规报销基数：¥${eligible}
★ 个人预计自理：¥${personal} (占 ${(100 - b.effectiveRatio).toFixed(1)}%)
  - 资金物理守恒：医保报销 (¥${reimbursed}) + 个人自理 (¥${personal}) = 总费用 (¥${totalCost})
------------------------
参考政策依据：《${docTitle}》${docNum}
注：本结果由公开政策规则估算，仅供参考，实际报销金额请以就医定点医院出院医保结算单为准。`;

  copyText(voucher, '估算凭据已复制');
}

function scrollToReceipt() {
  uni.pageScrollTo({
    selector: '.receipt-card',
    duration: 350,
    offsetTop: -16
  });
  // #ifdef H5
  try {
    const el = document.querySelector('.receipt-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (_) {}
  // #endif
}

function syncCityFromStorage() {
  const savedCode = uni.getStorageSync('selected_medical_city_code') || uni.getStorageSync('selected_policy_city_code');
  if (savedCode && savedCode !== currentCityOption.value.cityCode) {
    for (let pIdx = 0; pIdx < provinceList.length; pIdx++) {
      const p = provinceList[pIdx];
      const cities = getCitiesByProvinceCode(p.code);
      const cIdx = cities.findIndex(c => c.cityCode === savedCode);
      if (cIdx !== -1) {
        selectedProvinceIndex.value = pIdx;
        selectedCityIndex.value = cIdx;
        break;
      }
    }
  }

  const savedType = uni.getStorageSync('selected_policy_type');
  if (savedType === 'employee' || savedType === 'resident') {
    form.insuranceType = savedType;
  }
  triggerCalculation();
}

function handleWindowClick() {
  openDropdown.value = null;
}

function handleEscapeKey() {
  openDropdown.value = null;
  showVoucherModal.value = false;
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleWindowClick);
    window.addEventListener('app-escape-key', handleEscapeKey);
  }
  syncCityFromStorage();
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleWindowClick);
    window.removeEventListener('app-escape-key', handleEscapeKey);
    if (animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
});

onShow(() => {
  syncCityFromStorage();
});
</script>

<style scoped>
/* ==========================================================================
   Apple / Google Antigravity 级 Bento Grid 工业美学控制台样式
   ========================================================================== */

/* 页面主容器 */
.page-wrapper {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
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
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 页面顶部标题与工具条 (大方朴实，左右对齐) */
.page-intro-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 0;
  flex-wrap: wrap;
  gap: 12px;
}

.intro-left {
  display: flex;
  flex-direction: column;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.08);
}

.feature-svg {
  width: 20px;
  height: 20px;
  stroke: #2563eb;
}

.page-title-stack {
  display: flex;
  flex-direction: column;
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
  line-height: 1.25;
}

.city-indicator-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 0 10px;
  height: 24px;
  border-radius: 9999px;
  box-sizing: border-box;
}

.city-indicator-txt {
  font-size: 11.5px;
  color: #2563eb;
  font-weight: 600;
  line-height: 1;
}

.page-sub-title {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  line-height: 1.5;
}

/* -------------------- 全局 SVG 尺寸保底 -------------------- */
svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  max-width: 100%;
}

/* -------------------- 2. 主工作台 Bento 栅格 -------------------- */
.bento-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 20px;
  align-items: start; /* 关键：顶部自然对齐，杜绝高度拉扯空白 */
}

/* Bento 卡片基础 */
.bento-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
}

/* -------------------- 左栏：参数录入配置器 -------------------- */
.card-lead-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
  gap: 8px;
}

.lead-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lead-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lead-svg {
  width: 16px;
  height: 16px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.lead-texts {
  display: flex;
  flex-direction: column;
}

.lead-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
}

.lead-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.quick-search-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 9999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  cursor: pointer;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &:hover {
    background: #dbeafe;
  }
}

.qs-svg {
  width: 12px;
  height: 12px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.search-trigger-txt {
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
  line-height: 1;
}

/* 城市快捷搜索面板 */
.search-panel {
  background: #f8fafc;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 36px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #0f172a;
  padding: 0 36px 0 10px;
  font-size: 13px;
  box-sizing: border-box;
}

.search-clear-btn {
  position: absolute;
  right: 10px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
}

.search-results-list {
  max-height: 180px;
  overflow-y: auto;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
}

.c-name { font-size: 13px; color: #0f172a; font-weight: 600; }
.c-prov { font-size: 11px; color: #64748b; margin-left: 6px; }
.c-action { font-size: 11.5px; color: #2563eb; font-weight: 600; }
.empty-txt { font-size: 12px; color: #64748b; padding: 8px 0; text-align: center; }

/* 配置步骤分组通用 */
.config-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
}

.group-hint {
  font-size: 11.5px;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

/* 省市下拉区域 */
.region-dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.dropdown-anchor-row {
  position: relative;
}

.col-field {
  position: relative;
}

.cyber-dropdown-trigger {
  width: 100%;
  min-height: 44px;
  height: 44px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.18s ease;

  &:hover, &.open {
    border-color: #2563eb;
    background: #eff6ff;
  }
}

.select-val {
  font-size: 13px;
  color: #0f172a;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-arrow {
  font-size: 11px;
  color: #64748b;
  transition: transform 0.2s ease;

  &.rotated {
    transform: rotate(180deg);
    color: #2563eb;
  }
}

.cyber-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 280px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  overflow-y: auto;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #f8fafc;
  }

  &.selected {
    background: #eff6ff;

    .item-name {
      color: #2563eb;
      font-weight: 700;
    }
  }
}

.dropdown-item .item-name {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.dropdown-item .item-check {
  font-size: 12px;
  color: #2563eb;
  font-weight: 700;
}

/* 医保身份切换二段钮 */
.segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.seg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
  }

  &.active {
    background: #eff6ff;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb, 0 2px 8px rgba(37, 99, 235, 0.1);

    .seg-icon {
      stroke: #2563eb;
    }

    .seg-title {
      color: #1d4ed8;
      font-weight: 700;
    }
  }
}

.seg-icon {
  width: 16px;
  height: 16px;
  stroke: #64748b;
  flex-shrink: 0;
}

.seg-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
}

/* 退休优待开关栏 */
.retiree-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  margin-top: 4px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px 12px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: #e2e8f0;
  }
}

.retiree-bar-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.retiree-label {
  font-size: 13px;
  color: #1e293b;
  font-weight: 600;
}

.retiree-badge {
  font-size: 10.5px;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.custom-switch {
  width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  position: relative;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 44px;
    height: 24px;
    border-radius: 9999px;
    background: #cbd5e1;
    transition: background-color 0.2s ease;
  }

  &.checked {
    &::before {
      background: #10b981;
    }

    .switch-handle {
      transform: translateX(20px);
    }
  }
}

.switch-handle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  position: absolute;
  top: 12px;
  left: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

/* 就医类型与机构等级栅格 */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sub-segmented-control {
  display: flex;
  min-height: 44px;
  height: 44px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
  box-sizing: border-box;
}

.sub-seg-btn {
  flex: 1;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &.active {
    background: #ffffff;
    border: 1px solid rgba(37, 99, 235, 0.2);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .sub-seg-txt {
      color: #2563eb;
      font-weight: 700;
    }
  }
}

.sub-seg-txt {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

/* 住院就诊频次阶梯选择器 (流线极简 3 段药丸) */
.admission-frequency-bar {
  margin-top: 8px;
  background: transparent;
  border: none;
  padding: 0;
}

.frequency-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.frequency-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.frequency-badge {
  font-size: 10.5px;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  padding: 1px 6px;
  border-radius: 4px;
}

.frequency-segmented-control {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
}

.freq-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 2px 4px;
  background: transparent;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }

  &.active {
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);

    .freq-txt {
      color: #2563eb;
      font-weight: 700;
    }

    .freq-sub {
      color: #3b82f6;
      font-weight: 600;
    }
  }
}

.freq-txt {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  line-height: 1.2;
}

.freq-sub {
  font-size: 10px;
  color: #64748b;
  margin-top: 1px;
  line-height: 1.1;
}

.frequency-policy-hint {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  margin-top: 6px;
  padding: 5px 8px;
  background: #f8fafc;
  border-radius: 6px;
}

.hint-bullet {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.3;
}

.hint-txt {
  font-size: 11px;
  color: #475569;
  line-height: 1.45;
  flex: 1;
}

/* 就医地点与异地备案前置控件 */
.group-remote-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.remote-trigger-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.mini-rate-tag {
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.remote-dropdown-menu {
  max-height: 340px !important;
}

.remote-dropdown-item {
  padding: 10px 12px !important;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remote-item-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.remote-item-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.item-rate-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
}

.item-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.35;
}

/* 异地政策指引卡片 */
.remote-policy-guide {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 6px;
}

.rpg-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 3px;
}

.rpg-svg {
  stroke: #2563eb;
  flex-shrink: 0;
}

.rpg-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #1d4ed8;
}

.rpg-content {
  font-size: 11px;
  color: #1e40af;
  line-height: 1.45;
  display: block;
}

/* 状态徽章标准配色 */
.badge-success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-warning {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.badge-cyan {
  background: #e0f2fe;
  color: #0284c7;
  border: 1px solid #bae6fd;
}

.badge-danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.badge-amber {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.badge-orange {
  background: #ffedd5;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.badge-gray {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

/* 门诊政策提醒 */
.policy-notice {
  margin-top: 6px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-left: 3px solid #3b82f6;
  border-radius: 8px;
  padding: 8px 10px;
}

.notice-badge {
  font-size: 11px;
  color: #1d4ed8;
  font-weight: 700;
  display: block;
  margin-bottom: 2px;
}

.notice-content {
  font-size: 11.5px;
  color: #1e3a8a;
  line-height: 1.45;
  display: block;
}

/* 大金额主输入框 */
.amount-input-box {
  display: flex;
  align-items: center;
  height: 46px;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 14px;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
}

.currency-symbol {
  font-size: 20px;
  color: #2563eb;
  font-weight: 800;
  margin-right: 8px;
  user-select: none;
}

.main-amount-input {
  flex: 1;
  height: 100%;
  color: #0f172a;
  font-size: 20px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  border: none;
  outline: none;
  background: transparent;
}

.currency-unit {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  user-select: none;
}

/* 预设金额药丸行 */
.preset-pill-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 4px;
}

.preset-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 4px;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }

  &.active {
    background: #eff6ff;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;

    .pill-text {
      color: #1d4ed8;
      font-weight: 700;
    }
  }
}

.pill-text {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
}

/* 典型就医临床场景滚动胶囊 */
.scenario-lead-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 6px;
}

.scenario-lead-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sc-svg {
  color: #0284c7;
  flex-shrink: 0;
}

.scenario-lead-txt {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.scenario-chips-scroll {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.scenario-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.18s ease;
  user-select: none;

  &:hover {
    background: #f0fdf4;
    border-color: #86efac;
  }

  &.active {
    background: #f0fdf4;
    border-color: #10b981;
    box-shadow: 0 0 0 1px #10b981, 0 2px 6px rgba(16, 185, 129, 0.12);

    .sc-badge {
      background: #10b981;
      color: #ffffff;
    }

    .sc-name {
      color: #065f46;
      font-weight: 700;
    }

    .sc-price {
      color: #047857;
      font-weight: 700;
    }
  }
}

.sc-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 4px;
  background: #e2e8f0;
  color: #475569;
  font-weight: 600;
  transition: all 0.18s ease;
}

.sc-name {
  font-size: 12px;
  color: #334155;
  font-weight: 600;
  transition: color 0.18s ease;
}

.sc-price {
  font-size: 11.5px;
  color: #059669;
  font-weight: 700;
}

/* 高级自费折叠面板 (流线去嵌套) */
.advanced-collapse-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 4px 0;
}

.collapse-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.trigger-label {
  font-size: 12px;
  color: #475569;
  font-weight: 600;
}

.trigger-arrow {
  font-size: 11px;
  color: #64748b;
}

.collapse-content {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.collapse-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 11.5px;
  color: #64748b;
  margin-bottom: 4px;
}

.collapse-input {
  width: 100%;
  height: 34px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  padding: 0 10px;
  font-size: 12.5px;
  box-sizing: border-box;
}

/* -------------------- 右栏：报销测算凭证看板 -------------------- */
.receipt-card {
  border-color: #e2e8f0;
}

.receipt-inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.receipt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.receipt-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.receipt-title {
  font-size: 15px;
  color: #0f172a;
  font-weight: 700;
}

.desktop-title-txt { display: inline; }
.mobile-title-txt { display: none; }

.receipt-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.voucher-gen-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #2563eb;
  border: 1px solid #2563eb;
  padding: 4px 10px;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.25);
  transition: all 0.15s ease;

  &:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }

  &:active {
    transform: scale(0.96);
  }
}

.voucher-btn-svg {
  width: 12px;
  height: 12px;
  stroke: #ffffff;
  flex-shrink: 0;
}

.voucher-btn-txt {
  font-size: 11.5px;
  color: #ffffff;
  font-weight: 700;
  line-height: 1;
}

.copy-voucher-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  &:active {
    transform: scale(0.96);
  }
}

.copy-btn-svg {
  width: 12px;
  height: 12px;
  stroke: #475569;
  flex-shrink: 0;
}

.copy-voucher-btn:hover .copy-btn-svg {
  stroke: #2563eb;
}

.copy-btn-txt {
  font-size: 11.5px;
  color: #475569;
  font-weight: 600;
  line-height: 1;
}

.copy-voucher-btn:hover .copy-btn-txt {
  color: #2563eb;
}

/* 双核英雄结算看板 (高度极度精炼，左右双核对比，高反差大字，无冗余厚度) */
.result-hero-board {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%);
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px 18px 14px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.hero-split-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-half {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.half-personal {
  align-items: flex-end;
  text-align: right;
}

.half-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.half-tag-txt {
  font-size: 13px;
  font-weight: 800;
}

.tag-cyan .half-tag-txt {
  color: #0369a1;
}

.tag-amber .half-tag-txt {
  color: #b45309;
}

.half-tag-pct {
  font-size: 10.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 9999px;
  line-height: 1.2;
}

.tag-cyan .half-tag-pct {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.tag-amber .half-tag-pct {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.half-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.half-yen {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.half-val {
  font-size: 34px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.text-cyan { color: #0284c7 !important; }
.text-amber { color: #d97706 !important; }
.text-emerald { color: #059669 !important; }
.text-dim { color: #64748b !important; }
.text-blue { color: #2563eb !important; }
.font-bold { font-weight: 700 !important; }
.font-mono { font-family: monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas; }

.half-hint {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}

.hero-center-divider {
  width: 1px;
  height: 48px;
  background: #e2e8f0;
  margin: 0 16px;
  flex-shrink: 0;
}

.hero-mini-meter {
  display: flex;
  height: 5px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 10px;
}

.mini-bar {
  height: 100%;
  transition: width 0.35s ease;
}

.bar-cyan {
  background: linear-gradient(90deg, #2563eb 0%, #0284c7 100%);
}

.bar-amber {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
}

/* 首屏副标：公文依据与 12393 专线快捷方式 */
.hero-authority-sub {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.authority-doc-box {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  transition: opacity 0.15s ease;
}

.authority-doc-box:hover {
  opacity: 0.85;
}

.authority-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.authority-doc-title {
  font-size: 11.5px;
  color: #334155;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.authority-hotline-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 32px;
  padding: 4px 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.authority-hotline-btn:hover {
  background: #dbeafe;
}

.authority-hotline-svg {
  width: 12px;
  height: 12px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.authority-hotline-txt {
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
  line-height: 1;
}

/* 资金流向阶梯式漏斗可视化卡片 (48px 可折叠精算明细) */
.stepped-funnel-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  transition: all 0.25s ease;
}

.funnel-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}

.funnel-card-header.has-bottom-border {
  border-bottom: 1px solid #f1f5f9;
  padding: 12px 0 10px;
}

.fch-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.funnel-icon-box {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
}

.funnel-header-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.funnel-header-badge {
  font-size: 10.5px;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.funnel-toggle-txt {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.funnel-ladder-body {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  padding-bottom: 14px;
  gap: 0;
}

.funnel-step {
  display: flex;
  position: relative;
  padding-bottom: 14px;
}

.funnel-step.step-personal {
  padding-bottom: 0;
}

.step-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 26px;
  flex-shrink: 0;
  margin-right: 10px;
}

.spine-node {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  flex-shrink: 0;
}

.node-num {
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
}

.node-slate { background: #0f172a; color: #ffffff; }
.node-amber { background: #d97706; color: #ffffff; }
.node-indigo { background: #4f46e5; color: #ffffff; }
.node-cyan { background: #0284c7; color: #ffffff; }
.node-rose { background: #e11d48; color: #ffffff; }

.spine-line {
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  margin: 3px 0;
}

.step-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.step-label-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.step-label {
  font-size: 12.5px;
  color: #1e293b;
}

.text-indigo { color: #4338ca !important; }
.text-rose { color: #e11d48 !important; }

.step-val {
  font-size: 13.5px;
  font-variant-numeric: tabular-nums;
}

.step-bar-wrap {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
  margin: 2px 0;
}

.funnel-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.bar-total { background: #0f172a; }
.bar-eligible { background: linear-gradient(90deg, #f59e0b, #d97706); }
.bar-deductible { background: linear-gradient(90deg, #6366f1, #4f46e5); }
.bar-reimburse { background: linear-gradient(90deg, #0284c7, #10b981); }
.bar-personal { background: linear-gradient(90deg, #f43f5e, #e11d48); }

.step-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.35;
}

.step-sub-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.sub-badge {
  font-size: 10.5px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.step-result-bubble {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 5px 8px;
  margin-top: 2px;
}

.bubble-indigo {
  background: #f5f3ff;
  border-color: #c4b5fd;
}

.bubble-txt {
  font-size: 11px;
  color: #475569;
}

.discount-pill {
  font-size: 10px;
  color: #4338ca;
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.deductible-detail-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.deductible-tag {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.tag-discount {
  color: #4338ca;
  background: #e0e7ff;
  font-weight: 700;
}

.tag-applied {
  color: #0284c7;
  background: #e0f2fe;
  font-weight: 700;
}

.ratio-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  padding: 1px 6px;
  border-radius: 9999px;
}

.personal-ratio-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: #e11d48;
  background: #ffe4e6;
  border: 1px solid #fecdd3;
  padding: 1px 6px;
  border-radius: 9999px;
}

.fund-split-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.fund-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 6px;
}

.tag-base {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.tag-cata {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

.ft-label {
  font-size: 10.5px;
}

.ft-val {
  font-weight: 700;
}

.personal-split-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 6px;
  padding: 6px 8px;
  margin-top: 2px;
}

.ps-item {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
}

.ps-label {
  color: #9f1239;
  font-size: 10.5px;
}

.ps-val {
  color: #e11d48;
  font-weight: 700;
}

.step-conservation-notice {
  margin-top: 4px;
  padding: 4px 6px;
  background: #f8fafc;
  border-radius: 4px;
}

.sc-note {
  font-size: 10.5px;
  color: #059669;
  font-weight: 600;
}

/* 政策备忘 */
.policy-memo {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.memo-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 3px;

  &:last-child {
    margin-bottom: 0;
  }
}

.memo-dot {
  color: #2563eb;
  font-size: 13px;
  line-height: 1;
}

.memo-txt {
  font-size: 11.5px;
  color: #475569;
  line-height: 1.45;
  flex: 1;
}

/* 极简法定政策公文依据与溯源条 */
.sleek-doc-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.sds-main {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
  cursor: pointer;
}

.sds-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

.sds-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  flex-shrink: 0;
}

.sds-title {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sds-num {
  font-size: 11px;
  color: #2563eb;
  flex-shrink: 0;
}

.sds-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.sds-btn {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
  }
}

.sds-btn-txt {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.sds-btn:hover .sds-btn-txt {
  color: #2563eb;
}

.sds-btn-hotline {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.sds-btn-hotline .sds-btn-txt {
  color: #059669;
}

.estimate-footnote-bar {
  padding: 0 4px;
  text-align: center;
}

.footnote-txt {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  display: block;
}

/* 空状态 */
.empty-receipt-wrap {
  padding: 48px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-svg-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.empty-svg {
  width: 26px;
  height: 26px;
  stroke: #94a3b8;
}

.empty-title { font-size: 14.5px; font-weight: 700; color: #475569; }
.empty-desc { font-size: 12px; color: #64748b; margin-top: 6px; line-height: 1.5; max-width: 300px; }

/* -------------------- 3. 响应式布局：移动端自适应 -------------------- */
@media (min-width: 768px) {
  .page {
    padding: clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px);
  }
}

@media (min-width: 768px) and (max-height: 780px) {
  .page {
    padding: 10px 18px;
  }
  .bento-card {
    padding: 18px 20px;
  }
}

/* -------------------- 移动端响应式断点 (max-width: 767px) -------------------- */
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

  .desktop-title-txt { display: none !important; }
  .mobile-title-txt { display: inline !important; }

  .receipt-header {
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding-bottom: 10px;
  }

  .receipt-title {
    font-size: 13.5px !important;
  }

  .receipt-actions {
    margin-left: auto;
    gap: 6px;
  }

  .copy-voucher-btn {
    padding: 3px 8px !important;
  }

  .copy-btn-txt {
    font-size: 11px !important;
  }

  .ratio-pill {
    padding: 3px 8px !important;
  }

  .ratio-text {
    font-size: 11px !important;
  }

  .page-intro-bar {
    padding: 0 !important;
  }

  .page {
    padding: 14px 12px 36px;
  }

  .hero-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .hero-left {
    align-items: flex-start;
    gap: 12px;
  }

  .page-main-title {
    font-size: 19px;
  }

  .title-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .toolbar-mode-row {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .bento-card {
    padding: 20rpx 18rpx;
    overflow: hidden;
  }
}

.mobile-calc-float-bar {
  display: none;
}

/* -------------------- 手机端及超窄视口 (max-width: 520px) -------------------- */
@media (max-width: 520px) {
  .page {
    padding: 10px 10px 48px;
  }

  .page-main-title {
    font-size: 19px;
  }

  .bento-card {
    padding: 20rpx 18rpx;
  }

  .price-number {
    font-size: 28px;
  }

  .preset-pill-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    flex-wrap: nowrap;
  }

  .preset-pill {
    min-width: 0;
    min-height: 44px;
    padding: 6px 2rpx;
    box-sizing: border-box;
  }

  .pill-text {
    font-size: 12px;
    white-space: nowrap;
  }

  .region-dropdown-grid {
    gap: 8px;
  }

  .content-box {
    padding: 12px 12px calc(145px + env(safe-area-inset-bottom)) !important;
  }

  .mobile-calc-float-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: calc(56px + env(safe-area-inset-bottom));
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.92);
    color: #ffffff;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    padding: 9px 12px 9px 14px;
    border-radius: 9999rpx;
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08);
    z-index: 990;
    cursor: pointer;
    box-sizing: border-box;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  }

  .mobile-calc-float-bar:active {
    transform: scale(0.98);
  }

  .float-bar-left {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
  }

  .float-tag {
    font-size: 11px;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.12);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .float-val-group {
    display: flex;
    align-items: baseline;
    gap: 2px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .float-currency {
    font-size: 12px;
    color: #38bdf8;
    font-weight: 700;
  }

  .float-amount {
    font-size: 17px;
    font-weight: 800;
    color: #38bdf8;
    font-variant-numeric: tabular-nums;
  }

  .float-ratio {
    font-size: 11px;
    color: #93c5fd;
    font-weight: 600;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .float-bar-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .float-voucher-tag {
    background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
    color: #ffffff;
    padding: 5px 11px;
    border-radius: 9999rpx;
    font-size: 11.5px;
    font-weight: 700;
    margin-right: 6px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.45);
    white-space: nowrap;
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.95);
    }
  }

  .float-cta {
    font-size: 11px;
    font-weight: 600;
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 5px 9px;
    border-radius: 9999rpx;
    white-space: nowrap;
    transition: background 0.15s ease;

    &:active {
      background: rgba(255, 255, 255, 0.22);
    }
  }
}

@media (max-width: 380px) {
  .hero-curr {
    font-size: 14px;
  }

  .hero-val {
    font-size: 20px;
  }

  .hero-pct-pill {
    display: none;
  }

  .region-dropdown-grid,
  .identity-grid,
  .treatment-type-grid {
    grid-template-columns: 1fr;
  }
}

/* ==================== 微动效与微交互 ==================== */
.nav-pill-item,
.search-pill-btn,
.cyber-dropdown-trigger,
.dropdown-item,
.id-card,
.treat-btn,
.preset-pill,
.collapse-trigger,
.doc-compact-bar,
.retiree-bar,
.voucher-gen-btn,
.copy-voucher-btn,
.freq-btn,
.mini-copy-pill,
.quote-copy-btn,
.gov-shortcut-item {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
}

.nav-pill-item:hover,
.id-card:hover,
.treat-btn:hover,
.preset-pill:hover,
.doc-compact-bar:hover,
.search-pill-btn:hover,
.mini-copy-pill:hover,
.quote-copy-btn:hover,
.gov-shortcut-item:hover {
  transform: translateY(-1px) scale(1.006);
}

.nav-pill-item:active,
.cyber-dropdown-trigger:active,
.dropdown-item:active,
.id-card:active,
.treat-btn:active,
.preset-pill:active,
.collapse-trigger:active,
.doc-compact-bar:active,
.retiree-bar:active,
.voucher-gen-btn:active,
.copy-voucher-btn:active,
.freq-btn:active,
.mini-copy-pill:active,
.quote-copy-btn:active,
.gov-shortcut-item:active {
  transform: translateY(1px) scale(0.98) !important;
  transition-duration: 0.08s !important;
}
</style>
