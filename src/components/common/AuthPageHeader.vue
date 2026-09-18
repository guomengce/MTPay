<template>
  <header class="auth-page-header" :class="{ 'is-overlay': overlay }">
    <img src="/assets/mtpay-logo-official.png" alt="MTPay" />
    <LanguageSwitcher />
  </header>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
defineProps<{ overlay?: boolean }>();
</script>

<style scoped lang="scss">
.auth-page-header {
  position: relative;
  z-index: 2;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: clamp(32px, 7.8vh, 78px) 48px 24px 6%;

  &.is-overlay {
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    display: block;
    flex-shrink: 0;
    width: 168px;
    height: auto;
  }

  @include narrow {
    padding: clamp(32px, 7.8vh, 78px) 32px 20px 6%;
  }

  @include mobile {
    padding: 25px 28px;
  }
}
</style>
