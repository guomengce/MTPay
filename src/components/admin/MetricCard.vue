<template>
  <article class="metric-card" :class="`metric-card--${tone}`">
    <div>
      <p class="metric-card__label">
        {{ label }}
        <span v-if="badge">{{ badge }}</span>
      </p>
      <strong>{{ value }}</strong>
      <small>{{ subtext }}</small>
    </div>
    <span class="metric-card__icon">
      <el-icon><component :is="icon" /></el-icon>
    </span>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    subtext: string;
    badge?: string;
    icon: unknown;
    tone?: 'teal' | 'blue' | 'purple' | 'amber';
  }>(),
  {
    badge: '',
    tone: 'teal',
  },
);
</script>

<style scoped lang="scss">
.metric-card {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border: 1px solid #d8e4ef;
  border-radius: 8px;
  background: radial-gradient(circle at 100% 0, rgb(255 255 255 / 80%), transparent 30%), #ffffff;
  box-shadow: 0 16px 38px rgb(19 40 74 / 6%);

  &__label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    color: #243554;
    font-weight: 850;

    span {
      display: inline-flex;
      height: 24px;
      align-items: center;
      padding: 0 9px;
      border-radius: 8px;
      color: var(--tone);
      background: color-mix(in srgb, var(--tone) 13%, white);
      font-size: 12px;
    }
  }

  strong {
    display: block;
    color: #071833;
    font-size: 32px;
    line-height: 1.05;
  }

  small {
    display: block;
    margin-top: 10px;
    color: #61708a;
    font-size: 14px;
    font-weight: 650;
  }

  &__icon {
    display: inline-flex;
    width: 68px;
    height: 68px;
    flex: 0 0 68px;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    color: var(--tone);
    background: color-mix(in srgb, var(--tone) 12%, white);
    font-size: 32px;
  }

  &--teal {
    --tone: #0aa99a;
  }

  &--blue {
    --tone: #1f73f2;
  }

  &--purple {
    --tone: #7a52e8;
  }

  &--amber {
    --tone: #f58a13;
  }

  @include mobile {
    padding: 18px;

    strong {
      font-size: 26px;
    }

    &__icon {
      width: 54px;
      height: 54px;
      flex-basis: 54px;
      font-size: 26px;
    }
  }
}
</style>
