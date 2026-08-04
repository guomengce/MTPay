import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

import { appConfig } from '@/config';
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
      await router.replace({ name: 'Login' });
      ElMessage.error('登录状态已失效，请重新登录');
      return Promise.reject(error);
    }

    ElMessage.error(error.response?.data?.message || '请求失败，请稍后重试');
    return Promise.reject(error);
  },
);

export default request;
