<template>
  <AdminPanel class="record-list" :title="t('deposit.recordTitle')">
    <template #extra>
      <div class="filter-bar">
        <el-input v-model="orderNoFilter" :placeholder="t('deposit.orderNo')" clearable />
        <el-date-picker
        v-model="dateRange"
        type="daterange"
        :range-separator="t('deposit.dateTo')"
        :start-placeholder="t('deposit.startDate')"
        :end-placeholder="t('deposit.endDate')"
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
      :empty-text="loading ? t('deposit.loading') : t('deposit.empty')"
      stripe
      class="record-list__table"
    >
      <el-table-column prop="order_no" :label="t('deposit.orderNo')" min-width="170">
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
      <el-table-column :label="t('deposit.currencyNetwork')" min-width="160">
        <template #default="{ row }">{{ row.currency.code }} · {{ row.network.code }}</template>
      </el-table-column>
      <el-table-column :label="t('deposit.amount')" min-width="140" align="right">
        <template #default="{ row }">
          <span class="record-list__amount">{{ formatMoney(row.amount) }} </span>
          <br/>
          <small style="color:#1D8FB4;font-weight:700;">{{ row.currency.code }}</small>
        </template>
      </el-table-column>
      <el-table-column label="Txid" min-width="220"><template #default="{row}"><span class="mono">{{ formatLongIdentifier(row.txid) }}</span></template></el-table-column>
      <el-table-column :label="t('deposit.status')" min-width="120">
        <template #default="{ row }">
          <StatusBadge
            :label="statusOptions.find((item) => item.value === row.status)?.label || row.status_name"
            :type="statusMap[row.status as DepositStatus]?.type"
            :effect="statusMap[row.status as DepositStatus]?.effect"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('deposit.actions')" width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row.id)">
            {{ t('deposit.details') }}
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
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

/**
 * 入金列表组件
 * - 只负责渲染列表/分页/筛选 UI，业务由 useDepositList 处理；
 * - 筛选条件变更后必须 `resetQuery` 再 `fetchList`，避免在第二页漏请求。
 */
import { computed } from 'vue';
import { formatLongIdentifier } from '@/utils/text';
import { View } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import type { DepositListParams, DepositOrder } from '@/api/modules/deposit';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
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
const { t } = useI18n();
const statusOptions = computed(() => [
  { value: 0, label: t('deposit.statusPending') },
  { value: 1, label: t('deposit.statusCredited') },
  { value: 2, label: t('deposit.statusRejected') },
]);

const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: formatTime(row.submitted_at),
  status: { label: statusOptions.value.find((item) => item.value === row.status)?.label || row.status_name, type: statusMap[row.status]?.type, effect: statusMap[row.status]?.effect },
  pending: statusMap[row.status]?.effect === 'pending', accent: 'success',
  fields: [
    { label: t('deposit.currencyNetwork'), value: `${row.currency.code} · ${row.network.code}`, strong: true },
    { label: t('deposit.amount'), value: `${formatMoney(row.amount)} ${row.currency.code}`, strong: true },
    { label: 'Txid', value: formatLongIdentifier(row.txid), mono: true },
  ], actions: [{ key: 'detail', label: t('deposit.viewDetails'), icon: View, type: 'primary', plain: true }],
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
  &__body {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 16px;
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
    &__body { padding: 16px; }
  }

  .record-list__table { display: none; }

  .record-list__pager {
    justify-content: flex-end;
    overflow-x: auto;
  }
}
</style>
