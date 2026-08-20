/**
 * 出金配置 Composable
 * - 加载余额、白名单、费率、文件规则；
 * - 表单初始进入调用一次；补件时需重新拉取白名单；
 * - 全部基于当前 Token；不传 user_id。
 */
import { computed, ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type { WithdrawalConfig } from '@/api/modules/withdrawal';

export function useWithdrawalConfig() {
  const loading = ref(false);
  const config = ref<WithdrawalConfig | null>(null);

  /** 加载出金配置。`force=true` 会绕过本地缓存。 */
  async function loadConfig(force = false) {
    if (!force && config.value) return;
    loading.value = true;
    try {
      config.value = await withdrawalApi.fetchWithdrawalConfig();
    } finally {
      loading.value = false;
    }
  }

  /** 配置加载完成后自动更新的 USD 余额。 */
  const balance = computed(() => config.value?.balance);

  return {
    loading,
    config,
    loadConfig,
    balance,
  };
}
