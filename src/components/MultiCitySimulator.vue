<template>
  <view class="multi-city-simulator-wrapper">
    <!-- 1. 标头与模式简介卡 -->
    <view class="sim-intro-card">
      <view class="sim-intro-header">
        <view class="sim-header-title-row">
          <view class="sim-icon-box">
            <svg class="sim-lead-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </view>
          <view class="sim-titles">
            <text class="sim-title">跨城医保待遇实测对比模拟器</text>
            <text class="sim-subtitle">设定相同就医花费与人员场景，跨城市一键并排精算报销额、起付线实扣、大病兜底与官方红头条款</text>
          </view>
        </view>
        <view class="sim-tags-row">
          <view class="sim-tag tag-blue">
            <svg class="tag-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <text>348 统筹区全域支持</text>
          </view>
          <view class="sim-tag tag-emerald">
            <svg class="tag-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <text>100% 资金物理守恒</text>
          </view>
          <view class="sim-tag tag-rose">
            <svg class="tag-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            <text>红头公文法条溯源</text>
          </view>
        </view>
      </view>

      <!-- 热门跨城对标快捷预设芯片 -->
      <view class="preset-preset-bar">
        <view class="preset-label-wrap">
          <svg class="preset-flame-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <text class="preset-title">热门对标组合：</text>
        </view>
        <view class="preset-chips-scroll">
          <view 
            class="sim-preset-chip" 
            v-for="p in popularMultiCityPresets" 
            :key="p.id"
            @click="applyPreset(p.cities)"
          >
            <text class="chip-name">{{ p.name }}</text>
            <text class="chip-sub">({{ p.label }})</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 统筹区选择卡 (支持 2~3 个地级市) -->
    <view class="city-selector-card">
      <view class="csc-head">
        <text class="csc-title">选择对比统筹区（支持 2~3 个城市自由对比）</text>
        <view class="csc-actions" v-if="selectedCities.length < 3">
          <view class="add-city-btn" @click="addThirdCity">
            <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <text>添加第 3 城对比</text>
          </view>
        </view>
      </view>

      <view class="city-slots-grid" :class="'slots-' + selectedCities.length">
        <view 
          class="city-slot-col" 
          v-for="(cityCode, idx) in selectedCities" 
          :key="'slot_' + idx"
          :class="getSlotColClass(idx)"
        >
          <view class="slot-badge-row">
            <text class="slot-badge" :class="getSlotBadgeClass(idx)">统筹区 {{ idx === 0 ? 'A (基准)' : (idx === 1 ? 'B' : 'C') }}</text>
            <view class="remove-slot-btn" v-if="idx === 2" @click.stop="removeThirdCity" title="移除第3城">
              <svg class="remove-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <text class="remove-txt">移除</text>
            </view>
          </view>

          <!-- 城市选择触发器 -->
          <view class="slot-picker-trigger" @click.stop="openCityPicker(idx)">
            <view class="slot-city-info">
              <text class="slot-city-name">{{ getCityName(cityCode) }}</text>
              <text class="slot-prov-name" v-if="getProvinceName(cityCode) !== getCityName(cityCode)">({{ getProvinceName(cityCode) }})</text>
            </view>
            <svg class="slot-caret-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </view>
        </view>
      </view>
    </view>

    <!-- 同等就医场景配置面板 (Identical Healthcare Scenario) -->
    <view class="scenario-panel-card">
      <view class="spc-head">
        <text class="spc-title">设定同等就医场景与人员参数（各城市在完全相同场景下并排精算）</text>
      </view>

      <view class="scenario-form-grid">
        <!-- 参数 1: 医保身份类型 -->
        <view class="form-field-group">
          <text class="field-label">医保身份类别：</text>
          <view class="seg-btn-group">
            <view 
              class="seg-option-btn" 
              :class="{ active: scenario.insuranceType === 'employee' }"
              @click="scenario.insuranceType = 'employee'; triggerHaptic()"
            >
              <svg class="seg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <text>城镇职工医保</text>
            </view>
            <view 
              class="seg-option-btn" 
              :class="{ active: scenario.insuranceType === 'resident' }"
              @click="scenario.insuranceType = 'resident'; triggerHaptic()"
            >
              <svg class="seg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <text>城乡居民医保</text>
            </view>
          </view>
        </view>

        <!-- 参数 2: 退休优待 (仅职工生效) -->
        <view class="form-field-group" v-if="scenario.insuranceType === 'employee'">
          <text class="field-label">人员在职/退休状态：</text>
          <view class="retiree-toggle-bar" @click="scenario.isRetiree = !scenario.isRetiree; triggerHaptic()">
            <view class="retiree-info">
              <text class="retiree-state-txt">{{ scenario.isRetiree ? '退休人员 (享受法定倾斜优待)' : '在职职工 (基准统筹待遇)' }}</text>
              <text class="retiree-bonus-tag" v-if="scenario.isRetiree">+3%~5% 比例上浮</text>
            </view>
            <view class="custom-switch" :class="{ checked: scenario.isRetiree }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>

        <!-- 参数 3: 就医场景 (住院 vs 门诊) -->
        <view class="form-field-group">
          <text class="field-label">就医就诊类型：</text>
          <view class="seg-btn-group">
            <view 
              class="seg-option-btn" 
              :class="{ active: scenario.treatmentType === 'inpatient' }"
              @click="scenario.treatmentType = 'inpatient'; triggerHaptic()"
            >
              <svg class="seg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <text>住院治疗</text>
            </view>
            <view 
              class="seg-option-btn" 
              :class="{ active: scenario.treatmentType === 'outpatient' }"
              @click="scenario.treatmentType = 'outpatient'; triggerHaptic()"
            >
              <svg class="seg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <text>普通门诊</text>
            </view>
          </view>
        </view>

        <!-- 参数 4: 医疗机构等级 -->
        <view class="form-field-group">
          <text class="field-label">就医医疗机构级别：</text>
          <view class="hospital-tier-chips">
            <view 
              class="tier-chip" 
              v-for="t in hospitalTierOptions" 
              :key="t.key"
              :class="{ active: scenario.hospitalTier === t.key }"
              @click="scenario.hospitalTier = t.key; triggerHaptic()"
            >
              <text class="tier-chip-name">{{ t.label }}</text>
              <text class="tier-chip-sub">{{ t.sub }}</text>
            </view>
          </view>
        </view>

        <!-- 参数 5: 年内住院频次 (仅住院显示) -->
        <view class="form-field-group" v-if="scenario.treatmentType === 'inpatient'">
          <view class="freq-label-row">
            <text class="field-label">自然年度内住院就诊频次：</text>
            <text class="freq-badge" v-if="(scenario.hospitalizationCount ?? 1) > 1">起付阶梯递减</text>
          </view>
          <view class="frequency-bar">
            <view 
              class="freq-item-btn" 
              :class="{ active: scenario.hospitalizationCount === 1 }"
              @click="scenario.hospitalizationCount = 1; triggerHaptic()"
            >
              <text class="freq-title">首次住院</text>
              <text class="freq-desc">全额基准起付门槛</text>
            </view>
            <view 
              class="freq-item-btn" 
              :class="{ active: scenario.hospitalizationCount === 2 }"
              @click="scenario.hospitalizationCount = 2; triggerHaptic()"
            >
              <text class="freq-title">第 2 次住院</text>
              <text class="freq-desc">享梯次减半/定额递减</text>
            </view>
            <view 
              class="freq-item-btn" 
              :class="{ active: scenario.hospitalizationCount === 3 }"
              @click="scenario.hospitalizationCount = 3; triggerHaptic()"
            >
              <text class="freq-title">第 3 次及以上</text>
              <text class="freq-desc">免收/极低保底起付</text>
            </view>
          </view>
        </view>

        <!-- 参数 6: 就医地与异地就医状态 (5档标定) -->
        <view class="form-field-group">
          <text class="field-label">就医地点与异地就医备案：</text>
          <view class="remote-chips-grid">
            <view 
              class="remote-chip" 
              v-for="r in remoteOptions" 
              :key="r.key"
              :class="{ active: scenario.remoteStatus === r.key }"
              @click="scenario.remoteStatus = r.key; triggerHaptic()"
            >
              <view class="rc-top">
                <text class="rc-name">{{ r.label }}</text>
                <text class="rc-rate" :class="r.badgeClass">{{ r.badge }}</text>
              </view>
              <text class="rc-desc">{{ r.desc }}</text>
            </view>
          </view>
        </view>

        <!-- 参数 7: 医疗总花费输入与预设芯片 -->
        <view class="form-field-group full-width-group">
          <text class="field-label">预估定点机构医疗总花费（元）：</text>
          <view class="amount-input-container">
            <text class="currency-tag">¥</text>
            <input 
              type="digit" 
              class="cost-number-input font-mono" 
              v-model="costInputStr" 
              placeholder="请输入医疗花费"
              @blur="validateAndFormatCost"
            />
            <view class="cost-unit-tag">元整</view>
          </view>

          <!-- 快捷金额芯片 -->
          <view class="cost-quick-chips">
            <text class="cqc-label">快捷场景：</text>
            <view 
              class="cost-chip" 
              v-for="amt in quickCostAmounts" 
              :key="'amt_' + amt"
              :class="{ active: scenario.totalCost === amt }"
              @click="setQuickCost(amt)"
            >
              <text>{{ formatCostLabel(amt) }}</text>
            </view>
          </view>
        </view>

        <!-- 可折叠高级项：目录外全自费与乙类先行自付 -->
        <view class="full-width-group advanced-collapse">
          <view class="collapse-head" @click="showAdvancedCost = !showAdvancedCost">
            <svg class="adv-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <text class="adv-title">细化自费项（丙类全自费与乙类先行自付）</text>
            <text class="adv-toggle">{{ showAdvancedCost ? '收起 ▴' : '展开微调 ▾' }}</text>
          </view>
          <view class="collapse-body" v-if="showAdvancedCost">
            <view class="adv-grid">
              <view class="adv-field">
                <text class="adv-label">目录外丙类全自费（元）：</text>
                <input 
                  type="digit" 
                  class="adv-input font-mono" 
                  :value="scenario.nonInsuranceCost || ''" 
                  @input="onNonInsuranceCostInput"
                  placeholder="无全自费填0" 
                />
              </view>
              <view class="adv-field">
                <text class="adv-label">乙类药品耗材金额（元）：</text>
                <input 
                  type="digit" 
                  class="adv-input font-mono" 
                  :value="scenario.classBCost || ''" 
                  @input="onClassBCostInput"
                  placeholder="先行自付基数" 
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 4. 精算并排对比看板 (Side-by-side Comparative Actuarial Cards) -->
    <view class="comparison-results-section" v-if="simReport">
      <view class="crs-head">
        <view class="crs-title-wrap">
          <svg class="crs-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <text class="crs-title">并排精算账单与胜出维度透视</text>
        </view>
        <text class="crs-sub">医疗总费用：¥{{ scenario.totalCost.toLocaleString() }} · {{ scenario.insuranceType === 'employee' ? (scenario.isRetiree ? '退休职工' : '在职职工') : '城乡居民' }} · {{ getHospitalTierName(scenario.hospitalTier) }}</text>
      </view>

      <!-- 智能 Actuary 洞察结论卡 -->
      <view class="actuary-insight-banner">
        <view class="aib-crest">
          <svg class="crest-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </view>
        <view class="aib-texts">
          <text class="aib-lead">精算对比结论：</text>
          <text class="aib-item" v-for="(insight, idx) in simReport.keyInsights" :key="'ins_' + idx">{{ insight }}</text>
        </view>
      </view>

      <!-- 并排对比卡片网格 -->
      <view class="side-by-side-grid" :class="'grid-' + simReport.cities.length">
        <view 
          class="actuarial-city-card" 
          v-for="(city, idx) in simReport.cities" 
          :key="'act_' + city.cityCode"
          :class="getCardThemeClass(idx, city)"
        >
          <!-- 卡片顶栏：统筹区名称与胜出荣誉徽章 -->
          <view class="acc-top-bar">
            <view class="acc-city-stack">
              <view class="acc-city-row">
                <text class="acc-city-name">{{ city.cityName }}</text>
                <text class="acc-prov-tag" v-if="city.provinceName !== city.cityName">{{ city.provinceName }}</text>
              </view>
              <text class="acc-slot-label">统筹区 {{ idx === 0 ? 'A (基准)' : (idx === 1 ? 'B' : 'C') }}</text>
            </view>

            <!-- 胜出徽章 (4大维度) -->
            <view class="acc-winner-badges">
              <view class="winner-badge badge-gold" v-if="city.isWinnerReimbursed">
                <svg class="wb-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <text>报销最高</text>
              </view>
              <view class="winner-badge badge-emerald" v-if="city.isWinnerLowestOutPocket">
                <svg class="wb-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <text>自负最少</text>
              </view>
              <view class="winner-badge badge-cyan" v-if="city.isWinnerLowestDeductible">
                <svg class="wb-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                <text>门槛最低</text>
              </view>
              <view class="winner-badge badge-purple" v-if="city.isWinnerHighestCatastrophic">
                <svg class="wb-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <text>大病救助最高</text>
              </view>
            </view>
          </view>

          <!-- 英雄双核结算指标 (统筹报销 vs 个人自理) -->
          <view class="acc-hero-box">
            <view class="acc-hero-col col-reimbursed">
              <view class="hero-label-row">
                <text class="hero-label text-cyan">医保统筹报销</text>
                <text class="hero-pct-pill bg-cyan-soft">{{ city.reimbursementRatio }}%</text>
              </view>
              <view class="hero-val-row">
                <text class="hero-yen text-cyan">¥</text>
                <text class="hero-val text-cyan font-mono font-bold">{{ city.totalReimbursed.toLocaleString() }}</text>
              </view>
              <text class="hero-sub text-cyan-dark">出院联网直接结算</text>
            </view>

            <view class="acc-hero-divider"></view>

            <view class="acc-hero-col col-personal">
              <view class="hero-label-row">
                <text class="hero-label text-amber">个人预计自理</text>
                <text class="hero-pct-pill bg-amber-soft">{{ (100 - city.reimbursementRatio).toFixed(1) }}%</text>
              </view>
              <view class="hero-val-row">
                <text class="hero-yen text-amber">¥</text>
                <text class="hero-val text-amber font-mono font-bold">{{ city.personalPayTotal.toLocaleString() }}</text>
              </view>
              <text class="hero-sub text-amber-dark">含起付线与政策自负</text>
            </view>
          </view>

          <!-- 资金流比例能量条 -->
          <view class="acc-ratio-meter">
            <view class="meter-fill meter-cyan" :style="{ width: city.reimbursementRatio + '%' }"></view>
            <view class="meter-fill meter-amber" :style="{ width: (100 - city.reimbursementRatio) + '%' }"></view>
          </view>

          <!-- 相对基准统筹区 A 的差额比较 (仅 B 与 C 显示，严格守恒 ΔR = -ΔP) -->
          <view class="acc-delta-badge" v-if="idx > 0">
            <text class="delta-label">相比统筹区 A：</text>
            <text 
              class="delta-val font-mono"
              :class="city.deltaReimbursedVsCityA >= 0 ? 'text-green' : 'text-red'"
            >
              {{ formatDeltaText(city) }}
            </text>
          </view>

          <!-- 精算账目明细表 (5步精算账目拆解) -->
          <view class="acc-breakdown-list">
            <view class="ab-item">
              <text class="ab-name">政策范围内合规可报基数</text>
              <text class="ab-val font-mono font-bold">¥{{ getEligibleCost(city).toLocaleString() }}</text>
            </view>

            <view class="ab-item item-deductible">
              <view class="ab-name-group">
                <text class="ab-name">免赔起付线实扣金额</text>
                <text class="ab-sub-note" v-if="city.deductibleReduction > 0">（减免¥{{ city.deductibleReduction }}）</text>
              </view>
              <text class="ab-val text-indigo font-mono">-¥{{ city.deductibleDeducted.toLocaleString() }}</text>
            </view>

            <view class="ab-item">
              <text class="ab-name">基本医疗统筹基金报销</text>
              <text class="ab-val text-blue font-mono font-bold">¥{{ city.baseReimbursed.toLocaleString() }}</text>
            </view>

            <view class="ab-item">
              <text class="ab-name">大病保险 / 大额互助补助</text>
              <text class="ab-val text-purple font-mono font-bold">{{ city.catastrophicReimbursed > 0 ? ('+¥' + city.catastrophicReimbursed.toLocaleString()) : '¥0 (未达起付门槛)' }}</text>
            </view>

            <view class="ab-item">
              <text class="ab-name">政策内个人按比自负</text>
              <text class="ab-val text-amber font-mono font-bold">¥{{ city.personalSpanCoPay.toLocaleString() }}</text>
            </view>

            <view class="ab-item" v-if="city.nonInsuranceAndPriorPay > 0">
              <text class="ab-name">全自费及先行自付合计</text>
              <text class="ab-val font-mono">¥{{ city.nonInsuranceAndPriorPay.toLocaleString() }}</text>
            </view>
          </view>

          <!-- 资金物理双守恒核定印记 -->
          <view class="acc-conservation-seal">
            <svg class="seal-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <text class="seal-txt">物理守恒核验：报销(¥{{ city.totalReimbursed.toLocaleString() }}) + 自理(¥{{ city.personalPayTotal.toLocaleString() }}) ≡ 总花费(¥{{ city.totalCost.toLocaleString() }})</text>
          </view>
        </view>
      </view>

      <!-- 红头法定政策公文依据与溯源凭单 (Red-Header Statutory Citations) -->
      <view class="statutory-citation-deck">
        <view class="scd-head">
          <view class="scd-title-group">
            <svg class="scd-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <text class="scd-title">红头政策公文依据溯源凭单（各统筹区法规公文一对一穿透印证）</text>
          </view>
          <text class="scd-badge">现行有效规范性公文</text>
        </view>

        <view class="scd-cards-row" :class="'cards-' + simReport.cities.length">
          <view 
            class="red-header-card" 
            v-for="(city, idx) in simReport.cities" 
            :key="'doc_' + city.cityCode"
          >
            <!-- 红头装饰条 -->
            <view class="red-header-bar">
              <text class="rh-badge">统筹区 {{ idx === 0 ? 'A' : (idx === 1 ? 'B' : 'C') }} · {{ city.cityName }}</text>
              <text class="rh-valid-status">● 现行有效</text>
            </view>

            <view class="rh-body">
              <!-- 公文全称与发文字号 -->
              <view class="rh-strip-main">
                <text class="rh-doc-title">{{ city.officialDocUsed?.title || city.cityName + '现行医疗保障政策文件' }}</text>
                <view class="rh-num-group" v-if="city.officialDocUsed?.docNumber">
                  <text class="rh-doc-num font-mono">{{ city.officialDocUsed.docNumber }}</text>
                  <view class="rh-copy-btn" @click.stop="copyText(city.officialDocUsed.docNumber, '发文字号')">
                    <svg class="copy-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <text>复制文号</text>
                  </view>
                </view>
              </view>

              <!-- 快捷操作栏：查阅原文 / 复制条款 / 医保局官网 / 12393 热线 -->
              <view class="rh-actions-bar">
                <view class="rh-act-btn" @click="handleOpenDocUrl(city.officialDocUsed?.officialUrl)" v-if="city.officialDocUsed?.officialUrl">
                  <svg class="act-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <text>查阅公文原文 ↗</text>
                </view>

                <view class="rh-act-btn" @click.stop="copyText(city.officialDocUsed?.summaryQuote || '', '法规条款原文')" v-if="city.officialDocUsed?.summaryQuote">
                  <svg class="act-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <text>复制条款</text>
                </view>

                <view class="rh-act-btn" @click="handleOpenPortalUrl(city.portalUrl)" v-if="city.portalUrl">
                  <svg class="act-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                  <text>{{ city.cityName }}医保官网</text>
                </view>

                <view class="rh-act-btn hotline-btn" @click="handleCallHotline(city.hotline || '12393')">
                  <svg class="act-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <text>{{ city.hotline || '12393' }} 专线</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 6. 城市选择弹窗 (全端兼容 H5 / 微信小程序) -->
    <view class="city-modal-overlay" v-if="openPickerSlot !== null" @click.stop="openPickerSlot = null">
      <view class="city-modal-card" @click.stop>
        <view class="modal-head">
          <text class="modal-title">选择统筹区 {{ openPickerSlot === 0 ? 'A' : (openPickerSlot === 1 ? 'B' : 'C') }}</text>
          <view class="modal-close-btn" @click="openPickerSlot = null">
            <svg class="close-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </view>
        </view>

        <!-- 搜索输入框 -->
        <view class="modal-search-box">
          <svg class="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            class="modal-input" 
            v-model="cityPickerSearchQuery" 
            placeholder="搜索地级市或省份（如：西安 / 成都 / 广州）"
          />
          <text class="clear-txt" v-if="cityPickerSearchQuery" @click="cityPickerSearchQuery = ''">×</text>
        </view>

        <!-- 城市列表 -->
        <scroll-view class="modal-city-scroll" scroll-y="true">
          <view 
            class="modal-city-item" 
            v-for="c in filteredCitiesList" 
            :key="'pick_' + c.cityCode"
            :class="{ active: openPickerSlot !== null && selectedCities[openPickerSlot] === c.cityCode }"
            @click="selectCityForSlot(c.cityCode)"
          >
            <view class="mci-left">
              <text class="mci-city">{{ c.cityName }}</text>
              <text class="mci-prov" v-if="c.provinceName !== c.cityName">{{ c.provinceName }}</text>
            </view>
            <svg class="mci-check" v-if="openPickerSlot !== null && selectedCities[openPickerSlot] === c.cityCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { 
  HospitalTier, 
  ComparisonScenarioInput, 
  CitySimulationOutcome, 
  MultiCitySimulationResult 
} from '../data/types';
import { allCities, getCityDataByCode } from '../data';
import { runMultiCitySimulation, popularMultiCityPresets } from '../engine/simulator';

