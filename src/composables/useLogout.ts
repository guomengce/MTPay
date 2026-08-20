/**
 * 登出 Composable
 * - 服务端加入 Token 黑名单后清除本地登录态；
 * - 远程调用失败时仍应清除本地登录态，避免用户被困在已过期的会话中。
 */
import { ref } from 'vue';

import * as authApi from '@/api/modules/auth';
import { useAuthStore } from '@/stores/modules/auth';

export function useLogout() {
  const submitting = ref(false);
  const authStore = useAuthStore();

  /**
   * 退出登录：调用 `/web/agentLogout` 将 Token 拉黑，然后清空本地登录态。
   * 不抛出业务错误；调用方在 then 中按需跳转登录页。
   */
  async function submitLogout(): Promise<void> {
    if (submitting.value) return;
    submitting.value = true;
    try {
      await authApi.logout().catch(() => undefined);
    } finally {
      authStore.clearAuth();
      submitting.value = false;
    }
  }

  return {
    submitting,
    submitLogout,
  };
}
