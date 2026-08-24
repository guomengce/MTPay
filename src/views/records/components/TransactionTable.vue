<template>
  <div class="transaction-table">
    <el-table v-loading="loading" :data="data" class="transaction-table__table" stripe>
      <el-table-column label="提交时间" min-width="180">
        <template #default="{ row }">
          <a class="transaction-table__link" href="javascript:void(0)" @click.prevent="emit('view', row)">
            {{ row.order_no }}
          </a>
          <small class="transaction-table__time">{{ row.submitted_at || '—' }}</small>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="90">
        <template #default="{ row }">
          <span class="transaction-table__type" :class="`is-${row.business_type}`">
            {{ row.business_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="320" align="center" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            v-if="row.business_type === 'withdrawal'"
            :payer-name="row.payer_name"
            :payer-type="entityTypeLabel(row.payer_entity_type_name, row.payer_entity_type)"
            :payee-name="row.payee_name"
            :payee-type="entityTypeLabel(row.payee_entity_type_name, row.payee_entity_type)"
          />
          <div v-else-if="row.business_type === 'exchange'" class="transaction-table__content is-exchange">
            <div class="transaction-table__exchange-flow">
              <strong>{{ row.currency_code }}</strong>
              <FlowArrow />
              <strong>{{ row.target_currency_code || '—' }}</strong>
            </div>
            <small>兑换比例：{{ formatExchangeRate(row.exchange_rate) || '—' }}</small>
          </div>
          <span v-else class="transaction-table__content">{{ contentLabel(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="220">
        <template #default="{ row }">
          <div class="transaction-table__amount-block">
            <strong>{{ amountLabel(row) }}</strong>
            <small v-if="row.business_type === 'withdrawal'">
              总扣款 {{ row.total_amount || '—' }} {{ row.currency_code }}
            </small>
            <small v-else-if="row.business_type === 'exchange'">
              获得 {{ row.target_amount || '—' }} {{ row.target_currency_code || '' }}
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
      <el-table-column label="操作" width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" plain size="small" :icon="View" @click="emit('view', row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue';

import type { TransactionItem } from '@/api/modules/transaction';
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import FlowArrow from '@/components/common/FlowArrow.vue';
import { formatExchangeRate } from '@/utils/decimal';
import WithdrawalPartyFlow from '@/views/withdrawal/components/WithdrawalPartyFlow.vue';

defineProps<{ data: TransactionItem[]; loading?: boolean }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'deposit') {
    return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  }
  if (row.business_type === 'exchange') {
    return `${row.currency_code} → ${row.target_currency_code}${row.exchange_rate ? ` · ${formatExchangeRate(row.exchange_rate)}` : ''}`;
  }
  return [row.payer_name, row.payee_name].filter(Boolean).join(' → ');
}

function entityTypeLabel(name?: string | null, type?: 1 | 2 | null) {
  return name || (type === 1 ? '公司' : type === 2 ? '个人' : undefined);
}

function amountLabel(row: TransactionItem) {
  return `${row.amount} ${row.currency_code}`;
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

  &__link {
    color: #27b9aa;
    text-decoration: none;

    &:hover {
      color: #1d8db5;
      text-decoration: underline;
    }
  }

  &__time {
    display: block;
    margin-top: 5px;
    color: #7b8b9f;
    font-size: 12px;
  }

  &__type {
    display: inline-flex;
    align-items: center;
    padding: 5px 11px;
    border-radius: 999px;
    color: #52677e;
    background: #eef3f7;
    font-size: 12px;
    font-weight: 700;

    &.is-deposit { color: #07835d; background: #e3f7ee; }
    &.is-exchange { color: #b45309; background: #fef3c7; }
    &.is-withdrawal { color: #0a7f7a; background: #e4f6f2; }
  }

  &__content {
    color: #31465d;
    font-size: 13px;
    font-weight: 500;
    text-align: center;

    &.is-exchange {
      display: grid;
      gap: 5px;

      small { color: #7b8b9f; font-size: 11px; }
    }
  }

  &__exchange-flow {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: minmax(48px, auto) 32px minmax(48px, auto);
    gap: 10px;

    strong { font-size: 13px; font-weight: 600; }
    > strong:first-child { text-align: right; }
    > strong:last-child { text-align: left; }
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
    display: none;
  }
}
</style>
