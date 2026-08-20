/**
 * 出金详情 Composable
 * - 加载指定 id 的出金订单详情（含审核、文件、补件历史、时间线）；
 * - 文件预览/下载统一调用专用接口，禁止读取 blob 再保存到本地。
 */
import { ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';

export function useWithdrawalDetail() {
  const loading = ref(false);
  const detail = ref<WithdrawalOrderDetail | null>(null);

  async function fetchDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await withdrawalApi.fetchWithdrawalDetail(id);
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