// 选中的统筹区编码列表 (2~3座城市，默认北京与上海)
const selectedCities = ref<string[]>(['110100', '310100']);

// 同等就医场景配置
const scenario = reactive<ComparisonScenarioInput>({
  totalCost: 50000,
  insuranceType: 'employee',
  isRetiree: false,
  treatmentType: 'inpatient',
  hospitalTier: 'tier3',
  hospitalizationCount: 1,
  remoteStatus: 'local',
  nonInsuranceCost: 0,
  classBCost: 0,
  classBSelfPayRatio: 0.05
});

const costInputStr = ref('50000');
const showAdvancedCost = ref(false);

function setQuickCost(amount: number) {
  triggerHaptic();
  scenario.totalCost = amount;
  costInputStr.value = String(amount);
}

function validateAndFormatCost() {
  const val = Math.max(0, parseFloat(costInputStr.value) || 0);
  scenario.totalCost = Math.round(val * 100) / 100;
  costInputStr.value = String(scenario.totalCost);
}

function onNonInsuranceCostInput(e: any) {
  const val = parseFloat(e.detail?.value ?? e.target?.value ?? '0') || 0;
  scenario.nonInsuranceCost = Math.max(0, Math.round(val * 100) / 100);
}

function onClassBCostInput(e: any) {
  const val = parseFloat(e.detail?.value ?? e.target?.value ?? '0') || 0;
  scenario.classBCost = Math.max(0, Math.round(val * 100) / 100);
}

