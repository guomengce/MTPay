import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { compileTemplate, parse } from '@vue/compiler-sfc';

const componentUrl = new URL('../src/views/whitelist/detail/components/SubjectInfo.vue', import.meta.url);
const subjectDir = new URL('../src/views/whitelist/detail/components/subject/', import.meta.url);

test('whitelist detail combines identity and address fields in one subject card', () => {
  const source = readFileSync(componentUrl, 'utf8');
  const descriptor = parse(source, { filename: 'SubjectInfo.vue' }).descriptor;
  assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: 'SubjectInfo.vue', id: 'whitelist-detail' }).errors, []);
  assert.match(source, /\.\.\.props\.companyIdentityFields, \.\.\.props\.registrationFields/);
  assert.match(source, /\.\.\.props\.payerIndividualIdentityFields, \.\.\.props\.payerIndividualResidenceFields/);
  assert.equal((source.match(/<section class="subject-section">/g) ?? []).length, 1);
  for (const file of ['CompanyAddress.vue', 'CompanyInfo.vue', 'PersonalInfo.vue', 'ResidenceInfo.vue']) {
    assert.equal(existsSync(new URL(file, subjectDir)), false);
  }
  assert.equal(existsSync(new URL('BankInfo.vue', subjectDir)), true);
});
