import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createI18n } from 'vue-i18n';
import ts from 'typescript';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
const root = new URL('../src/', import.meta.url);
function locale(name) {
 const code = ts.transpileModule(readFileSync(new URL(`locales/${name}.ts`,root),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const module = {exports:{}}; new Function('exports','module',code)(module.exports,module); return module.exports.default;
}
function files(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)]); }
const keys = new Set(['paymentPassword.setup','paymentPassword.change','paymentPassword.reset']);
const scope = [
 ...files(fileURLToPath(new URL('../src/views/account/',import.meta.url))),
 ...files(fileURLToPath(new URL('../src/views/auth/',import.meta.url))),
 ...files(fileURLToPath(new URL('../src/views/withdrawal/',import.meta.url))),
 ...['layout/components/AppHeader.vue','components/common/AuthPageHeader.vue','components/admin/StatusBadge.vue','utils/portalMessageBox.ts'].map(path=>fileURLToPath(new URL(path,root))),
];
const namespaces = Object.keys(locale('zh-CN'));
for (const file of scope) {
 if (!/\.(vue|ts)$/.test(file)) continue;
 for (const match of readFileSync(file,'utf8').matchAll(/['"]([a-zA-Z]+\.[A-Za-z.]+)['"]/g)) {
   if(namespaces.includes(match[1].split('.')[0])) keys.add(match[1]);
 }
}
for (const language of ['zh-CN','zh-HK','en-US']) test(`account, auth and withdrawal translations resolve in ${language}`,()=>{
 const messages=locale(language); const i18n=createI18n({legacy:false,locale:language,messages:{[language]:messages},missingWarn:false,fallbackWarn:false});
 for(const key of keys) { assert.ok(i18n.global.te(key),`${language}: missing ${key}`); assert.notEqual(i18n.global.t(key,{time:'12:00',seconds:60}),key); }
 assert.equal(Object.keys(messages.paymentPassword).length,Object.keys(locale('zh-CN').paymentPassword).length);
});


test('2FA confirmation and shared confirmation buttons use translations', () => {
 const card=readFileSync(new URL('views/account/components/TwoFactorCard.vue',root),'utf8');
 assert.match(card,/message: t\('twoFactorSettings\.disableWarning'\)/);
 const dialog=readFileSync(new URL('utils/portalMessageBox.ts',root),'utf8');
 assert.match(dialog,/confirmText = i18n\.global\.t\('common\.actions\.confirm'\)/);
 assert.match(dialog,/cancelText = i18n\.global\.t\('common\.actions\.cancel'\)/);
});
