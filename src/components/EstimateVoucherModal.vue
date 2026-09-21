<template>
  <view class="voucher-modal-mask" v-if="visible" @click.self="close">
    <view class="voucher-modal-dialog">
      <!-- 弹窗顶栏 -->
      <view class="modal-head">
        <view class="modal-title-wrap">
          <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <text class="modal-title">医保报销预估凭据单</text>
        </view>
        <view class="modal-close-btn" @click="close">✕</view>
      </view>

      <!-- 凭据单主体 (用于视觉展示和打印输出) -->
      <view class="voucher-scroll-area">
        <view class="voucher-sheet" id="printable-voucher">
          <!-- 凭证防伪与机构顶标 -->
          <view class="voucher-header">
            <view class="voucher-brand">
              <view class="voucher-logo-box">
                <svg viewBox="0 0 32 32" fill="none" class="voucher-shield-svg">
                  <path d="M16 3L5 7v8c0 7.5 4.7 13.5 11 15 6.3-1.5 11-7.5 11-15V7L16 3z" fill="#0284c7" fill-opacity="0.12" stroke="#0284c7" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M16 10v12M10 16h12" stroke="#0284c7" stroke-width="2.6" stroke-linecap="round"/>
                </svg>
              </view>
              <view class="voucher-title-group">
                <text class="voucher-main-title">全国基本医疗保险待遇预估参考凭证</text>
                <text class="voucher-sub-title">NATIONAL HEALTH INSURANCE ESTIMATE MEMO</text>
              </view>
            </view>
            <view class="voucher-meta-tag">
              <text class="meta-tag-txt">公益开源 · 估算参考</text>
            </view>
          </view>

          <!-- 凭证编码与时间栏 -->
          <view class="voucher-code-bar">
            <text class="code-txt">凭据单号：<text class="font-mono">{{ voucherNo }}</text></text>
            <text class="date-txt">生成日期：{{ currentDateStr }}</text>
          </view>

          <!-- 核心信息表格 -->
          <view class="voucher-info-grid">
            <view class="info-cell">
              <text class="cell-k">参保统筹区</text>
              <text class="cell-v font-bold">{{ cityName }}（{{ provinceName }}）</text>
            </view>
            <view class="info-cell">
              <text class="cell-k">医保身份类别</text>
              <text class="cell-v">{{ insuranceTypeLabel }}</text>
            </view>
            <view class="info-cell">
              <text class="cell-k">就医场景与机构</text>
              <text class="cell-v">{{ treatmentTypeLabel }} · {{ hospitalTierName }}</text>
            </view>
            <view class="info-cell">
              <text class="cell-k">异地结算备案</text>
              <text class="cell-v">{{ remoteLabel }}</text>
            </view>
          </view>

          <!-- 费用测算核心水单清单 -->
          <view class="voucher-bill-table">
            <view class="bill-row bill-header">
              <text class="b-col-1">结算核定项目</text>
              <text class="b-col-2">金额计算与政策规则</text>
              <text class="b-col-3">预估金额 (元)</text>
            </view>

            <view class="bill-row">
              <text class="b-col-1 font-bold">总医疗花费</text>
              <text class="b-col-2">就医就诊发生的全部合规与自费总支出</text>
              <text class="b-col-3 font-mono font-bold">¥ {{ formatMoney(result?.breakdown.totalCost || totalCost) }}</text>
            </view>

            <view class="bill-row" v-if="(result?.breakdown.nonInsuranceCost || 0) > 0">
              <text class="b-col-1">全自费项目 (丙类/特需)</text>
              <text class="b-col-2">目录外不予报销项（全额个人负担）</text>
              <text class="b-col-3 font-mono text-dim">- ¥ {{ formatMoney(result?.breakdown.nonInsuranceCost || 0) }}</text>
            </view>

            <view class="bill-row" v-if="(result?.breakdown.classBPriorPay || 0) > 0">
              <text class="b-col-1">乙类药品/诊疗先行自付</text>
              <text class="b-col-2">乙类目录政策规定先行自付比例部分</text>
              <text class="b-col-3 font-mono text-dim">- ¥ {{ formatMoney(result?.breakdown.classBPriorPay || 0) }}</text>
            </view>

            <view class="bill-row">
              <text class="b-col-1">门槛起付线扣除</text>
              <text class="b-col-2">{{ deductibleMemo }}</text>
              <text class="b-col-3 font-mono text-dim">- ¥ {{ formatMoney(result?.breakdown.deductibleDeducted || 0) }}</text>
            </view>

            <view class="bill-row">
              <text class="b-col-1 font-bold">实际纳规报销基数</text>
              <text class="b-col-2">进入医保统筹池按法定比例报销的费用基数</text>
              <text class="b-col-3 font-mono font-bold">¥ {{ formatMoney(eligibleDeducted) }}</text>
            </view>

            <view class="bill-row highlight-cyan">
              <view class="b-col-1">
                <text class="font-bold text-cyan">医保统筹基金预估报销</text>
                <text class="badge-ratio">综合报销率 {{ result?.breakdown.effectiveRatio }}%</text>
              </view>
              <text class="b-col-2 text-cyan">符合地方公开政策报销目录，出院联网结算直接抵扣</text>
              <text class="b-col-3 font-mono font-bold text-cyan text-lg">¥ {{ formatMoney(result?.breakdown.totalReimbursed || 0) }}</text>
            </view>

            <view class="bill-row highlight-emerald" v-if="(result?.breakdown.catastrophicReimbursed || 0) > 0">
              <view class="b-col-1">
                <text class="font-bold text-emerald">大病互助二次报销</text>
                <text class="badge-ratio ratio-emerald">大病阶梯减免</text>
              </view>
              <text class="b-col-2 text-emerald">合规自付突破大病起付线，大病互助基金二次递增补偿</text>
              <text class="b-col-3 font-mono font-bold text-emerald text-lg">+ ¥ {{ formatMoney(result?.breakdown.catastrophicReimbursed || 0) }}</text>
            </view>

            <view class="bill-row highlight-amber">
              <view class="b-col-1">
                <text class="font-bold text-amber">个人预计自理支出</text>
              </view>
              <text class="b-col-2 text-amber">含起付线、按比例自负及目录外全自费项目总额</text>
              <text class="b-col-3 font-mono font-bold text-amber text-lg">¥ {{ formatMoney(result?.breakdown.personalPayTotal || 0) }}</text>
            </view>
          </view>

          <!-- 依据的法定政策公文 -->
          <view class="voucher-policy-source" v-if="result?.officialDocUsed">
            <view class="source-tag">政策依据</view>
            <view class="source-content">
              <text class="source-num font-mono">〔{{ result.officialDocUsed.docNumber || '现行基本医保规范' }}〕</text>
              <text class="source-name">{{ result.officialDocUsed.title }}</text>
            </view>
          </view>

          <!-- 备忘与政策提醒 -->
          <view class="voucher-memo-list" v-if="result?.policyNotes && result.policyNotes.length > 0">
            <view class="memo-item" v-for="(note, i) in result.policyNotes" :key="i">
              <text class="memo-bullet">※</text>
              <text class="memo-text">{{ note }}</text>
            </view>
          </view>

          <!-- 严谨免责兜底与公章样式 -->
          <view class="voucher-disclaimer-box">
            <view class="disclaimer-left">
              <text class="disclaimer-h">⚠️ 重要声明与就医提示：</text>
              <text class="disclaimer-p">1. 本凭据单由“全国医保待遇估算与政策查询”开源平台整理各地公开规范性文件生成，仅供就医费用预算参考，不具有行政结算与法律凭证效力。</text>
              <text class="disclaimer-p">2. 参保人实际发生的报销金额与自理明细，受定点医疗机构用药目录、诊疗耗材品规、出院实时医保结算系统核定为准。</text>
            </view>
            <view class="voucher-seal">
              <view class="seal-inner">
                <text class="seal-top">医保估算参考</text>
                <text class="seal-mid">★</text>
                <text class="seal-bot">开源公益校验</text>
              </view>
            </view>
          </view>

          <!-- 底部来源水印 -->
          <view class="voucher-footer-meta">
            <text class="foot-meta-txt">全国 348 个医保统筹区公开数据整理 · 微信公众号：GIS民工 · 邮箱：keepkid0824@gmail.com</text>
          </view>
        </view>
      </view>

      <!-- 弹窗操作动作栏 -->
      <view class="modal-actions-bar">
        <view class="action-btn btn-export-img" @click="handleExportImage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <text class="btn-txt">保存为凭据图片</text>
        </view>

        <view class="action-btn btn-copy-txt" @click="handleCopyText">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <text class="btn-txt">复制文本发给家人</text>
        </view>

        <view class="action-btn btn-print" @click="handlePrint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <text class="btn-txt">打印单据</text>
        </view>

        <view class="action-btn btn-close-sec" @click="close">
          <text class="btn-txt">关闭</text>
        </view>
      </view>
    </view>

    <!-- 高清凭证海报长按保存预览浮层 (微信/移动端完美适配) -->
    <view class="poster-preview-mask" v-if="showPosterPreview" @click="showPosterPreview = false">
      <view class="poster-preview-dialog" @click.stop>
        <view class="poster-preview-header">
          <view class="preview-title-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" class="preview-title-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <text class="poster-preview-title">凭据高清海报已生成</text>
          </view>
          <text class="poster-preview-close" @click="showPosterPreview = false">✕</text>
        </view>

        <view class="poster-preview-body">
          <img :src="posterImageUrl" class="poster-preview-img" alt="全国医保待遇预估参考凭证" />
          <view class="poster-save-tip">
            <text class="tip-icon">💡</text>
            <text class="tip-txt">长按上方图片即可“保存到手机相册”或直接转发给家人微信</text>
          </view>
        </view>

        <view class="poster-preview-actions">
          <button class="poster-btn-download" @click="downloadPosterDirect">下载图片</button>
          <button class="poster-btn-close" @click="showPosterPreview = false">关闭预览</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import type { CalculateResult } from '../data/types';

