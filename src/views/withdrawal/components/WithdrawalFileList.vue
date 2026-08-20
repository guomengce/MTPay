<template>
  <div class="withdrawal-file-list">
    <el-empty v-if="!files.length" :description="emptyText" :image-size="56" />
    <article v-for="file in files" :key="file.file_id" class="withdrawal-file-list__item">
      <span class="withdrawal-file-list__type">{{ (file.extension || 'FILE').toUpperCase() }}</span>
      <div class="withdrawal-file-list__info">
        <strong :title="file.original_name">{{ file.original_name }}</strong>
        <p>
          {{ file.uploader_name || file.file_type_name || '平台文件' }} ·
          {{ formatSize(file.size) }} · {{ file.uploaded_at || '—' }}
        </p>
      </div>
      <div class="withdrawal-file-list__actions">
        <el-button size="small" type="primary" plain :icon="View" @click="emit('preview', file.file_id)"
          >预览</el-button
        >
        <el-button size="small" plain :icon="Download" @click="emit('download', file.file_id)"
          >下载</el-button
        >
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Download, View } from '@element-plus/icons-vue';

import type { WithdrawalFile } from '@/api/modules/withdrawal';

defineProps<{
  files: WithdrawalFile[];
  emptyText?: string;
}>();
const emit = defineEmits<{
  (e: 'preview', fileId: number): void;
  (e: 'download', fileId: number): void;
}>();

function formatSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
</script>

<style scoped lang="scss">
.withdrawal-file-list {
  display: grid;
  gap: 8px;

  &__item {
    display: grid;
    min-width: 0;
    align-items: center;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    gap: 10px;
    padding: 9px 8px;
    border: 1px solid #e3eaf0;
    border-radius: 10px;
    background: #fbfcfd;

    &:hover {
      background: #f2f8fb;
    }
  }

  &__type {
    display: inline-flex;
    height: 34px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #1267e8;
    background: #e7f0ff;
    font-size: 9px;
    font-weight: 700;
  }

  &__info {
    min-width: 0;

    strong {
      display: block;
      overflow: hidden;
      color: #203249;
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      margin: 3px 0 0;
      color: #7b8b9f;
      font-size: 12px;
    }
  }

  &__actions {
    display: flex;
    gap: 7px;

    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
  }

  @include mobile {
    &__item {
      align-items: start;
      grid-template-columns: 38px minmax(0, 1fr);
    }

    &__actions {
      width: 100%;
      grid-column: 1 / -1;
    }
  }
}
</style>
