import { ref, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/modules/auth';
import * as api from '@/api/modules/notification';
import type { AgentNotification, NotificationBusiness, NotificationReadStatus } from '@/api/modules/notification';
import { notificationIsRead } from '../notificationPresentation';

const useNotificationStore = defineStore('notifications', () => {
  const recent = ref<AgentNotification[]>([]);
  const items = ref<AgentNotification[]>([]);
  const unreadCount = ref(0);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const readFilter = ref<NotificationReadStatus>('all');
  const businessFilter = ref<NotificationBusiness | ''>('');
  const loading = ref(false);
  const summaryLoading = ref(false);
  const updating = ref(false);
  const listError = ref(false);
  const summaryError = ref(false);
  let listVersion = 0;
  let summaryVersion = 0;
  let unreadCountVersion = 0;
  let unreadCountLoading = false;
  let accountVersion = 0;
  const auth = useAuthStore();
  watch(() => auth.userInfo?.id, () => {
    accountVersion++; listVersion++; summaryVersion++; unreadCountVersion++;
    recent.value = []; items.value = []; unreadCount.value = 0; total.value = 0;
    page.value = 1; limit.value = 15; readFilter.value = 'all'; businessFilter.value = '';
    loading.value = false; summaryLoading.value = false; updating.value = false;
    listError.value = false; summaryError.value = false;
  }, { flush: 'sync' });

  async function loadUnreadCount() {
    if (unreadCountLoading) return;
    const version = ++unreadCountVersion;
    unreadCountLoading = true;
    try {
      const result = await api.fetchNotificationUnreadCount();
      if (version !== unreadCountVersion) return;
      if (!Number.isFinite(result.unread_count)) throw new Error('Unexpected notification unread count');
      unreadCount.value = result.unread_count;
    } catch {
      // 輪詢失敗時保留目前徽標數字，下一輪自動重試。
    } finally {
      if (version === unreadCountVersion) unreadCountLoading = false;
    }
  }

  async function loadSummary() {
    if (summaryLoading.value) return;
    const version = ++summaryVersion;
    summaryLoading.value = true; summaryError.value = false;
    try {
      const result = await api.fetchNotificationSummary();
      if (version !== summaryVersion) return;
      if (!Array.isArray(result.recent_notifications) || !Number.isFinite(result.unread_count)) throw new Error('Unexpected notification summary');
      recent.value = result.recent_notifications; unreadCount.value = result.unread_count;
    } catch { if (version === summaryVersion) summaryError.value = true; }
    finally { if (version === summaryVersion) summaryLoading.value = false; }
  }
  async function load() {
    const version = ++listVersion;
    loading.value = true; listError.value = false;
    try {
      const result = await api.fetchNotificationList({ page: page.value, limit: limit.value,
        read_status: readFilter.value,
        ...(businessFilter.value ? { business_type: businessFilter.value } : {}),
      });
      if (version !== listVersion) return;
      const pagination = result.notifications;
      if (!pagination || !Array.isArray(pagination.data) || !Number.isFinite(pagination.total) ||
          !Number.isFinite(result.unread_count) || !Number.isInteger(pagination.current_page) || pagination.current_page < 1 ||
          !Number.isInteger(pagination.per_page) || pagination.per_page < 1 ||
          !Number.isInteger(pagination.last_page) || pagination.last_page < 1) throw new Error('Unexpected notification list');
      items.value = pagination.data; total.value = pagination.total;
      unreadCount.value = result.unread_count;
      page.value = pagination.current_page; limit.value = pagination.per_page;
      const lastPage = pagination.last_page;
      if (page.value > lastPage) { page.value = lastPage; await load(); }
    } catch { if (version === listVersion) listError.value = true; }
    finally { if (version === listVersion) loading.value = false; }
  }
  async function updateRead(item?: AgentNotification) {
    if (updating.value) return false;
    if (item && notificationIsRead(item)) return true;
    const account = accountVersion;
    updating.value = true;
    try {
      if (item) await api.readNotification(item.id); else await api.readAllNotifications();
      if (account !== accountVersion) return false;
      await Promise.all([loadSummary(), load()]);
      return account === accountVersion;
    } catch { return false; }
    finally { if (account === accountVersion) updating.value = false; }
  }
  function filterChanged() { page.value = 1; void load(); }
  return { recent, items, unreadCount, total, page, limit, readFilter, businessFilter, loading, summaryLoading, updating, listError, summaryError, load, loadSummary, loadUnreadCount, updateRead, filterChanged };
});

export function useNotifications() {
  const store = useNotificationStore();
  return { ...storeToRefs(store), load: store.load, loadSummary: store.loadSummary, loadUnreadCount: store.loadUnreadCount, updateRead: store.updateRead, filterChanged: store.filterChanged };
}
