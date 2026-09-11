import type { RouteLocationRaw } from 'vue-router';
import type { TransactionBusinessType, TransactionItem } from '@/api/modules/transaction';

const transactionDetailRouteNames: Partial<Record<TransactionBusinessType, string>> = {
  deposit: 'DepositDetail',
  fiat_deposit: 'FiatDepositDetail',
  exchange: 'ExchangeDetail',
  withdrawal: 'WithdrawalDetail',
};

export function transactionDetailRoute(row: TransactionItem): RouteLocationRaw | null {
  const routeName = transactionDetailRouteNames[row.detail_type];
  if (!routeName || !row.detail_id) return null;
  return { name: routeName, params: { id: String(row.detail_id) } };
}

export function hasTransactionDetailRoute(row: TransactionItem) {
  return transactionDetailRoute(row) !== null;
}
