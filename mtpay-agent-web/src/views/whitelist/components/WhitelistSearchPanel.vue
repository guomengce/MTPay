<template>
  <el-card class="whitelist-search" shadow="never">
    <el-form :model="filters" label-position="top">
      <el-form-item class="whitelist-search__keyword" label="搜索白名单">
        <el-input
          v-model="filters.keyword"
          size="large"
          placeholder="名称 / 银行账号 / 白名单编号"
          :suffix-icon="Search"
        />
      </el-form-item>

      <div class="whitelist-search__filters">
        <el-form-item label="角色">
          <el-select v-model="filters.role" size="large">
            <el-option label="全部角色" value="all" />
            <el-option label="付款人" value="payer" />
            <el-option label="收款人" value="payee" />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="filters.type" size="large">
            <el-option label="全部类型" value="all" />
            <el-option label="个人" value="person" />
            <el-option label="企业" value="company" />
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="filters.status" size="large">
            <el-option label="全部状态" value="all" />
            <el-option label="已批准" value="approved" />
            <el-option label="待审核" value="pending" />
          </el-select>
        </el-form-item>

        <div class="whitelist-search__actions">
          <el-button :icon="RefreshLeft" size="large" plain>重置</el-button>
          <el-button :icon="Search" size="large" type="primary">查询</el-button>
        </div>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';

const filters = reactive({
  keyword: '',
  role: 'all',
  type: 'all',
  status: 'all',
});
</script>

<style scoped lang="scss">
.whitelist-search {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__body) {
    padding: 24px 28px 28px;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    color: #071833;
    font-size: 15px;
    font-weight: 850;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 48px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #cbd8e8 inset;
  }

  &__keyword {
    max-width: 860px;
    margin-bottom: 22px !important;
  }

  &__filters {
    display: grid;
    grid-template-columns: repeat(3, minmax(160px, 260px)) minmax(220px, 1fr);
    gap: 22px;
    align-items: end;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    :deep(.el-button) {
      min-width: 106px;
      height: 48px;
      border-radius: 8px;
      font-weight: 850;
    }

    :deep(.el-button--primary) {
      border: 0;
      background: #09aa98;
    }
  }

  @include narrow {
    &__filters {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__actions {
      justify-content: flex-start;
    }
  }

  @include mobile {
    :deep(.el-card__body) {
      padding: 18px;
    }

    &__filters {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &__actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  }
}
</style>
