<template>
  <aside class="app-aside">
    <div class="app-aside__brand">
      <span class="app-aside__mark">M</span>
      <div v-if="!isCollapsed" class="app-aside__brand-text">
        <strong>MTPay</strong>
        <span>AGENT PORTAL</span>
      </div>
    </div>

    <div v-if="!isCollapsed" class="app-aside__agent">
      <span>目前代理</span>
      <strong>代理A · Apex Trading</strong>
      <el-icon><ArrowDown /></el-icon>
    </div>

    <p v-if="!isCollapsed" class="app-aside__label">代理功能</p>
    <el-menu class="app-aside__menu" :default-active="route.path" :collapse="isCollapsed" router>
      <el-menu-item v-for="menu in routeStore.menus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="resolveIcon(menu.icon)" /></el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
    </el-menu>

    <div class="app-aside__profile">
      <div class="app-aside__profile-main">
        <span class="app-aside__avatar">A</span>
        <div v-if="!isCollapsed">
          <strong>代理A · Apex Trading</strong>
          <span>finance@apex.test</span>
        </div>
        <el-icon v-if="!isCollapsed"><ArrowUp /></el-icon>
      </div>
      <el-button class="app-aside__logout" text @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        <span v-if="!isCollapsed">登出</span>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  Grid,
  List,
  Money,
  Switch,
  SwitchButton,
  Tickets,
  Upload,
  User,
  Wallet,
} from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { useRouteStore } from '@/stores/modules/route';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const routeStore = useRouteStore();
const isCollapsed = computed(() => appStore.sidebarCollapsed && appStore.device !== 'mobile');

const icons = {
  Grid,
  List,
  Money,
  Switch,
  Tickets,
  Upload,
  User,
  Wallet,
};

function resolveIcon(name: string) {
  return icons[name as keyof typeof icons] || Grid;
}

async function handleLogout() {
  authStore.logout();
  await router.replace({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.app-aside {
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  padding: 24px 16px 16px;
  color: #ffffff;
  background:
    radial-gradient(circle at 18% 0, rgb(13 173 181 / 20%), transparent 24%),
    linear-gradient(180deg, #051c3b 0%, #01122d 100%);
  box-shadow: 1px 0 0 rgb(255 255 255 / 8%) inset;

  &__brand {
    display: flex;
    min-height: 52px;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__mark,
  &__avatar {
    display: inline-flex;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #00152d;
    background: linear-gradient(135deg, #24d6c1, #10aab8);
    font-weight: 850;
  }

  &__brand-text {
    display: grid;
    gap: 3px;

    strong {
      font-size: 25px;
      line-height: 1;
    }

    span {
      color: #22ead7;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 1.4px;
    }
  }

  &__agent {
    position: relative;
    display: grid;
    gap: 8px;
    margin-bottom: 28px;
    padding: 14px 36px 14px 16px;
    border: 1px solid rgb(125 163 214 / 18%);
    border-radius: 8px;

    span {
      color: #8fa6c6;
      font-size: 12px;
      font-weight: 700;
    }

    strong {
      overflow: hidden;
      color: #ffffff;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-icon {
      position: absolute;
      top: 50%;
      right: 14px;
      transform: translateY(-50%);
    }
  }

  &__label {
    margin: 0 0 12px 8px;
    color: #8fa6c6;
    font-size: 12px;
    font-weight: 800;
  }

  &__menu {
    flex: 1;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background: transparent;
  }

  :deep(.el-menu-item) {
    height: 50px;
    margin: 4px 0;
    color: #d8e4f6;
    border-radius: 8px;
    font-weight: 800;
  }

  :deep(.el-menu-item.is-active) {
    color: #ffffff;
    background: linear-gradient(90deg, rgb(27 214 202 / 24%), rgb(68 124 187 / 20%));
    box-shadow:
      3px 0 0 #20d5c8 inset,
      -3px 0 0 #20d5c8 inset;
  }

  :deep(.el-menu-item:hover) {
    background: rgb(255 255 255 / 8%);
  }

  &__profile {
    overflow: hidden;
    border: 1px solid rgb(125 163 214 / 18%);
    border-radius: 8px;
  }

  &__profile-main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 12px;
    border-bottom: 1px solid rgb(125 163 214 / 14%);

    div {
      display: grid;
      min-width: 0;
      flex: 1;
      gap: 4px;
    }

    strong,
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      color: #8fa6c6;
      font-size: 12px;
    }
  }

  &__logout {
    width: 100%;
    justify-content: flex-start;
    padding: 18px 14px;
    color: #d8e4f6;
    font-weight: 800;
  }
}
</style>
