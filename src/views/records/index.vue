<template>
  <section class="records-page">
    <AdminHero
      title="交易记录"
      description="统一查看入金、兑换与 USD 出金订单，本页仅只读"
      icon="ri-file-list-3-line"
    />

    <el-card class="records-page__card" shadow="never">
      <TransactionFilters
        :query="query"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <TransactionTable :data="list" :loading="loading" @view="openDetail" />
      <TransactionCardList :data="list" @view="openDetail" />
      <el-empty v-if="!loading && list.length === 0" description="暂无交易记录" />
      <footer class="records-page__pager">
        <el-pagination
          layout="prev, pager, next, total"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :hide-on-single-page="total <= limit"
          @current-change="setPage"
        />
      </footer>
    </el-card>
  </section>
</template>

<script setup lang="ts">
/** 代理端交易记录列表：真实筛选与分页，详情只读跳转。 */
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import AdminHero from '@/components/admin/AdminHero.vue';
import type { TransactionItem } from '@/api/modules/transaction';
import TransactionFilters from './components/TransactionFilters.vue';
import TransactionCardList from './components/TransactionCardList.vue';
import TransactionTable from './components/TransactionTable.vue';
import { useTransactionList } from './composables/useTransactionList';

const router = useRouter();
const { loading, list, total, page, limit, query, loadList, search, reset, setPage } =
  useTransactionList();

function openDetail(row: TransactionItem) {
  void router.push({
    name: 'TransactionDetail',
    params: { businessType: row.detail_type, businessId: row.detail_id },
  });
}

onMounted(loadList);
</script>

<style scoped lang="scss">
.records-page {
  display: grid;
  min-width: 0;
  gap: 24px;

  &__card {
    min-width: 0;
    overflow: hidden;
    border-color: #dfe7ef;
    border-radius: 16px;
    box-shadow: 0 16px 42px rgb(16 30 54 / 7%);
    padding: 20px;;
    :deep(.el-card__body) {
      display: grid;
      padding: 0;
    }

    .transaction-filters {
      margin: 0;
      padding: 20px 24px;
      margin-bottom:10px;
      border-bottom: 1px solid #e2e9f2;
    }
  }

  &__pager {
    display: flex;
    justify-content: flex-end;
    padding: 18px 24px;
  }

  @include mobile {
    gap: 16px;

    &__pager {
      justify-content: flex-end;
      overflow-x: auto;
      padding: 16px;
    }

    &__card{
      padding:16px;
    }
    .transaction-filters{
      margin-bottom:10px;
    }

    // &__card :deep(.transaction-filters) { padding: 16px; }
  }
}
</style>
