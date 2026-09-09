<template>
  <div class="withdrawal-detail-content">
    <OrderHeader
      :detail="detail"
      :status-type="statusType"
      :status-effect="detail.status === 0 ? 'pending' : undefined"
    />
    <TransactionOverview :detail="detail" />
    <ReviewCard v-if="hasReviewInfo" :detail="detail" />
    <Timeline
      v-if="detail.records.length"
      :records="detail.records"
      :loading="fileLoading"
      @preview="emit('preview', $event)"
      @download="emit('download', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { WITHDRAWAL_STATUS_MAP } from '@/views/withdrawal/composables/useWithdrawalList';
import OrderHeader from './OrderHeader.vue';
import ReviewCard from './ReviewCard.vue';
import TransactionOverview from './TransactionOverview.vue';
import Timeline from './Timeline.vue';
const props = defineProps<{ detail: WithdrawalOrderDetail; fileLoading?: boolean }>();
const emit = defineEmits<{ (e: 'preview' | 'download', id: number): void }>();
const hasReviewInfo = computed(() =>
  Boolean(
    props.detail.review?.admin_name ||
    props.detail.review?.reviewed_at ||
    props.detail.review?.note,
  ),
);
const statusType = computed<StatusBadgeType>(
  () => WITHDRAWAL_STATUS_MAP[props.detail.status]?.type ?? 'gray',
);
</script>
<style scoped lang="scss">
.withdrawal-detail-content {
  display: grid;
  min-width: 0;
  gap: 18px;
}
@include mobile {
  .withdrawal-detail-content {
    gap: 14px;
  }
}
</style>
