/**
 * 白名单附件通用上传 Composable
 * - 用于提交表单与补件弹框的逐文件上传；
 * - 后端返回 file_id 后再回传业务提交接口，禁止上传后不绑定。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { WhitelistFile } from '@/api/modules/whitelist';

export function useWhitelistFiles() {
  const uploading = ref(false);

  /** 上传单个白名单文件，返回含 file_id 的文件对象。 */
  async function uploadFile(file: File): Promise<WhitelistFile> {
    uploading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await whitelistApi.uploadWhitelistFile(formData);
    } finally {
      uploading.value = false;
    }
  }

  return {
    uploading,
    uploadFile,
  };
}
