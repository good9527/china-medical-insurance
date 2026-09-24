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

          <!-- 模块 1: 参保统筹区 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">1. 参保统筹区</text>
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

          <!-- 模块 2: 参保身份类别 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">2. 医保身份类别</text>
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

          <!-- 模块 3: 就医场景与定点机构 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">3. 就医场景与机构等级</text>
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

            <!-- 门诊政策提醒 -->
            <view class="policy-notice" v-if="form.treatmentType === 'outpatient'">
              <text class="notice-badge">门诊政策提醒</text>
              <text class="notice-content" v-if="form.insuranceType === 'employee'">
                {{ currentCityData.cityName }}职工门诊共济：{{ currentCityData.employee.outpatient.annualDeductible > 0 ? ('年起付线 ¥' + currentCityData.employee.outpatient.annualDeductible + (currentCityData.employee.outpatient.annualDeductibleRetiree ? '（退休优待¥' + currentCityData.employee.outpatient.annualDeductibleRetiree + '）；' : '；')) : '0元起付直接报销；' }}{{ currentCityData.employee.outpatient.annualCap >= 9999999 ? '门诊不设最高封顶线（上不封顶）。' : ('在职年封顶 ¥' + currentCityData.employee.outpatient.annualCap + '，退休年封顶 ¥' + (currentCityData.employee.outpatient.annualCapRetiree || currentCityData.employee.outpatient.annualCap) + '。') }}
              </text>
              <text class="notice-content" v-else>
                {{ currentCityData.cityName }}居民门诊统筹：年封顶额度 ¥{{ currentCityData.resident.outpatient.annualCap }}/人，{{ currentCityData.resident.outpatient.annualDeductible > 0 ? ('年起付标准 ¥' + currentCityData.resident.outpatient.annualDeductible + '；') : '定点基层机构免起付线即时结算。' }}
              </text>
            </view>
          </view>

          <!-- 模块 4: 预估医疗花费与快捷芯片 -->
          <view class="config-group">
            <view class="group-header">
              <text class="group-label">4. 预估医疗总花费</text>
            </view>
            <view class="amount-input-box">
              <text class="currency-symbol">¥</text>
              <input 
                type="digit" 
                class="main-amount-input" 
                v-model="form.totalCost" 
                placeholder="0"
                @input="triggerCalculation"
              />
              <text class="currency-unit">元</text>
            </view>

            <!-- 快捷预设金额药丸 -->
            <view class="preset-pill-row">
              <view 
                class="preset-pill" 
                v-for="amt in quickAmounts" 
                :key="amt"
                :class="{ active: form.totalCost === String(amt) }"
                @click="setQuickCost(amt)"
              >
                <text class="pill-text">{{ formatQuickPill(amt) }}</text>
              </view>
            </view>
          </view>

          <!-- 模块 5: 异地与自费折叠面板 -->
          <view class="advanced-collapse-card">
            <view class="collapse-trigger" @click="showExtra = !showExtra">
              <view class="trigger-label-group">
                <text class="trigger-label">异地就医与全自费项目</text>
                <PolicyTooltip title="什么是异地就医与全自费？" text="异地就医未备案直接结算通常会按政策下调比例（惩罚性降点10%~20%）；丙类自费药品与特需服务不属于基本医保目录，需个人全额自理。" />
              </view>
              <text class="trigger-arrow">{{ showExtra ? '收起 ▴' : '展开 ▾' }}</text>
            </view>

            <view class="collapse-content" v-if="showExtra">
              <view class="collapse-field">
                <text class="field-label">异地就医备案状态</text>
                <view class="dropdown-anchor-row" @click.stop>
                  <view class="cyber-dropdown-trigger" :class="{ open: openDropdown === 'remote' }" @click.stop="toggleDropdown('remote')">
                    <text class="select-val">{{ remoteOptions[selectedRemoteIndex].label }}</text>
                    <text class="select-arrow" :class="{ rotated: openDropdown === 'remote' }">▾</text>
                  </view>
                  <view class="cyber-dropdown-menu" v-if="openDropdown === 'remote'" @click.stop>
                    <view 
                      class="dropdown-item" 
                      v-for="(r, idx) in remoteOptions" 
                      :key="r.value"
                      :class="{ selected: selectedRemoteIndex === idx }"
                      @click.stop="selectRemote(idx)"
                    >
                      <text class="item-name">{{ r.label }}</text>
                      <text class="item-check" v-if="selectedRemoteIndex === idx">✓</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="collapse-field mt-12">
                <text class="field-label">全自费项目费用 (丙类药/特需耗材，不可报销额)</text>
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
                <!-- 统筹报销 -->
                <view class="hero-half half-reimbursed">
                  <view class="half-tag tag-cyan">
                    <text class="half-tag-txt">医保统筹报销</text>
                    <text class="half-tag-pct">{{ displayRatio }}%</text>
                  </view>
                  <view class="half-price-row">
                    <text class="half-yen text-cyan">¥</text>
                    <text class="half-val text-cyan">{{ displayReimbursed.toLocaleString() }}</text>
                  </view>
                  <text class="half-hint">出院窗口联网直接结算抵扣</text>
                </view>

                <view class="hero-center-divider"></view>

                <!-- 个人自理 -->
                <view class="hero-half half-personal">
                  <view class="half-tag tag-amber">
                    <text class="half-tag-txt">个人预计自理</text>
                    <text class="half-tag-pct">{{ (100 - (result.breakdown.effectiveRatio || 0)).toFixed(1) }}%</text>
                  </view>
                  <view class="half-price-row">
                    <text class="half-yen text-amber">¥</text>
                    <text class="half-val text-amber">{{ displayPersonalPay.toLocaleString() }}</text>
                  </view>
                  <text class="half-hint">含起付线及按比自负金额</text>
                </view>
              </view>

              <!-- 极细构成双色比例条 -->
              <view class="hero-mini-meter">
                <view class="mini-bar bar-cyan" :style="{ width: result.breakdown.effectiveRatio + '%' }"></view>
                <view class="mini-bar bar-amber" :style="{ width: Math.max(0, 100 - result.breakdown.effectiveRatio) + '%' }"></view>
              </view>
            </view>

            <!-- 费用推导明细清单 (步骤流水化，零冗余，一表道尽) -->
            <view class="flow-breakdown-card">
              <view class="flow-card-head" @click="showDetail = !showDetail">
                <view class="fch-left">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="fch-svg">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <text class="fch-title">费用推导分项明细</text>
                  <text class="fch-badge">推导过程</text>
                </view>
                <text class="fch-toggle">{{ showDetail ? '收起 ▴' : '展开 ▾' }}</text>
              </view>

              <view class="flow-list" v-if="showDetail">
                <view class="flow-row">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-1">1</text>
                    <text class="flow-label">总医疗花费</text>
                  </view>
                  <text class="flow-val font-mono">¥{{ (parseFloat(form.totalCost) || 0).toLocaleString() }}</text>
                </view>

                <view class="flow-row" v-if="result.breakdown.nonInsuranceDeducted > 0">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-sub">-</text>
                    <text class="flow-label">自费/乙类先行自付</text>
                  </view>
                  <text class="flow-val text-dim font-mono">- ¥{{ result.breakdown.nonInsuranceDeducted.toLocaleString() }}</text>
                </view>

                <view class="flow-row">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-2">2</text>
                    <text class="flow-label">扣除免赔起付线</text>
                    <PolicyTooltip title="什么是起付线门槛？" text="医保统筹基金支付的最低起跑门槛。低于起付线由个人自理；超过起付线且属于政策范围内的合规费用，医保才开始按比例报销。" />
                  </view>
                  <text class="flow-val text-amber font-mono">- ¥{{ result.breakdown.deductibleDeducted.toLocaleString() }}</text>
                </view>

                <view class="flow-row highlight-row">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-3">3</text>
                    <text class="flow-label font-bold">实际纳规报销基数</text>
                    <PolicyTooltip title="什么是实际纳规报销基数？" text="总医疗花费扣除自费项目及起付线后，真正进入政策报销池的基准金额。" />
                  </view>
                  <text class="flow-val font-bold font-mono">¥{{ Math.max(0, result.breakdown.eligibleCost - result.breakdown.deductibleDeducted).toLocaleString() }}</text>
                </view>

                <view class="flow-row">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-4">4</text>
                    <text class="flow-label">统筹执行报销比例</text>
                    <PolicyTooltip title="什么是统筹报销比例？" text="当前统筹区对于该级别医院及参保人身份所适用的法定公文报销比例。" />
                  </view>
                  <text class="flow-val text-blue font-bold font-mono">{{ Math.max(0, result.breakdown.eligibleCost - result.breakdown.deductibleDeducted) > 0 ? Math.round((result.breakdown.baseReimbursed / (result.breakdown.eligibleCost - result.breakdown.deductibleDeducted)) * 100) : 0 }}%</text>
                </view>

                <view class="flow-row result-row">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-check">✓</text>
                    <text class="flow-label text-cyan font-bold">统筹基金报销金额</text>
                    <PolicyTooltip title="什么是统筹基金报销？" text="经起付线扣除后，由基本医疗保险统筹基金直接承担的减免金额。" />
                  </view>
                  <text class="flow-val text-cyan font-bold font-mono">¥{{ result.breakdown.baseReimbursed.toLocaleString() }}</text>
                </view>

                <view class="flow-row" v-if="result.breakdown.catastrophicReimbursed > 0">
                  <view class="flow-row-name">
                    <text class="flow-step-num num-plus">+</text>
                    <text class="flow-label text-emerald font-bold">大病互助二次报销</text>
                    <PolicyTooltip title="什么是大病互助二次报销？" text="合规自付费用突破大病起付线后，自动启动大病二次梯级报销。" />
                  </view>
                  <text class="flow-val text-emerald font-bold font-mono">+ ¥{{ result.breakdown.catastrophicReimbursed }}</text>
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

            <!-- 极简公文依据与合规注脚 (单行精悍收口) -->
            <view class="doc-compact-bar" @click="openDocUrl">
              <view class="dcb-left">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" class="dcb-svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <text class="dcb-tag">政策依据</text>
                <text class="dcb-title">{{ result.officialDocUsed?.title || currentCityOption.cityName + '医保政策' }}</text>
              </view>
              <text class="dcb-action">查看公文 ↗</text>
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
import { ref, reactive, computed, onMounted } from 'vue';
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
  totalCost: string;
  nonInsuranceCost: string;
}>({
  insuranceType: 'employee',
  isRetiree: false,
  treatmentType: 'inpatient',
  totalCost: '10000',
  nonInsuranceCost: ''
});

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

