<template>
  <section class="whitelist-result">
    <div class="whitelist-result__toolbar">
      <div class="whitelist-result__title">
        <h2>白名单列表</h2>
        <span>共 {{ whitelistItems.length }} 条</span>
      </div>

      <div class="whitelist-result__actions">
        <el-radio-group v-model="viewMode" class="whitelist-result__mode">
          <el-radio-button value="card">
            <el-icon><Grid /></el-icon>
          </el-radio-button>
          <el-radio-button value="table">
            <el-icon><List /></el-icon>
          </el-radio-button>
        </el-radio-group>

        <el-select v-model="sortValue" class="whitelist-result__sort" size="large">
          <el-option label="默认排序" value="default" />
          <el-option label="最新提交" value="latest" />
          <el-option label="优先待审" value="pending" />
        </el-select>
      </div>
    </div>

    <div v-if="viewMode === 'card'" class="whitelist-result__grid">
      <WhitelistCard v-for="item in whitelistItems" :key="item.id" :item="item" />
    </div>

    <el-card v-else class="whitelist-result__table-card" shadow="never">
      <WhitelistTable :items="whitelistItems" />
    </el-card>

    <div class="whitelist-result__pagination">
      <span>共 {{ whitelistItems.length }} 条</span>
      <el-pagination
        layout="prev, pager, next"
        :total="whitelistItems.length"
        :page-size="10"
        small
      />
      <el-select v-model="pageSize" size="large">
        <el-option label="10 条/页" :value="10" />
        <el-option label="20 条/页" :value="20" />
      </el-select>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Grid, List } from '@element-plus/icons-vue';

import WhitelistCard, { type WhitelistItem } from './WhitelistCard.vue';
import WhitelistTable from './WhitelistTable.vue';

const viewMode = ref<'card' | 'table'>('card');
const sortValue = ref('default');
const pageSize = ref(10);

const whitelistItems: WhitelistItem[] = [
  {
    id: 'WL-1005',
    avatar: 'B',
    name: 'Atlas Commerce GmbH',
    role: '收款人',
    type: '企业',
    region: 'Germany',
    status: '待审核',
    statusType: 'warning',
    tags: ['Deutsche Bank', 'DE8937040044053206194', 'WL-1005'],
  },
  {
    id: 'WL-1004',
    avatar: 'C',
    name: 'Olivia Brown',
    role: '收款人',
    type: '个人',
    region: 'United Kingdom',
    status: '已批准',
    statusType: 'success',
    tags: ['Barclays', 'GB29NWBK601613319501', 'WL-1004'],
  },
  {
    id: 'WL-1003',
    avatar: 'B',
    name: 'Northstar Supplies LLC',
    role: '收款人',
    type: '企业',
    region: 'United States',
    status: '已批准',
    statusType: 'success',
    tags: ['JPMorgan Chase', '4839001388', 'WL-1003'],
  },
  {
    id: 'WL-1002',
    avatar: 'C',
    name: 'Michael Chen',
    role: '付款人',
    type: '个人',
    region: 'Hong Kong',
    status: '已批准',
    statusType: 'success',
    tags: ['Passport', 'K12345678', 'WL-1002'],
  },
  {
    id: 'WL-1001',
    avatar: 'B',
    name: 'Harbor Trade Pte. Ltd.',
    role: '付款人',
    type: '企业',
    region: 'Singapore',
    status: '已批准',
    statusType: 'success',
    tags: ['Non Financial Institute', '201812345N', 'WL-1001'],
  },
];
</script>

<style scoped lang="scss">
.whitelist-result {
  display: grid;
  min-width: 0;
  gap: 18px;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  &__title {
    display: flex;
    align-items: baseline;
    gap: 18px;

    h2 {
      margin: 0;
      color: #071833;
      font-size: 24px;
      font-weight: 850;
      letter-spacing: 0;
    }

    span {
      color: #071833;
      font-size: 16px;
      font-weight: 750;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__mode {
    :deep(.el-radio-button__inner) {
      display: inline-flex;
      width: 46px;
      height: 46px;
      align-items: center;
      justify-content: center;
      padding: 0;
      color: #173151;
      border: 0;
      border-radius: 8px;
      box-shadow: none;
    }

    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: #08433d;
      background: #e7faf6;
      box-shadow: 0 -2px 0 #10aa9b inset;
    }
  }

  &__sort {
    width: 160px;

    :deep(.el-select__wrapper) {
      min-height: 46px;
      border-radius: 8px;
      box-shadow: 0 0 0 1px #cbd8e8 inset;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  &__table-card {
    min-width: 0;
    overflow: hidden;
    border-color: #dfe7ef;
    border-radius: 14px;
    box-shadow: 0 14px 36px rgb(16 30 54 / 6%);

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding-top: 18px;
    color: #071833;
    font-size: 16px;
    font-weight: 750;

    > .el-select {
      width: 126px;
    }

    :deep(.el-select__wrapper) {
      min-height: 42px;
      border-radius: 8px;
    }
  }

  @include narrow {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @include mobile {
    &__toolbar,
    &__actions,
    &__pagination {
      align-items: stretch;
      flex-direction: column;
    }

    &__grid {
      grid-template-columns: 1fr;
    }

    &__sort,
    &__pagination > .el-select {
      width: 100%;
    }

    &__table-card {
      overflow-x: auto;
    }
  }
}
</style>
