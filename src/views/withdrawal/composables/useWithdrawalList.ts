/**
 * 法币出金列表 Composable
 * - 管理分页与列表状态；
 * - 金额/手续费/到账金额保留字符串展示，不在前端做数值换算。
 */
import { reactive, ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type {
  WithdrawalListParams,
  WithdrawalOrder,
  WithdrawalPageResult,
} from '@/api/modules/withdrawal';

/** 模块外的状态映射，便于组件按 status 取 label / type。 */
export const WITHDRAWAL_STATUS_MAP = {
  0: { type: 'warning' as const, effect: 'pending' as const },
  1: { type: 'warning' as const, effect: undefined },
  2: { type: 'primary' as const, effect: undefined },
  3: { type: 'success' as const, effect: undefined },
  4: { type: 'danger' as const, effect: undefined },
  5: { type: 'danger' as const, effect: undefined },
} as const;

export type WithdrawalStatus = 0 | 1 | 2 | 3 | 4 | 5;

export function useWithdrawalList() {
  const loading = ref(false);
  const list = ref<WithdrawalOrder[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);

  const query = reactive({
    status: undefined as WithdrawalStatus | undefined,
    order_no: '',
    started_at: '',
    ended_at: '',
  });

  function buildParams(): WithdrawalListParams {
    const params: WithdrawalListParams = {
      page: page.value,
      limit: limit.value,
    };
    if (query.status !== undefined && query.status !== null) params.status = query.status;
    if (query.order_no.trim()) params.order_no = query.order_no.trim();
    if (query.started_at) params.started_at = query.started_at;
    if (query.ended_at) params.ended_at = query.ended_at;
    return params;
  }

  async function fetchList() {
    loading.value = true;
    try {
      const data: WithdrawalPageResult = await withdrawalApi.fetchWithdrawalList(buildParams());
      list.value = data.data ?? [];
      total.value = data.total ?? 0;
      page.value = data.current_page ?? page.value;
      limit.value = data.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
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
