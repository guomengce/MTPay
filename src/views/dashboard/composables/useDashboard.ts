/**
 * 业务总览 Composable
 * - 一次调用 /web/getAgentAssetOverview，数据在组合层映射给页面；
 * - 近期交易复用统一交易 TransactionItem，页面不自行换算金额。
 */
import { computed, ref } from 'vue';

import * as dashboardApi from '@/api/modules/dashboard';
import type { AssetOverview } from '@/api/modules/dashboard';
import type { TransactionItem } from '@/api/modules/transaction';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { formatExchangeRate, formatFixedFee } from '@/utils/decimal';

const BALANCE_TONE: Record<string, 'teal' | 'blue' | 'green'> = {
  USDT: 'teal',
  USDC: 'blue',
  USD: 'green',
};

export interface BalanceItem {
  code: string;
  title: string;
  amount: string;
  frozen: string;
  tone: 'teal' | 'blue' | 'green';
}

export interface RecentTransactionItem {
  key: string;
  date: string;
  time: string;
  type: string;
  typeTone: 'deposit' | 'withdrawal' | 'exchange';
  id: string;
  content: string;
  amount: string;
  amountLabel?: string;
  amountTone: 'neutral' | 'plus' | 'minus';
  status: string;
  statusBadge: StatusBadgeType;
}

export interface RateItem {
  pair: string;
  value: string;
  sample: string;
  mark: string;
}

function splitTime(value: string | null) {
  if (!value) return { date: '—', time: '—' };
  const [datePart = '', timePart = ''] = value.split(' ');
  const [, month = '', day = ''] = datePart.split('-');
  return { date: `${month}/${day}`, time: timePart };
}

function recentTransaction(row: TransactionItem): RecentTransactionItem {
  const { date, time } = splitTime(row.submitted_at);
  let content = '';
  if (row.business_type === 'deposit') {
    content = [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  } else if (row.business_type === 'exchange') {
    content = `${row.currency_code} → ${row.target_currency_code}`;
  } else {
    content = [row.payer_name, row.payee_name].filter(Boolean).join(' → ');
  }

  const group = row.status_group;
  const statusBadge: StatusBadgeType =
    group === 'completed'
      ? 'success'
      : group === 'rejected'
        ? 'danger'
        : group === 'failed'
          ? 'gray'
          : group === 'processing'
            ? 'primary'
            : 'warning';

  return {
    key: row.transaction_key,
    date,
    time,
    type: row.business_name,
    typeTone: row.business_type,
    id: row.order_no,
    content,
    amount: `${row.amount} ${row.currency_code}`,
    amountTone: row.business_type === 'withdrawal' ? 'minus' : 'neutral',
    status: row.status_name,
    statusBadge,
  };
}

export function useDashboard() {
  const loading = ref(false);
  const overview = ref<AssetOverview | null>(null);

  async function loadOverview() {
    loading.value = true;
    try {
      overview.value = await dashboardApi.fetchAgentAssetOverview();
    } finally {
      loading.value = false;
    }
  }

  const balances = computed<BalanceItem[]>(() =>
    (overview.value?.assets ?? []).map((asset) => ({
      code: asset.currency.code,
      title: `${asset.currency.code} 可用余额`,
      amount: asset.available_balance,
      frozen: `冻结 ${asset.frozen_balance} ${asset.currency.code}`,
      tone: BALANCE_TONE[asset.currency.code] ?? 'teal',
    })),
  );

  const pendingCount = computed(() => overview.value?.pending_counts?.total ?? 0);
  const feeAmount = computed(() => formatFixedFee(overview.value?.capabilities?.withdrawal_fee_amount));
  const companyName = computed(() => overview.value?.user?.company_name ?? '');

  const recentTransactions = computed<TransactionItem[]>(() => overview.value?.recent_orders ?? []);

  const rateItems = computed<RateItem[]>(() => {
    const rates = overview.value?.effective_exchange_rates ?? {};
    return (['USDT', 'USDC'] as const)
      .filter((code) => rates[code])
      .map((code) => {
        const rate = rates[code]!;
        return {
          pair: `${code} → ${rate.target_currency.code}`,
          value: formatExchangeRate(rate.rate),
          sample: `${rate.rate_source_name} · 比例 ${formatExchangeRate(rate.rate)}`,
          mark: code === 'USDT' ? '₮' : '$',
        };
      });
  });

  return {
    loading,
    overview,
    balances,
    pendingCount,
    feeAmount,
    companyName,
    recentTransactions,
    rateItems,
    loadOverview,
  };
}
