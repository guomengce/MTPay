/**
 * 出金模块
 * 列表 / 详情 / 提交出金 / 上下文中余额与手续费
 */
import request from '../request';
import type { ApiResponse, PageParams, PageResult } from '../types';

export interface WithdrawalItem {
  id: string;
  payer: string;
  payee: string;
  amount: string;
  total: string;
  status: 'pending' | 'reviewing' | 'completed' | 'rejected';
  statusBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
  time: string;
}

export interface WithdrawalDetail extends WithdrawalItem {
  contractUrl?: string;
  invoiceUrl?: string;
  submittedAt: string;
}

export interface WithdrawalContext {
  availableBalance: string;
  fee: string;
  minAmount: string;
}

export interface WithdrawalFormPayload {
  payer: string;
  payee: string;
  amount: string;
  contractUrl?: string;
  invoiceUrl?: string;
}

/** 列表 */
export function fetchWithdrawalList(
  params: PageParams,
): Promise<ApiResponse<PageResult<WithdrawalItem>>> {
  return request.get('/withdrawal/list', { params });
}

/** 详情 */
export function fetchWithdrawalDetail(id: string): Promise<ApiResponse<WithdrawalDetail>> {
  return request.get(`/withdrawal/detail/${id}`);
}

/** 余额 & 手续费上下文 */
export function fetchWithdrawalContext(): Promise<ApiResponse<WithdrawalContext>> {
  return request.get('/withdrawal/context');
}

/** 提交出金申请 */
export function submitWithdrawal(
  payload: WithdrawalFormPayload,
): Promise<ApiResponse<WithdrawalItem>> {
  return request.post('/withdrawal/create', payload);
}
