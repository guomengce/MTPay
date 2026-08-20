/**
 * 出金表单 Composable
 * - 上传附件、提交出金；
 * - 付款人、收款人必须来自配置接口；
 * - 提交参数中的 file_ids 来自文件上传接口，手续费只读取后端固定配置。
 */
import { ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type {
  SubmitWithdrawalPayload,
  WithdrawalFile,
  WithdrawalOrderDetail,
} from '@/api/modules/withdrawal';

export function useWithdrawalForm() {
  const submitting = ref(false);
  const uploading = ref(false);
  const lastResult = ref<WithdrawalOrderDetail | null>(null);

  /**
   * 上传出金证明文件。
   * 后端返回文件元数据，前端收集 file_id 后再提交订单。
   */
  async function uploadFile(file: File): Promise<WithdrawalFile> {
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await withdrawalApi.uploadWithdrawalFile(formData);
    } finally {
      uploading.value = false;
    }
  }

  /**
   * 提交出金订单。
   * 后端校验白名单归属、余额和文件规则，并计算手续费及实际冻结金额。
   */
  async function submit(payload: SubmitWithdrawalPayload) {
    submitting.value = true;
    try {
      const detail = await withdrawalApi.submitWithdrawal(payload);
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
    uploading,
    lastResult,
    uploadFile,
    submit,
    clearLast,
  };
}
