<template>
  <el-table :data="items" class="record-list">
    <el-table-column label="名称" min-width="220">
      <template #default="{ row }">
        <div class="record-list__name">
          <span>{{ row.avatar }}</span>
          <div>
            <strong>{{ row.name }}</strong>
            <p>{{ row.role }} · {{ row.type }} · {{ row.region }}</p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="资料" min-width="320">
      <template #default="{ row }">
        <div class="record-list__tags">
          <StatusBadge
            v-for="tag in row.tags"
            :key="tag"
            :label="tag"
            type="gray"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="120">
      <template #default="{ row }">
        <StatusBadge
          :label="row.status"
          :type="row.statusBadge"
          :effect="isPending(row.status) ? 'pending' : undefined"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" align="right">
      <template #default>
        <el-button plain>详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import StatusBadge, {
  type StatusBadgeType,
} from '@/components/admin/StatusBadge.vue';

export interface EntryItem {
  id: string;
  avatar: string;
  name: string;
  role: string;
  type: string;
  region: string;
  status: string;
  statusBadge: StatusBadgeType;
  tags: string[];
}

defineProps<{
  items: EntryItem[];
}>();

function isPending(status: string) {
  return /待审核|待处理|处理中/.test(status);
}
</script>

<style scoped lang="scss">
.record-list {
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

  &__name {
    display: flex;
    align-items: center;
    gap: 12px;

    > span {
      display: inline-flex;
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      align-items: center;
      justify-content: center;
      color: #1767ff;
      background: #ecf3ff;
      border-radius: 9px;
      font-weight: 850;
    }

    div {
      display: grid;
      min-width: 0;
      gap: 5px;
    }

    strong,
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    strong {
      color: #071833;
      font-weight: 850;
    }

    p {
      margin: 0;
      color: #6b7a90;
      font-size: 13px;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.el-button) {
    border-radius: 8px;
    font-weight: 850;
  }
}
</style>
