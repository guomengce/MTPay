import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { compileStyle, parse } from '@vue/compiler-sfc';

function locale(name) {
  const source = readFileSync(new URL(`../src/locales/${name}.ts`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', code)(module, module.exports);
  return module.exports.default;
}

test('safeheron account key is typed, displayed read-only and translated', () => {
  const api = readFileSync(new URL('../src/api/modules/auth.ts', import.meta.url), 'utf8');
  const profile = readFileSync(new URL('../src/views/account/components/CompanyProfileCard.vue', import.meta.url), 'utf8');
  assert.match(api, /safeheron_account_key: string \| null/);
  assert.match(profile, /profile\?\.safeheron_account_key/);
  assert.match(profile, /account\.safeheronAccountKey/);
  assert.doesNotMatch(profile, /v-model[^\n]*safeheron_account_key/);
  for (const name of ['zh-CN', 'zh-HK', 'en-US']) assert.ok(locale(name).account.safeheronAccountKey);
});

test('English deduction label is abbreviated and given a non-wrapping layout', () => {
  assert.equal(locale('en-US').withdrawal.estimatedDeduction, 'Est. total deduction');
  const source = readFileSync(new URL('../src/views/withdrawal/components/ApplyForm.vue', import.meta.url), 'utf8');
  const descriptor = parse(source, { filename: 'ApplyForm.vue' }).descriptor;
  const style = compileStyle({ source: descriptor.styles[0].content, filename: 'ApplyForm.vue', id: 'withdrawal-test', scoped: true, preprocessLang: 'scss', preprocessOptions: { loadPaths: ['src/styles'], additionalData: '@use "variables" as *; @use "breakpoints" as *;' } });
  assert.deepEqual(style.errors, []);
  assert.match(style.code, /\.is-english/);
  assert.match(style.code, /white-space:\s*nowrap/);
});
