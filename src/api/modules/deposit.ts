/**
 * 代理端数字货币入金模块
 * 字段与状态枚举以 `接口文档参数-代理端.md` 第 5.5 节和 7.3 节为准。
 * - 状态：0 待审核 / 1 已入账 / 2 已驳回；
 * - 同一个币种和网络下的 txid 不能重复提交；
 * - 提交成功并不代表已入账，需要管理员审核通过；
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
  currency_network_id: number;
  currency: DepositCurrency;
  network: DepositNetwork;
  receiving_address: DepositReceivingAddress;
}

/** 入金提交/详情公共字段。 */
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

/** 详情/审核成功响应在公共字段上额外返回 review / credited_at / timeline。 */
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

/** 入金提交参数。amount 必须为十进制字符串，且业务上 >0。 */
export interface SubmitDepositPayload {
  currency_network_id: number;
  amount: string;
  txid: string;
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
 * 提交入金订单。
 * 后端会重新校验币种/网络、收款地址以及 txid 唯一性；成功后冻结不进入余额。
 */
export function submitDeposit(payload: SubmitDepositPayload) {
  return request.post<unknown, DepositOrderDetail>('/web/submitDeposit', payload);
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