import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { compileTemplate, parse } from '@vue/compiler-sfc';

test('account password form is embedded in the security card without a dialog', () => {
  const cardUrl = new URL('../src/views/account/components/LoginSecurityCard.vue', import.meta.url);
  const pageUrl = new URL('../src/views/account/index.vue', import.meta.url);
  const source = readFileSync(cardUrl, 'utf8');
  const page = readFileSync(pageUrl, 'utf8');
  const descriptor = parse(source, { filename: 'LoginSecurityCard.vue' }).descriptor;
  assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: 'LoginSecurityCard.vue', id: 'account-security' }).errors, []);
  assert.match(source, /<el-form/);
  assert.match(source, /current_password: form\.currentPassword/);
  assert.match(source, /password_confirmation: form\.passwordConfirmation/);
  assert.doesNotMatch(page, /ChangePasswordDialog|passwordDialogVisible/);
  assert.match(page, /align-items: start/);
  assert.equal(existsSync(new URL('../src/views/account/components/ChangePasswordDialog.vue', import.meta.url)), false);
});
