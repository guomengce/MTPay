<template>
  <section class="account-page">
    <AdminHero :title="t('account.title')" icon="ri-shield-user-line" />

    <div class="account-page__grid">
      <CompanyProfileCard :profile="profile" />
      <LoginSecurityCard :submitting="submitting" @submit="changePassword" />
    </div>

    <TwoFactorCard />

  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AdminHero from '@/components/admin/AdminHero.vue';
import { usePageLoading } from '@/composables/usePageLoading';
import CompanyProfileCard from './components/CompanyProfileCard.vue';
import LoginSecurityCard from './components/LoginSecurityCard.vue';
import TwoFactorCard from './components/TwoFactorCard.vue';
import { useAccount } from './composables/useAccount';

const { t } = useI18n();
const { loading, submitting, profile, fetchProfile, changePassword } = useAccount();
usePageLoading(loading);

onMounted(fetchProfile);
</script>

<style scoped lang="scss">
.account-page {
  display: grid;
  min-width: 0;
  gap: 24px;

  &__grid {
    display: grid;
    align-items: stretch;
    grid-template-columns: minmax(460px, 1.12fr) minmax(390px, 0.88fr);
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
