/**
 * 兑换列表 Composable
 * - 管理分页与列表状态；
 * - 金额、汇率保留字符串展示，不做数值换算；
 * - 与入金列表不同：兑换列表不直接接 status_group，使用 status + source_currency_id 筛选。
 */
import { reactive, ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeListParams, ExchangeOrder, ExchangePageResult } from '@/api/modules/exchange';

/** 模块外的状态映射，便于组件按 status 取 label / type。 */
export const EXCHANGE_STATUS_MAP = {
  0: { type: 'warning' as const, effect: 'pending' as const },
  1: { type: 'success' as const, effect: undefined },
  2: { type: 'danger' as const, effect: undefined },
} as const;

export type ExchangeStatus = 0 | 1 | 2;

export function useExchangeList() {
  const loading = ref(false);
  const list = ref<ExchangeOrder[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);

  const query = reactive({
    source_currency_id: undefined as number | undefined,
    status: undefined as ExchangeStatus | undefined,
    order_no: '',
    started_at: '',
    ended_at: '',
  });

  function buildParams(): ExchangeListParams {
    const params: ExchangeListParams = {
      page: page.value,
      limit: limit.value,
    };
    if (query.source_currency_id) params.source_currency_id = query.source_currency_id;
    if (query.status !== undefined && query.status !== null) params.status = query.status;
    if (query.order_no.trim()) params.order_no = query.order_no.trim();
    if (query.started_at) params.started_at = query.started_at;
    if (query.ended_at) params.ended_at = query.ended_at;
    return params;
  }

  async function fetchList() {
    loading.value = true;
    try {
      const data: ExchangePageResult = await exchangeApi.fetchExchangeList(buildParams());
      list.value = data.data ?? [];
      total.value = data.total ?? 0;
      page.value = data.current_page ?? page.value;
      limit.value = data.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
    query.source_currency_id = undefined;
    query.status = undefined;
    query.order_no = '';
    query.started_at = '';
    query.ended_at = '';
    page.value = 1;
  }

  function setPage(nextPage: number) {
    page.value = nextPage;
  }

  async function refresh() {
    await fetchList();
  }

  return {
    loading,
    list,
    total,
    page,
    limit,
    query,
    fetchList,
    resetQuery,
    setPage,
    refresh,
  };
}
