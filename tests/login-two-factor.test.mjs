import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { ref, reactive } from 'vue';
import { parse, compileScript } from '@vue/compiler-sfc';
const read = path => readFileSync(new URL('../src/' + path, import.meta.url), 'utf8');
function load(path, imports = {}, clock = Date) {
 const code = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
 const module = { exports: {} };
 new Function('require','module','exports','Date','setInterval','clearInterval',code)(name => { if (!(name in imports)) throw Error(name); return imports[name]; },module,module.exports,clock,()=>1,()=>{});
 return module.exports;
}
test('login challenge stays in memory, validates data, limits lifetime and sanitizes redirects', () => {
 const state = load('utils/loginChallenge.ts', {}, { now: () => 1000 });
 assert.equal(state.getLoginChallenge(), null);
 assert.throws(() => state.beginLoginChallenge({login_challenge:'bad',expires_in:300}));
 state.beginLoginChallenge({ login_challenge:'a'.repeat(64), expires_in:900 }, '/records?page=2');
 assert.equal(state.getLoginChallenge().expiresAt, 301000);
 assert.equal(state.getLoginChallenge().redirect, '/records?page=2');
 for(const path of ['https://bad.test','//bad.test','/\\bad.test','/%2f%2fbad','/login','/two-factor']) assert.equal(state.safeLoginRedirect(path), '/dashboard');
 assert.equal(state.requiresTwoFactor({two_factor_required:true}), true);
 for(const data of [{}, {token:''}, {token:'ok',id:1,two_factor_required:true}]) assert.equal(state.validLoginResult(data),false);
 assert.equal(state.validLoginResult({token:'ok',id:1}),true);
 state.clearLoginChallenge(); assert.equal(state.getLoginChallenge(),null);
 assert.doesNotMatch(read('utils/loginChallenge.ts'), /localStorage|sessionStorage/);
});
function fixture(verify) {
 let now=1000; let mounted,unmount; const routes=[],sessions=[];
 const clock={now:()=>now};
 const state=load('utils/loginChallenge.ts',{},clock);
 state.beginLoginChallenge({login_challenge:'a'.repeat(64),expires_in:300},'/records');
 const complete=load('utils/completeLogin.ts',{'@/stores/modules/auth':{useAuthStore:()=>({login:value=>sessions.push(value)})},'./loginChallenge':state});
 const flow=load('composables/useTwoFactorLogin.ts',{
 vue:{ref,onMounted:fn=>mounted=fn,onBeforeUnmount:fn=>unmount=fn},
 'vue-router':{useRouter:()=>({replace:async value=>routes.push(value)})},
 '@/api/modules/auth':{verifyTwoFactorLogin:verify},
 '@/utils/completeLogin':complete,'@/utils/loginChallenge':state,
 },clock).useTwoFactorLogin();
 mounted();
 return {flow,state,routes,sessions,unmount:()=>unmount(),advance:()=>now+=301000};
}
test('verification preserves leading zero and creates a session only after success', async()=>{
 let payload;
 const f=fixture(async value=>{payload=value;return {id:1,token:'valid',name:'Admin',company_name:'Agent'};});
 f.flow.code.value='123';await f.flow.submit();assert.equal(payload,undefined);
 f.flow.code.value='012345';await f.flow.submit();
 assert.deepEqual(payload,{login_challenge:'a'.repeat(64),code:'012345'});
 assert.equal(f.sessions.length,1);assert.equal(f.sessions[0].token,'valid');
 assert.deepEqual(f.routes,['/records']);assert.equal(f.state.getLoginChallenge(),null);
 f.unmount();
});
test('double submit and response after leaving cannot create a session',async()=>{
 let resolve;let calls=0;
 const f=fixture(()=>{calls++;return new Promise(done=>resolve=done);});
 f.flow.code.value='123456';const first=f.flow.submit();await f.flow.submit();assert.equal(calls,1);
 f.flow.back();resolve({id:1,token:'valid'});await first;
 assert.equal(f.sessions.length,0);assert.equal(f.state.getLoginChallenge(),null);f.unmount();
});
test('expired challenge, server rejection and malformed token never authenticate', async()=>{
 let calls=0;
 const expired=fixture(async()=>{calls++;});expired.advance();expired.flow.code.value='123456';await expired.flow.submit();
 assert.equal(calls,0);assert.equal(expired.flow.expired.value,true);expired.unmount();
 for(const verify of [async()=>{throw Error('Challenge exhausted');},async()=>({two_factor_required:true})]) {
 const f=fixture(verify);f.flow.code.value='123456';await f.flow.submit();assert.equal(f.sessions.length,0);assert.equal(f.flow.code.value,'');assert.ok(f.flow.error.value);f.unmount();
 }
});
test('both login steps use public authentication endpoints; verification sends exact fields',async()=>{
 const source=read('api/modules/auth.ts');const prefix=source.includes('/web/agentLogin')?'web':'admin';const calls=[];
 const api=load('api/modules/auth.ts',{'../request':{default:{get:async()=>({public:'public-key'}),post:async(...args)=>{calls.push(args);return {two_factor_required:true};}}},'@/utils/loginCrypto':{createLoginEnvelope:()=>({encrypted:true})}});
 await (api.login||api.fetchLogin)({email:'test@example.com',password:'secret'});
 await api.verifyTwoFactorLogin({login_challenge:'a'.repeat(64),code:'012345'});
 assert.equal(calls[0][0],prefix==='web'?'/web/agentLogin':'/admin/adminLogin');
 assert.deepEqual(calls[1],['/'+prefix+'/verifyTwoFactorLogin',{login_challenge:'a'.repeat(64),code:'012345'}]);
 const request=read('api/request.ts');assert.ok(request.includes("'/"+prefix+"/verifyTwoFactorLogin'"));
 assert.match(request,/refreshedToken && !isPublicAuthRequest/);
 assert.match(read('router/guard.ts'),/to.name === 'TwoFactor' && !getLoginChallenge\(\)/);
});