function setQuickCost(val: number) {
  triggerHaptic();
  form.totalCost = String(val);
  triggerCalculation();
}

const showExtra = ref(false);
const showDetail = ref(true);

const hospitalTiers: { tier: HospitalTier; name: string; shortName: string }[] = [
  { tier: 'tier3_top', name: '三甲医院 (重点三甲)', shortName: '三甲医院' },
  { tier: 'tier3', name: '普通三级医院', shortName: '普通三级' },
  { tier: 'tier2', name: '二级医院 (区县级)', shortName: '二级医院' },
  { tier: 'tier1', name: '一级医院 (卫生院)', shortName: '一级医院' },
  { tier: 'community', name: '社区服务中心 / 诊所', shortName: '社区诊所' }
];
const selectedHospitalIndex = ref(0);

const remoteOptions = [
  { value: 'local', label: '本地定点医院就医' },
  { value: 'long_term', label: '异地长期居住 (已备案)' },
  { value: 'transfer', label: '跨市/省转诊 (已备案)' },
  { value: 'unfiled_normal', label: '外地就医 (未提前备案)' }
];
const selectedRemoteIndex = ref(0);

const result = ref<CalculateResult | null>(null);

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
    remoteStatus: remoteOptions[selectedRemoteIndex.value].value as any,
    totalCost: cost,
    nonInsuranceCost: parseFloat(form.nonInsuranceCost) || 0
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

