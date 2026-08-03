<template>
  <section class="records-page">
    <PageHeader title="交易记录" description="查看每笔交易的资料、资金变化及完整处理时间线">
      <template #extra>
        <el-button class="records-page__export" :icon="Download" size="large" plain
          >导出CSV</el-button
        >
      </template>
    </PageHeader>
    <TransactionTable />
  </section>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue';

import PageHeader from '@/components/common/PageHeader.vue';
import TransactionTable from './components/TransactionTable.vue';
</script>

<style scoped lang="scss">
.records-page {
  display: grid;
  min-width: 0;
  gap: 24px;
  padding: 34px 36px 32px;

  &__export {
    height: 44px;
    border-radius: 8px;
    color: #071833;
    font-weight: 850;
  }

  @include narrow {
    padding: 28px 24px;
  }

  @include mobile {
    padding: 20px 14px;

    &__export {
      width: 100%;
    }
  }
}
</style>
