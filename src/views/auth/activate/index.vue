<template>
  <main class="activate-page">
    <div class="activate-page__glow activate-page__glow--one" />
    <div class="activate-page__glow activate-page__glow--two" />

    <section class="activate-card">
      <header class="activate-card__brand">
        <span>M</span>
        <div><strong>MTPay</strong><small>AGENT PORTAL</small></div>
      </header>

      <template v-if="activatedProfile">
        <div class="activate-card__result">
          <span class="activate-card__success"
            ><el-icon><CircleCheckFilled /></el-icon
          ></span>
          <h1>账户激活成功</h1>
          <p>{{ activatedProfile.company_name }}，您的账户已经可以正常使用。</p>
          <div class="activate-card__account">
            <small>登录 Email</small>
            <strong>{{ activatedProfile.email }}</strong>
          </div>
          <el-button type="primary" @click="goLogin">前往登录</el-button>
        </div>
      </template>

      <template v-else-if="!validToken">
        <div class="activate-card__result">
          <span class="activate-card__invalid"
            ><el-icon><WarningFilled /></el-icon
          ></span>
          <h1>激活链接无效</h1>
          <p>链接缺少有效 Token，请检查邮件中的完整链接，或联系平台管理员重新发送激活邮件。</p>
          <el-button plain @click="goLogin">返回登录页</el-button>
        </div>
      </template>

      <template v-else>
        <div class="activate-card__heading">
          <span class="activate-card__shield"
            ><el-icon><Lock /></el-icon
          ></span>
          <div>
            <h1>激活代理账户</h1>
            <p>设置登录密码，完成账户激活</p>
          </div>
        </div>

        <el-alert class="activate-card__notice" type="info" :closable="false" show-icon>
          激活链接仅供当前账户使用，请勿转发给其他人。
        </el-alert>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
          <el-form-item label="设置密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              autocomplete="new-password"
              placeholder="请输入 8–20 位密码"
              :prefix-icon="Lock"
            />
          </el-form-item>
          <div class="activate-card__rules">
            <span :class="{ passed: passwordChecks.length }">8–20 位</span>
            <span :class="{ passed: passwordChecks.upper }">大写字母</span>
            <span :class="{ passed: passwordChecks.lower }">小写字母</span>
            <span :class="{ passed: passwordChecks.number }">数字</span>
          </div>
          <el-form-item label="确认密码" prop="password_confirmation">
            <el-input
              v-model="form.password_confirmation"
              type="password"
              show-password
              autocomplete="new-password"
              placeholder="请再次输入密码"
              :prefix-icon="Key"
              @keyup.enter="submitActivation"
            />
          </el-form-item>
          <el-button
            class="activate-card__submit"
            type="primary"
            :loading="submitting"
            @click="submitActivation"
          >
            激活账户
          </el-button>
        </el-form>
      </template>

      <footer class="activate-card__footer">
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
import { activateAgent, type AgentProfile } from '@/api/modules/auth';

interface ActivateForm {
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
const activatedProfile = ref<AgentProfile | null>(null);
const form = reactive<ActivateForm>({ password: '', password_confirmation: '' });
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;

const passwordChecks = computed(() => ({
  length: form.password.length >= 8 && form.password.length <= 20,
  upper: /[A-Z]/.test(form.password),
  lower: /[a-z]/.test(form.password),
  number: /\d/.test(form.password),
}));

const rules: FormRules<ActivateForm> = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: passwordPattern,
      message: '密码必须为 8–20 位，并包含大写字母、小写字母和数字',
      trigger: 'blur',
    },
  ],
  password_confirmation: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) =>
        value === form.password ? callback() : callback(new Error('两次输入的密码不一致')),
      trigger: 'blur',
    },
  ],
};

/** 使用 URL 查询参数中的 Token 调用真实激活接口，不保存登录态。 */
async function submitActivation() {
  if (!validToken.value || submitting.value) return;
  if (!(await formRef.value?.validate().catch(() => false))) return;
  submitting.value = true;
  try {
    activatedProfile.value = await activateAgent({ token: token.value, ...form });
  } finally {
    submitting.value = false;
  }
}

function goLogin() {
  void router.replace({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.activate-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  overflow: hidden;
  place-items: center;
  padding: 40px 20px;
  background: linear-gradient(145deg, #eaf8fb 0%, #f7fbff 46%, #e8f2ff 100%);
  &::before {
    position: absolute;
    inset: 0;
    opacity: 0.48;
    content: '';
    background-image: radial-gradient(circle, #8ab9d8 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: radial-gradient(circle at center, #000, transparent 72%);
  }
  &__glow {
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.25;
  }
  &__glow--one {
    top: -180px;
    left: -100px;
    background: #28d7c7;
  }
  &__glow--two {
    right: -140px;
    bottom: -200px;
    background: #499cf2;
  }
}
.activate-card {
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
  &__shield {
    display: grid;
    width: 50px;
    height: 50px;
    flex: none;
    place-items: center;
    border-radius: 14px;
    color: #079d92;
    background: #e7faf7;
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
  &__success,
  &__invalid {
    display: grid;
    width: 76px;
    height: 76px;
    margin-bottom: 20px;
    place-items: center;
    border-radius: 50%;
    font-size: 42px;
  }
  &__success {
    color: #08a77c;
    background: #e0f8ef;
  }
  &__invalid {
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
  .activate-page {
    padding: 16px;
  }
  .activate-card {
    padding: 26px 21px 22px;
    border-radius: 18px;
  }
  .activate-card h1 {
    font-size: 23px;
  }
}
</style>
