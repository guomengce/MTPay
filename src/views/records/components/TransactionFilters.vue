<template>
  <div class="transaction-filters filter-bar">
    <el-select v-model="businessType" :placeholder="t('records.businessType')" clearable>
      <el-option v-if="authStore.cryptoEnabled" :label="t('records.deposit')" value="deposit" /><el-option v-if="authStore.cryptoEnabled" :label="t('records.exchange')" value="exchange" /><el-option :label="t('records.withdrawal')" value="withdrawal" /><el-option :label="t('records.manual_increase')" value="manual_increase" /><el-option :label="t('records.manual_decrease')" value="manual_decrease" />
    </el-select>
    <el-select v-model="statusGroup" :placeholder="t('records.statusGroup')" clearable>
      <el-option :label="t('records.pending')" value="pending" /><el-option :label="t('records.supplement')" value="needs_supplement" /><el-option :label="t('records.processing')" value="processing" /><el-option :label="t('records.completed')" value="completed" /><el-option :label="t('records.rejected')" value="rejected" /><el-option :label="t('records.failed')" value="failed" />
    </el-select>
    <el-input v-model="orderNo" :placeholder="t('records.orderNo')" clearable />
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      :range-separator="t('deposit.dateTo')" :start-placeholder="t('deposit.startDate')" :end-placeholder="t('deposit.endDate')"
      value-format="YYYY-MM-DD"
      unlink-panels
    />
    <div class="filter-actions">
      <el-button type="primary" :loading="loading" @click="emit('search')">{{ t('common.actions.search') }}</el-button><el-button @click="emit('reset')">{{ t('common.actions.reset') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TransactionBusinessType } from '@/api/modules/transaction';
import type { TransactionQuery } from '../composables/useTransactionList';
import { useAuthStore } from '@/stores/modules/auth';

const props = defineProps<{ query: TransactionQuery; loading?: boolean }>();
const { t } = useI18n();
const authStore = useAuthStore();
const emit = defineEmits<{
  (e: 'update', patch: Partial<TransactionQuery>): void;
  (e: 'search' | 'reset'): void;
}>();

const businessType = computed<TransactionBusinessType | undefined>({
  get: () => props.query.business_type,
  set: (value) => emit('update', { business_type: value }),
});
watch(() => authStore.cryptoEnabled, (enabled) => { if (!enabled && ['deposit', 'exchange'].includes(businessType.value || '')) businessType.value = undefined; }, { immediate: true });
const statusGroup = computed({
  get: () => props.query.status_group,
  set: (value: string) => emit('update', { status_group: value || '' }),
});
const orderNo = computed({
  get: () => props.query.order_no,
  set: (value: string) => emit('update', { order_no: value }),
});
const dateRange = computed<string[]>({
  get: () => props.query.started_at && props.query.ended_at
    ? [props.query.started_at, props.query.ended_at]
    : [],
  set: (value: string[]) => emit('update', {
    started_at: value?.[0] || '',
    ended_at: value?.[1] || '',
  }),
});
</script>

<style scoped lang="scss">
.transaction-filters {
  display: grid;
  gap: 10px;
  margin: 0 0 18px;

  > * {
    min-width: 0;
  }

  .filter-actions {
    min-width: max-content;
  }
}
</style>
