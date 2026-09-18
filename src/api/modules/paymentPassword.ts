import request from '../request';
export interface PaymentPasswordStatus {
  has_payment_password: boolean;
  two_factor_enabled: boolean;
  changed_at: string | null;
  locked_until: string | null;
}
export interface PaymentPasswordFields {
  payment_password: string;
  payment_password_confirmation: string;
}
export const getPaymentPasswordStatus = () =>
  request.get<unknown, PaymentPasswordStatus>('/web/getPaymentPasswordStatus');
export const sendPaymentPasswordEmailCode = () =>
  request.post<unknown, { expires_in: number; resend_after: number }>(
    '/web/sendPaymentPasswordEmailCode',
    {},
  );
export const setPaymentPassword = (
  data: PaymentPasswordFields & { email_code: string; code: string },
) => request.post('/web/setPaymentPassword', data);
export const updatePaymentPassword = (
  data: PaymentPasswordFields & { old_payment_password: string },
) => request.post('/web/updatePaymentPassword', data);
export const forgotPaymentPassword = () =>
  request.post<unknown, { expires_in: number }>('/web/forgotPaymentPassword', {});
export const resetPaymentPassword = (
  data: PaymentPasswordFields & { token: string; code: string },
) => request.post('/web/resetPaymentPassword', data);
