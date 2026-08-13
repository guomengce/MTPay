/**
 * 兑换表单 Composable
 */
import { reactive, ref } from 'vue';

import * as exchangeApi from '@/api/modules/exchange';
import type { ExchangeFormPayload, ExchangeItem } from '@/api/modules/exchange';

export function useExchangeForm() {
  const submitting = ref(false);
  const lastResult = ref<ExchangeItem | null>(null);

  const form = reactive<ExchangeFormPayload>({
    asset: 'USDT',
    amount: '1000',
  });

  async function submit() {
    submitting.value = true;
    try {
      const res = await exchangeApi.submitExchange({ ...form });
      lastResult.value = res.data;
    } finally {
      submitting.value = false;
    }
  }

  function reset() {
    form.asset = 'USDT';
    form.amount = '1000';
  }

  return {
    submitting,
    lastResult,
    form,
    submit,
    reset,
  };
}
