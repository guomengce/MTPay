import 'remixicon/fonts/remixicon.css';

/** Shared module icons for sidebar navigation and page heroes. */
const moduleIcons: Record<string, string> = {
  dashboard: 'ri-dashboard-3-line',
  agent: 'ri-user-line',
  currency: 'ri-coins-line',
  deposit: 'ri-wallet-3-line',
  'fiat-deposit': 'ri-bank-card-line',
  exchange: 'ri-exchange-dollar-line',
  whitelist: 'ri-user-follow-line',
  withdrawal: 'ri-hand-coin-line',
  risk: 'ri-shield-line',
  fee: 'ri-percent-line',
  transactions: 'ri-file-list-3-line',
  records: 'ri-file-list-3-line',
  permission: 'ri-admin-line',
  roles: 'ri-key-2-line',
  log: 'ri-history-line',
  reservation: 'ri-calendar-event-line',
  account: 'ri-shield-user-line',
  notifications: 'ri-notification-3-line',
};

export function moduleIcon(path: string): string | undefined {
  return moduleIcons[path.split('/').filter(Boolean)[0] || ''];
}
