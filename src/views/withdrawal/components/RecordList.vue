<template>
  <section class="record-list">
    <header class="record-list__header">
      <div>
        <h3 class="record-list__title">出金记录</h3>
        <p class="record-list__subtitle">按筛选条件展示当前代理的出金订单</p>
      </div>
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
      :empty-text="loading ? '加载中…' : '暂无出金记录'"
      stripe
      class="record-list__table"
    >
      <el-table-column prop="order_no" label="订单号" min-width="180">
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
      <el-table-column label="交易主体" min-width="380" align="center" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            :payer-name="row.payer.name"
            :payer-type="entityTypeName(row.payer.entity_type)"
            :payee-name="row.payee.name"
            :payee-type="entityTypeName(row.payee.entity_type)"
          />
        </template>
      </el-table-column>
      <el-table-column label="出金金额" min-width="250" align="left">
        <template #default="{ row }">
          <div class="record-list__amount-block">
            <strong class="record-list__amount">
              {{ row.amount }} <span>{{ row.currency.code }}</span>
            </strong>
            <div class="record-list__deduction">
              <span>总扣款 {{ row.total_amount }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status_name"
            :type="statusMap[row.status as WithdrawalStatus]?.type"
            :effect="statusMap[row.status as WithdrawalStatus]?.effect"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right" align="center">
        <template #default="{ row }">
          <div class="record-list__actions">
            <el-button type="primary" plain size="small" :icon="View" @click="emit('detail', row.id)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 1"
              type="warning"
              plain
              size="small"
              :icon="Upload"
              @click="emit('supplement', row)"
              >补件</el-button
            >
          </div>
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
 * 出金列表组件
 * - 只负责 UI；业务由 useWithdrawalList 处理；
 * - 字段保留字符串展示，不做数值换算。
 */
import { computed } from 'vue';
import { Refresh, Upload, View } from '@element-plus/icons-vue';
import type { WithdrawalListParams, WithdrawalOrder } from '@/api/modules/withdrawal';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import ResponsiveCardList, { type ResponsiveCardItem } from '@/components/common/ResponsiveCardList.vue';
import WithdrawalPartyFlow from './WithdrawalPartyFlow.vue';

import {
  WITHDRAWAL_STATUS_MAP,
  type WithdrawalStatus,
} from '@/views/withdrawal/composables/useWithdrawalList';

const props = defineProps<{
  list: WithdrawalOrder[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  query: {
    status: WithdrawalStatus | undefined;
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
  (e: 'supplement', row: WithdrawalOrder): void;
  (e: 'query-change', patch: Partial<WithdrawalListParams>): void;
}>();

const statusMap = WITHDRAWAL_STATUS_MAP;
const statusOptions = [
  { value: 0, label: '待审核' },
  { value: 1, label: '待补充文件' },
  { value: 2, label: '付款处理中' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已驳回' },
  { value: 5, label: '付款失败' },
];

const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: formatTime(row.submitted_at),
  status: { label: row.status_name, type: statusMap[row.status]?.type, effect: statusMap[row.status]?.effect },
  pending: statusMap[row.status]?.effect === 'pending', accent: row.status === 4 || row.status === 5 ? 'danger' : 'primary',
  fields: [
    { label: '付款方', value: `${entityTypeName(row.payer.entity_type)} · ${row.payer.name}`, strong: true },
    { label: '收款方', value: `${entityTypeName(row.payee.entity_type)} · ${row.payee.name}`, strong: true },
    { label: '出金金额', value: `${row.amount} ${row.currency.code}`, subValue: `总扣款 ${row.total_amount} ${row.currency.code}`, strong: true },
  ],
  actions: [
    { key: 'detail', label: '查看详情', icon: View, type: 'primary', plain: true },
    { key: 'supplement', label: '补件', icon: Upload, type: 'warning', plain: true, visible: row.status === 1 },
  ],
})));

const statusFilter = computed<WithdrawalStatus | undefined>({
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
function refresh() {
  emit('refresh');
}
function formatTime(value: string | null) {
  return value ?? '—';
}

/** 接口 entity_type：1 公司，2 个人。 */
function entityTypeName(value: 1 | 2) {
  return value === 1 ? '公司' : '个人';
}
function handleCardAction(actionKey: string, itemKey: string) {
  const row = props.list.find((item) => item.id === Number(itemKey));
  if (!row) return;
  if (actionKey === 'detail') emit('detail', row.id);
  if (actionKey === 'supplement') emit('supplement', row);
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
.record-list__amount-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  padding: 8px 0;
}
.record-list__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
.record-list__link {
  color: #27b9aa;
  text-decoration: none;
}
.record-list__link:hover {
  color: #1d8db5;
  text-decoration: underline;
}
.record-list__amount {
  color: #071833;
  font-size: 17px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;

  span {
    color: #087f79;
    font-size: 11px;
    font-weight: 700;
  }
}
.record-list__deduction {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  color: #7a899b;
  font-size: 11px;
  font-variant-numeric: tabular-nums;

  i {
    width: 1px;
    height: 11px;
    background: #d6e0e8;
  }
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
