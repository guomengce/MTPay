<template>
  <dl class="detail-field-grid">
    <div
      v-for="item in items"
      :key="item.label"
      class="detail-field-grid__item"
      :class="{ 'is-wide': item.wide }"
    >
      <dt>{{ item.label }}</dt>
      <dd :class="{ 'is-mono': item.mono, 'is-accent': item.accent }">
        <span>{{ item.displayValue ?? item.value }}</span>
        <el-button
          v-if="item.copyable"
          text
          circle
          :icon="DocumentCopy"
          :aria-label="`${t('common.actions.copy')} ${item.label}`"
          @click="emit('copy', item)"
        />
      </dd>
    </div>
  </dl>
</template>

<script lang="ts">
export interface DetailFieldItem {
  label: string;
  value: string;
  displayValue?: string;
  wide?: boolean;
  mono?: boolean;
  accent?: boolean;
  copyable?: boolean;
}
</script>

<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

defineProps<{ items: DetailFieldItem[] }>();
const emit = defineEmits<{ (event: 'copy', item: DetailFieldItem): void }>();
const { t } = useI18n();
</script>

<style scoped lang="scss">
.detail-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 32px;
  margin: 0;

  &__item {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(92px, 0.42fr) minmax(0, 1fr);
    align-items: start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px dashed #e1e9f0;

    &.is-wide {
      grid-column: 1 / -1;
    }
  }

  dt {
    color: #718298;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.6;
  }

  dd {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    color: #203249;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.6;

    span {
      min-width: 0;
      overflow-wrap: anywhere;
      white-space: normal;
    }

    &.is-mono span {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 13px;
      font-weight: 500;
    }

    &.is-accent span {
      color: #078c84;
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    .el-button {
      width: 28px;
      height: 28px;
      min-width: 28px;
      min-height: 28px;
      flex: none;
      margin-top: -3px;
    }
  }
}

@include mobile {
  .detail-field-grid {
    grid-template-columns: minmax(0, 1fr);

    &__item,
    &__item.is-wide {
      grid-column: auto;
      grid-template-columns: minmax(0, 1fr);
      gap: 5px;
      padding: 12px 0;
    }

    dd { width: 100%; }
  }
}
</style>
