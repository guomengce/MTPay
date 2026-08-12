<template>
  <section class="transactions-card">
    <header class="transactions-card__header">
      <h2>近期交易</h2>
      <RouterLink class="transactions-card__all" to="/records">
        查看全部 <i class="ri-arrow-right-s-line" />
      </RouterLink>
    </header>

    <div class="transactions-card__list">
      <article v-for="item in transactions" :key="item.id" class="transactions-card__item">
        <time class="transactions-card__time">
          <strong>{{ item.date }}</strong>
          <span>{{ item.time }}</span>
        </time>
        <span :class="['transactions-card__type', `is-${item.typeTone}`]">{{ item.type }}</span>
        <div class="transactions-card__detail">
          <strong>{{ item.id }}</strong>
          <span>{{ item.content }}</span>
        </div>
        <div :class="['transactions-card__amount', `is-${item.amountTone}`]">
          <small v-if="item.amountLabel">{{ item.amountLabel }}</small>
          <strong>{{ item.amount }}</strong>
        </div>
        <span :class="['transactions-card__status', `is-${item.statusTone}`]">
          {{ item.status }}
        </span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const transactions = [
  {
    date: '08/03',
    time: '15:08',
    type: '入金',
    typeTone: 'deposit',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amountLabel: '待入账',
    amount: '12,000.00 USDC',
    amountTone: 'neutral',
    status: '处理中',
    statusTone: 'warning',
  },
  {
    date: '08/03',
    time: '14:08',
    type: '出金',
    typeTone: 'withdrawal',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    amountTone: 'minus',
    status: '处理中',
    statusTone: 'info',
  },
  {
    date: '08/02',
    time: '17:08',
    type: '入金',
    typeTone: 'deposit',
    id: 'DEP-26073001',
    content: 'USDT · TRC20',
    amount: '+50,000.00 USDT',
    amountTone: 'plus',
    status: '已完成',
    statusTone: 'success',
  },
  {
    date: '08/01',
    time: '17:08',
    type: '兑换',
    typeTone: 'exchange',
    id: 'EX-26073001',
    content: 'USDT → USD · 0.9900',
    amount: '10,000.00 USDT',
    amountTone: 'neutral',
    status: '已完成',
    statusTone: 'success',
  },
  {
    date: '07/31',
    time: '17:08',
    type: '出金',
    typeTone: 'withdrawal',
    id: 'WD-26072908',
    content: 'USD · C→C',
    amount: '-12,550.00 USD',
    amountTone: 'minus',
    status: '已完成',
    statusTone: 'success',
  },
];
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
  &__type,
  &__status {
    justify-self: start;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 750;
    white-space: nowrap;
    max-width: 100%;
  }
  &__type.is-deposit {
    color: #2b9d3c;
    background: #eff9ec;
    border: 1px solid #d3edcb;
  }
  &__type.is-withdrawal {
    color: #2381cf;
    background: #eef7ff;
    border: 1px solid #cfe7fa;
  }
  &__type.is-exchange {
    color: #e65454;
    background: #fff1f1;
    border: 1px solid #f8d2d2;
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
  &__status {
    justify-self: end;
  }
  &__status.is-warning {
    color: #e88717;
    background: #fff7e9;
    border: 1px solid #f8ddb5;
  }
  &__status.is-info {
    color: #2381cf;
    background: #eef7ff;
    border: 1px solid #cfe7fa;
  }
  &__status.is-success {
    color: #2b9d3c;
    background: #eff9ec;
    border: 1px solid #d3edcb;
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
    &__status {
      grid-column: 3;
      grid-row: 1;
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
