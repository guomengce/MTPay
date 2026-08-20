<template>
  <div class="form-card">
    <header class="form-card__header">
      <h2 class="form-card__title">欢迎登录 MTPay</h2>
      <p class="form-card__subtitle">安全管理您的资产与每一笔交易</p>
    </header>

    <el-form
      ref="formRef"
      class="form-card__form"
      label-position="top"
      :model="form"
      :rules="rules"
      hide-required-asterisk
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="账户 Email" prop="email">
        <el-input v-model="form.email" autocomplete="username" placeholder="请输入您的账户 Email">
          <template #prefix>
            <el-icon class="form-card__icon"><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="请输入您的密码"
        >
          <template #prefix>
            <el-icon class="form-card__icon"><Lock /></el-icon>
          </template>
          <template #suffix>
            <el-icon
              class="form-card__icon form-card__icon--toggle"
              @click="showPassword = !showPassword"
            >
              <component :is="showPassword ? View : Hide" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button
        type="primary"
        native-type="submit"
        class="form-card__submit"
        :loading="submitting"
      >
        登录
      </el-button>
    </el-form>

    <div class="form-card__links">
      <a class="form-card__link" href="javascript:void(0)" @click.prevent="emit('forgot-password')"
        >忘记密码</a
      >
      <span class="form-card__divider" />
      <a class="form-card__link" href="javascript:void(0)" @click.prevent="emit('contact')"
        >联系客服</a
      >
    </div>

    <div class="form-card__footer">
      <el-icon class="form-card__footer-icon"><CircleCheckFilled /></el-icon>
      <span>企业级安全保护 · 交易全程可追溯</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录表单组件
 * 只负责：表单 UI、收集输入、暴露 loading 状态、对外发出提交事件。
 * 真实登录请求与登录态写入由 index.vue 直接处理。
 */
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleCheckFilled, Hide, Lock, Message, View } from '@element-plus/icons-vue';

const props = defineProps<{
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; password: string }): void;
  (e: 'forgot-password'): void;
  (e: 'contact'): void;
}>();

const form = reactive({ email: '', password: '' });
const formRef = ref<FormInstance>();
const showPassword = ref(false);
const submitting = computed(() => props.submitting ?? false);
const rules: FormRules<typeof form> = {
  email: [
    { required: true, message: '请输入账户 Email', trigger: 'blur' },
    { type: 'email', message: '请输入有效的 Email 地址', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

async function handleSubmit() {
  if (submitting.value) return;
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  emit('submit', { email: form.email.trim(), password: form.password });
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

  &__submit {
    width: 100%;
    margin-top: 6px;
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