function openDocUrl() {
  if (!result.value?.officialDocUsed?.officialUrl) return;
  const url = result.value.officialDocUsed.officialUrl;
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank');
  } else {
    uni.setClipboardData({
      data: url,
      success: () => {
        uni.showToast({ title: '官方网址已复制，可粘贴访问', icon: 'none' });
      }
    });
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
  const treatType = form.treatmentType === 'inpatient' ? '住院就医' : '普通门诊';
  const hospTier = hospitalTiers[selectedHospitalIndex.value]?.shortName || '三级医院';
  const remote = remoteOptions[selectedRemoteIndex.value]?.label || '本地就医';
  const totalCost = (parseFloat(form.totalCost) || 0).toLocaleString();
  const reimbursed = b.totalReimbursed.toLocaleString();
  const personal = b.personalPayTotal.toLocaleString();
  const basePay = (b.baseReimbursed + b.catastrophicReimbursed).toLocaleString();
  const deductible = b.deductibleDeducted.toLocaleString();
  const eligible = b.eligibleCost.toLocaleString();
  const docTitle = res.officialDocUsed?.title || `${city}基本医疗保险政策`;

  const voucher = `【医保报销估算凭据】
统筹区域：${city}
参保类型：${insType}
就医方式：${treatType}（${hospTier} | ${remote}）
医疗总费用：¥${totalCost}
------------------------
★ 医保预估统筹报销：¥${reimbursed} (预估比例 ${b.effectiveRatio}%)
  - 统筹基金支付：¥${basePay}
  - 扣除起付线：¥${deductible}
  - 纳规报销基数：¥${eligible}
★ 个人预计自理：¥${personal}
------------------------
参考政策依据：《${docTitle}》
注：本结果由公开政策规则估算，仅供参考，实际报销金额请以就医定点医院出院医保结算单为准。`;

  uni.setClipboardData({
    data: voucher,
    showToast: false,
    success: () => {
      uni.showToast({ title: '估算凭据已复制', icon: 'success' });
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(voucher).then(() => {
          uni.showToast({ title: '估算凭据已复制', icon: 'success' });
        }).catch(() => {
          uni.showToast({ title: '复制失败，请截图保存', icon: 'none' });
        });
      } else {
        uni.showToast({ title: '复制失败，请截图保存', icon: 'none' });
      }
    }
  });
}

