<template>
  <DetailCard
    :title="t('withdrawal.reviewInfo')"
    icon="ri-shield-check-line"
  >
    <DetailFieldGrid :items="items" />
  </DetailCard>
</template>

<script setup lang="ts">
/** 法币出金审核信息：仅展示接口已经返回的审核字段，不重复订单状态。 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';

const props = defineProps<{ detail: WithdrawalOrderDetail }>();

const items = computed<DetailFieldItem[]>(() => {
  const review = props.detail.review;
  const result: DetailFieldItem[] = [];
  if (review.admin_name) result.push({ label: t('withdrawal.reviewer'), value: review.admin_name });
  if (review.reviewed_at) result.push({ label: t('withdrawal.reviewedAt'), value: review.reviewed_at });
  if (review.note) {
    result.push({
      label: props.detail.status === 4 ? t('withdrawal.rejectionReason') : t('withdrawal.reviewNote'),
      value: review.note,
      wide: true,
    });
  }
  return result;
});
const { t } = useI18n();
</script>
