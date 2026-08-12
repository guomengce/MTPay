<template>
  <section class="account-page">
    <AdminHero title="账户与安全" description="代理账户由MTPay后台直接建立" icon="ri-shield-user-line">
    </AdminHero>

    <div class="account-page__grid">
      <CompanyProfileCard />
      <LoginSecurityCard />
    </div>
  </section>
</template>

<script setup lang="ts">
import AdminHero from '@/components/admin/AdminHero.vue';
import CompanyProfileCard from './components/CompanyProfileCard.vue';
import LoginSecurityCard from './components/LoginSecurityCard.vue';
</script>

<style scoped lang="scss">
.account-page {
  display: grid;
  min-width: 0;
  gap: 24px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(440px, 1.05fr) minmax(420px, 0.95fr);
    gap: 24px;
  }

  @include narrow {
    &__grid {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    gap: 18px;

    &__grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
}
</style>
