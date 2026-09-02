/**
 * 白名单列表 Composable
 * - 支持按白名单角色和主体类型筛选；
 * - Laravel 分页：列表读 data.data，总数读 data.total；
 * - 提交/补件成功后由组合入口触发刷新。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistItem, WhitelistPageResult } from '@/api/modules/whitelist';

/** 状态映射，供组件按 status 取 label / type。 */
export const WHITELIST_STATUS_MAP = {
  0: { type: 'warning' as const, effect: 'pending' as const },
  1: { type: 'warning' as const, effect: undefined },
  2: { type: 'success' as const, effect: undefined },
  3: { type: 'danger' as const, effect: undefined },
} as const;

export type WhitelistStatus = 0 | 1 | 2 | 3;

export function useWhitelistList() {
  const loading = ref(false);
  const list = ref<WhitelistItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const role = ref<1 | 2>();
  const entityType = ref<1 | 2>();

  async function fetchList() {
    loading.value = true;
    try {
      const data: WhitelistPageResult = await whitelistApi.fetchWhitelistList({
        page: page.value,
        limit: limit.value,
        role: role.value,
        entity_type: entityType.value,
      });
      list.value = data.data ?? [];
      total.value = data.total ?? 0;
      page.value = data.current_page ?? page.value;
      limit.value = data.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function setPage(nextPage: number) {
    page.value = nextPage;
  }

  function setLimit(nextLimit: number) {
    limit.value = nextLimit;
    page.value = 1;
  }

  async function applyFilters() {
    page.value = 1;
    await fetchList();
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
    role,
    entityType,
    fetchList,
    setPage,
    setLimit,
    applyFilters,
    refresh,
  };
}
