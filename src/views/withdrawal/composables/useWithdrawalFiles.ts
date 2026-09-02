/**
 * 法币出金附件查看 Composable
 * - 调用预览/下载接口拿到临时 URL，前端直接打开或触发 a[download]；
 * - 禁止在前端读取附件 blob 再保存到本地。
 */
import { ref } from 'vue';

import * as withdrawalApi from '@/api/modules/withdrawal';

export function useWithdrawalFiles() {
  const loading = ref(false);

  /** 取附件预览 URL（新窗口打开）。 */
  async function openPreview(id: number) {
    loading.value = true;
    try {
      const response = await withdrawalApi.previewWithdrawalFile(id);
      const url = URL.createObjectURL(response.data);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      loading.value = false;
    }
  }

  /** 取附件下载 URL（构造 anchor 下载）。 */
  async function triggerDownload(id: number) {
    loading.value = true;
    try {
      const response = await withdrawalApi.downloadWithdrawalFile(id);
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
