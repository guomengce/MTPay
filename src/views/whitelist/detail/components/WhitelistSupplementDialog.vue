<template>
  <AgentDialog
    v-model="dialogVisible"
    :title="t('whitelist.supplementTitle')"
    :icon="UploadFilled"
    width="min(560px, calc(100vw - 32px))"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="!submitting"
    :show-close="!submitting"
    @closed="resetSupplement"
  >
    <el-form label-position="top">
      <el-form-item :label="t('whitelist.supplementFiles')" required>
        <el-upload
          class="wl-supplement-upload"
          v-model:file-list="selectedFiles"
          drag
          multiple
          :auto-upload="false"
          :limit="5"
          accept=".pdf,.png,.jpg,.jpeg"
          :disabled="submitting"
          :on-exceed="onExceed"
        >
          <i class="ri-upload-cloud-2-line wl-upload-icon" />
          <div>{{ t('whitelist.uploadText') }}</div>
          <template #tip
            ><div class="el-upload__tip">{{ t('whitelist.fileLimit') }}</div></template
          >
        </el-upload>
      </el-form-item>
      <el-form-item :label="t('whitelist.supplementNote')"
        ><el-input
          v-model="supplementNote"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          :disabled="submitting"
          :placeholder="t('whitelist.supplementPlaceholder')"
      /></el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="submitting" @click="dialogVisible = false">{{
        t('common.actions.cancel')
      }}</el-button>
      <el-button type="primary" :loading="submitting" @click="sendSupplement">{{
        t('whitelist.submitSupplement')
      }}</el-button>
    </template>
  </AgentDialog>
</template>
<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, type UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import AgentDialog from '@/components/common/AgentDialog.vue';
import type { WhitelistItemDetail, WhitelistFile } from '@/api/modules/whitelist';
import { useWhitelistSupplement } from '../../composables/useWhitelistSupplement';
const props = defineProps<{ detail: WhitelistItemDetail | null }>();
const detail = toRef(props, 'detail');
const dialogVisible = defineModel<boolean>({ default: false });
const emit = defineEmits<{ submitted: [detail: WhitelistItemDetail] }>();
const { t } = useI18n();
const { uploadFile, submit } = useWhitelistSupplement();
const submitting = ref(false);
const selectedFiles = ref<UploadUserFile[]>([]);
const supplementNote = ref('');
const canSupplement = computed(
  () => detail.value?.available_actions?.can_supplement_whitelist === true,
);
function onExceed() {
  ElMessage.warning(t('whitelist.maxFiles'));
}
function resetSupplement() {
  selectedFiles.value = [];
  supplementNote.value = '';
}
async function sendSupplement() {
  if (!detail.value || !canSupplement.value || submitting.value) return;
  if (!selectedFiles.value.length) {
    ElMessage.warning(t('whitelist.selectFile'));
    return;
  }
  for (const file of selectedFiles.value) {
    if (!/\.(pdf|png|jpe?g)$/i.test(file.name)) {
      ElMessage.warning(t('withdrawal.unsupportedFormat'));
      return;
    }
    if (file.raw && file.raw.size > 10 * 1024 * 1024) {
      ElMessage.warning(t('whitelist.fileTooLarge'));
      return;
    }
  }
  const id = detail.value.id;
  submitting.value = true;
  try {
    const fileIds: number[] = [];
    for (const file of selectedFiles.value) {
      let uploaded = file.response as WhitelistFile | undefined;
      if (!uploaded && file.raw) {
        uploaded = await uploadFile(file.raw);
        file.response = uploaded;
      }
      if (uploaded) fileIds.push(uploaded.file_id);
    }
    if (!fileIds.length) {
      ElMessage.warning(t('whitelist.selectFile'));
      return;
    }
    const result = await submit(id, fileIds, supplementNote.value.trim() || undefined);
    emit('submitted', result);
    dialogVisible.value = false;
    ElMessage.success(t('whitelist.supplemented'));
  } catch {
    // 保留已上传文件的 ID，失败后重试不会重复上传。
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped lang="scss">
.wl-supplement-upload {
  width: 100%;
  min-width: 0;

  :deep(.el-upload),
  :deep(.el-upload-dragger),
  :deep(.el-upload-list) {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
}
</style>
