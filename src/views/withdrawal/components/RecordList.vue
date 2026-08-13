<template>
  <el-card class="record-list" shadow="never">
    <template #header>
      <div class="record-list__header">
        <strong>最近出金记录</strong>
      </div>
    </template>

    <el-table :data="records" class="record-list__table">
      <el-table-column prop="id" label="编号" min-width="140" />
      <el-table-column prop="payer" label="付款人" min-width="200" />
      <el-table-column prop="payee" label="收款人" min-width="200" />
      <el-table-column prop="amount" label="出金金额" min-width="140" />
      <el-table-column prop="total" label="总扣款" min-width="140" />
      <el-table-column label="状态" min-width="140">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status"
            :type="row.statusBadge"
            :effect="isPending(row.status) ? 'pending' : undefined"
          />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间" min-width="150" />
      <el-table-column label="" width="60" align="right">
        <template #default>
          <el-button plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="record-list__more">
      <button type="button" class="record-list__more-btn">
        查看全部出金记录
        <el-icon><ArrowRight /></el-icon>
      </button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';

import StatusBadge, {
  type StatusBadgeType,
} from '@/components/admin/StatusBadge.vue';

interface RecordItem {
  id: string;
  payer: string;
  payee: string;
  amount: string;
  total: string;
  status: string;
  statusBadge: StatusBadgeType;
  time: string;
}

const records: RecordItem[] = [
  {
    id: 'WD-26073001',
    payer: 'Harbor Trade Pte. Ltd.',
    payee: 'Northstar Supplies LLC',
    amount: '5,000.00 USD',
    total: '5,050.00 USD',
    status: '审核处理中',
    statusBadge: 'primary',
    time: '2026/08/03 14:08',
  },
  {
    id: 'WD-26072932',
    payer: 'Harbor Trade Pte. Ltd.',
    payee: 'Harbor Trade Pte. Ltd.',
    amount: '10,000.00 USD',
    total: '10,050.00 USD',
    status: '已完成',
    statusBadge: 'success',
    time: '2026/08/01 10:22',
  },
];

function isPending(status: string) {
  return /待审核|处理中|待处理/.test(status);
}
</script>

<style scoped lang="scss">
.record-list {
  min-width: 0;
  overflow: hidden;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 14px 36px rgb(16 30 54 / 6%);

  :deep(.el-card__header) {
    padding: 18px 24px;
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    strong {
      color: #0c2a5a;
      font-size: 18px;
      font-weight: 800;
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

  &__more {
    display: flex;
    justify-content: center;
    padding: 16px 24px 22px;
  }

  &__more-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    background: transparent;
    border: 0;
    color: #2878ff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: color 0.2s;

    .el-icon {
      font-size: 14px;
    }

    &:hover {
      color: #1d8db5;
    }
  }

  :deep(.el-button) {
    border-radius: 8px;
    font-weight: 800;
  }

  @include mobile {
    overflow-x: auto;

    &__table {
      min-width: 980px;
    }
  }
}
</style>
