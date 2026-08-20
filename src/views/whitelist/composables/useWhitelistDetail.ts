/**
 * 白名单详情 Composable
 * - 加载指定 id 的白名单详情（含 business_data / review / records）；
 * - 预览/下载由 useWhitelistPreview 统一处理，避免在组件内重复声明。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';

export function useWhitelistDetail() {
  const loading = ref(false);
  const detail = ref<WhitelistItemDetail | null>(null);

  async function fetchDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await whitelistApi.fetchWhitelistDetail(id);
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    detail.value = null;
  }

  return {
    loading,
    detail,
    fetchDetail,
    clear,
  };
}
