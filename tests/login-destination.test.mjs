import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/utils/loginDestination.ts', import.meta.url), 'utf8');
const module = { exports: {} };
new Function('exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(module.exports);
const { setPendingDestination, loginDestination } = module.exports;
test('expired token during initial navigation preserves the detail URL including query and hash', () => {
  const detail = '/withdrawal/detail/123?from=records#payment';
  setPendingDestination(detail);
  assert.equal(loginDestination({ fullPath: '/', query: {} }), detail);
  setPendingDestination();
  assert.equal(loginDestination({ name: 'Login', fullPath: '/login', query: { redirect: detail } }), detail);
});
test('expired session on an already loaded page returns to that page', () => {
  assert.equal(loginDestination({ fullPath: '/deposit/detail/42', query: {} }), '/deposit/detail/42');
  assert.equal(loginDestination({ name: 'Login', fullPath: '/login', query: {} }), undefined);
});
