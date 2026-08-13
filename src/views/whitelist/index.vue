<template>
  <section class="whitelist-page">
    <AdminHero
      title="白名单管理"
      description="查看每笔交易的资料、资金变化及完整处理时间线"
      icon="ri-user-follow-line"
    >
      <template #extra>
        <!-- <el-button class="records-page__export" :icon="Download" size="large" plain
          >导出CSV</el-button
        > -->
      </template>
    </AdminHero>

    <ResultPanel />
  </section>
</template>

<script setup lang="ts">
import AdminHero from '@/components/admin/AdminHero.vue';
import ResultPanel from './components/ResultPanel.vue';
</script>

<style scoped lang="scss">
.whitelist-page {
  display: grid;
  min-width: 0;
  gap: 22px;
 

  &__add {
    height: 50px;
    padding: 0 24px;
    border: 0;
    border-radius: 8px;
    background: #09aa98;
    font-weight: 850;

    &:hover,
    &:focus {
      background: #079986;
    }
  }

  @include narrow {
    padding: 28px 24px;
  }

  @include mobile {
    gap: 16px;
    padding: 20px 14px;

    &__add {
      width: 100%;
    }
  }
}
</style>