// 选项字典
const hospitalTierOptions = [
  { key: 'tier3' as HospitalTier, label: '三级公立医院', sub: '三甲重症大病救治' },
  { key: 'tier2' as HospitalTier, label: '二级定点医院', sub: '常见病多发病治疗' },
  { key: 'community' as HospitalTier, label: '基层卫生机构', sub: '社区中心/乡镇卫生院' }
];

const remoteOptions = [
  { key: 'local', label: '本地就医', badge: '100%基准', badgeClass: 'badge-blue', desc: '参保统筹区定点医疗机构' },
  { key: 'long_term', label: '异地长居备案', badge: '100%同城', badgeClass: 'badge-emerald', desc: '异地安置/长期居住合规备案' },
  { key: 'transfer', label: '异地转诊备案', badge: '下浮5%~15%', badgeClass: 'badge-orange', desc: '按规定办理规范转诊转院手续' },
  { key: 'unfiled_emergency', label: '异地急诊抢救', badge: '视同转诊', badgeClass: 'badge-amber', desc: '外出突发急症危重抢救就医' },
  { key: 'unfiled_normal', label: '临时未备案外出', badge: '惩罚性下浮', badgeClass: 'badge-rose', desc: '跨省市临时自行就医' }
] as const;

const quickCostAmounts = computed(() => {
  if (scenario.treatmentType === 'outpatient') {
    return [500, 1000, 2000, 3000, 5000];
  }
  return [10000, 30000, 50000, 100000, 200000];
});

