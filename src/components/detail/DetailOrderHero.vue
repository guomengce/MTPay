<template>
  <section class="detail-order-hero">
    <header class="detail-order-hero__header">
      <div class="detail-order-hero__identity">
        <small>{{ eyebrow }}</small>
        <h1>{{ orderNo }}</h1>
      </div>
      <StatusBadge :label="status" :type="statusType" :effect="statusEffect" />
    </header>

    <div class="detail-order-hero__business">
      <slot />
    </div>

    <footer v-if="$slots.meta" class="detail-order-hero__meta">
      <slot name="meta" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

defineProps<{
  eyebrow: string;
  orderNo: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
}>();
</script>

<style scoped lang="scss">
.detail-order-hero {
  position: relative;
  min-width: 0;
  padding: 24px 28px;
  overflow: hidden;
  border: 1px solid #dbe8f1;
  border-radius: 18px;
  background:
    radial-gradient(circle at 90% 15%, rgb(42 120 246 / 13%), transparent 35%),
    radial-gradient(circle at 35% 100%, rgb(25 190 174 / 13%), transparent 38%), #ffffff;
  box-shadow: 0 14px 36px rgb(20 46 78 / 7%);

  &__header {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
  }

  &__identity {
    min-width: 0;

    small {
      color: #74869b;
      font-size: 12px;
      font-weight: 600;
    }

    h1 {
      margin: 6px 0 0;
      color: #10243d;
      font-size: clamp(18px, 2vw, 24px);
      font-weight: 700;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
  }

  &__business {
    margin-top: 26px;
  }

  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px 28px;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid #e4edf3;
  }
}

@include mobile {
  .detail-order-hero {
    padding: 20px 18px;
    border-radius: 15px;

    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__business {
      margin-top: 22px;
    }

    &__meta {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      gap: 14px;
      margin-top: 18px;
      padding-top: 16px;
    }
  }
}
</style>
