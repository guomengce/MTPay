<template>
  <el-card class="quick-action-card" shadow="never">
    <div class="quick-action-card__icon">
      <el-icon><component :is="icon" /></el-icon>
    </div>
    <div class="quick-action-card__text">
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
    </div>
    <el-icon class="quick-action-card__arrow"><ArrowRight /></el-icon>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  title: string;
  description: string;
}>();
</script>

<style scoped lang="scss">
.quick-action-card {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  :deep(.el-card__body) {
    display: flex;
    min-height: 104px;
    align-items: center;
    gap: 18px;
    padding: 20px 22px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgb(16 30 54 / 8%);
  }

  &__icon {
    display: inline-flex;
    width: 58px;
    height: 58px;
    flex: 0 0 58px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #008f83;
    background: #edf9f6;
    font-size: 34px;
  }

  &__text {
    display: grid;
    min-width: 0;
    flex: 1;
    gap: 8px;

    strong {
      overflow: hidden;
      color: #0d1a32;
      font-size: 17px;
      font-weight: 850;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      overflow: hidden;
      color: #748297;
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__arrow {
    color: #071833;
    font-size: 18px;
  }
}
</style>