function formatCostLabel(amt: number): string {
  if (amt >= 10000) return `¥${amt / 10000}万`;
  return `¥${amt}`;
}

function getHospitalTierName(tier: HospitalTier): string {
  if (tier === 'tier3' || tier === 'tier3_top') return '三级公立医院';
  if (tier === 'tier2') return '二级定点医院';
  return '基层卫生医疗机构';
}

function getEligibleCost(city: CitySimulationOutcome): number {
  return city.calcResult?.breakdown.eligibleCost ?? Math.max(0, city.totalCost - city.nonInsuranceAndPriorPay);
}

function formatDeltaText(city: CitySimulationOutcome): string {
  if (city.deltaReimbursedVsCityA > 0) {
    return `多报销 +¥${city.deltaReimbursedVsCityA.toLocaleString()} (自负减少 -¥${Math.abs(city.deltaPersonalPayVsCityA).toLocaleString()})`;
  }
  if (city.deltaReimbursedVsCityA < 0) {
    return `少报销 -¥${Math.abs(city.deltaReimbursedVsCityA).toLocaleString()} (自负增加 +¥${city.deltaPersonalPayVsCityA.toLocaleString()})`;
  }
  return `报销额与基准统筹区一致 (±¥0)`;
}

// 模拟测算报告响应式推导
const simReport = computed<MultiCitySimulationResult | null>(() => {
  try {
    if (selectedCities.value.length < 2) return null;
    return runMultiCitySimulation(selectedCities.value, scenario);
  } catch (e) {
    console.error('MultiCitySimulation error:', e);
    return null;
  }
});

