<template>
  <AdminPanel class="record-list" :title="t('exchange.records')">
    <template #extra>
      <div class="filter-bar">
      <el-select v-model="statusFilter" :placeholder="t('exchange.orderStatus')" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-input v-model="orderNoFilter" :placeholder="t('exchange.orderNo')" clearable />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        :range-separator="t('deposit.dateTo')" :start-placeholder="t('deposit.startDate')" :end-placeholder="t('deposit.endDate')"
        value-format="YYYY-MM-DD"
        unlink-panels
      />
      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="onSearch">{{ t('common.actions.search') }}</el-button><el-button @click="onReset">{{ t('common.actions.reset') }}</el-button>
      </div>
      </div>
    </template>

    <div class="record-list__body">

    <el-table
      v-loading="loading"
      :data="list"
      :empty-text="loading ? t('exchange.loading') : t('exchange.empty')"
      stripe
      class="record-list__table"
    >
      <el-table-column prop="order_no" :label="t('exchange.orderNo')" min-width="190">
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
      <el-table-column :label="t('exchange.sourceAsset')" min-width="170">
        <template #default="{ row }">
          <span class="record-list__path"
            >{{ formatMoney(row.source_amount) }} </span
          ><br/>
          <small>{{ row.source_currency.code }}</small>
        </template>
      </el-table-column>
      <el-table-column :label="t('exchange.rate')" min-width="120">
        <template #default="{ row }">{{ formatExchangeRate(row.exchange_rate) || '—' }}</template>
      </el-table-column>
      <el-table-column :label="t('exchange.receivedUsd')" min-width="170">
        <template #default="{ row }">
          <span class="record-list__path"
            >{{ formatMoney(row.target_amount) }}  </span
          ><br/>
          <small>{{ row.target_currency.code }}</small>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('exchange.status')" min-width="120">
        <template #default="{ row }">
          <StatusBadge
            :label="statusOptions.find((item) => item.value === row.status)?.label || row.status_name"
            :type="statusMap[row.status as ExchangeStatus]?.type"
            :effect="statusMap[row.status as ExchangeStatus]?.effect"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('exchange.actions')" min-width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row.id)">
            {{ t('exchange.details') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <ResponsiveCardList :items="cardItems" @action="handleCardAction" />

    <footer class="record-list__pager">
      <el-pagination
        class="app-pagination"
        layout="total, prev, pager, next"
        background
        :current-page="page"
        :page-size="limit"
        :total="total"
        @current-change="onPage"
      />
    </footer>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

/**
 * 兑换列表组件
 * - 只负责 UI；业务由 useExchangeList 提供；
 * - 字段保留字符串展示，避免精度丢失。
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { View } from '@element-plus/icons-vue';
import type { ExchangeBalance, ExchangeListParams, ExchangeOrder } from '@/api/modules/exchange';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
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
const { t } = useI18n();
const statusOptions = computed(() => [{ value: 0, label: t('exchange.pending') }, { value: 1, label: t('exchange.completed') }, { value: 2, label: t('exchange.rejected') }]);
const sourceCurrencies = computed(() => props.sourceCurrencies ?? []);
const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: formatTime(row.submitted_at),
  status: { label: statusOptions.value.find((item) => item.value === row.status)?.label || row.status_name, type: statusMap[row.status]?.type, effect: statusMap[row.status]?.effect },
  pending: statusMap[row.status]?.effect === 'pending', accent: 'warning',
  fields: [
    { label: t('exchange.sourceAsset'), value: `${formatMoney(row.source_amount)} ${row.source_currency.code}`, strong: true },
    { label: t('records.exchangeRate'), value: formatExchangeRate(row.exchange_rate), strong: true },
    { label: t('exchange.receivedAsset'), value: `${formatMoney(row.target_amount)} ${row.target_currency.code}`, strong: true },
  ], actions: [{ key: 'detail', label: t('common.actions.details'), icon: View, type: 'primary', plain: true }],
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
.record-list__body { display:flex; min-width:0; flex-direction:column; gap:16px; }
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
  .record-list__body { padding:16px; }
  .record-list__table { display: none; }
  .record-list__pager {
    justify-content: flex-end;
    overflow-x: auto;
  }
}
</style>
