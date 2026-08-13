<template>
  <el-card class="convert-form" shadow="never">
    <template #header>
      <div class="convert-form__title">
        <span></span>
        <strong>建立兑换申请</strong>
      </div>
    </template>

    <el-form label-position="top" :model="form">
      <el-form-item label="支付币种">
        <el-select v-model="form.asset" size="large">
          <template #prefix>
            <span class="convert-form__coin">₮</span>
          </template>
          <el-option label="USDT" value="USDT" />
          <el-option label="USDC" value="USDC" />
        </el-select>
      </el-form-item>

      <el-form-item label="兑换数量">
        <el-input v-model="form.amount" size="large" />
      </el-form-item>

      <section class="convert-form__summary">
        <div class="convert-form__row">
          <span class="convert-form__row-icon convert-form__row-icon--wallet">
            <el-icon><Wallet /></el-icon>
          </span>
          <span class="convert-form__row-label">可用余额</span>
          <strong class="convert-form__row-value">128,500.00 USDT</strong>
        </div>
        <div class="convert-form__row">
          <span class="convert-form__row-icon convert-form__row-icon--chart">
            <el-icon><DataLine /></el-icon>
          </span>
          <span class="convert-form__row-label">专属比例</span>
          <strong class="convert-form__row-value">0.9900</strong>
        </div>
        <div class="convert-form__row convert-form__row--result">
          <span class="convert-form__row-icon convert-form__row-icon--gift">
            <el-icon><Coin /></el-icon>
          </span>
          <span class="convert-form__row-label">预计获得</span>
          <strong class="convert-form__row-value">990.00 USD</strong>
        </div>
      </section>

      <el-button type="primary" size="large" class="convert-form__submit">提交兑换申请</el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { Coin, DataLine, Wallet } from '@element-plus/icons-vue';
import { reactive } from 'vue';

const form = reactive({
  asset: 'USDT',
  amount: '1000',
});
</script>

<style scoped lang="scss">
.convert-form {
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
    position: relative;
    overflow: hidden;
    margin: 6px 0 20px;
    padding: 6px 0;
    background:
      radial-gradient(circle at 92% 100%, rgb(16 170 164 / 10%) 0%, transparent 38%),
      linear-gradient(135deg, #f4fbff 0%, #ecf8ff 100%);
    border: 1px solid #d8ecf6;
    border-radius: 12px;
  }

  &__row {
    display: grid;
    align-items: center;
    grid-template-columns: 44px 1fr auto;
    gap: 14px;
    min-height: 56px;
    padding: 8px 18px;
    border-bottom: 1px dashed #c8d9e7;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__row--result {
    margin: 6px 12px 6px;
    padding: 10px 14px;
    background:
      linear-gradient(135deg, rgb(232 250 247 / 90%) 0%, rgb(220 240 250 / 90%) 100%);
    border: 1px solid #c8e8e0;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgb(16 170 164 / 10%);

    .convert-form__row-label {
      color: #0c2a5a;
      font-weight: 700;
    }

    .convert-form__row-value {
      color: #0aa39a;
      font-size: 30px;
      font-weight: 800;
    }
  }

  &__row-icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
    font-size: 20px;
  }

  &__row-icon--wallet {
    background: linear-gradient(135deg, #e6fbf3 0%, #cdf2e1 100%);
    color: #10aaa4;
  }

  &__row-icon--chart {
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
  }

  &__row-icon--gift {
    width: 52px;
    height: 52px;
    flex: 0 0 52px;
    background: linear-gradient(135deg, #10aaa4 0%, #2dd4bf 100%);
    color: #ffffff;
    font-size: 24px;
    box-shadow: 0 4px 12px rgb(16 170 164 / 28%);

    &::before,
    &::after {
      position: absolute;
      content: '';
    }
  }

  &__row-label {
    color: #0c2a5a;
    font-size: 14px;
    font-weight: 700;
  }

  &__row-value {
    color: #0c2a5a;
    font-size: 18px;
    font-weight: 800;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  &__submit {
    width: 100%;
  }

  @include mobile {
    :deep(.el-card__header) {
      padding: 20px 18px 8px;
    }

    :deep(.el-card__body) {
      padding: 0 18px 20px;
    }

    &__summary {
      padding: 4px 0;
    }

    &__row {
      grid-template-columns: 40px 1fr auto;
      gap: 10px;
      padding: 8px 14px;
    }

    &__row--result {
      margin: 6px 10px;
      padding: 8px 12px;
    }

    &__row-icon {
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      font-size: 18px;
    }

    &__row-icon--gift {
      width: 48px;
      height: 48px;
      flex: 0 0 48px;
      font-size: 22px;
    }

    &__row--result .convert-form__row-value {
      font-size: 24px;
    }
  }
}
</style>
