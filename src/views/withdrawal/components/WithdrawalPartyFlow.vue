<template>
  <div class="withdrawal-party-flow">
    <div class="withdrawal-party-flow__party">
      <span class="withdrawal-party-flow__type is-payer">
        付款人<template v-if="payerType"> · {{ payerType }}</template>
      </span>
      <strong :title="payerName || undefined">{{ payerName || '—' }}</strong>
    </div>
    <FlowArrow class="withdrawal-party-flow__arrow" />
    <div class="withdrawal-party-flow__party">
      <span class="withdrawal-party-flow__type is-payee">
        收款人<template v-if="payeeType"> · {{ payeeType }}</template>
      </span>
      <strong :title="payeeName || undefined">{{ payeeName || '—' }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlowArrow from '@/components/common/FlowArrow.vue';

defineProps<{
  payerName?: string | null;
  payerType?: string | null;
  payeeName?: string | null;
  payeeType?: string | null;
}>();
</script>

<style scoped lang="scss">
.withdrawal-party-flow {
  display: grid;
  width: min(100%, 320px);
  min-width: 0;
  align-items: stretch;
  margin: 0 auto;
  padding: 8px 0;
  grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr);
  gap: 8px;

  &__party {
    display: flex;
    min-width: 0;
    min-height: 52px;
    justify-content: center;
    flex-direction: column;
    gap: 7px;

    &:first-child { align-items: flex-end; text-align: right; }
    &:last-child { align-items: flex-start; text-align: left; }

    strong {
      display: block;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      color: #213a54;
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:first-child strong { text-align: right; }
    &:last-child strong { text-align: left; }
  }

  &__type {
    display: inline-flex;
    width: fit-content;
    height: 24px;
    flex: none;
    align-items: center;
    padding: 0 9px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 700;

    &.is-payer { color: #087f79; background: #e8f7f5; }
    &.is-payee { color: #3469a5; background: #edf4fb; }
  }

  &__arrow { align-self: center; justify-self: center; }
}
</style>
