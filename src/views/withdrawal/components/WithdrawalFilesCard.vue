<template>
  <DetailCard :title="title" :description="description" :icon="icon">
    <WithdrawalFileList
      :files="files"
      :empty-text="emptyText"
      @preview="emit('preview', $event)"
      @download="emit('download', $event)"
    />
  </DetailCard>
</template>

<script setup lang="ts">
import type { WithdrawalFile } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';
import WithdrawalFileList from './WithdrawalFileList.vue';

defineProps<{
  title: string;
  description: string;
  icon: string;
  files: WithdrawalFile[];
  emptyText: string;
}>();
const emit = defineEmits<{
  (e: 'preview', fileId: number): void;
  (e: 'download', fileId: number): void;
}>();
</script>
