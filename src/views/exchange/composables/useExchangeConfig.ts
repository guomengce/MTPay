/**
 * 兑换配置 Composable
 * - 获取余额、来源币种汇率；表单初始进入时调用；
 * - 页面只展示后端下发的余额与汇率，不在前端推导目标金额；
 * - 后端按当前 Token 识别代理，不传 user_id。
 */
import { ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeConfig } from '@/api/modules/exchange';

export function useExchangeConfig() {
  const loading = ref(false);
  const config = ref<ExchangeConfig | null>(null);

  /** 重新拉取当前代理的兑换配置。 */
  async function loadConfig(force = false) {
    if (!force && config.value) return;
    loading.value = true;
    try {
      config.value = await exchangeApi.fetchExchangeConfig();
    } finally {
      loading.value = false;
    }
  }

  /** 查找某个来源币种的可读余额。 */
  function findBalance(currencyCode: string) {
    if (!config.value) return undefined;
    return config.value.balances.find((b) => b.currency.code === currencyCode);
  }

  /** 查找某个来源币种的有效汇率；后端未返回时为空对象。 */
  function findRate(currencyCode: string) {
    return config.value?.rates?.[currencyCode];
  }

  return {
    loading,
    config,
    loadConfig,
    findBalance,
    findRate,
  };
}
