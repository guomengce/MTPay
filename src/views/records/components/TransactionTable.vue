<template>
  <el-card class="transaction-table" shadow="never">
    <el-table :data="records" class="transaction-table__table">
      <el-table-column prop="time" label="时间" min-width="130" />
      <el-table-column label="类型" min-width="92">
        <template #default="{ row }">
          <el-tag :type="row.typeTag" round>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编号" min-width="170">
        <template #default="{ row }">
          <strong class="transaction-table__id">{{ row.id }}</strong>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="220" />
      <el-table-column label="金额" min-width="190">
        <template #default="{ row }">
          <span class="transaction-table__amount" :class="{ 'is-negative': row.negative }">
            {{ row.amount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="150">
        <template #default="{ row }">
          <el-tag :type="row.statusTag" round>
            <span class="transaction-table__dot"></span>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="详情" width="128" align="right">
        <template #default>
          <el-button plain>查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
const records = [
  {
    time: '08/03 15:08',
    type: '入金',
    typeTag: 'success',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amount: '待入账 12,000.00 USDC',
    status: '待审核',
    statusTag: 'warning',
    negative: false,
  },
  {
    time: '08/03 14:08',
    type: '出金',
    typeTag: '',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    status: '付款处理中',
    statusTag: '',
    negative: true,
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
    negative: false,
  },
  {
    time: '08/01 17:08',
    type: '兑换',
    typeTag: 'danger',
    id: 'EX-26073001',
    content: 'USDT → USD · 0.9900',
    amount: '10,000.00 USDT',
    status: '已完成',
    statusTag: 'success',
    negative: false,
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
    negative: true,
  },
];
</script>

<style scoped lang="scss">
.transaction-table {
  min-width: 0;
  overflow: hidden;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__body) {
    padding: 0;
  }

  &__table {
    width: 100%;

    :deep(th.el-table__cell) {
      height: 48px;
      color: #68788e;
      background: #f8fafc;
      font-size: 13px;
      font-weight: 850;
    }

    :deep(td.el-table__cell) {
      height: 64px;
      color: #071833;
      font-size: 15px;
      font-weight: 650;
    }
  }

  &__id,
  &__amount {
    color: #071833;
    font-weight: 850;
  }

  &__amount {
    &.is-negative {
      color: #0d1a32;
    }
  }

  &__dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 6px;
    background: currentColor;
    border-radius: 50%;
  }

  :deep(.el-tag) {
    border-color: transparent;
    font-weight: 850;
  }

  :deep(.el-button) {
    border-radius: 8px;
    color: #071833;
    font-weight: 850;
  }

  @include mobile {
    overflow-x: auto;

    &__table {
      min-width: 980px;
    }
  }
}
</style>
