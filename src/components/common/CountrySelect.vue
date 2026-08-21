<template>
  <el-select
    v-model="model"
    class="country-select"
    :placeholder="placeholder"
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
      :label="country.label"
      :value="emitLabel ? country.label : country.code"
    >
      <span class="country-option">
        <span>{{ country.label }}</span>
        <small>{{ country.code }}</small>
      </span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
/**
 * 公共国家／地区选择器。
 * - 展示繁体中文名称；
 * - 默认 v-model 返回 ISO 3166-1 alpha-2 代码；
 * - 通过 emitLabel 可切换为返回繁体中文名称（适配需要直接提交名称的后端）；
 * - 支持按繁体名称或两位代码搜索。
 */
import { ref } from 'vue';

import { COUNTRY_OPTIONS } from '@/constants/countries';

withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    emitLabel?: boolean;
  }>(),
  {
    placeholder: '請選擇國家／地區',
    disabled: false,
    clearable: true,
    emitLabel: false,
  },
);

const model = defineModel<string>({ default: '' });
const visibleCountries = ref(COUNTRY_OPTIONS);

function filterCountries(keyword: string) {
  const query = keyword.trim().toLocaleLowerCase('zh-Hant');
  visibleCountries.value = query
    ? COUNTRY_OPTIONS.filter(
        ({ code, label }) =>
          code.toLowerCase().includes(query) || label.toLocaleLowerCase('zh-Hant').includes(query),
      )
    : COUNTRY_OPTIONS;
}

function resetFilter() {
  visibleCountries.value = COUNTRY_OPTIONS;
}
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
