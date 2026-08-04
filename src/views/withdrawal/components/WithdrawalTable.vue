<template>
  <el-card class="withdrawal-table" shadow="never">
    <template #header>
      <div class="withdrawal-table__header">
        <h2>出金记录</h2>
        <span>可查看审核及付款时间线</span>
      </div>
    </template>

    <el-table :data="records" class="withdrawal-table__table">
      <el-table-column label="编号" min-width="180">
        <template #default="{ row }">
          <div class="withdrawal-table__id">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="付款关系" min-width="360">
        <template #default="{ row }">
          <div class="withdrawal-table__relation">
            <strong>{{ row.relation }}</strong>
            <span>{{ row.detail }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="receive" label="收款" min-width="160" />
      <el-table-column prop="total" label="费用 / 总扣款" min-width="190" />
      <el-table-column label="状态" min-width="140">
        <template #default="{ row }">
          <el-tag round>
            <span class="withdrawal-table__status-dot"></span>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="right">
        <template #default>
          <el-button plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
const records = [
  {
    id: 'WD-26073001',
    time: '08/03 14:08',
    relation: 'B→B',
    detail: 'Harbor Trade Pte. Ltd. → Northstar Supplies LLC',
    receive: '5,000.00 USD',
    total: '50.00／5,050.00 USD',
    status: '付款处理中',
  },
];
</script>

<style scoped lang="scss">
.withdrawal-table {
  min-width: 0;
  overflow: hidden;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__header) {
    padding: 18px 28px;
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    h2 {
      margin: 0;
      color: #071833;
      font-size: 22px;
      font-weight: 850;
      letter-spacing: 0;
    }

    span {
      color: #3569ad;
      font-weight: 650;
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

  &__id,
  &__relation {
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

  &__status-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 6px;
    background: #3178f6;
    border-radius: 50%;
  }

  :deep(.el-tag) {
    color: #1767ff;
    background: #edf4ff;
    border-color: transparent;
    font-weight: 850;
  }

  :deep(.el-button) {
    border-radius: 8px;
    font-weight: 850;
  }

  @include mobile {
    overflow-x: auto;

    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__table {
      min-width: 980px;
    }
  }
}
</style>
