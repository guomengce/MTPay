<template>
  <div class="deposit-detail-content">
    <DetailOrderHero eyebrow="数字货币入金订单" :order-no="detail.order_no" :status="detail.status_name" :status-type="statusType" :status-effect="detail.status === 0 ? 'pending' : undefined">
      <div class="deposit-summary">
        <span class="deposit-summary__icon"><el-icon><Wallet /></el-icon></span>
        <div><small>申报入金金额</small><p><strong>{{ detail.amount }}</strong><span>{{ detail.currency.code }}</span></p><em>{{ detail.currency.name }} · {{ detail.network.name }}（{{ detail.network.code }}）</em></div>
      </div>
      <template #meta>
        <div class="meta"><small>申请代理</small><strong>{{ detail.user.company_name }}</strong><span>{{ detail.user.agent_code }} · {{ detail.user.email }}</span></div>
        <div class="meta"><small>提交时间</small><strong>{{ detail.submitted_at || '—' }}</strong></div>
      </template>
    </DetailOrderHero>
    <div class="deposit-detail-content__workspace">
      <div class="deposit-detail-content__main">
        <DetailCard title="链上核验" description="确认交易哈希与平台收款地址一致" icon="ri-links-line"><DetailFieldGrid :items="chainItems" @copy="copyField" /></DetailCard>
        <DetailCard title="审核结果" description="本次审核处理记录" icon="ri-shield-check-line"><DetailFieldGrid v-if="reviewItems.length" :items="reviewItems" /><p v-else class="empty-result">待审核，审核结果尚未产生</p></DetailCard>
      </div>
      <DetailCard v-if="detail.timeline.length" title="处理时间线" description="本次入金订单的处理流程" icon="ri-time-line"><DetailTimeline :items="detail.timeline" /></DetailCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Wallet } from '@element-plus/icons-vue';
import type { DepositOrderDetail } from '@/api/modules/deposit';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import DetailTimeline from '@/components/detail/DetailTimeline.vue';
const props = defineProps<{ detail: DepositOrderDetail }>();
const statusType = computed<StatusBadgeType>(() => props.detail.status === 1 ? 'success' : props.detail.status === 2 ? 'danger' : 'warning');
const chainItems = computed<DetailFieldItem[]>(() => [
  { label: '交易哈希 Txid', value: props.detail.txid, wide: true, mono: true, copyable: true },
  { label: '平台收款地址', value: props.detail.receiving_address_snapshot, wide: true, mono: true, copyable: true },
]);
const reviewItems = computed<DetailFieldItem[]>(() => {
  const d = props.detail; if (d.status === 0) return [];
  return [d.credited_at ? { label: '入账时间', value: d.credited_at, accent: true } : null, d.review.admin_name ? { label: '审核人', value: d.review.admin_name } : null, d.review.reviewed_at ? { label: '审核时间', value: d.review.reviewed_at } : null, d.review.note ? { label: d.status === 2 ? '驳回原因' : '审核备注', value: d.review.note, wide: true } : null].filter(Boolean) as DetailFieldItem[];
});
async function copyField(item: DetailFieldItem) { try { await navigator.clipboard.writeText(item.value); ElMessage.success(`${item.label}已复制`); } catch { ElMessage.error('复制失败，请手动复制'); } }
</script>
<style scoped lang="scss">
.deposit-detail-content { display: grid; min-width: 0; gap: 18px; }
.deposit-detail-content__workspace { display: grid; min-width: 0; align-items: start; grid-template-columns: minmax(0, 1.5fr) minmax(320px, .8fr); gap: 18px; }
.deposit-detail-content__main { display: grid; min-width: 0; gap: 18px; }
.deposit-summary { display: flex; align-items: center; gap: 18px; }
.deposit-summary__icon { display: grid; width: 58px; height: 58px; flex: 0 0 58px; place-items: center; border-radius: 17px; color: #fff; background: linear-gradient(135deg,#19b8a8,#268ee6); font-size: 28px; }
.deposit-summary small,.meta small { color:#74869b;font-size:12px; }.deposit-summary p{display:flex;align-items:baseline;gap:9px;margin:6px 0 4px}.deposit-summary strong{color:#10243d;font-size:clamp(28px,3vw,40px)}.deposit-summary p span{color:#078f89;font-weight:700}.deposit-summary em{color:#74869b;font-size:13px;font-style:normal}.meta{display:grid;gap:3px}.meta small,.meta span{color:#74869b;font-size:11px}.meta strong{color:#30475f;font-size:13px}.empty-result{margin:0;padding:20px 0;color:#7b8b9f;font-size:13px}
@include narrow { .deposit-detail-content__workspace{grid-template-columns:1fr} }
</style>
