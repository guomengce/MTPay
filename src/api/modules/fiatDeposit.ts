import request from '../request';
export type FiatDepositStatus = 0 | 1 | 2;
export interface FiatCurrency {
  id: number;
  code: string;
  name: string;
  decimal_places: number;
}
export interface FiatFileRules {
  required: boolean;
  max_files: number;
  max_file_size_mb: number;
  allowed_extensions: string[];
}
export interface FiatFile {
  file_id: number;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  bound_at: string | null;
}
export interface FiatOrder {
  id: number;
  order_no: string;
  user: { id: number; agent_code: string; company_name: string; email: string };
  currency: FiatCurrency;
  amount: string;
  payer_name: string;
  payer_bank: string;
  remittance_reference: string;
  remittance_date: string;
  status: FiatDepositStatus;
  status_name: string;
  file_count: number;
  submitted_at: string;
  updated_at: string;
}
export interface FiatOrderDetail extends FiatOrder {
  payer_account_last4: string;
  remark: string | null;
  review: {
    admin_id: null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
    credited_at: string | null;
  };
  files: FiatFile[];
  timeline: { event: 'submitted' | 'completed' | 'rejected'; name: string; time: string }[];
}
export interface FiatPage {
  current_page: number;
  data: FiatOrder[];
  last_page: number;
  per_page: number;
  total: number;
}
export interface FiatFilters {
  currency_id?: number;
  status?: FiatDepositStatus;
  keyword?: string;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page?: number;
  limit?: number;
}
export interface FiatSubmit {
  currency_id: number;
  amount: string;
  payer_name: string;
  payer_bank: string;
  payer_account_last4: string;
  remittance_reference: string;
  remittance_date: string;
  remark?: string;
  file_ids?: number[];
}
export function fetchFiatConfig() {
  return request.get<
    unknown,
    {
      currencies: FiatCurrency[];
      file_rules: FiatFileRules;
    }
  >('/web/getFiatDepositConfig');
}
export function uploadFiatFile(file: File, currencyId: number) {
  const data = new FormData();
  data.append('file', file);
  data.append('currency_id', String(currencyId));
  return request.post<unknown, FiatFile>('/web/uploadFiatDepositFile', data);
}
export function submitFiatDeposit(payload: FiatSubmit) {
  return request.post<unknown, FiatOrderDetail>('/web/submitFiatDeposit', payload);
}
export function fetchFiatList(params: FiatFilters) {
  return request.get<unknown, FiatPage>('/web/getFiatDepositList', { params });
}
export function fetchFiatDetail(id: number) {
  return request.get<unknown, FiatOrderDetail>('/web/getFiatDepositInfo', { params: { id } });
}
export function previewFiatFile(file_id: number) {
  return request.get<unknown, Blob>('/web/previewFiatDepositFile', {
    params: { file_id },
    responseType: 'blob',
  });
}
export function downloadFiatFile(file_id: number) {
  return request.get<unknown, Blob>('/web/downloadFiatDepositFile', {
    params: { file_id },
    responseType: 'blob',
  });
}
