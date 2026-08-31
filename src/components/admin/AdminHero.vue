<template>
  <header class="admin-hero">
    <div class="admin-hero__main">
      <span class="admin-hero__icon">
        <i :class="icon" aria-hidden="true" />
      </span>
      <div>
        <h1>{{ title }}</h1>
      </div>
    </div>
    <div v-if="$slots.extra" class="admin-hero__extra">
      <slot name="extra" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
}>();
</script>

<style scoped lang="scss">
.admin-hero {
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;

  &__main {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    align-items: center;
    gap: 13px;
  }

  &__extra {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }

  &__icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    color: #126df0;
    background: linear-gradient(135deg, #dff3ff, #eef0ff);
    // box-shadow: 0 20px 38px rgb(27 98 198 / 12%);
    font-size: 24px;

    i {
      font-weight: 400;
      line-height: 1;
    }
  }

  h1 {
    margin: 0;
    color: #071833;
    font-size: clamp(24px, 1.8vw, 28px);
    font-weight: 850;
    line-height: 1.15;
  }

  @include narrow {
    flex-wrap: wrap;

    &__main {
      flex: 1 1 100%;
      gap: 14px;
    }

    &__icon {
      width: 44px;
      height: 44px;
      flex-basis: 44px;
      font-size: 22px;
    }

    h1 {
      font-size: 25px;
    }

    &__extra {
      width: 100%;
      flex: 0 0 100%;
    }
  }

  @include mobile {
    align-items: flex-start;
    flex-direction: column;

    &__main {
      align-items: flex-start;
    }

    &__extra {
      width: 100%;
      justify-content: stretch;
    }

    &__icon {
      width: 44px;
      height: 44px;
      flex-basis: 44px;
      font-size: 22px;
    }

    h1 {
      font-size: 22px;
    }
  }
}
</style>
