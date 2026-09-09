<template>
  <article id="two-factor-settings" v-loading="busy" class="two-factor-settings">
      <header class="two-factor-settings__heading">
        <span class="two-factor-settings__icon"><el-icon><Lock /></el-icon></span>
        <h2>{{ t('twoFactorSettings.title') }}</h2>
        <el-tag v-if="enabled !== null" :type="enabled ? 'success' : 'info'">
          {{ t(enabled ? 'twoFactorSettings.enabled' : 'twoFactorSettings.disabled') }}
        </el-tag>
      </header>
    <div class="two-factor-settings__body">
      <el-alert v-if="error" :title="t('twoFactorSettings.failed')" type="error" :closable="false" show-icon />
      <el-button v-if="enabled === null" :disabled="busy" @click="loadStatus">{{ t('twoFactorSettings.retry') }}</el-button>
      <template v-else-if="setup">
        <div class="two-factor-settings__setup">
          <QrcodeVue :value="setup.otpauth_uri" :size="180" level="M" :aria-label="t('twoFactorSettings.qrCode')" />
        </div>
        <div class="two-factor-settings__manual-key">
          <label>{{ t('twoFactorSettings.manualKey') }}</label>
          <div class="two-factor-settings__manual-key-row">
            <span :title="setup.manual_key">{{ setup.manual_key }}</span>
            <el-button type="primary" :disabled="busy" @click="copyManualKey">
              {{ t('common.actions.copy') }}
            </el-button>
          </div>
        </div>
      </template>
      <el-form v-if="setup || disabling" label-position="top" @submit.prevent="submit">
        <el-form-item :label="t('twoFactorSettings.code')" :error="invalid ? t('twoFactor.codeInvalid') : ''">
          <el-input v-model="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code" :disabled="busy" :placeholder="t('twoFactorSettings.code')" />
        </el-form-item>
        <div class="two-factor-settings__actions">
          <el-button :type="disabling ? 'danger' : 'primary'" native-type="submit" :disabled="busy" :loading="busy">
            {{ t(disabling ? 'twoFactorSettings.confirmDisable' : 'twoFactorSettings.confirm') }}
          </el-button>
          <el-button :disabled="busy" @click="cancel">{{ t('common.actions.cancel') }}</el-button>
        </div>
      </el-form>
      <div v-if="enabled !== null && !setup && !disabling" class="two-factor-settings__actions">
        <el-button v-if="!enabled" type="primary" :icon="Lock" :disabled="busy" @click="start">{{ t('twoFactorSettings.start') }}</el-button>
        <el-button v-else type="danger" plain :disabled="busy" @click="disabling = true">{{ t('twoFactorSettings.disable') }}</el-button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Lock } from '@element-plus/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { useAuthStore } from '@/stores/modules/auth';
import { getTwoFactorStatus, startTwoFactorSetup, confirmTwoFactorSetup, disableOwnTwoFactor, type TwoFactorSetup } from '@/api/modules/twoFactor';
import { confirmPortalAction } from '@/utils/portalMessageBox';

const { t } = useI18n();
const auth = useAuthStore();
const enabled = ref<boolean | null>(null);
const setup = ref<TwoFactorSetup | null>(null);
const code = ref('');
const busy = ref(false);
const error = ref(false);
const invalid = ref(false);
const disabling = ref(false);
let generation = 0;
async function copyManualKey() {
  if (!setup.value?.manual_key) return;
  try {
    await navigator.clipboard.writeText(setup.value.manual_key);
    ElMessage.success(t('twoFactorSettings.manualKeyCopied'));
  } catch {
    ElMessage.warning(t('twoFactorSettings.manualKeyCopyFailed'));
  }
}
function cancel() { setup.value = null; code.value = ''; disabling.value = false; invalid.value = false; }
function reset() { generation++; cancel(); enabled.value = null; busy.value = false; error.value = false; }
async function run(action: (current: () => boolean) => Promise<void>) {
  if (busy.value) return;
  const version = generation;
  const current = () => generation === version;
  busy.value = true;
  error.value = false;
  try { await action(current); }
  catch { if (current()) error.value = true; }
  finally { if (current()) busy.value = false; }
}
function loadStatus() {
  return run(async current => {
    enabled.value = null;
    const status = await getTwoFactorStatus();
    if (current()) enabled.value = status;
  });
}
function start() {
  if (enabled.value !== false) return;
  return run(async current => {
    const result = await startTwoFactorSetup();
    if (current()) setup.value = result;
  });
}
async function submit() {
  if (busy.value || (!setup.value && !disabling.value)) return;
  invalid.value = !/^\d{6}$/.test(code.value);
  if (invalid.value) return;
  await run(async current => {
    if (disabling.value) {
      const confirmed = await confirmPortalAction({
        title: t('twoFactorSettings.disable'),
        message: '確認關閉 2FA 嗎？',
        confirmText: t('twoFactorSettings.confirmDisable'),
        cancelText: t('common.actions.cancel'),
      });
      if (!confirmed) return;
      if (!current()) return;
      await disableOwnTwoFactor(code.value);
    } else { await confirmTwoFactorSetup(code.value); }
    if (!current()) return;
    cancel();
    enabled.value = null;
    const status = await getTwoFactorStatus();
    if (current()) enabled.value = status;
  });
}
watch(() => auth.token, () => { reset(); if (auth.token) void loadStatus(); });
onMounted(loadStatus);
onBeforeUnmount(reset);
</script>

<style scoped lang="scss">
.two-factor-settings {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgb(192 211 227 / 70%);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 18px 50px rgb(35 82 126 / 8%);
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22px 24px;
    .el-alert { margin-bottom: 20px; }
    .el-form { margin-top: 18px; width: 100%; max-width: 620px; }
  }
  &__heading, &__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  &__heading {
    padding: 25px 26px;
    border-bottom: 1px solid #e8f0f5;
    h2 { flex: 1; min-width: 0; font-size: 20px; margin: 0; overflow-wrap: anywhere; }
  }
  &__icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 46px; height: 46px; flex: 0 0 46px; border-radius: 14px;
    color: #fff; font-size: 21px;
    background: linear-gradient(135deg, #27b9aa, #1d8db5);
    box-shadow: 0 9px 20px rgb(29 141 181 / 20%);
  }
  &__actions { justify-content: center; margin-top: 24px; .el-button { margin: 0; height: auto; min-height: 36px; white-space: normal; } }
  &__setup { display: flex; justify-content: center; padding: 20px 0; }
  &__manual-key {
    width: 100%;
    max-width: 620px;
    label { display: block; margin-bottom: 8px; color: #4f647d; font-size: 13px; }
  }
  &__manual-key-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    span {
      min-width: 0;
      padding: 13px 14px;
      overflow: hidden;
      border: 1px solid #cbd9e6;
      border-radius: 10px;
      background: #fff;
      color: #24364d;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-button { min-height: 46px; margin: 0; padding-inline: 22px; }
  }
  @media (max-width: 600px) {
    &__body, &__heading { padding: 20px; }
    &__manual-key-row { grid-template-columns: 1fr; }
    &__manual-key-row .el-button { width: 100%; }
  }
}
</style>
