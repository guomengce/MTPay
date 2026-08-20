/**
 * 白名单附件预览/下载 Composable
 * - 调用 Blob 接口获取临时 URL；
 * - 预览使用 window.open 弹出新窗口，下载使用 anchor[download]；
 * - 必须在使用完后 revokeObjectURL 释放对象 URL。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';

export function useWhitelistPreview() {
  const loading = ref(false);

  /** 在新窗口预览白名单附件。 */
  async function openPreview(fileId: number) {
    loading.value = true;
    try {
      const response = await whitelistApi.previewWhitelistFile(fileId);
      const url = URL.createObjectURL(response.data);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      loading.value = false;
    }
  }

  /** 触发浏览器下载白名单附件，文件名优先取响应头。 */
  async function triggerDownload(fileId: number) {
    loading.value = true;
    try {
      const response = await whitelistApi.downloadWhitelistFile(fileId);
      const url = URL.createObjectURL(response.data);
      const disposition = response.headers['content-disposition'];
      const filename = disposition?.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)/i)?.[1];
      const a = document.createElement('a');
      a.href = url;
      a.download = filename ? decodeURIComponent(filename) : 'attachment';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    openPreview,
    triggerDownload,
  };
}
