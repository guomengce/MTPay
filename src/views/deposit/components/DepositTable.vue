<template>
  <el-card class="deposit-table" shadow="never">
    <template #header>
      <div class="deposit-table__header">
        <strong>入金记录</strong>
        <span>可查看提交、审核及入账时间线</span>
      </div>
    </template>

    <el-table :data="records" class="deposit-table__table">
      <el-table-column label="编号" min-width="170">
        <template #default="{ row }">
          <div class="deposit-table__id">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="资产 / 网络" min-width="150">
        <template #default="{ row }">
          <div class="deposit-table__asset">
            <strong>{{ row.asset }}</strong>
            <span>{{ row.network }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="txId" label="交易哈希" min-width="220" />
      <el-table-column prop="amount" label="申请金额" min-width="160" />
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <el-tag type="warning" round>
            <span class="deposit-table__status-dot"></span>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="right">
        <template #default="{ row }">
          <el-button plain @click="goDetail(row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const records = [
  {
    id: 'DEP-26073002',
    time: '08/03 15:08',
    asset: 'USDC',
    network: 'ERC20',
    txId: '0x98aefd33···1e72f0',
    amount: '12,000.00 USDC',
    status: '待审核',
  },
];

function goDetail(id: string) {
  router.push({ name: 'DepositDetail', params: { id } }).catch(() => undefined);
}
</script>

<style scoped lang="scss">
.deposit-table {
  min-width: 0;
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

    strong {
      color: #071833;
      font-size: 20px;
      font-weight: 850;
    }

    span {
      color: #748297;
      font-size: 14px;
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
  &__asset {
    display: grid;
    gap: 6px;

    strong {
      color: #071833;
      font-size: 15px;
      font-weight: 850;
    }

    span {
      color: #748297;
      font-size: 12px;
      font-weight: 650;
    }
  }

  &__status-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 6px;
    background: #d88c00;
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
      min-width: 860px;
    }
  }
}
</style>
