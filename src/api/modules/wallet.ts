/**
 * 钱包模块
 * 余额查询、资金流水
 */
import request from '../request';
import type { ApiResponse, PageParams, PageResult } from '../types';

export interface WalletBalance {
  code: string;
  available: string;
  frozen: string;
  approx?: string;
  updatedAt: string;
}

export interface FlowItem {
  id: string;
  type: 'deposit' | 'withdrawal' | 'exchange';
  amount: string;
  balanceAfter: string;
  remark?: string;
  createdAt: string;
}

/** 余额列表 */
export function fetchBalances(): Promise<ApiResponse<WalletBalance[]>> {
  return request.get('/wallet/balances');
}

/** 资金流水 */
export function fetchFlows(
  params: PageParams,
): Promise<ApiResponse<PageResult<FlowItem>>> {
  return request.get('/wallet/flows', { params });
}
