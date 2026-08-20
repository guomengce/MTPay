/**
 * 白名单补件 Composable
 * - 仅在详情 status=1（待补充文件）时显示并调用；
 * - 上传新一轮附件得到 file_id，再调用 /web/supplementWhitelist 提交补件。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';

import { useWhitelistFiles } from './useWhitelistFiles';

export function useWhitelistSupplement() {
  const submitting = ref(false);
  const lastResult = ref<WhitelistItemDetail | null>(null);
  const files = useWhitelistFiles();

  /**
   * 上传补件附件并提交。补件必须传 1～5 个 file_id；附件按逐个上传顺序绑定。
   */
  async function submit(
    id: number,
    attachments: File[],
    message?: string,
  ): Promise<WhitelistItemDetail> {
    submitting.value = true;
    try {
      const fileIds = await files.uploadFiles(attachments);
      const detail = await whitelistApi.supplementWhitelist({
        id,
        file_ids: fileIds,
        message,
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
