/**
 * 兑换模块
 * 列表 / 详情 / 兑换比例 / 提交兑换
 */
import request from '../request';
import type { ApiResponse, PageParams, PageResult } from '../types';

export interface ExchangeItem {
  id: string;
  time: string;
  asset: string;
  rate: string;
  usd: string;
  status: 'pending' | 'completed' | 'failed';
  statusBadge: 'primary' | 'warning' | 'success' | 'danger' | 'gray';
}

export interface ExchangeDetail extends ExchangeItem {
  beforeAmount: string;
  afterAmount: string;
  fee: string;
  submittedAt: string;
}

export interface ExchangeRate {
  pair: string;
  value: string;
  sample: string;
  mark: string;
}

export interface ExchangeFormPayload {
  asset: string;
  amount: string;
}

/** 列表 */
export function fetchExchangeList(
  params: PageParams,
): Promise<ApiResponse<PageResult<ExchangeItem>>> {
  return request.get('/exchange/list', { params });
}

/** 详情 */
export function fetchExchangeDetail(id: string): Promise<ApiResponse<ExchangeDetail>> {
  return request.get(`/exchange/detail/${id}`);
}

/** 当前兑换比例 */
export function fetchExchangeRates(): Promise<ApiResponse<ExchangeRate[]>> {
  return request.get('/exchange/rates');
}

/** 提交兑换申请 */
export function submitExchange(
  payload: ExchangeFormPayload,
): Promise<ApiResponse<ExchangeItem>> {
  return request.post('/exchange/create', payload);
}
