/**
 * 兑换列表 Composable
 */
import { reactive, ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeItem } from '@/api/modules/exchange';
import type { PageResult } from '@/api/types';

export const EXCHANGE_STATUS_MAP = {
  pending: { label: '处理中', type: 'primary' as const },
  completed: { label: '已完成', type: 'success' as const },
  failed: { label: '已失败', type: 'danger' as const },
} as const;

export function useExchangeList() {
  const loading = ref(false);
  const list = ref<ExchangeItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);

  const query = reactive({
    keyword: '',
    asset: '' as string,
  });

  async function fetchList() {
    loading.value = true;
    try {
      const res = await exchangeApi.fetchExchangeList({
        page: page.value,
        pageSize: pageSize.value,
        ...query,
      });
      const data: PageResult<ExchangeItem> = res.data;
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
    query.keyword = '';
    query.asset = '';
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
