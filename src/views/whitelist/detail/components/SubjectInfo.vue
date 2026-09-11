<template>
    <div class="wl-groups">
      <CompanyInfoCard
        v-if="detail.entity_type === 1"
        :data="detail.business_data"
        :role="detail.role"
        :show-copy="false"
      /><IndividualInfoCard
        v-else
        :data="detail.business_data"
        :role="detail.role"
        :show-copy="false"
      /><BankInfoCard v-if="detail.role === 2" :data="detail.business_data" :show-copy="false" />
    </div>
</template>
<script setup lang="ts">
import type { WhitelistItemDetail } from '@/api/modules/whitelist';
import CompanyInfoCard from '@/components/party-info/CompanyInfoCard.vue';
import IndividualInfoCard from '@/components/party-info/IndividualInfoCard.vue';
import BankInfoCard from '@/components/party-info/BankInfoCard.vue';
defineProps<{ detail: WhitelistItemDetail }>();
</script>
<style scoped>
.wl-groups > :deep(.party-card) {
  box-sizing: border-box;
  flex: 0 1 520px;
  width: 520px;
  max-width: 100%;
}
</style>
