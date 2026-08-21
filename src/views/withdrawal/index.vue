<template>
  <main class="withdrawal-page">
    <AdminHero
      title="USD 出金"
      description="选择已通过的付款人与收款人提交出金，审核通过后由平台完成付款"
      icon="ri-bank-card-line"
    />

    <section class="withdrawal-page__content">
      <ApplyForm
        v-loading="configLoading"
        ref="applyFormRef"
        :balance="balance"
        :payers="config?.payers"
        :payees="config?.payees"
        :fee-amount="config?.fee_amount"
        :file-rules="config?.file_rules"
        :config-loading="configLoading"
        :submitting="withdrawalSubmitting"
        :uploading="withdrawalUploading"
        :upload-file="uploadWithdrawalFile"
        @submit="handleSubmit"
      />
      <RecordList
        :list="list"
        :total="total"
        :page="page"
        :limit="limit"
        :loading="listLoading"
        :query="query"
        @refresh="fetchList"
        @search="handleSearch"
        @reset="resetQuery"
        @query-change="handleQueryChange"
        @page="onPage"
        @detail="openDetail"
        @supplement="openSupplement"
      />
    </section>

    <SupplementDialog
      v-model="supplementDialogVisible"
      :row="supplementItem"
      :requirement="supplementRequirement"
      :submitting="supplementSubmitting"
      :uploading="supplementUploading"
      :upload-file="uploadSupplementFile"
      @submit="handleSupplement"
    />
  </main>
</template>

<script setup lang="ts">
/**
 * 出金页面（代理端）
 * - 提交与列表通过 useWithdrawalManagement 串联；
 * - 详情与补件统一进入独立详情页处理。
 */
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

import type {
  WithdrawalListParams,
  WithdrawalOrder,
  WithdrawalOrderDetail,
} from '@/api/modules/withdrawal';
import AdminHero from '@/components/admin/AdminHero.vue';
import ApplyForm from './components/ApplyForm.vue';
import RecordList from './components/RecordList.vue';
import SupplementDialog from './components/SupplementDialog.vue';
import { useWithdrawalManagement } from './composables/useWithdrawalManagement';

const router = useRouter();
const {
  config,
  balance,
  configLoading,
  listLoading,
  list,
  total,
  page,
  limit,
  query,
  withdrawalSubmitting,
  withdrawalUploading,
  loadConfig,
  fetchList,
  resetQuery,
  setPage,
  submitWithdrawal,
  uploadWithdrawalFile,
  detail,
  fetchDetail,
  supplementSubmitting,
  supplementUploading,
  submitSupplement,
  uploadSupplementFile,
} = useWithdrawalManagement();
const applyFormRef = ref<InstanceType<typeof ApplyForm>>();
const supplementDialogVisible = ref(false);
const supplementItem = ref<WithdrawalOrder | null>(null);
const supplementRequirement = ref('');

async function handleSubmit(payload: {
  payer_whitelist_id: number;
  payee_whitelist_id: number;
      amount: string;
      file_ids: number[];
}) {
  try {
    const result = await submitWithdrawal({
      payer_whitelist_id: payload.payer_whitelist_id,
      payee_whitelist_id: payload.payee_whitelist_id,
      amount: payload.amount,
      file_ids: payload.file_ids,
    });
    ElMessage.success(`出金订单 ${result.order_no} 已提交，等待审核`);
    applyFormRef.value?.reset();
    await Promise.all([loadConfig(true), fetchList()]);
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

function openDetail(id: number) {
  void router.push({ name: 'WithdrawalDetail', params: { id } });
}

async function openSupplement(row: WithdrawalOrder) {
  if (row.status !== 1) return;
  supplementItem.value = row;
  supplementRequirement.value = '';
  supplementDialogVisible.value = true;
  try {
    await fetchDetail(row.id);
    supplementRequirement.value = extractSupplementRequirement(detail.value);
  } catch {
    supplementRequirement.value = '请按平台要求补充证明材料。';
  }
}

function extractSupplementRequirement(d: WithdrawalOrderDetail | null) {
  if (!d) return '请按平台要求补充证明材料。';
  if (d.review?.note) return d.review.note;
  const request = (d.records ?? []).find((record) => {
    return /要求|补充|补件|supplement/i.test(record.action_name);
  });
  return request?.message || '请按平台要求补充证明材料。';
}

async function handleSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!supplementItem.value) return;
  try {
    await submitSupplement({
      id: supplementItem.value.id,
      file_ids: payload.file_ids,
      message: payload.message,
    });
    ElMessage.success('补件已提交，订单将重新进入审核');
    supplementDialogVisible.value = false;
    supplementItem.value = null;
    await fetchList();
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

function onPage(value: number) {
  setPage(value);
  void fetchList();
}

function handleSearch() {
  setPage(1);
  void fetchList();
}

function handleQueryChange(patch: Partial<WithdrawalListParams>) {
  Object.assign(query, patch);
}

onMounted(async () => {
  await Promise.all([loadConfig(true), fetchList()]);
});
</script>

<style scoped lang="scss">
.withdrawal-page {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 22px;

  &__content {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
}

@include narrow {
  .withdrawal-page,
  .withdrawal-page__content {
    gap: 20px;
  }
}

@include mobile {
  .withdrawal-page,
  .withdrawal-page__content {
    gap: 16px;
  }
}
</style>
