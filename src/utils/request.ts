import { loginDestination } from '@/utils/loginDestination';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

import { appConfig } from '@/config';
import { i18n } from '@/locales';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

const request = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: 15000,
});

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    if (status === 401) {
      const authStore = useAuthStore();
      authStore.clearAuth();
      const redirect = loginDestination(router.currentRoute.value);
      await router.replace({ name: 'Login', query: redirect ? { redirect } : undefined });
      ElMessage.error(i18n.global.t('ui.sessionExpired'));
      return Promise.reject(error);
    }

    ElMessage.error(error.response?.data?.message || i18n.global.t('ui.requestRetry'));
    return Promise.reject(error);
  },
);

export default request;
