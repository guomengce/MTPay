<template>
  <section class="deposit-page">
    <AdminHero
      title="数字货币入金"
      description="转账后提交入金资料，后台审核通过后才会增加余额"
      icon="ri-wallet-3-line"
    />
    <DepositForm />
    <DepositTable />
  </section>
</template>

<script setup lang="ts">
import DepositForm from './components/DepositForm.vue';
import DepositTable from './components/DepositTable.vue';
import AdminHero from '@/components/admin/AdminHero.vue';
</script>

<style scoped lang="scss">
.deposit-page {
  display: grid;
  min-width: 0;
  gap: 20px;

  @include narrow {
    padding: 28px 24px;
  }

  @include mobile {
    gap: 14px;
    padding: 20px 14px;
  }
}
</style>
