<template>
  <section class="balance-card">
    <div class="balance-card__stats">
      <section>
        <span class="balance-card__icon balance-card__icon--balance">
          <el-icon><Wallet /></el-icon>
        </span>
        <div>
          <span>可用余额</span>
          <strong>184,350.00 <em>USD</em></strong>
        </div>
      </section>
      <section>
        <span class="balance-card__icon balance-card__icon--fee">
          <el-icon><Document /></el-icon>
        </span>
        <div>
          <span>固定手续费</span>
          <strong>50.00 <em>USD / 笔</em></strong>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Document, InfoFilled, Wallet } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.balance-card {
  display: grid;
  min-width: 0;
  gap: 14px;
  padding: 18px 22px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 14px 36px rgb(16 30 54 / 6%);

  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;

    section {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 6px 4px;
    }

    div {
      display: grid;
      min-width: 0;
      gap: 4px;

      > span {
        color: #7387a2;
        font-size: 13px;
        font-weight: 600;
      }

      strong {
        color: #0c2a5a;
        font-size: 22px;
        font-weight: 800;
        line-height: 1.1;
      }

      em {
        color: #4f647d;
        font-style: normal;
        font-size: 13px;
        font-weight: 600;
      }
    }
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 20px;
  }

  &__icon--balance {
    background: linear-gradient(135deg, #e6fbf3 0%, #cdf2e1 100%);
    color: #10aaa4;
  }

  &__icon--fee {
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
  }

  @include narrow {
    &__stats {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    padding: 16px;

    &__stats {
      gap: 14px;
    }

    &__stats div strong {
      font-size: 20px;
    }
  }
}
</style>
