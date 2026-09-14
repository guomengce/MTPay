<template>
  <div class="transaction-table">
    <el-table v-loading="loading" :data="data" class="transaction-table__table" stripe>
      <el-table-column
        :label="t('records.orderNo')"
        min-width="250"
        class-name="transaction-order-cell"
      >
        <template #default="{ row }">
          <a
            v-if="canViewDetail(row)"
            class="transaction-table__link"
            href="javascript:void(0)"
            @click.prevent="emit('view', row)"
          >
            {{ row.order_no }}
          </a>
          <span v-else class="transaction-table__order-no">{{ row.order_no }}</span>
          <small class="transaction-table__time">{{ row.submitted_at || '—' }}</small>
        </template>
      </el-table-column>
      <el-table-column :label="t('records.type')" min-width="170">
        <template #default="{ row }">
          <span class="transaction-table__type" :class="`is-${row.business_type}`">
            {{ businessLabel(row.business_type) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('records.content')"
        min-width="320"
        align="center"
        header-align="center"
      >
        <template #default="{ row }">
          <WithdrawalPartyFlow
            v-if="row.business_type === 'withdrawal'"
            :payer-name="row.payer_name"
            :payer-type="row.payer_entity_type ?? entityTypeLabel(row.payer_entity_type_name)"
            :payee-name="row.payee_name"
            :payee-type="row.payee_entity_type ?? entityTypeLabel(row.payee_entity_type_name)"
          />
          <div
            v-else-if="row.business_type === 'exchange'"
            class="transaction-table__content is-exchange"
          >
            <div class="transaction-table__exchange-flow">
              <strong>{{ row.currency_code }}</strong>
              <FlowArrow />
              <strong>{{ row.target_currency_code || '—' }}</strong>
            </div>
            <small
              >{{ t('records.exchangeRate') }}：{{
                formatExchangeRate(row.exchange_rate) || '—'
              }}</small
            >
          </div>
          <span v-else class="transaction-table__content">{{ contentLabel(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('records.amount')" min-width="220">
        <template #default="{ row }">
          <div class="transaction-table__amount-block">
            <strong>{{ amountLabel(row) }}</strong>
            <small v-if="row.business_type === 'withdrawal'">
              {{ t('records.totalDeduction') }} {{ formatMoney(row.total_amount || '—') }}
              {{ row.currency_code }}
            </small>
            <small v-else-if="row.business_type === 'exchange'">
              {{ t('records.received') }} {{ formatMoney(row.target_amount || '—') }}
              {{ row.target_currency_code || '' }}
            </small>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('records.status')" min-width="160">
        <template #default="{ row }">
          <StatusBadge
            :label="statusLabel(row)"
            :type="statusType(row)"
            :effect="statusEffect(row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('records.actions')" min-width="100" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            v-if="canViewDetail(row)"
            type="primary"
            plain
            size="small"
            :icon="View"
            @click="emit('view', row)"
          >
            {{ t('records.details') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { View } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

import type { TransactionItem } from '@/api/modules/transaction';
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import FlowArrow from '@/components/common/FlowArrow.vue';
import { formatExchangeRate } from '@/utils/decimal';
import WithdrawalPartyFlow from '@/views/withdrawal/components/WithdrawalPartyFlow.vue';
import { transactionAmount, transactionBusinessLabel } from '../transactionPresentation';
import { hasTransactionDetailRoute } from '../transactionRoutes';

defineProps<{ data: TransactionItem[]; loading?: boolean }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();
const { t } = useI18n();
function businessLabel(type: TransactionItem['business_type']) {
  return transactionBusinessLabel(type, t);
}
function canViewDetail(row: TransactionItem) {
  return (
    hasTransactionDetailRoute(row) ||
    row.business_type === 'manual_increase' ||
    row.business_type === 'manual_decrease'
  );
}
function statusLabel(row: TransactionItem) {
  const key = row.status_group === 'needs_supplement' ? 'supplement' : row.status_group;
  return t(`records.${key}`);
}

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'manual_increase' || row.business_type === 'manual_decrease')
    return '—';
  if (row.business_type === 'deposit') {
    return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  }
  if (row.business_type === 'fiat_deposit') {
    return row.currency_code || '—';
  }
  if (row.business_type === 'exchange') {
    return `${row.currency_code} → ${row.target_currency_code}${row.exchange_rate ? ` · ${formatExchangeRate(row.exchange_rate)}` : ''}`;
  }
  return [row.payer_name, row.payee_name].filter(Boolean).join(' → ');
}

function entityTypeLabel(name?: string | null) {
  return name || undefined;
}

function amountLabel(row: TransactionItem) {
  return transactionAmount(row);
}

function statusType(row: TransactionItem): StatusBadgeType {
  const group = row.status_group;
  if (group === 'completed') return 'success';
  if (group === 'rejected' || group === 'cancelled') return 'danger';
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
:deep(.transaction-order-cell .cell) {
  white-space: nowrap;
}
.transaction-table__link,
.transaction-table__order-no {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}
</style>

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
    white-space: nowrap;

    &.is-deposit {
      color: #07835d;
      background: #e3f7ee;
    }
    &.is-fiat_deposit {
      color: #1267a8;
      background: #e8f3fb;
    }
    &.is-exchange {
      color: #b45309;
      background: #fef3c7;
    }
    &.is-withdrawal {
      color: #0a7f7a;
      background: #e4f6f2;
    }
    &.is-manual_increase {
      color: #047857;
      background: #dff7ec;
    }
    &.is-manual_decrease {
      color: #dc2626;
      background: #fee2e2;
    }
  }

  &__content {
    color: #31465d;
    font-size: 13px;
    font-weight: 500;
    text-align: center;

    &.is-exchange {
      display: grid;
      gap: 5px;

      small {
        color: #7b8b9f;
        font-size: 11px;
      }
    }
  }

  &__exchange-flow {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: minmax(48px, auto) 32px minmax(48px, auto);
    gap: 10px;

    strong {
      font-size: 13px;
      font-weight: 600;
    }
    > strong:first-child {
      text-align: right;
    }
    > strong:last-child {
      text-align: left;
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
    display: none;
  }
}
</style>
