import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { parse } from '@vue/compiler-sfc';
import * as sass from 'sass';
function loadTs(path, imports = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (id) => {
      if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
      return imports[id];
    },
    module,
    module.exports,
  );
  return module.exports;
}
function locale(name) {
  return loadTs(`../src/locales/${name}.ts`).default;
}
function value(object, key) {
  return key.split('.').reduce((current, part) => current?.[part], object);
}
test('manual transaction labels exist in every locale and never expose i18n keys', () => {
  const expected = {
    'zh-CN': ['人工增加', '人工扣减'],
    'zh-HK': ['人工增加', '人工扣減'],
    'en-US': ['Manual increase', 'Manual decrease'],
  };
  const presentation = loadTs('../src/views/records/transactionPresentation.ts', {
    '@/utils/formatMoney': loadTs('../src/utils/formatMoney.ts'),
  });
  for (const [name, labels] of Object.entries(expected)) {
    const messages = locale(name);
    const t = (key) => value(messages, key) ?? key;
    assert.deepEqual(
      ['manual_increase', 'manual_decrease'].map((type) =>
        presentation.transactionBusinessLabel(type, t),
      ),
      labels,
    );
    for (const key of ['availableBalance', 'frozenBalance', 'rate'])
      assert.notEqual(value(messages, `dashboard.${key}`), undefined);
    for (const key of [
      'agent',
      'agentCode',
      'currency',
      'operator',
      'adjustmentReason',
      'operatedAt',
    ])
      assert.notEqual(value(messages, `records.${key}`), undefined);
  }
  assert.equal(
    presentation.transactionAmount({
      business_type: 'manual_increase',
      amount: '25.00',
      currency_code: 'USD',
    }),
    '+25.00 USD',
  );
  assert.equal(
    presentation.transactionAmount({
      business_type: 'manual_decrease',
      amount: '8.00',
      currency_code: 'USDT',
    }),
    '-8.00 USDT',
  );
});
test('transaction record detail entries route to business module details', () => {
  const filters = readFileSync(
    new URL('../src/views/records/components/TransactionFilters.vue', import.meta.url),
    'utf8',
  );
  const routes = readFileSync(new URL('../src/router/modules/index.ts', import.meta.url), 'utf8');
  const routing = loadTs('../src/views/records/transactionRoutes.ts');
  const table = readFileSync(
    new URL('../src/views/records/components/TransactionTable.vue', import.meta.url),
    'utf8',
  );
  assert.match(table, /function canViewDetail\(row: TransactionItem\)/);
  assert.match(table, /row\.business_type === 'manual_increase'/);
  assert.match(table, /row\.business_type === 'manual_decrease'/);
  for (const type of ['manual_increase', 'manual_decrease']) {
    assert.match(filters, new RegExp(`value="${type}"`));
    assert.deepEqual(routing.transactionDetailRoute({ detail_type: type, detail_id: 8 }), {
      name: 'TransactionDetail',
      params: { businessType: type, businessId: '8' },
    });
  }
  assert.deepEqual(routing.transactionDetailRoute({ detail_type: 'deposit', detail_id: 4 }), {
    name: 'DepositDetail',
    params: { id: '4' },
  });
  assert.deepEqual(routing.transactionDetailRoute({ detail_type: 'fiat_deposit', detail_id: 5 }), {
    name: 'FiatDepositDetail',
    params: { id: '5' },
  });
  assert.deepEqual(routing.transactionDetailRoute({ detail_type: 'exchange', detail_id: 6 }), {
    name: 'ExchangeDetail',
    params: { id: '6' },
  });
  assert.deepEqual(routing.transactionDetailRoute({ detail_type: 'withdrawal', detail_id: 7 }), {
    name: 'WithdrawalDetail',
    params: { id: '7' },
  });
  assert.deepEqual(
    routing.transactionDetailRoute({ business_type: 'manual_decrease', business_id: 9 }),
    {
      name: 'TransactionDetail',
      params: { businessType: 'manual_decrease', businessId: '9' },
    },
  );
  assert.match(routes, /name:\s*'TransactionDetail'/);
  assert.match(routes, /records\/detail\/:businessType\/:businessId/);
  assert.equal(
    existsSync(new URL('../src/views/records/detail/index.vue', import.meta.url)),
    true,
  );
});
test('long English text styles wrap and all changed component styles compile', () => {
  const files = ['BalanceCard.vue', 'QuickActionCard.vue'];
  for (const file of files) {
    const descriptor = parse(
      readFileSync(new URL(`../src/views/dashboard/components/${file}`, import.meta.url), 'utf8'),
    ).descriptor;
    assert.doesNotThrow(() =>
      sass.compileString('@use "breakpoints" as *;\n' + descriptor.styles[0].content, {
        loadPaths: ['src/styles'],
      }),
    );
  }
  const balance = readFileSync(
    new URL('../src/views/dashboard/components/BalanceCard.vue', import.meta.url),
    'utf8',
  );
  const table = readFileSync(
    new URL('../src/views/records/components/TransactionTable.vue', import.meta.url),
    'utf8',
  );

  assert.match(balance, /font-size: clamp\(24px/);
  assert.match(balance, /overflow-wrap: anywhere/);
  assert.match(table, /min-width="170"/);
  assert.match(table, /white-space: nowrap/);
  assert.match(table, /min-width="140" fixed="right"/);
});
