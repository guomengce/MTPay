<template>
  <section class="account-page">
    <header class="account-page__hero">
      <div class="account-page__line"></div>
      <div class="account-page__icon">
        <el-icon><CircleCheck /></el-icon>
      </div>
      <div>
        <h1>账户与安全</h1>
        <p>代理账户由MTPay后台直接建立</p>
      </div>
    </header>

    <div class="account-page__grid">
      <CompanyProfileCard />
      <LoginSecurityCard />
    </div>
  </section>
</template>

<script setup lang="ts">
import { CircleCheck } from '@element-plus/icons-vue';

import CompanyProfileCard from './components/CompanyProfileCard.vue';
import LoginSecurityCard from './components/LoginSecurityCard.vue';
</script>

<style scoped lang="scss">
.account-page {
  display: grid;
  min-width: 0;
  gap: 34px;
  padding: 42px 48px 36px;

  &__hero {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 28px;
  }

  &__line {
    width: 8px;
    height: 112px;
    flex: 0 0 8px;
    background: linear-gradient(180deg, #1767ff, #52c7ff);
    border-radius: 999px;
  }

  &__icon {
    display: inline-flex;
    width: 90px;
    height: 90px;
    flex: 0 0 90px;
    align-items: center;
    justify-content: center;
    color: #0b4fb4;
    background: #f2f6ff;
    border: 1px solid #dce7fb;
    border-radius: 50%;
    font-size: 46px;
  }

  h1 {
    margin: 0 0 12px;
    color: #071833;
    font-size: 50px;
    font-weight: 850;
    line-height: 1.08;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #344d70;
    font-size: 22px;
    font-weight: 650;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(440px, 1.05fr) minmax(420px, 0.95fr);
    gap: 34px;
  }

  @include narrow {
    padding: 34px 28px;

    &__grid {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    gap: 22px;
    padding: 22px 14px;

    &__hero {
      align-items: flex-start;
      gap: 16px;
    }

    &__line {
      height: 80px;
    }

    &__icon {
      width: 64px;
      height: 64px;
      flex-basis: 64px;
      font-size: 34px;
    }

    h1 {
      font-size: 32px;
    }

    p {
      font-size: 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
}
</style>
