<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-button
        class="app-header__collapse"
        :icon="Fold"
        circle
        text
        @click="appStore.toggleSidebar"
      />
      <div>
        <h1>{{ pageTitle }}</h1>
        <p>掌握餘額、交易狀態與最新動態</p>
      </div>
    </div>

    <div class="app-header__right">
      <el-tag class="app-header__status" effect="plain" round>
        <span class="app-header__dot"></span>
        系統正常
      </el-tag>
      <el-button class="app-header__bell" :icon="Bell" circle text />
      <el-button class="app-header__admin" plain @click="goAdmin">
        管理後台
        <el-icon><TopRight /></el-icon>
      </el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bell, Fold, TopRight } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const pageTitle = computed(() => String(route.meta.title || '業務總覽'));

async function goAdmin() {
  await router.push('/dashboard');
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  height: 96px;
  min-height: 96px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 36px;
  background: rgb(255 255 255 / 92%);
  border-bottom: 1px solid #dce5ef;
  backdrop-filter: blur(16px);

  &__left,
  &__right {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 18px;
  }

  &__collapse {
    display: none;
  }

  h1 {
    margin: 0 0 8px;
    color: #071833;
    font-size: 24px;
    font-weight: 850;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #7c8ba0;
    font-weight: 600;
  }

  &__status {
    height: 42px;
    padding: 0 16px;
    color: #008f83;
    background: #f0fbf8;
    border-color: #cfe9e4;
    font-weight: 800;
  }

  &__dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 8px;
    background: #0aa39a;
    border-radius: 50%;
  }

  &__bell {
    color: #10213c;
    font-size: 20px;
  }

  &__admin {
    height: 42px;
    padding: 0 16px;
    border-color: #d8e1ec;
    border-radius: 8px;
    color: #14223a;
    font-weight: 800;
  }

  @include narrow {
    padding: 0 24px;
  }

  @include mobile {
    height: 72px;
    min-height: 72px;
    padding: 0 14px;

    &__collapse {
      display: inline-flex;
    }

    h1 {
      font-size: 18px;
    }

    p,
    &__status,
    &__bell {
      display: none;
    }

    &__admin {
      padding: 0 10px;
    }
  }
}
</style>
