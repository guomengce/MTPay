/**
 * 账户与安全 Composable
 * 负责：个人资料、安全设置、密码修改
 */
import { ref } from 'vue';

import * as userApi from '@/api/modules/user';
import type { UserProfile } from '@/api/modules/user';

export function useAccount() {
  /* 状态 */
  const loading = ref(false);
  const submitting = ref(false);
  const profile = ref<UserProfile | null>(null);

  /* 方法 */
  async function fetchProfile() {
    loading.value = true;
    try {
      const res = await userApi.fetchProfile();
      profile.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(payload: Partial<UserProfile>) {
    submitting.value = true;
    try {
      const res = await userApi.updateProfile(payload);
      profile.value = res.data;
    } finally {
      submitting.value = false;
    }
  }

  async function changePassword(payload: {
    oldPassword: string;
    newPassword: string;
  }) {
    submitting.value = true;
    try {
      await userApi.changePassword(payload);
    } finally {
      submitting.value = false;
    }
  }

  return {
    loading,
    submitting,
    profile,
    fetchProfile,
    updateProfile,
    changePassword,
  };
}
