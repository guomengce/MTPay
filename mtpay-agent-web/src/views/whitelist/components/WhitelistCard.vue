<template>
  <el-card class="whitelist-card" shadow="never">
    <div class="whitelist-card__top">
      <span class="whitelist-card__avatar">{{ item.avatar }}</span>
      <el-tag :type="item.statusType" round>
        <span class="whitelist-card__dot"></span>
        {{ item.status }}
      </el-tag>
    </div>

    <h3>{{ item.name }}</h3>
    <p>{{ item.role }} · {{ item.type }} · {{ item.region }}</p>

    <div class="whitelist-card__tags">
      <el-tag v-for="tag in item.tags" :key="tag" round>{{ tag }}</el-tag>
    </div>

    <el-button plain>
      查看详情
      <el-icon><ArrowRight /></el-icon>
    </el-button>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';

export interface WhitelistItem {
  id: string;
  avatar: string;
  name: string;
  role: string;
  type: string;
  region: string;
  status: string;
  statusType: 'success' | 'warning';
  tags: string[];
}

defineProps<{
  item: WhitelistItem;
}>();
</script>

<style scoped lang="scss">
.whitelist-card {
  min-width: 0;
  border-color: #e1e8f1;
  border-radius: 14px;
  box-shadow: 0 14px 36px rgb(16 30 54 / 6%);

  :deep(.el-card__body) {
    min-height: 190px;
    padding: 22px;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  &__avatar {
    display: inline-flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    color: #1767ff;
    background: #ecf3ff;
    border-radius: 10px;
    font-size: 17px;
    font-weight: 850;
  }

  h3 {
    margin: 0 0 10px 58px;
    overflow: hidden;
    color: #071833;
    font-size: 16px;
    font-weight: 850;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 0 0 18px 58px;
    overflow: hidden;
    color: #6b7a90;
    font-size: 13px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 24px 58px;

    :deep(.el-tag) {
      max-width: 170px;
      overflow: hidden;
      color: #455770;
      background: #eef3f8;
      border-color: transparent;
      font-weight: 750;
      text-overflow: ellipsis;
      white-space: nowrap;
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

  :deep(.el-button) {
    height: 40px;
    margin-left: 0;
    border-radius: 8px;
    color: #071833;
    font-weight: 850;
  }
}
</style>
