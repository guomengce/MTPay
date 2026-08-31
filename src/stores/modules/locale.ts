import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { AppLocale } from '@/locales';

const LOCALE_KEY = 'mtpay-agent-locale';
const SUPPORTED_LOCALES = new Set<AppLocale>(['zh-CN', 'zh-HK', 'en-US']);

function initialLocale(): AppLocale {
  const saved = window.localStorage.getItem(LOCALE_KEY) as AppLocale | null;
  return saved && SUPPORTED_LOCALES.has(saved) ? saved : 'zh-HK';
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<AppLocale>(initialLocale());
  function setLocale(value: AppLocale) {
    locale.value = value;
    window.localStorage.setItem(LOCALE_KEY, value);
  }
  return { locale, setLocale };
});
