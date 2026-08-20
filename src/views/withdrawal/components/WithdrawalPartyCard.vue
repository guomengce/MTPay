<template>
  <DetailCard
    title="付款关系"
    description="提交时保存的付款人与收款人信息"
    icon="ri-arrow-left-right-line"
  >
    <DetailFieldGrid :items="partyItems" @copy="copyField" />
  </DetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';

import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';

const props = defineProps<{ detail: WithdrawalOrderDetail }>();

const partyItems = computed<DetailFieldItem[]>(() => {
  const d = props.detail;
  return [
    { label: '付款人', value: d.payer?.name ?? '—', wide: true },
    { label: '付款人白名单编号', value: d.payer?.whitelist_no ?? '—', mono: true, copyable: true },
    { label: '收款人', value: d.payee?.name ?? '—', wide: true },
    { label: '收款人白名单编号', value: d.payee?.whitelist_no ?? '—', mono: true, copyable: true },
  ];
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