function scrollToReceipt() {
  uni.pageScrollTo({
    selector: '.receipt-card',
    duration: 350,
    offsetTop: -16
  });
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

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
      openDropdown.value = null;
    });
  }
  syncCityFromStorage();
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
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03), 0 8px 24px -4px rgba(15, 23, 42, 0.04);
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
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  cursor: pointer;
  flex-shrink: 0;
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
  height: 40px;
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
  height: 42px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
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
  margin-top: 4px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: #cbd5e1;
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
  height: 24px;
  border-radius: 9999px;
  background: #cbd5e1;
  position: relative;
  transition: background-color 0.2s ease;
  flex-shrink: 0;

  &.checked {
    background: #10b981;

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
  top: 2px;
  left: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 就医类型与机构等级栅格 */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sub-segmented-control {
  display: flex;
  height: 40px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
  box-sizing: border-box;
}

.sub-seg-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
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

/* 门诊政策提醒 */
.policy-notice {
  margin-top: 4px;
  background: #eff6ff;
  border-left: 3px solid #2563eb;
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 2px;
  border-radius: 8px;
  cursor: pointer;
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

/* 高级自费折叠面板 */
.advanced-collapse-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
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

/* 双核英雄结算看板 (高度极度精炼，左右双核对比，去除了重复数字) */
.result-hero-board {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 14px 16px 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(37, 99, 235, 0.04);
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
  font-size: 12px;
  font-weight: 700;
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
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.half-val {
  font-size: 26px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
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
  height: 44px;
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

/* 费用推导分项明细卡片 */
.flow-breakdown-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.flow-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  user-select: none;
}

.fch-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fch-svg {
  width: 14px;
  height: 14px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.fch-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.fch-badge {
  font-size: 10.5px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
}

.fch-toggle {
  font-size: 11.5px;
  color: #64748b;
}

.flow-list {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.flow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f8fafc;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.flow-row.highlight-row {
  background: #f8fafc;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 6px;
}

.flow-row.result-row {
  background: #eff6ff;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 6px;
}

.flow-row-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flow-step-num {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &.num-sub {
    background: #fee2e2;
    color: #b91c1c;
  }

  &.num-check {
    background: #e0f2fe;
    color: #0369a1;
  }

  &.num-plus {
    background: #d1fae5;
    color: #047857;
  }
}

.flow-label {
  font-size: 12.5px;
  color: #334155;
}

.flow-val {
  font-size: 13px;
  color: #0f172a;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
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

/* 极简公文依据与合规注脚 (单行精悍收口) */
.doc-compact-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;

    .dcb-action {
      color: #1d4ed8;
    }
  }
}

.dcb-left {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.dcb-svg {
  width: 13px;
  height: 13px;
  stroke: #2563eb;
  flex-shrink: 0;
}

.dcb-tag {
  font-size: 10.5px;
  color: #2563eb;
  font-weight: 700;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 1px 5px;
  border-radius: 4px;
  flex-shrink: 0;
}

.dcb-title {
  font-size: 12px;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.dcb-action {
  font-size: 11.5px;
  color: #2563eb;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: 8px;
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
    padding: 10rpx 2rpx;
  }

  .pill-text {
    font-size: 12px;
    white-space: nowrap;
  }

  .region-dropdown-grid {
    gap: 8px;
  }

  .content-box {
    padding: 12px 12px calc(110px + env(safe-area-inset-bottom)) !important;
  }

  .mobile-calc-float-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: calc(56px + env(safe-area-inset-bottom));
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.94);
    color: #ffffff;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 10px 14px;
    border-radius: 9999rpx;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.12);
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
  }

  .float-currency {
    font-size: 12px;
    color: #60a5fa;
    font-weight: 700;
  }

  .float-amount {
    font-size: 17px;
    font-weight: 800;
    color: #60a5fa;
  }

  .float-ratio {
    font-size: 11px;
    color: #93c5fd;
    font-weight: 600;
    white-space: nowrap;
  }

  .float-bar-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .float-voucher-tag {
    background: #0284c7;
    color: #ffffff;
    padding: 4px 9px;
    border-radius: 9999rpx;
    font-size: 11px;
    font-weight: 700;
    margin-right: 6px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4);
    white-space: nowrap;

    &:active {
      transform: scale(0.95);
    }
  }

  .float-cta {
    font-size: 11px;
    font-weight: 700;
    color: #ffffff;
    background: #2563eb;
    padding: 5px 10px;
    border-radius: 9999rpx;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
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
.copy-voucher-btn {
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
.search-pill-btn:hover {
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
.copy-voucher-btn:active {
  transform: translateY(1px) scale(0.98) !important;
  transition-duration: 0.08s !important;
}
</style>
