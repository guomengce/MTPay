<template>
  <el-select
    v-model="model"
    class="country-select"
    :placeholder="selectPlaceholder"
    :disabled="disabled"
    :clearable="clearable"
    filterable
    default-first-option
    :filter-method="filterCountries"
    @visible-change="resetFilter"
  >
    <el-option
      v-for="country in visibleCountries"
      :key="country.code"
      :label="country.displayLabel"
      :value="country.code"
    >
      <span class="country-option">
        <span>{{ country.displayLabel }}</span>
        <small>{{ country.code }}</small>
      </span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
/**
 * 公共国家／地区选择器。
 * - 根据当前语言展示简体中文、繁体中文或英文名称；
 * - v-model 统一返回 ISO 3166-1 alpha-2 两位代码；
 * - 支持按当前语言名称、三语言名称或两位代码搜索。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { getLocalizedCountryOptions } from '@/constants/countries';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
  }>(),
  {
    placeholder: '',
    disabled: false,
    clearable: true,
  },
);

const model = defineModel<string>({ default: '' });
const { t, locale } = useI18n();
const localizedCountries = computed(() => getLocalizedCountryOptions(locale.value));
const visibleCountries = ref(localizedCountries.value);
const selectPlaceholder = computed(() => props.placeholder || t('country.placeholder'));

function filterCountries(keyword: string) {
  const query = keyword.trim().toLocaleLowerCase('zh-Hant');
  visibleCountries.value = query
    ? localizedCountries.value.filter(
        ({ code, displayLabel, searchLabels }) =>
          code.toLowerCase().includes(query) ||
          displayLabel.toLocaleLowerCase().includes(query) ||
          searchLabels.some((name) => name.toLocaleLowerCase().includes(query)),
      )
    : localizedCountries.value;
}

function resetFilter() {
  visibleCountries.value = localizedCountries.value;
}
watch(localizedCountries, resetFilter);
</script>

<style scoped lang="scss">
.country-select {
  width: 100%;
}

.country-option {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  small {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>
