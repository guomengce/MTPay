<template>
  <el-card class="rate-card" shadow="never">
    <template #header>
      <div class="rate-card__header">
        <strong>專屬兌換比例</strong>
        <span
          >更新時間 08/03 15:08 <el-icon><Refresh /></el-icon
        ></span>
      </div>
    </template>

    <div class="rate-card__grid">
      <section v-for="item in rates" :key="item.pair" class="rate-card__item">
        <span>{{ item.pair }}</span>
        <strong>{{ item.rate }}</strong>
        <p>{{ item.sample }}</p>
        <div class="rate-card__watermark">{{ item.mark }}</div>
      </section>
    </div>

    <el-alert
      class="rate-card__alert"
      title="匯率依據市場波動即時更新，實際匯率以交易時為準。"
      type="success"
      :closable="false"
      show-icon
    />
  </el-card>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue';

const rates = [
  {
    pair: 'USDT → USD',
    rate: '0.9900',
    sample: '1,000 USDT = 990.00 USD',
    mark: '₮',
  },
  {
    pair: 'USDC → USD',
    rate: '0.9900',
    sample: '1,000 USDC = 990.00 USD',
    mark: '$',
  },
];
</script>

<style scoped lang="scss">
.rate-card {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

  :deep(.el-card__header) {
    padding: 18px 22px 14px;
    border-bottom: 0;
  }

  :deep(.el-card__body) {
    padding: 0 18px 20px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;

    strong {
      color: #0d1a32;
      font-size: 18px;
      font-weight: 850;
    }

    span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #738196;
      font-size: 13px;
      font-weight: 600;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__item {
    position: relative;
    min-width: 0;
    padding: 28px 18px;
    overflow: hidden;
    color: #ffffff;
    background:
      radial-gradient(circle at 86% 42%, rgb(0 201 190 / 22%), transparent 18%),
      linear-gradient(135deg, #001a3f, #001031 68%);
    border-radius: 10px;

    span,
    strong,
    p {
      position: relative;
      z-index: 1;
    }

    span {
      color: #38d7ca;
      font-size: 14px;
    }

    strong {
      display: block;
      margin: 22px 0 18px;
      font-size: 36px;
      letter-spacing: 0;
    }

    p {
      margin: 0;
      color: #00d8cb;
      font-weight: 800;
    }
  }

  &__watermark {
    position: absolute;
    right: 20px;
    bottom: 22px;
    display: flex;
    width: 58px;
    height: 58px;
    align-items: center;
    justify-content: center;
    color: rgb(255 255 255 / 38%);
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 50%;
    font-size: 32px;
    font-weight: 800;
  }

  &__alert {
    margin-top: 20px;
    border: 0;
    border-radius: 8px;
  }

  @include mobile {
    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
