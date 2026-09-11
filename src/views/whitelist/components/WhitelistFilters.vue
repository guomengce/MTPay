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

    <el-select
      v-model="status"
      :placeholder="t('whitelistStatus.status')"
      clearable
      :disabled="loading"
      @change="emit('change')"
    >
      <el-option :label="t('whitelistStatus.pending')" :value="0" />
      <el-option :label="t('whitelistStatus.filesRequired')" :value="1" />
      <el-option :label="t('whitelistStatus.approved')" :value="2" />
      <el-option :label="t('whitelistStatus.rejected')" :value="3" />
      <el-option :label="t('whitelistStatus.disabled')" :value="4" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
defineProps<{ loading?: boolean }>();
const role = defineModel<1 | 2>('role');
const entityType = defineModel<1 | 2>('entityType');
const status = defineModel<0 | 1 | 2 | 3 | 4>('status');
const emit = defineEmits<{ (event: 'change'): void }>();
const { t } = useI18n();
</script>

<style scoped lang="scss">
.whitelist-filters {
  --whitelist-filter-height: 40px;

  display: grid;
  min-width: 330px;
  grid-template-columns: repeat(3, minmax(140px, 180px));
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

    > :last-child { grid-column: 1 / -1; }
  }
}
</style>


