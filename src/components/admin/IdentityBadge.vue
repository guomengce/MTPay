<template>
  <StatusBadge :label="label" :type="getIdentityBadgeType(role, entityType)" />
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getIdentityBadgeType,
  type IdentityEntityType,
  type IdentityRole,
} from '@/utils/identityBadge';

const props = defineProps<{ role: IdentityRole; entityType: IdentityEntityType }>();
const { t } = useI18n();
const label = computed(() => {
  const payer = props.role === 1 || props.role === '付款人' || props.role === '付款方';
  const company = props.entityType === 1 || props.entityType === '公司';
  return `${t(payer ? 'identity.payer' : 'identity.payee')} · ${t(company ? 'identity.company' : 'identity.individual')}`;
});
</script>
