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
  const manual = row.business_type === 'manual_increase' || row.business_type === 'manual_decrease';
  const detailType = manual ? row.business_type : row.detail_type || row.business_type;
  const preferredId = Number(row.detail_id);
  const fallbackId = Number(row.business_id);
  const detailId = Number.isSafeInteger(preferredId) && preferredId > 0 ? preferredId : fallbackId;
  if (!Number.isSafeInteger(detailId) || detailId <= 0) return null;

  if (detailType === 'manual_increase' || detailType === 'manual_decrease') {
    return {
      name: 'ManualAdjustmentDetail',
      params: { businessType: detailType, businessId: String(detailId) },
    };
  }

  const routeName = transactionDetailRouteNames[detailType];
  return routeName ? { name: routeName, params: { id: String(detailId) } } : null;
}

export function hasTransactionDetailRoute(row: TransactionItem) {
  return transactionDetailRoute(row) !== null;
}
