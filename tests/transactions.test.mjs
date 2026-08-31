import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
import { parse } from '@vue/compiler-sfc';
import * as sass from 'sass';
const require = createRequire(import.meta.url);
function loadTs(path, imports = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require','module','exports',code)((id) => {
    if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
    return imports[id];
  },module,module.exports);
  return module.exports;
}
function locale(name) { return loadTs(`../src/locales/${name}.ts`).default; }
function value(object, key) { return key.split('.').reduce((current, part) => current?.[part], object); }
test('manual transaction labels exist in every locale and never expose i18n keys', () => {
  const expected = { 'zh-CN':['人工增加','人工扣减'], 'zh-HK':['人工增加','人工扣減'], 'en-US':['Manual increase','Manual decrease'] };
  const presentation = loadTs('../src/views/records/transactionPresentation.ts', { '@/utils/formatMoney': loadTs('../src/utils/formatMoney.ts') });
  for (const [name, labels] of Object.entries(expected)) {
    const messages = locale(name);
    const t = key => value(messages,key) ?? key;
    assert.deepEqual(['manual_increase','manual_decrease'].map(type => presentation.transactionBusinessLabel(type,t)),labels);
    for (const key of ['availableBalance','frozenBalance','rate']) assert.notEqual(value(messages,`dashboard.${key}`),undefined);
    for (const key of ['agent','agentCode','currency','operator','adjustmentReason','operatedAt']) assert.notEqual(value(messages,`records.${key}`),undefined);
  }
  assert.equal(presentation.transactionAmount({ business_type:'manual_increase', amount:'25.00', currency_code:'USD' }),'+25.00 USD');
  assert.equal(presentation.transactionAmount({ business_type:'manual_decrease', amount:'8.00', currency_code:'USDT' }),'-8.00 USDT');
});
test('filters and detail routes accept both manual transaction types', () => {
  const filters = readFileSync(new URL('../src/views/records/components/TransactionFilters.vue',import.meta.url),'utf8');
  const detail = readFileSync(new URL('../src/views/records/detail/index.vue',import.meta.url),'utf8');
  for (const type of ['manual_increase','manual_decrease']) {
    assert.match(filters,new RegExp(`value="${type}"`));
    assert.match(detail,new RegExp(`'${type}'`));
  }
  assert.match(detail,/ManualAdjustmentDetail/);
});
test('long English text styles wrap and all changed component styles compile', () => {
  const files = ['BalanceCard.vue','QuickActionCard.vue'];
  for (const file of files) {
    const descriptor = parse(readFileSync(new URL(`../src/views/dashboard/components/${file}`,import.meta.url),'utf8')).descriptor;
    assert.doesNotThrow(() => sass.compileString('@use "breakpoints" as *;\n'+descriptor.styles[0].content,{loadPaths:['src/styles']}));
  }
  const balance = readFileSync(new URL('../src/views/dashboard/components/BalanceCard.vue',import.meta.url),'utf8');
  const table = readFileSync(new URL('../src/views/records/components/TransactionTable.vue',import.meta.url),'utf8');
  assert.match(balance,/font-size: clamp\(24px/);
  assert.match(balance,/overflow-wrap: anywhere/);
  assert.match(table,/min-width="170"/);
  assert.match(table,/white-space: nowrap/);
  assert.match(table,/min-width="140" fixed="right"/);
});
