<template>
  <div class="responsive-card-list">
    <article
      v-for="item in items"
      :key="item.key"
      class="responsive-card-list__card"
      :class="[{ 'is-pending': item.pending }, item.accent ? `is-${item.accent}` : '']"
    >
      <header class="responsive-card-list__header">
        <div class="responsive-card-list__title">
          <strong>{{ item.title }}</strong>
          <span v-if="item.subtitle">{{ item.subtitle }}</span>
        </div>
        <StatusBadge
          v-if="item.status"
          :label="item.status.label"
          :type="item.status.type"
          :effect="item.status.effect"
        />
      </header>

      <div class="responsive-card-list__fields">
        <div v-for="field in item.fields" :key="field.label" class="responsive-card-list__field">
          <span class="responsive-card-list__label">{{ field.label }}</span>
          <div class="responsive-card-list__content">
            <StatusBadge
              v-if="field.badge"
              :label="field.badge.label"
              :type="field.badge.type"
              :effect="field.badge.effect"
            />
            <span v-else class="responsive-card-list__value" :class="{ 'is-strong': field.strong, 'is-mono': field.mono }">
              {{ field.value || '—' }}
            </span>
            <small v-if="field.subValue">{{ field.subValue }}</small>
          </div>
        </div>
      </div>

      <div v-if="visibleActions(item).length" class="responsive-card-list__actions" :style="actionStyle(item)">
        <el-button
          v-for="action in visibleActions(item)"
          :key="action.key"
          :type="action.type"
          :plain="action.plain"
          :icon="action.icon"
          @click="emit('action', action.key, item.key)"
        >{{ action.label }}</el-button>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface ResponsiveCardBadge {
  label: string;
  type?: StatusBadgeType;
  effect?: 'pending';
}

export interface ResponsiveCardField {
  label: string;
  value?: string;
  subValue?: string;
  badge?: ResponsiveCardBadge;
  strong?: boolean;
  mono?: boolean;
}

export interface ResponsiveCardAction {
  key: string;
  label: string;
  icon?: unknown;
  type?: 'primary' | 'warning' | 'danger' | 'info';
  plain?: boolean;
  visible?: boolean;
}

export interface ResponsiveCardItem {
  key: string;
  title: string;
  subtitle?: string;
  status?: ResponsiveCardBadge;
  pending?: boolean;
  accent?: 'primary' | 'warning' | 'success' | 'danger';
  fields: ResponsiveCardField[];
  actions?: ResponsiveCardAction[];
}

defineProps<{ items: ResponsiveCardItem[] }>();
const emit = defineEmits<{ (e: 'action', actionKey: string, itemKey: string): void }>();

function visibleActions(item: ResponsiveCardItem) {
  return item.actions?.filter((action) => action.visible !== false) ?? [];
}

function actionStyle(item: ResponsiveCardItem) {
  const count = visibleActions(item).length;
  return { gridTemplateColumns: count <= 1 ? 'minmax(0, 1fr)' : `repeat(${count}, minmax(0, 1fr))` };
}
</script>

<style scoped lang="scss">
.responsive-card-list { display: none; }

@include mobile {
  .responsive-card-list { display: grid; gap: 12px; }

  .responsive-card-list__card {
    position: relative;
    display: grid;
    gap: 10px;
    overflow: hidden;
    padding: 15px;
    border: 1px solid #d8e7ea;
    border-radius: 14px;
    background: linear-gradient(180deg, #fff, #fbfefe);
    box-shadow: 0 9px 24px rgb(15 63 82 / 8%);

    &::before { position: absolute; top: 0; right: 0; left: 0; height: 3px; background: #0aa39b; content: ''; }
    &.is-warning::before { background: #f59e0b; }
    &.is-success::before { background: #18a66f; }
    &.is-danger::before { background: #ef5b62; }
  }

  .responsive-card-list__header { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .responsive-card-list__title { display: grid; min-width: 0; gap: 4px; }
  .responsive-card-list__title strong { overflow-wrap: anywhere; color: #162a43; font-size: 15px; }
  .responsive-card-list__title span { color: #7b8b9f; font-size: 12px; }
  .responsive-card-list__fields { display: grid; }
  .responsive-card-list__field { display: grid; min-height: 40px; align-items: center; padding: 8px 0; border-bottom: 1px dashed #dfe9ee; grid-template-columns: 70px minmax(0, 1fr); gap: 10px; }
  .responsive-card-list__field:last-child { border-bottom: 0; }
  .responsive-card-list__label { color: #698096; font-size: 12px; }
  .responsive-card-list__content { display: grid; min-width: 0; gap: 3px; color: #31465d; font-size: 13px; }
  .responsive-card-list__value { overflow-wrap: anywhere; }
  .responsive-card-list__value.is-strong { color: #162a43; font-weight: 700; }
  .responsive-card-list__value.is-mono { font-family: ui-monospace, Consolas, monospace; word-break: break-all; }
  .responsive-card-list__content small { color: #7b8b9f; font-size: 12px; }
  .responsive-card-list__actions { display: grid; gap: 8px; padding-top: 10px; border-top: 1px solid #e4edef; }
  .responsive-card-list__actions :deep(.el-button) { width: 100%; min-width: 0; margin-left: 0; }
}
</style>
