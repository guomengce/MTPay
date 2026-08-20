/**
 * 兑换表单 Composable
 * - 提交来源币种 + amount；后端返回最新详情（含真实汇率快照）；
 * - 前端不计算目标金额，只展示后端返回的 target_amount。
 */
import { ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeOrderDetail, SubmitExchangePayload } from '@/api/modules/exchange';

export function useExchangeForm() {
  const submitting = ref(false);
  const lastResult = ref<ExchangeOrderDetail | null>(null);

  /**
   * 提交兑换订单；后端返回详情（含真实汇率/目标金额）。
   * 校验 amount >0、来源币种合法、可用余额充足均由后端完成。
   */
  async function submit(payload: SubmitExchangePayload) {
    submitting.value = true;
    try {
      const detail = await exchangeApi.submitExchange(payload);
      lastResult.value = detail;
      return detail;
    } finally {
      submitting.value = false;
    }
  }

  function clearLast() {
    lastResult.value = null;
  }

  return {
    submitting,
    lastResult,
    submit,
    clearLast,
  };
}
