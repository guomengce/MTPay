<template>
  <DetailCard
    title="审核信息"
    description="平台对本次出金申请的审核结果"
    icon="ri-shield-check-line"
  >
    <DetailFieldGrid :items="items" />
  </DetailCard>
</template>

<script setup lang="ts">
/** 出金审核信息：仅展示接口已经返回的审核字段，不重复订单状态。 */
import { computed } from 'vue';

import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';

const props = defineProps<{ detail: WithdrawalOrderDetail }>();

const items = computed<DetailFieldItem[]>(() => {
  const review = props.detail.review;
  const result: DetailFieldItem[] = [];
  if (review.admin_name) result.push({ label: '审核人', value: review.admin_name });
  if (review.reviewed_at) result.push({ label: '审核时间', value: review.reviewed_at });
  if (review.note) {
    result.push({
      label: props.detail.status === 4 ? '驳回原因' : '审核备注',
      value: review.note,
      wide: true,
    });
  }
  return result;
});
</script>
