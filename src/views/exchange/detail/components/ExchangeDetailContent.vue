<template>
  <div class="exchange-detail-content">
    <DetailOrderHero
      :eyebrow="t('exchange.orderEyebrow')"
      :order-no="detail.order_no"
      :status="statusLabel"
      :status-type="statusType"
      :status-effect="detail.status === 0 ? 'pending' : undefined"
    >
      <div class="exchange-flow">
        <article>
          <small>{{ t('exchange.sourceAsset') }}</small>
          <p>
            <strong>{{ formatMoney(detail.source_amount) }}</strong
            ><span>{{ detail.source_currency.code }}</span>
          </p>
          <em>{{ detail.source_currency.name }}</em>
        </article>
        <div class="exchange-rate">
          <FlowArrow /><small>{{ t('exchange.submittedRate') }}</small
          ><strong
            >1 {{ detail.source_currency.code }} = {{ formatExchangeRate(detail.exchange_rate) }}
            {{ detail.target_currency.code }}</strong
          >
        </div>
        <article class="is-target">
          <small>{{ t('exchange.estimated') }}</small>
          <p>
            <strong>{{ formatMoney(detail.target_amount) }}</strong
            ><span>{{ detail.target_currency.code }}</span>
          </p>
          <em>{{ detail.target_currency.name }}</em>
        </article>
      </div>
      <template #meta>
        <div class="meta">
          <small>{{ t('exchange.submittedAt') }}</small>
          <strong>{{ detail.submitted_at || '—' }}</strong>
        </div>
      </template>
    </DetailOrderHero>
    <div class="exchange-detail-content__workspace">
      <div class="exchange-detail-content__main">
        <DetailCard
          :title="t('exchange.reviewResult')"
          :description="t('exchange.reviewDesc')"
          icon="ri-shield-check-line"
          ><DetailFieldGrid v-if="reviewItems.length" :items="reviewItems" />
          <p v-else class="empty-result">
            {{ t('exchange.reviewPending') }}
          </p></DetailCard
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExchangeOrderDetail } from '@/api/modules/exchange';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import FlowArrow from '@/components/common/FlowArrow.vue';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import { formatExchangeRate } from '@/utils/decimal';
const props = defineProps<{ detail: ExchangeOrderDetail }>();
const { t } = useI18n();
const statusType = computed<StatusBadgeType>(() =>
  props.detail.status === 1 ? 'success' : props.detail.status === 2 ? 'danger' : 'warning',
);
const statusLabel = computed(() =>
  t(
    props.detail.status === 1
      ? 'exchange.completed'
      : props.detail.status === 2
        ? 'exchange.rejected'
        : 'exchange.pending',
  ),
);
const reviewItems = computed<DetailFieldItem[]>(() => {
  const d = props.detail;
  return [
    d.completed_at
      ? { label: t('exchange.completedAt'), value: d.completed_at, accent: true }
      : null,
    d.review.admin_name ? { label: t('exchange.reviewer'), value: d.review.admin_name } : null,
    d.review.reviewed_at ? { label: t('exchange.reviewedAt'), value: d.review.reviewed_at } : null,
    d.review.note
      ? {
          label: t(d.status === 2 ? 'exchange.rejectionReason' : 'exchange.reviewNote'),
          value: d.review.note,
          wide: true,
        }
      : null,
  ].filter(Boolean) as DetailFieldItem[];
});
</script>
<style scoped lang="scss">
.exchange-detail-content {
  display: grid;
  min-width: 0;
  gap: 18px;
}
.exchange-detail-content__workspace {
  display: grid;
  min-width: 0;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}
.exchange-detail-content__main {
  display: grid;
  min-width: 0;
  gap: 18px;
}
.exchange-flow {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) minmax(210px, 0.7fr) minmax(0, 1fr);
  gap: 18px;
}
.exchange-flow article {
  min-width: 0;
}
.exchange-flow article.is-target {
  text-align: right;
}
.exchange-flow p {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 7px 0 4px;
}
.exchange-flow .is-target p {
  justify-content: flex-end;
}
.exchange-flow strong {
  color: #10243d;
  font-size: clamp(26px, 3vw, 38px);
}
.exchange-flow p span {
  color: #078f89;
  font-weight: 700;
}
.exchange-flow small,
.exchange-flow em,
.meta small {
  color: #74869b;
  font-size: 11px;
}
.exchange-flow em {
  font-style: normal;
}
.exchange-rate {
  display: grid;
  justify-items: center;
  gap: 7px;
  text-align: center;
}
.exchange-rate > strong {
  font-size: 13px;
}
.meta {
  display: grid;
  gap: 3px;
}
.meta strong {
  color: #30475f;
  font-size: 13px;
}
.empty-result {
  margin: 12px 0 0;
  color: #7b8b9f;
  font-size: 13px;
}
@include mobile {
  .exchange-detail-content,
  .exchange-detail-content__main {
    gap: 14px;
  }
  .exchange-detail-content__workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  .exchange-flow {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  .exchange-flow article.is-target {
    text-align: left;
  }
  .exchange-flow p,
  .exchange-flow .is-target p {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .exchange-rate {
    padding: 14px 0;
    border-top: 1px solid #e4edf3;
    border-bottom: 1px solid #e4edf3;
  }
}
</style>
