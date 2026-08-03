<template>
  <el-card class="balance-card" :class="`is-${tone}`" shadow="never">
    <div class="balance-card__icon">{{ codeIcon }}</div>
    <div class="balance-card__content">
      <div class="balance-card__top">
        <span>{{ title }}</span>
        <el-tag round>{{ code }}</el-tag>
      </div>
      <strong>{{ amount }}</strong>
      <p>{{ frozen }}</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  code: string;
  title: string;
  amount: string;
  frozen: string;
  tone: 'teal' | 'blue' | 'green';
}>();

const codeIcon = computed(() => (props.code === 'USD' ? '$' : props.code === 'USDC' ? '$' : '₮'));
</script>

<style scoped lang="scss">
.balance-card {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

  :deep(.el-card__body) {
    display: flex;
    min-height: 166px;
    align-items: center;
    gap: 20px;
    padding: 28px 24px;
  }

  &__icon {
    display: inline-flex;
    width: 58px;
    height: 58px;
    flex: 0 0 58px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #ffffff;
    font-size: 32px;
    font-weight: 800;
    box-shadow: inset 0 -8px 18px rgb(0 0 0 / 16%);
  }

  &__content {
    min-width: 0;
    flex: 1;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 18px;
    color: #3a4b62;
    font-weight: 700;
  }

  strong {
    display: block;
    overflow-wrap: anywhere;
    color: #071833;
    font-size: 30px;
    font-weight: 850;
    letter-spacing: 0;
  }

  p {
    margin: 16px 0 0;
    color: #78879a;
    font-weight: 600;
  }

  &.is-teal {
    .balance-card__icon {
      background: linear-gradient(135deg, #69ceb9, #008f86);
    }

    :deep(.el-tag) {
      color: #008f86;
      background: #e9f8f5;
      border-color: transparent;
    }
  }

  &.is-blue {
    .balance-card__icon {
      background: linear-gradient(135deg, #73a9f4, #246cd0);
    }

    :deep(.el-tag) {
      color: #2b70d9;
      background: #eef5ff;
      border-color: transparent;
    }
  }

  &.is-green {
    .balance-card__icon {
      background: linear-gradient(135deg, #36bfa6, #007f70);
    }

    :deep(.el-tag) {
      color: #008f76;
      background: #e9f8f3;
      border-color: transparent;
    }
  }

  @include mobile {
    :deep(.el-card__body) {
      min-height: 140px;
      padding: 22px 18px;
    }

    strong {
      font-size: 26px;
    }
  }
}
</style>
