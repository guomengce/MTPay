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
    <el-input v-model="orderNo" placeholder="订单号" clearable />
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
