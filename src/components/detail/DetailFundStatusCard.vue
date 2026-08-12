<template>
  <section class="detail-fund">
    <header class="detail-fund__header">
      <span class="detail-fund__icon">
        <el-icon><WalletFilled /></el-icon>
      </span>
      <strong>{{ title }}</strong>
    </header>

    <div class="detail-fund__flow">
      <div class="detail-fund__node detail-fund__node--amount">
        <span class="detail-fund__node-icon">
          <span>$</span>
        </span>
        <div class="detail-fund__node-text">
          <strong>{{ amount }}</strong>
          <span>{{ currency }}</span>
        </div>
      </div>

      <span class="detail-fund__arrow" aria-hidden="true">
        <el-icon><Right /></el-icon>
      </span>

      <div
        v-for="(stage, index) in stages"
        :key="index"
        class="detail-fund__node"
        :class="`is-${stage.tone}`"
      >
        <span class="detail-fund__node-icon">
          <el-icon><component :is="stage.icon" /></el-icon>
        </span>
        <span class="detail-fund__node-label">{{ stage.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Right, WalletFilled } from '@element-plus/icons-vue';
import type { Component } from 'vue';

export interface FundStage {
  label: string;
  tone: 'pending' | 'success' | 'warning' | 'danger';
  icon: Component;
}

defineProps<{
  title: string;
  amount: string;
  currency: string;
  stages: FundStage[];
}>();
</script>

<style scoped lang="scss">
.detail-fund {
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgb(16 30 54 / 5%);

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    color: #0c2a5a;
    font-size: 16px;
    font-weight: 800;
  }

  &__icon {
    display: inline-flex;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: linear-gradient(135deg, #e6fbf3 0%, #cdf2e1 100%);
    color: #10aaa4;
    font-size: 16px;
  }

  &__flow {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__node {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    border-radius: 10px;
    background: #f4f7fb;
    border: 1px solid #e6ecf2;
  }

  &__node-icon {
    display: inline-flex;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #ffffff;
    color: #7387a2;
    font-size: 14px;
    font-weight: 800;
  }

  &__node--amount {
    padding: 8px 16px;
    border-color: transparent;
    background: linear-gradient(135deg, #ebf8f4 0%, #d8f2e5 100%);
    color: #0c2a5a;

    .detail-fund__node-icon {
      background: linear-gradient(135deg, #4ec0d0, #2c8eb0);
      color: #ffffff;
      font-size: 14px;
    }

    strong {
      color: #0c2a5a;
      font-size: 16px;
      font-weight: 800;
    }

    span {
      color: #4f647d;
      font-size: 12px;
      font-weight: 700;
    }
  }

  &__node-text {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__node-label {
    color: #0c2a5a;
    font-size: 14px;
    font-weight: 700;
  }

  &__node.is-pending {
    background: linear-gradient(135deg, #fff5e6 0%, #ffe3c2 100%);
    border-color: transparent;

    .detail-fund__node-icon {
      color: #f08a2c;
      background: #ffffff;
    }

    .detail-fund__node-label {
      color: #c4730f;
    }
  }

  &__node.is-success {
    background: linear-gradient(135deg, #e6fbf3 0%, #cdf2e1 100%);
    border-color: transparent;

    .detail-fund__node-icon {
      color: #10aaa4;
      background: #ffffff;
    }
  }

  &__node.is-warning {
    background: linear-gradient(135deg, #fff7e0 0%, #ffe8b3 100%);
    border-color: transparent;

    .detail-fund__node-icon {
      color: #d88c00;
      background: #ffffff;
    }
  }

  &__node.is-danger {
    background: linear-gradient(135deg, #ffecea 0%, #ffd7d2 100%);
    border-color: transparent;

    .detail-fund__node-icon {
      color: #d94545;
      background: #ffffff;
    }
  }

  &__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #a8b5c5;
    font-size: 18px;
  }

  @include mobile {
    padding: 18px 20px;

    &__flow {
      gap: 8px;
    }

    &__node {
      padding: 6px 10px;
      font-size: 13px;
    }
  }
}
</style>
