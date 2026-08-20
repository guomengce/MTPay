/**
 * 白名单列表 Composable
 * - 文档仅允许 page/limit 两个查询参数，禁止虚构 status/keyword；
 * - Laravel 分页：列表读 data.data，总数读 data.total；
 * - 提交/补件成功后由组合入口触发刷新。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistItem, WhitelistPageResult } from '@/api/modules/whitelist';

/** 状态映射，供组件按 status 取 label / type。 */
export const WHITELIST_STATUS_MAP = {
  0: { label: '待审核', type: 'warning' as const, effect: 'pending' as const },
  1: { label: '待补充文件', type: 'warning' as const, effect: undefined },
  2: { label: '已通过', type: 'success' as const, effect: undefined },
  3: { label: '已驳回', type: 'danger' as const, effect: undefined },
} as const;

export type WhitelistStatus = 0 | 1 | 2 | 3;

export function useWhitelistList() {
  const loading = ref(false);
  const list = ref<WhitelistItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);

  async function fetchList() {
    loading.value = true;
    try {
      const data: WhitelistPageResult = await whitelistApi.fetchWhitelistList({
        page: page.value,
        limit: limit.value,
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

  async function refresh() {
    await fetchList();
  }

  return {
    loading,
    list,
    total,
    page,
    limit,
    fetchList,
    setPage,
    setLimit,
    refresh,
  };
}
