<template>
  <el-card class="apply-form" shadow="never">
    <el-form label-position="top" :model="form">
      <div class="apply-form__selectors">
        <el-form-item label="入金币种">
          <el-select v-model="form.asset" size="large">
            <el-option label="USDT" value="USDT" />
            <el-option label="USDC" value="USDC" />
          </el-select>
        </el-form-item>
        <el-form-item label="区块链网络">
          <el-select v-model="form.network" size="large">
            <el-option label="TRC20" value="TRC20" />
            <el-option label="ERC20" value="ERC20" />
          </el-select>
        </el-form-item>
      </div>

      <section class="apply-form__address">
        <div class="apply-form__qr" aria-label="USDT TRC20 入金二维码">
          <span v-for="cell in qrCells" :key="cell" :class="{ 'is-dark': cell % 3 !== 1 }"></span>
        </div>

        <div class="apply-form__address-main">
          <p>{{ form.asset }}（{{ form.network }}）入金地址</p>
          <div class="apply-form__copy-row">
            <el-input v-model="form.address" size="large" readonly />
            <el-button type="primary" plain :icon="CopyDocument">复制</el-button>
          </div>
          <el-alert
            title="仅向此地址转入TRC20网络的USDT。"
            type="warning"
            :closable="false"
            show-icon
          />
        </div>
      </section>

      <div class="apply-form__fields">
        <el-form-item label="已转账数量">
          <el-input v-model="form.amount" size="large" placeholder="例如 1000" />
        </el-form-item>
        <el-form-item label="交易哈希（TxID）">
          <el-input v-model="form.txId" size="large" placeholder="请填写链上交易哈希" />
        </el-form-item>
      </div>

      <el-alert
        class="apply-form__notice"
        title="提交后不会立即增加余额。MTPay后台确认实际收款并审核通过后，才会完成入账。"
        type="info"
        :closable="false"
        show-icon
      />

      <el-button type="primary" size="large" class="apply-form__submit">
        我已完成转账，提交审核
      </el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { CopyDocument } from '@element-plus/icons-vue';

const form = reactive({
  asset: 'USDT',
  network: 'TRC20',
  address: 'TV7TQkYQ4TzSd71QeMTPayA8xv3p9F',
  amount: '',
  txId: '',
});

const qrCells = Array.from({ length: 121 }, (_, index) => index);
</script>

<style scoped lang="scss">
.apply-form {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__body) {
    padding: 28px;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    color: #0d1a32;
    font-weight: 800;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 48px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #cbd8e8 inset;
  }

  &__selectors,
  &__fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  &__address {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 28px;
    margin: 18px 0;
    padding: 16px;
    background: #f9fbfe;
    border: 1px solid #dce5ef;
    border-radius: 10px;
  }

  &__qr {
    display: grid;
    width: 160px;
    height: 160px;
    grid-template-columns: repeat(11, 1fr);
    gap: 3px;
    padding: 12px;
    background: #ffffff;
    border: 1px solid #d7e1ec;
    border-radius: 8px;

    span {
      border-radius: 1px;
      background: #eef3f8;

      &.is-dark {
        background: #071833;
      }
    }
  }

  &__address-main {
    display: grid;
    min-width: 0;
    align-content: center;
    gap: 14px;

    p {
      margin: 0;
      color: #34445c;
      font-size: 16px;
      font-weight: 700;
    }
  }

  &__copy-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
  }

  &__notice {
    margin: 16px 0;
    border-color: #cfe2ff;
    border-radius: 8px;
  }

  &__submit {
    width: 100%;
  }

  @include mobile {
    :deep(.el-card__body) {
      padding: 18px;
    }

    &__selectors,
    &__fields,
    &__address,
    &__copy-row {
      grid-template-columns: 1fr;
    }

    &__address {
      gap: 16px;
    }

    &__qr {
      width: 148px;
      height: 148px;
    }
  }
}
</style>
