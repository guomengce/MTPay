<template>
  <main class="withdrawal-page">
    <AdminHero :title="t('withdrawal.title')" icon="ri-hand-coin-line" />

    <section class="withdrawal-page__content">
      <section v-if="twoFactorEnabled === false" class="withdrawal-security-gate" role="alert">
        <span class="withdrawal-security-gate__icon"><i class="ri-shield-keyhole-line" /></span>
        <div class="withdrawal-security-gate__copy">
          <strong>{{ t('withdrawal.twoFactorRequiredTitle') }}</strong>
          <p>{{ t('withdrawal.twoFactorRequiredDescription') }}</p>
        </div>
        <el-button type="danger" plain @click="openSecuritySettings">
          {{ t('withdrawal.enableTwoFactor') }}
          <i class="ri-arrow-right-line" />
        </el-button>
      </section>
      <el-alert
        v-if="securityError && !securityDialogVisible"
        :title="securityError"
        type="error"
        :closable="false"
      />
      <ApplyForm
        ref="applyFormRef"
        :currency-options="currencyOptions"
        :payers="config?.payers"
        :payees="config?.payees"
        :file-rules="config?.file_rules"
        :config-loading="configLoading"
        :submitting="securityBusy"
        :locked="securityLocked || twoFactorEnabled !== true"
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
        @risk-supplement="openRiskSupplement"
      />
    </section>

    <SupplementDialog
      v-model="supplementDialogVisible"
      :row="supplementItem"
      :requirement="supplementRequirement"
      :submitting="supplementSubmitting"
      :uploading="supplementUploading"
      :upload-file="uploadSupplementFile"
      :mode="supplementMode"
      @submit="handleSupplement"
    />
    <WithdrawalSecurityDialog
      :model-value="securityDialogVisible"
      :busy="securityBusy"
      :email="securityEmail"
      :email-verified="emailVerified"
      :two-factor-verified="twoFactorVerified"
      :expired="securityExpired"
      :uncertain="securityUncertain"
      :error="securityError"
      :resend-seconds="resendSeconds"
      :ready="securityReady"
      @close="closeSecurity"
      @send-email-code="sendEmail"
      @verify="verifySecurity"
      @confirm="submitSecurity"
    />
  </main>
</template>

<script setup lang="ts">
/**
 * 法币出金页面（代理端）
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
import { getTwoFactorStatus } from '@/api/modules/twoFactor';
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
  submitRiskSupplement,
  uploadSupplementFile,
} = useWithdrawalManagement();
usePageLoading(configLoading);
const applyFormRef = ref<InstanceType<typeof ApplyForm>>();
const supplementDialogVisible = ref(false);
const supplementItem = ref<WithdrawalOrder | null>(null);
const supplementRequirement = ref('');
const supplementMode = ref<'business' | 'risk'>('business');
const twoFactorEnabled = ref<boolean | null>(null);
const {
  visible: securityDialogVisible,
  busy: securityBusy,
  locked: securityLocked,
  email: securityEmail,
  emailVerified,
  twoFactorVerified,
  expired: securityExpired,
  uncertain: securityUncertain,
  error: securityError,
  resendSeconds,
  ready: securityReady,
  begin: beginSecurity,
  sendEmail,
  verify: verifySecurity,
  close: closeSecurity,
  submit: submitSecurity,
} = useWithdrawalSecurity({
  refresh: async () => {
    await Promise.all([loadConfig(true), fetchList()]);
  },
  completed: async () => {
    applyFormRef.value?.reset();
    ElMessage.success(t('withdrawalSecurity.submitted'));
    await Promise.all([loadConfig(true), fetchList()]);
  },
});

function handleSubmit(payload: Parameters<typeof beginSecurity>[0]) {
  if (twoFactorEnabled.value !== true) return;
  beginSecurity(payload);
}

function openSecuritySettings() {
  void router.push({ name: 'Account', hash: '#two-factor-settings' });
}

function openDetail(id: number) {
  void router.push({ name: 'WithdrawalDetail', params: { id } });
}

onBeforeRouteLeave(async () => {
  if (securityBusy.value) return false;
  if (securityDialogVisible.value) await closeSecurity();
  return !securityDialogVisible.value;
});

async function openSupplement(row: WithdrawalOrder) {
  if (!row.available_actions?.can_supplement_withdrawal) return;
  supplementItem.value = row;
  supplementMode.value = 'business';
  supplementRequirement.value = '';
  supplementDialogVisible.value = true;
  try {
    await fetchDetail(row.id);
    supplementRequirement.value = extractSupplementRequirement(detail.value);
  } catch {
    supplementRequirement.value = t('withdrawal.defaultSupplement');
  }
}

function openRiskSupplement(row: WithdrawalOrder) {
  if (row.risk?.can_supplement_risk !== true) return;
  supplementItem.value = row;
  supplementMode.value = 'risk';
  supplementRequirement.value =
    row.risk?.risk_supplement_request || t('withdrawal.defaultSupplement');
  supplementDialogVisible.value = true;
}

function extractSupplementRequirement(d: WithdrawalOrderDetail | null) {
  if (!d) return t('withdrawal.defaultSupplement');
  return d.supplement_request || t('withdrawal.defaultSupplement');
}

async function handleSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!supplementItem.value) return;
  try {
    const submit = supplementMode.value === 'risk' ? submitRiskSupplement : submitSupplement;
    await submit({
      id: supplementItem.value.id,
      file_ids: payload.file_ids,
      message: payload.message,
    });
    ElMessage.success(
      t(
        'withdrawal.supplemented',
      ),
    );
    supplementDialogVisible.value = false;
    supplementItem.value = null;
    await fetchList();
  } catch {
    /* 狀態可能已變更，立即同步最新列表。 */
    await fetchList();
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
  const statusPromise = getTwoFactorStatus()
    .then((enabled) => {
      twoFactorEnabled.value = enabled;
    })
    .catch(() => {
      twoFactorEnabled.value = false;
    });
  await Promise.all([loadConfig(true), fetchList(), statusPromise]);
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

.withdrawal-security-gate {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 17px 20px;
  border: 1px solid #f3b8bd;
  border-left: 4px solid #dc3d51;
  border-radius: 15px;
  background: linear-gradient(105deg, #fff3f4 0%, #fff 72%);
  box-shadow: 0 10px 28px rgb(190 48 66 / 8%);

  &__icon {
    display: grid;
    width: 46px;
    height: 46px;
    place-items: center;
    border-radius: 13px;
    color: #fff;
    background: linear-gradient(135deg, #f06474, #c92e43);
    font-size: 22px;
    box-shadow: 0 8px 18px rgb(201 46 67 / 20%);
  }

  &__copy {
    min-width: 0;
  }
  strong {
    color: #a92134;
    font-size: 15px;
  }
  p {
    margin: 5px 0 0;
    color: #83535a;
    font-size: 13px;
    line-height: 1.55;
  }
  .el-button {
    margin: 0;
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

  .withdrawal-security-gate {
    grid-template-columns: 42px minmax(0, 1fr);
    padding: 15px;
    &__icon {
      width: 40px;
      height: 40px;
      border-radius: 11px;
    }
    .el-button {
      grid-column: 1 / -1;
      width: 100%;
    }
  }
}
</style>
