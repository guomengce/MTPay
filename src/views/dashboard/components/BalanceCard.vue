<template>
  <div class="balance-card" :class="`is-${tone}`">
    <div class="balance-card__head">
      <div class="balance-card__title">
        <span>{{ title }}</span>
        <span class="balance-card__code">{{ code }}</span>
      </div>
      <div class="balance-card__icon">
        <span>{{ codeIcon }}</span>
      </div>
    </div>

    <div class="balance-card__amount">
      <strong>{{ amount }}</strong>
    </div>

    <div class="balance-card__meta">
      <span v-if="approx" class="balance-card__approx">≈ {{ approx }}</span>
      <span class="balance-card__frozen">{{ frozen }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  code: string;
  title: string;
  amount: string;
  frozen: string;
  approx?: string;
  tone: 'teal' | 'blue' | 'green';
}>();

const codeIcon = computed(() => {
  if (props.code === 'USD') return '$';
  if (props.code === 'USDC') return '$';
  return '₮';
});
</script>

<style scoped lang="scss">
.balance-card {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 24px 14px;
  color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgb(16 30 54 / 8%);

  &::before {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    content: '';
    background: rgb(255 255 255 / 12%);
    filter: blur(2px);
  }

  &::after {
    position: absolute;
    bottom: -60px;
    left: -30px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    content: '';
    background: rgb(255 255 255 / 10%);
  }

  &__head {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgb(255 255 255 / 92%);
    font-size: 13px;
    font-weight: 600;
  }

  &__code {
    padding: 2px 8px;
    background: rgb(255 255 255 / 18%);
    border-radius: 999px;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(255 255 255 / 35%);
    border-radius: 50%;
    background: rgb(255 255 255 / 16%);
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
  }

  &__amount {
    position: relative;
    z-index: 1;
    margin: 26px 0 6px;

    strong {
      display: block;
      overflow-wrap: anywhere;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1.1;
    }
  }

  &__meta {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 18px;
    color: rgb(255 255 255 / 85%);
    font-size: 12px;
    font-weight: 600;
  }

  &__approx {
    color: rgb(255 255 255 / 95%);
  }

  &__frozen {
    color: rgb(255 255 255 / 85%);
  }

  &.is-teal {
    background: linear-gradient(135deg, #2ec4b6 0%, #1a8aa8 100%);
  }

  &.is-blue {
    background: linear-gradient(135deg, #4f8df0 0%, #246cd0 100%);
  }

  &.is-green {
    background: linear-gradient(135deg, #1ab394 0%, #0e7a78 100%);
  }

  @include mobile {
    padding: 18px 20px 16px;

    &__amount strong {
      font-size: 28px;
    }
  }
}
</style>
