<template>
  <section class="exchange-page">
    <PageHeader title="兑换USD" description="只支持 USDT → USD 及 USDC → USD" />

    <div class="exchange-page__main">
      <ExchangeForm />
      <ExchangeRatePanel />
    </div>

    <ExchangeTable />
  </section>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue';
import ExchangeForm from './components/ExchangeForm.vue';
import ExchangeRatePanel from './components/ExchangeRatePanel.vue';
import ExchangeTable from './components/ExchangeTable.vue';
</script>

<style scoped lang="scss">
.exchange-page {
  display: grid;
  min-width: 0;
  gap: 22px;
  padding: 34px 36px 32px;

  &__main {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(420px, 0.9fr) minmax(520px, 1.1fr);
    gap: 24px;
  }

  @include narrow {
    padding: 28px 24px;

    &__main {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    gap: 16px;
    padding: 20px 14px;

    &__main {
      grid-template-columns: 1fr;
    }
  }
}
</style>
