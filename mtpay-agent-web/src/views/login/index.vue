<template>
  <main class="login-page">
    <section class="login-panel">
      <p class="login-panel__eyebrow">MTPay Agent</p>
      <h1>代理端后台</h1>
      <p>企业级前端骨架登录占位页。</p>
      <el-button type="primary" size="large" @click="handleLogin">进入系统</el-button>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/modules/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

async function handleLogin() {
  authStore.login({
    token: 'dev-token',
    userInfo: {
      id: '1',
      name: 'MTPay Agent',
      role: 'agent',
    },
  });

  await router.replace(String(route.query.redirect || '/dashboard'));
}
</script>

<style scoped lang="scss">
.login-page {
  display: grid;
  width: 100%;
  height: 100vh;
  place-items: center;
  padding: 24px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgb(22 93 255 / 8%), transparent 34%),
    linear-gradient(315deg, rgb(16 185 129 / 10%), transparent 28%), #f7f9fc;
}

.login-panel {
  width: min(420px, 100%);
  padding: 32px;
  background: #ffffff;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  box-shadow: 0 20px 50px rgb(16 24 40 / 10%);

  &__eyebrow {
    margin: 0 0 10px;
    color: var(--app-primary);
    font-size: 13px;
    font-weight: 700;
  }

  h1 {
    margin: 0 0 12px;
    font-size: 28px;
  }

  p {
    margin: 0 0 24px;
    color: var(--app-text-muted);
  }
}
</style>
