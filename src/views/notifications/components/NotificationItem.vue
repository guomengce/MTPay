<template>
  <button class="notice" :class="[{ unread: !notificationIsRead(item), compact }, item.business_type]" type="button" @click="$emit('open', item)">
    <span class="notice__badge">{{ notificationBadge(item.business_type) }}</span>
    <span class="notice__body">
      <span class="notice__heading"><strong>{{ item.title }}</strong><span v-if="!compact && item.business_type" class="notice__type">{{ t(`notifications.business.${item.business_type}`) }}</span><i v-if="!notificationIsRead(item)" class="notice__dot" :aria-label="t('notifications.unread')" /></span>
      <span class="notice__content">{{ item.content }}</span>
      <span v-if="!compact && item.business_no" class="notice__number">{{ item.business_no }}</span>
    </span>
    <time class="notice__time">{{ compact ? item.created_at?.slice(5, 16) : item.created_at }}</time>
    <span v-if="!compact && notificationRoute(item)" class="notice__link">{{ t('common.actions.details') }} →</span>
  </button>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { AgentNotification } from '@/api/modules/notification';
import { notificationBadge, notificationRoute, notificationIsRead } from '../notificationPresentation';
defineProps<{ item: AgentNotification; compact?: boolean }>();
defineEmits<{ open: [item: AgentNotification] }>();
const { t } = useI18n();
</script>
<style scoped lang="scss">
.notice {
  display:grid; width:100%; min-width:0; grid-template-columns:40px minmax(0,1fr) auto auto; align-items:center; gap:16px;
  padding:22px 18px; border:0; border-bottom:1px solid #e8eef6; background:#fff; color:#142b48; text-align:left; cursor:pointer; font:inherit;
  &:last-child { border-bottom:0; }
  &.compact.unread { background:#f5f8ff; }
  transition: background-color .18s ease;
  &:hover { background:#f8fbff; }
  &:focus-visible { outline:2px solid #268ee6; outline-offset:-2px; }
  &__badge { display:grid; width:40px; height:40px; place-items:center; border-radius:12px; background:#eef2f7; color:#62738b; font-size:11px; }
  &.whitelist &__badge { color:#8755e8; background:#f2ecff; }
  &.withdrawal &__badge { color:#008e97; background:#e5f8f5; }
  &.deposit &__badge { color:#3674ef; background:#ecf2ff; }
  &.exchange &__badge { color:#b97812; background:#fff4df; }
  &__body { display:grid; min-width:0; gap:7px; }
  &__heading { display:flex; align-items:center; flex-wrap:wrap; gap:8px; strong { font-size:14px; overflow-wrap:anywhere; } }
  &__type { padding:3px 6px; border-radius:6px; background:#edf1f7; color:#52647e; font-size:10px; }
  &__dot { width:7px; height:7px; flex:0 0 7px; border-radius:50%; background:#417bea; }
  &__content { color:#667a98; font-size:12px; line-height:1.6; overflow-wrap:anywhere; white-space:pre-wrap; }
  &__number { color:#92a1b7; font-size:12px; }
  &__time { color:#8293ad; font-size:11px; white-space:nowrap; }
  &__link { margin-left:24px; color:#3264d6; font-size:12px; white-space:nowrap; }
  &.compact { grid-template-columns:38px minmax(0,1fr) auto; align-items:start; gap:10px; padding:14px 12px; }
  &.compact &__badge { width:38px; height:38px; }
  &.compact &__heading strong { font-size:13px; }
  &.compact &__content { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; }
}
@include mobile {
  .notice:not(.compact) { grid-template-columns:40px minmax(0,1fr); gap:10px; padding:16px 12px; }
  .notice:not(.compact) .notice__time { grid-column:2; }
  .notice__link { grid-column:2; margin:0; }
}
</style>
