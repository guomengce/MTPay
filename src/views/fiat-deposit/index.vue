<template>
  <main class="fiat-page">
    <AdminHero title="法币入金" icon="ri-bank-card-line" />
    <FiatDepositForm
      :currencies="currencies"
      :file-rules="fileRules"
      :submitting="submitting"
      @submit="submit"
    />
    <FiatDepositList
      :list="list"
      :loading="loading"
      :page="page"
      :limit="limit"
      :total="total"
      :currencies="currencies"
      :query="filters"
      @refresh="load"
      @search="search"
      @reset="resetFilters"
      @query-change="changeFilters"
      @page="setPage"
      @detail="detail"
    />
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import AdminHero from '@/components/admin/AdminHero.vue';
import {
  fetchFiatConfig,
  fetchFiatList,
  submitFiatDeposit,
  type FiatCurrency,
  type FiatFileRules,
  type FiatDepositStatus,
  type FiatOrder,
  type FiatSubmit,
} from '@/api/modules/fiatDeposit';
import FiatDepositForm from './components/FiatDepositForm.vue';
import FiatDepositList from './components/FiatDepositList.vue';
const router = useRouter();
const currencies = ref<FiatCurrency[]>([]);
const fileRules = ref<FiatFileRules>();
const list = ref<FiatOrder[]>([]);
const loading = ref(false);
const submitting = ref(false);
const page = ref(1);
const limit = ref(15);
const total = ref(0);
const filters = ref({
  currency_id: undefined as number | undefined,
  status: undefined as FiatDepositStatus | undefined,
  keyword: '',
  started_at: '',
  ended_at: '',
});
async function load() {
  loading.value = true;
  try {
    const result = await fetchFiatList({ ...filters.value, page: page.value, limit: limit.value });
    list.value = result.data;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}
function search() {
  page.value = 1;
  void load();
}
function changeFilters(patch: Partial<typeof filters.value>) {
  Object.assign(filters.value, patch);
}
function resetFilters() {
  filters.value = { currency_id: undefined, status: undefined, keyword: '', started_at: '', ended_at: '' };
  page.value = 1;
}
function setPage(value: number) {
  page.value = value;
  void load();
}
function detail(id: number) {
  void router.push({ name: 'FiatDepositDetail', params: { id } });
}
async function submit(payload: FiatSubmit) {
  submitting.value = true;
  try {
    const result = await submitFiatDeposit(payload);
    ElMessage.success('法币入金申请已提交');
    await router.push({ name: 'FiatDepositDetail', params: { id: result.id } });
  } finally {
    submitting.value = false;
  }
}
onMounted(async () => {
  const config = await fetchFiatConfig();
  currencies.value = config.currencies;
  fileRules.value = config.file_rules;
  await load();
});
</script>
<style scoped lang="scss">
.fiat-page {
  display: grid;
  min-width: 0;
  gap: 22px;

}
</style>
