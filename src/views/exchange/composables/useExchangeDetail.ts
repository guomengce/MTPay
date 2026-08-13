/**
 * 兑换详情 Composable
 */
import { ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeDetail } from '@/api/modules/exchange';

export function useExchangeDetail() {
  const loading = ref(false);
  const detail = ref<ExchangeDetail | null>(null);

  async function fetchDetail(id: string) {
    loading.value = true;
    try {
      const res = await exchangeApi.fetchExchangeDetail(id);
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
