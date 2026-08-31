import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
import { parse, compileScript } from '@vue/compiler-sfc';
const require = createRequire(import.meta.url);
const vue = require('vue');
const pinia = require('pinia');
function load(path, imports) {
  let source = readFileSync(new URL(path, import.meta.url), 'utf8');
  if (path.endsWith('.vue')) source = compileScript(parse(source, { filename: path }).descriptor, { id: 'notification-test' }).content;
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)((id) => {
    if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
    return imports[id];
  }, module, module.exports);
  return module.exports;
}
test('four API methods and business links use only the documented paths and local routes', () => {
  const calls = [];
  const api = load('../src/api/modules/notification.ts', { '../request': { default: {
    get: (...args) => calls.push(['GET', ...args]), post: (...args) => calls.push(['POST', ...args]),
  } } });
  api.fetchNotificationSummary(); api.fetchNotificationList({ page: 1, limit: 15, is_read: 0 });
  api.readNotification('notice-1'); api.readAllNotifications();
  assert.deepEqual(calls, [
    ['GET', '/web/getNotificationSummary'], ['GET', '/web/getNotificationList', { params: { page: 1, limit: 15, is_read: 0 } }],
    ['POST', '/web/readNotification', { id: 'notice-1' }], ['POST', '/web/readAllNotifications'],
  ]);
  const { notificationRoute, notificationIsRead } = load('../src/views/notifications/notificationPresentation.ts', {});
  assert.deepEqual(notificationRoute({ business_type: 'deposit', business_id: 4 }), { name: 'DepositDetail', params: { id: '4' } });
  assert.equal(notificationRoute({ business_type: 'https://example.com', business_id: 4 }), null);
  assert.equal(notificationRoute({ business_type: 'deposit' }), null);
  assert.deepEqual(notificationRoute({ business_type: 'deposit', business_id: 4, detail_type: 'exchange', detail_id: 17 }), { name: 'ExchangeDetail', params: { id: '17' } });
  assert.deepEqual(notificationRoute({ business_type: 'whitelist', business_id: 14, detail_type: 'whitelist', detail_id: 14 }), { name: 'WhitelistDetail', params: { id: '14' } });
  assert.equal(notificationRoute({ business_type: 'deposit', business_id: 4, detail_type: null, detail_id: null }), null);
  assert.equal(notificationIsRead({ is_read: true, read_at: null }), true);
  assert.equal(notificationIsRead({ is_read: false, read_at: '2026-08-28 10:29:44' }), false);
});
test('message center and popover navigate without waiting for marking read', async () => {
  const presentation = load('../src/views/notifications/notificationPresentation.ts', {});
  for (const file of ['../src/views/notifications/index.vue', '../src/layout/components/NotificationPopover.vue']) {
    const destinations = [];
    const imports = {
      vue: { ...vue, onMounted() {} },
      'vue-router': { useRouter: () => ({ push: async target => destinations.push(target) }) },
      'vue-i18n': { useI18n: () => ({ t: key => key }) },
      '@element-plus/icons-vue': {},
    };
    for (const prefix of ['./', '@/views/notifications/']) {
      imports[`${prefix}composables/useNotifications`] = { useNotifications: () => ({ updateRead: () => new Promise(() => {}) }) };
      imports[`${prefix}notificationPresentation`] = presentation;
      imports[`${prefix}components/NotificationItem.vue`] = {};
    }
    const component = load(file, imports).default.setup({}, { expose() {} });
    await component.open({ detail_type: 'exchange', detail_id: 17 });
    await component.open({ detail_type: 'whitelist', detail_id: 14 });
    assert.deepEqual(destinations, [
      { name: 'ExchangeDetail', params: { id: '17' } },
      { name: 'WhitelistDetail', params: { id: '14' } },
    ]);
  }
});
test('shared unread totals, filtering, failed reads, account reset and stale responses', async () => {
  pinia.setActivePinia(pinia.createPinia());
  const auth = vue.reactive({ userInfo: { id: 'agent-a' } });
  const item = { id: 7, event_type: 'exchange_approved', business_type: 'exchange', business_name: '兑换', business_id: 17, business_no: 'EXE0FB59557D5A90B8', title: '兑换审核通过', content: '兑换申请已完成，USD已入账。', is_read: false, read_at: null, created_at: '2026-08-28 10:29:44', detail_type: 'exchange', detail_id: 17 };
  let query;
  let failRead = true;
  let unread = 8;
  const listResponse = (overrides = {}) => ({ unread_count: unread, notifications: {
    current_page: 1, data: [item], total: 1, per_page: 15, last_page: 1, ...overrides,
  } });
  const api = {
    fetchNotificationSummary: async () => ({ recent_notifications: [item], unread_count: unread }),
    fetchNotificationList: async (params) => { query = params; return listResponse(); },
    readNotification: async () => { if (failRead) throw new Error('Rejected'); unread--; },
    readAllNotifications: async () => { unread = 0; },
  };
  const { useNotifications } = load('../src/views/notifications/composables/useNotifications.ts', { vue, pinia, '@/stores/modules/auth': { useAuthStore: () => auth }, '@/api/modules/notification': api, '../notificationPresentation': load('../src/views/notifications/notificationPresentation.ts', {}) });
  const state = useNotifications();
  await state.loadSummary();
  assert.equal(state.summaryError.value, false);
  assert.equal(state.recent.value[0].detail_id, 17);
  assert.equal(state.unreadCount.value, 8);
  assert.equal(useNotifications().unreadCount.value, 8);
  state.readFilter.value = 'unread'; state.businessFilter.value = 'deposit';
  await state.load();
  assert.deepEqual(query, { page: 1, limit: 15, is_read: 0, business_type: 'deposit' });
  assert.equal(state.listError.value, false);
  assert.equal(state.items.value[0].id, 7);
  assert.equal(state.total.value, 1);
  assert.equal(await state.updateRead(item), false);
  assert.equal(state.unreadCount.value, 8);
  assert.equal(item.read_at, null);
  assert.equal(await state.updateRead({ ...item, is_read: true }), true);
  assert.equal(state.unreadCount.value, 8);
  failRead = false;
  assert.equal(await state.updateRead(item), true);
  assert.equal(state.unreadCount.value, 7);
  await state.updateRead();
  assert.equal(state.unreadCount.value, 0);
  unread = 3;
  api.fetchNotificationList = async () => listResponse({ current_page: 2, per_page: 10, total: 23, last_page: 3 });
  await state.load();
  assert.equal(state.page.value, 2);
  assert.equal(state.limit.value, 10);
  assert.equal(state.total.value, 23);
  assert.equal(state.unreadCount.value, 3);
  let requests = 0;
  api.fetchNotificationList = async () => listResponse({ current_page: ++requests === 1 ? 2 : 1, data: [], total: 0 });
  await state.load();
  assert.equal(requests, 2);
  assert.equal(state.page.value, 1);
  assert.deepEqual(state.items.value, []);
  let finish;
  api.fetchNotificationList = () => new Promise(resolve => { finish = resolve; });
  const pending = state.load();
  auth.userInfo = null;
  finish(listResponse());
  await pending;
  assert.deepEqual(state.items.value, []);
  assert.deepEqual(state.recent.value, []);
  assert.equal(state.readFilter.value, 'all');
});
