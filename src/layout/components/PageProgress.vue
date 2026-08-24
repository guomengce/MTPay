<template>
  <div class="page-progress" :class="{ 'is-active': pageLoading.active }" aria-hidden="true">
    <span class="page-progress__bar" />
  </div>
</template>

<script setup lang="ts">
import { usePageLoadingStore } from '@/stores/modules/pageLoading';

const pageLoading = usePageLoadingStore();
</script>

<style scoped lang="scss">
.page-progress {
  position: relative;
  z-index: 18;
  width: 100%;
  height: 3px;
  flex: 0 0 3px;
  overflow: hidden;
  background: transparent;

  &__bar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 38%;
    border-radius: 0 999px 999px 0;
    background: linear-gradient(90deg, #0b8f87, #19c6bb, #58e3d7);
    box-shadow: 0 0 10px rgb(16 166 158 / 48%);
    opacity: 0;
    transform: translateX(-110%);
  }

  &.is-active &__bar {
    opacity: 1;
    animation: page-progress-slide 1.05s ease-in-out infinite;
  }
}

@keyframes page-progress-slide {
  0% { transform: translateX(-110%) scaleX(0.7); }
  55% { transform: translateX(135%) scaleX(1); }
  100% { transform: translateX(285%) scaleX(0.65); }
}

@media (prefers-reduced-motion: reduce) {
  .page-progress.is-active .page-progress__bar {
    width: 100%;
    animation: none;
    transform: none;
  }
}
</style>
