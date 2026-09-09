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
import { i18n } from '@/locales';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';
import { useLocaleStore } from '@/stores/modules/locale';

const ACCEPT_LANGUAGE = {
  'en-US': 'en',
  'zh-CN': 'zh-CN',
  'zh-HK': 'zh-TW',
} as const;

/* ---------------- 类型 ---------------- */

/** 统一后端响应结构 */
export interface ApiEnvelope<T> {
  status: number | string;
  message: string;
  data: T;
}

/** 扩展 axios 配置：自定义透传字段 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 跳过全局错误提示 */
    silent?: boolean;
  }
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
const AUTH_EXPIRED_STATUSES = new Set([401, 50013, 50015, 50039]);
const PUBLIC_AUTH_PATHS = new Set([
  '/api/getPubKey', '/web/verifyTwoFactorLogin',
  '/web/agentLogin',
  '/web/activateAgent',
  '/web/forgotAgentPassword',
  '/web/resetAgentPassword',
]);
let sessionExpiredHandled = false;
let permissionRefreshPromise: Promise<void> | null = null;

/* ---------------- 请求拦截器 ---------------- */

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    const localeStore = useLocaleStore();
    config.headers.set('Accept-Language', ACCEPT_LANGUAGE[localeStore.locale]);
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
    if (businessStatus === 50012 && response.config.url !== '/web/getAgentProfile') {
      await handlePermissionChanged();
      return Promise.reject(new Error(payload.message || i18n.global.t('ui.permissionDenied')));
    }
    if (!response.config.silent) {
      ElMessage.error(payload.message || i18n.global.t('ui.requestFailed'));
    }
    return Promise.reject(new Error(payload.message || 'BizError'));
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    logRequestError(error);
    const status = error.response?.status;
    const businessStatus = Number(error.response?.data?.status);
    const message = error.response?.data?.message || error.message || i18n.global.t('ui.requestFailed');

    if (businessStatus === 50012 && !isPublicAuthRequest(error.config?.url)) {
      await handlePermissionChanged();
      return Promise.reject(error);
    }

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

/** 保留接口原始错误，便于区分前端超时、HTTP 错误和传输中断。 */
function logRequestError(error: AxiosError<ApiEnvelope<unknown>>) {
  console.error('[API request failed]', {
    method: error.config?.method?.toUpperCase(),
    url: error.config?.url,
    timeout: error.config?.timeout,
    code: error.code,
    httpStatus: error.response?.status,
    message: error.message,
    response: error.response?.data,
  }, error);
}

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
  ElMessage.error(i18n.global.t('ui.sessionExpired'));
  await router
    .replace({ name: 'Login', query: redirect ? { redirect } : undefined })
    .catch(() => undefined);
}

async function handlePermissionChanged() {
  if (!permissionRefreshPromise) permissionRefreshPromise = (async()=>{
    const authStore=useAuthStore();
    const { fetchAgentProfile } = await import('@/api/modules/auth');
    const result=await fetchAgentProfile();
    authStore.setUserInfo({id:String(result.id),name:result.company_name,role:'agent',agentCode:result.agent_code,companyName:result.company_name,email:result.email,phone:result.phone,status:result.status,statusName:result.status_name,activatedAt:result.activated_at,lastLoginAt:result.last_login_at,cryptoEnabled:Boolean(result.crypto_enabled)});
    if(router.currentRoute.value.meta?.cryptoOnly&&!authStore.cryptoEnabled)await router.replace('/dashboard');
  })().finally(()=>{permissionRefreshPromise=null});
  await permissionRefreshPromise;
}

export default request;
