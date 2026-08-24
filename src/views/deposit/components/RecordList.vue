<template>
  <section class="record-list">
    <header class="record-list__header">
      <div>
        <h3 class="record-list__title">入金记录</h3>
        <p class="record-list__subtitle">按筛选条件展示当前代理的入金订单</p>
      </div>
      <!-- <el-button :icon="Refresh" :loading="loading" @click="refresh">刷新</el-button> -->
    </header>

    <div class="record-list__filters filter-bar">
      <el-select v-model="statusFilter" placeholder="订单状态" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-input v-model="orderNoFilter" placeholder="订单号" clearable />
      <el-input v-model="txidFilter" show-overflow-tooltip placeholder="Txid" clearable />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        value-format="YYYY-MM-DD"
        unlink-panels
      />
      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      :empty-text="loading ? '加载中…' : '暂无入金记录'"
      stripe
      class="record-list__table"
    >
      <el-table-column prop="order_no" label="订单号" min-width="170">
         <template #default="{ row }">
          <strong
            class="record-list__link"
            href="javascript:void(0)"
            @click.prevent="emit('detail', row.id)"
          >
            {{ row.order_no }}
        </strong><br/>
          <small>{{ formatTime(row.submitted_at) }}</small>
        </template>
      </el-table-column>
      <el-table-column label="币种 / 网络" min-width="160">
        <template #default="{ row }">{{ row.currency.code }} · {{ row.network.code }}</template>
      </el-table-column>
      <el-table-column label="转账金额" min-width="140" align="right">
        <template #default="{ row }">
          <span class="record-list__amount">{{ row.amount }} </span>
          <br/>
          <small style="color:#1D8FB4;font-weight:700;">{{ row.currency.code }}</small>
        </template>
      </el-table-column>
      <el-table-column prop="txid" label="Txid" min-width="160" show-overflow-tooltip />
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status_name"
            :type="statusMap[row.status as DepositStatus]?.type"
            :effect="statusMap[row.status as DepositStatus]?.effect"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row.id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <ResponsiveCardList :items="cardItems" @action="handleCardAction" />

    <footer class="record-list__pager">
      <el-pagination
        layout="prev, pager, next, total"
        :current-page="page"
        :page-size="limit"
        :total="total"
        :hide-on-single-page="total <= limit"
        @current-change="onPage"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
/**
 * 入金列表组件
 * - 只负责渲染列表/分页/筛选 UI，业务由 useDepositList 处理；
 * - 筛选条件变更后必须 `resetQuery` 再 `fetchList`，避免在第二页漏请求。
 */
import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';
import type { DepositListParams, DepositOrder } from '@/api/modules/deposit';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import ResponsiveCardList, { type ResponsiveCardItem } from '@/components/common/ResponsiveCardList.vue';

import { DEPOSIT_STATUS_MAP, type DepositStatus } from '@/views/deposit/composables/useDepositList';

const props = defineProps<{
  list: DepositOrder[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  query: {
    status: DepositStatus | undefined;
    order_no: string;
    txid: string;
    started_at: string;
    ended_at: string;
  };
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'search'): void;
  (e: 'reset'): void;
  (e: 'page', value: number): void;
  (e: 'detail', id: number): void;
  (e: 'query-change', patch: Partial<DepositListParams>): void;
}>();

const statusMap = DEPOSIT_STATUS_MAP;
const statusOptions = [
  { value: 0, label: '待审核' },
  { value: 1, label: '已入账' },
  { value: 2, label: '已驳回' },
];

const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: formatTime(row.submitted_at),
  status: { label: row.status_name, type: statusMap[row.status]?.type, effect: statusMap[row.status]?.effect },
  pending: statusMap[row.status]?.effect === 'pending', accent: 'success',
  fields: [
    { label: '币种 / 网络', value: `${row.currency.code} · ${row.network.code}`, strong: true },
    { label: '转账金额', value: `${row.amount} ${row.currency.code}`, strong: true },
    { label: 'Txid', value: row.txid, mono: true },
  ], actions: [{ key: 'detail', label: '查看详情', icon: View, type: 'primary', plain: true }],
})));

const statusFilter = computed<DepositStatus | undefined>({
  get: () => props.query.status,
  set: (value) => {
    emit('query-change', { status: value });
  },
});

const orderNoFilter = computed<string>({
  get: () => props.query.order_no,
  set: (value) => emit('query-change', { order_no: value }),
});

const txidFilter = computed<string>({
  get: () => props.query.txid,
  set: (value) => emit('query-change', { txid: value }),
});

const dateRange = computed<string[]>({
  get: () => props.query.started_at && props.query.ended_at
    ? [props.query.started_at, props.query.ended_at]
    : [],
  set: (value: string[]) => {
    emit('query-change', {
      started_at: value?.[0] || '',
      ended_at: value?.[1] || '',
    });
  },
});

function onSearch() {
  emit('search');
}

function onReset() {
  emit('reset');
  emit('refresh');
}

function onPage(value: number) {
  emit('page', value);
}

function formatTime(value: string | null) {
  return value ?? '—';
}
function handleCardAction(actionKey: string, itemKey: string) {
  if (actionKey === 'detail') emit('detail', Number(itemKey));
}
</script>

<style scoped lang="scss">
.record-list {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border: 1px solid #e5edf3;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(22 34 51 / 5%);
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    margin: 0;
    color: #071833;
    font-size: 18px;
  }
  &__subtitle {
    margin: 4px 0 0;
    color: #718197;
    font-size: 13px;
  }
  &__filters {
    display: grid;
    gap: 10px;

    > * {
      min-width: 0;
    }

    .filter-actions {
      min-width: max-content;
    }
  }
  &__link {
    color: #27b9aa;
    text-decoration: none;
  }
  &__link:hover {
    color: #1d8db5;
    text-decoration: underline;
  }
  &__amount {
    font-variant-numeric: tabular-nums;
    color: #071833;
    font-weight: 700;
  }
  &__pager {
    display: flex;
    justify-content: flex-end;
  }
}
@include mobile {
  .record-list {
    padding: 18px 16px;
    border-radius: 14px;
  }

  .record-list__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .record-list__header .el-button {
    width: 100%;
  }

  .record-list__table { display: none; }

  .record-list__pager {
    justify-content: flex-end;
    overflow-x: auto;
  }
}
</style>
