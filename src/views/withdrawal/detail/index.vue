<template>
  <main v-loading="loading" class="wd-page">
    <button class="app-back-button wd-back" type="button" @click="router.push('/withdrawal')">
      <i class="ri-arrow-left-line" />{{ t('withdrawal.back') }}</button
    ><WithdrawalDetailContent
      v-if="detail"
      :detail="detail"
      :readonly="false"
      @supplement="openSupplement"
    /><el-empty v-else-if="!loading" :description="t('withdrawal.notFound')" /><SupplementDialog
      :key="String(route.params.id)"
      v-model="dialogVisible"
      :row="detail"
      :mode="mode"
      :loading="loading"
      :requirement="
        (mode === 'risk' ? detail?.risk?.risk_supplement_request : detail?.supplement_request) ||
        t('withdrawal.defaultSupplement')
      "
      :submitting="submitting"
      :upload-file="uploadFile"
      @submit="sendSupplement"
    />
  </main>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { useWithdrawalDetail } from '../composables/useWithdrawalDetail';
import { useWithdrawalSupplement } from '../composables/useWithdrawalSupplement';
import WithdrawalDetailContent from './components/WithdrawalDetailContent.vue';
import SupplementDialog from '../components/SupplementDialog.vue';
const route = useRoute(),
  router = useRouter();
const { t } = useI18n();
const { detail, loading, fetchDetail, clear } = useWithdrawalDetail();
const { submit, submitRisk, uploadFile, submitting } = useWithdrawalSupplement();
const mode = ref<'business' | 'risk'>('business');
const dialogVisible = ref(false);
function allowed(value: 'business' | 'risk') {
  return value === 'business'
    ? detail.value?.available_actions?.can_supplement_withdrawal === true
    : detail.value?.risk?.can_supplement_risk === true;
}
function openSupplement(value: 'business' | 'risk') {
  if (!allowed(value)) return;
  mode.value = value;
  dialogVisible.value = true;
}
async function reload() {
  try {
    await fetchDetail(Number(route.params.id));
  } catch {
    /* 请求层提示错误。 */
  }
}
async function sendSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!detail.value || submitting.value || !allowed(mode.value)) return;
  const id = detail.value.id;
  try {
    await (mode.value === 'risk' ? submitRisk : submit)({ id, ...payload });
    if (Number(route.params.id) === id) {
      dialogVisible.value = false;
      await reload();
    }
    ElMessage.success(t('withdrawal.supplemented'));
  } catch {
    if (Number(route.params.id) === id) await reload();
  }
}
watch(
  () => route.params.id,
  async (value) => {
    clear();
    dialogVisible.value = false;
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) return;
    await reload();
    if (route.query.action === 'supplement') openSupplement('business');
  },
  { immediate: true },
);
</script>
