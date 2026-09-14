import type { RouteLocationRaw } from 'vue-router';
import type { TransactionBusinessType, TransactionItem } from '@/api/modules/transaction';

const transactionDetailRouteNames: Partial<Record<TransactionBusinessType, string>> = {
  deposit: 'DepositDetail',
  fiat_deposit: 'FiatDepositDetail',
  exchange: 'ExchangeDetail',
  withdrawal: 'WithdrawalDetail',
  manual_increase: 'TransactionDetail',
  manual_decrease: 'TransactionDetail',
};

export function transactionDetailRoute(row: TransactionItem): RouteLocationRaw | null {
  const detailType = row.detail_type || row.business_type;
  const detailId = row.detail_id || row.business_id;
  const routeName = transactionDetailRouteNames[detailType];
  if (!routeName || !detailId) return null;
  if (routeName === 'TransactionDetail') {
    return {
      name: routeName,
      params: { businessType: detailType, businessId: String(detailId) },
    };
  }
  return { name: routeName, params: { id: String(detailId) } };
}

export function hasTransactionDetailRoute(row: TransactionItem) {
  return transactionDetailRoute(row) !== null;
}
