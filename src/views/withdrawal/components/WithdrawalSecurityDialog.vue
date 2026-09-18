<template>
  <AgentDialog
    :model-value="modelValue"
    :title="stepTitle"
    class="security-dialog"
    width="480px"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="!busy"
    :show-close="!busy"
    :before-close="requestClose"
  >
    <template #header>
      <div class="security-dialog__header">
        <button
          v-if="step !== 'overview'"
          type="button"
          class="security-dialog__back"
          :disabled="busy"
          @click="step = 'overview'"
        >
          <i class="ri-arrow-left-line" />
        </button>
        <span v-else class="security-dialog__icon"><i class="ri-shield-keyhole-line" /></span>
        <h3>{{ stepTitle }}</h3>
      </div>
    </template>
    <el-alert
      v-if="error"
      :title="uncertain ? t('withdrawalSecurity.uncertain') : error"
      type="error"
      :closable="false"
    />
    <div v-if="step === 'overview'" class="security-options">
      <button type="button" :disabled="busy || expired || uncertain" @click="step = 'password'">
        <span class="security-options__leading two-factor"
          ><i class="ri-lock-password-line"
        /></span>
        <span
          ><strong>{{ t('paymentPassword.title') }}</strong
          ><small v-if="passwordEntered">{{ t('paymentPassword.entered') }}</small></span
        >
        <i :class="passwordEntered ? 'ri-checkbox-circle-fill verified' : 'ri-arrow-right-s-line'" />
      </button>
      <button
        type="button"
        :disabled="busy || expired || uncertain || emailVerified"
        @click="step = 'email'"
      >
        <span class="security-options__leading email"><i class="ri-mail-line" /></span>
        <span
          ><strong>{{ t('withdrawalSecurity.emailVerification') }}</strong
          ><small v-if="emailVerified">{{ t('withdrawalSecurity.verified') }}</small></span
        >
        <i :class="emailVerified ? 'ri-checkbox-circle-fill verified' : 'ri-arrow-right-s-line'" />
      </button>
      <button
        type="button"
        :disabled="busy || expired || uncertain || twoFactorVerified"
        @click="step = 'twoFactor'"
      >
        <span class="security-options__leading two-factor"><i class="ri-smartphone-line" /></span>
        <span
          ><strong>{{ t('withdrawalSecurity.twoFactorVerification') }}</strong
          ><small v-if="twoFactorVerified">{{ t('withdrawalSecurity.verified') }}</small></span
        >
        <i
          :class="twoFactorVerified ? 'ri-checkbox-circle-fill verified' : 'ri-arrow-right-s-line'"
        />
      </button>
    </div>
    <el-form
      v-else-if="step === 'password'"
      label-position="top"
      autocomplete="off"
      @submit.prevent="savePassword"
    >
      <el-form-item
        required
        :label="t('paymentPassword.title')"
        :error="passwordInvalid ? t('paymentPassword.formatInvalid') : ''"
      >
        <PaymentPasswordInput
          v-model="passwordDraft"
          :label="t('paymentPassword.title')"
          :disabled="busy || expired || uncertain"
        />
      </el-form-item>
      <div class="security-dialog__forgot">
        <el-button
          link
          type="primary"
          :loading="resetSending"
          :disabled="busy || resetSending || resetCooldown > 0"
          @click="sendResetEmail"
          >{{ t('paymentPassword.forgot')
          }}<span v-if="resetCooldown"> ({{ resetCooldown }}s)</span></el-button
        >
      </div>
    </el-form>
    <el-form v-else label-position="top" @submit.prevent="verify">
      <el-form-item v-if="step === 'email'" :label="t('withdrawalSecurity.emailAddress')">
        <el-input :model-value="email" readonly />
      </el-form-item>
      <el-form-item
        :label="
          t(
            step === 'email'
              ? 'withdrawalSecurity.emailCode'
              : 'withdrawalSecurity.authenticatorCode',
          )
        "
        :error="invalid ? t('withdrawalSecurity.codeInvalid') : ''"
      >
        <el-input
          v-model="code"
          maxlength="6"
          inputmode="numeric"
          autocomplete="one-time-code"
          :disabled="busy || expired || uncertain"
        >
          <template v-if="step === 'email'" #append
            ><el-button
              text
              type="primary"
              class="email-code-button"
              :loading="sendingEmail"
              :disabled="busy || expired || uncertain || resendSeconds > 0"
              @click="emit('send-email-code')"
              >{{
                resendSeconds > 0
                  ? t('withdrawalSecurity.resendAfter', { seconds: resendSeconds })
                  : t('withdrawalSecurity.sendCode')
              }}</el-button
            ></template
          >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="security-dialog__footer-actions">
        <el-button :disabled="busy" @click="requestClose">{{
          t('common.actions.cancel')
        }}</el-button>
        <el-button
          v-if="step === 'overview'"
          type="primary"
          :disabled="!ready || busy || !passwordEntered"
          :loading="busy && !sendingEmail"
          @click="confirm"
          >{{ t('withdrawalSecurity.submitWithdrawal') }}</el-button
        >
        <el-button
          v-else-if="step === 'password'"
          type="primary"
          :disabled="busy || expired || uncertain"
          @click="savePassword"
          >{{ t('paymentPassword.completeEntry') }}</el-button
        >
        <el-button
          v-else
          type="primary"
          :loading="busy && !sendingEmail"
          :disabled="busy || expired || uncertain"
          @click="verify"
        >
          {{
            t(
              step === 'email'
                ? 'withdrawalSecurity.completeEmail'
                : 'withdrawalSecurity.completeTwoFactor',
            )
          }}
        </el-button>
      </div>
    </template>
  </AgentDialog>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { forgotPaymentPassword } from '@/api/modules/paymentPassword';
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import PaymentPasswordInput from './PaymentPasswordInput.vue';
import AgentDialog from '@/components/common/AgentDialog.vue';
const props = defineProps<{
  modelValue: boolean;
  busy: boolean;
  sendingEmail: boolean;
  email: string;
  emailVerified: boolean;
  twoFactorVerified: boolean;
  expired: boolean;
  uncertain: boolean;
  error: string;
  resendSeconds: number;
  ready: boolean;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', password: string): void;
  (e: 'send-email-code'): void;
  (e: 'verify', kind: 'email' | 'twoFactor', code: string): void;
}>();
const { t } = useI18n();
const step = ref<'overview' | 'password' | 'email' | 'twoFactor'>('overview');
const resetSending = ref(false),
  resetCooldown = ref(0);
