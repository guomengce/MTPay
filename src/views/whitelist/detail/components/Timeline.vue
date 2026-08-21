<template>
  <DetailCard class="whitelist-timeline" title="处理时间线" description="处理流程与每次提交的证明文件" icon="ri-time-line">
    <ol class="timeline-list">
      <li v-for="record in records" :key="record.id">
        <span class="timeline-list__dot" />
        <article>
          <header><strong>{{ record.action_name }}</strong><time>{{ record.created_at || '—' }}</time></header>
          <p>{{ record.actor_name || record.actor_type_name }}</p>
          <blockquote v-if="record.message">{{ record.message }}</blockquote>
          <div v-if="record.actor_type === 1" class="timeline-files">
            <p v-if="record.files.length" class="timeline-files__count">本次关联 {{ record.files.length }} 个文件</p>
            <p v-else class="timeline-files__empty">本次未提交证明文件</p>
            <div v-if="record.files.length" class="file-list">
              <article v-for="file in record.files" :key="file.file_id">
                <span class="file-list__type">{{ file.extension?.toUpperCase() || 'FILE' }}</span>
                <div class="file-list__info">
                  <strong :title="file.original_name">{{ file.original_name }}</strong>
                  <p>{{ formatFileSize(file.size) }} · {{ file.uploaded_at || '—' }}</p>
                </div>
                <div class="file-list__actions">
                  <el-button circle size="small" type="primary" plain :icon="View" :loading="loading" title="预览文件" aria-label="预览文件" @click="emit('preview', file.file_id)" />
                  <el-button circle size="small" plain :icon="Download" :loading="loading" title="下载文件" aria-label="下载文件" @click="emit('download', file.file_id)" />
                </div>
              </article>
            </div>
          </div>
        </article>
      </li>
    </ol>
  </DetailCard>
</template>

<script setup lang="ts">
import { Download, View } from '@element-plus/icons-vue';

import type { WhitelistReviewRecord } from '@/api/modules/whitelist';
import DetailCard from '@/components/detail/DetailCard.vue';

defineProps<{ records: WhitelistReviewRecord[]; loading?: boolean }>();
const emit = defineEmits<{ (event: 'preview', fileId: number): void; (event: 'download', fileId: number): void }>();

function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
</script>

<style scoped lang="scss">
.whitelist-timeline { min-height: 460px; }
.timeline-list { display: grid; margin: 0; padding: 0; list-style: none; }
.timeline-list > li { display: grid; position: relative; grid-template-columns: 16px minmax(0, 1fr); gap: 13px; padding-bottom: 22px; }
.timeline-list > li::before { position: absolute; top: 14px; bottom: 0; left: 6px; width: 2px; background: #dbe8eb; content: ''; }
.timeline-list > li:last-child { padding-bottom: 0; }
.timeline-list > li:last-child::before { display: none; }
.timeline-list__dot { z-index: 1; width: 14px; height: 14px; margin-top: 4px; border: 3px solid #d9f3ef; border-radius: 50%; background: #12a79f; }
.timeline-list article { min-width: 0; }
.timeline-list header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.timeline-list header strong { color: #223a55; font-size: 13px; }
.timeline-list time { color: #8492a3; font-size: 11px; white-space: nowrap; }
.timeline-list article > p { margin: 4px 0 0; color: #718298; font-size: 11px; }
.timeline-list blockquote { margin: 9px 0 0; padding: 9px 11px; border-left: 3px solid #efbd62; border-radius: 7px; color: #695631; background: #fff9ec; font-size: 12px; }
.timeline-files { margin-top: 11px; overflow: hidden; border: 1px solid #e0e8f0; border-radius: 11px; background: #fbfcfe; }
.timeline-files__count, .timeline-files__empty { margin: 0 !important; padding: 9px 11px; font-size: 11px !important; }
.timeline-files__count { border-bottom: 1px solid #e6edf3; color: #087f7b !important; background: #f1faf8; font-weight: 650; }
.timeline-files__empty { color: #718298 !important; }
.file-list { display: grid; padding: 7px; }
.file-list article { display: grid; min-width: 0; align-items: center; padding: 8px 7px; border-radius: 8px; grid-template-columns: 42px minmax(0, 1fr) auto; gap: 10px; }
.file-list article:hover { background: #f1f6fa; }
.file-list__type { display: grid; height: 34px; place-items: center; border-radius: 8px; color: #126df0; background: #e9f2ff; font-size: 9px; font-weight: 750; }
.file-list__info { min-width: 0; }
.file-list__info strong { display: block; overflow: hidden; color: #203249; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.file-list__info p { margin: 3px 0 0 !important; color: #718298 !important; font-size: 10px !important; }
.file-list__actions { display: flex; gap: 6px; }
.file-list__actions :deep(.el-button + .el-button) { margin-left: 0; }
.file-list__actions :deep(.el-button.is-circle) { width: 32px; min-width: 32px; height: 32px; padding: 0; border-radius: 50%; }
@include mobile {
  .whitelist-timeline { min-height: 360px; }
  .file-list article { grid-template-columns: 38px minmax(0, 1fr); }
  .file-list__actions { width: 100%; justify-content: flex-end; grid-column: 1 / -1; }
}
</style>
