import { watch } from 'vue';

export const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

interface IdleLogoutOptions {
  getToken: () => string;
  onTimeout: () => void;
}

/** 登录后监听用户操作；刷新页面重新计时，后台恢复时按实际时间检查。 */
export function setupIdleLogout({ getToken, onTimeout }: IdleLogoutOptions) {
  const events = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;
  const listenerOptions = { capture: true, passive: true };
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastActivity = 0;
  let active = false;

  function stop() {
    active = false;
    clearTimeout(timer);
    events.forEach((event) => window.removeEventListener(event, onActivity, true));
    window.removeEventListener('focus', checkTimeout);
    document.removeEventListener('visibilitychange', checkTimeout);
  }

  function checkTimeout() {
    if (!active) return;
    clearTimeout(timer);
    const remaining = IDLE_TIMEOUT_MS - (Date.now() - lastActivity);
    if (remaining <= 0) {
      stop();
      onTimeout();
      return;
    }
    timer = setTimeout(checkTimeout, remaining);
  }

  function onActivity(event: Event) {
    if (!active || !event.isTrusted) return;
    // 定时器可能被后台标签页或设备休眠延迟，不能让超时后的操作续期。
    if (Date.now() - lastActivity >= IDLE_TIMEOUT_MS) {
      checkTimeout();
      return;
    }
    lastActivity = Date.now();
  }

  const unwatch = watch(getToken, (token) => {
    stop();
    if (!token) {
      return;
    }
    lastActivity = Date.now();
    active = true;
    events.forEach((event) => window.addEventListener(event, onActivity, listenerOptions));
    window.addEventListener('focus', checkTimeout);
    document.addEventListener('visibilitychange', checkTimeout);
    checkTimeout();
  }, { immediate: true, flush: 'sync' });

  return () => {
    unwatch();
    stop();
  };
}
