<template>
  <main class="payment-reset">
    <section>
      <header class="payment-reset__header">
        <span class="payment-reset__icon"><i class="ri-lock-password-line" /></span>
        <h1>{{ t('paymentPassword.reset') }}</h1>
      </header>
      <div class="payment-reset__body">
        <div v-if="done" class="payment-reset__success" role="status">
          <i class="ri-checkbox-circle-fill" aria-hidden="true" />
          <p>{{ t('paymentPassword.success') }}</p>
        </div>
        <PaymentPasswordForm v-else-if="valid" mode="reset" :token="token" @success="success" />
        <el-alert v-else :title="t('paymentPassword.invalidLink')" type="error" :closable="false" />
        <div v-if="done || !valid" class="payment-reset__return">
          <el-button type="primary" @click="router.push({ name: 'Account', hash: '#payment-password-settings' })">
            {{ t('paymentPassword.returnToSecurity') }}
          </el-button>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/modules/auth';
import PaymentPasswordForm from '@/views/account/components/PaymentPasswordForm.vue';
import { useAccount } from '@/views/account/composables/useAccount';
import { getPaymentPasswordStatus } from '@/api/modules/paymentPassword';
const route = useRoute(),
  router = useRouter(),
  auth = useAuthStore();
const { t } = useI18n();
const { fetchProfile } = useAccount();
const done = ref(false);
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''));
const valid = computed(() => /^[a-f0-9]{64}$/.test(token.value));
async function success() {
  done.value = true;
  await router.replace({ path: '/reset-payment-password', query: {} });
  if (auth.isLoggedIn) await Promise.allSettled([fetchProfile(), getPaymentPasswordStatus()]);
}
</script>
<style scoped>
.payment-reset {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(ellipse at 20% 10%, #e0f4f2, transparent 55%),
    linear-gradient(135deg, #f0f7fa, #edf4f8);
}
section {
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #d4e3ec;
  border-radius: 20px;
  box-shadow: 0 24px 70px rgb(35 82 126 / 10%);
}
.payment-reset__header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 26px 28px;
  background: linear-gradient(105deg, #f8fbff, #effaf8);
  border-bottom: 1px solid #dcebea;
}
.payment-reset__icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #27b9aa, #1d8db5);
  box-shadow: 0 9px 20px rgb(29 141 181 / 20%);
  font-size: 24px;
}
h1 {
  margin: 0;
  color: #102a48;
  font-size: 22px;
}
.payment-reset__body {
  padding: 28px;
}
.payment-reset__return {
  text-align: center;
  margin-top: 24px;
}
.payment-reset__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 12px 0 4px;
  text-align: center;
}
.payment-reset__success i {
  color: #15aaa0;
  font-size: 76px;
  line-height: 1;
}
.payment-reset__success p {
  margin: 0;
  color: #102a48;
  font-size: 18px;
  font-weight: 600;
}
@media (max-width: 600px) {
  .payment-reset {
    padding: 16px;
  }
  .payment-reset__header,
  .payment-reset__body {
    padding: 22px;
  }
}
</style>
