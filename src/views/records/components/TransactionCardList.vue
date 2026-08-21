<template><ResponsiveCardList :items="items" @action="handleAction" /></template>
<script setup lang="ts">
import { computed } from 'vue'; import { View } from '@element-plus/icons-vue';
import type { TransactionItem } from '@/api/modules/transaction';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import ResponsiveCardList, { type ResponsiveCardItem } from '@/components/common/ResponsiveCardList.vue';
import { formatExchangeRate } from '@/utils/decimal';
const props=defineProps<{data:TransactionItem[]}>(); const emit=defineEmits<{(e:'view',row:TransactionItem):void}>();
const items=computed<ResponsiveCardItem[]>(()=>props.data.map(row=>({key:row.transaction_key,title:row.order_no,subtitle:row.submitted_at||'—',status:{label:row.status_name,type:statusType(row),effect:statusEffect(row)},pending:Boolean(statusEffect(row)),accent:row.business_type==='deposit'?'success':row.business_type==='exchange'?'warning':'primary',fields:[{label:'类型',badge:{label:row.business_name,type:businessType(row)}},{label:'交易内容',value:contentLabel(row),strong:true},{label:'金额',value:`${row.amount} ${row.currency_code}`,subValue:amountSubValue(row),strong:true}],actions:[{key:'view',label:'查看详情',icon:View,type:'primary',plain:true}]})));
function statusType(row:TransactionItem):StatusBadgeType{if(row.status_group==='completed')return'success';if(row.status_group==='rejected')return'danger';if(row.status_group==='failed')return'gray';if(row.status_group==='processing')return'primary';return'warning'}
function statusEffect(row:TransactionItem){return row.status_group==='pending'||row.status_group==='needs_supplement'?'pending':undefined}
function businessType(row:TransactionItem):StatusBadgeType{return row.business_type==='deposit'?'success':row.business_type==='exchange'?'warning':'primary'}
function contentLabel(row:TransactionItem){if(row.business_type==='withdrawal')return[row.payer_name,row.payee_name].filter(Boolean).join(' → ')||'—';if(row.business_type==='exchange'){const rate=formatExchangeRate(row.exchange_rate);return`${row.currency_code} → ${row.target_currency_code||'—'}${rate?` · 兑换比例 ${rate}`:''}`}return[row.currency_code,row.network_code].filter(Boolean).join(' · ')}
function amountSubValue(row:TransactionItem){if(row.business_type==='withdrawal')return`总扣款 ${row.total_amount||'—'} ${row.currency_code}`;if(row.business_type==='exchange')return`获得 ${row.target_amount||'—'} ${row.target_currency_code||''}`;return undefined}
function handleAction(actionKey:string,itemKey:string){if(actionKey!=='view')return;const row=props.data.find(item=>item.transaction_key===itemKey);if(row)emit('view',row)}
</script>
