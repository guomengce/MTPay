<template>
  <div
    class="app-layout"
    :class="{ 'is-mobile': isMobile, 'is-collapsed': appStore.sidebarCollapsed }"
  >
    <AppAside class="app-layout__aside" />
    <div
      v-if="isMobile && !appStore.sidebarCollapsed"
      class="app-layout__mask"
      @click="appStore.toggleSidebar"
    />
    <section class="app-layout__body">
      <AppHeader />
      <AppMain />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';

import AppAside from './components/AppAside.vue';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
import { useAppStore } from '@/stores/modules/app';
import { useRouteStore } from '@/stores/modules/route';
import { featureRoutes } from '@/router/modules';

const appStore = useAppStore();
const routeStore = useRouteStore();
const isMobile = computed(() => appStore.device === 'mobile');

function syncDevice() {
  appStore.setDevice(window.innerWidth <= 768 ? 'mobile' : 'desktop');
}

onMounted(() => {
  routeStore.generateMenus(featureRoutes);
  syncDevice();
  window.addEventListener('resize', syncDevice);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncDevice);
});
</script>

<style scoped lang="scss">
.app-layout {
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--app-bg);

  &__aside {
    width: var(--app-aside-width);
    flex: 0 0 var(--app-aside-width);
    transition:
      width 0.2s ease,
      flex-basis 0.2s ease,
      transform 0.2s ease;
  }

  &__body {
    display: flex;
    flex: 1;
    min-width: 0;
    height: 100%;
    flex-direction: column;
  }

  &__mask {
    position: fixed;
    inset: 0;
    z-index: 19;
    background: rgb(15 23 42 / 35%);
  }

  &.is-collapsed:not(.is-mobile) {
    .app-layout__aside {
      width: var(--app-aside-collapsed-width);
      flex-basis: var(--app-aside-collapsed-width);
    }
  }

  @include narrow {
    .app-layout__aside {
      width: var(--app-aside-narrow-width);
      flex-basis: var(--app-aside-narrow-width);
    }
  }

  @include mobile {
    .app-layout__aside {
      position: fixed;
      inset: 0 auto 0 0;
      z-index: 20;
      width: var(--app-aside-width);
      flex-basis: var(--app-aside-width);
      transform: translateX(0);
    }

    &.is-collapsed {
      .app-layout__aside {
        transform: translateX(-100%);
      }
    }
  }
}
</style>
