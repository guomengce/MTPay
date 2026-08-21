<template>
  <span class="status-badge" :class="`status-badge--${type}`">
    <i v-if="effect === 'pending'" class="status-badge__indicator" aria-hidden="true"></i>
    {{ label }}
  </span>
</template>

<script lang="ts">
export type StatusBadgeType = 'primary' | 'warning' | 'success' | 'danger' | 'gray' | 'mt';
export type StatusBadgeEffect = 'pending';
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    type?: StatusBadgeType;
    effect?: StatusBadgeEffect;
  }>(),
  {
    type: 'success',
    effect: undefined,
  },
);
</script>

<style scoped lang="scss">
.status-badge {
  display: inline-flex;
  align-self: center;
  justify-self: start;
  flex: 0 0 auto;
  width: fit-content;
  max-width: 100%;
  height: 28px;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 850;
  white-space: nowrap;

  &__indicator {
    width: 7px;
    height: 7px;
    flex: none;
    border-radius: 50%;
    background: currentColor;
    animation: status-badge-breathe 1.6s ease-in-out infinite;
  }

  &--warning {
    color: #c97805;
    background: #fff1d6;
  }

  &--success {
    color: #05966f;
    background: #dff6ec;
  }

  &--danger {
    color: #e23a43;
    background: #ffe8eb;
  }

  &--primary {
    color: #1267e8;
    background: #e7f0ff;
  }

  &--gray {
    color: #66758b;
    background: #eef2f7;
  }

  &--mt {
    color: #069a94;
    background: rgb(57 245 236 / 16%);
  }
}

@keyframes status-badge-breathe {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.8);
    box-shadow: 0 0 0 0 currentColor;
  }

  50% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 4px transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-badge__indicator {
    animation: none;
  }
}
</style>
