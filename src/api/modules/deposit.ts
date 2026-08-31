/**
 * 代理端数字货币入金模块
 * - 自动入金：仅查询通道、入金列表和详情，不再手动提交入金；
 * - 通道字段按实际 getDepositChannelList 响应定义；
 * - 列表和详情暂保留已有响应类型，新增文档截图未提供字段明细；
 * - 所有接口都基于请求 Token 识别代理身份，不传 user_id。
 */
import request from '../request';

/* ---------- 公共对象 ---------- */

/** 通道上挂载的币种描述。 */
export interface DepositCurrency {
  id: number;
  code: string;
  name: string;
  decimal_places: number;
}

/** 通道上挂载的网络描述。 */
export interface DepositNetwork {
  id: number;
  code: string;
  name: string;
}

/** 通道收款地址快照。 */
export interface DepositReceivingAddress {
  id: number;
  address: string;
}

/** 入金通道项。 */
export interface DepositChannelItem {
  wallet_address_id: number;
  coin_key: string;
  currency: DepositCurrency;
  network: DepositNetwork;
  receiving_address: DepositReceivingAddress;
}

/** 入金列表/详情公共字段。 */
export interface DepositOrder {
  id: number;
  order_no: string;
  user: { id: number; agent_code: string; company_name: string; email: string };
  currency: DepositCurrency;
  network: DepositNetwork;
  amount: string;
  txid: string;
  receiving_address_snapshot: string;
  status: 0 | 1 | 2;
  status_name: string;
  submitted_at: string | null;
  updated_at: string | null;
}

/** 入金详情响应。 */
export interface DepositOrderDetail extends DepositOrder {
  review: {
    admin_id: number | null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
  };
  credited_at: string | null;
  timeline: { event: string; name: string; time: string | null }[];
}

/* ---------- 请求参数 ---------- */

/** 入金列表查询条件。所有字段可空，page/limit 默认 15。 */
export interface DepositListParams {
  currency_id?: number;
  network_id?: number;
  status?: 0 | 1 | 2;
  order_no?: string;
  txid?: string;
  /** `started_at`，Y-m-d。 */
  started_at?: string;
  /** `ended_at`，Y-m-d，含当天 23:59:59。 */
  ended_at?: string;
  page?: number;
  limit?: number;
}

/* ---------- 接口 ---------- */

/**
 * 获取当前代理可用的入金通道列表（每个通道含币种、网络、收款地址）。
 * 无需额外筛选参数；后端按当前 Token 自动识别代理。
 */
export function fetchDepositChannels() {
  return request.get<unknown, DepositChannelItem[]>('/web/getDepositChannelList');
}

/**
 * 入金订单分页列表，按筛选条件查询当前代理的订单。
 * 返回 Laravel 分页对象，列表在 data.data，总数在 data.total。
 */
export function fetchDepositList(params: DepositListParams = {}) {
  return request.get<unknown, DepositPageResult>('/web/getDepositList', { params });
}

/** 入金详情。id 为正整数。 */
export function fetchDepositDetail(id: number) {
  return request.get<unknown, DepositOrderDetail>('/web/getDepositInfo', { params: { id } });
}

/* ---------- 分页类型 ---------- */

/** Laravel 分页响应结构，与 deposit 列表保持一致。 */
export interface DepositPageResult {
  current_page: number;
  data: DepositOrder[];
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
