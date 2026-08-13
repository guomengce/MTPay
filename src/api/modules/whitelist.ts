/**
 * 白名单模块
 * 列表 / 详情 / 新增 / 审核
 */
import request from '../request';
import type { ApiResponse, PageParams, PageResult } from '../types';

export interface WhitelistItem {
  id: string;
  avatar: string;
  name: string;
  role: string;
  type: string;
  region: string;
  status: 'pending' | 'approved' | 'rejected';
  statusBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
  tags: string[];
}

export interface WhitelistDetail extends WhitelistItem {
  submittedAt: string;
  reviewer?: string;
  reviewedAt?: string;
  remark?: string;
}

export interface WhitelistFormPayload {
  name: string;
  role: string;
  type: string;
  region: string;
  tags: string[];
}

/** 列表 */
export function fetchWhitelistList(
  params: PageParams,
): Promise<ApiResponse<PageResult<WhitelistItem>>> {
  return request.get('/whitelist/list', { params });
}

/** 详情 */
export function fetchWhitelistDetail(id: string): Promise<ApiResponse<WhitelistDetail>> {
  return request.get(`/whitelist/detail/${id}`);
}

/** 新增白名单 */
export function createWhitelistItem(
  payload: WhitelistFormPayload,
): Promise<ApiResponse<WhitelistItem>> {
  return request.post('/whitelist/create', payload);
}

/** 审核白名单 */
export function reviewWhitelistItem(
  id: string,
  payload: { approved: boolean; reason?: string },
): Promise<ApiResponse<null>> {
  return request.post(`/whitelist/${id}/review`, payload);
}
