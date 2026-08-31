import { formatMoney } from '@/utils/formatMoney';
import type { TransactionBusinessType, TransactionItem } from '@/api/modules/transaction';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export type Translate = (key: string, params?: Record<string, unknown>) => string;

export function transactionBusinessLabel(type: TransactionBusinessType, t: Translate) {
  return t(`records.${type}`);
}

export function transactionBusinessTone(type: TransactionBusinessType): StatusBadgeType {
  if (type === 'deposit' || type === 'manual_increase') return 'success';
  if (type === 'exchange') return 'warning';
  if (type === 'manual_decrease') return 'danger';
  return 'primary';
}

export function transactionAmount(row: TransactionItem) {
  const prefix = row.business_type === 'manual_increase' ? '+' : row.business_type === 'manual_decrease' ? '-' : '';
  return `${prefix}${formatMoney(row.amount)} ${row.currency_code}`;
}
