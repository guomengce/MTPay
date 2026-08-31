import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { verifyTwoFactorLogin } from '@/api/modules/auth';
import { completeLogin } from '@/utils/completeLogin';
import { getLoginChallenge, clearLoginChallenge } from '@/utils/loginChallenge';

export function useTwoFactorLogin() {
  const router = useRouter();
  const pending = getLoginChallenge();
  const code = ref('');
  const submitting = ref(false);
  const invalid = ref(false);
  const error = ref('');
  const expired = ref(false);
  const remaining = ref(0);
  let active = true;
  let timer: ReturnType<typeof setInterval> | undefined;
  function tick() {
    remaining.value = pending ? Math.max(0, Math.ceil((pending.expiresAt - Date.now()) / 1000)) : 0;
    if (!remaining.value) { expired.value = true; clearLoginChallenge(); code.value = ''; }
  }
  function back() {
    active = false;
    clearLoginChallenge();
    code.value = '';
    void router.replace({ name: 'Login', query: pending ? { redirect: pending.redirect } : undefined });
  }
  async function submit() {
    if (!active || submitting.value) return;
    tick();
    if (expired.value || !pending || getLoginChallenge() !== pending) return;
    invalid.value = !/^\d{6}$/.test(code.value);
    if (invalid.value) return;
    error.value = '';
    submitting.value = true;
    try {
      const result = await verifyTwoFactorLogin({ login_challenge: pending.challenge, code: code.value });
      if (!active || getLoginChallenge() !== pending) return;
      completeLogin(result);
      await router.replace(pending.redirect);
    } catch (failure) {
      // Backend enforces the five-error limit. Do not count network failures as invalid codes.
      // The request layer displays the exact server error, including an exhausted challenge.
      if (active) { error.value = failure instanceof Error ? failure.message : ''; code.value = ''; tick(); }
    } finally { if (active) submitting.value = false; }
  }
  onMounted(() => {
    if (!pending) { back(); return; }
    tick();
    timer = setInterval(tick, 1000);
  });
  onBeforeUnmount(() => { active = false; clearInterval(timer); code.value = ''; clearLoginChallenge(); });
  return { code, submitting, invalid, error, expired, remaining, submit, back };
}
