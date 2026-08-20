<template>
  <section class="detail-card">
    <header class="detail-card__header">
      <span v-if="icon" class="detail-card__icon"><i :class="icon" /></span>
      <div>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <slot name="extra" />
    </header>
    <div class="detail-card__body"><slot /></div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  icon?: string;
}>();
</script>

<style scoped lang="scss">
.detail-card {
  min-width: 0;
  padding: 22px 24px;
  border: 1px solid #dfe8ef;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 28px rgb(20 46 78 / 5%);

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    > div {
      min-width: 0;
    }

    h2 {
      margin: 0;
      color: #10243d;
      font-size: 17px;
      font-weight: 700;
    }

    p {
      margin: 5px 0 0;
      color: #7b8b9f;
      font-size: 12px;
      line-height: 1.5;
    }
  }

  &__icon {
    display: grid;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    place-items: center;
    border-radius: 11px;
    color: #0a9b92;
    background: #e7f8f5;
    font-size: 19px;
  }
}

@include mobile {
  .detail-card {
    padding: 19px 18px;
    border-radius: 14px;
  }
}
</style>
