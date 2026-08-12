<template>
  <div class="form-card">
    <header class="form-card__header">
      <h2 class="form-card__title">欢迎登录 MTPay</h2>
      <p class="form-card__subtitle">安全管理您的资产与每一笔交易</p>
    </header>

    <el-form class="form-card__form" label-position="top" :model="form" @submit.prevent>
      <el-form-item label="账户 Email">
        <el-input
          v-model="form.email"
          size="large"
          autocomplete="username"
          placeholder="请输入您的账户 Email"
        >
          <template #prefix>
            <el-icon class="form-card__icon"><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          size="large"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="请输入您的密码"
        >
          <template #prefix>
            <el-icon class="form-card__icon"><Lock /></el-icon>
          </template>
          <template #suffix>
            <el-icon class="form-card__icon form-card__icon--toggle" @click="showPassword = !showPassword">
              <component :is="showPassword ? View : Hide" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button class="form-card__submit" type="primary" size="large" @click="handleLogin">
        登录
      </el-button>
    </el-form>

    <div class="form-card__links">
      <a class="form-card__link" href="javascript:void(0)" @click.prevent>忘记密码</a>
      <span class="form-card__divider" />
      <a class="form-card__link" href="javascript:void(0)" @click.prevent>联系客服</a>
    </div>

    <div class="form-card__footer">
      <el-icon class="form-card__footer-icon"><CircleCheckFilled /></el-icon>
      <span>企业级安全保护 · 交易全程可追溯</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CircleCheckFilled, Hide, Lock, Message, View } from '@element-plus/icons-vue';

import { useAuthStore } from '@/stores/modules/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: 'admin@mtpay.test',
  password: 'Demo123!',
});

const showPassword = ref(false);

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
</script>

<style scoped lang="scss">
.form-card {
  width: min(460px, 100%);
  padding: 44px 40px 36px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 70px rgb(22 34 51 / 9%);

  &__header {
    margin-bottom: 28px;
    text-align: center;
  }

  &__title {
    margin: 0 0 8px;
    color: #071833;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0;
  }

  &__subtitle {
    margin: 0;
    color: #4f647d;
    font-size: 14px;
    line-height: 1.6;
  }

  &__form {
    width: 100%;
  }

  &__icon {
    color: #8aa0bb;
    font-size: 18px;

    &--toggle {
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: #27b9aa;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #1d2b42;
    font-weight: 600;
    font-size: 13px;
  }

  :deep(.el-input__wrapper) {
    height: 46px;
    padding: 0 14px;
    border-radius: 8px;
    background: #f5f8fb;
    box-shadow: 0 0 0 1px #e2e8f0 inset;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 0 1px #cbd7e6 inset;
    }

    &.is-focus {
      background: #ffffff;
      box-shadow: 0 0 0 1px #27b9aa inset;
    }
  }

  :deep(.el-input__inner) {
    height: 46px;
    color: #071833;
    font-size: 14px;

    &::placeholder {
      color: #9aa9bd;
    }
  }

  &__submit {
    width: 100%;
    height: 46px;
    margin-top: 6px;
    border: 0;
    border-radius: 8px;
    color: #ffffff;
    background: linear-gradient(135deg, #27b9aa 0%, #1d8db5 100%);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: 0 8px 20px rgb(39 185 170 / 30%);

    &:hover,
    &:focus {
      background: linear-gradient(135deg, #22aa9d 0%, #187fa3 100%);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &__links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 18px;
  }

  &__link {
    color: #27b9aa;
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #1d8db5;
    }
  }

  &__divider {
    width: 1px;
    height: 12px;
    background: #d9e2ee;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 26px;
    padding-top: 22px;
    color: #6c7d92;
    font-size: 12px;
    border-top: 1px solid #eef2f7;
  }

  &__footer-icon {
    color: #27b9aa;
    font-size: 16px;
  }

  @include mobile {
    padding: 32px 22px 26px;
    border-radius: 16px;
    box-shadow: 0 16px 40px rgb(22 34 51 / 8%);

    &__title {
      font-size: 22px;
    }

    &__subtitle {
      font-size: 13px;
    }
  }
}
</style>
