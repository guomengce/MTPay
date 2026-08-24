import { defineStore } from 'pinia';
import { ref } from 'vue';

/** 全局页面切换进度，仅用于路由级加载，不替代表格和按钮的局部 loading。 */
export const usePageLoadingStore = defineStore('pageLoading', () => {
  const active = ref(false);
  let pending = 0;
  let startedAt = 0;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  function start() {
    if (closeTimer) clearTimeout(closeTimer);
    if (pending === 0) startedAt = Date.now();
    pending += 1;
    active.value = true;
  }

  function finish() {
    pending = Math.max(0, pending - 1);
    if (pending > 0) return;
    const delay = Math.max(0, 260 - (Date.now() - startedAt));
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      active.value = false;
      closeTimer = undefined;
    }, delay);
  }

  return { active, start, finish };
});
