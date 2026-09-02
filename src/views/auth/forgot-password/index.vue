<template>
  <main class="forgot-page">
    <LanguageSwitcher class="public-language" />
    <section class="forgot-card">

      <template v-if="sent">
        <el-icon class="forgot-card__result-icon"><CircleCheckFilled /></el-icon>
        <h1>{{ t('publicAuth.checkEmailTitle') }}</h1>
        <p>{{ t('publicAuth.checkEmailDescription') }}</p>
        <el-button type="primary" @click="goToLogin">{{ t('publicAuth.backToLogin') }}</el-button>
      </template>

      <template v-else>
        <h1>{{ t('publicAuth.forgotTitle') }}</h1>
        <p>{{ t('publicAuth.forgotDescription') }}</p>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          :validate-on-rule-change="false"
          label-position="top"
          @submit.prevent="handleSubmit"
        >
          <el-form-item :label="t('publicAuth.accountEmail')" prop="email">
            <el-input v-model="form.email" autocomplete="email" placeholder="name@example.com">
              <template #prefix
                ><el-icon><Message /></el-icon
              ></template>
            </el-input>
          </el-form-item>
          <el-button
            class="forgot-card__submit"
            type="primary"
            native-type="submit"
            :loading="submitting"
          >
            {{ t('publicAuth.sendResetEmail') }}
          </el-button>
        </el-form>

        <button class="forgot-card__back" type="button" @click="goToLogin">
          <el-icon><ArrowLeft /></el-icon>
          {{ t('publicAuth.backToLogin') }}
        </button>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
/**
 * 申请找回密码页面。
 * 这是公开单页功能，直接调用接口；统一使用模糊成功提示，避免泄露邮箱是否已注册。
 */
import { ArrowLeft, CircleCheckFilled, Message } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import * as authApi from '@/api/modules/auth';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

const router = useRouter();
const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = reactive({ email: '' });
const submitting = ref(false);
const sent = ref(false);
const rules = computed<FormRules<typeof form>>(() => ({
  email: [
    { required: true, message: t('publicAuth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('publicAuth.emailInvalid'), trigger: ['blur', 'change'] },
    { max: 191, message: t('publicAuth.emailTooLong'), trigger: 'blur' },
  ],
}));

async function handleSubmit() {
  if (submitting.value) return;
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    await authApi.forgotAgentPassword(form.email.trim());
    sent.value = true;
  } finally {
    submitting.value = false;
  }
}

function goToLogin() {
  void router.push({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.forgot-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 32px 20px;
  background:
    radial-gradient(circle at 18% 16%, rgb(39 185 170 / 16%), transparent 28%),
    radial-gradient(circle at 85% 78%, rgb(29 141 181 / 14%), transparent 30%), #f5f9fc;
}

.public-language { position: absolute; z-index: 2; top: 22px; right: 28px; }

.forgot-card {
  width: min(460px, 100%);
  padding: 42px 40px 36px;
  border: 1px solid rgb(202 219 233 / 70%);
  border-radius: 20px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 24px 70px rgb(22 34 51 / 10%);
  text-align: center;

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
    color: #071833;
    font-size: 21px;
  }

  &__logo {
    display: inline-flex;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #fff;
    background: linear-gradient(135deg, #27b9aa, #1d8db5);
    font-weight: 800;
  }

  &__eyebrow {
    margin-bottom: 8px;
    color: #1aa89c;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
  }

  h1 {
    margin: 0 0 10px;
    color: #071833;
    font-size: 28px;
  }

  p {
    margin: 0 0 28px;
    color: #64748b;
    font-size: 14px;
    line-height: 1.75;
  }

  &__submit {
    width: 100%;
    margin-top: 6px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 22px;
    border: 0;
    background: transparent;
    color: #5b7088;
    cursor: pointer;

    &:hover {
      color: #1aa89c;
    }
  }

  &__result-icon {
    margin-bottom: 18px;
    color: #20b7a8;
    font-size: 64px;
  }
}

@include mobile {
  .forgot-card {
    padding: 34px 22px 28px;
  }
}
</style>
