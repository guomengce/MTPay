<template>
  <main class="exchange-page">
    <AdminHero
      title="数字货币兑换"
      description="使用 USDT 或 USDC 兑换 USD，提交后冻结来源资产，审核通过后自动到账"
      icon="ri-swap-2-line"
    />

    <section class="exchange-page__content">
      <ConvertForm
        ref="convertFormRef"
        :submitting="submitting"
        :balances="config?.balances"
        :rates="config?.rates"
        @submit="handleSubmit"
      />
      <RecordList
        :list="list"
        :total="total"
        :page="page"
        :limit="limit"
        :loading="listLoading"
        :query="query"
        :source-currencies="config?.balances"
        @refresh="fetchList"
        @search="handleSearch"
        @reset="resetQuery"
        @query-change="handleQueryChange"
        @page="onPage"
        @detail="openDetail"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
/**
 * 兑换页面
 * - 通过 useExchangeManagement 串联配置 / 列表 / 表单；
 * - 提交成功后弹出成功提示并刷新列表；
 * - 配置与列表并发加载。
 */
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

import type { ExchangeListParams } from '@/api/modules/exchange';
import AdminHero from '@/components/admin/AdminHero.vue';
import ConvertForm from './components/ConvertForm.vue';
import RecordList from './components/RecordList.vue';
import { useExchangeManagement } from './composables/useExchangeManagement';

const {
  config,
  listLoading,
  list,
  total,
  page,
  limit,
  query,
  submitting,
  loadConfig,
  fetchList,
  resetQuery,
  setPage,
  submitExchange,
} = useExchangeManagement();
const router = useRouter();
const convertFormRef = ref<InstanceType<typeof ConvertForm>>();

async function handleSubmit(payload: { source_currency_code: 'USDT' | 'USDC'; amount: string }) {
  try {
    const result = await submitExchange(payload);
    ElMessage.success(`兑换订单 ${result.order_no} 已提交，等待审核`);
    convertFormRef.value?.reset();
    await Promise.all([loadConfig(true), fetchList()]);
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

function onPage(value: number) {
  setPage(value);
  void fetchList();
}

function handleSearch() {
  setPage(1);
  void fetchList();
}

function handleQueryChange(patch: Partial<ExchangeListParams>) {
  Object.assign(query, patch);
}

function openDetail(id: number) {
  void router.push({ name: 'ExchangeDetail', params: { id } });
}

onMounted(async () => {
  await Promise.all([loadConfig(true), fetchList()]);
});
</script>

<style scoped lang="scss">
.exchange-page {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 22px;

  &__content {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
}

@include narrow {
  .exchange-page,
  .exchange-page__content {
    gap: 20px;
  }
}

@include mobile {
  .exchange-page,
  .exchange-page__content {
    gap: 16px;
  }
}
</style>
