<template>
  <article class="security-card">
    <header class="security-card__header">
      <span class="security-card__header-icon"><el-icon><Lock /></el-icon></span>
      <div>
        <h2>登录安全</h2>
        <p>保护你的账户与资金操作安全</p>
      </div>
    </header>

    <div class="security-card__body">
      <section class="security-card__item">
        <span class="security-card__item-icon is-green"><el-icon><Key /></el-icon></span>
        <div>
          <strong>登录密码</strong>
          <p>建议定期更换，并避免与其他平台使用相同密码</p>
        </div>
        <el-button type="primary" plain :icon="EditPen" @click="emit('change-password')">
          修改密码
        </el-button>
      </section>

      <section class="security-card__item">
        <span class="security-card__item-icon is-blue"><el-icon><Clock /></el-icon></span>
        <div>
          <strong>最近登录</strong>
          <p>{{ profile?.last_login_at || '暂无登录记录' }}</p>
        </div>
        <StatusBadge label="当前会话" type="success" />
      </section>

      <section class="security-card__notice">
        <el-icon><Warning /></el-icon>
        <div>
          <strong>安全提示</strong>
          <p>修改密码后，当前设备及其他设备上的登录状态都会失效。</p>
        </div>
      </section>
    </div>

  </article>
</template>

<script setup lang="ts">
import { Clock, EditPen, Key, Lock, Warning } from '@element-plus/icons-vue';

import type { AgentProfile } from '@/api/modules/auth';
import StatusBadge from '@/components/admin/StatusBadge.vue';

defineProps<{ profile: AgentProfile | null }>();
const emit = defineEmits<{ (e: 'change-password'): void }>();
</script>

<style scoped lang="scss">
.security-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgb(192 211 227 / 70%);
  border-radius: 20px;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 18px 50px rgb(35 82 126 / 8%);

  &__header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 25px 26px;
    border-bottom: 1px solid #e8f0f5;
    h2 { margin: 0 0 4px; color: #071833; font-size: 20px; }
    p { margin: 0; color: #8292a6; font-size: 12px; }
  }

  &__header-icon {
    display: inline-flex;
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #fff;
    background: linear-gradient(135deg, #27b9aa, #1d8db5);
    box-shadow: 0 9px 20px rgb(29 141 181 / 20%);
    font-size: 21px;
  }

  &__body { display: grid; gap: 12px; padding: 22px 24px; }

  &__item {
    display: grid;
    min-width: 0;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 13px;
    padding: 16px;
    border: 1px solid #e2ecf3;
    border-radius: 14px;
    background: #fbfdff;

    > div { min-width: 0; }
    strong { color: #14263e; font-size: 14px; }
    p { margin: 5px 0 0; color: #8393a6; font-size: 12px; line-height: 1.5; }
  }

  &__item-icon {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 19px;
    &.is-green { color: #14998f; background: #e8f8f5; }
    &.is-blue { color: #2878c8; background: #eaf3fd; }
  }

  &__notice {
    display: flex;
    gap: 12px;
    padding: 15px 16px;
    border: 1px solid #f3dfb7;
    border-radius: 13px;
    color: #d58a13;
    background: #fffaf0;
    > .el-icon { margin-top: 2px; font-size: 19px; }
    strong { color: #8a5a12; font-size: 13px; }
    p { margin: 4px 0 0; color: #9b7741; font-size: 12px; line-height: 1.55; }
  }

  @include mobile {
    &__header, &__body { padding-right: 20px; padding-left: 20px; }
    &__item { grid-template-columns: 42px minmax(0, 1fr); }
    &__item .el-button, &__item :deep(.status-badge) { grid-column: 1 / -1; width: 100%; }
  }
}
</style>
