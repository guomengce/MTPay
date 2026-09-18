<template>
  <article id="payment-password-settings" v-loading="loading" class="payment-card">
    <header>
      <span class="payment-card__icon"
        ><el-icon><Lock /></el-icon
      ></span>
      <h2>{{ t('paymentPassword.title') }}</h2>
      <el-tag v-if="status" :type="status.has_payment_password ? 'success' : 'info'">{{
        t(status.has_payment_password ? 'paymentPassword.set' : 'paymentPassword.unset')
      }}</el-tag>
    </header>
    <div class="payment-card__body">
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <template v-if="status">
        <el-alert
          v-if="!status.two_factor_enabled"
          :title="t('paymentPassword.twoFactorRequired')"
          type="warning"
          :closable="false"
        />
        <el-alert
          v-if="status.locked_until"
          :title="t('paymentPassword.locked', { time: status.locked_until })"
          type="warning"
          :closable="false"
        />
        <p v-if="status.has_payment_password" class="mask">● ● ● ● ● ●</p>
        <div class="actions">
          <el-button
            type="primary"
            :disabled="loading || !status.two_factor_enabled || !!status.locked_until"
            @click="open"
            >{{
              t(
                status.has_payment_password
                  ? 'paymentPassword.changeShort'
                  : 'paymentPassword.setup',
              )
            }}</el-button
          >
          <el-button
            v-if="status.has_payment_password"
            :loading="sending"
            :disabled="loading || !status.two_factor_enabled || cooldown > 0"
            @click="forgot"
            >{{ t('paymentPassword.forgotShort')
            }}<span v-if="cooldown" class="cooldown">{{ cooldown }}s</span></el-button
          >
        </div>
      </template>
    </div>
    <AgentDialog
      v-model="visible"
      :title="t('paymentPassword.' + mode)"
      :icon="Lock"
      width="480px"
      destroy-on-close
      :close-on-click-modal="false"
      :close-on-press-escape="!busy"
      :show-close="!busy"
    >
      <PaymentPasswordForm
        v-if="visible"
        :mode="mode"
        @busy="busy = $event"
        @success="saved"
        @failed="load"
      />
    </AgentDialog>
  </article>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import AgentDialog from '@/components/common/AgentDialog.vue';
import PaymentPasswordForm from './PaymentPasswordForm.vue';
import {
  getPaymentPasswordStatus,
  forgotPaymentPassword,
  type PaymentPasswordStatus,
} from '@/api/modules/paymentPassword';
import { paymentError, onPaymentSecurityChanged } from '@/utils/paymentPassword';
const emit = defineEmits<{ (e: 'changed'): void }>();
const { t } = useI18n();
const status = ref<PaymentPasswordStatus | null>(null),
  loading = ref(false),
  error = ref('');
const visible = ref(false),
  busy = ref(false),
  sending = ref(false),
  cooldown = ref(0),
  mode = ref<'setup' | 'change'>('setup');
let deadline = 0;
const timer = setInterval(() => {
  cooldown.value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}, 1000);
async function load() {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    status.value = await getPaymentPasswordStatus();
    if (!status.value.two_factor_enabled || status.value.locked_until) visible.value = false;
  } catch (e) {
    status.value = null;
    error.value = paymentError(e) || t('paymentPassword.loadFailed');
  } finally {
    loading.value = false;
  }
}
function open() {
  if (!status.value?.two_factor_enabled || status.value.locked_until) return;
  mode.value = status.value.has_payment_password ? 'change' : 'setup';
  visible.value = true;
}
async function saved() {
  visible.value = false;
  ElMessage.success(t('paymentPassword.success'));
  emit('changed');
  await load();
}
async function forgot() {
  if (sending.value || cooldown.value || !status.value?.two_factor_enabled) return;
  sending.value = true;
  error.value = '';
  try {
    await forgotPaymentPassword();
    deadline = Date.now() + 60000;
    cooldown.value = 60;
    ElMessage.success(t('paymentPassword.emailSent'));
  } catch (e) {
    await load();
    // The request interceptor displays the server error with ElMessage.
  } finally {
    sending.value = false;
  }
}
const stop = onPaymentSecurityChanged(() => {
  void load();
});
onMounted(load);
onBeforeUnmount(() => {
  stop();
  clearInterval(timer);
});
</script>
<style scoped lang="scss">
.payment-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgb(192 211 227 / 70%);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 18px 50px rgb(35 82 126 / 8%);
}
header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 25px 26px;
  border-bottom: 1px solid #e8f0f5;
}
h2 {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 20px;
  overflow-wrap: anywhere;
}
.payment-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 14px;
  color: #fff;
  font-size: 21px;
  background: linear-gradient(135deg, #27b9aa, #1d8db5);
  box-shadow: 0 9px 20px rgb(29 141 181 / 20%);
}
.payment-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px 24px;
  min-height: 142px;
}
.payment-card__body .el-alert {
  margin-bottom: 16px;
}
.mask {
  margin: 0 0 18px;
  color: #119d98;
  letter-spacing: 8px;
  text-align: center;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}
.actions .el-button {
  margin: 0;
  min-height: 36px;
}
.cooldown {
  margin-left: 6px;
  font-size: 12px;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 600px) {
  header,
  .payment-card__body {
    padding: 20px;
  }
}
</style>
