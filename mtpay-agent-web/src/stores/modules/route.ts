import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

import type { MenuItem } from '@/types/router';

export const useRouteStore = defineStore('route', () => {
  const menus = ref<MenuItem[]>([]);

  function setMenus(value: MenuItem[]) {
    menus.value = value;
  }

  function generateMenus(routes: RouteRecordRaw[]) {
    const nextMenus = routes
      .filter((route) => !route.meta?.hidden)
      .map((route) => ({
        path: route.path,
        title: String(route.meta?.title || ''),
        icon: String(route.meta?.icon || ''),
      }));

    setMenus(nextMenus);
    return nextMenus;
  }

  return {
    menus,
    setMenus,
    generateMenus,
  };
});
