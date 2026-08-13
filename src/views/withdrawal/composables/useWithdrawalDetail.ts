/**
 * 出金详情 Composable
 */
import { ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type { WithdrawalDetail } from '@/api/modules/withdrawal';

export function useWithdrawalDetail() {
  const loading = ref(false);
  const detail = ref<WithdrawalDetail | null>(null);

  async function fetchDetail(id: string) {
    loading.value = true;
    try {
      const res = await withdrawalApi.fetchWithdrawalDetail(id);
      detail.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    detail,
    fetchDetail,
  };
}