const props = defineProps<{
  visible: boolean;
  cityName: string;
  provinceName: string;
  cityCode: string;
  insuranceType: 'employee' | 'resident';
  isRetiree: boolean;
  treatmentType: 'inpatient' | 'outpatient';
  hospitalTierName: string;
  remoteLabel: string;
  totalCost: number | string;
  result: CalculateResult | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const showPosterPreview = ref(false);
const posterImageUrl = ref('');

// 响应式监听弹窗开启状态，自动挂载 body.modal-open 隐藏吸底 TabBar 并防穿透
watch(() => props.visible, (val) => {
  if (typeof document !== 'undefined') {
    if (val) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
}, { immediate: true });

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('modal-open');
  }
});

function close() {
  emit('close');
}

function formatMoney(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// 凭据编号
const voucherNo = computed(() => {
  const d = new Date();
  const year = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VCH-${props.cityCode || '000000'}-${year}${m}${day}-${rand}`;
});

// 当前格式化日期
const currentDateStr = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
});

// 险种标签
const insuranceTypeLabel = computed(() => {
  if (props.insuranceType === 'employee') {
    return props.isRetiree ? '城镇职工基本医疗保险 (退休优待)' : '城镇职工基本医疗保险 (在职参保)';
  }
  return '城乡居民基本医疗保险 (居民统筹)';
});

// 就医场景标签
const treatmentTypeLabel = computed(() => {
  return props.treatmentType === 'inpatient' ? '住院治疗' : '普通门诊统筹';
});

// 起付线扣除说明
const deductibleMemo = computed(() => {
  const d = props.result?.breakdown.deductibleDeducted || 0;
  if (d <= 0) return '符合当地政策免起付标准，直接按比例纳规报销';
  return `根据统筹区政策扣减起付线门槛 ¥${formatMoney(d)}，不予报销`;
});

// 实际纳规入池基数
const eligibleDeducted = computed(() => {
  if (!props.result) return 0;
  return Math.max(0, props.result.breakdown.eligibleCost - props.result.breakdown.deductibleDeducted);
});

// 复制结构化文本
function handleCopyText() {
  const r = props.result;
  if (!r) return;

  const lines = [
    `【全国医保待遇预估参考单】`,
    `统筹地区：${props.cityName} (${props.provinceName})`,
    `参保险种：${insuranceTypeLabel.value}`,
    `就医机构：${treatmentTypeLabel.value} · ${props.hospitalTierName}`,
    `备案类型：${props.remoteLabel}`,
    `--------------------------------`,
    `预估医疗总花费：¥ ${formatMoney(r.breakdown.totalCost || props.totalCost)}`,
  ];

  if ((r.breakdown.nonInsuranceCost || 0) > 0) {
    lines.push(`全自费项目扣除：- ¥ ${formatMoney(r.breakdown.nonInsuranceCost)}`);
  }
  if ((r.breakdown.classBPriorPay || 0) > 0) {
    lines.push(`乙类先行自付额：- ¥ ${formatMoney(r.breakdown.classBPriorPay)}`);
  }

  lines.push(`起付线门槛扣除：- ¥ ${formatMoney(r.breakdown.deductibleDeducted)}`);
  lines.push(`纳规报销入池额：¥ ${formatMoney(eligibleDeducted.value)}`);
  lines.push(`★ 医保预估统筹报销：¥ ${formatMoney(r.breakdown.totalReimbursed)} (综合报销率约 ${r.breakdown.effectiveRatio}%)`);

  if ((r.breakdown.catastrophicReimbursed || 0) > 0) {
    lines.push(`★ 大病互助二次报销：+ ¥ ${formatMoney(r.breakdown.catastrophicReimbursed)}`);
  }

  lines.push(`★ 个人预计自理支出：¥ ${formatMoney(r.breakdown.personalPayTotal)}`);
  lines.push(`--------------------------------`);
  lines.push(`政策依据：${r.officialDocUsed?.title || '现行公开政策'} (${r.officialDocUsed?.docNumber || '规范公文'})`);
  lines.push(`声明：本数据基于地方公开政策规则估算，仅供预算参考；实际请以定点医疗机构出院医保结算单为准。`);
  lines.push(`来源：全国医保待遇估算与政策查询公益开源平台 (关注微信公众号：GIS民工)`);

  const fullText = lines.join('\n');
  uni.setClipboardData({
    data: fullText,
    success: () => {
      uni.showToast({ title: '已复制凭据文本', icon: 'success' });
    }
  });
}

// 直接下载海报图片
function downloadPosterDirect() {
  if (!posterImageUrl.value) return;
  const link = document.createElement('a');
  link.download = `医保待遇估算凭证_${props.cityName}_¥${props.totalCost}.png`;
  link.href = posterImageUrl.value;
  link.click();
  uni.showToast({ title: '已触发图片下载', icon: 'success' });
}

// 打印
function handlePrint() {
  if (typeof window !== 'undefined' && window.print) {
    window.print();
  } else {
    uni.showToast({ title: '当前环境不支持直接打印', icon: 'none' });
  }
}

// 保存为高清凭据海报图片 (纯前端 Canvas 离屏 2x 高清渲染，带自适应高度、长文本截断与金额右对齐)
function handleExportImage() {
  try {
    const r = props.result;
    if (!r) return;

    // 辅助截断文本函数，防止长公文标题溢出 Canvas 卡片边界
    function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
      if (ctx.measureText(text).width <= maxWidth) return text;
      let str = text;
      while (str.length > 0 && ctx.measureText(str + '...').width > maxWidth) {
        str = str.slice(0, -1);
      }
      return str + '...';
    }

    // 动态构建水单明细行 (与实际发生项严格完全同步，无遗漏)
    const rows: Array<{ name: string; rule: string; val: string; bold?: boolean; color: string; bg?: string }> = [
      { name: '总医疗花费', rule: '患者就医就诊发生的全部合规与自费总额', val: `¥ ${formatMoney(r.breakdown.totalCost || props.totalCost)}`, bold: true, color: '#0f172a' },
    ];

    if ((r.breakdown.nonInsuranceCost || 0) > 0) {
      rows.push({
        name: '全自费项目 (丙类/特需)',
        rule: '目录外不予报销项（全额个人负担）',
        val: `- ¥ ${formatMoney(r.breakdown.nonInsuranceCost)}`,
        color: '#64748b'
      });
    }

    if ((r.breakdown.classBPriorPay || 0) > 0) {
      rows.push({
        name: '乙类药品/诊疗先行自付',
        rule: '乙类目录政策规定先行自付比例部分',
        val: `- ¥ ${formatMoney(r.breakdown.classBPriorPay)}`,
        color: '#64748b'
      });
    }

    rows.push({
      name: '门槛起付线扣除',
      rule: (r.breakdown.deductibleDeducted || 0) > 0 ? `扣减起付线门槛 ¥${formatMoney(r.breakdown.deductibleDeducted)}，起付线内不报销` : '符合当地政策免起付标准',
      val: `- ¥ ${formatMoney(r.breakdown.deductibleDeducted)}`,
      color: '#64748b'
    });

    rows.push({
      name: '实际纳规报销基数',
      rule: '进入医保统筹池按比例享受待遇的基数',
      val: `¥ ${formatMoney(eligibleDeducted.value)}`,
      bold: true,
      color: '#0f172a'
    });

    rows.push({
      name: '医保统筹基金预估报销',
      rule: `符合地方公开政策报销 (综合报销率 ${r.breakdown.effectiveRatio}%)`,
      val: `¥ ${formatMoney(r.breakdown.totalReimbursed)}`,
      bold: true,
      color: '#0284c7',
      bg: '#f0f9ff'
    });

    if ((r.breakdown.catastrophicReimbursed || 0) > 0) {
      rows.push({
        name: '大病互助二次报销',
        rule: '突破大病起付标准，大病保险二次梯次补偿减免',
        val: `+ ¥ ${formatMoney(r.breakdown.catastrophicReimbursed)}`,
        bold: true,
        color: '#059669',
        bg: '#ecfdf5'
      });
    }

    rows.push({
      name: '个人预计自理支出',
      rule: '含起付线、按比例自负及全自费项目总额',
      val: `¥ ${formatMoney(r.breakdown.personalPayTotal)}`,
      bold: true,
      color: '#d97706',
      bg: '#fffbeb'
    });

    const hasDoc = !!r.officialDocUsed;
    const memoNotes = (r.policyNotes || []).slice(0, 3);
    const memoCount = memoNotes.length;

    // 动态精确核算 Canvas 画布高度，杜绝写出边框与裁剪问题
    const w = 720;
    const headerHeight = 275;
    const tableHeaderHeight = 32;
    const tableRowsHeight = rows.length * 36;
    const policyDocHeight = hasDoc ? 68 : 0;
    const memoHeight = memoCount > 0 ? (memoCount * 22 + 16) : 0;
    const disclaimerHeight = 88;
    const footerHeight = 40;
    const bottomPadding = 30;

    const totalCalculatedHeight = headerHeight + tableHeaderHeight + tableRowsHeight + 20 + policyDocHeight + memoHeight + disclaimerHeight + footerHeight + bottomPadding;
    const h = Math.max(940, totalCalculatedHeight);

    // 建立 2x Canvas (Retina 高清)
    const canvas = document.createElement('canvas');
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);

    // 1. 底色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // 2. 浅色边框与装饰
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // 顶部蓝条装饰
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(20, 20, w - 40, 6);

    // 3. 头部信息
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('全国基本医疗保险待遇预估参考凭证', 45, 68);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('NATIONAL HEALTH INSURANCE ESTIMATE MEMO · 覆盖全国 348 统筹区', 45, 88);

    // 凭据号与时间
    ctx.fillStyle = '#475569';
    ctx.font = '12px monospace';
    ctx.fillText(`单号: ${voucherNo.value}`, 45, 122);
    ctx.fillText(`日期: ${currentDateStr.value}`, w - 210, 122);

    // 虚线分割
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(45, 136);
    ctx.lineTo(w - 45, 136);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. 基本信息卡片底
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(45, 148, w - 90, 80);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(45, 148, w - 90, 80);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('参保统筹区：', 60, 175);
    ctx.fillText('医保身份类别：', 60, 208);
    ctx.fillText('就医场景机构：', 380, 175);
    ctx.fillText('异地备案状态：', 380, 208);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${props.cityName} (${props.provinceName})`, 145, 175);
    ctx.fillText(truncateText(ctx, insuranceTypeLabel.value, 200), 155, 208);
    ctx.fillText(truncateText(ctx, `${treatmentTypeLabel.value} · ${props.hospitalTierName}`, 190), 475, 175);
    ctx.fillText(truncateText(ctx, props.remoteLabel, 190), 475, 208);

    // 5. 费用水单表格
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('结算核定明细清单', 45, 260);

    let curY = 275;
    // 表头 (金额右对齐)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(45, curY, w - 90, 32);
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('结算项目', 60, curY + 20);
    ctx.fillText('政策规则说明', 220, curY + 20);
    ctx.textAlign = 'right';
    ctx.fillText('金额 (元)', w - 65, curY + 20);
    ctx.textAlign = 'left';
    curY += 32;

    rows.forEach(row => {
      if (row.bg) {
        ctx.fillStyle = row.bg;
        ctx.fillRect(45, curY, w - 90, 36);
      }
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(45, curY, w - 90, 36);

      ctx.fillStyle = row.color;
      ctx.font = row.bold ? 'bold 13px sans-serif' : '12px sans-serif';
      ctx.fillText(row.name, 60, curY + 22);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText(truncateText(ctx, row.rule, 290), 220, curY + 22);

      ctx.fillStyle = row.color;
      ctx.font = row.bold ? 'bold 13.5px monospace' : '13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(row.val, w - 65, curY + 22);
      ctx.textAlign = 'left';

      curY += 36;
    });

    curY += 18;

    // 6. 政策依据
    if (hasDoc && r.officialDocUsed) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(45, curY, w - 90, 52);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(45, curY, w - 90, 52);

      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('公开政策依据：', 60, curY + 22);

      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      const docFull = `${r.officialDocUsed.title} (${r.officialDocUsed.docNumber || '现行规范公文'})`;
      ctx.fillText(truncateText(ctx, docFull, 480), 150, curY + 22);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText('地方政府及医保部门公开发布现行有效标准文件', 150, curY + 40);

      curY += 64;
    }

    // 6.2 政策提示备忘
    if (memoCount > 0) {
      memoNotes.forEach(note => {
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('※', 48, curY + 14);

        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.fillText(truncateText(ctx, note, w - 120), 65, curY + 14);
        curY += 22;
      });
      curY += 8;
    }

    // 7. 免责声明区与印章
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(45, curY, w - 90, 80);
    ctx.strokeStyle = '#fef3c7';
    ctx.strokeRect(45, curY, w - 90, 80);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('⚠️ 免责声明与定点医疗机构结算须知：', 60, curY + 22);

    ctx.fillStyle = '#78350f';
    ctx.font = '10.5px sans-serif';
    ctx.fillText('1. 本参考单据由民间公益开源模型基于各统筹区公开文件规则估算，仅供患者就医预算参考，不具有行政结算效力。', 60, curY + 42);
    ctx.fillText('2. 实际报销比例与自付金额以就医定点医疗机构出院窗口打印的正式《医保结算单》为准。', 60, curY + 60);

    // 印章 (红色圆形)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w - 115, curY + 40, 34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 9.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('医保估算参考', w - 115, curY + 32);
    ctx.fillText('★ ★ ★', w - 115, curY + 43);
    ctx.fillText('开源公益校验', w - 115, curY + 54);
    ctx.textAlign = 'left';

    curY += 92;

    // 8. 页脚版权
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10.5px sans-serif';
    ctx.fillText('全国医保待遇估算与政策查询 · 公益开源 · 微信公众号：GIS民工 · 邮箱：keepkid0824@gmail.com', 45, h - 35);

    // 导出并弹出预览浮层 (微信与手机端长按保存最佳体验)
    const dataUrl = canvas.toDataURL('image/png');
    posterImageUrl.value = dataUrl;
    showPosterPreview.value = true;

    // 桌面环境自动触发传统文件下载
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        const link = document.createElement('a');
        link.download = `医保待遇估算凭证_${props.cityName}_¥${props.totalCost}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (_) {}

    uni.showToast({ title: '已生成凭据海报', icon: 'success' });
  } catch (e: any) {
    uni.showToast({ title: '导出图片失败，可尝试一键复制', icon: 'none' });
  }
}
</script>

<style scoped>
.voucher-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.voucher-modal-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-head {
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-icon {
  width: 18px;
  height: 18px;
  color: #0284c7;
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.modal-close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.voucher-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f1f5f9;
}

/* 凭证实体卡片 (官方正式质感) */
.voucher-sheet {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: relative;
}

.voucher-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 2px solid #0284c7;
}

.voucher-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.voucher-logo-box {
  width: 36px;
  height: 36px;
}

.voucher-shield-svg {
  width: 100%;
  height: 100%;
}

.voucher-title-group {
  display: flex;
  flex-direction: column;
}

.voucher-main-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.5px;
}

.voucher-sub-title {
  font-size: 9px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.voucher-meta-tag {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 3px 8px;
  border-radius: 4px;
}

.meta-tag-txt {
  font-size: 11px;
  color: #166534;
  font-weight: 600;
}

.voucher-code-bar {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
  padding: 8px 0;
  border-bottom: 1px dashed #cbd5e1;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* 基本参数网格 */
.voucher-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 14px;
}

.info-cell {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.cell-k {
  color: #64748b;
  width: 90px;
  flex-shrink: 0;
}

.cell-v {
  color: #1e293b;
}

/* 水单明细清单 */
.voucher-bill-table {
  margin-top: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.bill-row {
  display: grid;
  grid-template-columns: 180px 1fr 140px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 12px;
}

.bill-row:last-child {
  border-bottom: none;
}

.bill-header {
  background: #f8fafc;
  font-weight: 700;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.b-col-1 {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.b-col-2 {
  color: #64748b;
  font-size: 11.5px;
  padding-right: 10px;
}

.b-col-3 {
  text-align: right;
}

.highlight-cyan {
  background: #f0f9ff;
  border-left: 3px solid #0284c7;
}

.highlight-amber {
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
}

.highlight-emerald {
  background: #ecfdf5;
  border-left: 3px solid #059669;
}

.text-cyan {
  color: #0284c7;
}

.text-amber {
  color: #d97706;
}

.text-emerald {
  color: #059669;
}

.ratio-emerald {
  background: #d1fae5;
  color: #047857;
}

.text-dim {
  color: #94a3b8;
}

.badge-ratio {
  display: inline-block;
  font-size: 10px;
  background: #e0f2fe;
  color: #0369a1;
  padding: 1px 4px;
  border-radius: 3px;
  margin-top: 2px;
  width: fit-content;
}

.text-lg {
  font-size: 14px;
}

/* 政策依据 */
.voucher-policy-source {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 14px;
}

.source-tag {
  background: #0284c7;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  flex-shrink: 0;
}

.source-content {
  font-size: 11px;
  color: #334155;
}

.source-num {
  font-weight: 600;
  color: #0284c7;
  margin-right: 6px;
}

/* 政策备忘 */
.voucher-memo-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.memo-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
}

.memo-bullet {
  color: #0284c7;
  font-weight: bold;
}

/* 声明与印章 */
.voucher-disclaimer-box {
  margin-top: 16px;
  padding: 12px 14px;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.disclaimer-left {
  flex: 1;
}

.disclaimer-h {
  font-size: 11px;
  font-weight: 700;
  color: #b45309;
  display: block;
  margin-bottom: 4px;
}

.disclaimer-p {
  font-size: 10.5px;
  color: #78350f;
  line-height: 1.5;
  display: block;
}

.voucher-seal {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid #dc2626;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: rotate(-10deg);
  opacity: 0.85;
}

.seal-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.seal-top, .seal-bot {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.seal-mid {
  font-size: 11px;
  line-height: 1;
}

.voucher-footer-meta {
  margin-top: 14px;
  text-align: center;
}

.foot-meta-txt {
  font-size: 10px;
  color: #94a3b8;
}

/* 动作按钮栏 */
.modal-actions-bar {
  padding: 12px 20px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-svg {
  width: 15px;
  height: 15px;
}

.btn-export-img {
  background: #0284c7;
  color: #ffffff;
}

.btn-export-img:hover {
  background: #0369a1;
}

.btn-copy-txt {
  background: #f8fafc;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-copy-txt:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-print {
  background: #f8fafc;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-print:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-close-sec {
  background: transparent;
  color: #64748b;
}

.btn-close-sec:hover {
  color: #0f172a;
}

/* 打印专门样式适配 */
@media print {
  .voucher-modal-mask {
    position: static;
    background: transparent;
    padding: 0;
  }
  .voucher-modal-dialog {
    max-width: 100%;
    box-shadow: none;
  }
  .modal-head, .modal-actions-bar {
    display: none !important;
  }
  .voucher-scroll-area {
    padding: 0;
    background: transparent;
  }
  .voucher-sheet {
    box-shadow: none;
    border: 1px solid #000;
    padding: 10mm;
  }
}

@media (max-width: 640px) {
  .voucher-modal-dialog {
    max-height: 92vh;
    margin: 8px;
  }
  .voucher-scroll-area {
    padding: 12px;
    -webkit-overflow-scrolling: touch;
  }
  .voucher-sheet {
    padding: 14px;
  }
  .voucher-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  .voucher-main-title {
    font-size: 14px;
  }
  .voucher-code-bar {
    flex-direction: column;
    gap: 4px;
  }
  .voucher-info-grid {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 10px 12px;
  }
  .bill-header .b-col-2 {
    display: none;
  }
  .bill-row {
    grid-template-columns: 1fr auto;
    padding: 10px 12px;
    gap: 8px;
  }
  .bill-row .b-col-1 {
    min-width: 0;
  }
  .bill-row .b-col-2 {
    display: none;
  }
  .bill-row .b-col-3 {
    text-align: right;
    white-space: nowrap;
  }
  .voucher-disclaimer-box {
    flex-direction: column;
    align-items: flex-start;
  }
  .voucher-seal {
    align-self: flex-end;
    margin-top: -10px;
  }
  .modal-actions-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 10px 12px calc(12px + env(safe-area-inset-bottom));
  }
  .modal-actions-bar .action-btn {
    justify-content: center;
    padding: 9px 8px;
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .modal-actions-bar .btn-close-sec {
    grid-column: span 2;
    text-align: center;
    padding: 6px;
  }
}

/* 高清海报长按保存预览浮层 (微信/移动端极致友好) */
.poster-preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.poster-preview-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.poster-preview-header {
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-title-icon {
  width: 18px;
  height: 18px;
}

.poster-preview-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.poster-preview-close {
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
}

.poster-preview-close:hover {
  color: #0f172a;
}

.poster-preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f1f5f9;
  -webkit-overflow-scrolling: touch;
}

.poster-preview-img {
  width: 100%;
  max-width: 380px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
}

.poster-save-tip {
  margin-top: 12px;
  padding: 8px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
}

.tip-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.tip-txt {
  font-size: 11.5px;
  color: #1d4ed8;
  font-weight: 600;
  line-height: 1.4;
}

.poster-preview-actions {
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 10px;
}

.poster-btn-download {
  flex: 1;
  background: #0284c7;
  color: #ffffff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 0;
  border: none;
  cursor: pointer;
  line-height: 1.2;
}

.poster-btn-download:hover {
  background: #0369a1;
}

.poster-btn-close {
  padding: 9px 16px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  line-height: 1.2;
}

.poster-btn-close:hover {
  background: #e2e8f0;
}
</style>
