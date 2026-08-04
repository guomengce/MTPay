<template>
  <section class="dashboard-page">
    <div class="dashboard-page__hero">
      <div>
        <h1>歡迎，代理A · Apex Trading</h1>
        <p>查看資產餘額和最近交易，快速進行資金操作。</p>
      </div>
      <el-button :icon="Refresh" size="large" plain>重設示範資料</el-button>
    </div>

    <div class="dashboard-page__balances">
      <BalanceCard v-for="item in balances" :key="item.code" v-bind="item" />
      <el-card class="dashboard-page__todo" shadow="never">
        <div class="dashboard-page__todo-head">
          <el-icon><BellFilled /></el-icon>
          <strong>待處理事項</strong>
        </div>
        <div class="dashboard-page__todo-count">
          <span>2</span>
          <el-tag type="warning" round>待處理</el-tag>
        </div>
        <p>入金、兌換、白名單及出金</p>
        <el-divider />
        <el-button text
          >查看待處理項目 <el-icon><ArrowRight /></el-icon
        ></el-button>
      </el-card>
    </div>

    <div class="dashboard-page__actions">
      <QuickActionCard v-for="item in quickActions" :key="item.title" v-bind="item" />
    </div>

    <div class="dashboard-page__content">
      <ExchangeRateCard />
      <RecentTransactions />
    </div>

    <footer class="dashboard-page__footer">© 2024 MTPay Agent Portal. All rights reserved.</footer>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  ArrowRight,
  BellFilled,
  Refresh,
  Switch,
  Upload,
  UserFilled,
} from '@element-plus/icons-vue';

import BalanceCard from './components/BalanceCard.vue';
import ExchangeRateCard from './components/ExchangeRateCard.vue';
import QuickActionCard from './components/QuickActionCard.vue';
import RecentTransactions from './components/RecentTransactions.vue';

type BalanceTone = 'teal' | 'blue' | 'green';

interface BalanceItem {
  code: string;
  title: string;
  amount: string;
  frozen: string;
  tone: BalanceTone;
}

const balances: BalanceItem[] = [
  {
    code: 'USDT',
    title: 'USDT 可用餘額',
    amount: '128,500.00',
    frozen: '凍結 0.00 USDT',
    tone: 'teal',
  },
  {
    code: 'USDC',
    title: 'USDC 可用餘額',
    amount: '46,200.00',
    frozen: '凍結 0.00 USDC',
    tone: 'blue',
  },
  {
    code: 'USD',
    title: 'USD 可用餘額',
    amount: '184,350.00',
    frozen: '凍結 5,050.00 USD',
    tone: 'green',
  },
];

const quickActions = [
  {
    icon: ArrowDown,
    title: '入金 USDT / USDC',
    description: '取得鏈上地址',
  },
  {
    icon: Switch,
    title: '兌換 USD',
    description: '查看實時匯率並兌換',
  },
  {
    icon: UserFilled,
    title: '新增白名單',
    description: '付款人或收款人',
  },
  {
    icon: Upload,
    title: '申請 USD 出金',
    description: '固定費 50.00 USD',
  },
];
</script>

<style scoped lang="scss">
.dashboard-page {
  min-width: 0;
  padding: 36px 36px 18px;

  &__hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 28px;

    > div {
      position: relative;
      padding-left: 28px;

      &::before {
        position: absolute;
        top: 4px;
        left: 0;
        width: 4px;
        height: 40px;
        content: '';
        background: #14aa9a;
        border-radius: 999px;
      }

      &::after {
        position: absolute;
        bottom: 7px;
        left: 0;
        width: 7px;
        height: 7px;
        content: '';
        background: #42c5b7;
        border-radius: 50%;
      }
    }

    h1 {
      margin: 0 0 12px;
      color: #09162f;
      font-size: 30px;
      font-weight: 850;
      letter-spacing: 0;
    }

    p {
      margin: 0;
      color: #77869b;
      font-size: 15px;
      font-weight: 600;
    }
  }

  &__balances {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 18px;
  }

  &__todo {
    min-width: 0;
    border-color: #dfe7ef;
    border-radius: 14px;
    box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

    :deep(.el-card__body) {
      padding: 24px 24px 18px;
    }
  }

  &__todo-head {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #28384f;

    .el-icon {
      color: #ff852f;
    }
  }

  &__todo-count {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0 8px;

    span {
      color: #f06d2f;
      font-size: 34px;
      font-weight: 850;
    }
  }

  &__todo p {
    margin: 0;
    color: #66758b;
    font-weight: 600;
  }

  &__todo :deep(.el-button) {
    width: 100%;
    justify-content: space-between;
    padding: 0;
    color: #15233a;
    font-weight: 800;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 22px;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(420px, 0.95fr) minmax(520px, 1.2fr);
    gap: 22px;
  }

  &__footer {
    padding: 28px 0 0;
    color: #8b98aa;
    text-align: center;
  }

  @include narrow {
    padding: 28px 24px 16px;

    &__balances,
    &__actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__content {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    padding: 20px 14px 16px;

    &__hero {
      flex-direction: column;

      h1 {
        font-size: 24px;
      }

      :deep(.el-button) {
        width: 100%;
      }
    }

    &__balances,
    &__actions,
    &__content {
      grid-template-columns: 1fr;
    }
  }
}
</style>
