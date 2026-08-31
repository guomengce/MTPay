<template>
  <section class="transactions-card">
    <header class="transactions-card__header">
      <h2>{{ t('dashboard.recent') }}</h2>
      <RouterLink class="transactions-card__all" to="/records">
        {{ t('dashboard.viewAll') }} <i class="ri-arrow-right-s-line" />
      </RouterLink>
    </header>

    <TransactionTable :data="transactions" @view="openDetail" />
    <TransactionCardList :data="transactions" @view="openDetail" />
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { TransactionItem } from '@/api/modules/transaction';
import TransactionTable from '@/views/records/components/TransactionTable.vue';
import TransactionCardList from '@/views/records/components/TransactionCardList.vue';
defineProps<{ transactions: TransactionItem[] }>();
const router=useRouter();
const { t }=useI18n();
function openDetail(row:TransactionItem){if(row.detail_type==='fiat_deposit'){void router.push({name:'FiatDepositDetail',params:{id:row.detail_id}});return}void router.push({name:'TransactionDetail',params:{businessType:row.detail_type,businessId:row.detail_id}})}
</script>

<style scoped lang="scss">
.transactions-card {
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 22px;
    border-bottom: 1px solid #e2e9f2;
  }
  h2 {
    margin: 0;
    color: #0d1a32;
    font-size: 19px;
    font-weight: 800;
  }
  &__all {
    display: flex;
    align-items: center;
    color: #2878ff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }
  &__all i {
    font-size: 20px;
  }
  @include mobile {
    &__header { padding: 16px; }
  }
}
</style>
