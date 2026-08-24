/**
 * 代理端统一交易记录
 * -----------------------------------------------------------------------------
 * 聚合入金、兑换、出金三类订单；列表与详情均只读。
 * 代理端根据 Token 识别身份，不传 user_id / keyword。
 */
import request from '../request';
import type { DepositOrderDetail } from './deposit';
import type { ExchangeOrderDetail } from './exchange';
import type { WithdrawalOrderDetail } from './withdrawal';

export type TransactionBusinessType = 'deposit' | 'exchange' | 'withdrawal';

export interface TransactionUserRef {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
}

export interface TransactionItem {
  transaction_key: string;
  business_type: TransactionBusinessType;
  business_name: string;
  id: number;
  business_id: number;
  order_no: string;
  user: TransactionUserRef;
  currency_code: string;
  network_code: string | null;
  amount: string;
  target_currency_code: string | null;
  target_amount: string | null;
  exchange_rate: string | null;
  fee_amount: string | null;
  total_amount: string | null;
  payer_name: string | null;
  payee_name: string | null;
  /** 后端补充后用于统一交易列表展示主体类别；旧接口可能不返回。 */
  payer_entity_type?: 1 | 2 | null;
  payer_entity_type_name?: string | null;
  payee_entity_type?: 1 | 2 | null;
  payee_entity_type_name?: string | null;
  status: number;
  status_name: string;
  status_group: string;
  status_group_name: string;
  submitted_at: string | null;
  completed_at: string | null;
  finished_at: string | null;
  detail_type: TransactionBusinessType;
  detail_id: number;
}

export interface TransactionListParams {
  business_type?: TransactionBusinessType;
  status_group?: string;
  currency_code?: string;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page?: number;
  limit?: number;
}

export interface TransactionPageResult {
  current_page: number;
  data: TransactionItem[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface TransactionInfoResult {
  transaction: TransactionItem;
  detail: DepositOrderDetail | ExchangeOrderDetail | WithdrawalOrderDetail;
}

/** 当前代理的统一交易分页列表。 */
export function fetchTransactionList(params: TransactionListParams = {}) {
  return request.get<unknown, TransactionPageResult>('/web/getTransactionList', { params });
}

/** 统一交易详情（只读）。 */
export function fetchTransactionInfo(payload: {
  business_type: TransactionBusinessType;
  business_id: number;
}) {
  return request.get<unknown, TransactionInfoResult>('/web/getTransactionInfo', {
    params: payload,
  });
}
