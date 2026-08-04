<template>
  <el-card class="exchange-form" shadow="never">
    <template #header>
      <div class="exchange-form__title">
        <span></span>
        <strong>建立兑换申请</strong>
      </div>
    </template>

    <el-form label-position="top" :model="form">
      <el-form-item label="支付币种">
        <el-select v-model="form.asset" size="large">
          <template #prefix>
            <span class="exchange-form__coin">₮</span>
          </template>
          <el-option label="USDT" value="USDT" />
          <el-option label="USDC" value="USDC" />
        </el-select>
      </el-form-item>

      <el-form-item label="兑换数量">
        <el-input v-model="form.amount" size="large" />
      </el-form-item>

      <section class="exchange-form__summary">
        <div>
          <span>可用余额</span>
          <strong>128,500.00 USDT</strong>
        </div>
        <div>
          <span>专属比例</span>
          <strong>0.9900</strong>
        </div>
        <div class="exchange-form__result">
          <span>预计获得</span>
          <strong>990.00 USD</strong>
        </div>
      </section>

      <el-button class="exchange-form__submit" type="primary" size="large">提交兑换申请</el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
  asset: 'USDT',
  amount: '1000',
});
</script>

<style scoped lang="scss">
.exchange-form {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__header) {
    padding: 24px 28px 10px;
    border-bottom: 0;
  }

  :deep(.el-card__body) {
    padding: 0 28px 28px;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #34445c;
    font-size: 15px;
    font-weight: 800;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 54px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #cbd8e8 inset;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      width: 4px;
      height: 24px;
      background: #10aa9b;
      border-radius: 999px;
    }

    strong {
      color: #071833;
      font-size: 22px;
      font-weight: 850;
    }
  }

  &__coin {
    display: inline-flex;
    width: 26px;
    height: 26px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #ffffff;
    background: #20bda9;
    font-size: 18px;
    font-weight: 850;
  }

  &__summary {
    overflow: hidden;
    margin: 2px 0 20px;
    border: 1px solid #dce5ef;
    border-radius: 8px;

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-height: 48px;
      padding: 0 18px;
      color: #273850;
      border-bottom: 1px solid #e8eef5;

      &:last-child {
        border-bottom: 0;
      }
    }

    span {
      color: #56677f;
      font-weight: 700;
    }

    strong {
      color: #071833;
      font-size: 16px;
      font-weight: 850;
    }
  }

  &__result {
    min-height: 62px;

    strong {
      color: #008f83;
      font-size: 26px;
    }
  }

  &__submit {
    width: 100%;
    height: 58px;
    border: 0;
    border-radius: 8px;
    background: #09aa98;
    font-size: 18px;
    font-weight: 850;

    &:hover,
    &:focus {
      background: #079986;
    }
  }

  @include mobile {
    :deep(.el-card__header) {
      padding: 20px 18px 8px;
    }

    :deep(.el-card__body) {
      padding: 0 18px 20px;
    }

    &__summary div {
      align-items: flex-start;
      flex-direction: column;
      gap: 6px;
      padding: 12px 14px;
    }
  }
}
</style>
