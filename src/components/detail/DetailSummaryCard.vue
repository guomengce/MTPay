<template>
  <section class="detail-summary">
    <div class="detail-summary__main">
      <div class="detail-summary__icon">
        <span>$</span>
      </div>
      <div class="detail-summary__amount">
        <strong>{{ amount }}</strong>
        <span class="detail-summary__currency">{{ currency }}</span>
      </div>
      <div class="detail-summary__network">{{ network }}</div>
    </div>

    <div class="detail-summary__divider" aria-hidden="true" />

    <ul class="detail-summary__meta">
      <li>
        <span class="detail-summary__meta-icon">
          <el-icon><Document /></el-icon>
        </span>
        <div class="detail-summary__meta-text">
          <span>当前状态</span>
          <strong>{{ status }}</strong>
        </div>
      </li>
      <li>
        <span class="detail-summary__meta-icon detail-summary__meta-icon--purple">
          <el-icon><User /></el-icon>
        </span>
        <div class="detail-summary__meta-text">
          <span>代理</span>
          <strong>{{ agent }}</strong>
        </div>
      </li>
      <li>
        <span class="detail-summary__meta-icon detail-summary__meta-icon--orange">
          <el-icon><Clock /></el-icon>
        </span>
        <div class="detail-summary__meta-text">
          <span>提交时间</span>
          <strong>{{ submittedAt }}</strong>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { Clock, Document, User } from '@element-plus/icons-vue';

defineProps<{
  amount: string;
  currency: string;
  network: string;
  status: string;
  agent: string;
  submittedAt: string;
}>();
</script>

<style scoped lang="scss">
.detail-summary {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 50%, rgb(40 120 255 / 14%), transparent 35%),
    radial-gradient(circle at 60% 100%, rgb(16 170 164 / 12%), transparent 40%),
    linear-gradient(135deg, #eaf6ff 0%, #f5fbff 60%, #ffffff 100%);
  border: 1px solid #e6f0f8;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgb(16 30 54 / 6%);

  &__main {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 0;
  }

  &__icon {
    display: inline-flex;
    width: 64px;
    height: 64px;
    flex: 0 0 64px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background: linear-gradient(135deg, #4f8df0 0%, #246cd0 100%);
    color: #ffffff;
    font-size: 30px;
    font-weight: 800;
    box-shadow: 0 8px 18px rgb(40 120 255 / 28%);
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    color: #0c2a5a;

    strong {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1;
    }
  }

  &__currency {
    color: #2d4d80;
    font-size: 18px;
    font-weight: 700;
  }

  &__network {
    margin-top: 6px;
    color: #4f647d;
    font-size: 14px;
    font-weight: 600;
  }

  &__divider {
    align-self: stretch;
    width: 1px;
    background: linear-gradient(180deg, transparent, rgb(28 77 120 / 18%), transparent);
  }

  &__meta {
    display: grid;
    flex: 1;
    min-width: 0;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  &__meta-icon {
    display: inline-flex;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
    font-size: 18px;
  }

  &__meta-icon--purple {
    background: linear-gradient(135deg, #f1ecff 0%, #e1d4ff 100%);
    color: #7b5bff;
  }

  &__meta-icon--orange {
    background: linear-gradient(135deg, #fff1e0 0%, #ffe3c2 100%);
    color: #f08a2c;
  }

  &__meta-text {
    display: grid;
    min-width: 0;
    gap: 2px;

    span {
      color: #7387a2;
      font-size: 12px;
      font-weight: 600;
    }

    strong {
      color: #0c2a5a;
      font-size: 14px;
      font-weight: 700;
    }
  }

  @include narrow {
    flex-wrap: wrap;

    &__divider {
      display: none;
    }
  }

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 20px;

    &__amount strong {
      font-size: 30px;
    }
  }
}
</style>
