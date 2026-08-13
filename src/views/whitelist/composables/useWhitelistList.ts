/**
 * 白名单列表 Composable
 */
import { reactive, ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistItem } from '@/api/modules/whitelist';
import type { PageResult } from '@/api/types';

export const WHITELIST_STATUS_MAP = {
  pending: { label: '待审核', type: 'warning' as const, effect: 'pending' as const },
  approved: { label: '已批准', type: 'success' as const },
  rejected: { label: '已驳回', type: 'danger' as const },
} as const;

export function useWhitelistList() {
  const loading = ref(false);
  const list = ref<WhitelistItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);

  const query = reactive({
    keyword: '',
    role: '' as string,
    status: '' as WhitelistItem['status'] | '',
  });

  async function fetchList() {
    loading.value = true;
    try {
      const res = await whitelistApi.fetchWhitelistList({
        page: page.value,
        pageSize: pageSize.value,
        ...query,
      });
      const data: PageResult<WhitelistItem> = res.data;
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  function resetQuery() {
    query.keyword = '';
    query.role = '';
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
