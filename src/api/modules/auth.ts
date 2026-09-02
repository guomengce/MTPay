import type { LoginChallenge } from '@/utils/loginChallenge';
/**
 * 代理端账户认证模块
 * 负责：登录加密信封、登录、登出、激活、重置密码、查看个人资料。
 * 接口路径与返回字段以 `接口文档参数-代理端.md` 第 7.1 节为准。
 * 登录使用一次性 RSA 公钥 + AES-256-CBC 加密协议，详见 `src/utils/loginCrypto.ts`。
 */
import request from '../request';
import { createLoginEnvelope } from '@/utils/loginCrypto';

/* ---------- 类型：与后端字段保持一致 ---------- */

/**
 * 代理账户 Profile 字段，登录、激活、查看资料接口共用。
 */
export interface AgentProfile {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
  phone: string | null;
  safeheron_account_key: string | null;
  status: number;
  status_name: string;
  activated_at: string | null;
  last_login_at: string | null;
  crypto_enabled: boolean;
}

/**
 * 登录成功返回：包含 Profile 字段 + portal + token_version + token。
 * portal/token_version 仅登录时返回，查看资料接口不返回。
 */
export interface AgentLoginResult extends AgentProfile {
  portal: 'agent';
  token_version: number;
  token: string;
}

/* ---------- 接口：登录加密 ---------- */

/**
 * 获取登录一次性 RSA 公钥。
 * 该公钥约 1 分钟有效且为一次性，禁止在登录失败后复用。
 * 无需登录态。
 */
export function fetchLoginPublicKey() {
  return request.get<unknown, { public: string }>('/api/getPubKey');
}

/* ---------- 接口：账户认证 ---------- */

/**
 * 代理登录。
 * 提交前必须先调用 `fetchLoginPublicKey()`，并由 `createLoginEnvelope` 加密。
 * 只有状态 1 正常代理可以登录；连续密码错误可能触发临时锁定。
 * 成功后返回包含 Token 的 Profile，前端需保存 Token 供后续受保护接口使用。
 */
export function login(credentials: { email: string; password: string }) {
  const publicKey = fetchLoginPublicKey();
  return publicKey.then(({ public: publicKeyBody }) => {
    const envelope = createLoginEnvelope(publicKeyBody, credentials);
    return request.post<unknown, AgentLoginResult | LoginChallenge>('/web/agentLogin', envelope);
  });
}

/**
 * 退出登录：将当前 Token 加入黑名单。
 * 调用后无论服务端返回如何，前端都应清除本地登录态并跳转登录页。
 */
export function logout() {
  return request.post<unknown, void>('/web/agentLogout');
}

/**
 * 获取当前登录代理的资料。
 * 不基于 `user_id`，始终取自请求 Token。
 */
export function fetchAgentProfile() {
  return request.get<unknown, AgentProfile>('/web/getAgentProfile');
}

/**
 * 修改当前代理账户密码。
 * 修改成功后服务端会使当前及其他旧 Token 全部失效，调用方必须清理本地登录态并返回登录页。
 */
export function updateAgentPassword(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return request.post<unknown, []>('/web/updateAgentPassword', payload);
}

/**
 * 使用邮件激活链接中的一次性 Token 激活代理账户并设置初始密码。
 * 公开接口，无需登录；密码确认字段由后端校验。
 */
export function activateAgent(payload: {
  token: string;
  password: string;
  password_confirmation: string;
}) {
  return request.post<unknown, AgentProfile>('/web/activateAgent', payload);
}

/**
 * 使用密码重置邮件中的一次性 Token 设置新密码。
 * 公开接口；重置成功后该代理的全部旧 Token 失效。
 */
export function resetAgentPassword(payload: {
  token: string;
  password: string;
  password_confirmation: string;
}) {
  return request.post<unknown, AgentProfile>('/web/resetAgentPassword', payload);
}

/**
 * 申请找回代理密码。
 * 后端无论邮箱是否存在都会返回相同结果，前端不得据此提示账户是否存在。
 * 请求成功后仅提示用户检查邮箱中的密码重置链接。
 */
export function forgotAgentPassword(email: string) {
  return request.post<unknown, []>('/web/forgotAgentPassword', { email });
}

/** Public second login step; only this success grants a session after a challenge. */
export function verifyTwoFactorLogin(payload: { login_challenge: string; code: string }) {
  return request.post<unknown, AgentLoginResult>('/web/verifyTwoFactorLogin', payload);
}
