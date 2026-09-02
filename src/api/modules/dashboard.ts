/**
 * 业务总览模块
 * - 仅调用 /web/getAgentAssetOverview 一次获取余额、待办、汇率与近期交易；
 * - 近期交易 recent_orders 与统一交易记录共用 TransactionItem 结构。
 */
import request from '../request';
import type { TransactionItem } from './transaction';

export interface AssetBalance {
  currency: { id: number; code: string; name: string; decimal_places: number };
  available_balance: string;
  frozen_balance: string;
  total_balance: string;
}

export interface EffectiveRate {
  source_currency: { id: number; code: string; name: string };
  target_currency: { id: number; code: string; name: string };
  rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
}

export interface AssetOverview {
  user: {
    id: number;
    agent_code: string;
    company_name: string;
    email: string;
    status: number;
    status_name: string;
  };
  assets: AssetBalance[];
  effective_exchange_rates: Partial<Record<'USDT' | 'USDC', EffectiveRate>>;
  pending_counts: Partial<Record<'deposit' | 'exchange' | 'whitelist' | 'withdrawal', number>> & { total?: number };
  capabilities: {
    deposit_channel_count: number;
    exchange_source_currencies: string[];
    exchange_target_currency: string;
    withdrawal_currency: string;
    withdrawal_fee_amount: string;
  };
  recent_orders: TransactionItem[];
}

/** 业务总览：余额、待办、有效比例与最近 5 笔交易。 */
export function fetchAgentAssetOverview() {
  return request.get<unknown, AssetOverview>('/web/getAgentAssetOverview');
}
