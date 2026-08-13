/**
 * 出金列表 Composable
 */
import { reactive, ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type { WithdrawalItem } from '@/api/modules/withdrawal';
import type { PageResult } from '@/api/types';

export const WITHDRAWAL_STATUS_MAP = {
  pending: { label: '待审核', type: 'warning' as const, effect: 'pending' as const },
  reviewing: { label: '审核处理中', type: 'primary' as const },
  completed: { label: '已完成', type: 'success' as const },
  rejected: { label: '已驳回', type: 'danger' as const },
} as const;

export function useWithdrawalList() {
  const loading = ref(false);
  const list = ref<WithdrawalItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);

  const query = reactive({
    keyword: '',
    status: '' as WithdrawalItem['status'] | '',
  });

  async function fetchList() {
    loading.value = true;
    try {
      const res = await withdrawalApi.fetchWithdrawalList({
        page: page.value,
        pageSize: pageSize.value,
        ...query,
      });
      const data: PageResult<WithdrawalItem> = res.data;
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
    query.keyword = '';
    query.status = '';
    page.value = 1;
  }

  async function refresh() {
    await fetchList();
  }

  return {
    loading,
    list,
    total,
    page,
    pageSize,
    query,
    fetchList,
    resetQuery,
    refresh,
  };
}
