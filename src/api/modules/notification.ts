import request from '../request';

// 摘要及列表响应已按实际数据对齐；筛选参数和已读请求参数仍待确认。
export type NotificationBusiness = 'whitelist' | 'withdrawal' | 'deposit' | 'exchange';
export interface AgentNotification {
  id: number | string;
  title: string;
  content: string;
  created_at: string;
  read_at: string | null;
  is_read?: boolean;
  event_type?: string;
  business_name?: string;
  business_type?: NotificationBusiness;
  business_id?: number | string;
  business_no?: string;
  detail_type?: NotificationBusiness | null;
  detail_id?: number | string | null;
}
export interface NotificationSummary { unread_count: number; recent_notifications: AgentNotification[] }
export interface NotificationListParams { page: number; limit: number; is_read?: 0 | 1; business_type?: NotificationBusiness }
export interface NotificationPage {
  current_page: number;
  data: AgentNotification[];
  last_page: number;
  per_page: number;
  total: number;
}
export interface NotificationListResult { unread_count: number; notifications: NotificationPage }
export const fetchNotificationSummary = () => request.get<unknown, NotificationSummary>('/web/getNotificationSummary');
export const fetchNotificationList = (params: NotificationListParams) => request.get<unknown, NotificationListResult>('/web/getNotificationList', { params });
export const readNotification = (id: AgentNotification['id']) => request.post('/web/readNotification', { id });
export const readAllNotifications = () => request.post('/web/readAllNotifications');