// 统筹区操作
function addThirdCity() {
  triggerHaptic();
  if (selectedCities.value.length < 3) {
    // 默认加入西安市或尚未在列表中的省会城市
    const candidate = ['610100', '510100', '440100', '330100', '320100'].find(c => !selectedCities.value.includes(c)) || '610100';
    selectedCities.value.push(candidate);
  }
}

function removeThirdCity() {
  triggerHaptic();
  if (selectedCities.value.length > 2) {
    selectedCities.value.splice(2, 1);
  }
}

function applyPreset(cities: string[]) {
  triggerHaptic();
  selectedCities.value = [...cities];
}

// 城市选择弹窗
const openPickerSlot = ref<number | null>(null);
const cityPickerSearchQuery = ref('');

function openCityPicker(slotIndex: number) {
  triggerHaptic();
  openPickerSlot.value = slotIndex;
  cityPickerSearchQuery.value = '';
}

function selectCityForSlot(cityCode: string) {
  triggerHaptic();
  if (openPickerSlot.value !== null) {
    selectedCities.value[openPickerSlot.value] = cityCode;
    openPickerSlot.value = null;
  }
}

const allCitiesSimple = computed(() => {
  return allCities.map(c => ({
    cityCode: c.cityCode,
    cityName: c.cityName,
    provinceName: c.provinceName
  }));
});

