/**
 * 白名单卡片操作 Composable
 * - 只封装修改、删除、启停三类接口调用；
 * - 页面层负责弹窗确认、成功提示与列表刷新。
 */
import { ref } from 'vue';

import * as whitelistApi from '@/api/modules/whitelist';
import type { EditWhitelistPayload, WhitelistItemDetail } from '@/api/modules/whitelist';

export function useWhitelistActions() {
  const submitting = ref(false);

  async function edit(id: number, payload: Omit<EditWhitelistPayload, 'id'>): Promise<WhitelistItemDetail> {
    submitting.value = true;
    try {
      return await whitelistApi.editWhitelist({ id, ...payload });
    } finally {
      submitting.value = false;
    }
  }

  async function remove(id: number): Promise<void> {
    submitting.value = true;
    try {
      await whitelistApi.deleteWhitelist(id);
    } finally {
      submitting.value = false;
    }
  }

  async function updateStatus(id: number, status: 2 | 4): Promise<WhitelistItemDetail> {
    submitting.value = true;
    try {
      return await whitelistApi.editWhitelistStatus({ id, status });
    } finally {
      submitting.value = false;
    }
  }

  return {
    submitting,
    edit,
    remove,
    updateStatus,
  };
}

