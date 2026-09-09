<template>
  <AgentDialog
    :model-value="modelValue"
    :title="t(mode === 'risk' ? 'withdrawal.riskSupplementTitle' : 'withdrawal.supplementTitle')"
    :icon="UploadFilled"
    width="min(560px, calc(100vw - 24px))"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="close"
  >
    <div v-if="requirement" class="withdrawal-supplement-dialog__requirement">
      <i class="ri-error-warning-line" />
      <div>
        <strong>{{
          t(mode === 'risk' ? 'withdrawal.riskRequirement' : 'withdrawal.platformRequirement')
        }}</strong>
        <p>{{ requirement }}</p>
      </div>
    </div>

    <el-form label-position="top">
      <el-form-item :label="t('withdrawal.supplementFiles')" required>
        <el-upload
          v-model:file-list="fileList"
          class="withdrawal-supplement-dialog__upload"
          drag
          :auto-upload="false"
          :multiple="true"
          :limit="5"
          :on-exceed="handleExceed"
          accept=".pdf,.png,.jpg,.jpeg"
          @change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            {{ t('withdrawal.dropFiles') }}<em>{{ t('withdrawal.clickSelect') }}</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ t('withdrawal.fileLimit') }}
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item :label="t('withdrawal.supplementNote')">
        <el-input
          v-model="message"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          :placeholder="t('withdrawal.supplementPlaceholder')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="withdrawal-supplement-dialog__footer">
        <div>
          <el-button @click="close">{{ t('common.actions.cancel') }}</el-button>
          <el-button type="primary" :loading="submitting || uploading" @click="submit">
            {{ t('withdrawal.submitSupplement') }}
          </el-button>
        </div>
      </div>
    </template>
  </AgentDialog>
</template>

<script setup lang="ts">
/** 法币出金补件弹框，在记录列表与详情页面共用。 */
/** 法币出金补件弹框：只收集文件与说明，接口调用由页面级逻辑统一处理。 */
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

import type { WithdrawalFile, WithdrawalOrder } from '@/api/modules/withdrawal';
import AgentDialog from '@/components/common/AgentDialog.vue';

const props = defineProps<{
  modelValue: boolean;
  row: WithdrawalOrder | null;
  requirement?: string;
  submitting?: boolean;
  uploading?: boolean;
  uploadFile?: (file: File) => Promise<WithdrawalFile>;
  mode?: 'business' | 'risk';
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', payload: { file_ids: number[]; message?: string }): void;
}>();

const fileList = ref<UploadUserFile[]>([]);
const message = ref('');
const { t } = useI18n();

function reset() {
  fileList.value = [];
  message.value = '';
}

function close() {
  emit('update:modelValue', false);
}

function handleExceed() {
  ElMessage.warning(t('withdrawal.maxFiles'));
}
async function handleFileChange(file: UploadFile, files: UploadFiles) {
  fileList.value = files;
  if (!file.raw || file.status === 'success' || !props.uploadFile) return;
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !['pdf', 'png', 'jpg', 'jpeg'].includes(extension)) {
    ElMessage.warning(t('withdrawal.unsupportedFormat'));
    fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
    return;
  }
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.warning(t('withdrawal.fileTooLarge'));
    fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
    return;
  }
  try {
    file.status = 'uploading';
    file.response = await props.uploadFile(file.raw);
    file.status = 'success';
  } catch {
    file.status = 'fail';
    fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
  }
}

function submit() {
  const fileIds = [
    ...new Set(
      fileList.value
        .map((item) => (item.response as WithdrawalFile | undefined)?.file_id)
        .filter((id): id is number => typeof id === 'number'),
    ),
  ];
  if (!fileIds.length) {
    ElMessage.warning(t('withdrawal.selectFile'));
    return;
  }
  emit('submit', { file_ids: fileIds, message: message.value.trim() || undefined });
}

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) reset();
  },
);
</script>

<style scoped lang="scss">
.withdrawal-supplement-dialog {
  &__requirement {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    padding: 13px 15px;
    border: 1px solid #f1d7a2;
    border-radius: 11px;
    color: #8b5b0c;
    background: #fff8e8;

    > i {
      margin-top: 2px;
    }

    strong {
      font-size: 13px;
    }

    p {
      margin: 4px 0 0;
      font-size: 13px;
      line-height: 1.55;
    }
  }

  &__upload {
    width: 100%;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;

    > span {
      color: #7b8da2;
      font-size: 12px;
    }
  }
}

@include mobile {
  .withdrawal-supplement-dialog {
    &__footer {
      align-items: stretch;
      flex-direction: column;
    }

    &__footer > div {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
