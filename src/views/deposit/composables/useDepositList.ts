/**
 * 入金列表 Composable
 * - 管理分页与列表状态；
 * - 筛选条件改动后必须先 `resetQuery` 再请求，避免在第二页传 status 漏请求；
 * - 金额字段保留字符串展示，不在前端做数值换算。
 */
import { reactive, ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type { DepositListParams, DepositOrder, DepositPageResult } from '@/api/modules/deposit';

/** 模块外的状态映射，便于组件直接通过 status 值取 label / type。 */
export const DEPOSIT_STATUS_MAP = {
  0: { type: 'warning' as const, effect: 'pending' as const },
  1: { type: 'success' as const, effect: undefined },
  2: { type: 'danger' as const, effect: undefined },
} as const;

export type DepositStatus = 0 | 1 | 2;

export function useDepositList() {
  const loading = ref(false);
  const list = ref<DepositOrder[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);

  /** 筛选条件：与接口字段同名。空值不传。 */
  const query = reactive({
    currency_id: undefined as number | undefined,
    network_id: undefined as number | undefined,
    status: undefined as DepositStatus | undefined,
    order_no: '',
    txid: '',
    started_at: '',
    ended_at: '',
  });

  /** 把当前 query + page/limit 转换成接口参数。 */
  function buildParams(): DepositListParams {
    const params: DepositListParams = {
      page: page.value,
      limit: limit.value,
    };
    if (query.currency_id) params.currency_id = query.currency_id;
    if (query.network_id) params.network_id = query.network_id;
    if (query.status !== undefined && query.status !== null) params.status = query.status;
    if (query.order_no.trim()) params.order_no = query.order_no.trim();
    if (query.txid.trim()) params.txid = query.txid.trim();
    if (query.started_at) params.started_at = query.started_at;
    if (query.ended_at) params.ended_at = query.ended_at;
    return params;
  }

  async function fetchList() {
    loading.value = true;
    try {
      const data: DepositPageResult = await depositApi.fetchDepositList(buildParams());
      list.value = data.data ?? [];
      total.value = data.total ?? 0;
      page.value = data.current_page ?? page.value;
      limit.value = data.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
    query.currency_id = undefined;
    query.network_id = undefined;
    query.status = undefined;
    query.order_no = '';
    query.txid = '';
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
