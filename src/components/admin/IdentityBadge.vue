<template>
  <StatusBadge :label="label" :type="getIdentityBadgeType(role, entityType)" />
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getIdentityBadgeType,
  isCompanyEntity,
  isPayerRole,
  type IdentityEntityType,
  type IdentityRole,
} from '@/utils/identityBadge';

const props = defineProps<{ role: IdentityRole; entityType: IdentityEntityType }>();
const { t } = useI18n();
const label = computed(() => {
  const payer = isPayerRole(props.role);
  const company = isCompanyEntity(props.entityType);
  return `${t(payer ? 'identity.payer' : 'identity.payee')} · ${t(company ? 'identity.company' : 'identity.individual')}`;
});
</script>
