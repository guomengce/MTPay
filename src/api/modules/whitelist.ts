/**
 * 代理端白名单模块
 * 字段与状态枚举以《接口文档参数-代理端.md》第 5.9 节和 7.7 节为准。
 * - role：1 付款人 / 2 收款人；
 * - entity_type：1 公司 / 2 个人；
 * - status：0 待审核 / 1 待补充文件 / 2 已通过 / 3 已驳回；
 * - 所有接口按 Token 识别代理，不传 user_id；
 * - 文件上传后保存元数据，提交/补件再绑定 file_ids，最多 5 个且不能重复。
 */
import type { AxiosResponse } from 'axios';

import request from '../request';

/* ---------- 公共对象 ---------- */

/** 列表/详情中的所属代理信息。 */
export interface WhitelistUser {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
}

/** 上传成功后的文件元数据；提交/补件时按 file_ids 绑定。 */
export interface WhitelistFile {
  file_id: number;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
}

/** 审核记录，出现在详情 records 字段。 */
export interface WhitelistReviewRecord {
  id: number;
  action_type: number;
  action_name: string;
  actor_type: number;
  actor_type_name: string;
  actor_id: number | null;
  actor_name: string | null;
  message: string | null;
  files: WhitelistFile[];
  created_at: string | null;
}

/** 列表公共字段。 */
export interface WhitelistItem {
  id: number;
  whitelist_no: string;
  user: WhitelistUser;
  role: 1 | 2;
  role_name: string;
  entity_type: 1 | 2;
  entity_type_name: string;
  subject_name: string;
  country: string;
  status: 0 | 1 | 2 | 3;
  status_name: string;
  file_count: number;
  submitted_at: string | null;
  updated_at: string | null;
}

/** 详情在列表字段上额外返回 business_data / review / records。 */
export interface WhitelistItemDetail extends WhitelistItem {
  business_data: Record<string, unknown>;
  review: {
    admin_id: number | null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
  };
  records: WhitelistReviewRecord[];
}

/* ---------- 请求参数 ---------- */

/** 白名单列表查询参数。 */
export interface WhitelistListParams {
  page?: number;
  limit?: number;
  /** 1 付款人 / 2 收款人。 */
  role?: 1 | 2;
  /** 1 公司 / 2 个人。 */
  entity_type?: 1 | 2;
}

/** 提交白名单参数。role + entity_type 决定后续条件字段；file_ids 可选，最多 5 个。 */
export interface SubmitWhitelistPayload {
  role: 1 | 2;
  entity_type: 1 | 2;
  file_ids?: number[];
  // 付款人公司
  company_name?: string;
  registration_country?: string;
  operating_country?: string;
  city?: string;
  address?: string;
  registration_date?: string;
  company_type?: 1 | 2;
  document_no?: string;
  // 付款人个人
  given_name?: string;
  surname?: string;
  nationality?: string;
  residence_country?: string;
  birth_date?: string;
  document_type?: 1 | 2;
  // 收款人公司/个人
  bank_name?: string;
  bank_account?: string;
  swift?: string;
  intermediary_swift?: string;
  remittance_purpose?: number;
  remark?: string;
}

/** 补件参数；file_ids 必填 1～5 个，message 可选；仅 status=1 可用。 */
export interface SupplementWhitelistPayload {
  id: number;
  file_ids: number[];
  message?: string;
}

/* ---------- 分页类型 ---------- */

/** Laravel 分页响应结构。 */
export interface WhitelistPageResult {
  current_page: number;
  data: WhitelistItem[];
  first_page_url?: string;
  from?: number | null;
  last_page: number;
  last_page_url?: string;
  next_page_url?: string | null;
  path?: string;
  per_page: number;
  prev_page_url?: string | null;
  to?: number | null;
  total: number;
}

/* ---------- 接口 ---------- */

/**
 * 上传白名单附件。允许 PDF/PNG/JPG/JPEG，单文件 10MB，返回未绑定的文件元数据。
 * 提交或补件时需要把返回的 file_id 通过 file_ids 数组再绑定。
 */
export function uploadWhitelistFile(formData: FormData) {
  return request.post<unknown, WhitelistFile>('/web/uploadWhitelistFile', formData, {
    // 必须覆盖 request 实例默认的 application/json，否则 FormData 会被序列化成 { file: { uid } }。
    // 浏览器会为 multipart/form-data 自动补充 boundary，并以二进制文件流发送 file 字段。
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 提交白名单申请。后端按 role + entity_type 校验条件字段并落库；file_ids 可选。
 * 成功后返回完整详情（含 review 初始态和 records）。
 */
export function submitWhitelist(payload: SubmitWhitelistPayload) {
  return request.post<unknown, WhitelistItemDetail>('/web/submitWhitelist', payload);
}

/**
 * 当前代理的白名单分页列表。
 */
export function fetchWhitelistList(params: WhitelistListParams = {}) {
  return request.get<unknown, WhitelistPageResult>('/web/getWhitelistList', { params });
}

/** 查询当前代理的一笔白名单详情。 */
export function fetchWhitelistDetail(id: number) {
  return request.get<unknown, WhitelistItemDetail>('/web/getWhitelistInfo', { params: { id } });
}

/**
 * 待补件状态下提交新一轮文件。后端重新进入待审核；返回更新后的详情。
 * 文档明确该接口仅 status=1 时可用，前端按状态控制按钮可见性。
 */
export function supplementWhitelist(payload: SupplementWhitelistPayload) {
  return request.post<unknown, WhitelistItemDetail>('/web/supplementWhitelist', payload);
}

/** 预览私有附件；接口返回二进制流，需配合 Blob URL 使用。 */
export function previewWhitelistFile(fileId: number) {
  return request.get<unknown, AxiosResponse<Blob>>('/web/previewWhitelistFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
  });
}

/** 下载私有附件；接口返回二进制流，需配合 Blob URL 与 anchor 下载。 */
export function downloadWhitelistFile(fileId: number) {
  return request.get<unknown, AxiosResponse<Blob>>('/web/downloadWhitelistFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
  });
}
