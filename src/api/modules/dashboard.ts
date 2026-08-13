/**
 * 仪表盘模块
 * 余额、概览、近期交易、快捷操作
 */
import request from '../request';
import type { ApiResponse, PageResult } from '../types';

export interface BalanceItem {
  code: string;
  title: string;
  amount: string;
  approx?: string;
  frozen: string;
  tone: 'teal' | 'blue' | 'green';
}

export interface DashboardOverview {
  totalBalance: string;
  pendingCount: number;
  pendingDelta: number;
  balances: BalanceItem[];
}

export interface DashboardTransaction {
  id: string;
  date: string;
  time: string;
  type: string;
  typeTone: 'deposit' | 'withdrawal' | 'exchange';
  content: string;
  amount: string;
  amountTone: 'neutral' | 'plus' | 'minus';
  status: string;
  statusBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
}

/** 概览数据 */
export function fetchOverview(): Promise<ApiResponse<DashboardOverview>> {
  return request.get('/dashboard/overview');
}

/** 近期交易 */
export function fetchRecentTransactions(
  limit = 5,
): Promise<ApiResponse<DashboardTransaction[]>> {
  return request.get('/dashboard/recent-transactions', { params: { limit } });
}

/** 分页查询仪表盘列表（保留扩展） */
export function fetchDashboardList(params: {
  page: number;
  pageSize: number;
}): Promise<ApiResponse<PageResult<DashboardTransaction>>> {
  return request.get('/dashboard/list', { params });
}
