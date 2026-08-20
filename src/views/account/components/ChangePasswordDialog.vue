<template>
  <el-dialog
    :model-value="modelValue"
    class="password-dialog"
    width="540px"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="resetForm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="password-dialog__header">
        <span
          ><el-icon><Key /></el-icon
        ></span>
        <div>
          <small>账户安全</small>
          <h2>修改登录密码</h2>
          <p>设置一个仅用于 MTPay 的高强度密码</p>
        </div>
      </div>
    </template>

    <div class="password-dialog__notice">
      <el-icon><WarningFilled /></el-icon>
      修改成功后，所有设备上的登录状态都会失效。
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="当前密码" prop="currentPassword">
        <el-input
          v-model="form.currentPassword"
          type="password"
          show-password
          maxlength="255"
          autocomplete="current-password"
          placeholder="请输入当前登录密码"
        >
          <template #prefix
            ><el-icon><Lock /></el-icon
          ></template>
        </el-input>
      </el-form-item>

      <div class="password-dialog__divider"><span>设置新密码</span></div>

      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          maxlength="20"
          autocomplete="new-password"
          placeholder="8–20 位大小写字母与数字组合"
        >
          <template #prefix
            ><el-icon><Key /></el-icon
          ></template>
        </el-input>
      </el-form-item>

      <el-form-item label="确认新密码" prop="passwordConfirmation">
        <el-input
          v-model="form.passwordConfirmation"
          type="password"
          show-password
          maxlength="20"
          autocomplete="new-password"
          placeholder="请再次输入新密码"
        >
          <template #prefix
            ><el-icon><CircleCheck /></el-icon
          ></template>
        </el-input>
      </el-form-item>

      <ul class="password-dialog__rules">
        <li>长度为 8–20 位</li>
        <li>至少包含一个大写字母、一个小写字母和一个数字</li>
        <li>只允许使用英文字母和数字</li>
      </ul>

      <footer class="password-dialog__footer">
        <el-button @click="emit('update:modelValue', false)">取消</el-button>
        <el-button type="primary" native-type="submit" :loading="submitting">
          <el-icon><Check /></el-icon>
          确认修改
        </el-button>
      </footer>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { Check, CircleCheck, Key, Lock, WarningFilled } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

defineProps<{ modelValue: boolean; submitting: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (
    e: 'submit',
    payload: {
      current_password: string;
      password: string;
      password_confirmation: string;
    },
  ): void;
}>();

const formRef = ref<FormInstance>();
const form = reactive({ currentPassword: '', password: '', passwordConfirmation: '' });
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
const rules: FormRules<typeof form> = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (!passwordPattern.test(value)) callback(new Error('密码格式不符合安全要求'));
        else callback();
      },
      trigger: ['blur', 'change'],
    },
  ],
  passwordConfirmation: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (value !== form.password) callback(new Error('两次输入的新密码不一致'));
        else callback();
      },
      trigger: ['blur', 'change'],
    },
  ],
};

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  emit('submit', {
    current_password: form.currentPassword,
    password: form.password,
    password_confirmation: form.passwordConfirmation,
  });
}

function resetForm() {
  formRef.value?.resetFields();
}
</script>

<style lang="scss">
.password-dialog {
  overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 28px 90px rgb(13 40 69 / 22%);

  .el-dialog__header {
    margin: 0;
    padding: 26px 28px 22px;
    background: linear-gradient(135deg, #f1fbfa, #f3f8ff);
  }
  .el-dialog__headerbtn {
    top: 18px;
    right: 18px;
  }
  .el-dialog__body {
    padding: 24px 28px 28px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 15px;
    > span {
      display: inline-flex;
      width: 52px;
      height: 52px;
      flex: 0 0 52px;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      color: #fff;
      background: linear-gradient(135deg, #27b9aa, #1d8db5);
      box-shadow: 0 10px 22px rgb(29 141 181 / 22%);
      font-size: 23px;
    }
    small {
      color: #15998f;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
    }
    h2 {
      margin: 3px 0;
      color: #0b1d34;
      font-size: 22px;
    }
    p {
      margin: 0;
      color: #71849a;
      font-size: 12px;
    }
  }

  &__notice {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 22px;
    padding: 12px 14px;
    border: 1px solid #f1dba8;
    border-radius: 11px;
    color: #91631b;
    background: #fffaf0;
    font-size: 12px;
  }
  &__notice .el-icon {
    color: #e6a023;
    font-size: 17px;
  }
  &__divider {
    position: relative;
    margin: 4px 0 18px;
    color: #8293a8;
    font-size: 12px;
    text-align: center;
  }
  &__divider::before {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 1px;
    background: #e6edf3;
    content: '';
  }
  &__divider span {
    position: relative;
    padding: 0 12px;
    background: #fff;
  }
  &__rules {
    display: grid;
    gap: 6px;
    margin: -2px 0 24px;
    padding: 13px 16px 13px 32px;
    border-radius: 11px;
    color: #73859a;
    background: #f7fafc;
    font-size: 12px;
    line-height: 1.5;
  }
  &__rules li::marker {
    color: #26aa9f;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 4px;
  }

  @media (max-width: 767px) {
    width: calc(100% - 28px) !important;
    .el-dialog__header,
    .el-dialog__body {
      padding-right: 20px;
      padding-left: 20px;
    }
    &__header > span {
      width: 46px;
      height: 46px;
      flex-basis: 46px;
    }
    &__header h2 {
      font-size: 19px;
    }
    &__footer .el-button {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
