<template>
  <el-form class="withdrawal-form" label-position="top" :model="form">
    <el-form-item label="收款金额（USD）">
      <el-input v-model="form.amount" size="large" />
    </el-form-item>

    <div class="withdrawal-form__people">
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

    <el-alert
      class="withdrawal-form__warning"
      title="付款人与收款人不是同一企业或同一个人，请上传合同及Invoice。"
      type="warning"
      :closable="false"
      show-icon
    />

    <div class="withdrawal-form__uploads">
      <el-form-item label="合同">
        <el-upload action="#" :auto-upload="false">
          <el-button>选择文件</el-button>
          <template #tip>
            <span>未选择任何文件</span>
            <p>支持 PDF、PNG、JPG</p>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="Invoice">
        <el-upload action="#" :auto-upload="false">
          <el-button>选择文件</el-button>
          <template #tip>
            <span>未选择任何文件</span>
            <p>支持 PDF、PNG、JPG</p>
          </template>
        </el-upload>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
  amount: '5',
  payer: 'harbor',
  payee: 'northstar',
});
</script>

<style scoped lang="scss">
.withdrawal-form {
  min-width: 0;

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #071833;
    font-size: 16px;
    font-weight: 850;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 52px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #cbd8e8 inset;
  }

  &__people,
  &__uploads {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }

  &__warning {
    margin-bottom: 16px;
    border-color: #f2cf8f;
    border-radius: 8px;
  }

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger),
  :deep(.el-upload-list) {
    display: none;
  }

  :deep(.el-upload__tip) {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 0;
    color: #071833;
    font-size: 15px;
  }

  :deep(.el-upload__tip p) {
    flex: 0 0 100%;
    margin: 8px 0 0;
    color: #8a98aa;
    font-size: 13px;
    font-weight: 650;
  }

  :deep(.el-button) {
    height: 38px;
    border-radius: 6px;
    font-weight: 800;
  }

  @include mobile {
    &__people,
    &__uploads {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
}
</style>
