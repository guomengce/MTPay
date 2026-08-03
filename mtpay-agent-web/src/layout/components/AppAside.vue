<template>
  <aside class="app-aside">
    <div class="app-aside__brand">
      <span class="app-aside__mark">M</span>
      <span v-if="!appStore.sidebarCollapsed" class="app-aside__name">MTPay</span>
    </div>
    <el-menu
      class="app-aside__menu"
      :default-active="route.path"
      :collapse="appStore.sidebarCollapsed && appStore.device !== 'mobile'"
      router
    >
      <el-menu-item v-for="menu in routeStore.menus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="resolveIcon(menu.icon)" /></el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import {
  DataBoard,
  Download,
  List,
  Switch,
  Tickets,
  Upload,
  User,
  Menu as MenuIcon,
} from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useRouteStore } from '@/stores/modules/route';

const route = useRoute();
const appStore = useAppStore();
const routeStore = useRouteStore();

const icons = {
  DataBoard,
  Download,
  List,
  Switch,
  Tickets,
  Upload,
  User,
};

function resolveIcon(name: string) {
  return icons[name as keyof typeof icons] || MenuIcon;
}
</script>

<style scoped lang="scss">
.app-aside {
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  background: #101828;
  box-shadow: 1px 0 0 rgb(255 255 255 / 6%) inset;

  &__brand {
    display: flex;
    height: var(--app-header-height);
    min-height: var(--app-header-height);
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    color: #ffffff;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  &__mark {
    display: inline-flex;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: var(--app-primary);
    font-weight: 700;
  }

  &__name {
    overflow: hidden;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__menu {
    flex: 1;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background: transparent;
  }

  :deep(.el-menu-item) {
    color: #c7d1df;
  }

  :deep(.el-menu-item.is-active) {
    color: #ffffff;
    background: rgb(22 93 255 / 24%);
  }

  :deep(.el-menu-item:hover) {
    background: rgb(255 255 255 / 8%);
  }
}
</style>
