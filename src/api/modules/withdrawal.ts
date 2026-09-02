/**
 * 代理端 USD 出金模块。
 * 所有业务接口均根据 Token 识别代理，不传 user_id；金额保持十进制字符串。
 */
import type { AxiosResponse } from 'axios';

import request from '../request';

/* ---------- 公共对象 ---------- */

export interface WithdrawalCurrency {
  id: number;
  code: string;
  name: string;
  decimal_places: number;
}

export interface WithdrawalBalance {
  available_balance: string;
  frozen_balance: string;
  total_balance: string;
}

export interface WithdrawalWhitelistOption {
  id: number;
  whitelist_no: string;
  role: 1 | 2;
  entity_type: 1 | 2;
  entity_type_name: string;
  subject_name: string;
  business_data: Record<string, unknown>;
}

export interface WithdrawalFileRules {
  initial_required: boolean;
  max_files_per_round: number;
  max_file_size_mb: number;
  allowed_extensions: string[];
  unbound_expire_hours: number;
}

export interface WithdrawalConfig {
  /** 新版接口返回多币种配置；兼容旧版单币种字段。 */
  currencies?: Array<
    | (WithdrawalCurrency & { balance?: WithdrawalBalance; fee_amount?: string })
    | { currency: WithdrawalCurrency; balance: WithdrawalBalance; fee_amount: string }
  >;
  currency?: WithdrawalCurrency;
  balance?: WithdrawalBalance;
  fee_amount?: string;
  payers: WithdrawalWhitelistOption[];
  payees: WithdrawalWhitelistOption[];
  file_rules: WithdrawalFileRules;
}

export interface WithdrawalFile {
  file_id: number;
  file_type?: number;
  file_type_name?: string;
  uploader_type?: number;
  uploader_name?: string;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  bound_at?: string | null;
}

export interface WithdrawalPartySummary {
  whitelist_id: number;
  whitelist_no: string;
  entity_type: 1 | 2;
  name: string;
  /** 新版详情可能直接携带主体资料。 */
  data?: Record<string, unknown>;
  snapshot?: Record<string, unknown>;
}

/** 出金处理记录；文件只属于产生它的操作节点。 */
export interface WithdrawalRecord {
  id: number;
  action_type: number;
  action_name: string;
  actor_type: number;
  actor_id: number | null;
  actor_name: string | null;
  message: string | null;
  files: WithdrawalFile[];
  created_at: string | null;
}

export type WithdrawalStatus = 0 | 1 | 2 | 3 | 4 | 5;

export interface WithdrawalOrder {
  id: number;
  order_no: string;
  user: { id: number; agent_code: string; company_name: string; email: string };
  currency: WithdrawalCurrency;
  amount: string;
  fee_amount: string;
  total_amount: string;
  payer: WithdrawalPartySummary;
  payee: WithdrawalPartySummary;
  status: WithdrawalStatus;
  status_name: string;
  application_file_count: number;
  payment_file_count: number;
  submitted_at: string | null;
  updated_at: string | null;
}

export interface WithdrawalOrderDetail extends WithdrawalOrder {
  review: {
    admin_id: number | null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
  };
  payment: {
    admin_id: number | null;
    admin_name: string | null;
    failure_reason: string | null;
    processing_at: string | null;
    completed_at: string | null;
    failed_at: string | null;
  };
  fund_times: { frozen_at: string | null; released_at: string | null; rejected_at: string | null };
  application_files: WithdrawalFile[];
  payment_files: WithdrawalFile[];
  records: WithdrawalRecord[];
  available_actions: {
    agent_can_supplement: boolean;
    admin_can_request_supplement: boolean;
    admin_can_approve: boolean;
    admin_can_reject: boolean;
    admin_can_process_payment: boolean;
    admin_can_append_payment_files: boolean;
    payment_retry_allowed: boolean;
  };
}

/* ---------- 请求参数 ---------- */

export interface WithdrawalListParams {
  status?: WithdrawalStatus;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page?: number;
  limit?: number;
}

export interface WithdrawalDraft {
  currency_id: number;
  amount: string;
  payer_whitelist_id: number;
  payee_whitelist_id: number;
  file_ids: number[];
}

export interface SubmitWithdrawalPayload extends WithdrawalDraft { security_challenge: string }
export interface WithdrawalSecurityChallenge { security_challenge: string; expires_at: string; email: string }