const filteredCitiesList = computed(() => {
  const q = cityPickerSearchQuery.value.trim().toLowerCase();
  if (!q) return allCitiesSimple.value;
  return allCitiesSimple.value.filter(c => 
    c.cityName.toLowerCase().includes(q) || 
    c.provinceName.toLowerCase().includes(q)
  );
});

function getCityName(cityCode: string): string {
  const c = getCityDataByCode(cityCode);
  return c ? c.cityName : cityCode;
}

function getProvinceName(cityCode: string): string {
  const c = getCityDataByCode(cityCode);
  return c ? c.provinceName : '';
}

function getSlotColClass(idx: number): string {
  if (idx === 0) return 'col-theme-blue';
  if (idx === 1) return 'col-theme-orange';
  return 'col-theme-emerald';
}

function getSlotBadgeClass(idx: number): string {
  if (idx === 0) return 'badge-slot-blue';
  if (idx === 1) return 'badge-slot-orange';
  return 'badge-slot-emerald';
}

function getCardThemeClass(idx: number, city: CitySimulationOutcome): string {
  const classes = [`theme-slot-${idx}`];
  if (city.isWinnerReimbursed) classes.push('is-winner-card');
  return classes.join(' ');
}

// 剪贴板复制工具
function copyText(text: string, label: string) {
  triggerHaptic();
  if (!text) return;
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: `已复制${label}`, icon: 'none' });
    }
  });
}

function handleOpenDocUrl(url?: string) {
  triggerHaptic();
  if (!url) {
    uni.showToast({ title: '暂无公文直链', icon: 'none' });
    return;
  }
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
    return;
  }
  // #endif
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '公文链接已复制，请在浏览器中打开', icon: 'none', duration: 2500 });
    }
  });
}

function handleOpenPortalUrl(url?: string) {
  triggerHaptic();
  if (!url) return;
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
    return;
  }
  // #endif
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '医保官网已复制，请在浏览器中打开', icon: 'none', duration: 2500 });
    }
  });
}

function handleCallHotline(hotline: string) {
  triggerHaptic();
  uni.makePhoneCall({
    phoneNumber: hotline || '12393',
    fail: () => {
      uni.showToast({ title: `拨号失败，请手动拨打 ${hotline}`, icon: 'none' });
    }
  });
}

function triggerHaptic() {
  try {
    // #ifdef MP || APP-PLUS
    uni.vibrateShort({ type: 'light' });
    // #endif
  } catch {}
}
</script>

<style scoped>
.multi-city-simulator-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* 1. 标头简介卡 */
.sim-intro-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.sim-intro-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sim-header-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sim-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sim-lead-svg {
  width: 24px;
  height: 24px;
  color: #2563eb;
}

