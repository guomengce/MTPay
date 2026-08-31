<template>
  <header class="app-header">
    <div class="app-header__left">
      <button
        class="app-header__menu-btn"
        type="button"
        :aria-label="t('common.actions.toggleMenu')"
        @click="appStore.toggleSidebar"
      >
        <el-icon><component :is="appStore.sidebarCollapsed ? Expand : Fold" /></el-icon>
      </button>

      <nav class="app-header__crumb" aria-label="面包屑">
        <template v-for="(item, index) in breadcrumbs" :key="item.path">
          <span
            v-if="index === breadcrumbs.length - 1"
            class="app-header__crumb-current"
            :aria-current="'page'"
          >
            {{ t(item.title) }}
          </span>
          <RouterLink v-else class="app-header__crumb-link" :to="item.path">
            {{ t(item.title) }}
          </RouterLink>
          <el-icon v-if="index < breadcrumbs.length - 1" class="app-header__crumb-sep">
            <ArrowRight />
          </el-icon>
        </template>
      </nav>
    </div>

    <div class="app-header__right">
      <LanguageSwitcher />
      <NotificationPopover>
        <button class="app-header__bell" type="button" :aria-label="hasUnread ? t('common.messages.unread') : t('common.messages.notifications')">
          <el-icon><Bell /></el-icon><span v-if="hasUnread" class="app-header__bell-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
        </button>
      </NotificationPopover>

      <span class="app-header__divider" aria-hidden="true" />

      <el-dropdown class="app-header__user" trigger="click" @command="handleUserCommand">
        <button class="app-header__user-btn" type="button">
          <span class="app-header__avatar">{{ userInitial }}</span>
          <span class="app-header__user-name">{{ userName }}</span>
          <el-icon class="app-header__user-caret"><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="security">
              <el-icon><Lock /></el-icon>
              <span>{{ t('auth.accountSecurity') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>{{ t('auth.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  ArrowRight,
  Bell,
  Expand,
  Fold,
  Lock,
  OfficeBuilding,
  SwitchButton,
  User,
} from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { useLogout } from '@/composables/useLogout';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import NotificationPopover from './NotificationPopover.vue';
import { useNotifications } from '@/views/notifications/composables/useNotifications';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const { submitLogout } = useLogout();
const { t } = useI18n();

interface CrumbItem {
  title: string;
  path: string;
}

const breadcrumbs = computed<CrumbItem[]>(() => {
  const items: CrumbItem[] = [];
  for (const matched of route.matched) {
    const title = matched.meta?.title;
    if (!title || matched.meta?.hidden || matched.redirect) {
      continue;
    }
    items.push({
      title: String(title),
      path: matched.path || matched.redirect as string || '/',
    });
  }
  if (items.length === 0) {
    items.push({ title: String(route.meta.title || ''), path: route.path });
  }
  return [{ title: 'menu.platform', path: '/dashboard' }, ...items];
});

const userName = computed(() => authStore.userInfo?.name || t('auth.guest'));
const userInitial = computed(() => {
  const name = userName.value.trim();
  return name ? name.charAt(0).toUpperCase() : 'U';
});

const { unreadCount } = useNotifications();
const hasUnread = computed(() => unreadCount.value > 0);

function handleAgentEntry() {
  router.push('/dashboard').catch(() => undefined);
}

async function handleUserCommand(command: string) {
  if (command === 'profile') {
    router.push('/account').catch(() => undefined);
    return;
  }
  if (command === 'security') {
    router.push('/account').catch(() => undefined);
    return;
  }
  if (command === 'logout') {
    await submitLogout();
    await router.replace({ name: 'Login' }).catch(() => undefined);
  }
}
</script>

<style scoped lang="scss">
.app-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: var(--portal-header-height);
  padding: 12px 16px;
  background: rgb(248 252 255 / 88%);
  border-bottom: 1px solid rgb(194 215 235 / 58%);
  box-shadow: 0 3px 14px rgb(35 82 126 / 5%);
  backdrop-filter: blur(12px);
}

.app-header__left,
.app-header__right {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
}

.app-header__menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--portal-text);
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgb(16 170 164 / 8%);
  }

  &:focus-visible {
    outline: 2px solid var(--portal-primary);
    outline-offset: 2px;
  }
}

.app-header__crumb {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
  gap: 8px;
  height: 40px;
  padding: 0 8px;
  font-size: 14px;
  overflow: hidden;
}

.app-header__crumb-link {
  color: var(--portal-text-secondary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: var(--portal-blue);
  }
}

.app-header__crumb-current {
  color: var(--portal-text);
  font-weight: 700;
}

.app-header__crumb-sep {
  color: #c6d4e3;
  font-size: 14px;
}

.app-header__status {
  display: none;
  align-items: center;
  gap: 6px;
  height: var(--portal-header-height);
  padding: 0 18px;
  background: rgb(255 255 255 / 92%);
  border: 1px solid var(--portal-border);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgb(28 77 120 / 8%);
  backdrop-filter: blur(14px);
  color: #0b8e85;
  font-size: 13px;
  font-weight: 700;
}

.app-header__status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10aaa4, #2dd4bf);
  box-shadow: 0 0 0 4px rgb(16 170 164 / 18%);
}

.app-header__divider {
  width: 1px;
  height: 22px;
  background: linear-gradient(180deg, transparent, rgb(28 77 120 / 15%), transparent);
}

.app-header__entry {
  display: none;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  background: rgb(255 255 255 / 92%);
  border: 1px solid var(--portal-border);
  border-radius: 999px;
  box-shadow: 0 4px 14px rgb(28 77 120 / 6%);
  color: var(--portal-text);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  .el-icon {
    color: var(--portal-blue);
    font-size: 16px;
  }

  &:hover {
    border-color: var(--portal-blue);
    color: var(--portal-blue);
    box-shadow: 0 6px 18px rgb(40 120 255 / 18%);
  }

  &:focus-visible {
    outline: 2px solid var(--portal-blue);
    outline-offset: 2px;
  }
}

.app-header__status + .app-header__divider,
.app-header__entry + .app-header__divider {
  display: none;
}

.app-header__bell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--portal-text);
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgb(16 170 164 / 8%);
  }

  &:focus-visible {
    outline: 2px solid var(--portal-blue);
    outline-offset: 2px;
  }
}

.app-header__bell-count {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 10px;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  background: #ef4444;
  box-shadow: 0 0 0 2px #ffffff;
}

.app-header__user-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 10px 0 6px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 4px 14px rgb(28 77 120 / 6%);
  color: var(--portal-text);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 18px rgb(40 120 255 / 18%);
  }

  &:focus-visible {
    outline: 2px solid var(--portal-blue);
    outline-offset: 2px;
  }
}

.app-header__avatar {
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4ecff 0%, #e6f7ff 100%);
  color: #2878ff;
  font-size: 14px;
  font-weight: 800;
}

.app-header__user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__user-caret {
  color: var(--portal-text-secondary);
  font-size: 14px;
}

.app-header :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  min-width: 140px;
  color: var(--portal-text);
  font-weight: 600;

  .el-icon {
    color: var(--portal-text-secondary);
  }
}

@include narrow {
  .app-header__status-label {
    display: none;
  }

}

@include mobile {
  .app-header {
    padding: 8px 12px;
  }

  .app-header__menu-btn {
    display: inline-flex;
  }

  .app-header__crumb {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 12px;
    font-size: 13px;
  }

  .app-header__status,
  .app-header__entry-label,
  .app-header__user-name {
    display: none;
  }

  .app-header__divider {
    display: none;
  }
}
</style>
