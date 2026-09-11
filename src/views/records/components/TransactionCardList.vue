<template><ResponsiveCardList :items="items" @action="handleAction" /></template>
<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { View } from '@element-plus/icons-vue';
import type { TransactionItem } from '@/api/modules/transaction';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import ResponsiveCardList, {
  type ResponsiveCardItem,
} from '@/components/common/ResponsiveCardList.vue';
import { formatExchangeRate } from '@/utils/decimal';
import {
  transactionAmount,
  transactionBusinessLabel,
  transactionBusinessTone,
} from '../transactionPresentation';
import { hasTransactionDetailRoute } from '../transactionRoutes';
const props = defineProps<{ data: TransactionItem[] }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();
const { t } = useI18n();
const items = computed<ResponsiveCardItem[]>(() =>
  props.data.map((row) => ({
    key: row.transaction_key,
    title: row.order_no,
    subtitle: row.submitted_at || '—',
    status: { label: statusLabel(row), type: statusType(row), effect: statusEffect(row) },
    pending: Boolean(statusEffect(row)),
    accent:
      row.business_type === 'deposit' || row.business_type === 'manual_increase'
        ? 'success'
        : row.business_type === 'exchange'
          ? 'warning'
          : row.business_type === 'manual_decrease'
            ? 'danger'
            : 'primary',
    fields: [
      {
        label: t('records.type'),
        badge: {
          label: transactionBusinessLabel(row.business_type, t),
          type: transactionBusinessTone(row.business_type),
        },
      },
      { label: t('records.content'), value: contentLabel(row), strong: true },
      {
        label: t('records.amount'),
        value: transactionAmount(row),
        subValue: amountSubValue(row),
        strong: true,
      },
    ],
    actions: hasTransactionDetailRoute(row)
      ? [
          {
            key: 'view',
            label: t('common.actions.details'),
            icon: View,
            type: 'primary',
            plain: true,
          },
        ]
      : [],
  })),
);
function statusLabel(row: TransactionItem) {
  const key = row.status_group === 'needs_supplement' ? 'supplement' : row.status_group;
  return t(`records.${key}`);
}
function statusType(row: TransactionItem): StatusBadgeType {
  if (row.status_group === 'completed') return 'success';
  if (row.status_group === 'rejected' || row.status_group === 'cancelled') return 'danger';
  if (row.status_group === 'failed') return 'gray';
  if (row.status_group === 'processing') return 'primary';
  return 'warning';
}
function statusEffect(row: TransactionItem) {
  return row.status_group === 'pending' || row.status_group === 'needs_supplement'
    ? 'pending'
    : undefined;
}
function contentLabel(row: TransactionItem) {
  if (row.business_type === 'manual_increase' || row.business_type === 'manual_decrease')
    return '—';
  if (row.business_type === 'withdrawal') {
    const payer = partyLabel(row.payer_name, row.payer_entity_type_name, row.payer_entity_type);
    const payee = partyLabel(row.payee_name, row.payee_entity_type_name, row.payee_entity_type);
    return [payer, payee].filter(Boolean).join(' → ') || '—';
  }
  if (row.business_type === 'exchange') {
    const rate = formatExchangeRate(row.exchange_rate);
    return `${row.currency_code} → ${row.target_currency_code || '—'}${rate ? ` · ${t('records.exchangeRate')} ${rate}` : ''}`;
  }
  return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
}
function partyLabel(name?: string | null, typeName?: string | null, type?: 1 | 2 | null) {
  const entity =
    typeName || (type === 1 ? t('records.company') : type === 2 ? t('records.individual') : '');
  return [name, entity].filter(Boolean).join(' · ');
}
function amountSubValue(row: TransactionItem) {
  if (row.business_type === 'withdrawal')
    return `${t('records.totalDeduction')} ${formatMoney(row.total_amount || '—')} ${row.currency_code}`;
  if (row.business_type === 'exchange')
    return `${t('records.received')} ${formatMoney(row.target_amount || '—')} ${row.target_currency_code || ''}`;
  return undefined;
}
function handleAction(actionKey: string, itemKey: string) {
  if (actionKey !== 'view') return;
  const row = props.data.find((item) => item.transaction_key === itemKey);
  if (row) emit('view', row);
}
</script>
