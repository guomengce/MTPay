<template>
  <div class="form-card">
    <header class="form-card__header">
      <h2 class="form-card__title">{{ t('auth.welcome') }}</h2>
    </header>

    <el-form
      class="form-card__form"
      label-position="top"
      :model="form"
      hide-required-asterisk
      @submit.prevent="handleSubmit"
    >
      <el-form-item :label="t('auth.email')">
        <el-input v-model="form.email" autocomplete="username" :placeholder="t('auth.emailPlaceholder')">
          <template #prefix>
            <el-icon class="form-card__icon"><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="t('auth.password')">
        <el-input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          :placeholder="t('auth.passwordPlaceholder')"
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
        {{ t('auth.login') }}
      </el-button>
    </el-form>

    <div class="form-card__links">
      <a class="form-card__link" href="javascript:void(0)" @click.prevent="emit('forgot-password')"
        >{{ t('auth.forgotPassword') }}</a
      >
      <!-- <span class="form-card__divider" />
      <a class="form-card__link" href="javascript:void(0)" @click.prevent="emit('contact')"
        >{{ t('auth.contact') }}</a
      > -->
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
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
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
const showPassword = ref(false);
const submitting = computed(() => props.submitting ?? false);
const { t } = useI18n();
function handleSubmit() {
  if (submitting.value) return;
  const email = form.email.trim();
  if (!email) { showLoginMessage(t('auth.emailRequired')); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showLoginMessage(t('auth.emailInvalid')); return; }
  if (!form.password) { showLoginMessage(t('auth.passwordRequired')); return; }
  emit('submit', { email, password: form.password });
}

function showLoginMessage(message: string) {
  ElMessage({ message, type: 'warning' });
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
