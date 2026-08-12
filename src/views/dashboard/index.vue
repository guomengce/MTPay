<template>
  <section class="dashboard-page">
    <AdminHero
      title="MTPay 营运总览"
      description="管理代理、资金与审核流程"
      icon="ri-dashboard-3-line"
    >
    </AdminHero>

    <div class="dashboard-page__balances">
      <BalanceCard v-for="item in balances" :key="item.code" v-bind="item" />
      <div class="dashboard-page__todo">
        <div class="dashboard-page__todo-head">
          <el-icon class="dashboard-page__todo-icon"><BellFilled /></el-icon>
          <strong>待处理事项</strong>
        </div>
        <div class="dashboard-page__todo-count">
          <span>2</span>
          <em>待处理</em>
        </div>
        <p>入金、兑换、白名单及出金</p>
        <el-divider />
        <el-button class="dashboard-page__todo-btn" text>
          查看待处理项目 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="dashboard-page__actions">
      <QuickActionCard v-for="item in quickActions" :key="item.title" v-bind="item" />
    </div>

    <div class="dashboard-page__content">
      <ExchangeRatePanel compact />
      <RecentTransactions />
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  ArrowRight,
  BellFilled,
  Switch,
  Upload,
  UserFilled,
} from '@element-plus/icons-vue';
import BalanceCard from './components/BalanceCard.vue';
import ExchangeRatePanel from '@/components/admin/ExchangeRatePanel.vue';
import QuickActionCard from './components/QuickActionCard.vue';
import RecentTransactions from './components/RecentTransactions.vue';

interface BalanceItem {
  code: string;
  title: string;
  amount: string;
  frozen: string;
  approx?: string;
  tone: 'teal' | 'blue' | 'green';
}

const balances: BalanceItem[] = [
  {
    code: 'USDT',
    title: 'USDT 可用余额',
    amount: '128,500.00',
    approx: '128,500.00 USD',
    frozen: '冻结 0.00 USDT',
    tone: 'teal',
  },
  {
    code: 'USDC',
    title: 'USDC 可用余额',
    amount: '46,200.00',
    approx: '46,200.00 USD',
    frozen: '冻结 0.00 USDC',
    tone: 'blue',
  },
  {
    code: 'USD',
    title: 'USD 可用余额',
    amount: '184,350.00',
    frozen: '冻结 5,050.00 USD',
    tone: 'green',
  },
];

const quickActions = [
  {
    icon: ArrowDown,
    title: '入金 USDT',
    description: '获取链上地址',
  },
  {
    icon: Switch,
    title: '兑换 USD',
    description: '查看实时汇率',
  },
  {
    icon: UserFilled,
    title: '新增白名单',
    description: '付款人或收款人',
  },
  {
    icon: Upload,
    title: '申请 USD 提现',
    description: '固定费 50.00 USD',
  },
];
</script>

<style scoped lang="scss">
.dashboard-page {
  position: relative;
  min-width: 0;
  padding-top: 4px;

  &__banner {
    position: relative;
    height: 110px;
    margin: 0 0 18px;
    overflow: hidden;
    background:
      radial-gradient(circle at 92% 50%, rgb(40 120 255 / 14%), transparent 35%),
      radial-gradient(circle at 60% 100%, rgb(16 170 164 / 12%), transparent 40%),
      linear-gradient(135deg, #eaf6ff 0%, #f5fbff 60%, #ffffff 100%);
    border: 1px solid #e6f0f8;
    border-radius: 16px;
  }

  &__banner-orbit {
    position: absolute;
    top: 50%;
    right: 8%;
    border: 1px dashed rgb(40 120 255 / 25%);
    border-radius: 50%;
    transform: translate(0, -50%);

    &--outer {
      width: 220px;
      height: 220px;
    }

    &--inner {
      width: 140px;
      height: 140px;
      border-color: rgb(16 170 164 / 25%);
    }
  }

  &__banner-coin {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #ffffff;
    font-weight: 800;
    box-shadow: 0 8px 18px rgb(16 80 130 / 18%);

    &--yuan {
      top: 16px;
      right: 16%;
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #4fc6d5, #2a8fb8);
      font-size: 22px;
    }

    &--dollar {
      top: 6px;
      right: 4%;
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #5fb8e3, #3a7fc0);
      font-size: 18px;
    }

    &--euro {
      top: 60%;
      right: 22%;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6fc8d9, #3a92b8);
      font-size: 16px;
    }

    &--bitcoin {
      bottom: 12px;
      right: 10%;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #4ec0d0, #2c8eb0);
      font-size: 18px;
    }
  }

  &__balances {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 18px;
  }

  &__todo {
    min-width: 0;
    padding: 22px 24px 18px;
    background: #ffffff;
    border: 1px solid #dfe7ef;
    border-radius: 16px;
    box-shadow: 0 14px 30px rgb(16 30 54 / 6%);
  }

  &__todo-head {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #28384f;
    font-weight: 800;
  }

  &__todo-icon {
    color: #ff852f;
    font-size: 18px;
  }

  &__todo-count {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 18px 0 6px;

    span {
      color: #f06d2f;
      font-size: 34px;
      font-weight: 800;
      line-height: 1;
    }

    em {
      color: #f06d2f;
      font-style: normal;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__todo p {
    margin: 0;
    color: #66758b;
    font-size: 13px;
    font-weight: 600;
  }

  &__todo :deep(.el-divider) {
    margin: 14px 0 10px;
  }

  &__todo-btn {
    width: 100%;
    justify-content: space-between;
    padding: 0;
    color: #15233a;
    font-weight: 700;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 22px;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.2fr);
    gap: 22px;
  }

  @include narrow {
    &__balances,
    &__actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__content {
      grid-template-columns: 1fr;
    }

    &__banner {
      height: 96px;
    }

    &__banner-orbit--outer {
      width: 180px;
      height: 180px;
    }

    &__banner-orbit--inner {
      width: 110px;
      height: 110px;
    }
  }

  @include mobile {
    &__balances,
    &__actions,
    &__content {
      grid-template-columns: 1fr;
    }

    &__banner {
      height: 84px;
    }

    &__banner-orbit {
      right: -6%;

      &--outer {
        width: 140px;
        height: 140px;
      }

      &--inner {
        width: 90px;
        height: 90px;
      }
    }

    &__banner-coin {
      &--yuan {
        width: 36px;
        height: 36px;
        font-size: 18px;
      }

      &--dollar {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }

      &--euro {
        width: 26px;
        height: 26px;
        font-size: 12px;
      }

      &--bitcoin {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
    }
  }
}
</style>
