<template>
  <main class="transaction-detail">
    <el-button class="app-back-button" plain :icon="Back" @click="goBack">
      {{ t('records.back') }}
    </el-button>
    <div v-loading="loading" class="transaction-detail__content">
      <ManualAdjustmentDetail
        v-if="manualDetail && info"
        :transaction="info.transaction"
        :detail="manualDetail"
      />
      <el-empty
        v-else-if="!loading"
        :description="invalid ? t('records.invalid') : t('records.notFound')"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Back } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { usePageLoading } from '@/composables/usePageLoading';
import * as TransactionApi from '@/api/modules/transaction';
import type {
  ManualBalanceAdjustmentDetail,
  TransactionInfoResult,
} from '@/api/modules/transaction';
import ManualAdjustmentDetail from './ManualAdjustmentDetail.vue';

type ManualBusinessType = 'manual_increase' | 'manual_decrease';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const loading = ref(false);
const invalid = ref(false);
const info = ref<TransactionInfoResult | null>(null);

usePageLoading(loading);

const manualDetail = computed(() => {
  if (!info.value) return null;
  const businessType = info.value.transaction.business_type;
  return businessType === 'manual_increase' || businessType === 'manual_decrease'
    ? (info.value.detail as ManualBalanceAdjustmentDetail)
    : null;
});

function isManualBusinessType(value: unknown): value is ManualBusinessType {
  return value === 'manual_increase' || value === 'manual_decrease';
}

function goBack() {
  void router.push('/records');
}

onMounted(async () => {
  const businessType = route.params.businessType;
  const businessId = Number(route.params.businessId);
  if (!isManualBusinessType(businessType) || !Number.isInteger(businessId) || businessId <= 0) {
    invalid.value = true;
    return;
  }

  loading.value = true;
  try {
    info.value = await TransactionApi.fetchTransactionInfo({
      business_type: businessType,
      business_id: businessId,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.transaction-detail {
  display: grid;
  min-width: 0;
  gap: 18px;
  padding: 20px;
}

.transaction-detail > .el-button {
  width: fit-content;
}

.transaction-detail__content {
  min-width: 0;
  min-height: 300px;
}

@include mobile {
  .transaction-detail {
    padding: 0;
    gap: 14px;
  }
}
</style>
