<template>
  <main class="withdrawal-page">
    <AdminHero
      :title="t('withdrawal.title')"
      icon="ri-bank-card-line"
    />

    <section class="withdrawal-page__content">
      <el-alert v-if="securityError && !securityDialogVisible" :title="securityError" type="error" :closable="false" />
      <ApplyForm
        ref="applyFormRef"
        :currency-options="currencyOptions"
        :payers="config?.payers"
        :payees="config?.payees"
        :file-rules="config?.file_rules"
        :config-loading="configLoading"
        :submitting="securityBusy"
        :locked="securityLocked"
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
    <WithdrawalSecurityDialog
      :model-value="securityDialogVisible" :busy="securityBusy" :email="securityEmail"
      :email-verified="emailVerified" :two-factor-verified="twoFactorVerified"
      :expired="securityExpired" :uncertain="securityUncertain" :error="securityError"
      :resend-seconds="resendSeconds" :ready="securityReady"
      @close="closeSecurity" @send-email-code="sendEmail" @verify="verifySecurity" @confirm="submitSecurity"
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
import { useI18n } from 'vue-i18n';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

import type {
  WithdrawalListParams,
  WithdrawalOrder,
  WithdrawalOrderDetail,
} from '@/api/modules/withdrawal';
import AdminHero from '@/components/admin/AdminHero.vue';
import { usePageLoading } from '@/composables/usePageLoading';
import ApplyForm from './components/ApplyForm.vue';
import RecordList from './components/RecordList.vue';
import SupplementDialog from './components/SupplementDialog.vue';
import WithdrawalSecurityDialog from './components/WithdrawalSecurityDialog.vue';
import { useWithdrawalManagement } from './composables/useWithdrawalManagement';
import { useWithdrawalSecurity } from './composables/useWithdrawalSecurity';

const router = useRouter();
const {
  config,
  currencyOptions,
  configLoading,
  listLoading,
  list,
  total,
  page,
  limit,
  query,
  withdrawalUploading,
  loadConfig,
  fetchList,
  resetQuery,
  setPage,
  uploadWithdrawalFile,
  detail,
  fetchDetail,
  supplementSubmitting,
  supplementUploading,
  submitSupplement,
  uploadSupplementFile,
} = useWithdrawalManagement();
usePageLoading(configLoading);
const applyFormRef = ref<InstanceType<typeof ApplyForm>>();
const supplementDialogVisible = ref(false);
const supplementItem = ref<WithdrawalOrder | null>(null);
const supplementRequirement = ref('');
const {
  visible: securityDialogVisible, busy: securityBusy, locked: securityLocked, email: securityEmail,
  emailVerified, twoFactorVerified, expired: securityExpired, uncertain: securityUncertain,
  error: securityError, resendSeconds, ready: securityReady,
  begin: handleSubmit, sendEmail, verify: verifySecurity, close: closeSecurity, submit: submitSecurity,
} = useWithdrawalSecurity({
  fee: (currencyId) => currencyOptions.value.find((item) => item.currency.id === currencyId)?.fee_amount,
  refresh: async () => { await Promise.all([loadConfig(true), fetchList()]); },
  completed: async () => {
    applyFormRef.value?.reset();
    ElMessage.success(t('withdrawalSecurity.submitted'));
    await Promise.all([loadConfig(true), fetchList()]);
  },
});

function openDetail(id: number) {
  void router.push({ name: 'WithdrawalDetail', params: { id } });
}

onBeforeRouteLeave(async () => {
  if (securityBusy.value) return false;
  if (securityDialogVisible.value) await closeSecurity();
  return !securityDialogVisible.value;
});

async function openSupplement(row: WithdrawalOrder) {
  if (row.status !== 1) return;
  supplementItem.value = row;
  supplementRequirement.value = '';
  supplementDialogVisible.value = true;
  try {
    await fetchDetail(row.id);
    supplementRequirement.value = extractSupplementRequirement(detail.value);
  } catch {
    supplementRequirement.value = t('withdrawal.defaultSupplement');
  }
}

function extractSupplementRequirement(d: WithdrawalOrderDetail | null) {
  if (!d) return t('withdrawal.defaultSupplement');
  if (d.review?.note) return d.review.note;
  const request = (d.records ?? []).find((record) => {
    return /要求|补充|补件|supplement/i.test(record.action_name);
  });
  return request?.message || t('withdrawal.defaultSupplement');
}

async function handleSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!supplementItem.value) return;
  try {
    await submitSupplement({
      id: supplementItem.value.id,
      file_ids: payload.file_ids,
      message: payload.message,
    });
    ElMessage.success(t('withdrawal.supplemented'));
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
const { t } = useI18n();
</script>

<style scoped lang="scss">
.withdrawal-page {
  display: flex;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  flex-direction: column;
  gap: 22px;

  &__content {
    width: 100%;
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
