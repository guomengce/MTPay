<template>
  <header class="page-header">
    <div class="page-header__main">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div v-if="$slots.extra" class="page-header__extra">
      <slot name="extra" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  &__main {
    min-width: 0;
  }

  h1 {
    margin: 0 0 10px;
    color: #071833;
    font-size: 34px;
    font-weight: 850;
    line-height: 1.2;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #66758b;
    font-size: 16px;
    font-weight: 650;
    line-height: 1.6;
  }

  &__extra {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 10px;
  }

  @include mobile {
    flex-direction: column;

    h1 {
      font-size: 26px;
    }

    p {
      font-size: 14px;
    }

    &__extra {
      width: 100%;
    }
  }
}
</style>
