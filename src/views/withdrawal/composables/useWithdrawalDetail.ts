/**
 * 出金详情 Composable
 * - 加载指定 id 的出金订单详情（含审核、文件、补件历史、时间线）；
 * - 文件预览/下载统一调用专用接口，禁止读取 blob 再保存到本地。
 */
import { ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import { fetchWhitelistDetail } from '@/api/modules/whitelist';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';

export function useWithdrawalDetail() {
  const loading = ref(false);
  const detail = ref<WithdrawalOrderDetail | null>(null);

  async function fetchDetail(id: number) {
    loading.value = true;
    try {
      const result = await withdrawalApi.fetchWithdrawalDetail(id);
      const parties = await Promise.allSettled([
        fetchWhitelistDetail(result.payer.whitelist_id),
        fetchWhitelistDetail(result.payee.whitelist_id),
      ]);

      // 出金详情接口目前只返回主体摘要，用白名单详情补齐业务资料。
      // 若后端后续直接返回 data/snapshot，则优先使用出金下单时保存的快照。
      const hydrate = (party: typeof result.payer, index: number) => {
        if (party.data || party.snapshot) return party;
        const source = parties[index];
        if (source?.status !== 'fulfilled') return party;
        return { ...party, data: source.value.business_data };
      };

      detail.value = {
        ...result,
        payer: hydrate(result.payer, 0),
        payee: hydrate(result.payee, 1),
      };
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
