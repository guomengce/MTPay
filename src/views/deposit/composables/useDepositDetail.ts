/**
 * 入金详情 Composable
 * - 加载指定 id 的入金订单详情（公共字段 + 审核信息 + 时间线）；
 * - 详情中状态为后端快照，禁止在前端伪造状态值。
 */
import { ref } from 'vue';

import * as depositApi from '@/api/modules/deposit';
import type { DepositOrderDetail } from '@/api/modules/deposit';

export function useDepositDetail() {
  const loading = ref(false);
  const detail = ref<DepositOrderDetail | null>(null);

  /** 重新加载指定 id 的入金详情。 */
  async function fetchDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await depositApi.fetchDepositDetail(id);
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    detail.value = null;
  }

  return {
    loading,
    detail,
    fetchDetail,
    clear,
  };
}