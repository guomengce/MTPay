<template>
  <main class="deposit-page">
    <AdminHero
      title="数字货币入金"
      description="选择币种与网络，完成链上转账后提交交易信息，审核通过后自动入账"
      icon="ri-wallet-3-line"
    />

    <section class="deposit-page__grid">
      <ApplyForm
        v-loading="channelLoading"
        ref="applyFormRef"
        :channels="channels"
        :channels-loading="channelLoading"
        :submitting="submitting"
        @submit="handleSubmit"
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
 * - 通过 useDepositManagement 串联通道 / 列表 / 表单；
 * - 申请提交成功后弹出成功提示并刷新列表；
 * - 详情改为列表页内弹框展示，不再走路由。
 */
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

import type { DepositListParams } from '@/api/modules/deposit';
import AdminHero from '@/components/admin/AdminHero.vue';
import ApplyForm from './components/ApplyForm.vue';
import RecordList from './components/RecordList.vue';
import { useDepositManagement } from './composables/useDepositManagement';

const applyFormRef = ref<InstanceType<typeof ApplyForm>>();
const router = useRouter();
const {
  channels,
  channelLoading,
  listLoading,
  list,
  total,
  page,
  limit,
  query,
  submitting,
  loadChannels,
  fetchList,
  resetQuery,
  setPage,
  submitDeposit,
} = useDepositManagement();

async function handleSubmit(payload: {
  currency_network_id: number;
  amount: string;
  txid: string;
}) {
  try {
    const detail = await submitDeposit(payload);
    ElMessage.success(`入金订单 ${detail.order_no} 已提交，等待审核`);
    applyFormRef.value?.reset();
    await fetchList();
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
