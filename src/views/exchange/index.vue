<template>
  <main class="exchange-page">
    <AdminHero
      :title="t('exchange.title')"
      icon="ri-exchange-dollar-line"
    />

    <section class="exchange-page__content">
      <ConvertForm
        v-loading="configLoading"
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
import { useI18n } from 'vue-i18n';

import type { ExchangeListParams } from '@/api/modules/exchange';
import AdminHero from '@/components/admin/AdminHero.vue';
import ConvertForm from './components/ConvertForm.vue';
import RecordList from './components/RecordList.vue';
import { useExchangeManagement } from './composables/useExchangeManagement';

const {
  config,
  configLoading,
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
const convertFormRef = ref<InstanceType<typeof ConvertForm>>();
const router = useRouter();
const { t } = useI18n();

async function handleSubmit(payload: { source_currency_code: string; amount: string }) {
  try {
    const result = await submitExchange(payload);
    ElMessage.success(t('exchange.submitted', { orderNo: result.order_no }));
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
