<template>
  <el-dialog :model-value="modelValue" class="security-dialog" width="480px" append-to-body destroy-on-close
    :close-on-click-modal="false" :close-on-press-escape="!busy" :show-close="!busy" :before-close="requestClose">
    <template #header>
      <div class="security-dialog__header">
        <button v-if="step !== 'overview'" type="button" class="security-dialog__back" :disabled="busy" @click="step = 'overview'"><i class="ri-arrow-left-line" /></button>
        <span v-else class="security-dialog__icon"><i class="ri-shield-keyhole-line" /></span>
        <h3>{{ stepTitle }}</h3>
      </div>
    </template>
    <el-alert v-if="error" :title="uncertain ? t('withdrawalSecurity.uncertain') : error" type="error" :closable="false" />
    <div v-if="step === 'overview'" class="security-options">
      <button type="button" :disabled="busy || expired || uncertain || emailVerified" @click="step = 'email'">
        <span class="security-options__leading email"><i class="ri-mail-line" /></span>
        <span><strong>{{ t('withdrawalSecurity.emailVerification') }}</strong><small v-if="emailVerified">{{ t('withdrawalSecurity.verified') }}</small></span>
        <i :class="emailVerified ? 'ri-checkbox-circle-fill verified' : 'ri-arrow-right-s-line'" />
      </button>
      <button type="button" :disabled="busy || expired || uncertain || twoFactorVerified" @click="step = 'twoFactor'">
        <span class="security-options__leading two-factor"><i class="ri-smartphone-line" /></span>
        <span><strong>{{ t('withdrawalSecurity.twoFactorVerification') }}</strong><small v-if="twoFactorVerified">{{ t('withdrawalSecurity.verified') }}</small></span>
        <i :class="twoFactorVerified ? 'ri-checkbox-circle-fill verified' : 'ri-arrow-right-s-line'" />
      </button>
    </div>
    <el-form v-else label-position="top" @submit.prevent="verify">
      <el-form-item v-if="step === 'email'" :label="t('withdrawalSecurity.emailAddress')">
        <el-input :model-value="email" readonly />
      </el-form-item>
      <el-form-item :label="t(step === 'email' ? 'withdrawalSecurity.emailCode' : 'withdrawalSecurity.authenticatorCode')" :error="invalid ? t('withdrawalSecurity.codeInvalid') : ''">
        <el-input v-model="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code" :disabled="busy || expired || uncertain">
          <template v-if="step === 'email'" #append><el-button text type="primary" :disabled="busy || expired || uncertain || resendSeconds > 0" @click="emit('send-email-code')">{{ resendSeconds > 0 ? t('withdrawalSecurity.resendAfter', { seconds: resendSeconds }) : t('withdrawalSecurity.sendCode') }}</el-button></template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="security-dialog__footer-actions">
        <el-button :disabled="busy" @click="requestClose">{{ t('common.actions.cancel') }}</el-button>
        <el-button v-if="step === 'overview'" type="primary" :disabled="!ready || busy" :loading="busy" @click="emit('confirm')">{{ t('withdrawalSecurity.submitWithdrawal') }}</el-button>
        <el-button v-else type="primary" :loading="busy" :disabled="busy || expired || uncertain" @click="verify">
          {{ t(step === 'email' ? 'withdrawalSecurity.completeEmail' : 'withdrawalSecurity.completeTwoFactor') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const props = defineProps<{ modelValue: boolean; busy: boolean; email: string; emailVerified: boolean; twoFactorVerified: boolean; expired: boolean; uncertain: boolean; error: string; resendSeconds: number; ready: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'confirm'): void; (e: 'send-email-code'): void; (e: 'verify', kind: 'email' | 'twoFactor', code: string): void }>();
const { t } = useI18n();
const step = ref<'overview' | 'email' | 'twoFactor'>('overview');
const code = ref('');
const invalid = ref(false);
const stepTitle = computed(() => t(step.value === 'email' ? 'withdrawalSecurity.emailVerification' : step.value === 'twoFactor' ? 'withdrawalSecurity.twoFactorVerification' : 'withdrawalSecurity.title'));
watch(() => props.modelValue, () => { step.value = 'overview'; code.value = ''; invalid.value = false; });
watch(step, () => { code.value = ''; invalid.value = false; });
watch(() => [props.emailVerified, props.twoFactorVerified], () => {
  if ((step.value === 'email' && props.emailVerified) || (step.value === 'twoFactor' && props.twoFactorVerified)) step.value = 'overview';
});
watch(() => props.error, value => { if (value) code.value = ''; });
function requestClose() { if (!props.busy) emit('close'); }
function verify() {
  if (props.busy || props.expired || props.uncertain || step.value === 'overview') return;
  invalid.value = !/^\d{6}$/.test(code.value);
  if (!invalid.value) emit('verify', step.value, code.value);
}
</script>
<style scoped lang="scss">
.security-dialog__header {
  display: flex;
  align-items: center;
  gap: 14px
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
  font-size: 22px
}

.security-dialog__back {
  cursor: pointer
}

.security-dialog__header h3 {
  margin: 0;
  color: var(--portal-text);
  font-size: 19px
}



.security-options {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px
}

.security-options>button {
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
  transition: .2s
}

.security-options>button:disabled { cursor: default; opacity: .65; }

.security-options>button:hover {
  border-color: #52c7bd;
  background: #f7fcfb
}

.security-options__leading {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 11px;
  font-size: 20px
}

.security-options__leading.email {
  color: #1479e8;
  background: #eaf3ff
}

.security-options__leading.two-factor {
  color: #079d98;
  background: #e8f8f6
}

.security-options>button>span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 5px
}

.security-options strong {
  color: #102a48;
  font-size: 14px
}

.security-options small {
  color: #7d8da2
}

.security-options>button>i {
  color: #9aabbc;
  font-size: 20px
}

.security-options>button>i.verified {
  color: #10a78f
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
  padding-top: 12px
}

@include mobile {
  :global(.security-dialog) {
    width: calc(100vw - 28px) !important
  }
}
</style>
