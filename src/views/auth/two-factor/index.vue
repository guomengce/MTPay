<template>
  <main class="two-factor-page">
    <BrandPanel />
    <header><div class="brand"><img src="/assets/mtpay-logo.png" alt="MTPay" /></div><LanguageSwitcher /></header>
    <section class="content">
      <article class="two-factor-card">
        <span class="shield"><i class="ri-shield-keyhole-line" /></span>
        <h1>{{ t('twoFactor.title') }}</h1>
        <el-form label-position="top" @submit.prevent="submit">
          <el-form-item :label="t('twoFactor.codeLabel')" :error="invalid ? t('twoFactor.codeInvalid') : ''">
            <el-input v-model="code" :disabled="submitting || expired" class="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" />
          </el-form-item>
          <el-alert v-if="error" :title="error" type="error" :closable="false" />
        <el-button type="primary" native-type="submit" :loading="submitting" :disabled="submitting || expired">{{ t('twoFactor.verify') }}</el-button>
        </el-form>
        <div class="actions"><button class="app-back-button" type="button" @click="back"><i class="ri-arrow-left-line" />{{ t('twoFactor.back') }}</button><button type="button" @click="help">{{ t('twoFactor.cannotAccess') }}</button></div>
        <p v-if="expired" class="notice" role="status">{{ t('twoFactor.expired') }}</p>
      </article>
    </section>
  </main>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import BrandPanel from '@/views/auth/login/components/BrandPanel.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { useTwoFactorLogin } from '@/composables/useTwoFactorLogin';
const { t } = useI18n();
const { code, submitting, invalid, error, expired, submit, back } = useTwoFactorLogin();
function help() { ElMessage.info(t('twoFactor.helpMessage')); }
</script>
<style scoped lang="scss">
.two-factor-page{position:relative;display:flex;min-height:100vh;flex-direction:column;background:#fff}header{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:24px 48px}.brand{display:flex;align-items:center;gap:12px;color:#071833;font-size:22px;font-weight:800}.brand span{display:grid;width:40px;height:40px;place-items:center;border-radius:10px;color:#fff;background:linear-gradient(135deg,#27b9aa,#1d8db5)}.content{position:relative;z-index:2;display:flex;flex:1;align-items:center;justify-content:flex-end;padding:32px 80px 64px}.two-factor-card{width:min(460px,100%);padding:42px 40px 34px;border-radius:20px;background:#fff;box-shadow:0 24px 70px rgb(22 34 51 / 10%);text-align:center}.shield{display:grid;width:64px;height:64px;margin:0 auto 20px;place-items:center;border-radius:18px;color:#079d98;background:#e8f8f6;font-size:31px}h1{margin:0 0 10px;color:#071833;font-size:27px}.two-factor-card>p{margin:0 0 28px;color:#64758b;line-height:1.65}:deep(.el-form-item__label){justify-content:center}:deep(.code .el-input__inner){text-align:center;font-size:24px;font-weight:700;letter-spacing:.48em;font-variant-numeric:tabular-nums}.el-button{width:100%}.actions{display:flex;justify-content:space-between;gap:16px;margin-top:20px}.actions button{padding:0;border:0;color:#168f91;background:none;cursor:pointer;font:inherit;font-size:13px}.notice{display:flex!important;gap:7px;margin-top:26px!important;padding-top:20px;border-top:1px solid #edf2f6;color:#8090a4!important;font-size:12px;text-align:left}@include mobile{header{padding:16px 20px}.content{justify-content:center;padding:20px 16px 34px}.two-factor-card{padding:32px 22px 26px}}
.brand img{display:block;width:154px;height:auto}
.brand img{display:block;width:154px;height:auto}
</style>
