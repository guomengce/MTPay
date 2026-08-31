/**
 * 代理端数字货币兑换 USD 模块
 * 字段与状态枚举以 `接口文档参数-代理端.md` 第 5.6 节和 7.4 节为准。
 * - 来源币种限定 USDT / USDC，目标币种固定 USD；
 * - 状态：0 待审核 / 1 已完成 / 2 已驳回；
 * - 提交时立即冻结来源币种；后端保存实际汇率快照，前端不得自行计算目标金额；
 * - 全部基于请求 Token 识别代理身份，不传 user_id。
 */
import request from '../request';

/* ---------- 公共对象 ---------- */

/** 兑换配置中的余额项，与 AssetOverview.assets 元素一致。 */
export interface ExchangeBalance {
  currency: { id: number; code: string; name: string; decimal_places: number };
  available_balance: string;
  frozen_balance: string;
  total_balance: string;
}

/** 单个来源币种的有效汇率。 */
export interface ExchangeEffectiveRate {
  source_currency: { id: number; code: string; name: string };
  target_currency: { id: number; code: string; name: string };
  rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
}

/** 兑换订单公共字段。 */
export interface ExchangeOrder {
  id: number;
  order_no: string;
  user: { id: number; agent_code: string; company_name: string; email: string };
  source_currency: { id: number; code: string; name: string; decimal_places: number };
  target_currency: { id: number; code: string; name: string; decimal_places: number };
  source_amount: string;
  exchange_rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
  target_amount: string;
  status: 0 | 1 | 2;
  status_name: string;
  submitted_at: string | null;
  frozen_at: string | null;
  updated_at: string | null;
}

/** 详情/审核成功响应在公共字段上额外返回 review / completed_at / timeline。 */
export interface ExchangeOrderDetail extends ExchangeOrder {
  review: {
    admin_id: number | null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
  };
  completed_at: string | null;
  timeline: { event: string; name: string; time: string | null }[];
}

/* ---------- 请求参数 ---------- */

/** 兑换列表查询条件。 */
export interface ExchangeListParams {
  source_currency_id?: number;
  status?: 0 | 1 | 2;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page?: number;
  limit?: number;
}

/** 兑换提交参数。source_currency_code 限定 USDT/USDC；amount 为十进制字符串且 >0。 */
export interface SubmitExchangePayload {
  source_currency_code: string;
  amount: string;
}

/* ---------- 接口 ---------- */

/**
 * 获取兑换所需余额、额度信息。
 * 返回 balances 与 rates，前端可在表单展示可用余额与专属汇率。
 */
export function fetchExchangeConfig() {
  return request.get<unknown, ExchangeConfig>('/web/getExchangeConfig');
}

/** 兑换配置响应结构。 */
export interface ExchangeConfig {
  balances: ExchangeBalance[];
  rates: Partial<Record<string, ExchangeEffectiveRate>>;
}

/**
 * 提交兑换订单。
 * 后端会重新读取有效汇率并保存快照，扣减/冻结逻辑以服务端为准。
 */
export function submitExchange(payload: SubmitExchangePayload) {
  return request.post<unknown, ExchangeOrderDetail>('/web/submitExchange', payload);
}

/**
 * 兑换订单分页列表，按筛选条件查询当前代理的订单。
 * 返回 Laravel 分页对象，列表在 data.data，总数在 data.total。
 */
export function fetchExchangeList(params: ExchangeListParams = {}) {
  return request.get<unknown, ExchangePageResult>('/web/getExchangeList', { params });
}

/** 兑换详情。id 为正整数。 */
export function fetchExchangeDetail(id: number) {
  return request.get<unknown, ExchangeOrderDetail>('/web/getExchangeInfo', { params: { id } });
}

/* ---------- 分页类型 ---------- */

/** Laravel 分页响应结构。 */
export interface ExchangePageResult {
  current_page: number;
  data: ExchangeOrder[];
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
