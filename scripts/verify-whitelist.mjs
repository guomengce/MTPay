import { createServer } from 'vite';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createI18n } from 'vue-i18n';
import assert from 'node:assert/strict';
const server = await createServer({ server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const Subject = (await server.ssrLoadModule('/src/views/whitelist/detail/components/SubjectInfo.vue')).default;
  const Review = (await server.ssrLoadModule('/src/views/whitelist/detail/components/WhitelistReview.vue')).default;
  const messages = (await server.ssrLoadModule('/src/locales/zh-CN.ts')).default;
  async function render(component, detail) {
    const app = createSSRApp({ render: () => h(component, { detail }) });
    app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: { 'zh-CN': messages } }));
    app.component('el-button', { render() { return h('button', this.$slots.default?.()); } });
    return renderToString(app);
  }
  const detail = { role: 1, entity_type: 1, status: 0, business_data: { company_name: 'TEST-COMPANY', company_type: 2, registration_country: 'TR', operating_country: 'TM', given_name: 'TEST-GIVEN', surname: 'TEST-SURNAME', address: 'TEST-ADDRESS', bank_name: 'TEST-BANK' }, review: { admin_name: null, reviewed_at: null, note: null }, supplement_request: null, available_actions: { can_supplement_whitelist: false } };
  for (const role of [1, 2]) for (const entity_type of [1, 2]) {
    const html = await render(Subject, { ...detail, role, entity_type });
    assert.equal((html.match(/class="party-card /g) || []).length, role === 2 ? 2 : 1);
    assert.equal((html.match(/TEST-ADDRESS/g) || []).length, 1);
    assert.equal(html.includes('TEST-BANK'), role === 2);
    assert.equal(html.includes('TEST-COMPANY'), entity_type === 1);
    assert.equal(html.includes('TEST-GIVEN'), entity_type === 2);
    assert(!html.includes('接口未返回'));
  }
  assert(!(await render(Review, detail)).includes('wl-review'));
  const supplement = await render(Review, { ...detail, status: 1, supplement_request: 'TEST-REQUEST', available_actions: { can_supplement_whitelist: true } });
  assert(supplement.includes('TEST-REQUEST') && supplement.includes('wl-supplement-button'));
  const approved = await render(Review, { ...detail, status: 2, review: { admin_name: 'TEST-ADMIN', reviewed_at: '2026-09-11', note: null } });
  assert(approved.includes('TEST-ADMIN') && !approved.includes('wl-supplement-button'));
  const rejected = await render(Review, { ...detail, status: 3, review: { note: 'TEST-REJECT' } });
  assert(rejected.includes('TEST-REJECT') && rejected.includes('wl-review--rejected'));
  console.log('PASS: four entity/role combinations, address ownership, bank visibility, pending/supplement/approved/rejected states.');
} finally { await server.close(); }
