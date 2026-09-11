<template>
  <div class="deposit-detail-content">
    <DetailOrderHero :eyebrow="t('deposit.orderEyebrow')" :order-no="detail.order_no" :status="statusLabel" :status-type="statusType" :status-effect="detail.status === 0 ? 'pending' : undefined">
      <div class="deposit-summary">
        <span class="deposit-summary__icon"><el-icon><Wallet /></el-icon></span>
        <div><small>{{ t('deposit.declaredAmount') }}</small><p><strong>{{ formatMoney(detail.amount) }}</strong><span>{{ detail.currency.code }}</span></p><em>{{ detail.currency.name }} · {{ detail.network.name }}（{{ detail.network.code }}）</em></div>
      </div>
      <template #meta>
        <div class="meta"><small>{{ t('deposit.submittedAt') }}</small><strong>{{ detail.submitted_at || '—' }}</strong></div>
      </template>
    </DetailOrderHero>
    <div class="deposit-detail-content__workspace">
      <div class="deposit-detail-content__main">
        <ChainTransactionCard
          :source-address="detail.source_address_snapshot || ''"
          :receiving-address="detail.receiving_address_snapshot || ''"
          :platform-transaction-no="detail.safeheron_tx_key || ''"
          :txid="detail.txid || ''"
        />
        <DetailCard :title="t('deposit.reviewResult')" :description="t('deposit.reviewResultDesc')" icon="ri-shield-check-line"><DetailFieldGrid v-if="reviewItems.length" :items="reviewItems" /><p v-else class="empty-result">{{ t('deposit.reviewPending') }}</p></DetailCard>
      </div>
      <DetailCard v-if="detail.timeline?.length" :title="t('deposit.timeline')" :description="t('deposit.timelineDesc')" icon="ri-time-line"><DetailTimeline :items="detail.timeline || []" /></DetailCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import { Wallet } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import type { DepositOrderDetail } from '@/api/modules/deposit';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import DetailTimeline from '@/components/detail/DetailTimeline.vue';
import ChainTransactionCard from './ChainTransactionCard.vue';
const props = defineProps<{ detail: DepositOrderDetail }>();
const { t } = useI18n();
const statusType = computed<StatusBadgeType>(() => props.detail.status === 1 ? 'success' : props.detail.status === 2 ? 'danger' : 'warning');
const statusLabel = computed(() => t(props.detail.status === 1 ? 'deposit.statusCredited' : props.detail.status === 2 ? 'deposit.statusRejected' : 'deposit.statusPending'));
const reviewItems = computed<DetailFieldItem[]>(() => {
  const d = props.detail; if (d.status === 0) return [];
  return [d.credited_at ? { label: t('deposit.creditedAt'), value: d.credited_at, accent: true } : null, d.review?.admin_name ? { label: t('deposit.reviewer'), value: d.review.admin_name } : null, d.review?.reviewed_at ? { label: t('deposit.reviewedAt'), value: d.review.reviewed_at } : null, d.review?.note ? { label: t(d.status === 2 ? 'deposit.rejectionReason' : 'deposit.reviewNote'), value: d.review.note, wide: true } : null].filter(Boolean) as DetailFieldItem[];
});
</script>
<style scoped lang="scss">
.deposit-detail-content { display: grid; min-width: 0; gap: 18px; }
.deposit-detail-content__workspace { display: grid; min-width: 0; align-items: start; grid-template-columns: minmax(0, 1.5fr) minmax(320px, .8fr); gap: 18px; }
.deposit-detail-content__main { display: grid; min-width: 0; gap: 18px; }
.deposit-summary { display: flex; align-items: center; gap: 18px; }
.deposit-summary__icon { display: grid; width: 58px; height: 58px; flex: 0 0 58px; place-items: center; border-radius: 17px; color: #fff; background: linear-gradient(135deg,#19b8a8,#268ee6); font-size: 28px; }
.deposit-summary small,.meta small { color:#74869b;font-size:12px; }.deposit-summary p{display:flex;align-items:baseline;gap:9px;margin:6px 0 4px}.deposit-summary strong{color:#10243d;font-size:clamp(28px,3vw,40px)}.deposit-summary p span{color:#078f89;font-weight:700}.deposit-summary em{color:#74869b;font-size:13px;font-style:normal}.meta{display:grid;gap:3px}.meta small,.meta span{color:#74869b;font-size:11px}.meta strong{color:#30475f;font-size:13px}.empty-result{margin:0;padding:20px 0;color:#7b8b9f;font-size:13px}
@include narrow { .deposit-detail-content__workspace{grid-template-columns:1fr} }
@include mobile {
  .deposit-detail-content { gap: 14px; }
  .deposit-detail-content__workspace { grid-template-columns: 1fr; gap: 14px; }
  .deposit-detail-content__main { gap: 14px; }
  .deposit-summary { align-items: flex-start; gap: 12px; }
  .deposit-summary__icon { width: 48px; height: 48px; flex-basis: 48px; border-radius: 14px; font-size: 23px; }
  .deposit-summary p { flex-wrap: wrap; gap: 5px 8px; }
  .deposit-summary strong { font-size: 28px; overflow-wrap: anywhere; }
  .deposit-summary em { overflow-wrap: anywhere; }
}
</style>
