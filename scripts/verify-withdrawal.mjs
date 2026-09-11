import { createServer } from 'vite';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createI18n } from 'vue-i18n';
import assert from 'node:assert/strict';
const server = await createServer({ server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const Content = (await server.ssrLoadModule('/src/views/withdrawal/detail/components/WithdrawalDetailContent.vue')).default;
  const messages = (await server.ssrLoadModule('/src/locales/zh-CN.ts')).default;
  const party = (entity_type, name) => ({ entity_type, name, data: { company_name: name, given_name: name, surname: 'Surname', address: 'Test Address', bank_name: 'Test Bank' } });
  const base = { id: 31, order_no: 'TEST-ORDER', status: 2, amount: '1.00', fee_amount: '50.00', total_amount: '51.00', currency: { code: 'USD' }, submitted_at: '2026-09-08', review: { admin_name: 'TEST-ADMIN' }, payment: { processing_at: '2026-09-08 17:15' }, risk: { can_supplement_risk: true, risk_supplement_request: 'TEST-COMPLIANCE' }, available_actions: { can_supplement_withdrawal: true }, supplement_request: 'TEST-BUSINESS' };
  async function render(detail, readonly) {
    const app = createSSRApp({ render: () => h(Content, { detail, readonly }) });
    app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: { 'zh-CN': messages } }));
    app.component('el-button', { render() { return h('button', this.$slots.default?.()); } });
    return renderToString(app);
  }
  for (const payerType of [1, 2]) for (const payeeType of [1, 2]) {
    const detail = { ...base, payer: party(payerType, 'TEST-PAYER'), payee: party(payeeType, 'TEST-PAYEE') };
    const html = await render(detail, false);
    for (const text of ['TEST-ORDER','TEST-PAYER','TEST-PAYEE','Test Bank','51.00','50.00','1.00','TEST-ADMIN','TEST-BUSINESS','TEST-COMPLIANCE','2026-09-08 17:15']) assert(html.includes(text), text);
    assert.equal((html.match(/class="transaction-overview"/g) || []).length, 1);
    assert(!html.includes('timeline'));
    const readonly = await render(detail, true);
    assert(!readonly.includes('TEST-BUSINESS') && !readonly.includes('TEST-COMPLIANCE'));
  }
  console.log('PASS: four payer/payee combinations, amounts, bank data, review/payment, both supplement requests, read-only record details, and no timeline dependency.');
} finally { await server.close(); }
