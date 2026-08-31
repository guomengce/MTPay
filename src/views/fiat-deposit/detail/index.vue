<template>
  <main class="business-detail">
    <el-button plain :icon="Back" @click="router.go(-1)">{{ t('fiatDepositDetail.back') }}</el-button>
    <FiatDepositDetailContent v-if="detail" :detail="detail" @preview="preview" @download="download" />
    <el-empty v-else-if="!loading" :description="t('fiatDepositDetail.notFound')" />
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Back } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { usePageLoading } from '@/composables/usePageLoading';
import { downloadFiatFile, fetchFiatDetail, previewFiatFile, type FiatOrderDetail } from '@/api/modules/fiatDeposit';
import FiatDepositDetailContent from './components/FiatDepositDetailContent.vue';
const route=useRoute();const router=useRouter();const{t}=useI18n();const detail=ref<FiatOrderDetail>();const loading=ref(false);usePageLoading(loading);
function openBlob(blob:Blob,name?:string){const url=URL.createObjectURL(blob);if(name){const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();}else window.open(url,'_blank');setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function preview(id:number){openBlob(await previewFiatFile(id));}
async function download(id:number,name:string){openBlob(await downloadFiatFile(id),name);}
async function load(){const id=Number(route.params.id);if(!Number.isInteger(id)||id<=0)return;loading.value=true;try{detail.value=await fetchFiatDetail(id);}finally{loading.value=false;}}
onMounted(load);
</script>
<style scoped lang="scss">.business-detail{display:grid;min-width:0;gap:18px;padding:20px}.business-detail>.el-button{width:fit-content}@include mobile{.business-detail{gap:14px;padding:0}}</style>
