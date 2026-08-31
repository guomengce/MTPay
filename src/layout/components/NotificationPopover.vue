<template>
  <el-popover v-model:visible="visible" placement="bottom-end" :width="386" trigger="click" popper-class="notification-popper" @show="loadSummary">
    <template #reference><slot /></template>
    <section class="notice-panel">
      <header><div><strong>{{ t('notifications.recent') }}</strong><small>{{ t('notifications.unreadCount', { count: unreadCount }) }}</small></div><el-button type="primary" text :icon="Check" :disabled="!unreadCount || updating || summaryError" :loading="updating" @click="updateRead()">{{ t('notifications.markAll') }}</el-button></header>
      <div v-loading="summaryLoading" class="notice-panel__list">
        <el-empty v-if="summaryError" :image-size="54" :description="t('notifications.loadFailed')"><el-button @click="loadSummary">{{ t('notifications.retry') }}</el-button></el-empty>
        <template v-else><NotificationItem v-for="item in recent" :key="item.id" :item="item" compact @open="open" /><el-empty v-if="!summaryLoading && !recent.length" :image-size="54" :description="t('notifications.empty')" /></template>
      </div>
      <footer><span>{{ t('notifications.recentCount', { count: recent.length }) }}</span><el-button @click="openAll">{{ t('notifications.viewAll') }}</el-button></footer>
    </section>
  </el-popover>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Check } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { AgentNotification } from '@/api/modules/notification';
import { useNotifications } from '@/views/notifications/composables/useNotifications';
import { notificationRoute } from '@/views/notifications/notificationPresentation';
import NotificationItem from '@/views/notifications/components/NotificationItem.vue';
const router = useRouter();
const { t } = useI18n();
const visible = ref(false);
const { recent, summaryLoading, summaryError, unreadCount, updating, loadSummary, updateRead } = useNotifications();
async function open(item: AgentNotification) {
  void updateRead(item);
  const target = notificationRoute(item);
  visible.value = false;
  await router.push(target ?? { name: 'Notifications' });
}
function openAll() { visible.value = false; void router.push({ name: 'Notifications' }); }
onMounted(loadSummary);
</script>
<style scoped lang="scss">
.notice-panel {
  header, footer { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px; }
  header { border-bottom:1px solid #e8eef6; strong { font-size:15px; } small { display:block; margin-top:5px; color:#788aa5; font-size:12px; } }
  &__list { min-height:150px; max-height:460px; overflow-y:auto; }
  footer { border-top:1px solid #e8eef6; color:#788aa5; font-size:12px; }
}
</style>
<style lang="scss">
.el-popover.el-popper.notification-popper { max-width:calc(100vw - 24px); padding:0; overflow:hidden; border:1px solid #d9e3f1; border-radius:16px; }
</style>
