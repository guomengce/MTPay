<template>
  <section class="account-page">
    <AdminHero title="账户与安全" description="查看代理资料，管理登录密码与当前会话" icon="ri-shield-user-line" />

    <div class="account-page__grid">
      <CompanyProfileCard :profile="profile" />
      <LoginSecurityCard
        :profile="profile"
        @change-password="passwordDialogVisible = true"
      />
    </div>

    <ChangePasswordDialog
      v-model="passwordDialogVisible"
      :submitting="submitting"
      @submit="changePassword"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminHero from '@/components/admin/AdminHero.vue';
import { usePageLoading } from '@/composables/usePageLoading';
import ChangePasswordDialog from './components/ChangePasswordDialog.vue';
import CompanyProfileCard from './components/CompanyProfileCard.vue';
import LoginSecurityCard from './components/LoginSecurityCard.vue';
import { useAccount } from './composables/useAccount';

const passwordDialogVisible = ref(false);
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
