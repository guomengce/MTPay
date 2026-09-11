<template>
  <div class="withdrawal-detail-content">
    <section class="wd-panel wd-overview">
      <OrderHeader :detail="detail" /><ReviewCard
        :detail="detail"
        :readonly="readonly"
        @supplement="emit('supplement', $event)"
      /><PaymentInfo :detail="detail" />
    </section>
    <TransactionOverview :detail="detail" />
  </div>
</template>
<script setup lang="ts">
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import OrderHeader from './OrderHeader.vue';
import ReviewCard from './ReviewCard.vue';
import PaymentInfo from './PaymentInfo.vue';
import TransactionOverview from './TransactionOverview.vue';
withDefaults(defineProps<{ detail: WithdrawalOrderDetail; readonly?: boolean }>(), {
  readonly: true,
});
const emit = defineEmits<{ supplement: [mode: 'business' | 'risk'] }>();
</script>
<style lang="scss" src="../withdrawal-detail.scss"></style>