let resetDeadline = 0;
const resetTimer = setInterval(() => {
  resetCooldown.value = Math.max(0, Math.ceil((resetDeadline - Date.now()) / 1000));
}, 1000);
onBeforeUnmount(() => clearInterval(resetTimer));
async function sendResetEmail() {
  if (props.busy || resetSending.value || resetCooldown.value) return;
  resetSending.value = true;
  try {
    await forgotPaymentPassword();
    resetDeadline = Date.now() + 60000;
    resetCooldown.value = 60;
    ElMessage.success(t('paymentPassword.emailSent'));
  } catch {
    /* Server errors are displayed by the request interceptor. */
  } finally {
    resetSending.value = false;
  }
}
const code = ref('');
const paymentPassword = ref('');
const passwordInvalid = ref(false);
const passwordDraft = ref('');
const passwordEntered = computed(() => /^[0-9]{6}$/.test(paymentPassword.value));
function savePassword() {
  if (props.busy || props.expired || props.uncertain) return;
  passwordInvalid.value = !/^[0-9]{6}$/.test(passwordDraft.value);
  if (passwordInvalid.value) return;
  paymentPassword.value = passwordDraft.value;
  step.value = 'overview';
}
function confirm() {
  passwordInvalid.value = !/^[0-9]{6}$/.test(paymentPassword.value);
  if (!passwordInvalid.value && props.ready && !props.busy) {
    emit('confirm', paymentPassword.value);
    paymentPassword.value = '';
  }
}
const invalid = ref(false);
const stepTitle = computed(() =>
  t(
    step.value === 'password'
      ? 'paymentPassword.title'
      : step.value === 'email'
        ? 'withdrawalSecurity.emailVerification'
        : step.value === 'twoFactor'
          ? 'withdrawalSecurity.twoFactorVerification'
          : 'withdrawalSecurity.title',
  ),
);
watch(
  () => props.modelValue,
  () => {
    step.value = 'overview';
    code.value = '';
    paymentPassword.value = '';
    passwordDraft.value = '';
    passwordInvalid.value = false;
    invalid.value = false;
  },
);
watch(step, (value) => {
  code.value = '';
  invalid.value = false;
  passwordInvalid.value = false;
  passwordDraft.value = '';
  if (value === 'password') paymentPassword.value = '';
});
watch(
  () => [props.emailVerified, props.twoFactorVerified],
  () => {
    if (
      (step.value === 'email' && props.emailVerified) ||
      (step.value === 'twoFactor' && props.twoFactorVerified)
    )
      step.value = 'overview';
  },
);
watch(
  () => props.error,
  (value) => {
    if (value) {
      code.value = '';
      paymentPassword.value = '';
      passwordDraft.value = '';
    }
  },
);
function requestClose() {
  if (!props.busy) emit('close');
}
function verify() {
  if (
    props.busy ||
    props.expired ||
    props.uncertain ||
    step.value === 'overview' ||
    step.value === 'password'
  )
    return;
  invalid.value = !/^\d{6}$/.test(code.value);
  if (!invalid.value) emit('verify', step.value, code.value);
}
</script>
<style scoped lang="scss">
.security-dialog__forgot {
  display: flex;
  justify-content: flex-end;
  margin-top: -6px;
}
.security-dialog__header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.security-dialog__icon,
.security-dialog__back {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border: 0;
  border-radius: 12px;
  color: #079d98;
  background: #e5f8f5;
  font-size: 22px;
}

.security-dialog__back {
  cursor: pointer;
}

.security-dialog__header h3 {
  margin: 0;
  color: var(--portal-text);
  font-size: 19px;
}

.security-options {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.security-options > button {
  display: grid;
  width: 100%;
  grid-template-columns: 46px 1fr auto;
  align-items: center;
  gap: 13px;
  padding: 15px;
  border: 1px solid #dbe7f1;
  border-radius: 13px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

.security-options > button:disabled {
  cursor: default;
  opacity: 0.65;
}

.security-options > button:hover {
  border-color: #52c7bd;
  background: #f7fcfb;
}

.security-options__leading {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 11px;
  font-size: 20px;
}

.security-options__leading.email {
  color: #1479e8;
  background: #eaf3ff;
}

.security-options__leading.two-factor {
  color: #079d98;
  background: #e8f8f6;
}

.security-options > button > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.security-options strong {
  color: #102a48;
  font-size: 14px;
}

.security-options small {
  color: #7d8da2;
}

.security-options > button > i {
  color: #9aabbc;
  font-size: 20px;
}

.security-options > button > i.verified {
  color: #10a78f;
}

.security-dialog__footer-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}

.security-dialog__footer-actions .el-button {
  width: 100%;
  min-height: 40px;
  margin: 0;
}

:global(.security-dialog .el-dialog__body) {
  padding-top: 12px;
}

@include mobile {
  :global(.security-dialog) {
    width: calc(100vw - 28px) !important;
  }
}
</style>
