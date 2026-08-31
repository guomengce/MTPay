import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { parse, compileTemplate } from '@vue/compiler-sfc';
const base=new URL('../src/views/withdrawal/detail/components/',import.meta.url);
test('withdrawal detail uses management-style amounts and complete party cards',()=>{
 const overview=readFileSync(new URL('TransactionOverview.vue',base),'utf8');
 const party=readFileSync(new URL('PartyDetailCard.vue',base),'utf8');
 const content=readFileSync(new URL('WithdrawalDetailContent.vue',base),'utf8');
 const loader=readFileSync(new URL('../src/views/withdrawal/composables/useWithdrawalDetail.ts',import.meta.url),'utf8');
 for(const [name,source] of [['TransactionOverview',overview],['PartyDetailCard',party]]){
  const descriptor=parse(source,{filename:name+'.vue'}).descriptor;
  assert.deepEqual(compileTemplate({source:descriptor.template.content,filename:name+'.vue',id:'withdrawal-detail'}).errors,[]);
 }
 assert.match(overview,/detail\.total_amount/);assert.match(overview,/detail\.fee_amount/);assert.match(overview,/detail\.amount/);
 assert.match(overview,/role="payer"/);assert.match(overview,/role="payee"/);
 assert.match(party,/party\.data\?\?props\.party\.snapshot/);assert.match(party,/business_data/);assert.match(party,/BANK_ORDER\.map\(field\)/);
 for(const key of ['company_type','registration_country','operating_country','city','address','registration_date','document_no'])assert.match(party,new RegExp(`['"]${key}['"]`));
 for(const key of ['bank_name','bank_account','swift','intermediary_swift','remittance_purpose','remark'])assert.match(party,new RegExp(`['"]${key}['"]`));
 assert.match(loader,/fetchWhitelistDetail\(result\.payer\.whitelist_id\)/);
 assert.match(loader,/fetchWhitelistDetail\(result\.payee\.whitelist_id\)/);
 assert.match(loader,/data: source\.value\.business_data/);
 assert.match(party,/key==='document_no'&&props\.party\.entity_type===1\?'companyNo'/);
 assert.match(content,/<TransactionOverview :detail="detail"/);
 assert.match(content,/<Timeline v-if="detail\.records\.length"/);
 assert.doesNotMatch(content,/__workspace|__aside|position:\s*sticky/);
 assert.equal(existsSync(new URL('SettlementCard.vue',base)),false);
 assert.equal(existsSync(new URL('PartyCard.vue',base)),false);
 for(const locale of ['zh-CN','zh-HK','en-US']){
  const source=readFileSync(new URL(`../src/locales/${locale}.ts`,import.meta.url),'utf8');
  for(const key of ['amountDetails','actualWithdrawal','payerCompany','payerPerson','payeeCompany','payeePerson','bankDetails','copyParty','partyCopied','iban','swift'])assert.match(source,new RegExp(`${key}:`));
 }
});
