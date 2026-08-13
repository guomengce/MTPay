/**
 * 入金表单 Composable
 */
import { reactive, ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type { DepositFormPayload, DepositItem } from '@/api/modules/deposit';

export function useDepositForm() {
  /* 状态 */
  const submitting = ref(false);
  const lastResult = ref<DepositItem | null>(null);

  const form = reactive<DepositFormPayload>({
    asset: 'USDT',
    network: 'TRC20',
    amount: '',
    txId: '',
  });

  /* 方法 */
  async function submit() {
    submitting.value = true;
    try {
      const res = await depositApi.submitDeposit({ ...form });
      lastResult.value = res.data;
    } finally {
      submitting.value = false;
    }
  }

  function reset() {
    form.asset = 'USDT';
    form.network = 'TRC20';
    form.amount = '';
    form.txId = '';
  }

  return {
    submitting,
    lastResult,
    form,
    submit,
    reset,
  };
}
