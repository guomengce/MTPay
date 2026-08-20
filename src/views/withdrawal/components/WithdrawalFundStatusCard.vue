<template>
  <DetailCard
    title="资金状态"
    description="提交时冻结，付款完成时正式扣除；驳回或付款失败自动释放"
    icon="ri-wallet-3-line"
  >
    <DetailFieldGrid :items="fundItems" @copy="copyField" />
  </DetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';

import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';

const props = defineProps<{ detail: WithdrawalOrderDetail }>();

/** 只展示真实发生过的资金节点，避免整排破折号。 */
const fundItems = computed<DetailFieldItem[]>(() => {
  const d = props.detail;
  const items: DetailFieldItem[] = [];
  if (d.fund_times?.frozen_at) {
    items.push({ label: '资金冻结时间', value: d.fund_times.frozen_at });
  }
  if (d.payment?.processing_at) {
    items.push({ label: '进入付款处理', value: d.payment.processing_at });
  }
  if (d.payment?.completed_at) {
    items.push({ label: '付款完成（正式扣除）', value: d.payment.completed_at, accent: true });
  }
  if (d.fund_times?.rejected_at) {
    items.push({ label: '审核驳回时间', value: d.fund_times.rejected_at });
  }
  if (d.payment?.failed_at) {
    items.push({ label: '付款失败时间', value: d.payment.failed_at });
  }
  if (d.fund_times?.released_at) {
    items.push({ label: '资金释放时间', value: d.fund_times.released_at });
  }
  if (d.status === 4 && d.review?.note) {
    items.push({ label: '驳回说明', value: d.review.note, wide: true });
  }
  if (d.status === 5 && d.payment?.failure_reason) {
    items.push({ label: '付款失败原因', value: d.payment.failure_reason, wide: true });
  }
  return items;
});

async function copyField(item: DetailFieldItem) {
  try {
    await navigator.clipboard.writeText(item.value);
    ElMessage.success(`${item.label}已复制`);
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
}
</script>
