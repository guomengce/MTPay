import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { parse, compileScript } from '@vue/compiler-sfc';
import { ref } from 'vue';

const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
function load(source, imports) {
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => imports[name], module, module.exports);
  return module.exports;
}
test('documented API contract rejects unknown status and invalid setup data', async () => {
  let response;
  const calls = [];
  const request = Object.fromEntries(['get', 'post'].map(method => [method, async (...args) => { calls.push([method, ...args]); return response; }]));
  const api = load(read('api/modules/twoFactor.ts'), { '../request': { default: request } });
  for (response of [undefined, {}, { enabled: 'false' }, { enabled: 0 }]) await assert.rejects(api.getTwoFactorStatus());
  response = { enabled: false };
  assert.equal(await api.getTwoFactorStatus(), false);
  response = { manual_key: 'local-secret', otpauth_uri: 'https://example.com' };
  await assert.rejects(api.startTwoFactorSetup());
  response = { manual_key: 'local-secret', otpauth_uri: 'otpauth://totp/test?secret=TEST' };
  assert.deepEqual(await api.startTwoFactorSetup(), response);
  await api.confirmTwoFactorSetup('012345');
  await api.disableOwnTwoFactor('987654');
  assert.deepEqual(calls.slice(-2), [['post', '/web/confirmTwoFactorSetup', { code: '012345' }], ['post', '/web/disableOwnTwoFactor', { code: '987654' }]]);
});

function page(api) {
  let dispose;
  const source = compileScript(parse(read('views/account/components/TwoFactorCard.vue')).descriptor, { id: 'test' }).content;
  const component = load(source, {
    vue: { ref, defineComponent: value => value, onMounted() {}, onBeforeUnmount(fn) { dispose = fn; }, watch() {} },
    'vue-i18n': { useI18n: () => ({ t: key => key }) },
    'element-plus': { ElMessageBox: { confirm: async () => { throw 'cancel'; } } },
    '@element-plus/icons-vue': {}, 'qrcode.vue': {},
    '@/stores/modules/auth': { useAuthStore: () => ({ token: 'test' }) },
    '@/api/modules/twoFactor': api,
  }).default;
  return { vm: component.setup({}, { expose() {} }), dispose: () => dispose() };
}
test('invalid codes and canceled disable do not send mutations; refresh controls status', async () => {
  let confirms = 0;
  let disables = 0;
  const { vm } = page({ getTwoFactorStatus: async () => true,
    confirmTwoFactorSetup: async () => { confirms++; }, disableOwnTwoFactor: async () => { disables++; } });
  vm.setup.value = { manual_key: 'secret', otpauth_uri: 'otpauth://totp/test' };
  vm.code.value = '123';
  await vm.submit();
  assert.equal(confirms, 0);
  vm.code.value = '012345';
  await vm.submit();
  assert.equal(confirms, 1);
  assert.equal(vm.setup.value, null);
  assert.equal(vm.code.value, '');
  assert.equal(vm.enabled.value, true);
  vm.disabling.value = true;
  vm.code.value = '123456';
  await vm.submit();
  assert.equal(disables, 0);
});
test('unmounting card discards secrets and ignores late setup response', async () => {
  let resolve;
  const { vm, dispose } = page({ startTwoFactorSetup: () => new Promise(done => { resolve = done; }) });
  vm.enabled.value = false;
  const pending = vm.start();
  dispose();
  resolve({ manual_key: 'secret', otpauth_uri: 'otpauth://totp/test' });
  await pending;
  assert.equal(vm.setup.value, null);
  assert.equal(vm.enabled.value, null);
});

test('2FA is embedded in account security with no standalone entry or page', () => {
  assert.match(read('views/account/index.vue'), /<TwoFactorCard\s*\/>/);
  assert.doesNotMatch(read('layout/components/AppHeader.vue'), /command="two-factor"|TwoFactorSettings/);
  assert.doesNotMatch(read('router/modules/index.ts'), /account\/two-factor|TwoFactorSettings/);
  assert.equal(existsSync(new URL('../src/views/account/two-factor/index.vue', import.meta.url)), false);
});


test('rendered 2FA card shows entry buttons only outside setup and disable forms', async () => {
 const vue = await import('vue');
 const { renderToString } = await import('@vue/server-renderer');
 const { compileScript, parse } = await import('@vue/compiler-sfc');
 const source = readFileSync(new URL('../src/views/account/components/TwoFactorCard.vue', import.meta.url), 'utf8');
 const web = source.includes('vue-i18n');
 const compiled = compileScript(parse(source).descriptor, { id: 'card-test', inlineTemplate: true }).content;
 const js = ts.transpileModule(compiled, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
 for (const mode of ['idle', 'setup', 'disable']) {
   let refIndex = 0;
   const imports = {
     vue: { ...vue, onMounted() {}, onBeforeUnmount() {}, watch() {}, ref(value) {
       const index = refIndex++;
       if (index === 0) value = mode === 'disable';
       if (index === 1 && mode === 'setup') value = { otpauth_uri: 'otpauth://totp/test' };
       if (index === 6) value = mode === 'disable';
       return vue.ref(value);
     } },
     '@element-plus/icons-vue': { Lock: { render: () => vue.h('span') } },
     'vue-i18n': { useI18n: () => ({ t: key => key }) },
     '../messages': { accountText: key => key },
     '@/stores/modules/auth': { useAuthStore: () => ({ userInfo: { id: '2' }, token: 'token' }) },
     'qrcode.vue': { default: { render: () => vue.h('div', 'QR') } },
   };
   const m = { exports: {} };
   new Function('require', 'module', 'exports', js)(name => imports[name] || {}, m, m.exports);
   const app = vue.createSSRApp(m.exports.default);
   const passthrough = { setup(_, { slots }) { return () => vue.h('div', slots.default?.()); } };
   for (const name of ['el-form','el-form-item','el-input','el-button','el-icon','el-alert','el-tag']) app.component(name, passthrough);
   app.directive('loading', {});
   const html = await renderToString(app);
   assert.equal(html.includes('twoFactorSettings.start'), mode === 'idle', web ? 'agent' : 'admin');
   assert.equal(html.includes('twoFactorSettings.confirm'), mode !== 'idle');
 }
});
