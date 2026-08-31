<template>
  <el-dropdown trigger="click" @command="changeLocale">
    <button class="language-switcher" type="button" :aria-label="t('common.language.label')">
      <!-- <el-icon><Connection /></el-icon> -->
      <span>{{ currentLabel }}</span>
      <el-icon><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="option in options" :key="option.value" :command="option.value" :class="{ 'is-active': option.value === localeStore.locale }">
          {{ t(option.labelKey) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown, Connection } from '@element-plus/icons-vue';
import type { AppLocale } from '@/locales';
import { useLocaleStore } from '@/stores/modules/locale';

const { t } = useI18n();
const localeStore = useLocaleStore();
const options: Array<{ value: AppLocale; labelKey: string }> = [
  { value: 'zh-CN', labelKey: 'common.language.zhCN' },
  { value: 'zh-HK', labelKey: 'common.language.zhHK' },
  { value: 'en-US', labelKey: 'common.language.enUS' },
];
const currentLabel = computed(() => t(options.find((item) => item.value === localeStore.locale)?.labelKey || 'common.language.zhHK'));
function changeLocale(value: AppLocale) { localeStore.setLocale(value); }
</script>

<style scoped lang="scss">
.language-switcher { display: inline-flex; height: 36px; align-items: center; gap: 6px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--portal-text); background: transparent; cursor: pointer; font-size: 13px; }
.language-switcher:hover { background: rgb(16 170 164 / 8%); }
@include mobile { .language-switcher span { display: none; } }
</style>
