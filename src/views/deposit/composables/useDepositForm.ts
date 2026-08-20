/**
 * 入金表单 Composable
 * - 选择通道 → 提交入金；
 * - 提交成功后返回详情，由调用方刷新列表或跳转；
 * - 通道选择会自动回填收款地址展示（仅 UI，提交时不携带地址，由后端校验）。
 */
import { ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type {
  DepositChannelItem,
  DepositOrderDetail,
  SubmitDepositPayload,
} from '@/api/modules/deposit';

export interface DepositFormState {
  currency_network_id: number | null;
  amount: string;
  txid: string;
}

export function useDepositForm() {
  const submitting = ref(false);
  const lastResult = ref<DepositOrderDetail | null>(null);
  const channels = ref<DepositChannelItem[]>([]);
  const channelsLoading = ref(false);

  /** 初次进入表单时拉取可用通道；通道为空时表单禁止提交。 */
  async function loadChannels(force = false) {
    if (!force && channels.value.length > 0) return;
    channelsLoading.value = true;
    try {
      channels.value = await depositApi.fetchDepositChannels();
      if (channels.value.length > 0) {
        const first = channels.value[0];
        // 不写入 form，仅用于 UI 提示；提交参数由 form 显式提供。
        first.currency_network_id;
      }
    } finally {
      channelsLoading.value = false;
    }
  }

  /**
   * 提交入金订单。
   * 校验币种/网络、txid 唯一性、金额 >0 全部由后端完成；失败时统一请求层会提示。
   */
  async function submit(payload: SubmitDepositPayload) {
    if (!payload.currency_network_id) throw new Error('请选择入金通道');
    submitting.value = true;
    try {
      const detail = await depositApi.submitDeposit(payload);
      lastResult.value = detail;
      return detail;
    } finally {
      submitting.value = false;
    }
  }

  /** 提交后清空结果，方便连续提交。 */
  function clearLast() {
    lastResult.value = null;
  }

  return {
    submitting,
    lastResult,
    channels,
    channelsLoading,
    loadChannels,
    submit,
    clearLast,
  };
}

export type { DepositChannelItem };