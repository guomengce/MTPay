<template>
  <section class="record-list">
    <header class="record-list__header">
      <div>
        <h3 class="record-list__title">兑换记录</h3>
        <p class="record-list__subtitle">按筛选条件展示当前代理的兑换订单</p>
      </div>
      <!-- <el-button :icon="Refresh" :loading="loading" @click="refresh">刷新</el-button> -->
    </header>

    <div class="record-list__filters filter-bar">
      <el-select v-model="sourceCurrencyFilter" placeholder="来源币种" clearable>
        <el-option
          v-for="item in sourceCurrencies"
          :key="item.currency.id"
          :value="item.currency.id"
          :label="item.currency.code"
        />
      </el-select>
      <el-select v-model="statusFilter" placeholder="订单状态" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-input v-model="orderNoFilter" placeholder="订单号" clearable />
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
      :empty-text="loading ? '加载中…' : '暂无兑换记录'"
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
      <el-table-column label="支付资产" min-width="170">
        <template #default="{ row }">
          <span class="record-list__path"
            >{{ row.source_amount }} </span
          ><br/>
          <small>{{ row.source_currency.code }}</small>
        </template>
      </el-table-column>
      <el-table-column prop="exchange_rate" label="比例" min-width="170"/>
      <el-table-column label="获得USD" min-width="170">
        <template #default="{ row }">
          <span class="record-list__path"
            >{{ row.target_amount }}  </span
          ><br/>
          <small>{{ row.target_currency.code }}</small>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status_name"
            :type="statusMap[row.status as ExchangeStatus]?.type"
            :effect="statusMap[row.status as ExchangeStatus]?.effect"
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
 * 兑换列表组件
 * - 只负责 UI；业务由 useExchangeList 提供；
 * - 字段保留字符串展示，避免精度丢失。
 */
import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';
import type { ExchangeBalance, ExchangeListParams, ExchangeOrder } from '@/api/modules/exchange';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import ResponsiveCardList, { type ResponsiveCardItem } from '@/components/common/ResponsiveCardList.vue';
import { formatExchangeRate } from '@/utils/decimal';

import {
  EXCHANGE_STATUS_MAP,
  type ExchangeStatus,
} from '@/views/exchange/composables/useExchangeList';

const props = defineProps<{
  list: ExchangeOrder[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  sourceCurrencies?: ExchangeBalance[];
  query: {
    source_currency_id: number | undefined;
    status: ExchangeStatus | undefined;
    order_no: string;
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
  (e: 'query-change', patch: Partial<ExchangeListParams>): void;
}>();

const statusMap = EXCHANGE_STATUS_MAP;
const statusOptions = [
  { value: 0, label: '待审核' },
  { value: 1, label: '已完成' },
  { value: 2, label: '已驳回' },
];
const sourceCurrencies = computed(() => props.sourceCurrencies ?? []);
const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: formatTime(row.submitted_at),
  status: { label: row.status_name, type: statusMap[row.status]?.type, effect: statusMap[row.status]?.effect },
  pending: statusMap[row.status]?.effect === 'pending', accent: 'warning',
  fields: [
    { label: '支付资产', value: `${row.source_amount} ${row.source_currency.code}`, strong: true },
    { label: '兑换比例', value: formatExchangeRate(row.exchange_rate), strong: true },
    { label: '获得资产', value: `${row.target_amount} ${row.target_currency.code}`, strong: true },
  ], actions: [{ key: 'detail', label: '查看详情', icon: View, type: 'primary', plain: true }],
})));

const sourceCurrencyFilter = computed<number | undefined>({
  get: () => props.query.source_currency_id,
  set: (value) => emit('query-change', { source_currency_id: value }),
});

const statusFilter = computed<ExchangeStatus | undefined>({
  get: () => props.query.status,
  set: (value) => emit('query-change', { status: value }),
});

const orderNoFilter = computed<string>({
  get: () => props.query.order_no,
  set: (value) => emit('query-change', { order_no: value }),
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
}
.record-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.record-list__title {
  margin: 0;
  color: #071833;
  font-size: 18px;
}
.record-list__subtitle {
  margin: 4px 0 0;
  color: #718197;
  font-size: 13px;
}
.record-list__filters {
  display: grid;
  gap: 10px;

  > * {
    min-width: 0;
  }

  .filter-actions {
    min-width: max-content;
  }
}
.record-list__path {
  color: #4f647d;
  font-weight: 700;
}
.record-list__link {
  color: #27b9aa;
  text-decoration: none;
}
.record-list__link:hover {
  color: #1d8db5;
  text-decoration: underline;
}
.record-list__amount-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.record-list__amount-block strong {
  color: #071833;
  font-variant-numeric: tabular-nums;
}
.record-list__amount-block small {
  color: #4f647d;
  font-variant-numeric: tabular-nums;
}
.record-list__amount-block em {
  color: #8794a6;
  font-style: normal;
  font-size: 12px;
}
.record-list__pager {
  display: flex;
  justify-content: flex-end;
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
