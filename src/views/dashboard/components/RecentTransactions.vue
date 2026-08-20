<template>
  <section class="transactions-card">
    <header class="transactions-card__header">
      <h2>近期交易</h2>
      <RouterLink class="transactions-card__all" to="/records">
        查看全部 <i class="ri-arrow-right-s-line" />
      </RouterLink>
    </header>

    <div class="transactions-card__list">
      <article v-for="item in transactions" :key="item.key" class="transactions-card__item">
        <time class="transactions-card__time">
          <strong>{{ item.date }}</strong>
          <span>{{ item.time }}</span>
        </time>
        <StatusBadge :label="item.type" :type="typeToBadge(item.typeTone)" />
        <div class="transactions-card__detail">
          <strong>{{ item.id }}</strong>
          <span>{{ item.content }}</span>
        </div>
        <div :class="['transactions-card__amount', `is-${item.amountTone}`]">
          <small v-if="item.amountLabel">{{ item.amountLabel }}</small>
          <strong>{{ item.amount }}</strong>
        </div>
        <StatusBadge
          :label="item.status"
          :type="item.statusBadge"
          :effect="isPending(item.status) ? 'pending' : undefined"
        />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import StatusBadge, {
  type StatusBadgeType,
} from '@/components/admin/StatusBadge.vue';
import type { RecentTransactionItem } from '../composables/useDashboard';

defineProps<{ transactions: RecentTransactionItem[] }>();

function isPending(status: string) {
  return /待审核|待处理|处理中/.test(status);
}

function typeToBadge(tone: RecentTransactionItem['typeTone']): StatusBadgeType {
  if (tone === 'deposit') return 'success';
  if (tone === 'withdrawal') return 'primary';
  return 'danger';
}
</script>

<style scoped lang="scss">
.transactions-card {
  min-width: 0;
  padding: 22px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  h2 {
    margin: 0;
    color: #0d1a32;
    font-size: 19px;
    font-weight: 800;
  }
  &__all {
    display: flex;
    align-items: center;
    color: #2878ff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }
  &__all i {
    font-size: 20px;
  }
  &__list {
    display: grid;
    gap: 10px;
    min-width: 0;
  }
  &__item {
    display: grid;
    min-width: 0;
    grid-template-columns:
      minmax(56px, auto)
      minmax(56px, auto)
      minmax(0, 1fr)
      minmax(0, 1.1fr)
      minmax(96px, auto);
    align-items: center;
    gap: 14px;
    min-height: 78px;
    padding: 12px 16px;
    border: 1px solid #e2eaf3;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgb(18 55 92 / 4%);
  }
  &__time,
  &__detail,
  &__amount {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }
  &__time {
    gap: 3px;
  }
  &__time strong {
    color: #0c1d3b;
    font-size: 16px;
  }
  &__time span,
  &__detail span {
    color: #66758d;
    font-size: 13px;
    font-weight: 600;
  }
  &__detail {
    gap: 5px;
  }
  &__detail strong {
    overflow: hidden;
    color: #0c1d3b;
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__type {
    justify-self: start;
  }
  &__amount {
    gap: 3px;
  }
  &__amount small {
    color: #53637b;
    font-size: 12px;
    font-weight: 650;
  }
  &__amount strong {
    font-size: 17px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  &__amount.is-neutral strong {
    color: #0c1d3b;
  }
  &__amount.is-plus strong {
    color: #0aa38e;
  }
  &__amount.is-minus strong {
    color: #f05a30;
  }

  @include narrow {
    &__item {
      grid-template-columns:
        minmax(54px, auto)
        minmax(54px, auto)
        minmax(0, 1fr)
        minmax(0, 1.1fr)
        minmax(96px, auto);
      gap: 10px;
      padding: 12px;
    }
  }
  @include mobile {
    padding: 16px;
    &__item {
      grid-template-columns: 54px 1fr auto;
      gap: 10px 12px;
      padding: 14px;
    }
    &__time {
      grid-row: 1 / 3;
    }
    &__type {
      grid-column: 2;
      grid-row: 1;
    }
    > :deep(.status-badge) {
      grid-column: 3;
      grid-row: 1;
      justify-self: end;
    }
    &__detail {
      grid-column: 2 / 4;
      grid-row: 2;
    }
    &__amount {
      grid-column: 2 / 4;
      grid-row: 3;
    }
  }
}
</style>
