<template>
  <section class="result-panel">
    <div v-loading="loading" class="result-panel__grid-wrap">
      <el-empty
        v-if="!loading && list.length === 0"
        :description="t('whitelist.empty')"
        :image-size="80"
      />
      <div v-else class="result-panel__grid">
        <EntryCard
          v-for="item in list"
          :key="item.id"
          :item="item"
          @view="emit('view', $event)"
          @supplement="emit('supplement', $event)"
          @edit="emit('edit', $event)"
          @toggle-status="emit('toggle-status', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>

    <div class="result-panel__pagination">
      <el-pagination
        class="app-pagination"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="limit"
        :current-page="page"
        background
        @current-change="handlePageChange"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 白名单结果面板
 * - 列表与分页由父级 useWhitelistList 注入，禁止组件内直接调用 request；
 * - 仅触发 view / supplement / page / limit 事件，回调由页面级 useWhitelistManagement 处理。
 */
import EntryCard from './EntryCard.vue';
import { useI18n } from 'vue-i18n';
import type { WhitelistItem } from '@/api/modules/whitelist';

defineProps<{
  list: WhitelistItem[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (event: 'view', item: WhitelistItem): void;
  (event: 'supplement', item: WhitelistItem): void;
  (event: 'edit', item: WhitelistItem): void;
  (event: 'toggle-status', item: WhitelistItem): void;
  (event: 'delete', item: WhitelistItem): void;
  (event: 'page', page: number): void;
  (event: 'limit', limit: number): void;
}>();
const { t } = useI18n();

function handlePageChange(nextPage: number) {
  emit('page', nextPage);
}

function handleLimitChange(nextLimit: number) {
  emit('limit', nextLimit);
}
</script>

<style scoped lang="scss">
.result-panel {
  display: grid;
  min-width: 0;
  gap: 18px;

  &__grid-wrap {
    min-height: 120px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;
    padding-top: 18px;
    color: #071833;
    font-size: 14px;
    font-weight: 600;

    > .el-select {
      width: 126px;
    }
  }

  @include narrow {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @include mobile {
    &__pagination {
      align-items: flex-end;
      flex-direction: column;
    }

    &__grid {
      grid-template-columns: 1fr;
    }

    &__pagination > .el-select {
      width: 100%;
    }
  }
}
</style>

