<template>
  <DetailCard title="金额结算" description="收款金额、手续费与账户实际扣款" icon="ri-wallet-3-line">
    <div class="settlement-card">
      <div class="settlement-card__amount">
        <small>出金金额</small>
        <p><strong>{{ detail.amount }}</strong><span>{{ detail.currency.code }}</span></p>
        <em>收款人预计实收</em>
      </div>
      <dl>
        <div><dt>固定手续费</dt><dd>{{ formatFixedFee(detail.fee_amount) }} {{ detail.currency.code }}</dd></div>
        <div class="is-total"><dt>账户总扣款</dt><dd>{{ detail.total_amount }} {{ detail.currency.code }}</dd></div>
      </dl>
    </div>
  </DetailCard>
</template>

<script setup lang="ts">
/** 出金金额结算：突出出金金额与账户总扣款。 */
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';
import { formatFixedFee } from '@/utils/decimal';

defineProps<{ detail: WithdrawalOrderDetail }>();
</script>

<style scoped lang="scss">
.settlement-card {
  display: grid;
  min-width: 0;
  align-items: stretch;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 1.1fr);
  gap: 20px;

  &__amount {
    display: grid;
    min-width: 0;
    align-content: center;
    padding: 16px 18px;
    border: 1px solid #dce8ee;
    border-radius: 12px;
    background: #f8fbfc;

    > small { color: #74869b; font-size: 11px; }
    p { display: flex; align-items: baseline; flex-wrap: wrap; gap: 7px; margin: 5px 0 3px; }
    p strong { color: #10243d; font-size: clamp(27px, 3vw, 36px); font-weight: 730; font-variant-numeric: tabular-nums; line-height: 1.15; overflow-wrap: anywhere; }
    p span { color: #078c84; font-size: 12px; font-weight: 700; }
    em { color: #8291a3; font-size: 10px; font-style: normal; }
  }

  dl { display: grid; margin: 0; gap: 9px; }
  dl > div { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border-radius: 10px; background: #f5f8fa; }
  dt { color: #718399; font-size: 11px; }
  dd { margin: 0; color: #31485f; font-size: 14px; font-weight: 650; font-variant-numeric: tabular-nums; }
  dl .is-total { border: 1px solid #cbe7e3; background: #edf9f7; }
  dl .is-total dt { color: #087f79; font-weight: 600; }
  dl .is-total dd { color: #078c84; font-size: 18px; font-weight: 750; }
}

@include mobile {
  .settlement-card { grid-template-columns: 1fr; gap: 10px; }
}
</style>
