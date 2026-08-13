/**
 * 仪表盘 Composable
 * 负责：概览数据、近期交易、待办事项
 */
import { ref } from 'vue';

import * as dashboardApi from '@/api/modules/dashboard';
import type { ApiResponse } from '@/api/types';
import type {
  DashboardOverview,
  DashboardTransaction,
} from '@/api/modules/dashboard';

/* 模块外常量：状态映射（避免在 template 里写复杂三元） */
export const TONE_MAP = {
  teal: { color: '#10aaa4' },
  blue: { color: '#2878ff' },
  green: { color: '#0aa39a' },
} as const;

export function useDashboard() {
  /* 状态 */
  const loading = ref(false);
  const overview = ref<DashboardOverview | null>(null);
  const transactions = ref<DashboardTransaction[]>([]);
  const pendingCount = ref(0);

  /* 方法 */
  async function fetchOverview() {
    loading.value = true;
    try {
      const res = await dashboardApi.fetchOverview();
      overview.value = res.data;
      pendingCount.value = res.data.pendingCount;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecentTransactions(limit = 5) {
    const res: ApiResponse<DashboardTransaction[]> =
      await dashboardApi.fetchRecentTransactions(limit);
    transactions.value = res.data;
  }

  async function refresh() {
    await Promise.all([fetchOverview(), fetchRecentTransactions()]);
  }

  return {
    loading,
    overview,
    transactions,
    pendingCount,
    fetchOverview,
    fetchRecentTransactions,
    refresh,
  };
}
