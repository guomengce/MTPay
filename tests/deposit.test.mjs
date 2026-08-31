import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
import { effectScope, nextTick, ref } from 'vue';

const require = createRequire(import.meta.url);
function loadModule(path, imports) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)((id) => {
    if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
    return imports[id];
  }, module, module.exports);
  return module.exports;
}

const { useDepositSelection } = loadModule('../src/views/deposit/composables/useDepositSelection.ts', { vue: require('vue') });
const channels = [[10, 'USDT', 'TRC20'], [9, 'USDT', 'ERC20'], [12, 'USDC', 'TRC20'], [11, 'USDC', 'ERC20']].map(([id, currency, network]) => ({
  wallet_address_id: id, coin_key: `${currency}_${network}`,
  currency: { code: currency, name: currency }, network: { code: network, name: network },
  receiving_address: { id, address: `test-only-address-${id}` },
}));

test('async channels default to the first choice and all currency/network pairs resolve correctly', async () => {
  const scope = effectScope();
  try {
    const source = ref([]);
    const state = scope.run(() => useDepositSelection(() => source.value));
    assert.equal(state.activeChannel.value, null);
    source.value = channels;
    await nextTick();
    assert.deepEqual(state.currencies.value.map((item) => item.code), ['USDT', 'USDC']);
    assert.equal(state.activeChannel.value.wallet_address_id, 10);
    for (const channel of channels) {
      state.currencyCode.value = channel.currency.code;
      state.networkCode.value = channel.network.code;
      await nextTick();
      assert.equal(state.activeChannel.value.wallet_address_id, channel.wallet_address_id);
      assert.equal(state.activeChannel.value.receiving_address.address, channel.receiving_address.address);
    }
    source.value = [channels[0]];
    await nextTick();
    assert.equal(state.currencyCode.value, 'USDT');
    assert.equal(state.networkCode.value, 'TRC20');
    assert.equal(state.activeChannel.value.wallet_address_id, 10);
    source.value = [channels[0], channels[3]];
    state.currencyCode.value = 'USDC';
    assert.equal(state.activeChannel.value, null);
    await nextTick();
    assert.equal(state.networkCode.value, 'ERC20');
    assert.equal(state.activeChannel.value.wallet_address_id, 11);
    source.value = [];
    await nextTick();
    assert.equal(state.activeChannel.value, null);
    assert.equal(state.currencyCode.value, '');
    assert.equal(state.networkCode.value, '');
  } finally { scope.stop(); }
});

test('deposit API exposes only the three documented GET operations', () => {
  const calls = [];
  const api = loadModule('../src/api/modules/deposit.ts', {
    '../request': { default: { get: (...args) => calls.push(args) } },
  });
  api.fetchDepositChannels();
  api.fetchDepositList({ page: 2, limit: 15 });
  api.fetchDepositDetail(1);
  assert.deepEqual(calls, [
    ['/web/getDepositChannelList'],
    ['/web/getDepositList', { params: { page: 2, limit: 15 } }],
    ['/web/getDepositInfo', { params: { id: 1 } }],
  ]);
  assert.deepEqual(Object.keys(api).sort(), ['fetchDepositChannels', 'fetchDepositDetail', 'fetchDepositList']);
});
