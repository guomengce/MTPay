<template>
  <div class="transaction-filters filter-bar">
    <el-select v-model="businessType" placeholder="业务类型" clearable>
      <el-option label="入金" value="deposit" />
      <el-option label="兑换" value="exchange" />
      <el-option label="出金" value="withdrawal" />
    </el-select>
    <el-select v-model="statusGroup" placeholder="状态组" clearable>
      <el-option label="待审核" value="pending" />
      <el-option label="待补充文件" value="needs_supplement" />
      <el-option label="处理中" value="processing" />
      <el-option label="已完成" value="completed" />
      <el-option label="已驳回" value="rejected" />
      <el-option label="失败" value="failed" />
    </el-select>
    <el-select v-model="currencyCode" placeholder="币种" clearable>
      <el-option label="USDT" value="USDT" />
      <el-option label="USDC" value="USDC" />
      <el-option label="USD" value="USD" />
    </el-select>
    <el-input v-model="orderNo" placeholder="订单号" clearable />
    <el-date-picker v-model="startedAt" type="date" placeholder="起始日期" value-format="YYYY-MM-DD" />
    <el-date-picker v-model="endedAt" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
    <div class="filter-actions">
      <el-button type="primary" :loading="loading" @click="emit('search')">查询</el-button>
      <el-button @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { TransactionBusinessType } from '@/api/modules/transaction';
import type { TransactionQuery } from '../composables/useTransactionList';

const props = defineProps<{ query: TransactionQuery; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'update', patch: Partial<TransactionQuery>): void;
  (e: 'search' | 'reset'): void;
}>();

const businessType = computed<TransactionBusinessType | undefined>({
  get: () => props.query.business_type,
  set: (value) => emit('update', { business_type: value }),
});
const statusGroup = computed({
  get: () => props.query.status_group,
  set: (value: string) => emit('update', { status_group: value || '' }),
});
const currencyCode = computed({
  get: () => props.query.currency_code,
  set: (value: string) => emit('update', { currency_code: value || '' }),
});
const orderNo = computed({
  get: () => props.query.order_no,
  set: (value: string) => emit('update', { order_no: value }),
});
const startedAt = computed({
  get: () => props.query.started_at,
  set: (value: string) => emit('update', { started_at: value || '' }),
});
const endedAt = computed({
  get: () => props.query.ended_at,
  set: (value: string) => emit('update', { ended_at: value || '' }),
});
</script>

<style scoped lang="scss">
.transaction-filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(150px, 1fr));
  gap: 10px;
  margin: 0 0 18px;

  > * {
    min-width: 0;
  }

  .filter-actions {
    min-width: max-content;
  }
}

@media (min-width: 1100px) {
  .transaction-filters {
    grid-template-columns:
      minmax(140px, 0.8fr)
      minmax(150px, 0.9fr)
      minmax(120px, 0.7fr)
      minmax(180px, 1fr)
      minmax(150px, 0.9fr)
      minmax(150px, 0.9fr)
      max-content;
    align-items: center;
  }
}

@include mobile {
  .transaction-filters {
    grid-template-columns: 1fr;

    .filter-actions {
      justify-self: start;
    }
  }
}
</style>
