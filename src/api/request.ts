/**
 * 全局 axios 实例
 * - 统一 baseURL / timeout
 * - 请求拦截器：注入 token、统一 header
 * - 响应拦截器：拆包 data、统一错误处理、401 跳转登录
 */
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';

import { appConfig } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

/* ---------------- 类型 ---------------- */

/** 统一后端响应结构 */
export interface ApiEnvelope<T> {
  status: number | string;
  message: string;
  data: T;
}

/** 扩展 axios 配置：自定义透传字段 */
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /** 跳过全局错误提示 */
    silent?: boolean;
  }
}

/* ---------------- 实例 ---------------- */

const request = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/** 仅凭证失效才清理登录态；兼容 HTTP 401 与后端业务失效状态。 */
const AUTH_EXPIRED_STATUSES = new Set([401, 50013, 50039]);
const PUBLIC_AUTH_PATHS = new Set([
  '/api/getPubKey', '/web/verifyTwoFactorLogin',
  '/web/agentLogin',
  '/web/activateAgent',
  '/web/forgotAgentPassword',
  '/web/resetAgentPassword',
]);
let sessionExpiredHandled = false;

/* ---------------- 请求拦截器 ---------------- */

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token && !isPublicAuthRequest(config.url)) {
      sessionExpiredHandled = false;
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    // FormData 上传：移除默认 JSON 头，交由浏览器生成 multipart（含 boundary）。
    // 否则 axios 会把 FormData 序列化成 {"file":{"uid":...}} 发送。
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type');
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ---------------- 响应拦截器 ---------------- */

request.interceptors.response.use(
  async (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    const refreshedToken = response.headers.authorization;
    if (refreshedToken && !isPublicAuthRequest(response.config.url)) {
      useAuthStore().setToken(refreshedToken.replace(/^Bearer\s+/i, ''));
    }
    const payload = response.data;
    // 非标准结构（如文件下载）直接放行
    if (payload === null || typeof payload !== 'object' || !('status' in payload)) {
      return response;
    }
    const businessStatus = Number(payload.status);
    if (businessStatus === 200) {
      return payload.data as unknown as AxiosResponse;
    }
    if (
      AUTH_EXPIRED_STATUSES.has(businessStatus) &&
      !isPublicAuthRequest(response.config.url)
    ) {
      await handleSessionExpired();
      return Promise.reject(new Error(payload.message || 'Unauthorized'));
    }
    if (!response.config.silent) {
      ElMessage.error(payload.message || '请求失败');
    }
    return Promise.reject(new Error(payload.message || 'BizError'));
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || '请求失败';

    if (status && AUTH_EXPIRED_STATUSES.has(status) && !isPublicAuthRequest(error.config?.url)) {
      await handleSessionExpired();
      return Promise.reject(error);
    }

    if (!error.config?.silent) {
      ElMessage.error(message);
    }
    return Promise.reject(error);
  },
);

function isPublicAuthRequest(url?: string) {
  return Boolean(url && PUBLIC_AUTH_PATHS.has(url.split('?')[0]));
}

/** 并发请求同时收到 401 时，只清理和跳转一次。 */
async function handleSessionExpired() {
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;

  const authStore = useAuthStore();
  const currentRoute = router.currentRoute.value;
  const redirect = currentRoute.name === 'Login' ? undefined : currentRoute.fullPath;

  authStore.clearAuth();
  ElMessage.error('登錄狀態已失效，請重新登錄');
  await router
    .replace({ name: 'Login', query: redirect ? { redirect } : undefined })
    .catch(() => undefined);
}

export default request;
