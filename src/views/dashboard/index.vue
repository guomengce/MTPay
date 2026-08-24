<template>
  <section class="dashboard-page">
    <AdminHero
      title="MTPay 营运总览"
      description="管理代理、资金与审核流程"
      icon="ri-dashboard-3-line"
    >
    </AdminHero>

    <div v-if="loading" class="dashboard-page__skeleton" aria-label="正在載入首頁資料">
      <div class="dashboard-page__skeleton-metrics">
        <el-skeleton-item v-for="index in 4" :key="index" variant="rect" />
      </div>
      <div class="dashboard-page__skeleton-actions">
        <el-skeleton-item v-for="index in 4" :key="index" variant="rect" />
      </div>
      <div class="dashboard-page__skeleton-rates">
        <el-skeleton-item variant="rect" />
        <el-skeleton-item variant="rect" />
      </div>
      <el-skeleton-item class="dashboard-page__skeleton-table" variant="rect" />
    </div>

    <template v-else>
    <div class="dashboard-page__balances">
      <BalanceCard v-for="item in balances" :key="item.code" v-bind="item" />
      <div class="dashboard-page__todo">
        <div class="dashboard-page__todo-head">
          <el-icon class="dashboard-page__todo-icon"><BellFilled /></el-icon>
          <strong>待处理事项</strong>
        </div>
        <div class="dashboard-page__todo-count">
          <span>{{ pendingCount }}</span>
          <em>待处理</em>
        </div>
        <p>入金、兑换、白名单及出金</p>
      </div>
    </div>

    <div class="dashboard-page__actions">
      <QuickActionCard v-for="item in quickActions" :key="item.title" v-bind="item" />
    </div>

    <div class="dashboard-page__content">
      <ExchangeRatePanel compact :agent="companyName" :rates="rateItems" />
      <RecentTransactions :transactions="recentTransactions" />
    </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePageLoading } from '@/composables/usePageLoading';
import { ArrowDown, BellFilled, Switch, Upload, UserFilled } from '@element-plus/icons-vue';
import BalanceCard from './components/BalanceCard.vue';
import ExchangeRatePanel from '@/components/admin/ExchangeRatePanel.vue';
import QuickActionCard from './components/QuickActionCard.vue';
import RecentTransactions from './components/RecentTransactions.vue';
import { useDashboard } from './composables/useDashboard';

const {
  loading,
  balances,
  pendingCount,
  feeAmount,
  companyName,
  recentTransactions,
  rateItems,
  loadOverview,
} = useDashboard();
usePageLoading(loading);

const quickActions = computed(() => [
  { icon: ArrowDown, title: '入金 USDT', description: '获取链上地址' },
  { icon: Switch, title: '兑换 USD', description: '查看实时汇率' },
  { icon: UserFilled, title: '新增白名单', description: '付款人或收款人' },
  {
    icon: Upload,
    title: '申请 USD 提现',
    description: feeAmount.value ? `固定费 ${feeAmount.value} USD` : '提交出金申请',
  },
]);

onMounted(loadOverview);
</script>

<style scoped lang="scss">
.dashboard-page {
  position: relative;
  min-width: 0;

  &__skeleton {
    display: grid;
    gap: 22px;
  }

  &__skeleton-metrics,
  &__skeleton-actions,
  &__skeleton-rates {
    display: grid;
    gap: 20px;

    .el-skeleton__item {
      height: 136px;
      border-radius: 16px;
    }
  }

  &__skeleton-metrics,
  &__skeleton-actions {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  &__skeleton-actions .el-skeleton__item {
    height: 82px;
  }

  &__skeleton-rates {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .el-skeleton__item {
      height: 190px;
    }
  }

  &__skeleton-table {
    width: 100%;
    height: 270px;
    border-radius: 18px;
  }
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

  &__actions {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 22px;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }

  @include narrow {
    &__balances,
    &__actions,
    &__skeleton-metrics,
    &__skeleton-actions,
    &__skeleton-rates {
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
    &__skeleton-metrics,
    &__skeleton-actions,
    &__skeleton-rates {
      grid-template-columns: 1fr;
    }

    &__skeleton {
      gap: 14px;
    }

    &__skeleton-metrics,
    &__skeleton-actions,
    &__skeleton-rates {
      gap: 12px;
    }

    &__skeleton-metrics .el-skeleton__item,
    &__skeleton-rates .el-skeleton__item {
      height: 124px;
    }

    &__skeleton-table {
      height: 220px;
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
