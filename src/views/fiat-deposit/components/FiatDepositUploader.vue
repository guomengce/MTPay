<template>
  <div class="fiat-uploader">
    <el-upload :auto-upload="false" :show-file-list="false" :multiple="true" :accept="accept" :disabled="uploading || files.length >= rules.max_files" :on-change="selectFile">
      <el-button plain :icon="Upload" :loading="uploading" :disabled="files.length >= rules.max_files">{{ t('fiatDeposit.selectFile') }}</el-button>
      <template #tip>
        <p class="fiat-uploader__tip">{{ t('fiatDeposit.fileTip', { formats, count: rules.max_files, size: rules.max_file_size_mb }) }}</p>
      </template>
    </el-upload>
    <ul v-if="files.length" class="fiat-uploader__files">
      <li v-for="file in files" :key="file.file_id">
        <span class="fiat-uploader__name"><el-icon><Document /></el-icon><span>{{ file.original_name }}</span></span>
        <el-button class="fiat-uploader__remove" link :icon="Close" :aria-label="t('fiatDeposit.removeFile')" @click="$emit('remove', file.file_id)" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Close, Document, Upload } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import type { FiatFile, FiatFileRules } from '@/api/modules/fiatDeposit';
const props = defineProps<{ files: FiatFile[]; rules: FiatFileRules; uploading: boolean }>();
const { t } = useI18n();
const emit = defineEmits<{ (event: 'select', file: File): void; (event: 'remove', fileId: number): void }>();
const accept = computed(() => props.rules.allowed_extensions.map((item) => `.${item}`).join(','));
const formats = computed(() => props.rules.allowed_extensions.map((item) => item.toUpperCase()).join(' / '));
function selectFile(file: UploadFile) {
  if (!file.raw) return;
  if (props.files.length >= props.rules.max_files) return void ElMessage.warning(t('fiatDeposit.maxFiles', { count: props.rules.max_files }));
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!props.rules.allowed_extensions.map((item) => item.toLowerCase()).includes(extension)) return void ElMessage.warning(t('fiatDeposit.unsupportedFormat'));
  if ((file.size ?? file.raw.size) > props.rules.max_file_size_mb * 1024 * 1024) return void ElMessage.warning(t('fiatDeposit.fileTooLarge', { size: props.rules.max_file_size_mb }));
  emit('select', file.raw);
}
</script>
<style scoped lang="scss">
.fiat-uploader { width: 100%;
  &__tip { margin: 8px 0 0; color: #71839b; font-size: 12px; line-height: 1.5; }
  &__files { margin: 8px 0 0; padding: 0; list-style: none; }
  &__files li { display: flex; height: 32px; min-width: 0; align-items: center; justify-content: space-between; padding: 0 5px; border-radius: 4px; transition: background-color .2s; }
  &__files li:hover { background: var(--el-fill-color-light); }
  &__name { display: inline-flex; min-width: 0; align-items: center; gap: 6px; color: var(--el-text-color-regular); font-size: 14px; }
  &__name > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__name > .el-icon { flex: 0 0 auto; color: var(--el-text-color-secondary); }
  &__remove { width: 24px; min-width: 24px; height: 24px; flex: 0 0 24px; padding: 0; color: var(--el-text-color-secondary); }
  &__remove:hover { color: var(--el-color-danger); }
}
</style>
