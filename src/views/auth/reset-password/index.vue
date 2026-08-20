<template>
  <main class="reset-page">
    <div class="reset-page__orb reset-page__orb--left" />
    <div class="reset-page__orb reset-page__orb--right" />

    <section class="reset-card">
      <header class="reset-card__brand">
        <span>M</span>
        <div><strong>MTPay</strong><small>AGENT PORTAL</small></div>
      </header>

      <div v-if="resetProfile" class="reset-card__result">
        <span class="reset-card__result-icon reset-card__result-icon--success">
          <el-icon><CircleCheckFilled /></el-icon>
        </span>
        <h1>密码重置成功</h1>
        <p>新密码已生效，之前的登录状态已失效，请使用新密码重新登录。</p>
        <div class="reset-card__account">
          <small>代理账户</small>
          <strong>{{ resetProfile.email }}</strong>
        </div>
        <el-button type="primary" @click="goLogin">使用新密码登录</el-button>
      </div>

      <div v-else-if="!validToken" class="reset-card__result">
        <span class="reset-card__result-icon reset-card__result-icon--warning">
          <el-icon><WarningFilled /></el-icon>
        </span>
        <h1>重置链接无效</h1>
        <p>链接缺少有效 Token，请使用邮件中的完整链接，或联系平台管理员重新发送密码重置邮件。</p>
        <el-button plain @click="goLogin">返回登录页</el-button>
      </div>

      <template v-else>
        <div class="reset-card__heading">
          <span
            ><el-icon><Key /></el-icon
          ></span>
          <div>
            <h1>重置登录密码</h1>
            <p>设置一个新的安全密码</p>
          </div>
        </div>

        <el-alert class="reset-card__notice" type="warning" :closable="false" show-icon>
          重置成功后，当前账户之前的所有登录状态都会失效。
        </el-alert>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              autocomplete="new-password"
              placeholder="请输入 8–20 位新密码"
              :prefix-icon="Lock"
            />
          </el-form-item>
          <div class="reset-card__rules">
            <span :class="{ passed: passwordChecks.length }">8–20 位</span>
            <span :class="{ passed: passwordChecks.upper }">大写字母</span>
            <span :class="{ passed: passwordChecks.lower }">小写字母</span>
            <span :class="{ passed: passwordChecks.number }">数字</span>
          </div>
          <el-form-item label="确认新密码" prop="password_confirmation">
            <el-input
              v-model="form.password_confirmation"
              type="password"
              show-password
              autocomplete="new-password"
              placeholder="请再次输入新密码"
              :prefix-icon="Key"
              @keyup.enter="submitReset"
            />
          </el-form-item>
          <el-button
            class="reset-card__submit"
            type="primary"
            :loading="submitting"
            @click="submitReset"
          >
            确认重置密码
          </el-button>
        </el-form>
      </template>

      <footer class="reset-card__footer">
        <el-icon><CircleCheck /></el-icon><span>企业级安全保护 · 交易全程可追溯</span>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleCheck, CircleCheckFilled, Key, Lock, WarningFilled } from '@element-plus/icons-vue';
import { resetAgentPassword, type AgentProfile } from '@/api/modules/auth';

interface PasswordForm {
  password: string;
  password_confirmation: string;
}

const route = useRoute();
const router = useRouter();
const token = computed(() =>
  typeof route.query.token === 'string' ? route.query.token.trim() : '',
);
const validToken = computed(() => token.value.length === 64);
const formRef = ref<FormInstance>();
const submitting = ref(false);
const resetProfile = ref<AgentProfile | null>(null);
const form = reactive<PasswordForm>({ password: '', password_confirmation: '' });
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;

const passwordChecks = computed(() => ({
  length: form.password.length >= 8 && form.password.length <= 20,
  upper: /[A-Z]/.test(form.password),
  lower: /[a-z]/.test(form.password),
  number: /\d/.test(form.password),
}));

const rules: FormRules<PasswordForm> = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: passwordPattern,
      message: '密码必须为 8–20 位，并包含大写字母、小写字母和数字',
      trigger: 'blur',
    },
  ],
  password_confirmation: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) =>
        value === form.password ? callback() : callback(new Error('两次输入的密码不一致')),
      trigger: 'blur',
    },
  ],
};

