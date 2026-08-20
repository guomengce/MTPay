/**
 * 兑换详情 Composable
 * - 加载指定 id 的兑换订单详情（含审核信息、时间线、目标金额快照）；
 * - 后端返回的汇率/目标金额是真实业务值，前端禁止用 JS 计算覆盖。
 */
import { ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeOrderDetail } from '@/api/modules/exchange';

export function useExchangeDetail() {
  const loading = ref(false);
  const detail = ref<ExchangeOrderDetail | null>(null);

  async function fetchDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await exchangeApi.fetchExchangeDetail(id);
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
