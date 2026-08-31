<template>
  <article class="party-card" :class="`is-${role}`">
    <header>
      <div class="party-card__title"><i /><h3>{{ title }}</h3></div>
      <div class="party-card__actions"><IdentityBadge :role="role === 'payer' ? 1 : 2" :entity-type="party.entity_type" /><el-button circle plain size="small" :icon="DocumentCopy" :aria-label="t('withdrawal.copyParty')" @click="copyAll" /></div>
    </header>
    <dl class="party-card__fields"><div v-for="field in subjectFields" :key="field.key"><dt>{{ field.label }}</dt><dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd></div></dl>
    <section v-if="role === 'payee' && bankFields.length" class="party-card__bank"><h4>{{ t('withdrawal.bankDetails') }}</h4><dl class="party-card__fields"><div v-for="field in bankFields" :key="field.key"><dt>{{ field.label }}</dt><dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd></div></dl></section>
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import type { WithdrawalPartySummary } from '@/api/modules/withdrawal';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
const props=defineProps<{party:WithdrawalPartySummary;role:'payer'|'payee'}>();
const { t }=useI18n();
type Field={key:string;label:string;value:string;mono?:boolean};
const BANK=new Set(['bank_name','bank_account','account_no','iban','swift','swift_code','intermediary_swift','remittance_purpose','remark']);
const HIDDEN=new Set(['id','whitelist_id','whitelist_no','role','role_name','entity_type','entity_type_name','subject_name','name','business_data']);
const COMPANY=['company_name','company_type','registration_country','operating_country','city','address','registration_date','document_no'];
const PERSON=['given_name','surname','nationality','residence_country','city','address','birth_date','document_type','document_no'];
const BANK_ORDER=['bank_name','bank_account','iban','swift','intermediary_swift','remittance_purpose','remark'];
const ORDER=[...COMPANY,...PERSON,...BANK_ORDER];
const labels:Record<string,string>={company_name:'companyName',company_type:'companyType',given_name:'givenName',surname:'surname',registration_country:'registrationCountry',operating_country:'operatingCountry',nationality:'nationality',residence_country:'residenceCountry',city:'city',address:'address',registration_date:'registrationDate',birth_date:'birthDate',document_type:'documentType',document_no:'documentNo',bank_name:'bankName',bank_account:'bankAccount',account_no:'bankAccount',iban:'iban',swift:'swift',swift_code:'swift',intermediary_swift:'intermediarySwift',remittance_purpose:'remittancePurpose',remark:'remark'};
const data=computed(()=>{const raw=props.party.data??props.party.snapshot??{};const merged={...raw};const business=raw.business_data;if(business&&typeof business==='object'&&!Array.isArray(business))Object.assign(merged,business);delete merged.business_data;if(!merged.bank_account&&merged.account_no)merged.bank_account=merged.account_no;if(!merged.swift&&merged.swift_code)merged.swift=merged.swift_code;if(!merged.company_name&&props.party.entity_type===1)merged.company_name=props.party.name;return merged as Record<string,unknown>});
function value(key:string,raw:unknown){if(raw==null||raw==='')return '—';if(key==='company_type')return t(`whitelist.${Number(raw)===2?'financial':'nonFinancial'}`);if(key==='document_type')return t(`whitelist.${Number(raw)===2?'passport':'identityDocument'}`);return String(raw)}
const expectedSubject=computed(()=>props.party.entity_type===1?COMPANY:PERSON);
const extras=computed(()=>Object.keys(data.value).filter(key=>!ORDER.includes(key)&&!HIDDEN.has(key)&&!BANK.has(key)&&typeof data.value[key]!=='object'));
function field(key:string):Field{const labelKey=key==='document_no'&&props.party.entity_type===1?'companyNo':labels[key];return {key,label:labelKey?t(`whitelist.${labelKey}`):key.replace(/_/g,' '),value:value(key,data.value[key]),mono:['document_no','bank_account','iban','swift','intermediary_swift'].includes(key)}}
const subjectFields=computed(()=>[...expectedSubject.value,...extras.value].filter((key,index,all)=>all.indexOf(key)===index).map(field));
const bankFields=computed(()=>props.role==='payee'?BANK_ORDER.map(field):[]);
const title=computed(()=>t(`withdrawal.${props.role}${props.party.entity_type===1?'Company':'Person'}`));
async function copyAll(){const lines=[title.value,...subjectFields.value,...bankFields.value].map(item=>typeof item==='string'?item:`${item.label}: ${item.value}`);try{await navigator.clipboard.writeText(lines.join('\n'));ElMessage.success(t('withdrawal.partyCopied'))}catch{ElMessage.error(t('withdrawal.copyFailed'))}}
</script>
<style scoped lang="scss">
.party-card { min-width:0; overflow:hidden; border:1px solid #dce7ef; border-radius:14px; background:#fbfcfe; &.is-payee { border-color:#dce6f3; background:#f8faff; > header { background:linear-gradient(90deg,#eef4fc,#fafcff); } .party-card__title i { background:#4b83d1; box-shadow:0 0 0 4px rgb(75 131 209 / 10%); } } > header { display:flex; min-height:46px; align-items:center; justify-content:space-between; gap:10px; padding:10px 14px; background:linear-gradient(90deg,#edf9f7,#f8fcfc); } &__title,&__actions { display:flex; align-items:center; gap:8px; } &__title i { width:8px; height:8px; border-radius:50%; background:#0aa49a; box-shadow:0 0 0 4px rgb(10 164 154 / 10%); } h3 { margin:0; color:#17324f; font-size:14px; } &__actions .el-button { margin-left:0; color:#168f89; } &__fields { display:grid; margin:0; padding:10px 15px 14px; > div { display:grid; min-width:0; padding:6px 0; grid-template-columns:112px minmax(0,1fr); gap:8px; } dt { color:#718399; font-size:11px; } dd { margin:0; color:#20364e; font-size:13px; font-weight:600; overflow-wrap:anywhere; } .is-mono { font-family:ui-monospace,Consolas,monospace; } } &__bank { margin:0 15px 12px; padding-top:10px; border-top:1px solid #dfe8ef; h4 { margin:0; color:#5e7186; font-size:11px; } .party-card__fields { padding-right:0; padding-left:0; } } }
@include mobile { .party-card__fields > div { grid-template-columns:96px minmax(0,1fr); } }
</style>
