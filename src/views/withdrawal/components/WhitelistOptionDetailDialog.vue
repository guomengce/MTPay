<template>
  <AgentDialog
    :model-value="modelValue"
    class="whitelist-option-dialog"
    :title="cardTitle"
    width="min(560px, calc(100vw - 24px))"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div v-if="option" class="whitelist-option-dialog__header">
        <div class="whitelist-option-dialog__heading-row">
          <div class="whitelist-option-dialog__title"><i />{{ cardTitle }}</div>
          <IdentityBadge :role="option.role" :entity-type="option.entity_type" />
        </div>
        <div class="whitelist-option-dialog__number">
          <strong>{{ option.whitelist_no }}</strong>
        </div>
      </div>
    </template>
    <PartyCardBase
      v-if="option"
      :title="cardTitle"
      :fields="fields"
      :role="option.role"
      :entity-type="option.entity_type"
      :tone="option.role === 1 ? 'is-payer' : 'is-payee'"
      :show-copy="false"
      :show-header="false"
    />
  </AgentDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WithdrawalWhitelistOption } from '@/api/modules/withdrawal';
import AgentDialog from '@/components/common/AgentDialog.vue';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import { getCountryLabel } from '@/constants/countries';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';
import PartyCardBase from '../detail/components/PartyCardBase.vue';
import type { PartyField } from '@/components/party-info/fields';

const props = defineProps<{ modelValue: boolean; option: WithdrawalWhitelistOption | null }>();
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>();
const { t, locale } = useI18n();

const labels: Record<string, string> = {
  company_name: 'whitelist.companyName', company_type: 'whitelist.companyType', registration_country: 'whitelist.registrationCountry',
  operating_country: 'whitelist.operatingCountry', registration_date: 'whitelist.registrationDate', document_no: 'whitelist.documentNo',
  given_name: 'whitelist.givenName', surname: 'whitelist.surname', nationality: 'whitelist.nationality',
  residence_country: 'whitelist.residenceCountry', birth_date: 'whitelist.birthDate', document_type: 'whitelist.documentType',
  city: 'whitelist.city', address: 'whitelist.address', bank_name: 'whitelist.bankName', bank_account: 'whitelist.bankAccount',
  swift: 'whitelist.swift', intermediary_swift: 'whitelist.intermediarySwift', remittance_purpose: 'whitelist.remittancePurpose', remark: 'whitelist.remark',
};
const countryFields = new Set(['registration_country', 'operating_country', 'nationality', 'residence_country']);
const monoFields = new Set(['document_no', 'bank_account', 'swift', 'intermediary_swift']);

const cardTitle = computed(() => {
  if (!props.option) return '';
  if (props.option.role === 1) return t(props.option.entity_type === 1 ? 'withdrawal.payerCompany' : 'withdrawal.payerPerson');
  return t(props.option.entity_type === 1 ? 'withdrawal.payeeCompany' : 'withdrawal.payeePerson');
});

const fields = computed<PartyField[]>(() => {
  if (!props.option) return [];
  const businessFields = Object.entries(props.option.business_data ?? {}).map(([key, raw]) => {
  let value = raw == null || raw === '' ? '—' : String(raw);
  if (countryFields.has(key)) value = getCountryLabel(raw, locale.value);
  if (key === 'company_type') value = Number(raw) === 1 ? t('whitelist.nonFinancial') : Number(raw) === 2 ? t('whitelist.financial') : value;
  if (key === 'document_type') value = Number(raw) === 1 ? t('whitelist.identityDocument') : Number(raw) === 2 ? t('whitelist.passport') : value;
  if (key === 'remittance_purpose') value = getRemittancePurposeLabel(raw, t);
  const labelKey = key === 'document_no' && props.option?.role === 1 && props.option.entity_type === 1
    ? 'whitelist.companyNo'
    : labels[key];
    return { key, label: labelKey ? t(labelKey) : key, value, mono: monoFields.has(key) };
  });
  return businessFields;
});
</script>

<style lang="scss">
.whitelist-option-dialog.agent-dialog {
  --agent-dialog-accent: #087f79;
  --agent-dialog-soft: #e9f8f6;
  --agent-dialog-border: #bfe5e1;

  .el-dialog__header {
    padding: 18px 22px;
    background: linear-gradient(105deg, #fbfefe 0%, #f2faf9 100%);

    &::after {
      display: none;
    }
  }

  .whitelist-option-dialog__header {
    display: grid;
    min-width: 0;
    gap: 7px;
  }

  .whitelist-option-dialog__heading-row {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
  }

  .whitelist-option-dialog__title {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 10px;
    color: #17324f;
    font-size: 17px;
    font-weight: 700;

    i {
      width: 9px;
      height: 9px;
      flex: 0 0 9px;
      border-radius: 50%;
      background: #0aa49a;
      box-shadow: 0 0 0 4px rgb(10 164 154 / 10%);
    }
  }

  .whitelist-option-dialog__number {
    display: flex;
    align-items: baseline;
    padding-left: 19px;
    color: #718399;
    font-size: 11px;

    strong {
      color: #40566d;
      font-family: ui-monospace, Consolas, monospace;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .agent-dialog__icon {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
    border: 0;
    border-radius: 12px;
    font-size: 20px;
  }

  .el-dialog__body {
    padding: 20px 22px;
  }

  .party-card {
    border: 0;
    border-radius: 0;
    background: transparent;

    > header {
      border-radius: 11px;
    }
  }

  .party-card__fields {
    padding: 0px 8px 4px;
  }
}
</style>
