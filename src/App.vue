<template>
  <el-config-provider :locale="elementLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import zhTw from 'element-plus/es/locale/lang/zh-tw';
import { useLocaleStore } from '@/stores/modules/locale';
import { appConfig } from '@/config';

const localeStore = useLocaleStore();
const route = useRoute();
const { locale, t, te } = useI18n({ useScope: 'global' });
const elementLocales = { 'zh-CN': zhCn, 'zh-HK': zhTw, 'en-US': en };
const elementLocale = computed(() => elementLocales[localeStore.locale]);

watch(
  () => localeStore.locale,
  (value) => {
    locale.value = value;
    document.documentElement.lang = value;
  },
  { immediate: true },
);

watch(
  [() => localeStore.locale, () => route.meta.title],
  () => {
    const titleKey = String(route.meta.title || '');
    const pageTitle = titleKey && te(titleKey) ? t(titleKey) : titleKey;
    document.title = pageTitle ? `${pageTitle} - ${appConfig.title}` : appConfig.title;
  },
  { immediate: true },
);
</script>