.sim-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sim-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.sim-subtitle {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.sim-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.sim-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.tag-svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.tag-blue { background: #eff6ff; color: #1d4ed8; }
.tag-emerald { background: #ecfdf5; color: #047857; }
.tag-rose { background: #fff1f2; color: #be123c; }

/* 预设栏 */
.preset-preset-bar {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.preset-label-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.preset-flame-svg {
  width: 14px;
  height: 14px;
  color: #ea580c;
  flex-shrink: 0;
}

.preset-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.preset-chips-scroll {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.sim-preset-chip {
  padding: 6px 14px;
  min-height: 44px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.sim-preset-chip:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.chip-name {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.chip-sub {
  font-size: 11px;
  color: #64748b;
}

/* 2. 统筹区选择卡 */
.city-selector-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 18px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.csc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.csc-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.add-city-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 44px;
  padding: 0 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.add-city-btn:hover {
  background: #dbeafe;
}

.btn-svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.city-slots-grid {
  display: grid;
  gap: 14px;
}

.city-slots-grid.slots-2 {
  grid-template-columns: repeat(2, 1fr);
}

.city-slots-grid.slots-3 {
  grid-template-columns: repeat(3, 1fr);
}

.city-slot-col {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 12px 14px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-theme-blue { border-color: #bfdbfe; background: #f0f7ff; }
.col-theme-orange { border-color: #fed7aa; background: #fffaf5; }
.col-theme-emerald { border-color: #bbf7d0; background: #f0fdf4; }

.slot-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slot-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-slot-blue { background: #dbeafe; color: #1e40af; }
.badge-slot-orange { background: #ffedd5; color: #9a3412; }
.badge-slot-emerald { background: #dcfce7; color: #166534; }

.remove-slot-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 11px;
  color: #ef4444;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
  padding: 0 8px;
  box-sizing: border-box;
}

.remove-svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.slot-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  box-sizing: border-box;
  cursor: pointer;
}

.slot-city-info {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.slot-city-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.slot-prov-name {
  font-size: 12px;
  color: #64748b;
}

.slot-caret-svg {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

/* 3. 场景录入卡 */
.scenario-panel-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 18px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.spc-head {
  margin-bottom: 16px;
}

.spc-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.scenario-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.full-width-group {
  grid-column: 1 / -1;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.seg-btn-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.seg-option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.seg-option-btn.active {
  background: #ffffff;
  color: #2563eb;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.seg-svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.retiree-toggle-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  box-sizing: border-box;
  cursor: pointer;
}

.retiree-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.retiree-state-txt {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
}

.retiree-bonus-tag {
  font-size: 11px;
  font-weight: 600;
  background: #fef3c7;
  color: #92400e;
  padding: 2px 6px;
  border-radius: 4px;
}

.custom-switch {
  width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 11px;
    left: 0;
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background: #cbd5e1;
    transition: all 0.2s ease;
  }

  &.checked {
    &::before {
      background: #2563eb;
    }

    .switch-dot {
      transform: translateX(18px);
    }
  }
}

.switch-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  position: absolute;
  top: 13px;
  left: 2px;
  transition: all 0.2s ease;
  z-index: 1;
}

.hospital-tier-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.tier-chip {
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.tier-chip.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.tier-chip-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.tier-chip.active .tier-chip-name {
  color: #1d4ed8;
}

.tier-chip-sub {
  font-size: 11px;
  color: #64748b;
}

.freq-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.freq-badge {
  font-size: 11px;
  font-weight: 600;
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
}

.frequency-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.freq-item-btn {
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.freq-item-btn.active {
  border-color: #0891b2;
  background: #ecfeff;
}

.freq-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.freq-item-btn.active .freq-title {
  color: #0e7490;
}

.freq-desc {
  font-size: 11px;
  color: #64748b;
}

.remote-chips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.remote-chip {
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.remote-chip.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.rc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rc-name {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.rc-rate {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
}

.badge-blue { background: #dbeafe; color: #1e40af; }
.badge-emerald { background: #dcfce7; color: #166534; }
.badge-orange { background: #ffedd5; color: #c2410c; }
.badge-amber { background: #fef3c7; color: #b45309; }
.badge-rose { background: #ffe4e6; color: #be123c; }

.rc-desc {
  font-size: 10px;
  color: #64748b;
}

.amount-input-container {
  display: flex;
  align-items: center;
  border: 2px solid #2563eb;
  border-radius: 10px;
  padding: 6px 14px;
  background: #ffffff;
}

.currency-tag {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
  margin-right: 6px;
}

.cost-number-input {
  flex: 1;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  border: none;
  outline: none;
}

.cost-unit-tag {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.cost-quick-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.cqc-label {
  font-size: 12px;
  color: #64748b;
}

.cost-chip {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.15s ease;
}

.cost-chip.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.advanced-collapse {
  border-top: 1px dashed #e2e8f0;
  padding-top: 12px;
}

.collapse-head {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.adv-svg {
  width: 14px;
  height: 14px;
  color: #64748b;
  flex-shrink: 0;
}

.adv-title {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.adv-toggle {
  margin-left: auto;
  font-size: 12px;
  color: #2563eb;
}

.collapse-body {
  margin-top: 10px;
}

.adv-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.adv-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.adv-label {
  font-size: 12px;
  color: #64748b;
}

.adv-input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  background: #ffffff;
}

/* 4. 精算结果区域 */
.comparison-results-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.crs-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.crs-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.crs-svg {
  width: 20px;
  height: 20px;
  color: #0891b2;
  flex-shrink: 0;
}

.crs-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.crs-sub {
  font-size: 13px;
  color: #64748b;
}

.actuary-insight-banner {
  background: #f8fafc;
  border-left: 4px solid #2563eb;
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.aib-crest {
  color: #d97706;
  flex-shrink: 0;
}

.crest-svg {
  width: 20px;
  height: 20px;
}

.aib-texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aib-lead {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.aib-item {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
}

.side-by-side-grid {
  display: grid;
  gap: 16px;
}

.side-by-side-grid.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.side-by-side-grid.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.actuarial-city-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  position: relative;
  transition: all 0.2s ease;
}

.actuarial-city-card.is-winner-card {
  border-color: #f59e0b;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(245, 158, 11, 0.08);
}

.acc-top-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.acc-city-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.acc-city-name {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.acc-prov-tag {
  font-size: 11px;
  color: #64748b;
}

.acc-slot-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.acc-winner-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.wb-svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.badge-gold { background: #fef3c7; color: #b45309; }
.badge-emerald { background: #dcfce7; color: #15803d; }
.badge-cyan { background: #cffafe; color: #0e7490; }
.badge-purple { background: #f3e8ff; color: #7e22ce; }

.acc-hero-box {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 14px;
  gap: 8px;
}

.hero-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-label {
  font-size: 12px;
  font-weight: 600;
}

.hero-pct-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
}

.bg-cyan-soft { background: #e0f2fe; color: #0369a1; }
.bg-amber-soft { background: #fef3c7; color: #b45309; }

.text-cyan { color: #0891b2; }
.text-cyan-dark { color: #0e7490; }
.text-amber { color: #d97706; }
.text-amber-dark { color: #b45309; }
.text-indigo { color: #4f46e5; }
.text-blue { color: #2563eb; }
.text-purple { color: #9333ea; }

.hero-val-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-top: 2px;
}

.hero-yen {
  font-size: 14px;
  font-weight: 700;
}

.hero-val {
  font-size: 20px;
}

.hero-sub {
  font-size: 10px;
  margin-top: 2px;
}

.acc-hero-divider {
  width: 1px;
  height: 36px;
  background: #e2e8f0;
}

.acc-ratio-meter {
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: #e2e8f0;
}

.meter-fill { height: 100%; transition: width 0.3s ease; }
.meter-cyan { background: #06b6d4; }
.meter-amber { background: #f59e0b; }

.acc-delta-badge {
  background: #f1f5f9;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delta-label { color: #64748b; font-weight: 500; }
.text-green { color: #16a34a; font-weight: 700; }
.text-red { color: #dc2626; font-weight: 700; }

.acc-breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
}

.ab-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.ab-name { color: #64748b; }
.ab-val { color: #0f172a; }
.ab-sub-note { color: #16a34a; font-size: 11px; margin-left: 4px; }

.acc-conservation-seal {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 11px;
  color: #15803d;
}

.seal-check-svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* 红头政策公文凭单 */
.statutory-citation-deck {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.scd-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.scd-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scd-svg {
  width: 18px;
  height: 18px;
  color: #be123c;
  flex-shrink: 0;
}

.scd-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.scd-badge {
  font-size: 11px;
  font-weight: 600;
  color: #be123c;
  background: #ffe4e6;
  padding: 2px 8px;
  border-radius: 4px;
}

.scd-cards-row {
  display: grid;
  gap: 16px;
}

.scd-cards-row.cards-2 {
  grid-template-columns: repeat(2, 1fr);
}

.scd-cards-row.cards-3 {
  grid-template-columns: repeat(3, 1fr);
}

.red-header-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.red-header-bar {
  background: #be123c;
  color: #ffffff;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rh-badge {
  font-size: 12px;
  font-weight: 700;
}

.rh-valid-status {
  font-size: 11px;
  font-weight: 500;
  color: #fecdd3;
}

.rh-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rh-strip-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rh-doc-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.rh-num-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.rh-doc-num {
  font-size: 11.5px;
  font-weight: 700;
  color: #be123c;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  padding: 1px 6px;
  border-radius: 4px;
}

.rh-copy-btn, .qh-copy-btn {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 11px;
  color: #2563eb;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &:hover {
    background: #dbeafe;
  }
}

.copy-svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.rh-actions-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.rh-act-btn {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #2563eb;
  }
}

.hotline-btn {
  color: #047857;
  border-color: #bbf7d0;
  background: #f0fdf4;

  &:hover {
    background: #dcfce7;
    border-color: #86efac;
    color: #065f46;
  }
}

.act-svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* 6. 城市选择弹窗 */
.city-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.city-modal-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
}

.modal-head {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.modal-close-btn {
  cursor: pointer;
  color: #64748b;
}

.close-svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.modal-search-box {
  margin: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 8px 12px;
}

.search-svg {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

.modal-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
}

.clear-txt {
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
}

.modal-city-scroll {
  max-height: 400px;
  padding: 0 20px 16px;
}

.modal-city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.modal-city-item:hover, .modal-city-item.active {
  background: #f8fafc;
}

.mci-left {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.mci-city {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.mci-prov {
  font-size: 12px;
  color: #64748b;
}

.mci-check {
  width: 16px;
  height: 16px;
  color: #2563eb;
  flex-shrink: 0;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .city-slots-grid.slots-2,
  .city-slots-grid.slots-3 {
    grid-template-columns: 1fr;
  }

  .scenario-panel-card {
    padding: 14px 16px;
  }
  
  .scenario-form-grid {
    grid-template-columns: 1fr;
  }
  
  .hospital-tier-chips,
  .remote-chips-grid {
    grid-template-columns: 1fr;
  }

  .frequency-bar {
    grid-template-columns: 1fr;
  }
  
  .side-by-side-grid.grid-2,
  .side-by-side-grid.grid-3 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .scd-cards-row.cards-2,
  .scd-cards-row.cards-3 {
    grid-template-columns: 1fr;
  }
}
</style>
