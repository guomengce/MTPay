/**
 * 入金通道 Composable
 * - 加载当前代理可用的入金通道（含币种、网络、收款地址）；
 * - 通道下拉列表和收款地址展示由 ApplyForm 组件触发 `loadChannels`；
 * - 后端按请求 Token 识别代理，不接受 user_id 参数。
 */
import { ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type { DepositChannelItem } from '@/api/modules/deposit';

export function useDepositChannel() {
  const loading = ref(false);
  const channels = ref<DepositChannelItem[]>([]);

  /** 重新拉取当前代理的全部入金通道，覆盖本地缓存。 */
  async function loadChannels() {
    loading.value = true;
    try {
      channels.value = await depositApi.fetchDepositChannels();
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    channels,
    loadChannels,
  };
}