<template>
  <el-dialog
    v-bind="$attrs"
    :model-value="modelValue"
    :width="width"
    :class="['agent-dialog', `agent-dialog--${tone}`]"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    :align-center="alignCenter"
    @open="emit('open')"
    @closed="emit('closed')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <slot name="header">
        <div class="agent-dialog__heading">
          <span v-if="icon" class="agent-dialog__icon" aria-hidden="true">
            <el-icon><component :is="icon" /></el-icon>
          </span>
          <div class="agent-dialog__copy">
            <h2>{{ title }}</h2>
            <p v-if="description">{{ description }}</p>
          </div>
        </div>
      </slot>
    </template>
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{
  modelValue: boolean;
  title: string;
  description?: string;
  icon?: Component;
  tone?: 'brand' | 'warning' | 'danger';
  width?: string;
  closeOnClickModal?: boolean;
  destroyOnClose?: boolean;
  alignCenter?: boolean;
}>(), {
  description: '', icon: undefined, tone: 'brand', width: 'min(520px, calc(100vw - 24px))',
  closeOnClickModal: false, destroyOnClose: true, alignCenter: true,
});
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'open'): void;
  (event: 'closed'): void;
}>();
</script>

<style lang="scss">
.agent-dialog {
  --agent-dialog-accent: #087ca7;
  --agent-dialog-soft: #edf8fc;
  --agent-dialog-border: #b9deea;

  .el-dialog__header {
    overflow: hidden;
    background: radial-gradient(circle at 8% -80%, rgb(37 99 235 / 8%) 0, transparent 58%),
      linear-gradient(105deg, #fbfdff 0%, #f6fafc 58%, #f4fbfa 100%);

    &::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, #2563eb, #00b8e6 54%, #16c5a3);
      content: '';
    }
  }

  &__heading { display: flex; min-width: 0; align-items: center; gap: 14px; }
  &__icon {
    display: inline-grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center;
    border: 1px solid var(--agent-dialog-border); border-radius: 13px; color: var(--agent-dialog-accent);
    background: linear-gradient(145deg, rgb(255 255 255 / 88%), transparent), var(--agent-dialog-soft);
    font-size: 22px;
  }
  &__copy { min-width: 0; }
  &__copy h2 { margin: 0; color: var(--portal-text); font-size: 18px; line-height: 1.4; }
  &__copy p { margin: 4px 0 0; color: var(--portal-text-secondary); font-size: 13px; }
}
</style>
