<template>
  <el-form label-position="top" :disabled="busy" @submit.prevent="submit">
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    
    <el-form-item required v-if="mode === 'change'" :label="t('paymentPassword.oldPassword')"
      ><el-input
        v-model="old"
        type="password"
        show-password
        maxlength="6"
        inputmode="numeric"
        autocomplete="off"
    /></el-form-item>
    <el-form-item required :label="t('paymentPassword.newPassword')"
      ><el-input
        v-model="password"
        type="password"
        show-password
        maxlength="6"
        inputmode="numeric"
        autocomplete="new-password"
    /></el-form-item>
    
    <el-form-item required :label="t('paymentPassword.confirmation')"
      ><el-input
        v-model="confirmation"
        type="password"
        show-password
        maxlength="6"
        inputmode="numeric"
        autocomplete="new-password"
    /></el-form-item>
    <el-form-item
      required
      v-if="mode !== 'change'"
      :label="t('withdrawalSecurity.authenticatorCode')"
    >
      <el-input v-model="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code"
        ><template #prefix><i class="ri-shield-keyhole-line" /></template
      ></el-input>
    </el-form-item>
    <div class="payment-form__actions">
      <el-button type="primary" native-type="submit" :loading="busy">{{
        t('paymentPassword.' + mode)
      }}</el-button>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import * as api from '@/api/modules/paymentPassword';
import {
  paymentPasswordPattern as pattern,
  paymentError,
  notifyPaymentSecurityChanged,
} from '@/utils/paymentPassword';
const props = defineProps<{ mode: 'setup' | 'change' | 'reset'; token?: string }>();
const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'failed'): void;
  (e: 'busy', value: boolean): void;
}>();
const { t } = useI18n();
const old = ref(''),
  password = ref(''),
  confirmation = ref(''),
  code = ref(''),
  error = ref('');
const busy = ref(false);
function clear() {
  old.value = password.value = confirmation.value = code.value = '';
}
function setBusy(value: boolean) {
  busy.value = value;
  emit('busy', value);
}
async function submit() {
  if (busy.value) return;
  if (
    !pattern.test(password.value) ||
    password.value !== confirmation.value ||
    (props.mode === 'change' && (!pattern.test(old.value) || old.value === password.value)) ||
    (props.mode !== 'change' && !pattern.test(code.value))
  ) {
    error.value = t('paymentPassword.invalid');
    return;
  }
  if (props.mode === 'reset' && !/^[a-f0-9]{64}$/.test(props.token || '')) {
    error.value = t('paymentPassword.invalidLink');
    return;
  }
  setBusy(true);
  error.value = '';
  const fields = {
    payment_password: password.value,
    payment_password_confirmation: confirmation.value,
  };
  try {
    if (props.mode === 'setup') await api.setPaymentPassword({ ...fields, code: code.value });
    else if (props.mode === 'change')
      await api.updatePaymentPassword({ ...fields, old_payment_password: old.value });
    else await api.resetPaymentPassword({ ...fields, code: code.value, token: props.token! });
    clear();
    notifyPaymentSecurityChanged();
    emit('success');
  } catch (e) {
    error.value = paymentError(e);
    old.value = '';
    code.value = '';
    emit('failed');
  } finally {
    setBusy(false);
  }
}
onBeforeUnmount(() => {
  clear();
});
</script>
<style scoped>
.payment-form__actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.payment-form__actions .el-button {
  min-width: 160px;
}
p,
small {
  color: #748497;
  font-size: 12px;
  line-height: 1.6;
}
.el-alert {
  margin-bottom: 16px;
}
</style>
