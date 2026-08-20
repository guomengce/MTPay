<template>
  <div class="withdrawal-amount">
    <span class="withdrawal-amount__icon"><i class="ri-bank-card-line" /></span>
    <div class="withdrawal-amount__cell is-receive">
      <small>收款人实收</small>
      <p><strong>{{ detail.amount }}</strong><span>{{ detail.currency.code }}</span></p>
    </div>
    <div class="withdrawal-amount__cell is-fee">
      <small>固定手续费</small>
      <strong>{{ detail.fee_amount }} {{ detail.currency.code }}</strong>
    </div>
    <div class="withdrawal-amount__cell is-total">
      <small>账户总扣款</small>
      <strong>{{ detail.total_amount }} {{ detail.currency.code }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';

defineProps<{ detail: WithdrawalOrderDetail }>();
</script>

<style scoped lang="scss">
.withdrawal-amount {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 18px;

  &__icon {
    display: grid;
    width: 58px;
    height: 58px;
    flex: 0 0 58px;
    place-items: center;
    border-radius: 16px;
    color: #fff;
    background: linear-gradient(135deg, #16b9aa, #168ab5);
    box-shadow: 0 10px 24px rgb(22 157 158 / 22%);
    font-size: 27px;
  }

  &__cell {
    min-width: 0;
    padding-left: 22px;
    border-left: 1px solid #dce8ef;

    &.is-receive {
      padding-left: 0;
      border-left: 0;
    }

    small {
      color: #74869b;
      font-size: 12px;
    }
  }

  &__cell.is-receive p {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
    margin: 5px 0 0;
  }

  &__cell.is-receive strong {
    color: #10243d;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  &__cell.is-receive span {
    color: #078c84;
    font-size: 16px;
    font-weight: 700;
  }

  &__cell.is-fee strong,
  &__cell.is-total strong {
    display: block;
    margin-top: 5px;
    color: #2e425a;
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  &__cell.is-total strong {
    color: #078c84;
    font-size: 18px;
    font-weight: 700;
  }

  @include mobile {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 14px;

    &__icon {
      width: 50px;
      height: 50px;
      flex-basis: 50px;
      border-radius: 14px;
    }

    &__cell.is-receive {
      flex: 1;
    }

    &__cell.is-fee,
    &__cell.is-total {
      width: 100%;
      padding: 12px 0 0;
      border-top: 1px solid #dce8ef;
      border-left: 0;
    }
  }
}
</style>