/** 使用 URL 中的重置 Token 调用公开接口；成功后不自动登录。 */
async function submitReset() {
  if (!validToken.value || submitting.value) return;
  if (!(await formRef.value?.validate().catch(() => false))) return;
  submitting.value = true;
  try {
    resetProfile.value = await resetAgentPassword({ token: token.value, ...form });
  } finally {
    submitting.value = false;
  }
}

function goLogin() {
  void router.replace({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.reset-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  overflow: hidden;
  place-items: center;
  padding: 40px 20px;
  background: linear-gradient(145deg, #eaf8fb 0%, #f8fbff 48%, #e8f2ff 100%);
  &::before {
    position: absolute;
    inset: 0;
    opacity: 0.48;
    content: '';
    background-image: radial-gradient(circle, #8ab9d8 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: radial-gradient(circle at center, #000, transparent 72%);
  }
  &__orb {
    position: absolute;
    width: 430px;
    height: 430px;
    border-radius: 50%;
    opacity: 0.24;
    filter: blur(75px);
  }
  &__orb--left {
    top: -190px;
    left: -100px;
    background: #28d7c7;
  }
  &__orb--right {
    right: -150px;
    bottom: -210px;
    background: #499cf2;
  }
}
.reset-card {
  position: relative;
  z-index: 1;
  width: min(520px, 100%);
  padding: 34px 40px 28px;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 22px;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 28px 80px rgb(36 91 127 / 16%);
  backdrop-filter: blur(18px);
  &__brand {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 30px;
  }
  &__brand > span {
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border-radius: 11px;
    color: #fff;
    background: linear-gradient(135deg, #28d4c2, #158eb9);
    font-size: 20px;
    font-weight: 900;
  }
  &__brand div {
    display: grid;
    gap: 2px;
  }
  &__brand strong {
    color: #071b38;
    font-size: 20px;
  }
  &__brand small {
    color: #8292a8;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.5px;
  }
  &__heading {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  &__heading > span {
    display: grid;
    width: 50px;
    height: 50px;
    flex: none;
    place-items: center;
    border-radius: 14px;
    color: #0877bb;
    background: #e8f4fc;
    font-size: 23px;
  }
  h1 {
    margin: 0;
    color: #071b38;
    font-size: 27px;
  }
  &__heading p {
    margin: 5px 0 0;
    color: #718197;
    font-size: 13px;
  }
  &__notice {
    margin-bottom: 22px;
  }
  &__rules {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: -8px 0 20px;
  }
  &__rules span {
    padding: 4px 8px;
    border-radius: 999px;
    color: #8996a8;
    background: #f0f3f7;
    font-size: 11px;
    font-weight: 700;
  }
  &__rules span.passed {
    color: #058b68;
    background: #e1f7ed;
  }
  &__submit {
    width: 100%;
    margin-top: 6px;
  }
  &__result {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 18px 0 28px;
    text-align: center;
  }
  &__result p {
    max-width: 390px;
    margin: 12px 0 22px;
    color: #718197;
    line-height: 1.7;
  }
  &__result-icon {
    display: grid;
    width: 76px;
    height: 76px;
    margin-bottom: 20px;
    place-items: center;
    border-radius: 50%;
    font-size: 42px;
  }
  &__result-icon--success {
    color: #08a77c;
    background: #e0f8ef;
  }
  &__result-icon--warning {
    color: #df8931;
    background: #fff1df;
  }
  &__account {
    display: grid;
    width: 100%;
    gap: 6px;
    margin-bottom: 22px;
    padding: 14px;
    border-radius: 10px;
    background: #f5f8fb;
  }
  &__account small {
    color: #8794a6;
  }
  &__account strong {
    color: #15253b;
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 28px;
    padding-top: 21px;
    border-top: 1px solid #edf1f5;
    color: #8391a4;
    font-size: 12px;
  }
  &__footer .el-icon {
    color: #0aa899;
  }
}
@include mobile {
  .reset-page {
    padding: 16px;
  }
  .reset-card {
    padding: 26px 21px 22px;
    border-radius: 18px;
  }
  .reset-card h1 {
    font-size: 23px;
  }
}
</style>
