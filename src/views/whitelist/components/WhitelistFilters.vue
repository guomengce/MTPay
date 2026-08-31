<template>
  <div class="whitelist-filters">
    <el-select
      v-model="role"
      :placeholder="t('whitelist.role')"
      clearable
      :disabled="loading"
      @change="emit('change')"
    >
      <el-option :label="t('whitelist.payer')" :value="1" /><el-option :label="t('whitelist.payee')" :value="2" />
    </el-select>

    <el-select
      v-model="entityType"
      :placeholder="t('whitelist.entityType')"
      clearable
      :disabled="loading"
      @change="emit('change')"
    >
      <el-option :label="t('whitelist.company')" :value="1" /><el-option :label="t('whitelist.individual')" :value="2" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
defineProps<{ loading?: boolean }>();
const role = defineModel<1 | 2>('role');
const entityType = defineModel<1 | 2>('entityType');
const emit = defineEmits<{ (event: 'change'): void }>();
const { t } = useI18n();
</script>

<style scoped lang="scss">
.whitelist-filters {
  --whitelist-filter-height: 40px;

  display: grid;
  min-width: 330px;
  grid-template-columns: repeat(2, minmax(150px, 190px));
  gap: 10px;

  :deep(.el-select) {
    --el-component-size: var(--whitelist-filter-height);
    width: 100%;
  }

  :deep(.el-select__wrapper) {
    min-height: var(--whitelist-filter-height);
  }

  @include mobile {
    width: 100%;
    min-width: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
