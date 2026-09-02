import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '@/constants';
import type { UserInfo } from '@/types/user';
import { storage } from '@/utils/storage';
import { clearListQueryState } from '@/composables/useListQueryState';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(storage.get<string>(AUTH_TOKEN_KEY) || '');
  const userInfo = ref<UserInfo | null>(storage.get<UserInfo>(USER_INFO_KEY));
  const isLoggedIn = computed(() => Boolean(token.value));
  const profileReady = ref(false);
  const cryptoEnabled = computed(() => userInfo.value?.cryptoEnabled !== false);

  function setToken(value: string) {
    token.value = value;
    storage.set(AUTH_TOKEN_KEY, value);
  }

  function login(payload: { token: string; userInfo: UserInfo }) {
    clearListQueryState();
    setToken(payload.token);
    userInfo.value = payload.userInfo;
    storage.set(USER_INFO_KEY, payload.userInfo);
    profileReady.value = true;
  }

  function setUserInfo(value: UserInfo) {
    userInfo.value = value;
    storage.set(USER_INFO_KEY, value);
    profileReady.value = true;
  }

  function clearAuth() {
    clearListQueryState();
    token.value = '';
    userInfo.value = null;
    profileReady.value = false;
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(USER_INFO_KEY);
  }

  function logout() {
    clearAuth();
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    setUserInfo,
    logout,
    setToken,
    clearAuth,
    profileReady,
    cryptoEnabled,
  };
});
