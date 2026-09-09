<template>
  <PartyCardBase
    :title="t('withdrawal.payeePerson')"
    :fields="fields"
    :copy-fields="copyFields"
    :role="2"
    :entity-type="2"
    tone="is-payee"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WithdrawalPartySummary } from '@/api/modules/withdrawal';
import PartyCardBase from './PartyCardBase.vue';
import { buildPartyFields, PAYEE_BANK_KEYS, PAYEE_PERSON_KEYS } from './partyCardFields';
const props = defineProps<{ party: WithdrawalPartySummary }>();
const { t, locale } = useI18n();
const fields = computed(() => buildPartyFields(props.party, PAYEE_PERSON_KEYS, t, locale.value));
const copyFields = computed(() => [
  ...fields.value,
  ...buildPartyFields(props.party, PAYEE_BANK_KEYS, t, locale.value),
]);
</script>
