<template>
  <section class="withdrawal-page">
    <WithdrawalReminder />
    <el-card class="withdrawal-page__apply" shadow="never">
      <template #header>
        <div class="withdrawal-page__header">
          <h2>建立出金申请</h2>
          <el-tag round>
            <span></span>
            USD
          </el-tag>
        </div>
      </template>
      <div class="withdrawal-page__body">
        <WithdrawalForm />
        <WithdrawalSummary />
      </div>
    </el-card>
    <WithdrawalTable />
  </section>
</template>

<script setup lang="ts">
import WithdrawalForm from './components/WithdrawalForm.vue';
import WithdrawalReminder from './components/WithdrawalReminder.vue';
import WithdrawalSummary from './components/WithdrawalSummary.vue';
import WithdrawalTable from './components/WithdrawalTable.vue';
</script>

<style scoped lang="scss">
.withdrawal-page {
  display: grid;
  min-width: 0;
  gap: 20px;
  padding: 34px 36px 32px;

  &__apply {
    overflow: hidden;
    border-color: #dfe7ef;
    border-radius: 14px;
    box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

    :deep(.el-card__header) {
      padding: 22px 28px;
    }

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    h2 {
      margin: 0;
      color: #071833;
      font-size: 24px;
      font-weight: 850;
      letter-spacing: 0;
    }

    :deep(.el-tag) {
      color: #076f68;
      background: #eefbf8;
      border-color: transparent;
      font-weight: 850;
    }

    span {
      display: inline-block;
      width: 7px;
      height: 7px;
      margin-right: 6px;
      background: #10aa9b;
      border-radius: 50%;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: minmax(460px, 1.15fr) minmax(360px, 1fr);
    gap: 34px;
    padding: 18px 28px 28px;
  }

  @include narrow {
    padding: 28px 24px;

    &__body {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    gap: 16px;
    padding: 20px 14px;

    &__apply {
      :deep(.el-card__header) {
        padding: 18px;
      }
    }

    &__body {
      grid-template-columns: 1fr;
      gap: 18px;
      padding: 18px;
    }
  }
}
</style>
