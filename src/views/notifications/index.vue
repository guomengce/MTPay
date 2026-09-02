<template>
  <main class="notifications-page">
    <header class="notifications-page__header"><div><h1>{{ t('notifications.title') }}</h1></div><el-button type="primary" :icon="Check" class="notifications-page__mark-all" :disabled="!unreadCount || updating || summaryError" :loading="updating" @click="updateRead()">{{ t('notifications.markAll') }}</el-button></header>
    <div class="notifications-page__filters">
      <el-radio-group v-model="readFilter" :aria-label="t('notifications.readStatus')" @change="filterChanged"><el-radio-button value="all">{{ t('notifications.all') }}</el-radio-button><el-radio-button value="unread">{{ t('notifications.unreadCount', { count: unreadCount }) }}</el-radio-button><el-radio-button value="read">{{ t('notifications.read') }}</el-radio-button></el-radio-group>
      <div class="notifications-page__business"><label id="notification-business-label">{{ t('notifications.businessType') }}</label><el-select v-model="businessFilter" size="small" aria-labelledby="notification-business-label" @change="filterChanged"><el-option value="" :label="t('notifications.allBusiness')"/><el-option v-for="type in visibleNotificationBusinesses" :key="type" :value="type" :label="t(`notifications.business.${type}`)" /></el-select></div>
    </div>
    <section v-loading="loading" class="notifications-page__list">
      <el-empty v-if="listError" :description="t('notifications.loadFailed')"><el-button @click="load">{{ t('notifications.retry') }}</el-button></el-empty>
      <template v-else><NotificationItem v-for="item in items" :key="item.id" :item="item" @open="open"/><el-empty v-if="!loading && !items.length" :description="t('notifications.empty')" /></template>
    </section>
    <el-pagination v-model:current-page="page" class="app-pagination" :total="total" :page-size="limit" layout="total, prev, pager, next" background @current-change="load" />
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useListQueryState } from '@/composables/useListQueryState';
import { Check } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { AgentNotification } from '@/api/modules/notification';
import { useNotifications } from './composables/useNotifications';
import { notificationBusinesses, notificationRoute } from './notificationPresentation';
import NotificationItem from './components/NotificationItem.vue';
import { useAuthStore } from '@/stores/modules/auth';
const router = useRouter();
const authStore = useAuthStore();
const visibleNotificationBusinesses = computed(() => notificationBusinesses.filter((type) => authStore.cryptoEnabled || !['deposit', 'exchange'].includes(type)));
const { t } = useI18n();
const { items, unreadCount, total, page, limit, readFilter, businessFilter, loading, updating, listError, summaryError, load: loadNotifications, loadSummary, updateRead } = useNotifications();
watch(() => authStore.cryptoEnabled, (enabled) => { if (!enabled && ['deposit', 'exchange'].includes(businessFilter.value)) businessFilter.value = ''; }, { immediate: true });
const saveListQuery = useListQueryState({ readFilter, businessFilter, page, limit });
async function load() { await saveListQuery(); await loadNotifications(); }
function filterChanged() { page.value = 1; void load(); }
async function open(item: AgentNotification) {
  // 标记已读不应阻塞业务详情导航。
  void updateRead(item);
  const target = notificationRoute(item);
  if (target) await router.push(target);
}
onMounted(() => Promise.all([load(), loadSummary()]));
</script>
<style scoped lang="scss">
.notifications-page {
  display:grid; min-width:0; gap:20px;
  &__header { display:flex; justify-content:space-between; align-items:start; gap:16px; h1 { margin:0; color:#142b48; font-size:26px; } p { margin:10px 0 0; color:#788aa5; font-size:13px; } }
  &__filters { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; align-items:center; }
  &__business { display:flex; align-items:center; gap:10px; margin-left:auto; flex-shrink:0; label { color:#667a98; font-size:12px; } .el-select { width:156px; } }
  &__list { min-height:200px; overflow:hidden; border:1px solid #e2e9f2; border-radius:16px; background:#fff; box-shadow:0 8px 28px rgb(29 53 87 / 7%), 0 2px 6px rgb(29 53 87 / 3%); }
  &__business :deep(.el-select__wrapper) { min-height:34px; padding:5px 10px; border-radius:8px; font-size:12px; }
  &__mark-all { border-radius:10px; box-shadow:0 4px 12px rgb(12 157 155 / 18%); }
  :deep(.el-pagination) { justify-content:flex-end; }
}
@include mobile { .notifications-page__header { flex-wrap:wrap; } .notifications-page__business { max-width:100%; .el-select { width:156px; } } }
</style>
