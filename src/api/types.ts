/**
 * 通用 API 类型
 * - ApiResponse<T>：统一后端响应
 * - PageParams：分页请求参数
 * - PageResult<T>：分页响应
 * - OptionItem：下拉选项
 * - StatusType：通用状态字段（具体业务可扩展）
 */

/** 统一后端响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 分页请求参数 */
export interface PageParams {
  page: number;
  pageSize: number;
  keyword?: string;
  [key: string]: unknown;
}

/** 分页响应 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 通用下拉选项 */
export interface OptionItem<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** 后端通用状态枚举 */
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

/** 通用 ID */
export type Id = string | number;

/** 键值对 */
export interface KeyValue<K extends string = string, V = string> {
  key: K;
  value: V;
}
