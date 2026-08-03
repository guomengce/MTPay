import { appConfig } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

router.beforeEach((to) => {
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
