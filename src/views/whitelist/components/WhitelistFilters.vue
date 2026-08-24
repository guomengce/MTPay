<template>
  <div class="whitelist-filters">
    <el-select
      v-model="role"
      placeholder="白名單角色"
      clearable
      :disabled="loading"
      @change="emit('change')"
    >
      <el-option label="付款人" :value="1" />
      <el-option label="收款人" :value="2" />
    </el-select>

    <el-select
      v-model="entityType"
      placeholder="主體類型"
      clearable
      :disabled="loading"
      @change="emit('change')"
    >
      <el-option label="公司" :value="1" />
      <el-option label="個人" :value="2" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading?: boolean }>();
const role = defineModel<1 | 2>('role');
const entityType = defineModel<1 | 2>('entityType');
const emit = defineEmits<{ (event: 'change'): void }>();
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
