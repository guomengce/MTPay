/**
 * 白名单提交 Composable
 * - 仅提交已由上传控件取得的 file_ids，不在业务提交阶段上传文件；
 * - 成功后返回详情（含 review / records）；失败由统一请求层提示。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { SubmitWhitelistPayload, WhitelistItemDetail } from '@/api/modules/whitelist';

import { useWhitelistFiles } from './useWhitelistFiles';

export function useWhitelistForm() {
  const submitting = ref(false);
  const lastResult = ref<WhitelistItemDetail | null>(null);
  const files = useWhitelistFiles();

  /**
   * 提交白名单。组件层负责按 role+entity_type 组装业务字段；
   * files 数组会先逐个上传，再把收集到的 file_ids 提交。
   */
  async function submit(payload: SubmitWhitelistPayload): Promise<WhitelistItemDetail> {
    submitting.value = true;
    try {
      const detail = await whitelistApi.submitWhitelist(payload);
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
    uploading: files.uploading,
    lastResult,
    uploadFile: files.uploadFile,
    submit,
    clearLast,
  };
}
