<template>
  <main class="login-page">
    <BrandPanel />

    <header class="login-page__header">
      <div class="login-page__brand">
        <img class="login-page__logo" src="/assets/mtpay-logo.svg" alt="MTPay" />
      </div>
      <div class="login-page__header-actions">
        <LanguageSwitcher />
      </div>
    </header>

    <section class="login-page__form">
      <div class="login-page__form-decor login-page__form-decor--ring" aria-hidden="true" />
      <div class="login-page__form-decor login-page__form-decor--dots" aria-hidden="true" />
      <div class="login-page__form-decor login-page__form-decor--glow" aria-hidden="true" />
      <div class="login-page__form-decor login-page__form-decor--bubbles" aria-hidden="true">
        <i /><i /><i />
      </div>
      <FormCard
        :submitting="submitting"
        @submit="handleSubmit"
        @forgot-password="handleForgotPassword"
        @contact="handleContact"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
/**
 * 登录页面
 * - 串联登录表单与登录接口；
 * - 登录成功后完整保存代理资料与 Token，并跳转到目标页面；
 * - 失败由统一请求层展示后端 message。
 */
import { ElMessage } from 'element-plus';
import { ref, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import * as authApi from '@/api/modules/auth';
import { completeLogin } from '@/utils/completeLogin';
import { requiresTwoFactor, beginLoginChallenge, safeLoginRedirect } from '@/utils/loginChallenge';
import BrandPanel from './components/BrandPanel.vue';
import FormCard from './components/FormCard.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

const route = useRoute();
const router = useRouter();
let active = true;
onBeforeUnmount(() => { active = false; });
const submitting = ref(false);
const { t } = useI18n();

async function handleSubmit(payload: { email: string; password: string }) {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const result = await authApi.login(payload);
    if (!active) return;
    if (requiresTwoFactor(result)) {
      beginLoginChallenge(result, route.query.redirect);
      await router.replace({ name: 'TwoFactor' });
      return;
    }
    completeLogin(result);
    await router.replace(safeLoginRedirect(route.query.redirect));
  } catch (error) {
    if (error instanceof Error && /^Invalid login (response|challenge)$/.test(error.message)) ElMessage.error(t('common.messages.requestFailed'));
  } finally {
    submitting.value = false;
  }
}

function handleForgotPassword() {
  void router.push({ name: 'ForgotPassword' });
}

function handleContact() {
  ElMessage.info(t('auth.contactMessage'));
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  background: #ffffff;

  &__header {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 48px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #071833;
    font-size: 22px;
    font-weight: 800;
  }

  &__logo {
    display: block;
    width: 154px;
    height: auto;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__form {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 1;
    min-height: 0;
    align-items: center;
    justify-content: flex-end;
    padding: 32px 80px 48px;

    :deep(.form-card) {
      position: relative;
      z-index: 2;
    }
  }

  &__form-decor {
    position: absolute;
    pointer-events: none;

    &--ring {
      right: 24px;
      bottom: 0;
      width: 520px;
      height: 520px;
      border: 1px solid rgb(73 164 220 / 30%);
      border-radius: 50%;

      &::before,
      &::after {
        position: absolute;
        border: 1px dashed rgb(39 185 170 / 25%);
        border-radius: 50%;
        content: '';
      }

      &::before {
        inset: 64px;
      }

      &::after {
        top: 72px;
        left: 8px;
        width: 8px;
        height: 8px;
        border: 3px solid rgb(255 255 255 / 80%);
        background: #58bfd2;
        box-shadow: 0 0 12px rgb(40 169 204 / 38%);
      }
    }

    &--dots {
      top: 9%;
      right: 2%;
      width: 320px;
      height: 220px;
      opacity: 0.75;
      background-image: radial-gradient(circle, rgb(45 148 202 / 34%) 1.2px, transparent 1.8px);
      background-size: 18px 18px;
      mask-image: linear-gradient(135deg, transparent 5%, #000 42%, transparent 95%);
    }

    &--glow {
      top: 18%;
      right: 25%;
      width: 230px;
      height: 230px;
      border-radius: 42% 58% 63% 37%;
      background: rgb(75 202 207 / 18%);
      filter: blur(38px);
      transform: rotate(20deg);
    }

    &--bubbles {
      z-index: 1;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(620px, 48vw);

      i {
        position: absolute;
        display: block;
        border: 1px solid rgb(255 255 255 / 85%);
        border-radius: 50%;
        background: linear-gradient(145deg, rgb(255 255 255 / 70%), rgb(58 180 203 / 24%));
        box-shadow: 0 5px 14px rgb(35 130 184 / 14%);
      }

      i:nth-child(1) {
        top: 16%;
        right: 78px;
        width: 16px;
        height: 16px;
      }

      i:nth-child(2) {
        right: 26px;
        bottom: 25%;
        width: 25px;
        height: 25px;
      }

      i:nth-child(3) {
        right: 510px;
        bottom: 13%;
        width: 11px;
        height: 11px;
        background: #49b9c7;
        box-shadow: 0 0 12px rgb(45 177 196 / 42%);
      }
    }
  }

  @include narrow {
    &__header {
      padding: 20px 32px;
    }

    &__form {
      padding: 24px 48px 36px;
    }
  }

  @include mobile {
    &__header {
      padding: 16px 20px;
    }

    &__brand {
      font-size: 18px;
    }

    &__logo {
      width: 34px;
      height: 34px;
      font-size: 17px;
    }

    &__form {
      justify-content: center;
      padding: 20px 16px 32px;
    }

    &__form-decor {
      display: none;
    }
  }
}
</style>
