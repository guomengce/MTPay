<template>
  <AdminPanel class="record-list" :title="t('fiatDeposit.records')">
    <template #extra>
      <div class="filter-bar">
        <el-select v-model="currencyFilter" :placeholder="t('fiatDeposit.currency')" clearable>
          <el-option v-for="item in currencies" :key="item.id" :label="item.code" :value="item.id" />
        </el-select>
        <el-select v-model="statusFilter" :placeholder="t('fiatDeposit.orderStatus')" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="keywordFilter" :placeholder="t('fiatDeposit.keywordPlaceholder')" clearable />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :range-separator="t('fiatDeposit.dateTo')"
          :start-placeholder="t('fiatDeposit.startDate')"
          :end-placeholder="t('fiatDeposit.endDate')"
          value-format="YYYY-MM-DD"
          unlink-panels
        />
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="emit('search')">{{ t('fiatDeposit.search') }}</el-button>
          <el-button @click="reset">{{ t('fiatDeposit.reset') }}</el-button>
        </div>
      </div>
    </template>

    <div class="record-list__body">
      <el-table v-loading="loading" :data="list" :empty-text="loading ? t('fiatDeposit.loading') : t('fiatDeposit.empty')" stripe class="record-list__table">
        <el-table-column :label="t('fiatDeposit.orderNo')" min-width="190">
          <template #default="{ row }">
            <strong class="record-list__link" @click="emit('detail', row.id)">{{ row.order_no }}</strong><br />
            <small>{{ row.submitted_at || '—' }}</small>
          </template>
        </el-table-column>
        <el-table-column :label="t('fiatDeposit.amount')" min-width="160" align="right">
          <template #default="{ row }"><strong class="record-list__amount">{{ formatMoney(row.amount) }}</strong><br /><small class="record-list__currency">{{ row.currency.code }}</small></template>
        </el-table-column>
        <el-table-column prop="payer_name" :label="t('fiatDeposit.payer')" min-width="150" />
        <el-table-column :label="t('fiatDeposit.paymentInfo')" min-width="190">
          <template #default="{ row }"><span>{{ row.payer_bank || '—' }}</span><br /><small>{{ row.remittance_reference || '—' }}</small></template>
        </el-table-column>
        <el-table-column prop="remittance_date" :label="t('fiatDeposit.remittanceDate')" min-width="125" />
        <el-table-column :label="t('fiatDeposit.status')" min-width="110">
          <template #default="{ row }"><StatusBadge :label="statusLabel(row)" :type="statusType(row.status)" /></template>
        </el-table-column>
        <el-table-column :label="t('fiatDeposit.actions')" width="110" fixed="right" align="center">
          <template #default="{ row }"><el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row.id)">{{ t('fiatDeposit.details') }}</el-button></template>
        </el-table-column>
      </el-table>

      <ResponsiveCardList :items="cardItems" @action="handleCardAction" />

      <footer class="record-list__pager">
        <el-pagination class="app-pagination" layout="total, prev, pager, next" background :current-page="page" :page-size="limit" :total="total" @current-change="emit('page', $event)" />
      </footer>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import ResponsiveCardList, { type ResponsiveCardItem } from '@/components/common/ResponsiveCardList.vue';
import { formatMoney } from '@/utils/formatMoney';
import type { FiatCurrency, FiatDepositStatus, FiatFilters, FiatOrder } from '@/api/modules/fiatDeposit';

const props = defineProps<{
  list: FiatOrder[];
  currencies: FiatCurrency[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  query: { currency_id: number | undefined; status: FiatDepositStatus | undefined; keyword: string; started_at: string; ended_at: string };
}>();
const { t } = useI18n();
const emit = defineEmits<{
  (event: 'refresh'): void;
  (event: 'search'): void;
  (event: 'reset'): void;
  (event: 'page', value: number): void;
  (event: 'detail', value: number): void;
  (event: 'query-change', patch: Partial<FiatFilters>): void;
}>();
const statusOptions = computed<{ value: FiatDepositStatus; label: string }[]>(() => [{ value: 0, label: t('fiatDeposit.pending') }, { value: 1, label: t('fiatDeposit.completed') }, { value: 2, label: t('fiatDeposit.rejected') }]);
const currencyFilter = computed({ get: () => props.query.currency_id, set: (value) => emit('query-change', { currency_id: value }) });
const statusFilter = computed({ get: () => props.query.status, set: (value) => emit('query-change', { status: value }) });
const keywordFilter = computed({ get: () => props.query.keyword, set: (value) => emit('query-change', { keyword: value }) });
const dateRange = computed<string[]>({
  get: () => props.query.started_at && props.query.ended_at ? [props.query.started_at, props.query.ended_at] : [],
  set: (value) => emit('query-change', { started_at: value?.[0] || '', ended_at: value?.[1] || '' }),
});
const cardItems = computed<ResponsiveCardItem[]>(() => props.list.map((row) => ({
  key: String(row.id), title: row.order_no, subtitle: row.submitted_at || '—',
  status: { label: statusLabel(row), type: statusType(row.status) }, pending: row.status === 0, accent: 'success',
  fields: [
    { label: t('fiatDeposit.amount'), value: `${formatMoney(row.amount)} ${row.currency.code}`, strong: true },
    { label: t('fiatDeposit.payer'), value: row.payer_name || '—', strong: true },
    { label: t('fiatDeposit.payerBank'), value: row.payer_bank || '—' },
    { label: t('fiatDeposit.remittanceDate'), value: row.remittance_date || '—' },
  ],
  actions: [{ key: 'detail', label: t('common.actions.details'), icon: View, type: 'primary', plain: true }],
})));
function statusLabel(row: FiatOrder) { return statusOptions.value.find((item) => item.value === row.status)?.label || row.status_name; }
function statusType(status: FiatDepositStatus) { return status === 1 ? 'success' : status === 2 ? 'danger' : 'warning'; }
function reset() { emit('reset'); emit('refresh'); }
function handleCardAction(actionKey: string, itemKey: string) { if (actionKey === 'detail') emit('detail', Number(itemKey)); }
</script>

<style scoped lang="scss">
.record-list {
  &__body { display: flex; min-width: 0; flex-direction: column; gap: 16px; }
  &__link { color: #27b9aa; cursor: pointer; text-decoration: none; }
  &__link:hover { color: #1d8db5; text-decoration: underline; }
  &__amount { color: #071833; font-variant-numeric: tabular-nums; }
  &__currency { color: #1d8fb4; font-weight: 700; }
  &__pager { display: flex; justify-content: flex-end; }
}
@include mobile {
  .record-list__body { padding: 16px; }
  .record-list__table { display: none; }
  .record-list__pager { justify-content: flex-end; overflow-x: auto; }
}
</style>
