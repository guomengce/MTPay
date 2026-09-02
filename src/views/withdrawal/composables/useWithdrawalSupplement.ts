/**
 * 法币出金补件 Composable
 * - 仅当订单 status=1（待补充文件）且 available_actions 允许时调用；
 * - 上传新附件并调用 `/web/supplementWithdrawal`，触发重新审核。
 */
import { ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';
import type {
  SupplementWithdrawalPayload,
  WithdrawalFile,
  WithdrawalOrderDetail,
} from '@/api/modules/withdrawal';

export function useWithdrawalSupplement() {
  const submitting = ref(false);
  const uploading = ref(false);
  const lastResult = ref<WithdrawalOrderDetail | null>(null);

  /** 上传补件文件。 */
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

  /** 提交补件。 */
  async function submit(payload: SupplementWithdrawalPayload) {
    submitting.value = true;
    try {
      const detail = await withdrawalApi.supplementWithdrawal(payload);
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
