/**
 * 交易记录列表 Composable
 */
import { reactive, ref } from 'vue';

import * as transactionApi from '@/api/modules/transaction';
import type { TransactionItem } from '@/api/modules/transaction';
import type { PageResult } from '@/api/types';

export const TX_TYPE_MAP = {
  deposit: { label: '入金', type: 'success' as const },
  withdrawal: { label: '出金', type: 'primary' as const },
  exchange: { label: '兑换', type: 'warning' as const },
} as const;

export const TX_STATUS_MAP = {
  pending: { label: '待审核', type: 'warning' as const, effect: 'pending' as const },
  reviewing: { label: '处理中', type: 'primary' as const },
  completed: { label: '已完成', type: 'success' as const },
  failed: { label: '已失败', type: 'danger' as const },
} as const;

export function useTransactionList() {
  const loading = ref(false);
  const exporting = ref(false);
  const list = ref<TransactionItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);

  const query = reactive({
    keyword: '',
    type: '' as TransactionItem['type'] | '',
    dateRange: [] as string[],
  });

  async function fetchList() {
    loading.value = true;
    try {
      const res = await transactionApi.fetchTransactionList({
        page: page.value,
        pageSize: pageSize.value,
        ...query,
      });
      const data: PageResult<TransactionItem> = res.data;
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  async function exportCsv() {
    exporting.value = true;
    try {
      await transactionApi.exportTransactions({
        page: page.value,
        pageSize: pageSize.value,
        ...query,
      });
    } finally {
      exporting.value = false;
    }
  }

  function resetQuery() {
    query.keyword = '';
    query.type = '';
    query.dateRange = [];
    page.value = 1;
  }

  async function refresh() {
    await fetchList();
  }

  return {
    loading,
    exporting,
    list,
    total,
    page,
    pageSize,
    query,
    fetchList,
    exportCsv,
    resetQuery,
    refresh,
  };
}
