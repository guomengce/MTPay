<template>
  <el-card :class="['exchange-rate-panel', { 'is-compact': compact }]" shadow="never">
    <template #header>
      <div class="exchange-rate-panel__header">
        <div class="exchange-rate-panel__title">
          <span />
          <strong>当前比例</strong>
        </div>
        <p>{{ agent }}</p>
      </div>
    </template>

    <div class="exchange-rate-panel__cards">
      <section v-for="rate in displayRates" :key="rate.pair" class="exchange-rate-panel__card">
        <span>{{ rate.pair }}</span>
        <strong>{{ rate.value }}</strong>
        <p>{{ rate.sample }}</p>
        <div class="exchange-rate-panel__mark">{{ rate.mark }}</div>
      </section>
    </div>

    <div class="exchange-rate-panel__notice">
      <i class="ri-information-fill" aria-hidden="true" />
      <span>比例已包含兑换价差，不另收兑换手续费。</span>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface ExchangeRateItem {
  pair: string;
  value: string;
  sample: string;
  mark: string;
}

const DEFAULT_RATES: ExchangeRateItem[] = [
  { pair: 'USDT → USD', value: '0.9900', sample: '1,000 USDT = 990.00 USD', mark: '₮' },
  { pair: 'USDC → USD', value: '0.9900', sample: '1,000 USDC = 990.00 USD', mark: '$' },
];

const props = withDefaults(
  defineProps<{
    compact?: boolean;
    agent?: string;
    rates?: ExchangeRateItem[];
  }>(),
  {
    compact: false,
    agent: '代理A · Apex Trading',
    rates: undefined,
  },
);

const displayRates = computed(() => props.rates && props.rates.length ? props.rates : DEFAULT_RATES);
</script>

<style scoped lang="scss">
.exchange-rate-panel {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

  :deep(.el-card__header) {
    padding: 20px 24px 16px;
    border-bottom: 0;
  }
  :deep(.el-card__body) {
    padding: 0 24px 24px;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  &__header p {
    margin: 0;
    color: #62728b;
    font-size: 14px;
    font-weight: 650;
  }
  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &__title > span {
    width: 4px;
    height: 23px;
    border-radius: 999px;
    background: #10aa9b;
  }
  &__title strong {
    color: #071833;
    font-size: 20px;
    font-weight: 800;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px;
  }
  &__card {
    position: relative;
    min-width: 0;
    min-height: 190px;
    padding: 28px 24px;
    overflow: hidden;
    color: #fff;
    border-radius: 9px;
    background:
      radial-gradient(circle at 84% 24%, rgb(32 222 204 / 18%), transparent 19%),
      linear-gradient(135deg, #101c3e, #051436 76%);
  }
  &__card > span,
  &__card > strong,
  &__card > p {
    position: relative;
    z-index: 1;
  }
  &__card > span {
    color: #dbe8ff;
    font-size: 20px;
    font-weight: 700;
  }
  &__card > strong {
    display: block;
    margin: 25px 0 20px;
    font-size: 50px;
    font-weight: 800;
    line-height: 1;
  }
  &__card > p {
    margin: 0;
    color: #29ddd0;
    font-size: 20px;
    font-weight: 750;
  }
  &__mark {
    position: absolute;
    top: 22px;
    right: 22px;
    display: grid;
    width: 80px;
    height: 80px;
    place-items: center;
    color: rgb(37 221 205 / 28%);
    border: 2px solid rgb(37 221 205 / 20%);
    border-radius: 50%;
    font-size: 60px;
    font-weight: 800;
  }
  &__notice {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 10px 14px;
    color: #df8a22;
    background: #fff8ee;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
  }

  &.is-compact {
    :deep(.el-card__header) {
      padding: 18px 20px 14px;
    }
    :deep(.el-card__body) {
      padding: 0 18px 20px;
    }
    .exchange-rate-panel__header p {
      display: none;
    }
    .exchange-rate-panel__cards {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .exchange-rate-panel__card {
      min-height: 150px;
      padding: 20px;
    }
    .exchange-rate-panel__card > strong {
      margin: 18px 0 10px;
      font-size: 34px;
    }
    .exchange-rate-panel__card > p {
      font-size: 12px;
    }
    .exchange-rate-panel__mark {
      top: 18px;
      right: 30px;
      width: 60px;
      height: 60px;
      font-size: 30px;
    }
    .exchange-rate-panel__notice {
      margin-top: 14px;
    }
  }

  @include mobile {
    :deep(.el-card__header) {
      padding: 18px 16px 14px;
    }
    :deep(.el-card__body) {
      padding: 0 16px 18px;
    }
    &__header {
      align-items: flex-start;
      flex-direction: column;
    }
    &__cards {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    &__card {
      min-height: 150px;
      padding: 22px 18px;
    }
    &__card > strong {
      margin: 20px 0 12px;
      font-size: 40px;
    }
  }
}
</style>