function toWithdrawalFormData<T extends object>(payload: T) {
  const form = new FormData();
  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => form.append(`${key}[${index}]`, String(item)));
      return;
    }
    form.append(key, String(value));
  });
  return form;
}

// FRONTEND_AI_API_DOCUMENT(2).md §8.7: every verification uses the unchanged draft.
export function createWithdrawalSecurityChallenge(payload: WithdrawalDraft) {
  return request.post<unknown, WithdrawalSecurityChallenge>('/web/createWithdrawalSecurityChallenge', toWithdrawalFormData(payload));
}
export function sendWithdrawalEmailCode(payload: SubmitWithdrawalPayload) {
  return request.post<unknown, { expires_in: number }>('/web/sendWithdrawalEmailCode', toWithdrawalFormData(payload));
}
export function verifyWithdrawalEmailCode(payload: SubmitWithdrawalPayload & { email_code: string }) {
  return request.post<unknown, { email_verified: boolean }>('/web/verifyWithdrawalEmailCode', toWithdrawalFormData(payload));
}
export function verifyWithdrawalTwoFactor(payload: SubmitWithdrawalPayload & { code: string }) {
  return request.post<unknown, { two_factor_verified: boolean }>('/web/verifyWithdrawalTwoFactor', toWithdrawalFormData(payload));
}
export function cancelWithdrawalSecurityChallenge(security_challenge: string) {
  return request.post<unknown, []>('/web/cancelWithdrawalSecurityChallenge', toWithdrawalFormData({ security_challenge }));
}
export interface SupplementWithdrawalPayload {
  id: number;
  file_ids: number[];
  message?: string;
}

/* ---------- 真实接口 ---------- */

/** 获取 USD 余额、固定手续费、付款人/收款人选项及文件规则。 */
export function fetchWithdrawalConfig() {
  return request.get<unknown, WithdrawalConfig>('/web/getWithdrawalConfig');
}

export interface WithdrawalCurrencyOption {
  currency: WithdrawalCurrency;
  balance: WithdrawalBalance;
  fee_amount: string;
}

/** 将新版多币种配置与旧版单币种配置统一为表单选项。 */
export function normalizeWithdrawalCurrencyOptions(config: WithdrawalConfig | null | undefined) {
  if (!config) return [] as WithdrawalCurrencyOption[];
  const options = (config.currencies ?? []).map((entry) => {
    if ('currency' in entry) return entry;
    return { currency: entry, balance: entry.balance, fee_amount: entry.fee_amount };
  }).filter((entry): entry is WithdrawalCurrencyOption => Boolean(entry.balance && entry.fee_amount !== undefined));
  if (options.length) return options;
  return config.currency && config.balance && config.fee_amount !== undefined
    ? [{ currency: config.currency, balance: config.balance, fee_amount: config.fee_amount }]
    : [];
}

/** 上传未绑定的出金证明文件，后续提交时传返回的 file_id。 */
export function uploadWithdrawalFile(formData: FormData) {
  return request.post<unknown, WithdrawalFile>('/web/uploadWithdrawalFile', formData);
}

/** 提交出金申请；手续费和总扣款由后端按固定配置计算。 */
export function submitWithdrawal(payload: SubmitWithdrawalPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/web/submitWithdrawal', toWithdrawalFormData(payload));
}

/** 查询当前代理的出金订单分页列表。 */
export function fetchWithdrawalList(params: WithdrawalListParams = {}) {
  return request.get<unknown, WithdrawalPageResult>('/web/getWithdrawalList', { params });
}

/** 查询当前代理的一笔出金详情。 */
export function fetchWithdrawalDetail(id: number) {
  return request.get<unknown, WithdrawalOrderDetail>('/web/getWithdrawalInfo', { params: { id } });
}

/** 待补件订单提交新一轮文件。 */
export function supplementWithdrawal(payload: SupplementWithdrawalPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/web/supplementWithdrawal', payload);
}

/** 预览私有附件。接口直接返回二进制内容。 */
export function previewWithdrawalFile(fileId: number) {
  return request.get<unknown, AxiosResponse<Blob>>('/web/previewWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
  });
}

/** 下载私有附件。接口直接返回二进制内容。 */
export function downloadWithdrawalFile(fileId: number) {
  return request.get<unknown, AxiosResponse<Blob>>('/web/downloadWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
  });
}

export interface WithdrawalPageResult {
  current_page: number;
  data: WithdrawalOrder[];
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}