test('password UI branches into 2FA without saving session; normal login still completes', async()=>{
 const web=read('api/modules/auth.ts').includes('/web/agentLogin');
 for(const challenge of [true,false]) {
 const source=read(web?'views/auth/login/index.vue':'views/login/components/LoginCard.vue');
 const compiled=compileScript(parse(source).descriptor,{id:'test'}).content;
 const js=ts.transpileModule(compiled,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const state=load('utils/loginChallenge.ts');const routes=[],sessions=[];
 const response=challenge?{two_factor_required:true,login_challenge:'a'.repeat(64),expires_in:300}:{id:1,token:'valid'};
 const imports={vue:{ref,reactive,onBeforeUnmount(){},defineComponent:value=>value},
 'vue-i18n':{useI18n:()=>({t:key=>key})},'vue-router':{useRoute:()=>({query:{redirect:'/records'}}),useRouter:()=>({replace:async value=>routes.push(value)})},
 '@/utils/loginChallenge':state,'@/utils/completeLogin':{completeLogin:value=>sessions.push(value)},
 '@/api/modules/auth':{login:async()=>response,fetchLogin:async()=>response},'element-plus':{ElMessage:{error(){}}}};
 const module={exports:{}};new Function('require','module','exports',js)(name=>imports[name]||{},module,module.exports);
 const vm=module.exports.default.setup({}, {expose(){}});
 if(!web) {vm.form.email='test@example.com';vm.form.password='test-password';}
 await vm.handleSubmit({email:'test@example.com',password:'test-password'});
 assert.equal(sessions.length,challenge?0:1);
 assert.deepEqual(routes,challenge?[{name:'TwoFactor'}]:['/records']);
 assert.equal(Boolean(state.getLoginChallenge()),challenge);
 }
});
