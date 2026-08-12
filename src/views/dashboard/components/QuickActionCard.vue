<template>
  <div class="quick-action-card" tabindex="0" role="button">
    <div class="quick-action-card__icon">
      <el-icon><component :is="icon" /></el-icon>
    </div>
    <div class="quick-action-card__text">
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
    </div>
    <el-icon class="quick-action-card__arrow"><ArrowRight /></el-icon>
  </div>
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
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding: 18px 20px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgb(16 30 54 / 4%);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    border-color: rgb(16 170 164 / 35%);
    box-shadow: 0 14px 30px rgb(16 170 164 / 14%);
    outline: none;
  }

  &__icon {
    display: inline-flex;
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8faf7 0%, #d6f3f4 100%);
    color: #008f86;
    font-size: 22px;
  }

  &__text {
    display: grid;
    min-width: 0;
    flex: 1;
    gap: 4px;

    strong {
      overflow: hidden;
      color: #0d1a32;
      font-size: 15px;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      overflow: hidden;
      color: #75859a;
      font-size: 12px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__arrow {
    color: #0d1a32;
    font-size: 16px;
  }
}
</style>
