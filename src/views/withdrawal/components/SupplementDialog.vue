<template>
  <AgentDialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="t('withdrawal.supplementTitle')"
    :icon="UploadFilled"
    width="min(560px, calc(100vw - 32px))"
    append-to-body
    :close-on-press-escape="!busy"
    :show-close="!busy"
    @closed="resetSupplement"
  >
    <div v-loading="loading" class="supplement-content" :aria-busy="Boolean(loading)">
      <section v-if="requirement && !loading" class="supplement-requirement">
        <strong>{{ t('withdrawal.adminSupplementLabel') }}</strong>
        <p>{{ requirement }}</p>
      </section>
      <el-form label-position="top">
        <el-form-item :label="t('withdrawal.supplementFiles')" required>
          <el-upload
            v-model:file-list="selectedFiles"
            class="wd-upload"
            drag
            multiple
            :auto-upload="false"
            :limit="5"
            accept=".pdf,.png,.jpg,.jpeg"
            :disabled="busy"
            :on-exceed="onExceed"
            ><i class="ri-upload-cloud-2-line wd-upload-icon" />
            <div>{{ t('whitelist.uploadText') }}</div>
            <template #tip
              ><div class="el-upload__tip">{{ t('withdrawal.fileLimit') }}</div></template
            ></el-upload
          >
        </el-form-item>
        <el-form-item :label="t('withdrawal.supplementNote')"
          ><el-input
            v-model="supplementNote"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            :disabled="busy"
            :placeholder="t('withdrawal.supplementPlaceholder')"
        /></el-form-item>
      </el-form>
    </div>
    <template #footer
      ><el-button :disabled="busy" @click="emit('update:modelValue', false)">{{
        t('common.actions.cancel')
      }}</el-button
      ><el-button
        type="primary"
        :disabled="loading"
        :loading="submitting || uploading || uploadingLocal"
        @click="sendSupplement"
        >{{ t('withdrawal.submitSupplement') }}</el-button
      ></template
    >
  </AgentDialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, type UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import AgentDialog from '@/components/common/AgentDialog.vue';
import type { WithdrawalOrder, WithdrawalFile } from '@/api/modules/withdrawal';
const props = defineProps<{
  modelValue: boolean;
  row: WithdrawalOrder | null;
  requirement?: string;
  loading?: boolean;
  submitting?: boolean;
  uploading?: boolean;
  uploadFile?: (file: File) => Promise<WithdrawalFile>;
  mode?: 'business' | 'risk';
}>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [payload: { file_ids: number[]; message?: string }];
}>();
const { t } = useI18n();
const selectedFiles = ref<UploadUserFile[]>([]),
  supplementNote = ref(''),
  uploadingLocal = ref(false);
const busy = computed(() =>
  Boolean(props.loading || props.submitting || props.uploading || uploadingLocal.value),
);
function resetSupplement() {
  selectedFiles.value = [];
  supplementNote.value = '';
}
function onExceed() {
  ElMessage.warning(t('withdrawal.maxFiles'));
}
async function sendSupplement() {
  if (busy.value || !props.row || !props.uploadFile) return;
  if (!selectedFiles.value.length) {
    ElMessage.warning(t('withdrawal.selectFile'));
    return;
  }
  for (const file of selectedFiles.value) {
    if (!/\.(pdf|png|jpe?g)$/i.test(file.name)) {
      ElMessage.warning(t('withdrawal.unsupportedFormat'));
      return;
    }
    if (file.raw && file.raw.size > 10 * 1024 * 1024) {
      ElMessage.warning(t('withdrawal.fileTooLarge'));
      return;
    }
  }
  uploadingLocal.value = true;
  try {
    const ids: number[] = [];
    for (const file of selectedFiles.value) {
      let uploaded = file.response as WithdrawalFile | undefined;
      if (!uploaded && file.raw) {
        uploaded = await props.uploadFile(file.raw);
        file.response = uploaded;
      }
      if (uploaded) ids.push(uploaded.file_id);
    }
    if (ids.length)
      emit('submit', {
        file_ids: [...new Set(ids)],
        message: supplementNote.value.trim() || undefined,
      });
  } catch {
    /* 已上传文件保留 ID，重试不重复上传。 */
  } finally {
    uploadingLocal.value = false;
  }
}
</script>
<style scoped lang="scss">
.wd-upload {
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
.wd-upload-icon {
  display: block;
  margin-bottom: 12px;
  color: #0aa4a0;
  font-size: 32px;
}
.supplement-requirement {
  margin-bottom: 20px;
  padding: 12px 14px;
  background: #fff9ed;
  border-radius: 10px;
  white-space: pre-wrap;
  strong {
    color: #986617;
    font-size: 14px;
  }
  p {
    margin: 6px 0 0;
    line-height: 1.6;
  }
}
</style>
