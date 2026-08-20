<template>
  <main class="transaction-detail">
    <div class="transaction-detail__toolbar">
      <button class="transaction-detail__back" type="button" @click="goBack">
        <i class="ri-arrow-left-line" />返回交易记录
      </button>
      <span class="transaction-detail__notice">
        <i class="ri-information-line" />
        交易记录仅只读，补件、审核等操作请进入对应业务页面
      </span>
    </div>

    <div v-loading="loading" class="transaction-detail__content">
      <template v-if="info">
        <TransactionDetailSummary :transaction="info.transaction" />
        <TransactionDetailBusiness
          :business-type="info.transaction.business_type"
          :detail="info.detail"
        />
      </template>
      <el-empty v-else-if="!loading" description="未找到该交易记录" />
    </div>
  </main>
</template>

<script setup lang="ts">
/** 代理端统一交易详情（只读）。 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import * as TransactionApi from '@/api/modules/transaction';
import type { TransactionInfoResult } from '@/api/modules/transaction';
import TransactionDetailBusiness from '../components/TransactionDetailBusiness.vue';
import TransactionDetailSummary from '../components/TransactionDetailSummary.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const info = ref<TransactionInfoResult | null>(null);

function goBack() {
  void router.push('/records');
}

onMounted(async () => {
  const businessType = route.params.businessType as 'deposit' | 'exchange' | 'withdrawal';
  const businessId = Number(route.params.businessId);
  if (!businessType || !Number.isInteger(businessId) || businessId <= 0) return;
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
  padding: 24px 32px 40px;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__back {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 7px;
    padding: 0;
    border: 0;
    color: #5d7087;
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 13px;

    &:hover {
      color: #0b9b92;
    }
  }

  &__notice {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #7b8b9f;
    font-size: 12px;

    i {
      color: #15998f;
      font-size: 15px;
    }
  }

  &__content {
    display: grid;
    min-height: 300px;
    align-content: start;
    gap: 18px;
  }

  @include narrow {
    padding: 18px 20px 32px;
  }

  @include mobile {
    padding: 16px 0 28px;

    &__toolbar {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
