<template>
  <section class="whitelist-page">
    <PageHeader title="白名单管理" description="付款人及收款人需要分别提交">
      <template #extra>
        <el-button class="whitelist-page__add" type="primary" :icon="Plus" size="large">
          新增白名单
        </el-button>
      </template>
    </PageHeader>

    <WhitelistNotice />
    <WhitelistSearchPanel />
    <WhitelistResult />
  </section>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';

import PageHeader from '@/components/common/PageHeader.vue';
import WhitelistNotice from './components/WhitelistNotice.vue';
import WhitelistResult from './components/WhitelistResult.vue';
import WhitelistSearchPanel from './components/WhitelistSearchPanel.vue';
</script>

<style scoped lang="scss">
.whitelist-page {
  display: grid;
  min-width: 0;
  gap: 22px;
  padding: 34px 36px 32px;

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
