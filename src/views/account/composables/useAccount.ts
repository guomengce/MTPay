/**
 * 账户与安全 Composable
 * 负责：读取代理资料、同步登录用户信息、修改密码后的会话清理与跳转。
 */
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import * as authApi from '@/api/modules/auth';
import type { AgentProfile } from '@/api/modules/auth';
import { useAuthStore } from '@/stores/modules/auth';

export function useAccount() {
  /* 状态 */
  const loading = ref(false);
  const submitting = ref(false);
  const profile = ref<AgentProfile | null>(null);
  const authStore = useAuthStore();
  const router = useRouter();

  /* ---------- 账户资料 ---------- */
  async function fetchProfile() {
    loading.value = true;
    try {
      const result = await authApi.fetchAgentProfile();
      profile.value = result;
      authStore.setUserInfo({
        id: String(result.id),
        name: result.company_name,
        role: 'agent',
        agentCode: result.agent_code,
        companyName: result.company_name,
        email: result.email,
        phone: result.phone,
        status: result.status,
        statusName: result.status_name,
        activatedAt: result.activated_at,
        lastLoginAt: result.last_login_at,
      });
    } finally {
      loading.value = false;
    }
  }

  /* ---------- 修改密码 ---------- */
  async function changePassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    submitting.value = true;
    try {
      await authApi.updateAgentPassword(payload);
      ElMessage.success('密码修改成功，请使用新密码重新登录');
      authStore.clearAuth();
      await router.replace({ name: 'Login' });
    } finally {
      submitting.value = false;
    }
  }

  return {
    loading,
    submitting,
    profile,
    fetchProfile,
    changePassword,
  };
}
