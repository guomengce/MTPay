/**
 * 白名单详情 Composable
 * - 加载指定 id 的主体资料、审核信息、补件要求和操作权限。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';

export function useWhitelistDetail() {
  const loading = ref(false);
  const detail = ref<WhitelistItemDetail | null>(null);
  let requestVersion = 0;

  async function fetchDetail(id: number) {
    const version = ++requestVersion;
    loading.value = true;
    try {
      const result = await whitelistApi.fetchWhitelistDetail(id);
      if (version === requestVersion) detail.value = result;
    } finally {
      if (version === requestVersion) loading.value = false;
    }
  }

  function clear() {
    requestVersion++;
    loading.value = false;
    detail.value = null;
  }

  return {
    loading,
    detail,
    fetchDetail,
    clear,
  };
}
