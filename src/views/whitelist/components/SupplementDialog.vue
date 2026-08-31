<template>
  <el-dialog
    :model-value="modelValue"
    class="whitelist-supplement-dialog"
    width="min(560px, calc(100vw - 24px))"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="close"
  >
    <template #header>
      <div class="supplement-dialog__header">
        <span class="supplement-dialog__icon"><i class="ri-file-upload-line" /></span>
        <div>
          <h2>{{ t('whitelist.supplementTitle') }}</h2>
          <p>{{ t('whitelist.supplementDesc') }}</p>
        </div>
      </div>
    </template>

    <div v-if="supplementRequirement" class="supplement-dialog__requirement">
      <i class="ri-error-warning-line" />
      <div>
        <strong>{{ t('whitelist.platformRequirement') }}</strong>
        <p>{{ supplementRequirement }}</p>
      </div>
    </div>

    <el-form label-position="top">
      <el-form-item :label="t('whitelist.supplementFiles')" required>
        <el-upload
          v-model:file-list="fileList"
          class="supplement-dialog__upload"
          drag
          :auto-upload="false"
          :multiple="true"
          :limit="5"
          :on-exceed="handleExceed"
          accept=".pdf,.png,.jpg,.jpeg"
          @change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">{{ t('whitelist.dropFiles') }}<em>{{ t('whitelist.clickSelect') }}</em></div>
          <template #tip>
            <div class="el-upload__tip">
              {{ t('whitelist.fileLimit') }}
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item :label="t('whitelist.supplementNote')">
        <el-input
          v-model="message"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          :placeholder="t('whitelist.supplementPlaceholder')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="supplement-dialog__footer">
        <span><i class="ri-lock-line" /> {{ t('whitelist.secureUpload') }}</span>
        <div>
          <el-button @click="close">{{ t('common.actions.cancel') }}</el-button>
          <el-button type="primary" :loading="submitting || uploading" @click="submit">
            {{ t('whitelist.submitSupplement') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/** 白名单补件弹框：只收集文件与说明，接口调用由页面级 composable 统一处理。 */
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

import type { WhitelistFile, WhitelistItem } from '@/api/modules/whitelist';

const props = defineProps<{
  modelValue: boolean;
  item: WhitelistItem | null;
  supplementRequirement?: string;
  submitting?: boolean;
  uploading?: boolean;
  uploadFile: (file: File) => Promise<WhitelistFile>;
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
  ElMessage.warning(t('whitelist.maxFiles'));
}
async function handleFileChange(file:UploadFile,files:UploadFiles){fileList.value=files;if(!file.raw||file.status==='success')return;if(file.raw.size>10*1024*1024){ElMessage.warning(t('whitelist.fileTooLarge'));fileList.value=fileList.value.filter(item=>item.uid!==file.uid);return}try{file.status='uploading';file.response=await props.uploadFile(file.raw);file.status='success'}catch{file.status='fail';fileList.value=fileList.value.filter(item=>item.uid!==file.uid)}}

function submit() {
  const fileIds=fileList.value.map(item=>(item.response as WhitelistFile|undefined)?.file_id).filter((id):id is number=>typeof id==='number');
  if (!fileIds.length) {
    ElMessage.warning(t('whitelist.selectFile'));
    return;
  }
  emit('submit', { file_ids:fileIds, message: message.value.trim() || undefined });
}

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) reset();
  },
);
</script>

<style scoped lang="scss">
.supplement-dialog {
  &__header {
    display: flex;
    align-items: center;
    gap: 14px;

    h2 {
      margin: 0;
      color: #102a49;
      font-size: 20px;
    }
    p {
      margin: 5px 0 0;
      color: #718298;
      font-size: 13px;
    }
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    color: #079d98;
    background: #e7f8f6;
    font-size: 22px;
  }

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
    justify-content: space-between;
    gap: 16px;

    > span {
      color: #7b8da2;
      font-size: 12px;
    }
  }
}

:global(.whitelist-supplement-dialog) {
  overflow: hidden;
  border-radius: 18px;
}

:global(.whitelist-supplement-dialog .el-dialog__header) {
  margin: 0;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #e8eef3;
}
:global(.whitelist-supplement-dialog .el-dialog__body) {
  padding: 22px 24px 8px;
}
:global(.whitelist-supplement-dialog .el-dialog__footer) {
  padding: 16px 24px 20px;
  border-top: 1px solid #e8eef3;
}

@include mobile {
  .supplement-dialog {
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
