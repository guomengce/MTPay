<template>
  <section class="manual-detail" :class="increase ? 'is-increase' : 'is-decrease'">
    <header>
      <div><small>{{ t(`records.${transaction.business_type}`) }}</small><strong>{{ transaction.order_no }}</strong></div>
      <strong class="manual-detail__amount">{{ transactionAmount(transaction) }}</strong>
    </header>
    <dl>
      <div><dt>{{ t('records.agent') }}</dt><dd>{{ transaction.user.company_name }}</dd></div>
      <div><dt>{{ t('account.email') }}</dt><dd>{{ transaction.user.email }}</dd></div>
      <div><dt>{{ t('records.currency') }}</dt><dd>{{ transaction.currency_code }}</dd></div>
      <div><dt>{{ t('records.operator') }}</dt><dd>{{ detail.admin_name || '—' }}</dd></div>
      <div class="is-wide"><dt>{{ t('records.adjustmentReason') }}</dt><dd>{{ detail.reason || '—' }}</dd></div>
      <div><dt>{{ t('records.operatedAt') }}</dt><dd>{{ detail.created_at || transaction.submitted_at || '—' }}</dd></div>
    </dl>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ManualBalanceAdjustmentDetail, TransactionItem } from '@/api/modules/transaction';
import { transactionAmount } from '../transactionPresentation';
const props = defineProps<{ transaction: TransactionItem; detail: ManualBalanceAdjustmentDetail }>();
const { t } = useI18n();
const increase = computed(() => props.transaction.business_type === 'manual_increase');
</script>
<style scoped lang="scss">
.manual-detail {
  overflow:hidden; border:1px solid #dfe7ef; border-radius:16px; background:#fff; box-shadow:0 12px 32px rgb(16 30 54 / 7%);
  header { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:22px 24px; background:#f7fafc; border-bottom:1px solid #e5ebf2; }
  header > div { display:grid; min-width:0; gap:6px; small { color:#6f8097; } strong { overflow-wrap:anywhere; color:#162a43; } }
  &__amount { color:#d43d49; font-size:clamp(22px,3vw,34px); overflow-wrap:anywhere; text-align:right; }
  &.is-increase &__amount { color:#07835d; }
  dl { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); margin:0; padding:8px 24px 24px; gap:0 24px; }
  dl div { display:grid; grid-template-columns:minmax(110px,.7fr) minmax(0,1.3fr); gap:12px; padding:16px 0; border-bottom:1px dashed #e0e8ef; }
  dl div.is-wide { grid-column:1 / -1; }
  dt { color:#72839a; } dd { min-width:0; margin:0; color:#1d324a; font-weight:600; overflow-wrap:anywhere; }
}
@include mobile { .manual-detail { header { align-items:flex-start; flex-direction:column; padding:18px; } &__amount { text-align:left; } dl { grid-template-columns:1fr; padding:4px 18px 18px; } dl div.is-wide { grid-column:auto; } dl div { grid-template-columns:100px minmax(0,1fr); } } }
</style>
