<template>
  <el-card class="transactions-card" shadow="never">
    <template #header>
      <div class="transactions-card__header">
        <strong>近期交易</strong>
        <el-button text type="primary"
          >查看全部 <el-icon><ArrowRight /></el-icon
        ></el-button>
      </div>
    </template>

    <el-table :data="transactions" class="transactions-card__table">
      <el-table-column prop="time" label="時間" min-width="104" />
      <el-table-column label="類型" min-width="76">
        <template #default="{ row }">
          <el-tag :type="row.typeTag" round>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="編號" min-width="136" />
      <el-table-column prop="content" label="內容" min-width="150" />
      <el-table-column prop="amount" label="金額" min-width="150" />
      <el-table-column label="狀態" min-width="104">
        <template #default="{ row }">
          <el-tag :type="row.statusTag" round>{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="transactions-card__footer">
      <span>顯示 1 - 5 / 25 筆</span>
      <el-pagination layout="prev, pager, next" :total="25" :page-size="5" small />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';

const transactions = [
  {
    time: '08/03 15:08',
    type: '入金',
    typeTag: 'success',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amount: '待入帳 12,000.00 USDC',
    status: '處理中',
    statusTag: 'warning',
  },
  {
    time: '08/03 14:08',
    type: '出金',
    typeTag: '',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    status: '處理中',
    statusTag: '',
  },
  {
    time: '08/02 17:08',
    type: '入金',
    typeTag: 'success',
    id: 'DEP-26073001',
    content: 'USDT · TRC20',
    amount: '+50,000.00 USDT',
    status: '已完成',
    statusTag: 'success',
  },
  {
    time: '08/01 17:08',
    type: '兌換',
    typeTag: 'danger',
    id: 'EX-26073001',
    content: 'USDT → USD · 0.9900',
    amount: '10,000.00 USDT',
    status: '已完成',
    statusTag: 'success',
  },
  {
    time: '07/31 17:08',
    type: '出金',
    typeTag: '',
    id: 'WD-26072908',
    content: 'USD · C→C',
    amount: '-12,550.00 USD',
    status: '已完成',
    statusTag: 'success',
  },
];
</script>

<style scoped lang="scss">
.transactions-card {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(16 30 54 / 6%);

  :deep(.el-card__header) {
    padding: 18px 22px;
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    strong {
      color: #0d1a32;
      font-size: 18px;
      font-weight: 850;
    }
  }

  &__table {
    width: 100%;

    :deep(th.el-table__cell) {
      color: #78879a;
      background: #f8fafc;
      font-size: 12px;
      font-weight: 800;
    }

    :deep(td.el-table__cell) {
      color: #18243a;
      font-weight: 650;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 18px;
    color: #6b7a90;
    border-top: 1px solid #edf1f5;
  }

  @include mobile {
    overflow-x: auto;

    &__table {
      min-width: 760px;
    }

    &__footer {
      min-width: 760px;
    }
  }
}
</style>
