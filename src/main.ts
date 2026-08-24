import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhTw from 'element-plus/es/locale/lang/zh-tw';
import 'element-plus/dist/index.css';
import 'remixicon/fonts/remixicon.css';

import App from './App.vue';
import { installTraditionalChinese } from './plugins/traditionalChinese';
import router from './router';
import { pinia } from './stores';
import './router/guard';
import './styles/index.scss';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(ElementPlus, { locale: zhTw });

app.mount('#app');
installTraditionalChinese();
