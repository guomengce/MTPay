/**
 * 出金表单 Composable
 */
import { reactive, ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type {
  WithdrawalContext,
  WithdrawalFormPayload,
  WithdrawalItem,
} from '@/api/modules/withdrawal';

export function useWithdrawalForm() {
  const submitting = ref(false);
  const loading = ref(false);
  const context = ref<WithdrawalContext | null>(null);
  const lastResult = ref<WithdrawalItem | null>(null);

  const form = reactive<WithdrawalFormPayload>({
    payer: 'harbor',
    payee: 'northstar',
    amount: '5,000.00',
    contractUrl: '',
    invoiceUrl: '',
  });

  async function fetchContext() {
    loading.value = true;
    try {
      const res = await withdrawalApi.fetchWithdrawalContext();
      context.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function submit() {
    submitting.value = true;
    try {
      const res = await withdrawalApi.submitWithdrawal({ ...form });
      lastResult.value = res.data;
    } finally {
      submitting.value = false;
    }
  }

  function reset() {
    form.payer = 'harbor';
    form.payee = 'northstar';
    form.amount = '5,000.00';
    form.contractUrl = '';
    form.invoiceUrl = '';
  }

  return {
    submitting,
    loading,
    context,
    lastResult,
    form,
    fetchContext,
    submit,
    reset,
  };
}
