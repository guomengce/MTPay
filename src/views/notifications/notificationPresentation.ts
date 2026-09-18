import type { AgentNotification, NotificationBusiness } from '@/api/modules/notification';
export const notificationBusinesses: NotificationBusiness[] = ['whitelist', 'withdrawal', 'deposit', 'exchange'];
const routes = { whitelist: 'WhitelistDetail', withdrawal: 'WithdrawalDetail', deposit: 'DepositDetail', exchange: 'ExchangeDetail' };
const badges = { whitelist: 'WL', withdrawal: 'OUT', deposit: 'IN', exchange: 'EX' };
export function notificationBadge(type?: NotificationBusiness) { return type && Object.prototype.hasOwnProperty.call(badges, type) ? badges[type] : 'MSG'; }
export function notificationRoute(item: AgentNotification) {
  const hasDetail = item.detail_type !== undefined || item.detail_id !== undefined;
  const type = hasDetail ? item.detail_type : item.business_type;
  const id = hasDetail ? item.detail_id : item.business_id;
  if (!type || !Object.prototype.hasOwnProperty.call(routes, type) || !id) return null;
  return { name: routes[type], params: { id: String(id) } };
}

/** 已确认的 is_read 优先；兼容尚未提供响应明细的旧列表数据。 */
export function notificationIsRead(item: AgentNotification) {
  return item.is_read ?? Boolean(item.read_at);
}
