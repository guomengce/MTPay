<template>
  <el-card class="form-card" shadow="never">
    <h2>登入管理後台</h2>
    <p class="form-card__note">目前不區分管理員角色，所有重要操作仍會保留記錄。</p>

    <el-form label-position="top" :model="form" @submit.prevent>
      <el-form-item label="管理員Email">
        <el-input v-model="form.email" size="large" autocomplete="username" />
      </el-form-item>
      <el-form-item label="密碼">
        <el-input
          v-model="form.password"
          size="large"
          type="password"
          autocomplete="current-password"
        />
      </el-form-item>
      <el-button class="form-card__submit" type="primary" size="large" @click="handleLogin">
        登入管理後台
      </el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/modules/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: 'admin@mtpay.test',
  password: 'Demo123!',
});

async function handleLogin() {
  authStore.login({
    token: 'dev-token',
    userInfo: {
      id: '1',
      name: '代理A · Apex Trading',
      role: 'agent',
    },
  });

  await router.replace(String(route.query.redirect || '/dashboard'));
}

async function openAgentPortal() {
  await handleLogin();
}
</script>

<style scoped lang="scss">
.form-card {
  width: min(530px, 100%);
  border-color: #d9e2ee;
  border-radius: 20px;
  box-shadow: 0 24px 70px rgb(22 34 51 / 9%);

  :deep(.el-card__body) {
    padding: 40px 36px 34px;
  }

  h2 {
    margin: 0 0 8px;
    color: #071833;
    font-size: 30px;
    font-weight: 850;
    letter-spacing: 0;
  }

  &__note {
    margin: 0 0 28px;
    color: #4f647d;
    line-height: 1.7;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #1d2b42;
    font-weight: 700;
  }

  :deep(.el-input__wrapper) {
    height: 46px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #cbd7e6 inset;
  }

  &__submit {
    width: 100%;
    height: 44px;
    margin-top: 2px;
    border: 0;
    border-radius: 8px;
    color: #04201d;
    background: #27b9aa;
    font-weight: 800;

    &:hover,
    &:focus {
      background: #22aa9d;
    }
  }

  &__demo {
    display: grid;
    gap: 10px;
    margin: 18px 0 12px;
    padding: 16px 14px;
    color: #566a82;
    background: #f6f8fb;
    border: 1px solid #dce5ef;
    border-radius: 8px;

    strong {
      color: #0e1d35;
    }
  }

  &__link {
    width: 100%;
    height: 42px;
    border-radius: 8px;
    color: #071833;
    font-weight: 800;
  }

  @include mobile {
    border-radius: 16px;

    :deep(.el-card__body) {
      padding: 28px 20px 24px;
    }

    h2 {
      font-size: 25px;
    }
  }
}
</style>
