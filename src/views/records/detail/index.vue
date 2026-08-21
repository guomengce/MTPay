<template>
  <main class="transaction-detail">
    <el-button plain :icon="Back" @click="goBack">返回交易记录</el-button>
    <div v-loading="loading" class="transaction-detail__content">
      <DepositDetailContent v-if="depositDetail" :detail="depositDetail" />
      <ExchangeDetailContent v-else-if="exchangeDetail" :detail="exchangeDetail" />
      <WithdrawalDetailContent v-else-if="withdrawalDetail" :detail="withdrawalDetail" :file-loading="fileLoading" @preview="openPreview" @download="triggerDownload" />
      <el-empty v-else-if="!loading" :description="invalid ? '无效的交易记录参数' : '未找到该交易记录'" />
    </div>
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Back } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import type { DepositOrderDetail } from '@/api/modules/deposit';
import type { ExchangeOrderDetail } from '@/api/modules/exchange';
import * as TransactionApi from '@/api/modules/transaction';
import type { TransactionBusinessType, TransactionInfoResult } from '@/api/modules/transaction';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DepositDetailContent from '@/views/deposit/detail/components/DepositDetailContent.vue';
import ExchangeDetailContent from '@/views/exchange/detail/components/ExchangeDetailContent.vue';
import WithdrawalDetailContent from '@/views/withdrawal/detail/components/WithdrawalDetailContent.vue';
import { useWithdrawalFiles } from '@/views/withdrawal/composables/useWithdrawalFiles';
const route=useRoute();const router=useRouter();const loading=ref(false);const invalid=ref(false);const info=ref<TransactionInfoResult|null>(null);const{loading:fileLoading,openPreview,triggerDownload}=useWithdrawalFiles();
const depositDetail=computed(()=>info.value?.transaction.business_type==='deposit'?info.value.detail as DepositOrderDetail:null);
const exchangeDetail=computed(()=>info.value?.transaction.business_type==='exchange'?info.value.detail as ExchangeOrderDetail:null);
const withdrawalDetail=computed(()=>info.value?.transaction.business_type==='withdrawal'?info.value.detail as WithdrawalOrderDetail:null);
function goBack(){void router.push('/records')}
onMounted(async()=>{const businessType=route.params.businessType as TransactionBusinessType;const businessId=Number(route.params.businessId);if(!['deposit','exchange','withdrawal'].includes(businessType)||!Number.isInteger(businessId)||businessId<=0){invalid.value=true;return}loading.value=true;try{info.value=await TransactionApi.fetchTransactionInfo({business_type:businessType,business_id:businessId})}finally{loading.value=false}});
</script>
<style scoped lang="scss">.transaction-detail{display:grid;min-width:0;gap:18px;padding:20px}.transaction-detail>.el-button{width:fit-content}.transaction-detail__content{min-height:300px}@include mobile{.transaction-detail{padding:12px;gap:14px}}</style>
