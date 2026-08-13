<template>
  <aside class="summary-card">
    <header class="summary-card__header">
      <h2>申请摘要</h2>
    </header>

    <ul class="summary-card__list">
      <li>
        <span class="summary-card__row">
          <span class="summary-card__row-icon summary-card__row-icon--income">
            <el-icon><Wallet /></el-icon>
          </span>
          <span class="summary-card__row-label">收款金额</span>
        </span>
        <strong>5.00 USD</strong>
      </li>
      <li>
        <span class="summary-card__row">
          <span class="summary-card__row-icon summary-card__row-icon--fee">
            <el-icon><Money /></el-icon>
          </span>
          <span class="summary-card__row-label">固定手续费</span>
        </span>
        <strong>50.00 USD</strong>
      </li>
      <li>
        <span class="summary-card__row">
          <span class="summary-card__row-icon summary-card__row-icon--flow">
            <el-icon><UserFilled /></el-icon>
          </span>
          <span class="summary-card__row-label">付款关系</span>
        </span>
        <strong>B → B</strong>
      </li>
      <li>
        <span class="summary-card__row">
          <span class="summary-card__row-icon summary-card__row-icon--doc">
            <el-icon><Document /></el-icon>
          </span>
          <span class="summary-card__row-label">凭证要求</span>
        </span>
        <strong class="summary-card__required">必须上传合同与Invoice</strong>
      </li>
    </ul>

    <footer class="summary-card__total">
      <span>预计总扣款</span>
      <strong>55.00 USD</strong>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { Document, Money, UserFilled, Wallet } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.summary-card {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 14px;
  padding: 4px 0 4px 28px;

  &__header {
    h2 {
      margin: 0;
      color: #0c2a5a;
      font-size: 18px;
      font-weight: 800;
    }
  }

  &__list {
    display: grid;
    margin: 0;
    padding: 16px 18px;
    background: #f5f8fb;
    border: 1px solid #eef2f7;
    border-radius: 12px;
    gap: 30px;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    strong {
      color: #0c2a5a;
      font-size: 16px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
  }

  &__row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  &__row-icon {
    display: inline-flex;
    width: 26px;
    height: 26px;
    flex: 0 0 26px;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 14px;
  }

  &__row-icon--income {
    background: #e6fbf3;
    color: #10aaa4;
  }

  &__row-icon--fee {
    background: #e8f3ff;
    color: #2878ff;
  }

  &__row-icon--flow {
    background: #f3edff;
    color: #7b5bff;
  }

  &__row-icon--doc {
    background: #fff1e0;
    color: #f08a2c;
  }

  &__row-label {
    color: #4f647d;
    font-size: 13px;
    font-weight: 600;
  }

  &__required {
    color: #e23a43;
    font-size: 12px;
    font-weight: 700;
  }

  &__total {
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 18px 20px 20px;
    background: linear-gradient(135deg, #eaf6ff 0%, #ecf8ff 100%);
    border: 1px solid #c8e0f3;
    border-radius: 12px;

    span {
      color: #2878ff;
      font-size: 13px;
      font-weight: 700;
    }

    strong {
      color: #0aa39a;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
  }

  @include narrow {
    padding: 0;
  }

  @include mobile {
    padding: 0;

    &__list li {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    &__list strong {
      font-size: 17px;
    }

    &__total strong {
      font-size: 24px;
    }
  }
}
</style>
