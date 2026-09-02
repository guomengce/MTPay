import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/modules/auth';
import * as api from '@/api/modules/withdrawal';

export function useWithdrawalSecurity(options: {
  refresh: () => Promise<unknown>;
  completed: (order: api.WithdrawalOrderDetail) => Promise<void>;
}) {
  const { t } = useI18n();
  const auth = useAuthStore();
  const visible = ref(false);
  const busy = ref(false);
  const email = ref('');
  const emailVerified = ref(false);
  const twoFactorVerified = ref(false);
  const expired = ref(false);
  const uncertain = ref(false);
  const error = ref('');
  const resendSeconds = ref(0);
  const locked = computed(() => visible.value || busy.value);
  const ready = computed(() => emailVerified.value && twoFactorVerified.value && !expired.value && !uncertain.value);
  let payload: api.SubmitWithdrawalPayload | null = null;
  let expiresAt = 0;
  let resendAt = 0;
  let emailExpiresAt = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let active = true;
  const owner = auth.userInfo?.id;
  const current = () => active && auth.userInfo?.id === owner && Boolean(auth.token);
  function reset() {
    clearInterval(timer); payload = null; visible.value = false; email.value = '';
    emailVerified.value = false; twoFactorVerified.value = false; expired.value = false;
    uncertain.value = false; resendSeconds.value = 0; emailExpiresAt = 0; resendAt = 0; error.value = '';
  }
  function tick() {
    resendSeconds.value = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
    if (Date.now() >= expiresAt && !expired.value) {
      expired.value = true; emailVerified.value = false; twoFactorVerified.value = false;
      error.value = t('withdrawalSecurity.expired');
    }
  }
  async function cancelChallenge(value: string) { await api.cancelWithdrawalSecurityChallenge(value); }
  async function begin(draft: api.WithdrawalDraft) {
    if (locked.value || !current()) return;
    reset(); busy.value = true;
    // Copy arrays too: later form mutations must never change this challenge's draft.
    const snapshot = { ...draft, file_ids: [...draft.file_ids] };
    try {
      const challenge = await api.createWithdrawalSecurityChallenge(snapshot);
      if (!current()) {
        if (auth.userInfo?.id === owner && auth.token) await cancelChallenge(challenge.security_challenge);
        return;
      }
      payload = { ...snapshot, security_challenge: challenge.security_challenge };
      email.value = challenge.email;
      visible.value = true;
      expiresAt = typeof challenge.expires_at === 'string' ? Date.parse(challenge.expires_at.replace(' ', 'T')) : NaN;
      if (!Number.isFinite(expiresAt) || !challenge.email || challenge.security_challenge?.length !== 64) {
        expired.value = true; error.value = t('withdrawalSecurity.invalidResponse'); return;
      }
      tick(); timer = setInterval(tick, 1000);
    } catch (failure) {
      if (current()) error.value = failure instanceof Error ? failure.message : t('withdrawalSecurity.failed');
    } finally { if (active) busy.value = false; }
  }
  function requestPayload() { return { ...payload!, file_ids: [...payload!.file_ids] }; }
  async function run(action: () => Promise<void>) {
    if (busy.value || !payload || !current() || uncertain.value) return;
    tick(); if (expired.value) return;
    busy.value = true; error.value = '';
    try { await action(); }
    catch (failure) {
      if (!current()) return;
      error.value = failure instanceof Error ? failure.message : t('withdrawalSecurity.failed');
    } finally { if (active) busy.value = false; }
  }
  async function sendEmail() {
    if (resendSeconds.value || emailVerified.value) return;
    await run(async () => {
      const result = await api.sendWithdrawalEmailCode(requestPayload());
      if (!current()) return;
      const expiresIn = Number(result.expires_in);
      if (!Number.isFinite(expiresIn) || expiresIn <= 0) throw Error(t('withdrawalSecurity.invalidResponse'));
      resendAt = Date.now() + 60000; emailExpiresAt = Date.now() + expiresIn * 1000; tick();
      ElMessage.success(t('withdrawalSecurity.emailCodeSent'));
    });
  }
  async function verify(kind: 'email' | 'twoFactor', code: string) {
    if (!/^\d{6}$/.test(code)) { error.value = t('withdrawalSecurity.codeInvalid'); return; }
    if (kind === 'email' && Date.now() >= emailExpiresAt) { error.value = t('withdrawalSecurity.sendFirst'); return; }
    await run(async () => {
      const result = kind === 'email'
        ? await api.verifyWithdrawalEmailCode({ ...requestPayload(), email_code: code })
        : await api.verifyWithdrawalTwoFactor({ ...requestPayload(), code });
      if (!current()) return;
      if (kind === 'email' && 'email_verified' in result && result.email_verified === true) emailVerified.value = true;
      else if (kind === 'twoFactor' && 'two_factor_verified' in result && result.two_factor_verified === true) twoFactorVerified.value = true;
      else throw Error(t('withdrawalSecurity.invalidResponse'));
    });
  }
  function close() {
    if (busy.value || !current()) return;
    const challenge = payload?.security_challenge;
    const shouldCancel = Boolean(challenge && !uncertain.value);
    reset();
    if (shouldCancel && challenge && auth.userInfo?.id === owner && auth.token) {
      void cancelChallenge(challenge).catch(() => undefined);
    }
  }
  async function submit() {
    if (!ready.value) return;
    await run(async () => {
      let order: api.WithdrawalOrderDetail;
      try { order = await api.submitWithdrawal(requestPayload()); }
      catch (failure) {
        if (current()) { uncertain.value = true; error.value = t('withdrawalSecurity.uncertain'); }
        throw failure;
      }
      if (!current()) return;
      // A consumed challenge must never be cancelled or submitted again, even if refresh fails.
      reset();
      await options.completed(order);
    });
  }
  onBeforeUnmount(() => {
    active = false; clearInterval(timer);
    if (payload && auth.userInfo?.id === owner && auth.token && !uncertain.value) void cancelChallenge(payload.security_challenge).catch(() => undefined);
    reset();
  });
  return { visible, busy, locked, email, emailVerified, twoFactorVerified, expired, uncertain, error, resendSeconds, ready, begin, sendEmail, verify, close, submit };
}
