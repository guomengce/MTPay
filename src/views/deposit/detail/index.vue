<template>
  <section class="deposit-detail">
    <DetailSummaryCard
      amount="12,000.00"
      currency="USDC"
      network="USDC · ERC20"
      status="待审核"
      agent="代理A · Apex Trading"
      submitted-at="2026/08/10 16:09:26"
    />

    <div class="deposit-detail__grid">
      <div class="deposit-detail__col">
        <DetailInfoCard
          title="交易信息"
          :items="infoItems"
        />
        <DetailChainCard
          title="链上信息"
          :items="chainItems"
          @copy="handleCopy"
          @explore="handleExplore"
        />
        <DetailFundStatusCard
          title="资金状态"
          amount="12,000.00"
          currency="USDC"
          :stages="fundStages"
        />
      </div>

      <div class="deposit-detail__col">
        <DetailTimelineCard
          title="处理进度"
          :steps="timelineSteps"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Bell, Clock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import DetailChainCard from '@/components/detail/DetailChainCard.vue';
import DetailFundStatusCard from '@/components/detail/DetailFundStatusCard.vue';
import DetailInfoCard from '@/components/detail/DetailInfoCard.vue';
import DetailSummaryCard from '@/components/detail/DetailSummaryCard.vue';
import DetailTimelineCard, {
  type TimelineStep,
} from '@/components/detail/DetailTimelineCard.vue';
import type { FundStage } from '@/components/detail/DetailFundStatusCard.vue';

const infoItems = [
  { label: '交易编号', value: 'DEP-26073002' },
  { label: '代理', value: '代理A · Apex Trading' },
  { label: '币种', value: 'USDC' },
  { label: '区块链网络', value: 'ERC20' },
  { label: '提交时间', value: '2026/08/10 16:09:26' },
];

const chainItems = [
  {
    label: '交易哈希',
    value: '0x8f3a7c2d91be…4f7a9c21',
    href: 'https://etherscan.io',
  },
  {
    label: '入金地址',
    value: 'TQ92hKx7mP1c…9LwE28f',
  },
];

const timelineSteps: TimelineStep[] = [
  {
    title: '代理提交入金',
    at: '2026/08/10 16:09:26',
    description: '代理已提交入金申请。',
    status: 'done',
  },
  {
    title: '等待后台审核',
    at: '2026/08/10 16:09:26',
    description: '系统已收到申请，正在进行合同与资金审核。',
    status: 'active',
  },
  {
    title: '审核完成并入账',
    description: '审核通过后，资金将自动入账户并更新余额。',
    status: 'pending',
  },
];

const fundStages: FundStage[] = [
  { label: '等待审核', tone: 'pending', icon: Clock },
  { label: '尚未入账', tone: 'warning', icon: Bell },
];

function handleCopy(item: { label: string; value: string }) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(item.value).catch(() => undefined);
  }
  ElMessage.success(`${item.label} 已复制`);
}

function handleExplore(item: { label: string; value: string; href?: string }) {
  if (item.href) {
    window.open(item.href, '_blank', 'noopener');
  }
}
</script>

<style scoped lang="scss">
.deposit-detail {
  display: grid;
  min-width: 0;
  gap: 20px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 20px;
  }

  &__col {
    display: grid;
    min-width: 0;
    gap: 20px;
    align-content: start;
  }

  @include narrow {
    &__grid {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    gap: 14px;

    &__grid {
      gap: 14px;
    }

    &__col {
      gap: 14px;
    }
  }
}
</style>
