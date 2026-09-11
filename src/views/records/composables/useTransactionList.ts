/**
 * 代理端交易记录列表组合逻辑
 * - 调用 /web/getTransactionList，只读；
 * - 代理端不支持 user_id 与 keyword 筛选。
 */
import { reactive, ref } from 'vue';

import * as TransactionApi from '@/api/modules/transaction';
import type {
  TransactionBusinessType,
  TransactionItem,
  TransactionListParams,
} from '@/api/modules/transaction';

export interface TransactionQuery {
  business_type: TransactionBusinessType | undefined;
  status_group: string;
  currency_code: string;
  order_no: string;
  started_at: string;
  ended_at: string;
}

const INITIAL_QUERY: TransactionQuery = {
  business_type: undefined,
  status_group: '',
  currency_code: '',
  order_no: '',
  started_at: '',
  ended_at: '',
};

export function useTransactionList() {
  const loading = ref(false);
  const list = ref<TransactionItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const query = reactive<TransactionQuery>({ ...INITIAL_QUERY });

  function buildParams(): TransactionListParams {
    return {
      page: page.value,
      limit: limit.value,
      business_type: query.business_type,
      status_group: query.status_group.trim() || undefined,
      currency_code: query.currency_code.trim() || undefined,
      order_no: query.order_no.trim() || undefined,
      started_at: query.started_at || undefined,
      ended_at: query.ended_at || undefined,
    };
  }

  async function loadList() {
    loading.value = true;
    try {
      const result = await TransactionApi.fetchTransactionList(buildParams());
      list.value = result.data ?? [];
      total.value = result.total ?? 0;
      page.value = result.current_page ?? page.value;
      limit.value = result.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function search() {
    page.value = 1;
    void loadList();
  }

  function reset() {
    Object.assign(query, INITIAL_QUERY);
    page.value = 1;
    void loadList();
  }

  function setPage(value: number) {
    page.value = value;
    void loadList();
  }

  return {
    loading,
    list,
    total,
    page,
    limit,
    query,
    loadList,
    search,
    reset,
    setPage,
  };
}
