import { createI18n } from 'vue-i18n';
import enUS from './en-US';
import zhCN from './zh-CN';
import zhHK from './zh-HK';

export type AppLocale = 'zh-CN' | 'zh-HK' | 'en-US';

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-HK',
  fallbackLocale: 'zh-HK',
  messages: { 'zh-CN': zhCN, 'zh-HK': zhHK, 'en-US': enUS },
});
