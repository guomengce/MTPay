<template>
  <el-card class="rate-panel" shadow="never">
    <template #header>
      <div class="rate-panel__header">
        <div class="rate-panel__title">
          <span></span>
          <strong>目前比例</strong>
        </div>
        <p>代理A · Apex Trading</p>
      </div>
    </template>

    <div class="rate-panel__cards">
      <section v-for="rate in rates" :key="rate.pair" class="rate-panel__card">
        <span>{{ rate.pair }}</span>
        <strong>{{ rate.value }}</strong>
        <p>{{ rate.sample }}</p>
        <div class="rate-panel__mark">{{ rate.mark }}</div>
      </section>
    </div>

    <el-alert
      class="rate-panel__notice"
      title="比例已包含兑换价差，不另收兑换手续费。"
      type="warning"
      :closable="false"
      show-icon
    />
  </el-card>
</template>

<script setup lang="ts">
const rates = [
  {
    pair: 'USDT → USD',
    value: '0.9900',
    sample: '1,000 USDT = 990.00 USD',
    mark: '₮',
  },
  {
    pair: 'USDC → USD',
    value: '0.9900',
    sample: '1,000 USDC = 990.00 USD',
    mark: '$',
  },
];
</script>

<style scoped lang="scss">
.rate-panel {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__header) {
    padding: 24px 28px 18px;
    border-bottom: 0;
  }

  :deep(.el-card__body) {
    padding: 0 28px 28px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;

    p {
      margin: 0;
      color: #62728b;
      font-weight: 650;
    }
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

  &__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  &__card {
    position: relative;
    min-height: 210px;
    padding: 34px 28px;
    overflow: hidden;
    color: #ffffff;
    background:
      radial-gradient(circle at 84% 22%, rgb(32 222 204 / 18%), transparent 18%),
      radial-gradient(circle at 85% 88%, rgb(15 128 204 / 16%), transparent 24%),
      linear-gradient(135deg, #101c3e 0%, #051436 74%);
    border-radius: 8px;

    span,
    strong,
    p {
      position: relative;
      z-index: 1;
    }

    span {
      color: #dbe8ff;
      font-size: 16px;
      font-weight: 700;
    }

    strong {
      display: block;
      margin: 28px 0 22px;
      font-size: 54px;
      font-weight: 850;
      line-height: 1;
      letter-spacing: 0;
    }

    p {
      margin: 0;
      color: #29ddd0;
      font-size: 18px;
      font-weight: 850;
    }
  }

  &__mark {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    width: 66px;
    height: 66px;
    align-items: center;
    justify-content: center;
    color: rgb(37 221 205 / 28%);
    border: 2px solid rgb(37 221 205 / 20%);
    border-radius: 50%;
    font-size: 38px;
    font-weight: 850;
  }

  &__notice {
    margin-top: 28px;
    border-color: #f2cf8f;
    border-radius: 8px;
  }

  @include mobile {
    :deep(.el-card__header) {
      padding: 20px 18px 16px;
    }

    :deep(.el-card__body) {
      padding: 0 18px 20px;
    }

    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__cards {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__card {
      min-height: 170px;
      padding: 26px 20px;

      strong {
        font-size: 42px;
      }
    }
  }
}
</style>
