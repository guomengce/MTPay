/**
 * 白名单详情 Composable
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistDetail } from '@/api/modules/whitelist';

export function useWhitelistDetail() {
  const loading = ref(false);
  const detail = ref<WhitelistDetail | null>(null);

  async function fetchDetail(id: string) {
    loading.value = true;
    try {
      const res = await whitelistApi.fetchWhitelistDetail(id);
      detail.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function review(id: string, approved: boolean, reason?: string) {
    await whitelistApi.reviewWhitelistItem(id, { approved, reason });
    if (detail.value) {
      detail.value.status = approved ? 'approved' : 'rejected';
    }
  }

  return {
    loading,
    detail,
    fetchDetail,
    review,
  };
}
