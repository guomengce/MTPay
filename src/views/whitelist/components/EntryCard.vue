<template>
  <article class="entry-card">
    <header class="entry-card__header">
      <span class="entry-card__avatar">{{ item.avatar }}</span>
      <div class="entry-card__heading">
        <h3>{{ item.name }}</h3>
        <p>{{ item.role }} · {{ item.type }} · {{ item.region }}</p>
      </div>
    </header>

    <div class="entry-card__divider" aria-hidden="true" />

    <ul class="entry-card__info">
      <li v-for="(row, index) in infoRows" :key="index">
        <span class="entry-card__info-icon">
          <el-icon><component :is="row.icon" /></el-icon>
        </span>
        <span class="entry-card__info-label">{{ row.label }}</span>
        <span class="entry-card__info-value">{{ row.value }}</span>
      </li>
    </ul>

    <footer class="entry-card__footer">
      <button type="button" class="entry-card__detail">
        查看详情
        <el-icon><ArrowRight /></el-icon>
      </button>
      <StatusBadge
        :label="item.status"
        :type="item.statusBadge"
        :effect="isPending(item.status) ? 'pending' : undefined"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight, OfficeBuilding, Postcard, UserFilled } from '@element-plus/icons-vue';
import { computed } from 'vue';
import type { Component } from 'vue';

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

const props = defineProps<{
  item: EntryItem;
}>();

interface InfoRow {
  label: string;
  value: string;
  icon: Component;
}

const ICONS: Record<string, Component> = {
  bank: OfficeBuilding,
  account: Postcard,
  id: UserFilled,
};

const infoRows = computed<InfoRow[]>(() => [
  { label: '银行', value: props.item.tags[0] ?? '-', icon: ICONS.bank },
  { label: '账户/识别码', value: props.item.tags[1] ?? '-', icon: ICONS.account },
  { label: '白名单 ID', value: props.item.tags[2] ?? props.item.id, icon: ICONS.id },
]);

function isPending(status: string) {
  return /待审核|待处理|处理中/.test(status);
}
</script>

<style scoped lang="scss">
.entry-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 22px 24px;
  background: #ffffff;
  border: 1px solid #e1e8f1;
  border-radius: 14px;
  box-shadow: 0 14px 36px rgb(16 30 54 / 6%);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 44px rgb(16 30 54 / 10%);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__avatar {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #e8f3ff 0%, #d8e8ff 100%);
    color: #2878ff;
    font-size: 18px;
    font-weight: 800;
  }

  &__heading {
    display: grid;
    min-width: 0;
    flex: 1;
    gap: 4px;

    h3 {
      margin: 0;
      overflow: hidden;
      color: #0c2a5a;
      font-size: 16px;
      font-weight: 800;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      margin: 0;
      overflow: hidden;
      color: #6b7a90;
      font-size: 12px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__divider {
    position: relative;
    height: 14px;
    margin: 16px 0 8px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      content: '';
      background: linear-gradient(90deg, transparent 0%, #c8d9e7 22%, #c8d9e7 78%, transparent 100%);
      transform: translateY(-50%);
    }
  }

  &__info {
    display: grid;
    gap: 12px;
    margin: 0 0 18px;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      align-items: center;
      grid-template-columns: 28px 88px 1fr;
      gap: 10px;
    }
  }

  &__info-icon {
    display: inline-flex;
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
    font-size: 14px;
  }

  &__info-label {
    color: #6b7a90;
    font-size: 13px;
    font-weight: 600;
  }

  &__info-value {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    padding: 6px 10px;
    background: #eef3f8;
    border-radius: 8px;
    color: #0c2a5a;
    font-size: 12px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
  }

  &__detail {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #c8d9e7;
    border-radius: 8px;
    color: #2878ff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    .el-icon {
      font-size: 14px;
    }

    &:hover {
      background: #2878ff;
      border-color: #2878ff;
      color: #ffffff;
    }
  }

  @include mobile {
    padding: 18px 20px;

    &__info li {
      grid-template-columns: 24px 80px 1fr;
      gap: 8px;
    }

    &__info-icon {
      width: 24px;
      height: 24px;
      flex: 0 0 24px;
      font-size: 12px;
    }
  }
}
</style>
