<template>
  <span class="status-badge" :class="`status-badge--${type}`">
    <i></i>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    type?: 'pending' | 'success' | 'process' | 'danger';
  }>(),
  {
    type: 'success',
  },
);
</script>

<style scoped lang="scss">
.status-badge {
  display: inline-flex;
  height: 28px;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 850;
  white-space: nowrap;

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  &--pending {
    color: #c97805;
    background: #fff1d6;
  }

  &--success {
    color: #05966f;
    background: #dff6ec;
  }

  &--process {
    color: #1267e8;
    background: #e7f0ff;
  }

  &--danger {
    color: #e23a43;
    background: #ffe8eb;
  }
}
</style>
