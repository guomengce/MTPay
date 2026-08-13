/**
 * 入金模块
 * 列表 / 详情 / 创建 / 提交审核
 */
import request from '../request';
import type { ApiResponse, PageParams, PageResult } from '../types';

export interface DepositItem {
  id: string;
  time: string;
  asset: string;
  network: string;
  txId: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  statusBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
}

export interface DepositDetail extends DepositItem {
  agent: string;
  submittedAt: string;
  chainInfo: { label: string; value: string; href?: string }[];
  timeline: { title: string; at?: string; status: 'done' | 'active' | 'pending'; description?: string }[];
  fundStages: { label: string; tone: 'pending' | 'success' | 'warning' | 'danger' }[];
}

export interface DepositFormPayload {
  asset: string;
  network: string;
  amount: string;
  txId: string;
}

/** 列表 */
export function fetchDepositList(
  params: PageParams,
): Promise<ApiResponse<PageResult<DepositItem>>> {
  return request.get('/deposit/list', { params });
}

/** 详情 */
export function fetchDepositDetail(id: string): Promise<ApiResponse<DepositDetail>> {
  return request.get(`/deposit/detail/${id}`);
}

/** 提交入金申请 */
export function submitDeposit(
  payload: DepositFormPayload,
): Promise<ApiResponse<DepositItem>> {
  return request.post('/deposit/create', payload);
}

/** 审核通过 */
export function approveDeposit(id: string): Promise<ApiResponse<null>> {
  return request.post(`/deposit/${id}/approve`);
}

/** 审核拒绝 */
export function rejectDeposit(
  id: string,
  reason: string,
): Promise<ApiResponse<null>> {
  return request.post(`/deposit/${id}/reject`, { reason });
}
