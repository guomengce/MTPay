<template>
  <DetailCard
    title="处理时间线"
    description="由后端返回的订单真实处理节点"
    icon="ri-time-line"
  >
    <DetailTimeline :items="items" />
  </DetailCard>
</template>

<script setup lang="ts">
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailTimeline from '@/components/detail/DetailTimeline.vue';

defineProps<{
  items: { event: string; name: string; time: string | null; description?: string }[];
}>();
</script>
