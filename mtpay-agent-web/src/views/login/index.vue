<template>
  <main class="login-page">
    <BrandPanel />
    <section class="login-page__form">
      <FormCard />
    </section>
  </main>
</template>

<script setup lang="ts">
import BrandPanel from './components/BrandPanel.vue';
import FormCard from './components/FormCard.vue';
</script>

<style scoped lang="scss">
.login-page {
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-columns: minmax(520px, 47%) 1fr;
  overflow: hidden;
  background: #f4f7fb;

  &__form {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  @include narrow {
    grid-template-columns: minmax(460px, 48%) 1fr;

    &__form {
      padding: 32px;
    }
  }

  @include mobile {
    height: auto;
    min-height: 100vh;
    grid-template-columns: 1fr;
    overflow-y: auto;

    &__form {
      padding: 28px 16px 36px;
    }
  }
}
</style>
