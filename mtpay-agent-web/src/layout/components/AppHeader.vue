<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-button :icon="Fold" circle text @click="appStore.toggleSidebar" />
      <strong class="app-header__title">MTPay Agent</strong>
    </div>
    <div class="app-header__right">
      <span class="app-header__user">{{ authStore.userInfo?.name || '当前用户' }}</span>
      <el-button type="primary" plain @click="handleLogout">退出登录</el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Fold } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

async function handleLogout() {
  authStore.logout();
  await router.replace({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  height: var(--app-header-height);
  min-height: var(--app-header-height);
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--app-border);

  &__left,
  &__right {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: 16px;
    white-space: nowrap;
  }

  &__user {
    max-width: 160px;
    overflow: hidden;
    color: var(--app-text-muted);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @include mobile {
    padding: 0 12px;

    &__title {
      font-size: 15px;
    }

    &__user {
      display: none;
    }
  }
}
</style>
