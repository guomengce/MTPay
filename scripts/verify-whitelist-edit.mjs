import { createServer } from 'vite';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createI18n } from 'vue-i18n';
import assert from 'node:assert/strict';

const server = await createServer({ server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const { useWhitelistSubmitForm } = await server.ssrLoadModule('/src/views/whitelist/composables/useWhitelistSubmitForm.ts');
  const messages = (await server.ssrLoadModule('/src/locales/zh-CN.ts')).default;
  let form;
  const app = createSSRApp({ setup() { form = useWhitelistSubmitForm(); return () => h('div'); } });
  app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: { 'zh-CN': messages } }));
  await renderToString(app);
  const detail = {
    role: 1, entity_type: 1, subject_name: 'Example', country: 'CN',
    business_data: { company_name: 'Example', company_type: 1, registration_country: 'CN', operating_country: 'CN', city: 'City', address: 'Address', document_no: '123', registration_date: '2026-01-01' },
    files: [11, 12, 13].map(file_id => ({ file_id, original_name: `${file_id}.png` })),
    records: [{ files: [{ file_id: 99, original_name: 'historical.png' }] }],
  };
  async function build(remove = [], add = []) {
    form.loadDetail(detail);
    form.formRef.value = { validate: async () => true, clearValidate() {} };
    assert.deepEqual(form.retainedFiles.value.map(f => f.file_id), [11, 12, 13]);
    remove.forEach(id => form.removeRetainedFile(id));
    form.fileList.value = add.map(id => ({ uid: id, name: `${id}.png`, status: 'success', response: { file_id: id } }));
    const { business } = await form.validateAndBuild();
    assert.equal(business.company_name, 'Example');
    assert.equal(business.address, 'Address');
    assert.equal(business.role, 1);
    return JSON.parse(JSON.stringify(business));
  }
  let payload = await build();
  assert(!('retained_file_ids' in payload) && !('file_ids' in payload));
  payload = await build([11, 12, 13]);
  assert.deepEqual(payload.retained_file_ids, []);
  assert(!('file_ids' in payload));
  payload = await build([12]);
  assert.deepEqual(payload.retained_file_ids, [11, 13]);
  assert(!('file_ids' in payload));
  payload = await build([], [20]);
  assert(!('retained_file_ids' in payload));
  assert.deepEqual(payload.file_ids, [20]);
  payload = await build([12], [20]);
  assert.deepEqual(payload.retained_file_ids, [11, 13]);
  assert.deepEqual(payload.file_ids, [20]);
  console.log('PASS: unchanged, remove all, retain subset, add only, remove + add; current files only; full business payload preserved.');
} finally {
  await server.close();
}
