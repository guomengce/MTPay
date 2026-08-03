<template>
  <el-card class="exchange-table" shadow="never">
    <template #header>
      <div class="exchange-table__header">
        <div class="exchange-table__title">
          <span></span>
          <strong>兑换记录</strong>
        </div>
        <p>
          可查看冻结、审核及记账时间
          <el-icon><InfoFilled /></el-icon>
        </p>
      </div>
    </template>

    <el-table :data="records" class="exchange-table__table">
      <el-table-column label="编号" min-width="180">
        <template #default="{ row }">
          <div class="exchange-table__id">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="asset" label="支付资产" min-width="180" />
      <el-table-column prop="rate" label="比例" min-width="120" />
      <el-table-column label="获得USD" min-width="180">
        <template #default="{ row }">
          <strong class="exchange-table__amount">{{ row.usd }}</strong>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="130">
        <template #default="{ row }">
          <el-tag type="success" round>
            <span class="exchange-table__status-dot"></span>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="right">
        <template #default>
          <el-button plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue';

const records = [
  {
    id: 'EX-26073001',
    time: '08/01 17:08',
    asset: '10,000.00 USDT',
    rate: '0.9900',
    usd: '9,900.00 USD',
    status: '已完成',
  },
];
</script>

<style scoped lang="scss">
.exchange-table {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__header) {
    padding: 20px 28px;
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  &__header,
  &__title,
  &__header p {
    display: flex;
    align-items: center;
  }

  &__header {
    justify-content: space-between;
    gap: 16px;

    p {
      gap: 6px;
      margin: 0;
      color: #6b7a90;
      font-weight: 650;
    }
  }

  &__title {
    gap: 10px;

    span {
      width: 4px;
      height: 24px;
      background: #10aa9b;
      border-radius: 999px;
    }

    strong {
      color: #071833;
      font-size: 22px;
      font-weight: 850;
    }
  }

  &__table {
    width: 100%;

    :deep(th.el-table__cell) {
      color: #68788e;
      background: #f8fafc;
      font-size: 13px;
      font-weight: 800;
    }

    :deep(td.el-table__cell) {
      color: #14223a;
      font-weight: 650;
    }
  }

  &__id {
    display: grid;
    gap: 6px;

    strong {
      color: #071833;
      font-size: 16px;
      font-weight: 850;
    }

    span {
      color: #748297;
      font-size: 13px;
      font-weight: 650;
    }
  }

  &__amount {
    color: #071833;
    font-size: 17px;
    font-weight: 850;
  }

  &__status-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 6px;
    background: #0aa39a;
    border-radius: 50%;
  }

  :deep(.el-button) {
    border-radius: 8px;
    font-weight: 800;
  }

  @include mobile {
    overflow-x: auto;

    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__table {
      min-width: 820px;
    }
  }
}
</style>
