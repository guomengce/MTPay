<template>
  <section class="record-list">
    <header class="record-list__header">
      <div>
        <h3 class="record-list__title">出金记录</h3>
        <p class="record-list__subtitle">按筛选条件展示当前代理的出金订单</p>
      </div>
      <el-button :icon="Refresh" :loading="loading" @click="refresh">刷新</el-button>
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
        v-model="startedAtDate"
        type="date"
        placeholder="起始日期"
        value-format="YYYY-MM-DD"
      />
      <el-date-picker
        v-model="endedAtDate"
        type="date"
        placeholder="结束日期"
        value-format="YYYY-MM-DD"
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
      <el-table-column prop="order_no" label="订单号" min-width="170">
        <template #default="{ row }">
          <a
            class="record-list__link"
            href="javascript:void(0)"
            @click.prevent="emit('detail', row.id)"
          >
            {{ row.order_no }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="付款人 → 收款人" min-width="240" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.payer.name }} → {{ row.payee.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额 / 总扣款" min-width="220" align="right">
        <template #default="{ row }">
          <div class="record-list__amount-block">
            <strong>{{ row.amount }} {{ row.currency.code }}</strong>
            <small>总扣款 {{ row.total_amount }} {{ row.currency.code }}</small>
            <em>固定手续费 {{ row.fee_amount }}</em>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status_name"
            :type="statusMap[row.status as WithdrawalStatus]?.type"
            :effect="statusMap[row.status as WithdrawalStatus]?.effect"
          />
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="170">
        <template #default="{ row }">{{ formatTime(row.submitted_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="center">
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
              >补交文件</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

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

const statusFilter = computed<WithdrawalStatus | undefined>({
  get: () => props.query.status,
  set: (value) => emit('query-change', { status: value }),
});

const orderNoFilter = computed<string>({
  get: () => props.query.order_no,
  set: (value) => emit('query-change', { order_no: value }),
});

const startedAtDate = computed<string>({
  get: () => props.query.started_at,
  set: (value) => {
    emit('query-change', { started_at: value ?? '' });
  },
});

const endedAtDate = computed<string>({
  get: () => props.query.ended_at,
  set: (value) => {
    emit('query-change', { ended_at: value ?? '' });
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
  grid-template-columns: repeat(2, minmax(150px, 1fr));
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
  align-items: flex-end;
  gap: 2px;
}
.record-list__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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
@media (min-width: 1100px) {
  .record-list__filters {
    grid-template-columns:
      minmax(140px, 0.8fr)
      minmax(180px, 1fr)
      minmax(150px, 0.9fr)
      minmax(150px, 0.9fr)
      max-content;
    align-items: center;
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
  .record-list__filters {
    grid-template-columns: 1fr;
  }
  .record-list__filters .filter-actions {
    justify-self: start;
  }
  .record-list__pager {
    justify-content: center;
    overflow-x: auto;
  }
}
</style>
