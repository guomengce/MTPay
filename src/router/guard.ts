import { getLoginChallenge, clearLoginChallenge } from '@/utils/loginChallenge';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';
import { usePageLoadingStore } from '@/stores/modules/pageLoading';

router.beforeEach((to) => {
  usePageLoadingStore().startRoute();
  const authStore = useAuthStore();
  if ((to.name === 'Login' || to.name === 'TwoFactor') && authStore.isLoggedIn) {
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

  if (to.name === 'TwoFactor' && !getLoginChallenge()) return { name: 'Login', replace: true };
  if (to.name !== 'TwoFactor') clearLoginChallenge();
  return true;
});

router.afterEach(() => usePageLoadingStore().finishRoute());
router.onError(() => usePageLoadingStore().finishRoute());
