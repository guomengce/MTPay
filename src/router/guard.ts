import { appConfig } from '@/config';
import { ElLoading, type LoadingInstance } from 'element-plus';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

let routeLoading: LoadingInstance | null = null;

function startRouteLoading() {
  routeLoading?.close();
  routeLoading = ElLoading.service({
    lock: true,
    fullscreen: true,
    text: '页面加载中…',
    background: 'rgba(245, 249, 252, 0.72)',
    customClass: 'route-loading-mask',
  });
}

function stopRouteLoading() {
  routeLoading?.close();
  routeLoading = null;
}

router.beforeEach((to) => {
  startRouteLoading();
  const authStore = useAuthStore();
  const title = to.meta?.title ? `${String(to.meta.title)} - ${appConfig.title}` : appConfig.title;
  document.title = title;

  if (to.name === 'Login' && authStore.isLoggedIn) {
    return { path: '/dashboard', replace: true };
  }

  if (to.meta?.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
      replace: true,
    };
  }

  return true;
});

router.afterEach(stopRouteLoading);
router.onError(stopRouteLoading);
