import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import {ref,computed} from 'vue';
const read=path=>readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
function load(path,imports,clock=Date,lifecycle={}) {
 const source=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const module={exports:{}};
 new Function('require','module','exports','Date','setInterval','clearInterval',source)(n=>imports[n],module,module.exports,clock,fn=>{lifecycle.tick=fn;return 1;},()=>{});
 return module.exports;
}
const draft={currency_id:3,amount:'100.00',payer_whitelist_id:1,payee_whitelist_id:2,file_ids:[7]};
function fixture(overrides={}) {
 let now=Date.now(),fee='10.00',unmount;const lifecycle={},calls=[];let completed=0;
 const api={createWithdrawalSecurityChallenge:async p=>{calls.push(['create',p]);return {security_challenge:'a'.repeat(64),expires_at:new Date(now+600000).toISOString(),email:'bound@example.com'};},sendWithdrawalEmailCode:async p=>{calls.push(['send',p]);return {expires_in:300};},verifyWithdrawalEmailCode:async p=>{calls.push(['email',p]);return {email_verified:true};},verifyWithdrawalTwoFactor:async p=>{calls.push(['2fa',p]);return {two_factor_verified:true};},cancelWithdrawalSecurityChallenge:async p=>calls.push(['cancel',p]),submitWithdrawal:async p=>{calls.push(['submit',p]);return {id:1};},...overrides};
 const flow=load('views/withdrawal/composables/useWithdrawalSecurity.ts',{
 vue:{ref,computed,onBeforeUnmount:fn=>unmount=fn},'vue-i18n':{useI18n:()=>({t:key=>key})},'@/stores/modules/auth':{useAuthStore:()=>({token:'token',userInfo:{id:'1'}})},'@/api/modules/withdrawal':api,
 },{now:()=>now,parse:Date.parse},lifecycle).useWithdrawalSecurity({fee:()=>fee,refresh:overrides.refresh || (async()=>{}),completed:async()=>{completed++;}});
 return {flow,calls,completed:()=>completed,advance:ms=>{now+=ms;lifecycle.tick?.();},setFee:v=>fee=v,unmount:()=>unmount()};
}
test('both server verifications gate submit and every request retains original draft',async()=>{
 const f=fixture();const input={...draft,file_ids:[7]};await f.flow.begin(input);
 input.amount='900.00';input.file_ids.push(8);
 assert.equal(f.flow.locked.value,true);assert.equal(f.flow.email.value,'bound@example.com');
 await f.flow.submit();assert.equal(f.completed(),0);
 await f.flow.verify('twoFactor','012345');assert.equal(f.flow.twoFactorVerified.value,true);
 await f.flow.sendEmail();await f.flow.sendEmail();assert.equal(f.calls.filter(c=>c[0]==='send').length,1);
 await f.flow.verify('email','012345');assert.equal(f.flow.ready.value,true);
 await f.flow.submit();assert.equal(f.completed(),1);assert.equal(f.flow.visible.value,false);
 for(const [name,payload] of f.calls.filter(c=>c[0]!=='cancel')) {
  assert.equal(payload.amount,draft.amount);assert.deepEqual(payload.file_ids,[7]);
  assert.equal(payload.currency_id,draft.currency_id);
  if(name!=='create') assert.equal(payload.security_challenge,'a'.repeat(64));
 }
 f.unmount();assert.equal(f.calls.filter(c=>c[0]==='cancel').length,0);
});
test('invalid/rejected codes do not verify, resend cooldown and code expiry are enforced',async()=>{
 const f=fixture({verifyWithdrawalTwoFactor:async()=>({two_factor_verified:false})});await f.flow.begin(draft);
 await f.flow.verify('email','123456');assert.equal(f.flow.emailVerified.value,false);
 await f.flow.verify('twoFactor','123');await f.flow.verify('twoFactor','123456');assert.equal(f.flow.twoFactorVerified.value,false);
 await f.flow.sendEmail();f.advance(60000);await f.flow.sendEmail();assert.equal(f.calls.filter(c=>c[0]==='send').length,2);
 f.advance(301000);await f.flow.verify('email','123456');assert.equal(f.flow.emailVerified.value,false);
 f.advance(300000);assert.equal(f.flow.expired.value,true);await f.flow.submit();assert.equal(f.completed(),0);f.unmount();
});
test('cancellation must finish before unlocking; stale create is cancelled on unmount',async()=>{
 let resolve;const f=fixture({cancelWithdrawalSecurityChallenge:()=>new Promise(done=>resolve=done)});await f.flow.begin(draft);
 const closing=f.flow.close();assert.equal(f.flow.locked.value,true);resolve();await closing;assert.equal(f.flow.locked.value,false);f.unmount();
 let create;const stale=fixture({createWithdrawalSecurityChallenge:()=>new Promise(done=>create=done)});const pending=stale.flow.begin(draft);stale.unmount();
 create({security_challenge:'b'.repeat(64),expires_at:new Date().toISOString(),email:'test'});await pending;
 assert.deepEqual(stale.calls,[['cancel','b'.repeat(64)]]);
});
test('fee changes invalidate verification; uncertain submission cannot be automatically retried',async()=>{
 const changed=fixture({verifyWithdrawalTwoFactor:async()=>{throw Error('fee changed');}});await changed.flow.begin(draft);changed.setFee('20.00');await changed.flow.verify('twoFactor','123456');assert.equal(changed.flow.visible.value,false);assert.equal(changed.flow.error.value,'withdrawalSecurity.changed');changed.unmount();
 let submits=0;const f=fixture({submitWithdrawal:async()=>{submits++;throw Error('network');}});await f.flow.begin(draft);await f.flow.sendEmail();await f.flow.verify('email','123456');await f.flow.verify('twoFactor','123456');await f.flow.submit();await f.flow.submit();assert.equal(submits,1);assert.equal(f.flow.uncertain.value,true);f.unmount();
});
test('security API endpoints send exact documented JSON bodies',async()=>{
 const calls=[];const api=load('api/modules/withdrawal.ts',{'../request':{default:{post:async(...args)=>calls.push(args)}}});
 const full={...draft,security_challenge:'a'.repeat(64)};
 await api.createWithdrawalSecurityChallenge(draft);await api.sendWithdrawalEmailCode(full);await api.verifyWithdrawalEmailCode({...full,email_code:'012345'});await api.verifyWithdrawalTwoFactor({...full,code:'012345'});await api.cancelWithdrawalSecurityChallenge(full.security_challenge);await api.submitWithdrawal(full);
 assert.deepEqual(calls.map(c=>c[0]),['createWithdrawalSecurityChallenge','sendWithdrawalEmailCode','verifyWithdrawalEmailCode','verifyWithdrawalTwoFactor','cancelWithdrawalSecurityChallenge','submitWithdrawal'].map(p=>'/web/'+p));
 assert.deepEqual(calls[4][1],{security_challenge:full.security_challenge});
 assert.doesNotMatch(read('views/withdrawal/components/WithdrawalSecurityDialog.vue'),/emailVerified\.value\s*=\s*true|twoFactorVerified\.value\s*=\s*true/);
});

test('successful cancellation invalidates verification even when refresh fails; retry does not cancel twice', async () => {
 let refreshes = 0;
 const f = fixture({ refresh: async () => { if (++refreshes === 1) throw Error('offline'); } });
 await f.flow.begin(draft); await f.flow.sendEmail();
 await f.flow.verify('email', '012345'); await f.flow.verify('twoFactor', '012345');
 assert.equal(f.flow.ready.value, true);
 await f.flow.close();
 assert.equal(f.flow.locked.value, true); assert.equal(f.flow.ready.value, false);
 await f.flow.submit(); assert.equal(f.completed(), 0);
 await f.flow.close();
 assert.equal(f.flow.locked.value, false);
 assert.equal(f.calls.filter(c => c[0] === 'cancel').length, 1);
 f.unmount();
});
