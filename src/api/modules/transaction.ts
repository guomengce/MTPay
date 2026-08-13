/**
 * 交易记录模块
 * 全部交易的列表 / 导出
 */
import request from '../request';
import type { ApiResponse, PageParams, PageResult } from '../types';

export interface TransactionItem {
  id: string;
  time: string;
  type: 'deposit' | 'withdrawal' | 'exchange';
  typeBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
  content: string;
  amount: string;
  negative: boolean;
  status: string;
  statusBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
}

/** 列表 */
export function fetchTransactionList(
  params: PageParams,
): Promise<ApiResponse<PageResult<TransactionItem>>> {
  return request.get('/transaction/list', { params });
}

/** 导出 CSV */
export function exportTransactions(
  params: PageParams,
): Promise<ApiResponse<{ url: string }>> {
  return request.get('/transaction/export', { params, responseType: 'blob' });
}
