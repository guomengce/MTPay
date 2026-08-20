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
  currency: WithdrawalCurrency;
  balance: WithdrawalBalance;
  fee_amount: string;
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
  snapshot?: Record<string, unknown>;
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
  records: Array<Record<string, unknown>>;
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

export interface SubmitWithdrawalPayload {
  amount: string;
  payer_whitelist_id: number;
  payee_whitelist_id: number;
  file_ids?: number[];
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

/** 上传未绑定的出金证明文件，后续提交时传返回的 file_id。 */
export function uploadWithdrawalFile(formData: FormData) {
  return request.post<unknown, WithdrawalFile>('/web/uploadWithdrawalFile', formData);
}

/** 提交出金申请；手续费和总扣款由后端按固定配置计算。 */
export function submitWithdrawal(payload: SubmitWithdrawalPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/web/submitWithdrawal', payload);
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
  });
}

/** 下载私有附件。接口直接返回二进制内容。 */
export function downloadWithdrawalFile(fileId: number) {
  return request.get<unknown, AxiosResponse<Blob>>('/web/downloadWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
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
