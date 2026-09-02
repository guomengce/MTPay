<template>
  <el-config-provider :locale="elementLocale">
    <router-view />
    <Transition name="app-loading-fade">
      <div v-if="active" class="app-route-loading" role="status" :aria-label="t('ui.routeLoading')">
        <span class="app-route-loading__spinner" aria-hidden="true"></span>
      </div>
    </Transition>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import zhTw from 'element-plus/es/locale/lang/zh-tw';
import { useLocaleStore } from '@/stores/modules/locale';
import { appConfig } from '@/config';
import { usePageLoadingStore } from '@/stores/modules/pageLoading';

const localeStore = useLocaleStore();
const route = useRoute();
const { locale, t, te } = useI18n({ useScope: 'global' });
const elementLocales = { 'zh-CN': zhCn, 'zh-HK': zhTw, 'en-US': en };
const elementLocale = computed(() => elementLocales[localeStore.locale]);
const { active } = storeToRefs(usePageLoadingStore());

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

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}

.app-route-loading {
  position: fixed;
  z-index: 10000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f7fb;

  &__spinner {
    width: 38px;
    height: 38px;
    box-sizing: border-box;
    border: 3px solid rgb(9 158 151 / 16%);
    border-top-color: #099e97;
    border-radius: 50%;
    animation: app-route-spin 0.75s linear infinite;
  }
}

.app-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.app-loading-fade-leave-to {
  opacity: 0;
}

@keyframes app-route-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .app-route-loading__spinner { animation-duration: 1.5s; }
}
</style>
