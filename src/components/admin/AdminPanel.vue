<template>
  <section class="admin-panel">
    <header v-if="title || $slots.extra" class="admin-panel__header">
      <div class="admin-panel__title">
        <span v-if="icon" class="admin-panel__icon">
          <el-icon><component :is="icon" /></el-icon>
        </span>
        <div>
          <h2 v-if="title">{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="$slots.extra" class="admin-panel__extra">
        <slot name="extra" />
      </div>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  icon?: unknown;
}>();
</script>

<style scoped lang="scss">
.admin-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dce5ef;
  border-radius: 8px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 18px 42px rgb(16 42 80 / 7%);

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    padding: 24px 28px;
    border-bottom: 1px solid #e2e9f2;
  }

  &__title {
    display: flex;
    min-width: 0;
    align-items: center;
    flex: 0 0 auto;
    gap: 16px;
  }

  &__extra {
    display: flex;
    min-width: 0;
    flex: 1 1 auto;
    align-items: center;
    justify-content: flex-end;
  }

  &__extra > :deep(*) {
    min-width: 0;
  }

  &__extra :deep(.filter-bar) {
    --mt-filter-control-height: 36px;
    --filter-input-width: 220px;

    width: fit-content;
    max-width: 100%;
    margin-left: auto;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    gap: 8px 10px;
  }

  &__extra :deep(.filter-bar > .filter-actions),
  &__extra :deep(.filter-bar > .filter-bar__actions) {
    margin-left: 0 !important;
  }

  &__extra :deep(.filter-actions .el-button),
  &__extra :deep(.filter-bar__actions .el-button) {
    width: auto;
    min-width: 64px;
    height: 34px;
    min-height: 34px;
    padding-inline: 13px;
  }

  &__icon {
    display: inline-flex;
    width: 52px;
    height: 52px;
    flex: 0 0 52px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #1f73f2;
    background: linear-gradient(135deg, #e9f4ff, #eef0ff);
    font-size: 26px;
  }

  h2 {
    margin: 0;
    color: #0a1b35;
    font-size: 23px;
    font-weight: 900;
    white-space: nowrap;
  }

  p {
    margin: 5px 0 0;
    color: #63728a;
    font-weight: 650;
  }

  @include narrow {
    &__header {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    &__extra {
      width: 100%;
      flex-basis: 100%;
      justify-content: stretch;
    }

    &__extra :deep(.filter-bar) {
      width: 100%;
      margin-left: 0;
    }
  }

  @include mobile {
    &__header {
      align-items: flex-start;
      flex-direction: column;
      padding: 18px;
    }

    &__extra {
      width: 100%;
      justify-content: stretch;
    }

    &__extra :deep(.filter-actions .el-button),
    &__extra :deep(.filter-bar__actions .el-button) {
      width: 100%;
    }

    &__extra :deep(.filter-bar) {
      width: 100%;
      margin-left: 0;
    }

    h2 {
      font-size: 20px;
    }
  }
}
</style>
