<template>
  <aside
    class="app-aside"
    :class="{ 'is-collapsed': isCollapsed, 'is-mobile': isMobile }"
  >
    <div class="app-aside__brand">
      <img class="app-aside__logo" src="/assets/mtpay-logo-official.png" alt="MTPay" />
    </div>

    <div v-if="!isCollapsed" class="app-aside__divider" aria-hidden="true" />

    <nav class="app-aside__nav" :aria-label="t('ui.mainNavigation')">
      <ul class="app-aside__menu">
        <li
          v-for="menu in routeStore.menus"
          :key="menu.path"
          class="app-aside__menu-item"
          :class="{ 'is-active': isActive(menu.path) }"
          :aria-current="isActive(menu.path) ? 'page' : undefined"
        >
          <RouterLink :to="menu.path" class="app-aside__menu-link">
            <span class="app-aside__menu-icon">
              <i :class="resolveIcon(menu.icon)" aria-hidden="true" />
            </span>
            <span v-if="!isCollapsed" class="app-aside__menu-label">{{ t(menu.title) }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div v-if="!isCollapsed" class="app-aside__decoration" aria-hidden="true">
      <div class="app-aside__decoration-orbit" />
      <div class="app-aside__decoration-orbit app-aside__decoration-orbit--alt" />
      <i class="app-aside__decoration-dot app-aside__decoration-dot--left" />
      <i class="app-aside__decoration-dot app-aside__decoration-dot--right" />
      <div class="app-aside__decoration-platform" />
      <div class="app-aside__decoration-shield">
        <span class="app-aside__decoration-shield-layer" />
        <el-icon><Check /></el-icon>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useRouteStore } from '@/stores/modules/route';

const route = useRoute();
const appStore = useAppStore();
const routeStore = useRouteStore();
const { t } = useI18n();

const isMobile = computed(() => appStore.device === 'mobile');
const isCollapsed = computed(() => appStore.sidebarCollapsed && !isMobile.value);

const icons = {
  Grid: 'ri-dashboard-3-line',
  Wallet: 'ri-wallet-3-line',
  Switch: 'ri-exchange-dollar-line',
  List: 'ri-user-follow-line',
  Upload: 'ri-hand-coin-line',
  Tickets: 'ri-file-list-3-line',
  User: 'ri-shield-user-line',
};

