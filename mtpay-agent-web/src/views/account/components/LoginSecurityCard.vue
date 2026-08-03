<template>
  <el-card class="security-card" shadow="never">
    <template #header>
      <div class="security-card__header">
        <div class="security-card__title">
          <span>
            <el-icon><CircleCheck /></el-icon>
          </span>
          <h2>登入安全</h2>
        </div>
        <el-tag type="success" round>
          <span class="security-card__dot"></span>
          正常
        </el-tag>
      </div>
    </template>

    <div class="security-card__body">
      <section class="security-card__row">
        <span class="is-blue"
          ><el-icon><Lock /></el-icon
        ></span>
        <strong>密码</strong>
        <b>已设定</b>
      </section>

      <section class="security-card__row is-warning">
        <span
          ><el-icon><Key /></el-icon
        ></span>
        <strong>MFA</strong>
        <b>建议启用</b>
      </section>

      <section class="security-card__row">
        <span class="is-blue"
          ><el-icon><User /></el-icon
        ></span>
        <strong>账户模式</strong>
        <b>单一代理</b>
      </section>

      <el-alert
        title="不包含下级客户、企业群批、团队或角色权限。"
        type="info"
        :closable="false"
        show-icon
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { CircleCheck, Key, Lock, User } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.security-card {
  min-width: 0;
  overflow: hidden;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 18px 48px rgb(16 30 54 / 8%);

  :deep(.el-card__header) {
    padding: 28px 36px;
  }

  :deep(.el-card__body) {
    padding: 30px 36px 38px;
  }

  &__header,
  &__title,
  &__row {
    display: flex;
    align-items: center;
  }

  &__header {
    justify-content: space-between;
    gap: 18px;
  }

  &__title {
    gap: 22px;

    > span {
      display: inline-flex;
      width: 64px;
      height: 64px;
      flex: 0 0 64px;
      align-items: center;
      justify-content: center;
      color: #0a9b76;
      background: #e9f8f1;
      border-radius: 50%;
      font-size: 36px;
    }

    h2 {
      margin: 0;
      color: #071833;
      font-size: 30px;
      font-weight: 850;
      letter-spacing: 0;
    }
  }

  &__dot {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 10px;
    background: currentColor;
    border-radius: 50%;
  }

  :deep(.el-tag) {
    height: 50px;
    padding: 0 22px;
    border-color: transparent;
    font-size: 18px;
    font-weight: 850;
  }

  &__body {
    display: grid;
    gap: 26px;
  }

  &__row {
    min-height: 88px;
    gap: 20px;
    padding: 0 24px;
    border: 1px solid #cbd8e8;
    border-radius: 10px;

    > span {
      display: inline-flex;
      width: 54px;
      height: 54px;
      flex: 0 0 54px;
      align-items: center;
      justify-content: center;
      color: #f1a21d;
      background: #fff4df;
      border-radius: 50%;
      font-size: 30px;

      &.is-blue {
        color: #0b4fb4;
        background: #edf4ff;
      }
    }

    strong {
      min-width: 0;
      flex: 1;
      color: #071833;
      font-size: 22px;
      font-weight: 850;
    }

    b {
      flex: 0 0 auto;
      color: #071833;
      font-size: 22px;
      font-weight: 850;
    }

    &.is-warning {
      background: #fffaf1;
      border-color: #f3d49a;

      b {
        color: #f08a00;
      }
    }
  }

  :deep(.el-alert) {
    min-height: 88px;
    border-color: #bcd8ff;
    border-radius: 10px;
  }

  :deep(.el-alert__title) {
    color: #155fc4;
    font-size: 18px;
    font-weight: 750;
  }

  @include mobile {
    :deep(.el-card__header),
    :deep(.el-card__body) {
      padding: 20px 18px;
    }

    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__title {
      gap: 14px;

      > span {
        width: 52px;
        height: 52px;
        flex-basis: 52px;
      }

      h2 {
        font-size: 24px;
      }
    }

    &__row {
      min-height: auto;
      flex-wrap: wrap;
      gap: 12px;
      padding: 16px;

      strong,
      b {
        font-size: 18px;
      }

      b {
        width: 100%;
        padding-left: 66px;
      }
    }
  }
}
</style>
