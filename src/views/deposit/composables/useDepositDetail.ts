/**
 * 入金详情 Composable
 */
import { ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type { DepositDetail } from '@/api/modules/deposit';

export function useDepositDetail() {
  const loading = ref(false);
  const detail = ref<DepositDetail | null>(null);

  async function fetchDetail(id: string) {
    loading.value = true;
    try {
      const res = await depositApi.fetchDepositDetail(id);
      detail.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function approve(id: string) {
    await depositApi.approveDeposit(id);
    if (detail.value) {
      detail.value.status = 'approved';
    }
  }

  async function reject(id: string, reason: string) {
    await depositApi.rejectDeposit(id, reason);
    if (detail.value) {
      detail.value.status = 'rejected';
    }
  }

  return {
    loading,
    detail,
    fetchDetail,
    approve,
    reject,
  };
}
