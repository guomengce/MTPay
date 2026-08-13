/**
 * 入金列表 Composable
 */
import { computed, reactive, ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type { DepositItem } from '@/api/modules/deposit';
import type { PageResult } from '@/api/types';

/* 模块外常量：状态映射 */
export const DEPOSIT_STATUS_MAP = {
  pending: { label: '待审核', type: 'warning' as const, effect: 'pending' as const },
  approved: { label: '已通过', type: 'success' as const },
  rejected: { label: '已驳回', type: 'danger' as const },
  completed: { label: '已完成', type: 'success' as const },
} as const;

export function useDepositList() {
  /* 状态 */
  const loading = ref(false);
  const list = ref<DepositItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);

  const query = reactive({
    keyword: '',
    status: '' as DepositItem['status'] | '',
    dateRange: [] as string[],
  });

  /* 派生：分页参数 */
  const params = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    keyword: query.keyword,
    status: query.status,
    dateRange: query.dateRange,
  }));

  /* 方法 */
  async function fetchList() {
    loading.value = true;
    try {
      const res = await depositApi.fetchDepositList(params.value);
      const data: PageResult<DepositItem> = res.data;
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
    query.keyword = '';
    query.status = '';
    query.dateRange = [];
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
