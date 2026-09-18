import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import { ref } from 'vue';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/utils/idleLogout.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function harness() {
  let now = 1_000_000;
  let nextId = 0;
  const timers = new Map();
  const listeners = new Map();
  const surface = {
    addEventListener(name, callback) { listeners.set(name, callback); },
    removeEventListener(name) { listeners.delete(name); },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require, Date: { now: () => now },
    window: surface,
    document: surface,
    setTimeout: (callback, delay) => { timers.set(++nextId, { callback, at: now + delay }); return nextId; },
    clearTimeout: (id) => timers.delete(id),
  });
  const token = ref('');
  let logouts = 0;
  const start = () => exports.setupIdleLogout({
    getToken: () => token.value,
    onTimeout: () => { logouts++; token.value = ''; },
  });
  return {
    token, start, listeners, timers,
    get logouts() { return logouts; },
    elapse(ms, runTimers = true) {
      now += ms;
      if (runTimers) for (const [id, timer] of [...timers]) {
        if (timer.at <= now) { timers.delete(id); timer.callback(); }
      }
    },
    event(name, isTrusted = true) { listeners.get(name)?.({ isTrusted }); },
  };
}

test('only logged-in sessions time out, clear state and stop listeners after five minutes', () => {
  const h = harness();
  h.start();
  h.elapse(300_000);
  assert.equal(h.logouts, 0);
  h.token.value = 'token';
  h.elapse(299_999);
  assert.equal(h.logouts, 0);
  h.elapse(1);
  assert.equal(h.logouts, 1);
  assert.equal(h.token.value, '');
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('real interactions extend the deadline; synthetic events do not', () => {
  for (const event of ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel', 'scroll']) {
    const h = harness();
    h.start();
    h.token.value = 'token';
    h.elapse(240_000);
    h.event(event);
    h.elapse(60_000);
    assert.equal(h.logouts, 0);
    h.event(event, false);
    h.elapse(240_000);
    assert.equal(h.logouts, 1);
  }
});

test('delayed background timers cannot be renewed by returning or interacting', () => {
  for (const event of ['focus', 'visibilitychange', 'pointerdown']) {
    const h = harness();
    h.start();
    h.token.value = 'token';
    h.elapse(300_001, false);
    h.event(event);
    assert.equal(h.logouts, 1);
  }
});

test('refresh with an existing token restarts the full five-minute deadline', () => {
  const h = harness();
  h.token.value = 'token';
  const dispose = h.start();
  h.elapse(240_000);
  dispose();
  h.start();
  h.elapse(299_999);
  assert.equal(h.logouts, 0);
  h.elapse(1);
  assert.equal(h.logouts, 1);
});

test('manual logout cleans up, subsequent login starts fresh, disposal removes listeners', () => {
  const h = harness();
  const dispose = h.start();
  h.token.value = 'first';
  h.elapse(240_000);
  h.token.value = '';
  assert.equal(h.listeners.size, 0);
  h.token.value = 'second';
  h.elapse(60_000);
  assert.equal(h.logouts, 0);
  dispose();
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});
