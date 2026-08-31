<template>
  <AdminPanel class="record-list" title="入金记录">
    <template #extra>
      <div class="filter-bar">
        <el-select v-model="currencyFilter" placeholder="入金币种" clearable>
          <el-option v-for="item in currencies" :key="item.id" :label="item.code" :value="item.id" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="订单状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="keywordFilter" placeholder="订单号 / 付款人 / 银行 / 参考号" clearable />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          unlink-panels
        />
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="emit('search')">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </template>

    <div class="record-list__body">
      <el-table v-loading="loading" :data="list" :empty-text="loading ? '加载中...' : '暂无入金记录'" stripe class="record-list__table">
        <el-table-column label="订单号" min-width="190">
          <template #default="{ row }">
            <strong class="record-list__link" @click="emit('detail', row.id)">{{ row.order_no }}</strong><br />
            <small>{{ row.submitted_at || '—' }}</small>
          </template>
        </el-table-column>
        <el-table-column label="入金金额" min-width="160" align="right">
          <template #default="{ row }"><strong class="record-list__amount">{{ formatMoney(row.amount) }}</strong><br /><small class="record-list__currency">{{ row.currency.code }}</small></template>
        </el-table-column>
        <el-table-column prop="payer_name" label="付款人" min-width="150" />
        <el-table-column label="付款信息" min-width="190">
          <template #default="{ row }"><span>{{ row.payer_bank || '—' }}</span><br /><small>{{ row.remittance_reference || '—' }}</small></template>
        </el-table-column>
        <el-table-column prop="remittance_date" label="汇款日期" min-width="125" />
        <el-table-column label="状态" min-width="110">
          <template #default="{ row }"><StatusBadge :label="statusLabel(row)" :type="statusType(row.status)" /></template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right" align="center">
          <template #default="{ row }"><el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row.id)">详情</el-button></template>
        </el-table-column>
      </el-table>

      <ResponsiveCardList :items="cardItems" @action="handleCardAction" />

      <footer class="record-list__pager">
        <el-pagination layout="prev, pager, next, total" :current-page="page" :page-size="limit" :total="total" :hide-on-single-page="total <= limit" @current-change="emit('page', $event)" />
      </footer>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';
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
const emit = defineEmits<{
  (event: 'refresh'): void;
  (event: 'search'): void;
  (event: 'reset'): void;
  (event: 'page', value: number): void;
  (event: 'detail', value: number): void;
  (event: 'query-change', patch: Partial<FiatFilters>): void;
}>();
const statusOptions: { value: FiatDepositStatus; label: string }[] = [{ value: 0, label: '待审核' }, { value: 1, label: '已完成' }, { value: 2, label: '已驳回' }];
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
    { label: '入金金额', value: `${formatMoney(row.amount)} ${row.currency.code}`, strong: true },
    { label: '付款人', value: row.payer_name || '—', strong: true },
    { label: '付款银行', value: row.payer_bank || '—' },
    { label: '汇款日期', value: row.remittance_date || '—' },
  ],
  actions: [{ key: 'detail', label: '查看详情', icon: View, type: 'primary', plain: true }],
})));
function statusLabel(row: FiatOrder) { return statusOptions.find((item) => item.value === row.status)?.label || row.status_name; }
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
