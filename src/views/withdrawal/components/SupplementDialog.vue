<template>
  <el-dialog
    :model-value="modelValue"
    class="withdrawal-supplement-dialog"
    width="560px"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="close"
  >
    <template #header>
      <div class="withdrawal-supplement-dialog__header">
        <span class="withdrawal-supplement-dialog__icon"><i class="ri-file-upload-line" /></span>
        <div>
          <h2>补充出金证明文件</h2>
          <p>根据平台的补件要求上传新的证明材料</p>
        </div>
      </div>
    </template>

    <div v-if="requirement" class="withdrawal-supplement-dialog__requirement">
      <i class="ri-error-warning-line" />
      <div>
        <strong>平台补件要求</strong>
        <p>{{ requirement }}</p>
      </div>
    </div>

    <el-form label-position="top">
      <el-form-item label="补充文件" required>
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
          <div class="el-upload__text">拖放文件到这里，或<em>点击选择</em></div>
          <template #tip>
            <div class="el-upload__tip">
              支持 PDF、PNG、JPG、JPEG；单个文件不超过 10 MB，本轮最多 5 个
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="补件说明">
        <el-input
          v-model="message"
          type="textarea"
          :rows="3"
          maxlength="1000"
          show-word-limit
          placeholder="说明本次补充的文件内容（选填）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="withdrawal-supplement-dialog__footer">
        <span><i class="ri-lock-line" /> 文件将通过安全连接上传</span>
        <div>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" :loading="submitting || uploading" @click="submit">
            提交补件
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/** 出金补件弹框，在记录列表与详情页面共用。 */
/** 出金补件弹框：只收集文件与说明，接口调用由页面级逻辑统一处理。 */
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';

import type { WithdrawalFile, WithdrawalOrder } from '@/api/modules/withdrawal';

const props = defineProps<{
  modelValue: boolean;
  row: WithdrawalOrder | null;
  requirement?: string;
  submitting?: boolean;
  uploading?: boolean;
  uploadFile?: (file: File) => Promise<WithdrawalFile>;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', payload: { file_ids: number[]; message?: string }): void;
}>();

const fileList = ref<UploadUserFile[]>([]);
const message = ref('');

function reset() {
  fileList.value = [];
  message.value = '';
}

function close() {
  emit('update:modelValue', false);
}

function handleExceed() {
  ElMessage.warning('本轮最多上传 5 个文件');
}
async function handleFileChange(file: UploadFile, files: UploadFiles) {
  fileList.value = files;
  if (!file.raw || file.status === 'success' || !props.uploadFile) return;
  if (file.raw.size > 10 * 1024 * 1024) { ElMessage.warning('单个文件不能超过 10 MB'); fileList.value=fileList.value.filter(item=>item.uid!==file.uid); return; }
  try { file.status='uploading'; file.response=await props.uploadFile(file.raw); file.status='success'; }
  catch { file.status='fail'; fileList.value=fileList.value.filter(item=>item.uid!==file.uid); }
}

function submit() {
  const fileIds=fileList.value.map(item=>(item.response as WithdrawalFile|undefined)?.file_id).filter((id):id is number=>typeof id==='number');
  if (!fileIds.length) {
    ElMessage.warning('请至少选择一个补件文件');
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
.withdrawal-supplement-dialog {
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

:global(.withdrawal-supplement-dialog) {
  overflow: hidden;
  border-radius: 18px;
}

:global(.withdrawal-supplement-dialog .el-dialog__header) {
  margin: 0;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #e8eef3;
}

:global(.withdrawal-supplement-dialog .el-dialog__body) {
  padding: 22px 24px 8px;
}

:global(.withdrawal-supplement-dialog .el-dialog__footer) {
  padding: 16px 24px 20px;
  border-top: 1px solid #e8eef3;
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
