<template>
  <main class="deposit-page">
    <AdminHero
      :title="t('deposit.title')"
      icon="ri-wallet-3-line"
    />

    <section class="deposit-page__grid">
      <DepositChannels
        v-loading="channelLoading"
        :channels="channels"
        :channels-loading="channelLoading"
      />
      <RecordList
        :list="list"
        :total="total"
        :page="page"
        :limit="limit"
        :loading="listLoading"
        :query="query"
        @refresh="fetchList"
        @search="handleSearch"
        @reset="resetQuery"
        @query-change="handleQueryChange"
        @page="onPage"
        @detail="onDetail"
      />
    </section>

  </main>
</template>

<script setup lang="ts">
/**
 * 入金页面
 * - 展示自动入金通道及记录，仅使用查询接口；
 * - 详情通过独立路由加载。
 */
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import type { DepositListParams } from '@/api/modules/deposit';
import AdminHero from '@/components/admin/AdminHero.vue';
import DepositChannels from './components/DepositChannels.vue';
import RecordList from './components/RecordList.vue';
import { useDepositChannel } from './composables/useDepositChannel';
import { useDepositList } from './composables/useDepositList';

const router = useRouter();
const { t } = useI18n();
const { channels, loading: channelLoading, loadChannels } = useDepositChannel();
const {
  loading: listLoading,
  list,
  total,
  page,
  limit,
  query,
  fetchList,
  resetQuery,
  setPage,
} = useDepositList();

function onPage(value: number) {
  setPage(value);
  void fetchList();
}

function handleSearch() {
  setPage(1);
  void fetchList();
}

function handleQueryChange(patch: Partial<DepositListParams>) {
  Object.assign(query, patch);
}

function onDetail(id: number) {
  void router.push({ name: 'DepositDetail', params: { id } });
}

onMounted(async () => {
  await Promise.all([loadChannels(), fetchList()]);
});
</script>

<style scoped lang="scss">
.deposit-page {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 22px;

  &__grid {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 22px;
  }
}

@include narrow {
  .deposit-page {
    gap: 20px;
  }

  .deposit-page__grid {
    gap: 20px;
  }
}

@include mobile {
  .deposit-page {
    gap: 16px;
  }

  .deposit-page__grid {
    gap: 16px;
  }
}
</style>
