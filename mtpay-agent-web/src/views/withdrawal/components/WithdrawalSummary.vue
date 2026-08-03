<template>
  <aside class="withdrawal-summary">
    <div class="withdrawal-summary__grid">
      <section class="is-income">
        <el-icon><UserFilled /></el-icon>
        <div>
          <span>收款人实收</span>
          <strong>5.00 USD</strong>
        </div>
      </section>
      <section class="is-fee">
        <el-icon><Discount /></el-icon>
        <div>
          <span>固定手续费</span>
          <strong>50.00 USD</strong>
        </div>
      </section>
      <section class="is-flow">
        <el-icon><Switch /></el-icon>
        <div>
          <span>付款组合</span>
          <strong>B → B</strong>
        </div>
      </section>
      <section class="is-file">
        <el-icon><Document /></el-icon>
        <div>
          <span>佐证文件</span>
          <strong>必须上传合同及Invoice</strong>
        </div>
      </section>
    </div>

    <section class="withdrawal-summary__total">
      <span>账户总扣款</span>
      <strong>55.00 USD</strong>
    </section>

    <el-button type="primary" size="large">提交USD出金</el-button>
  </aside>
</template>

<script setup lang="ts">
import { Discount, Document, Switch, UserFilled } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.withdrawal-summary {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 18px;
  padding: 10px 0 0 20px;
  border-left: 1px solid #e4ebf3;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    section {
      display: flex;
      min-width: 0;
      min-height: 84px;
      align-items: center;
      gap: 18px;
      padding: 16px 20px;
      border: 1px solid;
      border-radius: 8px;
    }

    .el-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      border-radius: 8px;
      font-size: 28px;
    }

    div {
      display: grid;
      min-width: 0;
      gap: 8px;
    }

    span {
      color: #465973;
      font-weight: 750;
    }

    strong {
      overflow: hidden;
      color: #071833;
      font-size: 18px;
      font-weight: 850;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .is-income {
    background: #f2fffc;
    border-color: #cfe9e4;

    .el-icon {
      color: #13b5a5;
      background: #e6faf7;
    }
  }

  .is-fee {
    background: #f8fbff;
    border-color: #cfe2ff;

    .el-icon {
      color: #2278e8;
      background: #edf5ff;
    }
  }

  .is-flow {
    background: #fbf8ff;
    border-color: #e2d6ff;

    .el-icon {
      color: #8b5ce8;
      background: #f3edff;
    }
  }

  .is-file {
    background: #fffaf2;
    border-color: #f4d29c;

    .el-icon {
      color: #ee8b12;
      background: #fff2dd;
    }
  }

  &__total {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 16px;
    color: #008f83;
    background: #f0fffc;
    border: 1px solid #bde7e1;
    border-radius: 8px;

    span {
      font-size: 16px;
      font-weight: 850;
    }

    strong {
      font-size: 34px;
      font-weight: 850;
      letter-spacing: 0;
    }
  }

  :deep(.el-button) {
    height: 58px;
    border: 0;
    border-radius: 8px;
    background: #09aa98;
    font-size: 18px;
    font-weight: 850;
  }

  @include mobile {
    padding: 0;
    border-left: 0;

    &__grid {
      grid-template-columns: 1fr;
    }

    &__total strong {
      font-size: 28px;
    }
  }
}
</style>
