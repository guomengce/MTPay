import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'remixicon/fonts/remixicon.css';

import App from './App.vue';
import { i18n } from './locales';
import router from './router';
import { pinia } from './stores';
import { useAuthStore } from './stores/modules/auth';
import { setupIdleLogout } from './utils/idleLogout';
import './router/guard';
import './styles/index.scss';

const app = createApp(App);

app.use(pinia);

const authStore = useAuthStore(pinia);
const stopIdleLogout = setupIdleLogout({
  getToken: () => authStore.token,
  onTimeout: () => {
    authStore.logout();
    void router.isReady().then(() => {
      if (!authStore.isLoggedIn) return router.replace({ name: 'Login' });
    });
  },
});
if (import.meta.hot) import.meta.hot.dispose(stopIdleLogout);
app.use(router);
app.use(i18n);
app.use(ElementPlus);

app.mount('#app');
