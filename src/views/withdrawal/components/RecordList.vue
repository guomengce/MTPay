<template>
  <AdminPanel class="record-list" :title="t('withdrawal.records')">
    <template #extra>
      <div class="filter-bar">
      <el-select v-model="statusFilter" :placeholder="t('withdrawal.orderStatus')" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-input v-model="orderNoFilter" :placeholder="t('withdrawal.orderNo')" clearable />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        :range-separator="t('withdrawal.dateTo')"
        :start-placeholder="t('withdrawal.startDate')"
        :end-placeholder="t('withdrawal.endDate')"
        value-format="YYYY-MM-DD"
        unlink-panels
      />
      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="onSearch">{{ t('common.actions.search') }}</el-button>
        <el-button @click="onReset">{{ t('common.actions.reset') }}</el-button>
      </div>
      </div>
    </template>

    <div class="record-list__body">

    <el-table
      v-loading="loading"
      :data="list"
      :empty-text="loading ? t('withdrawal.loading') : t('withdrawal.empty')"
      stripe
      class="record-list__table"
    >
      <el-table-column prop="order_no" :label="t('withdrawal.orderNo')" min-width="180">
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
      <el-table-column :label="t('withdrawal.transactionParties')" min-width="380" align="center" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            :payer-name="row.payer.name"
            :payer-type="entityTypeName(row.payer.entity_type)"
            :payee-name="row.payee.name"
            :payee-type="entityTypeName(row.payee.entity_type)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('withdrawal.amount')" min-width="250" align="left">
        <template #default="{ row }">
          <div class="record-list__amount-block">
            <strong class="record-list__amount">
              {{ formatMoney(row.amount) }} <span>{{ row.currency.code }}</span>
            </strong>
            <div class="record-list__deduction">
              <span>{{ t('withdrawal.totalDeduction') }} {{ formatMoney(row.total_amount) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('withdrawal.status')" min-width="150">
        <template #default="{ row }">
          <StatusBadge
            :label="statusLabel(row.status, row.status_name)"
            :type="statusMap[row.status as WithdrawalStatus]?.type"
            :effect="statusMap[row.status as WithdrawalStatus]?.effect"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('withdrawal.actions')" min-width="180" fixed="right" align="center">
        <template #default="{ row }">
          <div class="record-list__actions">
            <el-button type="primary" plain size="small" :icon="View" @click="emit('detail', row.id)">
              {{ t('withdrawal.details') }}
            </el-button>
            <el-button
              v-if="row.status === 1"
              type="warning"
              plain
              size="small"
              :icon="Upload"
              @click="emit('supplement', row)"
              >{{ t('withdrawal.supplement') }}</el-button
            >
          </div>
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
 * 法币出金列表组件
 * - 只负责 UI；业务由 useWithdrawalList 处理；
 * - 字段保留字符串展示，不做数值换算。
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Refresh, Upload, View } from '@element-plus/icons-vue';
import type { WithdrawalListParams, WithdrawalOrder } from '@/api/modules/withdrawal';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
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
const statusOptions = computed(() => [
  { value: 0, label: t('withdrawal.pending') }, { value: 1, label: t('withdrawal.filesRequired') },
  { value: 2, label: t('withdrawal.processing') }, { value: 3, label: t('withdrawal.completed') },
  { value: 4, label: t('withdrawal.rejected') }, { value: 5, label: t('withdrawal.failed') },
]);

const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: formatTime(row.submitted_at),
  status: { label: statusLabel(row.status, row.status_name), type: statusMap[row.status]?.type, effect: statusMap[row.status]?.effect },
  pending: statusMap[row.status]?.effect === 'pending', accent: row.status === 4 || row.status === 5 ? 'danger' : 'primary',
  fields: [
    { label: t('withdrawal.payer'), value: `${entityTypeName(row.payer.entity_type)} · ${row.payer.name}`, strong: true },
    { label: t('withdrawal.payee'), value: `${entityTypeName(row.payee.entity_type)} · ${row.payee.name}`, strong: true },
    { label: t('withdrawal.amount'), value: `${formatMoney(row.amount)} ${row.currency.code}`, subValue: `${t('withdrawal.totalDeduction')} ${formatMoney(row.total_amount)} ${row.currency.code}`, strong: true },
  ],
  actions: [
    { key: 'detail', label: t('withdrawal.viewDetails'), icon: View, type: 'primary', plain: true },
    { key: 'supplement', label: t('withdrawal.supplement'), icon: Upload, type: 'warning', plain: true, visible: row.status === 1 },
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
  return value === 1 ? t('withdrawal.company') : t('withdrawal.individual');
}
function statusLabel(value: number, fallback = '') {
  return [t('withdrawal.pending'), t('withdrawal.filesRequired'), t('withdrawal.processing'), t('withdrawal.completed'), t('withdrawal.rejected'), t('withdrawal.failed')][value] || fallback;
}
function handleCardAction(actionKey: string, itemKey: string) {
  const row = props.list.find((item) => item.id === Number(itemKey));
  if (!row) return;
  if (actionKey === 'detail') emit('detail', row.id);
  if (actionKey === 'supplement') emit('supplement', row);
}
const { t } = useI18n();
</script>

<style scoped lang="scss">
.record-list__body { display:flex; min-width:0; flex-direction:column; gap:16px;  }
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
  .record-list__body { padding:16px; }
  .record-list__table { display: none; }
  .record-list__pager {
    justify-content: flex-end;
    overflow-x: auto;
  }
}
</style>
