<template>
  <el-card class="transaction-table" shadow="never">
    <el-table v-loading="loading" :data="data" class="transaction-table__table" stripe>
      <el-table-column label="时间" min-width="150">
        <template #default="{ row }">{{ row.submitted_at || '—' }}</template>
      </el-table-column>
      <el-table-column label="类型" min-width="90">
        <template #default="{ row }">
          <StatusBadge :label="row.business_name" :type="typeBadge(row)" />
        </template>
      </el-table-column>
      <el-table-column label="编号" min-width="180">
        <template #default="{ row }">
          <a
            class="transaction-table__link"
            href="javascript:void(0)"
            @click.prevent="emit('view', row)"
          >
            {{ row.order_no }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">{{ contentLabel(row) }}</template>
      </el-table-column>
      <el-table-column label="金额" min-width="200">
        <template #default="{ row }">
          <div class="transaction-table__amount-block">
            <strong>{{ amountLabel(row) }}</strong>
            <small v-if="row.business_type === 'withdrawal'">
              总扣款 {{ row.total_amount }} USD
            </small>
            <small v-else-if="row.business_type === 'exchange'">
              获得 {{ row.target_amount }} {{ row.target_currency_code }}
            </small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="130">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status_name"
            :type="statusType(row)"
            :effect="statusEffect(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="详情" width="120" align="right">
        <template #default="{ row }">
          <el-button type="primary" plain size="small" :icon="View" @click="emit('view', row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue';

import type { TransactionItem } from '@/api/modules/transaction';
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';

defineProps<{ data: TransactionItem[]; loading?: boolean }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'deposit') {
    return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  }
  if (row.business_type === 'exchange') {
    return `${row.currency_code} → ${row.target_currency_code}${row.exchange_rate ? ` · ${row.exchange_rate}` : ''}`;
  }
  return [row.payer_name, row.payee_name].filter(Boolean).join(' → ');
}

function amountLabel(row: TransactionItem) {
  return `${row.amount} ${row.currency_code}`;
}

function typeBadge(row: TransactionItem): StatusBadgeType {
  if (row.business_type === 'deposit') return 'success';
  if (row.business_type === 'exchange') return 'primary';
  return 'gray';
}

function statusType(row: TransactionItem): StatusBadgeType {
  const group = row.status_group;
  if (group === 'completed') return 'success';
  if (group === 'rejected') return 'danger';
  if (group === 'failed') return 'gray';
  if (group === 'processing') return 'primary';
  return 'warning';
}

function statusEffect(row: TransactionItem) {
  return row.status_group === 'pending' || row.status_group === 'needs_supplement'
    ? 'pending'
    : undefined;
}
</script>

<style scoped lang="scss">
.transaction-table {
  min-width: 0;
  overflow: hidden;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__body) {
    padding: 0;
  }

  &__link {
    color: #27b9aa;
    text-decoration: none;

    &:hover {
      color: #1d8db5;
      text-decoration: underline;
    }
  }

  &__amount-block {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      color: #203249;
      font-variant-numeric: tabular-nums;
    }

    small {
      color: #7b8b9f;
      font-size: 12px;
    }
  }

  @include mobile {
    overflow-x: auto;

    &__table {
      min-width: 980px;
    }
  }
}
</style>
