<template>
  <section class="whitelist-page">
    <AdminHero
      title="白名单管理"
      description="查看每笔交易的资料、资金变化及完整处理时间线"
      icon="ri-user-follow-line"
    >
      <template #extra>
        <el-button :icon="Plus" type="primary" size="large" 
          >新增</el-button
        >
      </template>
    </AdminHero>

    <ResultPanel />
  </section>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import AdminHero from '@/components/admin/AdminHero.vue';
import ResultPanel from './components/ResultPanel.vue';
</script>

<style scoped lang="scss">
.whitelist-page {
  display: grid;
  min-width: 0;
  gap: 22px;

  @include narrow {
    padding: 28px 24px;
  }

  @include mobile {
    gap: 16px;
    padding: 20px 14px;
  }
}
</style>
