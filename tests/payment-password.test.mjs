import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { ref, computed } from 'vue';
const read = path => readFileSync(new URL('../src/' + path, import.meta.url), 'utf8');
function load(path, imports) {
  const module = { exports: {} };
  const source = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', 'setInterval', 'clearInterval', source)(name => imports[name], module, module.exports, () => 1, () => {});
  return module.exports;
}
const draft = { currency_id: 3, amount: '100.00', payer_whitelist_id: 1, payee_whitelist_id: 2, file_ids: [] };
function fixture(status = {}, overrides = {}) {
  let unmount, invalidate;
  const calls = [];
  const state = { has_payment_password: true, two_factor_enabled: true, locked_until: null, ...status };
  const api = {
    createWithdrawalSecurityChallenge: async p => { calls.push(['create', p]); return { security_challenge: 'a'.repeat(64), expires_at: new Date(Date.now()+600000).toISOString(), email: 'a***@example.com' }; },
    sendWithdrawalEmailCode: async p => { calls.push(['email', p]); return { expires_in: 300 }; },
    verifyWithdrawalEmailCode: async p => { calls.push(['verifyEmail', p]); return { email_verified: true }; },
    verifyWithdrawalTwoFactor: async p => { calls.push(['verify2fa', p]); return { two_factor_verified: true }; },
    cancelWithdrawalSecurityChallenge: async () => {},
    submitWithdrawal: async p => { calls.push(['submit', p]); return { id: 1 }; }, ...overrides,
  };
  const flow = load('views/withdrawal/composables/useWithdrawalSecurity.ts', {
    vue: { ref, computed, onBeforeUnmount: fn => unmount = fn },
    'vue-i18n': { useI18n: () => ({ t: key => key }) },
    'element-plus': { ElMessage: { success() {} } },
    '@/stores/modules/auth': { useAuthStore: () => ({ token: 'test', userInfo: { id: '1' } }) },
    '@/api/modules/withdrawal': api,
    '@/api/modules/paymentPassword': { getPaymentPasswordStatus: async () => state },
    '@/utils/paymentPassword': { paymentPasswordPattern: /^[0-9]{6}$/, paymentError: e => e.message, onPaymentSecurityChanged: fn => { invalidate = fn; return () => {}; } },
  }).useWithdrawalSecurity({ refresh: async () => {}, completed: async () => {} });
  async function ready() { await flow.begin(draft); await flow.sendEmail(); await flow.verify('email', '123456'); await flow.verify('twoFactor', '123456'); }
  return { flow, calls, ready, state, unmount: () => unmount(), invalidate: () => invalidate() };
}
test('unset, disabled 2FA, and locked status block challenges', async () => {
  for (const status of [{ has_payment_password: false }, { two_factor_enabled: false }, { locked_until: '2026-09-18 12:00' }]) {
    const f = fixture(status); await f.flow.begin(draft); assert.equal(f.calls.length, 0); assert.equal(f.flow.visible.value, false); f.unmount();
  }
});
test('password preserves leading zeros and goes only to final submit', async () => {
  const f = fixture(); await f.ready();
  for (const invalid of ['', '12345', '1234567', '１２３４５６', 'abcdef']) await f.flow.submit(invalid);
  assert.equal(f.calls.filter(([name]) => name === 'submit').length, 0);
  await f.flow.submit('001234');
  assert.equal(f.calls.at(-1)[1].payment_password, '001234');
  for (const [name, payload] of f.calls) if (name !== 'submit') assert.equal('payment_password' in payload, false);
  f.unmount();
});
test('password changes clear both security verifications', async () => {
  const f = fixture(); await f.ready(); f.invalidate();
  assert.equal(f.flow.ready.value, false); assert.equal(f.flow.visible.value, false);
  await f.flow.submit('001234'); assert.equal(f.calls.filter(([name]) => name === 'submit').length, 0); f.unmount();
});
test('late verification cannot restore invalidated challenge', async () => {
  let resolve;
  const f = fixture({}, { verifyWithdrawalTwoFactor: () => new Promise(done => resolve = done) });
  await f.flow.begin(draft); const pending = f.flow.verify('twoFactor', '123456'); f.invalidate(); resolve({ two_factor_verified: true }); await pending;
  assert.equal(f.flow.twoFactorVerified.value, false); f.unmount();
});
test('network uncertainty blocks retries; business failures refresh lock status', async () => {
  let count = 0;
  const f = fixture({}, { submitWithdrawal: async () => { count++; throw Object.assign(Error('timeout'), { isAxiosError: true }); } });
  await f.ready(); await f.flow.submit('001234'); await f.flow.submit('001234'); assert.equal(count, 1); assert.equal(f.flow.uncertain.value, true); f.unmount();
  const locked = fixture({}, { submitWithdrawal: async () => { locked.state.locked_until = '2026-09-18 12:00'; throw Error('locked'); } });
  await locked.ready(); await locked.flow.submit('001234'); assert.equal(locked.flow.ready.value, false); assert.equal(locked.flow.uncertain.value, false); locked.unmount();
});
test('payment endpoints use the documented fields without numeric coercion', async () => {
  const calls = [];
  const api = load('api/modules/paymentPassword.ts', { '../request': { default: { post: async (...args) => calls.push(args), get: async (...args) => calls.push(args) } } });
  await api.getPaymentPasswordStatus(); await api.sendPaymentPasswordEmailCode();
  const fields = { payment_password: '001234', payment_password_confirmation: '001234' };
  await api.setPaymentPassword({ ...fields, email_code: '012345', code: '123456' });
  await api.updatePaymentPassword({ ...fields, old_payment_password: '654321' });
  await api.forgotPaymentPassword(); await api.resetPaymentPassword({ ...fields, code: '123456', token: 'a'.repeat(64) });
  assert.deepEqual(calls.map(c => c[0]), ['getPaymentPasswordStatus', 'sendPaymentPasswordEmailCode', 'setPaymentPassword', 'updatePaymentPassword', 'forgotPaymentPassword', 'resetPaymentPassword'].map(name => '/web/' + name));
  assert.equal(calls[2][1].payment_password, '001234');
  assert.deepEqual(Object.keys(calls[3][1]).sort(), ['old_payment_password','payment_password','payment_password_confirmation']);
});
