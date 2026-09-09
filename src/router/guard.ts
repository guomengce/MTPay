import { getLoginChallenge, clearLoginChallenge } from '@/utils/loginChallenge';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';
import { usePageLoadingStore } from '@/stores/modules/pageLoading';
import { fetchAgentProfile } from '@/api/modules/auth';

let initialNavigation = true;

router.beforeEach(async (to) => {
  if (initialNavigation) usePageLoadingStore().startRoute();
  const authStore = useAuthStore();
  // 仅当前运行期间已成功取得用户资料，才可确认会话有效并跳过登录页。
  // 本地存储里单独存在 Token 不代表它仍有效。
  if ((to.name === 'Login' || to.name === 'TwoFactor') && authStore.isLoggedIn && authStore.profileReady) {
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
  if(to.meta?.requiresAuth&&authStore.isLoggedIn&&!authStore.profileReady){const result=await fetchAgentProfile();authStore.setUserInfo({id:String(result.id),name:result.company_name,role:'agent',agentCode:result.agent_code,companyName:result.company_name,email:result.email,phone:result.phone,status:result.status,statusName:result.status_name,activatedAt:result.activated_at,lastLoginAt:result.last_login_at,cryptoEnabled:Boolean(result.crypto_enabled)});}
  if(to.meta?.cryptoOnly&&!authStore.cryptoEnabled)return{path:'/dashboard',replace:true};

  if (to.name === 'TwoFactor' && !getLoginChallenge()) return { name: 'Login', replace: true };
  if (to.name !== 'TwoFactor') clearLoginChallenge();
  return true;
});

router.afterEach(() => {
  if (!initialNavigation) return;
  initialNavigation = false;
  usePageLoadingStore().finishRoute();
});
router.onError(() => {
  if (!initialNavigation) return;
  initialNavigation = false;
  usePageLoadingStore().finishRoute();
});
