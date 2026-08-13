<template>
  <el-form class="apply-form" label-position="top" :model="form">
    <div class="apply-form__people">
      <el-form-item label="付款人">
        <el-select v-model="form.payer" size="large">
          <el-option label="B · Harbor Trade Pte. Ltd." value="harbor" />
        </el-select>
      </el-form-item>

      <el-form-item label="收款人">
        <el-select v-model="form.payee" size="large">
          <el-option label="B · Northstar Supplies LLC" value="northstar" />
        </el-select>
      </el-form-item>
    </div>

    <el-form-item label="出金金额（USD）">
      <el-input v-model="form.amount" size="large" />
      <div class="apply-form__hint">
        <span>最低出资金额为 5.00 USD</span>
        <span>可用余额：184,350.00 USD</span>
      </div>
    </el-form-item>

    <!-- <el-alert
      class="apply-form__warning"
      title="付款人与收款人不是同一企业或同一人时，请上传合同及 Invoice。"
      type="warning"
      :closable="false"
      show-icon
    /> -->

    <div class="apply-form__uploads">
      <el-form-item label="合同（必填）">
        <el-upload
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          drag
        >
          <div class="apply-form__upload">
            <el-icon class="apply-form__upload-icon"><UploadFilled /></el-icon>
            <div class="apply-form__upload-text">
              <strong>点击上传或拖拽文件到此处</strong>
            </div>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="Invoice（必填）">
        <el-upload
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          drag
        >
          <div class="apply-form__upload">
            <el-icon class="apply-form__upload-icon"><UploadFilled /></el-icon>
            <div class="apply-form__upload-text">
              <strong>点击上传或拖拽文件到此处</strong>
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </div>

    <div class="apply-form__tip">
      <el-icon><Lock /></el-icon>
      <span>支持 PDF / PNG / JPG的文件，单个文件大小不超过 10MB。</span>
    </div>

    <div class="apply-form__submit-row">
      <el-button class="apply-form__submit" type="primary" size="large">
        提交USD出金
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {
  CircleCheck,
  Lock,
  UploadFilled,
} from '@element-plus/icons-vue';
import { reactive } from 'vue';

const form = reactive({
  amount: '5,000.00',
  payer: 'harbor',
  payee: 'northstar',
});
</script>

<style scoped lang="scss">
.apply-form {
  min-width: 0;
  padding-right: 28px;
  border-right: 1px solid #e4ebf3;

  &__people {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }

  &__hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    color: #7387a2;
    font-size: 12px;
    font-weight: 600;
  }

  &__uploads {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #0c2a5a;
    font-size: 14px;
    font-weight: 700;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 46px;
    border-radius: 8px;
    background: #f5f8fb;
    box-shadow: 0 0 0 1px #e2e8f0 inset;
  }

  :deep(.el-input__wrapper.is-focus),
  :deep(.el-select__wrapper.is-focused) {
    background: #ffffff;
    box-shadow: 0 0 0 1px #27b9aa inset;
  }

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    background: #f5f8fb;
    border: 1px dashed #c8d9e7;
    border-radius: 10px;
    cursor: pointer;
    transition:
      border-color 0.2s,
      background-color 0.2s;

    &:hover {
      background: #ebf5ff;
      border-color: #2878ff;
    }
  }

  &__upload {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
  }

  &__upload-icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
    font-size: 20px;
  }

  &__upload-text {
    display: grid;
    min-width: 0;
    gap: 4px;

    strong {
      color: #0c2a5a;
      font-size: 13px;
      font-weight: 700;
    }

    span {
      color: #7387a2;
      font-size: 12px;
      font-weight: 600;
    }
  }

  &__tip {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    color: #7387a2;
    font-size: 12px;
    font-weight: 600;

    .el-icon {
      font-size: 14px;
      color: #7387a2;
    }
  }

  &__submit-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
  }

  &__submit {
    width:100%;
    height: 48px;
    padding: 0 32px;
    border: 0;
    border-radius: 8px;
    background: linear-gradient(135deg, #27b9aa 0%, #1d8db5 100%);
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: 0 8px 20px rgb(39 185 170 / 30%);

    &:hover,
    &:focus {
      background: linear-gradient(135deg, #22aa9d 0%, #187fa3 100%);
    }
  }

  &__submit-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #7387a2;
    font-size: 12px;
    font-weight: 600;

    .el-icon {
      color: #10aaa4;
      font-size: 14px;
    }
  }

  @include narrow {
    padding-right: 0;
    border-right: 0;

    &__people,
    &__uploads {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    &__people,
    &__uploads {
      grid-template-columns: 1fr;
    }

    &__submit-row {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
  }
}
</style>
