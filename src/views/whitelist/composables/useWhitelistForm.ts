/**
 * 白名单提交 Composable
 * - 先上传附件拿到 file_id，再调用 /web/submitWhitelist 绑定 file_ids；
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
  async function submit(
    payload: SubmitWhitelistPayload,
    attachments: File[] = [],
  ): Promise<WhitelistItemDetail> {
    submitting.value = true;
    try {
      let fileIds = payload.file_ids ?? [];
      if (attachments.length > 0) {
        const uploaded = await files.uploadFiles(attachments);
        fileIds = [...fileIds, ...uploaded];
      }
      const detail = await whitelistApi.submitWhitelist({
        ...payload,
        file_ids: fileIds.length > 0 ? fileIds : undefined,
      });
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
