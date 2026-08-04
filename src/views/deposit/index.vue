<template>
  <section class="deposit-page">
    <PageHeader title="数字货币入金" description="转账后提交入金资料，后台审核通过后才会增加余额" />
    <DepositForm />
    <DepositTable />
  </section>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue';
import DepositForm from './components/DepositForm.vue';
import DepositTable from './components/DepositTable.vue';
</script>

<style scoped lang="scss">
.deposit-page {
  display: grid;
  min-width: 0;
  gap: 20px;
  padding: 34px 36px 32px;

  @include narrow {
    padding: 28px 24px;
  }

  @include mobile {
    gap: 14px;
    padding: 20px 14px;
  }
}
</style>
