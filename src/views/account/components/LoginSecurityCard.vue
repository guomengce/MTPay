<template>
  <article class="security-card">
    <header class="security-card__header">
      <span class="security-card__header-icon"><el-icon><Lock /></el-icon></span>
      <h2>{{ t('account.loginSecurity') }}</h2>
    </header>

    <div class="security-card__body">
      <el-form ref="formRef" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="top" @submit.prevent="handleSubmit">
        <el-form-item class="is-current" :label="t('account.currentPassword')" prop="currentPassword">
          <el-input v-model="form.currentPassword" type="password" show-password maxlength="255" autocomplete="current-password" :placeholder="t('account.currentPasswordPlaceholder')"><template #prefix><el-icon><Lock /></el-icon></template></el-input>
        </el-form-item>
        <el-form-item :label="t('account.newPassword')" prop="password">
          <el-input v-model="form.password" type="password" show-password maxlength="20" autocomplete="new-password" :placeholder="t('account.newPasswordPlaceholder')"><template #prefix><el-icon><Key /></el-icon></template></el-input>
        </el-form-item>
        <el-form-item :label="t('account.confirmPassword')" prop="passwordConfirmation">
          <el-input v-model="form.passwordConfirmation" type="password" show-password maxlength="20" autocomplete="new-password" :placeholder="t('account.confirmPasswordPlaceholder')"><template #prefix><el-icon><CircleCheck /></el-icon></template></el-input>
        </el-form-item>
        <div class="security-card__actions">
          <el-button type="primary" native-type="submit" :loading="submitting" :icon="Check">{{ t('account.confirmChange') }}</el-button>
        </div>
      </el-form>
    </div>

  </article>
</template>

<script setup lang="ts">
import { Check, CircleCheck, Key, Lock } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{ submitting: boolean }>();
const emit = defineEmits<{ (e: 'submit', payload: { current_password: string; password: string; password_confirmation: string }): void }>();
const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = reactive({ currentPassword: '', password: '', passwordConfirmation: '' });
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
const rules = computed<FormRules<typeof form>>(() => ({
  currentPassword: [{ required: true, message: t('account.currentRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('account.newRequired'), trigger: 'blur' }, { validator: (_rule, value: string, callback) => passwordPattern.test(value) ? callback() : callback(new Error(t('account.passwordInvalid'))), trigger: ['blur', 'change'] }],
  passwordConfirmation: [{ required: true, message: t('account.confirmRequired'), trigger: 'blur' }, { validator: (_rule, value: string, callback) => value === form.password ? callback() : callback(new Error(t('account.passwordMismatch'))), trigger: ['blur', 'change'] }],
}));
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  emit('submit', { current_password: form.currentPassword, password: form.password, password_confirmation: form.passwordConfirmation });
}
</script>

<style scoped lang="scss">
.security-card {
  height: 100%;
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

  &__body { padding: 22px 24px 24px; }
  &__body .el-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 14px; }
  &__body .el-form-item.is-current, &__actions { grid-column: 1 / -1; }
  &__actions { display: flex; justify-content: flex-end; padding-top: 2px; }

  @include mobile {
    &__header, &__body { padding-right: 20px; padding-left: 20px; }
    &__body .el-form { grid-template-columns: 1fr; }
    &__body .el-form-item.is-current, &__actions { grid-column: auto; }
    &__actions .el-button { width: 100%; }
  }
}
</style>
