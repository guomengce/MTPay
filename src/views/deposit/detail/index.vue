<template><main class="business-detail"><el-button plain :icon="Back" @click="router.push('/deposit')">返回入金列表</el-button><DepositDetailContent v-if="detail" :detail="detail" /><el-empty v-else-if="!loading" description="未找到该入金订单" /></main></template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'; import { Back } from '@element-plus/icons-vue'; import { useRoute, useRouter } from 'vue-router'; import { usePageLoading } from '@/composables/usePageLoading'; import DepositDetailContent from './components/DepositDetailContent.vue'; import { useDepositDetail } from '../composables/useDepositDetail';
const route=useRoute();const router=useRouter();const id=computed(()=>Number(route.params.id));const{loading,detail,fetchDetail}=useDepositDetail();usePageLoading(loading);async function load(){if(Number.isInteger(id.value)&&id.value>0)await fetchDetail(id.value)}onMounted(load);watch(id,load);
</script>
<style scoped lang="scss">.business-detail{display:grid;min-width:0;gap:18px;padding:20px}.business-detail>.el-button{width:fit-content}@include mobile{.business-detail{padding:0;gap:14px}}</style>
