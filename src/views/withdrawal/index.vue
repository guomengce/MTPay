<template>
  <section class="withdrawal-page">
    <AdminHero
      title="USD出金"
      description="付/收款人需为已添加的白名单，并按要求上传合同与 Invoice"
      icon="ri-bank-card-2-line"
    >
    </AdminHero>

    <BalanceCard />

    <div class="withdrawal-page__apply">
      <ApplyForm />
      <SummaryCard />
    </div>

    <RecordList />
  </section>
</template>

<script setup lang="ts">
import AdminHero from '@/components/admin/AdminHero.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import ApplyForm from './components/ApplyForm.vue';
import BalanceCard from './components/BalanceCard.vue';
import RecordList from './components/RecordList.vue';
import SummaryCard from './components/SummaryCard.vue';
</script>

<style scoped lang="scss">
.withdrawal-page {
  display: grid;
  min-width: 0;
  gap: 18px;

  &__apply {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 0;
    padding: 26px 28px;
    background: #ffffff;
    border: 1px solid #dfe7ef;
    border-radius: 14px;
    box-shadow: 0 14px 36px rgb(16 30 54 / 6%);
  }

  @include narrow {
    &__apply {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  @include mobile {
    gap: 14px;

    &__apply {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 20px 18px;
    }
  }
}
</style>