function resolveIcon(name: string) {
  return icons[name as keyof typeof icons] || icons.Grid;
}

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`);
}
</script>

<style scoped lang="scss">
.app-aside {
  position: relative;
  display: flex;
  height: 100vh;
  min-width: 0;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f5fbff 55%, #eefaff 100%);
  border-right: 1px solid var(--portal-border);
  box-shadow: 1px 0 12px rgb(28 77 120 / 4%);
  overflow: hidden;
  --portal-aside-width: 240px;
  --portal-aside-collapsed-width: 72px;
}

.app-aside__brand {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 30px 28px 6px;
  flex: 0 0 auto;
}

.app-aside__logo {
  display: block;
  width: 168px;
  max-width: 100%;
  height: auto;
  margin:0 auto;
}

.app-aside__nav {
  position: relative;
  z-index: 2;
  flex: 1 1 auto;
  min-height: 0;
  padding: 10px 18px 18px;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(40 120 255 / 20%) transparent;
}

.app-aside__divider {
  position: relative;
  height: 16px;
  margin: 10px 20px 0;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    content: '';
    transform: translateY(-50%);
    background: linear-gradient(90deg, transparent 0%, #10aaa4 22%, #2dd4bf 50%, #2878ff 78%, transparent 100%);
  }

  &::before {
    opacity: 0.95;
  }
}

.app-aside__nav::-webkit-scrollbar {
  width: 6px;
}

.app-aside__nav::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgb(40 120 255 / 18%);
}

.app-aside__nav::-webkit-scrollbar-track {
  background: transparent;
}

.app-aside__menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-aside__menu-item {
  position: relative;
}

.app-aside__menu-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 50px;
  padding: 0 14px;
  border-radius: 11px;
  color: #08234a;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgb(16 170 164 / 7%);
  }

  &:focus-visible {
    outline: 2px solid #10aaa4;
    outline-offset: 2px;
  }
}

.app-aside__menu-icon {
  display: inline-flex;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: transparent;
  color: #7387a2;
  font-size: 20px;
  font-weight: 400;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  i {
    font-weight: 400;
    line-height: 1;
  }
}

.app-aside__menu-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-aside__menu-item.is-active {
  .app-aside__menu-link {
    color: #082551;
    background: linear-gradient(90deg, rgb(15 181 174 / 13%), rgb(40 120 255 / 5%));
    font-weight: 700;
  }

  .app-aside__menu-icon {
    background: rgb(16 170 164 / 12%);
    color: #10aaa4;
    box-shadow: inset 0 0 0 1px rgb(16 170 164 / 9%);
  }

  &::before {
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: -2px;
    width: 4px;
    border-radius: 2px;
    background: linear-gradient(180deg, #10aaa4, #2878ff);
    content: '';
  }
}

.app-aside__decoration {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  left: 0;
  height: 250px;
  pointer-events: none;
  opacity: 0.78;
  mask-image: linear-gradient(180deg, transparent, #000 28%);
}

.app-aside__decoration-orbit {
  position: absolute;
  top: 47%;
  left: 50%;
  width: 190px;
  height: 138px;
  border: 1px solid rgb(72 151 235 / 20%);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(67deg);
}

.app-aside__decoration-orbit--alt {
  width: 178px;
  height: 112px;
  border-color: rgb(16 170 164 / 22%);
  transform: translate(-50%, -50%) rotate(-24deg);
}

.app-aside__decoration-platform {
  position: absolute;
  bottom: 23px;
  left: 50%;
  width: 150px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgb(117 205 245 / 35%);
  background: linear-gradient(180deg, rgb(255 255 255 / 82%), rgb(120 213 245 / 30%));
  transform: translateX(-50%);
  box-shadow:
    inset 0 -7px 10px rgb(37 177 206 / 16%),
    0 12px 15px rgb(36 165 194 / 16%);
}

.app-aside__decoration-dot {
  position: absolute;
  z-index: 2;
  width: 7px;
  height: 7px;
  border: 2px solid #35d5d1;
  border-radius: 50%;
  box-shadow: 0 0 8px rgb(53 213 209 / 35%);
}

.app-aside__decoration-dot--left {
  bottom: 84px;
  left: 43px;
}

.app-aside__decoration-dot--right {
  top: 63px;
  right: 45px;
}

.app-aside__decoration-shield {
  position: absolute;
  top: 43%;
  left: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 108px;
  color: #dfffff;
  font-size: 37px;
  border: 2px solid rgb(255 255 255 / 85%);
  border-radius: 44% 44% 50% 50% / 20% 20% 72% 72%;
  background: linear-gradient(145deg, rgb(255 255 255 / 72%), rgb(48 210 216 / 28%));
  transform: translate(-50%, -50%);
  box-shadow:
    inset 0 0 22px rgb(255 255 255 / 80%),
    0 10px 22px rgb(39 176 207 / 20%);
  filter: drop-shadow(-8px 7px 0 rgb(61 196 225 / 18%));

  &::before {
    position: absolute;
    inset: 7px;
    border: 1px solid rgb(79 218 221 / 65%);
    border-radius: inherit;
    content: '';
  }

  .el-icon {
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 3px 5px rgb(39 177 186 / 22%));
  }
}

.app-aside.is-collapsed {
  .app-aside__brand {
    justify-content: center;
    padding: 28px 0 6px;
  }

  .app-aside__logo { width: 58px; }

  .app-aside__menu-link {
    justify-content: center;
    padding: 0;
  }

  .app-aside__decoration {
    display: none;
  }
}

.app-aside.is-mobile {
  .app-aside__decoration {
    display: none;
  }
}
</style>
